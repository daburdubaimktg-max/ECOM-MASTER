import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';
import { getDb, schema } from '@/db/client';
import type { DbOrTx } from '@/db/client';
import { CLAIM_STATUSES, CLAIM_TYPES, GUIDELINE_SECTIONS } from '@/db/schema';
import type { RequestContext } from '@/lib/auth/context';
import { assertBrandAccess, assertCan, can } from '@/lib/auth/context';
import { NotFoundError, ValidationError } from '@/lib/auth/permissions';
import { slugify, titleCase } from '@/lib/text';
import { audit } from './audit';
import { removeKnowledgeForSource, replaceKnowledgeForSource } from './knowledge';
import type { Trust } from './knowledge';

const b = schema.brands;

const optional = (max: number) =>
  z
    .string()
    .max(max, `Keep this under ${max} characters.`)
    .transform((v) => v.trim())
    .transform((v) => (v.length ? v : null))
    .nullish()
    .transform((v) => v ?? null);

const marketCodes = z
  .array(z.string().trim().toUpperCase().length(2))
  .nullish()
  .transform((v) => (v && v.length ? [...new Set(v)] : null));

export const brandInputSchema = z.object({
  name: z.string().trim().min(1, 'Enter the brand name.').max(120),
  tagline: optional(200),
  description: optional(4000),
  website: optional(300).refine((v) => v === null || /^https?:\/\/[^\s]+$/i.test(v), 'Enter a full web address starting with https://'),
  positioning: optional(4000),
  personality: optional(4000),
  toneOfVoice: optional(4000),
  targetAudience: optional(4000),
  visualGuidelines: optional(6000),
});
export type BrandInput = z.input<typeof brandInputSchema>;

export function zodToValidation(error: z.ZodError): ValidationError {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_';
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return new ValidationError(error.issues[0]?.message ?? 'Please check the form.', fieldErrors);
}

function brandScopeCondition(ctx: RequestContext) {
  if (ctx.membership.brandIds === null) return undefined;
  return ctx.membership.brandIds.length ? inArray(b.id, ctx.membership.brandIds) : sql`false`;
}

const PROFILE_FIELDS: { key: keyof typeof b.$inferSelect; label: string }[] = [
  { key: 'description', label: 'Brand description' },
  { key: 'positioning', label: 'Brand positioning' },
  { key: 'personality', label: 'Brand personality' },
  { key: 'toneOfVoice', label: 'Tone of voice' },
  { key: 'targetAudience', label: 'Target audience' },
  { key: 'visualGuidelines', label: 'Visual guidelines' },
];

async function indexBrandProfile(db: DbOrTx, brand: typeof b.$inferSelect): Promise<void> {
  const passages = PROFILE_FIELDS.filter((f) => typeof brand[f.key] === 'string' && (brand[f.key] as string).trim()).map((f) => ({
    title: `${brand.name} — ${f.label}`,
    content: brand[f.key] as string,
    locator: f.label,
  }));
  if (brand.tagline) passages.unshift({ title: `${brand.name} — Tagline`, content: brand.tagline, locator: 'Tagline' });
  await replaceKnowledgeForSource(db, {
    organisationId: brand.organisationId,
    brandId: brand.id,
    sourceType: 'brand_profile',
    sourceId: brand.id,
    title: brand.name,
    // The brand profile is maintained by Brand Managers / Administrators only, so it is authoritative.
    trust: 'approved',
    passages,
  });
}

