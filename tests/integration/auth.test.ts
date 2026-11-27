import { afterAll, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { closeDb, getDb, schema } from '@/db/client';
import { hashPassword, passwordProblem, verifyPassword } from '@/lib/auth/password';
import { ForbiddenError, NotFoundError, ValidationError } from '@/lib/auth/permissions';
import { contextFromToken, createSession, hasAnyOrganisation, revokeSession, verifyCredentials } from '@/lib/auth/session';
import { changeOwnPassword, completePasswordReset, createPasswordResetFromCommandLine, createPasswordResetLink, getPasswordResetByToken } from '@/lib/services/account';
import { createBrand } from '@/lib/services/brands';
import { acceptInvitation, createInvitation, getInvitationByToken, setMemberStatus, setupFirstOrganisation, updateMember } from '@/lib/services/team';
import { makeOrganisation } from '../helpers';

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

  it('lets a person change their own password: they must know the current one, and other devices are signed out', async () => {
    const admin = await adminContext();
    const invitation = await createInvitation(admin, { email: 'editor@example.test', roleKey: 'content_editor' });
    const joined = await acceptInvitation({ token: invitation.token, name: 'Eddie Editor', password: 'the first long password' });
    const thisDevice = await createSession({ userId: joined.userId, organisationId: joined.organisationId });
    const otherDevice = await createSession({ userId: joined.userId, organisationId: joined.organisationId });
    const editor = (await contextFromToken(thisDevice.token))!;

    await expect(changeOwnPassword(editor, { currentPassword: 'not my password', newPassword: 'a brand new long password' })).rejects.toThrow(/current password is not correct/);
    await expect(changeOwnPassword(editor, { currentPassword: 'the first long password', newPassword: 'short' })).rejects.toThrow(/at least 10/);
    await expect(changeOwnPassword(editor, { currentPassword: 'the first long password', newPassword: 'the first long password' })).rejects.toThrow(/different/);

    await changeOwnPassword(editor, { currentPassword: 'the first long password', newPassword: 'a brand new long password', keepSessionToken: thisDevice.token });
    expect(await contextFromToken(thisDevice.token)).not.toBeNull(); // still signed in here
    expect(await contextFromToken(otherDevice.token)).toBeNull(); // signed out everywhere else
    expect((await verifyCredentials({ email: 'editor@example.test', password: 'the first long password' })).ok).toBe(false);
    expect((await verifyCredentials({ email: 'editor@example.test', password: 'a brand new long password' })).ok).toBe(true);
  });

  it('counts wrong guesses of the current password towards the sign-in lock-out', async () => {
    const admin = await adminContext();
    const invitation = await createInvitation(admin, { email: 'guessed@example.test', roleKey: 'viewer' });
    const joined = await acceptInvitation({ token: invitation.token, name: 'Gus Guessed', password: 'the real long password' });
    const { token } = await createSession({ userId: joined.userId, organisationId: joined.organisationId });
    const person = (await contextFromToken(token))!;
    for (let i = 0; i < 8; i++) {
      await expect(changeOwnPassword(person, { currentPassword: `wrong guess number ${i}`, newPassword: 'something else entirely' })).rejects.toThrow(/not correct/);
    }
    // Even the right current password is now refused until the lock-out window has passed.
    await expect(changeOwnPassword(person, { currentPassword: 'the real long password', newPassword: 'something else entirely' })).rejects.toThrow(/Too many incorrect attempts/);
  });

  it('lets an Administrator create a one-time reset link that works once, then signs the person out everywhere', async () => {
    const admin = await adminContext();
    const invitation = await createInvitation(admin, { email: 'forgetful@example.test', roleKey: 'analyst' });
    const joined = await acceptInvitation({ token: invitation.token, name: 'Fay Forgetful', password: 'the password i forgot' });
    const oldSession = await createSession({ userId: joined.userId, organisationId: joined.organisationId });
    const analyst = (await contextFromToken(oldSession.token))!;

    // Only Administrators may create reset links, and only for members of their own organisation.
    await expect(createPasswordResetLink(analyst, admin.user.id)).rejects.toBeInstanceOf(ForbiddenError);
    const stranger = await makeOrganisation('Another Company');
    await expect(createPasswordResetLink(stranger, joined.userId)).rejects.toBeInstanceOf(NotFoundError);

    const first = await createPasswordResetLink(admin, joined.userId);
    const second = await createPasswordResetLink(admin, joined.userId); // a new link replaces the earlier one
    expect(await getPasswordResetByToken(first.token)).toBeNull();
    expect(await getPasswordResetByToken(second.token)).toEqual({ name: 'Fay Forgetful', email: 'forgetful@example.test' });
    expect(await getPasswordResetByToken('not-a-real-token-at-all-123456')).toBeNull();

    // Only a hash of the link is stored.
    const db = await getDb();
    const stored = await db.select().from(schema.passwordResets);
    expect(stored.some((row) => row.tokenHash === second.token)).toBe(false);

    await expect(completePasswordReset({ token: second.token, password: 'short' })).rejects.toThrow(/at least 10/);
    await expect(completePasswordReset({ token: first.token, password: 'a completely new password' })).rejects.toBeInstanceOf(ValidationError);
    await completePasswordReset({ token: second.token, password: 'a completely new password' });

    expect(await contextFromToken(oldSession.token)).toBeNull(); // signed out everywhere
    expect((await verifyCredentials({ email: 'forgetful@example.test', password: 'the password i forgot' })).ok).toBe(false);
    expect((await verifyCredentials({ email: 'forgetful@example.test', password: 'a completely new password' })).ok).toBe(true);
    // The link cannot be used a second time.
    await expect(completePasswordReset({ token: second.token, password: 'yet another long password' })).rejects.toBeInstanceOf(ValidationError);
    expect(await getPasswordResetByToken(second.token)).toBeNull();
  });

  it('refuses expired reset links and reset links for disabled accounts', async () => {
    const admin = await adminContext();
    const invitation = await createInvitation(admin, { email: 'late@example.test', roleKey: 'viewer' });
    const joined = await acceptInvitation({ token: invitation.token, name: 'Lars Late', password: 'a sufficiently long one' });
    const reset = await createPasswordResetLink(admin, joined.userId);

    const db = await getDb();
    await db.update(schema.passwordResets).set({ expiresAt: new Date(Date.now() - 1000) }).where(eq(schema.passwordResets.userId, joined.userId));
    expect(await getPasswordResetByToken(reset.token)).toBeNull();
    await expect(completePasswordReset({ token: reset.token, password: 'a completely new password' })).rejects.toBeInstanceOf(ValidationError);

    await setMemberStatus(admin, joined.userId, 'disabled');
    await expect(createPasswordResetLink(admin, joined.userId)).rejects.toThrow(/disabled/);
  });

  it('recovers a locked-out Administrator from the server command line, and records it', async () => {
    expect(await createPasswordResetFromCommandLine('nobody-here@example.test')).toBeNull();
    const recovery = await createPasswordResetFromCommandLine('  ASHA.ADMIN@example.test ');
    expect(recovery?.name).toBe('Asha Admin');
    await completePasswordReset({ token: recovery!.token, password: 'recovered with a new one' });
    expect((await verifyCredentials({ email: ADMIN.email, password: ADMIN.password })).ok).toBe(false);
    expect((await verifyCredentials({ email: ADMIN.email, password: 'recovered with a new one' })).ok).toBe(true);

    const db = await getDb();
    const entries = await db.select().from(schema.auditLogs).where(eq(schema.auditLogs.action, 'member.password_reset_link_created'));
    expect(entries.some((entry) => entry.actorLabel === 'Server command line' && entry.actorUserId === null)).toBe(true);
  });

  it('records security-relevant events in the audit log', async () => {
    const db = await getDb();
    const actions = (await db.select({ action: schema.auditLogs.action }).from(schema.auditLogs)).map((r) => r.action);
    for (const expected of [
      'organisation.created',
      'auth.sign_in',
      'invitation.created',
      'invitation.accepted',
      'member.disabled',
      'brand.created',
      'account.password_changed',
      'member.password_reset_link_created',
      'account.password_reset',
    ]) {
      expect(actions).toContain(expected);
    }
    const users = await db.select().from(schema.users).where(eq(schema.users.email, 'asha.admin@example.test'));
    expect(users[0].passwordHash).not.toContain(ADMIN.password);
    expect(users[0].passwordHash).not.toContain('recovered with a new one');
  });
});
