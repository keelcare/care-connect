import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.keel.careconnect',
  appName: 'Keel',
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