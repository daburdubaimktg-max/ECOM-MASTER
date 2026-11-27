import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';
import { getDb, schema } from '@/db/client';
import type { RequestContext } from '@/lib/auth/context';
import { assertBrandAccess, assertCan } from '@/lib/auth/context';
import { NotFoundError, ValidationError } from '@/lib/auth/permissions';
import { audit } from './audit';

/**
 * PRICING INTELLIGENCE — what our SKUs and competitor products cost on each marketplace, over time.
 *
 * Prices are recorded by people today (from a website check, a seller-portal export or a distributor
 * report) and stored as manual observations. When official connectors arrive in Stage 3 they write to
 * the same tables, and the collection method keeps the two kinds apart. Nothing is ever estimated:
 * a product with no recorded price shows "not recorded", never zero.
 *
 * Built on the digital-shelf tables: marketplace_products → product_listings → price_observations.
 */
const mp = schema.marketplaceProducts;
const pl = schema.productListings;
const po = schema.priceObservations;
const cp = schema.competitorProducts;

export const PRICE_SOURCES = {
  website_check: 'Checked on the retailer’s website',
  seller_portal: 'Seller-portal or retailer report',
  distributor_report: 'Distributor report',
  other: 'Other',
} as const;
export type PriceSource = keyof typeof PRICE_SOURCES;

/* ---------------------------------------------------------------- unit prices */

type Base = { unit: 'ml' | 'g' | 'item'; per: number; label: string };

/** Normalises a pack size so prices can be compared like for like. Unknown units are not compared. */
export function unitBase(sizeValue: number | null, sizeUnit: string | null, packQuantity = 1): { quantity: number; base: Base } | null {
  if (!sizeValue || sizeValue <= 0 || !sizeUnit) return null;
  const unit = sizeUnit.trim().toLowerCase();
  const pack = packQuantity > 0 ? packQuantity : 1;
  const table: Record<string, [Base, number]> = {
    ml: [{ unit: 'ml', per: 100, label: 'per 100 ml' }, 1],
    l: [{ unit: 'ml', per: 100, label: 'per 100 ml' }, 1000],
    'fl oz': [{ unit: 'ml', per: 100, label: 'per 100 ml' }, 29.5735],
    g: [{ unit: 'g', per: 100, label: 'per 100 g' }, 1],
    kg: [{ unit: 'g', per: 100, label: 'per 100 g' }, 1000],
    oz: [{ unit: 'g', per: 100, label: 'per 100 g' }, 28.3495],
    count: [{ unit: 'item', per: 1, label: 'per item' }, 1],
    pcs: [{ unit: 'item', per: 1, label: 'per item' }, 1],
  };
  const entry = table[unit];
  if (!entry) return null;
  return { quantity: sizeValue * entry[1] * pack, base: entry[0] };
}

export function unitPrice(price: number | null, size: ReturnType<typeof unitBase>): number | null {
  if (price === null || !size) return null;
  return (price / size.quantity) * size.base.per;
}

/* ---------------------------------------------------------------- reading */

export type PriceRow = {
  listingId: string;
  ownership: 'own' | 'competitor';
  brandId: string;
  brandName: string;
  name: string;
  detail: string;
  competitorName: string | null;
  comparableSkuId: string | null;
  skuId: string | null;
  marketplaceId: string;
  marketplaceName: string;
  countryCode: string;
  url: string | null;
  size: ReturnType<typeof unitBase>;
  latest: { observedAt: Date; currencyCode: string; listPrice: number | null; salePrice: number | null; promotionText: string | null; price: number } | null;
  previousPrice: number | null;
  unitPrice: number | null;
  /** Our price ÷ the competitor's, ×100, per unit. Only on competitor rows, only when like for like. */
  priceIndex: number | null;
  indexNote: string | null;
  observationCount: number;
};

function brandScope(ctx: RequestContext) {
  return ctx.membership.brandIds !== null ? (ctx.membership.brandIds.length ? inArray(mp.brandId, ctx.membership.brandIds) : sql`false`) : undefined;
}

