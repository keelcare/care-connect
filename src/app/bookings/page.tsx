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
import { RescheduleModal } from '@/components/bookings/RescheduleModal';

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

  // Reschedule Modal State
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [bookingToReschedule, setBookingToReschedule] = useState<Booking | ServiceRequest | null>(null);

  // Socket Integration
  const { onRefresh, offRefresh } = useSocket();

  const normalizeStatus = (s: any) => String(s || '').trim().toUpperCase();

  const fetchData = React.useCallback(async () => {
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
        }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

        const enrichedRequests = requestsData.map(r => {
          const nId = r.nanny_id || (r as any).nannyId;
          if (nId && nannyMap.has(nId)) {
            return { ...r, nanny: nannyMap.get(nId) };
          }
          return r;
        }).sort((a, b) => {
          // Sort by date first, then by start_time if dates are equal
          const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          if (dateComparison !== 0) return dateComparison;

          // Helper to get minutes from HH:mm or ISO string
          const getMinutes = (timeStr: string) => {
            if (timeStr.includes('T')) return new Date(timeStr).getHours() * 60 + new Date(timeStr).getMinutes();
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
          };

          return getMinutes(a.start_time) - getMinutes(b.start_time);
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
  }, [user]);

  useEffect(() => {
    const handleRefresh = (data: any) => {
      console.log('Bookings Page - Received Refresh Event:', data);
      if (data.category === 'booking' || data.category === 'request' || data.category === 'message') {
        fetchData();
      }
    };

    onRefresh(handleRefresh);
    return () => offRefresh(handleRefresh);
  }, [onRefresh, offRefresh, fetchData]);

  // Load paid status from local storage
  useEffect(() => {
    const savedPaid = localStorage.getItem('paidBookingIds');
    if (savedPaid) {
      setPaidBookingIds(JSON.parse(savedPaid));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

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

  const handleReschedule = (booking: Booking | ServiceRequest) => {
    setBookingToReschedule(booking);
    setIsRescheduleModalOpen(true);
  };

  const confirmedReschedule = async (date: string, startTime: string, endTime: string) => {
    if (!bookingToReschedule) return;

    try {
      // Find the actual booking ID
      let bookingId = bookingToReschedule.id;

      // If it's a ServiceRequest, find the associated booking
      if ('num_children' in bookingToReschedule) {
        const associatedBooking = bookings.find(b => b.job_id === bookingToReschedule.id || (b as any).request_id === bookingToReschedule.id);
        if (associatedBooking) {
          bookingId = associatedBooking.id;
        }
      }

      await api.bookings.reschedule(bookingId, { date, startTime, endTime });
      await fetchData();
      setIsRescheduleModalOpen(false);
      setBookingToReschedule(null);
    } catch (err) {
      console.error('Failed to reschedule booking:', err);
      throw err; // Re-throw to let modal handle the error
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
      const s = normalizeStatus(status);
      switch (s) {
        case 'PENDING':
          return {
            color: 'border-amber-500 text-amber-700',
            text: 'Pending Assignment',
          };
        case 'ASSIGNED':
          return {
            color: 'border-slate-900 text-slate-900',
            text: 'Caregiver Assigned',
          };
        case 'ACCEPTED':
        case 'CONFIRMED':
          return {
            color: 'border-emerald-500 text-emerald-700',
            text: 'Booking Confirmed',
          };
        case 'IN_PROGRESS':
          return {
            color: 'border-slate-900 text-slate-900',
            text: 'Service In Progress',
          };
        default:
          return {
            color: 'border-slate-900 text-slate-900',
            text: status,
          };
      }
    };

    const statusInfo = getStatusInfo(request.status);

    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <Button
          variant="ghost"
          onClick={() => setSelectedRequestId(null)}
          className="pl-0 hover:bg-transparent hover:text-slate-900 text-slate-400 mb-2 font-sans uppercase tracking-widest text-xs transition-colors rounded-none"
        >
          <ChevronLeft size={16} className="mr-2" /> Back
        </Button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-5xl font-serif text-slate-900 tracking-tight mb-2">Service Details</h1>
            <p className="text-slate-400 font-sans text-xs uppercase tracking-[0.2em]">REF: {request.id.slice(0, 8)}</p>
          </div>
          <div className={`px-3 py-1 border text-[10px] uppercase tracking-widest ${statusInfo.color}`}>
            <span>{statusInfo.text}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
          <div className="xl:col-span-2 space-y-12">
            <div>
              <h2 className="text-sm font-sans uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-200 pb-2">Schedule & Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Date</label>
                  <p className="font-serif text-2xl text-slate-900">{new Date(request.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Time</label>
                  <p className="font-serif text-2xl text-slate-900">{formatTime(request.start_time)} <span className="font-sans text-sm text-slate-400 tracking-widest uppercase">({request.duration_hours} hrs)</span></p>
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Children</label>
                  <p className="font-serif text-2xl text-slate-900">{request.num_children} <span className="font-sans text-sm text-slate-400 tracking-widest uppercase">(Ages: {request.children_ages.join(', ')})</span></p>
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Location</label>
                  <p className="font-serif text-xl text-slate-900 leading-snug">{request.location?.address || 'No location specified'}</p>
                </div>
              </div>

              {request.special_requirements && (
                <div className="mt-12 pt-8 border-t border-slate-200">
                  <label className="block font-sans text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-4">Special Notes</label>
                  <p className="font-serif text-lg text-slate-800 leading-relaxed italic border-l-2 border-slate-900 pl-6 my-6">"{request.special_requirements}"</p>
                </div>
              )}
            </div>

            {request.nanny && (
              <div className="pt-8 border-t border-slate-200">
                <h2 className="text-sm font-sans uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-200 pb-2">Assigned Personnel</h2>
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
                  hideBookButton={true}
                />
              </div>
            )}
          </div>

          <div className="xl:col-span-1">
            <div className="sticky top-24 pt-2">
              <h2 className="text-sm font-sans uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-200 pb-2">Management</h2>
              <div className="space-y-4">
                {['PENDING', 'ASSIGNED', 'ACCEPTED', 'REQUESTED', 'CONFIRMED'].includes(normalizeStatus(request.status)) && (
                  <Button
                    variant="outline"
                    className="w-full rounded-none border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors duration-300 font-sans uppercase tracking-widest text-xs h-12"
                    onClick={() => handleReschedule(request)}
                    disabled={actionLoading === request.id}
                  >
                    Reschedule
                  </Button>
                )}
                {['PENDING', 'ASSIGNED', 'ACCEPTED', 'REQUESTED', 'CONFIRMED'].includes(normalizeStatus(request.status)) && (
                  <Button
                    variant="outline"
                    className="w-full rounded-none border border-slate-200 text-slate-500 hover:border-red-600 hover:text-red-600 hover:bg-transparent transition-colors duration-300 font-sans uppercase tracking-widest text-xs h-12"
                    onClick={() => {
                      const associatedBooking = bookings.find(b => b.job_id === request.id || (b as any).request_id === request.id);
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
                    Cancel {['ASSIGNED', 'ACCEPTED', 'CONFIRMED'].includes(normalizeStatus(request.status)) ? 'Booking' : 'Request'}
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
      case 'EXPIRED':
        return 'bg-amber-50 text-amber-600 border border-amber-200';
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
    if (!timeInput) return '—';
    try {
      // Handle ISO string or full date string
      if (timeInput.includes('T')) {
        const date = new Date(timeInput);
        if (!isNaN(date.getTime())) {
          return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          });
        }
      }
      // Handle HH:mm (24h)
      if (timeInput.includes(':')) {
        const parts = timeInput.split(':');
        let h = parseInt(parts[0], 10);
        let m = parseInt(parts[1], 10);
        if (!isNaN(h) && !isNaN(m)) {
          const ampm = h >= 12 ? 'PM' : 'AM';
          const h12 = h % 12 || 12;
          return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
        }
      }
      return timeInput;
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
            className="rounded-none border-slate-200 text-slate-500 hover:border-slate-900 hover:text-slate-900 transition-colors font-sans uppercase tracking-widest text-[10px]"
          >
            <MessageSquare size={12} className="mr-2" />
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
          className="rounded-none border-slate-200 text-slate-500 hover:border-red-600 hover:text-red-600 hover:bg-transparent transition-colors font-sans uppercase tracking-widest text-[10px]"
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
            className="rounded-none bg-slate-900 hover:bg-slate-800 text-white font-sans uppercase tracking-widest text-[10px]"
          >
            {paymentLoading ? 'Processing...' : 'Pay Now'}
          </Button>
        );
      } else {
        buttons.push(
          <div key="paid" className="flex items-center gap-2 px-3 py-1 border border-emerald-500 text-emerald-700 font-sans uppercase tracking-widest text-[10px] mr-2" onClick={(e) => e.stopPropagation()}>
            <Check size={12} />
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
          className="rounded-none bg-emerald-700 hover:bg-emerald-800 text-white font-sans uppercase tracking-widest text-[10px]"
          disabled={!isPaid}
        >
          Leave Review
        </Button>
      );
    }

    return buttons.length > 0 ? <div className="flex gap-2 items-center">{buttons}</div> : null;
  };

  const filteredBookings = bookings.filter((booking) => {
    const isTechnicallyExpired = booking.end_time &&
      new Date(booking.end_time).getTime() + 2 * 60 * 60 * 1000 < Date.now() &&
      !['COMPLETED', 'IN_PROGRESS'].includes(booking.status);
    const showsAsExpired = booking.tags?.includes('noshow') || (booking.status === 'CANCELLED' && booking.cancellation_reason?.toLowerCase().includes('expired'));

    if (activeTab === 'upcoming') {
      const isUpcomingStatus = ['CONFIRMED', 'IN_PROGRESS', 'PENDING', 'requested', 'REQUESTED'].includes(booking.status);
      if (!isUpcomingStatus) return false;

      // Proactively move to cancelled if expired even if backend hasn't updated status yet
      if (isTechnicallyExpired && booking.status !== 'IN_PROGRESS') return false;

      // Avoid duplication with the "Assignment" cards shown above
      const isAlreadyShownAsAssignment = requests.some(
        (r) => r.id === booking.job_id && (r.status === 'assigned' || r.status === 'ASSIGNED')
      );

      return !isAlreadyShownAsAssignment;
    }
    if (activeTab === 'completed') return booking.status === 'COMPLETED';
    if (activeTab === 'cancelled') {
      // Include explicitly cancelled ones AND technically expired ones
      return booking.status === 'CANCELLED' || (isTechnicallyExpired && booking.status !== 'COMPLETED' && booking.status !== 'IN_PROGRESS');
    }
    return true;
  });

  return (
    <ParentLayout>
      <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <h1 className="text-5xl font-serif text-slate-900 tracking-tight">My Bookings</h1>
            <p className="text-slate-500 mt-4 font-sans text-sm tracking-widest uppercase">Manage your appointments & requests</p>
          </div>
        </div>

        <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar gap-8">
          {['requests', 'upcoming', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              className={`pb-4 pt-2 font-sans uppercase tracking-[0.2em] text-[10px] font-semibold transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-slate-900"></div>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner />
          </div>
        ) : error ? (
          <div className="border border-red-200 p-8 text-center bg-red-50/50">
            <p className="text-red-600 mb-6 font-serif italic text-xl">{error}</p>
            <Button onClick={fetchData} className="rounded-none bg-slate-900 hover:bg-slate-800 font-sans uppercase tracking-widest text-[10px]">Retry</Button>
          </div>
        ) : activeTab === 'requests' ? (
          <div className="space-y-6">
            {fetchLoading ? (
              <div className="flex justify-center py-32">
                <Spinner />
              </div>
            ) : selectedRequest ? (
              <RequestDetailsView request={selectedRequest} />
            ) : (
              <div className="text-center py-32 border-y border-slate-100 my-12">
                <h3 className="text-2xl font-serif text-slate-400 mb-4 italic">No Request Selected</h3>
                <p className="text-slate-500 font-sans text-[10px] tracking-[0.2em] uppercase">
                  Select a booking from <span className="text-slate-900 font-bold">Upcoming</span> to view details.
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
                <div className="text-center py-32 border-y border-slate-100 my-12">
                  <p className="text-slate-400 mb-8 font-serif italic text-2xl">No {activeTab} bookings found.</p>
                  <Button onClick={() => (window.location.href = '/book-service')} className="rounded-none bg-slate-900 hover:bg-slate-800 text-white font-sans uppercase tracking-widest text-[10px] px-8 py-6">Find Care</Button>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {assignedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="block group cursor-pointer border-b border-slate-200 py-8 hover:bg-slate-50 transition-colors duration-300"
                    onClick={() => {
                      setSelectedRequestId(request.id);
                      setActiveTab('requests');
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-8 px-4">
                      <div className="flex items-center gap-8 flex-1">
                        <div className="flex flex-col items-center md:items-start w-24 border-r border-slate-200 pr-6">
                          <span className="font-serif text-5xl font-light text-slate-800 leading-none mb-2">{new Date(request.date).getDate()}</span>
                          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-slate-400">{new Date(request.date).toLocaleString('default', { month: 'short' })}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-4 mb-3">
                            <h3 className="font-display text-2xl text-slate-900 group-hover:text-slate-600 transition-colors">{getOtherPartyName(request)}</h3>
                            <span className="px-2 py-0.5 border border-slate-900 text-slate-900 text-[10px] uppercase tracking-widest">Assignment</span>
                          </div>
                          <p className="font-sans text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">Care for {request.num_children} Child{request.num_children !== 1 ? 'ren' : ''}</p>
                          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-slate-400">
                            {formatTime(request.start_time)} · {request.duration_hours} HRS
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-6 md:mt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-none border-slate-200 text-slate-500 hover:border-red-600 hover:text-red-600 hover:bg-transparent transition-colors font-sans uppercase tracking-widest text-[10px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            const associatedBooking = bookings.find(b => b.job_id === request.id);
                            if (associatedBooking) {
                              handleCancelBooking(associatedBooking);
                            } else {
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
                  const isTechnicallyExpired = booking.end_time &&
                    new Date(booking.end_time).getTime() + 2 * 60 * 60 * 1000 < Date.now() &&
                    !['COMPLETED', 'IN_PROGRESS'].includes(booking.status);

                  return (
                    <div
                      key={booking.id}
                      className={`border-b border-slate-200 py-8 flex flex-col md:flex-row md:items-center gap-8 ${activeTab === 'upcoming' ? 'cursor-pointer hover:bg-slate-50 transition-colors duration-300 group' : ''}`}
                      onClick={() => {
                        if (activeTab === 'upcoming') {
                          setSelectedRequestId(booking.job_id || booking.id);
                          setActiveTab('requests');
                        }
                      }}
                    >
                      <div className="flex items-center gap-8 flex-1 px-4">
                        <div className="flex flex-col items-center md:items-start w-24 border-r border-slate-200 pr-6">
                          <span className={`font-serif text-5xl font-light leading-none mb-2 ${activeTab === 'upcoming' ? 'text-slate-800' : 'text-slate-400'}`}>{day}</span>
                          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-slate-400">{month}</span>
                        </div>
                        <div>
                          <h3 className={`font-display text-2xl transition-colors mb-3 ${activeTab === 'upcoming' ? 'text-slate-900 group-hover:text-slate-600' : 'text-slate-600'}`}>{getOtherPartyName(booking)}</h3>
                          <p className="font-sans text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
                            Care for {(booking as any).num_children || (booking.job as any)?.num_children || (booking as any).job?.num_children || 1} Child{((booking as any).num_children || (booking.job as any)?.num_children || (booking as any).job?.num_children || 1) !== 1 ? 'ren' : ''}
                          </p>
                          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-slate-400">
                            {formatTime(booking.start_time)}{booking.end_time && ` — ${formatTime(booking.end_time)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto px-4 mt-6 md:mt-0">
                        <div className="flex flex-col items-end gap-3 w-32">
                          <span className={`px-2 py-1 border text-[10px] uppercase tracking-widest text-center w-full ${booking.tags?.includes('noshow') || (booking.status === 'CANCELLED' && booking.cancellation_reason?.toLowerCase().includes('expired')) || isTechnicallyExpired
                            ? 'border-amber-500 text-amber-700'
                            : booking.status === 'CONFIRMED' ? 'border-emerald-500 text-emerald-700'
                              : booking.status === 'CANCELLED' ? 'border-red-300 text-red-600'
                                : booking.status === 'COMPLETED' ? 'border-slate-300 text-slate-600'
                                  : 'border-slate-900 text-slate-900'
                            }`}>
                            {booking.tags?.includes('noshow')
                              ? 'no show'
                              : (booking.status === 'CANCELLED' && booking.cancellation_reason?.toLowerCase().includes('expired')) || isTechnicallyExpired
                                ? 'expired'
                                : booking.status.replace('_', ' ')}
                          </span>
                          {(booking.status === 'CANCELLED' && booking.cancellation_reason) ? (
                            <p className="text-[10px] text-slate-400 italic max-w-full text-center leading-tight">
                              {booking.cancellation_reason}
                            </p>
                          ) : (booking.tags?.includes('noshow') || isTechnicallyExpired) && (
                            <p className="text-[10px] text-amber-500 italic max-w-full text-center leading-tight">
                              {booking.tags?.includes('noshow') ? 'Patient No Show' : 'Expired (No Show)'}
                            </p>
                          )}
                        </div>
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

        {bookingToReschedule && (
          <RescheduleModal
            isOpen={isRescheduleModalOpen}
            onClose={() => setIsRescheduleModalOpen(false)}
            onConfirm={confirmedReschedule}
            serviceType={(() => {
              const b: any = bookingToReschedule;
              const category = b.category || b.job?.category || 'Service';
              switch (category) {
                case 'CC': return 'Child Care';
                case 'ST': return 'Shadow Teacher';
                case 'SN': return 'Special Needs';
                default: return 'Service';
              }
            })()}
            currentDate={(() => {
              const b: any = bookingToReschedule;
              // Try to find a booking that has a full ISO start_time
              const booking: any = (b.start_time && b.start_time.includes('T'))
                ? b
                : bookings.find(item => item.job_id === b.id || (item as any).request_id === b.id);

              if (booking && booking.start_time && booking.start_time.includes('T')) {
                return booking.start_time.split('T')[0];
              }
              return b.date || new Date().toISOString().split('T')[0];
            })()}
            currentStartTime={(() => {
              const b: any = bookingToReschedule;
              const booking: any = (b.start_time && b.start_time.includes('T'))
                ? b
                : bookings.find(item => item.job_id === b.id || (item as any).request_id === b.id);

              if (booking && booking.start_time && booking.start_time.includes('T')) {
                const timePart = booking.start_time.split('T')[1];
                return timePart ? timePart.slice(0, 5) : '09:00';
              }
              return b.start_time || '09:00';
            })()}
            currentEndTime={(() => {
              const b: any = bookingToReschedule;
              const booking: any = (b.end_time && b.end_time.includes('T'))
                ? b
                : bookings.find(item => item.job_id === b.id || (item as any).request_id === b.id);

              if (booking && booking.end_time && booking.end_time.includes('T')) {
                const timePart = booking.end_time.split('T')[1];
                return timePart ? timePart.slice(0, 5) : '13:00';
              }
              return '13:00';
            })()}
          />
        )}
      </div>
    </ParentLayout>
  );
}
