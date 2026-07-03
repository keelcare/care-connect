'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { useSSE, SSE_EVENT_TYPES } from '@/context/SSEProvider';
import { Calendar, Search, PlayCircle, CheckCircle2, XCircle, CircleDot } from 'lucide-react';
import {
  AdminPageHeader,
  StatCard,
  SectionCard,
  StatusBadge,
  BadgeTone,
  EmptyState,
  AdminTable,
  THead,
  TH,
  TR,
  TD,
  AdminSearch,
} from '@/components/admin/ui';

interface AdminBooking extends Omit<Booking, 'users_bookings_nanny_idTousers' | 'users_bookings_parent_idTousers'> {
  jobs?: { title?: string; description?: string };
  users_bookings_nanny_idTousers?: { id: string; email: string; profiles?: { first_name?: string | null; last_name?: string | null } };
  users_bookings_parent_idTousers?: { id: string; email: string; profiles?: { first_name?: string | null; last_name?: string | null } };
}

const STATUS_TONE: Record<string, BadgeTone> = {
  CONFIRMED: 'info',
  ACCEPTED: 'info',
  ASSIGNED: 'info',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'danger',
  PENDING: 'neutral',
  REQUESTED: 'neutral',
};

const FILTERS = ['ALL', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;
type Filter = (typeof FILTERS)[number];

export default function AdminBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('ALL');
  const { subscribe } = useSSE();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    if (user) fetchBookings();
  }, [user]);

  useEffect(() => {
    const handleRefresh = () => fetchBookings();
    const unsubscribers = [
      subscribe(SSE_EVENT_TYPES.BOOKING_CREATED, handleRefresh),
      subscribe(SSE_EVENT_TYPES.BOOKING_UPDATED, handleRefresh),
      subscribe(SSE_EVENT_TYPES.BOOKING_STARTED, handleRefresh),
      subscribe(SSE_EVENT_TYPES.BOOKING_COMPLETED, handleRefresh),
      subscribe(SSE_EVENT_TYPES.BOOKING_CANCELLED, handleRefresh),
      subscribe(SSE_EVENT_TYPES.BOOKING_RESCHEDULED, handleRefresh),
      subscribe(SSE_EVENT_TYPES.ASSIGNMENT_ACCEPTED, handleRefresh),
    ];
    return () => unsubscribers.forEach((unsub) => unsub());
  }, [subscribe]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.admin.getBookings(1, 1000);
      const data = response.data || [];
      const enriched = await Promise.all(
        data.map(async (booking: AdminBooking) => {
          const eb = { ...booking };
          if (!booking.users_bookings_parent_idTousers?.profiles?.first_name && !booking.parent?.profiles?.first_name && booking.parent_id) {
            try { eb.parent = await api.users.get(booking.parent_id); } catch {}
          }
          if (!booking.users_bookings_nanny_idTousers?.profiles?.first_name && !booking.nanny?.profiles?.first_name && booking.nanny_id) {
            try { eb.nanny = await api.users.get(booking.nanny_id); } catch {}
          }
          return eb;
        })
      );
      setBookings(enriched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const jobTitle = (b: AdminBooking) => b.jobs?.title || b.job?.title || 'Direct Booking';
  const partyName = (
    prisma?: { email: string; profiles?: { first_name?: string | null; last_name?: string | null } },
    standard?: Booking['parent'],
  ) => {
    const p = prisma?.profiles?.first_name ? prisma : undefined;
    if (p?.profiles?.first_name && p?.profiles?.last_name) return `${p.profiles.first_name} ${p.profiles.last_name}`;
    if (prisma?.email) return prisma.email;
    if (standard?.profiles?.first_name && standard?.profiles?.last_name) return `${standard.profiles.first_name} ${standard.profiles.last_name}`;
    return standard?.email || 'N/A';
  };
  const parentName = (b: AdminBooking) => partyName(b.users_bookings_parent_idTousers, b.parent);
  const nannyName = (b: AdminBooking) => partyName(b.users_bookings_nanny_idTousers, b.nanny);

  const counts = useMemo(() => {
    const c = { total: bookings.length, active: 0, progress: 0, completed: 0, cancelled: 0 };
    for (const b of bookings) {
      const s = (b.status || '').toUpperCase();
      if (s === 'IN_PROGRESS') c.progress++;
      else if (s === 'COMPLETED') c.completed++;
      else if (s === 'CANCELLED') c.cancelled++;
      else if (['CONFIRMED', 'ACCEPTED', 'ASSIGNED'].includes(s)) c.active++;
    }
    return c;
  }, [bookings]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      const s = (b.status || '').toUpperCase();
      const matchesFilter =
        filter === 'ALL' ||
        (filter === 'CONFIRMED' ? ['CONFIRMED', 'ACCEPTED', 'ASSIGNED'].includes(s) : s === filter);
      if (!matchesFilter) return false;
      if (!q) return true;
      return (
        jobTitle(b).toLowerCase().includes(q) ||
        parentName(b).toLowerCase().includes(q) ||
        nannyName(b).toLowerCase().includes(q)
      );
    });
  }, [bookings, search, filter]);

  if (loading) {
    return <div className="h-[calc(100vh-120px)] flex items-center justify-center"><Spinner /></div>;
  }
  if (error) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchBookings}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <AdminPageHeader
        eyebrow="Operations"
        title="Booking Management"
        subtitle="Monitor every booking on the platform in real time."
        icon={Calendar}
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total" value={counts.total} icon={Calendar} tone="navy" />
        <StatCard label="Active" value={counts.active} icon={CircleDot} tone="sky" />
        <StatCard label="In Progress" value={counts.progress} icon={PlayCircle} tone="amber" />
        <StatCard label="Completed" value={counts.completed} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Cancelled" value={counts.cancelled} icon={XCircle} tone="rose" />
      </div>

      <SectionCard bodyClassName="p-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-neutral-100">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  filter === f ? 'bg-primary-900 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                }`}
              >
                {f === 'ALL' ? 'All' : f.toLowerCase().replace('_', ' ')}
              </button>
            ))}
          </div>
          <AdminSearch value={search} onChange={setSearch} icon={Search} placeholder="Search job, parent, nanny…" className="sm:w-72" />
        </div>

        {visible.length === 0 ? (
          <EmptyState icon={Calendar} title="No bookings found" description={search || filter !== 'ALL' ? 'Try adjusting your filters.' : undefined} />
        ) : (
          <AdminTable>
            <THead>
              <TH>Job</TH>
              <TH>Parent</TH>
              <TH>Nanny</TH>
              <TH>Start time</TH>
              <TH>Status</TH>
              <TH className="text-right">Action</TH>
            </THead>
            <tbody>
              {visible.map((b) => (
                <TR key={b.id} onClick={() => router.push(`/admin/bookings/${b.id}`)}>
                  <TD className="font-semibold text-neutral-900">{jobTitle(b)}</TD>
                  <TD className="text-neutral-600">{parentName(b)}</TD>
                  <TD className="text-neutral-600">{nannyName(b)}</TD>
                  <TD className="text-neutral-500 whitespace-nowrap">
                    {b.start_time_formatted || new Date(b.start_time).toLocaleString()}
                  </TD>
                  <TD>
                    <StatusBadge tone={STATUS_TONE[(b.status || '').toUpperCase()] ?? 'neutral'} dot>
                      {b.status.toLowerCase().replace('_', ' ')}
                    </StatusBadge>
                  </TD>
                  <TD className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); router.push(`/admin/bookings/${b.id}`); }}
                      className="rounded-lg hover:bg-neutral-50"
                    >
                      View
                    </Button>
                  </TD>
                </TR>
              ))}
            </tbody>
          </AdminTable>
        )}
      </SectionCard>
    </div>
  );
}
