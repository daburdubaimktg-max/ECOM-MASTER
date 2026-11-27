import { boolean, date, index, integer, jsonb, numeric, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createdAt, id, timestamptz, updatedAt } from './_shared';
import type { Confidence } from './_shared';
import { brands } from './brand';
import { organisations, users } from './identity';

export const countries = pgTable('countries', {
  /** ISO 3166-1 alpha-2. */
  code: text().primaryKey(),
  name: text().notNull(),
  region: text().notNull(),
  currencyCode: text(),
  languages: jsonb().$type<string[]>().notNull().default([]),
  /** One of the nine launch markets researched first. */
  isInitialMarket: boolean().notNull().default(false),
});

/** One row per research data file loaded, so every record can be traced to the file and date it came from. */
export const researchImports = pgTable(
  'research_imports',
  {
    id: id(),
    kind: text().$type<'marketplaces' | 'requirements'>().notNull(),
    path: text().notNull(),
    sha256: text().notNull(),
    researchDate: date(),
    recordCount: integer().notNull().default(0),
    importedAt: createdAt(),
  },
  (t) => [uniqueIndex('research_imports_kind_sha_uq').on(t.kind, t.sha256)],
);

export const countryResearch = pgTable(
  'country_research',
  {
    id: id(),
    countryCode: text()
      .notNull()
      .references(() => countries.code),
    researchDate: date().notNull(),
    summary: text().notNull(),
    keyFacts: jsonb()
      .$type<{ fact: string; nature: string; source_url: string; source_name: string; source_date: string }[]>()
      .notNull()
      .default([]),
    rankingMethodNote: text(),
    isCurrent: boolean().notNull().default(true),
    importId: uuid().references(() => researchImports.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
  },
  (t) => [index('country_research_country_idx').on(t.countryCode)],
);

export const PLATFORM_CATEGORIES = [
  'general_marketplace',
  'cross_border_marketplace',
  'beauty_specialist',
  'pharmacy_health',
  'grocery_supermarket',
  'quick_commerce',
  'department_store_fashion',
  'social_commerce',
  'd2c_brand_site',
  'other',
] as const;
export type PlatformCategory = (typeof PLATFORM_CATEGORIES)[number];

export const MARKETPLACE_TYPES = [
  'third_party_marketplace',
  'first_party_retailer',
  'hybrid_1p_3p',
  'delivery_aggregator',
  'social_commerce',
  'd2c_brand_site',
] as const;
export type MarketplaceType = (typeof MARKETPLACE_TYPES)[number];

export const DATA_ACCESS_METHODS = [
  'official_api',
  'seller_portal_export',
  'third_party_data_provider',
  'public_web_pages',
  'manual_only',
  'unknown',
] as const;
export type DataAccessMethod = (typeof DATA_ACCESS_METHODS)[number];

export type PriorityCriterion =
  | 'ecommerce_significance'
  | 'beauty_category_relevance'
  | 'consumer_reach'
  | 'brand_competitor_coverage'
  | 'data_integration_feasibility';

export type PriorityScores = Record<PriorityCriterion, { score: number; note: string }>;

/**
 * A retail platform in one country. Rows with organisationId = null are the shared, research-backed
 * reference database; an organisation can add its own platforms on top.
 */
export const marketplaces = pgTable(
  'marketplaces',
  {
    id: id(),
    organisationId: uuid().references(() => organisations.id, { onDelete: 'cascade' }),
    slug: text().notNull(),
    /** Groups country sites of the same retailer (e.g. 'amazon') and links to its requirements library. */
    familyKey: text(),
    name: text().notNull(),
    countryCode: text()
      .notNull()
      .references(() => countries.code),
    region: text().notNull(),
    website: text(),
    operator: text(),
    status: text().$type<'active' | 'winding_down' | 'unclear'>().notNull().default('active'),
    platformCategory: text().$type<PlatformCategory>().notNull(),
    marketplaceType: text().$type<MarketplaceType>().notNull(),
    beautyRelevance: text().$type<'high' | 'medium' | 'low'>(),
    beautyRelevanceNote: text(),
    pharmacyRelevance: text().$type<'high' | 'medium' | 'low' | 'none'>(),
    pharmacyRelevanceNote: text(),
    /** tier_1 = market-shaping, tier_2 = significant, tier_3 = niche or emerging. An estimate, not a market share. */
    estimatedMarketImportance: text().$type<'tier_1' | 'tier_2' | 'tier_3'>(),
    marketImportanceNote: text(),
    competitorPresenceLevel: text().$type<'high' | 'medium' | 'low' | 'unknown'>(),
    competitorPresenceNote: text(),
    productCoverageNote: text(),
    dataAccessMethod: text().$type<DataAccessMethod>(),
    publicSellerApi: text().$type<'yes' | 'no' | 'unknown'>(),
    apiNote: text(),
    apiDocsUrl: text(),
    dataCollectionFeasibility: text().$type<'high' | 'medium' | 'low'>(),
    dataCollectionFeasibilityNote: text(),
    priorityScores: jsonb().$type<PriorityScores>(),
    /** Calculated: sum(criterion score x weight). Reproducible from priorityScores and the published weights. */
    weightedScore: numeric({ precision: 4, scale: 2, mode: 'number' }),
    priorityRank: integer(),
    isTop3: boolean().notNull().default(false),
    priorityRationale: text(),
    confidence: text().$type<Confidence>(),
    confidenceNote: text(),
    lastResearchDate: date(),
    origin: text().$type<'research' | 'user_added'>().notNull().default('research'),
    createdBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index('marketplaces_country_idx').on(t.countryCode),
    uniqueIndex('marketplaces_reference_uq')
      .on(t.countryCode, t.slug)
      .where(sql`${t.organisationId} is null`),
    uniqueIndex('marketplaces_org_uq')
      .on(t.organisationId, t.countryCode, t.slug)
      .where(sql`${t.organisationId} is not null`),
  ],
);

/** Evidence behind a platform's reach or importance — each row is one sourced statement. */
export const marketplaceEvidence = pgTable(
  'marketplace_evidence',
  {
    id: id(),
    marketplaceId: uuid()
      .notNull()
      .references(() => marketplaces.id, { onDelete: 'cascade' }),
    claim: text().notNull(),
    metricType: text(),
    value: text(),
    period: text(),
    /** official_statistic | company_reported | third_party_estimate | analyst_estimate */
    nature: text().notNull(),
    sourceUrl: text(),
    sourceName: text(),
    sourceDate: text(),
  },
  (t) => [index('marketplace_evidence_mp_idx').on(t.marketplaceId)],
);

export const marketplaceSources = pgTable(
  'marketplace_sources',
  {
    id: id(),
    marketplaceId: uuid()
      .notNull()
      .references(() => marketplaces.id, { onDelete: 'cascade' }),
    url: text().notNull(),
    title: text(),
    publisher: text(),
    publishedDate: text(),
    accessedDate: text(),
  },
  (t) => [index('marketplace_sources_mp_idx').on(t.marketplaceId)],
);

/** Full copy of each research record as imported — the history of marketplace research over time. */
export const marketplaceResearchSnapshots = pgTable(
  'marketplace_research_snapshots',
  {
    id: id(),
    marketplaceId: uuid()
      .notNull()
      .references(() => marketplaces.id, { onDelete: 'cascade' }),
    researchDate: date().notNull(),
    importId: uuid().references(() => researchImports.id, { onDelete: 'set null' }),
    data: jsonb().$type<Record<string, unknown>>().notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('marketplace_research_snapshots_mp_idx').on(t.marketplaceId, t.researchDate)],
);

/** An organisation's own decisions about a platform (the reference research itself is never edited). */
export const marketplaceSettings = pgTable(
  'marketplace_settings',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    marketplaceId: uuid()
      .notNull()
      .references(() => marketplaces.id, { onDelete: 'cascade' }),
    monitoringStatus: text().$type<'not_monitored' | 'planned' | 'active'>().notNull().default('not_monitored'),
    notes: text(),
    updatedBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex('marketplace_settings_uq').on(t.organisationId, t.marketplaceId)],
);

