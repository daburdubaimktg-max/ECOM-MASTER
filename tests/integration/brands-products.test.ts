import fs from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { closeDb, getDb, schema } from '@/db/client';
import type { RequestContext } from '@/lib/auth/context';
import { ForbiddenError, NotFoundError, ValidationError } from '@/lib/auth/permissions';
import { createBrand, getBrand, listBrands, listClaims, reviewClaim, saveClaim, saveGuideline, setGuidelineStatus, updateBrand } from '@/lib/services/brands';
import { searchKnowledge } from '@/lib/services/knowledge';
import { addIdentifier, catalogueStats, createProduct, getProduct, importProductsCsv, listProducts, saveSku, updateProduct } from '@/lib/services/products';
import { addMember, fixturePath, makeOrganisation } from '../helpers';

let admin: RequestContext;
let otherOrgAdmin: RequestContext;
let brandId: string;
let secondBrandId: string;

beforeAll(async () => {
  admin = await makeOrganisation('Org One');
  otherOrgAdmin = await makeOrganisation('Org Two');
  const brand = await createBrand(admin, {
    name: 'Demo Botanics',
    positioning: 'Affordable plant-based hair and personal care for families.',
    toneOfVoice: 'Warm and plain, like a knowledgeable friend. Never exaggerate.',
  });
  brandId = brand.id;
  secondBrandId = (await createBrand(admin, { name: 'Second Brand' })).id;
});

afterAll(async () => {
  await closeDb();
});

