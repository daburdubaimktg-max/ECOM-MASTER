import { createHash, randomBytes } from 'node:crypto';
import { and, eq, gt, inArray, lt, ne, sql } from 'drizzle-orm';
import { getDb, schema } from '@/db/client';
import type { RequestContext } from './context';
import { hashPassword, verifyPassword } from './password';
import { isRoleKey, ROLES } from './permissions';

/**
 * Session management without any framework dependency (so it can be tested directly).
 *
 * A session token is 32 random bytes. The browser keeps the token in an HTTP-only cookie; the
 * database stores only its SHA-256 hash, so a leaked database cannot be used to hijack sessions.
 */
export const SESSION_COOKIE = 'bie_session';
const SESSION_LIFETIME_MS = 14 * 24 * 60 * 60 * 1000;
const SESSION_REFRESH_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
export const SESSION_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

const MAX_FAILED_PER_EMAIL = 8;
const MAX_FAILED_PER_IP = 40;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function newToken(): string {
  return randomBytes(32).toString('base64url');
}

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function createSession(input: {
  userId: string;
  organisationId: string;
  ip?: string | null;
  userAgent?: string | null;
}): Promise<{ token: string; expiresAt: Date }> {
  const db = await getDb();
  const token = newToken();
  const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS);
  await db.insert(schema.sessions).values({
    userId: input.userId,
    organisationId: input.organisationId,
    tokenHash: hashToken(token),
    expiresAt,
    ip: input.ip ?? null,
    userAgent: input.userAgent?.slice(0, 300) ?? null,
  });
  return { token, expiresAt };
}

/** Resolve a session token to a full request context, or null when the session is missing, expired or revoked. */
export async function contextFromToken(token: string | undefined | null, ip?: string | null): Promise<RequestContext | null> {
  if (!token || token.length < 20 || token.length > 200) return null;
  const db = await getDb();
  const now = new Date();
  const rows = await db
    .select({
      sessionId: schema.sessions.id,
      expiresAt: schema.sessions.expiresAt,
      userId: schema.users.id,
      userName: schema.users.name,
      userEmail: schema.users.email,
      userStatus: schema.users.status,
      orgId: schema.organisations.id,
      orgName: schema.organisations.name,
      orgSlug: schema.organisations.slug,
      orgSettings: schema.organisations.settings,
      membershipId: schema.memberships.id,
      roleKey: schema.memberships.roleKey,
      brandScope: schema.memberships.brandScope,
    })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .innerJoin(schema.organisations, eq(schema.organisations.id, schema.sessions.organisationId))
    .innerJoin(
      schema.memberships,
      and(eq(schema.memberships.userId, schema.sessions.userId), eq(schema.memberships.organisationId, schema.sessions.organisationId)),
    )
    .where(and(eq(schema.sessions.tokenHash, hashToken(token)), gt(schema.sessions.expiresAt, now)))
    .limit(1);

  const row = rows[0];
  if (!row || row.userStatus !== 'active' || !isRoleKey(row.roleKey)) return null;

  // External roles are always brand-restricted, whatever the stored scope says.
  const restricted = row.brandScope === 'restricted' || ROLES[row.roleKey].isExternal;
  let brandIds: string[] | null = null;
  if (restricted) {
    const access = await db
      .select({ brandId: schema.membershipBrandAccess.brandId })
      .from(schema.membershipBrandAccess)
      .where(eq(schema.membershipBrandAccess.membershipId, row.membershipId));
    brandIds = access.map((a) => a.brandId);
  }

  // Sliding expiry: extend quietly when the session is in its second half of life.
  if (row.expiresAt.getTime() - now.getTime() < SESSION_REFRESH_WINDOW_MS) {
    await db
      .update(schema.sessions)
      .set({ expiresAt: new Date(now.getTime() + SESSION_LIFETIME_MS), lastSeenAt: now })
      .where(eq(schema.sessions.id, row.sessionId));
  }

  return {
    user: { id: row.userId, name: row.userName, email: row.userEmail },
    organisation: { id: row.orgId, name: row.orgName, slug: row.orgSlug, settings: row.orgSettings ?? {} },
    membership: { id: row.membershipId, role: row.roleKey, brandIds },
    ip: ip ?? null,
  };
}

export async function revokeSession(token: string | undefined | null): Promise<void> {
  if (!token) return;
  const db = await getDb();
  await db.delete(schema.sessions).where(eq(schema.sessions.tokenHash, hashToken(token)));
}

export async function revokeAllSessionsForUser(userId: string): Promise<void> {
  const db = await getDb();
  await db.delete(schema.sessions).where(eq(schema.sessions.userId, userId));
}

/** Sign a person out everywhere except the device they are using now (after they change their password). */
export async function revokeOtherSessionsForUser(userId: string, keepToken: string | undefined | null): Promise<void> {
  const db = await getDb();
  await db
    .delete(schema.sessions)
    .where(keepToken ? and(eq(schema.sessions.userId, userId), ne(schema.sessions.tokenHash, hashToken(keepToken))) : eq(schema.sessions.userId, userId));
}