/** Whether a brand is sold on a platform and through which route — this decides which data methods are possible. */
export const brandMarketplacePresence = pgTable(
  'brand_marketplace_presence',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    brandId: uuid()
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    marketplaceId: uuid()
      .notNull()
      .references(() => marketplaces.id, { onDelete: 'cascade' }),
    presence: text().$type<'present' | 'absent' | 'unknown'>().notNull().default('unknown'),
    sellingModel: text()
      .$type<'own_seller_account' | 'first_party_vendor' | 'distributor' | 'unknown'>()
      .notNull()
      .default('unknown'),
    notes: text(),
    updatedBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex('brand_marketplace_presence_uq').on(t.brandId, t.marketplaceId)],
);

export const marketplaceCategories = pgTable(
  'marketplace_categories',
  {
    id: id(),
    marketplaceId: uuid()
      .notNull()
      .references(() => marketplaces.id, { onDelete: 'cascade' }),
    parentId: uuid(),
    externalId: text(),
    name: text().notNull(),
    path: text().notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('marketplace_categories_mp_idx').on(t.marketplaceId)],
);

/**
 * A version of one retailer's content requirements. Loading new research never edits an old version:
 * it adds a new one and marks the previous one 'superseded', so listings can be re-checked against
 * exactly the rules that applied at a point in time.
 */