export async function listPriceBoard(ctx: RequestContext, filters: { brandId?: string; countryCode?: string } = {}): Promise<PriceRow[]> {
  assertCan(ctx, 'marketplace.view');
  if (filters.brandId) assertBrandAccess(ctx, filters.brandId);
  const db = await getDb();

  const listings = await db
    .select({
      listingId: pl.id,
      countryCode: pl.countryCode,
      ownership: mp.ownership,
      brandId: mp.brandId,
      url: mp.url,
      marketplaceId: mp.marketplaceId,
      marketplaceName: schema.marketplaces.name,
      brandName: schema.brands.name,
      competitorProductId: mp.competitorProductId,
    })
    .from(pl)
    .innerJoin(mp, eq(mp.id, pl.marketplaceProductId))
    .innerJoin(schema.marketplaces, eq(schema.marketplaces.id, mp.marketplaceId))
    .innerJoin(schema.brands, eq(schema.brands.id, mp.brandId))
    .where(
      and(
        eq(pl.organisationId, ctx.organisation.id),
        eq(pl.isActive, true),
        filters.brandId ? eq(mp.brandId, filters.brandId) : undefined,
        filters.countryCode ? eq(pl.countryCode, filters.countryCode.toUpperCase()) : undefined,
        brandScope(ctx),
      ),
    );
  if (!listings.length) return [];
  const listingIds = listings.map((l) => l.listingId);

  // Our SKUs behind each own listing (manual tracking creates a confirmed match).
  const skuLinks = await db
    .select({
      listingId: pl.id,
      skuId: schema.skus.id,
      skuCode: schema.skus.skuCode,
      packQuantity: schema.skus.packQuantity,
      productName: schema.products.name,
      variantName: schema.productVariants.name,
      sizeValue: schema.productVariants.sizeValue,
      sizeUnit: schema.productVariants.sizeUnit,
    })
    .from(pl)
    .innerJoin(schema.skuMarketplaceMatches, and(eq(schema.skuMarketplaceMatches.marketplaceProductId, pl.marketplaceProductId), eq(schema.skuMarketplaceMatches.status, 'confirmed')))
    .innerJoin(schema.skus, eq(schema.skus.id, schema.skuMarketplaceMatches.skuId))
    .innerJoin(schema.products, eq(schema.products.id, schema.skus.productId))
    .innerJoin(schema.productVariants, eq(schema.productVariants.id, schema.skus.variantId))
    .where(inArray(pl.id, listingIds));
  const skuByListing = new Map(skuLinks.map((s) => [s.listingId, s]));

  const competitorIds = listings.map((l) => l.competitorProductId).filter((x): x is string => Boolean(x));
  const competitorProducts = competitorIds.length
    ? await db
        .select({ id: cp.id, name: cp.name, sizeValue: cp.sizeValue, sizeUnit: cp.sizeUnit, packQuantity: cp.packQuantity, comparableSkuId: cp.comparableSkuId, competitorName: schema.competitors.name })
        .from(cp)
        .innerJoin(schema.competitors, eq(schema.competitors.id, cp.competitorId))
        .where(inArray(cp.id, competitorIds))
    : [];
  const competitorById = new Map(competitorProducts.map((c) => [c.id, c]));

  // The two most recent prices per listing, and how many there are.
  const prices = await db
    .select({
      listingId: po.listingId,
      observedAt: po.observedAt,
      currencyCode: po.currencyCode,
      listPrice: po.listPrice,
      salePrice: po.salePrice,
      promotionText: po.promotionText,
      rank: sql<number>`row_number() over (partition by ${po.listingId} order by ${po.observedAt} desc, ${po.createdAt} desc)`.as('rank'),
      total: sql<number>`count(*) over (partition by ${po.listingId})`.as('total'),
    })
    .from(po)
    .where(inArray(po.listingId, listingIds));
  const latestBy = new Map<string, (typeof prices)[number]>();
  const previousBy = new Map<string, (typeof prices)[number]>();
  for (const p of prices) {
    if (Number(p.rank) === 1) latestBy.set(p.listingId, p);
    if (Number(p.rank) === 2) previousBy.set(p.listingId, p);
  }
  const effective = (p?: { listPrice: number | null; salePrice: number | null }) => (p ? (p.salePrice ?? p.listPrice) : null);

  const rows: PriceRow[] = listings.map((l) => {
    const latest = latestBy.get(l.listingId);
    const latestPrice = effective(latest);
    const previous = previousBy.get(l.listingId);
    const base = {
      listingId: l.listingId,
      brandId: l.brandId!,
      brandName: l.brandName,
      marketplaceId: l.marketplaceId,
      marketplaceName: l.marketplaceName,
      countryCode: l.countryCode,
      url: l.url,
      latest:
        latest && latestPrice !== null
          ? { observedAt: latest.observedAt, currencyCode: latest.currencyCode, listPrice: latest.listPrice, salePrice: latest.salePrice, promotionText: latest.promotionText, price: latestPrice }
          : null,
      previousPrice: previous && previous.currencyCode === latest?.currencyCode ? effective(previous) : null,
      observationCount: latest ? Number(latest.total) : 0,
      priceIndex: null,
      indexNote: null,
    };
    if (l.ownership === 'competitor' && l.competitorProductId) {
      const c = competitorById.get(l.competitorProductId);
      const size = unitBase(c?.sizeValue ?? null, c?.sizeUnit ?? null, c?.packQuantity ?? 1);
      return {
        ...base,
        ownership: 'competitor' as const,
        name: c?.name ?? 'Competitor product',
        detail: [c?.sizeValue ? `${Number(c.sizeValue)} ${c.sizeUnit ?? ''}`.trim() : null, c && c.packQuantity > 1 ? `× ${c.packQuantity} pack` : null].filter(Boolean).join(' '),
        competitorName: c?.competitorName ?? null,
        comparableSkuId: c?.comparableSkuId ?? null,
        skuId: null,
        size,
        unitPrice: unitPrice(latestPrice, size),
      };
    }
    const s = skuByListing.get(l.listingId);
    const size = unitBase(s?.sizeValue ? Number(s.sizeValue) : null, s?.sizeUnit ?? null, s?.packQuantity ?? 1);
    return {
      ...base,
      ownership: 'own' as const,
      name: s?.productName ?? 'Our product',
      detail: [s?.variantName, s?.sizeValue ? `${Number(s.sizeValue)} ${s.sizeUnit ?? ''}`.trim() : null, s && s.packQuantity > 1 ? `× ${s.packQuantity} pack` : null, s ? `SKU ${s.skuCode}` : null]
        .filter(Boolean)
        .join(' · '),
      competitorName: null,
      comparableSkuId: null,
      skuId: s?.skuId ?? null,
      size,
      unitPrice: unitPrice(latestPrice, size),
    };
  });

  // Price index: only like for like — same marketplace, same currency, same unit of measure.
  const ownByKey = new Map(rows.filter((r) => r.ownership === 'own' && r.skuId).map((r) => [`${r.skuId}|${r.marketplaceId}`, r]));
  for (const row of rows) {
    if (row.ownership !== 'competitor') continue;
    if (!row.comparableSkuId) {
      row.indexNote = 'Not linked to one of our SKUs.';
      continue;
    }
    const ours = ownByKey.get(`${row.comparableSkuId}|${row.marketplaceId}`);
    if (!ours) row.indexNote = 'Our SKU is not tracked on this marketplace.';
    else if (!ours.latest || !row.latest) row.indexNote = 'Needs a recorded price for both products.';
    else if (ours.latest.currencyCode !== row.latest.currencyCode) row.indexNote = 'Different currencies.';
    else if (!ours.unitPrice || !row.unitPrice || ours.size?.base.unit !== row.size?.base.unit) row.indexNote = 'Pack sizes cannot be compared — check the size and unit.';
    else {
      row.priceIndex = (ours.unitPrice / row.unitPrice) * 100;
      const days = Math.abs(ours.latest.observedAt.getTime() - row.latest.observedAt.getTime()) / 86_400_000;
      if (days > 14) row.indexNote = `Prices were recorded ${Math.round(days)} days apart.`;
    }
  }

  // Our products first, each followed by the competitor products compared with it.
  const sortKey = (r: PriceRow) => `${r.countryCode}|${r.marketplaceName}|${r.ownership === 'own' ? r.skuId : (r.comparableSkuId ?? 'zzz')}|${r.ownership === 'own' ? 0 : 1}|${r.name}`;
  return rows.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
}

