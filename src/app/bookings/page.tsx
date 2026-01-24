'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking, ServiceRequest, User } from '@/types/api';
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  Check,
  ChevronLeft,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import ParentLayout from '@/components/layout/ParentLayout';
import { usePayment } from '@/hooks/usePayment';
import { useSocket } from '@/context/SocketProvider';
import { ProfileCard } from '@/components/features/ProfileCard';
import { CancellationModal } from '@/components/ui/CancellationModal';

import { ReviewModal } from '@/components/reviews/ReviewModal';

export default function ParentBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'requests' | 'upcoming' | 'completed' | 'cancelled'
  >('upcoming');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Payment Hook
  const { handlePayment, loading: paymentLoading } = usePayment();
  const [paidBookingIds, setPaidBookingIds] = useState<string[]>([]); // Simulate DB

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );

  // Socket Integration
  const { onNotification, offNotification } = useSocket();

  useEffect(() => {
    const handleNotification = (data: any) => {
      console.log('Bookings Page - Received Notification:', data);

      // Refresh data on specific notifications
      if (
        data.title === 'Nanny Matched!' ||
        data.title === 'Nanny Cancelled - Re-matching' ||
        data.title === 'No Matches Found'
      ) {
        console.log('Refreshing bookings due to notification...');
        fetchData();
      }
    };

    onNotification(handleNotification);

    return () => {
      offNotification(handleNotification);
    };
  }, [onNotification, offNotification]);

  // Load paid status from local storage
  useEffect(() => {
    const savedPaid = localStorage.getItem('paidBookingIds');
    if (savedPaid) {
      setPaidBookingIds(JSON.parse(savedPaid));
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (user?.role === 'parent') {
        const [bookingsData, requestsData] = await Promise.all([
          api.bookings.getParentBookings(),
          api.requests.getParentRequests(),
        ]);

        // Deduplicate Nanny IDs for both Bookings and Requests
        const nannyIdsToFetch = new Set<string>();

        bookingsData.forEach((b) => {
          const hasProfile = (b.nanny?.profiles as any)?.first_name || (b.nanny as any)?.profile;
          const nId = b.nanny_id || (b as any).nannyId;
          if (nId && !hasProfile) {
            nannyIdsToFetch.add(nId);
          }
        });

        requestsData.forEach((r) => {
          const hasProfile = (r.nanny?.profiles as any)?.first_name || (r.nanny as any)?.profile;
          const nId = r.nanny_id || (r as any).nannyId;
          if (nId && !hasProfile) {
            nannyIdsToFetch.add(nId);
          }
        });

        const nannyMap = new Map<string, any>();
        const uniqueNannyIds = Array.from(nannyIdsToFetch);

        for (const nId of uniqueNannyIds) {
          try {
            const nannyDetails = await api.users.get(nId);
            nannyMap.set(nId, nannyDetails);
            await new Promise(resolve => setTimeout(resolve, 50));
          } catch (err) {
            console.error(`Failed to fetch nanny ${nId}:`, err);
          }
        }

        const enrichedBookings = bookingsData.map(b => {
          const nId = b.nanny_id || (b as any).nannyId;
          if (nId && nannyMap.has(nId)) {
            return { ...b, nanny: nannyMap.get(nId) };
          }
          return b;
        });

        const enrichedRequests = requestsData.map(r => {
          const nId = r.nanny_id || (r as any).nannyId;
          if (nId && nannyMap.has(nId)) {
            return { ...r, nanny: nannyMap.get(nId) };
          }
          return r;
        });

        setBookings(enrichedBookings);
        setRequests(enrichedRequests);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handlePayNow = (booking: Booking) => {
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

  const handleCancelRequest = async (reason: string) => {
    if (!selectedRequestId) return;
    try {
      setCancelling(true);
      await api.requests.cancel(selectedRequestId, reason);
      await fetchData();
      setSelectedRequestId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to cancel request');
    } finally {
      setCancelling(false);
    }
  };

  const handleConfirmRequest = async (request: ServiceRequest) => {
    if (!request.nanny_id) return;
    try {
      setConfirming(true);
      const bookingPayload = {
        nannyId: request.nanny_id,
        date: request.date,
        startTime: request.start_time,
        endTime: calculateEndTime(request.start_time, request.duration_hours),
        numChildren: request.num_children,
        jobId: request.id,
      };
      await api.bookings.create(bookingPayload);
      await fetchData();
      setActiveTab('upcoming');
      setSelectedRequestId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to confirm booking');
    } finally {
      setConfirming(false);
    }
  };

  const calculateEndTime = (startTime: string, durationHours: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    date.setHours(date.getHours() + durationHours);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const RequestDetailsView = ({ request }: { request: ServiceRequest }) => {
    const getStatusInfo = (status: string) => {
      switch (status) {
        case 'PENDING':
          return {
            color: 'text-amber-700 bg-amber-100',
            icon: <Clock size={20} />,
            text: 'Pending Assignment',
          };
        case 'ASSIGNED':
          return {
            color: 'text-emerald-700 bg-emerald-100',
            icon: <CheckCircle size={20} />,
            text: 'Nanny Assigned',
          };
        default:
          return {
            color: 'text-stone-700 bg-stone-100',
            icon: <AlertTriangle size={20} />,
            text: status,
          };
      }
    };

    const statusInfo = getStatusInfo(request.status);

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <Button
          variant="ghost"
          onClick={() => setSelectedRequestId(null)}
          className="pl-0 hover:bg-transparent hover:text-stone-900"
        >
          <ChevronLeft size={20} className="mr-1" /> Back to Requests
        </Button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Request Details</h1>
            <p className="text-stone-500 mt-1 font-mono text-xs">ID: {request.id}</p>
          </div>
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 font-medium ${statusInfo.color}`}>
            {statusInfo.icon}
            <span>{statusInfo.text}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-soft p-6 md:p-8">
              <h2 className="text-lg font-bold text-stone-900 mb-6 font-display">Service Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-900 flex-shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wider">Date</label>
                    <p className="text-stone-900 font-semibold">{new Date(request.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-900 flex-shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wider">Time</label>
                    <p className="text-stone-900 font-semibold">{request.start_time} ({request.duration_hours} hours)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-900 flex-shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wider">Children</label>
                    <p className="text-stone-900 font-semibold">{request.num_children} (Ages: {request.children_ages.join(', ')})</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-900 flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wider">Location</label>
                    <p className="text-stone-900 font-semibold">{request.location?.address || 'No location specified'}</p>
                  </div>
                </div>
              </div>

              {request.special_requirements && (
                <div className="mt-8 pt-8 border-t border-stone-100">
                  <label className="block text-sm font-medium text-stone-500 mb-2">Special Requirements</label>
                  <p className="text-stone-900 bg-stone-50 p-4 rounded-xl">{request.special_requirements}</p>
                </div>
              )}
            </div>

            {request.nanny && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-stone-900 font-display">Assigned Caregiver</h2>
                <ProfileCard
                  name={getNannyName(request.nanny)}
                  rating={4.9}
                  reviewCount={12}
                  location={(request.nanny as any).profiles?.address || ''}
                  description={(request.nanny as any).nanny_details?.bio || ''}
                  hourlyRate={Number((request.nanny as any).nanny_details?.hourly_rate) || 0}
                  experience={`${(request.nanny as any).nanny_details?.experience_years} years`}
                  isVerified={request.nanny.is_verified}
                  onViewProfile={() => (window.location.href = `/caregiver/${request.nanny?.id}`)}
                  onBook={() => { }}
                  hideBookButton={true}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-stone-100 shadow-soft p-6 sticky top-24">
              <h2 className="text-md font-bold text-stone-900 mb-4 font-display">Actions</h2>
              <div className="space-y-3">
                {request.status === 'ASSIGNED' && (
                  <Button
                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100"
                    onClick={() => handleConfirmRequest(request)}
                    isLoading={confirming}
                  >
                    Confirm & Pay
                  </Button>
                )}

                {request.status === 'PENDING' && (
                  <Button
                    variant="outline"
                    className="w-full border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-xl"
                    onClick={() => setIsCancelModalOpen(true)}
                    isLoading={cancelling}
                  >
                    Cancel Request
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {isCancelModalOpen && (
          <CancellationModal
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            onConfirm={handleCancelRequest}
            type="request"
            startTime={`${request.date}T${request.start_time}`}
            title="Cancel Service Request"
          />
        )}
      </div>
    );
  };

  const handleOpenReview = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsReviewModalOpen(true);
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-100 text-emerald-700';
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-700';
      case 'COMPLETED':
        return 'bg-stone-100 text-stone-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'PENDING':
        return 'bg-amber-50 text-amber-600';
      case 'REQUESTED':
      case 'requested':
        return 'bg-blue-50 text-blue-600';
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

  const getNannyName = (nanny?: User) => {
    if (!nanny) return 'Nanny';
    let profile = (nanny.profiles || (nanny as any).profile) as any;
    if (Array.isArray(profile)) profile = profile[0];
    if (profile) {
      if (profile.first_name) return `${profile.first_name} ${profile.last_name || ''}`.trim();
      if (profile.full_name) return profile.full_name;
    }
    if ((nanny as any).first_name) return `${(nanny as any).first_name} ${(nanny as any).last_name || ''}`.trim();
    return nanny.email?.split('@')[0] || 'Nanny';
  };

  const getOtherPartyName = (booking: Booking | ServiceRequest) => {
    if (booking.status === 'requested' || booking.status === 'REQUESTED') return 'Pending Assignment';
    return (booking as any).nanny_name || getNannyName(booking.nanny);
  };

  const renderActionButtons = (booking: Booking) => {
    if (actionLoading === booking.id) return <Spinner />;
    const buttons = [];
    if (['CONFIRMED', 'IN_PROGRESS', 'requested', 'REQUESTED'].includes(booking.status)) {
      buttons.push(
        <Button
          key="cancel"
          variant="outline"
          size="sm"
          onClick={() => handleCancelBooking(booking.id)}
          className="rounded-xl border-stone-200 hover:bg-stone-50 text-stone-700"
        >
          Cancel
        </Button>
      );
    }
    if (booking.status === 'COMPLETED') {
      const isPaid = paidBookingIds.includes(booking.id);
      if (!isPaid) {
        buttons.push(
          <Button
            key="pay"
            size="sm"
            onClick={() => handlePayNow(booking)}
            disabled={paymentLoading}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {paymentLoading ? 'Processing...' : 'Pay Now'}
          </Button>
        );
      } else {
        buttons.push(
          <div key="paid" className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-medium text-sm mr-2">
            <Check size={14} />
            Paid
          </div>
        );
      }
      buttons.push(
        <Button
          key="review"
          size="sm"
          onClick={() => handleOpenReview(booking.id)}
          className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
          disabled={!isPaid}
        >
          Leave Review
        </Button>
      );
    }
    return buttons.length > 0 ? <div className="flex gap-2 items-center">{buttons}</div> : null;
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'upcoming') return ['CONFIRMED', 'IN_PROGRESS', 'PENDING', 'requested', 'REQUESTED'].includes(booking.status);
    if (activeTab === 'completed') return booking.status === 'COMPLETED';
    if (activeTab === 'cancelled') return booking.status === 'CANCELLED';
    return true;
  });

  return (
    <ParentLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">My Bookings</h1>
            <p className="text-stone-500 mt-1">Manage your appointments and requests</p>
          </div>
        </div>

        <div className="flex border-b border-stone-200 overflow-x-auto">
          {['requests', 'upcoming', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-3 font-medium text-sm transition-colors relative whitespace-nowrap capitalize ${activeTab === tab ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'}`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-t-full"></div>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchData} className="bg-emerald-600 hover:bg-emerald-700">Retry</Button>
          </div>
        ) : activeTab === 'requests' ? (
          <div className="space-y-6">
            {selectedRequestId ? (
              (() => {
                const req = requests.find(r => r.id === selectedRequestId);
                return req ? <RequestDetailsView request={req} /> : (
                  <div className="text-center py-16 bg-white rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/50">
                    <p className="text-stone-500 mb-4">Request not found.</p>
                    <Button variant="outline" onClick={() => setSelectedRequestId(null)}>Back to list</Button>
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-soft border-dashed">
                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
                  <Calendar size={32} />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">No Request Selected</h3>
                <p className="text-stone-500 max-w-sm mx-auto">
                  Select a booking from the **Upcoming** tab to view its full request and assignment details here.
                </p>
              </div>
            )}
          </div>
        ) : (
          (() => {
            const assignedRequests = activeTab === 'upcoming' ? requests.filter(r => r.status === 'assigned' || r.status === 'ASSIGNED') : [];
            const hasItems = filteredBookings.length > 0 || assignedRequests.length > 0;

            if (!hasItems) {
              return (
                <div className="text-center py-16 bg-white rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/50">
                  <p className="text-stone-500 mb-6">No {activeTab} bookings found.</p>
                  <Button onClick={() => (window.location.href = '/search')} className="rounded-xl bg-emerald-600 hover:bg-emerald-700">Find Care</Button>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {assignedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="block group cursor-pointer"
                    onClick={() => {
                      setSelectedRequestId(request.id);
                      setActiveTab('requests');
                    }}
                  >
                    <div className="bg-white p-6 rounded-2xl border-2 border-emerald-100 shadow-xl shadow-emerald-100/50 flex flex-col md:flex-row md:items-center gap-6 hover:shadow-2xl transition-shadow relative overflow-hidden">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0 w-16 h-16 bg-emerald-50 rounded-xl flex flex-col items-center justify-center text-emerald-700">
                          <span className="text-xs font-bold uppercase">{new Date(request.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-xl font-bold">{new Date(request.date).getDate()}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">{getOtherPartyName(request)}</h3>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-tight">Assignment</span>
                          </div>
                          <p className="text-stone-500 text-sm mb-1">Care for {request.num_children} Child{request.num_children !== 1 ? 'ren' : ''}</p>
                          <p className="text-stone-400 text-xs">{formatTime(request.start_time)} ({request.duration_hours} hrs)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredBookings.map((booking) => {
                  const { day, month } = formatDate(booking.start_time);
                  const isRequested = booking.status === 'requested' || booking.status === 'REQUESTED';
                  return (
                    <div key={booking.id} className="bg-white p-6 rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col md:flex-row md:items-center gap-6 hover:shadow-2xl transition-shadow">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0 w-16 h-16 bg-stone-100 rounded-xl flex flex-col items-center justify-center text-stone-700">
                          <span className="text-xs font-bold uppercase">{month}</span>
                          <span className="text-xl font-bold">{day}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-stone-900">{getOtherPartyName(booking)}</h3>
                          <p className="text-stone-500 text-sm mb-1">{booking.job?.title || 'Care service'}</p>
                          <p className="text-stone-400 text-xs">{formatTime(booking.start_time)}{booking.end_time && ` - ${formatTime(booking.end_time)}`}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-stone-100 pt-4 md:pt-0">
                        {isRequested && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-bold"
                            onClick={() => {
                              setSelectedRequestId(booking.job_id || booking.id);
                              setActiveTab('requests');
                            }}
                          >
                            View Request Details
                          </Button>
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyles(booking.status)}`}>
                          {booking.status.toLowerCase().replace('_', ' ')}
                        </span>
                        {renderActionButtons(booking)}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()
        )}

        {selectedBookingId && (
          <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            bookingId={selectedBookingId}
            onSuccess={() => fetchData()}
          />
        )}
      </div>
    </ParentLayout>
  );
}
