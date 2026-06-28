'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking, ServiceRequest, RecurringServiceRequest, User } from '@/types/api';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import ParentLayout from '@/components/layout/ParentLayout';
import { usePayment } from '@/hooks/usePayment';
import { useSSE, SSE_EVENT_TYPES } from '@/context/SSEProvider';
import { CancellationModal } from '@/components/ui/CancellationModal';
import { RescheduleModal } from '@/components/bookings/RescheduleModal';
import { ReviewModal } from '@/components/reviews/ReviewModal';
import { BookingSeriesCard } from '@/components/bookings/BookingSeriesCard';
import {
  Plus, Calendar, Clock, MapPin, MessageSquare,
  CheckCircle2, ChevronRight, Star, AlertCircle,
  Repeat, Users, CreditCard, RefreshCw,
} from 'lucide-react';

/* ── helpers ─────────────────────────────────────────────────────── */

function formatTime(t?: string | null) {
  if (!t) return '—';
  try {
    if (t.includes('T')) return new Date(t).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const [h, m] = t.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  } catch { return t; }
}

function formatDateShort(t?: string | null) {
  if (!t) return '—';
  try { return new Date(t).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }
  catch { return t; }
}

function formatDateFull(t?: string | null) {
  if (!t) return '—';
  try { return new Date(t).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }); }
  catch { return t; }
}

function getNannyName(nanny?: User): string {
  if (!nanny) return 'Caregiver';
  let p = (nanny.profiles || (nanny as any).profile) as any;
  if (Array.isArray(p)) p = p[0];
  if (p?.first_name) return `${p.first_name} ${p.last_name ?? ''}`.trim();
  return nanny.email?.split('@')[0] ?? 'Caregiver';
}

const STATUS_META: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  CONFIRMED:   { label: 'Confirmed',   dot: 'bg-emerald-500',          text: 'text-emerald-700', bg: 'bg-emerald-50' },
  IN_PROGRESS: { label: 'In Progress', dot: 'bg-amber-500 animate-pulse', text: 'text-amber-700',  bg: 'bg-amber-50' },
  COMPLETED:   { label: 'Completed',   dot: 'bg-slate-400',            text: 'text-slate-600',   bg: 'bg-slate-100' },
  CANCELLED:   { label: 'Cancelled',   dot: 'bg-red-400',              text: 'text-red-600',     bg: 'bg-red-50' },
  PENDING:     { label: 'Pending',     dot: 'bg-amber-400',            text: 'text-amber-600',   bg: 'bg-amber-50' },
  REQUESTED:   { label: 'Finding Nanny', dot: 'bg-primary-400',        text: 'text-primary-600', bg: 'bg-primary-50' },
  ASSIGNED:    { label: 'Nanny Assigned', dot: 'bg-primary-600',      text: 'text-primary-700', bg: 'bg-primary-50' },
  EXPIRED:     { label: 'Expired',     dot: 'bg-slate-300',            text: 'text-slate-500',   bg: 'bg-slate-50' },
};

type Tab = 'upcoming' | 'completed' | 'cancelled';

/* ── booking card ────────────────────────────────────────────────── */

