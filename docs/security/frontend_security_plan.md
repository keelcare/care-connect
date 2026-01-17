# Frontend Security Plan

**Implemented:** 2026-01-17

## 1. Implemented Security Measures

### ✅ Dependency Hardening
- **Next.js Upgrade:** Updated to latest stable version (patching critical RCE vulnerability).
- **Ongoing:** Automated alerts for vulnerable dependencies should be set up (e.g., Dependabot).

### ✅ Security Headers (in `next.config.ts`)
We have configured the application to send the following HTTP headers with every response:
- **`Strict-Transport-Security` (HSTS):** Enforces HTTPS for 2 years (`max-age=63072000`), includes subdomains, and enables preloading.
- **`X-Frame-Options: SAMEORIGIN`:** Prevents clickjacking by ensuring the app can only be framed by itself.
- **`X-Content-Type-Options: nosniff`:** Prevents browser from MIME-sniffing a response away from the declared content-type.
- **`Referrer-Policy: origin-when-cross-origin`:** Controls how much referrer information is sent to third parties.
- **`Permissions-Policy`:** Explicitly disables sensitive features (Camera, Microphone, Geolocation) unless explicitly enabled in the future.

### ✅ Content Security Policy (CSP) (in `middleware.ts`)
We have implemented a strict CSP to mitigate XSS attacks.
- **`default-src 'self'`:** Only load resources from our own domain by default.
- **`img-src`:** Allowed secure image providers (Unsplash, Google User Content, UI Avatars).
- **`script-src`:** Currently allows `'unsafe-inline'` and `'unsafe-eval'` for compatibility with Next.js development and existing libraries.
    -   *Goal:* Move to Nonce-based Strict CSP in the future.
- **`frame-ancestors 'none'`:** Redundant protection against clickjacking.
- **`upgrade-insecure-requests`:** Forces browsers to use HTTPS.

## 2. Roadmap for "Highest Level" Security

### 🚧 Phase 2: Cookie-Based Authentication (Requires Backend)
Currently, tokens are stored in `localStorage` for compatibility. This is the biggest remaining XSS risk.
- **Action:** Backend must set `Set-Cookie` with `HttpOnly; Secure; SameSite=Strict` attributes.
- **Action:** Frontend `tokenStorage.ts` should be deprecated and removed. `AuthContext` will no longer read tokens, just handle 401 errors.

### 🚧 Phase 3: Strict CSP (Nonce-based)
- **Action:** Refactor `_document.tsx` or `layout.tsx` to generate a crypto-nonce per request.
- **Action:** Pass this nonce to all inline scripts.
- **Benefit:** Remove `'unsafe-inline'` from CSP, making XSS virtually impossible.

### 🚧 Phase 4: Subresource Integrity (SRI)
- **Action:** If we use any CDN scripts in the future, we must use SRI hashes to ensure they haven't been tampered with.

## 3. Maintenance
- Run `npm audit` weekly.
- Review CSP reports (if we add a `report-uri`).
