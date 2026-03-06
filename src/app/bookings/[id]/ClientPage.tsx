'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking, ServiceRequest, User } from '@/types/api';
import {
    ChevronLeft,
    Calendar,
    Clock,
    MapPin,
    Users,
    MessageSquare,
    Star,
    ShieldCheck,
    ArrowRight,
    Info,
    CalendarCheck,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar } from '@/components/ui/avatar';
import ParentLayout from '@/components/layout/ParentLayout';
import { ProfileCard } from '@/components/features/ProfileCard';
import { ReviewModal } from '@/components/reviews/ReviewModal';
import { CancellationModal } from '@/components/ui/CancellationModal';
import { RescheduleModal } from '@/components/bookings/RescheduleModal';
import { usePayment } from '@/hooks/usePayment';

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

    // Modals state
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

    const { handlePayment, loading: paymentLoading } = usePayment();
    const [paidBookingIds, setPaidBookingIds] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('paidBookingIds');
        if (saved) setPaidBookingIds(JSON.parse(saved));
    }, []);

    const fetchData = React.useCallback(async () => {
        if (!bookingId) return;
        try {
            setLoading(true);
            setError(null);

            // Try to get as booking first
            try {
                const bookingData = await api.bookings.get(bookingId);
                setBooking(bookingData);

                // If it has a job_id (request_id), fetch the detailed request info as well
                if (bookingData.job_id) {
                    const requestData = await api.requests.get(bookingData.job_id);
                    setRequest(requestData);
                }
            } catch (err) {
                // If booking.get fails, maybe it's just a request ID?
                const requestData = await api.requests.get(bookingId);
                setRequest(requestData);

                // If it's a request, check if there's an associated booking
                try {
                    // This is a bit of a guess if we don't have a reverse lookup, 
                    // but often these IDs are used interchangeably in the frontend logic.
                    // For now, if we found it as a request, we'll try to find a booking that references it.
                    // Note: The API might not have a direct "get booking by request id" but we can check if it's there.
                } catch (bErr) {
                    console.log('No associated booking found for this request');
                }
            }
        } catch (err) {
            console.error('Failed to fetch details:', err);
            setError(err instanceof Error ? err.message : 'Failed to load details');
        } finally {
            setLoading(false);
        }
    }, [bookingId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePayNow = async () => {
        if (!booking) return;

        let duration = 4;
        if (booking.start_time && booking.end_time) {
            const start = new Date(booking.start_time).getTime();
            const end = new Date(booking.end_time).getTime();
            duration = (end - start) / (1000 * 60 * 60);
        }
        const amount = Math.max(duration * 20, 50);

        handlePayment({
            bookingId: booking.id,
            amount: amount,
            onSuccess: () => {
                const newPaid = [...paidBookingIds, booking.id];
                setPaidBookingIds(newPaid);
                localStorage.setItem('paidBookingIds', JSON.stringify(newPaid));
            },
            onError: (err) => {
                console.error('Payment failed', err);
            },
        });
    };

    const handleCancel = async (reason: string) => {
        try {
            setActionLoading('cancelling');
            if (booking) {
                await api.bookings.cancel(booking.id, { reason });
            } else if (request) {
                await api.requests.cancel(request.id, reason);
            }
            await fetchData();
            setIsCancelModalOpen(false);
        } catch (err) {
            console.error(err);
            alert('Failed to cancel');
        } finally {
            setActionLoading(null);
        }
    };

    const confirmedReschedule = async (date: string, startTime: string, endTime: string) => {
        try {
            setActionLoading('rescheduling');
            const targetId = booking?.id || request?.id;
            if (!targetId) return;

            if (booking) {
                await api.bookings.reschedule(booking.id, { date, startTime, endTime });
            } else {
                await api.requests.update(targetId, { date, start_time: startTime });
            }

            await fetchData();
            setIsRescheduleModalOpen(false);
        } catch (err) {
            console.error('Failed to reschedule:', err);
            throw err;
        } finally {
            setActionLoading(null);
        }
    };

    const formatTime = (timeInput?: string) => {
        if (!timeInput) return '—';
        try {
            if (timeInput.includes('T')) {
                const date = new Date(timeInput);
                return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            }
            if (timeInput.includes(':')) {
                const parts = timeInput.split(':');
                let h = parseInt(parts[0], 10);
                let m = parseInt(parts[1], 10);
                const ampm = h >= 12 ? 'PM' : 'AM';
                const h12 = h % 12 || 12;
                return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
            }
            return timeInput;
        } catch (e) {
            return timeInput;
        }
    };

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
                <div className="max-w-3xl mx-auto py-20 px-6 text-center">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-primary-900 mb-2">Booking Not Found</h2>
                    <p className="text-slate-500 mb-8">{error || "We couldn't find the details for this booking."}</p>
                    <Button onClick={() => router.push('/bookings')} className="bg-primary-900">
                        Back to All Bookings
                    </Button>
                </div>
            </ParentLayout>
        );
    }

    const currentStatus = (booking?.status || request?.status || 'PENDING').toUpperCase();
    const isPaid = booking ? paidBookingIds.includes(booking.id) : false;
    const nanny = booking?.nanny || request?.nanny;

    return (
        <ParentLayout>
            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12 py-10">
                {/* Breadcrumbs & Navigation */}
                <div className="flex items-center gap-4 mb-10">
                    <button
                        onClick={() => router.push('/bookings')}
                        className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-700 hover:border-primary-100 hover:bg-primary-50 transition-all shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold font-display text-primary-900 tracking-tight">
                            Booking Details
                        </h1>
                        <p className="text-slate-400 text-sm font-mono uppercase tracking-[0.2em] mt-1">
                            ID: {booking?.id || request?.id}
                        </p>
                    </div>

                    <div className="ml-auto flex items-center gap-3">
                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${currentStatus === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            currentStatus === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-100' :
                                currentStatus === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                    'bg-primary-50 text-primary-700 border-primary-100'
                            }`}>
                            {currentStatus.replace('_', ' ')}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Booking Summary Card */}
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-soft-xl overflow-hidden group">
                            <div className="h-2 bg-gradient-to-r from-primary-600 via-primary-400 to-accent-500"></div>
                            <div className="p-8 md:p-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-8">
                                        <div className="flex items-start gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                                <CalendarCheck size={24} />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Scheduled Date</span>
                                                <p className="text-primary-900 font-bold text-xl font-display leading-tight">
                                                    {new Date(booking?.start_time || request?.date || '').toLocaleDateString(undefined, {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                                <Clock size={24} />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Time & Duration</span>
                                                <p className="text-primary-900 font-bold text-xl font-display leading-tight">
                                                    {formatTime(booking?.start_time || request?.start_time)}
                                                    <span className="text-slate-400 font-normal text-sm ml-2 block md:inline mt-1 md:mt-0">
                                                        ({request?.duration_hours || 4} hours)
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex items-start gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Location</span>
                                                <p className="text-primary-900 font-bold text-lg font-display leading-snug">
                                                    {request?.location?.address || 'Verified Home Listing'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                                <Users size={24} />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Care Details</span>
                                                <p className="text-primary-900 font-bold text-lg font-display leading-tight">
                                                    {request?.num_children || 1} Child{(request?.num_children || 1) !== 1 ? 'ren' : ''}
                                                </p>
                                                {request?.children_ages && (
                                                    <p className="text-slate-500 text-sm mt-1">
                                                        Ages: {request.children_ages.join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {request?.special_requirements && (
                                    <div className="mt-10 pt-8 border-t border-slate-50">
                                        <div className="flex items-center gap-2 mb-4 text-primary-900 font-bold text-sm uppercase tracking-wider">
                                            <Info size={16} className="text-primary-600" />
                                            Special Requirements
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-700 leading-relaxed text-lg italic shadow-inner">
                                            "{request.special_requirements}"
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Caregiver Profile Card */}
                        {nanny ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2 text-primary-900">
                                    <h2 className="text-xl font-bold font-display tracking-tight uppercase tracking-[0.1em] text-sm">Assigned Caregiver</h2>
                                    {nanny.is_verified && (
                                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                            <ShieldCheck size={14} fill="currentColor" className="text-emerald-50" />
                                            Verified Professional
                                        </div>
                                    )}
                                </div>
                                <ProfileCard
                                    name={`${nanny.profiles?.first_name} ${nanny.profiles?.last_name}`}
                                    rating={4.9}
                                    reviewCount={nanny.totalReviews || 0}
                                    location={nanny.profiles?.address || ''}
                                    description={nanny.nanny_details?.bio || ''}
                                    hourlyRate={Number(nanny.nanny_details?.hourly_rate) || 0}
                                    experience={`${nanny.nanny_details?.experience_years} years`}
                                    isVerified={nanny.is_verified}
                                    onViewProfile={() => router.push(`/caregiver/${nanny.id}`)}
                                    hideBookButton={true}
                                />
                            </div>
                        ) : (
                            <div className="bg-white rounded-[32px] border border-slate-100 p-10 flex flex-col items-center justify-center text-center shadow-soft-lg">
                                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-300 mb-6">
                                    <Users size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-primary-900 mb-2 font-display">Searching for a Match</h3>
                                <p className="text-slate-500 max-w-sm">Our team is currently matching you with the best available caregiver for this request.</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Actions Area */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-soft-xl p-8 sticky top-24">
                            <h3 className="text-sm font-black text-primary-900 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-slate-100">Booking Actions</h3>

                            <div className="space-y-4">
                                {/* Chat Action - Now primary in detail view */}
                                {['CONFIRMED', 'IN_PROGRESS', 'ACCEPTED'].includes(currentStatus) && (
                                    <Button
                                        variant="outline"
                                        onClick={() => router.push(`/messages?booking=${bookingId}`)}
                                        className="w-full h-14 rounded-2xl flex items-center justify-between px-6 border-accent-100 text-accent-700 hover:bg-accent-50 hover:border-accent-200 transition-all font-bold group shadow-sm bg-accent-50/10"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-accent-100 flex items-center justify-center text-accent-700 shadow-sm group-hover:scale-110 transition-transform">
                                                <MessageSquare size={16} />
                                            </div>
                                            Open Secure Chat
                                        </div>
                                        <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                    </Button>
                                )}

                                {/* Reschedule */}
                                {['PENDING', 'ASSIGNED', 'ACCEPTED', 'CONFIRMED'].includes(currentStatus) && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsRescheduleModalOpen(true)}
                                        className="w-full h-14 rounded-2xl flex items-center gap-3 px-6 border-slate-100 text-slate-600 hover:bg-slate-50 transition-all font-bold shadow-sm"
                                    >
                                        <Calendar size={18} />
                                        Reschedule
                                    </Button>
                                )}

                                {/* Cancel */}
                                {['PENDING', 'ASSIGNED', 'ACCEPTED', 'CONFIRMED', 'IN_PROGRESS'].includes(currentStatus) && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsCancelModalOpen(true)}
                                        className="w-full h-14 rounded-2xl flex items-center gap-3 px-6 border-red-50 text-red-500 hover:bg-red-50 hover:border-red-100 transition-all font-bold shadow-sm"
                                    >
                                        <AlertCircle size={18} />
                                        Cancel Booking
                                    </Button>
                                )}

                                {/* Completed Actions */}
                                {currentStatus === 'COMPLETED' && (
                                    <div className="space-y-4">
                                        {!isPaid ? (
                                            <Button
                                                onClick={handlePayNow}
                                                disabled={paymentLoading}
                                                className="w-full h-14 rounded-2xl bg-primary-900 text-white hover:bg-primary-800 transition-all font-bold shadow-lg shadow-primary-900/10"
                                            >
                                                {paymentLoading ? 'Processing...' : 'Complete Payment'}
                                            </Button>
                                        ) : (
                                            <div className="w-full h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center gap-2 font-bold shadow-inner">
                                                <ShieldCheck size={20} />
                                                Payment Completed
                                            </div>
                                        )}

                                        <Button
                                            onClick={() => setIsReviewModalOpen(true)}
                                            disabled={!isPaid}
                                            className={`w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all ${isPaid
                                                ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/10'
                                                : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
                                                }`}
                                        >
                                            <Star size={18} />
                                            Leave a Review
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Booking Stats / Metadata */}
                            <div className="mt-10 pt-8 border-t border-slate-50 space-y-4">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest">Rate</span>
                                    <span className="text-primary-900 font-black">₹{nanny?.nanny_details?.hourly_rate || '20'}/hr</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest">Estimated Total</span>
                                    <span className="text-slate-900 font-black">₹{(Number(nanny?.nanny_details?.hourly_rate || 20) * (request?.duration_hours || 4))}</span>
                                </div>
                            </div>
                        </div>

                        {/* Help / Support Mini Card */}
                        <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-[32px] p-8 text-white shadow-soft-xl relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500"></div>
                            <h4 className="text-lg font-bold font-display mb-2 relative z-10">Need Assistance?</h4>
                            <p className="text-primary-100/70 text-sm leading-relaxed mb-6 relative z-10">Our care support team is available 24/7 for any questions regarding this booking.</p>
                            <Button
                                variant="outline"
                                onClick={() => router.push('/support')}
                                className="w-full rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 font-bold relative z-10"
                            >
                                Contact Support
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

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

            {
                isRescheduleModalOpen && (
                    <RescheduleModal
                        isOpen={isRescheduleModalOpen}
                        onClose={() => setIsRescheduleModalOpen(false)}
                        onConfirm={confirmedReschedule}
                        serviceType={request?.category === 'CC' ? 'Child Care' : 'Service'}
                        currentDate={request?.date || ''}
                        currentStartTime={request?.start_time || '09:00'}
                        currentEndTime={request?.end_time || '13:00'}
                    />
                )
            }
        </ParentLayout>
    );
}
