# CareConnect → Mobile App Migration via Capacitor

## Part 3: Implementation Phases & Step-by-Step Guide

---

## 9. Implementation Phases

### Phase 1: Project Scaffolding & Build Pipeline (Days 1-3)

> **Goal:** Get the React app running in Vite, rendering in a Capacitor WebView on iOS/Android simulators.

#### Step 1.1: Create New Project

```bash
cd /Applications/Vscode
mkdir CareConnect-Mobile && cd CareConnect-Mobile
npm init -y
npx -y create-vite@latest ./ --template react-ts
```

#### Step 1.2: Install Core Dependencies

```bash
# Capacitor Core
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
npx cap init "Keel" "com.keel.careconnect" --web-dir dist

# Add Platforms
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

#### Step 1.3: Configure `capacitor.config.ts`

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.keel.careconnect',
  appName: 'Keel',
  webDir: 'dist',
  server: {
    // For development: proxy to local dev server
    // url: 'http://localhost:5173',
    // cleartext: true,
    
    // For production: use bundled web assets
    androidScheme: 'https',
    iosScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#1B3022',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1B3022',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
```

#### Step 1.4: Copy Source Code

```bash
# Copy all shared source files
cp -r ../CareConnect/src/components ./src/
cp -r ../CareConnect/src/context ./src/
cp -r ../CareConnect/src/hooks ./src/
cp -r ../CareConnect/src/lib ./src/
cp -r ../CareConnect/src/types ./src/
cp -r ../CareConnect/src/styles ./src/

# Copy static assets
cp -r ../CareConnect/public ./public/

# Copy styling config
cp ../CareConnect/tailwind.config.ts ./
cp ../CareConnect/postcss.config.mjs ./
```

#### Step 1.5: Install Web Dependencies

```bash
npm install react react-dom react-router-dom
npm install tailwindcss @tailwindcss/postcss postcss autoprefixer
npm install framer-motion socket.io-client
npm install @radix-ui/react-checkbox @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu @radix-ui/react-label \
  @radix-ui/react-select @radix-ui/react-slot
npm install lucide-react date-fns clsx tailwind-merge \
  class-variance-authority isomorphic-dompurify \
  react-markdown crypto-js lineicons \
  tailwindcss-animate @tailwindcss/container-queries

npm install -D @types/react @types/react-dom @types/node \
  @vitejs/plugin-react typescript
```

#### Step 1.6: Configure Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
```

---

### Phase 2: Next.js → React Router Migration (Days 4-8)

> **Goal:** Replace all Next.js-specific imports and routing with React Router equivalents.

#### Step 2.1: Create Router Configuration

Convert the Next.js App Router file-based routes to explicit React Router routes:

```typescript
// src/router.tsx
import { createBrowserRouter } from 'react-router-dom';

// Import all page components
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
// ... etc

