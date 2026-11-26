import { and, asc, desc, eq, ilike, inArray, or, sql } from 'drizzle-orm';
import Papa from 'papaparse';
import { z } from 'zod';
import { getDb, schema } from '@/db/client';
import type { DbOrTx } from '@/db/client';
import { IDENTIFIER_TYPES } from '@/db/schema';
import type { RequestContext } from '@/lib/auth/context';
import { assertBrandAccess, assertCan } from '@/lib/auth/context';
import { NotFoundError, ValidationError } from '@/lib/auth/permissions';
import { checkGtin } from '@/lib/gtin';
import { audit } from './audit';
import { getBrand, zodToValidation } from './brands';
import { replaceKnowledgeForSource } from './knowledge';

const p = schema.products;
const v = schema.productVariants;
const k = schema.skus;
const ident = schema.productIdentifiers;

const optional = (max: number) =>
  z
    .string()
    .max(max, `Keep this under ${max} characters.`)
    .transform((s) => s.trim())
    .transform((s) => (s.length ? s : null))
    .nullish()
    .transform((s) => s ?? null);

export const productInputSchema = z.object({
  name: z.string().trim().min(1, 'Enter the product name.').max(200),
  subBrand: optional(120),
  category: optional(200),
  description: optional(8000),
  benefits: z
    .array(z.string().trim().max(400))
    .nullish()
    .transform((list) => (list ?? []).map((s) => s.trim()).filter(Boolean)),
  ingredients: optional(8000),
  directionsForUse: optional(4000),
  warnings: optional(4000),
  targetAudience: optional(2000),
  status: z.enum(['draft', 'active', 'discontinued']).default('draft'),
});
export type ProductInput = z.input<typeof productInputSchema>;

export const SIZE_UNITS = ['ml', 'l', 'g', 'kg', 'oz', 'fl oz', 'count', 'pcs'] as const;

export const skuInputSchema = z.object({
  skuCode: z.string().trim().min(1, 'Enter the SKU code.').max(80),
  variantName: z.string().trim().max(120).default(''),
  sizeValue: z
    .union([z.string(), z.number()])
    .nullish()
    .transform((val) => {
      if (val === null || val === undefined || val === '') return null;
      const n = typeof val === 'number' ? val : Number(String(val).replace(',', '.'));
      return Number.isFinite(n) && n > 0 ? n : NaN;
    })
    .refine((n) => n === null || !Number.isNaN(n), 'Size must be a positive number.'),
  sizeUnit: z
    .string()
    .trim()
    .toLowerCase()
    .max(12)
    .nullish()
    .transform((s) => (s ? s : null)),
  packQuantity: z.coerce.number().int().min(1, 'Units per pack must be at least 1.').max(1000).default(1),
  gtin: z
    .string()
    .trim()
    .nullish()
    .transform((s) => (s ? s : null)),
  status: z.enum(['active', 'planned', 'discontinued']).default('active'),
});
export type SkuInput = z.input<typeof skuInputSchema>;

function productScope(ctx: RequestContext) {
  if (ctx.membership.brandIds === null) return undefined;
  return ctx.membership.brandIds.length ? inArray(p.brandId, ctx.membership.brandIds) : sql`false`;
}

