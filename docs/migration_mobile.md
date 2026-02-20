# Care Connect — Capacitor Mobile Migration

**Branch:** `feat/capacitor-mobile`  
**Target:** iOS & Android via Capacitor WebView  
**Approach:** Wrap the existing Next.js SPA in a native shell. Zero changes to web deploy.

---

## Overview

| Phase | Title | Duration | Risk |
|---|---|---|---|
| 0 | Scaffolding | 1 day | None |
| 1 | Static Export Compatibility | 1–2 days | Low |
| 2 | API Layer & Auth Fixes | 1 day | Low |
| 3 | Razorpay Payment | 1–2 days | Medium |
| 4 | Google OAuth & Deep Linking | 1–2 days | Medium |
| 5 | Background Location | 2–3 days | High |
| 6 | Push Notifications | 1–2 days | Low |
| 7 | Native Polish & Entry Point | 1–2 days | Low |
| 8 | Testing & App Store Submission | 3–5 days | — |

**Total estimated time:** ~2.5–3 weeks

---

## Phase 0: Prerequisites & Scaffolding

**Duration:** 1 day | **Web impact:** None

### Goals
Initialize Capacitor in the repo without touching any existing source code.

### Step 1 — Install packages

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android @capacitor/browser @capacitor/push-notifications @capacitor/app @capacitor/status-bar @capacitor/splash-screen
```

### Step 2 — Initialize Capacitor

```bash
npx cap init "Care Connect" "com.keelcare.careconnect" --web-dir out
```

### Step 3 — Create `capacitor.config.ts` at repo root

```ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.keelcare.careconnect',
  appName: 'Care Connect',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    allowNavigation: [
      'keel-backend.onrender.com',
      'checkout.razorpay.com',
      'api.razorpay.com',
      'nominatim.openstreetmap.org',
    ],
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  ios: {
    scrollEnabled: true,
    contentInset: 'always',
  },
};

export default config;
```

### Step 4 — Add native platforms

```bash
npx cap add ios
npx cap add android
```

### Step 5 — Add scripts to `package.json`

Add the following under `"scripts"`:

```json
"build:mobile": "BUILD_TARGET=capacitor next build",
"sync:mobile": "npm run build:mobile && npx cap sync",
"open:ios": "npx cap open ios",
"open:android": "npx cap open android"
```

### Step 6 — Add to `.gitignore`

```
# Capacitor static export output
out/
```

The `ios/` and `android/` folders **are committed** to git — they contain native project configuration.

### Verify

```bash
ls ios/ android/ capacitor.config.ts
# All three should exist
```

---

## Phase 1: Static Export Compatibility

**Duration:** 1–2 days | **Web impact:** None

### Goals
Make `next build` produce a static `out/` directory when building for mobile, without affecting the existing Vercel web deploy.

### Context
Capacitor loads a static HTML/JS bundle from the `out/` directory. Next.js requires `output: 'export'` to produce this. This setting disables `headers()` and `rewrites()` in `next.config.ts`, which is acceptable because:
- `headers()` sets HTTP security headers — irrelevant inside a native WebView
- `rewrites()` proxies `/api/*` to the backend — `src/lib/api.ts` calls `NEXT_PUBLIC_API_URL` directly and never uses the proxy

### Change 1 — `next.config.ts`

Add a conditional `output: 'export'` controlled by an environment variable:

```ts
const isCapacitor = process.env.BUILD_TARGET === 'capacitor';

const nextConfig: NextConfig = {
  reactCompiler: true,
  ...(isCapacitor && { output: 'export' }),
  images: {
    // existing image config unchanged
    unoptimized: true, // already set — required for static export
  },
  // headers() and rewrites() are silently ignored under output:'export'
  // They still run for the normal web build on Vercel
  async headers() { /* unchanged */ },
  async rewrites() { /* unchanged */ },
};
```

### Change 2 — Dynamic routes

Dynamic `[param]` routes need to be marked as client-side fetched so Next.js doesn't attempt server-side pre-rendering. Add this export to the top of each of these files:

```ts
export const dynamic = 'force-static';
```

Files to update:
- `src/app/caregiver/[id]/page.tsx`
- `src/app/book/[nannyId]/page.tsx`
- `src/app/book-recurring/[nannyId]/page.tsx`

All three already use `'use client'` and fetch data on mount — this directive just confirms that to the build system.

### Verify

```bash
npm run build:mobile
# Should complete without errors and produce an out/ directory
ls out/
```

---

## Phase 2: API Layer & Auth Fixes

**Duration:** 1 day | **Web impact:** None

### Goals
- Guard the one `window.location` navigation call in the API client
- Confirm backend cookie config is compatible with mobile WebView

### Change 1 — `src/lib/api.ts` (around line 172)

Locate the 401 redirect block and add a `typeof window` guard:

**Before:**
```ts
if (
  !skipRedirect &&
  window.location.pathname !== '/auth/login' &&
  !window.location.pathname.startsWith('/auth/')
) {
  console.warn('Redirecting to login due to 401/expired session on:', endpoint);
  window.location.href = '/auth/login';
}
```

**After:**
```ts
if (
  !skipRedirect &&
  typeof window !== 'undefined' &&
  window.location.pathname !== '/auth/login' &&
  !window.location.pathname.startsWith('/auth/')
) {
  console.warn('Redirecting to login due to 401/expired session on:', endpoint);
  window.location.href = '/auth/login';
}
```

`window.location.href` navigation still works correctly inside a Capacitor WebView — the guard is defensive hygiene for SSR-safety.

### Change 2 — Backend cookie config (backend team action)

All API requests already use `credentials: 'include'`. This works in Capacitor's WebView **only if** the backend sets cookies with `SameSite=None; Secure`.

Confirm the NestJS cookie config looks like:

```ts
// backend — wherever auth cookies are set
response.cookie('access_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'none',   // ← required for cross-origin WebView requests
  // do NOT lock to a specific domain
});
```

This is a backend-only change. No further frontend changes needed.

---

## Phase 3: Razorpay Payment

**Duration:** 1–2 days | **Risk:** Medium

### Goals
Replace the `window.Razorpay` web SDK checkout with a native in-app browser sheet on mobile.

### Context
`src/app/layout.tsx` loads `<script src="https://checkout.razorpay.com/v1/checkout.js">` and `src/hooks/usePayment.ts` calls `new (window as any).Razorpay(options)`. In a static WebView, the Razorpay UI can open as a redirect that navigates away from the app. Use `@capacitor/browser` (already installed in Phase 0) to open it in a native SFSafariViewController (iOS) or Chrome Custom Tab (Android) instead.

### Change 1 — `src/app/layout.tsx`

Remove the hardcoded Razorpay `<script>` tag from `<head>`. Replace with a dynamic load that only runs on web:

Remove this line from `<head>`:
```tsx
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

