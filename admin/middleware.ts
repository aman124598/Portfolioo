import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isApiAuth = request.nextUrl.pathname.startsWith('/api/auth');

  // Allow access to login page and auth API without token
  if (isLoginPage || isApiAuth) {
    return NextResponse.next();
  }

  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
