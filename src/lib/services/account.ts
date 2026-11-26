import { and, eq, gt, isNull } from 'drizzle-orm';
import { getDb, schema } from '@/db/client';
import type { RequestContext } from '@/lib/auth/context';
import { assertCan } from '@/lib/auth/context';
import { hashPassword, passwordProblem } from '@/lib/auth/password';
import { NotFoundError, ValidationError } from '@/lib/auth/permissions';
import { confirmPassword, hashToken, newToken, normaliseEmail, revokeOtherSessionsForUser } from '@/lib/auth/session';
import { audit } from './audit';

/**
 * A person's own account: changing their password, and recovering it when it has been forgotten.
 *
 * There is deliberately no "email me a reset link" form on the sign-in page: it would need an email
 * service and would tell a stranger whether an address has an account. Instead an Administrator
 * creates a one-time link for a team member, and a locked-out Administrator creates one from the
 * server command line (`npm run admin:reset-link`).
 */
export const RESET_LINK_LIFETIME_MS = 24 * 60 * 60 * 1000;

const INVALID_LINK = 'This link is not valid any more. It may have expired or been used already — ask your administrator for a new one.';

/** Any signed-in person may change their own password; they must know the current one. */
export async function changeOwnPassword(
  ctx: RequestContext,
  input: { currentPassword: string; newPassword: string; keepSessionToken?: string | null },
): Promise<void> {
  const check = await confirmPassword({ userId: ctx.user.id, password: input.currentPassword, ip: ctx.ip });
  if (check === 'rate_limited') throw new ValidationError('Too many incorrect attempts. Please wait 15 minutes and try again.');
  if (check !== 'ok') throw new ValidationError('The current password is not correct.', { currentPassword: 'This is not your current password.' });

  const problem = passwordProblem(input.newPassword, { email: ctx.user.email, name: ctx.user.name });
  if (problem) throw new ValidationError(problem, { newPassword: problem });
  if (input.newPassword === input.currentPassword) {
    const message = 'Choose a password that is different from your current one.';
    throw new ValidationError(message, { newPassword: message });
  }

  const passwordHash = await hashPassword(input.newPassword);
  const db = await getDb();
  await db.transaction(async (tx) => {
    await tx.update(schema.users).set({ passwordHash, updatedAt: new Date() }).where(eq(schema.users.id, ctx.user.id));
    // Any reset link still waiting to be used stops working.
    await tx.delete(schema.passwordResets).where(and(eq(schema.passwordResets.userId, ctx.user.id), isNull(schema.passwordResets.usedAt)));
    await audit(ctx, { action: 'account.password_changed', entityType: 'user', entityId: ctx.user.id, summary: `${ctx.user.name} changed their password` }, tx);
  });
  // Every other device is signed out; the one being used stays signed in.
  await revokeOtherSessionsForUser(ctx.user.id, input.keepSessionToken ?? null);
}

/** Administrators only: create a one-time link with which a team member can set a new password. */
export async function createPasswordResetLink(ctx: RequestContext, userId: string): Promise<{ token: string; expiresAt: Date; name: string; email: string }> {
  assertCan(ctx, 'users.manage');
  const db = await getDb();
  const rows = await db
    .select({ id: schema.users.id, name: schema.users.name, email: schema.users.email, status: schema.users.status })
    .from(schema.users)
    .innerJoin(schema.memberships, eq(schema.memberships.userId, schema.users.id))
    .where(and(eq(schema.users.id, userId), eq(schema.memberships.organisationId, ctx.organisation.id)))
    .limit(1);
  const member = rows[0];
  if (!member) throw new NotFoundError('That person is not a member of this organisation.');
  if (member.status !== 'active') throw new ValidationError('This account is disabled. Re-enable it before creating a reset link.');

  const token = newToken();
  const expiresAt = new Date(Date.now() + RESET_LINK_LIFETIME_MS);
  await db.transaction(async (tx) => {
    // A new link replaces any earlier one that has not been used.
    await tx.delete(schema.passwordResets).where(and(eq(schema.passwordResets.userId, member.id), isNull(schema.passwordResets.usedAt)));
    await tx.insert(schema.passwordResets).values({ userId: member.id, tokenHash: hashToken(token), createdBy: ctx.user.id, expiresAt });
    await audit(
      ctx,
      {
        action: 'member.password_reset_link_created',
        entityType: 'user',
        entityId: member.id,
        summary: `Created a password-reset link for ${member.name}`,
        metadata: { expiresAt: expiresAt.toISOString() },
      },
      tx,
    );
  });
  return { token, expiresAt, name: member.name, email: member.email };
}

