'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import { Button } from '@/components/ui/button';
import { AvailabilityBlock } from '@/types/api';
import {
  DaySelector,
  generateRecurrencePattern,
  formatRecurrencePattern,
} from '@/components/scheduling/DaySelector';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  X,
  CalendarOff,
  Repeat,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  CalendarDays,
  TrendingUp,
  Settings,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

/* ── constants ───────────────────────────────────────────────────── */

const TIME_SLOTS = ['06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];

const BLOCK_TYPES = [
  { id: 'oneTime',   label: 'One-Time Block',   description: 'Block a specific date or date range', icon: CalendarOff, activeColor: 'bg-primary-900 text-white border-primary-900', color: 'bg-primary-50 text-primary-900 border-primary-200' },
  { id: 'recurring', label: 'Recurring Block',   description: 'Block same time every week',          icon: Repeat,      activeColor: 'bg-primary-800 text-white border-primary-800', color: 'bg-slate-50 text-slate-700 border-slate-200' },
];

/* ── demand forecast data (static display) ───────────────────────── */

const DEMAND_SLOTS = [
  { label: 'Friday Evenings',   pct: 85, color: 'text-amber-600' },
  { label: 'Saturday Mornings', pct: 72, color: 'text-primary-600' },
  { label: 'Sunday Afternoons', pct: 60, color: 'text-indigo-600' },
];

/* ── mini calendar ───────────────────────────────────────────────── */

function MiniCalendar({ blocks }: { blocks: AvailabilityBlock[] }) {
  const [month, setMonth] = useState(new Date());

  const year = month.getFullYear();
  const mo = month.getMonth();
  const firstDay = new Date(year, mo, 1).getDay();
  const daysInMonth = new Date(year, mo + 1, 0).getDate();

  const today = new Date();
  const isToday = (d: number) => today.getFullYear() === year && today.getMonth() === mo && today.getDate() === d;

  // determine which days have blocks
  const blockedDays = new Set<number>();
  blocks.forEach((b) => {
    const start = new Date(b.start_time);
    const end   = new Date(b.end_time);
    if (start.getFullYear() === year && start.getMonth() === mo) blockedDays.add(start.getDate());
    // multi-day
    if (end.getFullYear() === year && end.getMonth() === mo && end.getDate() !== start.getDate()) blockedDays.add(end.getDate());
  });

  const prevMonth = () => setMonth(new Date(year, mo - 1, 1));
  const nextMonth = () => setMonth(new Date(year, mo + 1, 1));

  const cells = Array.from({ length: firstDay }, () => null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  return (
    <div>
      {/* Nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
          <ChevronLeft size={16} className="text-slate-500" />
        </button>
        <p className="font-bold text-primary-900 text-sm">
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
        <button onClick={nextMonth} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
          <ChevronRight size={16} className="text-slate-500" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-400 py-1">{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const blocked = blockedDays.has(day);
          const tod = isToday(day);
          return (
            <div key={day} className="flex items-center justify-center">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
                tod ? 'bg-primary-900 text-white' :
                blocked ? 'bg-red-100 text-red-600' :
                'text-slate-600 hover:bg-slate-100'
              }`}>
                {day}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-50">
        <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-900" /> Today
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full bg-red-200" /> Blocked
        </span>
      </div>
    </div>
  );
}

/* ── main page ───────────────────────────────────────────────────── */

export default function AvailabilityPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [autoAccept, setAutoAccept] = useState(true);

  const [formData, setFormData] = useState({
    blockType: '', startDate: '', endDate: '',
    startTime: '', endTime: '', selectedDays: [] as string[], reason: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const getNextDays = () => Array.from({ length: 30 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });
  const availableDates = getNextDays();
  const formatDateStr = (d: Date) => d.toISOString().split('T')[0];
  const isToday = (d: Date) => d.toDateString() === new Date().toDateString();

  useEffect(() => { fetchBlocks(); }, []);

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      setBlocks(await api.availability.list());
    } catch { addToast({ message: 'Failed to load availability', type: 'error' }); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate) { addToast({ message: 'Please select a start date', type: 'error' }); return; }
    if (!formData.startTime || !formData.endTime) { addToast({ message: 'Please select start and end times', type: 'error' }); return; }
    if (formData.blockType === 'recurring' && !formData.selectedDays.length) {
      addToast({ message: 'Please select at least one day for recurring block', type: 'error' }); return;
    }
    setSubmitting(true);
    try {
      const startDateTime = `${formData.startDate}T${formData.startTime}:00+05:30`;
      const endDateTime = formData.endDate
        ? `${formData.endDate}T${formData.endTime}:00+05:30`
        : `${formData.startDate}T${formData.endTime}:00+05:30`;
      const isRecurring = formData.blockType === 'recurring';
      await api.availability.create({
        startTime: startDateTime, endTime: endDateTime, isRecurring,
        recurrencePattern: isRecurring ? generateRecurrencePattern('weekly', formData.selectedDays) : undefined,
        reason: formData.reason || undefined,
      });
      addToast({ message: 'Availability block created', type: 'success' });
      closeModal(); fetchBlocks();
    } catch { addToast({ message: 'Failed to create block', type: 'error' }); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await api.availability.delete(id);
      addToast({ message: 'Block removed', type: 'success' });
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    } catch { addToast({ message: 'Failed to remove block', type: 'error' }); }
    finally { setDeleting(null); }
  };

  const resetForm = () => { setFormData({ blockType:'',startDate:'',endDate:'',startTime:'',endTime:'',selectedDays:[],reason:'' }); setCurrentStep(1); };
  const closeModal = () => { setShowModal(false); resetForm(); };
  const openModal = () => { resetForm(); setShowModal(true); };

  const formatBlockDisplay = (b: AvailabilityBlock) => {
    const s = new Date(b.start_time);
    const e = new Date(b.end_time);
    return {
      date: s.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'Asia/Kolkata' }),
      time: `${s.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })} – ${e.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })}`,
    };
  };

  const canProceedToStep2 = !!formData.blockType;
  const canProceedToStep3 = formData.blockType === 'recurring' ? formData.selectedDays.length > 0 && !!formData.startDate : !!formData.startDate;
  const canSubmit = !!formData.startTime && !!formData.endTime;

  const getStepLabels = () => formData.blockType === 'recurring' ? ['Block Type','Days & Start','Time & Details'] : ['Block Type','Select Date','Time & Details'];

  const DatePicker = ({ field }: { field: 'startDate' | 'endDate' }) => (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
      {availableDates.map((date) => {
        const dateStr = formatDateStr(date);
        const isSelected = formData[field] === dateStr;
        const isStart = field === 'endDate' && formData.startDate === dateStr;
        if (field === 'endDate' && dateStr < formData.startDate) return null;
        return (
          <button key={dateStr} type="button"
            onClick={() => setFormData({ ...formData, [field]: isSelected && field === 'endDate' ? '' : dateStr })}
            className={`flex-shrink-0 flex flex-col items-center p-2.5 rounded-xl border-2 transition-all min-w-[60px] ${
              isSelected ? 'bg-primary-900 text-white border-primary-900' :
              isStart ? 'bg-primary-50 border-primary-300 text-primary-700' :
              'bg-white border-slate-200 hover:border-primary-300 hover:bg-primary-50'
            }`}
          >
            <span className={`text-[10px] font-semibold mb-0.5 ${isSelected ? 'text-primary-200' : 'text-slate-400'}`}>
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
            <span className={`text-base font-bold ${isToday(date) && !isSelected ? 'text-primary-700' : ''}`}>{date.getDate()}</span>
            <span className={`text-[10px] ${isSelected ? 'text-primary-200' : 'text-slate-400'}`}>
              {date.toLocaleDateString('en-US', { month: 'short' })}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary-900 tracking-tight">Availability Planner</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your working hours and view high-demand slots.</p>
        </div>
        <Button onClick={openModal} className="h-10 rounded-xl bg-primary-900 text-white hover:bg-primary-800 gap-2 font-bold text-sm self-start">
          <CalendarOff size={15} />
          Block Time Off
        </Button>
      </div>

      {/* ── Main layout: calendar + sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

        {/* Left: mini calendar + existing blocks */}
        <div className="space-y-5">
          {/* Calendar card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            {loading ? (
              <div className="h-56 animate-pulse bg-slate-50 rounded-xl" />
            ) : (
              <MiniCalendar blocks={blocks} />
            )}
          </div>

          {/* Blocks list */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
              <h2 className="font-bold text-primary-900 text-sm">Blocked Times</h2>
              <span className="text-xs font-semibold text-slate-400">{blocks.length} block{blocks.length !== 1 ? 's' : ''}</span>
            </div>

            {loading ? (
              <div className="p-5 space-y-3">
                {[...Array(2)].map((_, i) => <div key={i} className="h-14 bg-slate-50 animate-pulse rounded-xl" />)}
              </div>
            ) : blocks.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CalendarOff size={18} className="text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-primary-900">No blocked times</p>
                <p className="text-xs text-slate-400 mt-1">Block time when you're unavailable.</p>
                <Button onClick={openModal} variant="outline" className="mt-4 h-8 rounded-xl border-slate-200 text-xs font-semibold">
                  <Plus size={12} className="mr-1" /> Block Time
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {blocks.map((block) => {
                  const { date, time } = formatBlockDisplay(block);
                  return (
                    <div key={block.id} className="flex items-center gap-3 px-5 py-3.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${block.is_recurring ? 'bg-indigo-50' : 'bg-amber-50'}`}>
                        {block.is_recurring ? <Repeat size={15} className="text-indigo-600" /> : <CalendarOff size={15} className="text-amber-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary-900 truncate">
                          {block.is_recurring ? formatRecurrencePattern(block.recurrence_pattern || '') : date}
                        </p>
                        <p className="text-xs text-slate-400">{time}{block.reason ? ` · ${block.reason}` : ''}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(block.id)}
                        disabled={deleting === block.id}
                        className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        {deleting === block.id
                          ? <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          : <Trash2 size={14} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: demand forecast + quick settings */}
        <div className="space-y-5">
          {/* Demand Forecast */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-primary-900 text-sm">Demand Forecast</h2>
              <button className="text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1">
                Full Report <ChevronRight size={12} />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Based on historical data, these slots have the highest booking requests.
            </p>
            <div className="space-y-3">
              {DEMAND_SLOTS.map((slot) => (
                <div key={slot.label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-primary-900 mb-1">{slot.label}</p>
                  <p className={`text-xl font-black ${slot.color}`}>{slot.pct}%</p>
                  <p className="text-[10px] text-slate-400">Booking Probability</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Settings */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-primary-900 text-sm mb-4">Quick Settings</h2>
            <div className="space-y-4">
              {/* Auto-accept toggle */}
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-primary-900">Auto-Accept Bookings</p>
                  <p className="text-xs text-slate-400 mt-0.5">During available hours</p>
                </div>
                <button
                  onClick={() => setAutoAccept(!autoAccept)}
                  className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 relative ${autoAccept ? 'bg-primary-900' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${autoAccept ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Sync Calendar */}
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-primary-900">Sync Calendar</p>
                  <p className="text-xs text-slate-400 mt-0.5">Google / Apple / Outlook</p>
                </div>
                <button className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-primary-50 flex items-center justify-center transition-colors">
                  <RefreshCw size={14} className="text-slate-500" />
                </button>
              </div>

              <Button
                variant="outline"
                onClick={() => {}}
                className="w-full h-9 rounded-xl border-slate-200 text-sm font-semibold text-slate-600"
              >
                Edit Default Hours
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Block Time Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Modal header */}
            <div className="p-5 sm:p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {currentStep > 1 && (
                    <button onClick={() => setCurrentStep(currentStep - 1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                      <ChevronLeft size={18} className="text-slate-500" />
                    </button>
                  )}
                  <div>
                    <h2 className="font-bold text-primary-900 text-lg">Block Time Off</h2>
                    <p className="text-xs text-slate-400">Set when you're unavailable</p>
                  </div>
                </div>
                <button onClick={closeModal} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors">
                  <X size={16} className="text-slate-500" />
                </button>
              </div>

              {/* Steps */}
              <div className="flex items-center gap-2">
                {[1,2,3].map((step) => (
                  <React.Fragment key={step}>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${currentStep >= step ? 'bg-primary-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {currentStep > step ? <CheckCircle2 size={13} /> : step}
                      </div>
                      <span className={`hidden sm:block text-xs font-semibold ${currentStep >= step ? 'text-primary-900' : 'text-slate-400'}`}>
                        {getStepLabels()[step-1]}
                      </span>
                    </div>
                    {step < 3 && <div className={`flex-1 h-0.5 rounded-full ${currentStep > step ? 'bg-primary-900' : 'bg-slate-100'}`} />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1 */}
              {currentStep === 1 && (
                <div className="p-5 sm:p-6">
                  <p className="text-sm font-bold text-primary-900 mb-4">What type of block?</p>
                  <div className="grid grid-cols-2 gap-3">
                    {BLOCK_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = formData.blockType === type.id;
                      return (
                        <button key={type.id} type="button"
                          onClick={() => setFormData({ ...formData, blockType: type.id })}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 hover:scale-[1.02] ${isSelected ? type.activeColor : `${type.color} hover:shadow-sm`}`}
                        >
                          <Icon size={24} />
                          <span className="font-bold text-sm">{type.label}</span>
                          <span className={`text-[11px] text-center ${isSelected ? 'opacity-80' : 'text-slate-500'}`}>{type.description}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {currentStep === 2 && (
                <div className="p-5 sm:p-6 space-y-5">
                  {formData.blockType === 'recurring' ? (
                    <>
                      <div>
                        <p className="text-sm font-bold text-primary-900 mb-3">Select Days to Block</p>
                        <p className="text-xs text-slate-400 mb-3">These days will be blocked every week</p>
                        <DaySelector selectedDays={formData.selectedDays} onChange={(days) => setFormData({ ...formData, selectedDays: days })} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary-900 mb-3">Starting From</p>
                        <DatePicker field="startDate" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm font-bold text-primary-900 mb-3">Select Start Date</p>
                        <DatePicker field="startDate" />
                      </div>
                      {formData.startDate && (
                        <div>
                          <p className="text-sm font-bold text-primary-900 mb-1">End Date <span className="text-slate-400 font-normal">(optional)</span></p>
                          <DatePicker field="endDate" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Step 3 */}
              {currentStep === 3 && (
                <div className="p-5 sm:p-6 space-y-5">
                  <div>
                    <p className="text-sm font-bold text-primary-900 mb-3">Start Time</p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {TIME_SLOTS.map((t) => (
                        <button key={`s-${t}`} type="button" onClick={() => setFormData({ ...formData, startTime: t })}
                          className={`py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${formData.startTime === t ? 'bg-primary-900 text-white border-primary-900' : 'bg-white border-slate-200 text-slate-700 hover:border-primary-300 hover:bg-primary-50'}`}
                        >{t}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary-900 mb-3">End Time</p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {TIME_SLOTS.map((t) => {
                        const disabled = !!(formData.startTime && t <= formData.startTime);
                        return (
                          <button key={`e-${t}`} type="button" disabled={disabled} onClick={() => !disabled && setFormData({ ...formData, endTime: t })}
                            className={`py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${disabled ? 'opacity-30 cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400' : formData.endTime === t ? 'bg-primary-800 text-white border-primary-800' : 'bg-white border-slate-200 text-slate-700 hover:border-primary-300 hover:bg-primary-50'}`}
                          >{t}</button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary-900 mb-2">Reason <span className="text-slate-400 font-normal">(optional)</span></p>
                    <input type="text" value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="e.g., Personal appointment, Vacation"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none text-sm text-slate-700 placeholder:text-slate-400"
                    />
                  </div>
                  {formData.startTime && formData.endTime && (
                    <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
                      <p className="text-xs font-bold text-primary-900 mb-2">Summary</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 text-[11px] font-bold">
                          {formData.blockType === 'recurring' ? 'Recurring' : 'One-Time'}
                        </span>
                        {formData.blockType === 'recurring' ? (
                          <span className="px-2.5 py-1 rounded-full bg-white text-slate-700 text-[11px] font-bold border border-slate-200">
                            {formData.selectedDays.map((d) => d.slice(0,3)).join(', ')}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-white text-slate-700 text-[11px] font-bold border border-slate-200">
                            {new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {formData.endDate && formData.endDate !== formData.startDate && ` – ${new Date(formData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                          </span>
                        )}
                        <span className="px-2.5 py-1 rounded-full bg-white text-primary-700 text-[11px] font-bold border border-primary-200">
                          {formData.startTime} – {formData.endTime}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Footer nav */}
              <div className="p-5 border-t border-slate-100 flex gap-3">
                <Button type="button" variant="outline" onClick={closeModal} className="flex-1 h-10 rounded-xl border-slate-200 text-sm">
                  Cancel
                </Button>
                {currentStep < 3 ? (
                  <Button type="button" onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={currentStep === 1 ? !canProceedToStep2 : !canProceedToStep3}
                    className="flex-1 h-10 rounded-xl bg-primary-900 text-white text-sm font-bold disabled:opacity-40"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button type="submit" disabled={submitting || !canSubmit}
                    className="flex-1 h-10 rounded-xl bg-primary-900 text-white text-sm font-bold disabled:opacity-40"
                  >
                    {submitting ? <span className="flex items-center gap-2"><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</span> : 'Block Time'}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