/** Rebuild the knowledge-base passages for a product from its structured record. */
export async function indexProduct(db: DbOrTx, productId: string): Promise<void> {
  const rows = await db
    .select({ product: p, brandName: schema.brands.name })
    .from(p)
    .innerJoin(schema.brands, eq(schema.brands.id, p.brandId))
    .where(eq(p.id, productId))
    .limit(1);
  const row = rows[0];
  if (!row) return;
  const product = row.product;
  const skuRows = await db
    .select({ skuCode: k.skuCode, packQuantity: k.packQuantity, variantName: v.name, sizeValue: v.sizeValue, sizeUnit: v.sizeUnit })
    .from(k)
    .innerJoin(v, eq(v.id, k.variantId))
    .where(eq(k.productId, productId));
  const attributes = await db.select().from(schema.productAttributes).where(eq(schema.productAttributes.productId, productId));

  const name = `${row.brandName} ${product.name}`;
  const passages: { title: string; content: string; locator: string }[] = [];
  const overview = [
    `${name}${product.subBrand ? ` (${product.subBrand})` : ''}.`,
    product.category ? `Category: ${product.category}.` : '',
    product.description ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  passages.push({ title: `${name} — Overview`, content: overview, locator: 'Product description' });
  if (product.benefits.length) passages.push({ title: `${name} — Benefits`, content: product.benefits.map((x) => `• ${x}`).join('\n'), locator: 'Benefits' });
  if (product.ingredients) passages.push({ title: `${name} — Ingredients`, content: product.ingredients, locator: 'Ingredients' });
  if (product.directionsForUse) passages.push({ title: `${name} — Directions for use`, content: product.directionsForUse, locator: 'Directions for use' });
  if (product.warnings) passages.push({ title: `${name} — Warnings`, content: product.warnings, locator: 'Warnings' });
  if (product.targetAudience) passages.push({ title: `${name} — Target audience`, content: product.targetAudience, locator: 'Target audience' });
  if (skuRows.length) {
    passages.push({
      title: `${name} — Pack sizes and SKUs`,
      content: skuRows
        .map((s) => `${s.variantName || 'Standard'}${s.sizeValue ? ` ${Number(s.sizeValue)}${s.sizeUnit ?? ''}` : ''}${s.packQuantity > 1 ? ` × ${s.packQuantity} pack` : ''} — SKU ${s.skuCode}`)
        .join('\n'),
      locator: 'Pack sizes',
    });
  }
  if (attributes.length) {
    passages.push({
      title: `${name} — Attributes`,
      content: attributes.map((at) => `${at.key}: ${at.value}${at.unit ? ` ${at.unit}` : ''}`).join('\n'),
      locator: 'Attributes',
    });
  }
  await replaceKnowledgeForSource(db, {
    organisationId: product.organisationId,
    brandId: product.brandId,
    productId: product.id,
    sourceType: 'product',
    sourceId: product.id,
    title: name,
    // Draft product records are work in progress and are labelled unverified until made active.
    trust: product.status === 'draft' ? 'unverified' : 'approved',
    passages,
  });
}

export async function listProducts(ctx: RequestContext, filters: { brandId?: string; q?: string; status?: string } = {}) {
  assertCan(ctx, 'product.view');
  if (filters.brandId) assertBrandAccess(ctx, filters.brandId);
  const db = await getDb();
  const q = filters.q?.trim();
  const like = q ? `%${q.replace(/[%_\\]/g, (m) => `\\${m}`)}%` : null;
  return db
    .select({
      id: p.id,
      name: p.name,
      subBrand: p.subBrand,
      category: p.category,
      status: p.status,
      isDemo: p.isDemo,
      brandId: p.brandId,
      brandName: schema.brands.name,
      updatedAt: p.updatedAt,
      skuCount: sql<number>`(select count(*)::int from skus s where s.product_id = "products"."id")`,
      gtinCount: sql<number>`(select count(*)::int from product_identifiers i join skus s on s.id = i.sku_id where s.product_id = "products"."id" and i.type = 'gtin')`,
      hasDescription: sql<boolean>`${p.description} is not null`,
      hasIngredients: sql<boolean>`${p.ingredients} is not null`,
      benefitCount: sql<number>`jsonb_array_length(${p.benefits})`,
    })
    .from(p)
    .innerJoin(schema.brands, eq(schema.brands.id, p.brandId))
    .where(
      and(
        eq(p.organisationId, ctx.organisation.id),
        productScope(ctx),
        filters.brandId ? eq(p.brandId, filters.brandId) : undefined,
        filters.status && ['draft', 'active', 'discontinued'].includes(filters.status) ? eq(p.status, filters.status as 'draft') : undefined,
        like
          ? or(
              ilike(p.name, like),
              ilike(p.category, like),
              sql`exists (select 1 from skus s where s.product_id = "products"."id" and s.sku_code ilike ${like})`,
              sql`exists (select 1 from product_identifiers i join skus s on s.id = i.sku_id where s.product_id = "products"."id" and i.value ilike ${like})`,
            )
          : undefined,
      ),
    )
    .orderBy(asc(schema.brands.name), asc(p.name))
    .limit(1000);
}

export async function getProduct(ctx: RequestContext, productId: string) {
  assertCan(ctx, 'product.view');
  if (!z.string().uuid().safeParse(productId).success) throw new NotFoundError('Product not found.');
  const db = await getDb();
  const rows = await db
    .select({ product: p, brandName: schema.brands.name })
    .from(p)
    .innerJoin(schema.brands, eq(schema.brands.id, p.brandId))
    .where(and(eq(p.id, productId), eq(p.organisationId, ctx.organisation.id)))
    .limit(1);
  const row = rows[0];
  if (!row) throw new NotFoundError('Product not found.');
  assertBrandAccess(ctx, row.product.brandId);

  const [skuRows, identifiers, attributes, availability] = await Promise.all([
    db
      .select({ sku: k, variant: v })
      .from(k)
      .innerJoin(v, eq(v.id, k.variantId))
      .where(eq(k.productId, productId))
      .orderBy(asc(v.name), asc(v.sizeValue), asc(k.packQuantity)),
    db
      .select({ identifier: ident })
      .from(ident)
      .innerJoin(k, eq(k.id, ident.skuId))
      .where(eq(k.productId, productId)),
    db.select().from(schema.productAttributes).where(eq(schema.productAttributes.productId, productId)).orderBy(asc(schema.productAttributes.key)),
    db.select().from(schema.productMarketAvailability).where(eq(schema.productMarketAvailability.productId, productId)),
  ]);

  return {
    product: row.product,
    brandName: row.brandName,
    skus: skuRows.map((r) => ({
      ...r.sku,
      variant: r.variant,
      identifiers: identifiers.filter((i) => i.identifier.skuId === r.sku.id).map((i) => i.identifier),
    })),
    attributes,
    availability,
  };
}

export async function createProduct(ctx: RequestContext, brandId: string, input: ProductInput, options: { isDemo?: boolean } = {}) {
  assertCan(ctx, 'product.edit');
  const brand = await getBrand(ctx, brandId);
  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) throw zodToValidation(parsed.error);
  const db = await getDb();
  return db.transaction(async (tx) => {
    const duplicate = await tx
      .select({ id: p.id })
      .from(p)
      .where(and(eq(p.brandId, brandId), sql`lower(${p.name}) = ${parsed.data.name.toLowerCase()}`))
      .limit(1);
    if (duplicate.length) throw new ValidationError('This brand already has a product with this name.', { name: 'A product with this name already exists.' });
    const [product] = await tx
      .insert(p)
      .values({ ...parsed.data, organisationId: ctx.organisation.id, brandId, isDemo: options.isDemo ?? false, createdBy: ctx.user.id })
      .returning();
    await indexProduct(tx, product.id);
    await audit(ctx, { action: 'product.created', entityType: 'product', entityId: product.id, summary: `Created product "${product.name}" for ${brand.name}` }, tx);
    return product;
  });
}

