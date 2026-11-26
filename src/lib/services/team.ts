import { and, desc, eq, gt, isNull, sql } from 'drizzle-orm';
import { z } from 'zod';
import { getDb, schema } from '@/db/client';
import type { RequestContext } from '@/lib/auth/context';
import { assertCan } from '@/lib/auth/context';
import { hashPassword, passwordProblem } from '@/lib/auth/password';
import { ForbiddenError, isRoleKey, NotFoundError, ROLES, ValidationError } from '@/lib/auth/permissions';
import type { RoleKey } from '@/lib/auth/permissions';
import { hashToken, newToken, normaliseEmail, revokeAllSessionsForUser } from '@/lib/auth/session';
import { slugify } from '@/lib/text';
import { audit } from './audit';

const INVITATION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

const emailSchema = z.string().trim().toLowerCase().email('Enter a valid email address.').max(254);
const nameSchema = z.string().trim().min(2, 'Enter your name.').max(120);

function firstIssue(error: z.ZodError): ValidationError {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_';
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return new ValidationError(error.issues[0]?.message ?? 'Please check the form.', fieldErrors);
}

/**
 * First-run setup: creates the organisation and its first Administrator.
 * Works only while no organisation exists — afterwards people can join by invitation only.
 */
export async function setupFirstOrganisation(input: {
  organisationName: string;
  name: string;
  email: string;
  password: string;
  ip?: string | null;
}): Promise<{ userId: string; organisationId: string }> {
  const parsed = z
    .object({
      organisationName: z.string().trim().min(2, 'Enter your company or organisation name.').max(120),
      name: nameSchema,
      email: emailSchema,
      password: z.string(),
    })
    .safeParse(input);
  if (!parsed.success) throw firstIssue(parsed.error);
  const problem = passwordProblem(parsed.data.password, { email: parsed.data.email, name: parsed.data.name });
  if (problem) throw new ValidationError(problem, { password: problem });

  const passwordHash = await hashPassword(parsed.data.password);
  const db = await getDb();
  return db.transaction(async (tx) => {
    // Serialise concurrent first-run attempts.
    await tx.execute(sql`select pg_advisory_xact_lock(727001)`);
    const existing = await tx.select({ id: schema.organisations.id }).from(schema.organisations).limit(1);
    if (existing.length) {
      throw new ForbiddenError('Setup has already been completed. Ask an administrator for an invitation.');
    }
    const [org] = await tx
      .insert(schema.organisations)
      .values({ name: parsed.data.organisationName, slug: slugify(parsed.data.organisationName) })
      .returning({ id: schema.organisations.id });
    const [user] = await tx
      .insert(schema.users)
      .values({ email: parsed.data.email, name: parsed.data.name, passwordHash })
      .returning({ id: schema.users.id });
    await tx.insert(schema.memberships).values({ organisationId: org.id, userId: user.id, roleKey: 'administrator', brandScope: 'all' });
    await tx.insert(schema.auditLogs).values({
      organisationId: org.id,
      actorUserId: user.id,
      actorLabel: parsed.data.name,
      action: 'organisation.created',
      entityType: 'organisation',
      entityId: org.id,
      summary: `Organisation "${parsed.data.organisationName}" created; ${parsed.data.name} is its first Administrator`,
      ip: input.ip ?? null,
    });
    return { userId: user.id, organisationId: org.id };
  });
}

