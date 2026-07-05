'use client';

import React from 'react';
import {
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Radio,
  Home,
  User,
  Pause,
  Play,
} from 'lucide-react';
import { GeofenceRadar } from './GeofenceRadar';
import type { useLiveSession } from '@/hooks/useLiveSession';

type Session = ReturnType<typeof useLiveSession>;

function timeAgo(ts?: string) {
  if (!ts) return null;
  const secs = Math.max(0, Math.round((Date.now() - new Date(ts).getTime()) / 1000));
  if (secs < 10) return 'just now';
  if (secs < 60) return `${secs}s ago`;
  const m = Math.round(secs / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.round(m / 60)}h ago`;
}

export function LiveTrackingCard({
  session,
  role,
  avatarUrl,
}: {
  session: Session;
  role: 'nanny' | 'parent';
  avatarUrl?: string | null;
}) {
  const {
    connected,
    careLocation,
    latest,
    distance,
    inside,
    radius,
    lastAlert,
    sharing,
    error,
    paused,
  } = session;
  const isNanny = role === 'nanny';
  const outside = inside === false;

  return (
    <div className="overflow-hidden rounded-[24px] border border-neutral-100 bg-white shadow-soft">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-neutral-50 px-6 py-4">
        <Radio size={16} className={connected ? 'text-emerald-600' : 'text-neutral-400'} />
        <h3 className="flex-1 font-bold text-primary-900">Live location</h3>
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
            connected ? 'bg-emerald-50' : 'bg-neutral-100'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
          <span
            className={`text-[10px] font-bold uppercase tracking-widest ${
              connected ? 'text-emerald-700' : 'text-neutral-500'
            }`}
          >
            {connected ? 'Live' : 'Connecting'}
          </span>
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 px-6 py-6">
        <GeofenceRadar
          careLocation={careLocation}
          latest={latest}
          distance={distance}
          inside={inside}
          radius={radius}
          avatarUrl={avatarUrl}
          waiting={connected && !latest}
        />

        {/* Status pill */}
        <div
          className={`flex items-center gap-2 rounded-full px-4 py-2 ${
            outside ? 'bg-red-50' : 'bg-emerald-50'
          }`}
        >
          {outside ? (
            <ShieldAlert size={16} className="text-red-500" />
          ) : (
            <ShieldCheck size={16} className="text-emerald-600" />
          )}
          <span className={`text-sm font-semibold ${outside ? 'text-red-700' : 'text-emerald-700'}`}>
            {inside == null
              ? 'Locating…'
              : outside
                ? `Outside safe zone · ${distance ?? '—'}m away`
                : 'Inside safe zone'}
          </span>
        </div>

        {/* Legend + meta */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-900">
                <Home size={9} className="text-white" />
              </span>
              <span className="text-xs text-neutral-500">Care location</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  outside ? 'bg-red-500' : 'bg-emerald-600'
                }`}
              >
                <User size={9} className="text-white" />
              </span>
              <span className="text-xs text-neutral-500">{isNanny ? 'You' : 'Caregiver'}</span>
            </span>
          </div>
          <span className="text-xs text-neutral-400">
            {latest?.timestamp ? `Updated ${timeAgo(latest.timestamp)}` : `${radius}m radius`}
          </span>
        </div>
      </div>

      {/* Alert banner */}
      {lastAlert && (
        <div className="flex items-center gap-2 border-t border-red-100 bg-red-50 px-6 py-3">
          <ShieldAlert size={15} className="text-red-500" />
          <span className="flex-1 text-xs text-red-700">{lastAlert.message}</span>
        </div>
      )}

      {/* Nanny publisher controls */}
      {isNanny && (
        <div className="flex flex-col gap-2 border-t border-neutral-50 px-6 py-4">
          {error ? (
            <p className="text-xs text-red-600">{error}</p>
          ) : (
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-primary-600" />
              <p className="flex-1 text-xs text-neutral-500">
                {sharing
                  ? 'You’re sharing your live location with the family for this session.'
                  : paused
                    ? 'Location sharing is paused.'
                    : 'Preparing to share your location…'}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={paused ? session.resumeSharing : session.stopSharing}
            className={`flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors ${
              paused
                ? 'border-primary-900 bg-primary-900 text-white hover:bg-primary-800'
                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            {paused ? <Play size={15} /> : <Pause size={15} />}
            {paused ? 'Resume sharing' : 'Pause sharing'}
          </button>
        </div>
      )}
    </div>
  );
}
