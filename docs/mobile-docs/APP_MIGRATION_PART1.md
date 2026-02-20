# CareConnect → Mobile App Migration via Capacitor

## Part 1: Codebase Analysis & Architecture Overview

---

## 1. Executive Summary

CareConnect ("Keel") is a full-stack nanny/caregiver marketplace built as a **Next.js 16** web application with a **NestJS** backend. This document provides a complete analysis of the codebase and a detailed plan for creating native iOS and Android mobile applications using **Capacitor**.

### Why Capacitor?

| Approach | Pros | Cons |
|----------|------|------|
| **Capacitor (Chosen)** | Reuses existing React codebase, native plugin access, deploys to both iOS & Android, Ionic team backed | Some performance trade-offs vs fully native |
| React Native | True native components | Requires full rewrite from scratch |
| PWA | Zero app store overhead | No native push, limited device APIs, no App Store presence |
| Flutter | High performance | Requires Dart rewrite, no code reuse |

**Verdict**: Capacitor is the optimal choice because it lets us wrap the existing React frontend inside native WebView containers, progressively adding native plugins for features like push notifications, camera, geolocation, and payments.

---

## 2. Current Technology Stack

### Frontend (`/Applications/Vscode/CareConnect`)

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.3 | React meta-framework (App Router) |
| React | 19.2.0 | UI Library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.1.17 | Utility-first styling |
| Framer Motion | 11.0.0 | Animations |
| Socket.io Client | 4.8.1 | Real-time WebSocket communication |
| Radix UI | Various | Accessible UI primitives (Dialog, Select, Dropdown, Checkbox, Label) |
| Lucide React | 0.554.0 | Icon library |
| Razorpay | 2.9.6 | Payment processing |
| js-cookie | 3.0.5 | Cookie management |
| date-fns | 4.1.0 | Date utilities |
| isomorphic-dompurify | 2.35.0 | XSS sanitization |
| crypto-js | 4.2.0 | Cryptography utilities |
| lineicons | 1.3.2 | Additional icon set |
| class-variance-authority | 0.7.1 | Component variant management |
| react-markdown | 10.1.0 | Markdown rendering |

### Backend (`/Applications/Vscode/care-connect-backend`)

| Technology | Purpose |
|------------|---------|
| NestJS | Backend framework |
| Prisma ORM | Database access |
| PostgreSQL | Primary database |
| Socket.io | Real-time WebSocket server |
| Razorpay | Payment gateway |
| JWT + HttpOnly Cookies | Authentication |

---

## 3. Complete File Inventory

### 3.1 App Routes (22 route directories, 54 page files)

```
src/app/
├── layout.tsx                          # Root layout (AuthProvider, SocketProvider, ToastProvider, fonts)
├── page.tsx                            # Landing page
├── globals.css                         # Global styles + design system
│
├── auth/
│   ├── layout.tsx                      # Auth-specific layout
│   ├── login/page.tsx                  # Login page
│   ├── signup/page.tsx                 # Signup page
│   ├── callback/page.tsx              # OAuth callback handler
│   ├── forgot-password/page.tsx       # Password recovery
│   ├── reset-password/page.tsx        # Password reset
│   └── verify/page.tsx                # Email verification
│
├── admin/                              # Admin panel
│   ├── page.tsx                        # Admin dashboard
│   ├── bookings/page.tsx              # Booking management
│   ├── bookings/[id]/page.tsx         # Booking detail
│   ├── users/page.tsx                 # User management
│   ├── reviews/page.tsx               # Review moderation
│   ├── disputes/page.tsx              # Dispute management
│   ├── notifications/page.tsx         # Admin notifications
│   ├── settings/page.tsx              # System settings
│   ├── verifications/page.tsx         # ID verification queue
│   ├── verifications/[id]/page.tsx    # Verification detail
│   └── category-requests/page.tsx     # Category change requests
│
├── dashboard/                          # Nanny dashboard
│   ├── layout.tsx                     # Dashboard layout
│   ├── page.tsx                       # Dashboard home
│   ├── bookings/page.tsx             # Nanny bookings list
│   ├── bookings/[id]/page.tsx        # Booking detail
│   ├── requests/[id]/page.tsx        # Request detail
│   ├── messages/page.tsx             # Messaging
│   ├── notifications/page.tsx        # Notifications
│   ├── profile/page.tsx              # Profile management
│   ├── availability/page.tsx         # Availability management
│   └── settings/page.tsx             # Nanny settings
│
├── parent-dashboard/                   # Parent dashboard
│   ├── page.tsx                       # Parent home
│   └── family/page.tsx               # Family/children management
│
├── book/[nannyId]/page.tsx            # Book specific nanny
├── book-recurring/[nannyId]/page.tsx  # Recurring booking
├── book-service/
│   ├── page.tsx                       # Service booking page
│   └── BookServiceContent.tsx         # Service booking content
├── bookings/page.tsx                  # Parent bookings view
├── browse/page.tsx                    # Browse caregivers
├── caregiver/[id]/page.tsx            # Caregiver profile
├── favorites/page.tsx                 # Favorited nannies
├── messages/page.tsx                  # Parent messaging
├── notifications/page.tsx             # Notification center
├── recurring-bookings/page.tsx        # Recurring bookings
├── search/                            # Search pages
├── services/page.tsx                  # Services listing
├── settings/page.tsx                  # Parent settings
│
├── nanny/                             # Nanny-specific pages
│   ├── onboarding/page.tsx           # Nanny onboarding
│   ├── verification/page.tsx          # ID verification upload
│   ├── help/page.tsx                  # Help page (also for banned users)
│   └── reviews/page.tsx              # Review management
│
├── about/page.tsx                     # About page
├── contact/page.tsx                   # Contact page
├── how-it-works/page.tsx             # How it works
└── welcome/page.tsx                   # Welcome/onboarding
```