describe('brands', () => {
  it('validates input and prevents duplicate names', async () => {
    await expect(createBrand(admin, { name: '   ' })).rejects.toBeInstanceOf(ValidationError);
    await expect(createBrand(admin, { name: 'demo botanics' })).rejects.toBeInstanceOf(ValidationError);
    await expect(createBrand(admin, { name: 'Web Brand', website: 'not a url' })).rejects.toBeInstanceOf(ValidationError);
  });

  it('keeps organisations completely separate', async () => {
    await expect(getBrand(otherOrgAdmin, brandId)).rejects.toBeInstanceOf(NotFoundError);
    expect(await listBrands(otherOrgAdmin)).toEqual([]);
    await expect(updateBrand(otherOrgAdmin, brandId, { name: 'Hijacked' })).rejects.toBeInstanceOf(NotFoundError);
    const results = await searchKnowledge(otherOrgAdmin, { query: 'plant-based hair care' });
    expect(results.results).toEqual([]);
  });

  it('limits a brand-restricted member to their assigned brands', async () => {
    const agency = await addMember(admin.organisation.id, 'agency_contributor', [secondBrandId]);
    expect((await listBrands(agency)).map((b) => b.name)).toEqual(['Second Brand']);
    await expect(getBrand(agency, brandId)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(listClaims(agency, brandId)).rejects.toBeInstanceOf(ForbiddenError);
    const results = await searchKnowledge(agency, { query: 'knowledgeable friend' });
    expect(results.results).toEqual([]);
  });

  it('stops read-only roles from changing anything', async () => {
    const viewer = await addMember(admin.organisation.id, 'viewer');
    await expect(createBrand(viewer, { name: 'Nope' })).rejects.toBeInstanceOf(ForbiddenError);
    await expect(updateBrand(viewer, brandId, { name: 'Nope' })).rejects.toBeInstanceOf(ForbiddenError);
    await expect(saveClaim(viewer, brandId, { claimText: 'Makes hair shiny' })).rejects.toBeInstanceOf(ForbiddenError);
    expect((await getBrand(viewer, brandId)).name).toBe('Demo Botanics');
  });

  it('makes the brand profile searchable as approved knowledge', async () => {
    const results = await searchKnowledge(admin, { query: 'knowledgeable friend', brandId });
    expect(results.results[0]).toMatchObject({ sourceType: 'brand_profile', trust: 'approved' });
    expect(results.results[0].snippet).toContain('[[knowledgeable]]');
  });
});

describe('claims: propose, then approve or restrict', () => {
  it('starts every claim as unverified, whoever writes it', async () => {
    const claim = await saveClaim(admin, brandId, { claimText: 'Helps reduce hair breakage caused by dryness', claimType: 'efficacy' });
    expect(claim.status).toBe('unverified');
    const found = await searchKnowledge(admin, { query: 'hair breakage', brandId });
    expect(found.results.find((r) => r.sourceType === 'claim')?.trust).toBe('unverified');
  });

  it('lets an editor propose but not approve; approval is a separate, recorded step', async () => {
    const editor = await addMember(admin.organisation.id, 'content_editor');
    const manager = await addMember(admin.organisation.id, 'brand_manager');
    const claim = await saveClaim(editor, brandId, { claimText: 'Enriched with almond oil and coconut oil', claimType: 'ingredient' });
    await expect(reviewClaim(editor, claim.id, { status: 'approved' })).rejects.toBeInstanceOf(ForbiddenError);

    const approved = await reviewClaim(manager, claim.id, { status: 'approved' });
    expect(approved).toMatchObject({ status: 'approved', reviewedBy: manager.user.id });
    const onlyApproved = await searchKnowledge(admin, { query: 'almond oil', brandId, trust: ['approved'] });
    expect(onlyApproved.results.some((r) => r.sourceType === 'claim')).toBe(true);
  });

  it('requires a reason to restrict a claim and labels it restricted in search', async () => {
    const claim = await saveClaim(admin, brandId, { claimText: 'Cures dandruff permanently', claimType: 'efficacy' });
    await expect(reviewClaim(admin, claim.id, { status: 'restricted' })).rejects.toBeInstanceOf(ValidationError);
    await reviewClaim(admin, claim.id, { status: 'restricted', restrictionReason: 'Medical claim — not permitted for cosmetics.' });
    const results = await searchKnowledge(admin, { query: 'cures dandruff', brandId });
    const hit = results.results.find((r) => r.sourceType === 'claim');
    expect(hit?.trust).toBe('restricted');
    expect(hit?.content).toContain('must not be used');
    const approvedOnly = await searchKnowledge(admin, { query: 'cures dandruff', brandId, trust: ['approved'] });
    expect(approvedOnly.results.some((r) => r.sourceType === 'claim')).toBe(false);
  });

  it('sends an edited claim back to unverified', async () => {
    const claim = await saveClaim(admin, brandId, { claimText: 'Adds shine' });
    await reviewClaim(admin, claim.id, { status: 'approved' });
    const edited = await saveClaim(admin, brandId, { claimText: 'Adds ten times more shine' }, claim.id);
    expect(edited).toMatchObject({ status: 'unverified', reviewedBy: null });
  });
});

describe('guidelines', () => {
  it('returns an approved guideline to draft when its wording changes', async () => {
    const guideline = await saveGuideline(admin, brandId, { section: 'tone_of_voice', title: 'Words we avoid', body: 'Never use miracle, cure, guaranteed or instant.' });
    expect(guideline.status).toBe('draft');
    const approved = await setGuidelineStatus(admin, guideline.id, 'approved');
    expect(approved.status).toBe('approved');
    const edited = await saveGuideline(admin, brandId, { section: 'tone_of_voice', title: 'Words we avoid', body: 'Never use miracle or cure.' }, guideline.id);
    expect(edited).toMatchObject({ status: 'draft', version: 2, approvedBy: null });
  });
});

describe('products, SKUs and barcodes', () => {
  let productId: string;

  it('creates a product and makes it searchable (draft = unverified, active = approved)', async () => {
    const product = await createProduct(admin, brandId, {
      name: 'Nourishing Hair Oil',
      category: 'Hair Care > Hair Oil',
      description: 'A lightweight daily hair oil with almond and coconut that soothes a dry scalp.',
      benefits: ['Soothes dry scalp', 'Adds shine', ''],
      ingredients: 'Coconut oil, almond oil, fragrance',
    });
    productId = product.id;
    expect(product.benefits).toEqual(['Soothes dry scalp', 'Adds shine']);
    let results = await searchKnowledge(admin, { query: 'coconut almond ingredients', brandId, sourceTypes: ['product'] });
    expect(results.results[0]).toMatchObject({ productId, trust: 'unverified' });
    await updateProduct(admin, productId, { name: 'Nourishing Hair Oil', status: 'active', description: product.description, benefits: product.benefits, ingredients: product.ingredients, category: product.category });
    results = await searchKnowledge(admin, { query: 'coconut almond ingredients', brandId, sourceTypes: ['product'] });
    expect(results.results[0].trust).toBe('approved');
  });

  it('adds SKUs, groups them into variants and treats a multipack as its own SKU', async () => {
    await saveSku(admin, productId, { skuCode: 'DB-HO-ALM-200', variantName: 'Almond', sizeValue: '200', sizeUnit: 'ml', gtin: '4006381333931' });
    await saveSku(admin, productId, { skuCode: 'DB-HO-ALM-200X2', variantName: 'Almond', sizeValue: 200, sizeUnit: 'ml', packQuantity: 2 });
    await saveSku(admin, productId, { skuCode: 'DB-HO-ALM-100', variantName: 'Almond', sizeValue: 100, sizeUnit: 'ml' });
    const detail = await getProduct(admin, productId);
    expect(detail.skus).toHaveLength(3);
    expect(new Set(detail.skus.map((s) => s.variant.id)).size).toBe(2);
    const twin = detail.skus.find((s) => s.skuCode === 'DB-HO-ALM-200X2')!;
    const single = detail.skus.find((s) => s.skuCode === 'DB-HO-ALM-200')!;
    expect(twin.variant.id).toBe(single.variant.id);
    expect(twin.packQuantity).toBe(2);
    expect(single.identifiers[0]).toMatchObject({ type: 'gtin', normalizedValue: '04006381333931', checkDigitValid: true });
  });

  it('rejects invalid barcodes, duplicate barcodes and duplicate SKU codes with a clear message', async () => {
    await expect(saveSku(admin, productId, { skuCode: 'DB-X-1', gtin: '4006381333932' })).rejects.toThrow(/Check digit is wrong/);
    await expect(saveSku(admin, productId, { skuCode: 'DB-X-2', gtin: '4006381333931' })).rejects.toThrow(/already assigned to SKU DB-HO-ALM-200/);
    await expect(saveSku(admin, productId, { skuCode: 'db-ho-alm-200' })).rejects.toThrow(/already used/);
    await expect(saveSku(admin, productId, { skuCode: 'DB-X-3', sizeValue: 'abc' })).rejects.toBeInstanceOf(ValidationError);
    const detail = await getProduct(admin, productId);
    expect(detail.skus.map((s) => s.skuCode).sort()).toEqual(['DB-HO-ALM-100', 'DB-HO-ALM-200', 'DB-HO-ALM-200X2']);
  });

  it('stores marketplace identifiers such as an ASIN alongside the barcode', async () => {
    const detail = await getProduct(admin, productId);
    const sku = detail.skus.find((s) => s.skuCode === 'DB-HO-ALM-200')!;
    await addIdentifier(admin, sku.id, { type: 'asin', value: 'b0demo1234', countryCode: 'ae' });
    const after = await getProduct(admin, productId);
    const asin = after.skus.find((s) => s.id === sku.id)!.identifiers.find((i) => i.type === 'asin');
    expect(asin).toMatchObject({ normalizedValue: 'B0DEMO1234', countryCode: 'AE' });
  });

  it('finds products by name, SKU code or barcode', async () => {
    expect((await listProducts(admin, { q: 'nourishing' })).map((p) => p.name)).toEqual(['Nourishing Hair Oil']);
    expect(await listProducts(admin, { q: 'ALM-200X2' })).toHaveLength(1);
    expect(await listProducts(admin, { q: '4006381333931' })).toHaveLength(1);
    expect(await listProducts(admin, { q: 'no-such-thing' })).toHaveLength(0);
    expect(await listProducts(otherOrgAdmin, {})).toHaveLength(0);
  });
});

describe('CSV import', () => {
  const csv = fs.readFileSync(fixturePath('demo-products.csv'), 'utf8');

  it('rejects rows whose SKU code already belongs to another product, without losing count', async () => {
    // The same SKU codes were created above under a different brand of this organisation.
    const report = await importProductsCsv(admin, secondBrandId, csv, { dryRun: true });
    expect(report.issues.some((i) => /already belongs to a different product/.test(i.message))).toBe(true);
    expect(report.productsCreated).toBe(1); // only Herbal Toothpaste is free of conflicts
    expect(report.skusCreated).toBe(1);
  });

  it('checks a file without saving anything (dry run)', async () => {
    admin = await makeOrganisation('Org Three (clean catalogue)');
    secondBrandId = (await createBrand(admin, { name: 'Import Brand' })).id;
    const before = (await listProducts(admin, { brandId: secondBrandId })).length;
    const report = await importProductsCsv(admin, secondBrandId, csv, { dryRun: true });
    expect(report).toMatchObject({ dryRun: true, rows: 5, productsCreated: 2, skusCreated: 4 });
    expect(report.issues).toEqual([{ row: 6, message: 'Size must be a positive number.' }]);
    expect((await listProducts(admin, { brandId: secondBrandId })).length).toBe(before);
  });

  it('imports valid rows, skips the broken row and reports it', async () => {
    const report = await importProductsCsv(admin, secondBrandId, csv);
    expect(report).toMatchObject({ productsCreated: 2, productsUpdated: 0, skusCreated: 4, skusUpdated: 0 });
    expect(report.issues).toHaveLength(1);
    const products = await listProducts(admin, { brandId: secondBrandId });
    expect(products.map((p) => p.name).sort()).toEqual(['Herbal Toothpaste', 'Nourishing Hair Oil']);
    const oil = await getProduct(admin, products.find((p) => p.name === 'Nourishing Hair Oil')!.id);
    expect(oil.skus).toHaveLength(3);
    expect(oil.product.benefits).toHaveLength(3);
    expect(oil.availability.map((a) => a.countryCode).sort()).toEqual(['AE', 'IN', 'SA']);
  });

  it('is safe to run twice: the second run updates instead of duplicating, and blanks never erase data', async () => {
    const report = await importProductsCsv(admin, secondBrandId, csv);
    expect(report).toMatchObject({ productsCreated: 0, productsUpdated: 2, skusCreated: 0, skusUpdated: 4 });
    const products = await listProducts(admin, { brandId: secondBrandId });
    expect(products).toHaveLength(2);
    const oil = await getProduct(admin, products.find((p) => p.name === 'Nourishing Hair Oil')!.id);
    expect(oil.product.description).toContain('lightweight daily hair oil');
  });

  it('refuses files without the required column and refuses read-only roles', async () => {
    await expect(importProductsCsv(admin, secondBrandId, 'name,sku\nA,B\n')).rejects.toBeInstanceOf(ValidationError);
    const viewer = await addMember(admin.organisation.id, 'viewer');
    await expect(importProductsCsv(viewer, secondBrandId, csv)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('counts products, SKUs and barcodes correctly in the summaries shown on lists and the overview', async () => {
    const brands = await listBrands(admin);
    const importBrand = brands.find((b) => b.id === secondBrandId)!;
    expect(importBrand).toMatchObject({ productCount: 2, assetCount: 0, approvedClaimCount: 0, pendingClaimCount: 0 });
    await saveClaim(admin, secondBrandId, { claimText: 'Fresh breath' });
    expect((await listBrands(admin)).find((b) => b.id === secondBrandId)).toMatchObject({ pendingClaimCount: 1 });
    const stats = await catalogueStats(admin);
    expect(stats).toMatchObject({ products: 2, skus: 4, withoutGtin: 4, withoutSku: 0 });
    const products = await listProducts(admin, { brandId: secondBrandId });
    expect(products.find((p) => p.name === 'Nourishing Hair Oil')).toMatchObject({ skuCount: 3, gtinCount: 0 });
  });

  it('writes every change to the audit log', async () => {
    const db = await getDb();
    const actions = new Set((await db.select({ action: schema.auditLogs.action }).from(schema.auditLogs)).map((r) => r.action));
    for (const expected of ['brand.created', 'claim.proposed', 'claim.approved', 'claim.restricted', 'guideline.approved', 'product.created', 'sku.created', 'identifier.added', 'product.imported']) {
      // (audit rows of every organisation in this test database are checked together)
      expect(actions).toContain(expected);
    }
  });
});
