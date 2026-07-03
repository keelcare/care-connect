'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking } from '@/types/api';
import { useRouter } from 'next/navigation';
import { useSSE, SSE_EVENT_TYPES } from '@/context/SSEProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ReviewModal } from '@/components/reviews/ReviewModal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Clock, MapPin, Users, MessageSquare, CheckCircle2,
  Calendar, ChevronDown, Filter, Receipt, Star,
  Play, RefreshCw,
} from 'lucide-react';

/* ── helpers ─────────────────────────────────────────────────────── */

function formatTime(iso?: string | null) {
  if (!iso) return '—';
  try {
    if (iso.includes('T')) return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const [h, m] = iso.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  } catch { return iso; }
}

function formatDate(iso?: string | null) {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return iso; }
}

type Tab = 'all' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

const TABS: { id: Tab; label: string }[] = [
  { id: 'all',         label: 'All Bookings' },
  { id: 'CONFIRMED',   label: 'Confirmed' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'COMPLETED',   label: 'Completed' },
  { id: 'CANCELLED',   label: 'Cancelled' },
];

const STATUS_META: Record<string, { dot: string; text: string; bg: string; border: string; label: string }> = {
  CONFIRMED:   { dot: 'bg-primary-600',  text: 'text-primary-700',  bg: 'bg-primary-50',  border: 'border-primary-100',  label: 'Confirmed' },
  ACCEPTED:    { dot: 'bg-primary-600',  text: 'text-primary-700',  bg: 'bg-primary-50',  border: 'border-primary-100',  label: 'Confirmed' },
  ASSIGNED:    { dot: 'bg-primary-400',  text: 'text-primary-600',  bg: 'bg-primary-50',  border: 'border-primary-100',  label: 'Assigned' },
  IN_PROGRESS: { dot: 'bg-amber-500 animate-pulse', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100', label: 'In Progress' },
  COMPLETED:   { dot: 'bg-emerald-500', text: 'text-emerald-700',  bg: 'bg-emerald-50',  border: 'border-emerald-100', label: 'Completed' },
  CANCELLED:   { dot: 'bg-red-400',     text: 'text-red-600',      bg: 'bg-red-50',      border: 'border-red-100',      label: 'Cancelled' },
  PENDING:     { dot: 'bg-slate-400',   text: 'text-slate-600',    bg: 'bg-slate-50',    border: 'border-slate-100',    label: 'Pending' },
};

/* ── booking card ────────────────────────────────────────────────── */

function BookingCard({
  booking, onCheckIn, onComplete, onReview, onMessage
}: {
  booking: Booking;
  onCheckIn: (b: Booking) => void;
  onComplete: (b: Booking) => void;
  onReview: (id: string) => void;
  onMessage: (b: Booking) => void;
}) {
  const router = useRouter();
  const status = (booking.status ?? 'PENDING').toUpperCase();
  const meta = STATUS_META[status] ?? STATUS_META['PENDING'];
  const isNannyBooking = true;

  const parentName = booking.parent?.profiles?.first_name
    ? `${booking.parent.profiles.first_name} ${booking.parent.profiles.last_name ?? ''}`.trim()
    : 'Client';

  const location = (booking.service_requests as any)?.location?.address ?? null;
  const numChildren = (booking.service_requests as any)?.num_children ?? 1;
  const category = (booking.service_requests as any)?.category ?? 'CC';
  const totalAmount = Number(booking.total_amount ?? 0);
  const bookingIdShort = `#BK-${booking.id.slice(-4).toUpperCase()}`;

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-4 transition-all hover:shadow-md ${status === 'IN_PROGRESS' ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-100'}`}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${meta.bg} ${meta.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
        </div>
        <span className="text-xs font-mono text-slate-400 flex-shrink-0">{bookingIdShort}</span>
      </div>

      {/* Service title */}
      <div>
        <h3 className="font-bold text-primary-900 text-base">
          {category === 'CC' ? 'Child Care' : category === 'ST' ? 'Shadow Teacher' : 'Care'} Session
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {numChildren} {numChildren === 1 ? 'child' : 'children'} · {parentName}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock size={12} className="text-primary-400 flex-shrink-0" />
          <span>
            {formatDate(booking.start_time)} · {formatTime(booking.start_time)}
            {booking.end_time ? ` – ${formatTime(booking.end_time)}` : ''}
          </span>
        </div>
        {location && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin size={12} className="text-emerald-500 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}
        {parentName !== 'Client' && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Users size={12} className="text-indigo-400 flex-shrink-0" />
            <span>{parentName}</span>
          </div>
        )}
      </div>

      {/* Amount + CTA */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-50 gap-3 flex-wrap">
        {totalAmount > 0 ? (
          <p className="font-black text-primary-900 text-lg">
            ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        ) : <div />}

        <div className="flex gap-2">
          {status === 'CONFIRMED' || status === 'ASSIGNED' || status === 'ACCEPTED' ? (
            <>
              <Button
                onClick={() => onCheckIn(booking)}
                className="h-9 rounded-xl bg-primary-900 text-white text-xs font-bold hover:bg-primary-800 gap-1.5 px-4"
              >
                <Play size={11} /> Start Job
              </Button>
              <Button
                variant="outline"
                onClick={() => onMessage(booking)}
                className="h-9 w-9 rounded-xl border-slate-200 p-0 flex items-center justify-center"
              >
                <MessageSquare size={14} className="text-slate-500" />
              </Button>
            </>
          ) : status === 'IN_PROGRESS' ? (
            <Button
              onClick={() => onComplete(booking)}
              className="h-9 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold gap-1.5 px-4"
            >
              <CheckCircle2 size={12} /> Complete Job
            </Button>
          ) : status === 'COMPLETED' ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onReview(booking.id)}
                className="h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-600 gap-1.5 px-3"
              >
                <Star size={12} /> Review
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                className="h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-600 gap-1.5 px-3"
              >
                <Receipt size={12} /> Receipt
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
              className="h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-600 px-3"
            >
              Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── main page ───────────────────────────────────────────────────── */

export default function BookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);

  const { subscribe } = useSSE();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.bookings.getNannyBookings();

      // Enrich with parent profile where missing
      const enriched = await Promise.all(
        data.map(async (b) => {
          if (b.parent?.profiles?.first_name || !b.parent_id) return b;
          try {
            const parent = await api.users.get(b.parent_id);
            return { ...b, parent };
          } catch { return b; }
        })
      );
      setBookings(enriched.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()));
    } catch (err) {
      console.error('Failed to fetch bookings', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const events = [
      SSE_EVENT_TYPES.BOOKING_CREATED, SSE_EVENT_TYPES.BOOKING_UPDATED,
      SSE_EVENT_TYPES.BOOKING_STARTED, SSE_EVENT_TYPES.BOOKING_COMPLETED,
      SSE_EVENT_TYPES.BOOKING_CANCELLED,
    ];
    const unsubs = events.map((e) => subscribe(e, fetchData));
    return () => unsubs.forEach((u) => u());
  }, [subscribe, fetchData]);

  const handleCheckIn = async (booking: Booking) => {
    if (!('geolocation' in navigator)) { toast.error('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          await api.bookings.start(booking.id, { latitude: coords.latitude, longitude: coords.longitude });
          toast.success('Job started!');
          fetchData();
        } catch (err: any) { toast.error(err.message || 'Failed to start job'); }
      },
      () => toast.error('Location access denied'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleComplete = async (booking: Booking) => {
    try {
      await api.bookings.complete(booking.id);
      toast.success('Job completed!');
      fetchData();
    } catch (err: any) { toast.error(err.message || 'Failed to complete job'); }
  };

  const handleMessage = (booking: Booking) => {
    // The room resolves (or lazily creates) the chat on open.
    router.push(`/dashboard/messages/${booking.id}`);
  };

  const filtered = activeTab === 'all'
    ? bookings
    : bookings.filter((b) => {
        const s = (b.status ?? '').toUpperCase();
        if (activeTab === 'CONFIRMED') return ['CONFIRMED', 'ASSIGNED', 'ACCEPTED'].includes(s);
        return s === activeTab;
      });

  const tabCounts: Record<Tab, number> = {
    all: bookings.length,
    CONFIRMED: bookings.filter((b) => ['CONFIRMED', 'ASSIGNED', 'ACCEPTED'].includes((b.status ?? '').toUpperCase())).length,
    IN_PROGRESS: bookings.filter((b) => b.status?.toUpperCase() === 'IN_PROGRESS').length,
    COMPLETED: bookings.filter((b) => b.status?.toUpperCase() === 'COMPLETED').length,
    CANCELLED: bookings.filter((b) => b.status?.toUpperCase() === 'CANCELLED').length,
  };

  return (
    <ProtectedRoute allowedRoles={['nanny']}>
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary-900 tracking-tight">Bookings</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage your upcoming and past service appointments.</p>
          </div>
        </div>

        {/* ── Tabs + date filter ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-1.5 flex items-center gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-primary-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-primary-900 hover:bg-slate-50'
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={22} className="text-primary-400" />
            </div>
            <p className="font-bold text-primary-900 text-sm">No bookings found</p>
            <p className="text-slate-400 text-xs mt-1">
              {activeTab === 'all' ? 'Your bookings will appear here.' : `No ${TABS.find(t => t.id === activeTab)?.label.toLowerCase()} bookings.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCheckIn={handleCheckIn}
                onComplete={handleComplete}
                onReview={(id) => setReviewBookingId(id)}
                onMessage={handleMessage}
              />
            ))}
          </div>
        )}
      </div>

      {reviewBookingId && (
        <ReviewModal
          isOpen={!!reviewBookingId}
          onClose={() => setReviewBookingId(null)}
          bookingId={reviewBookingId}
          onSuccess={fetchData}
        />
      )}
    </ProtectedRoute>
  );
}
