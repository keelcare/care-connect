'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { RecurringServiceRequest } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { Calendar, User, Clock, ChevronRight, RefreshCw, Repeat } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import {
  AdminPageHeader,
  SectionCard,
  StatusBadge,
  EmptyState,
} from '@/components/admin/ui';

export default function RecurringRequestsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [requests, setRequests] = useState<RecurringServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    if (user) fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await api.recurringRequests.getAllAdmin();
      const items = (data as any).items ?? (data as any).data ?? (Array.isArray(data) ? data : []);
      setRequests(items);
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to load recurring requests' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  if (loading && requests.length === 0) {
    return <div className="h-[calc(100vh-120px)] flex items-center justify-center"><Spinner /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <AdminPageHeader
        eyebrow="Operations"
        title="Recurring Requests"
        subtitle="Manage monthly plans and assign caregivers to specific dates."
        icon={Repeat}
        actions={
          <Button variant="outline" size="sm" onClick={fetchRequests} className="rounded-xl gap-2">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </Button>
        }
      />

      {requests.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-[24px] border border-neutral-100 shadow-soft hover:shadow-md transition-all overflow-hidden border-l-4 border-l-primary-500"
            >
              <div className="p-6 flex flex-col lg:flex-row gap-6 lg:items-center">
                <div className="flex-shrink-0 flex items-center gap-4 lg:border-r border-neutral-100 lg:pr-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-sky-50 text-sky-600">
                    <Calendar size={26} />
                  </div>
                  <div>
                    <StatusBadge tone="info">Monthly Plan</StatusBadge>
                    <p className="text-[11px] text-neutral-400 mt-1.5 font-mono uppercase">
                      #{request.id.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">Recurrence</p>
                    <p className="text-neutral-700 font-medium capitalize">{request.recurrence_type.replace('_', ' ')}</p>
                    <p className="text-neutral-500 text-sm">Starts {formatDate(request.start_date)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">Details</p>
                    <div className="flex items-center gap-2 text-neutral-700 font-medium">
                      <Clock size={16} className="text-neutral-300" />
                      {request.start_time_formatted ?? request.start_time} • {request.duration_hours}h
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">Parent</p>
                    <div className="flex items-center gap-2 text-neutral-700 font-medium">
                      <User size={16} className="text-neutral-300" />
                      {request.parent?.email || 'N/A'}
                    </div>
                    <p className="text-neutral-500 text-sm pl-6">
                      {request.num_children} {request.num_children === 1 ? 'Child' : 'Children'}
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 pt-4 lg:pt-0 lg:pl-6">
                  <Button
                    onClick={() => router.push(`/admin/recurring-requests/${request.id}`)}
                    className="w-full lg:w-auto rounded-xl px-8 shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                  >
                    View Bookings
                    <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SectionCard bodyClassName="p-0">
          <EmptyState icon={Calendar} title="No recurring requests" description="There are currently no active monthly plans." />
        </SectionCard>
      )}
    </div>
  );
}
