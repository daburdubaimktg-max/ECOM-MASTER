import { boolean, date, index, integer, jsonb, numeric, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { createdAt, id, timestamptz, updatedAt } from './_shared';
import type { CollectionMethod, Confidence, DataClass } from './_shared';
import { brands, competitors } from './brand';
import { skus } from './catalogue';
import { organisations, users } from './identity';
import { marketplaces } from './reference';

/**
 * DIGITAL SHELF TABLES — schema is in place from the first build so later stages plug in without
 * restructuring. Features that write to them arrive in Stages 3–4 (see docs/product/09-roadmap.md).
 */

/** A configured way of obtaining marketplace data (an API connection, a data provider, or manual uploads). */
export const dataSources = pgTable(
  'data_sources',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    method: text().$type<CollectionMethod>().notNull(),
    provider: text().notNull(),
    status: text().$type<'active' | 'paused' | 'not_configured'>().notNull().default('not_configured'),
    /** Non-secret settings only. Credentials live in environment variables / a secrets manager, never here. */
    configuration: jsonb().$type<Record<string, unknown>>().notNull().default({}),
    notes: text(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('data_sources_org_idx').on(t.organisationId)],
);

export const competitorProducts = pgTable(
  'competitor_products',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    competitorId: uuid()
      .notNull()
      .references(() => competitors.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    brandText: text(),
    category: text(),
    gtin: text(),
    /** Pack size, so prices can be compared per 100 ml / 100 g. */
    sizeValue: numeric({ precision: 12, scale: 3, mode: 'number' }),
    sizeUnit: text(),
    packQuantity: integer().notNull().default(1),
    /** Our SKU this product most directly competes with. */
    comparableSkuId: uuid().references(() => skus.id, { onDelete: 'set null' }),
    notes: text(),
    createdBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('competitor_products_competitor_idx').on(t.competitorId)],
);

/** One catalogue item on one marketplace (e.g. an ASIN on Amazon.ae) — ours or a competitor's. */
export const marketplaceProducts = pgTable(
  'marketplace_products',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    marketplaceId: uuid()
      .notNull()
      .references(() => marketplaces.id, { onDelete: 'cascade' }),
    /** The marketplace's own identifier (ASIN, item id, product code). */
    externalId: text().notNull(),
    url: text(),
    ownership: text().$type<'own' | 'competitor' | 'unknown'>().notNull().default('unknown'),
    brandId: uuid().references(() => brands.id, { onDelete: 'set null' }),
    competitorProductId: uuid().references(() => competitorProducts.id, { onDelete: 'set null' }),
    lastKnownTitle: text(),
    lastKnownBrandText: text(),
    firstSeenAt: timestamptz(),
    lastSeenAt: timestamptz(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('marketplace_products_uq').on(t.organisationId, t.marketplaceId, t.externalId)],
);

/**
 * SKU mapping: links our SKU to a marketplace product with a confidence score.
 * Suggested matches are never merged automatically when identifiers or attributes conflict —
 * a person confirms or rejects them.
 */
export const skuMarketplaceMatches = pgTable(
  'sku_marketplace_matches',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    skuId: uuid()
      .notNull()
      .references(() => skus.id, { onDelete: 'cascade' }),
    marketplaceProductId: uuid()
      .notNull()
      .references(() => marketplaceProducts.id, { onDelete: 'cascade' }),
    matchMethod: text().$type<'gtin' | 'manufacturer_sku' | 'attributes' | 'manual'>().notNull(),
    confidence: numeric({ precision: 4, scale: 3, mode: 'number' }).notNull(),
    status: text().$type<'suggested' | 'confirmed' | 'rejected'>().notNull().default('suggested'),
    /** Which attributes agreed and which conflicted. */
    evidence: jsonb().$type<Record<string, unknown>>().notNull().default({}),
    decidedBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    decidedAt: timestamptz(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('sku_marketplace_matches_uq').on(t.skuId, t.marketplaceProductId)],
);

/** A listing we monitor: a marketplace product, the seller/offer context and how often to check it. */
export const productListings = pgTable(
  'product_listings',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    marketplaceProductId: uuid()
      .notNull()
      .references(() => marketplaceProducts.id, { onDelete: 'cascade' }),
    countryCode: text().notNull(),
    sellerName: text(),
    sellerType: text().$type<'brand' | 'distributor' | 'marketplace_first_party' | 'third_party' | 'unknown'>(),
    monitoringFrequency: text().$type<'daily' | 'weekly' | 'monthly' | 'manual'>().notNull().default('weekly'),
    isActive: boolean().notNull().default(true),
    dataSourceId: uuid().references(() => dataSources.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('product_listings_mp_product_idx').on(t.marketplaceProductId)],
);

export type ProcessedListing = {
  title?: string | null;
  description?: string | null;
  bullets?: string[];
  attributes?: Record<string, string>;
  images?: { url: string; position: number; width?: number; height?: number }[];
  videos?: { url: string }[];
  enhancedContent?: { present: boolean | null; modules?: string[] };
  seller?: string | null;
  rank?: { category?: string; position?: number }[] | null;
};

/**
 * One observation of a listing at a point in time. Never updated: every collection adds a row.
 * `outcome` keeps "we could not observe it" separate from "it is unavailable".
 */
export const listingSnapshots = pgTable(
  'listing_snapshots',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    listingId: uuid()
      .notNull()
      .references(() => productListings.id, { onDelete: 'cascade' }),
    collectedAt: timestamptz().notNull(),
    dataSourceId: uuid().references(() => dataSources.id, { onDelete: 'set null' }),
    collectionMethod: text().$type<CollectionMethod>().notNull(),
    collectionJobId: uuid(),
    dataConfidence: text().$type<Confidence>().notNull(),
    outcome: text().$type<'observed' | 'not_found' | 'blocked' | 'error'>().notNull().default('observed'),
    contentHash: text(),
    /** The observation exactly as received. */
    raw: jsonb().$type<Record<string, unknown>>().notNull(),
    /** The normalised view derived from `raw` by processor `processorVersion`. */
    processed: jsonb().$type<ProcessedListing>(),
    processorVersion: text(),
    createdAt: createdAt(),
  },
  (t) => [index('listing_snapshots_listing_time_idx').on(t.listingId, t.collectedAt)],
);

