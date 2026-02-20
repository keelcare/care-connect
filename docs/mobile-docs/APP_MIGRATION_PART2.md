# CareConnect → Mobile App Migration via Capacitor

## Part 2: Migration Strategy & Critical Challenges

---

## 6. Critical Migration Challenges

### 6.1 🔴 Challenge #1: Cookie-Based Authentication → Token-Based Auth

**Current State:** The entire auth system relies on HttpOnly cookies:
- `fetchApi()` uses `credentials: 'include'` on every request
- Backend sets `HttpOnly` `Secure` cookies for `access_token` and `refresh_token`
- WebSocket connection uses `withCredentials: true`
- `tokenStorage.ts` is already deprecated (no-ops)

**Problem:** Capacitor's WebView does **NOT** reliably support cross-domain HttpOnly cookies. The WebView and native HTTP requests handle cookies differently across iOS (WKWebView) and Android (WebView).

**Solution - Hybrid Token Strategy:**

```
┌─────────────────────────────────────────────────────┐
│ MOBILE AUTH FLOW                                     │
│                                                      │
│ 1. Login → POST /auth/login (mobile flag)            │
│    Backend returns: { user, access_token,             │
│                       refresh_token } in JSON body    │
│                                                      │
│ 2. Store tokens in Capacitor Preferences              │
│    (Encrypted native storage, NOT localStorage)       │
│                                                      │
│ 3. All API requests: Authorization: Bearer <token>   │
│    (No more credentials: 'include')                  │
│                                                      │
│ 4. On 401 → Use refresh_token to get new pair        │
│                                                      │
│ 5. Socket.io: auth: { token: <access_token> }        │
└─────────────────────────────────────────────────────┘
```

**Files Affected:**
| File | Change Required |
|------|----------------|
| `src/lib/api.ts` | Add `Authorization` header instead of cookies when in Capacitor |
| `src/context/AuthContext.tsx` | Use Capacitor Preferences for token storage |
| `src/context/SocketProvider.tsx` | Pass token in socket auth instead of cookies |
| Backend: `src/auth/` | Add endpoint variant that returns tokens in JSON body for mobile |

### 6.2 🔴 Challenge #2: Next.js SSR → Static Export

**Current State:** The app uses Next.js App Router with:
- Server-side rendering capabilities
- `next/navigation` (`useRouter`, `usePathname`)
- `next/font/google` for font loading
- `next/link` for client-side navigation
- API rewrites in `next.config.ts` (proxy `/api/:path*` to backend)
- Middleware for CSP headers

**Problem:** Capacitor requires a **static build** served from the device filesystem. SSR, middleware, and API rewrites don't work in a Capacitor WebView.

**Solution - Static Export Configuration:**

```typescript
// next.config.ts (modified for Capacitor)
const nextConfig: NextConfig = {
  output: 'export',        // Static HTML export
  images: {
    unoptimized: true,      // No image optimization server
  },
  // Remove rewrites (won't work in static export)
  // Remove middleware CSP (handled by Capacitor native config)
};
```

**Architecture Decision:** We will NOT modify the existing web codebase. Instead:

1. Create a **new repository** `/Applications/Vscode/CareConnect-Mobile`
2. Copy the React source code (components, context, hooks, lib, types, styles)
3. Replace Next.js with **Vite + React Router** (or use `@nicolo-ribaudo/next-for-capacitor`)
4. This keeps the web app untouched while creating a mobile-optimized build pipeline

### 6.3 🔴 Challenge #3: Geolocation via Browser API → Native Geolocation

**Current State:** Location features use direct browser APIs:
- `LocationSender.tsx` - Sends nanny's live location via socket
- `LiveLocationTracker.tsx` - Tracks nanny location on parent's view
- `GeofenceSettings.tsx` - Geofence radius configuration
- `GeofenceAlertBanner.tsx` - Alert when nanny leaves geofence
- Both use `navigator.geolocation.watchPosition()` and `getCurrentPosition()`

**Solution:**

```typescript
import { Geolocation } from '@capacitor/geolocation';

// Replace navigator.geolocation.getCurrentPosition
const position = await Geolocation.getCurrentPosition({
  enableHighAccuracy: true
});

// Replace navigator.geolocation.watchPosition
const watchId = await Geolocation.watchPosition(
  { enableHighAccuracy: true },
  (position) => { /* handle update */ }
);
```

**Advantage:** Native geolocation is more reliable, works in background, and provides better accuracy on mobile devices.

### 6.4 🟡 Challenge #4: Razorpay Payment Integration

**Current State:** Uses browser-based Razorpay:
- Script loaded via `<script src="https://checkout.razorpay.com/v1/checkout.js">`
- `usePayment.ts` creates Razorpay instance via `new window.Razorpay(options)`
- Opens payment modal in browser

**Solution Options:**

| Option | Description | Effort |
|--------|-------------|--------|
| **A. InAppBrowser** | Open Razorpay in Capacitor InAppBrowser | Low |
| **B. Razorpay React Native SDK** | Use `react-native-razorpay` via Capacitor bridge | Medium |
| **C. Custom Plugin** | Create Capacitor plugin wrapping native Razorpay SDK | High |

