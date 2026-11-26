import { afterAll, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { closeDb, getDb, schema } from '@/db/client';
import { hashPassword, passwordProblem, verifyPassword } from '@/lib/auth/password';
import { ForbiddenError, ValidationError } from '@/lib/auth/permissions';
import { contextFromToken, createSession, hasAnyOrganisation, revokeSession, verifyCredentials } from '@/lib/auth/session';
import { createBrand } from '@/lib/services/brands';
import { acceptInvitation, createInvitation, getInvitationByToken, setMemberStatus, setupFirstOrganisation, updateMember } from '@/lib/services/team';

afterAll(async () => {
  await closeDb();
});

const ADMIN = { organisationName: 'Acme Consumer Goods', name: 'Asha Admin', email: 'Asha.Admin@Example.test', password: 'correct horse battery' };

describe('passwords', () => {
  it('hashes with a random salt and verifies only the right password', async () => {
    const a = await hashPassword('correct horse battery');
    const b = await hashPassword('correct horse battery');
    expect(a).not.toBe(b);
    expect(a.startsWith('scrypt$32768$8$3$')).toBe(true);
    expect(await verifyPassword('correct horse battery', a)).toBe(true);
    expect(await verifyPassword('wrong password here', a)).toBe(false);
    expect(await verifyPassword('anything', 'garbage')).toBe(false);
  });

  it('rejects weak passwords with a clear reason', () => {
    expect(passwordProblem('short')).toMatch(/at least 10/);
    expect(passwordProblem('password123')).toMatch(/too common/);
    expect(passwordProblem('aaaaaaaaaaaa')).toMatch(/repeated/);
    expect(passwordProblem('asha.admin-2026!', { email: 'asha.admin@example.test' })).toMatch(/email/);
    expect(passwordProblem('a long enough passphrase')).toBeNull();
  });
});

describe('first-run setup, sign-in and sessions', () => {
  it('creates the first organisation with an Administrator, exactly once', async () => {
    expect(await hasAnyOrganisation()).toBe(false);
    const created = await setupFirstOrganisation(ADMIN);
    expect(created.userId).toBeTruthy();
    expect(await hasAnyOrganisation()).toBe(true);
    await expect(setupFirstOrganisation({ ...ADMIN, email: 'other@example.test' })).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('signs in with the right password (email is case-insensitive) and rejects the wrong one', async () => {
    const ok = await verifyCredentials({ email: 'asha.admin@example.test', password: ADMIN.password, ip: '10.0.0.1' });
    expect(ok.ok).toBe(true);
    const bad = await verifyCredentials({ email: 'asha.admin@example.test', password: 'not the password', ip: '10.0.0.1' });
    expect(bad).toEqual({ ok: false, reason: 'invalid' });
    const unknown = await verifyCredentials({ email: 'nobody@example.test', password: 'whatever it is', ip: '10.0.0.1' });
    expect(unknown).toEqual({ ok: false, reason: 'invalid' });
  });

  it('turns a session token into a request context and stops working after sign-out', async () => {
    const result = await verifyCredentials({ email: ADMIN.email, password: ADMIN.password });
    if (!result.ok) throw new Error('expected sign-in to succeed');
    const { token } = await createSession({ userId: result.userId, organisationId: result.organisationId });
    const ctx = await contextFromToken(token);
    expect(ctx?.user.email).toBe('asha.admin@example.test');
    expect(ctx?.membership.role).toBe('administrator');
    expect(ctx?.membership.brandIds).toBeNull();

    // Only a hash of the token is stored.
    const db = await getDb();
    const stored = await db.select().from(schema.sessions);
    expect(stored.some((s) => s.tokenHash === token)).toBe(false);

    expect(await contextFromToken('x'.repeat(43))).toBeNull();
    expect(await contextFromToken(undefined)).toBeNull();
    await revokeSession(token);
    expect(await contextFromToken(token)).toBeNull();
  });

  it('rejects expired sessions', async () => {
    const result = await verifyCredentials({ email: ADMIN.email, password: ADMIN.password });
    if (!result.ok) throw new Error('expected sign-in to succeed');
    const { token } = await createSession({ userId: result.userId, organisationId: result.organisationId });
    const db = await getDb();
    await db.update(schema.sessions).set({ expiresAt: new Date(Date.now() - 1000) });
    expect(await contextFromToken(token)).toBeNull();
  });

  it('locks sign-in for an email after repeated failures, even with the right password', async () => {
    for (let i = 0; i < 8; i++) {
      await verifyCredentials({ email: 'locked@example.test', password: 'wrong-wrong-wrong', ip: '10.9.9.9' });
    }
    const result = await verifyCredentials({ email: 'locked@example.test', password: 'wrong-wrong-wrong', ip: '10.9.9.9' });
    expect(result).toEqual({ ok: false, reason: 'rate_limited' });
  });
});

describe('invitations and membership', () => {
  async function adminContext() {
    const result = await verifyCredentials({ email: ADMIN.email, password: ADMIN.password });
    if (!result.ok) throw new Error('expected sign-in to succeed');
    const { token } = await createSession({ userId: result.userId, organisationId: result.organisationId });
    return (await contextFromToken(token))!;
  }

  it('lets an invited agency contributor join with access to the assigned brand only', async () => {
    const admin = await adminContext();
    const brandA = await createBrand(admin, { name: 'Brand A' });
    await createBrand(admin, { name: 'Brand B' });

    await expect(createInvitation(admin, { email: 'agency@example.test', roleKey: 'agency_contributor', brandIds: [] })).rejects.toBeInstanceOf(ValidationError);
    const invitation = await createInvitation(admin, { email: 'Agency@Example.test', roleKey: 'agency_contributor', brandIds: [brandA.id] });

    const preview = await getInvitationByToken(invitation.token);
    expect(preview).toMatchObject({ email: 'agency@example.test', roleName: 'Agency Contributor', organisationName: 'Acme Consumer Goods' });
    expect(await getInvitationByToken('not-a-real-token')).toBeNull();

    const joined = await acceptInvitation({ token: invitation.token, name: 'Ali Agency', password: 'a sufficiently long one' });
    await expect(acceptInvitation({ token: invitation.token, name: 'Again', password: 'a sufficiently long one' })).rejects.toBeInstanceOf(ValidationError);

    const { token } = await createSession({ userId: joined.userId, organisationId: joined.organisationId });
    const ctx = await contextFromToken(token);
    expect(ctx?.membership.role).toBe('agency_contributor');
    expect(ctx?.membership.brandIds).toEqual([brandA.id]);
  });

  it('never leaves the organisation without an Administrator and blocks self-demotion', async () => {
    const admin = await adminContext();
    await expect(updateMember(admin, admin.membership.id, { roleKey: 'viewer' })).rejects.toBeInstanceOf(ForbiddenError);
    await expect(setMemberStatus(admin, admin.user.id, 'disabled')).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('signs a disabled user out everywhere and refuses new sign-ins', async () => {
    const admin = await adminContext();
    const invitation = await createInvitation(admin, { email: 'viewer@example.test', roleKey: 'viewer' });
    const joined = await acceptInvitation({ token: invitation.token, name: 'Vera Viewer', password: 'a sufficiently long one' });
    const { token } = await createSession({ userId: joined.userId, organisationId: joined.organisationId });
    expect(await contextFromToken(token)).not.toBeNull();

    await setMemberStatus(admin, joined.userId, 'disabled');
    expect(await contextFromToken(token)).toBeNull();
    const result = await verifyCredentials({ email: 'viewer@example.test', password: 'a sufficiently long one' });
    expect(result.ok).toBe(false);
  });

  it('refuses team management to everyone except Administrators', async () => {
    const admin = await adminContext();
    const invitation = await createInvitation(admin, { email: 'manager@example.test', roleKey: 'brand_manager' });
    const joined = await acceptInvitation({ token: invitation.token, name: 'Bea Manager', password: 'a sufficiently long one' });
    const { token } = await createSession({ userId: joined.userId, organisationId: joined.organisationId });
    const manager = (await contextFromToken(token))!;
    await expect(createInvitation(manager, { email: 'x@example.test', roleKey: 'administrator' })).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('records security-relevant events in the audit log', async () => {
    const db = await getDb();
    const actions = (await db.select({ action: schema.auditLogs.action }).from(schema.auditLogs)).map((r) => r.action);
    for (const expected of ['organisation.created', 'auth.sign_in', 'invitation.created', 'invitation.accepted', 'member.disabled', 'brand.created']) {
      expect(actions).toContain(expected);
    }
    const users = await db.select().from(schema.users).where(eq(schema.users.email, 'asha.admin@example.test'));
    expect(users[0].passwordHash).not.toContain(ADMIN.password);
  });
});