/** Images seen on a listing ("Product Images" in the specification), with their assessment. */
export const listingImages = pgTable(
  'listing_images',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    listingId: uuid()
      .notNull()
      .references(() => productListings.id, { onDelete: 'cascade' }),
    snapshotId: uuid().references(() => listingSnapshots.id, { onDelete: 'cascade' }),
    position: integer().notNull(),
    role: text().$type<'main' | 'secondary' | 'video_thumbnail'>().notNull(),
    url: text(),
    storageKey: text(),
    width: integer(),
    height: integer(),
    sizeBytes: integer(),
    contentHash: text(),
    assessment: jsonb().$type<Record<string, unknown>>(),
    assessmentDataClass: text().$type<DataClass>(),
    createdAt: createdAt(),
  },
  (t) => [index('listing_images_listing_idx').on(t.listingId)],
);

export const priceObservations = pgTable(
  'price_observations',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    listingId: uuid()
      .notNull()
      .references(() => productListings.id, { onDelete: 'cascade' }),
    snapshotId: uuid().references(() => listingSnapshots.id, { onDelete: 'set null' }),
    observedAt: timestamptz().notNull(),
    currencyCode: text().notNull(),
    listPrice: numeric({ precision: 14, scale: 2, mode: 'number' }),
    salePrice: numeric({ precision: 14, scale: 2, mode: 'number' }),
    promotionText: text(),
    sellerName: text(),
    collectionMethod: text().$type<CollectionMethod>().notNull(),
    dataSourceId: uuid().references(() => dataSources.id, { onDelete: 'set null' }),
    dataConfidence: text().$type<Confidence>().notNull(),
    raw: jsonb().$type<Record<string, unknown>>(),
    createdAt: createdAt(),
  },
  (t) => [index('price_observations_listing_time_idx').on(t.listingId, t.observedAt)],
);

export const availabilityObservations = pgTable(
  'availability_observations',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    listingId: uuid()
      .notNull()
      .references(() => productListings.id, { onDelete: 'cascade' }),
    snapshotId: uuid().references(() => listingSnapshots.id, { onDelete: 'set null' }),
    observedAt: timestamptz().notNull(),
    status: text().$type<'in_stock' | 'low_stock' | 'out_of_stock' | 'delisted' | 'unknown'>().notNull(),
    rawText: text(),
    collectionMethod: text().$type<CollectionMethod>().notNull(),
    dataSourceId: uuid().references(() => dataSources.id, { onDelete: 'set null' }),
    dataConfidence: text().$type<Confidence>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('availability_observations_listing_time_idx').on(t.listingId, t.observedAt)],
);