export async function listBrands(ctx: RequestContext, options: { includeArchived?: boolean } = {}) {
  assertCan(ctx, 'brand.view');
  const db = await getDb();
  const rows = await db
    .select({
      id: b.id,
      name: b.name,
      slug: b.slug,
      tagline: b.tagline,
      status: b.status,
      isDemo: b.isDemo,
      updatedAt: b.updatedAt,
      // Sub-queries name the outer table explicitly ("brands"."id"); a bare "id" would silently refer
      // to the inner table's own id column and always count zero.
      productCount: sql<number>`(select count(*)::int from products p where p.brand_id = "brands"."id")`,
      assetCount: sql<number>`(select count(*)::int from brand_assets a where a.brand_id = "brands"."id")`,
      approvedClaimCount: sql<number>`(select count(*)::int from brand_claims c where c.brand_id = "brands"."id" and c.status = 'approved')`,
      pendingClaimCount: sql<number>`(select count(*)::int from brand_claims c where c.brand_id = "brands"."id" and c.status = 'unverified')`,
    })
    .from(b)
    .where(and(eq(b.organisationId, ctx.organisation.id), brandScopeCondition(ctx), options.includeArchived ? undefined : eq(b.status, 'active')))
    .orderBy(asc(b.name));
  return rows;
}

export async function getBrand(ctx: RequestContext, brandId: string) {
  assertCan(ctx, 'brand.view');
  if (!z.string().uuid().safeParse(brandId).success) throw new NotFoundError('Brand not found.');
  const db = await getDb();
  const rows = await db.select().from(b).where(and(eq(b.id, brandId), eq(b.organisationId, ctx.organisation.id))).limit(1);
  const brand = rows[0];
  if (!brand) throw new NotFoundError('Brand not found.');
  assertBrandAccess(ctx, brand.id);
  return brand;
}

async function uniqueSlug(db: DbOrTx, organisationId: string, name: string, excludeId?: string): Promise<string> {
  const base = slugify(name);
  const existing = await db.select({ id: b.id, slug: b.slug }).from(b).where(eq(b.organisationId, organisationId));
  const taken = new Set(existing.filter((e) => e.id !== excludeId).map((e) => e.slug));
  if (!taken.has(base)) return base;
  for (let i = 2; i < 500; i++) if (!taken.has(`${base}-${i}`)) return `${base}-${i}`;
  return `${base}-${Date.now()}`;
}

export async function createBrand(ctx: RequestContext, input: BrandInput, options: { isDemo?: boolean } = {}) {
  assertCan(ctx, 'brand.create');
  const parsed = brandInputSchema.safeParse(input);
  if (!parsed.success) throw zodToValidation(parsed.error);
  const db = await getDb();
  return db.transaction(async (tx) => {
    const duplicate = await tx
      .select({ id: b.id })
      .from(b)
      .where(and(eq(b.organisationId, ctx.organisation.id), sql`lower(${b.name}) = ${parsed.data.name.toLowerCase()}`))
      .limit(1);
    if (duplicate.length) throw new ValidationError('A brand with this name already exists.', { name: 'A brand with this name already exists.' });
    const [brand] = await tx
      .insert(b)
      .values({
        ...parsed.data,
        organisationId: ctx.organisation.id,
        slug: await uniqueSlug(tx, ctx.organisation.id, parsed.data.name),
        isDemo: options.isDemo ?? false,
        createdBy: ctx.user.id,
      })
      .returning();
    // A user restricted to certain brands who creates a brand is given access to it.
    if (ctx.membership.brandIds !== null) {
      await tx.insert(schema.membershipBrandAccess).values({ membershipId: ctx.membership.id, brandId: brand.id });
    }
    await indexBrandProfile(tx, brand);
    await audit(ctx, { action: 'brand.created', entityType: 'brand', entityId: brand.id, summary: `Created brand "${brand.name}"` }, tx);
    return brand;
  });
}

