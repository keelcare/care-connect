import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isWaitlistMode = process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true';

  // --- 1. Waitlist Logic ---
  if (isWaitlistMode) {
    const protectedPaths = [
      '/auth/login',
      '/auth/signup',
      '/dashboard',
      '/parent-dashboard',
      '/admin',
      '/book-service'
    ];

    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtectedPath) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // --- 2. Logging ---
  console.log(`[${new Date().toISOString()}] ${request.method} ${pathname}`);

  // --- 3. Content Security Policy ---
  const response = NextResponse.next();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://care-connect-backend-ok23.onrender.com';
  const wsUrl = apiUrl.replace(/^http/, 'ws');

  const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' blob: data: https://images.unsplash.com https://plus.unsplash.com https://*.googleusercontent.com https://ui-avatars.com;
        font-src 'self' data: https://fonts.gstatic.com;
        connect-src 'self' ${apiUrl} ${wsUrl} https://api.razorpay.com https://nominatim.openstreetmap.org;
        frame-src 'self' https://api.razorpay.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        block-all-mixed-content;
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
