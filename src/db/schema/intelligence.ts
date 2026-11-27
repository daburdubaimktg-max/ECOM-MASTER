import { date, index, integer, jsonb, numeric, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { createdAt, id, timestamptz, updatedAt } from './_shared';
import type { CollectionMethod, Confidence, DataClass } from './_shared';
import { brands } from './brand';
import { products, skus } from './catalogue';
import { organisations, users } from './identity';
import { marketplaces, requirementSets } from './reference';
import { dataSources, listingSnapshots, productListings } from './shelf';

/**
 * INTELLIGENCE TABLES — scoring, content versions, approvals, recommendations and tasks.
 * Schema is in place from the first build; the features arrive in Stages 4–5.
 */

export type ScoreWeights = Record<string, number>;

/**
 * Versioned scoring configuration. A stored score always points at the exact rule version that
 * produced it, so it can be reproduced from stored inputs.
 */
export const scoringRules = pgTable(
  'scoring_rules',
  {
    id: id(),
    /** Null = system default. */
    organisationId: uuid().references(() => organisations.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    scoreType: text().$type<'internal_lqs' | 'competitive_shelf' | 'marketplace_priority'>().notNull(),
    version: integer().notNull(),
    status: text().$type<'draft' | 'active' | 'retired'>().notNull().default('draft'),
    /** Optional scoping: a marketplace family (e.g. 'amazon') and/or a product category. */
    familyKey: text(),
    category: text(),
    /** Internal weights — NOT official retailer weightings. */
    weights: jsonb().$type<ScoreWeights>().notNull(),
    configuration: jsonb().$type<Record<string, unknown>>().notNull().default({}),
    notes: text(),
    createdBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
  },
  (t) => [index('scoring_rules_lookup_idx').on(t.scoreType, t.status)],
);

export type ScoreComponent = {
  dimension: string;
  weight: number;
  score: number | null;
  rawAssessment: string;
  missingInformation: string[];
  deductions: { reason: string; points: number; evidence?: string }[];
  recommendedAction: string | null;
  dataClass: DataClass;
  confidence: Confidence;
};

/** Calculated 0–100 scores with their full explanation. Never overwritten: each calculation is a new row. */
export const internalQualityScores = pgTable(
  'internal_quality_scores',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    listingId: uuid()
      .notNull()
      .references(() => productListings.id, { onDelete: 'cascade' }),
    snapshotId: uuid()
      .notNull()
      .references(() => listingSnapshots.id, { onDelete: 'cascade' }),
    scoreType: text().$type<'internal_lqs' | 'competitive_shelf'>().notNull().default('internal_lqs'),
    scoringRuleId: uuid()
      .notNull()
      .references(() => scoringRules.id),
    requirementSetId: uuid().references(() => requirementSets.id, { onDelete: 'set null' }),
    score: numeric({ precision: 5, scale: 2, mode: 'number' }),
    confidence: text().$type<Confidence>().notNull(),
    components: jsonb().$type<ScoreComponent[]>().notNull(),
    /** Hash of the exact inputs, so the same inputs + rule version can be shown to give the same score. */
    inputsHash: text().notNull(),
    calculatedAt: timestamptz().notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('internal_quality_scores_listing_idx').on(t.listingId, t.calculatedAt)],
);

/**
 * Scores published by the marketplace itself. A row exists only when the score was actually obtained
 * through an authorised route — the application never fabricates one.
 */
export const officialQualityScores = pgTable(
  'official_quality_scores',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    listingId: uuid()
      .notNull()
      .references(() => productListings.id, { onDelete: 'cascade' }),
    marketplaceId: uuid()
      .notNull()
      .references(() => marketplaces.id),
    /** The official name of the signal, exactly as the marketplace calls it. */
    signalName: text().notNull(),
    score: numeric({ precision: 6, scale: 2, mode: 'number' }),
    scoreText: text(),
    components: jsonb().$type<Record<string, unknown>>(),
    issues: jsonb().$type<{ code?: string; description: string; severity?: string }[]>(),
    suggestedActions: jsonb().$type<string[]>(),
    observedAt: timestamptz().notNull(),
    collectionMethod: text().$type<CollectionMethod>().notNull(),
    dataSourceId: uuid().references(() => dataSources.id, { onDelete: 'set null' }),
    raw: jsonb().$type<Record<string, unknown>>(),
    createdAt: createdAt(),
  },
  (t) => [index('official_quality_scores_listing_idx').on(t.listingId, t.observedAt)],
);

