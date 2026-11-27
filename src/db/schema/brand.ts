import { bigint, boolean, index, integer, jsonb, pgTable, primaryKey, text, uniqueIndex, uuid, vector } from 'drizzle-orm/pg-core';
import { createdAt, id, timestamptz, tsvector, updatedAt } from './_shared';
import { organisations, users } from './identity';

export const EMBEDDING_DIMENSIONS = 384;

export const brands = pgTable(
  'brands',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    slug: text().notNull(),
    tagline: text(),
    description: text(),
    website: text(),
    positioning: text(),
    personality: text(),
    toneOfVoice: text(),
    targetAudience: text(),
    visualGuidelines: text(),
    status: text().$type<'active' | 'archived'>().notNull().default('active'),
    /** True for clearly labelled demonstration data — never mixed with real brands in reports. */
    isDemo: boolean().notNull().default(false),
    createdBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex('brands_org_slug_uq').on(t.organisationId, t.slug)],
);

export const GUIDELINE_SECTIONS = [
  'identity',
  'positioning',
  'personality',
  'tone_of_voice',
  'target_audience',
  'visual',
  'approved_communication',
  'dos_and_donts',
  'language_and_localisation',
  'other',
] as const;
export type GuidelineSection = (typeof GUIDELINE_SECTIONS)[number];

/** A discrete brand rule or guideline section, with its own approval state. */
export const brandGuidelines = pgTable(
  'brand_guidelines',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    brandId: uuid()
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    section: text().$type<GuidelineSection>().notNull(),
    title: text().notNull(),
    body: text().notNull(),
    /** ISO country codes this guideline applies to; null = all markets. */
    marketCodes: jsonb().$type<string[] | null>(),
    sourceAssetId: uuid(),
    status: text().$type<'draft' | 'approved' | 'retired'>().notNull().default('draft'),
    version: integer().notNull().default(1),
    approvedBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    approvedAt: timestamptz(),
    createdBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('brand_guidelines_brand_idx').on(t.brandId)],
);

export const CLAIM_TYPES = [
  'benefit',
  'ingredient',
  'efficacy',
  'sensory',
  'comparative',
  'sustainability',
  'regulatory',
  'other',
] as const;
export type ClaimType = (typeof CLAIM_TYPES)[number];

export const CLAIM_STATUSES = ['approved', 'unverified', 'restricted'] as const;
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

/**
 * Claims the brand may (approved), may not (restricted) or has not yet decided to (unverified) make.
 * AI content generation may only use 'approved' claims valid for the target market.
 */
export const brandClaims = pgTable(
  'brand_claims',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    brandId: uuid()
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    /** Null = brand-level claim; otherwise specific to one product. */
    productId: uuid(),
    claimText: text().notNull(),
    claimType: text().$type<ClaimType>().notNull().default('benefit'),
    status: text().$type<ClaimStatus>().notNull().default('unverified'),
    restrictionReason: text(),
    /** ISO country codes where this status applies; null = all markets. */
    marketCodes: jsonb().$type<string[] | null>(),
    substantiation: text(),
    sourceAssetId: uuid(),
    reviewedBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    reviewedAt: timestamptz(),
    createdBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('brand_claims_brand_idx').on(t.brandId), index('brand_claims_product_idx').on(t.productId)],
);

export const ASSET_KINDS = [
  'brand_book',
  'guideline_document',
  'product_catalogue',
  'packaging',
  'creative_brief',
  'regulatory',
  'product_image',
  'lifestyle_image',
  'video',
  'other',
] as const;
export type AssetKind = (typeof ASSET_KINDS)[number];

export type AssetProcessingStatus = 'pending' | 'processing' | 'indexed' | 'stored_only' | 'failed';

