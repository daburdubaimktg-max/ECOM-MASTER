import fs from 'node:fs';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { closeDb, getDb, schema } from '@/db/client';
import type { RequestContext } from '@/lib/auth/context';
import { ForbiddenError, NotFoundError, ValidationError } from '@/lib/auth/permissions';
import { ensureJobHandlers } from '@/lib/job-handlers';
import { runPendingJobs } from '@/lib/jobs';
import { deleteAsset, getAsset, listAssets, setAssetTrust, uploadAsset } from '@/lib/services/assets';
import { createBrand } from '@/lib/services/brands';
import { knowledgeStats, searchKnowledge } from '@/lib/services/knowledge';
import { addMember, fixture, makeOrganisation, useTempStorage } from '../helpers';

let admin: RequestContext;
let brandId: string;
let storageDir: string;

beforeAll(async () => {
  storageDir = useTempStorage();
  ensureJobHandlers();
  admin = await makeOrganisation('Knowledge Org');
  brandId = (await createBrand(admin, { name: 'Demo Botanics' })).id;
});

afterAll(async () => {
  await closeDb();
  fs.rmSync(storageDir, { recursive: true, force: true });
});

describe('uploading documents into the brand knowledge base', () => {
  let brandBookId: string;

  it('stores the file, then reads and indexes it in the background', async () => {
    const asset = await uploadAsset(admin, { brandId, kind: 'brand_book', filename: 'Demo Brand Book.pdf', bytes: fixture('demo-brand-book.pdf') });
    brandBookId = asset.id;
    expect(asset).toMatchObject({ processingStatus: 'pending', mimeType: 'application/pdf', trustLevel: 'unverified', title: 'Demo Brand Book' });
    expect(fs.existsSync(path.join(storageDir, asset.storageKey))).toBe(true);

    const report = await runPendingJobs();
    expect(report.failed).toBe(0);
    const processed = await getAsset(admin, asset.id);
    expect(processed).toMatchObject({ processingStatus: 'indexed', pageCount: 4 });
    expect(processed.chunkCount).toBeGreaterThanOrEqual(4);
  });

  it('answers a search with the passage, its page and an "unverified" label until the document is approved', async () => {
    const response = await searchKnowledge(admin, { query: 'which words should we avoid', brandId });
    const hit = response.results.find((r) => r.assetId === brandBookId);
    expect(hit).toBeDefined();
    expect(hit).toMatchObject({ sourceType: 'asset', locator: 'p. 2', trust: 'unverified', title: 'Demo Brand Book' });
    expect(hit!.content).toContain('miracle, cure, guaranteed');
    expect(response.mode).toBe('keyword_only'); // embeddings are switched off in automated tests
  });

  it('relabels every passage when a Brand Manager approves the document as an authoritative source', async () => {
    const editor = await addMember(admin.organisation.id, 'content_editor');
    await expect(setAssetTrust(editor, brandBookId, 'approved_source')).rejects.toBeInstanceOf(ForbiddenError);
    await setAssetTrust(admin, brandBookId, 'approved_source');
    const approvedOnly = await searchKnowledge(admin, { query: 'logo clear space', brandId, trust: ['approved'] });
    expect(approvedOnly.results[0]).toMatchObject({ assetId: brandBookId, trust: 'approved', locator: 'p. 3' });
  });

  it('indexes Word, PowerPoint and Excel files, including Arabic text', async () => {
    await uploadAsset(admin, { brandId, kind: 'product_catalogue', filename: 'catalogue.docx', bytes: fixture('demo-product-catalogue.docx') });
    await uploadAsset(admin, { brandId, kind: 'other', filename: 'range.pptx', bytes: fixture('demo-range-presentation.pptx') });
    await uploadAsset(admin, { brandId, kind: 'regulatory', filename: 'claims.xlsx', bytes: fixture('demo-claims-register.xlsx') });
    const report = await runPendingJobs();
    expect(report.failed).toBe(0);

    const arabic = await searchKnowledge(admin, { query: 'فروة الرأس الجافة', brandId });
    expect(arabic.results[0]).toMatchObject({ title: 'catalogue' });
    const slide = await searchKnowledge(admin, { query: 'hero product', brandId });
    expect(slide.results[0]).toMatchObject({ title: 'range', locator: 'Slide 2' });
    const sheet = await searchKnowledge(admin, { query: 'units per case', brandId });
    expect(sheet.results[0]).toMatchObject({ title: 'claims', locator: 'Sheet: Pack sizes' });
  });

  it('understands word forms (stemming) and quoted phrases', async () => {
    const stemmed = await searchKnowledge(admin, { query: 'exaggerating', brandId });
    expect(stemmed.results.some((r) => r.content.includes('never exaggerate'))).toBe(true);
    const phrase = await searchKnowledge(admin, { query: '"pure white background"', brandId });
    expect(phrase.results[0].content).toContain('pure white background');
    const nothing = await searchKnowledge(admin, { query: 'cryptocurrency mining', brandId });
    expect(nothing.results).toEqual([]);
  });

  it('stores images with their dimensions but does not index them', async () => {
    const image = await uploadAsset(admin, { brandId, kind: 'product_image', filename: 'hero.png', bytes: fixture('demo-hero-image.png') });
    expect(image).toMatchObject({ processingStatus: 'stored_only', imageWidth: 1600, imageHeight: 1600, mimeType: 'image/png' });
  });

  it('refuses duplicates, empty files, unsupported types and path tricks in file names', async () => {
    await expect(uploadAsset(admin, { brandId, filename: 'copy.pdf', bytes: fixture('demo-brand-book.pdf') })).rejects.toThrow(/already in the library/);
    await expect(uploadAsset(admin, { brandId, filename: 'empty.pdf', bytes: new Uint8Array() })).rejects.toBeInstanceOf(ValidationError);
    await expect(uploadAsset(admin, { brandId, filename: 'tool.exe', bytes: new Uint8Array([0x4d, 0x5a, 0x90, 0, 3, 0, 0, 0, 4, 0, 0, 0, 0xff, 0xff, 0, 0]) })).rejects.toBeInstanceOf(ValidationError);
    const tricky = await uploadAsset(admin, { brandId, filename: '../../etc/passwd.txt', bytes: new TextEncoder().encode('Plain brand note about shampoo launches.') });
    expect(tricky.originalFilename).toBe('passwd.txt');
    expect(tricky.storageKey.startsWith(`${admin.organisation.id}/${brandId}/`)).toBe(true);
    expect(tricky.storageKey).not.toContain('..');
  });

  it('enforces permissions and organisation boundaries on files', async () => {
    const viewer = await addMember(admin.organisation.id, 'viewer');
    await expect(uploadAsset(viewer, { brandId, filename: 'x.txt', bytes: new TextEncoder().encode('hello world text') })).rejects.toBeInstanceOf(ForbiddenError);
    const outsider = await makeOrganisation('Outsider Org');
    await expect(getAsset(outsider, brandBookId)).rejects.toBeInstanceOf(NotFoundError);
    expect(await listAssets(outsider)).toEqual([]);
  });

  it('reports knowledge base size and removes passages when a document is deleted', async () => {
    const before = await knowledgeStats(admin, brandId);
    expect(before.total).toBeGreaterThan(8);
    await deleteAsset(admin, brandBookId);
    const db = await getDb();
    const left = await db.select().from(schema.knowledgeChunks).where(eq(schema.knowledgeChunks.assetId, brandBookId));
    expect(left).toEqual([]);
    const response = await searchKnowledge(admin, { query: 'logo clear space', brandId });
    expect(response.results.some((r) => r.assetId === brandBookId)).toBe(false);
  });

  it('marks a corrupt document as failed with an explanation instead of crashing', async () => {
    const broken = new Uint8Array(fixture('demo-brand-book.pdf').slice(0, 600));
    const asset = await uploadAsset(admin, { brandId, filename: 'broken.pdf', bytes: broken });
    await runPendingJobs();
    const after = await getAsset(admin, asset.id);
    expect(['failed', 'stored_only']).toContain(after.processingStatus);
    expect(after.processingError).toBeTruthy();
  });
});