Add a `useEffect` inside `RootLayoutContent` (or a new `RazorpayLoader` child component):

```tsx
useEffect(() => {
  const isCapacitor = typeof (window as any).Capacitor !== 'undefined';
  if (!isCapacitor) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.head.appendChild(script);
  }
}, []);
```

### Change 2 — `src/hooks/usePayment.ts`

Add a Capacitor branch after the order is created:

```ts
import { Browser } from '@capacitor/browser';

// Inside handlePayment, after const orderData = await api.payments.createOrder(bookingId):

const isCapacitor = typeof (window as any).Capacitor !== 'undefined';

if (isCapacitor) {
  // Open Razorpay hosted checkout in native in-app browser
  const callbackUrl = encodeURIComponent('careconnect://payment/callback');
  const checkoutUrl =
    `https://checkout.razorpay.com/v1/checkout?` +
    `order_id=${orderData.orderId}&key=${orderData.key}&callback_url=${callbackUrl}`;

  await Browser.open({ url: checkoutUrl });

  // Listen for deep link return from payment
  // App.addListener('appUrlOpen') in AuthContext handles careconnect://payment/callback
  // and calls onSuccess() or onError() accordingly
} else {
  // Existing web flow — completely unchanged
  const razorpay = new (window as any).Razorpay(options);
  razorpay.on('payment.failed', ...);
  razorpay.open();
}
```

### Backend change required

Add a `/payments/callback` endpoint that:
1. Verifies the Razorpay signature
2. Redirects to `careconnect://payment/callback?status=success&bookingId=...` on success
3. Redirects to `careconnect://payment/callback?status=failed` on failure

---

## Phase 4: Google OAuth & Deep Linking

**Duration:** 1–2 days | **Risk:** Medium

### Goals
- Register a custom URL scheme (`careconnect://`) so the OS can route deep links back into the app
- Handle the OAuth callback and payment callback via this scheme
- Update the Google OAuth trigger to pass the mobile redirect URI

### Change 1 — iOS URL scheme (`ios/App/App/Info.plist`)

Add inside the root `<dict>`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>com.keelcare.careconnect</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>careconnect</string>
    </array>
  </dict>
