import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * A fast, optimistic gate that runs before every page: visitors without a session cookie are sent
 * to the sign-in page. This is a convenience only — the real check (is the session valid? does this
 * role have permission?) happens on the server next to the data, in every page, action and API route.
 */
const SESSION_COOKIE = 'bie_session';
const PUBLIC_PREFIXES = ['/sign-in', '/setup', '/invite', '/reset', '/api/health', '/api/jobs/tick'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.next();
  }
  if (!request.cookies.has(SESSION_COOKIE)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    url.search = '';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Never intercept the framework's own files and development channels, or static icons.
  matcher: ['/((?!_next/|__nextjs|favicon.ico|icon.svg|robots.txt).*)'],
};