export async function updateBrand(ctx: RequestContext, brandId: string, input: BrandInput) {
  assertCan(ctx, 'brand.edit');
  const current = await getBrand(ctx, brandId);
  const parsed = brandInputSchema.safeParse(input);
  if (!parsed.success) throw zodToValidation(parsed.error);
  const db = await getDb();
  return db.transaction(async (tx) => {
    const duplicate = await tx
      .select({ id: b.id })
      .from(b)
      .where(and(eq(b.organisationId, ctx.organisation.id), sql`lower(${b.name}) = ${parsed.data.name.toLowerCase()}`, sql`${b.id} <> ${brandId}`))
      .limit(1);
    if (duplicate.length) throw new ValidationError('A brand with this name already exists.', { name: 'A brand with this name already exists.' });
    const changed = Object.keys(parsed.data).filter(
      (k) => (parsed.data as Record<string, unknown>)[k] !== (current as Record<string, unknown>)[k],
    );
    const [brand] = await tx.update(b).set({ ...parsed.data, updatedAt: new Date() }).where(eq(b.id, brandId)).returning();
    await indexBrandProfile(tx, brand);
    await audit(
      ctx,
      {
        action: 'brand.updated',
        entityType: 'brand',
        entityId: brand.id,
        summary: `Updated brand "${brand.name}"${changed.length ? ` (${changed.map(titleCase).join(', ')})` : ''}`,
        metadata: { changedFields: changed },
      },
      tx,
    );
    return brand;
  });
}

export async function setBrandStatus(ctx: RequestContext, brandId: string, status: 'active' | 'archived') {
  assertCan(ctx, 'brand.archive');
  const brand = await getBrand(ctx, brandId);
  const db = await getDb();
  await db.update(b).set({ status, updatedAt: new Date() }).where(eq(b.id, brandId));
  await audit(ctx, {
    action: status === 'archived' ? 'brand.archived' : 'brand.restored',
    entityType: 'brand',
    entityId: brandId,
    summary: `${status === 'archived' ? 'Archived' : 'Restored'} brand "${brand.name}"`,
  });
}

/* ------------------------------------------------------------------ guidelines */

const g = schema.brandGuidelines;

export const guidelineInputSchema = z.object({
  section: z.enum(GUIDELINE_SECTIONS),
  title: z.string().trim().min(1, 'Give the guideline a short title.').max(200),
  body: z.string().trim().min(1, 'Write the guideline.').max(8000),
  marketCodes,
});

async function indexGuideline(db: DbOrTx, row: typeof g.$inferSelect, brandName: string): Promise<void> {
  if (row.status === 'retired') {
    await removeKnowledgeForSource(db, 'guideline', row.id);
    return;
  }
  const markets = row.marketCodes?.length ? ` (markets: ${row.marketCodes.join(', ')})` : '';
  await replaceKnowledgeForSource(db, {
    organisationId: row.organisationId,
    brandId: row.brandId,
    sourceType: 'guideline',
    sourceId: row.id,
    title: `${brandName} guideline — ${row.title}`,
    trust: row.status === 'approved' ? 'approved' : 'unverified',
    passages: [{ content: `${row.body}${markets}`, locator: titleCase(row.section) }],
  });
}

export async function listGuidelines(ctx: RequestContext, brandId: string) {
  await getBrand(ctx, brandId);
  const db = await getDb();
  return db.select().from(g).where(eq(g.brandId, brandId)).orderBy(asc(g.section), desc(g.updatedAt));
}

export async function saveGuideline(ctx: RequestContext, brandId: string, input: z.input<typeof guidelineInputSchema>, guidelineId?: string) {
  assertCan(ctx, 'guideline.edit');
  const brand = await getBrand(ctx, brandId);
  const parsed = guidelineInputSchema.safeParse(input);
  if (!parsed.success) throw zodToValidation(parsed.error);
  const db = await getDb();
  return db.transaction(async (tx) => {
    let row: typeof g.$inferSelect;
    if (guidelineId) {
      const existing = await tx.select().from(g).where(and(eq(g.id, guidelineId), eq(g.brandId, brandId))).limit(1);
      if (!existing.length) throw new NotFoundError('Guideline not found.');
      // Editing an approved guideline sends it back to draft: approval always refers to the exact wording.
      [row] = await tx
        .update(g)
        .set({ ...parsed.data, status: 'draft', approvedBy: null, approvedAt: null, version: existing[0].version + 1, updatedAt: new Date() })
        .where(eq(g.id, guidelineId))
        .returning();
    } else {
      [row] = await tx
        .insert(g)
        .values({ ...parsed.data, organisationId: ctx.organisation.id, brandId, createdBy: ctx.user.id })
        .returning();
    }
    await indexGuideline(tx, row, brand.name);
    await audit(
      ctx,
      {
        action: guidelineId ? 'guideline.updated' : 'guideline.created',
        entityType: 'guideline',
        entityId: row.id,
        summary: `${guidelineId ? 'Edited' : 'Added'} guideline "${row.title}" for ${brand.name} (now draft, version ${row.version})`,
      },
      tx,
    );
    return row;
  });
}

