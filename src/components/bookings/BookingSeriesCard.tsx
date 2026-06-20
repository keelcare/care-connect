'use client';

import React from 'react';
import { RecurringServiceRequest } from '@/types/api';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  Clock,
  Repeat,
  CheckCircle2,
  XCircle,
  Activity,
  ArrowRight
} from 'lucide-react';

interface BookingSeriesCardProps {
  series: RecurringServiceRequest;
  onManage: () => void;
  onCancel: () => void;
  isCancelling: boolean;
}

export function BookingSeriesCard({
  series,
  onManage,
  onCancel,
  isCancelling
}: BookingSeriesCardProps) {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 size={12} />
            ACTIVE
          </span>
        );
      case 'paused':
      case 'cancelled':
        return (
          <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-600 text-[10px] font-bold uppercase tracking-wider border border-stone-300 flex items-center gap-1">
            <XCircle size={12} />
            {status.toUpperCase()}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200 flex items-center gap-1">
            <Activity size={12} />
            {status.toUpperCase()}
          </span>
        );
    }
  };

  // recurrence_pattern can be a JSON object { days: string[] } from the new API
  // or a legacy string like "WEEKLY_MON_TUE" from the old API.
  const getRecurrenceSummary = () => {
    const pattern = series.recurrence_pattern;
    if (!pattern) return series.recurrence_type ?? 'Recurring';

    // New API shape: { days: ["Mon", "Tue"] } or { dates: [1, 5, 10] }
    if (typeof pattern === 'object') {
      const p = pattern as any;
      if (Array.isArray(p.days) && p.days.length > 0) {
        return p.days.join(', ');
      }
      if (Array.isArray(p.dates) && p.dates.length > 0) {
        return `Dates: ${p.dates.join(', ')}`;
      }
      return series.recurrence_type ?? 'Recurring';
    }

    // Legacy string shape
    try {
      const { formatRecurrencePattern } = require('@/components/scheduling/DaySelector');
      return formatRecurrencePattern(pattern as string);
    } catch {
      return String(pattern);
    }
  };

  const recurrenceSummary = getRecurrenceSummary();

  return (
    <div
      onClick={onManage}
      className="bg-white p-6 rounded-2xl border border-primary-100 shadow-sm flex flex-col md:flex-row md:items-center gap-6 hover:shadow-md transition-all duration-300 cursor-pointer group hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-6 flex-1">
        <div className="flex-shrink-0 w-20 h-20 bg-primary-50 rounded-2xl flex flex-col items-center justify-center text-primary-700 shadow-inner group-hover:bg-primary-100 transition-colors">
          <Repeat size={28} strokeWidth={2.5} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className="text-xl font-bold text-primary-900 group-hover:text-primary-700 transition-colors font-heading">
              {series.category} Series
            </h3>
            {getStatusBadge(series.status)}
          </div>

          <p className="text-stone-600 text-sm font-medium mb-1.5">
            <span className="text-primary-700 font-semibold">{series.plan_type.replace('_', ' ')}</span> • {recurrenceSummary}
          </p>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1">
              <CalendarDays size={14} className="text-stone-400" />
              Starts {formatDate(series.start_date)} {series.end_date ? `– ${formatDate(series.end_date)}` : '• Ongoing'}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} className="text-stone-400" />
              {series.start_time_formatted} ({series.duration_hours} hr)
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto border-t md:border-t-0 border-stone-100 pt-4 md:pt-0">
        {series.status.toLowerCase() !== 'cancelled' && (
          <Button
            variant="outline"
            size="sm"
            disabled={isCancelling}
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
          >
            Cancel Series
          </Button>
        )}

        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onManage();
          }}
          className="rounded-xl bg-stone-100 hover:bg-primary-50 text-stone-700 hover:text-primary-700 shadow-none border border-stone-200 hover:border-primary-200 transition-colors"
        >
          Manage
          <ArrowRight size={16} className="ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