function BookingCard({
  booking, onCancel, onReview, paidIds, onPaySuccess,
}: {
  booking: Booking;
  onCancel: (b: Booking) => void;
  onReview: (id: string) => void;
  paidIds: string[];
  onPaySuccess: (id: string) => void;
}) {
  const router = useRouter();
  const { handlePayment, loading: payLoading } = usePayment();

  const rawStatus = booking.status?.toUpperCase() ?? 'PENDING';
  const isTechnicallyExpired = booking.end_time &&
    new Date(booking.end_time).getTime() + 2 * 60 * 60 * 1000 < Date.now() &&
    !['COMPLETED', 'IN_PROGRESS'].includes(rawStatus);
  const effectiveStatus = isTechnicallyExpired ? 'EXPIRED' : rawStatus;

  const meta = STATUS_META[effectiveStatus] ?? STATUS_META['PENDING'];
  const nannyName = (booking as any).nanny_name || getNannyName(booking.nanny);
  const hasPendingNanny = !booking.nanny_id;
  const location = (booking as any).location?.address ?? (booking as any).service_requests?.location?.address ?? null;
  const numChildren = (booking as any).num_children ?? (booking as any).service_requests?.num_children ?? (booking.job as any)?.num_children ?? 1;
  const totalAmount = Number(booking.total_amount ?? 0);
  const isPaid = paidIds.includes(booking.id);

  const isActive = ['CONFIRMED', 'IN_PROGRESS', 'REQUESTED', 'ASSIGNED', 'PENDING'].includes(rawStatus);
  const isCompleted = rawStatus === 'COMPLETED';

  const handlePay = () => {
    let duration = 4;
    if (booking.start_time && booking.end_time) {
      duration = (new Date(booking.end_time).getTime() - new Date(booking.start_time).getTime()) / 3600000;
    }
    handlePayment({
      bookingId: booking.id,
      amount: totalAmount > 0 ? totalAmount : Math.max(duration * 20, 50),
      onSuccess: () => onPaySuccess(booking.id),
      onError: (err) => console.error(err),
    });
  };

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md cursor-pointer ${
        rawStatus === 'IN_PROGRESS' ? 'border-amber-200 ring-1 ring-amber-100' :
        isActive ? 'border-slate-100 hover:border-primary-100' : 'border-slate-100'
      }`}
      onClick={() => router.push(`/bookings/${booking.id}`)}
    >
      {/* Colour bar */}
      <div className={`h-0.5 ${
        rawStatus === 'IN_PROGRESS' ? 'bg-amber-400' :
        rawStatus === 'COMPLETED' ? 'bg-slate-200' :
        isActive ? 'bg-primary-500' : 'bg-slate-200'
      }`} />

      <div className="p-5">
        {/* Top: date block + nanny + status */}
        <div className="flex items-start gap-4">
          {/* Date block */}
          <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${isActive ? 'bg-primary-50 text-primary-900' : 'bg-slate-50 text-slate-500'}`}>
            <span className="text-[10px] font-bold uppercase tracking-wide">
              {new Date(booking.start_time).toLocaleString('en-US', { month: 'short' })}
            </span>
            <span className="text-xl font-black leading-none">
              {new Date(booking.start_time).getDate()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-bold text-primary-900 text-sm leading-tight">
                  {hasPendingNanny && isActive ? 'Finding your caregiver...' : nannyName}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {numChildren === 1 ? '1 child' : `${numChildren} children`}
                  {' · '}
                  {formatDateShort(booking.start_time)}
                </p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex-shrink-0 ${meta.bg} ${meta.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
            </div>

            {/* Time + location */}
            <div className="mt-2.5 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock size={11} className="text-slate-400 flex-shrink-0" />
                <span>{formatTime(booking.start_time)}{booking.end_time ? ` – ${formatTime(booking.end_time)}` : ''}</span>
              </div>
              {location && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin size={11} className="text-emerald-500 flex-shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-50 mt-4 pt-3 flex items-center justify-between gap-3">
          {/* Amount */}
          {totalAmount > 0 ? (
            <p className="text-sm font-black text-primary-900">
              ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          ) : <div />}

          {/* CTAs */}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {isActive && ['CONFIRMED', 'IN_PROGRESS'].includes(rawStatus) && (
              <Button
                variant="outline"
                onClick={() => router.push(`/messages?booking=${booking.id}`)}
                className="h-8 w-8 rounded-xl border-slate-200 p-0 flex items-center justify-center"
              >
                <MessageSquare size={13} className="text-slate-500" />
              </Button>
            )}

            {isActive && !['IN_PROGRESS'].includes(rawStatus) && (
              <Button
                variant="outline"
                onClick={() => onCancel(booking)}
                className="h-8 px-3 rounded-xl border-red-100 text-red-500 hover:bg-red-50 text-xs font-semibold"
              >
                Cancel
              </Button>
            )}

            {isCompleted && !isPaid && (
              <Button
                onClick={handlePay}
                disabled={payLoading || hasPendingNanny}
                className="h-8 px-3 rounded-xl bg-primary-900 text-white text-xs font-bold disabled:opacity-50 gap-1.5"
              >
                <CreditCard size={12} />
                {payLoading ? 'Processing…' : hasPendingNanny ? 'Awaiting nanny' : 'Pay Now'}
              </Button>
            )}

            {isCompleted && isPaid && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-xs font-bold">
                <CheckCircle2 size={11} /> Paid
              </span>
            )}

            {isCompleted && (
              <Button
                variant="outline"
                onClick={() => onReview(booking.id)}
                className="h-8 px-3 rounded-xl border-amber-100 text-amber-600 hover:bg-amber-50 text-xs font-semibold gap-1"
              >
                <Star size={11} /> Review
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => router.push(`/bookings/${booking.id}`)}
              className="h-8 w-8 rounded-xl border-slate-200 p-0 flex items-center justify-center"
            >
              <ChevronRight size={14} className="text-slate-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── request card (assigned, not yet confirmed booking) ──────────── */

function RequestCard({ request, onCancel }: { request: ServiceRequest; onCancel: () => void }) {
  const router = useRouter();
  const nannyName = (request as any).nanny_name || getNannyName(request.nanny);
  return (
    <div
      className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all"
      onClick={() => router.push(`/bookings/${request.id}`)}
    >
      <div className="h-0.5 bg-primary-400" />
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary-50 flex flex-col items-center justify-center flex-shrink-0 text-primary-900">
            <span className="text-[10px] font-bold uppercase">{new Date(request.date).toLocaleString('en-US', { month: 'short' })}</span>
            <span className="text-xl font-black leading-none">{new Date(request.date).getDate()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-primary-900 text-sm">{nannyName}</p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary-50 text-primary-700 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                Assigned
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{request.num_children} child{request.num_children !== 1 ? 'ren' : ''} · {formatDateShort(request.date)}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
              <Clock size={11} className="text-slate-400" />
              <span>{formatTime(request.start_time)} · {request.duration_hours} hrs</span>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-50 mt-4 pt-3 flex justify-end" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            onClick={onCancel}
            className="h-8 px-3 rounded-xl border-red-100 text-red-500 hover:bg-red-50 text-xs font-semibold"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── empty state ─────────────────────────────────────────────────── */

function EmptyState({ tab, onBook }: { tab: Tab; onBook: () => void }) {
  const messages: Record<Tab, { title: string; body: string }> = {
    upcoming: { title: 'No upcoming bookings', body: "Book a service and your upcoming sessions will appear here." },
    completed: { title: 'No completed sessions yet', body: "Your completed sessions and payment history will show up here." },
    cancelled: { title: 'No cancelled bookings', body: "Cancelled sessions will appear here." },
  };
  const { title, body } = messages[tab];
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
      <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar size={22} className="text-primary-400" />
      </div>
      <p className="font-bold text-primary-900 text-base mb-1">{title}</p>
      <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">{body}</p>
      {tab === 'upcoming' && (
        <Button onClick={onBook} className="h-10 px-6 rounded-xl bg-primary-900 text-white text-sm font-bold gap-2">
          <Plus size={15} /> Book a Service
        </Button>
      )}
    </div>
  );
}

/* ── main page ───────────────────────────────────────────────────── */

export default function ParentBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [recurringSeries, setRecurringSeries] = useState<RecurringServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [paidIds, setPaidIds] = useState<string[]>([]);

  // modal state
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [requestToCancel, setRequestToCancel] = useState<ServiceRequest | null>(null);
  const [seriesToCancel, setSeriesToCancel] = useState<RecurringServiceRequest | null>(null);
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [bookingToReschedule, setBookingToReschedule] = useState<Booking | ServiceRequest | null>(null);

  const { subscribe } = useSSE();

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const [bookingsData, requestsData, seriesData] = await Promise.all([
        api.bookings.getParentBookings(),
        api.requests.getParentRequests(),
        api.recurringRequests.getParentRequests().catch(() => [] as RecurringServiceRequest[]),
      ]);

      const standaloneBookings = bookingsData
        .filter(b => !b.recurring_request_id)
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

      const sortedRequests = requestsData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setBookings(standaloneBookings);
      setRequests(sortedRequests);
      setRecurringSeries(seriesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const saved = localStorage.getItem('paidBookingIds');
    if (saved) setPaidIds(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (user) fetchData();
    else if (user === null) router.push('/auth/login');
  }, [user, fetchData, router]);

  useEffect(() => {
    const events = [
      SSE_EVENT_TYPES.BOOKING_CREATED, SSE_EVENT_TYPES.BOOKING_UPDATED,
      SSE_EVENT_TYPES.BOOKING_STARTED, SSE_EVENT_TYPES.BOOKING_COMPLETED,
      SSE_EVENT_TYPES.BOOKING_CANCELLED, SSE_EVENT_TYPES.BOOKING_RESCHEDULED,
      SSE_EVENT_TYPES.ASSIGNMENT_ACCEPTED, SSE_EVENT_TYPES.REQUEST_CREATED,
      SSE_EVENT_TYPES.REQUEST_MATCHED, SSE_EVENT_TYPES.REQUEST_CANCELLED,
    ];
    const unsubs = events.map(e => subscribe(e, fetchData));
    return () => unsubs.forEach(u => u());
  }, [subscribe, fetchData]);

  /* cancellation handlers */
  const confirmCancelBooking = async (reason: string) => {
    if (!bookingToCancel) return;
    try {
      setActionLoading(bookingToCancel.id);
      const updated = await api.bookings.cancel(bookingToCancel.id, { reason });
      setBookings(prev => prev.map(b => b.id === bookingToCancel.id ? updated : b));
      setBookingToCancel(null);
    } catch (err) { alert(err instanceof Error ? err.message : 'Failed to cancel'); }
    finally { setActionLoading(null); }
  };

  const confirmCancelRequest = async (reason: string) => {
    if (!requestToCancel) return;
    try {
      setActionLoading(requestToCancel.id);
      await api.requests.cancel(requestToCancel.id, reason);
      await fetchData();
      setRequestToCancel(null);
    } catch { alert('Failed to cancel request'); }
    finally { setActionLoading(null); }
  };

  const confirmCancelSeries = async (reason: string) => {
    if (!seriesToCancel) return;
    try {
      setActionLoading(seriesToCancel.id);
      await new Promise(r => setTimeout(r, 800));
      await fetchData();
      setSeriesToCancel(null);
    } catch { } finally { setActionLoading(null); }
  };

  const confirmReschedule = async (date: string, startTime: string, endTime: string) => {
    if (!bookingToReschedule) return;
    let id = bookingToReschedule.id;
    if ('num_children' in bookingToReschedule) {
      const assoc = bookings.find(b => b.job_id === bookingToReschedule.id || (b as any).request_id === bookingToReschedule.id);
      if (assoc) id = assoc.id;
    }
    await api.bookings.reschedule(id, { date, startTime, endTime });
    await fetchData();
    setBookingToReschedule(null);
  };

  const handlePaySuccess = (id: string) => {
    const next = [...paidIds, id];
    setPaidIds(next);
    localStorage.setItem('paidBookingIds', JSON.stringify(next));
  };

  /* filtered data */
  const isExpired = (b: Booking) => b.end_time &&
    new Date(b.end_time).getTime() + 2 * 60 * 60 * 1000 < Date.now() &&
    !['COMPLETED', 'IN_PROGRESS'].includes(b.status);

  const assignedRequests = requests.filter(r => ['assigned', 'ASSIGNED'].includes(r.status));

  const filteredBookings = bookings.filter(b => {
    const s = b.status.toUpperCase();
    if (activeTab === 'upcoming') {
      if (!['CONFIRMED', 'IN_PROGRESS', 'PENDING', 'REQUESTED', 'ASSIGNED'].includes(s)) return false;
      if (isExpired(b) && s !== 'IN_PROGRESS') return false;
      return !assignedRequests.some(r => r.id === b.job_id);
    }
    if (activeTab === 'completed') return s === 'COMPLETED';
    if (activeTab === 'cancelled') return s === 'CANCELLED' || (isExpired(b) && s !== 'COMPLETED' && s !== 'IN_PROGRESS');
    return true;
  });

  const filteredSeries = recurringSeries.filter(s => {
    const st = s.status.toLowerCase();
    if (activeTab === 'upcoming') return ['active', 'paused', 'pending'].includes(st);
    if (activeTab === 'completed') return st === 'completed';
    if (activeTab === 'cancelled') return st === 'cancelled';
    return false;
  });

  const tabCounts: Record<Tab, number> = {
    upcoming: filteredBookings.length + (activeTab === 'upcoming' ? assignedRequests.length : 0) + filteredSeries.length,
    completed: bookings.filter(b => b.status.toUpperCase() === 'COMPLETED').length,
    cancelled: bookings.filter(b => b.status.toUpperCase() === 'CANCELLED' || isExpired(b)).length,
  };

  const hasItems = filteredBookings.length > 0 ||
    (activeTab === 'upcoming' && (assignedRequests.length > 0 || filteredSeries.length > 0));

  const TABS: { id: Tab; label: string }[] = [
    { id: 'upcoming',  label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <ParentLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary-900 tracking-tight">My Bookings</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage your appointments and sessions.</p>
          </div>
          <Button
            onClick={() => router.push('/book-service')}
            className="h-10 px-4 rounded-xl bg-primary-900 text-white text-sm font-bold gap-2 flex-shrink-0 shadow-md shadow-primary-900/20"
          >
            <Plus size={15} /> Book
          </Button>
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5 flex gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'bg-primary-900 text-white shadow-sm' : 'text-slate-500 hover:text-primary-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              {tabCounts[tab.id] > 0 && (
                <span className={`text-[10px] font-black rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tabCounts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-36 bg-white rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
            <AlertCircle size={24} className="text-red-400 mx-auto mb-3" />
            <p className="text-red-600 font-semibold text-sm mb-4">{error}</p>
            <Button onClick={fetchData} variant="outline" className="gap-2 rounded-xl border-red-200 text-red-600 text-sm">
              <RefreshCw size={13} /> Retry
            </Button>
          </div>
        ) : !hasItems ? (
          <EmptyState tab={activeTab} onBook={() => router.push('/book-service')} />
        ) : (
          <div className="space-y-3">
            {/* Recurring Series */}
            {filteredSeries.map(series => (
              <BookingSeriesCard
                key={series.id}
                series={series}
                isCancelling={actionLoading === series.id}
                onManage={() => router.push(`/recurring-bookings/${series.id}`)}
                onCancel={() => setSeriesToCancel(series)}
              />
            ))}

            {/* Assigned requests */}
            {activeTab === 'upcoming' && assignedRequests.map(r => (
              <RequestCard
                key={r.id}
                request={r}
                onCancel={() => {
                  const assoc = bookings.find(b => b.job_id === r.id);
                  if (assoc) setBookingToCancel(assoc);
                  else setRequestToCancel(r);
                }}
              />
            ))}

            {/* Individual bookings */}
            {filteredBookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={setBookingToCancel}
                onReview={setReviewBookingId}
                paidIds={paidIds}
                onPaySuccess={handlePaySuccess}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {reviewBookingId && (
        <ReviewModal
          isOpen={!!reviewBookingId}
          onClose={() => setReviewBookingId(null)}
          bookingId={reviewBookingId}
          onSuccess={fetchData}
        />
      )}

      {bookingToCancel && (
        <CancellationModal
          isOpen={!!bookingToCancel}
          onClose={() => setBookingToCancel(null)}
          onConfirm={confirmCancelBooking}
          type="booking"
          startTime={bookingToCancel.start_time}
          title="Cancel Booking"
        />
      )}

      {requestToCancel && (
        <CancellationModal
          isOpen={!!requestToCancel}
          onClose={() => setRequestToCancel(null)}
          onConfirm={confirmCancelRequest}
          type="request"
          startTime={`${requestToCancel.date}T${requestToCancel.start_time}`}
          title="Cancel Request"
        />
      )}

      {seriesToCancel && (
        <CancellationModal
          isOpen={!!seriesToCancel}
          onClose={() => setSeriesToCancel(null)}
          onConfirm={confirmCancelSeries}
          type="request"
          startTime={`${seriesToCancel.start_date}T${seriesToCancel.start_time}`}
          title="Cancel Entire Series"
        />
      )}

      {bookingToReschedule && (
        <RescheduleModal
          isOpen={!!bookingToReschedule}
          onClose={() => setBookingToReschedule(null)}
          onConfirm={confirmReschedule}
          serviceType="Child Care"
          currentDate={new Date().toISOString().split('T')[0]}
          currentStartTime="09:00"
          currentEndTime="13:00"
        />
      )}
    </ParentLayout>
  );
}
