# Keel Mobile App Development Guide

This guide will walk you through building, running, and maintaining the Keel mobile application on iOS and Android using Capacitor.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js & npm**
- **Android Studio** (for Android)
- **Xcode** (for iOS - Requires macOS)
- **Capacitor CLI**: `npm install @capacitor/cli`

---

## 🚀 Development Workflow

The mobile app is built using **Vite + React**. You can develop in two ways:

### 1. Web Development (Fastest)
Run the app in your browser to test UI and logic changes quickly.
```bash
npm run dev
```

### 2. Native Development (Live Reload)
Run the app on a physical device or emulator with **Live Reload** enabled.

> [!IMPORTANT]  
> **Live Reload Requirement**: You MUST have `npm run dev` running in a separate terminal for live reload to work. The app connects to your machine's IP address to fetch the latest changes.

> [!TIP]
> Since you just added iOS, you **must** run `npm run build` once before the first run so Capacitor can find your web assets.

```bash
# 1. Start the web dev server
npm run dev

# 2. In a NEW terminal, run the native app
npm run cap:run:ios  # or cap:run:android
```

---

## 🏗️ Build & Sync Process

When you make changes to the code and want to reflect them in the native IDEs (Xcode/Android Studio), follow these steps:

1. **Build the Web Project**:
   ```bash
   npm run build
   ```
2. **Sync with Native Platforms**:
   This copies your web assets and updates dependencies in the native projects.
   ```bash
   npm run cap:sync
   ```

---

## 📱 Running on Native Platforms

### Android (Android Studio)
1. Open the project in Android Studio:
   ```bash
   npm run cap:android
   ```
2. Wait for Gradle to finish syncing.
3. Select your device or emulator and click the **Run** button (green arrow).

### iOS (Xcode)
1. Open the project in Xcode:
   ```bash
   npm run cap:ios
   ```
2. Select your Target Device (Simulator or Physical Device).
3. Click the **Run** button (Play icon).

---

## 🛠️ Making Changes

### Adding New Components
1. Create your component in `src/components`.
2. Use them in your pages in `src/pages`.
3. If the change is purely web-based, use `npm run dev` to verify.

### Using Native Plugins
We have created several native wrappers in `src/plugins/`:
- **Geolocation**: `getCurrentLocation()`, `watchLocation()`
- **Camera**: `takePhoto()`, `pickImage()`
- **Push Notifications**: `initPushNotifications()`
- **Haptics**: `hapticImpact()`, `hapticNotification()`

**Example Usage**:
```tsx
import { takePhoto } from '@/plugins/camera';

const myFunc = async () => {
    const photo = await takePhoto();
    console.log(photo.webPath);
};
```

---

## 🐞 Debugging Tips

### Web Debugging
- Use the standard Browser Developer Tools (F12) when running `npm run dev`.

### Android Debugging
- In Chrome, go to `chrome://inspect/#devices` to debug the WebView of your running Android app.
- View logs in Android Studio's **Logcat** tab.

### iOS Debugging
- In Safari, go to **Develop > [Your Device] > [Your App]** to debug the WebView.
- View logs in Xcode's **Console** area.

---

## 📦 Production Release

### Android
1. In Android Studio: **Build > Generate Signed Bundle / APK**.
2. Follow the wizard to sign your app.

### iOS
1. In Xcode: Select **Generic iOS Device** as the target.
2. Go to **Product > Archive**.
3. Follow the **Distribute App** wizard in the Organizer window.