</array>
```

### Change 2 — Android intent filter (`android/app/src/main/AndroidManifest.xml`)

Add inside the `<activity>` tag:

```xml
<intent-filter android:autoVerify="true">
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="careconnect" />
</intent-filter>
```

### Change 3 — Handle deep links in `src/context/AuthContext.tsx`

Add an `App` plugin listener inside `AuthProvider`'s `useEffect` on mount:

```ts
import { App } from '@capacitor/app';

useEffect(() => {
  const isCapacitor = typeof (window as any).Capacitor !== 'undefined';
  if (!isCapacitor) return;

  const listener = App.addListener('appUrlOpen', (data) => {
    // data.url examples:
    //   careconnect://auth/callback?token=XYZ
    //   careconnect://payment/callback?status=success&bookingId=123
    const url = new URL(data.url.replace('careconnect://', 'https://careconnect.app/'));
    const path = url.pathname + url.search;
    router.push(path);
  });

  return () => { listener.then(l => l.remove()); };
}, [router]);
```

`src/app/auth/callback/page.tsx` already reads `?token=` from query params and works perfectly — no changes needed there.

### Change 4 — Update Google login trigger

Find wherever `window.location.href = \`${API_URL}/auth/google?origin=...\`` is called and update it:

```ts
const isCapacitor = typeof (window as any).Capacitor !== 'undefined';
const origin = isCapacitor
  ? 'careconnect://auth/callback'
  : `${window.location.origin}/auth/callback`;

window.location.href = `${API_URL}/auth/google?origin=${encodeURIComponent(origin)}`;
```

### Backend config (no frontend code — team action)

Add `careconnect://auth/callback` as an allowed redirect URI in:
- Google Cloud Console → OAuth 2.0 Credentials → Authorised redirect URIs
- NestJS Google OAuth strategy allowed callback origins

---

## Phase 5: Background Location (Nanny Tracking)

**Duration:** 2–3 days | **Risk:** High — requires Apple review justification

### Goals
Keep nanny GPS tracking active when the app is backgrounded. The current `navigator.geolocation.watchPosition` + 10-second `setInterval` in `src/components/location/LocationSender.tsx` is paused by iOS when the app is minimized.

### Install

```bash
npm install @capacitor-community/background-geolocation
npx cap sync
```

### Change 1 — iOS permissions (`ios/App/App/Info.plist`)

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Care Connect needs your location to share it with parents during active bookings.</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Care Connect needs your location in the background to continue sharing with parents when the app is minimized.</string>
<key>UIBackgroundModes</key>
<array>
  <string>location</string>
</array>
```

### Change 2 — Android permissions (`android/app/src/main/AndroidManifest.xml`)

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
```

### Change 3 — `src/components/location/LocationSender.tsx`

Add a Capacitor branch to `startSharing` and `stopSharing`. The existing web implementation stays completely unchanged inside the `else` block.

```ts
import { BackgroundGeolocation } from '@capacitor-community/background-geolocation';

const isCapacitor = typeof (window as any).Capacitor !== 'undefined';

// Replace the startSharing callback body:
const startSharing = useCallback(async () => {
  setError(null);
  setPermissionDenied(false);

  if (isCapacitor) {
    try {
      const watchId = await BackgroundGeolocation.addWatcher(
        {
          backgroundMessage: 'Care Connect is tracking your location for the active booking.',
          backgroundTitle: 'Location Sharing Active',
          requestPermissions: true,
          stale: false,
          distanceFilter: 10, // only emit if nanny moves 10+ metres
        },
        (location, error) => {
          if (error) {
            if (error.code === 'NOT_AUTHORIZED') setPermissionDenied(true);
            return;
          }
          if (!location) return;
          const { latitude, longitude } = location;
          setCurrentLocation({ lat: latitude, lng: longitude });
          sendLocationUpdate(latitude, longitude);
        }
      );
      watchIdRef.current = watchId as any;
      setIsSharing(true);
      onStatusChange?.(true);
    } catch (err) {
      setError('Failed to start background location sharing');
    }
  } else {
    // Existing web implementation — unchanged
    navigator.geolocation.getCurrentPosition(
      // ... existing code
    );
  }
}, [sendLocationUpdate, onStatusChange]);

// Replace the stopSharing callback body:
const stopSharing = useCallback(async () => {
  if (isCapacitor) {
    if (watchIdRef.current !== null) {
      await BackgroundGeolocation.removeWatcher({ id: watchIdRef.current as any });
      watchIdRef.current = null;
    }
  } else {
    // Existing web cleanup — unchanged
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }
  setIsSharing(false);
  onStatusChange?.(false);
}, [onStatusChange]);
```

