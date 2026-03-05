'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User, Booking } from '@/types/api';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import {
  X,
  Star,
  Phone,
  MapPin,
  Mail,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Briefcase,
  Clock,
  DollarSign,
  Award,
  CalendarDays,
  TrendingUp,
  Tag,
} from 'lucide-react';

interface NannyProfileModalProps {
  nannyId: string | null;
  allBookings: Booking[];
  onClose: () => void;
}

interface AdminBooking extends Booking {
  jobs?: { title?: string };
  users_bookings_parent_idTousers?: {
    id: string;
    email: string;
    profiles?: { first_name?: string | null; last_name?: string | null };
  };
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={14} className="text-neutral-500" />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-neutral-800 mt-0.5">{value || '—'}</p>
      </div>
    </div>
  );
}

function StatBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: React.ReactNode;
  color: string;
}) {
  return (
    <div className={`rounded-xl px-4 py-3 flex flex-col gap-0.5 ${color}`}>
      <span className="text-[22px] font-bold leading-none">{value}</span>
      <span className="text-[11px] font-medium opacity-70">{label}</span>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-neutral-200 fill-neutral-200'}
        />
      ))}
      <span className="ml-1 text-sm font-semibold text-neutral-700">{rating.toFixed(1)}</span>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: 'bg-emerald-50 text-emerald-700',
  CONFIRMED: 'bg-blue-50 text-blue-700',
  IN_PROGRESS: 'bg-violet-50 text-violet-700',
  CANCELLED: 'bg-red-50 text-red-600',
  REQUESTED: 'bg-amber-50 text-amber-700',
};

