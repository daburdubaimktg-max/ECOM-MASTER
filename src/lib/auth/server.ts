import 'server-only';
import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { env } from '@/lib/env';
import type { RequestContext } from './context';
import { contextFromToken, SESSION_COOKIE, SESSION_COOKIE_MAX_AGE_SECONDS } from './session';

/** Best-effort client address for the audit log and rate limiting. */
export async function clientIp(): Promise<string | null> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || null;
}

/**
 * The signed-in user for the current request, or null. Memoised per request, so pages, layouts and
 * components can all call it without repeating the database lookup.
 */
export const getContext = cache(async (): Promise<RequestContext | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  // Everything below depends on the live database and the current time, so it must run for the
  // actual request and never be pre-built or shared between requests.
  await connection();
  return contextFromToken(token, await clientIp());
});

/** Use at the top of every protected page, server action and API route. */
export async function requireContext(): Promise<RequestContext> {
  const ctx = await getContext();
  if (!ctx) redirect('/sign-in');
  return ctx;
}

export async function setSessionCookie(token: string): Promise<void> {
  const secure = env.isProduction && process.env.COOKIE_SECURE !== 'false';
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function readSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

/** For API routes that change data: the request must come from this site (defence against cross-site requests). */
export async function assertSameOrigin(request: Request): Promise<boolean> {
  const origin = request.headers.get('origin');
  if (!origin) return request.headers.get('sec-fetch-site') === 'same-origin';
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