export async function getPriceItem(ctx: RequestContext, listingId: string) {
  if (!z.string().uuid().safeParse(listingId).success) throw new NotFoundError('Not found.');
  const rows = await listPriceBoard(ctx);
  const row = rows.find((r) => r.listingId === listingId);
  if (!row) throw new NotFoundError('This tracked product was not found.');
  const db = await getDb();
  const history = await db
    .select({ id: po.id, observedAt: po.observedAt, currencyCode: po.currencyCode, listPrice: po.listPrice, salePrice: po.salePrice, promotionText: po.promotionText, raw: po.raw, collectionMethod: po.collectionMethod })
    .from(po)
    .where(eq(po.listingId, listingId))
    .orderBy(desc(po.observedAt), desc(po.createdAt));
  return { row, history };
}

/** Marketplaces offered when tracking: researched or added by this organisation, tracked ones first. */
export async function listPricingMarketplaces(ctx: RequestContext) {
  assertCan(ctx, 'marketplace.view');
  const db = await getDb();
  const m = schema.marketplaces;
  return db
    .select({ id: m.id, name: m.name, countryCode: m.countryCode, tracking: schema.marketplaceSettings.monitoringStatus, rank: m.priorityRank })
    .from(m)
    .leftJoin(schema.marketplaceSettings, and(eq(schema.marketplaceSettings.marketplaceId, m.id), eq(schema.marketplaceSettings.organisationId, ctx.organisation.id)))
    .where(sql`(${m.organisationId} is null or ${m.organisationId} = ${ctx.organisation.id})`)
    .orderBy(asc(m.countryCode), asc(m.priorityRank), asc(m.name));
}

