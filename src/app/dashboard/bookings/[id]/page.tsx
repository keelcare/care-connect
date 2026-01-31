'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking, Review } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import {
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  Star,
  Navigation,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/Modal';
import { CancellationModal } from '@/components/ui/CancellationModal';
import { ReviewForm } from '@/components/features/ReviewForm';
import { ReviewCard } from '@/components/features/ReviewCard';
import { LiveLocationTracker } from '@/components/location/LiveLocationTracker';
import styles from './page.module.css';

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
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
      setError(
        err instanceof Error ? err.message : 'Failed to load booking details'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartBooking = async () => {
    if (!booking) return;
    try {
      setActionLoading(true);
      const updated = await api.bookings.start(booking.id);
      setBooking(updated);
    } catch (err) {
      console.error('Failed to start booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to start booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteBooking = async () => {
    if (!booking) return;
    try {
      setActionLoading(true);
      const updated = await api.bookings.complete(booking.id);
      setBooking(updated);
    } catch (err) {
      console.error('Failed to complete booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to complete booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async (reason: string) => {
    if (!booking) return;

    try {
      setActionLoading(true);
      const updated = await api.bookings.cancel(booking.id, { reason });
      setBooking(updated);
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to cancel booking');
      throw err; // Re-throw so the modal knows it failed
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenChat = () => {
    router.push(`/dashboard/messages?booking=${bookingId}`);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-primary-100 text-primary-700';
      case 'IN_PROGRESS':
        return 'bg-stone-100 text-stone-700';
      case 'COMPLETED':
        return 'bg-primary-100 text-primary-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  const getOtherParty = () => {
    if (!booking) return null;
    return user?.role === 'nanny' ? booking.parent : booking.nanny;
  };

  const getOtherPartyName = () => {
    const otherParty = getOtherParty();
    if (!otherParty) return 'Unknown';

    return otherParty.profiles?.first_name && otherParty.profiles?.last_name
      ? `${otherParty.profiles.first_name} ${otherParty.profiles.last_name}`
      : otherParty.email;
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center p-8">
        <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
        <Button onClick={() => router.push('/dashboard/bookings')}>
          Back to Bookings
        </Button>
      </div>
    );
  }

  const startDateTime = formatDateTime(booking.start_time);
  const endDateTime = booking.end_time
    ? formatDateTime(booking.end_time)
    : null;
  const otherParty = getOtherParty();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/dashboard/bookings')}
          className="rounded-xl"
        >
          ← Back
        </Button>
        <h1 className="text-3xl font-bold text-neutral-900 font-display">
          Booking Details
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[32px] border border-neutral-100 shadow-soft p-8">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-100">
              <h2 className="text-2xl font-bold text-neutral-900">
                {booking.job?.title || 'Booking'}
              </h2>
              <span
                className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${getStatusClass(booking.status)}`}
              >
                {booking.status.toLowerCase().replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-900 flex-shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-500 mb-1">
                    Date
                  </p>
                  <p className="text-stone-900 font-medium">
                    {startDateTime.date}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-500 mb-1">
                    Time
                  </p>
                  <p className="text-stone-900 font-medium">
                    {startDateTime.time}
                    {endDateTime && ` - ${endDateTime.time}`}
                  </p>
                </div>
              </div>

              {booking.job?.location_lat && booking.job?.location_lng && (
                <div className="flex items-start gap-4 md:col-span-2">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-500 mb-1">
                      Location
                    </p>
                    <p className="text-stone-900 font-medium">
                      {otherParty?.profiles?.address || 'Address not provided'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {booking.job?.description && (
              <div className="mb-8 pt-6 border-t border-neutral-100">
                <h3 className="text-lg font-bold text-neutral-900 mb-3">
                  Description
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {booking.job.description}
                </p>
              </div>
            )}

            {booking.cancellation_reason && (
              <div className="mb-8 pt-6 border-t border-neutral-100">
                <h3 className="text-lg font-bold text-red-600 mb-3">
                  Cancellation Reason
                </h3>
                <p className="text-neutral-600 bg-red-50 p-4 rounded-xl border border-red-100">
                  {booking.cancellation_reason}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={handleOpenChat}
              className="rounded-xl flex items-center gap-2"
            >
              <MessageCircle size={18} />
              Open Chat
            </Button>

            {actionLoading ? (
              <div className="px-6 py-2">
                <Spinner />
              </div>
            ) : (
              <>
                {booking.status === 'CONFIRMED' && user?.role === 'nanny' && (
                  <Button
                    className="rounded-xl shadow-lg hover:shadow-xl transition-all"
                    onClick={handleStartBooking}
                  >
                    Start Booking
                  </Button>
                )}

                {booking.status === 'IN_PROGRESS' && (
                  <Button
                    className="rounded-xl shadow-lg hover:shadow-xl transition-all"
                    onClick={handleCompleteBooking}
                  >
                    Complete Booking
                  </Button>
                )}

                {(booking.status === 'CONFIRMED' ||
                  booking.status === 'IN_PROGRESS') && (
                    <Button
                      variant="outline"
                      className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                      onClick={() => setIsCancelModalOpen(true)}
                    >
                      Cancel Booking
                    </Button>
                  )}

                {booking.status === 'COMPLETED' && !review && (
                  <Button
                    className="rounded-xl shadow-lg hover:shadow-xl transition-all bg-yellow-500 hover:bg-yellow-600 text-white"
                    onClick={() => setIsReviewModalOpen(true)}
                  >
                    <Star size={18} className="mr-2" />
                    Leave a Review
                  </Button>
                )}
              </>
            )}
          </div>

          {review && (
            <div className="bg-white rounded-[32px] border border-neutral-100 shadow-soft p-8">
              <h3 className="text-xl font-bold text-neutral-900 mb-6">
                Your Review
              </h3>
              <ReviewCard review={review} />
            </div>
          )}

          {/* Live Location Tracker - Only for parents during active bookings */}
          {user?.role === 'parent' &&
            (booking.status === 'CONFIRMED' ||
              booking.status === 'IN_PROGRESS') && (
              <LiveLocationTracker
                bookingId={bookingId}
                bookingStatus={booking.status}
                nannyName={getOtherPartyName()}
                destinationLat={
                  booking.job?.location_lat
                    ? parseFloat(booking.job.location_lat)
                    : undefined
                }
                destinationLng={
                  booking.job?.location_lng
                    ? parseFloat(booking.job.location_lng)
                    : undefined
                }
              />
            )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-[32px] border border-neutral-100 shadow-soft p-6 sticky top-24">
            <h3 className="text-lg font-bold text-neutral-900 mb-6 pb-4 border-b border-neutral-100">
              {user?.role === 'nanny' ? 'Parent' : 'Nanny'} Information
            </h3>

            {otherParty && (
              <div className="flex items-center gap-4 mb-6">
                <Avatar
                  src={otherParty.profiles?.profile_image_url || undefined}
                  alt={getOtherPartyName()}
                  fallback={getOtherPartyName().charAt(0).toUpperCase()}
                  size="lg"
                  ringColor="bg-neutral-100"
                />
                <div>
                  <p className="font-bold text-neutral-900">
                    {getOtherPartyName()}
                  </p>
                  <p className="text-sm text-neutral-500">{otherParty.email}</p>
                  {otherParty.profiles?.phone && (
                    <p className="text-sm text-neutral-500 mt-1">
                      {otherParty.profiles.phone}
                    </p>
                  )}
                </div>
              </div>
            )}

            {user?.role === 'parent' && booking.nanny?.nanny_details && (
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-500">
                    Experience:
                  </span>
                  <span className="font-medium text-neutral-900">
                    {booking.nanny.nanny_details.experience_years} years
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-500">
                    Hourly Rate:
                  </span>
                  <span className="font-medium text-primary">
                    ₹{booking.nanny.nanny_details.hourly_rate}/hr
                  </span>
                </div>
                {booking.nanny.nanny_details.skills &&
                  booking.nanny.nanny_details.skills.length > 0 && (
                    <div className="pt-2">
                      <span className="text-sm font-medium text-neutral-500 block mb-2">
                        Skills:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {booking.nanny.nanny_details.skills.map(
                          (skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-lg text-xs font-medium"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Write a Review"
        maxWidth="500px"
      >
        <ReviewForm
          bookingId={bookingId}
          onSuccess={() => {
            setIsReviewModalOpen(false);
            fetchBooking();
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