export async function listMembers(ctx: RequestContext) {
  assertCan(ctx, 'users.manage');
  const db = await getDb();
  const rows = await db
    .select({
      membershipId: schema.memberships.id,
      userId: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
      status: schema.users.status,
      roleKey: schema.memberships.roleKey,
      brandScope: schema.memberships.brandScope,
      lastLoginAt: schema.users.lastLoginAt,
      createdAt: schema.memberships.createdAt,
    })
    .from(schema.memberships)
    .innerJoin(schema.users, eq(schema.users.id, schema.memberships.userId))
    .where(eq(schema.memberships.organisationId, ctx.organisation.id))
    .orderBy(schema.users.name);
  const access = await db
    .select({ membershipId: schema.membershipBrandAccess.membershipId, brandId: schema.membershipBrandAccess.brandId })
    .from(schema.membershipBrandAccess)
    .innerJoin(schema.memberships, eq(schema.memberships.id, schema.membershipBrandAccess.membershipId))
    .where(eq(schema.memberships.organisationId, ctx.organisation.id));
  return rows.map((r) => ({
    ...r,
    roleKey: r.roleKey as RoleKey,
    brandIds: access.filter((a) => a.membershipId === r.membershipId).map((a) => a.brandId),
  }));
}

async function assertBrandsBelongToOrg(ctx: RequestContext, brandIds: string[]): Promise<void> {
  if (!brandIds.length) return;
  const db = await getDb();
  const rows = await db
    .select({ id: schema.brands.id })
    .from(schema.brands)
    .where(eq(schema.brands.organisationId, ctx.organisation.id));
  const valid = new Set(rows.map((r) => r.id));
  for (const id of brandIds) {
    if (!valid.has(id)) throw new ValidationError('One of the selected brands does not exist.');
  }
}

const inviteSchema = z.object({
  email: emailSchema,
  roleKey: z.string().refine(isRoleKey, 'Choose a role.'),
  brandIds: z.array(z.string().uuid()).default([]),
});

/**
 * Create an invitation. Returns the one-time link token: the administrator shares the link with the
 * person through a channel they trust. (Email delivery is added in a later stage.)
 */
export async function createInvitation(ctx: RequestContext, input: { email: string; roleKey: string; brandIds?: string[] }) {
  assertCan(ctx, 'users.manage');
  const parsed = inviteSchema.safeParse(input);
  if (!parsed.success) throw firstIssue(parsed.error);
  const roleKey = parsed.data.roleKey as RoleKey;
  const restricted = ROLES[roleKey].isExternal || parsed.data.brandIds.length > 0;
  if (ROLES[roleKey].isExternal && parsed.data.brandIds.length === 0) {
    throw new ValidationError('Choose at least one brand for an external contributor.', { brandIds: 'Choose at least one brand.' });
  }
  await assertBrandsBelongToOrg(ctx, parsed.data.brandIds);

  const db = await getDb();
  const existingUser = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .innerJoin(schema.memberships, eq(schema.memberships.userId, schema.users.id))
    .where(and(eq(schema.users.email, parsed.data.email), eq(schema.memberships.organisationId, ctx.organisation.id)))
    .limit(1);
  if (existingUser.length) throw new ValidationError('This person is already a member.', { email: 'Already a member.' });

  const token = newToken();
  const expiresAt = new Date(Date.now() + INVITATION_LIFETIME_MS);
  const id = await db.transaction(async (tx) => {
    // A new invitation replaces any pending one for the same email.
    await tx
      .update(schema.invitations)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(schema.invitations.organisationId, ctx.organisation.id),
          eq(schema.invitations.email, parsed.data.email),
          isNull(schema.invitations.acceptedAt),
          isNull(schema.invitations.revokedAt),
        ),
      );
    const [row] = await tx
      .insert(schema.invitations)
      .values({
        organisationId: ctx.organisation.id,
        email: parsed.data.email,
        roleKey,
        brandScope: restricted ? 'restricted' : 'all',
        brandIds: parsed.data.brandIds,
        tokenHash: hashToken(token),
        invitedBy: ctx.user.id,
        expiresAt,
      })
      .returning({ id: schema.invitations.id });
    await audit(
      ctx,
      {
        action: 'invitation.created',
        entityType: 'invitation',
        entityId: row.id,
        summary: `Invited ${parsed.data.email} as ${ROLES[roleKey].name}`,
        metadata: { roleKey, brandIds: parsed.data.brandIds },
      },
      tx,
    );
    return row.id;
  });
  return { id, token, expiresAt };
}