export async function updateProduct(ctx: RequestContext, productId: string, input: ProductInput) {
  assertCan(ctx, 'product.edit');
  const { product: current } = await getProduct(ctx, productId);
  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) throw zodToValidation(parsed.error);
  const db = await getDb();
  return db.transaction(async (tx) => {
    const duplicate = await tx
      .select({ id: p.id })
      .from(p)
      .where(and(eq(p.brandId, current.brandId), sql`lower(${p.name}) = ${parsed.data.name.toLowerCase()}`, sql`${p.id} <> ${productId}`))
      .limit(1);
    if (duplicate.length) throw new ValidationError('This brand already has a product with this name.', { name: 'A product with this name already exists.' });
    const changed = Object.keys(parsed.data).filter(
      (key) => JSON.stringify((parsed.data as Record<string, unknown>)[key]) !== JSON.stringify((current as Record<string, unknown>)[key]),
    );
    const [product] = await tx.update(p).set({ ...parsed.data, updatedAt: new Date() }).where(eq(p.id, productId)).returning();
    await indexProduct(tx, product.id);
    await audit(
      ctx,
      { action: 'product.updated', entityType: 'product', entityId: product.id, summary: `Updated product "${product.name}"`, metadata: { changedFields: changed } },
      tx,
    );
    return product;
  });
}

export async function deleteProduct(ctx: RequestContext, productId: string) {
  assertCan(ctx, 'product.delete');
  const { product } = await getProduct(ctx, productId);
  const db = await getDb();
  await db.transaction(async (tx) => {
    await tx.delete(schema.knowledgeChunks).where(and(eq(schema.knowledgeChunks.sourceType, 'product'), eq(schema.knowledgeChunks.sourceId, productId)));
    await tx.delete(p).where(eq(p.id, productId));
    await audit(ctx, { action: 'product.deleted', entityType: 'product', entityId: productId, summary: `Deleted product "${product.name}" and its SKUs` }, tx);
  });
}