/* ---------------------------------------------------------------- writing */

/** An optional field: a missing or malformed value becomes `fallback` instead of failing the whole form. */
function lenient<T>(schema: z.ZodType<T>, fallback: T) {
  return z
    .unknown()
    .optional()
    .transform((v): T => {
      const r = schema.safeParse(v);
      return r.success ? r.data : fallback;
    });
}

const optionalText = (max: number) =>
  z
    .string()
    .max(max)
    .nullish()
    .transform((v) => (v && v.trim() ? v.trim() : null));

async function marketplaceFor(ctx: RequestContext, marketplaceId: string) {
  if (!z.string().uuid().safeParse(marketplaceId).success) throw new ValidationError('Choose a marketplace.', { marketplaceId: 'Choose a marketplace.' });
  const db = await getDb();
  const rows = await db
    .select({ id: schema.marketplaces.id, name: schema.marketplaces.name, countryCode: schema.marketplaces.countryCode, organisationId: schema.marketplaces.organisationId })
    .from(schema.marketplaces)
    .where(eq(schema.marketplaces.id, marketplaceId))
    .limit(1);
  const m = rows[0];
  if (!m || (m.organisationId && m.organisationId !== ctx.organisation.id)) throw new ValidationError('Choose a marketplace.', { marketplaceId: 'Choose a marketplace.' });
  return m;
}

async function createListing(
  ctx: RequestContext,
  input: { marketplaceId: string; countryCode: string; externalId: string; url: string | null; ownership: 'own' | 'competitor'; brandId: string; competitorProductId?: string; skuId?: string },
) {
  const db = await getDb();
  return db.transaction(async (tx) => {
    const [product] = await tx
      .insert(mp)
      .values({
        organisationId: ctx.organisation.id,
        marketplaceId: input.marketplaceId,
        externalId: input.externalId,
        url: input.url,
        ownership: input.ownership,
        brandId: input.brandId,
        competitorProductId: input.competitorProductId ?? null,
      })
      .onConflictDoUpdate({ target: [mp.organisationId, mp.marketplaceId, mp.externalId], set: { url: sql`coalesce(excluded.url, ${mp.url})` } })
      .returning();
    if (input.skuId) {
      await tx
        .insert(schema.skuMarketplaceMatches)
        .values({ organisationId: ctx.organisation.id, skuId: input.skuId, marketplaceProductId: product.id, matchMethod: 'manual', confidence: 1, status: 'confirmed', decidedBy: ctx.user.id, decidedAt: new Date() })
        .onConflictDoNothing();
    }
    const existing = await tx.select().from(pl).where(eq(pl.marketplaceProductId, product.id)).limit(1);
    if (existing[0]) {
      if (!existing[0].isActive) await tx.update(pl).set({ isActive: true, updatedAt: new Date() }).where(eq(pl.id, existing[0].id));
      return existing[0].id;
    }
    const [listing] = await tx
      .insert(pl)
      .values({ organisationId: ctx.organisation.id, marketplaceProductId: product.id, countryCode: input.countryCode, monitoringFrequency: 'manual' })
      .returning({ id: pl.id });
    return listing.id;
  });
}

