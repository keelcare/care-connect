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
      '10.0.2.2',
      'localhost'
    ],
    cleartext: true,
    ...(serverUrl ? { url: serverUrl } : {}),
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
    contentInset: 'never',
    backgroundColor: '#f9fbfb',
  },
};

export default config;