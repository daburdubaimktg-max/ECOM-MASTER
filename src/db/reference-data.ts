import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { and, eq, isNull, max, notInArray, sql } from 'drizzle-orm';
import { ROLES } from '@/lib/auth/permissions';
import { PRIORITY_FRAMEWORK_VERSION, PRIORITY_WEIGHTS, rankPlatforms } from '@/lib/marketplace-priority';
import { slugify } from '@/lib/text';
import type { Db } from './client';
import { countryFileSchema, requirementFileSchema } from './research-schema';
import * as s from './schema';

/**
 * Loads the reference data that ships with the code:
 *   - the six roles
 *   - the launch countries
 *   - default scoring configurations (versioned)
 *   - researched marketplaces  (data/research/marketplaces/<COUNTRY>.json)
 *   - marketplace requirement libraries (data/research/requirements/<retailer>.json)
 *
 * It is safe to run any number of times: each data file is loaded once (tracked by its checksum),
 * and loading a changed file creates new history rather than overwriting the old research.
 */

/** Where the research data files live. Tests point this at an empty folder so they start from a clean slate. */
export function researchDir(): string {
  const override = process.env.BIE_RESEARCH_DIR?.trim();
  return override ? path.resolve(/* turbopackIgnore: true */ override) : path.join(process.cwd(), 'data', 'research');
}

const COUNTRIES: (typeof s.countries.$inferInsert)[] = [
  { code: 'AE', name: 'United Arab Emirates', region: 'Middle East', currencyCode: 'AED', languages: ['ar', 'en'], isInitialMarket: true },
  { code: 'SA', name: 'Saudi Arabia', region: 'Middle East', currencyCode: 'SAR', languages: ['ar', 'en'], isInitialMarket: true },
  { code: 'ZA', name: 'South Africa', region: 'Sub-Saharan Africa', currencyCode: 'ZAR', languages: ['en'], isInitialMarket: true },
  { code: 'US', name: 'United States', region: 'North America', currencyCode: 'USD', languages: ['en', 'es'], isInitialMarket: true },
  { code: 'GB', name: 'United Kingdom', region: 'Europe', currencyCode: 'GBP', languages: ['en'], isInitialMarket: true },
  { code: 'IN', name: 'India', region: 'South Asia', currencyCode: 'INR', languages: ['en', 'hi'], isInitialMarket: true },
  { code: 'KE', name: 'Kenya', region: 'Sub-Saharan Africa', currencyCode: 'KES', languages: ['en', 'sw'], isInitialMarket: true },
  { code: 'NG', name: 'Nigeria', region: 'Sub-Saharan Africa', currencyCode: 'NGN', languages: ['en'], isInitialMarket: true },
  { code: 'MY', name: 'Malaysia', region: 'Southeast Asia', currencyCode: 'MYR', languages: ['ms', 'en'], isInitialMarket: true },
];

/** Proposed internal Listing Quality Score weights (specification 6.4 B). Not official retailer weightings. */
export const DEFAULT_LQS_WEIGHTS = {
  title_quality: 10,
  description_quality: 10,
  bullet_points: 10,
  attribute_completeness: 15,
  main_hero_image: 15,
  secondary_images: 10,
  enhanced_content: 10,
  seo_discoverability: 10,
  ratings_reviews: 5,
  qa_completeness: 5,
} as const;

const DEFAULT_REVIEW_THEMES: { key: string; label: string; description: string }[] = [
  { key: 'efficacy', label: 'Product efficacy', description: 'Whether the product delivers its promised result.' },
  { key: 'hair_performance', label: 'Hair performance', description: 'Effects on hair: growth, fall, shine, softness, frizz.' },
  { key: 'skin_performance', label: 'Skin performance', description: 'Effects on skin: hydration, irritation, breakouts, tone.' },
  { key: 'fragrance', label: 'Fragrance', description: 'Scent strength and pleasantness.' },
  { key: 'texture', label: 'Texture', description: 'Consistency, greasiness, absorption, feel.' },
  { key: 'packaging', label: 'Packaging', description: 'Bottle, cap, pump, leakage, damage.' },
  { key: 'quantity', label: 'Quantity', description: 'Size received versus expectation.' },
  { key: 'ease_of_application', label: 'Ease of application', description: 'How easy the product is to use.' },
  { key: 'value_for_money', label: 'Value for money', description: 'Price relative to perceived benefit.' },
  { key: 'ingredients', label: 'Ingredients', description: 'Comments on ingredients, naturalness, allergens.' },
  { key: 'authenticity', label: 'Product authenticity', description: 'Suspected counterfeit, expired or tampered stock.' },
  { key: 'delivery_experience', label: 'Delivery experience', description: 'Shipping speed, courier, condition on arrival — a fulfilment issue, not a product issue.' },
];

