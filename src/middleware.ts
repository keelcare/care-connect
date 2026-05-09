import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isWaitlistMode = process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true';

  if (isWaitlistMode) {
    const url = request.nextUrl.clone();
    
    // Protect these routes in waitlist mode
    const protectedPaths = [
      '/auth/login',
      '/auth/signup',
      '/dashboard',
      '/parent-dashboard',
      '/admin',
      '/book-service'
    ];

    const isProtectedPath = protectedPaths.some(path => url.pathname.startsWith(path));

    if (isProtectedPath) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/dashboard/:path*',
    '/parent-dashboard/:path*',
    '/admin/:path*',
    '/book-service/:path*',
  ],
};