export const CONTENT_TYPES = [
  'title',
  'description',
  'bullets',
  'attributes',
  'keywords',
  'faq',
  'qa_answer',
  'image_brief',
  'enhanced_content',
  'comparison_chart',
  'full_listing',
] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

/** Every state of a piece of content: original, AI-generated, edited, approved, published. */
export const contentVersions = pgTable(
  'content_versions',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    brandId: uuid()
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    productId: uuid().references(() => products.id, { onDelete: 'cascade' }),
    skuId: uuid().references(() => skus.id, { onDelete: 'set null' }),
    marketplaceId: uuid().references(() => marketplaces.id, { onDelete: 'set null' }),
    countryCode: text(),
    language: text().notNull().default('en'),
    contentType: text().$type<ContentType>().notNull(),
    origin: text().$type<'original' | 'ai_generated' | 'edited' | 'imported'>().notNull(),
    versionNumber: integer().notNull().default(1),
    parentVersionId: uuid(),
    content: jsonb().$type<Record<string, unknown>>().notNull(),
    /** Result of checking this content against the marketplace requirement set named below. */
    validation: jsonb().$type<Record<string, unknown>>(),
    requirementSetId: uuid().references(() => requirementSets.id, { onDelete: 'set null' }),
    /** For AI content: model, prompt version and the knowledge-base passages used (provenance). */
    generation: jsonb().$type<Record<string, unknown>>(),
    status: text()
      .$type<'draft' | 'in_review' | 'approved' | 'rejected' | 'published' | 'archived'>()
      .notNull()
      .default('draft'),
    createdBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
  },
  (t) => [index('content_versions_product_idx').on(t.productId, t.marketplaceId)],
);

export const contentApprovals = pgTable(
  'content_approvals',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    contentVersionId: uuid()
      .notNull()
      .references(() => contentVersions.id, { onDelete: 'cascade' }),
    decision: text().$type<'approved' | 'rejected' | 'changes_requested'>().notNull(),
    comment: text(),
    decidedBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    decidedAt: timestamptz().notNull(),
  },
  (t) => [index('content_approvals_version_idx').on(t.contentVersionId)],
);

export const recommendations = pgTable(
  'recommendations',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    brandId: uuid().references(() => brands.id, { onDelete: 'cascade' }),
    productId: uuid().references(() => products.id, { onDelete: 'cascade' }),
    listingId: uuid().references(() => productListings.id, { onDelete: 'cascade' }),
    marketplaceId: uuid().references(() => marketplaces.id, { onDelete: 'set null' }),
    issueType: text().notNull(),
    title: text().notNull(),
    issue: text().notNull(),
    severity: text().$type<'critical' | 'high' | 'medium' | 'low'>().notNull(),
    businessImportance: text().$type<'high' | 'medium' | 'low'>().notNull(),
    evidence: jsonb().$type<{ description: string; source?: string; observedAt?: string }[]>().notNull().default([]),
    confidence: text().$type<Confidence>().notNull(),
    suggestedAction: text().notNull(),
    /** Always phrased and displayed as an estimate, never as a verified financial result. */
    expectedBenefit: text(),
    estimatedEffort: text().$type<'low' | 'medium' | 'high'>(),
    responsibleTeam: text(),
    priorityScore: numeric({ precision: 5, scale: 2, mode: 'number' }),
    priorityBreakdown: jsonb().$type<Record<string, unknown>>(),
    status: text().$type<'open' | 'accepted' | 'in_progress' | 'done' | 'dismissed'>().notNull().default('open'),
    source: text().$type<'rule' | 'ai' | 'manual'>().notNull(),
    dataClass: text().$type<DataClass>().notNull(),
    /** Prevents the same issue being raised twice for the same listing. */
    dedupeKey: text(),
    resolvedAt: timestamptz(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index('recommendations_org_status_idx').on(t.organisationId, t.status),
    uniqueIndex('recommendations_dedupe_uq').on(t.organisationId, t.dedupeKey),
  ],
);

export const tasks = pgTable(
  'tasks',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    recommendationId: uuid().references(() => recommendations.id, { onDelete: 'set null' }),
    title: text().notNull(),
    description: text(),
    assigneeUserId: uuid().references(() => users.id, { onDelete: 'set null' }),
    dueOn: date(),
    status: text().$type<'todo' | 'in_progress' | 'done' | 'cancelled'>().notNull().default('todo'),
    createdBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('tasks_org_status_idx').on(t.organisationId, t.status)],
);
