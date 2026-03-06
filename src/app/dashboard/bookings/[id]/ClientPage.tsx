'use client';

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
  ShieldCheck,
  ArrowRight,
  Info,
  CalendarCheck,
  AlertCircle,
  Play,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { Avatar } from '@/components/ui/avatar';
import { ReviewForm } from '@/components/features/ReviewForm';
import { ReviewCard } from '@/components/features/ReviewCard';
import { CancellationModal } from '@/components/ui/CancellationModal';
import { Modal } from '@/components/ui/Modal';

export default function BookingDetailsPage() {
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
      if (reviewsData && reviewsData.length > 0) {
        setReview(reviewsData[0]);
      }
    } catch (err) {
      console.error('Failed to fetch booking details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load details');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStartBooking = async () => {
    if (!booking) return;
    try {
      setActionLoading('starting');
      const updated = await api.bookings.start(booking.id);
      setBooking(updated);
    } catch (err) {
      console.error('Failed to start booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to start booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteBooking = async () => {
    if (!booking) return;
    try {
      setActionLoading('completing');
      const updated = await api.bookings.complete(booking.id);
      setBooking(updated);
    } catch (err) {
      console.error('Failed to complete booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to complete booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelBooking = async (reason: string) => {
    if (!booking) return;
    try {
      setActionLoading('cancelling');
      const updated = await api.bookings.cancel(booking.id, { reason });
      setBooking(updated);
      setIsCancelModalOpen(false);
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      // alert(err instanceof Error ? err.message : 'Failed to cancel');
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-primary-900 mb-2">Booking Not Found</h2>
        <p className="text-slate-500 mb-8">{error || "We couldn't find the details for this booking."}</p>
        <Button onClick={() => router.push('/dashboard/bookings')} className="bg-primary-900">
          Back to All Bookings
        </Button>
      </div>
    );
  }

  const currentStatus = booking.status.toUpperCase();
  const otherParty = booking.parent;

  return (
    <div className="max-w-7xl mx-auto py-10">
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => router.push('/dashboard/bookings')}
          className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-700 hover:border-primary-100 hover:bg-primary-50 transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold font-display text-primary-900 tracking-tight">
            Booking Details
          </h1>
          <p className="text-slate-400 text-sm font-mono uppercase tracking-[0.2em] mt-1">
            ID: {booking.id}
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
                        {new Date(booking.start_time).toLocaleDateString(undefined, {
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
                        {formatTime(booking.start_time)}
                        {booking.end_time && (
                          <span className="text-slate-400 font-normal text-sm ml-2 block md:inline mt-1 md:mt-0">
                            (until {formatTime(booking.end_time)})
                          </span>
                        )}
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
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Parent's Location</span>
                      <p className="text-primary-900 font-bold text-lg font-display leading-snug">
                        {otherParty?.profiles?.address || 'Verified Home Listing'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700 shadow-inner group-hover:scale-110 transition-transform duration-300">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Job Details</span>
                      <p className="text-primary-900 font-bold text-lg font-display leading-tight">
                        {booking.job?.title || 'Child Care Booking'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {booking.job?.description && (
                <div className="mt-10 pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-2 mb-4 text-primary-900 font-bold text-sm uppercase tracking-wider">
                    <Info size={16} className="text-primary-600" />
                    Job Description
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-700 leading-relaxed text-lg italic shadow-inner">
                    "{booking.job.description}"
                  </div>
                </div>
              )}

              {booking.cancellation_reason && (
                <div className="mt-10 pt-8 border-t border-red-50">
                  <div className="flex items-center gap-2 mb-4 text-red-600 font-bold text-sm uppercase tracking-wider">
                    <AlertCircle size={16} />
                    Cancellation Reason
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-700 leading-relaxed font-medium">
                    {booking.cancellation_reason}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Parent Profile Card */}
          {otherParty && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display tracking-tight uppercase tracking-[0.1em] text-sm px-2">Assigned Parent</h2>
              <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-soft-xl flex flex-col md:flex-row md:items-center gap-6">
                <Avatar
                  src={otherParty.profiles?.profile_image_url || undefined}
                  alt={otherParty.profiles?.first_name || 'Parent'}
                  fallback={otherParty.profiles?.first_name?.[0] || 'P'}
                  size="xl"
                  ringColor="bg-slate-100"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold text-primary-900">{otherParty.profiles?.first_name} {otherParty.profiles?.last_name}</h3>
                  </div>
                  <p className="text-slate-500 mb-4">{otherParty.email}</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5 text-slate-600 text-sm bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                      <MapPin size={14} className="text-slate-400" />
                      {otherParty.profiles?.address || 'Location Verified'}
                    </div>
                    {otherParty.profiles?.phone && (
                      <div className="text-slate-600 text-sm bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        {otherParty.profiles.phone}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => router.push(`/dashboard/messages?booking=${bookingId}`)}
                  className="rounded-2xl h-12 px-6 bg-accent-500 hover:bg-accent-600 text-white shadow-lg shadow-accent-500/10 flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0"
                >
                  <MessageSquare size={18} />
                  Message
                </Button>
              </div>
            </div>
          )}

          {/* Review Card if exists */}
          {review && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display tracking-tight uppercase tracking-[0.1em] text-sm px-2">Booking Review</h2>
              <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-soft-xl">
                <ReviewCard review={review} />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Actions Area */}
        <div className="space-y-8">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-soft-xl p-8 sticky top-24">
            <h3 className="text-sm font-black text-primary-900 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-slate-100">Nanny Actions</h3>

            <div className="space-y-4">
              {actionLoading ? (
                <div className="flex justify-center p-4">
                  <Spinner />
                </div>
              ) : (
                <>
                  {booking.status === 'CONFIRMED' && (
                    <Button
                      onClick={handleStartBooking}
                      className="w-full h-14 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-500/10 flex items-center justify-between px-6 group"
                    >
                      <div className="flex items-center gap-3">
                        <Play size={18} fill="currentColor" />
                        Start This Job
                      </div>
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    </Button>
                  )}

                  {booking.status === 'IN_PROGRESS' && (
                    <Button
                      onClick={handleCompleteBooking}
                      className="w-full h-14 rounded-2xl bg-primary-900 text-white hover:bg-primary-800 transition-all font-bold shadow-lg shadow-primary-900/10 flex items-center justify-between px-6 group"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle size={18} />
                        Mark as Complete
                      </div>
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                    </Button>
                  )}

                  {['CONFIRMED', 'IN_PROGRESS'].includes(booking.status) && (
                    <Button
                      variant="outline"
                      onClick={() => setIsCancelModalOpen(true)}
                      className="w-full h-14 rounded-2xl border-red-50 text-red-500 hover:bg-red-50 hover:border-red-100 transition-all font-bold shadow-sm flex items-center gap-3 px-6"
                    >
                      <AlertCircle size={18} />
                      Cancel Job
                    </Button>
                  )}

                  {booking.status === 'COMPLETED' && !review && (
                    <Button
                      onClick={() => setIsReviewModalOpen(true)}
                      className="w-full h-14 rounded-2xl bg-amber-500 text-white hover:bg-amber-600 transition-all font-bold shadow-lg shadow-amber-500/10 flex items-center gap-3 px-6"
                    >
                      <Star size={18} />
                      Leave a Review
                    </Button>
                  )}
                </>
              )}

              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/messages?booking=${bookingId}`)}
                className="w-full h-14 rounded-2xl border-slate-100 text-slate-600 hover:bg-slate-50 transition-all font-bold shadow-sm flex items-center gap-3 px-6"
              >
                <MessageSquare size={18} />
                Booking Chat
              </Button>
            </div>

            {/* Price Metadata */}
            <div className="mt-10 pt-8 border-t border-slate-50 space-y-4">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                <span>Your Hourly Rate</span>
                <span className="text-primary-900">₹{booking.nanny?.nanny_details?.hourly_rate || '25'}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                <span>Total Earnings</span>
                <span className="text-emerald-600">₹{(Number(booking.nanny?.nanny_details?.hourly_rate || 25) * 4).toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Help Overlay */}
          <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-[32px] p-8 text-white shadow-soft-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500"></div>
            <h4 className="text-lg font-bold font-display mb-2 relative z-10">Caregiver Support</h4>
            <p className="text-primary-100/70 text-sm leading-relaxed mb-6 relative z-10">Need help with this booking? Our team is here to assist our nannies 24/7.</p>
            <Button
              variant="outline"
              onClick={() => router.push('/support')}
              className="w-full rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 font-bold relative z-10"
            >
              Contact Help Center
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Write a Review"
        maxWidth="lg"
      >
        <ReviewForm
          bookingId={bookingId}
          onSuccess={() => {
            setIsReviewModalOpen(false);
            fetchData();
          }}
          onCancel={() => setIsReviewModalOpen(false)}
        />
      </Modal>

      <CancellationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelBooking}
        type="booking"
        startTime={booking.start_time}
        title="Cancel Booking"
      />
    </div>
  );
}
