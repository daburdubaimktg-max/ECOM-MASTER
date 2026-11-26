import { and, asc, desc, eq, ilike, inArray, isNull, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { getDb, schema } from '@/db/client';
import { DATA_ACCESS_METHODS, MARKETPLACE_TYPES, PLATFORM_CATEGORIES } from '@/db/schema';
import type { RequestContext } from '@/lib/auth/context';
import { assertCan } from '@/lib/auth/context';
import { NotFoundError, ValidationError } from '@/lib/auth/permissions';
import { slugify } from '@/lib/text';
import { audit } from './audit';
import { getBrand, zodToValidation } from './brands';

const m = schema.marketplaces;

/** Reference platforms (shared research) plus any platforms this organisation added itself. */
function visibleTo(ctx: RequestContext) {
  return or(isNull(m.organisationId), eq(m.organisationId, ctx.organisation.id));
}

export type MarketplaceFilters = {
  countryCode?: string;
  region?: string;
  category?: string;
  type?: string;
  priority?: 'top3' | 'all';
  dataAccess?: string;
  monitoring?: string;
  q?: string;
};

/** The list of countries (reference data, safe for every signed-in user). */
export async function listCountries() {
  const db = await getDb();
  return db
    .select({ code: schema.countries.code, name: schema.countries.name, region: schema.countries.region })
    .from(schema.countries)
    .orderBy(asc(schema.countries.name));
}

export async function listCountriesWithCounts(ctx: RequestContext) {
  assertCan(ctx, 'marketplace.view');
  const db = await getDb();
  return db
    .select({
      code: schema.countries.code,
      name: schema.countries.name,
      region: schema.countries.region,
      currencyCode: schema.countries.currencyCode,
      isInitialMarket: schema.countries.isInitialMarket,
      platformCount: sql<number>`(select count(*)::int from marketplaces mp where mp.country_code = "countries"."code" and (mp.organisation_id is null or mp.organisation_id = ${ctx.organisation.id}))`,
      researchDate: sql<string | null>`(select max(cr.research_date)::text from country_research cr where cr.country_code = "countries"."code" and cr.is_current)`,
    })
    .from(schema.countries)
    .orderBy(asc(schema.countries.name));
}

export async function listMarketplaces(ctx: RequestContext, filters: MarketplaceFilters = {}) {
  assertCan(ctx, 'marketplace.view');
  const db = await getDb();
  const q = filters.q?.trim();
  const like = q ? `%${q.replace(/[%_\\]/g, (ch) => `\\${ch}`)}%` : null;
  const settings = schema.marketplaceSettings;
  const rows = await db
    .select({
      id: m.id,
      name: m.name,
      slug: m.slug,
      familyKey: m.familyKey,
      countryCode: m.countryCode,
      countryName: schema.countries.name,
      region: m.region,
      website: m.website,
      status: m.status,
      platformCategory: m.platformCategory,
      marketplaceType: m.marketplaceType,
      beautyRelevance: m.beautyRelevance,
      pharmacyRelevance: m.pharmacyRelevance,
      estimatedMarketImportance: m.estimatedMarketImportance,
      dataAccessMethod: m.dataAccessMethod,
      publicSellerApi: m.publicSellerApi,
      dataCollectionFeasibility: m.dataCollectionFeasibility,
      weightedScore: m.weightedScore,
      priorityRank: m.priorityRank,
      isTop3: m.isTop3,
      confidence: m.confidence,
      lastResearchDate: m.lastResearchDate,
      origin: m.origin,
      monitoringStatus: settings.monitoringStatus,
    })
    .from(m)
    .innerJoin(schema.countries, eq(schema.countries.code, m.countryCode))
    .leftJoin(settings, and(eq(settings.marketplaceId, m.id), eq(settings.organisationId, ctx.organisation.id)))
    .where(
      and(
        visibleTo(ctx),
        filters.countryCode ? eq(m.countryCode, filters.countryCode.toUpperCase()) : undefined,
        filters.region ? eq(m.region, filters.region) : undefined,
        filters.category && (PLATFORM_CATEGORIES as readonly string[]).includes(filters.category) ? eq(m.platformCategory, filters.category as (typeof PLATFORM_CATEGORIES)[number]) : undefined,
        filters.type && (MARKETPLACE_TYPES as readonly string[]).includes(filters.type) ? eq(m.marketplaceType, filters.type as (typeof MARKETPLACE_TYPES)[number]) : undefined,
        filters.priority === 'top3' ? eq(m.isTop3, true) : undefined,
        filters.dataAccess && (DATA_ACCESS_METHODS as readonly string[]).includes(filters.dataAccess) ? eq(m.dataAccessMethod, filters.dataAccess as (typeof DATA_ACCESS_METHODS)[number]) : undefined,
        filters.monitoring === 'active' || filters.monitoring === 'planned'
          ? eq(settings.monitoringStatus, filters.monitoring)
          : undefined,
        like ? or(ilike(m.name, like), ilike(m.operator, like)) : undefined,
      ),
    )
    .orderBy(asc(schema.countries.name), sql`${m.priorityRank} asc nulls last`, asc(m.name));
  return rows;
}

export async function getMarketplace(ctx: RequestContext, marketplaceId: string) {
  assertCan(ctx, 'marketplace.view');
  if (!z.string().uuid().safeParse(marketplaceId).success) throw new NotFoundError('Platform not found.');
  const db = await getDb();
  const rows = await db
    .select({ marketplace: m, countryName: schema.countries.name })
    .from(m)
    .innerJoin(schema.countries, eq(schema.countries.code, m.countryCode))
    .where(and(eq(m.id, marketplaceId), visibleTo(ctx)))
    .limit(1);
  const row = rows[0];
  if (!row) throw new NotFoundError('Platform not found.');

  const [evidence, sources, settings, history, presence, requirementSet] = await Promise.all([
    db.select().from(schema.marketplaceEvidence).where(eq(schema.marketplaceEvidence.marketplaceId, marketplaceId)),
    db.select().from(schema.marketplaceSources).where(eq(schema.marketplaceSources.marketplaceId, marketplaceId)),
    db
      .select()
      .from(schema.marketplaceSettings)
      .where(and(eq(schema.marketplaceSettings.marketplaceId, marketplaceId), eq(schema.marketplaceSettings.organisationId, ctx.organisation.id)))
      .limit(1),
    db
      .select({ id: schema.marketplaceResearchSnapshots.id, researchDate: schema.marketplaceResearchSnapshots.researchDate, createdAt: schema.marketplaceResearchSnapshots.createdAt })
      .from(schema.marketplaceResearchSnapshots)
      .where(eq(schema.marketplaceResearchSnapshots.marketplaceId, marketplaceId))
      .orderBy(desc(schema.marketplaceResearchSnapshots.researchDate)),
    db
      .select({
        brandId: schema.brandMarketplacePresence.brandId,
        brandName: schema.brands.name,
        presence: schema.brandMarketplacePresence.presence,
        sellingModel: schema.brandMarketplacePresence.sellingModel,
        notes: schema.brandMarketplacePresence.notes,
      })
      .from(schema.brandMarketplacePresence)
      .innerJoin(schema.brands, eq(schema.brands.id, schema.brandMarketplacePresence.brandId))
      .where(
        and(
          eq(schema.brandMarketplacePresence.marketplaceId, marketplaceId),
          eq(schema.brandMarketplacePresence.organisationId, ctx.organisation.id),
          ctx.membership.brandIds !== null
            ? ctx.membership.brandIds.length
              ? inArray(schema.brandMarketplacePresence.brandId, ctx.membership.brandIds)
              : sql`false`
            : undefined,
        ),
      ),
    row.marketplace.familyKey ? getCurrentRequirementSet(row.marketplace.familyKey) : Promise.resolve(null),
  ]);
  const appliesHere = requirementSet && (requirementSet.set.appliesToCountryCodes.length === 0 || requirementSet.set.appliesToCountryCodes.includes(row.marketplace.countryCode));

  return {
    marketplace: row.marketplace,
    countryName: row.countryName,
    evidence,
    sources,
    settings: settings[0] ?? null,
    history,
    presence,
    requirementSet: appliesHere ? requirementSet : null,
  };
}

export async function updateMarketplaceSettings(
  ctx: RequestContext,
  marketplaceId: string,
  input: { monitoringStatus: string; notes?: string | null },
) {
  assertCan(ctx, 'marketplace.manage');
  const { marketplace } = await getMarketplace(ctx, marketplaceId);
  if (!['not_monitored', 'planned', 'active'].includes(input.monitoringStatus)) throw new ValidationError('Choose a tracking status.');
  const monitoringStatus = input.monitoringStatus as 'not_monitored' | 'planned' | 'active';
  const notes = input.notes?.trim().slice(0, 2000) || null;
  const db = await getDb();
  await db
    .insert(schema.marketplaceSettings)
    .values({ organisationId: ctx.organisation.id, marketplaceId, monitoringStatus, notes, updatedBy: ctx.user.id })
    .onConflictDoUpdate({
      target: [schema.marketplaceSettings.organisationId, schema.marketplaceSettings.marketplaceId],
      set: { monitoringStatus, notes, updatedBy: ctx.user.id, updatedAt: new Date() },
    });
  await audit(ctx, {
    action: 'marketplace.tracking_updated',
    entityType: 'marketplace',
    entityId: marketplaceId,
    summary: `Set ${marketplace.name} (${marketplace.countryCode}) tracking to "${monitoringStatus.replace('_', ' ')}"`,
  });
}

export async function setBrandPresence(
  ctx: RequestContext,
  input: { brandId: string; marketplaceId: string; presence: string; sellingModel: string; notes?: string | null },
) {
  assertCan(ctx, 'marketplace.manage');
  const brand = await getBrand(ctx, input.brandId);
  const { marketplace } = await getMarketplace(ctx, input.marketplaceId);
  if (!['present', 'absent', 'unknown'].includes(input.presence)) throw new ValidationError('Choose whether the brand is sold here.');
  if (!['own_seller_account', 'first_party_vendor', 'distributor', 'unknown'].includes(input.sellingModel)) throw new ValidationError('Choose how the brand is sold here.');
  const presence = input.presence as 'present' | 'absent' | 'unknown';
  const sellingModel = (presence === 'present' ? input.sellingModel : 'unknown') as 'own_seller_account' | 'first_party_vendor' | 'distributor' | 'unknown';
  const notes = input.notes?.trim().slice(0, 2000) || null;
  const db = await getDb();
  await db
    .insert(schema.brandMarketplacePresence)
    .values({ organisationId: ctx.organisation.id, brandId: brand.id, marketplaceId: marketplace.id, presence, sellingModel, notes, updatedBy: ctx.user.id })
    .onConflictDoUpdate({
      target: [schema.brandMarketplacePresence.brandId, schema.brandMarketplacePresence.marketplaceId],
      set: { presence, sellingModel, notes, updatedBy: ctx.user.id, updatedAt: new Date() },
    });
  await audit(ctx, {
    action: 'marketplace.brand_presence_updated',
    entityType: 'marketplace',
    entityId: marketplace.id,
    summary: `Recorded ${brand.name} as ${presence}${presence === 'present' ? ` (${sellingModel.replace(/_/g, ' ')})` : ''} on ${marketplace.name} (${marketplace.countryCode})`,
  });
}

const customMarketplaceSchema = z.object({
  name: z.string().trim().min(1, 'Enter the platform name.').max(120),
  countryCode: z.string().trim().toUpperCase().length(2, 'Choose a country.'),
  website: z
    .string()
    .trim()
    .max(300)
    .refine((val) => val === '' || /^https?:\/\/[^\s]+$/i.test(val), 'Enter a full web address starting with https://')
    .transform((val) => val || null),
  platformCategory: z.enum(PLATFORM_CATEGORIES),
  marketplaceType: z.enum(MARKETPLACE_TYPES),
  notes: z.string().trim().max(2000).transform((val) => val || null),
});

/**
 * Add a platform that the shared research does not cover. It is clearly marked "added by your team"
 * and carries no priority score, because no evidence-based research has been done for it yet.
 */
export async function addCustomMarketplace(ctx: RequestContext, input: z.input<typeof customMarketplaceSchema>) {
  assertCan(ctx, 'marketplace.manage');
  const parsed = customMarketplaceSchema.safeParse(input);
  if (!parsed.success) throw zodToValidation(parsed.error);
  const db = await getDb();
  const country = await db.select().from(schema.countries).where(eq(schema.countries.code, parsed.data.countryCode)).limit(1);
  if (!country.length) throw new ValidationError('Choose a country from the list.', { countryCode: 'Unknown country.' });
  const slug = slugify(parsed.data.name);
  const clash = await db
    .select({ id: m.id })
    .from(m)
    .where(and(visibleTo(ctx), eq(m.countryCode, parsed.data.countryCode), eq(m.slug, slug)))
    .limit(1);
  if (clash.length) throw new ValidationError('This platform is already in the list for that country.', { name: 'Already listed.' });
  const [row] = await db
    .insert(m)
    .values({
      organisationId: ctx.organisation.id,
      slug,
      name: parsed.data.name,
      countryCode: parsed.data.countryCode,
      region: country[0].region,
      website: parsed.data.website,
      platformCategory: parsed.data.platformCategory,
      marketplaceType: parsed.data.marketplaceType,
      marketImportanceNote: parsed.data.notes,
      origin: 'user_added',
      createdBy: ctx.user.id,
    })
    .returning();
  await audit(ctx, { action: 'marketplace.added', entityType: 'marketplace', entityId: row.id, summary: `Added platform "${row.name}" (${row.countryCode}) — not yet researched` });
  return row;
}

export async function getCountryResearch(ctx: RequestContext, countryCode: string) {
  assertCan(ctx, 'marketplace.view');
  const db = await getDb();
  const rows = await db
    .select()
    .from(schema.countryResearch)
    .where(and(eq(schema.countryResearch.countryCode, countryCode.toUpperCase()), eq(schema.countryResearch.isCurrent, true)))
    .orderBy(desc(schema.countryResearch.researchDate))
    .limit(1);
  return rows[0] ?? null;
}

/* ------------------------------------------------------------------ requirements library */

export async function getCurrentRequirementSet(familyKey: string) {
  const db = await getDb();
  const sets = await db
    .select()
    .from(schema.requirementSets)
    .where(and(eq(schema.requirementSets.familyKey, familyKey), eq(schema.requirementSets.status, 'current')))
    .limit(1);
  const set = sets[0];
  if (!set) return null;
  const [rules, signals] = await Promise.all([
    db.select().from(schema.requirementRules).where(eq(schema.requirementRules.setId, set.id)).orderBy(asc(schema.requirementRules.area), asc(schema.requirementRules.ruleKey)),
    db.select().from(schema.marketplaceQualitySignals).where(eq(schema.marketplaceQualitySignals.setId, set.id)),
  ]);
  return { set, rules, signals };
}

export async function listRequirementSets(ctx: RequestContext) {
  assertCan(ctx, 'marketplace.view');
  const db = await getDb();
  return db
    .select({
      id: schema.requirementSets.id,
      familyKey: schema.requirementSets.familyKey,
      marketplaceName: schema.requirementSets.marketplaceName,
      version: schema.requirementSets.version,
      researchDate: schema.requirementSets.researchDate,
      appliesToCountryCodes: schema.requirementSets.appliesToCountryCodes,
      publicDocumentationLevel: schema.requirementSets.publicDocumentationLevel,
      ruleCount: sql<number>`(select count(*)::int from requirement_rules r where r.set_id = "requirement_sets"."id")`,
      officialRuleCount: sql<number>`(select count(*)::int from requirement_rules r where r.set_id = "requirement_sets"."id" and r.verification = 'official_document')`,
      mandatoryRuleCount: sql<number>`(select count(*)::int from requirement_rules r where r.set_id = "requirement_sets"."id" and r.severity = 'mandatory')`,
      signalCount: sql<number>`(select count(*)::int from marketplace_quality_signals q where q.set_id = "requirement_sets"."id")`,
    })
    .from(schema.requirementSets)
    .where(eq(schema.requirementSets.status, 'current'))
    .orderBy(asc(schema.requirementSets.marketplaceName));
}

export async function getRequirementSetByFamily(ctx: RequestContext, familyKey: string) {
  assertCan(ctx, 'marketplace.view');
  const current = await getCurrentRequirementSet(familyKey);
  if (!current) throw new NotFoundError('No requirements library found for this retailer.');
  const db = await getDb();
  const versions = await db
    .select({ version: schema.requirementSets.version, status: schema.requirementSets.status, researchDate: schema.requirementSets.researchDate, createdAt: schema.requirementSets.createdAt })
    .from(schema.requirementSets)
    .where(eq(schema.requirementSets.familyKey, familyKey))
    .orderBy(desc(schema.requirementSets.version));
  return { ...current, versions };
}

export async function marketplaceStats(ctx: RequestContext) {
  assertCan(ctx, 'marketplace.view');
  const db = await getDb();
  const [row] = await db
    .select({
      platforms: sql<number>`count(*)::int`,
      countries: sql<number>`count(distinct ${m.countryCode})::int`,
      top3: sql<number>`count(*) filter (where ${m.isTop3})::int`,
      withPublicApi: sql<number>`count(*) filter (where ${m.publicSellerApi} = 'yes')::int`,
    })
    .from(m)
    .where(visibleTo(ctx));
  const [tracked] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(schema.marketplaceSettings)
    .where(and(eq(schema.marketplaceSettings.organisationId, ctx.organisation.id), eq(schema.marketplaceSettings.monitoringStatus, 'active')));
  return { ...row, tracked: tracked?.n ?? 0 };
}