export const router = createBrowserRouter([
  // Public routes
  { path: '/', element: <Landing /> },
  { path: '/about', element: <About /> },
  { path: '/how-it-works', element: <HowItWorks /> },
  { path: '/contact', element: <Contact /> },
  { path: '/services', element: <Services /> },
  { path: '/welcome', element: <Welcome /> },
  
  // Auth routes
  { path: '/auth/login', element: <Login /> },
  { path: '/auth/signup', element: <Signup /> },
  { path: '/auth/forgot-password', element: <ForgotPassword /> },
  { path: '/auth/reset-password', element: <ResetPassword /> },
  { path: '/auth/verify', element: <Verify /> },
  { path: '/auth/callback', element: <Callback /> },
  
  // Parent routes
  { path: '/parent-dashboard', element: <ParentDashboard /> },
  { path: '/parent-dashboard/family', element: <Family /> },
  { path: '/bookings', element: <Bookings /> },
  { path: '/book-service', element: <BookService /> },
  { path: '/book/:nannyId', element: <BookNanny /> },
  { path: '/book-recurring/:nannyId', element: <BookRecurring /> },
  { path: '/browse', element: <Browse /> },
  { path: '/caregiver/:id', element: <CaregiverProfile /> },
  { path: '/favorites', element: <Favorites /> },
  { path: '/messages', element: <Messages /> },
  { path: '/notifications', element: <Notifications /> },
  { path: '/recurring-bookings', element: <RecurringBookings /> },
  { path: '/settings', element: <Settings /> },
  
  // Nanny routes (Dashboard)
  { path: '/dashboard', element: <NannyDashboard /> },
  { path: '/dashboard/bookings', element: <NannyBookings /> },
  { path: '/dashboard/bookings/:id', element: <NannyBookingDetail /> },
  { path: '/dashboard/requests/:id', element: <RequestDetail /> },
  { path: '/dashboard/messages', element: <DashboardMessages /> },
  { path: '/dashboard/notifications', element: <DashboardNotifications /> },
  { path: '/dashboard/profile', element: <DashboardProfile /> },
  { path: '/dashboard/availability', element: <Availability /> },
  { path: '/dashboard/settings', element: <DashboardSettings /> },
  
  // Nanny specific
  { path: '/nanny/onboarding', element: <NannyOnboarding /> },
  { path: '/nanny/verification', element: <NannyVerification /> },
  { path: '/nanny/help', element: <NannyHelp /> },
  { path: '/nanny/reviews', element: <NannyReviews /> },
  
  // Admin routes
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/admin/users', element: <AdminUsers /> },
  { path: '/admin/bookings', element: <AdminBookings /> },
  { path: '/admin/bookings/:id', element: <AdminBookingDetail /> },
  { path: '/admin/reviews', element: <AdminReviews /> },
  { path: '/admin/disputes', element: <AdminDisputes /> },
  { path: '/admin/notifications', element: <AdminNotifications /> },
  { path: '/admin/settings', element: <AdminSettings /> },
  { path: '/admin/verifications', element: <AdminVerifications /> },
  { path: '/admin/verifications/:id', element: <AdminVerificationDetail /> },
  { path: '/admin/category-requests', element: <AdminCategoryRequests /> },
]);
```

#### Step 2.2: Search & Replace Next.js Imports

The following replacements need to be made across all component/page files:

| Next.js Import | React Router Replacement |
|----------------|-------------------------|
| `import Link from 'next/link'` | `import { Link } from 'react-router-dom'` |
| `import { useRouter } from 'next/navigation'` | `import { useNavigate } from 'react-router-dom'` |
| `import { usePathname } from 'next/navigation'` | `import { useLocation } from 'react-router-dom'` |
| `import { useSearchParams } from 'next/navigation'` | `import { useSearchParams } from 'react-router-dom'` |
| `import { useParams } from 'next/navigation'` | `import { useParams } from 'react-router-dom'` |
| `import Image from 'next/image'` | `<img>` tag (or custom Image wrapper) |
| `router.push('/path')` | `navigate('/path')` |
| `router.replace('/path')` | `navigate('/path', { replace: true })` |
| `router.back()` | `navigate(-1)` |
| `pathname` (from `usePathname()`) | `location.pathname` (from `useLocation()`) |

**Estimated changes:** ~90+ files across components and pages

#### Step 2.3: Replace `next/font/google`

**Current (in `layout.tsx`):**
```tsx
import { Fraunces, Lora, Cormorant_Garamond } from 'next/font/google';
```

**Replacement:**
```css
/* In globals.css or index.html */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900&family=Lora:ital,wght@0,400..700&family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap');
```

Or download fonts locally and include in `public/fonts/` for offline support.

#### Step 2.4: Handle `next/image`

Replace all `<Image>` from `next/image` with standard `<img>` tags or a custom `LazyImage` component:

```tsx
// src/components/ui/LazyImage.tsx
export function LazyImage({ src, alt, className, ...props }) {
  return <img src={src} alt={alt} className={className} loading="lazy" {...props} />;
}
```

---

### Phase 3: Authentication Migration (Days 9-12)

> **Goal:** Replace cookie-based auth with token-based auth for Capacitor.

#### Step 3.1: Create Capacitor Auth Storage

```typescript
// src/plugins/auth.ts
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

const TOKEN_KEY = 'auth_access_token';
const REFRESH_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';