export async function listInvitations(ctx: RequestContext) {
  assertCan(ctx, 'users.manage');
  const db = await getDb();
  const rows = await db
    .select({
      id: schema.invitations.id,
      email: schema.invitations.email,
      roleKey: schema.invitations.roleKey,
      expiresAt: schema.invitations.expiresAt,
      acceptedAt: schema.invitations.acceptedAt,
      revokedAt: schema.invitations.revokedAt,
      createdAt: schema.invitations.createdAt,
    })
    .from(schema.invitations)
    .where(eq(schema.invitations.organisationId, ctx.organisation.id))
    .orderBy(desc(schema.invitations.createdAt))
    .limit(100);
  const now = Date.now();
  return rows.map((row) => ({ ...row, isPending: !row.acceptedAt && !row.revokedAt && row.expiresAt.getTime() > now }));
}

export async function revokeInvitation(ctx: RequestContext, invitationId: string): Promise<void> {
  assertCan(ctx, 'users.manage');
  const db = await getDb();
  const rows = await db
    .update(schema.invitations)
    .set({ revokedAt: new Date() })
    .where(and(eq(schema.invitations.id, invitationId), eq(schema.invitations.organisationId, ctx.organisation.id), isNull(schema.invitations.acceptedAt)))
    .returning({ email: schema.invitations.email });
  if (!rows.length) throw new NotFoundError('Invitation not found.');
  await audit(ctx, { action: 'invitation.revoked', entityType: 'invitation', entityId: invitationId, summary: `Revoked invitation for ${rows[0].email}` });
}

/** Public: what an invitation link shows before it is accepted. Reveals nothing for invalid tokens. */
export async function getInvitationByToken(token: string) {
  if (!token || token.length > 200) return null;
  const db = await getDb();
  const rows = await db
    .select({
      id: schema.invitations.id,
      email: schema.invitations.email,
      roleKey: schema.invitations.roleKey,
      organisationName: schema.organisations.name,
      expiresAt: schema.invitations.expiresAt,
    })
    .from(schema.invitations)
    .innerJoin(schema.organisations, eq(schema.organisations.id, schema.invitations.organisationId))
    .where(
      and(
        eq(schema.invitations.tokenHash, hashToken(token)),
        isNull(schema.invitations.acceptedAt),
        isNull(schema.invitations.revokedAt),
        gt(schema.invitations.expiresAt, new Date()),
      ),
    )
    .limit(1);
  const row = rows[0];
  if (!row || !isRoleKey(row.roleKey)) return null;
  return { ...row, roleKey: row.roleKey as RoleKey, roleName: ROLES[row.roleKey as RoleKey].name };
}

