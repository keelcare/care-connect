'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, Navigation, Power, AlertCircle } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface LocationSenderProps {
  bookingId: string;
  bookingStatus: string;
  onStatusChange?: (isSharing: boolean) => void;
}

export function LocationSender({
  bookingId,
  bookingStatus,
  onStatusChange,
}: LocationSenderProps) {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Only allow sharing when booking is en route or in progress
  const canShare = ['EN_ROUTE', 'IN_PROGRESS'].includes(bookingStatus);

  // Initialize socket connection
  useEffect(() => {
    if (!user || !bookingId) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    const newSocket = io(`${API_URL}/location`, {
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true,
    });

    newSocket.on('connect', () => {
      console.log('Location sender socket connected');
    });

    newSocket.on('disconnect', () => {
      console.log('Location sender socket disconnected');
    });

    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [user, bookingId]);

  // Send location update
  const sendLocationUpdate = useCallback(
    (lat: number, lng: number) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('location:update', {
          bookingId,
          lat,
          lng,
        });
        console.log('Location sent:', { lat, lng });
      }
    },
    [bookingId]
  );

  // Start sharing location
  const startSharing = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setError(null);
    setPermissionDenied(false);

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        sendLocationUpdate(latitude, longitude);
        setIsSharing(true);
        onStatusChange?.(true);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true);
          setError(
            'Location permission denied. Please enable location access.'
          );
        } else {
          setError('Failed to get your location');
        }
      },
      { enableHighAccuracy: true }
    );

    // Watch position changes
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.error('Watch position error:', err);
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    // Send location updates every 10 seconds
    intervalRef.current = setInterval(() => {
      if (currentLocation) {
        sendLocationUpdate(currentLocation.lat, currentLocation.lng);
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lng: longitude });
            sendLocationUpdate(latitude, longitude);
          },
          () => { },
          { enableHighAccuracy: true }
        );
      }
    }, 10000);
  }, [currentLocation, sendLocationUpdate, onStatusChange]);

  // Stop sharing location
  const stopSharing = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSharing(false);
    onStatusChange?.(false);
  }, [onStatusChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSharing();
    };
  }, [stopSharing]);

  // Auto-start sharing when status changes to EN_ROUTE
  useEffect(() => {
    if (bookingStatus === 'EN_ROUTE' && !isSharing) {
      // Defer execution to avoid synchronous state update warning
      const timer = setTimeout(() => startSharing(), 0);
      return () => clearTimeout(timer);
    } else if (!canShare && isSharing) {
      const timer = setTimeout(() => stopSharing(), 0);
      return () => clearTimeout(timer);
    }
  }, [bookingStatus, canShare, isSharing, startSharing, stopSharing]);

  if (!canShare) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div
        className={`px-5 py-4 border-b ${isSharing
            ? 'bg-gradient-to-r from-primary-50 to-green-50 border-primary-100'
            : 'bg-stone-50 border-stone-100'
          }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${isSharing ? 'bg-primary-100' : 'bg-stone-100'
                }`}
            >
              <Navigation
                size={20}
                className={
                  isSharing
                    ? 'text-primary-600 animate-pulse'
                    : 'text-stone-400'
                }
              />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">Location Sharing</h3>
              <p className="text-sm text-stone-500">
                {isSharing
                  ? 'Your location is being shared'
                  : 'Share your location with parent'}
              </p>
            </div>
          </div>

          {isSharing && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 rounded-full">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-primary-700">Live</span>
            </div>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="px-5 py-3 bg-red-50 border-b border-red-100 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {currentLocation && isSharing && (
          <div className="mb-4 p-3 bg-stone-50 rounded-xl">
            <p className="text-xs text-stone-500 mb-1">Current Position</p>
            <p className="text-sm font-mono text-stone-700">
              {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
            </p>
          </div>
        )}

        <Button
          onClick={isSharing ? stopSharing : startSharing}
          className={`w-full rounded-xl h-12 font-medium ${isSharing
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-primary-900 hover:bg-primary-800 text-white'
            }`}
          disabled={permissionDenied}
        >
          {isSharing ? (
            <>
              <Power size={18} className="mr-2" />
              Stop Sharing
            </>
          ) : (
            <>
              <MapPin size={18} className="mr-2" />
              Start Sharing Location
            </>
          )}
        </Button>

        {permissionDenied && (
          <p className="text-xs text-stone-500 text-center mt-3">
            Please enable location access in your browser settings to share your
            location.
          </p>
        )}
      </div>
    </div>
  );
}
