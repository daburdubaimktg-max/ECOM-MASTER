import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { closeDb } from '@/db/client';
import type { RequestContext } from '@/lib/auth/context';
import { ForbiddenError, NotFoundError, ValidationError } from '@/lib/auth/permissions';
import { getBookContents, listBooks, saveBook, setBookStatus } from '@/lib/services/books';
import { addCompetitor, createBrand, reviewClaim, saveClaim } from '@/lib/services/brands';
import { uploadAsset } from '@/lib/services/assets';
import { addCustomMarketplace } from '@/lib/services/marketplaces';
import { getPriceItem, listPriceBoard, recordPrice, stopTracking, trackCompetitorProduct, trackOwnSku, unitBase, unitPrice } from '@/lib/services/pricing';
import { createProduct, saveSku } from '@/lib/services/products';
import { addMember, fixture, makeOrganisation, useTempStorage } from '../helpers';

let admin: RequestContext;
let brandId: string;
let productId: string;
let skuId: string;
let competitorId: string;
let marketplaceId: string;

beforeAll(async () => {
  useTempStorage();
  admin = await makeOrganisation('Pricing Org');
  brandId = (await createBrand(admin, { name: 'Demo Botanics' })).id;
  productId = (await createProduct(admin, brandId, { name: 'Nourishing Hair Oil', status: 'active' })).id;
  skuId = (await saveSku(admin, productId, { skuCode: 'DB-HO-200', variantName: 'Almond', sizeValue: 200, sizeUnit: 'ml' })).id;
  competitorId = (await addCompetitor(admin, brandId, { name: 'Example Rival (demo)' })).id;
  marketplaceId = (await addCustomMarketplace(admin, { name: 'Demo Market', countryCode: 'AE', platformCategory: 'general_marketplace', marketplaceType: 'third_party_marketplace', notes: '', website: '' })).id;
});

afterAll(async () => {
  await closeDb();
});

describe('unit prices', () => {
  it('compares like for like per 100 ml, per 100 g or per item, and refuses unknown units', () => {
    expect(unitPrice(20, unitBase(200, 'ml'))).toBeCloseTo(10);
    expect(unitPrice(30, unitBase(1, 'l'))).toBeCloseTo(3);
    expect(unitPrice(40, unitBase(200, 'ml', 2))).toBeCloseTo(10);
    expect(unitPrice(5, unitBase(250, 'g'))).toBeCloseTo(2);
    expect(unitBase(200, 'ml')?.base.label).toBe('per 100 ml');
    expect(unitBase(3, 'sachets')).toBeNull();
    expect(unitBase(null, 'ml')).toBeNull();
  });
});