async function findOrCreateVariant(tx: DbOrTx, organisationId: string, productId: string, name: string, sizeValue: number | null, sizeUnit: string | null) {
  const variantName = name || 'Standard';
  const existing = await tx.select().from(v).where(and(eq(v.productId, productId), sql`lower(${v.name}) = ${variantName.toLowerCase()}`));
  const match = existing.find(
    (row) => (row.sizeValue === null ? null : Number(row.sizeValue)) === sizeValue && (row.sizeUnit ?? null) === (sizeUnit ?? null),
  );
  if (match) return match;
  const [created] = await tx
    .insert(v)
    .values({ organisationId, productId, name: variantName, sizeValue: sizeValue === null ? null : String(sizeValue), sizeUnit })
    .returning();
  return created;
}

async function attachGtin(tx: DbOrTx, organisationId: string, skuId: string, gtin: string, source: 'manual' | 'import') {
  const check = checkGtin(gtin);
  if (!check.valid) throw new ValidationError(`Barcode problem: ${check.reason}`, { gtin: check.reason });
  const clash = await tx
    .select({ skuCode: k.skuCode, skuId: k.id })
    .from(ident)
    .innerJoin(k, eq(k.id, ident.skuId))
    .where(and(eq(ident.organisationId, organisationId), eq(ident.type, 'gtin'), eq(ident.normalizedValue, check.gtin14)))
    .limit(1);
  if (clash.length && clash[0].skuId !== skuId) {
    throw new ValidationError(`This barcode is already assigned to SKU ${clash[0].skuCode}. One barcode can only belong to one SKU.`, {
      gtin: `Already assigned to SKU ${clash[0].skuCode}.`,
    });
  }
  if (!clash.length) {
    await tx.insert(ident).values({ organisationId, skuId, type: 'gtin', value: check.digits, normalizedValue: check.gtin14, checkDigitValid: true, source });
  }
}

export async function saveSku(ctx: RequestContext, productId: string, input: SkuInput, skuId?: string, options: { source?: 'manual' | 'import' } = {}) {
  assertCan(ctx, 'product.edit');
  const { product } = await getProduct(ctx, productId);
  const parsed = skuInputSchema.safeParse(input);
  if (!parsed.success) throw zodToValidation(parsed.error);
  const data = parsed.data;
  const db = await getDb();
  return db.transaction(async (tx) => {
    const codeClash = await tx
      .select({ id: k.id })
      .from(k)
      .where(and(eq(k.organisationId, ctx.organisation.id), sql`lower(${k.skuCode}) = ${data.skuCode.toLowerCase()}`))
      .limit(1);
    if (codeClash.length && codeClash[0].id !== skuId) {
      throw new ValidationError(`SKU code "${data.skuCode}" is already used by another SKU.`, { skuCode: 'This SKU code is already in use.' });
    }
    const variant = await findOrCreateVariant(tx, ctx.organisation.id, productId, data.variantName, data.sizeValue as number | null, data.sizeUnit);
    let sku: typeof k.$inferSelect;
    if (skuId) {
      const existing = await tx.select().from(k).where(and(eq(k.id, skuId), eq(k.productId, productId))).limit(1);
      if (!existing.length) throw new NotFoundError('SKU not found.');
      [sku] = await tx
        .update(k)
        .set({ skuCode: data.skuCode, variantId: variant.id, packQuantity: data.packQuantity, status: data.status, updatedAt: new Date() })
        .where(eq(k.id, skuId))
        .returning();
    } else {
      [sku] = await tx
        .insert(k)
        .values({ organisationId: ctx.organisation.id, productId, variantId: variant.id, skuCode: data.skuCode, packQuantity: data.packQuantity, status: data.status })
        .returning();
    }
    if (data.gtin) await attachGtin(tx, ctx.organisation.id, sku.id, data.gtin, options.source ?? 'manual');
    // Remove variants that no longer have any SKU.
    await tx.execute(sql`delete from product_variants pv where pv.product_id = ${productId} and not exists (select 1 from skus s where s.variant_id = pv.id)`);
    await indexProduct(tx, productId);
    await audit(
      ctx,
      { action: skuId ? 'sku.updated' : 'sku.created', entityType: 'sku', entityId: sku.id, summary: `${skuId ? 'Updated' : 'Added'} SKU ${sku.skuCode} on "${product.name}"` },
      tx,
    );
    return sku;
  });
}

