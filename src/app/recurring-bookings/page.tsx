'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';
import ParentLayout from '@/components/layout/ParentLayout';
import { Button } from '@/components/ui/button';
import { RecurringServiceRequest } from '@/types/api';
import { formatRecurrencePattern } from '@/components/scheduling/DaySelector';
import {
  Calendar,
  Clock,
  Plus,
  Repeat,
  CalendarDays,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';

export default function RecurringBookingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [requests, setRequests] = useState<RecurringServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecurringRequests();
  }, []);

  const fetchRecurringRequests = async () => {
    try {
      setLoading(true);
      const data = await api.recurringRequests.getParentRequests();
      setRequests(data);
    } catch (error) {
      logger.error('Failed to fetch recurring requests:', error);
      addToast({ message: 'Failed to load recurring plans', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleNewRecurringClick = () => {
    router.push('/book-service');
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
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

  return (
    <ParentLayout>
      <div className="min-h-dvh bg-stone-50 pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <Repeat className="w-5 h-5 text-primary-900" />
                  </div>
                  <h1 className="text-3xl font-bold text-primary-900 font-heading">
                    Recurring Plans
                  </h1>
                </div>
                <p className="text-stone-500 mt-1">
                  Manage your long-term care plans and schedules
                </p>
              </div>
              <Button
                onClick={handleNewRecurringClick}
                className="rounded-xl bg-primary hover:bg-primary-600 text-white shadow-sm"
              >
                <Plus size={18} className="mr-2" />
                New Plan
              </Button>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 mb-8 shadow-sm">
            <CalendarDays className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900">
                How recurring plans work
              </p>
              <p className="text-sm text-blue-700/80 mt-1">
                Your recurring plans automatically generate individual bookings for your caregivers. 
                You can manage individual sessions within each plan's details page.
              </p>
            </div>
          </div>

          {/* Recurring Requests List */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Repeat className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-lg font-bold text-primary-900 mb-2 font-heading">
                No active plans
              </h3>
              <p className="text-stone-500 mb-6 max-w-sm mx-auto text-sm">
                Set up a recurring plan to ensure your child gets consistent care every week or month.
              </p>
              <Button
                onClick={handleNewRecurringClick}
                className="rounded-xl bg-primary hover:bg-primary-600 text-white"
              >
                <Plus size={18} className="mr-2" />
                Explore Services
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Link href={`/recurring-bookings/${request.id}`} key={request.id}>
                  <div className="group bg-white rounded-3xl border border-stone-200 p-6 transition-all hover:border-primary-300 hover:shadow-md cursor-pointer relative overflow-hidden">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Repeat size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-primary-900 font-heading">
                              {request.category} • {request.plan_type.replace('_', ' ')}
                            </h3>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-sm font-medium text-stone-500 mt-1">
                            {(() => {
                              const p = request.recurrence_pattern as any;
                              if (!p) return request.recurrence_type ?? 'Recurring';
                              if (typeof p === 'object') {
                                if (Array.isArray(p.days) && p.days.length > 0) return p.days.join(', ');
                                if (Array.isArray(p.dates) && p.dates.length > 0) return `Dates: ${p.dates.join(', ')}`;
                                return request.recurrence_type ?? 'Recurring';
                              }
                              return formatRecurrencePattern(p);
                            })()}
                          </p>
                        </div>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-stone-50 group-hover:bg-primary-50 flex items-center justify-center transition-colors">
                        <ChevronRight className="text-stone-400 group-hover:text-primary-600" size={20} />
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 border-t border-stone-100 bg-stone-50/50 -mx-6 -mb-6 p-6 rounded-b-3xl">
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                          Time & Duration
                        </p>
                        <p className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                          <Clock size={14} className="text-primary-600" />
                          {request.start_time_formatted ?? request.start_time} • {request.duration_hours} hr
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                          Next Upcoming
                        </p>
                        <p className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                          <Calendar size={14} className="text-emerald-600" />
                          {formatDate(request.next_upcoming_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                          Generated Bookings
                        </p>
                        <p className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                          <CalendarDays size={14} className="text-blue-600" />
                          {request._count?.bookings ?? request.total_bookings ?? 0} scheduled
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                          Started On
                        </p>
                        <p className="text-sm font-semibold text-stone-900">
                          {formatDate(request.start_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </ParentLayout>
  );
}
