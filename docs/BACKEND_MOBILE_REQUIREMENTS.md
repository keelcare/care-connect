# Walkthrough: Capacitor Mobile App Support

**Branch:** `feat/capacitor-mobile`  
**Date:** 20 February 2026

---

## Overview

This document summarises the backend changes made to support the deployment of the Care Connect Next.js frontend across iOS and Android natively via Capacitor. The Next.js app is compiled to a static bundle and loaded in a native WebView:

- **iOS:** origin is `capacitor://localhost`
- **Android:** origin is `https://localhost`

All existing web behaviour remains unchanged — these are additive changes only.

---

## Change 1 — Cookie Flags (`src/auth/auth.controller.ts`)

The `login`, `logout`, `refresh`, and `exchangeSession` endpoints were updated to unconditionally set cookies using `secure: true` and `sameSite: 'none'`.

**Why this was necessary:**  
Capacitor WebViews on iOS (`capacitor://localhost`) and Android (`https://localhost`) operate as cross-origin requests relative to the deployed backend URL. Browsers strictly drop cookies on cross-origin requests unless `SameSite=None` and `Secure` are both set. Without this change every authenticated API call silently returns 401 even after a successful login.

**Cookie config applied to all auth endpoints:**

```ts
response.cookie('access_token', accessToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  // 'domain' is omitted entirely
  maxAge: 15 * 60 * 1000,
});

response.cookie('refresh_token', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

Same flags on `clearCookie` in logout:

```ts
response.clearCookie('access_token', { sameSite: 'none', secure: true });
response.clearCookie('refresh_token', { sameSite: 'none', secure: true });
```

**Endpoints updated:** `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`, `POST /auth/exchange-session`, `GET /auth/google/callback`

---

## Change 2 — Google OAuth Mobile Redirect (`src/auth/guards/google-oauth.guard.ts` & `src/auth/auth.controller.ts`)

To support custom OAuth redirection on the mobile app, the `GoogleOauthGuard` was modified to append a newly extracted `platform` query parameter directly into the OAuth state object. Upon the callback, `auth.controller.ts` intercepts the `platform` field inside the returned state. If `platform === 'mobile'`, the backend returns a custom redirect to `careconnect://auth/callback?token=...`, triggering the mobile app's deep-link handling instead of redirecting to the standard frontend origin.

**Flow — web (unchanged):**
```
GET /auth/google
  → Google auth
  → GET /auth/google/callback
  → Set-Cookie + redirect to https://careconnect.vercel.app/auth/callback
```

**Flow — mobile (new):**
```
GET /auth/google?platform=mobile
  → platform injected into OAuth state by GoogleOauthGuard
  → Google auth
  → GET /auth/google/callback
  → redirect to careconnect://auth/callback?token=<access_token>
```

**`google-oauth.guard.ts` — state injection:**

```ts
// Platform is extracted from the query and passed into the OAuth state
// so it survives the Google redirect round-trip
const platform = req.query.platform;
return super.canActivate(context); // Passport appends state automatically
```

**`auth.controller.ts` — callback branching:**

```ts
@Get('google/callback')
@UseGuards(GoogleOauthGuard)
async googleCallback(@Req() req, @Res() res) {
  const { access_token, refresh_token } = await this.authService.googleLogin(req.user);
  const isMobile = req.user?.state?.platform === 'mobile';

  if (isMobile) {
    return res.redirect(`careconnect://auth/callback?token=${access_token}`);
  }

  res.cookie('access_token', access_token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 15 * 60 * 1000 });
  res.cookie('refresh_token', refresh_token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
  return res.redirect(`${process.env.FRONTEND_URL}/auth/callback`);
}
```

The frontend deep-link handler reads the token from the URL and calls `GET /users/me` to complete the session.

---

## Change 3 — CORS Origins Configuration (`src/main.ts` & WebSocket gateways)

The global Express application inside `src/main.ts` and all three WebSocket gateways (`ChatGateway`, `LocationGateway`, `NotificationsGateway`) were updated to recognise and allow connections from `capacitor://localhost` and `https://localhost`.

Validating these origins allows Capacitor HTTP requests and Socket.IO real-time channels to bypass CORS failures on both platforms.

**`src/main.ts`:**

```ts
app.enableCors({
  origin: [
    process.env.FRONTEND_URL,    // production web
    'http://localhost:3000',      // local dev web
    'capacitor://localhost',      // iOS Capacitor WebView
    'https://localhost',          // Android Capacitor WebView
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

> `origin: '*'` cannot be used when `credentials: true` — the explicit list is mandatory.

**Applied to all three `@WebSocketGateway` decorators (`ChatGateway`, `LocationGateway`, `NotificationsGateway`):**

```ts
@WebSocketGateway({
  cors: {
    origin: [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'capacitor://localhost',
      'https://localhost',
    ],
    credentials: true,
  },
})
```

---

## Change 4 — Token Refresh Payload (`src/auth/auth.controller.ts`)

The `POST /auth/refresh` endpoint was updated to echo the `access_token` in the returned JSON body alongside the cookie, acting as a reliable read fallback for the mobile app independently of cookie persistence across app restarts.

```ts
// Before
return { message: 'Tokens refreshed' };

// After
return { message: 'Tokens refreshed', access_token };
```

---

## Summary

| # | Change | File(s) |
|---|--------|---------|
| 1 | `sameSite: 'none'` + `secure: true` on all auth cookies | `src/auth/auth.controller.ts` |
| 2 | `?platform=mobile` on Google OAuth → `careconnect://` deep-link redirect | `src/auth/guards/google-oauth.guard.ts`, `src/auth/auth.controller.ts` |
| 3 | `capacitor://localhost` + `https://localhost` added to CORS origins | `src/main.ts`, `ChatGateway`, `LocationGateway`, `NotificationsGateway` |
| 4 | `access_token` echoed in `/auth/refresh` JSON body | `src/auth/auth.controller.ts` |

---

## Testing Checklist

- [ ] Login on the mobile build sets cookies visible in the device WebView inspector
- [ ] `GET /users/me` returns the correct user (not 401) after login on mobile
- [ ] Token refresh rotates both cookies and returns `access_token` in the response body
- [ ] Logout clears both cookies
- [ ] Socket.IO (`ChatGateway`, `LocationGateway`, `NotificationsGateway`) connects from the mobile build
- [ ] `GET /auth/google?platform=mobile` eventually redirects to `careconnect://auth/callback?token=...`
- [ ] Web login/logout on Vercel is unaffected