### 3.2 Components (121 component files across 20 directories)

```
src/components/
├── ai/
│   └── Chatbot.tsx                    # AI chatbot interface
│
├── auth/
│   ├── AuthGuard.tsx                  # Route protection wrapper
│   └── ProtectedRoute.tsx            # Protected route component
│
├── banned/
│   └── HelpPanel.tsx                  # Help panel for banned users
│
├── booking/                           # Service-specific booking modals
│   ├── ChildCareModal.tsx
│   ├── ChildSelector.tsx
│   ├── HorizDial.tsx                 # Horizontal dial picker
│   ├── HousekeepingModal.tsx
│   ├── PetCareModal.tsx
│   ├── ShadowTeacherModal.tsx
│   └── SpecialNeedsModal.tsx
│
├── bookings/                          # Booking management components
│   ├── BookingForm.tsx
│   ├── BookingInterface.tsx
│   ├── NannyBookingCard.tsx
│   └── RescheduleModal.tsx
│
├── dashboard/                         # Dashboard UI components
│   ├── ActivityFeedModal.tsx
│   ├── ActivityPanel.tsx
│   ├── ChildProfileModal.tsx
│   ├── GreetingHero.tsx
│   ├── NewUserDashboard.tsx
│   ├── QuickActionCard.tsx
│   ├── ReturningUserDashboard.tsx
│   ├── ServiceSelectionModal.tsx
│   ├── SessionCard.tsx
│   ├── StatusPill.tsx
│   ├── UpcomingSchedule.tsx
│   └── nanny/
│       ├── NannyHero.tsx
│       ├── NextUpSession.tsx
│       ├── QuickActions.tsx
│       └── RecentFeedback.tsx
│
├── favorites/
│   └── FavoriteButton.tsx
│
├── features/                          # Major feature components (33 files)
│   ├── BookingCard.tsx
│   ├── BookingDetailsModal.tsx
│   ├── CTASection.tsx
│   ├── CancellationModal.tsx
│   ├── ChatSidebar.tsx
│   ├── EnhancedChatWindow.tsx
│   ├── FeaturedCaregivers.tsx
│   ├── FeaturedServices.tsx
│   ├── FilterSidebar.tsx
│   ├── Hero.tsx
│   ├── HowItWorks.tsx
│   ├── LocationModal.tsx
│   ├── PlayingChildrenAnimation.tsx
│   ├── ProfileCard.tsx
│   ├── ReviewCard.tsx
│   ├── ReviewForm.tsx
│   ├── ServiceCard.tsx
│   ├── TestimonialCard.tsx
│   ├── Testimonials.tsx
│   └── ... (14 more)
│
├── landing/                           # Landing page sections (12 files)
│   └── (Hero, Features, Pricing, etc.)
│
├── landing-new/                       # Redesigned landing (10 files)
│   └── (Updated landing sections)
│
├── layout/                            # Layout components (14 files)
│   ├── BottomNavBar.tsx              # Mobile bottom navigation (parent)
│   ├── MobileBottomNav.tsx           # Alternative mobile nav
│   ├── Navbar.tsx                    # Desktop navigation (17KB)
│   ├── Footer.tsx                    # Site footer
│   ├── ParentLayout.tsx              # Parent page wrapper
│   ├── ParentSidebar.tsx             # Parent sidebar navigation
│   ├── PublicLayout.tsx              # Public page wrapper
│   └── Navbar/                       # Navbar sub-components (5 files)
│
├── location/                          # Geolocation components (5 files)
│   ├── GeofenceAlertBanner.tsx       # Geofence alert display
│   ├── GeofenceSettings.tsx          # Geofence configuration
│   ├── LiveLocationTracker.tsx       # Real-time location tracking
│   ├── LocationSender.tsx            # Location broadcasting
│   └── index.ts                      # Barrel export
│
├── nanny/
│   └── (Nanny-specific components)
│
├── notifications/
│   └── (Notification components)
│
├── reviews/                           # Review components (3 files)
│   └── (Review display/form)
│
├── scheduling/
│   └── (Scheduling components)
│
├── services/
│   └── (Service listing components)
│
├── ui/                                # Base UI components (32 files)
│   ├── BadgePill.tsx
│   ├── CancellationModal.tsx
│   ├── Checkbox.tsx + .module.css
│   ├── Input.tsx + .module.css
│   ├── Modal.tsx + .module.css
│   ├── MultiSelect.tsx
│   ├── PriceRangeSlider.tsx + .module.css
│   ├── PrimaryButton.tsx
│   ├── Radio.tsx + .module.css
│   ├── SearchInput.tsx + .module.css
│   ├── Select.tsx + .module.css
│   ├── Skeleton.tsx + .module.css
│   ├── Spinner.tsx + .module.css
│   ├── SplashLoader.tsx
│   ├── ToastProvider.tsx + Toast.module.css
│   ├── Toggle.tsx + .module.css
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   └── dropdown-menu.tsx
│
└── verification/                      # ID verification (2 files)
    └── (Document upload components)
```