export async function deleteSku(ctx: RequestContext, skuId: string) {
  assertCan(ctx, 'product.edit');
  const db = await getDb();
  const rows = await db.select().from(k).where(and(eq(k.id, skuId), eq(k.organisationId, ctx.organisation.id))).limit(1);
  const sku = rows[0];
  if (!sku) throw new NotFoundError('SKU not found.');
  await getProduct(ctx, sku.productId);
  await db.transaction(async (tx) => {
    await tx.delete(k).where(eq(k.id, skuId));
    await tx.execute(sql`delete from product_variants pv where pv.product_id = ${sku.productId} and not exists (select 1 from skus s where s.variant_id = pv.id)`);
    await indexProduct(tx, sku.productId);
    await audit(ctx, { action: 'sku.deleted', entityType: 'sku', entityId: skuId, summary: `Deleted SKU ${sku.skuCode}` }, tx);
  });
}

const identifierInputSchema = z.object({
  type: z.enum(IDENTIFIER_TYPES),
  value: z.string().trim().min(1, 'Enter the identifier.').max(120),
  countryCode: z
    .string()
    .trim()
    .toUpperCase()
    .nullish()
    .transform((s) => (s && s.length === 2 ? s : null)),
});

export async function addIdentifier(ctx: RequestContext, skuId: string, input: z.input<typeof identifierInputSchema>) {
  assertCan(ctx, 'product.edit');
  const parsed = identifierInputSchema.safeParse(input);
  if (!parsed.success) throw zodToValidation(parsed.error);
  const db = await getDb();
  const rows = await db.select().from(k).where(and(eq(k.id, skuId), eq(k.organisationId, ctx.organisation.id))).limit(1);
  const sku = rows[0];
  if (!sku) throw new NotFoundError('SKU not found.');
  await getProduct(ctx, sku.productId);
  await db.transaction(async (tx) => {
    if (parsed.data.type === 'gtin') {
      await attachGtin(tx, ctx.organisation.id, skuId, parsed.data.value, 'manual');
    } else {
      await tx.insert(ident).values({
        organisationId: ctx.organisation.id,
        skuId,
        type: parsed.data.type,
        value: parsed.data.value,
        normalizedValue: parsed.data.value.trim().toUpperCase(),
        countryCode: parsed.data.countryCode,
        source: 'manual',
      });
    }
    await audit(ctx, { action: 'identifier.added', entityType: 'sku', entityId: skuId, summary: `Added ${parsed.data.type.toUpperCase()} ${parsed.data.value} to SKU ${sku.skuCode}` }, tx);
  });
}

export async function removeIdentifier(ctx: RequestContext, identifierId: string) {
  assertCan(ctx, 'product.edit');
  const db = await getDb();
  const rows = await db
    .select({ identifier: ident, productId: k.productId, skuCode: k.skuCode })
    .from(ident)
    .innerJoin(k, eq(k.id, ident.skuId))
    .where(and(eq(ident.id, identifierId), eq(ident.organisationId, ctx.organisation.id)))
    .limit(1);
  const row = rows[0];
  if (!row) throw new NotFoundError('Identifier not found.');
  await getProduct(ctx, row.productId);
  await db.delete(ident).where(eq(ident.id, identifierId));
  await audit(ctx, { action: 'identifier.removed', entityType: 'sku', entityId: row.identifier.skuId, summary: `Removed ${row.identifier.type.toUpperCase()} ${row.identifier.value} from SKU ${row.skuCode}` });
}

const attributeInputSchema = z.object({
  key: z.string().trim().min(1, 'Enter the attribute name.').max(80),
  value: z.string().trim().min(1, 'Enter the value.').max(1000),
  unit: optional(20),
});

export async function setAttribute(ctx: RequestContext, productId: string, input: z.input<typeof attributeInputSchema>) {
  assertCan(ctx, 'product.edit');
  const { product } = await getProduct(ctx, productId);
  const parsed = attributeInputSchema.safeParse(input);
  if (!parsed.success) throw zodToValidation(parsed.error);
  const db = await getDb();
  await db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: schema.productAttributes.id })
      .from(schema.productAttributes)
      .where(and(eq(schema.productAttributes.productId, productId), sql`lower(${schema.productAttributes.key}) = ${parsed.data.key.toLowerCase()}`, sql`${schema.productAttributes.skuId} is null`))
      .limit(1);
    if (existing.length) {
      await tx.update(schema.productAttributes).set({ value: parsed.data.value, unit: parsed.data.unit, updatedAt: new Date() }).where(eq(schema.productAttributes.id, existing[0].id));
    } else {
      await tx.insert(schema.productAttributes).values({ organisationId: ctx.organisation.id, productId, key: parsed.data.key, value: parsed.data.value, unit: parsed.data.unit });
    }
    await indexProduct(tx, productId);
    await audit(ctx, { action: 'attribute.set', entityType: 'product', entityId: productId, summary: `Set attribute "${parsed.data.key}" on "${product.name}"` }, tx);
  });
}

