import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserFromSessionToken, readSessionToken } from '@/lib/auth/session';

const LOCALES = ['en', 'de', 'fr', 'es', 'it', 'nl'];

const ADMIN_PREFIXES = ['/admin', '/ops'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const isAdminRoute = ADMIN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isAdminRoute) {
    const user = await getUserFromSessionToken(readSessionToken(request));
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname);

    if (!user) {
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== 'admin') {
      loginUrl.searchParams.set('error', 'forbidden');
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname === '/login' || pathname === '/signup') {
    return NextResponse.next();
  }

  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