### Apple App Store justification (include in review notes)

> "Caregivers share their real-time GPS location with families during active childcare bookings so parents can confirm arrival and track proximity for child safety. Background location is required because caregivers keep the app minimized while working."

---

## Phase 6: Push Notifications

**Duration:** 1–2 days

### Goals
Register for native push notifications and send the device token to the backend so it can push when the app is closed or backgrounded.

### Change 1 — New file `src/hooks/usePushNotifications.ts`

Create this file:

```ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export function usePushNotifications() {
  const router = useRouter();

  useEffect(() => {
    const isCapacitor = typeof (window as any).Capacitor !== 'undefined';
    if (!isCapacitor) return;

    const setup = async () => {
      // Dynamic import — avoids errors on web where the plugin doesn't exist
      const { PushNotifications } = await import('@capacitor/push-notifications');

      const { receive } = await PushNotifications.requestPermissions();
      if (receive !== 'granted') return;

      await PushNotifications.register();

      // Send device token to backend
      await PushNotifications.addListener('registration', async (token) => {
        await api.users.registerPushToken(token.value);
      });

      // Handle notification received while app is open
      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received:', notification);
        // Toast or in-app banner can be triggered here if needed
      });

      // Handle tap on a notification
      await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        const { type, bookingId } = action.notification.data ?? {};
        if (type === 'message') router.push('/messages');
        else if (type === 'booking') router.push('/bookings');
        else if (type === 'geofence') router.push('/notifications');
        else router.push('/notifications');
      });
    };

    setup();
  }, [router]);
}
```

### Change 2 — `src/context/AuthContext.tsx`

Call `usePushNotifications()` inside `AuthProvider` after a successful login so the token is registered against the authenticated user:

```ts
import { usePushNotifications } from '@/hooks/usePushNotifications';

// Inside AuthProvider component:
usePushNotifications();
```

### Backend changes required (backend team)

1. New endpoint: `POST /users/push-token` — stores the FCM (Android) / APNs (iOS) device token against the authenticated user
2. Integrate Firebase Admin SDK (`firebase-admin`) or Expo Push Notification Service on backend
3. Trigger a push notification when:
   - A new chat message is received
   - A booking status changes
   - A geofence alert fires
   - Any `notification` record is created for a user

---

## Phase 7: Native Polish & Entry Point

**Duration:** 1–2 days

### Goals
Fine-tune the native experience: skip the marketing landing page, handle iOS safe areas, configure status bar and splash screen.

### Change 1 — Skip landing page on mobile (`src/app/page.tsx`)

The root page currently redirects unauthenticated users to `/welcome`, which has heavy GSAP/parallax animations designed for desktop. On mobile, go straight to login:

```ts
const isCapacitor = typeof (window as any).Capacitor !== 'undefined';

// In the unauthenticated branch:
if (!user) {
  router.replace(isCapacitor ? '/auth/login' : '/welcome');
  return;
}
```

### Change 2 — Safe area insets (`src/app/globals.css`)

Add at the end of the file:

```css
/* iOS notch / Dynamic Island / home bar safe areas */
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### Change 3 — Viewport meta (`src/app/layout.tsx`)

Add to `<head>` — change the existing viewport meta or add if missing:

```tsx
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover"
/>
```

`viewport-fit=cover` is what allows `env(safe-area-inset-*)` to work correctly.

### Change 4 — Status bar & splash screen (`src/app/layout.tsx`)

Add a `useEffect` inside `RootLayoutContent`:

```ts
useEffect(() => {
  const isCapacitor = typeof (window as any).Capacitor !== 'undefined';
  if (!isCapacitor) return;

  const setupNative = async () => {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    const { SplashScreen } = await import('@capacitor/splash-screen');

    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: '#0D2B45' }); // primary navy
    await SplashScreen.hide({ fadeOutDuration: 300 });
  };

  setupNative();
}, []);
```

### Change 5 — App icons & splash images

Generate all required icon and splash sizes from a single 1024×1024 PNG source image:

```bash
npm install -g capacitor-assets
# Place your 1024x1024 icon at resources/icon.png
# Place a 2732x2732 splash at resources/splash.png
npx capacitor-assets generate
```

This automatically populates all required sizes in `ios/` and `android/`.

---

## Phase 8: Testing & App Store Submission

**Duration:** 3–5 days

### Full feature test matrix

| Feature | iOS | Android |
|---|---|---|
| App launches, splash hides correctly | ☐ | ☐ |
| Login (email/password) | ☐ | ☐ |
| Google OAuth deep link callback | ☐ | ☐ |
| Session persists after app restart (cookie) | ☐ | ☐ |
| Logout clears session | ☐ | ☐ |
| All pages render without white flash or overflow | ☐ | ☐ |
| Safe area insets correct (notch, home bar) | ☐ | N/A |
| API calls succeed (cookie credentials) | ☐ | ☐ |
| Socket.io real-time chat (send, receive, typing) | ☐ | ☐ |
| Razorpay payment opens in-app browser sheet | ☐ | ☐ |
| Payment callback deep link returns to app | ☐ | ☐ |
| Foreground geolocation (search page) | ☐ | ☐ |
| Background location — nanny tracking while minimized | ☐ | ☐ |
| Geofence alert triggers (audio + banner) | ☐ | ☐ |
| Push notification received while backgrounded | ☐ | ☐ |
| Push notification tap navigates to correct screen | ☐ | ☐ |
| File upload (verification documents) | ☐ | ☐ |
| Keyboard does not cover form inputs | ☐ | ☐ |

### Build commands

```bash
# Sync web build to native projects
npm run sync:mobile