export async function removeAttribute(ctx: RequestContext, attributeId: string) {
  assertCan(ctx, 'product.edit');
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.productAttributes)
    .where(and(eq(schema.productAttributes.id, attributeId), eq(schema.productAttributes.organisationId, ctx.organisation.id)))
    .limit(1);
  const attribute = rows[0];
  if (!attribute) throw new NotFoundError('Attribute not found.');
  await getProduct(ctx, attribute.productId);
  await db.transaction(async (tx) => {
    await tx.delete(schema.productAttributes).where(eq(schema.productAttributes.id, attributeId));
    await indexProduct(tx, attribute.productId);
    await audit(ctx, { action: 'attribute.removed', entityType: 'product', entityId: attribute.productId, summary: `Removed attribute "${attribute.key}"` }, tx);
  });
}

export async function setAvailability(ctx: RequestContext, productId: string, countryCodes: string[]) {
  assertCan(ctx, 'product.edit');
  const { product } = await getProduct(ctx, productId);
  const db = await getDb();
  const known = await db.select({ code: schema.countries.code }).from(schema.countries);
  const valid = new Set(known.map((c) => c.code));
  const codes = [...new Set(countryCodes.map((c) => c.trim().toUpperCase()))].filter((c) => valid.has(c));
  await db.transaction(async (tx) => {
    await tx.delete(schema.productMarketAvailability).where(eq(schema.productMarketAvailability.productId, productId));
    if (codes.length) {
      await tx.insert(schema.productMarketAvailability).values(codes.map((countryCode) => ({ organisationId: ctx.organisation.id, productId, countryCode })));
    }
    await audit(ctx, { action: 'availability.set', entityType: 'product', entityId: productId, summary: `Set markets for "${product.name}": ${codes.join(', ') || 'none'}` }, tx);
  });
}

/* ------------------------------------------------------------------ CSV import */

export const PRODUCT_CSV_COLUMNS = [
  'product_name',
  'sub_brand',
  'category',
  'description',
  'benefits',
  'ingredients',
  'directions_for_use',
  'target_audience',
  'status',
  'variant_name',
  'size_value',
  'size_unit',
  'pack_quantity',
  'sku_code',
  'gtin',
  'countries',
] as const;

export const PRODUCT_CSV_TEMPLATE =
  PRODUCT_CSV_COLUMNS.join(',') +
  '\n' +
  '"Example Hair Oil","","Hair Care > Hair Oil","Lightweight daily hair oil.","Nourishes hair|Adds shine","Coconut oil, almond oil","Massage into scalp and hair.","Adults with dry hair","active","Almond","200","ml","1","EX-HO-ALM-200","","AE|SA"\n';

export type ImportRowIssue = { row: number; message: string };
export type ImportReport = {
  dryRun: boolean;
  rows: number;
  productsCreated: number;
  productsUpdated: number;
  skusCreated: number;
  skusUpdated: number;
  issues: ImportRowIssue[];
};

/**
 * Import products and SKUs from a spreadsheet saved as CSV — one row per SKU.
 * With dryRun = true nothing is saved: the file is only checked and a report is returned.
 * A row with a problem is skipped and reported; the other rows are still imported.
 */
