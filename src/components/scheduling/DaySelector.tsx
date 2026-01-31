'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface DaySelectorProps {
  selectedDays: string[];
  onChange: (days: string[]) => void;
  disabled?: boolean;
}

const DAYS = [
  { code: 'MON', label: 'Mon' },
  { code: 'TUE', label: 'Tue' },
  { code: 'WED', label: 'Wed' },
  { code: 'THU', label: 'Thu' },
  { code: 'FRI', label: 'Fri' },
  { code: 'SAT', label: 'Sat' },
  { code: 'SUN', label: 'Sun' },
];

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDays,
  onChange,
  disabled = false,
}) => {
  const toggleDay = (dayCode: string) => {
    if (disabled) return;

    if (selectedDays.includes(dayCode)) {
      onChange(selectedDays.filter((d) => d !== dayCode));
    } else {
      // Maintain order: MON, TUE, WED, THU, FRI, SAT, SUN
      const newDays = [...selectedDays, dayCode].sort((a, b) => {
        const order = DAYS.map((d) => d.code);
        return order.indexOf(a) - order.indexOf(b);
      });
      onChange(newDays);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {DAYS.map((day) => {
        const isSelected = selectedDays.includes(day.code);
        return (
          <button
            key={day.code}
            type="button"
            onClick={() => toggleDay(day.code)}
            disabled={disabled}
            className={cn(
              'w-12 h-12 rounded-xl font-medium text-sm border-2 transition-all',
              isSelected
                ? 'bg-primary-900 text-white border-primary-900'
                : 'bg-white border-stone-200 text-stone-700 hover:border-primary-300 hover:bg-primary-50',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {day.label}
          </button>
        );
      })}
    </div>
  );
};

export const generateRecurrencePattern = (
  frequency: string,
  selectedDays: string[]
): string => {
  if (frequency === 'daily') return 'DAILY';
  if (frequency === 'weekly') {
    if (selectedDays.length === 0) return '';
    return `WEEKLY_${selectedDays.join('_')}`;
  }
  if (frequency === 'monthly') {
    if (selectedDays.length === 0) return '';
    return `MONTHLY_${selectedDays.join('_')}`;
  }
  return '';
};

export const parseRecurrencePattern = (
  pattern: string
): { frequency: string; days: string[] } => {
  if (pattern === 'DAILY') {
    return { frequency: 'daily', days: [] };
  }
  if (pattern.startsWith('WEEKLY_')) {
    const days = pattern.replace('WEEKLY_', '').split('_');
    return { frequency: 'weekly', days };
  }
  if (pattern.startsWith('MONTHLY_')) {
    const days = pattern.replace('MONTHLY_', '').split('_');
    return { frequency: 'monthly', days };
  }
  return { frequency: 'weekly', days: [] };
};

export const formatRecurrencePattern = (pattern: string): string => {
  if (pattern === 'DAILY') return 'Every day';

  if (pattern.startsWith('WEEKLY_')) {
    const days = pattern.replace('WEEKLY_', '').split('_');
    const dayLabels = days.map((d) => {
      const day = DAYS.find((day) => day.code === d);
      return day?.label || d;
    });
    if (dayLabels.length === 1) return `Every ${dayLabels[0]}`;
    if (dayLabels.length === 2) return `Every ${dayLabels.join(' & ')}`;
    return `Every ${dayLabels.slice(0, -1).join(', ')} & ${dayLabels[dayLabels.length - 1]}`;
  }

  if (pattern.startsWith('MONTHLY_')) {
    const days = pattern.replace('MONTHLY_', '').split('_');
    if (days.length === 1)
      return `${getOrdinal(parseInt(days[0]))} of every month`;
    return `${days.map((d) => getOrdinal(parseInt(d))).join(' & ')} of every month`;
  }

  return pattern;
};

const getOrdinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
