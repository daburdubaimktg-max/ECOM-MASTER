import { bigserial, boolean, date, index, integer, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { createdAt, id, timestamptz, updatedAt } from './_shared';
import { organisations, users } from './identity';
import { dataSources } from './shelf';

/**
 * A generic, database-backed work queue. Used from the first build for document processing;
 * the same mechanism will run collection, scoring and report jobs.
 */
export const backgroundJobs = pgTable(
  'background_jobs',
  {
    id: id(),
    organisationId: uuid().references(() => organisations.id, { onDelete: 'cascade' }),
    type: text().notNull(),
    payload: jsonb().$type<Record<string, unknown>>().notNull().default({}),
    status: text().$type<'queued' | 'running' | 'succeeded' | 'failed'>().notNull().default('queued'),
    attempts: integer().notNull().default(0),
    maxAttempts: integer().notNull().default(3),
    runAfter: timestamptz().notNull().defaultNow(),
    lockedAt: timestamptz(),
    lastError: text(),
    finishedAt: timestamptz(),
    createdAt: createdAt(),
  },
  (t) => [index('background_jobs_queue_idx').on(t.status, t.runAfter)],
);

/** A recurring or on-demand workflow (weekly collection, scoring run, weekly report…). Stage 5. */
export const automationWorkflows = pgTable(
  'automation_workflows',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    name: text().notNull(),
    workflowType: text().notNull(),
    frequency: text().$type<'daily' | 'weekly' | 'monthly' | 'manual'>().notNull().default('weekly'),
    /** Optional cron expression for precise scheduling. */
    schedule: text(),
    configuration: jsonb().$type<Record<string, unknown>>().notNull().default({}),
    isEnabled: boolean().notNull().default(false),
    lastRunAt: timestamptz(),
    nextRunAt: timestamptz(),
    createdBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('automation_workflows_org_idx').on(t.organisationId)],
);

/** One run of a data collection. Stage 3. */
export const collectionJobs = pgTable(
  'collection_jobs',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    workflowId: uuid().references(() => automationWorkflows.id, { onDelete: 'set null' }),
    dataSourceId: uuid().references(() => dataSources.id, { onDelete: 'set null' }),
    jobType: text().notNull(),
    trigger: text().$type<'scheduled' | 'manual'>().notNull(),
    status: text()
      .$type<'queued' | 'running' | 'succeeded' | 'partially_succeeded' | 'failed' | 'cancelled'>()
      .notNull()
      .default('queued'),
    itemsRequested: integer().notNull().default(0),
    itemsSucceeded: integer().notNull().default(0),
    itemsFailed: integer().notNull().default(0),
    attempt: integer().notNull().default(1),
    error: text(),
    startedAt: timestamptz(),
    finishedAt: timestamptz(),
    createdBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
  },
  (t) => [index('collection_jobs_org_created_idx').on(t.organisationId, t.createdAt)],
);

export const collectionLogs = pgTable(
  'collection_logs',
  {
    id: bigserial({ mode: 'number' }).primaryKey(),
    jobId: uuid()
      .notNull()
      .references(() => collectionJobs.id, { onDelete: 'cascade' }),
    level: text().$type<'info' | 'warn' | 'error'>().notNull(),
    message: text().notNull(),
    context: jsonb().$type<Record<string, unknown>>(),
    createdAt: createdAt(),
  },
  (t) => [index('collection_logs_job_idx').on(t.jobId)],
);

/** Generated reports (weekly intelligence report and exports). Stage 5. */
export const reports = pgTable(
  'reports',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    reportType: text().notNull(),
    title: text().notNull(),
    periodStart: date(),
    periodEnd: date(),
    status: text().$type<'generating' | 'ready' | 'failed'>().notNull().default('generating'),
    /** True when no new data was successfully collected in the period — disclosed on the report itself. */
    noNewData: boolean().notNull().default(false),
    content: jsonb().$type<Record<string, unknown>>(),
    files: jsonb().$type<{ format: string; storageKey: string }[]>().notNull().default([]),
    generatedBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
  },
  (t) => [index('reports_org_created_idx').on(t.organisationId, t.createdAt)],
);
