'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking, User } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import {
  Calendar,
  Clock,
  MapPin,
  User as UserIcon,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

// Extended booking type to handle Prisma relation names from backend
interface AdminBooking extends Booking {
  // Prisma relation names from backend
  jobs?: {
    title?: string;
    description?: string;
    location_lat?: string;
    location_lng?: string;
  };
  users_bookings_parent_idTousers?: User;
  users_bookings_nanny_idTousers?: User;
}

export default function AdminBookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<AdminBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, user]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = (await api.bookings.get(bookingId)) as AdminBooking;

      // Enrich booking with parent/nanny details if not already populated
      let enrichedBooking = { ...data };

      // Fetch parent details if missing
      const parentFromPrisma = data.users_bookings_parent_idTousers;
      const parentFromBooking = data.parent;

      if (
        !parentFromPrisma?.profiles?.first_name &&
        !parentFromBooking?.profiles?.first_name &&
        data.parent_id
      ) {
        try {
          const parentDetails = await api.users.get(data.parent_id);
          enrichedBooking.parent = parentDetails;
        } catch (err) {
          console.error(`Failed to fetch parent details:`, err);
        }
      }

      // Fetch nanny details if missing
      const nannyFromPrisma = data.users_bookings_nanny_idTousers;
      const nannyFromBooking = data.nanny;

      if (
        !nannyFromPrisma?.profiles?.first_name &&
        !nannyFromBooking?.profiles?.first_name &&
        data.nanny_id
      ) {
        try {
          const nannyDetails = await api.users.get(data.nanny_id);
          enrichedBooking.nanny = nannyDetails;
        } catch (err) {
          console.error(`Failed to fetch nanny details:`, err);
        }
      }

      setBooking(enrichedBooking);
    } catch (err) {
      console.error('Failed to fetch booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get job info from various sources
  const getJobInfo = (booking: AdminBooking) => {
    return booking.jobs || booking.job || null;
  };

  // Helper function to get job title
  const getJobTitle = (booking: AdminBooking): string => {
    const job = getJobInfo(booking);
    return job?.title || 'Direct Booking';
  };

  // Helper function to get parent info
  const getParentInfo = (booking: AdminBooking): User | null => {
    return booking.users_bookings_parent_idTousers || booking.parent || null;
  };

  // Helper function to get nanny info
  const getNannyInfo = (booking: AdminBooking): User | null => {
    return booking.users_bookings_nanny_idTousers || booking.nanny || null;
  };

  // Helper function to get user display name
  const getUserName = (user: User | null): string => {
    if (!user) return 'N/A';
    if (user.profiles?.first_name && user.profiles?.last_name) {
      return `${user.profiles.first_name} ${user.profiles.last_name}`;
    }
    return user.email || 'N/A';
  };

  const handleCompleteBooking = async () => {
    if (!booking) return;
    if (!confirm('Are you sure you want to mark this booking as completed?'))
      return;

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

  const handleCancelBooking = async () => {
    if (!booking) return;
    const reason = prompt(
      'Please provide a reason for cancellation (Admin Action):'
    );
    if (!reason) return;

    try {
      setActionLoading(true);
      const updated = await api.bookings.cancel(booking.id, {
        reason: `Admin Cancelled: ${reason}`,
      });
      setBooking(updated);
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setActionLoading(false);
    }
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
        return 'bg-emerald-100 text-emerald-700';
      case 'IN_PROGRESS':
        return 'bg-stone-100 text-stone-700';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-stone-100 text-stone-700';
    }
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
        <Button onClick={() => router.push('/admin/bookings')}>
          Back to Bookings
        </Button>
      </div>
    );
  }

  const startDateTime = formatDateTime(booking.start_time);
  const endDateTime = booking.end_time
    ? formatDateTime(booking.end_time)
    : null;
  const jobInfo = getJobInfo(booking);
  const parentInfo = getParentInfo(booking);
  const nannyInfo = getNannyInfo(booking);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin')}
          className="rounded-xl"
        >
          ← Back to Dashboard
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/bookings')}
          className="rounded-xl"
        >
          ← Back to Bookings
        </Button>
        <h1 className="text-3xl font-bold text-neutral-900 font-display">
          Booking Details (Admin)
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[32px] border border-neutral-100 shadow-soft p-8">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-100">
              <h2 className="text-2xl font-bold text-neutral-900">
                {getJobTitle(booking)}
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
                  <p className="text-sm font-medium text-neutral-500 mb-1">
                    Date
                  </p>
                  <p className="text-neutral-900 font-medium">
                    {startDateTime.date}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500 mb-1">
                    Time
                  </p>
                  <p className="text-neutral-900 font-medium">
                    {startDateTime.time}
                    {endDateTime && ` - ${endDateTime.time}`}
                  </p>
                </div>
              </div>

              {jobInfo?.location_lat && jobInfo?.location_lng && (
                <div className="flex items-start gap-4 md:col-span-2">
                  <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500 mb-1">
                      Location
                    </p>
                    <p className="text-neutral-900 font-medium">
                      {parentInfo?.profiles?.address || 'Address not provided'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {jobInfo?.description && (
              <div className="mb-8 pt-6 border-t border-neutral-100">
                <h3 className="text-lg font-bold text-neutral-900 mb-3">
                  Description
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {jobInfo.description}
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
            {actionLoading ? (
              <div className="px-6 py-2">
                <Spinner />
              </div>
            ) : (
              <>
                {booking.status === 'IN_PROGRESS' && (
                  <Button
                    className="rounded-xl shadow-lg hover:shadow-xl transition-all bg-green-600 hover:bg-green-700"
                    onClick={handleCompleteBooking}
                  >
                    <CheckCircle className="mr-2" size={18} />
                    Mark as Completed
                  </Button>
                )}

                {(booking.status === 'CONFIRMED' ||
                  booking.status === 'IN_PROGRESS' ||
                  booking.status === 'REQUESTED') && (
                    <Button
                      variant="outline"
                      className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                      onClick={handleCancelBooking}
                    >
                      <XCircle className="mr-2" size={18} />
                      Cancel Booking
                    </Button>
                  )}
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Parent Details */}
          <div className="bg-white rounded-[32px] border border-neutral-100 shadow-soft p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-6 pb-4 border-b border-neutral-100 flex items-center gap-2">
              <UserIcon size={20} className="text-stone-900" />
              Parent Information
            </h3>

            {parentInfo ? (
              <div className="flex items-center gap-4 mb-4">
                <Avatar
                  src={parentInfo.profiles?.profile_image_url || undefined}
                  alt={parentInfo.profiles?.first_name || 'Parent'}
                  fallback={parentInfo.profiles?.first_name?.[0] || 'P'}
                  size="lg"
                  ringColor="bg-stone-100"
                />
                <div>
                  <p className="font-bold text-neutral-900">
                    {getUserName(parentInfo)}
                  </p>
                  <p className="text-sm text-neutral-500">{parentInfo.email}</p>
                  {parentInfo.profiles?.phone && (
                    <p className="text-sm text-neutral-500 mt-1">
                      {parentInfo.profiles.phone}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-neutral-500">
                No parent information available
              </p>
            )}
          </div>

          {/* Nanny Details */}
          <div className="bg-white rounded-[32px] border border-neutral-100 shadow-soft p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-6 pb-4 border-b border-neutral-100 flex items-center gap-2">
              <UserIcon size={20} className="text-secondary" />
              Nanny Information
            </h3>

            {nannyInfo ? (
              <div className="flex items-center gap-4 mb-4">
                <Avatar
                  src={nannyInfo.profiles?.profile_image_url || undefined}
                  alt={nannyInfo.profiles?.first_name || 'Nanny'}
                  fallback={nannyInfo.profiles?.first_name?.[0] || 'N'}
                  size="lg"
                  ringColor="bg-secondary/10"
                />
                <div>
                  <p className="font-bold text-neutral-900">
                    {getUserName(nannyInfo)}
                  </p>
                  <p className="text-sm text-neutral-500">{nannyInfo.email}</p>
                  {nannyInfo.profiles?.phone && (
                    <p className="text-sm text-neutral-500 mt-1">
                      {nannyInfo.profiles.phone}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-neutral-500">No nanny information available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
