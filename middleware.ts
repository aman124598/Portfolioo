import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply middleware to /dashboard routes (except login and api/auth)
  if (!request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

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
    '/dashboard/:path*',
    '/login',
  ],
};