export async function acceptInvitation(input: { token: string; name: string; password: string; ip?: string | null }) {
  const parsedName = nameSchema.safeParse(input.name);
  if (!parsedName.success) throw new ValidationError('Enter your name.', { name: 'Enter your name.' });
  const db = await getDb();
  const tokenHash = hashToken(input.token);

  const pending = await db
    .select()
    .from(schema.invitations)
    .where(
      and(
        eq(schema.invitations.tokenHash, tokenHash),
        isNull(schema.invitations.acceptedAt),
        isNull(schema.invitations.revokedAt),
        gt(schema.invitations.expiresAt, new Date()),
      ),
    )
    .limit(1);
  const invitation = pending[0];
  if (!invitation || !isRoleKey(invitation.roleKey)) {
    throw new ValidationError('This invitation link is invalid or has expired. Ask your administrator for a new one.');
  }
  const problem = passwordProblem(input.password, { email: invitation.email, name: parsedName.data });
  if (problem) throw new ValidationError(problem, { password: problem });
  const passwordHash = await hashPassword(input.password);

  return db.transaction(async (tx) => {
    // Re-check inside the transaction so a link cannot be used twice.
    const claimed = await tx
      .update(schema.invitations)
      .set({ acceptedAt: new Date() })
      .where(and(eq(schema.invitations.id, invitation.id), isNull(schema.invitations.acceptedAt), isNull(schema.invitations.revokedAt)))
      .returning({ id: schema.invitations.id });
    if (!claimed.length) throw new ValidationError('This invitation has already been used.');

    const existing = await tx.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, normaliseEmail(invitation.email))).limit(1);
    if (existing.length) {
      throw new ValidationError('An account with this email already exists. Ask your administrator for help.');
    }
    const [user] = await tx
      .insert(schema.users)
      .values({ email: normaliseEmail(invitation.email), name: parsedName.data, passwordHash })
      .returning({ id: schema.users.id });
    const [membership] = await tx
      .insert(schema.memberships)
      .values({
        organisationId: invitation.organisationId,
        userId: user.id,
        roleKey: invitation.roleKey,
        brandScope: invitation.brandScope,
        invitedBy: invitation.invitedBy,
      })
      .returning({ id: schema.memberships.id });
    if (invitation.brandScope === 'restricted' && invitation.brandIds.length) {
      const validBrands = await tx
        .select({ id: schema.brands.id })
        .from(schema.brands)
        .where(eq(schema.brands.organisationId, invitation.organisationId));
      const valid = new Set(validBrands.map((b) => b.id));
      const rows = invitation.brandIds.filter((b) => valid.has(b)).map((brandId) => ({ membershipId: membership.id, brandId }));
      if (rows.length) await tx.insert(schema.membershipBrandAccess).values(rows);
    }
    await tx.insert(schema.auditLogs).values({
      organisationId: invitation.organisationId,
      actorUserId: user.id,
      actorLabel: parsedName.data,
      action: 'invitation.accepted',
      entityType: 'user',
      entityId: user.id,
      summary: `${parsedName.data} (${invitation.email}) joined as ${ROLES[invitation.roleKey as RoleKey].name}`,
      ip: input.ip ?? null,
    });
    return { userId: user.id, organisationId: invitation.organisationId };
  });
}

async function countActiveAdmins(organisationId: string): Promise<number> {
  const db = await getDb();
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(schema.memberships)
    .innerJoin(schema.users, eq(schema.users.id, schema.memberships.userId))
    .where(and(eq(schema.memberships.organisationId, organisationId), eq(schema.memberships.roleKey, 'administrator'), eq(schema.users.status, 'active')));
  return row?.n ?? 0;
}

export async function updateMember(ctx: RequestContext, membershipId: string, input: { roleKey: string; brandIds?: string[] }): Promise<void> {
  assertCan(ctx, 'users.manage');
  if (!isRoleKey(input.roleKey)) throw new ValidationError('Choose a role.');
  const brandIds = input.brandIds ?? [];
  await assertBrandsBelongToOrg(ctx, brandIds);
  const db = await getDb();
  const rows = await db
    .select({ id: schema.memberships.id, userId: schema.memberships.userId, roleKey: schema.memberships.roleKey, name: schema.users.name })
    .from(schema.memberships)
    .innerJoin(schema.users, eq(schema.users.id, schema.memberships.userId))
    .where(and(eq(schema.memberships.id, membershipId), eq(schema.memberships.organisationId, ctx.organisation.id)))
    .limit(1);
  const member = rows[0];
  if (!member) throw new NotFoundError('Member not found.');
  if (member.userId === ctx.user.id && input.roleKey !== member.roleKey) {
    throw new ForbiddenError('You cannot change your own role. Ask another administrator.');
  }
  if (member.roleKey === 'administrator' && input.roleKey !== 'administrator' && (await countActiveAdmins(ctx.organisation.id)) <= 1) {
    throw new ForbiddenError('There must always be at least one active Administrator.');
  }
  const restricted = ROLES[input.roleKey].isExternal || brandIds.length > 0;
  if (ROLES[input.roleKey].isExternal && !brandIds.length) {
    throw new ValidationError('Choose at least one brand for an external contributor.');
  }
  await db.transaction(async (tx) => {
    await tx
      .update(schema.memberships)
      .set({ roleKey: input.roleKey, brandScope: restricted ? 'restricted' : 'all', updatedAt: new Date() })
      .where(eq(schema.memberships.id, membershipId));
    await tx.delete(schema.membershipBrandAccess).where(eq(schema.membershipBrandAccess.membershipId, membershipId));
    if (restricted && brandIds.length) {
      await tx.insert(schema.membershipBrandAccess).values(brandIds.map((brandId) => ({ membershipId, brandId })));
    }
    await audit(
      ctx,
      {
        action: 'member.updated',
        entityType: 'user',
        entityId: member.userId,
        summary: `Changed ${member.name} to ${ROLES[input.roleKey as RoleKey].name}${restricted ? ` (limited to ${brandIds.length} brand${brandIds.length === 1 ? '' : 's'})` : ''}`,
        metadata: { previousRole: member.roleKey, roleKey: input.roleKey, brandIds },
      },
      tx,
    );
  });
}