/**
 * Maps a platform to the retailer "family" whose requirements library applies to it (the library file
 * name). `countries` limits a mapping to the markets that library was researched for — "Boots UAE" must
 * not inherit the UK Boots rules.
 */
const FAMILY_PATTERNS: { pattern: RegExp; key: string; countries?: string[] }[] = [
  { pattern: /^amazon\b/i, key: 'amazon' },
  { pattern: /^noon\b(?!\s+minutes)/i, key: 'noon', countries: ['AE', 'SA'] },
  { pattern: /^walmart\b/i, key: 'walmart', countries: ['US'] },
  { pattern: /^takealot\b/i, key: 'takealot', countries: ['ZA'] },
  { pattern: /^jumia\b/i, key: 'jumia', countries: ['NG', 'KE'] },
  { pattern: /^flipkart\b/i, key: 'flipkart', countries: ['IN'] },
  { pattern: /^shopee\b/i, key: 'shopee', countries: ['MY'] },
  { pattern: /^lazada\b/i, key: 'lazada', countries: ['MY'] },
  { pattern: /^tiktok shop\b/i, key: 'tiktok-shop' },
  { pattern: /^nykaa\b/i, key: 'nykaa', countries: ['IN'] },
  { pattern: /^boots\b/i, key: 'boots', countries: ['GB'] },
  { pattern: /^superdrug\b/i, key: 'superdrug', countries: ['GB'] },
  { pattern: /^tesco\b/i, key: 'tesco', countries: ['GB'] },
  { pattern: /^target\b/i, key: 'target', countries: ['US'] },
  { pattern: /^ulta\b/i, key: 'ulta', countries: ['US'] },
  { pattern: /^nahdi\b/i, key: 'nahdi', countries: ['SA'] },
  { pattern: /^clicks\b/i, key: 'clicks', countries: ['ZA'] },
  { pattern: /^dis-?chem\b/i, key: 'dis-chem', countries: ['ZA'] },
  { pattern: /^carrefour\b/i, key: 'carrefour-uae', countries: ['AE'] },
  { pattern: /^watsons\b/i, key: 'watsons-my', countries: ['MY'] },
];

export function familyKeyFor(name: string, countryCode: string): string | null {
  const trimmed = name.trim();
  for (const entry of FAMILY_PATTERNS) {
    if (entry.pattern.test(trimmed) && (!entry.countries || entry.countries.includes(countryCode))) return entry.key;
  }
  return null;
}

/**
 * Tidies a researched platform name for display: "Boots (boots.com)" becomes "Boots". Brackets that
 * carry real information ("TikTok Shop (UK)", "Noon (incl. Noon Minutes)") are kept.
 */
