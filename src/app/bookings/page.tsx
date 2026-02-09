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
  MessageSquare,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isBookingCancelModalOpen, setIsBookingCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // No longer needed here, moved to BookingActionButtons
  // const { handlePayment, loading: paymentLoading } = usePayment();
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

  // Fetch missing request details if selectedRequestId is set but not in requests list
  useEffect(() => {
    const fetchDetail = async () => {
      if (!selectedRequestId) {
        setSelectedRequest(null);
        return;
      }

      // 1. Try to find in existing requests
      const fromRequests = requests.find(r => r.id === selectedRequestId);
      if (fromRequests) {
        setSelectedRequest(fromRequests);
        return;
      }

      // 2. Try to find in bookings and check for job_id or associated job
      const fromBookings = bookings.find(b => b.id === selectedRequestId || b.job_id === selectedRequestId);
      if (fromBookings) {
        // If it has a job property (enriched), we can use it
        if (fromBookings.job) {
          // Normalize Job to ServiceRequest-like
          const normalized: any = {
            ...fromBookings.job,
            id: fromBookings.job.id,
            num_children: (fromBookings as any).num_children || 1, // Fallback
            children_ages: (fromBookings as any).children_ages || [],
            location: { address: (fromBookings as any).location?.address || 'See job details' },
            nanny: fromBookings.nanny,
            status: fromBookings.status
          };
          setSelectedRequest(normalized);
          return;
        }
      }

      // 3. Last resort: Fetch from API
      try {
        setFetchLoading(true);
        // Try fetching as a request first
        try {
          const data = await api.requests.get(selectedRequestId);
          setSelectedRequest(data);
        } catch (reqErr) {
          // If that fails, try fetching as a booking
          const booking = await api.bookings.get(selectedRequestId);
          if (booking.job_id) {
            const reqData = await api.requests.get(booking.job_id);
            setSelectedRequest(reqData);
          } else {
            // Manual normalization from booking
            setSelectedRequest({
              id: booking.id,
              date: booking.start_time.split('T')[0],
              start_time: formatTime(booking.start_time),
              duration_hours: 4, // Default
              num_children: (booking as any).num_children || 1,
              children_ages: (booking as any).children_ages || [],
              status: booking.status as any,
              location: { address: (booking as any).location?.address || 'See details' },
              nanny: booking.nanny,
              created_at: booking.created_at,
              updated_at: booking.updated_at,
              parent_id: booking.parent_id
            } as any);
          }
        }
      } catch (err) {
        console.error('Failed to fetch details:', err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchDetail();
  }, [selectedRequestId, requests, bookings]);

  // handlePayNow moved to BookingActionButtons

  const handleCancelBooking = (booking: Booking) => {
    setBookingToCancel(booking);
    setIsBookingCancelModalOpen(true);
  };

  const confirmedCancelBooking = async (reason: string) => {
    if (!bookingToCancel) return;

    try {
      setActionLoading(bookingToCancel.id);
      const updated = await api.bookings.cancel(bookingToCancel.id, { reason });
      setBookings(bookings.map((b) => (b.id === bookingToCancel.id ? updated : b)));

      // If it was a requested booking, it might also affect the requests list
      // So let's just refresh data to stay safe and consistent
      await fetchData();
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      alert(err instanceof Error ? err.message : 'Failed to cancel booking');
    } finally {
      setActionLoading(null);
      setIsBookingCancelModalOpen(false);
      setBookingToCancel(null);
    }
  };

  const handleCancelRequest = async (reason: string) => {
    if (!selectedRequestId) return;
    try {
      setCancelling(true);
      await api.requests.cancel(selectedRequestId, reason);
      await fetchData();
      setSelectedRequestId(null);
      setIsCancelModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to cancel request');
    } finally {
      setCancelling(false);
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
            color: 'text-amber-700 bg-amber-50 border border-amber-200',
            icon: <Clock size={16} />,
            text: 'Pending Assignment',
          };
        case 'ASSIGNED':
          return {
            color: 'text-primary-700 bg-primary-50 border border-primary-200',
            icon: <CheckCircle size={16} />,
            text: 'Caregiver Assigned',
          };
        case 'CONFIRMED':
          return {
            color: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
            icon: <CheckCircle size={16} />,
            text: 'Booking Confirmed',
          };
        default:
          return {
            color: 'text-slate-700 bg-slate-50 border border-slate-200',
            icon: <AlertTriangle size={16} />,
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
          className="pl-0 hover:bg-transparent hover:text-primary-700 text-slate-500 mb-6 group transition-colors"
        >
          <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Requests
        </Button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary-900">Request Details</h1>
            <p className="text-slate-500 mt-1 font-mono text-xs uppercase tracking-wider">ID: {request.id}</p>
          </div>
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 font-medium text-sm shadow-sm ${statusInfo.color}`}>
            {statusInfo.icon}
            <span>{statusInfo.text}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <h2 className="text-lg font-bold text-primary-900 mb-6 font-display border-b border-slate-100 pb-4">Service Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-700 flex-shrink-0 shadow-sm">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Date</label>
                    <p className="text-primary-900 font-semibold text-lg">{new Date(request.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-700 flex-shrink-0 shadow-sm">
                    <Clock size={20} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Time</label>
                    <p className="text-primary-900 font-semibold text-lg">{request.start_time} <span className="text-slate-400 text-sm font-normal">({request.duration_hours} hours)</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-700 flex-shrink-0 shadow-sm">
                    <Users size={20} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Children</label>
                    <p className="text-primary-900 font-semibold text-lg">{request.num_children} <span className="text-slate-400 text-sm font-normal">(Ages: {request.children_ages.join(', ')})</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-700 flex-shrink-0 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Location</label>
                    <p className="text-primary-900 font-semibold text-lg">{request.location?.address || 'No location specified'}</p>
                  </div>
                </div>
              </div >

              {
                request.special_requirements && (
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <label className="block text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">Special Requirements</label>
                    <p className="text-slate-700 bg-slate-50 p-5 rounded-xl border border-slate-100 leading-relaxed">{request.special_requirements}</p>
                  </div>
                )
              }
            </div >

            {
              request.nanny && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-primary-900 font-display">Assigned Caregiver</h2>
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
                    // onBook={() => { }}
                    hideBookButton={true}
                  />
                </div>
              )
            }
          </div >

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-md font-bold text-primary-900 mb-4 font-display uppercase tracking-wider text-sm">Actions</h2>
              <div className="space-y-3">
                {/* Single Cancel Button */}
                {(['PENDING', 'ASSIGNED', 'REQUESTED', 'CONFIRMED'].includes(request.status.toUpperCase())) && (
                  <Button
                    variant="outline"
                    className="w-full border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 rounded-xl"
                    onClick={() => {
                      const associatedBooking = bookings.find(b => b.job_id === request.id);
                      if (associatedBooking) {
                        handleCancelBooking(associatedBooking);
                      } else {
                        setSelectedRequestId(request.id);
                        setIsCancelModalOpen(true);
                      }
                    }}
                    disabled={actionLoading === request.id || cancelling}
                    isLoading={cancelling}
                  >
                    Cancel {['CONFIRMED', 'ASSIGNED'].includes(request.status.toUpperCase()) ? 'Booking' : 'Request'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
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
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'COMPLETED':
        return 'bg-slate-100 text-slate-700 border border-slate-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border border-red-100';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'REQUESTED':
      case 'requested':
        return 'bg-accent-50 text-accent-700 border border-accent-200';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
    };
  };

  const formatTime = (timeInput: string) => {
    if (!timeInput) return '';
    try {
      // If full date string
      if (timeInput.includes('T') || timeInput.includes('-')) {
        const date = new Date(timeInput);
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
      }
      // If HH:MM format
      const [hours, minutes] = timeInput.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return timeInput;
    }
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

  const BookingActionButtons = ({
    booking,
    actionLoading,
    paidBookingIds,
    setPaidBookingIds,
    handleCancelBooking,
    handleOpenReview
  }: {
    booking: Booking;
    actionLoading: string | null;
    paidBookingIds: string[];
    setPaidBookingIds: (ids: string[]) => void;
    handleCancelBooking: (booking: Booking) => void;
    handleOpenReview: (id: string) => void;
  }) => {
    const { handlePayment, loading: paymentLoading } = usePayment();

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

    if (actionLoading === booking.id) return <Spinner />;

    const buttons = [];
    if (['CONFIRMED', 'IN_PROGRESS', 'requested', 'REQUESTED'].includes(booking.status)) {
      if (['CONFIRMED', 'IN_PROGRESS'].includes(booking.status)) {
        buttons.push(
          <Button
            key="chat"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/messages?booking=${booking.id}`);
            }}
            className="rounded-xl border-accent-100 text-accent-600 hover:bg-accent-50 hover:text-accent-700 hover:border-accent-200"
          >
            <MessageSquare size={14} className="mr-1" />
            Chat
          </Button>
        );
      }
      buttons.push(
        <Button
          key="cancel"
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleCancelBooking(booking);
          }}
          className="rounded-xl border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
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
            onClick={(e) => {
              e.stopPropagation();
              handlePayNow(booking);
            }}
            disabled={paymentLoading}
            className="rounded-xl bg-primary-900 hover:bg-primary-800 text-white shadow-sm"
          >
            {paymentLoading ? 'Processing...' : 'Pay Now'}
          </Button>
        );
      } else {
        buttons.push(
          <div key="paid" className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-medium text-sm mr-2" onClick={(e) => e.stopPropagation()}>
            <Check size={14} />
            Paid
          </div>
        );
      }
      buttons.push(
        <Button
          key="review"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenReview(booking.id);
          }}
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
    if (activeTab === 'upcoming') {
      const isUpcomingStatus = ['CONFIRMED', 'IN_PROGRESS', 'PENDING', 'requested', 'REQUESTED'].includes(booking.status);
      if (!isUpcomingStatus) return false;

      // Avoid duplication with the "Assignment" cards shown above
      const isAlreadyShownAsAssignment = requests.some(
        (r) => r.id === booking.job_id && (r.status === 'assigned' || r.status === 'ASSIGNED')
      );

      return !isAlreadyShownAsAssignment;
    }
    if (activeTab === 'completed') return booking.status === 'COMPLETED';
    if (activeTab === 'cancelled') return booking.status === 'CANCELLED';
    return true;
  });

  return (
    <ParentLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold font-display text-primary-900">My Bookings</h1>
            <p className="text-slate-500 mt-2 text-lg">Manage your appointments and requests</p>
          </div>
        </div>

        <div className="flex border-b border-slate-200 overflow-x-auto">
          {['requests', 'upcoming', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-4 font-medium text-sm transition-all relative whitespace-nowrap capitalize ${activeTab === tab ? 'text-primary-900 font-bold' : 'text-slate-500 hover:text-primary-700'}`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-900 rounded-t-full"></div>}
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
            <Button onClick={fetchData} className="bg-primary-900 hover:bg-primary-800">Retry</Button>
          </div>
        ) : activeTab === 'requests' ? (
          <div className="space-y-6">
            {fetchLoading ? (
              <div className="flex justify-center py-20">
                <Spinner />
              </div>
            ) : selectedRequest ? (
              <RequestDetailsView request={selectedRequest} />
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm border-dashed">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <Calendar size={32} />
                </div>
                <h3 className="text-xl font-bold text-primary-900 mb-2 font-display">No Request Selected</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  Select a booking from the <span className="font-semibold text-primary-700">Upcoming</span> tab to view its full request and assignment details here.
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
                <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-slate-500 mb-6 text-lg">No {activeTab} bookings found.</p>
                  <Button onClick={() => (window.location.href = '/book-service')} className="rounded-xl bg-primary-900 hover:bg-primary-800 text-white shadow-lg shadow-primary-900/10 px-8 py-6 h-auto text-lg">Find Care</Button>
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
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary-100 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6 relative overflow-hidden group-hover:translate-x-1">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-500 rounded-l-2xl"></div>
                      <div className="flex items-center gap-6 flex-1 ml-2">
                        <div className="flex-shrink-0 w-20 h-20 bg-accent-50 rounded-2xl flex flex-col items-center justify-center text-accent-700 shadow-inner">
                          <span className="text-xs font-bold uppercase tracking-wider">{new Date(request.date).toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-2xl font-bold font-display">{new Date(request.date).getDate()}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-primary-900 group-hover:text-accent-600 transition-colors">{getOtherPartyName(request)}</h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-accent-100 text-accent-700 text-[10px] font-bold uppercase tracking-wider border border-accent-200">Assignment</span>
                          </div>
                          <p className="text-slate-600 text-sm mb-1 font-medium">Care for {request.num_children} Child{request.num_children !== 1 ? 'ren' : ''}</p>
                          <p className="text-slate-400 text-xs flex items-center gap-1">
                            <Clock size={12} />
                            {formatTime(request.start_time)} ({request.duration_hours} hrs)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            const associatedBooking = bookings.find(b => b.job_id === request.id);
                            if (associatedBooking) {
                              handleCancelBooking(associatedBooking);
                            } else {
                              // We need to set selectedRequestId for handleCancelRequest to work
                              setSelectedRequestId(request.id);
                              setIsCancelModalOpen(true);
                            }
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredBookings.map((booking) => {
                  const { day, month } = formatDate(booking.start_time);
                  return (
                    <div
                      key={booking.id}
                      className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center gap-6 hover:shadow-md transition-all duration-300 ${activeTab === 'upcoming' ? 'cursor-pointer hover:border-primary-100 group hover:translate-x-1' : ''}`}
                      onClick={() => {
                        if (activeTab === 'upcoming') {
                          setSelectedRequestId(booking.job_id || booking.id);
                          setActiveTab('requests');
                        }
                      }}
                    >
                      <div className="flex items-center gap-6 flex-1">
                        <div className={`flex-shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center transition-colors shadow-inner ${activeTab === 'upcoming' ? 'bg-primary-50 text-primary-900' : 'bg-slate-50 text-slate-500'}`}>
                          <span className="text-xs font-bold uppercase tracking-wider">{month}</span>
                          <span className="text-2xl font-bold font-display">{day}</span>
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold text-primary-900 transition-colors ${activeTab === 'upcoming' ? 'group-hover:text-primary-700' : ''}`}>{getOtherPartyName(booking)}</h3>
                          <p className="text-slate-600 text-sm mb-1 font-medium">
                            Care for {(booking as any).num_children || (booking.job as any)?.num_children || (booking as any).job?.num_children || 1} Child{((booking as any).num_children || (booking.job as any)?.num_children || (booking as any).job?.num_children || 1) !== 1 ? 'ren' : ''}
                          </p>
                          <p className="text-slate-400 text-xs flex items-center gap-1">
                            <Clock size={12} />
                            {formatTime(booking.start_time)}{booking.end_time && ` - ${formatTime(booking.end_time)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadgeStyles(booking.status)}`}>
                          {booking.status.toLowerCase().replace('_', ' ')}
                        </span>
                        <BookingActionButtons
                          booking={booking}
                          actionLoading={actionLoading}
                          paidBookingIds={paidBookingIds}
                          setPaidBookingIds={setPaidBookingIds}
                          handleCancelBooking={handleCancelBooking}
                          handleOpenReview={handleOpenReview}
                        />
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

        {bookingToCancel && (
          <CancellationModal
            isOpen={isBookingCancelModalOpen}
            onClose={() => setIsBookingCancelModalOpen(false)}
            onConfirm={confirmedCancelBooking}
            type="booking"
            startTime={bookingToCancel.start_time}
            title="Cancel Booking"
          />
        )}

        {isCancelModalOpen && selectedRequestId && (
          (() => {
            const req = selectedRequest || requests.find(r => r.id === selectedRequestId);
            return req ? (
              <CancellationModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleCancelRequest}
                type="request"
                startTime={`${req.date}T${req.start_time}`}
                title="Cancel Service Request"
              />
            ) : null;
          })()
        )}
      </div>
    </ParentLayout>
  );
}
