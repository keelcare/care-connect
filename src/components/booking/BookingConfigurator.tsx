'use client';

/**
 * BookingConfigurator
 * ──────────────────
 * Unified booking form for Child Care, Shadow Teacher, and Special Needs services.
 * Renders inside <BookingSheet /> (bottom sheet on mobile, modal on desktop).
 *
 * Layout:
 *   Desktop  → two-column: form (left ~60%) + sticky summary sidebar (right ~40%)
 *   Mobile   → single column + sticky bottom confirm bar
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Info,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Plus,
  Check,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { SelectablePill } from '@/components/ui/SelectablePill';
import { SelectableCard } from '@/components/ui/SelectableCard';
import { ChildSelector } from '@/components/booking/ChildSelector';
import { ChildProfileModal } from '@/components/dashboard/ChildProfileModal';
import { ServiceInfoModal } from '@/components/booking/ServiceInfoModal';
import { LocationModal } from '@/components/features/LocationModal';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { api } from '@/lib/api';
import { Child, SubscriptionPlanType } from '@/types/api';
import { SUBSCRIPTION_PLANS } from '@/constants/booking';

/* ═══════════════════════════════════════════
   Types
═══════════════════════════════════════════ */

export type BookingServiceType = 'CHILD_CARE' | 'SHADOW_TEACHER' | 'SPECIAL_NEEDS';

interface BookingConfiguratorProps {
  serviceType: BookingServiceType;
  onClose: () => void;
}

type RecurrenceMode = 'none' | 'weekly' | 'specific_dates';

/* ═══════════════════════════════════════════
   Constants
═══════════════════════════════════════════ */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TIME_SLOTS = {
  Morning: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
  Afternoon: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  Evening: ['18:00', '19:00', '20:00', '21:00'],
};

const DURATION_OPTIONS = [
  { value: '2', label: '2 hr' },
  { value: '4', label: '4 hr' },
  { value: '6', label: '6 hr' },
  { value: '8', label: '8 hr' },
  { value: '12', label: '12 hr' },
];

const DURATION_OPTIONS_ST = [
  { value: '1', label: '1 hr' },
  { value: '2', label: '2 hr' },
  { value: '3', label: '3 hr' },
  { value: '4', label: '4 hr' },
  { value: '6', label: '6 hr' },
  { value: '8', label: '8 hr' },
];

/* ═══════════════════════════════════════════
   Service Config Map
═══════════════════════════════════════════ */

const SERVICE_META: Record<
  BookingServiceType,
  {
    label: string;
    category: string;
    storageKey: string;
    requiredSkills: string[];
    showChildSelector: boolean;
    showStudentCount: boolean;
    showRecurrence: boolean;
    infoCategory: string;
    emoji: string;
  }
> = {
  CHILD_CARE: {
    label: 'Child Care',
    category: 'CC',
    storageKey: 'careconnect_childcare_form_v2',
    requiredSkills: [],
    showChildSelector: true,
    showStudentCount: false,
    showRecurrence: true,
    infoCategory: 'Child Care',
    emoji: '👶',
  },
  SHADOW_TEACHER: {
    label: 'Shadow Teacher',
    category: 'ST',
    storageKey: 'careconnect_shadowteacher_form_v2',
    requiredSkills: ['shadow_teacher', 'special_education'],
    showChildSelector: false,
    showStudentCount: true,
    showRecurrence: false,
    infoCategory: 'Shadow Teacher',
    emoji: '🎓',
  },
  SPECIAL_NEEDS: {
    label: 'Special Needs Care',
    category: 'SN',
    storageKey: 'careconnect_specialneeds_form_v2',
    requiredSkills: ['special_needs_care', 'compassionate_care'],
    showChildSelector: true,
    showStudentCount: false,
    showRecurrence: false,
    infoCategory: 'Special Needs',
    emoji: '💝',
  },
};

/* ═══════════════════════════════════════════
   Helpers
═══════════════════════════════════════════ */

function getDaysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}
function getFirstDay(y: number, m: number) {
  return new Date(y, m, 1).getDay();
}
function formatDate(d: Date) {
  return d.toISOString().split('T')[0];
}
function fmtTime(h24: string): string {
  const [h, m] = h24.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}
function addHours(h24: string, hrs: number): string {
  const [h, m] = h24.split(':').map(Number);
  const total = h * 60 + m + hrs * 60;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  const period = nh < 12 ? 'AM' : 'PM';
  const h12 = nh % 12 === 0 ? 12 : nh % 12;
  const suffix = Math.floor(total / 60) >= 24 ? ' +1d' : '';
  return `${h12}:${String(nm).padStart(2, '0')} ${period}${suffix}`;
}

/* ═══════════════════════════════════════════
   Section Label
═══════════════════════════════════════════ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="h-px bg-[hsl(var(--border))]" />;
}

/* ═══════════════════════════════════════════
   Main Component
═══════════════════════════════════════════ */

export default function BookingConfigurator({
  serviceType,
  onClose,
}: BookingConfiguratorProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();
  const meta = SERVICE_META[serviceType];

  /* ── Aux modal state ── */
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  /* ── Loading ── */
  const [loading, setLoading] = useState(false);
  const [hourlyRate, setHourlyRate] = useState<number | null>(null);
  const [missingLocation, setMissingLocation] = useState(false);

  /* ── Family ── */
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);

  /* ── Plan ── */
  const [planType, setPlanType] = useState('ONE_TIME');
  const [useInstallments, setUseInstallments] = useState(false);

  /* ── Recurrence (Child Care only) ── */
  const [recurrenceMode, setRecurrenceMode] = useState<RecurrenceMode>('none');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<number[]>([]);

  /* ── Calendar ── */
  const today = useMemo(() => new Date(), []);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  /* ── Time & Duration ── */
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');

  /* ── Special fields ── */
  const [numStudents, setNumStudents] = useState('1');
  const [numPeople, setNumPeople] = useState('1');
  const [specialNotes, setSpecialNotes] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [mobilityAssistance, setMobilityAssistance] = useState(false);

  /* ── Persistence ── */
  useEffect(() => {
    const saved = localStorage.getItem(meta.storageKey);
    if (!saved) return;
    try {
      const p = JSON.parse(saved);
      if (p.planType) setPlanType(p.planType);
      if (p.selectedChildIds) setSelectedChildIds(p.selectedChildIds);
      if (p.selectedDate) setSelectedDate(p.selectedDate);
      if (p.calYear) setCalYear(p.calYear);
      if (p.calMonth) setCalMonth(p.calMonth);
      if (p.startTime) setStartTime(p.startTime);
      if (p.duration) setDuration(p.duration);
      if (p.numStudents) setNumStudents(p.numStudents);
      if (p.specialNotes) setSpecialNotes(p.specialNotes);
    } catch {}
  }, [meta.storageKey]);

  useEffect(() => {
    localStorage.setItem(
      meta.storageKey,
      JSON.stringify({
        planType, selectedChildIds, selectedDate, calYear, calMonth,
        startTime, duration, numStudents, specialNotes,
      })
    );
  }, [meta.storageKey, planType, selectedChildIds, selectedDate, calYear, calMonth, startTime, duration, numStudents, specialNotes]);

  /* ── Data fetching ── */
  useEffect(() => {
    if (user?.profiles) {
      setMissingLocation(!user.profiles.lat || !user.profiles.lng);
    }
  }, [user]);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const data = await api.family.list();
        setChildren(data);
      } catch {}
    };
    if (meta.showChildSelector) fetchChildren();
  }, [meta.showChildSelector]);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const services = await api.services.list();
        const match = services.find((s) =>
          s.name === meta.category ||
          s.name === meta.label
        );
        if (match) setHourlyRate(Number(match.hourly_rate));
      } catch {}
    };
    fetchRate();
  }, [meta.category, meta.label]);

  /* ── Available time slots ── */
  const availableSlots = useMemo((): Record<string, string[]> => {
    const dateStr = selectedDate
      ? `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
      : null;
    const todayStr = formatDate(today);
    const isToday = dateStr === todayStr;

    const filtered: Record<string, string[]> = {};
    for (const [group, slots] of Object.entries(TIME_SLOTS)) {
      const available = isToday
        ? slots.filter((t) => {
            const [h, m] = t.split(':').map(Number);
            const cutoff = new Date(today.getTime() + 30 * 60000);
            return h * 60 + m > cutoff.getHours() * 60 + cutoff.getMinutes();
          })
        : slots;
      if (available.length) filtered[group] = available;
    }
    return filtered;
  }, [selectedDate, calYear, calMonth, today]);

  /* ── Pricing calc ── */
  const pricing = useMemo(() => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planType);
    if (!plan || !duration || !hourlyRate) return null;

    const hrs = Number(duration);
    const session = hourlyRate * hrs;
    const discAmt = (session * plan.discount) / 100;
    const sessionNet = session - discAmt;
    const monthly = plan.id !== 'ONE_TIME' ? sessionNet * 4 : 0;
    const total = plan.id !== 'ONE_TIME' ? monthly * (plan.duration || 1) : sessionNet;

    return { session, discount: plan.discount, discAmt, sessionNet, monthly, total };
  }, [planType, duration, hourlyRate]);

  /* ── Calendar helpers ── */
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDay(calYear, calMonth);
  const calCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
    setSelectedDate(null);
  };

  const handleDayClick = (day: number) => {
    const dateObj = new Date(calYear, calMonth, day);
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    if (dateObj < todayStart) return;
    if (recurrenceMode === 'specific_dates') {
      setSelectedDates((prev) =>
        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
      );
    } else {
      setSelectedDate(day);
    }
  };

  /* ── Child handlers ── */
  const handleChildSelect = (ids: string[]) => {
    setSelectedChildIds(ids);
    if (ids.length > 0) setNumPeople(String(ids.length));
  };
  const handleChildSave = async (childData: Partial<Child>) => {
    try {
      const created = await api.family.create(childData);
      setChildren((prev) => [...prev, created]);
      setSelectedChildIds((prev) => [...prev, created.id]);
      setIsAddChildOpen(false);
      addToast({ message: 'Profile added!', type: 'success' });
    } catch {
      addToast({ message: 'Failed to add profile', type: 'error' });
    }
  };

  /* ── Form validation ── */
  const needsDate =
    recurrenceMode === 'none' || recurrenceMode === 'specific_dates';
  const isValid = useMemo(() => {
    if (missingLocation) return false;
    if (!startTime || !duration) return false;
    if (recurrenceMode === 'none' && !selectedDate) return false;
    if (recurrenceMode === 'weekly' && selectedDays.length === 0) return false;
    if (recurrenceMode === 'specific_dates' && selectedDates.length === 0) return false;
    if (meta.showChildSelector && children.length > 0 && selectedChildIds.length === 0) return false;
    return true;
  }, [
    missingLocation, startTime, duration, recurrenceMode, selectedDate,
    selectedDays, selectedDates, meta.showChildSelector, children, selectedChildIds,
  ]);

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!isValid) {
      if (missingLocation) {
        addToast({ message: 'Set your location first', type: 'error' });
        setIsLocationOpen(true);
        return;
      }
      addToast({ message: 'Please fill in all required fields', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planType);
      const numChildren =
        meta.showChildSelector && selectedChildIds.length > 0
          ? selectedChildIds.length
          : Math.max(1, Number(numPeople) || 1);

      const isRecurring = planType !== 'ONE_TIME' && recurrenceMode !== 'none' && meta.showRecurrence;

      if (isRecurring) {
        const startDateStr = selectedDate
          ? `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
          : formatDate(today);
        await api.recurringRequests.create({
          recurrence_type: recurrenceMode as 'weekly' | 'specific_dates',
          recurrence_pattern:
            recurrenceMode === 'weekly'
              ? { days: selectedDays }
              : { dates: selectedDates },
          start_date: startDateStr,
          start_time: startTime,
          duration_hours: Number(duration),
          num_children: numChildren,
          child_ids: selectedChildIds,
          children_ages: [],
          category: meta.category,
          plan_type: planType,
          plan_duration_months: plan?.duration || 1,
          special_requirements: specialNotes,
          required_skills: meta.requiredSkills,
        } as any);
        addToast({ message: `Recurring ${meta.label} request submitted!`, type: 'success' });
      } else {
        const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(selectedDate!).padStart(2, '0')}`;
        await api.requests.create({
          category: meta.category,
          date: dateStr,
          start_time: startTime,
          duration_hours: Number(duration),
          num_children: numChildren,
          child_ids: meta.showChildSelector ? selectedChildIds : [],
          children_ages: [],
          required_skills: meta.requiredSkills,
          special_requirements: [
            medicalConditions ? `Medical: ${medicalConditions}` : '',
            mobilityAssistance ? 'Mobility assistance required' : '',
            specialNotes,
          ].filter(Boolean).join('. '),
          plan_type: planType as SubscriptionPlanType,
          plan_duration_months: plan?.duration || 1,
          discount_percentage: plan?.discount || 0,
          use_installments: useInstallments,
        } as any);
        addToast({ message: `${meta.label} request submitted! Finding your match...`, type: 'success' });
      }

      localStorage.removeItem(meta.storageKey);
      router.push('/bookings');
      onClose();
    } catch {
      addToast({ message: 'Failed to submit request. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  /* ── Formatted date label ── */
  const formattedDate = selectedDate
    ? `${MONTH_NAMES[calMonth].slice(0, 3)} ${selectedDate}, ${calYear}`
    : '—';

  const selectedPlanLabel = SUBSCRIPTION_PLANS.find((p) => p.id === planType)?.label ?? 'One-Time';
  const showInstallments =
    planType !== 'ONE_TIME' &&
    (SUBSCRIPTION_PLANS.find((p) => p.id === planType)?.duration ?? 0) > 1;

  /* ══════════════════════════════════════════
     SERVICE SUMMARY
  ══════════════════════════════════════════ */
  const ServiceSummary = ({ compact = false }: { compact?: boolean }) => (
    <div className={compact ? 'p-4' : 'p-5 space-y-4'}>
      {/* Service + child */}
      <div className="flex items-center gap-3 pb-4 border-b border-[hsl(var(--border))]">
        <div className="w-10 h-10 rounded-xl bg-[hsl(var(--primary-50))] flex items-center justify-center text-xl shrink-0">
          {meta.emoji}
        </div>
        <div>
          <p className="font-semibold text-sm text-[hsl(var(--foreground))] font-heading">{meta.label}</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            {selectedChildIds.length > 0
              ? `For ${selectedChildIds
                  .map((id) => children.find((c) => c.id === id)?.first_name)
                  .filter(Boolean)
                  .join(', ')}`
              : serviceType === 'SHADOW_TEACHER'
              ? `${numStudents} student${Number(numStudents) > 1 ? 's' : ''}`
              : 'Select profiles below'}
          </p>
        </div>
      </div>

      {/* Key-value list */}
      <div className="space-y-2.5">
        {[
          { label: 'Plan', value: selectedPlanLabel },
          { label: 'Date', value: formattedDate },
          {
            label: 'Time',
            value: startTime
              ? `${fmtTime(startTime)}${duration ? ` → ${addHours(startTime, Number(duration))}` : ''}`
              : '—',
          },
          { label: 'Duration', value: duration ? `${duration} hr` : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-baseline gap-2">
            <span className="text-xs text-[hsl(var(--muted-foreground))] shrink-0">{label}</span>
            <span className="text-xs font-medium text-[hsl(var(--foreground))] text-right">{value}</span>
          </div>
        ))}
      </div>

      {/* Cost breakdown */}
      {pricing && (
        <div className="pt-3 border-t border-[hsl(var(--border))] space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[hsl(var(--muted-foreground))]">Session cost</span>
            <span className="font-medium">₹{pricing.session.toLocaleString()}</span>
          </div>
          {pricing.discount > 0 && (
            <div className="flex justify-between text-xs text-emerald-600 font-medium">
              <span className="flex items-center gap-1">
                Discount
                <span className="text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded-full font-bold">
                  -{pricing.discount}%
                </span>
              </span>
              <span>−₹{pricing.discAmt.toLocaleString()}</span>
            </div>
          )}
          {planType !== 'ONE_TIME' && pricing.monthly > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-[hsl(var(--muted-foreground))]">
                {useInstallments ? 'First installment' : 'Monthly cost'}
              </span>
              <span className="font-medium">₹{pricing.monthly.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-2 border-t border-[hsl(var(--border))]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              {useInstallments ? 'Total commitment' : 'Estimated total'}
            </span>
            <span className="text-xl font-bold text-[hsl(var(--primary))]">
              ₹{pricing.total.toLocaleString()}
            </span>
          </div>
          {hourlyRate && (
            <p className="text-right text-[10px] text-[hsl(var(--muted-foreground))]">
              Based on ₹{hourlyRate}/hr
            </p>
          )}
        </div>
      )}

      {!pricing && (
        <p className="text-center text-xs text-[hsl(var(--muted-foreground))] py-2">
          Select plan + duration to see pricing
        </p>
      )}
    </div>
  );

  /* ══════════════════════════════════════════
     CONFIRM BUTTON (shared)
  ══════════════════════════════════════════ */
  const ConfirmButton = ({ fullWidth = true }: { fullWidth?: boolean }) => (
    <button
      type="button"
      onClick={handleSubmit}
      disabled={loading}
      className={[
        'flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-xl)] transition-all duration-200',
        'bg-[hsl(var(--primary))] text-white',
        'hover:brightness-110 active:scale-[0.98]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'shadow-[0_4px_16px_hsl(var(--primary)/0.3)]',
        'py-3.5 px-6 text-sm',
        fullWidth ? 'w-full' : '',
      ].join(' ')}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Submitting...
        </span>
      ) : missingLocation ? (
        'Set Location to Book'
      ) : (
        <>
          Confirm Booking
          <ArrowRight size={16} />
        </>
      )}
    </button>
  );

  /* ══════════════════════════════════════════
     FORM BODY
  ══════════════════════════════════════════ */
  const FormBody = () => (
    <div className="space-y-7 p-5 pb-8">

      {/* ── Missing location banner ── */}
      {missingLocation && (
        <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertCircle size={18} className="text-amber-500 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800">Location required</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Set your address so we can match caregivers near you.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsLocationOpen(true)}
            className="text-xs font-bold text-amber-900 underline underline-offset-2 shrink-0"
          >
            Set Now
          </button>
        </div>
      )}

      {/* ── 1. PLAN SELECTION ── */}
      <section>
        <SectionLabel>Choose your plan</SectionLabel>
        {/* Mobile: horizontal scroll row. Desktop (handled by grid breakpoint) */}
        <div className="flex md:grid md:grid-cols-2 gap-3 overflow-x-auto pb-1 md:overflow-visible md:pb-0 snap-x snap-mandatory md:snap-none">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div key={plan.id} className="snap-start shrink-0 w-40 md:w-auto">
              <SelectableCard
                id={`plan-${plan.id}`}
                label={plan.label}
                description={plan.description}
                discount={plan.discount}
                popular={plan.popular}
                selected={planType === plan.id}
                onClick={() => {
                  setPlanType(plan.id);
                  if (plan.duration <= 1) setUseInstallments(false);
                  if (plan.id === 'ONE_TIME') setRecurrenceMode('none');
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── 2. PAYMENT OPTION ── */}
      <AnimatePresence>
        {showInstallments && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <SectionLabel>Payment option</SectionLabel>
            <div className="flex gap-3">
              {[
                { id: false, label: 'Pay in Full', sub: 'One upfront payment' },
                { id: true, label: 'Monthly', sub: 'Pay month by month' },
              ].map((opt) => (
                <button
                  key={String(opt.id)}
                  type="button"
                  onClick={() => setUseInstallments(opt.id)}
                  className={[
                    'flex-1 p-3.5 rounded-xl border text-left transition-all duration-150',
                    useInstallments === opt.id
                      ? 'bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-white'
                      : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] bg-white',
                  ].join(' ')}
                >
                  <p className={`font-semibold text-sm ${useInstallments === opt.id ? 'text-white' : 'text-[hsl(var(--foreground))]'}`}>
                    {opt.label}
                  </p>
                  <p className={`text-[11px] mt-0.5 ${useInstallments === opt.id ? 'text-white/75' : 'text-[hsl(var(--muted-foreground))]'}`}>
                    {opt.sub}
                  </p>
                </button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <Divider />

      {/* ── 3. RECURRENCE PATTERN (Child Care subscriptions only) ── */}
      {meta.showRecurrence && planType !== 'ONE_TIME' && (
        <section>
          <SectionLabel>Recurrence pattern</SectionLabel>
          <div className="flex gap-2 p-1 bg-[hsl(var(--muted))] rounded-xl w-full">
            {(['none', 'weekly', 'specific_dates'] as RecurrenceMode[]).map((mode) => {
              const labels: Record<RecurrenceMode, string> = {
                none: 'Flexible',
                weekly: 'Weekly',
                specific_dates: 'Specific Dates',
              };
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setRecurrenceMode(mode)}
                  className={[
                    'flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-150 text-center',
                    recurrenceMode === mode
                      ? 'bg-white text-[hsl(var(--primary))] shadow-sm'
                      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
                  ].join(' ')}
                >
                  {labels[mode]}
                </button>
              );
            })}
          </div>

          {/* Day selector */}
          <AnimatePresence>
            {recurrenceMode === 'weekly' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-3 flex gap-1.5 flex-wrap"
              >
                {WEEK_DAYS.map((day) => (
                  <SelectablePill
                    key={day}
                    label={day.slice(0, 2)}
                    size="sm"
                    selected={selectedDays.includes(day)}
                    onClick={() =>
                      setSelectedDays((prev) =>
                        prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
                      )
                    }
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {recurrenceMode === 'specific_dates' && (
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
              Select multiple dates from the calendar below.
            </p>
          )}
        </section>
      )}

      {/* ── 4. CALENDAR ── */}
      {(recurrenceMode !== 'weekly') && (
        <section>
          <SectionLabel>
            {recurrenceMode === 'specific_dates' ? 'Select dates' : 'Select start date'}
          </SectionLabel>
          <div className="rounded-2xl border border-[hsl(var(--border))] overflow-hidden">
            {/* Month nav */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))]">
              <span className="font-semibold text-sm text-[hsl(var(--foreground))] font-heading">
                {MONTH_NAMES[calMonth]} {calYear}
              </span>
              <div className="flex gap-1">
                {[{ fn: prevMonth, label: '‹' }, { fn: nextMonth, label: '›' }].map(
                  ({ fn, label }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={fn}
                      className="w-7 h-7 rounded-lg hover:bg-[hsl(var(--muted))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] text-base transition-colors"
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 px-2 pt-2">
              {DAY_LABELS.map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] font-bold text-[hsl(var(--muted-foreground))] py-1"
                >
                  {d.slice(0, 1)}
                </div>
              ))}
            </div>

            {/* Date cells */}
            <div className="grid grid-cols-7 gap-y-1 px-2 pb-3">
              {calCells.map((day, idx) => {
                if (!day) return <div key={`e${idx}`} />;
                const dateObj = new Date(calYear, calMonth, day);
                const todayStart = new Date();
                todayStart.setHours(0, 0, 0, 0);
                const isPast = dateObj < todayStart;
                const isToday =
                  dateObj.toDateString() === today.toDateString();
                const isSel =
                  recurrenceMode === 'specific_dates'
                    ? selectedDates.includes(day)
                    : day === selectedDate;

                return (
                  <div key={day} className="flex justify-center">
                    <button
                      type="button"
                      disabled={isPast}
                      onClick={() => handleDayClick(day)}
                      className={[
                        'w-8 h-8 rounded-full text-xs font-medium transition-all duration-150 flex items-center justify-center relative',
                        isPast
                          ? 'text-[hsl(var(--muted-foreground))]/30 cursor-not-allowed'
                          : isSel
                          ? 'bg-[hsl(var(--primary))] text-white shadow-sm'
                          : isToday
                          ? 'text-[hsl(var(--primary))] font-bold ring-1 ring-[hsl(var(--primary))]'
                          : 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]',
                      ].join(' ')}
                    >
                      {day}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Divider />

      {/* ── 5. START TIME ── */}
      <section>
        <SectionLabel>Start time</SectionLabel>
        <div className="space-y-3">
          {Object.entries(availableSlots).map(([group, slots]) => (
            <div key={group}>
              <p className="text-[10px] font-medium text-[hsl(var(--muted-foreground))] mb-1.5 ml-0.5">
                {group}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {slots.map((t) => (
                  <SelectablePill
                    key={t}
                    label={fmtTime(t)}
                    size="sm"
                    selected={startTime === t}
                    onClick={() => setStartTime(t)}
                  />
                ))}
              </div>
            </div>
          ))}
          {Object.keys(availableSlots).length === 0 && (
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Select a date to see available slots.
            </p>
          )}
        </div>
      </section>

      {/* ── 6. DURATION ── */}
      <section>
        <SectionLabel>Duration</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {(serviceType === 'SHADOW_TEACHER' ? DURATION_OPTIONS_ST : DURATION_OPTIONS).map(
            (opt) => (
              <SelectablePill
                key={opt.value}
                label={opt.label}
                selected={duration === opt.value}
                onClick={() => setDuration(opt.value)}
              />
            )
          )}
        </div>
      </section>

      <Divider />

      {/* ── 7. WHO IS THIS FOR ── */}
      {meta.showChildSelector && (
        <section>
          <SectionLabel>Who is this booking for?</SectionLabel>
          {children.length === 0 && (
            <div className="mb-3 flex gap-2 flex-wrap">
              {['1', '2', '3'].map((n) => (
                <SelectablePill
                  key={n}
                  label={`${n} child${Number(n) > 1 ? 'ren' : ''}`}
                  selected={numPeople === n}
                  onClick={() => setNumPeople(n)}
                />
              ))}
            </div>
          )}
          <ChildSelector
            childrenMap={children}
            selectedIds={selectedChildIds}
            onChange={handleChildSelect}
            onAddNew={() => setIsAddChildOpen(true)}
          />
          {children.length > 0 && selectedChildIds.length === 0 && (
            <p className="text-xs text-amber-600 mt-1.5 font-medium">
              Please select at least one profile to continue.
            </p>
          )}
        </section>
      )}

      {meta.showStudentCount && (
        <section>
          <SectionLabel>Number of students</SectionLabel>
          <div className="flex gap-2 flex-wrap">
            {['1', '2', '3', '4', '5+'].map((n) => (
              <SelectablePill
                key={n}
                label={n}
                selected={numStudents === n}
                onClick={() => setNumStudents(n)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── 8. SPECIAL NEEDS EXTRAS ── */}
      {serviceType === 'SPECIAL_NEEDS' && (
        <section className="space-y-4">
          <div>
            <SectionLabel>Specific needs / conditions</SectionLabel>
            <textarea
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
              placeholder="Diagnosis, routines, triggers, or anything important..."
              className="w-full h-20 px-3.5 py-2.5 text-sm rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))/0.3] focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] focus:outline-none resize-none placeholder:text-[hsl(var(--muted-foreground))]"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer p-3.5 rounded-xl border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))/0.3] transition-colors">
            <input
              type="checkbox"
              checked={mobilityAssistance}
              onChange={(e) => setMobilityAssistance(e.target.checked)}
              className="w-4 h-4 rounded border-2 border-[hsl(var(--border))] accent-[hsl(var(--primary))]"
            />
            <span className="text-sm text-[hsl(var(--foreground))] font-medium">Mobility assistance required</span>
          </label>
        </section>
      )}

      {/* ── 9. ADDITIONAL NOTES ── */}
      <section>
        <SectionLabel>Additional notes</SectionLabel>
        <textarea
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          placeholder={
            serviceType === 'SHADOW_TEACHER'
              ? 'Learning goals, curriculum details, special support needed...'
              : 'Allergies, preferences, routines, special instructions...'
          }
          className="w-full h-20 px-3.5 py-2.5 text-sm rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))/0.3] focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] focus:outline-none resize-none placeholder:text-[hsl(var(--muted-foreground))]"
        />
      </section>

      {/* ── Mobile: inline confirm ── */}
      <div className="lg:hidden">
        <ConfirmButton />
      </div>
    </div>
  );

  /* ══════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════ */
  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[hsl(var(--border))] shrink-0 bg-white">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-bold text-[hsl(var(--foreground))] font-heading">
            Book {meta.label}
          </h2>
          <button
            type="button"
            onClick={() => setIsInfoOpen(true)}
            className="w-6 h-6 rounded-full bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border))] flex items-center justify-center transition-colors"
            aria-label="What's included"
          >
            <Info size={13} className="text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex flex-1 overflow-hidden min-h-0">

        {/* LEFT: form */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <FormBody />
        </div>

        {/* RIGHT: sticky summary (desktop only) */}
        <div className="hidden lg:flex w-[340px] shrink-0 border-l border-[hsl(var(--border))] flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <ServiceSummary />
          </div>
          {/* Sticky confirm on desktop */}
          <div className="p-5 border-t border-[hsl(var(--border))] bg-white shrink-0">
            <ConfirmButton />
            {!isValid && !loading && (
              <p className="text-[11px] text-[hsl(var(--muted-foreground))] text-center mt-2">
                Complete all required fields above
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ── */}
      <div className="lg:hidden border-t border-[hsl(var(--border))] bg-white shrink-0 safe-bottom">
        {/* Summary expand/collapse */}
        <AnimatePresence>
          {summaryExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-[hsl(var(--border))] max-h-[50vh] overflow-y-auto"
            >
              <ServiceSummary compact />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom bar */}
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setSummaryExpanded((v) => !v)}
            className="flex-1 flex items-center justify-between min-w-0"
            aria-expanded={summaryExpanded}
          >
            <div className="text-left min-w-0">
              <p className="text-sm font-bold text-[hsl(var(--foreground))] truncate">
                {pricing
                  ? `₹${pricing.total.toLocaleString()}${planType !== 'ONE_TIME' ? '/plan' : ''}`
                  : 'See pricing'}
              </p>
              <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
                {summaryExpanded ? 'Hide details' : 'View details'}
              </p>
            </div>
            {summaryExpanded ? (
              <ChevronDown size={16} className="text-[hsl(var(--muted-foreground))] shrink-0" />
            ) : (
              <ChevronUp size={16} className="text-[hsl(var(--muted-foreground))] shrink-0" />
            )}
          </button>
          <div className="shrink-0 w-44">
            <ConfirmButton />
          </div>
        </div>
      </div>

      {/* ── Aux Modals ── */}
      <ServiceInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        category={meta.infoCategory}
      />
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />
      {meta.showChildSelector && (
        <ChildProfileModal
          isOpen={isAddChildOpen}
          onClose={() => setIsAddChildOpen(false)}
          onSave={handleChildSave}
          initialData={
            serviceType === 'SPECIAL_NEEDS'
              ? { profile_type: 'SPECIAL_NEEDS' }
              : undefined
          }
        />
      )}
    </div>
  );
}
