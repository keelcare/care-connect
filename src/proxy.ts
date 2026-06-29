import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from './lib/logger';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isWaitlistMode = process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true';
  const isDev = process.env.NODE_ENV === 'development';

  // --- 1. Waitlist Logic ---
  // In development, waitlist is always bypassed so devs can reach auth pages.
  if (isWaitlistMode && !isDev) {
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
  logger.log(`[${new Date().toISOString()}] ${request.method} ${pathname}`);

  // --- 3. Content Security Policy ---
  // PHASE 1: Report-only mode — measures real violations without breaking the app.
  // Upgrade to enforced CSP (Content-Security-Policy) once violations are reviewed.
  // Remove 'unsafe-inline' and 'unsafe-eval' from script-src in Phase 2 (nonce-based CSP).
  const response = NextResponse.next();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not set. Check your .env file.');
  }
  const wsUrl = apiUrl.replace(/^http/, 'ws');
  const sentryReportUri = process.env.NEXT_PUBLIC_SENTRY_CSP_REPORT_URI || '';

  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' blob: data: https://images.unsplash.com https://plus.unsplash.com https://*.googleusercontent.com https://ui-avatars.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    `connect-src 'self' ${apiUrl} ${wsUrl} https://api.razorpay.com https://nominatim.openstreetmap.org https://vitals.vercel-insights.com`,
    "frame-src 'self' https://api.razorpay.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
    ...(sentryReportUri ? [`report-uri ${sentryReportUri}`] : []),
  ];

  // Report-only: violations are logged but not blocked
  response.headers.set('Content-Security-Policy-Report-Only', cspDirectives.join('; '));

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
