import { createHash } from 'node:crypto';
import { and, asc, desc, eq, inArray, isNotNull, isNull, ne, or, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { getDb, schema } from '@/db/client';
import type { DbOrTx } from '@/db/client';
import type { KnowledgeSourceType } from '@/db/schema';
import type { RequestContext } from '@/lib/auth/context';
import { assertBrandAccess, assertCan } from '@/lib/auth/context';
import { detectLang, normaliseWhitespace } from '@/lib/documents/chunk';
import { getEmbeddingProvider, getEmbeddingProviderWithin, toVectorLiteral } from '@/lib/embeddings';

const kc = schema.knowledgeChunks;

export type Trust = 'approved' | 'unverified' | 'restricted';

export type KnowledgePassage = {
  content: string;
  title?: string;
  locator?: string | null;
  pageNumber?: number | null;
};

export type KnowledgeSource = {
  organisationId: string;
  brandId: string;
  productId?: string | null;
  sourceType: KnowledgeSourceType;
  sourceId: string;
  assetId?: string | null;
  title: string;
  trust: Trust;
  passages: KnowledgePassage[];
};

/**
 * Replace everything the knowledge base holds for one source (a document, a claim, a product…).
 * Called inside the same transaction as the change to the source, so search never shows stale text.
 */
export async function replaceKnowledgeForSource(db: DbOrTx, source: KnowledgeSource): Promise<number> {
  await db.delete(kc).where(and(eq(kc.sourceType, source.sourceType), eq(kc.sourceId, source.sourceId)));
  const rows = source.passages
    .map((p, index) => ({ ...p, content: normaliseWhitespace(p.content), index }))
    .filter((p) => p.content.length > 0);
  if (!rows.length) return 0;

  // Insert in modest batches so very large documents do not build one enormous statement.
  for (let i = 0; i < rows.length; i += 100) {
    await db.insert(kc).values(
      rows.slice(i, i + 100).map((p) => {
        const title = p.title ?? source.title;
        const lang = detectLang(p.content);
        return {
          organisationId: source.organisationId,
          brandId: source.brandId,
          productId: source.productId ?? null,
          sourceType: source.sourceType,
          sourceId: source.sourceId,
          assetId: source.assetId ?? null,
          chunkIndex: p.index,
          title,
          locator: p.locator ?? null,
          pageNumber: p.pageNumber ?? null,
          content: p.content,
          contentHash: createHash('sha256').update(p.content).digest('hex'),
          trust: source.trust,
          lang,
          tsv: sql`setweight(to_tsvector(${lang}::regconfig, ${title}), 'A') || setweight(to_tsvector(${lang}::regconfig, ${p.content}), 'B') || to_tsvector('simple', ${title + ' ' + p.content})`,
        };
      }),
    );
  }
  return rows.length;
}

export async function removeKnowledgeForSource(db: DbOrTx, sourceType: KnowledgeSourceType, sourceId: string): Promise<void> {
  await db.delete(kc).where(and(eq(kc.sourceType, sourceType), eq(kc.sourceId, sourceId)));
}

export async function setKnowledgeTrustForSource(db: DbOrTx, sourceType: KnowledgeSourceType, sourceId: string, trust: Trust): Promise<void> {
  await db.update(kc).set({ trust }).where(and(eq(kc.sourceType, sourceType), eq(kc.sourceId, sourceId)));
}

/** Compute embeddings for passages that do not have one yet. Returns how many were embedded. */
export async function embedPendingChunks(organisationId?: string, maxChunks = 2000): Promise<{ embedded: number; available: boolean }> {
  const provider = await getEmbeddingProvider();
  if (!provider) return { embedded: 0, available: false };
  const db = await getDb();
  let embedded = 0;
  while (embedded < maxChunks) {
    const pending = await db
      .select({ id: kc.id, title: kc.title, content: kc.content })
      .from(kc)
      .where(
        and(
          organisationId ? eq(kc.organisationId, organisationId) : undefined,
          or(isNull(kc.embedding), ne(kc.embeddingModel, provider.model)),
        ),
      )
      .orderBy(asc(kc.createdAt))
      .limit(32);
    if (!pending.length) break;
    const vectors = await provider.embedPassages(pending.map((p) => `${p.title}\n${p.content}`));
    for (let i = 0; i < pending.length; i++) {
      await db.update(kc).set({ embedding: vectors[i], embeddingModel: provider.model }).where(eq(kc.id, pending[i].id));
    }
    embedded += pending.length;
  }
  return { embedded, available: true };
}

export type SearchFilters = {
  query: string;
  brandId?: string | null;
  productId?: string | null;
  trust?: Trust[];
  sourceTypes?: KnowledgeSourceType[];
  limit?: number;
};

export type SearchResult = {
  id: string;
  brandId: string;
  productId: string | null;
  sourceType: KnowledgeSourceType;
  sourceId: string;
  assetId: string | null;
  title: string;
  locator: string | null;
  /** Passage with [[ ]] around matched words (keyword matches) — the caller escapes HTML before rendering. */
  snippet: string;
  content: string;
  trust: Trust;
  match: 'keyword' | 'meaning' | 'both';
  /** Calculated relevance used only for ordering; not a probability. */
  score: number;
};

export type SearchResponse = {
  results: SearchResult[];
  mode: 'keyword_and_meaning' | 'keyword_only';
  modeNote: string | null;
  total: number;
};

/** Minimum cosine similarity for a passage found ONLY by meaning to be shown (calibrated for the E5 model family). */
const SEMANTIC_MIN_SIMILARITY = Number(process.env.SEMANTIC_MIN_SIMILARITY || 0.84);
const RRF_K = 60;

export async function searchKnowledge(ctx: RequestContext, filters: SearchFilters): Promise<SearchResponse> {
  assertCan(ctx, 'brand.view');
  const query = filters.query.trim().slice(0, 400);
  const limit = Math.min(Math.max(filters.limit ?? 12, 1), 50);
  if (!query) return { results: [], mode: 'keyword_only', modeNote: null, total: 0 };
  if (filters.brandId) assertBrandAccess(ctx, filters.brandId);
  if (ctx.membership.brandIds !== null && ctx.membership.brandIds.length === 0) {
    return { results: [], mode: 'keyword_only', modeNote: null, total: 0 };
  }

  const db = await getDb();
  const scope: (SQL | undefined)[] = [
    eq(kc.organisationId, ctx.organisation.id),
    filters.brandId ? eq(kc.brandId, filters.brandId) : undefined,
    ctx.membership.brandIds !== null ? inArray(kc.brandId, ctx.membership.brandIds) : undefined,
    filters.productId ? eq(kc.productId, filters.productId) : undefined,
    filters.trust?.length ? inArray(kc.trust, filters.trust) : undefined,
    filters.sourceTypes?.length ? inArray(kc.sourceType, filters.sourceTypes) : undefined,
  ];

  const tsq = sql`(websearch_to_tsquery('english', ${query}) || websearch_to_tsquery('arabic', ${query}) || websearch_to_tsquery('simple', ${query}))`;
  const keywordRank = sql<number>`ts_rank_cd(${kc.tsv}, ${tsq})`;
  const keywordRows = await db
    .select({
      id: kc.id,
      rank: keywordRank,
      snippet: sql<string>`ts_headline('simple', ${kc.content}, ${tsq}, 'MaxWords=45, MinWords=18, MaxFragments=2, FragmentDelimiter=" … ", StartSel="[[", StopSel="]]"')`,
    })
    .from(kc)
    .where(and(...scope, sql`${kc.tsv} @@ ${tsq}`))
    .orderBy(desc(keywordRank))
    .limit(40);

  const { provider, stillLoading } = await getEmbeddingProviderWithin(4000);
  let meaningRows: { id: string; similarity: number }[] = [];
  let modeNote: string | null = null;
  if (provider) {
    const vector = toVectorLiteral(await provider.embedQuery(query));
    const distance = sql<number>`${kc.embedding} <=> ${vector}::vector`;
    const rows = await db
      .select({ id: kc.id, distance })
      .from(kc)
      .where(and(...scope, isNotNull(kc.embedding), eq(kc.embeddingModel, provider.model)))
      .orderBy(distance)
      .limit(40);
    meaningRows = rows.map((r) => ({ id: r.id, similarity: 1 - Number(r.distance) }));
  } else if (stillLoading) {
    modeNote = 'Meaning-based search is still starting up (the first use downloads a language model). Showing keyword matches for now — search again in a minute.';
  } else {
    modeNote = 'Showing keyword matches only — the meaning-based search model is not available on this server.';
  }

  // Reciprocal Rank Fusion: a passage ranks high if either method ranks it high; higher still if both do.
  const fused = new Map<string, { score: number; keyword: boolean; meaning: boolean; snippet?: string }>();
  keywordRows.forEach((r, i) => {
    fused.set(r.id, { score: 1 / (RRF_K + i + 1), keyword: true, meaning: false, snippet: r.snippet });
  });
  meaningRows.forEach((r, i) => {
    const existing = fused.get(r.id);
    if (existing) {
      existing.score += 1 / (RRF_K + i + 1);
      existing.meaning = true;
    } else if (r.similarity >= SEMANTIC_MIN_SIMILARITY) {
      fused.set(r.id, { score: 1 / (RRF_K + i + 1), keyword: false, meaning: true });
    }
  });

  const ordered = [...fused.entries()].sort((a, b) => b[1].score - a[1].score);
  const top = ordered.slice(0, limit);
  if (!top.length) {
    return { results: [], mode: provider ? 'keyword_and_meaning' : 'keyword_only', modeNote, total: 0 };
  }
  const rows = await db
    .select()
    .from(kc)
    .where(inArray(kc.id, top.map(([id]) => id)));
  const byId = new Map(rows.map((r) => [r.id, r]));

  const results: SearchResult[] = [];
  for (const [id, info] of top) {
    const row = byId.get(id);
    if (!row) continue;
    results.push({
      id,
      brandId: row.brandId,
      productId: row.productId,
      sourceType: row.sourceType,
      sourceId: row.sourceId,
      assetId: row.assetId,
      title: row.title,
      locator: row.locator,
      snippet: info.snippet ?? (row.content.length > 320 ? row.content.slice(0, 320).trimEnd() + '…' : row.content),
      content: row.content,
      trust: row.trust,
      match: info.keyword && info.meaning ? 'both' : info.keyword ? 'keyword' : 'meaning',
      score: Math.round(info.score * 100000) / 100000,
    });
  }
  return { results, mode: provider ? 'keyword_and_meaning' : 'keyword_only', modeNote, total: ordered.length };
}

export async function knowledgeStats(ctx: RequestContext, brandId?: string) {
  assertCan(ctx, 'brand.view');
  if (brandId) assertBrandAccess(ctx, brandId);
  const db = await getDb();
  const rows = await db
    .select({
      sourceType: kc.sourceType,
      trust: kc.trust,
      passages: sql<number>`count(*)::int`,
      embedded: sql<number>`count(${kc.embedding})::int`,
    })
    .from(kc)
    .where(
      and(
        eq(kc.organisationId, ctx.organisation.id),
        brandId ? eq(kc.brandId, brandId) : undefined,
        ctx.membership.brandIds !== null
          ? ctx.membership.brandIds.length
            ? inArray(kc.brandId, ctx.membership.brandIds)
            : sql`false`
          : undefined,
      ),
    )
    .groupBy(kc.sourceType, kc.trust);
  const total = rows.reduce((n, r) => n + r.passages, 0);
  const embedded = rows.reduce((n, r) => n + r.embedded, 0);
  return { total, embedded, breakdown: rows };
}