export const mobileAuth = {
  isNative: () => Capacitor.isNativePlatform(),
  
  setTokens: async (accessToken: string, refreshToken: string) => {
    await Preferences.set({ key: TOKEN_KEY, value: accessToken });
    await Preferences.set({ key: REFRESH_KEY, value: refreshToken });
  },
  
  getAccessToken: async (): Promise<string | null> => {
    const { value } = await Preferences.get({ key: TOKEN_KEY });
    return value;
  },
  
  getRefreshToken: async (): Promise<string | null> => {
    const { value } = await Preferences.get({ key: REFRESH_KEY });
    return value;
  },
  
  setUser: async (user: any) => {
    await Preferences.set({ key: USER_KEY, value: JSON.stringify(user) });
  },
  
  getUser: async () => {
    const { value } = await Preferences.get({ key: USER_KEY });
    return value ? JSON.parse(value) : null;
  },
  
  clear: async () => {
    await Preferences.remove({ key: TOKEN_KEY });
    await Preferences.remove({ key: REFRESH_KEY });
    await Preferences.remove({ key: USER_KEY });
  },
};
```

#### Step 3.2: Modify `fetchApi` for Mobile

```typescript
// src/lib/api.ts (modified section)
import { mobileAuth } from '@/plugins/auth';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  skipRefresh = false,
  skipRedirect = false
): Promise<T> {
  const isNative = mobileAuth.isNative();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // On mobile: use Bearer token instead of cookies
  if (isNative) {
    const token = await mobileAuth.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  const fetchOptions: RequestInit = {
    ...options,
    credentials: isNative ? 'omit' : 'include', // No cookies on mobile
    headers,
  };
  
  // ... rest of fetchApi logic
}
```

#### Step 3.3: Backend Auth Endpoint Modification

The backend needs a small change to return tokens in the response body for mobile clients:

```typescript
// Backend: auth.controller.ts - add mobile support
@Post('login')
async login(@Body() loginDto: LoginDto, @Req() req, @Res() res) {
  const result = await this.authService.login(loginDto);
  
  const isMobile = req.headers['x-client-type'] === 'mobile';
  
  if (isMobile) {
    // Mobile: Return tokens in body (no cookies)
    return res.json({
      user: result.user,
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    });
  } else {
    // Web: Set HttpOnly cookies (existing behavior)
    res.cookie('access_token', result.access_token, { httpOnly: true, secure: true });
    res.cookie('refresh_token', result.refresh_token, { httpOnly: true, secure: true });
    return res.json({ user: result.user });
  }
}
```

---

### Phase 4: Native Plugin Integration (Days 13-18)

> **Goal:** Add native mobile capabilities.

#### Step 4.1: Push Notifications

```typescript
// src/plugins/notifications.ts
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { api } from '@/lib/api';

export async function initPushNotifications() {
  if (!Capacitor.isNativePlatform()) return;
  
  const permission = await PushNotifications.requestPermissions();
  if (permission.receive !== 'granted') return;
  
  await PushNotifications.register();
  
  PushNotifications.addListener('registration', async (token) => {
    // Send device token to backend
    await api.notifications.registerDevice(token.value, Capacitor.getPlatform());
  });
  
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    // Handle foreground notification
    console.log('Push received:', notification);
  });
  
  PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
    // Handle notification tap → deep link
    const data = action.notification.data;
    if (data.route) {
      window.location.href = data.route;
    }
  });
}
```

#### Step 4.2: Native Geolocation

```typescript
// src/plugins/geolocation.ts
import { Geolocation, Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export async function getCurrentPosition(): Promise<Position> {
  if (Capacitor.isNativePlatform()) {
    return await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });
  }
  // Fallback to browser API
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  });
}

export async function watchPosition(
  callback: (position: Position) => void
): Promise<string> {
  if (Capacitor.isNativePlatform()) {
    return await Geolocation.watchPosition(
      { enableHighAccuracy: true },
      (position) => {
        if (position) callback(position);
      }
    );
  }
  // Fallback to browser
  const id = navigator.geolocation.watchPosition(callback);
  return String(id);
}
```

#### Step 4.3: Camera for Verification

```typescript
// src/plugins/camera.ts
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export async function takePhoto(): Promise<string | null> {
  if (!Capacitor.isNativePlatform()) return null;
  
  const image = await Camera.getPhoto({
    quality: 80,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Camera,
  });
  
  return image.dataUrl || null;
}

export async function pickImage(): Promise<string | null> {
  const image = await Camera.getPhoto({
    quality: 80,
    allowEditing: false,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Photos,
  });
  
  return image.dataUrl || null;
}
```

#### Step 4.4: App Lifecycle & Deep Linking

```typescript
// src/plugins/appLifecycle.ts
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

export async function initAppPlugins() {
  // Status bar
  await StatusBar.setStyle({ style: Style.Dark });
  await StatusBar.setBackgroundColor({ color: '#1B3022' });
  
  // Splash screen
  await SplashScreen.hide({ fadeOutDuration: 300 });
  
  // Deep linking
  App.addListener('appUrlOpen', (event) => {
    const slug = event.url.split('keel://').pop();
    if (slug) {
      window.location.href = `/${slug}`;
    }
  });
  
  // Back button (Android)
  App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });
}
```

---

### Phase 5: Mobile-Specific UI Adaptations (Days 19-22)

> **Goal:** Optimize the UI for mobile native experience.

#### 5.1 Safe Areas

```css
/* Add to globals.css */
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

