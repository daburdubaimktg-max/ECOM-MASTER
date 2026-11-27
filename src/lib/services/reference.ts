import { and, asc, desc, eq, isNull, or, sql } from 'drizzle-orm';
import { getDb, getDbMode, schema } from '@/db/client';
import type { RequestContext } from '@/lib/auth/context';
import { assertCan } from '@/lib/auth/context';
import { embeddingStatus } from '@/lib/embeddings';
import { env } from '@/lib/env';

/** The active internal Listing Quality Score configuration (system default unless the organisation has its own). */
export async function getActiveLqsRule(ctx: RequestContext) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.scoringRules)
    .where(
      and(
        eq(schema.scoringRules.scoreType, 'internal_lqs'),
        eq(schema.scoringRules.status, 'active'),
        or(isNull(schema.scoringRules.organisationId), eq(schema.scoringRules.organisationId, ctx.organisation.id)),
      ),
    )
    .orderBy(sql`${schema.scoringRules.organisationId} nulls last`, desc(schema.scoringRules.version))
    .limit(1);
  return rows[0] ?? null;
}

/** Every official quality signal found in research, by retailer. */
export async function listOfficialQualitySignals(ctx: RequestContext) {
  assertCan(ctx, 'marketplace.view');
  const db = await getDb();
  return db
    .select({
      familyKey: schema.requirementSets.familyKey,
      marketplaceName: schema.requirementSets.marketplaceName,
      officialName: schema.marketplaceQualitySignals.officialName,
      accessMethod: schema.marketplaceQualitySignals.accessMethod,
      whoCanAccess: schema.marketplaceQualitySignals.whoCanAccess,
      sourceUrl: schema.marketplaceQualitySignals.sourceUrl,
      verification: schema.marketplaceQualitySignals.verification,
    })
    .from(schema.marketplaceQualitySignals)
    .innerJoin(schema.requirementSets, eq(schema.requirementSets.id, schema.marketplaceQualitySignals.setId))
    .where(and(eq(schema.requirementSets.status, 'current'), sql`coalesce(${schema.marketplaceQualitySignals.accessMethod}, 'none') <> 'none'`))
    .orderBy(asc(schema.requirementSets.marketplaceName));
}

export async function listReviewThemes(ctx: RequestContext) {
  const db = await getDb();
  return db
    .select()
    .from(schema.reviewThemes)
    .where(or(isNull(schema.reviewThemes.organisationId), eq(schema.reviewThemes.organisationId, ctx.organisation.id)))
    .orderBy(asc(schema.reviewThemes.label));
}

/** Facts about how this installation is running, for the Settings page. Contains no secrets. */
export async function systemStatus() {
  const [mode, embeddings] = await Promise.all([getDbMode(), embeddingStatus()]);
  return {
    databaseMode: mode,
    embeddings,
    maxUploadMb: Math.round(env.maxUploadBytes / 1024 / 1024),
    schedulerConfigured: Boolean(env.jobsSecret) || env.builtInScheduler,
    schedulerLabel: env.builtInScheduler ? 'Built in · every 5 minutes' : env.jobsSecret ? 'Heartbeat secured' : null,
    storage: 'Local disk on this server',
    production: env.isProduction,
  };
}

export async function recentJobs(ctx: RequestContext, limit = 15) {
  const db = await getDb();
  return db
    .select({
      id: schema.backgroundJobs.id,
      type: schema.backgroundJobs.type,
      status: schema.backgroundJobs.status,
      attempts: schema.backgroundJobs.attempts,
      lastError: schema.backgroundJobs.lastError,
      createdAt: schema.backgroundJobs.createdAt,
      finishedAt: schema.backgroundJobs.finishedAt,
    })
    .from(schema.backgroundJobs)
    .where(eq(schema.backgroundJobs.organisationId, ctx.organisation.id))
    .orderBy(desc(schema.backgroundJobs.createdAt))
    .limit(limit);
}
