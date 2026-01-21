'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, AlertTriangle, Loader2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';

interface LocationData {
  lat: number;
  lng: number;
  timestamp?: string;
}

interface GeofenceAlert {
  message: string;
  distance: number;
  radius: number;
}

interface LiveLocationTrackerProps {
  bookingId: string;
  bookingStatus: string;
  nannyName: string;
  destinationLat?: number;
  destinationLng?: number;
}

export function LiveLocationTracker({
  bookingId,
  bookingStatus,
  nannyName,
  destinationLat,
  destinationLng,
}: LiveLocationTrackerProps) {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [geofenceAlert, setGeofenceAlert] = useState<GeofenceAlert | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only show tracking when booking is en route or in progress
  const shouldTrack = ['EN_ROUTE', 'IN_PROGRESS'].includes(bookingStatus);

  useEffect(() => {
    if (!shouldTrack || !token || !bookingId) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    // Connect to location namespace
    const newSocket = io(`${API_URL}/location`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Location socket connected');
      setIsConnected(true);
      setError(null);
      // Subscribe to this booking's location updates
      newSocket.emit('location:subscribe', { bookingId });
    });

    newSocket.on('disconnect', () => {
      console.log('Location socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Location socket error:', err);
      setError('Failed to connect to location service');
      setIsConnected(false);
    });

    // Listen for location updates
    newSocket.on('location:updated', (data: LocationData) => {
      console.log('Location update received:', data);
      setLocation(data);
    });

    // Listen for geofence alerts
    newSocket.on('geofence:alert', (data: GeofenceAlert) => {
      console.log('Geofence alert:', data);
      setGeofenceAlert(data);
      // Auto-clear alert after 10 seconds
      setTimeout(() => setGeofenceAlert(null), 10000);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit('location:unsubscribe', { bookingId });
      newSocket.disconnect();
    };
  }, [shouldTrack, token, bookingId]);

  // Calculate distance between two points
  const calculateDistance = useCallback(
    (lat1: number, lng1: number, lat2: number, lng2: number): number => {
      const R = 6371; // Earth's radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    []
  );

  const distanceToDestination =
    location && destinationLat && destinationLng
      ? calculateDistance(
          location.lat,
          location.lng,
          destinationLat,
          destinationLng
        )
      : null;

  if (!shouldTrack) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-emerald-50 to-stone-50 border-b border-stone-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isConnected ? 'bg-emerald-100' : 'bg-stone-100'
              }`}
            >
              <Navigation
                size={20}
                className={isConnected ? 'text-emerald-600' : 'text-stone-400'}
              />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900">Live Location</h3>
              <p className="text-sm text-stone-500">Tracking {nannyName}</p>
            </div>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              isConnected
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-stone-100 text-stone-500'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'
              }`}
            />
            {isConnected ? 'Live' : 'Connecting...'}
          </div>
        </div>
      </div>

      {/* Geofence Alert */}
      {geofenceAlert && (
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-3">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              {geofenceAlert.message}
            </p>
            <p className="text-xs text-amber-600">
              Distance: {geofenceAlert.distance.toFixed(2)}km (Allowed:{' '}
              {geofenceAlert.radius}km)
            </p>
          </div>
        </div>
      )}

      {/* Map Placeholder */}
      <div className="relative h-64 bg-stone-100">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle
                size={32}
                className="text-stone-400 mx-auto mb-2"
              />
              <p className="text-sm text-stone-500">{error}</p>
            </div>
          </div>
        ) : !location ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Loader2
                size={32}
                className="text-stone-400 mx-auto mb-2 animate-spin"
              />
              <p className="text-sm text-stone-500">Waiting for location...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Simple map visualization - in production, use Google Maps or Mapbox */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-stone-100">
              {/* Map grid lines */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Nanny location marker */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ top: '50%', left: '50%' }}
              >
                <div className="relative">
                  <div className="absolute -inset-4 bg-emerald-400/20 rounded-full animate-ping" />
                  <div className="relative w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <MapPin size={18} className="text-white" />
                  </div>
                </div>
              </div>

              {/* Destination marker if available */}
              {destinationLat && destinationLng && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ top: '30%', left: '70%' }}
                >
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Coordinates overlay */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
              <p className="text-xs text-stone-500">Current Position</p>
              <p className="text-sm font-mono text-stone-700">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Info Footer */}
      {location && (
        <div className="px-5 py-4 bg-stone-50 border-t border-stone-100">
          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-stone-500">Last updated</p>
              <p className="font-medium text-stone-700">
                {location.timestamp
                  ? new Date(location.timestamp).toLocaleTimeString()
                  : 'Just now'}
              </p>
            </div>
            {distanceToDestination !== null && (
              <div className="text-right">
                <p className="text-stone-500">Distance to you</p>
                <p className="font-medium text-stone-700">
                  {distanceToDestination < 1
                    ? `${(distanceToDestination * 1000).toFixed(0)}m`
                    : `${distanceToDestination.toFixed(1)}km`}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
