# CareConnect → Capacitor Mobile App Migration

> **Master Plan for converting the CareConnect (Keel) web application into iOS & Android mobile apps using Capacitor.**

---

## 📚 Documentation Structure

This migration plan is split into 3 parts for easier context and readability:

### [📋 Part 1: Codebase Analysis & Architecture Overview](./APP_MIGRATION_PART1.md)
- Executive summary & why Capacitor
- Complete technology stack inventory
- Full file inventory (123 source files, 22 routes, 121 components)
- Architecture patterns (auth, real-time, API, routing, providers)
- Native feature requirements matrix (15 features rated by priority)

### [⚙️ Part 2: Migration Strategy & Critical Challenges](./APP_MIGRATION_PART2.md)
- 5 Critical migration challenges with solutions:
  1. Cookie-based auth → Token-based auth
  2. Next.js SSR → Static export (Vite + React Router)
  3. Browser geolocation → Native geolocation
  4. Razorpay browser widget → Mobile payment integration
  5. In-app toasts → Native push notifications
- New repository structure (`CareConnect-Mobile`)
- Complete dependency mapping (keep/replace/add)

### [🚀 Part 3: Implementation Phases & Step-by-Step Guide](./APP_MIGRATION_PART3.md)
- **Phase 1** (Days 1-3): Project scaffolding & build pipeline
- **Phase 2** (Days 4-8): Next.js → React Router migration
- **Phase 3** (Days 9-12): Authentication migration
- **Phase 4** (Days 13-18): Native plugin integration
- **Phase 5** (Days 19-22): Mobile UI adaptations
- **Phase 6** (Days 23-28): Testing & deployment
- Full testing checklist (22 test cases)
- Risk assessment matrix

---

## 🏗️ Quick Reference

| Item | Detail |
|------|--------|
| **Source App** | `/Applications/Vscode/CareConnect` (Next.js 16 + React 19) |
| **Backend** | `/Applications/Vscode/care-connect-backend` (NestJS) |
| **New Mobile Repo** | `/Applications/Vscode/CareConnect-Mobile` |
| **Build Tool** | Vite (replacing Next.js) |
| **Routing** | React Router v6 (replacing Next.js App Router) |
| **Native Runtime** | Capacitor 6 |
| **Platforms** | iOS (WKWebView) + Android (WebView) |
| **Timeline** | ~4-5 weeks |
| **App ID** | `com.keel.careconnect` |

---

## 🔑 Top 3 Critical Decisions

1. **Auth Strategy**: Switch from HttpOnly cookies to Bearer token auth for mobile (cookies don't work reliably in WebView)
2. **Framework Migration**: Replace Next.js with Vite + React Router (SSR/middleware not supported in Capacitor)
3. **Separate Repository**: Keep web app untouched; create new `CareConnect-Mobile` repo with shared component library

---

> **Next Steps:** Review this plan, then we proceed with Phase 1 implementation.
