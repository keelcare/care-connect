'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

import { Capacitor } from '@capacitor/core';

export function usePushNotifications() {
  const router = useRouter();

  useEffect(() => {
    // Only run this on actual native platforms (iOS/Android)
    if (!Capacitor.isNativePlatform()) return;

    const setup = async () => {
      // Dynamic import — avoids errors on web where the plugin doesn't exist
      const { PushNotifications } = await import('@capacitor/push-notifications');

      const { receive } = await PushNotifications.requestPermissions();
      if (receive !== 'granted') return;

      await PushNotifications.register();

      // Send device token to backend
      await PushNotifications.addListener('registration', async (token) => {
        await api.users.registerPushToken(token.value);
      });

      // Handle notification received while app is open
      await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push received:', notification);
        // Toast or in-app banner can be triggered here if needed
      });

      // Handle tap on a notification
      await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        const { type } = action.notification.data ?? {};
        if (type === 'message') router.push('/messages');
        else if (type === 'booking') router.push('/bookings');
        else if (type === 'geofence') router.push('/notifications');
        else router.push('/notifications');
      });
    };

    setup();
  }, [router]);
}
