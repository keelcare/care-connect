'use client';

import Image from 'next/image';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking, Review } from '@/types/api';
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Star,
  Info,
  AlertCircle,
  Play,
  CheckCircle2,
  CheckCircle,
  Users,
  IndianRupee,
  Navigation,
  Phone,
  Mail,
  Wallet,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar } from '@/components/ui/avatar';
import { ReviewForm } from '@/components/features/ReviewForm';
import { ReviewCard } from '@/components/features/ReviewCard';
import { CancellationModal } from '@/components/ui/CancellationModal';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';

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
  try {
    return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  } catch { return iso; }
}

function formatDateShort(iso?: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return iso; }
}

function durationHours(start?: string | null, end?: string | null): number {
  if (!start || !end) return 0;
  try { return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 3600000 * 10) / 10; }
  catch { return 0; }
}

const STATUS_META: Record<string, { label: string; dot: string; text: string; bg: string; border: string }> = {
  CONFIRMED:   { label: 'Confirmed',   dot: 'bg-primary-600',             text: 'text-primary-700',  bg: 'bg-primary-50',  border: 'border-primary-100' },
  ACCEPTED:    { label: 'Confirmed',   dot: 'bg-primary-600',             text: 'text-primary-700',  bg: 'bg-primary-50',  border: 'border-primary-100' },
  ASSIGNED:    { label: 'Assigned',    dot: 'bg-primary-400',             text: 'text-primary-600',  bg: 'bg-primary-50',  border: 'border-primary-100' },
  IN_PROGRESS: { label: 'In Progress', dot: 'bg-amber-500 animate-pulse', text: 'text-amber-700',    bg: 'bg-amber-50',    border: 'border-amber-100'   },
  COMPLETED:   { label: 'Completed',   dot: 'bg-emerald-500',             text: 'text-emerald-700',  bg: 'bg-emerald-50',  border: 'border-emerald-100' },
  CANCELLED:   { label: 'Cancelled',   dot: 'bg-red-400',                 text: 'text-red-600',      bg: 'bg-red-50',      border: 'border-red-100'     },
};

/* ── timeline steps (nanny perspective) ─────────────────────────── */

const TIMELINE = [
  { key: 'CONFIRMED',   label: 'Booking Confirmed' },
  { key: 'IN_PROGRESS', label: 'Job Started' },
  { key: 'COMPLETED',   label: 'Job Completed' },
];

const STEP_ORDER: Record<string, number> = {
  CONFIRMED: 0, ACCEPTED: 0, ASSIGNED: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
  CANCELLED: -1,
};

/* ── main page ───────────────────────────────────────────────────── */

