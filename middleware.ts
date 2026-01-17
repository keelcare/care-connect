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

    // Get token from cookie
    const token = request.cookies.get('token')?.value;

    // If no token and trying to access protected route, redirect to login
    if (!token && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // If token exists, decode it to check user status
    if (token) {
        try {
            // Decode JWT to get user info
            const payload = JSON.parse(
                Buffer.from(token.split('.')[1], 'base64').toString()
            );

            const isActive = payload.is_active ?? true; // Default to true if not specified
            const role = payload.role;

            // If user is banned (is_active === false)
            if (isActive === false) {
                // Allow access to help page
                if (BANNED_USER_ALLOWED_ROUTES.some(route => pathname.startsWith(route))) {
                    return NextResponse.next();
                }

                // Redirect to help page for any other route
                if (pathname !== '/nanny/help') {
                    return NextResponse.redirect(new URL('/nanny/help', request.url));
                }
            }

            // If user is active nanny trying to access dashboard/nanny routes
            // Let them through - component-level guards will handle verification
        }
        catch (error) {
            console.error('Middleware: Failed to decode token', error);
        }
    }

    return NextResponse.next();
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
