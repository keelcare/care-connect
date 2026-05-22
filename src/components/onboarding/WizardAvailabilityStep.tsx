'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types/api';
import { Clock, CheckCircle2, ArrowRight, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WizardAvailabilityStepProps {
  user: User;
  onSave: () => void;
  onSkip: () => void;
}

const DAYS = [
  { id: 'MON', label: 'Mon' },
  { id: 'TUE', label: 'Tue' },
  { id: 'WED', label: 'Wed' },
  { id: 'THU', label: 'Thu' },
  { id: 'FRI', label: 'Fri' },
  { id: 'SAT', label: 'Sat' },
  { id: 'SUN', label: 'Sun' },
];

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', time: '6 AM – 12 PM', icon: '🌅' },
  { id: 'afternoon', label: 'Afternoon', time: '12 PM – 6 PM', icon: '☀️' },
  { id: 'evening', label: 'Evening', time: '6 PM – 10 PM', icon: '🌙' },
];

// Maps a slot id → time strings stored in the schedule
const SLOT_TIMES: Record<string, string[]> = {
  morning: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
  afternoon: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  evening: ['18:00', '19:00', '20:00', '21:00'],
};

export function WizardAvailabilityStep({
  user,
  onSave,
  onSkip,
}: WizardAvailabilityStepProps) {
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) => {
      const next = new Set(prev);
      if (next.has(slot)) next.delete(slot);
      else next.add(slot);
      return next;
    });
  };

  const handleSave = async () => {
    if (selectedDays.size === 0) {
      setError('Please select at least one day.');
      return;
    }
    if (selectedSlots.size === 0) {
      setError('Please select at least one time slot.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Build schedule: { MON: ['06:00','07:00',...], TUE: [...] }
      const times = Array.from(selectedSlots).flatMap(
        (slot) => SLOT_TIMES[slot]
      );
      const schedule: Record<string, string[]> = {};
      selectedDays.forEach((day) => {
        schedule[day] = times;
      });

      await api.users.update(user.id, { availabilitySchedule: schedule });
      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save availability. You can set it later from your dashboard.');
    } finally {
      setSaving(false);
    }
  };

  const hasSelections = selectedDays.size > 0 && selectedSlots.size > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Heading */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center flex-shrink-0">
          <Clock className="w-6 h-6 text-violet-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-stone-900">
            When are you available?
          </h3>
          <p className="text-stone-500 text-sm mt-0.5">
            Families will see this when browsing caregivers. You can update it
            anytime.
          </p>
        </div>
      </div>

      {/* Days */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
          Days of the week
        </p>
        <div className="flex gap-2 flex-wrap">
          {DAYS.map((day) => {
            const active = selectedDays.has(day.id);
            return (
              <button
                key={day.id}
                type="button"
                onClick={() => toggleDay(day.id)}
                className={`
                  relative px-4 py-2.5 rounded-xl border-2 font-semibold text-sm
                  transition-all duration-200 select-none
                  ${active
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200 scale-[1.04]'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-emerald-300 hover:bg-emerald-50'
                  }
                `}
              >
                {active && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
                )}
                {day.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
          Preferred hours
        </p>
        <div className="grid grid-cols-3 gap-3">
          {TIME_SLOTS.map((slot) => {
            const active = selectedSlots.has(slot.id);
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => toggleSlot(slot.id)}
                className={`
                  flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2
                  transition-all duration-200 select-none
                  ${active
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200 scale-[1.03]'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-emerald-300 hover:bg-emerald-50'
                  }
                `}
              >
                <span className="text-2xl">{slot.icon}</span>
                <span className="font-semibold text-sm">{slot.label}</span>
                <span
                  className={`text-xs ${active ? 'text-emerald-100' : 'text-stone-400'}`}
                >
                  {slot.time}
                </span>
                {active && (
                  <CheckCircle2 size={14} className="text-emerald-200 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview summary */}
      {hasSelections && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-emerald-800">
            <span className="font-semibold">
              {selectedDays.size} day{selectedDays.size !== 1 ? 's' : ''}
            </span>{' '}
            selected ·{' '}
            <span className="font-semibold">
              {selectedSlots.size} time slot{selectedSlots.size !== 1 ? 's' : ''}
            </span>{' '}
            selected
          </p>
        </div>
      )}

      {error && (
        <p className="mb-3 text-sm text-red-600 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 mt-auto border-t border-stone-100">
        <button
          type="button"
          onClick={onSkip}
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors font-medium"
        >
          <SkipForward size={14} />
          Set this later
        </button>
        <Button
          onClick={handleSave}
          isLoading={saving}
          disabled={!hasSelections || saving}
          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 shadow-sm shadow-emerald-200"
        >
          Save & Continue
          <ArrowRight size={16} className="ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