export async function setMemberStatus(ctx: RequestContext, userId: string, status: 'active' | 'disabled'): Promise<void> {
  assertCan(ctx, 'users.manage');
  if (userId === ctx.user.id) throw new ForbiddenError('You cannot disable your own account.');
  const db = await getDb();
  const rows = await db
    .select({ roleKey: schema.memberships.roleKey, name: schema.users.name, status: schema.users.status })
    .from(schema.memberships)
    .innerJoin(schema.users, eq(schema.users.id, schema.memberships.userId))
    .where(and(eq(schema.memberships.userId, userId), eq(schema.memberships.organisationId, ctx.organisation.id)))
    .limit(1);
  const member = rows[0];
  if (!member) throw new NotFoundError('Member not found.');
  if (status === 'disabled' && member.roleKey === 'administrator' && (await countActiveAdmins(ctx.organisation.id)) <= 1) {
    throw new ForbiddenError('There must always be at least one active Administrator.');
  }
  await db.update(schema.users).set({ status, updatedAt: new Date() }).where(eq(schema.users.id, userId));
  if (status === 'disabled') await revokeAllSessionsForUser(userId);
  await audit(ctx, {
    action: status === 'disabled' ? 'member.disabled' : 'member.enabled',
    entityType: 'user',
    entityId: userId,
    summary: `${status === 'disabled' ? 'Disabled' : 'Re-enabled'} ${member.name}'s account`,
  });
}

export async function updateOrganisationSettings(ctx: RequestContext, input: { name?: string; allowExternalAi?: boolean }): Promise<void> {
  assertCan(ctx, 'org.manage');
  const db = await getDb();
  const name = input.name?.trim();
  if (name !== undefined && (name.length < 2 || name.length > 120)) throw new ValidationError('Enter an organisation name.', { name: 'Enter a name.' });
  const settings = { ...ctx.organisation.settings };
  if (input.allowExternalAi !== undefined) settings.allowExternalAi = input.allowExternalAi;
  await db
    .update(schema.organisations)
    .set({ ...(name ? { name } : {}), settings, updatedAt: new Date() })
    .where(eq(schema.organisations.id, ctx.organisation.id));
  await audit(ctx, {
    action: 'organisation.settings_updated',
    entityType: 'organisation',
    entityId: ctx.organisation.id,
    summary:
      input.allowExternalAi !== undefined && input.allowExternalAi !== Boolean(ctx.organisation.settings.allowExternalAi)
        ? `External AI processing ${input.allowExternalAi ? 'ENABLED' : 'DISABLED'} for the organisation`
        : 'Updated organisation settings',
    metadata: { name, allowExternalAi: settings.allowExternalAi ?? false },
  });
}
