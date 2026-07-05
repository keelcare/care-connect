'use client';

import Image from 'next/image';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking, ServiceRequest, User } from '@/types/api';
import { useLiveSession } from '@/hooks/useLiveSession';
import { LiveTrackingCard } from '@/components/location/LiveTrackingCard';
import {
    ChevronLeft,
    Calendar,
    Clock,
    MapPin,
    Users,
    MessageSquare,
    Phone,
    Star,
    ShieldCheck,
    Download,
    AlertCircle,
    CheckCircle2,
    Circle,
    Navigation,
    Info,
    CreditCard,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import ParentLayout from '@/components/layout/ParentLayout';
import { ReviewModal } from '@/components/reviews/ReviewModal';
import { CancellationModal } from '@/components/ui/CancellationModal';
import { RescheduleModal } from '@/components/bookings/RescheduleModal';
import { usePayment } from '@/hooks/usePayment';
import { logger } from '@/lib/logger';

/* ─── Status helpers ──────────────────────────────────────────────── */

type StatusKey = 'PENDING' | 'REQUESTED' | 'ASSIGNED' | 'ACCEPTED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
    PENDING:     { label: 'Pending',     color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
    REQUESTED:   { label: 'Requested',   color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
    ASSIGNED:    { label: 'Assigned',    color: 'text-primary-700', bg: 'bg-primary-50', border: 'border-primary-200' },
    ACCEPTED:    { label: 'Accepted',    color: 'text-primary-700', bg: 'bg-primary-50', border: 'border-primary-200' },
    CONFIRMED:   { label: 'Confirmed',   color: 'text-primary-700', bg: 'bg-primary-50', border: 'border-primary-200' },
    IN_PROGRESS: { label: 'In Progress', color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200' },
    COMPLETED:   { label: 'Completed',   color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    CANCELLED:   { label: 'Cancelled',   color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200' },
};

/** Ordered timeline steps */
const TIMELINE_STEPS = [
    { key: 'CONFIRMED',   label: 'Booking Confirmed' },
    { key: 'ASSIGNED',    label: 'Caregiver Assigned' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'COMPLETED',   label: 'Completed' },
];

const STATUS_ORDER: Record<string, number> = {
    PENDING: 0, REQUESTED: 0,
    ASSIGNED: 1, ACCEPTED: 1, CONFIRMED: 1,
    IN_PROGRESS: 2,
    COMPLETED: 3,
    CANCELLED: -1,
};

/* ─── Main component ──────────────────────────────────────────────── */

export default function BookingDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const bookingId = params?.id as string;

    const [booking, setBooking] = useState<Booking | null>(null);
    const [request, setRequest] = useState<ServiceRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

    const { handlePayment, handleRetryPayment, loading: paymentLoading } = usePayment();
    const [paidBookingIds, setPaidBookingIds] = useState<string[]>([]);

    const isInProgress = (booking?.status ?? '').toUpperCase() === 'IN_PROGRESS';
    const liveSession = useLiveSession(bookingId, { publish: false, enabled: isInProgress });

    useEffect(() => {
        const saved = localStorage.getItem('paidBookingIds');
        if (saved) setPaidBookingIds(JSON.parse(saved));
    }, []);

    const fetchData = React.useCallback(async () => {
        if (!bookingId) return;
        try {
            setLoading(true);
            setError(null);
            try {
                const bookingData = await api.bookings.get(bookingId);
                setBooking(bookingData);
                const reqId = bookingData.request_id || bookingData.job_id;
                if (reqId) {
                    const requestData = await api.requests.get(reqId);
                    setRequest(requestData);
                }
            } catch {
                const requestData = await api.requests.get(bookingId);
                setRequest(requestData);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load details');
        } finally {
            setLoading(false);
        }
    }, [bookingId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handlePayNow = async () => {
        if (!booking) return;
        let duration = 4;
        if (booking.start_time && booking.end_time) {
            duration = (new Date(booking.end_time).getTime() - new Date(booking.start_time).getTime()) / 3600000;
        }
        handlePayment({
            bookingId: booking.id,
            amount: Math.max(duration * 20, 50),
            onSuccess: () => {
                const newPaid = [...paidBookingIds, booking.id];
                setPaidBookingIds(newPaid);
                localStorage.setItem('paidBookingIds', JSON.stringify(newPaid));
            },
            onError: (err) => logger.error('Payment failed', err),
        });
    };

    const handleCancel = async (reason: string) => {
        try {
            setActionLoading('cancelling');
            if (booking) await api.bookings.cancel(booking.id, { reason });
            else if (request) await api.requests.cancel(request.id, reason);
            await fetchData();
            setIsCancelModalOpen(false);
        } catch { alert('Failed to cancel'); }
        finally { setActionLoading(null); }
    };

    const confirmedReschedule = async (date: string, startTime: string, endTime: string) => {
        try {
            setActionLoading('rescheduling');
            if (booking) await api.bookings.reschedule(booking.id, { date, startTime, endTime });
            else if (request) await api.requests.update(request.id, { date, start_time: startTime });
            await fetchData();
            setIsRescheduleModalOpen(false);
        } catch (err) { throw err; }
        finally { setActionLoading(null); }
    };

    const formatTime = (t?: string) => {
        if (!t) return '—';
        try {
            if (t.includes('T')) {
                return new Date(t).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            }
            if (t.includes(':')) {
                const [h, m] = t.split(':').map(Number);
                return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
            }
        } catch { }
        return t;
    };

    const formatDate = (d?: string) => {
        if (!d) return '—';
        try {
            return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
        } catch { return d; }
    };

    /* ─── Loading / Error states ────────────────────────────────── */

    if (loading) {
        return (
            <ParentLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Spinner />
                </div>
            </ParentLayout>
        );
    }

    if (error || (!booking && !request)) {
        return (
            <ParentLayout>
                <div className="max-w-md mx-auto py-24 px-6 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                        <AlertCircle size={28} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-primary-900 mb-2">Booking Not Found</h2>
                    <p className="text-slate-500 text-sm mb-6">{error || "We couldn't find this booking."}</p>
                    <Button onClick={() => router.push('/bookings')} className="bg-primary-900 text-white rounded-xl">
                        Back to Bookings
                    </Button>
                </div>
            </ParentLayout>
        );
    }

    /* ─── Derived data ──────────────────────────────────────────── */

    const currentStatus = (booking?.status || request?.status || 'PENDING').toUpperCase();
    const statusMeta = STATUS_META[currentStatus] || STATUS_META['PENDING'];
    const isPaid = booking ? paidBookingIds.includes(booking.id) : false;

    // Resolve nanny from booking (via direct relation or Prisma alias) or enriched request
    const nanny = booking?.users_bookings_nanny_idTousers || booking?.nanny || request?.nanny || null;

    // Resolve nanny name: use backend-computed field first, then build from profile
    const nannyName = booking?.nanny_name
        || (nanny?.profiles ? `${nanny.profiles.first_name ?? ''} ${nanny.profiles.last_name ?? ''}`.trim() : null)
        || null;

    // Prefer booking times (absolute), fall back to request date+time fields
    const startDate = booking?.start_time || request?.date;
    const startTime = booking?.start_time || request?.start_time;
    const endTime = booking?.end_time || request?.end_time;
    const durationHours = booking?.hours_per_day
        || booking?.service_requests?.duration_hours
        || request?.duration_hours
        || 4;
    const hourlyRate = Number(booking?.hourly_rate || request?.hourly_rate || 0);
    const totalAmount = Number(booking?.total_amount || request?.total_amount || 0);

    // Service metadata
    const serviceRequest = booking?.service_requests || request;
    const category = serviceRequest?.category || 'CC';
    const numChildren = serviceRequest?.num_children ?? 1;
    const serviceLabel = category === 'CC' ? 'Child Care Session' : category === 'ST' ? 'Shadow Teacher Session' : 'Home Care Service';

    const currentStep = STATUS_ORDER[currentStatus] ?? 0;
    const isCancelled = currentStatus === 'CANCELLED';

    /* ─── Payment line items (derived) ─────────────────────────── */
    const baseAmount = hourlyRate > 0 ? hourlyRate * durationHours : totalAmount > 0 ? totalAmount * 0.85 : 0;
    const platformFee = totalAmount > 0 ? Math.round(totalAmount * 0.03) : 0;
    const taxes = totalAmount > 0 ? Math.round(totalAmount * 0.12) : 0;
    const displayTotal = totalAmount || (baseAmount + platformFee + taxes);

    /* ─── JSX ───────────────────────────────────────────────────── */

    return (
        <ParentLayout>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">

                {/* ── Header ── */}
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <button
                        onClick={() => router.push('/bookings')}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary-700 hover:border-primary-200 hover:bg-primary-50 transition-all shadow-sm flex-shrink-0"
                        aria-label="Back to bookings"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] font-mono">
                            Booking ID: #{(booking?.id || request?.id || '').toUpperCase().slice(0, 12)}
                        </p>
                        <h1 className="text-xl sm:text-2xl font-bold font-display text-primary-900 tracking-tight truncate">
                            {serviceLabel}
                        </h1>
                    </div>
                    <div className={`ml-auto flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusMeta.bg} ${statusMeta.color} ${statusMeta.border}`}>
                        {statusMeta.label}
                    </div>
                </div>

                {/* ── Two-column layout ── */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 sm:gap-6 lg:gap-8">

                    {/* ═══════════ LEFT COLUMN ═══════════ */}
                    <div className="space-y-5 sm:space-y-6">

                        {/* Live location tracking (active sessions) */}
                        {isInProgress && (
                            <LiveTrackingCard
                                session={liveSession}
                                role="parent"
                                avatarUrl={nanny?.profiles?.profile_image_url}
                            />
                        )}

                        {/* Service Details card */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-primary-700 via-primary-500 to-accent" />
                            <div className="p-5 sm:p-6">
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Service Details</h2>

                                {/* Service name row */}
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                                        <Users size={18} className="text-primary-700" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary-900 text-base">{serviceLabel}</p>
                                        <p className="text-slate-500 text-sm">
                                            {numChildren > 0 ? `${numChildren} child${numChildren !== 1 ? 'ren' : ''}` : 'Professional care'}
                                            {request?.special_requirements ? ' · Special requirements noted' : ''}
                                        </p>
                                    </div>
                                </div>

                                {/* Info grid */}
                                <div className="grid grid-cols-2 gap-4 sm:gap-5">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                                        <div className="flex items-center gap-1.5 text-primary-900">
                                            <Calendar size={14} className="text-primary-600 flex-shrink-0" />
                                            <span className="font-semibold text-sm">{formatDate(startDate)}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</p>
                                        <div className="flex items-center gap-1.5 text-primary-900">
                                            <Clock size={14} className="text-primary-600 flex-shrink-0" />
                                            <span className="font-semibold text-sm">{formatTime(startTime)}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                                        <span className="font-semibold text-sm text-primary-900">~{durationHours} hour{durationHours !== 1 ? 's' : ''}</span>
                                    </div>
                                    {endTime && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End Time</p>
                                            <span className="font-semibold text-sm text-primary-900">{formatTime(endTime)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Included tasks */}
                                <div className="mt-5 pt-4 border-t border-slate-50">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Included</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Supervision & Play', 'Meal Preparation', 'Educational Activities'].map((t) => (
                                            <span key={t} className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                                                <CheckCircle2 size={11} />
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Special requirements */}
                                {request?.special_requirements && (
                                    <div className="mt-4 pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <Info size={13} className="text-primary-500" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Special Requirements</p>
                                        </div>
                                        <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 italic leading-relaxed">
                                            "{request.special_requirements}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Assigned Professional card */}
                        {nanny ? (
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-5 sm:p-6">
                                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Assigned Professional</h2>

                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary-50 flex items-center justify-center flex-shrink-0 overflow-hidden border border-primary-100">
                                            {nanny.profiles?.profile_image_url ? (
                                                <Image src={nanny.profiles.profile_image_url} alt={nannyName || ''} fill sizes="64px" className="object-cover" />
                                            ) : (
                                                <span className="text-xl font-bold text-primary-700">
                                                    {(nanny.profiles?.first_name?.[0] || '?').toUpperCase()}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-bold text-primary-900 text-base">{nannyName || 'Caregiver'}</p>
                                                {nanny.is_verified && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 uppercase tracking-wide">
                                                        <ShieldCheck size={10} />
                                                        Verified
                                                    </span>
                                                )}
                                            </div>

                                            {/* Rating */}
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star size={13} className="text-amber-400 fill-amber-400" />
                                                <span className="text-sm font-bold text-slate-700">4.9</span>
                                                <span className="text-xs text-slate-400">({nanny.totalReviews || 0} reviews)</span>
                                            </div>

                                            {/* Bio */}
                                            {nanny.nanny_details?.bio && (
                                                <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">
                                                    {nanny.nanny_details.bio}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="grid grid-cols-2 gap-3 mt-5">
                                        <Button
                                            variant="outline"
                                            onClick={() => router.push(`/messages/${bookingId}`)}
                                            className="h-10 rounded-xl border-slate-200 text-slate-700 hover:bg-primary-50 hover:border-primary-200 font-semibold text-sm gap-2"
                                        >
                                            <MessageSquare size={15} />
                                            Message
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-10 rounded-xl border-slate-200 text-slate-700 hover:bg-primary-50 hover:border-primary-200 font-semibold text-sm gap-2"
                                            onClick={() => router.push(`/caregiver/${nanny.id}`)}
                                        >
                                            <Users size={15} />
                                            View Profile
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : !['COMPLETED', 'CANCELLED'].includes(currentStatus) ? (
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                                    <Loader2 size={20} className="text-primary-400 animate-spin" />
                                </div>
                                <div>
                                    <p className="font-bold text-primary-900 text-sm">Matching your caregiver</p>
                                    <p className="text-slate-500 text-xs mt-0.5">Our team is finding the best match for your request.</p>
                                </div>
                            </div>
                        ) : null}

                        {/* Service Location card */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-5 sm:p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Service Location</h2>
                                    {request?.location?.address && (
                                        <button className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors">
                                            <Navigation size={12} />
                                            Get Directions
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                        <MapPin size={16} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary-900 text-sm">Home</p>
                                        <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">
                                            {request?.location?.address || 'Home address on file'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══════════ RIGHT COLUMN ═══════════ */}
                    <div className="space-y-5 sm:space-y-6">

                        {/* Booking Status card */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">Booking Status</h2>

                            {isCancelled ? (
                                <div className="flex items-center gap-3 py-2">
                                    <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                                    <p className="font-semibold text-red-600 text-sm">This booking was cancelled.</p>
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* Vertical connector line */}
                                    <div className="absolute left-[9px] top-3 bottom-3 w-px bg-slate-100" />

                                    <div className="space-y-5">
                                        {TIMELINE_STEPS.map((step, idx) => {
                                            const done = currentStep > idx;
                                            const active = currentStep === idx;
                                            return (
                                                <div key={step.key} className="flex items-start gap-3 relative">
                                                    <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 relative z-10 border-2 transition-all ${
                                                        done
                                                            ? 'bg-emerald-500 border-emerald-500'
                                                            : active
                                                            ? 'bg-white border-primary-600 shadow-[0_0_0_3px] shadow-primary-100'
                                                            : 'bg-white border-slate-200'
                                                    }`}>
                                                        {done && <CheckCircle2 size={12} className="text-white fill-white" />}
                                                        {active && <div className="w-2 h-2 rounded-full bg-primary-600" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-semibold ${done ? 'text-emerald-700' : active ? 'text-primary-900' : 'text-slate-300'}`}>
                                                            {step.label}
                                                        </p>
                                                        {active && (
                                                            <p className="text-xs text-slate-400 mt-0.5">
                                                                {step.key === 'IN_PROGRESS'
                                                                    ? `Expected completion: ${formatTime(endTime)}`
                                                                    : 'Current status'}
                                                            </p>
                                                        )}
                                                        {done && idx === 0 && startDate && (
                                                            <p className="text-xs text-slate-400 mt-0.5">{formatDate(startDate)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Payment Summary card */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Payment Summary</h2>

                            <div className="space-y-3">
                                {hourlyRate > 0 && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Care Session ({durationHours} hrs × ₹{hourlyRate})</span>
                                        <span className="font-semibold text-primary-900">₹{hourlyRate * durationHours}</span>
                                    </div>
                                )}
                                {platformFee > 0 && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Platform Fee</span>
                                        <span className="font-semibold text-primary-900">₹{platformFee}</span>
                                    </div>
                                )}
                                {taxes > 0 && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Taxes & Fees</span>
                                        <span className="font-semibold text-primary-900">₹{taxes}</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                                <span className="font-bold text-primary-900">Total Amount</span>
                                <span className="text-xl font-black text-primary-900">
                                    ₹{displayTotal || '—'}
                                </span>
                            </div>

                            {/* Payment status chip */}
                            {isPaid ? (
                                <div className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
                                    <CreditCard size={14} className="text-emerald-600 flex-shrink-0" />
                                    <span className="text-xs font-bold text-emerald-700">Payment completed</span>
                                </div>
                            ) : booking?.payment_status === 'paid' ? (
                                <div className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
                                    <CreditCard size={14} className="text-emerald-600 flex-shrink-0" />
                                    <span className="text-xs font-bold text-emerald-700">Payment completed</span>
                                </div>
                            ) : null}

                            {/* Action buttons */}
                            <div className="mt-4 space-y-2">
                                {/* Download Invoice */}
                                <Button
                                    variant="outline"
                                    className="w-full h-10 rounded-xl border-primary-200 text-primary-700 hover:bg-primary-50 font-semibold text-sm gap-2"
                                >
                                    <Download size={15} />
                                    Download Invoice
                                </Button>

                                {/* Complete Payment */}
                                {currentStatus === 'COMPLETED' && !isPaid && booking?.payment_status !== 'paid' && (
                                    <Button
                                        onClick={handlePayNow}
                                        disabled={paymentLoading || !booking?.nanny_id}
                                        className="w-full h-10 rounded-xl bg-primary-900 text-white hover:bg-primary-800 font-bold text-sm disabled:opacity-50"
                                    >
                                        {paymentLoading ? 'Processing…' : !booking?.nanny_id ? 'Pending Assignment' : 'Complete Payment'}
                                    </Button>
                                )}

                                {/* Retry Payment */}
                                {booking?.nanny_id && !isPaid && booking?.payment_status === 'failed' && (
                                    <Button
                                        onClick={() => handleRetryPayment({
                                            bookingId: booking.id,
                                            onSuccess: () => {
                                                const np = [...paidBookingIds, booking.id];
                                                setPaidBookingIds(np);
                                                localStorage.setItem('paidBookingIds', JSON.stringify(np));
                                                fetchData();
                                            },
                                            onError: (err) => logger.error(err),
                                        })}
                                        disabled={paymentLoading}
                                        className="w-full h-10 rounded-xl border-2 border-primary-900 text-primary-900 bg-white hover:bg-primary-50 font-bold text-sm"
                                    >
                                        {paymentLoading ? 'Processing…' : 'Retry Payment'}
                                    </Button>
                                )}

                                {/* Reschedule */}
                                {['PENDING', 'ASSIGNED', 'ACCEPTED', 'CONFIRMED', 'REQUESTED'].includes(currentStatus) && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsRescheduleModalOpen(true)}
                                        className="w-full h-10 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm gap-2"
                                    >
                                        <Calendar size={15} />
                                        Reschedule
                                    </Button>
                                )}

                                {/* Cancel Booking */}
                                {['PENDING', 'ASSIGNED', 'ACCEPTED', 'CONFIRMED', 'IN_PROGRESS', 'REQUESTED'].includes(currentStatus) && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => setIsCancelModalOpen(true)}
                                        className="w-full h-10 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 font-semibold text-sm border border-red-100"
                                    >
                                        Cancel Booking
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Completed: leave review */}
                        {currentStatus === 'COMPLETED' && (
                            <Button
                                onClick={() => setIsReviewModalOpen(true)}
                                className="w-full h-11 rounded-xl bg-primary-900 text-white hover:bg-primary-800 font-bold text-sm gap-2 shadow-md shadow-primary-900/20"
                            >
                                <Star size={16} />
                                Leave a Review
                            </Button>
                        )}

                        {/* Support card */}
                        <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-2xl p-5 text-white relative overflow-hidden">
                            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                            <p className="font-bold text-base mb-1 relative z-10">Need Help?</p>
                            <p className="text-primary-100/70 text-xs leading-relaxed mb-4 relative z-10">
                                Our support team is available 24/7 for any questions about this booking.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/support')}
                                className="w-full h-9 rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 font-semibold text-sm relative z-10"
                            >
                                Contact Support
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Modals ── */}
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                bookingId={booking?.id || ''}
                onSuccess={() => fetchData()}
            />

            <CancellationModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleCancel}
                type="booking"
                startTime={booking?.start_time || `${request?.date}T${request?.start_time}`}
                title="Cancel Booking"
            />

            {isRescheduleModalOpen && (
                <RescheduleModal
                    isOpen={isRescheduleModalOpen}
                    onClose={() => setIsRescheduleModalOpen(false)}
                    onConfirm={confirmedReschedule}
                    serviceType={request?.category === 'CC' ? 'Child Care' : 'Service'}
                    currentDate={request?.date || ''}
                    currentStartTime={request?.start_time || '09:00'}
                    currentEndTime={request?.end_time || '13:00'}
                />
            )}
        </ParentLayout>
    );
}