export async function setGuidelineStatus(ctx: RequestContext, guidelineId: string, status: 'approved' | 'draft' | 'retired') {
  assertCan(ctx, 'guideline.approve');
  const db = await getDb();
  const rows = await db.select().from(g).where(and(eq(g.id, guidelineId), eq(g.organisationId, ctx.organisation.id))).limit(1);
  const existing = rows[0];
  if (!existing) throw new NotFoundError('Guideline not found.');
  const brand = await getBrand(ctx, existing.brandId);
  return db.transaction(async (tx) => {
    const [row] = await tx
      .update(g)
      .set({
        status,
        approvedBy: status === 'approved' ? ctx.user.id : null,
        approvedAt: status === 'approved' ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(g.id, guidelineId))
      .returning();
    await indexGuideline(tx, row, brand.name);
    await audit(
      ctx,
      {
        action: `guideline.${status}`,
        entityType: 'guideline',
        entityId: row.id,
        summary: `${status === 'approved' ? 'Approved' : status === 'retired' ? 'Retired' : 'Returned to draft'} guideline "${row.title}" (version ${row.version})`,
      },
      tx,
    );
    return row;
  });
}

/* ------------------------------------------------------------------ claims */

const c = schema.brandClaims;

export const claimInputSchema = z.object({
  claimText: z.string().trim().min(3, 'Write the claim.').max(1000),
  claimType: z.enum(CLAIM_TYPES).default('benefit'),
  productId: z.string().uuid().nullish().transform((v) => v ?? null),
  marketCodes,
  substantiation: optional(4000),
  sourceAssetId: z.string().uuid().nullish().transform((v) => v ?? null),
});

async function indexClaim(db: DbOrTx, row: typeof c.$inferSelect, brandName: string): Promise<void> {
  const parts = [row.claimText];
  if (row.status === 'restricted') parts.push(`RESTRICTED — must not be used.${row.restrictionReason ? ` Reason: ${row.restrictionReason}` : ''}`);
  if (row.marketCodes?.length) parts.push(`Applies to markets: ${row.marketCodes.join(', ')}.`);
  if (row.substantiation) parts.push(`Substantiation: ${row.substantiation}`);
  await replaceKnowledgeForSource(db, {
    organisationId: row.organisationId,
    brandId: row.brandId,
    productId: row.productId,
    sourceType: 'claim',
    sourceId: row.id,
    title: `${brandName} — ${titleCase(row.claimType)} claim`,
    trust: row.status as Trust,
    passages: [{ content: parts.join('\n'), locator: `${titleCase(row.status)} claim` }],
  });
}

export async function listClaims(ctx: RequestContext, brandId: string, options: { productId?: string } = {}) {
  await getBrand(ctx, brandId);
  const db = await getDb();
  return db
    .select({
      claim: c,
      productName: schema.products.name,
      reviewerName: schema.users.name,
    })
    .from(c)
    .leftJoin(schema.products, eq(schema.products.id, c.productId))
    .leftJoin(schema.users, eq(schema.users.id, c.reviewedBy))
    .where(and(eq(c.brandId, brandId), options.productId ? eq(c.productId, options.productId) : undefined))
    .orderBy(asc(c.status), desc(c.updatedAt));
}

async function assertProductInBrand(db: DbOrTx, productId: string | null, brandId: string): Promise<void> {
  if (!productId) return;
  const rows = await db.select({ id: schema.products.id }).from(schema.products).where(and(eq(schema.products.id, productId), eq(schema.products.brandId, brandId))).limit(1);
  if (!rows.length) throw new ValidationError('The selected product does not belong to this brand.', { productId: 'Choose a product of this brand.' });
}

/**
 * Propose a claim. Every new or edited claim starts as "unverified": only someone with approval
 * rights can make it "approved" or "restricted", in a separate, logged step.
 */
export async function saveClaim(ctx: RequestContext, brandId: string, input: z.input<typeof claimInputSchema>, claimId?: string) {
  assertCan(ctx, 'claim.propose');
  const brand = await getBrand(ctx, brandId);
  const parsed = claimInputSchema.safeParse(input);
  if (!parsed.success) throw zodToValidation(parsed.error);
  const db = await getDb();
  return db.transaction(async (tx) => {
    await assertProductInBrand(tx, parsed.data.productId, brandId);
    let row: typeof c.$inferSelect;
    if (claimId) {
      const existing = await tx.select().from(c).where(and(eq(c.id, claimId), eq(c.brandId, brandId))).limit(1);
      if (!existing.length) throw new NotFoundError('Claim not found.');
      [row] = await tx
        .update(c)
        .set({ ...parsed.data, status: 'unverified', restrictionReason: null, reviewedBy: null, reviewedAt: null, updatedAt: new Date() })
        .where(eq(c.id, claimId))
        .returning();
    } else {
      [row] = await tx
        .insert(c)
        .values({ ...parsed.data, organisationId: ctx.organisation.id, brandId, status: 'unverified', createdBy: ctx.user.id })
        .returning();
    }
    await indexClaim(tx, row, brand.name);
    await audit(
      ctx,
      {
        action: claimId ? 'claim.updated' : 'claim.proposed',
        entityType: 'claim',
        entityId: row.id,
        summary: `${claimId ? 'Edited' : 'Proposed'} claim for ${brand.name}: "${row.claimText.slice(0, 120)}" (unverified)`,
      },
      tx,
    );
    return row;
  });
}

export async function reviewClaim(ctx: RequestContext, claimId: string, decision: { status: (typeof CLAIM_STATUSES)[number]; restrictionReason?: string | null }) {
  assertCan(ctx, 'claim.approve');
  if (!CLAIM_STATUSES.includes(decision.status)) throw new ValidationError('Choose a status.');
  const db = await getDb();
  const rows = await db.select().from(c).where(and(eq(c.id, claimId), eq(c.organisationId, ctx.organisation.id))).limit(1);
  const existing = rows[0];
  if (!existing) throw new NotFoundError('Claim not found.');
  const brand = await getBrand(ctx, existing.brandId);
  const reason = decision.restrictionReason?.trim() || null;
  if (decision.status === 'restricted' && !reason) {
    throw new ValidationError('Explain why this claim is restricted (for example the regulation or market it conflicts with).', { restrictionReason: 'A reason is required.' });
  }
  return db.transaction(async (tx) => {
    const [row] = await tx
      .update(c)
      .set({
        status: decision.status,
        restrictionReason: decision.status === 'restricted' ? reason : null,
        reviewedBy: decision.status === 'unverified' ? null : ctx.user.id,
        reviewedAt: decision.status === 'unverified' ? null : new Date(),
        updatedAt: new Date(),
      })
      .where(eq(c.id, claimId))
      .returning();
    await indexClaim(tx, row, brand.name);
    await audit(
      ctx,
      {
        action: `claim.${decision.status}`,
        entityType: 'claim',
        entityId: row.id,
        summary: `Marked claim as ${decision.status.toUpperCase()}: "${row.claimText.slice(0, 120)}"`,
        metadata: { previousStatus: existing.status, restrictionReason: reason },
      },
      tx,
    );
    return row;
  });
}

export async function deleteClaim(ctx: RequestContext, claimId: string) {
  const db = await getDb();
  const rows = await db.select().from(c).where(and(eq(c.id, claimId), eq(c.organisationId, ctx.organisation.id))).limit(1);
  const existing = rows[0];
  if (!existing) throw new NotFoundError('Claim not found.');
  await getBrand(ctx, existing.brandId);
  // Reviewed claims are part of the approval record: only approvers may remove them.
  if (existing.status === 'unverified' && existing.createdBy === ctx.user.id) assertCan(ctx, 'claim.propose');
  else assertCan(ctx, 'claim.approve');
  await db.transaction(async (tx) => {
    await tx.delete(c).where(eq(c.id, claimId));
    await removeKnowledgeForSource(tx, 'claim', claimId);
    await audit(ctx, { action: 'claim.deleted', entityType: 'claim', entityId: claimId, summary: `Deleted ${existing.status} claim: "${existing.claimText.slice(0, 120)}"` }, tx);
  });
}

/* ------------------------------------------------------------------ competitors */

export async function listCompetitors(ctx: RequestContext, brandId: string) {
  await getBrand(ctx, brandId);
  const db = await getDb();
  return db
    .select({ id: schema.competitors.id, name: schema.competitors.name, parentCompany: schema.competitors.parentCompany, website: schema.competitors.website, notes: schema.competitors.notes })
    .from(schema.brandCompetitors)
    .innerJoin(schema.competitors, eq(schema.competitors.id, schema.brandCompetitors.competitorId))
    .where(eq(schema.brandCompetitors.brandId, brandId))
    .orderBy(asc(schema.competitors.name));
}

const competitorInputSchema = z.object({
  name: z.string().trim().min(1, 'Enter the competitor brand name.').max(120),
  parentCompany: optional(200),
  website: optional(300),
  notes: optional(2000),
});

export async function addCompetitor(ctx: RequestContext, brandId: string, input: z.input<typeof competitorInputSchema>) {
  assertCan(ctx, 'competitor.manage');
  const brand = await getBrand(ctx, brandId);
  const parsed = competitorInputSchema.safeParse(input);
  if (!parsed.success) throw zodToValidation(parsed.error);
  const db = await getDb();
  return db.transaction(async (tx) => {
    const existing = await tx
      .select()
      .from(schema.competitors)
      .where(and(eq(schema.competitors.organisationId, ctx.organisation.id), sql`lower(${schema.competitors.name}) = ${parsed.data.name.toLowerCase()}`))
      .limit(1);
    let competitor = existing[0];
    if (!competitor) {
      [competitor] = await tx
        .insert(schema.competitors)
        .values({ ...parsed.data, organisationId: ctx.organisation.id, createdBy: ctx.user.id })
        .returning();
    }
    await tx.insert(schema.brandCompetitors).values({ brandId, competitorId: competitor.id }).onConflictDoNothing();
    await audit(ctx, { action: 'competitor.linked', entityType: 'competitor', entityId: competitor.id, summary: `Added "${competitor.name}" as a competitor of ${brand.name}` }, tx);
    return competitor;
  });
}

export async function removeCompetitor(ctx: RequestContext, brandId: string, competitorId: string) {
  assertCan(ctx, 'competitor.manage');
  const brand = await getBrand(ctx, brandId);
  const db = await getDb();
  await db.delete(schema.brandCompetitors).where(and(eq(schema.brandCompetitors.brandId, brandId), eq(schema.brandCompetitors.competitorId, competitorId)));
  await audit(ctx, { action: 'competitor.unlinked', entityType: 'competitor', entityId: competitorId, summary: `Removed a competitor from ${brand.name}` });
}

export { can };
