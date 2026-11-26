'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { clearSessionCookie, clientIp, readSessionToken, setSessionCookie } from '@/lib/auth/server';
import { createSession, revokeSession, verifyCredentials } from '@/lib/auth/session';
import { acceptInvitation, setupFirstOrganisation } from '@/lib/services/team';
import { actionError, str } from './_helpers';
import type { ActionState } from './_helpers';

async function startSession(userId: string, organisationId: string): Promise<void> {
  const { token } = await createSession({
    userId,
    organisationId,
    ip: await clientIp(),
    userAgent: (await headers()).get('user-agent'),
  });
  await setSessionCookie(token);
}

export async function signInAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = str(formData, 'email');
  const password = str(formData, 'password');
  if (!email || !password) return { ok: false, error: 'Enter your email and password.' };
  try {
    const result = await verifyCredentials({ email, password, ip: await clientIp() });
    if (!result.ok) {
      return {
        ok: false,
        error:
          result.reason === 'rate_limited'
            ? 'Too many unsuccessful attempts. Please wait 15 minutes and try again.'
            : 'The email or password is not correct.',
      };
    }
    await startSession(result.userId, result.organisationId);
  } catch (err) {
    return actionError(err);
  }
  redirect('/overview');
}

export async function setupAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const created = await setupFirstOrganisation({
      organisationName: str(formData, 'organisationName'),
      name: str(formData, 'name'),
      email: str(formData, 'email'),
      password: str(formData, 'password'),
      ip: await clientIp(),
    });
    await startSession(created.userId, created.organisationId);
  } catch (err) {
    return actionError(err);
  }
  redirect('/overview');
}

export async function acceptInviteAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const joined = await acceptInvitation({
      token: str(formData, 'token'),
      name: str(formData, 'name'),
      password: str(formData, 'password'),
      ip: await clientIp(),
    });
    await startSession(joined.userId, joined.organisationId);
  } catch (err) {
    return actionError(err);
  }
  redirect('/overview');
}

export async function signOutAction(): Promise<void> {
  await revokeSession(await readSessionToken());
  await clearSessionCookie();
  redirect('/sign-in');
}
