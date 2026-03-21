import { CapacitorConfig } from '@capacitor/cli';

const serverUrl = process.env.CAP_FRONTEND_URL;

const config: CapacitorConfig = {
  appId: 'com.keel.careconnect',
  appName: 'Keel',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    allowNavigation: [
      'care-connect-backend-ok23.onrender.com',
      'checkout.razorpay.com',
      'api.razorpay.com',
      'nominatim.openstreetmap.org',
    ],
    ...(serverUrl ? { url: serverUrl, cleartext: true } : {}),
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
  ios: {
    scrollEnabled: true,
    contentInset: 'always',
  },
};

export default config;