### 3.3 Context Providers (2 files)

| File | Size | Purpose |
|------|------|---------|
| `AuthContext.tsx` | 162 lines | Authentication state (cookie-based), user session, login/logout, role-based routing |
| `SocketProvider.tsx` | 307 lines | WebSocket connection management, messaging, geo-fence alerts, notifications, data refresh events |

### 3.4 Hooks (2 files)

| File | Size | Purpose |
|------|------|---------|
| `usePayment.ts` | 97 lines | Razorpay payment flow (create order → payment modal → verify) |
| `usePreferences.ts` | 56 lines | localStorage-based user preferences (location, search filters) |

### 3.5 Library/Utilities (4 files)

| File | Size | Purpose |
|------|------|---------|
| `api.ts` | 610 lines | Complete API client with 15+ service modules, cookie auth, 401 refresh, rate limit retry |
| `notificationHelpers.ts` | 158 lines | Notification formatting, relative time, grouping |
| `tokenStorage.ts` | 40 lines | DEPRECATED - tokens now in HttpOnly cookies |
| `utils.ts` | 7 lines | `cn()` utility for className merging |

### 3.6 Type Definitions (2 files)

| File | Size | Purpose |
|------|------|---------|
| `types/api.ts` | 622 lines | 40+ TypeScript interfaces/types for all data models |
| `types/notification.ts` | 24 lines | Notification types and categories |

### 3.7 Styles (2 files)

| File | Size | Purpose |
|------|------|---------|
| `globals.css` | 360 lines | Global styles, design system, glassmorphism, fluid typography, animations |
| `variables.css` | 165 lines | CSS custom properties (colors, spacing, typography, shadows, z-index) |

### 3.8 Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `next.config.ts` | Image optimization, security headers, API proxy rewrites |
| `middleware.ts` | CSP headers, route protection |
| `tailwind.config.ts` | Theme customization (295 lines) |
| `tsconfig.json` | TypeScript configuration |
| `postcss.config.mjs` | PostCSS with Tailwind |
| `.env.local` | Environment variables (API URL) |
| `netlify.toml` | Deployment config |

---

## 4. Architecture Patterns

### 4.1 Authentication Flow

```
┌─────────────────────────────────────────────────────┐
│ Cookie-Based Authentication (Cross-Domain)          │
│                                                     │
│ 1. Login → POST /auth/login → Sets HttpOnly cookies │
│ 2. All API calls use `credentials: 'include'`       │
│ 3. On 401 → Auto-refresh via POST /auth/refresh     │
│ 4. Logout → POST /auth/logout → Clears cookies      │
│ 5. Session check → GET /users/me (on page load)     │
│                                                     │
│ ⚠️  CRITICAL: HttpOnly cookies DON'T work in        │
│    Capacitor WebView without special configuration   │
└─────────────────────────────────────────────────────┘
```

### 4.2 Real-Time Communication