/**
 * Confirm a signed-in person's current password before a sensitive change. Wrong guesses count
 * towards the same lock-out as sign-in, so a stolen session cannot be used to guess the password.
 */
export async function confirmPassword(input: { userId: string; password: string; ip?: string | null }): Promise<'ok' | 'invalid' | 'rate_limited'> {
  const db = await getDb();
  const rows = await db
    .select({ email: schema.users.email, passwordHash: schema.users.passwordHash, status: schema.users.status })
    .from(schema.users)
    .where(eq(schema.users.id, input.userId))
    .limit(1);
  const user = rows[0];
  if (!user || user.status !== 'active') return 'invalid';
  const since = new Date(Date.now() - LOCKOUT_WINDOW_MS);
  const [{ failed }] = await db
    .select({ failed: sql<number>`count(*)::int` })
    .from(schema.loginAttempts)
    .where(and(eq(schema.loginAttempts.email, user.email), eq(schema.loginAttempts.success, false), gt(schema.loginAttempts.createdAt, since)));
  if (failed >= MAX_FAILED_PER_EMAIL) return 'rate_limited';
  if (await verifyPassword(input.password, user.passwordHash)) return 'ok';
  await db.insert(schema.loginAttempts).values({ email: user.email, ip: input.ip ?? null, success: false });
  return 'invalid';
}

export async function purgeExpiredSessions(): Promise<void> {
  const db = await getDb();
  await db.delete(schema.sessions).where(lt(schema.sessions.expiresAt, new Date()));
}

export type SignInResult =
  | { ok: true; userId: string; organisationId: string }
  | { ok: false; reason: 'invalid' | 'rate_limited' };

/** A valid hash of a random password, used so that unknown emails take as long to check as known ones. */
let dummyHashPromise: Promise<string> | null = null;
function dummyHash(): Promise<string> {
  dummyHashPromise ??= hashPassword(newToken());
  return dummyHashPromise;
}

export async function verifyCredentials(input: { email: string; password: string; ip?: string | null }): Promise<SignInResult> {
  const db = await getDb();
  const email = normaliseEmail(input.email);
  const since = new Date(Date.now() - LOCKOUT_WINDOW_MS);

  const [{ failedForEmail }] = await db
    .select({ failedForEmail: sql<number>`count(*)::int` })
    .from(schema.loginAttempts)
    .where(and(eq(schema.loginAttempts.email, email), eq(schema.loginAttempts.success, false), gt(schema.loginAttempts.createdAt, since)));
  let failedForIp = 0;
  if (input.ip) {
    const [row] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(schema.loginAttempts)
      .where(and(eq(schema.loginAttempts.ip, input.ip), eq(schema.loginAttempts.success, false), gt(schema.loginAttempts.createdAt, since)));
    failedForIp = row?.n ?? 0;
  }
  if (failedForEmail >= MAX_FAILED_PER_EMAIL || failedForIp >= MAX_FAILED_PER_IP) {
    return { ok: false, reason: 'rate_limited' };
  }

  const users = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
  const user = users[0];
  const passwordOk = await verifyPassword(input.password, user?.passwordHash ?? (await dummyHash()));

  let organisationId: string | null = null;
  if (user && passwordOk && user.status === 'active') {
    const membership = await db
      .select({ organisationId: schema.memberships.organisationId })
      .from(schema.memberships)
      .where(eq(schema.memberships.userId, user.id))
      .orderBy(schema.memberships.createdAt)
      .limit(1);
    organisationId = membership[0]?.organisationId ?? null;
  }

  const success = Boolean(user && passwordOk && user.status === 'active' && organisationId);
  await db.insert(schema.loginAttempts).values({ email, ip: input.ip ?? null, success });
  if (!success || !user || !organisationId) return { ok: false, reason: 'invalid' };

  await db.update(schema.users).set({ lastLoginAt: new Date() }).where(eq(schema.users.id, user.id));
  await db.insert(schema.auditLogs).values({
    organisationId,
    actorUserId: user.id,
    actorLabel: user.name,
    action: 'auth.sign_in',
    entityType: 'user',
    entityId: user.id,
    summary: `${user.name} signed in`,
    ip: input.ip ?? null,
  });
  return { ok: true, userId: user.id, organisationId };
}

export async function hasAnyOrganisation(): Promise<boolean> {
  const db = await getDb();
  const rows = await db.select({ id: schema.organisations.id }).from(schema.organisations).limit(1);
  return rows.length > 0;
}

/** Drop old sign-in attempt rows so the table stays small. */
export async function purgeOldLoginAttempts(): Promise<void> {
  const db = await getDb();
  await db.delete(schema.loginAttempts).where(lt(schema.loginAttempts.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)));
}

export { inArray };