export function displayPlatformName(name: string): string {
  return name.trim().replace(/\s*\((?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+\)\s*$/i, '').trim() || name.trim();
}

function sha256File(file: string): string {
  return createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function listJson(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => path.join(dir, f));
}

export type ReferenceLoadReport = {
  marketplaceFilesLoaded: string[];
  requirementFilesLoaded: string[];
  /** Whole files that could not be loaded. */
  skipped: { file: string; reason: string }[];
  /** Individual records inside a loaded file that were malformed and left out. */
  warnings: string[];
};

export async function ensureReferenceData(db: Db, dir: string = researchDir()): Promise<ReferenceLoadReport> {
  const report: ReferenceLoadReport = { marketplaceFilesLoaded: [], requirementFilesLoaded: [], skipped: [], warnings: [] };

  // Roles — kept in sync with the permission definitions in code.
  for (const [key, def] of Object.entries(ROLES)) {
    await db
      .insert(s.roles)
      .values({ key, name: def.name, description: def.description, rank: def.rank, isExternal: def.isExternal })
      .onConflictDoUpdate({
        target: s.roles.key,
        set: { name: def.name, description: def.description, rank: def.rank, isExternal: def.isExternal },
      });
  }

  for (const c of COUNTRIES) {
    await db
      .insert(s.countries)
      .values(c)
      .onConflictDoUpdate({
        target: s.countries.code,
        set: { name: c.name, region: c.region, currencyCode: c.currencyCode, languages: c.languages, isInitialMarket: c.isInitialMarket },
      });
  }

  // Versioned scoring configurations (system defaults).
  const existingRules = await db
    .select({ scoreType: s.scoringRules.scoreType, version: s.scoringRules.version })
    .from(s.scoringRules)
    .where(isNull(s.scoringRules.organisationId));
  const hasRule = (type: string, version: number) => existingRules.some((r) => r.scoreType === type && r.version === version);
  if (!hasRule('marketplace_priority', PRIORITY_FRAMEWORK_VERSION)) {
    await db.insert(s.scoringRules).values({
      name: 'Marketplace priority framework',
      scoreType: 'marketplace_priority',
      version: PRIORITY_FRAMEWORK_VERSION,
      status: 'active',
      weights: PRIORITY_WEIGHTS,
      notes: 'Weighted sum of five 1–5 criterion scores. Internal judgement, not a market-share measure.',
    });
  }
  if (!hasRule('internal_lqs', 1)) {
    await db.insert(s.scoringRules).values({
      name: 'Internal Listing Quality Score — default',
      scoreType: 'internal_lqs',
      version: 1,
      status: 'active',
      weights: DEFAULT_LQS_WEIGHTS,
      notes: 'Proposed internal weights from the product specification. These are NOT official retailer weightings.',
    });
  }

  const themeCount = await db.select({ n: sql<number>`count(*)::int` }).from(s.reviewThemes).where(isNull(s.reviewThemes.organisationId));
  if ((themeCount[0]?.n ?? 0) === 0) {
    await db.insert(s.reviewThemes).values(DEFAULT_REVIEW_THEMES.map((t) => ({ ...t, categoryScope: 'beauty_fmcg' })));
  }

  for (const file of listJson(path.join(dir, 'marketplaces'))) {
    try {
      const loaded = await loadCountryFile(db, file, report.warnings);
      if (loaded) report.marketplaceFilesLoaded.push(path.basename(file));
    } catch (err) {
      report.skipped.push({ file: path.basename(file), reason: err instanceof Error ? err.message : String(err) });
    }
  }

  for (const file of listJson(path.join(dir, 'requirements'))) {
    try {
      const loaded = await loadRequirementFile(db, file, report.warnings);
      if (loaded) report.requirementFilesLoaded.push(path.basename(file));
    } catch (err) {
      report.skipped.push({ file: path.basename(file), reason: err instanceof Error ? err.message : String(err) });
    }
  }

  // Keep each platform's link to its requirements library in step with the mapping above.
  const referencePlatforms = await db
    .select({ id: s.marketplaces.id, name: s.marketplaces.name, countryCode: s.marketplaces.countryCode, familyKey: s.marketplaces.familyKey })
    .from(s.marketplaces)
    .where(isNull(s.marketplaces.organisationId));
  for (const platform of referencePlatforms) {
    const expected = familyKeyFor(platform.name, platform.countryCode);
    if (expected !== platform.familyKey) {
      await db.update(s.marketplaces).set({ familyKey: expected }).where(eq(s.marketplaces.id, platform.id));
    }
  }

  if ((report.skipped.length || report.warnings.length) && process.env.NODE_ENV !== 'test') {
    console.warn('[reference-data] problems while loading research files:', { skipped: report.skipped, warnings: report.warnings });
  }
  return report;
}

async function alreadyImported(db: Db, kind: 'marketplaces' | 'requirements', sha: string): Promise<boolean> {
  const rows = await db
    .select({ id: s.researchImports.id })
    .from(s.researchImports)
    .where(and(eq(s.researchImports.kind, kind), eq(s.researchImports.sha256, sha)))
    .limit(1);
  return rows.length > 0;
}

function countDropped(raw: unknown, kept: number, what: string, file: string, warnings: string[]): void {
  const original = Array.isArray(raw) ? raw.length : 0;
  if (original > kept) warnings.push(`${path.basename(file)}: ${original - kept} malformed ${what} left out`);
}

export async function loadCountryFile(db: Db, file: string, warnings: string[] = []): Promise<boolean> {
  const sha = sha256File(file);
  if (await alreadyImported(db, 'marketplaces', sha)) return false;

  const rawFile = JSON.parse(fs.readFileSync(file, 'utf8'));
  const parsed = countryFileSchema.safeParse(rawFile);
  if (!parsed.success) {
    throw new Error(`invalid marketplace research file: ${parsed.error.issues.slice(0, 3).map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
  }
  const data = parsed.data;
  countDropped(rawFile?.platforms, data.platforms.length, 'platform record(s)', file, warnings);

  const knownCountry = await db.select({ code: s.countries.code }).from(s.countries).where(eq(s.countries.code, data.country_code)).limit(1);
  if (!knownCountry.length) {
    await db.insert(s.countries).values({ code: data.country_code, name: data.country_name, region: data.region, isInitialMarket: false });
  }

  // De-duplicate by slug, then rank with the published formula (the file's own rank is not trusted).
  const bySlug = new Map<string, (typeof data.platforms)[number]>();
  for (const original of data.platforms) {
    const p = { ...original, name: displayPlatformName(original.name) };
    const slug = slugify(p.name);
    if (!bySlug.has(slug)) bySlug.set(slug, p);
  }
  const ranked = rankPlatforms([...bySlug.entries()].map(([slug, p]) => ({ key: slug, scores: p.priority_scores })));
  const rankBySlug = new Map(ranked.map((r) => [r.key, r]));

  await db.transaction(async (tx) => {
    const [imp] = await tx
      .insert(s.researchImports)
      .values({ kind: 'marketplaces', path: path.relative(process.cwd(), file), sha256: sha, researchDate: data.research_date, recordCount: bySlug.size })
      .returning({ id: s.researchImports.id });

    await tx.update(s.countryResearch).set({ isCurrent: false }).where(eq(s.countryResearch.countryCode, data.country_code));
    await tx.insert(s.countryResearch).values({
      countryCode: data.country_code,
      researchDate: data.research_date,
      summary: data.market_context.summary,
      keyFacts: data.market_context.key_facts,
      rankingMethodNote: data.ranking_method_note,
      isCurrent: true,
      importId: imp.id,
    });

    const slugs: string[] = [];
    for (const [slug, p] of bySlug) {
      slugs.push(slug);
      const r = rankBySlug.get(slug)!;
      const values = {
        slug,
        familyKey: familyKeyFor(p.name, data.country_code),
        name: p.name,
        countryCode: data.country_code,
        region: data.region,
        website: p.website,
        operator: p.operator,
        status: p.status,
        platformCategory: p.platform_category,
        marketplaceType: p.marketplace_type,
        beautyRelevance: p.beauty_relevance ?? null,
        beautyRelevanceNote: p.beauty_relevance_note,
        pharmacyRelevance: p.pharmacy_relevance ?? null,
        pharmacyRelevanceNote: p.pharmacy_relevance_note,
        estimatedMarketImportance: p.estimated_market_importance ?? null,
        marketImportanceNote: p.market_importance_note,
        competitorPresenceLevel: p.competitor_presence.level,
        competitorPresenceNote: p.competitor_presence.note,
        productCoverageNote: p.product_coverage_note,
        dataAccessMethod: p.data_access_method,
        publicSellerApi: p.api_availability.public_seller_api,
        apiNote: p.api_availability.note,
        apiDocsUrl: p.api_availability.docs_url,
        dataCollectionFeasibility: p.data_collection_feasibility ?? null,
        dataCollectionFeasibilityNote: p.data_collection_feasibility_note,
        priorityScores: p.priority_scores,
        weightedScore: r.weightedScore,
        priorityRank: r.rank,
        isTop3: r.isTop3,
        priorityRationale: p.priority_rationale,
        confidence: p.confidence,
        confidenceNote: p.confidence_note,
        lastResearchDate: data.research_date,
        origin: 'research' as const,
        updatedAt: new Date(),
      };

      const existing = await tx
        .select({ id: s.marketplaces.id })
        .from(s.marketplaces)
        .where(and(isNull(s.marketplaces.organisationId), eq(s.marketplaces.countryCode, data.country_code), eq(s.marketplaces.slug, slug)))
        .limit(1);

      let marketplaceId: string;
      if (existing.length) {
        marketplaceId = existing[0].id;
        await tx.update(s.marketplaces).set(values).where(eq(s.marketplaces.id, marketplaceId));
        await tx.delete(s.marketplaceEvidence).where(eq(s.marketplaceEvidence.marketplaceId, marketplaceId));
        await tx.delete(s.marketplaceSources).where(eq(s.marketplaceSources.marketplaceId, marketplaceId));
      } else {
        const [row] = await tx.insert(s.marketplaces).values(values).returning({ id: s.marketplaces.id });
        marketplaceId = row.id;
      }

      if (p.consumer_reach_evidence.length) {
        await tx.insert(s.marketplaceEvidence).values(
          p.consumer_reach_evidence.map((e) => ({
            marketplaceId,
            claim: e.claim,
            metricType: e.metric_type,
            value: e.value,
            period: e.period,
            nature: e.nature,
            sourceUrl: e.source_url,
            sourceName: e.source_name,
            sourceDate: e.source_date,
          })),
        );
      }
      if (p.sources.length) {
        await tx.insert(s.marketplaceSources).values(
          p.sources.map((src) => ({
            marketplaceId,
            url: src.url,
            title: src.title,
            publisher: src.publisher,
            publishedDate: src.published_date,
            accessedDate: src.accessed_date,
          })),
        );
      }
      await tx.insert(s.marketplaceResearchSnapshots).values({
        marketplaceId,
        researchDate: data.research_date,
        importId: imp.id,
        data: p as unknown as Record<string, unknown>,
      });
    }

    // Platforms from earlier research that are absent from this file keep their history but lose their rank.
    await tx
      .update(s.marketplaces)
      .set({ priorityRank: null, isTop3: false, updatedAt: new Date() })
      .where(
        and(
          isNull(s.marketplaces.organisationId),
          eq(s.marketplaces.countryCode, data.country_code),
          slugs.length ? notInArray(s.marketplaces.slug, slugs) : undefined,
        ),
      );
  });
  return true;
}

export async function loadRequirementFile(db: Db, file: string, warnings: string[] = []): Promise<boolean> {
  const sha = sha256File(file);
  if (await alreadyImported(db, 'requirements', sha)) return false;

  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  const parsed = requirementFileSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`invalid requirements file: ${parsed.error.issues.slice(0, 3).map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
  }
  const data = parsed.data;
  countDropped(raw?.rules, data.rules.length, 'rule(s)', file, warnings);
  countDropped(raw?.official_quality_signals, data.official_quality_signals.length, 'quality signal(s)', file, warnings);
  const familyKey = path.basename(file, '.json');

  await db.transaction(async (tx) => {
    const [imp] = await tx
      .insert(s.researchImports)
      .values({ kind: 'requirements', path: path.relative(process.cwd(), file), sha256: sha, researchDate: data.research_date, recordCount: data.rules.length })
      .returning({ id: s.researchImports.id });

    const [{ current }] = await tx
      .select({ current: max(s.requirementSets.version) })
      .from(s.requirementSets)
      .where(eq(s.requirementSets.familyKey, familyKey));
    const version = (current ?? 0) + 1;

    await tx
      .update(s.requirementSets)
      .set({ status: 'superseded', supersededAt: new Date() })
      .where(and(eq(s.requirementSets.familyKey, familyKey), eq(s.requirementSets.status, 'current')));

    const [set] = await tx
      .insert(s.requirementSets)
      .values({
        familyKey,
        marketplaceName: data.marketplace,
        version,
        status: 'current',
        researchDate: data.research_date,
        appliesToCountryCodes: data.applies_to_country_codes,
        categoryScope: data.category_scope,
        languages: data.languages,
        enhancedContent: data.enhanced_content ?? null,
        publicDocumentationLevel: data.public_documentation_level,
        howBrandsDeliverContent: data.how_brands_deliver_content,
        nonOfficialTerms: data.non_official_terms_to_avoid,
        limitations: data.limitations,
        importId: imp.id,
      })
      .returning({ id: s.requirementSets.id });

    if (data.rules.length) {
      await tx.insert(s.requirementRules).values(
        data.rules.map((r) => ({
          setId: set.id,
          ruleKey: r.id,
          area: r.area,
          requirement: r.requirement,
          ruleType: r.rule_type,
          value: r.value,
          unit: r.unit,
          severity: r.severity,
          appliesToCountryCodes: r.applies_to_country_codes,
          appliesToCategory: r.applies_to_category,
          sellerType: r.seller_type,
          effectiveDate: r.effective_date,
          sourceUrl: r.source_url,
          sourceTitle: r.source_title,
          sourceDate: r.source_date,
          verification: r.verification,
          notes: r.notes,
        })),
      );
    }
    if (data.official_quality_signals.length) {
      await tx.insert(s.marketplaceQualitySignals).values(
        data.official_quality_signals.map((q) => ({
          setId: set.id,
          officialName: q.official_name,
          whatItMeasures: q.what_it_measures,
          components: q.components,
          accessMethod: q.access_method,
          apiReferenceUrl: q.api_reference_url,
          whoCanAccess: q.who_can_access,
          sourceUrl: q.source_url,
          verification: q.verification,
          notes: q.notes,
        })),
      );
    }
  });
  return true;
}