# iOS — open in Xcode, then Product → Archive → Distribute → App Store Connect
npx cap open ios

# Android — open in Android Studio, then Build → Generate Signed Bundle → Upload to Play Console
npx cap open android
```

### iOS App Store submission checklist

- [ ] Apple Developer account enrolled ($99/year)
- [ ] Privacy manifest (`PrivacyInfo.xcprivacy`) declares: location, `NSUserDefaults` (localStorage), network access
- [ ] App Review notes state: *"Payments are for booking real-world childcare services, not digital goods — exempt from Apple IAP requirement."*
- [ ] App Review notes state: *"Background location is used so caregivers can share live GPS with families during active bookings."*
- [ ] Minimum deployment target: iOS 16.0
- [ ] App Privacy labels filled in App Store Connect
- [ ] Privacy policy URL added to App Store Connect listing

### Android Play Store submission checklist

- [ ] Google Play Developer account ($25 one-time)
- [ ] Minimum SDK: API 26 (Android 8.0)
- [ ] Target SDK: API 35 (Android 15)
- [ ] `ACCESS_BACKGROUND_LOCATION` permission declaration form completed in Play Console
- [ ] Data safety form completed in Play Console
- [ ] Signed with upload keystore (keep the keystore file secure — losing it means you can't update the app)

---

## Summary of All File Changes

| File | Change | Phase |
|---|---|---|
| `capacitor.config.ts` | **New file** | 0 |
| `package.json` | Add Capacitor deps + mobile build scripts | 0 |
| `ios/` | **New native Xcode project** | 0 |
| `android/` | **New native Gradle project** | 0 |
| `.gitignore` | Add `out/` | 0 |
| `next.config.ts` | Add conditional `output: 'export'` via `BUILD_TARGET` env var | 1 |
| `src/app/caregiver/[id]/page.tsx` | Add `export const dynamic = 'force-static'` | 1 |
| `src/app/book/[nannyId]/page.tsx` | Add `export const dynamic = 'force-static'` | 1 |
| `src/app/book-recurring/[nannyId]/page.tsx` | Add `export const dynamic = 'force-static'` | 1 |
| `src/lib/api.ts` | Add `typeof window !== 'undefined'` guard on redirect | 2 |
| `src/app/layout.tsx` | Dynamic Razorpay script load, safe area viewport meta, status bar + splash setup | 3, 7 |
| `src/hooks/usePayment.ts` | Add `@capacitor/browser` branch for native payment checkout | 3 |
| `src/context/AuthContext.tsx` | Add `App.addListener('appUrlOpen')` deep link handler + call `usePushNotifications()` | 4, 6 |
| Auth trigger component | Pass `careconnect://` scheme as OAuth origin on mobile | 4 |
| `ios/App/App/Info.plist` | URL scheme, location permissions, background modes, viewport | 4, 5 |
| `android/app/src/main/AndroidManifest.xml` | Intent filter, location permissions | 4, 5 |
| `src/components/location/LocationSender.tsx` | Add `@capacitor-community/background-geolocation` branch | 5 |
| `src/hooks/usePushNotifications.ts` | **New file** — push token registration + notification tap handler | 6 |
| `src/app/globals.css` | Add `env(safe-area-inset-*)` padding | 7 |
| `src/app/page.tsx` | Redirect to `/auth/login` instead of `/welcome` on mobile | 7 |

**Total: 17 file changes, 3 new files. Zero changes to the 144 component files not listed above.**