/**
 * Recovery from the server command line, for when no Administrator can sign in. Whoever can run a
 * command on the server already controls the installation, so no sign-in is asked for — but the
 * event is written to the audit log like any other.
 */
export async function createPasswordResetFromCommandLine(email: string): Promise<{ token: string; expiresAt: Date; name: string } | null> {
  const db = await getDb();
  const rows = await db
    .select({ id: schema.users.id, name: schema.users.name, status: schema.users.status })
    .from(schema.users)
    .where(eq(schema.users.email, normaliseEmail(email)))
    .limit(1);
  const user = rows[0];
  if (!user || user.status !== 'active') return null;

  const token = newToken();
  const expiresAt = new Date(Date.now() + RESET_LINK_LIFETIME_MS);
  await db.transaction(async (tx) => {
    await tx.delete(schema.passwordResets).where(and(eq(schema.passwordResets.userId, user.id), isNull(schema.passwordResets.usedAt)));
    await tx.insert(schema.passwordResets).values({ userId: user.id, tokenHash: hashToken(token), createdBy: null, expiresAt });
    const memberships = await tx.select({ organisationId: schema.memberships.organisationId }).from(schema.memberships).where(eq(schema.memberships.userId, user.id));
    for (const membership of memberships) {
      await tx.insert(schema.auditLogs).values({
        organisationId: membership.organisationId,
        actorUserId: null,
        actorLabel: 'Server command line',
        action: 'member.password_reset_link_created',
        entityType: 'user',
        entityId: user.id,
        summary: `A password-reset link for ${user.name} was created from the server command line`,
        metadata: { expiresAt: expiresAt.toISOString() },
      });
    }
  });
  return { token, expiresAt, name: user.name };
}

async function findUsableReset(token: string) {
  if (!token || token.length < 20 || token.length > 200) return null;
  const db = await getDb();
  const rows = await db
    .select({ id: schema.passwordResets.id, userId: schema.users.id, name: schema.users.name, email: schema.users.email })
    .from(schema.passwordResets)
    .innerJoin(schema.users, eq(schema.users.id, schema.passwordResets.userId))
    .where(
      and(
        eq(schema.passwordResets.tokenHash, hashToken(token)),
        isNull(schema.passwordResets.usedAt),
        gt(schema.passwordResets.expiresAt, new Date()),
        eq(schema.users.status, 'active'),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

/** Public: what a reset link shows before it is used. Reveals nothing for an invalid link. */
export async function getPasswordResetByToken(token: string): Promise<{ name: string; email: string } | null> {
  const reset = await findUsableReset(token);
  return reset ? { name: reset.name, email: reset.email } : null;
}

/** Public: set a new password with a valid one-time link. Signs the person out everywhere. */
export async function completePasswordReset(input: { token: string; password: string; ip?: string | null }): Promise<{ email: string }> {
  const reset = await findUsableReset(input.token);
  if (!reset) throw new ValidationError(INVALID_LINK);
  const problem = passwordProblem(input.password, { email: reset.email, name: reset.name });
  if (problem) throw new ValidationError(problem, { password: problem });
  const passwordHash = await hashPassword(input.password);

  const db = await getDb();
  await db.transaction(async (tx) => {
    // Claim the link inside the transaction so it cannot be used twice.
    const claimed = await tx
      .update(schema.passwordResets)
      .set({ usedAt: new Date() })
      .where(and(eq(schema.passwordResets.id, reset.id), isNull(schema.passwordResets.usedAt), gt(schema.passwordResets.expiresAt, new Date())))
      .returning({ id: schema.passwordResets.id });
    if (!claimed.length) throw new ValidationError(INVALID_LINK);

    await tx.update(schema.users).set({ passwordHash, updatedAt: new Date() }).where(eq(schema.users.id, reset.userId));
    await tx.delete(schema.sessions).where(eq(schema.sessions.userId, reset.userId));
    // Earlier wrong guesses no longer count, so the person can sign in straight away.
    await tx.delete(schema.loginAttempts).where(and(eq(schema.loginAttempts.email, reset.email), eq(schema.loginAttempts.success, false)));

    const memberships = await tx.select({ organisationId: schema.memberships.organisationId }).from(schema.memberships).where(eq(schema.memberships.userId, reset.userId));
    for (const membership of memberships) {
      await tx.insert(schema.auditLogs).values({
        organisationId: membership.organisationId,
        actorUserId: reset.userId,
        actorLabel: reset.name,
        action: 'account.password_reset',
        entityType: 'user',
        entityId: reset.userId,
        summary: `${reset.name} set a new password using a reset link`,
        ip: input.ip ?? null,
      });
    }
  });
  return { email: reset.email };
}