/** Uploaded files: brand books, catalogues, packaging, images, videos. The file itself lives in object storage. */
export const brandAssets = pgTable(
  'brand_assets',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    brandId: uuid()
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    productId: uuid(),
    kind: text().$type<AssetKind>().notNull().default('other'),
    title: text().notNull(),
    originalFilename: text().notNull(),
    /** Detected from the file's content (magic bytes), not from what the browser claimed. */
    mimeType: text().notNull(),
    extension: text().notNull(),
    sizeBytes: bigint({ mode: 'number' }).notNull(),
    sha256: text().notNull(),
    storageKey: text().notNull(),
    /**
     * 'approved_source' = the brand manager confirmed this document is an authoritative brand source.
     * Text extracted from 'unverified' documents is always labelled unverified in search and generation.
     */
    trustLevel: text().$type<'approved_source' | 'unverified'>().notNull().default('unverified'),
    trustReviewedBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    trustReviewedAt: timestamptz(),
    processingStatus: text().$type<AssetProcessingStatus>().notNull().default('pending'),
    processingError: text(),
    pageCount: integer(),
    textChars: integer(),
    chunkCount: integer(),
    imageWidth: integer(),
    imageHeight: integer(),
    uploadedBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index('brand_assets_brand_idx').on(t.brandId),
    index('brand_assets_sha_idx').on(t.organisationId, t.sha256),
  ],
);

export const KNOWLEDGE_SOURCE_TYPES = ['asset', 'brand_profile', 'guideline', 'claim', 'product'] as const;
export type KnowledgeSourceType = (typeof KNOWLEDGE_SOURCE_TYPES)[number];

/**
 * The unified retrieval index of the Brand Knowledge Base. Every searchable passage — whether it came
 * from an uploaded document or from structured brand/product records — is one row here, with a trust
 * label and a pointer back to its source so results can always be cited.
 */
export const knowledgeChunks = pgTable(
  'knowledge_chunks',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    brandId: uuid()
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    productId: uuid(),
    sourceType: text().$type<KnowledgeSourceType>().notNull(),
    sourceId: uuid().notNull(),
    assetId: uuid().references(() => brandAssets.id, { onDelete: 'cascade' }),
    chunkIndex: integer().notNull().default(0),
    title: text().notNull(),
    /** Where in the source this passage is, e.g. "p. 12", "Slide 3", "Sheet: Claims". */
    locator: text(),
    pageNumber: integer(),
    content: text().notNull(),
    contentHash: text().notNull(),
    trust: text().$type<'approved' | 'unverified' | 'restricted'>().notNull().default('unverified'),
    lang: text().$type<'english' | 'arabic' | 'simple'>().notNull().default('english'),
    tsv: tsvector(),
    embedding: vector({ dimensions: EMBEDDING_DIMENSIONS }),
    embeddingModel: text(),
    createdAt: createdAt(),
  },
  (t) => [
    index('knowledge_chunks_scope_idx').on(t.organisationId, t.brandId),
    index('knowledge_chunks_source_idx').on(t.sourceType, t.sourceId),
    index('knowledge_chunks_tsv_idx').using('gin', t.tsv),
  ],
);

export const competitors = pgTable(
  'competitors',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    parentCompany: text(),
    website: text(),
    notes: text(),
    createdBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex('competitors_org_name_uq').on(t.organisationId, t.name)],
);

/** Which competitors matter for which brand. */
export const brandCompetitors = pgTable(
  'brand_competitors',
  {
    brandId: uuid()
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    competitorId: uuid()
      .notNull()
      .references(() => competitors.id, { onDelete: 'cascade' }),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.brandId, t.competitorId] })],
);

export type BookFont = { name: string; role: string; usage: string | null; link: string | null };
export type BookColour = { name: string; hex: string; usage: string | null };

/**
 * Brand books and launch books assembled inside the product from approved knowledge: fonts, colours,
 * key messages, approved claims, packshots and products. Approval refers to the exact content —
 * editing an approved book returns it to draft.
 */
export const brandBooks = pgTable(
  'brand_books',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    brandId: uuid()
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    kind: text().$type<'brand_book' | 'launch_book'>().notNull().default('brand_book'),
    title: text().notNull(),
    subtitle: text(),
    launchDate: text(),
    marketCodes: jsonb().$type<string[]>(),
    overview: text(),
    audience: text(),
    keyMessages: text(),
    toneOfVoice: text(),
    dosAndDonts: text(),
    fonts: jsonb().$type<BookFont[]>().notNull().default([]),
    colours: jsonb().$type<BookColour[]>().notNull().default([]),
    claimIds: jsonb().$type<string[]>().notNull().default([]),
    assetIds: jsonb().$type<string[]>().notNull().default([]),
    productIds: jsonb().$type<string[]>().notNull().default([]),
    status: text().$type<'draft' | 'approved'>().notNull().default('draft'),
    version: integer().notNull().default(1),
    approvedBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    approvedAt: timestamptz(),
    createdBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('brand_books_brand_idx').on(t.brandId)],
);
