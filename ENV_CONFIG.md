# Environment Configuration Guide

## Overview
We use two separate environment files that **never overlap**. Your local web development is never interrupted when you build for mobile.

---

## 💻 Web Development ([`.env.local`](file:///Applications/Vscode/CareConnect/.env.local))
This is your "Ground Truth" for daily development. 
- **Used by:** `npm run dev` and `npm run build`.
- **Target:** Always points to `localhost:4000`.

## 📱 Mobile Builds ([`.env.mobile`](file:///Applications/Vscode/CareConnect/.env.mobile))
This file is **only** used when building for iOS or Android.
- **Used by:** `npm run sync:mobile`.
- **Target:** Points to Production (`onrender.com`).
- **How it works:** A custom script (`scripts/mobile-build.js`) injects these variables during the build process without ever touching your `.env.local`.

---

## How to Build for Mobile
Simply run:
```bash
npm run sync:mobile
```
This will:
1. Load production settings from `.env.mobile`.
2. Build the app.
3. Sync to Xcode/Android Studio.
4. **Leave your `.env.local` exactly as it was.**