export default function NannyBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const fetchData = React.useCallback(async () => {
    if (!bookingId) return;
    try {
      setLoading(true);
      setError(null);
      const [bookingData, reviewsData] = await Promise.all([
        api.bookings.get(bookingId),
        api.reviews.getByBooking(bookingId),
      ]);
      setBooking(bookingData);
      setReview(reviewsData?.[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load details');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStart = async () => {
    if (!booking || !navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    setActionLoading('starting');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const updated = await api.bookings.start(booking.id, { latitude: coords.latitude, longitude: coords.longitude });
          setBooking(updated);
          toast.success('Job started successfully!');
        } catch (err: any) { toast.error(err.message || 'Failed to start job'); }
        finally { setActionLoading(null); }
      },
      () => { toast.error('Please allow location access to start the job.'); setActionLoading(null); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const handleComplete = async () => {
    if (!booking) return;
    try {
      setActionLoading('completing');
      const updated = await api.bookings.complete(booking.id);
      setBooking(updated);
      toast.success('Job marked as complete!');
    } catch (err: any) { toast.error(err.message || 'Failed to complete job'); }
    finally { setActionLoading(null); }
  };

  const handleCancel = async (reason: string) => {
    if (!booking) return;
    try {
      setActionLoading('cancelling');
      const updated = await api.bookings.cancel(booking.id, { reason });
      setBooking(updated);
      setIsCancelModalOpen(false);
    } catch (err) { throw err; }
    finally { setActionLoading(null); }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  /* ── Error ── */
  if (error || !booking) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} className="text-red-500" />
        </div>
        <h2 className="font-bold text-primary-900 text-lg mb-2">Booking Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">{error || "We couldn't find this booking."}</p>
        <Button onClick={() => router.push('/dashboard/bookings')} className="bg-primary-900 text-white rounded-xl">
          Back to Bookings
        </Button>
      </div>
    );
  }

  /* ── Derived data ── */
  const currentStatus = (booking.status ?? 'PENDING').toUpperCase();
  const meta = STATUS_META[currentStatus] ?? STATUS_META['CONFIRMED'];
  const currentStep = STEP_ORDER[currentStatus] ?? 0;
  const isCancelled = currentStatus === 'CANCELLED';

  const parent = booking.parent ?? booking.users_bookings_nanny_idTousers; // fallback
  const parentName = parent?.profiles
    ? `${parent.profiles.first_name ?? ''} ${parent.profiles.last_name ?? ''}`.trim()
    : 'Client';
  const parentInitial = (parent?.profiles?.first_name?.[0] ?? 'C').toUpperCase();

  const serviceRequest = (booking as any).service_requests ?? null;
  const category = serviceRequest?.category ?? 'CC';
  const numChildren = serviceRequest?.num_children ?? 1;
  const location = serviceRequest?.location?.address ?? parent?.profiles?.address ?? null;
  const specialReqs = serviceRequest?.special_requirements ?? null;

  const hourlyRate = Number(booking.hourly_rate ?? booking.nanny?.nanny_details?.hourly_rate ?? 0);
  const totalAmount = Number(booking.total_amount ?? 0);
  const hours = Number((booking as any).hours_per_day) || durationHours(booking.start_time, booking.end_time);

  const bookingIdShort = `#${booking.id.slice(-8).toUpperCase()}`;

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard/bookings')}
          className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary-700 hover:border-primary-200 hover:bg-primary-50 transition-all shadow-sm flex-shrink-0"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] font-mono">
            Booking {bookingIdShort}
          </p>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-primary-900 tracking-tight truncate">
            {category === 'CC' ? 'Child Care' : category === 'ST' ? 'Shadow Teacher' : 'Care'} Session
          </h1>
        </div>
        <span className={`ml-auto flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${meta.bg} ${meta.text} ${meta.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 lg:gap-6">

        {/* ═══ LEFT ═══ */}
        <div className="space-y-5">

          {/* Session Details card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary-700 via-primary-500 to-accent" />
            <div className="p-5 sm:p-6">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Session Details</h2>

              {/* Date + time grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-primary-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-primary-900">{formatDateShort(booking.start_time)}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Start</p>
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-primary-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-primary-900">{formatTime(booking.start_time)}</span>
                  </div>
                </div>
                {booking.end_time && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End</p>
                    <span className="text-sm font-semibold text-primary-900">{formatTime(booking.end_time)}</span>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                  <span className="text-sm font-semibold text-primary-900">
                    {hours > 0 ? `${hours} hr${hours !== 1 ? 's' : ''}` : '—'}
                  </span>
                </div>
              </div>

              {/* Children + location */}
              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Users size={14} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Children</p>
                    <p className="text-sm font-semibold text-primary-900">
                      {numChildren} {numChildren === 1 ? 'child' : 'children'}
                    </p>
                  </div>
                </div>

                {location && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <MapPin size={14} className="text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                      <p className="text-sm font-semibold text-primary-900 truncate">{location}</p>
                    </div>
                    <button className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors flex-shrink-0">
                      <Navigation size={11} /> Directions
                    </button>
                  </div>
                )}
              </div>

              {/* Special requirements */}
              {specialReqs && (
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Info size={12} className="text-primary-500" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Special Requirements</p>
                  </div>
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 italic leading-relaxed">
                    "{specialReqs}"
                  </p>
                </div>
              )}

              {/* Cancellation reason */}
              {booking.cancellation_reason && (
                <div className="mt-4 pt-4 border-t border-red-50">
                  <div className="flex items-center gap-1.5 mb-2">
                    <AlertCircle size={12} className="text-red-500" />
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Cancellation Reason</p>
                  </div>
                  <p className="text-sm text-red-600 bg-red-50 rounded-xl p-3 leading-relaxed">
                    {booking.cancellation_reason}
                  </p>
                </div>
              )}

              {/* Job description */}
              {booking.job?.description && (
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Info size={12} className="text-primary-500" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Notes</p>
                  </div>
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 italic leading-relaxed">
                    "{booking.job.description}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Parent / Client card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Client</h2>
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative w-12 h-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {parent?.profiles?.profile_image_url ? (
                  <Image src={parent.profiles.profile_image_url} alt={parentName} fill sizes="48px" className="object-cover" />
                ) : (
                  <span className="text-lg font-bold text-primary-700">{parentInitial}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-primary-900 text-base">{parentName}</p>
                {parent?.email && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                    <Mail size={11} className="flex-shrink-0" />
                    <span className="truncate">{parent.email}</span>
                  </div>
                )}
                {parent?.profiles?.phone && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                    <Phone size={11} className="flex-shrink-0" />
                    <span>{parent.profiles.phone}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                    <MapPin size={11} className="flex-shrink-0" />
                    <span className="truncate">{location}</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={() => router.push(`/dashboard/messages?booking=${bookingId}`)}
              variant="outline"
              className="w-full h-9 rounded-xl border-slate-200 text-slate-700 hover:bg-primary-50 hover:border-primary-200 font-semibold text-sm gap-2 mt-4"
            >
              <MessageSquare size={14} />
              Message Client
            </Button>
          </div>

          {/* Review (if one exists) */}
          {review && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Client Review</h2>
              <ReviewCard review={review} />
            </div>
          )}
        </div>

        {/* ═══ RIGHT ═══ */}
        <div className="space-y-5">

          {/* Job Status timeline */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">Job Status</h2>

            {isCancelled ? (
              <div className="flex items-center gap-3 py-1">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                <p className="text-sm font-semibold text-red-600">This booking was cancelled.</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-[9px] top-3 bottom-3 w-px bg-slate-100" />
                <div className="space-y-5">
                  {TIMELINE.map((step, idx) => {
                    const done   = currentStep > idx;
                    const active = currentStep === idx;
                    return (
                      <div key={step.key} className="flex items-start gap-3 relative">
                        <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 relative z-10 border-2 transition-all ${
                          done   ? 'bg-emerald-500 border-emerald-500' :
                          active ? 'bg-white border-primary-600 shadow-[0_0_0_3px] shadow-primary-100' :
                                   'bg-white border-slate-200'
                        }`}>
                          {done   && <CheckCircle2 size={11} className="text-white" />}
                          {active && <div className="w-2 h-2 rounded-full bg-primary-600" />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-semibold ${done ? 'text-emerald-700' : active ? 'text-primary-900' : 'text-slate-300'}`}>
                            {step.label}
                          </p>
                          {active && (
                            <p className="text-xs text-slate-400 mt-0.5">
                              {step.key === 'IN_PROGRESS' ? `Expected end: ${formatTime(booking.end_time)}` : 'Current status'}
                            </p>
                          )}
                          {done && idx === 0 && (
                            <p className="text-xs text-slate-400 mt-0.5">{formatDateShort(booking.start_time)}</p>
                          )}
                          {done && idx === 2 && (booking as any).actual_end_time && (
                            <p className="text-xs text-slate-400 mt-0.5">{formatTime((booking as any).actual_end_time)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Earnings summary */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Your Earnings</h2>

            <div className="space-y-2.5">
              {hourlyRate > 0 && hours > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">{hours} hr{hours !== 1 ? 's' : ''} × ₹{hourlyRate}/hr</span>
                  <span className="font-semibold text-primary-900">₹{(hourlyRate * hours).toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="font-bold text-primary-900 text-sm">Total</span>
              <span className="text-xl font-black text-emerald-600">
                ₹{totalAmount > 0
                  ? totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : hourlyRate > 0 && hours > 0
                    ? (hourlyRate * hours).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : '—'}
              </span>
            </div>

            {currentStatus === 'COMPLETED' && (
              <div className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
                <Wallet size={13} className="text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-bold text-emerald-700">Payment processed</span>
              </div>
            )}
          </div>

          {/* Primary CTA actions */}
          <div className="space-y-2.5">
            {actionLoading ? (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            ) : (
              <>
                {/* Start job */}
                {['CONFIRMED', 'ASSIGNED', 'ACCEPTED'].includes(currentStatus) && (
                  <Button
                    onClick={handleStart}
                    className="w-full h-11 rounded-xl bg-primary-900 text-white hover:bg-primary-800 font-bold text-sm gap-2 shadow-md shadow-primary-900/20"
                  >
                    <Play size={14} fill="currentColor" />
                    Start Job
                  </Button>
                )}

                {/* Complete job */}
                {currentStatus === 'IN_PROGRESS' && (
                  <Button
                    onClick={handleComplete}
                    className="w-full h-11 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-sm gap-2 shadow-md shadow-emerald-500/20"
                  >
                    <CheckCircle size={15} />
                    Mark as Complete
                  </Button>
                )}

                {/* Message */}
                {['CONFIRMED', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(currentStatus) && (
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/messages?booking=${bookingId}`)}
                    className="w-full h-11 rounded-xl border-slate-200 text-slate-700 hover:bg-primary-50 hover:border-primary-200 font-semibold text-sm gap-2"
                  >
                    <MessageSquare size={15} />
                    Open Chat
                  </Button>
                )}

                {/* Leave review (after completed, no review yet) */}
                {currentStatus === 'COMPLETED' && !review && (
                  <Button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="w-full h-11 rounded-xl bg-amber-500 text-white hover:bg-amber-600 font-bold text-sm gap-2"
                  >
                    <Star size={14} />
                    Leave a Review
                  </Button>
                )}

                {/* Cancel */}
                {['CONFIRMED', 'ASSIGNED', 'ACCEPTED', 'IN_PROGRESS'].includes(currentStatus) && (
                  <Button
                    variant="ghost"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="w-full h-10 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 font-semibold text-sm border border-red-100"
                  >
                    Cancel Job
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Support card */}
          <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <p className="font-bold text-base mb-1 relative z-10">Caregiver Support</p>
            <p className="text-primary-100/70 text-xs leading-relaxed mb-4 relative z-10">
              Need help with this booking? Our team is available 24/7.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push('/support')}
              className="w-full h-9 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 font-semibold text-sm relative z-10"
            >
              Contact Help Centre
            </Button>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Write a Review" maxWidth="lg">
        <ReviewForm
          bookingId={bookingId}
          onSuccess={() => { setIsReviewModalOpen(false); fetchData(); }}
          onCancel={() => setIsReviewModalOpen(false)}
        />
      </Modal>

      <CancellationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancel}
        type="booking"
        startTime={booking.start_time}
        title="Cancel Booking"
      />
    </div>
  );
}