describe('pricing intelligence', () => {
  let ownListing: string;
  let rivalListing: string;

  it('shows a tracked product with no price as not recorded — never zero', async () => {
    ownListing = await trackOwnSku(admin, { skuId, marketplaceId });
    const board = await listPriceBoard(admin, { brandId });
    expect(board).toHaveLength(1);
    expect(board[0]).toMatchObject({ ownership: 'own', name: 'Nourishing Hair Oil', latest: null, unitPrice: null, observationCount: 0 });
    // Tracking the same SKU again does not create a duplicate.
    expect(await trackOwnSku(admin, { skuId, marketplaceId })).toBe(ownListing);
  });

  it('records prices as dated history and calculates price per 100 ml and the change', async () => {
    await recordPrice(admin, ownListing, { observedOn: '2026-11-01', currencyCode: 'aed', listPrice: '24' });
    await recordPrice(admin, ownListing, { observedOn: '2026-11-20', currencyCode: 'AED', listPrice: '24', salePrice: '19.5', promotionText: 'Weekend deal' });
    const { row, history } = await getPriceItem(admin, ownListing);
    expect(history).toHaveLength(2);
    expect(row.latest).toMatchObject({ currencyCode: 'AED', price: 19.5, promotionText: 'Weekend deal' });
    expect(row.previousPrice).toBe(24);
    expect(row.unitPrice).toBeCloseTo(9.75);
    expect(history[0].collectionMethod).toBe('manual_upload');
  });

  it('rejects impossible prices with a clear reason', async () => {
    await expect(recordPrice(admin, ownListing, { observedOn: '2026-11-20', currencyCode: 'AED', listPrice: '-3' })).rejects.toBeInstanceOf(ValidationError);
    await expect(recordPrice(admin, ownListing, { observedOn: '2026-11-20', currencyCode: 'AED', listPrice: '10', salePrice: '12' })).rejects.toThrow(/promotional price/);
    await expect(recordPrice(admin, ownListing, { observedOn: '2999-01-01', currencyCode: 'AED', listPrice: '10' })).rejects.toThrow(/future/);
    await expect(recordPrice(admin, ownListing, { observedOn: '2026-11-20', currencyCode: 'dirham', listPrice: '10' })).rejects.toThrow(/currency/);
  });

  it('compares a competitor product with ours on the same marketplace, per 100 ml', async () => {
    await expect(trackCompetitorProduct(admin, { brandId, competitorId: brandId, name: 'Rival oil', marketplaceId })).rejects.toThrow(/competitor/i);
    rivalListing = await trackCompetitorProduct(admin, { brandId, competitorId, name: 'Rival Argan Oil', sizeValue: '100', sizeUnit: 'ml', comparableSkuId: skuId, marketplaceId });
    let rival = (await listPriceBoard(admin)).find((r) => r.listingId === rivalListing)!;
    expect(rival.priceIndex).toBeNull();
    expect(rival.indexNote).toMatch(/recorded price for both/);

    await recordPrice(admin, rivalListing, { observedOn: '2026-11-21', currencyCode: 'AED', listPrice: '15' });
    rival = (await listPriceBoard(admin)).find((r) => r.listingId === rivalListing)!;
    expect(rival.unitPrice).toBeCloseTo(15);
    // Ours: 9.75 per 100 ml; theirs: 15 → index 65 (we are 35% cheaper per 100 ml).
    expect(rival.priceIndex).toBeCloseTo(65);
    expect(rival.competitorName).toBe('Example Rival (demo)');
  });

  it('does not compare when the units cannot be compared', async () => {
    const odd = await trackCompetitorProduct(admin, { brandId, competitorId, name: 'Rival Sachets', sizeValue: '10', sizeUnit: 'sachets', comparableSkuId: skuId, marketplaceId });
    await recordPrice(admin, odd, { observedOn: '2026-11-21', currencyCode: 'AED', listPrice: '5' });
    const row = (await listPriceBoard(admin)).find((r) => r.listingId === odd)!;
    expect(row.priceIndex).toBeNull();
    expect(row.indexNote).toMatch(/cannot be compared/);
  });

  it('keeps history when tracking stops, and respects roles and organisations', async () => {
    const viewer = await addMember(admin.organisation.id, 'viewer');
    expect((await listPriceBoard(viewer)).length).toBeGreaterThan(0);
    await expect(recordPrice(viewer, ownListing, { observedOn: '2026-11-21', currencyCode: 'AED', listPrice: '5' })).rejects.toBeInstanceOf(ForbiddenError);
    const outsider = await makeOrganisation('Outsider');
    await expect(getPriceItem(outsider, ownListing)).rejects.toBeInstanceOf(NotFoundError);

    await stopTracking(admin, rivalListing);
    expect((await listPriceBoard(admin)).some((r) => r.listingId === rivalListing)).toBe(false);
    // Tracking it again brings back the same record with its history.
    const again = await trackCompetitorProduct(admin, { brandId, competitorId, name: 'Rival Argan Oil', sizeValue: '100', sizeUnit: 'ml', comparableSkuId: skuId, marketplaceId });
    expect(again).toBe(rivalListing);
    expect((await getPriceItem(admin, again)).history).toHaveLength(1);
  });
});