**Recommended:** Option A for MVP, migrate to Option B for production.

### 6.5 🟡 Challenge #5: Push Notifications

**Current State:** Only in-app socket-based toast notifications:
- `SocketProvider.tsx` listens to `notification` socket event
- Displays via `ToastProvider`
- No background notification support

**Solution:**

```
┌─────────────────────────────────────────────┐
│ PUSH NOTIFICATION ARCHITECTURE              │
│                                             │
│ Mobile App                                  │
│ ├── @capacitor/push-notifications           │
│ │   ├── Register for FCM/APNs on login      │
│ │   ├── Store device token in backend        │
│ │   └── Handle foreground/background notifs  │
│ │                                            │
│ Backend                                      │
│ ├── Store device tokens per user             │
│ ├── On booking/message/alert events:         │
│ │   ├── Send Socket event (for web)          │
│ │   └── Send FCM/APNs push (for mobile)      │
│ └── Firebase Admin SDK for push sending      │
└─────────────────────────────────────────────┘
```

**Backend Changes Required:**
- Add `device_tokens` table (user_id, token, platform, created_at)
- Add Firebase Admin SDK dependency
- Add push notification service
- Modify notification service to send push alongside socket events

---

## 7. New Repository Structure

```
/Applications/Vscode/CareConnect-Mobile/
├── android/                    # Android native project (auto-generated by Capacitor)
├── ios/                        # iOS native project (auto-generated by Capacitor)
├── src/                        # React app source (migrated from CareConnect)
│   ├── components/             # All components from web app
│   ├── context/                # Auth + Socket providers (modified for mobile)
│   ├── hooks/                  # usePayment (modified), usePreferences
│   ├── lib/                    # API client (modified for token auth)
│   ├── pages/                  # React Router pages (converted from Next.js app router)
│   ├── plugins/                # Capacitor plugin wrappers
│   │   ├── auth.ts             # Token storage via Capacitor Preferences
│   │   ├── geolocation.ts      # Native geolocation wrapper
│   │   ├── notifications.ts    # Push notification setup
│   │   ├── camera.ts           # Camera for verification uploads
│   │   └── payments.ts         # Payment integration wrapper
│   ├── styles/                 # CSS (globals.css, variables.css)
│   ├── types/                  # TypeScript types (unchanged)
│   ├── router.tsx              # React Router setup
│   ├── App.tsx                 # Root component
│   └── main.tsx                # Entry point
├── public/                     # Static assets
├── capacitor.config.ts         # Capacitor configuration
├── vite.config.ts              # Vite build configuration
├── tailwind.config.ts          # Tailwind (copied, adjusted)
├── postcss.config.js           # PostCSS
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
└── APP_MIGRATION.md            # This document
```

---

## 8. Dependency Mapping (Web → Mobile)

### Keep As-Is
| Package | Reason |
|---------|--------|
| `react`, `react-dom` | Core framework |
| `tailwindcss`, `postcss`, `autoprefixer` | Styling |
| `framer-motion` | Animations (fully client-side) |
| `socket.io-client` | WebSocket (need auth modification) |
| `@radix-ui/*` | UI primitives (all client-side) |
| `lucide-react` | Icons |
| `date-fns` | Date utilities |
| `clsx`, `tailwind-merge`, `class-variance-authority` | Class utilities |
| `isomorphic-dompurify` | XSS protection |
| `react-markdown` | Markdown rendering |

### Replace/Remove
| Package | Replacement | Reason |
|---------|-------------|--------|
| `next` | `vite` + `react-router-dom` | No SSR/middleware support in Capacitor |
| `next/font/google` | Direct Google Fonts CSS import or local fonts | No Next.js font optimization |
| `next/link` | React Router `<Link>` | Different routing library |
| `next/navigation` | React Router `useNavigate`, `useLocation` | Different routing library |
| `razorpay` | `@capacitor-community/in-app-browser` or native SDK | Native payment handling |
| `js-cookie` | `@capacitor/preferences` | No cookies in mobile |

### Add New
| Package | Purpose |
|---------|---------|
| `@capacitor/core` | Capacitor runtime |
| `@capacitor/cli` | Build/sync tooling |
| `@capacitor/android` | Android platform |
| `@capacitor/ios` | iOS platform |
| `@capacitor/preferences` | Secure token storage |
| `@capacitor/push-notifications` | FCM/APNs push notifications |
| `@capacitor/geolocation` | Native geolocation |
| `@capacitor/camera` | Camera for document upload |
| `@capacitor/status-bar` | Status bar customization |
| `@capacitor/splash-screen` | Launch screen |
| `@capacitor/haptics` | Haptic feedback |
| `@capacitor/keyboard` | Keyboard management |
| `@capacitor/network` | Network status detection |
| `@capacitor/app` | App lifecycle + deep linking |
| `@capacitor/badge` | Notification badge count |
| `vite` | Build tool |
| `react-router-dom` | Client-side routing |
| `@vitejs/plugin-react` | React support for Vite |

---

*Continued in [Part 3: Implementation Phases & Step-by-Step Guide →](./APP_MIGRATION_PART3.md)*
