import { boolean, index, integer, jsonb, numeric, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createdAt, id, updatedAt } from './_shared';
import { brandAssets, brands } from './brand';
import { organisations, users } from './identity';

/** The parent product, e.g. "Nourishing Hair Oil". Sellable units are SKUs underneath it. */
export const products = pgTable(
  'products',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    brandId: uuid()
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    subBrand: text(),
    category: text(),
    description: text(),
    benefits: jsonb().$type<string[]>().notNull().default([]),
    ingredients: text(),
    directionsForUse: text(),
    warnings: text(),
    targetAudience: text(),
    status: text().$type<'draft' | 'active' | 'discontinued'>().notNull().default('draft'),
    isDemo: boolean().notNull().default(false),
    createdBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('products_brand_idx').on(t.brandId), index('products_org_idx').on(t.organisationId)],
);

/** A variant of a product: a scent, formulation or size (e.g. "Almond, 200 ml"). */
export const productVariants = pgTable(
  'product_variants',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    productId: uuid()
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    sizeValue: numeric({ precision: 12, scale: 3 }),
    sizeUnit: text(),
    attributes: jsonb().$type<Record<string, string>>().notNull().default({}),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('product_variants_product_idx').on(t.productId)],
);

/** A sellable unit. A multipack of a variant is its own SKU with packQuantity > 1 and its own barcode. */
export const skus = pgTable(
  'skus',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    productId: uuid()
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    variantId: uuid()
      .notNull()
      .references(() => productVariants.id, { onDelete: 'cascade' }),
    /** Manufacturer SKU code — unique within the organisation. */
    skuCode: text().notNull(),
    packQuantity: integer().notNull().default(1),
    status: text().$type<'active' | 'planned' | 'discontinued'>().notNull().default('active'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex('skus_org_code_uq').on(t.organisationId, t.skuCode),
    index('skus_product_idx').on(t.productId),
  ],
);

export const IDENTIFIER_TYPES = ['gtin', 'asin', 'marketplace_sku', 'manufacturer_part_number', 'other'] as const;
export type IdentifierType = (typeof IDENTIFIER_TYPES)[number];

/** Barcodes and marketplace identifiers for a SKU. GTINs (EAN/UPC) are stored normalised to 14 digits. */
export const productIdentifiers = pgTable(
  'product_identifiers',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    skuId: uuid()
      .notNull()
      .references(() => skus.id, { onDelete: 'cascade' }),
    type: text().$type<IdentifierType>().notNull(),
    /** As entered. */
    value: text().notNull(),
    /** GTIN padded to 14 digits; other identifier types trimmed and upper-cased. */
    normalizedValue: text().notNull(),
    /** For GTINs: the GS1 check digit was verified. Says nothing about GS1 registration. */
    checkDigitValid: boolean(),
    marketplaceId: uuid(),
    countryCode: text(),
    source: text().$type<'manual' | 'import' | 'api'>().notNull().default('manual'),
    createdAt: createdAt(),
  },
  (t) => [
    index('product_identifiers_sku_idx').on(t.skuId),
    index('product_identifiers_lookup_idx').on(t.organisationId, t.type, t.normalizedValue),
    // One barcode can only belong to one SKU inside an organisation.
    uniqueIndex('product_identifiers_gtin_uq')
      .on(t.organisationId, t.normalizedValue)
      .where(sql`${t.type} = 'gtin'`),
  ],
);

export const productAttributes = pgTable(
  'product_attributes',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    productId: uuid()
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    /** Null = applies to every SKU of the product. */
    skuId: uuid().references(() => skus.id, { onDelete: 'cascade' }),
    key: text().notNull(),
    value: text().notNull(),
    unit: text(),
    locale: text().notNull().default('en'),
    source: text().$type<'manual' | 'import' | 'extracted'>().notNull().default('manual'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('product_attributes_product_idx').on(t.productId)],
);

export const productMarketAvailability = pgTable(
  'product_market_availability',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    productId: uuid()
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    countryCode: text().notNull(),
    status: text().$type<'available' | 'planned' | 'discontinued'>().notNull().default('available'),
    notes: text(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('product_market_availability_uq').on(t.productId, t.countryCode)],
);

/** Links an uploaded asset (image, video, packaging file) to a product in a given role. */
export const productMedia = pgTable(
  'product_media',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    productId: uuid()
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    skuId: uuid().references(() => skus.id, { onDelete: 'set null' }),
    assetId: uuid()
      .notNull()
      .references(() => brandAssets.id, { onDelete: 'cascade' }),
    role: text()
      .$type<'main_image' | 'secondary_image' | 'lifestyle' | 'infographic' | 'packaging' | 'video' | 'other'>()
      .notNull()
      .default('other'),
    sortOrder: integer().notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [index('product_media_product_idx').on(t.productId)],
);
