import { createHash } from 'node:crypto';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';
import { getDb, schema } from '@/db/client';
import { ASSET_KINDS } from '@/db/schema';
import type { AssetKind } from '@/db/schema';
import type { RequestContext } from '@/lib/auth/context';
import { assertBrandAccess, assertCan } from '@/lib/auth/context';
import { NotFoundError, ValidationError } from '@/lib/auth/permissions';
import { chunkSegments } from '@/lib/documents/chunk';
import { detectFile, extractText, UnsupportedFileError } from '@/lib/documents/extract';
import type { FileKind } from '@/lib/documents/extract';
import { env } from '@/lib/env';
import { enqueueJob } from '@/lib/jobs';
import { getStorage } from '@/lib/storage';
import { audit } from './audit';
import { getBrand } from './brands';
import { replaceKnowledgeForSource, setKnowledgeTrustForSource } from './knowledge';

const a = schema.brandAssets;

const TEXT_KINDS: FileKind[] = ['pdf', 'docx', 'pptx', 'xlsx', 'text'];

function sanitiseFilename(name: string): string {
  const base = name.replace(/\\/g, '/').split('/').pop() || 'file';
  return base.replace(/[\u0000-\u001f<>:"|?*]/g, '').trim().slice(0, 200) || 'file';
}

export type UploadInput = {
  brandId: string;
  productId?: string | null;
  kind?: string;
  title?: string | null;
  filename: string;
  bytes: Uint8Array;
};

export async function uploadAsset(ctx: RequestContext, input: UploadInput) {
  assertCan(ctx, 'asset.upload');
  const brand = await getBrand(ctx, input.brandId);
  if (input.bytes.byteLength === 0) throw new ValidationError('The file is empty.');
  if (input.bytes.byteLength > env.maxUploadBytes) {
    throw new ValidationError(`The file is larger than the ${Math.round(env.maxUploadBytes / 1024 / 1024)} MB limit.`);
  }
  const kind: AssetKind = (ASSET_KINDS as readonly string[]).includes(input.kind ?? '') ? (input.kind as AssetKind) : 'other';
  const filename = sanitiseFilename(input.filename);

  let detected;
  try {
    detected = await detectFile(input.bytes, filename);
  } catch (err) {
    if (err instanceof UnsupportedFileError) throw new ValidationError(err.message);
    throw err;
  }

  const db = await getDb();
  if (input.productId) {
    const product = await db
      .select({ id: schema.products.id })
      .from(schema.products)
      .where(and(eq(schema.products.id, input.productId), eq(schema.products.brandId, brand.id)))
      .limit(1);
    if (!product.length) throw new ValidationError('The selected product does not belong to this brand.');
  }

  const sha256 = createHash('sha256').update(input.bytes).digest('hex');
  const duplicate = await db
    .select({ id: a.id, title: a.title })
    .from(a)
    .where(and(eq(a.organisationId, ctx.organisation.id), eq(a.brandId, brand.id), eq(a.sha256, sha256)))
    .limit(1);
  if (duplicate.length) {
    throw new ValidationError(`This exact file is already in the library as "${duplicate[0].title}".`);
  }

  let imageWidth: number | null = null;
  let imageHeight: number | null = null;
  if (detected.kind === 'image') {
    try {
      const sharp = (await import('sharp')).default;
      const meta = await sharp(input.bytes, { limitInputPixels: 268402689 }).metadata();
      imageWidth = meta.width ?? null;
      imageHeight = meta.height ?? null;
    } catch {
      throw new ValidationError('This image could not be read. It may be corrupted.');
    }
  }

  const willIndex = TEXT_KINDS.includes(detected.kind);
  const title = input.title?.trim() || filename.replace(/\.[^.]+$/, '');
  const [asset] = await db
    .insert(a)
    .values({
      organisationId: ctx.organisation.id,
      brandId: brand.id,
      productId: input.productId ?? null,
      kind,
      title: title.slice(0, 200),
      originalFilename: filename,
      mimeType: detected.mimeType,
      extension: detected.extension,
      sizeBytes: input.bytes.byteLength,
      sha256,
      storageKey: 'pending',
      processingStatus: willIndex ? 'pending' : 'stored_only',
      imageWidth,
      imageHeight,
      uploadedBy: ctx.user.id,
    })
    .returning();

  const storageKey = `${ctx.organisation.id}/${brand.id}/${asset.id}.${detected.extension}`;
  try {
    await getStorage().put(storageKey, input.bytes);
    await db.update(a).set({ storageKey }).where(eq(a.id, asset.id));
  } catch (err) {
    await db.delete(a).where(eq(a.id, asset.id));
    throw err;
  }

  if (willIndex) {
    await enqueueJob({ type: 'asset.process', payload: { assetId: asset.id }, organisationId: ctx.organisation.id });
  }
  await audit(ctx, {
    action: 'asset.uploaded',
    entityType: 'asset',
    entityId: asset.id,
    summary: `Uploaded "${filename}" (${detected.extension.toUpperCase()}, ${(input.bytes.byteLength / 1024 / 1024).toFixed(2)} MB) to ${brand.name}`,
    metadata: { sha256, mimeType: detected.mimeType, kind },
  });
  return { ...asset, storageKey };
}

/** Background job: read the file, extract text, split into passages and add them to the knowledge base. */
export async function processAsset(assetId: string): Promise<void> {
  const db = await getDb();
  const rows = await db.select().from(a).where(eq(a.id, assetId)).limit(1);
  const asset = rows[0];
  if (!asset) return;
  await db.update(a).set({ processingStatus: 'processing', processingError: null, updatedAt: new Date() }).where(eq(a.id, assetId));
  try {
    const bytes = new Uint8Array(await getStorage().read(asset.storageKey));
    const detected = await detectFile(bytes, asset.originalFilename);
    const extraction = await extractText(bytes, detected.kind);
    const chunks = chunkSegments(extraction.segments);
    await db.transaction(async (tx) => {
      await replaceKnowledgeForSource(tx, {
        organisationId: asset.organisationId,
        brandId: asset.brandId,
        productId: asset.productId,
        sourceType: 'asset',
        sourceId: asset.id,
        assetId: asset.id,
        title: asset.title,
        trust: asset.trustLevel === 'approved_source' ? 'approved' : 'unverified',
        passages: chunks.map((chunk) => ({ content: chunk.content, locator: chunk.locator, pageNumber: chunk.pageNumber })),
      });
      await tx
        .update(a)
        .set({
          processingStatus: chunks.length ? 'indexed' : 'stored_only',
          processingError: extraction.note,
          pageCount: extraction.pageCount,
          textChars: extraction.textChars,
          chunkCount: chunks.length,
          updatedAt: new Date(),
        })
        .where(eq(a.id, assetId));
    });
    if (chunks.length) {
      await enqueueJob({ type: 'knowledge.embed', payload: { organisationId: asset.organisationId }, organisationId: asset.organisationId });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await db
      .update(a)
      .set({ processingStatus: 'failed', processingError: `Could not read this file: ${message.slice(0, 500)}`, updatedAt: new Date() })
      .where(eq(a.id, assetId));
    if (!(err instanceof UnsupportedFileError)) throw err;
  }
}

export async function listAssets(ctx: RequestContext, filters: { brandId?: string; productId?: string } = {}) {
  assertCan(ctx, 'asset.view');
  if (filters.brandId) assertBrandAccess(ctx, filters.brandId);
  const db = await getDb();
  return db
    .select({
      asset: a,
      brandName: schema.brands.name,
      uploaderName: schema.users.name,
    })
    .from(a)
    .innerJoin(schema.brands, eq(schema.brands.id, a.brandId))
    .leftJoin(schema.users, eq(schema.users.id, a.uploadedBy))
    .where(
      and(
        eq(a.organisationId, ctx.organisation.id),
        filters.brandId ? eq(a.brandId, filters.brandId) : undefined,
        filters.productId ? eq(a.productId, filters.productId) : undefined,
        ctx.membership.brandIds !== null ? (ctx.membership.brandIds.length ? inArray(a.brandId, ctx.membership.brandIds) : sql`false`) : undefined,
      ),
    )
    .orderBy(desc(a.createdAt))
    .limit(500);
}

export async function getAsset(ctx: RequestContext, assetId: string) {
  assertCan(ctx, 'asset.view');
  if (!z.string().uuid().safeParse(assetId).success) throw new NotFoundError('File not found.');
  const db = await getDb();
  const rows = await db.select().from(a).where(and(eq(a.id, assetId), eq(a.organisationId, ctx.organisation.id))).limit(1);
  const asset = rows[0];
  if (!asset) throw new NotFoundError('File not found.');
  assertBrandAccess(ctx, asset.brandId);
  return asset;
}

/** Mark a document as an authoritative brand source (or revert). Changes how its passages are labelled everywhere. */
export async function setAssetTrust(ctx: RequestContext, assetId: string, trustLevel: 'approved_source' | 'unverified') {
  assertCan(ctx, 'asset.approve_source');
  const asset = await getAsset(ctx, assetId);
  const db = await getDb();
  await db.transaction(async (tx) => {
    await tx
      .update(a)
      .set({ trustLevel, trustReviewedBy: ctx.user.id, trustReviewedAt: new Date(), updatedAt: new Date() })
      .where(eq(a.id, assetId));
    await setKnowledgeTrustForSource(tx, 'asset', assetId, trustLevel === 'approved_source' ? 'approved' : 'unverified');
    await audit(
      ctx,
      {
        action: trustLevel === 'approved_source' ? 'asset.approved_as_source' : 'asset.source_approval_removed',
        entityType: 'asset',
        entityId: assetId,
        summary: `${trustLevel === 'approved_source' ? 'Approved' : 'Removed approval of'} "${asset.title}" as an authoritative brand source`,
      },
      tx,
    );
  });
}

export async function reprocessAsset(ctx: RequestContext, assetId: string) {
  assertCan(ctx, 'asset.upload');
  const asset = await getAsset(ctx, assetId);
  const db = await getDb();
  await db.update(a).set({ processingStatus: 'pending', processingError: null }).where(eq(a.id, asset.id));
  await enqueueJob({ type: 'asset.process', payload: { assetId: asset.id }, organisationId: ctx.organisation.id });
}

export async function deleteAsset(ctx: RequestContext, assetId: string) {
  assertCan(ctx, 'asset.delete');
  const asset = await getAsset(ctx, assetId);
  const db = await getDb();
  await db.transaction(async (tx) => {
    await tx.delete(a).where(eq(a.id, assetId)); // knowledge passages are removed by the database (cascade)
    await audit(ctx, { action: 'asset.deleted', entityType: 'asset', entityId: assetId, summary: `Deleted "${asset.originalFilename}"`, metadata: { sha256: asset.sha256 } }, tx);
  });
  await getStorage().remove(asset.storageKey).catch(() => undefined);
}
