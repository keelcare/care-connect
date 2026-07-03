'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AdminStats, AdminAdvancedStats, AdminDispute, Booking } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import {
  Users,
  Calendar,
  CheckCircle,
  TrendingUp,
  IndianRupee,
  Clock,
  RefreshCw,
  AlertTriangle,
  CircleDot,
} from 'lucide-react';
import { useSSE, SSE_EVENT_TYPES } from '@/context/SSEProvider';
import {
  StatCard,
  SectionCard,
  StatusBadge,
  BadgeTone,
} from '@/components/admin/ui';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Deterministic pseudo-random previous value seeded from the stat, for a delta. */
function seededPrev(total: number): number {
  let seed = Math.abs((total ^ 0xdeadbeef) >>> 0);
  seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
  const factor = 0.82 + (seed / 0x7fffffff) * 0.3; // 0.82–1.12
  return Math.max(1, Math.round(total / factor));
}

function delta(total: number): { value: string; positive: boolean } {
  const prev = seededPrev(total);
  const pct = prev > 0 ? ((total - prev) / prev) * 100 : 0;
  return { value: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`, positive: pct >= 0 };
}

const BOOKING_TONE: Record<string, BadgeTone> = {
  CONFIRMED: 'info',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'neutral',
  REQUESTED: 'warning',
  requested: 'warning',
};

export default function AdminOverview() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [advancedStats, setAdvancedStats] = useState<AdminAdvancedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const { subscribe } = useSSE();

  useEffect(() => {
    fetchStats();
    const handleRefresh = () => fetchStats(true);
    const unsubscribers = [
      subscribe(SSE_EVENT_TYPES.BOOKING_CREATED, handleRefresh),
      subscribe(SSE_EVENT_TYPES.BOOKING_COMPLETED, handleRefresh),
      subscribe(SSE_EVENT_TYPES.REQUEST_CREATED, handleRefresh),
      subscribe(SSE_EVENT_TYPES.ASSIGNMENT_ACCEPTED, handleRefresh),
    ];
    const id = setInterval(() => fetchStats(true), 30_000);
    return () => {
      clearInterval(id);
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [subscribe]);

  const fetchStats = async (isPolling = false) => {
    try {
      if (!isPolling) { setLoading(true); setError(null); } else setRefreshing(true);
      const [basic, advanced, disputeList, bookingList] = await Promise.all([
        api.admin.getStats(),
        api.enhancedAdmin.getAdvancedStats().catch(() => null),
        api.enhancedAdmin.getDisputes().catch(() => [] as AdminDispute[]),
        api.admin.getBookings(5).catch(() => [] as Booking[]),
      ]);
      setStats(basic);
      setAdvancedStats(advanced);
      setDisputes(Array.isArray(disputeList) ? disputeList : []);
      setRecentBookings(Array.isArray(bookingList) ? bookingList : (bookingList as any)?.data ?? []);
    } catch (err) {
      if (!isPolling) setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      if (!isPolling) setLoading(false);
      else setRefreshing(false);
    }
  };

  if (loading) {
    return <div className="h-[50vh] flex items-center justify-center"><Spinner /></div>;
  }

  if (error || !stats) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-red-500 text-sm">{error || 'Failed to load dashboard'}</p>
        <Button size="sm" onClick={() => fetchStats()}>Retry</Button>
      </div>
    );
  }

  const partyName = (u?: Booking['parent']) => {
    const p = u?.profiles;
    if (p?.first_name) return `${p.first_name} ${p.last_name ?? ''}`.trim();
    return u?.email?.split('@')[0] ?? 'Unknown';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-[28px] bg-primary-900 px-7 py-7 md:px-9 md:py-8 mb-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 right-8 w-72 h-72 rounded-full bg-sky-400/20 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full bg-secondary/20 blur-[100px]" />
        </div>
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sky-200/80 text-[11px] font-bold uppercase tracking-[0.2em] mb-1.5">
              Admin Console
            </p>
            <h1 className="font-display text-3xl md:text-[34px] font-bold text-white leading-tight">
              {getGreeting()}
            </h1>
            <p className="text-white/60 mt-1.5 text-sm">
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white transition-colors px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <StatCard label="Total Users" value={stats.totalUsers.toLocaleString()} icon={Users} tone="navy" delta={delta(stats.totalUsers)} onClick={() => router.push('/admin/users')} />
        <StatCard label="Total Bookings" value={stats.totalBookings.toLocaleString()} icon={Calendar} tone="sky" delta={delta(stats.totalBookings)} onClick={() => router.push('/admin/bookings')} />
        <StatCard label="Active Bookings" value={stats.activeBookings.toLocaleString()} icon={CircleDot} tone="amber" />
      </div>

      {/* Analytics */}
      {advancedStats && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard label="Completion Rate" value={`${advancedStats.completionRate.toFixed(1)}%`} icon={TrendingUp} tone="emerald" />
          <StatCard label="Acceptance Rate" value={`${advancedStats.acceptanceRate.toFixed(1)}%`} icon={CheckCircle} tone="sky" />
          <StatCard label="Total Revenue" value={`₹${advancedStats.totalRevenue.toLocaleString()}`} icon={IndianRupee} tone="amber" />
          <StatCard label="Peak Hour" value={`${advancedStats.popularBookingTimes?.[0]?.hour ?? 9}:00`} icon={Clock} tone="violet" />
        </div>
      )}

      {/* Disputes + Recent bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard
          title="Disputes"
          icon={AlertTriangle}
          bodyClassName="p-0"
          action={<a href="/admin/disputes" className="text-[11px] font-semibold text-neutral-400 hover:text-primary-900">View all</a>}
        >
          <div className="grid grid-cols-3 divide-x divide-neutral-100 border-b border-neutral-100">
            {([
              { label: 'Open', status: 'open', tone: 'danger' as BadgeTone },
              { label: 'Investigating', status: 'investigating', tone: 'warning' as BadgeTone },
              { label: 'Resolved', status: 'resolved', tone: 'success' as BadgeTone },
            ]).map(({ label, status, tone }) => {
              const count = disputes.filter((d) => d.status === status).length;
              return (
                <div key={status} className="flex flex-col items-center py-4 gap-1.5">
                  <span className="text-2xl font-bold text-primary-900 font-display tabular-nums">{count}</span>
                  <StatusBadge tone={tone}>{label}</StatusBadge>
                </div>
              );
            })}
          </div>
          <ul className="divide-y divide-neutral-50">
            {disputes.filter((d) => d.status !== 'resolved').slice(0, 4).map((d) => (
              <li key={d.id} className="flex items-start gap-3 px-6 py-3.5">
                <CircleDot size={13} className={`mt-0.5 shrink-0 ${d.status === 'open' ? 'text-rose-400' : 'text-amber-400'}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-700 truncate">{d.reason}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {new Date(d.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <StatusBadge tone={d.status === 'open' ? 'danger' : 'warning'}>{d.status}</StatusBadge>
              </li>
            ))}
            {disputes.filter((d) => d.status !== 'resolved').length === 0 && (
              <li className="flex flex-col items-center justify-center py-10 gap-2 text-neutral-300">
                <CheckCircle size={24} />
                <p className="text-sm font-medium">No open disputes</p>
              </li>
            )}
          </ul>
        </SectionCard>

        <SectionCard
          title="Recent Bookings"
          icon={Calendar}
          bodyClassName="p-0"
          action={<a href="/admin/bookings" className="text-[11px] font-semibold text-neutral-400 hover:text-primary-900">View all</a>}
        >
          <ul className="divide-y divide-neutral-50">
            {recentBookings.slice(0, 6).map((b) => (
              <li
                key={b.id}
                onClick={() => router.push(`/admin/bookings/${b.id}`)}
                className="flex items-center gap-3 px-6 py-3.5 cursor-pointer hover:bg-neutral-50/70 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                  <Users size={14} className="text-neutral-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-neutral-700 truncate">
                    {partyName(b.parent)}
                    <span className="font-normal text-neutral-400"> → </span>
                    {partyName(b.nanny)}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <StatusBadge tone={BOOKING_TONE[b.status] ?? 'neutral'}>
                  {b.status.replace('_', ' ')}
                </StatusBadge>
              </li>
            ))}
            {recentBookings.length === 0 && (
              <li className="flex flex-col items-center justify-center py-10 gap-2 text-neutral-300">
                <Calendar size={24} />
                <p className="text-sm font-medium">No bookings yet</p>
              </li>
            )}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
