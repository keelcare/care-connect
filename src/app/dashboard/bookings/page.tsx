'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking, ServiceRequest } from '@/types/api';
import { Plus, Calendar, Clock, MapPin, MessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { useSocket } from '@/context/SocketProvider';
import styles from './page.module.css';

import { ReviewModal } from '@/components/reviews/ReviewModal';

export default function BookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'requests' | 'upcoming' | 'completed' | 'cancelled'
  >('upcoming');

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );

  const { onRefresh, offRefresh } = useSocket();

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (user?.role === 'nanny') {
        const [bookingsData, assignmentsData] = await Promise.all([
          api.bookings.getNannyBookings(),
          api.assignments.getNannyAssignments(),
        ]);

        // Fetch parent details for bookings that don't have profile info
        const enrichedBookings = await Promise.all(
          bookingsData.map(async (booking) => {
            if (booking.parent?.profiles?.first_name) {
              return booking;
            }
            if (booking.parent_id) {
              try {
                const parentDetails = await api.users.get(booking.parent_id);
                return { ...booking, parent: parentDetails };
              } catch (err) {
                console.error(
                  `Failed to fetch parent details for booking ${booking.id}:`,
                  err
                );
                return booking;
              }
            }
            return booking;
          })
        );

        setBookings(enrichedBookings);
        setAssignments(assignmentsData);
      } else if (user?.role === 'parent') {
        const [bookingsData, requestsData] = await Promise.all([
          api.bookings.getParentBookings(),
          api.requests.getParentRequests(),
        ]);

        // Fetch nanny details for bookings that don't have profile info
        const enrichedBookings = await Promise.all(
          bookingsData.map(async (booking) => {
            if (booking.nanny?.profiles?.first_name) {
              return booking;
            }
            if (booking.nanny_id) {
              try {
                const nannyDetails = await api.users.get(booking.nanny_id);
                return { ...booking, nanny: nannyDetails };
              } catch (err) {
                console.error(
                  `Failed to fetch nanny details for booking ${booking.id}:`,
                  err
                );
                return booking;
              }
            }
            return booking;
          })
        );

        setBookings(enrichedBookings);
        setRequests(requestsData);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  useEffect(() => {
    const handleRefresh = (data: any) => {
      console.log('Nanny/User Bookings Page - Received Refresh Event:', data);
      if (data.category === 'booking' || data.category === 'request' || data.category === 'message') {
        fetchData();
      }
    };

    onRefresh(handleRefresh);
    return () => offRefresh(handleRefresh);
  }, [onRefresh, offRefresh, fetchData]);

  const handleStartBooking = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);
      const updated = await api.bookings.start(bookingId);
      setBookings(bookings.map((b) => (b.id === bookingId ? updated : b)));
    } catch (err) {
      console.error('Failed to start booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to start booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      setActionLoading(bookingId);
      const updated = await api.bookings.complete(bookingId);
      setBookings(bookings.map((b) => (b.id === bookingId ? updated : b)));
    } catch (err) {
      console.error('Failed to complete booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to complete booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const reason = prompt('Please provide a reason for cancellation:');
    if (!reason) return;

    try {
      setActionLoading(bookingId);
      const updated = await api.bookings.cancel(bookingId, { reason });
      setBookings(bookings.map((b) => (b.id === bookingId ? updated : b)));
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAcceptAssignment = async (assignmentId: string) => {
    try {
      setActionLoading(assignmentId);
      await api.assignments.accept(assignmentId);
      await fetchData(); // Refresh all data
    } catch (err) {
      console.error(err);
      alert('Failed to accept assignment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectAssignment = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to reject this request?')) return;

    try {
      setActionLoading(assignmentId);
      await api.assignments.reject(assignmentId);
      await fetchData(); // Refresh all data
    } catch (err) {
      console.error(err);
      alert('Failed to reject assignment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleOpenReview = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsReviewModalOpen(true);
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-primary-100 text-primary-700';
      case 'IN_PROGRESS':
        return 'bg-stone-100 text-stone-700';
      case 'COMPLETED':
        return 'bg-stone-100 text-stone-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'PENDING':
        return 'bg-amber-100 text-amber-700';
      case 'ASSIGNED':
        return 'bg-stone-100 text-stone-700';
      case 'ACCEPTED':
        return 'bg-primary-100 text-primary-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'accepted':
        return 'bg-primary-100 text-primary-700';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
    };
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getOtherPartyName = (booking: Booking) => {
    const flatName = (booking as any)[user?.role === 'nanny' ? 'parent_name' : 'nanny_name'];
    if (flatName) return flatName;

    if (user?.role === 'nanny') {
      return booking.parent?.profiles?.first_name &&
        booking.parent?.profiles?.last_name
        ? `${booking.parent.profiles.first_name} ${booking.parent.profiles.last_name}`
        : booking.parent?.email || 'Parent';
    } else {
      return booking.nanny?.profiles?.first_name &&
        booking.nanny?.profiles?.last_name
        ? `${booking.nanny.profiles.first_name} ${booking.nanny.profiles.last_name}`
        : booking.nanny?.email || 'Nanny';
    }
  };

  const renderActionButtons = (booking: Booking) => {
    if (actionLoading === booking.id) {
      return <Spinner />;
    }

    const buttons = [];
    if (['CONFIRMED', 'IN_PROGRESS'].includes(booking.status)) {
      buttons.push(
        <Button
          key="chat"
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/messages?booking=${booking.id}`)}
          className="rounded-xl border-accent-100 text-accent-700 hover:bg-accent-50"
        >
          <MessageSquare size={16} className="mr-1" />
          Chat
        </Button>
      );
    }

    if (booking.status === 'CONFIRMED' && user?.role === 'nanny') {
      buttons.push(
        <Button
          key="start"
          size="sm"
          onClick={() => handleStartBooking(booking.id)}
          className="rounded-xl"
        >
          Start
        </Button>
      );
    }

    if (booking.status === 'IN_PROGRESS') {
      buttons.push(
        <Button
          key="complete"
          size="sm"
          onClick={() => handleCompleteBooking(booking.id)}
          className="rounded-xl"
        >
          Complete
        </Button>
      );
    }

    if (booking.status === 'CONFIRMED' || booking.status === 'IN_PROGRESS') {
      buttons.push(
        <Button
          key="cancel"
          variant="outline"
          size="sm"
          onClick={() => handleCancelBooking(booking.id)}
          className="rounded-xl border-neutral-200"
        >
          Cancel
        </Button>
      );
    }

    if (booking.status === 'COMPLETED') {
      buttons.push(
        <Button
          key="review"
          size="sm"
          onClick={() => handleOpenReview(booking.id)}
          className="rounded-xl"
        >
          Leave Review
        </Button>
      );
    }

    return buttons.length > 0 ? (
      <div className="flex gap-2">{buttons}</div>
    ) : null;
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'upcoming')
      return ['CONFIRMED', 'IN_PROGRESS', 'PENDING'].includes(booking.status);
    if (activeTab === 'completed') return booking.status === 'COMPLETED';
    if (activeTab === 'cancelled') return booking.status === 'CANCELLED';
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">
            My Bookings
          </h1>
        </div>
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 font-display">
            My Bookings
          </h1>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 font-display">
            My Bookings
          </h1>
          <p className="text-neutral-500 mt-1">
            Manage your appointments and requests
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 overflow-x-auto">
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'requests' ? 'text-primary-900' : 'text-neutral-500 hover:text-neutral-700'}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests
          {activeTab === 'requests' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full"></div>
          )}
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'upcoming' ? 'text-primary-900' : 'text-neutral-500 hover:text-neutral-700'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
          {activeTab === 'upcoming' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full"></div>
          )}
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'completed' ? 'text-primary-900' : 'text-neutral-500 hover:text-neutral-700'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
          {activeTab === 'completed' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full"></div>
          )}
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === 'cancelled' ? 'text-primary-900' : 'text-neutral-500 hover:text-neutral-700'}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
          {activeTab === 'cancelled' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full"></div>
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'requests' ? (
        <div className="space-y-6">
          {user?.role === 'nanny' ? (
            // Nanny Assignments View
            assignments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-[24px] border border-neutral-100 shadow-soft">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3 text-primary-900">
                  <Calendar size={24} />
                </div>
                <h3 className="text-lg font-bold text-primary-900 mb-1">
                  No New Requests
                </h3>
                <p className="text-stone-500 text-sm">
                  You don't have any pending service requests.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assignment) => {
                  const request = assignment.request;
                  if (!request) return null;
                  return (
                    <div
                      key={assignment.id}
                      className="group block bg-white rounded-[24px] border border-neutral-100 shadow-soft hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${getStatusBadgeStyles(assignment.status)}`}
                          >
                            {assignment.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-neutral-400 font-medium">
                            {new Date(
                              assignment.assigned_at
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-primary-900 mb-4">
                          Request from{' '}
                          {request.parent?.profiles?.first_name || 'Parent'}
                        </h3>

                        <div className="space-y-3 text-sm text-neutral-600">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                              <Calendar size={16} />
                            </div>
                            <span>
                              {new Date(request.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                              <Clock size={16} />
                            </div>
                            <span>
                              {request.start_time} ({request.duration_hours}{' '}
                              hrs)
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                              <MapPin size={16} />
                            </div>
                            <span className="truncate">
                              {request.parent?.profiles?.address ||
                                'Location hidden'}
                            </span>
                          </div>
                        </div>

                        {assignment.status === 'pending' && (
                          <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button
                              variant="outline"
                              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() =>
                                handleRejectAssignment(assignment.id)
                              }
                              disabled={actionLoading === assignment.id}
                            >
                              Reject
                            </Button>
                            <Button
                              className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                              onClick={() =>
                                handleAcceptAssignment(assignment.id)
                              }
                              disabled={actionLoading === assignment.id}
                            >
                              {actionLoading === assignment.id
                                ? '...'
                                : 'Accept'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : // Parent Requests View
            requests.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-[24px] border border-neutral-100 shadow-soft">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-900">
                  <Plus size={32} />
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">
                  No Requests Yet
                </h3>
                <p className="text-neutral-500 mb-6 max-w-md mx-auto">
                  You haven't created any service requests yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((request) => (
                  <Link
                    href={`/dashboard/requests/${request.id}`}
                    key={request.id}
                    className="group block bg-white rounded-[24px] border border-neutral-100 shadow-soft hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${getStatusBadgeStyles(request.status)}`}
                        >
                          {request.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-neutral-400 font-medium">
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-primary-900 mb-4 group-hover:text-primary-700 transition-colors">
                        Care for {request.num_children} Child
                        {request.num_children !== 1 ? 'ren' : ''}
                      </h3>

                      <div className="space-y-3 text-sm text-neutral-600">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                            <Calendar size={16} />
                          </div>
                          <span>
                            {new Date(request.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                            <Clock size={16} />
                          </div>
                          <span>
                            {request.start_time} ({request.duration_hours} hrs)
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                            <MapPin size={16} />
                          </div>
                          <span className="truncate">
                            {request.location?.address || 'No location specified'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
        </div>
      ) : // Bookings List (Upcoming, Completed, Cancelled)
        filteredBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[24px] border border-neutral-100 shadow-soft">
            <p className="text-neutral-500 mb-6">
              No {activeTab} bookings found.
            </p>
            <Button
              onClick={() =>
              (window.location.href =
                user?.role === 'nanny' ? '/dashboard' : '/search')
              }
              className="rounded-xl"
            >
              {user?.role === 'nanny' ? 'View Jobs' : 'Find Care'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const { day, month } = formatDate(booking.start_time);
              return (
                <div
                  key={booking.id}
                  className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-soft flex flex-col md:flex-row md:items-center gap-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0 w-16 h-16 bg-neutral-100 rounded-2xl flex flex-col items-center justify-center text-primary-900">
                      <span className="text-xs font-bold uppercase">{month}</span>
                      <span className="text-xl font-bold">{day}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary-900">
                        {getOtherPartyName(booking)}
                      </h3>
                      <p className="text-neutral-500 text-sm mb-1">
                        Care for {(booking as any).num_children || (booking.job as any)?.num_children || 1} Child{((booking as any).num_children || (booking.job as any)?.num_children || 1) !== 1 ? 'ren' : ''}
                      </p>
                      <p className="text-neutral-400 text-xs">
                        {formatTime(booking.start_time)}
                        {booking.end_time && ` - ${formatTime(booking.end_time)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-neutral-100 pt-4 md:pt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyles(booking.status)}`}
                    >
                      {booking.status.toLowerCase().replace('_', ' ')}
                    </span>
                    {renderActionButtons(booking)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {selectedBookingId && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          bookingId={selectedBookingId}
          onSuccess={() => {
            // Optional: Refresh data or show success message
            fetchData();
          }}
        />
      )}
    </div>
  );
}