#### 5.2 Bottom Navigation

The app already has `BottomNavBar.tsx` and `MobileBottomNav.tsx` components. These need:
- Safe area padding at the bottom
- Proper z-indexing for Capacitor WebView
- Active state management with React Router instead of `usePathname()`

#### 5.3 Pull-to-Refresh

```typescript
// Add to data-fetching pages
import { useCallback, useRef } from 'react';

function usePullToRefresh(onRefresh: () => Promise<void>) {
  // Implement touch gesture detection
  // Or use @nicolo-ribaudo's pull-to-refresh library
}
```

#### 5.4 Haptic Feedback

```typescript
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// Add to interactive elements
async function onButtonTap() {
  await Haptics.impact({ style: ImpactStyle.Light });
  // ... handle action
}
```

---

### Phase 6: Testing & Deployment (Days 23-28)

#### 6.1 Development Testing

```bash
# Build the web app
npm run build

# Sync with native projects
npx cap sync

# Open in IDE
npx cap open android  # Opens Android Studio
npx cap open ios      # Opens Xcode

# Live reload during development
npx cap run android --livereload --external
npx cap run ios --livereload --external
```

#### 6.2 Testing Checklist

| Area | Test Case | Status |
|------|-----------|--------|
| **Auth** | Login/signup works with token auth | ☐ |
| **Auth** | Token refresh on 401 works | ☐ |
| **Auth** | Logout clears stored tokens | ☐ |
| **Auth** | Session persists across app restart | ☐ |
| **Navigation** | All routes accessible | ☐ |
| **Navigation** | Back button (Android) works | ☐ |
| **Navigation** | Deep linking works | ☐ |
| **Booking** | Full booking flow works | ☐ |
| **Payment** | Razorpay payment completes | ☐ |
| **Chat** | Real-time messaging works | ☐ |
| **Location** | Current location detection | ☐ |
| **Location** | Live location sharing | ☐ |
| **Location** | Geofence alerts fire | ☐ |
| **Notifications** | Push notification registration | ☐ |
| **Notifications** | Foreground notification display | ☐ |
| **Notifications** | Background notification tap opens app | ☐ |
| **Camera** | ID document photo capture | ☐ |
| **UI** | Safe area rendering | ☐ |
| **UI** | Bottom nav works | ☐ |
| **UI** | Keyboard doesn't obscure inputs | ☐ |
| **Offline** | Shows offline indicator | ☐ |
| **Performance** | App starts in < 3s | ☐ |

#### 6.3 App Store Deployment

**iOS (App Store Connect):**
1. Configure signing in Xcode
2. Set bundle ID: `com.keel.careconnect`
3. Create App Store listing
4. Archive and upload via Xcode
5. Submit for review

**Android (Google Play Console):**
1. Generate signed APK/AAB
2. Create Play Console listing
3. Upload to internal/beta track
4. Promote to production

---

## 10. Timeline Summary

| Phase | Duration | Key Deliverable |
|-------|----------|-----------------|
| **Phase 1** | Days 1-3 | Project scaffolded, Capacitor initialized, app starts in WebView |
| **Phase 2** | Days 4-8 | All Next.js removed, React Router works, all pages render |
| **Phase 3** | Days 9-12 | Token-based auth works, sessions persist, socket auth works |
| **Phase 4** | Days 13-18 | Push notifications, native geolocation, camera, deep links |
| **Phase 5** | Days 19-22 | Mobile UI polished, safe areas, haptics, pull-to-refresh |
| **Phase 6** | Days 23-28 | Tested, signed, submitted to App Store & Play Store |

**Total estimated timeline: ~4-5 weeks**

---

## 11. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Cookie auth doesn't work in WebView | High | Critical | Token-based auth from Day 1 |
| Razorpay SDK compatibility | Medium | High | InAppBrowser fallback ready |
| WebSocket in background | Medium | Medium | Background mode plugins, reconnect logic |
| Geofence accuracy on mobile | Low | Medium | Native geolocation is actually better |
| App Store rejection | Medium | High | Follow Apple/Google guidelines strictly |
| Performance on older devices | Medium | Medium | Code splitting, lazy loading |

---

*← [Part 2: Migration Strategy & Critical Challenges](./APP_MIGRATION_PART2.md)*
*← [Part 1: Codebase Analysis & Architecture Overview](./APP_MIGRATION_PART1.md)*
