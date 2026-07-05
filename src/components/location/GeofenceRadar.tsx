'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { Home, User } from 'lucide-react';

interface GeofenceRadarProps {
  careLocation: { lat: number; lng: number } | null;
  latest: { lat: number; lng: number } | null;
  distance: number | null; // metres from care location
  inside: boolean | null;
  radius: number; // metres
  size?: number;
  avatarUrl?: string | null;
  waiting?: boolean;
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * A stylised geofence "radar": the care location sits at the centre, the
 * geofence boundary is the highlighted ring, and the caregiver's live position
 * is plotted by bearing + distance. No map SDK required.
 */
export function GeofenceRadar({
  careLocation,
  latest,
  distance,
  inside,
  radius,
  size = 260,
  avatarUrl,
  waiting,
}: GeofenceRadarProps) {
  const center = size / 2;
  const ringPx = size * 0.34;
  const maxPx = size * 0.46;

  const dot = useMemo(() => {
    if (!careLocation || !latest) return null;
    const dMeters =
      distance ?? haversine(careLocation.lat, careLocation.lng, latest.lat, latest.lng);
    const scale = ringPx / Math.max(radius, 1);
    const rPx = Math.min(dMeters * scale, maxPx);
    const north = latest.lat - careLocation.lat;
    const east = (latest.lng - careLocation.lng) * Math.cos((careLocation.lat * Math.PI) / 180);
    const θ = Math.atan2(east, north);
    return { x: center + rPx * Math.sin(θ), y: center - rPx * Math.cos(θ) };
  }, [careLocation, latest, distance, radius, ringPx, maxPx, center]);

  const isOutside = inside === false;
  const accent = isOutside ? '#ef4444' : '#16a34a';

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {/* Decorative concentric rings */}
      {[0.94, 0.66, 0.38].map((f) => (
        <div
          key={f}
          className="absolute rounded-full border border-neutral-100"
          style={{ width: size * f, height: size * f, top: (size * (1 - f)) / 2, left: (size * (1 - f)) / 2 }}
        />
      ))}

      {/* Geofence boundary ring */}
      <div
        className="absolute rounded-full border-2 transition-colors duration-500"
        style={{
          width: ringPx * 2,
          height: ringPx * 2,
          top: center - ringPx,
          left: center - ringPx,
          borderColor: accent,
          backgroundColor: isOutside ? 'rgba(239,68,68,0.06)' : 'rgba(34,197,94,0.06)',
        }}
      />

      {/* Care location (centre) */}
      <div
        className="absolute flex items-center justify-center rounded-full bg-primary-900 shadow-md"
        style={{ width: 40, height: 40, top: center - 20, left: center - 20 }}
      >
        <Home size={18} className="text-white" />
      </div>

      {/* Caregiver dot */}
      {dot && (
        <>
          <span
            className="absolute rounded-full opacity-40 animate-ping"
            style={{ width: 40, height: 40, top: dot.y - 20, left: dot.x - 20, backgroundColor: accent }}
          />
          <div
            className="absolute flex items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-md transition-all duration-500"
            style={{ width: 36, height: 36, top: dot.y - 18, left: dot.x - 18, backgroundColor: accent }}
          >
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Caregiver" width={36} height={36} className="h-full w-full object-cover" />
            ) : (
              <User size={16} className="text-white" />
            )}
          </div>
        </>
      )}

      {waiting && !dot && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="mt-14 rounded-full bg-white/90 px-3 py-1 text-xs text-neutral-500 shadow-sm">
            Waiting for location…
          </span>
        </div>
      )}
    </div>
  );
}