export async function importProductsCsv(ctx: RequestContext, brandId: string, csvText: string, options: { dryRun?: boolean } = {}): Promise<ImportReport> {
  assertCan(ctx, 'product.import');
  const brand = await getBrand(ctx, brandId);
  const dryRun = options.dryRun ?? false;
  const report: ImportReport = { dryRun, rows: 0, productsCreated: 0, productsUpdated: 0, skusCreated: 0, skusUpdated: 0, issues: [] };

  const parsedCsv = Papa.parse<Record<string, string>>(csvText.replace(/^﻿/, ''), {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim().toLowerCase().replace(/[\s-]+/g, '_'),
  });
  if (!parsedCsv.meta.fields?.includes('product_name')) {
    throw new ValidationError('The file must have a "product_name" column. Download the template to see the expected columns.');
  }
  const rows = parsedCsv.data;
  if (rows.length > 5000) throw new ValidationError('Please import at most 5,000 rows at a time.');
  report.rows = rows.length;

  const db = await getDb();
  const knownCountries = new Set((await db.select({ code: schema.countries.code }).from(schema.countries)).map((c) => c.code));
  const seenGtins = new Map<string, number>();
  const seenSkuCodes = new Map<string, number>();
  const touchedProducts = new Set<string>();
  const dryRunNewProducts = new Set<string>();

  for (let i = 0; i < rows.length; i++) {
    const rowNumber = i + 2; // header is row 1
    const raw = rows[i];
    const get = (key: string) => (raw[key] ?? '').toString().trim();
    try {
      const productName = get('product_name');
      if (!productName) throw new ValidationError('product_name is empty.');
      const statusRaw = get('status').toLowerCase();
      const productInput = productInputSchema.safeParse({
        name: productName,
        subBrand: get('sub_brand'),
        category: get('category'),
        description: get('description'),
        benefits: get('benefits') ? get('benefits').split('|') : [],
        ingredients: get('ingredients'),
        directionsForUse: get('directions_for_use'),
        targetAudience: get('target_audience'),
        status: ['draft', 'active', 'discontinued'].includes(statusRaw) ? statusRaw : 'draft',
      });
      if (!productInput.success) throw zodToValidation(productInput.error);

      const skuCode = get('sku_code');
      let skuInput: z.output<typeof skuInputSchema> | null = null;
      if (skuCode) {
        const parsedSku = skuInputSchema.safeParse({
          skuCode,
          variantName: get('variant_name'),
          sizeValue: get('size_value'),
          sizeUnit: get('size_unit'),
          packQuantity: get('pack_quantity') || 1,
          gtin: get('gtin'),
        });
        if (!parsedSku.success) throw zodToValidation(parsedSku.error);
        skuInput = parsedSku.data;
        const lower = skuCode.toLowerCase();
        if (seenSkuCodes.has(lower)) throw new ValidationError(`sku_code "${skuCode}" also appears on row ${seenSkuCodes.get(lower)}.`);
        seenSkuCodes.set(lower, rowNumber);
        if (skuInput.gtin) {
          const check = checkGtin(skuInput.gtin);
          if (!check.valid) throw new ValidationError(`gtin: ${check.reason}`);
          if (seenGtins.has(check.gtin14)) throw new ValidationError(`gtin ${skuInput.gtin} also appears on row ${seenGtins.get(check.gtin14)}.`);
          seenGtins.set(check.gtin14, rowNumber);
        }
      } else if (get('gtin')) {
        throw new ValidationError('A gtin was given without a sku_code.');
      }

      const countries = get('countries')
        ? get('countries').split('|').map((c) => c.trim().toUpperCase()).filter(Boolean)
        : [];
      const unknownCountries = countries.filter((c) => !knownCountries.has(c));
      if (unknownCountries.length) throw new ValidationError(`Unknown country code(s): ${unknownCountries.join(', ')}. Use two-letter codes such as AE, SA, IN.`);

      // Counters are only added to the report once the row's transaction has committed.
      const delta = { productsCreated: 0, productsUpdated: 0, skusCreated: 0, skusUpdated: 0 };
      const productKey = productName.toLowerCase();
      const committedProductId = await db.transaction(async (tx) => {
        const existing = await tx
          .select()
          .from(p)
          .where(and(eq(p.brandId, brandId), sql`lower(${p.name}) = ${productKey}`))
          .limit(1);
        let productId: string | null;
        if (existing.length) {
          productId = existing[0].id;
          if (!touchedProducts.has(productId)) {
            delta.productsUpdated = 1;
            // Only columns that are filled in overwrite existing data; blanks never erase anything.
            const patch: Record<string, unknown> = {};
            for (const [key, value] of Object.entries(productInput.data)) {
              if (key === 'name') continue;
              if (key === 'status' && !statusRaw) continue;
              if (Array.isArray(value) ? value.length : value !== null) patch[key] = value;
            }
            if (!dryRun && Object.keys(patch).length) await tx.update(p).set({ ...patch, updatedAt: new Date() }).where(eq(p.id, productId));
          }
        } else if (dryRun) {
          // Nothing is saved in a dry run, so remember by name which products earlier rows would have created.
          productId = null;
          if (!dryRunNewProducts.has(productKey)) delta.productsCreated = 1;
        } else {
          delta.productsCreated = 1;
          const [created] = await tx
            .insert(p)
            .values({ ...productInput.data, organisationId: ctx.organisation.id, brandId, createdBy: ctx.user.id })
            .returning({ id: p.id });
          productId = created.id;
        }

        if (skuInput) {
          const existingSku = await tx
            .select()
            .from(k)
            .where(and(eq(k.organisationId, ctx.organisation.id), sql`lower(${k.skuCode}) = ${skuInput.skuCode.toLowerCase()}`))
            .limit(1);
          if (existingSku.length && existingSku[0].productId !== productId) {
            throw new ValidationError(`sku_code "${skuInput.skuCode}" already belongs to a different product.`);
          }
          if (skuInput.gtin) {
            const check = checkGtin(skuInput.gtin);
            if (check.valid) {
              const clash = await tx
                .select({ skuCode: k.skuCode, skuId: k.id })
                .from(ident)
                .innerJoin(k, eq(k.id, ident.skuId))
                .where(and(eq(ident.organisationId, ctx.organisation.id), eq(ident.type, 'gtin'), eq(ident.normalizedValue, check.gtin14)))
                .limit(1);
              if (clash.length && clash[0].skuId !== existingSku[0]?.id) {
                throw new ValidationError(`gtin ${skuInput.gtin} is already assigned to SKU ${clash[0].skuCode}.`);
              }
            }
          }
          if (existingSku.length) delta.skusUpdated = 1;
          else delta.skusCreated = 1;
          if (!dryRun && productId) {
            const variant = await findOrCreateVariant(tx, ctx.organisation.id, productId, skuInput.variantName, skuInput.sizeValue as number | null, skuInput.sizeUnit);
            let skuId: string;
            if (existingSku.length) {
              skuId = existingSku[0].id;
              await tx.update(k).set({ variantId: variant.id, packQuantity: skuInput.packQuantity, updatedAt: new Date() }).where(eq(k.id, skuId));
            } else {
              const [createdSku] = await tx
                .insert(k)
                .values({ organisationId: ctx.organisation.id, productId, variantId: variant.id, skuCode: skuInput.skuCode, packQuantity: skuInput.packQuantity })
                .returning({ id: k.id });
              skuId = createdSku.id;
            }
            if (skuInput.gtin) await attachGtin(tx, ctx.organisation.id, skuId, skuInput.gtin, 'import');
          }
        }

        if (!dryRun && productId && countries.length) {
          for (const countryCode of countries) {
            await tx
              .insert(schema.productMarketAvailability)
              .values({ organisationId: ctx.organisation.id, productId, countryCode })
              .onConflictDoNothing();
          }
        }
        return productId;
      });
      if (committedProductId) touchedProducts.add(committedProductId);
      else dryRunNewProducts.add(productKey);
      report.productsCreated += delta.productsCreated;
      report.productsUpdated += delta.productsUpdated;
      report.skusCreated += delta.skusCreated;
      report.skusUpdated += delta.skusUpdated;
    } catch (err) {
      if (err instanceof ValidationError) report.issues.push({ row: rowNumber, message: err.message });
      else throw err;
    }
  }

  if (!dryRun) {
    for (const productId of touchedProducts) {
      await db.execute(sql`delete from product_variants pv where pv.product_id = ${productId} and not exists (select 1 from skus s where s.variant_id = pv.id)`);
      await indexProduct(db, productId);
    }
    await audit(ctx, {
      action: 'product.imported',
      entityType: 'brand',
      entityId: brandId,
      summary: `Imported products for ${brand.name} from CSV: ${report.productsCreated} created, ${report.productsUpdated} updated, ${report.skusCreated + report.skusUpdated} SKUs, ${report.issues.length} row(s) skipped`,
      metadata: { ...report, issues: report.issues.slice(0, 50) },
    });
  }
  return report;
}

export async function catalogueStats(ctx: RequestContext) {
  assertCan(ctx, 'product.view');
  const db = await getDb();
  const scope = and(eq(p.organisationId, ctx.organisation.id), productScope(ctx));
  const [row] = await db
    .select({
      products: sql<number>`count(*)::int`,
      active: sql<number>`count(*) filter (where ${p.status} = 'active')::int`,
      withoutDescription: sql<number>`count(*) filter (where ${p.description} is null)::int`,
      withoutSku: sql<number>`count(*) filter (where not exists (select 1 from skus s where s.product_id = "products"."id"))::int`,
    })
    .from(p)
    .where(scope);
  const [skuRow] = await db
    .select({
      skus: sql<number>`count(*)::int`,
      withoutGtin: sql<number>`count(*) filter (where not exists (select 1 from product_identifiers i where i.sku_id = "skus"."id" and i.type = 'gtin'))::int`,
    })
    .from(k)
    .innerJoin(p, eq(p.id, k.productId))
    .where(scope);
  return { ...row, ...skuRow };
}

export { desc };
