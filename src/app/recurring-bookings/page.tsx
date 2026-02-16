'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import ParentLayout from '@/components/layout/ParentLayout';
import { Button } from '@/components/ui/button';
import { RecurringBooking, Booking, User } from '@/types/api';
import { formatRecurrencePattern } from '@/components/scheduling/DaySelector';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  Pause,
  Play,
  Repeat,
  User as UserIcon,
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  XCircle,
  X,
  Star,
  Search,
} from 'lucide-react';
import Link from 'next/link';

interface PreviousNanny {
  id: string;
  email: string;
  profiles?: {
    first_name?: string | null;
    last_name?: string | null;
    profile_image_url?: string | null;
  };
  nanny_details?: {
    hourly_rate?: string | null;
    experience_years?: number | null;
  };
  bookingCount: number;
  lastBookedDate: string;
}

export default function RecurringBookingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [bookings, setBookings] = useState<RecurringBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showNannyModal, setShowNannyModal] = useState(false);
  const [previousNannies, setPreviousNannies] = useState<PreviousNanny[]>([]);
  const [loadingNannies, setLoadingNannies] = useState(false);

  useEffect(() => {
    fetchRecurringBookings();
  }, []);

  const fetchRecurringBookings = async () => {
    try {
      setLoading(true);
      const data = await api.recurringBookings.list();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch recurring bookings:', error);
      addToast({ message: 'Failed to load recurring bookings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchPreviousNannies = async () => {
    setLoadingNannies(true);
    try {
      // Fetch parent's past bookings
      const bookings = await api.bookings.getParentBookings();

      // Extract unique nannies from bookings
      const nannyMap = new Map<string, PreviousNanny>();

      bookings.forEach((booking: Booking) => {
        const nanny = booking.nanny;
        if (nanny && nanny.id) {
          const existing = nannyMap.get(nanny.id);
          if (existing) {
            existing.bookingCount += 1;
            // Update last booked date if this booking is more recent
            if (
              new Date(booking.created_at) > new Date(existing.lastBookedDate)
            ) {
              existing.lastBookedDate = booking.created_at;
            }
          } else {
            nannyMap.set(nanny.id, {
              id: nanny.id,
              email: nanny.email,
              profiles: nanny.profiles,
              nanny_details: nanny.nanny_details,
              bookingCount: 1,
              lastBookedDate: booking.created_at,
            });
          }
        }
      });

      // Convert map to array and sort by booking count (most booked first)
      const nanniesArray = Array.from(nannyMap.values()).sort(
        (a, b) => b.bookingCount - a.bookingCount
      );
      setPreviousNannies(nanniesArray);
    } catch (error) {
      console.error('Failed to fetch previous nannies:', error);
      addToast({
        message: 'Failed to load previous caregivers',
        type: 'error',
      });
    } finally {
      setLoadingNannies(false);
    }
  };

  const handleNewRecurringClick = () => {
    setShowNannyModal(true);
    fetchPreviousNannies();
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setActionLoading(id);
    try {
      await api.recurringBookings.update(id, { isActive: !currentStatus });
      addToast({
        message: currentStatus
          ? 'Recurring booking paused'
          : 'Recurring booking resumed',
        type: 'success',
      });
      fetchRecurringBookings();
    } catch (error) {
      console.error('Failed to update recurring booking:', error);
      addToast({
        message: 'Failed to update recurring booking',
        type: 'error',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this recurring booking? Future bookings will not be generated.'
      )
    ) {
      return;
    }

    setActionLoading(id);
    try {
      await api.recurringBookings.delete(id);
      addToast({ message: 'Recurring booking deleted', type: 'success' });
      setBookings(bookings.filter((b) => b.id !== id));
    } catch (error) {
      console.error('Failed to delete recurring booking:', error);
      addToast({
        message: 'Failed to delete recurring booking',
        type: 'error',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getNannyName = (booking: RecurringBooking) => {
    const nanny = booking.nanny;
    if (nanny?.profiles?.first_name && nanny?.profiles?.last_name) {
      return `${nanny.profiles.first_name} ${nanny.profiles.last_name}`;
    }
    return nanny?.email || 'Caregiver';
  };

  const getPreviousNannyName = (nanny: PreviousNanny) => {
    if (nanny.profiles?.first_name && nanny.profiles?.last_name) {
      return `${nanny.profiles.first_name} ${nanny.profiles.last_name}`;
    }
    return nanny.email || 'Caregiver';
  };

  return (
    <ParentLayout>
      <div className="min-h-dvh bg-neutral-50 pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <Repeat className="w-5 h-5 text-primary-900" />
                  </div>
                  <h1 className="text-3xl font-bold text-primary-900">
                    Recurring Bookings
                  </h1>
                </div>
                <p className="text-neutral-500 mt-1">
                  Manage your scheduled recurring care
                </p>
              </div>
              <Button
                onClick={handleNewRecurringClick}
                className="rounded-xl bg-accent hover:bg-accent-600 text-white"
              >
                <Plus size={18} className="mr-2" />
                New Recurring
              </Button>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-accent-50 border border-accent-100 rounded-2xl p-4 flex items-start gap-3 mb-8">
            <CalendarDays className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-accent-900">
                How recurring bookings work
              </p>
              <p className="text-sm text-accent-700 mt-1">
                Recurring bookings automatically generate individual bookings
                based on your schedule. Bookings are created 1 day in advance.
                You can pause or cancel anytime.
              </p>
            </div>
          </div>

          {/* Recurring Bookings List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
              <Repeat className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                No recurring bookings
              </h3>
              <p className="text-stone-500 mb-6">
                Set up recurring bookings for regular care needs like weekly
                babysitting.
              </p>
              <Button
                onClick={handleNewRecurringClick}
                className="rounded-xl bg-accent hover:bg-accent-600 text-white"
              >
                <Plus size={18} className="mr-2" />
                Find a Caregiver
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`bg-white rounded-2xl border p-6 transition-all ${booking.is_active
                    ? 'border-neutral-200 hover:shadow-md'
                    : 'border-neutral-200 bg-neutral-50 opacity-75'
                    }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${booking.is_active
                          ? 'bg-primary-50 text-primary-700'
                          : 'bg-neutral-200 text-neutral-500'
                          }`}
                      >
                        <Repeat size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-primary-900">
                            {formatRecurrencePattern(
                              booking.recurrence_pattern
                            )}
                          </h3>
                          {booking.is_active ? (
                            <span className="px-2 py-0.5 rounded-full bg-success-100 text-success-700 text-xs font-medium flex items-center gap-1">
                              <CheckCircle2 size={12} />
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-600 text-xs font-medium flex items-center gap-1">
                              <XCircle size={12} />
                              Paused
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-sm text-neutral-500">
                          <UserIcon size={14} />
                          <span>{getNannyName(booking)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleToggleActive(booking.id, booking.is_active)
                        }
                        disabled={actionLoading === booking.id}
                        className={`rounded-xl ${booking.is_active
                          ? 'text-accent hover:bg-accent-50'
                          : 'text-neutral-600 hover:bg-neutral-100'
                          }`}
                        title={booking.is_active ? 'Pause' : 'Resume'}
                      >
                        {actionLoading === booking.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : booking.is_active ? (
                          <Pause size={18} />
                        ) : (
                          <Play size={18} />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(booking.id)}
                        disabled={actionLoading === booking.id}
                        className="text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-100">
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                        Start Time
                      </p>
                      <p className="text-sm font-medium text-neutral-900 flex items-center gap-1">
                        <Clock size={14} className="text-neutral-400" />
                        {booking.start_time}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                        Duration
                      </p>
                      <p className="text-sm font-medium text-neutral-900">
                        {booking.duration_hours} hour
                        {booking.duration_hours > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                        Started
                      </p>
                      <p className="text-sm font-medium text-neutral-900 flex items-center gap-1">
                        <Calendar size={14} className="text-neutral-400" />
                        {formatDate(booking.start_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                        Ends
                      </p>
                      <p className="text-sm font-medium text-neutral-900">
                        {booking.end_date
                          ? formatDate(booking.end_date)
                          : 'No end date'}
                      </p>
                    </div>
                  </div>

                  {booking.special_requirements && (
                    <div className="mt-4 pt-4 border-t border-neutral-100">
                      <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                        Notes
                      </p>
                      <p className="text-sm text-neutral-600">
                        {booking.special_requirements}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Previous Nannies Modal */}
      {showNannyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div>
                <h2 className="text-xl font-bold text-primary-900">
                  Choose a Caregiver
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Select from previous caregivers or browse new ones
                </p>
              </div>
              <button
                onClick={() => setShowNannyModal(false)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {loadingNannies ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
                </div>
              ) : previousNannies.length === 0 ? (
                <div className="text-center py-8">
                  <UserIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-600 font-medium mb-2">
                    No previous caregivers
                  </p>
                  <p className="text-neutral-500 text-sm">
                    You haven't booked with any caregivers yet. Browse to find
                    one.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-neutral-500 mb-4">
                    Your previous caregivers ({previousNannies.length})
                  </p>
                  {previousNannies.map((nanny) => {
                    const name = getPreviousNannyName(nanny);
                    const hourlyRate = nanny.nanny_details?.hourly_rate
                      ? parseFloat(nanny.nanny_details.hourly_rate)
                      : null;
                    const profileImage = nanny.profiles?.profile_image_url;

                    return (
                      /*
                      <Link
                        key={nanny.id}
                        href={`/book/${nanny.id}?recurring=true`}
                        onClick={() => setShowNannyModal(false)}
                        className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 hover:border-accent-300 hover:bg-accent-50/50 transition-all group"
                      >
                      */
                      <div
                        key={nanny.id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 hover:border-accent-300 hover:bg-accent-50/50 transition-all group cursor-not-allowed opacity-75"
                      >
                        {/* Avatar */}
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-100 to-neutral-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {profileImage ? (
                            <img
                              src={profileImage}
                              alt={name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xl font-bold text-stone-600">
                              {name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-primary-900 group-hover:text-accent-700 transition-colors truncate">
                            {name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
                            <span className="flex items-center gap-1">
                              <Star
                                size={12}
                                className="text-amber-400 fill-amber-400"
                              />
                              4.9
                            </span>
                            <span>•</span>
                            <span>
                              {nanny.bookingCount} booking
                              {nanny.bookingCount > 1 ? 's' : ''}
                            </span>
                            {hourlyRate && (
                              <>
                                <span>•</span>
                                <span>₦{hourlyRate.toLocaleString()}/hr</span>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-stone-400 mt-1">
                            Last booked: {formatDate(nanny.lastBookedDate)}
                          </p>
                        </div>

                        {/* Arrow */}
                        <div className="text-neutral-400 group-hover:text-accent-600 transition-colors">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-neutral-200 bg-neutral-50">
              <Link href="/parent-dashboard" onClick={() => setShowNannyModal(false)}>
                <Button className="w-full rounded-xl bg-accent hover:bg-accent-600 text-white">
                  <Search size={18} className="mr-2" />
                  Browse All Caregivers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </ParentLayout>
  );
}
