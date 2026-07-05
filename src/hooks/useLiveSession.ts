'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_ORIGIN } from '@/lib/api';
import { logger } from '@/lib/logger';
import type { LiveCoordinate } from '@/types/api';

export interface GeofenceAlert {
  distance: number;
  radius: number;
  message: string;
  timestamp: string;
}

export interface LiveSessionState {
  connected: boolean;
  careLocation: { lat: number; lng: number } | null;
  radius: number;
  latest: LiveCoordinate | null;
  distance: number | null; // metres from care location
  inside: boolean | null;
  lastAlert: GeofenceAlert | null;
  sharing: boolean;
  error: string | null;
}

interface Options {
  /** true = stream our GPS (nanny); false = view only (parent) */
  publish?: boolean;
  /** connect only while true (e.g. booking IN_PROGRESS) */
  enabled?: boolean;
}

interface SubscribeAck {
  error?: string;
  careLocation?: { lat: number; lng: number } | null;
  geofenceRadius?: number;
  latest?: LiveCoordinate | null;
}
interface UpdateAck {
  error?: string;
  distance?: number | null;
  inside?: boolean | null;
}
interface UpdatePayload {
  lat: number;
  lng: number;
  distance: number | null;
  inside: boolean | null;
  timestamp: string;
}
interface AlertPayload {
  distance: number;
  radius: number;
  message: string;
  timestamp: string;
}

/**
 * Live session location channel over the `/location` socket namespace.
 * Both roles subscribe to the booking room; when `publish` is set we also
 * stream the browser's geolocation via `location:update`.
 */
export function useLiveSession(
  bookingId: string | undefined,
  { publish = false, enabled = true }: Options = {}
) {
  const [state, setState] = useState<LiveSessionState>({
    connected: false,
    careLocation: null,
    radius: 100,
    latest: null,
    distance: null,
    inside: null,
    lastAlert: null,
    sharing: false,
    error: null,
  });
  const [paused, setPaused] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const watchRef = useRef<number | null>(null);

  const patch = useCallback(
    (p: Partial<LiveSessionState>) => setState((s) => ({ ...s, ...p })),
    []
  );

  // ── socket lifecycle ────────────────────────────────────────────────────
  useEffect(() => {
    if (!bookingId || !enabled) return;

    const socket = io(`${API_ORIGIN}/location`, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      patch({ connected: true });
      socket.emit('location:subscribe', { bookingId }, (ack: SubscribeAck) => {
        if (ack && !ack.error) {
          patch({
            careLocation: ack.careLocation ?? null,
            radius: ack.geofenceRadius || 100,
            latest: ack.latest ?? null,
          });
        }
      });
    });
    socket.on('disconnect', () => patch({ connected: false }));
    socket.on('connect_error', (e: Error) => logger.warn('Live socket error:', e.message));

    socket.on('location:updated', (d: UpdatePayload) => {
      patch({
        latest: { lat: d.lat, lng: d.lng, timestamp: d.timestamp },
        distance: d.distance ?? null,
        inside: d.inside ?? null,
      });
    });
    socket.on('geofence:alert', (d: AlertPayload) => {
      patch({
        lastAlert: { distance: d.distance, radius: d.radius, message: d.message, timestamp: d.timestamp },
        inside: false,
      });
    });
    socket.on('location:stopped', () => patch({ sharing: false }));

    return () => {
      socket.emit('location:unsubscribe', { bookingId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [bookingId, enabled, patch]);

  // ── GPS streaming (publish mode) ────────────────────────────────────────
  useEffect(() => {
    if (!publish || !enabled || !bookingId || paused) return;

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      // async so we never call setState synchronously in the effect body
      const t = setTimeout(
        () => patch({ error: 'Geolocation is not supported by this browser.', sharing: false }),
        0
      );
      return () => clearTimeout(t);
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const socket = socketRef.current;
        const { latitude, longitude } = pos.coords;
        patch({ sharing: true, error: null });
        if (!socket?.connected) return;
        socket.emit(
          'location:update',
          { bookingId, lat: latitude, lng: longitude },
          (ack: UpdateAck) => {
            if (ack && !ack.error) {
              patch({
                latest: { lat: latitude, lng: longitude, timestamp: new Date().toISOString() },
                distance: ack.distance ?? null,
                inside: ack.inside ?? null,
              });
            }
          }
        );
      },
      (err) => {
        patch({
          error:
            err.code === err.PERMISSION_DENIED
              ? 'Location permission is required to share your location.'
              : 'Could not read your location.',
          sharing: false,
        });
      },
      { enableHighAccuracy: true, maximumAge: 8000, timeout: 20000 }
    );
    watchRef.current = id;

    return () => {
      if (watchRef.current != null) navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    };
  }, [publish, enabled, bookingId, paused, patch]);

  const stopSharing = useCallback(() => {
    socketRef.current?.emit('location:stop', { bookingId });
    setPaused(true);
  }, [bookingId]);
  const resumeSharing = useCallback(() => setPaused(false), []);

  return { ...state, paused, stopSharing, resumeSharing };
}
