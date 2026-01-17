# Backend Security Requirements

**To:** Backend Team
**From:** Frontend Team (Security Overhaul)
**Subject:** Required Security Enhancements for Production Readiness

To achieve industry-standard security, the frontend requires the following implementations from the backend:

## 1. Authentication & Session Management (Priority: Critical)
- **HttpOnly Cookies:**
    -   Stop returning tokens in the response body (JSON).
    -   Return `access_token` and `refresh_token` as **HttpOnly, Secure, SameSite=Strict** cookies in the `Set-Cookie` header.
    -   This mitigates XSS token theft completely.
-   **Token Rotation:**
    -   Implement Refresh Token Rotation (invalidate old refresh token upon use).
-   **Logout Endpoint:**
    -   The `POST /auth/logout` endpoint must explicitly clear the auth cookies.

## 2. Input Validation & Sanitization (Priority: Critical)
-   **SVG Sanitization:**
    -   Since the frontend renders SVGs (`dangerouslyAllowSVG: true` is currently on), the backend **MUST** sanitize any uploaded SVG files to strip `<script>` tags and event handlers (e.g., `onload`, `onclick`). Tools like `isomorphic-dompurify` or `svg-purify` are recommended.
-   **Strict Schema Validation:**
    -   Ensure all incoming payloads are validated (e.g., using `class-validator`).

## 3. Security Headers (Priority: High)
While the frontend will set these, the backend should also enforce them where appropriate:
-   `Strict-Transport-Security` (HSTS)
-   `X-Content-Type-Options: nosniff`

## 4. Rate Limiting (Priority: High)
-   Implement rate limiting on all public endpoints (`/auth/*`, `/public/*`) to prevent brute-force attacks.

## 5. User Active Status (Priority: Critical)
-   Ensure the `is_active` flag in the JWT payload is always up-to-date.
-   Provide a mechanism (e.g., webhook or fast-fail endpoint) to revoke access immediately if a user is banned, rather than waiting for token expiration.