export const requirementSets = pgTable(
  'requirement_sets',
  {
    id: id(),
    familyKey: text().notNull(),
    marketplaceName: text().notNull(),
    version: integer().notNull(),
    status: text().$type<'current' | 'superseded'>().notNull().default('current'),
    researchDate: date(),
    appliesToCountryCodes: jsonb().$type<string[]>().notNull().default([]),
    categoryScope: text(),
    languages: jsonb()
      .$type<{ country_code: string; languages: string[]; note?: string; source_url?: string }[]>()
      .notNull()
      .default([]),
    enhancedContent: jsonb().$type<Record<string, unknown>>(),
    publicDocumentationLevel: text(),
    howBrandsDeliverContent: text(),
    nonOfficialTerms: jsonb().$type<{ term: string; what_it_actually_is: string; source_url?: string }[]>(),
    limitations: text(),
    importId: uuid().references(() => researchImports.id, { onDelete: 'set null' }),
    supersededAt: timestamptz(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('requirement_sets_family_version_uq').on(t.familyKey, t.version)],
);

export const REQUIREMENT_AREAS = [
  'title',
  'description',
  'bullets',
  'attributes',
  'identifiers',
  'images_main',
  'images_secondary',
  'video',
  'enhanced_content',
  'seo',
  'variants',
  'language',
  'approval',
  'restricted_claims',
] as const;
export type RequirementArea = (typeof REQUIREMENT_AREAS)[number];

export const requirementRules = pgTable(
  'requirement_rules',
  {
    id: id(),
    setId: uuid()
      .notNull()
      .references(() => requirementSets.id, { onDelete: 'cascade' }),
    ruleKey: text().notNull(),
    area: text().$type<RequirementArea>().notNull(),
    requirement: text().notNull(),
    ruleType: text().notNull(),
    value: numeric({ mode: 'number' }),
    unit: text(),
    severity: text().$type<'mandatory' | 'recommended' | 'informational'>().notNull(),
    appliesToCountryCodes: jsonb().$type<string[]>().notNull().default([]),
    appliesToCategory: text(),
    sellerType: text(),
    effectiveDate: text(),
    sourceUrl: text(),
    sourceTitle: text(),
    sourceDate: text(),
    /** official_document | secondary_quote | unverified */
    verification: text().notNull(),
    notes: text(),
  },
  (t) => [index('requirement_rules_set_idx').on(t.setId)],
);

/** Official listing-quality scores or diagnostics a retailer really exposes, and how they can be accessed. */
export const marketplaceQualitySignals = pgTable(
  'marketplace_quality_signals',
  {
    id: id(),
    setId: uuid()
      .notNull()
      .references(() => requirementSets.id, { onDelete: 'cascade' }),
    officialName: text().notNull(),
    whatItMeasures: text(),
    components: text(),
    /** seller_portal_only | downloadable_report | api | none */
    accessMethod: text(),
    apiReferenceUrl: text(),
    whoCanAccess: text(),
    sourceUrl: text(),
    verification: text(),
    notes: text(),
  },
  (t) => [index('marketplace_quality_signals_set_idx').on(t.setId)],
);
