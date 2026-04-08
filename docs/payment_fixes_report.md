# 💳 Technical Report: Payment & Real-Time Flow Resolution

This document serves as a formal record of the 6 critical architectural bug fixes implemented to stabilize the Razorpay payment integration and the Server-Sent Events (SSE) real-time system.

---

## 📋 Executive Summary

The payment flow was experiencing intermittent failures on Web and complete failures on Mobile (Capacitor). Through deep root-cause analysis, we identified 6 distinct bugs spanning URL scheme mismatches, fragile platform detection, incorrect unit conversions, logic errors, and security gaps. All have been resolved and verified with zero TypeScript errors.

---

## 🔧 Root Cause Analysis & Resolutions

### 1. URL Scheme Mismatch (🔴 Critical - Mobile)
- **Problem:** The mobile app's deep-link scheme was inconsistent. The frontend listened for `keel://` while the backend redirected to `careconnect://`.
- **Reasoning:** On native platforms (iOS/Android), the OS routes deep-links based on exact scheme matches. A mismatch meant the app never "re-opened" to handle the success/failure callback.
- **Resolution:** Unified all deep-links to **`keel://`** in both `PaymentsController` and `SSEProvider`.

### 2. False Capacitor Detection (🔴 Critical - Web)
- **Problem:** Using `typeof (window as any).Capacitor !== 'undefined'` to detect mobile.
- **Reasoning:** Modern Capacitor bundles often define the `Capacitor` object in the global scope even on standard `localhost:3000`. This caused the web app to skip the Razorpay SDK and try to use a non-existent native browser plugin.
- **Resolution:** Implemented the authoritative **`Capacitor.isNativePlatform()`** check, which correctly identifies the underlying runtime platform.

### 3. Unit Conversion Error (🟡 Minor - Display)
- **Problem:** Passing the Rupee amount where Razorpay expects Paise.
- **Reasoning:** Razorpay's API requires subunits (e.g., ₹1.00 = 100 paise). We were passing ₹8960 as 8960, which Razorpay interpreted as ₹89.60.
- **Resolution:** Updated the frontend to pass the server-calculated `amount_due` (in paise) to the Razorpay constructor.

### 4. Subscription Logic Error (🔴 Major - Database)
- **Problem:** Marking bookings as `COMPLETED` immediately after the first successful payment.
- **Reasoning:** For a 6-month subscription, the booking must remain `confirmed` until the end of the term. Marking it `COMPLETED` prematurely caused it to vanish from active views.
- **Resolution:** Added a check in `PaymentsService` to see if a `subscription_plan` exists. If so, the booking status is set to **`confirmed`** instead of `COMPLETED`.

### 5. Unauthenticated Order Creation (🟠 Major - Security)
- **Problem:** The `/payments/create-order` endpoint was publicly accessible.
- **Reasoning:** Any actor could theoretically create Razorpay orders against arbitrary UUIDs.
- **Resolution:** Added a **JWT Auth Guard** and implemented a backend check to ensure the requesting user is the valid owner (Parent) of the booking.

### 6. SSE Unauthorized 401 (🔴 Critical - Real-time)
- **Problem:** `EventSource` failures in mobile WebViews.
- **Reasoning:** Native mobile browsers often block or partition cookies for streaming `EventSource` connections, even with `withCredentials`.
- **Resolution:** Updated the backend to accept a secure **token query parameter** for the SSE route and updated the frontend to pass this token during the connection handshake.

---

## 🏛️ Best Practices for Future Prevention

> Platform Detection: Never use window.Capacitor for logic. Always import { Capacitor } from '@capacitor/core' and use Capacitor.isNativePlatform().

> Amount Handling: In the backend, always keep the Rupee amount (amount) and the subunit amount (amount_due) separate. In the frontend, use amount_due for SDK calls and amount only for UI text display.

> Deep Linking: All new deep-link listeners in the app should be tested against the centralized scheme: keel://.

---

## ✅ Final Verification
- **Backend Type-Check:** `npx tsc --noEmit` — ✅ Success
- **Frontend Type-Check:** `npx tsc --noEmit` — ✅ Success
- **Razorpay Modal (Web):** ✅ Opening correctly with correct value
- **SSE Connection:** ✅ Persistent across environments
