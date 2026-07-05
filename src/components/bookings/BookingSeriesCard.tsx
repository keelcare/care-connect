'use client';

import React from 'react';
import Image from 'next/image';
import { RecurringServiceRequest } from '@/types/api';
import { Repeat, ChevronRight, User } from 'lucide-react';

interface BookingSeriesCardProps {
  series: RecurringServiceRequest;
  onManage: () => void;
  onCancel: () => void;
  isCancelling: boolean;
}

const CATEGORY_LABEL: Record<string, string> = {
  CC: 'Child Care',
  ST: 'Shadow Teacher',
  SN: 'Special Needs',
  EC: 'Elder Care',
};

const STATUS_STYLE: Record<string, { dot: string; text: string; bg: string; label: string }> = {
  active: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', label: 'Active' },
  paused: { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', label: 'Paused' },
  completed: { dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-100', label: 'Completed' },
  cancelled: { dot: 'bg-red-400', text: 'text-red-600', bg: 'bg-red-50', label: 'Cancelled' },
};

export function BookingSeriesCard({
  series,
  onManage,
  onCancel,
  isCancelling,
}: BookingSeriesCardProps) {
  const label = CATEGORY_LABEL[series.category] ?? series.category ?? 'Care';

  const status = STATUS_STYLE[series.status?.toLowerCase()] ?? {
    dot: 'bg-blue-400',
    text: 'text-blue-700',
    bg: 'bg-blue-50',
    label: series.status,
  };

  // recurrence_pattern: JSON { days } / { dates } (new API) or legacy string.
  const recurrenceSummary = (() => {
    const p = series.recurrence_pattern as { days?: string[]; dates?: number[] } | null;
    if (p && typeof p === 'object') {
      if (Array.isArray(p.days) && p.days.length)
        return p.days.length === 7 ? 'Every day' : p.days.map((d) => d.slice(0, 3)).join(' · ');
      if (Array.isArray(p.dates) && p.dates.length) return `Monthly on ${p.dates.join(', ')}`;
    }
    return series.recurrence_type ?? 'Recurring';
  })();

  const nannyName = series.nanny?.profiles
    ? [series.nanny.profiles.first_name, series.nanny.profiles.last_name].filter(Boolean).join(' ')
    : null;
  const avatar = series.nanny?.profiles?.profile_image_url ?? null;
  const sessions = series.total_bookings ?? 0;
  const rate = series.hourly_rate != null ? Number(series.hourly_rate) : null;
  const total = series.estimated_total != null ? Number(series.estimated_total) : null;

  const formatDate = (d?: string | null) =>
    d
      ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      : '';

  return (
    <div
      onClick={onManage}
      className="group cursor-pointer rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Header: caregiver identity */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-50">
          {avatar ? (
            <Image src={avatar} alt={nannyName ?? 'Caregiver'} width={56} height={56} className="h-full w-full object-cover" />
          ) : (
            <User size={22} className="text-primary-400" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold text-primary-900 font-heading">
            {nannyName ?? 'Finding your caregiver'}
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
            <Repeat size={13} className="text-slate-400" />
            {label} · {recurrenceSummary}
          </p>
        </div>
        <span className={`hidden items-center gap-1.5 rounded-full px-3 py-1 sm:inline-flex ${status.bg}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          <span className={`text-[11px] font-bold uppercase tracking-wider ${status.text}`}>{status.label}</span>
        </span>
        <ChevronRight size={20} className="hidden flex-shrink-0 text-slate-300 transition-colors group-hover:text-primary-500 md:block" />
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-slate-100" />

      {/* Facts: sessions · time · price */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[15px] font-semibold text-primary-900">
            {sessions} session{sessions === 1 ? '' : 's'}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            {series.start_time_formatted ?? ''}
            {series.duration_hours ? ` · ${Number(series.duration_hours)} hr each` : ''}
            {series.next_upcoming_date ? ` · Next ${formatDate(series.next_upcoming_date)}` : ''}
          </p>
        </div>
        {rate != null && (
          <div className="text-right">
            <p className="text-[15px] font-semibold text-primary-900">
              {total != null && total > 0 ? `₹${total.toLocaleString('en-IN')}` : `₹${rate}/hr`}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {total != null && total > 0 ? `₹${rate}/hr flat` : 'flat rate'}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-5 flex items-center justify-end gap-2">
        {series.status?.toLowerCase() !== 'cancelled' && (
          <button
            type="button"
            disabled={isCancelling}
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="rounded-xl border border-red-100 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
          >
            Cancel series
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onManage();
          }}
          className="flex items-center gap-1.5 rounded-xl bg-primary-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
        >
          Manage
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