describe('brand books', () => {
  it('builds a launch book from approved claims, packshots and products, and refuses unapproved claims', async () => {
    const approved = await saveClaim(admin, brandId, { claimText: 'Enriched with almond oil', claimType: 'ingredient' });
    await reviewClaim(admin, approved.id, { status: 'approved' });
    const pending = await saveClaim(admin, brandId, { claimText: 'Reduces breakage', claimType: 'efficacy' });
    const banned = await saveClaim(admin, brandId, { claimText: 'Cures dandruff', claimType: 'efficacy' });
    await reviewClaim(admin, banned.id, { status: 'restricted', restrictionReason: 'Medical claim.' });
    const image = await uploadAsset(admin, { brandId, kind: 'product_image', filename: 'packshot.png', bytes: fixture('demo-hero-image.png') });
    const pdf = await uploadAsset(admin, { brandId, kind: 'brand_book', filename: 'book.pdf', bytes: fixture('demo-brand-book.pdf') });

    const base = {
      kind: 'launch_book' as const,
      title: 'Almond Hair Oil launch',
      launchDate: 'March 2027',
      marketCodes: ['AE', 'SA'],
      keyMessages: 'Lightweight daily oil\nNo sticky feel',
      fonts: [{ name: 'Fraunces', role: 'Headlines', usage: 'Titles and pack name', link: null }],
      colours: [{ name: 'Leaf green', hex: '1f6b4a', usage: 'Primary' }],
      claimIds: [approved.id],
      assetIds: [image.id],
      productIds: [productId],
    };
    await expect(saveBook(admin, brandId, { ...base, claimIds: [pending.id] })).rejects.toThrow(/Only approved claims/);
    await expect(saveBook(admin, brandId, { ...base, assetIds: [pdf.id] })).rejects.toThrow(/Only images/);
    await expect(saveBook(admin, brandId, { ...base, colours: [{ name: 'Bad', hex: 'green', usage: null }] })).rejects.toThrow(/colour code/);

    const bookId = await saveBook(admin, brandId, base);
    const contents = await getBookContents(admin, bookId);
    expect(contents.book.colours[0].hex).toBe('#1F6B4A');
    expect(contents.approvedClaims.map((c) => c.claimText)).toEqual(['Enriched with almond oil']);
    expect(contents.restrictedClaims.map((c) => c.claimText)).toEqual(['Cures dandruff']);
    expect(contents.images).toHaveLength(1);
    expect(contents.products[0].name).toBe('Nourishing Hair Oil');

    // A claim that stops being approved is left out of the book and flagged.
    await reviewClaim(admin, approved.id, { status: 'unverified' });
    const later = await getBookContents(admin, bookId);
    expect(later.approvedClaims).toHaveLength(0);
    expect(later.excludedClaims.map((c) => c.claimText)).toEqual(['Enriched with almond oil']);
  });

  it('separates writing from approving, and editing an approved book returns it to draft', async () => {
    const editor = await addMember(admin.organisation.id, 'content_editor');
    const bookId = await saveBook(editor, brandId, { title: 'Demo Botanics brand book' });
    await expect(setBookStatus(editor, bookId, 'approved')).rejects.toBeInstanceOf(ForbiddenError);
    await setBookStatus(admin, bookId, 'approved');
    let book = (await getBookContents(admin, bookId)).book;
    expect(book.status).toBe('approved');
    expect(book.version).toBe(1);

    await saveBook(editor, brandId, { title: 'Demo Botanics brand book', overview: 'Updated overview' }, bookId);
    book = (await getBookContents(admin, bookId)).book;
    expect(book.status).toBe('draft');
    expect(book.version).toBe(2);

    const viewer = await addMember(admin.organisation.id, 'viewer');
    await expect(saveBook(viewer, brandId, { title: 'Not allowed' })).rejects.toBeInstanceOf(ForbiddenError);
    expect((await listBooks(viewer)).length).toBe(2);
    const agency = await addMember(admin.organisation.id, 'agency_contributor', []);
    expect(await listBooks(agency)).toHaveLength(0);
  });
});
