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
  // Initialize response
  const response = NextResponse.next();
  // --- Auth Logic Removed (Cross-Domain Cookie Limitation) ---
  // Since Frontend (Vercel) and Backend (Render) are on different domains,
  // the Middleware (running on Vercel) CANNOT see the HttpOnly cookie set by Render.
  // We rely on Client-Side AuthContext to protect routes.
  // Updated: 2026-02-01 - New backend URL configured


  // --- Content Security Policy ---
  const cspHeader = `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' blob: data: https://images.unsplash.com https://plus.unsplash.com https://*.googleusercontent.com https://ui-avatars.com;
        font-src 'self' data: https://fonts.gstatic.com;
        connect-src 'self' http://localhost:4000 https://care-connect-backend-ok23.onrender.com https://api.razorpay.com wss://care-connect-backend-ok23.onrender.com ws://localhost:4000;
        frame-src 'self' https://api.razorpay.com;
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