const trackOwnSchema = z.object({
  skuId: z.string().uuid('Choose one of your SKUs.'),
  marketplaceId: z.string().min(1, 'Choose a marketplace.'),
  externalId: optionalText(120),
  url: optionalText(1000),
});

/** Start tracking the price of one of our SKUs on a marketplace. */
export async function trackOwnSku(ctx: RequestContext, input: z.input<typeof trackOwnSchema>): Promise<string> {
  assertCan(ctx, 'marketplace.manage');
  const parsed = trackOwnSchema.safeParse(input);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0].message, { [String(parsed.error.issues[0].path[0])]: parsed.error.issues[0].message });
  const db = await getDb();
  const skuRows = await db
    .select({ id: schema.skus.id, skuCode: schema.skus.skuCode, brandId: schema.products.brandId, productName: schema.products.name })
    .from(schema.skus)
    .innerJoin(schema.products, eq(schema.products.id, schema.skus.productId))
    .where(and(eq(schema.skus.id, parsed.data.skuId), eq(schema.skus.organisationId, ctx.organisation.id)))
    .limit(1);
  const sku = skuRows[0];
  if (!sku) throw new ValidationError('Choose one of your SKUs.', { skuId: 'Choose one of your SKUs.' });
  assertBrandAccess(ctx, sku.brandId);
  const market = await marketplaceFor(ctx, parsed.data.marketplaceId);
  const listingId = await createListing(ctx, {
    marketplaceId: market.id,
    countryCode: market.countryCode,
    externalId: parsed.data.externalId ?? `manual:sku:${sku.id}`,
    url: parsed.data.url,
    ownership: 'own',
    brandId: sku.brandId,
    skuId: sku.id,
  });
  await audit(ctx, { action: 'pricing.tracked', entityType: 'listing', entityId: listingId, summary: `Started tracking the price of ${sku.productName} (${sku.skuCode}) on ${market.name}` });
  return listingId;
}

const trackCompetitorSchema = z.object({
  brandId: z.string().uuid('Choose the brand this comparison is for.'),
  competitorId: z.string().uuid('Choose a competitor brand.'),
  name: z.string().trim().min(2, 'Enter the competitor product’s name.').max(200),
  sizeValue: lenient(z.coerce.number().positive().max(100000), null as number | null),
  sizeUnit: optionalText(10),
  packQuantity: lenient(z.coerce.number().int().min(1).max(1000), 1),
  comparableSkuId: lenient(z.string().uuid(), null as string | null),
  marketplaceId: z.string().min(1, 'Choose a marketplace.'),
  externalId: optionalText(120),
  url: optionalText(1000),
});