```
┌──────────────────────────────────────────┐
│ Socket.io WebSocket Connection           │
│                                          │
│ Events:                                  │
│ • joinRoom / leaveRoom (chat rooms)      │
│ • sendMessage / newMessage               │
│ • typing indicators                      │
│ • markAsRead                             │
│ • notification (server → client)         │
│ • geofence:alert / subscribe / unsub     │
│ • local:refresh (data re-validation)     │
│                                          │
│ Config:                                  │
│ • withCredentials: true                  │
│ • transport: websocket                   │
│ • auto-reconnect: 5 attempts            │
└──────────────────────────────────────────┘
```

### 4.3 API Architecture

```
┌─────────────────────────────────────────────────┐
│ API Client (src/lib/api.ts) - 610 lines          │
│                                                   │
│ Base: fetchApi<T>() with:                         │
│ • credentials: 'include' (cookies)                │
│ • Auto 401 → refresh → retry                     │
│ • Rate limit (429) exponential backoff            │
│ • JSON parsing with empty response handling       │
│                                                   │
│ Service Modules:                                  │
│ ┌──────────────────┬────────────────────────────┐ │
│ │ auth             │ login, signup, refresh...  │ │
│ │ users            │ me, get, update, upload    │ │
│ │ nanny            │ category requests          │ │
│ │ location         │ geocode, nearby nannies    │ │
│ │ requests         │ CRUD, matches, cancel      │ │
│ │ bookings         │ CRUD, start, complete...   │ │
│ │ chat             │ create, messages, send     │ │
│ │ reviews          │ create, getBy, eligibility │ │
│ │ notifications    │ send, list, markRead       │ │
│ │ admin            │ users, bookings, stats...  │ │
│ │ assignments      │ nanny assignments          │ │
│ │ recurringBooking │ CRUD                       │ │
│ │ availability     │ blocks CRUD                │ │
│ │ favorites        │ add, remove, check         │ │
│ │ payments         │ create order, verify       │ │
│ │ family           │ children CRUD              │ │
│ │ services         │ list                       │ │
│ │ ai               │ chat                       │ │
│ │ verification     │ upload, review             │ │
│ └──────────────────┴────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### 4.4 Role-Based Routing

| Role | Dashboard | Features |
|------|-----------|----------|
| **Parent** | `/parent-dashboard` | Book services, manage family, bookings, messages, favorites, reviews |
| **Nanny** | `/dashboard` | Accept bookings, manage availability, profile, messages, reviews |
| **Admin** | `/admin` | User management, booking oversight, verifications, disputes, settings |

### 4.5 Provider Hierarchy

```tsx
<html>
  <body>
    <ToastProvider>          // Toast notifications
      <AuthProvider>         // Auth state + session management
        <SocketProvider>     // WebSocket connection
          <Navbar />         // Conditional header
          <main>{children}</main>
          <Footer />         // Conditional footer
        </SocketProvider>
      </AuthProvider>
    </ToastProvider>
  </body>
</html>
```

---

## 5. Native Feature Requirements Matrix

| Feature | Current Web Implementation | Capacitor Plugin Needed | Priority |
|---------|---------------------------|------------------------|----------|
| **Authentication** | HttpOnly cookies via `credentials: 'include'` | `@capacitor/preferences` for token storage + custom HTTP plugin or header-based auth | 🔴 Critical |
| **Push Notifications** | Socket.io in-app toasts only | `@capacitor/push-notifications` (FCM/APNs) | 🔴 Critical |
| **Geolocation** | Browser `navigator.geolocation` API | `@capacitor/geolocation` | 🔴 Critical |
| **Camera** | Browser `<input type="file">` for ID verification | `@capacitor/camera` | 🟡 High |
| **Payments (Razorpay)** | `window.Razorpay` script tag | `capacitor-razorpay` plugin or InAppBrowser | 🟡 High |
| **Deep Linking** | Standard web URLs | `@capacitor/app` for deep links | 🟡 High |
| **Status Bar** | N/A | `@capacitor/status-bar` | 🟢 Medium |
| **Splash Screen** | N/A | `@capacitor/splash-screen` | 🟢 Medium |
| **Haptic Feedback** | N/A | `@capacitor/haptics` | 🟢 Medium |
| **App Badge** | N/A | `@capacitor/badge` | 🟢 Medium |
| **Keyboard** | Browser default | `@capacitor/keyboard` | 🟢 Medium |
| **Network Status** | N/A | `@capacitor/network` | 🟢 Medium |
| **Local Notifications** | Toasts only | `@capacitor/local-notifications` | 🟢 Medium |
| **Biometric Auth** | N/A (future) | `capacitor-native-biometric` | 🔵 Nice-to-have |
| **Share** | N/A | `@capacitor/share` | 🔵 Nice-to-have |

---

*Continued in [Part 2: Migration Strategy & Implementation Plan →](./APP_MIGRATION_PART2.md)*
