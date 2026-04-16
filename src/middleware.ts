import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/dashboard', '/onboarding'];
  const publicOnlyRoutes = ['/login', '/register'];

  // If user tries to access protected route without token, redirect to login
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is already logged in, prevent accessing login/register
  if (publicOnlyRoutes.some(route => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*', '/login', '/register'],
};