/** Start tracking the price of a competitor product on a marketplace. */
export async function trackCompetitorProduct(ctx: RequestContext, input: z.input<typeof trackCompetitorSchema>): Promise<string> {
  assertCan(ctx, 'marketplace.manage');
  const parsed = trackCompetitorSchema.safeParse(input);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0].message, { [String(parsed.error.issues[0].path[0])]: parsed.error.issues[0].message });
  const d = parsed.data;
  assertBrandAccess(ctx, d.brandId);
  const db = await getDb();
  const link = await db
    .select({ name: schema.competitors.name })
    .from(schema.brandCompetitors)
    .innerJoin(schema.competitors, eq(schema.competitors.id, schema.brandCompetitors.competitorId))
    .innerJoin(schema.brands, eq(schema.brands.id, schema.brandCompetitors.brandId))
    .where(and(eq(schema.brandCompetitors.brandId, d.brandId), eq(schema.brandCompetitors.competitorId, d.competitorId), eq(schema.brands.organisationId, ctx.organisation.id)))
    .limit(1);
  if (!link[0]) throw new ValidationError('Add this competitor to the brand first (Brands → Competitors).', { competitorId: 'Not a competitor of this brand.' });
  if (d.comparableSkuId) {
    const ok = await db
      .select({ id: schema.skus.id })
      .from(schema.skus)
      .innerJoin(schema.products, eq(schema.products.id, schema.skus.productId))
      .where(and(eq(schema.skus.id, d.comparableSkuId), eq(schema.products.brandId, d.brandId)))
      .limit(1);
    if (!ok[0]) throw new ValidationError('Choose one of this brand’s SKUs to compare with.', { comparableSkuId: 'Not one of this brand’s SKUs.' });
  }
  const market = await marketplaceFor(ctx, d.marketplaceId);

  const existing = await db
    .select({ id: cp.id })
    .from(cp)
    .where(and(eq(cp.organisationId, ctx.organisation.id), eq(cp.competitorId, d.competitorId), sql`lower(${cp.name}) = ${d.name.toLowerCase()}`))
    .limit(1);
  let competitorProductId = existing[0]?.id;
  if (competitorProductId) {
    await db
      .update(cp)
      .set({ sizeValue: d.sizeValue ?? null, sizeUnit: d.sizeUnit, packQuantity: d.packQuantity, comparableSkuId: d.comparableSkuId, updatedAt: new Date() })
      .where(eq(cp.id, competitorProductId));
  } else {
    const [row] = await db
      .insert(cp)
      .values({
        organisationId: ctx.organisation.id,
        competitorId: d.competitorId,
        name: d.name,
        brandText: link[0].name,
        sizeValue: d.sizeValue ?? null,
        sizeUnit: d.sizeUnit,
        packQuantity: d.packQuantity,
        comparableSkuId: d.comparableSkuId,
        createdBy: ctx.user.id,
      })
      .returning({ id: cp.id });
    competitorProductId = row.id;
  }
  const listingId = await createListing(ctx, {
    marketplaceId: market.id,
    countryCode: market.countryCode,
    externalId: d.externalId ?? `manual:competitor:${competitorProductId}`,
    url: d.url,
    ownership: 'competitor',
    brandId: d.brandId,
    competitorProductId,
  });
  await audit(ctx, { action: 'pricing.tracked', entityType: 'listing', entityId: listingId, summary: `Started tracking the price of ${link[0].name} ${d.name} on ${market.name}` });
  return listingId;
}

const priceSchema = z
  .object({
    observedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter the date the price was seen.'),
    currencyCode: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/, 'Enter a three-letter currency code, e.g. AED.'),
    listPrice: z.coerce.number().positive('Enter the price as a number above zero.').max(10_000_000),
    salePrice: z
      .union([z.literal(''), z.coerce.number().positive('The promotional price must be above zero.')])
      .nullish()
      .transform((v) => (v === '' || v === undefined ? null : v)),
    promotionText: optionalText(300),
    source: z
      .string()
      .nullish()
      .transform((v): PriceSource => (v && v in PRICE_SOURCES ? (v as PriceSource) : 'website_check')),
    note: optionalText(500),
  })
  .refine((v) => v.salePrice === null || v.salePrice <= v.listPrice, { message: 'The promotional price should not be higher than the regular price.', path: ['salePrice'] });

/** Record one price seen for a tracked product. Each price is a new, dated record; nothing is overwritten. */
export async function recordPrice(ctx: RequestContext, listingId: string, input: z.input<typeof priceSchema>): Promise<void> {
  assertCan(ctx, 'marketplace.manage');
  const { row } = await getPriceItem(ctx, listingId);
  const parsed = priceSchema.safeParse(input);
  if (!parsed.success) throw new ValidationError(parsed.error.issues[0].message, { [String(parsed.error.issues[0].path[0])]: parsed.error.issues[0].message });
  const d = parsed.data;
  const observedAt = new Date(`${d.observedOn}T12:00:00Z`);
  if (Number.isNaN(observedAt.getTime()) || observedAt.getTime() > Date.now() + 86_400_000) {
    throw new ValidationError('The date cannot be in the future.', { observedOn: 'The date cannot be in the future.' });
  }
  const db = await getDb();
  await db.transaction(async (tx) => {
    await tx.insert(po).values({
      organisationId: ctx.organisation.id,
      listingId,
      observedAt,
      currencyCode: d.currencyCode,
      listPrice: d.listPrice,
      salePrice: d.salePrice,
      promotionText: d.promotionText,
      collectionMethod: 'manual_upload',
      dataConfidence: 'medium',
      raw: { source: d.source, note: d.note, enteredBy: ctx.user.name },
    });
    await audit(
      ctx,
      {
        action: 'pricing.price_recorded',
        entityType: 'listing',
        entityId: listingId,
        summary: `Recorded ${d.currencyCode} ${(d.salePrice ?? d.listPrice).toFixed(2)} for ${row.name} on ${row.marketplaceName} (seen ${d.observedOn})`,
      },
      tx,
    );
  });
}

