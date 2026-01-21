'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, X, Bell, Navigation } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';

interface GeofenceAlert {
  bookingId: string;
  nannyName: string;
  message: string;
  distance: number;
  radius: number;
  timestamp: string;
  type: 'left_geofence' | 'returned_geofence' | 'approaching';
}

interface GeofenceAlertBannerProps {
  /** If provided, only listen for alerts for this specific booking */
  bookingId?: string;
  /** Callback when an alert is received */
  onAlert?: (alert: GeofenceAlert) => void;
  /** Position of the banner */
  position?: 'top' | 'bottom';
  /** Whether to auto-dismiss alerts */
  autoDismiss?: boolean;
  /** Auto-dismiss timeout in milliseconds */
  autoDismissTimeout?: number;
}

export function GeofenceAlertBanner({
  bookingId,
  onAlert,
  position = 'top',
  autoDismiss = true,
  autoDismissTimeout = 15000,
}: GeofenceAlertBannerProps) {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<GeofenceAlert[]>([]);
  const socketRef = React.useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Only parents should see geofence alerts
  const shouldConnect = user?.role === 'parent';

  const playAlertSound = () => {
    // ... (rest of function)
    try {
      const audioContext = new (
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;

      oscillator.start();
      setTimeout(() => oscillator.stop(), 200);
    } catch (e) {
      console.log('Could not play alert sound');
    }
  };

  useEffect(() => {
    if (!shouldConnect) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    // Connect to location namespace for geofence alerts
    const newSocket = io(`${API_URL}/location`, {
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Geofence alert socket connected');
      setIsConnected(true);

      // Subscribe to all bookings or specific booking
      if (bookingId) {
        newSocket.emit('geofence:subscribe', { bookingId });
      } else {
        newSocket.emit('geofence:subscribeAll');
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Geofence alert socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Geofence alert socket error:', err);
      setIsConnected(false);
    });

    // Listen for geofence alerts
    newSocket.on('geofence:alert', (data: GeofenceAlert) => {
      console.log('Geofence alert received:', data);

      // Add alert to the list
      setAlerts((prev) => {
        // Avoid duplicate alerts
        const exists = prev.some(
          (a) =>
            a.bookingId === data.bookingId &&
            Math.abs(
              new Date(a.timestamp).getTime() -
                new Date(data.timestamp).getTime()
            ) < 5000
        );
        if (exists) return prev;
        return [data, ...prev].slice(0, 5); // Keep max 5 alerts
      });

      // Call callback if provided
      onAlert?.(data);

      // Play notification sound
      playAlertSound();
    });

    return () => {
      if (bookingId) {
        newSocket.emit('geofence:unsubscribe', { bookingId });
      } else {
        newSocket.emit('geofence:unsubscribeAll');
      }
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [shouldConnect, user, bookingId, onAlert]);

  // Auto-dismiss alerts
  useEffect(() => {
    if (!autoDismiss || alerts.length === 0) return;

    const timer = setTimeout(() => {
      setAlerts((prev) => prev.slice(0, -1));
    }, autoDismissTimeout);

    return () => clearTimeout(timer);
  }, [alerts, autoDismiss, autoDismissTimeout]);



  const dismissAlert = (index: number) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  };

  const getAlertStyle = (type: GeofenceAlert['type']) => {
    switch (type) {
      case 'left_geofence':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          text: 'text-red-800',
          subtext: 'text-red-600',
        };
      case 'returned_geofence':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          icon: 'text-emerald-600',
          text: 'text-emerald-800',
          subtext: 'text-emerald-600',
        };
      case 'approaching':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          icon: 'text-amber-600',
          text: 'text-amber-800',
          subtext: 'text-amber-600',
        };
      default:
        return {
          bg: 'bg-stone-50',
          border: 'border-stone-200',
          icon: 'text-stone-600',
          text: 'text-stone-800',
          subtext: 'text-stone-600',
        };
    }
  };

  const getAlertIcon = (type: GeofenceAlert['type']) => {
    switch (type) {
      case 'left_geofence':
        return <AlertTriangle size={20} />;
      case 'returned_geofence':
        return <MapPin size={20} />;
      case 'approaching':
        return <Navigation size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  if (!shouldConnect || alerts.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed ${position === 'top' ? 'top-4' : 'bottom-4'} left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg px-4 space-y-2`}
    >
      {alerts.map((alert, index) => {
        const style = getAlertStyle(alert.type);
        return (
          <div
            key={`${alert.bookingId}-${alert.timestamp}-${index}`}
            className={`${style.bg} ${style.border} border rounded-2xl shadow-lg backdrop-blur-sm animate-in slide-in-from-top-2 duration-300`}
          >
            <div className="px-4 py-3 flex items-start gap-3">
              <div className={`flex-shrink-0 mt-0.5 ${style.icon}`}>
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${style.text}`}>
                  {alert.type === 'left_geofence' && 'Caregiver Left Area'}
                  {alert.type === 'returned_geofence' && 'Caregiver Returned'}
                  {alert.type === 'approaching' && 'Caregiver Approaching'}
                </p>
                <p className={`text-sm ${style.subtext} mt-0.5`}>
                  {alert.message ||
                    `${alert.nannyName} is ${alert.distance.toFixed(2)}km away`}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span className={style.subtext}>
                    Distance:{' '}
                    {alert.distance < 1
                      ? `${(alert.distance * 1000).toFixed(0)}m`
                      : `${alert.distance.toFixed(2)}km`}
                  </span>
                  <span className={style.subtext}>
                    Allowed radius: {alert.radius}km
                  </span>
                </div>
              </div>
              <button
                onClick={() => dismissAlert(index)}
                className={`flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors ${style.icon}`}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