/** Rating summaries over time ("Ratings"). `availability` records when the integration cannot provide ratings at all. */
export const ratingObservations = pgTable(
  'rating_observations',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    listingId: uuid()
      .notNull()
      .references(() => productListings.id, { onDelete: 'cascade' }),
    snapshotId: uuid().references(() => listingSnapshots.id, { onDelete: 'set null' }),
    observedAt: timestamptz().notNull(),
    availability: text().$type<'observed' | 'unavailable_through_integration'>().notNull().default('observed'),
    averageRating: numeric({ precision: 3, scale: 2, mode: 'number' }),
    ratingCount: integer(),
    reviewCount: integer(),
    distribution: jsonb().$type<Record<string, number>>(),
    collectionMethod: text().$type<CollectionMethod>().notNull(),
    dataSourceId: uuid().references(() => dataSources.id, { onDelete: 'set null' }),
    dataConfidence: text().$type<Confidence>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('rating_observations_listing_time_idx').on(t.listingId, t.observedAt)],
);

/**
 * Individual reviews. Privacy by design: no reviewer names or profile links are stored — only a one-way
 * hash so duplicates can be detected.
 */
export const reviews = pgTable(
  'reviews',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    listingId: uuid()
      .notNull()
      .references(() => productListings.id, { onDelete: 'cascade' }),
    externalReviewId: text().notNull(),
    rating: numeric({ precision: 2, scale: 1, mode: 'number' }),
    title: text(),
    body: text(),
    language: text(),
    reviewedOn: date(),
    verifiedPurchase: boolean(),
    helpfulVotes: integer(),
    reviewerHash: text(),
    /** AI-assessed fields below are always labelled as such in the interface. */
    sentiment: text().$type<'positive' | 'neutral' | 'negative' | 'mixed'>(),
    /** What the review is really about, so delivery complaints are not counted as product complaints. */
    subject: text().$type<'product' | 'seller' | 'delivery' | 'mixed'>(),
    analysisVersion: text(),
    collectedAt: timestamptz().notNull(),
    collectionMethod: text().$type<CollectionMethod>().notNull(),
    dataSourceId: uuid().references(() => dataSources.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex('reviews_listing_external_uq').on(t.listingId, t.externalReviewId),
    index('reviews_listing_date_idx').on(t.listingId, t.reviewedOn),
  ],
);

/** Configurable review themes (efficacy, fragrance, texture, packaging, value, authenticity, delivery…). */
export const reviewThemes = pgTable(
  'review_themes',
  {
    id: id(),
    /** Null = system default theme available to every organisation. */
    organisationId: uuid().references(() => organisations.id, { onDelete: 'cascade' }),
    key: text().notNull(),
    label: text().notNull(),
    description: text(),
    categoryScope: text(),
    createdAt: createdAt(),
  },
  (t) => [index('review_themes_org_idx').on(t.organisationId)],
);

export const reviewThemeAssignments = pgTable(
  'review_theme_assignments',
  {
    reviewId: uuid()
      .notNull()
      .references(() => reviews.id, { onDelete: 'cascade' }),
    themeId: uuid()
      .notNull()
      .references(() => reviewThemes.id, { onDelete: 'cascade' }),
    polarity: text().$type<'positive' | 'negative' | 'neutral'>().notNull(),
    excerpt: text(),
    confidence: text().$type<Confidence>(),
    analysisVersion: text(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.reviewId, t.themeId] })],
);

export const customerQuestions = pgTable(
  'customer_questions',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    listingId: uuid()
      .notNull()
      .references(() => productListings.id, { onDelete: 'cascade' }),
    externalQuestionId: text().notNull(),
    questionText: text().notNull(),
    language: text(),
    askedOn: date(),
    status: text().$type<'unanswered' | 'answered'>().notNull().default('unanswered'),
    topic: text(),
    collectedAt: timestamptz().notNull(),
    collectionMethod: text().$type<CollectionMethod>().notNull(),
    dataSourceId: uuid().references(() => dataSources.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('customer_questions_listing_external_uq').on(t.listingId, t.externalQuestionId)],
);

export const customerAnswers = pgTable(
  'customer_answers',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    questionId: uuid()
      .notNull()
      .references(() => customerQuestions.id, { onDelete: 'cascade' }),
    answerText: text().notNull(),
    /** 'observed' answers were seen on the marketplace; 'suggested' answers are drafts awaiting human approval. */
    origin: text().$type<'observed' | 'suggested'>().notNull(),
    answeredBy: text().$type<'brand' | 'seller' | 'customer' | 'unknown'>(),
    answeredOn: date(),
    approvalStatus: text().$type<'draft' | 'approved' | 'rejected' | 'posted'>(),
    /** Knowledge-base passages the suggestion was grounded in. */
    sourceChunkIds: jsonb().$type<string[]>().notNull().default([]),
    createdBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    approvedBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
  },
  (t) => [index('customer_answers_question_idx').on(t.questionId)],
);
