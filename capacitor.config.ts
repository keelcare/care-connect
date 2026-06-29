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
      '10.0.2.2',
      'localhost'
    ],
    // cleartext is NOT set here — Android cleartext is controlled per-build-type via
    // network_security_config.xml (debug allows localhost/192.168.x, release blocks all HTTP)
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