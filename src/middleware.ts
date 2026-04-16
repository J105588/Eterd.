import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip if it's a file, admin, or already has a locale
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  const isAdmin = pathname.startsWith('/admin');
  const isFile = pathname.includes('.');

  if (pathnameIsMissingLocale && !isAdmin && !isFile) {
    // If it's the root or a path without locale, serve the default locale (jp)
    // We use REWRITE for the default locale to hide the /jp segment in the URL
    const locale = i18n.defaultLocale;
    
    // If it's just '/', rewrite to '/jp'
    // If it's '/about', rewrite to '/jp/about'
    return NextResponse.rewrite(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|icon.png).*)'],
};