/** Stop tracking. The price history is kept. */
export async function stopTracking(ctx: RequestContext, listingId: string): Promise<void> {
  assertCan(ctx, 'marketplace.manage');
  const { row } = await getPriceItem(ctx, listingId);
  const db = await getDb();
  await db.update(pl).set({ isActive: false, updatedAt: new Date() }).where(eq(pl.id, listingId));
  await audit(ctx, { action: 'pricing.untracked', entityType: 'listing', entityId: listingId, summary: `Stopped tracking ${row.name} on ${row.marketplaceName} (history kept)` });
}

/** Default currency for a country, for the price form. */
export async function currencyFor(countryCode: string): Promise<string | null> {
  const db = await getDb();
  const rows = await db.select({ c: schema.countries.currencyCode }).from(schema.countries).where(eq(schema.countries.code, countryCode)).limit(1);
  return rows[0]?.c ?? null;
}

/** Choices for the "track a product" form: each brand's SKUs and competitor brands. */
export async function pricingFormOptions(ctx: RequestContext) {
  assertCan(ctx, 'marketplace.view');
  const db = await getDb();
  const scope = ctx.membership.brandIds !== null ? (ctx.membership.brandIds.length ? inArray(schema.brands.id, ctx.membership.brandIds) : sql`false`) : undefined;
  const [brands, skus, competitors] = await Promise.all([
    db
      .select({ id: schema.brands.id, name: schema.brands.name })
      .from(schema.brands)
      .where(and(eq(schema.brands.organisationId, ctx.organisation.id), eq(schema.brands.status, 'active'), scope))
      .orderBy(asc(schema.brands.name)),
    db
      .select({
        id: schema.skus.id,
        brandId: schema.products.brandId,
        skuCode: schema.skus.skuCode,
        productName: schema.products.name,
        variantName: schema.productVariants.name,
        sizeValue: schema.productVariants.sizeValue,
        sizeUnit: schema.productVariants.sizeUnit,
        packQuantity: schema.skus.packQuantity,
      })
      .from(schema.skus)
      .innerJoin(schema.products, eq(schema.products.id, schema.skus.productId))
      .innerJoin(schema.productVariants, eq(schema.productVariants.id, schema.skus.variantId))
      .where(eq(schema.skus.organisationId, ctx.organisation.id))
      .orderBy(asc(schema.products.name), asc(schema.skus.skuCode)),
    db
      .select({ brandId: schema.brandCompetitors.brandId, id: schema.competitors.id, name: schema.competitors.name })
      .from(schema.brandCompetitors)
      .innerJoin(schema.competitors, eq(schema.competitors.id, schema.brandCompetitors.competitorId))
      .where(eq(schema.competitors.organisationId, ctx.organisation.id))
      .orderBy(asc(schema.competitors.name)),
  ]);
  const visible = new Set(brands.map((b) => b.id));
  return {
    brands,
    skus: skus
      .filter((s) => visible.has(s.brandId))
      .map((s) => ({
        id: s.id,
        brandId: s.brandId,
        label: [s.productName, s.variantName, s.sizeValue ? `${Number(s.sizeValue)} ${s.sizeUnit ?? ''}`.trim() : null, s.packQuantity > 1 ? `× ${s.packQuantity}` : null, `(${s.skuCode})`]
          .filter(Boolean)
          .join(' · '),
      })),
    competitors: competitors.filter((c) => visible.has(c.brandId)),
  };
}
