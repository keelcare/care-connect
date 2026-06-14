'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import ParentLayout from '@/components/layout/ParentLayout';
import { Button } from '@/components/ui/button';
import { RecurringServiceRequest, Booking } from '@/types/api';
import { formatRecurrencePattern } from '@/components/scheduling/DaySelector';
import {
  Calendar,
  Clock,
  ArrowLeft,
  CalendarDays,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Activity,
  MapPin,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

export default function RecurringBookingDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { addToast } = useToast();

  const [plan, setPlan] = useState<RecurringServiceRequest | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  // Pagination for bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPlanDetails();
      fetchBookings(1, true);
    }
  }, [id]);

  const fetchPlanDetails = async () => {
    try {
      setLoadingPlan(true);
      const data = await api.recurringRequests.get(id);
      setPlan(data);
    } catch (error) {
      console.error('Failed to fetch plan:', error);
      addToast({ message: 'Failed to load plan details', type: 'error' });
      router.push('/recurring-bookings');
    } finally {
      setLoadingPlan(false);
    }
  };

  const fetchBookings = async (pageNumber: number, isInitial = false) => {
    try {
      setLoadingBookings(true);
      const res = await api.recurringRequests.getPlanBookings(id, pageNumber, 10);
      
      // Backend returns { items: [], pagination: { total, page, limit, totalPages } }
      const items = res.items ?? (res as any).data ?? [];
      const totalPages = res.pagination?.totalPages ?? (res as any).meta?.lastPage ?? 1;

      if (isInitial) {
        setBookings(items);
      } else {
        setBookings((prev) => [...prev, ...items]);
      }

      setHasMore(pageNumber < totalPages);
      setPage(pageNumber);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      addToast({ message: 'Failed to load bookings', type: 'error' });
    } finally {
      setLoadingBookings(false);
    }
  };

  const loadMore = () => {
    if (!loadingBookings && hasMore) {
      fetchBookings(page + 1);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200">
            <CheckCircle2 size={12} />
            Active
          </span>
        );
      case 'paused':
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full bg-stone-200 text-stone-600 text-xs font-semibold flex items-center gap-1.5 border border-stone-300">
            <XCircle size={12} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 border border-blue-200">
            <Activity size={12} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
    }
  };

  const getBookingStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'completed') return <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Completed</span>;
    if (s === 'upcoming' || s === 'pending') return <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Upcoming</span>;
    if (s === 'cancelled') return <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">Cancelled</span>;
    return <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">{status}</span>;
  };

  if (loadingPlan) {
    return (
      <ParentLayout>
        <div className="flex justify-center py-20 min-h-dvh bg-stone-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
        </div>
      </ParentLayout>
    );
  }

  if (!plan) return null;

  return (
    <ParentLayout>
      <div className="min-h-dvh bg-stone-50 pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          
          {/* Back Navigation */}
          <Link href="/recurring-bookings" className="inline-flex items-center text-sm font-semibold text-stone-500 hover:text-primary-700 mb-6 transition-colors">
            <ArrowLeft size={16} className="mr-1.5" />
            Back to Plans
          </Link>

          {/* Plan Header Card */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden mb-8">
            <div className="p-6 md:p-8 bg-gradient-to-br from-primary-50 to-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-primary-900 font-heading">
                      {plan.category} Plan
                    </h1>
                    {getStatusBadge(plan.status)}
                  </div>
                  <p className="text-stone-500 font-medium">
                    {plan.plan_type.replace('_', ' ')} • {plan.num_children} {plan.num_children === 1 ? 'child' : 'children'}
                  </p>
                </div>
                
                {plan.status.toLowerCase() === 'active' && (
                  <Button variant="outline" className="rounded-xl border-stone-300 text-stone-700 hover:bg-stone-50 shrink-0">
                    Manage Plan
                  </Button>
                )}
              </div>

              {/* Plan Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-stone-200">
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">Pattern</p>
                  <p className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                    <CalendarDays size={16} className="text-primary-600" />
                    {(() => {
                      const p = plan.recurrence_pattern as any;
                      if (!p) return plan.recurrence_type ?? 'Recurring';
                      if (typeof p === 'object') {
                        if (Array.isArray(p.days) && p.days.length > 0) return p.days.join(', ');
                        if (Array.isArray(p.dates) && p.dates.length > 0) return `Dates: ${p.dates.join(', ')}`;
                        return plan.recurrence_type ?? 'Recurring';
                      }
                      return formatRecurrencePattern(p as string);
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">Time</p>
                  <p className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                    <Clock size={16} className="text-blue-600" />
                    {plan.start_time} ({plan.duration_hours} hr)
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">Start Date</p>
                  <p className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                    <Calendar size={16} className="text-emerald-600" />
                    {formatDate(plan.start_date)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">End Date</p>
                  <p className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                    <Calendar size={16} className="text-stone-400" />
                    {plan.end_date ? formatDate(plan.end_date) : 'Ongoing'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Bookings List */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary-900 font-heading">
              Generated Bookings
            </h2>
            <p className="text-sm text-stone-500 font-medium">
              Showing {bookings.length} sessions
            </p>
          </div>

          <div className="space-y-4">
            {bookings.length === 0 && !loadingBookings ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
                <p className="text-stone-500">No bookings generated for this plan yet.</p>
              </div>
            ) : (
              bookings.map((booking) => {
                // The paginated bookings endpoint may return extra fields not in the Booking base type.
                // Cast to any for the fields specific to generated recurring bookings.
                const b = booking as any;
                const dateStr: string = b.date ?? booking.start_time;
                const durationHours: number = b.duration_hours ?? 0;
                const dateObj = new Date(dateStr);
                return (
                <Link key={booking.id} href={`/bookings/${booking.id}`}>
                  <div className="bg-white rounded-2xl border border-stone-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Date & Time */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-50 flex flex-col items-center justify-center border border-primary-100">
                        <span className="text-[10px] font-bold text-primary-600 uppercase">
                          {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold text-primary-900 leading-none mt-0.5">
                          {dateObj.getDate()}
                        </span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-stone-900">
                            {dateObj.toLocaleDateString('en-US', { weekday: 'long' })}
                          </p>
                          {getBookingStatusBadge(booking.status)}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-stone-500">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {b.start_time ?? booking.start_time}{durationHours > 0 ? ` (${durationHours} hr)` : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Caregiver Info */}
                    <div className="flex items-center gap-3 sm:border-l sm:border-stone-100 sm:pl-6">
                      <div className="w-10 h-10 rounded-full bg-stone-100 overflow-hidden flex items-center justify-center border border-stone-200">
                        {booking.nanny?.profiles?.profile_image_url ? (
                          <img 
                            src={booking.nanny.profiles.profile_image_url} 
                            alt="Caregiver" 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <UserIcon className="text-stone-400" size={18} />
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Assigned To</p>
                        <p className="text-sm font-semibold text-stone-900">
                          {booking.nanny ? `${booking.nanny.profiles?.first_name || 'Caregiver'} ${booking.nanny.profiles?.last_name || ''}` : 'Pending Assignment'}
                        </p>
                      </div>
                    </div>

                  </div>
                </Link>
                );
              })
            )}

            {/* Load More */}
            {hasMore && (
              <div className="pt-4 flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={loadMore} 
                  disabled={loadingBookings}
                  className="rounded-xl border-stone-300 text-stone-700 bg-white hover:bg-stone-50"
                >
                  {loadingBookings ? 'Loading...' : (
                    <>
                      Load More Sessions
                      <ChevronDown size={16} className="ml-2 text-stone-400" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </ParentLayout>
  );
}