export default function NannyProfileModal({ nannyId, allBookings, onClose }: NannyProfileModalProps) {
  const [nanny, setNanny] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const bookings = allBookings.filter((b) => b.nanny_id === nannyId);

  useEffect(() => {
    if (!nannyId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.users.get(nannyId)
      .then((data) => { if (!cancelled) setNanny(data); })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load profile'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [nannyId, retryKey]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!nannyId) return null;

  const fullName =
    nanny?.profiles?.first_name && nanny?.profiles?.last_name
      ? `${nanny.profiles.first_name} ${nanny.profiles.last_name}`
      : nanny?.email ?? 'Nanny';

  const initials = nanny?.profiles?.first_name?.[0]?.toUpperCase() ?? '?';

  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED').length;
  const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED').length;
  const activeBookings = bookings.filter(
    (b) => b.status === 'IN_PROGRESS' || b.status === 'CONFIRMED'
  ).length;

  const completionRate =
    bookings.length > 0 ? Math.round((completedBookings / bookings.length) * 100) : 0;

  const details = nanny?.nanny_details;
  const skills = details?.skills ?? [];
  const categories = details?.categories ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Side Sheet */}
      <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-neutral-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center text-xl font-bold text-violet-700 flex-shrink-0">
                {nanny?.profiles?.profile_image_url ? (
                  <img
                    src={nanny.profiles.profile_image_url}
                    alt={fullName}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{fullName}</h2>
                <p className="text-sm text-neutral-400">{nanny?.email}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {nanny?.is_active !== false ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600">
                      <ShieldAlert size={10} />
                      Banned
                    </span>
                  )}
                  {nanny?.is_verified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600">
                      <CheckCircle size={10} />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-500">
                      <XCircle size={10} />
                      Unverified
                    </span>
                  )}
                  {nanny?.identity_verification_status && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700">
                      <Award size={10} />
                      ID: {nanny.identity_verification_status}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors text-neutral-500"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-60">
              <Spinner />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-60 gap-3">
              <p className="text-red-500 text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={() => { setError(null); setRetryKey((k) => k + 1); }}>
                Retry
              </Button>
            </div>
          ) : (
            <div className="px-6 py-5 space-y-6">
              {/* === Booking Stats === */}
              <section>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                  Booking Overview
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <StatBadge label="Total Bookings" value={bookings.length} color="bg-neutral-50 text-neutral-800" />
                  <StatBadge label="Completed" value={completedBookings} color="bg-emerald-50 text-emerald-800" />
                  <StatBadge label="Active Now" value={activeBookings} color="bg-violet-50 text-violet-800" />
                  <StatBadge label="Completion Rate" value={`${completionRate}%`} color="bg-blue-50 text-blue-800" />
                </div>
                {cancelledBookings > 0 && (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <ShieldAlert size={12} />
                    {cancelledBookings} booking{cancelledBookings > 1 ? 's' : ''} cancelled
                  </p>
                )}
              </section>

              {/* === Rating === */}
              {(nanny?.averageRating !== undefined && nanny.averageRating > 0) && (
                <section>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                    Rating
                  </h3>
                  <div className="flex items-center gap-4">
                    <StarRating rating={nanny.averageRating} />
                    <span className="text-sm text-neutral-400">
                      from {nanny.totalReviews} review{nanny.totalReviews !== 1 ? 's' : ''}
                    </span>
                  </div>
                </section>
              )}

              {/* === Profile Info === */}
              <section>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                  Profile Details
                </h3>
                <div className="space-y-3">
                  <InfoRow icon={Phone} label="Phone" value={nanny?.profiles?.phone} />
                  <InfoRow icon={MapPin} label="Address" value={nanny?.profiles?.address} />
                  <InfoRow
                    icon={CalendarDays}
                    label="Joined"
                    value={
                      nanny?.created_at
                        ? new Date(nanny.created_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : undefined
                    }
                  />
                </div>
              </section>

              {/* === Nanny Details === */}
              {details && (
                <section>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                    Nanny Details
                  </h3>
                  <div className="space-y-3">
                    <InfoRow
                      icon={Clock}
                      label="Experience"
                      value={
                        details.experience_years != null
                          ? `${details.experience_years} year${details.experience_years !== 1 ? 's' : ''}`
                          : undefined
                      }
                    />
                    <InfoRow
                      icon={DollarSign}
                      label="Hourly Rate"
                      value={details.hourly_rate ? `₹${details.hourly_rate}/hr` : undefined}
                    />
                    {details.bio && (
                      <InfoRow icon={Briefcase} label="Bio" value={details.bio} />
                    )}
                  </div>

                  {categories.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <TrendingUp size={11} /> Categories
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {categories.map((c) => (
                          <span
                            key={c}
                            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-violet-100 text-violet-700"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                        <Tag size={11} /> Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((s) => (
                          <span
                            key={s}
                            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-600"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* === Booking History === */}
              <section>
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                  Recent Bookings
                </h3>
                {bookings.length === 0 ? (
                  <p className="text-sm text-neutral-400 py-4 text-center">No bookings yet</p>
                ) : (
                  <div className="space-y-2">
                    {bookings.slice(0, 10).map((b) => {
                      const parentName =
                        (b as any).users_bookings_parent_idTousers?.profiles?.first_name
                          ? `${(b as any).users_bookings_parent_idTousers.profiles.first_name} ${(b as any).users_bookings_parent_idTousers.profiles.last_name ?? ''}`
                          : b.parent?.profiles?.first_name
                          ? `${b.parent.profiles.first_name} ${b.parent.profiles.last_name ?? ''}`
                          : b.parent?.email ?? 'Parent';

                      const jobTitle =
                        (b as any).jobs?.title ?? b.job?.title ?? 'Direct Booking';

                      const statusStyle =
                        STATUS_STYLES[b.status.toUpperCase()] ?? 'bg-neutral-50 text-neutral-600';

                      return (
                        <div
                          key={b.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 hover:bg-neutral-50/70 transition-colors"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-800 truncate">
                              {jobTitle}
                            </p>
                            <p className="text-xs text-neutral-400 mt-0.5 truncate">
                              Parent: {parentName} ·{' '}
                              {new Date(b.start_time).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <span
                            className={`ml-3 flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${statusStyle}`}
                          >
                            {b.status.toLowerCase().replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                    {bookings.length > 10 && (
                      <p className="text-center text-xs text-neutral-400 pt-1">
                        +{bookings.length - 10} more bookings
                      </p>
                    )}
                  </div>
                )}
              </section>

              {/* Ban reason (if banned) */}
              {nanny?.ban_reason && (
                <section className="rounded-xl bg-red-50 border border-red-100 p-4">
                  <p className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <ShieldAlert size={12} /> Ban Reason
                  </p>
                  <p className="text-sm text-red-700">{nanny.ban_reason}</p>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
