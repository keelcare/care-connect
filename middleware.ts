import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that banned users CAN access
const BANNED_USER_ALLOWED_ROUTES = [
  '/nanny/help',
  '/auth/login',
  '/auth/signup',
  '/api',
];

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/nanny',
  '/admin',
  '/browse',
  '/bookings',
  '/messages',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookie (HttpOnly cookie set by backend)
  const token = request.cookies.get('access_token')?.value;

  let response: NextResponse;

  // Default response: continue
  response = NextResponse.next();

  // If no token and trying to access protected route, redirect to login
  if (!token && PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    response = NextResponse.redirect(new URL('/auth/login', request.url));
  }
  // If token exists, decode it to check user status
  else if (token) {
    try {
      // Decode JWT to get user info
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );

      const isActive = payload.is_active ?? true; // Default to true if not specified

      // If user is banned (is_active === false)
      if (isActive === false) {
        // Redirect to help page for any other route (except allowed ones)
        if (
          !BANNED_USER_ALLOWED_ROUTES.some((route) =>
            pathname.startsWith(route)
          ) &&
          pathname !== '/nanny/help'
        ) {
          response = NextResponse.redirect(new URL('/nanny/help', request.url));
        }
      }
    } catch (error) {
      console.error('Middleware: Failed to decode token', error);
    }
  }

  // --- Content Security Policy ---
  const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        img-src 'self' blob: data: https://images.unsplash.com https://plus.unsplash.com https://*.googleusercontent.com https://ui-avatars.com;
        font-src 'self' data:;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        block-all-mixed-content;
        upgrade-insecure-requests;
    `;

  response.headers.set(
    'Content-Security-Policy',
    cspHeader.replace(/\s{2,}/g, ' ').trim()
  );

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
