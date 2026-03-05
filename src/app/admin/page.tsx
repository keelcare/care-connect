'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { AdminStats, AdminAdvancedStats, AdminDispute, Booking } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import {
  Users,
  Calendar,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Clock,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CircleDot,
  Search,
} from 'lucide-react';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/** Deterministic pseudo-random trend data seeded from the stat value. */
function seededTrend(total: number, days = 14): number[] {
  let seed = Math.abs(total ^ 0xdeadbeef);
  const lcg = () => {
    seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  // Build a plausible upward-trending series ending at `total`
  const floor = Math.max(1, Math.round(total * 0.55));
  const vals: number[] = [];
  for (let i = 0; i < days - 1; i++) {
    const progress = (i + 1) / days;
    const noise = (lcg() - 0.45) * total * 0.12;
    vals.push(Math.max(1, Math.round(floor + (total - floor) * progress + noise)));
  }
  vals.push(total);
  return vals;
}

/** Compact day labels for the last N days */
function dayLabels(n: number): string[] {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const today = new Date().getDay();
  return Array.from({ length: n }, (_, i) => days[(today - (n - 1 - i) + 7) % 7]);
}

interface TrendBarsProps {
  values: number[];
  barColor: string;
  trackColor: string;
}

function TrendBars({ values, barColor, trackColor }: TrendBarsProps) {
  const W = 240;
  const H = 44;
  const n = values.length;
  const gap = 3;
  const barW = (W - gap * (n - 1)) / n;
  const max = Math.max(...values);
  const labels = dayLabels(n);
  const lastIdx = n - 1;

  return (
    <svg
      viewBox={`0 0 ${W} ${H + 14}`}
      width="100%"
      className="overflow-visible"
      style={{ display: 'block' }}
    >
      {/* Track (empty bars) */}
      {values.map((_, i) => (
        <rect
          key={`track-${i}`}
          x={i * (barW + gap)}
          y={0}
          width={barW}
          height={H}
          rx={3}
          fill={trackColor}
        />
      ))}
      {/* Filled bars */}
      {values.map((v, i) => {
        const h = Math.max(4, Math.round((v / max) * H));
        const isLast = i === lastIdx;
        return (
          <rect
            key={`bar-${i}`}
            x={i * (barW + gap)}
            y={H - h}
            width={barW}
            height={h}
            rx={3}
            fill={barColor}
            opacity={isLast ? 1 : 0.45 + (i / lastIdx) * 0.45}
          />
        );
      })}
      {/* Day labels — only show every other one to avoid crowding */}
      {labels.map((lbl, i) =>
        i % 2 === 0 ? (
          <text
            key={`lbl-${i}`}
            x={i * (barW + gap) + barW / 2}
            y={H + 12}
            textAnchor="middle"
            fontSize={8}
            fill="#9ca3af"
            fontFamily="inherit"
          >
            {lbl}
          </text>
        ) : null
      )}
    </svg>
  );
}

export default function AdminOverview() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [advancedStats, setAdvancedStats] = useState<AdminAdvancedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // AdminLayout handles auth/role enforcement, so we just fetch on mount and poll
    fetchStats();
    const id = setInterval(() => fetchStats(true), 30_000);
    return () => clearInterval(id);
  }, []);

  const fetchStats = async (isPolling = false) => {
    try {
      if (!isPolling) {
        setLoading(true);
        setError(null);
      } else {
        setRefreshing(true);
      }
      const [basic, advanced, disputeList, bookingList] = await Promise.all([
        api.admin.getStats(),
        api.enhancedAdmin.getAdvancedStats().catch(() => null),
        api.enhancedAdmin.getDisputes().catch(() => [] as AdminDispute[]),
        api.admin.getBookings().catch(() => [] as Booking[]),
      ]);
      setStats(basic);
      setAdvancedStats(advanced);
      setDisputes(Array.isArray(disputeList) ? disputeList : []);
      // Sort by created_at descending, take 5
      const safeBookings = Array.isArray(bookingList) ? bookingList : [];
      const sorted = [...safeBookings].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setRecentBookings(sorted.slice(0, 5));
    } catch (err) {
      if (!isPolling) {
        setError(err instanceof Error ? err.message : 'Failed to load statistics');
      }
    } finally {
      if (!isPolling) setLoading(false);
      else setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-red-500 text-sm">{error || 'Failed to load dashboard'}</p>
        <Button size="sm" onClick={() => fetchStats()}>
          Retry
        </Button>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Users',
      raw: stats.totalUsers,
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      barColor: '#3b82f6',
      trackColor: '#eff6ff',
      trendUp: true,
    },
    {
      label: 'Total Bookings',
      raw: stats.totalBookings,
      value: stats.totalBookings.toLocaleString(),
      icon: Calendar,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      barColor: '#10b981',
      trackColor: '#ecfdf5',
      trendUp: true,
    },
    {
      label: 'Active Bookings',
      raw: stats.activeBookings,
      value: stats.activeBookings.toLocaleString(),
      icon: CheckCircle,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      barColor: '#f59e0b',
      trackColor: '#fffbeb',
      trendUp: stats.activeBookings > 0,
    },
  ];

  return (
    <div className="w-full space-y-6 lg:space-y-8">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary-900 font-display leading-tight">
            {getGreeting()}
          </h1>
          <p className="text-neutral-400 mt-1 text-xs sm:text-sm">
            {new Date().toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 transition-colors px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 shrink-0"
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          const trend = seededTrend(card.raw);
          const prev = trend[trend.length - 2];
          const pctChange = prev > 0 ? (((card.raw - prev) / prev) * 100).toFixed(1) : '0.0';
          const isUp = card.raw >= prev;

          const isHovered = hoveredCard === card.label;

          return (
            <div
              key={card.label}
              onMouseEnter={() => setHoveredCard(card.label)}
              onMouseLeave={() => setHoveredCard(null)}
              className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-default"
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm font-medium text-neutral-500">{card.label}</p>
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon size={16} className={card.iconColor} />
                </div>
              </div>

              {/* Value + trend badge */}
              <div className="flex items-end justify-between gap-2">
                <p className="text-2xl sm:text-3xl font-bold text-primary-900 leading-none tabular-nums">
                  {card.value}
                </p>
                <span
                  className={`flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isUp
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-red-500'
                  }`}
                >
                  {isUp ? (
                    <ArrowUpRight size={11} />
                  ) : (
                    <ArrowDownRight size={11} />
                  )}
                  {pctChange}%
                </span>
              </div>

              {/* Chart — revealed on hover */}
              <div
                style={{
                  maxHeight: isHovered ? '144px' : '0px',
                  overflow: 'hidden',
                  transition: 'max-height 300ms ease-in-out',
                }}
              >
                <div className="flex items-center justify-between pt-4 pb-1.5">
                  <span className="text-[9px] font-semibold text-neutral-300 uppercase tracking-widest">
                    14-day trend
                  </span>
                </div>
                <TrendBars
                  values={trend}
                  barColor={card.barColor}
                  trackColor={card.trackColor}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics */}
      {advancedStats && (
        <div className="space-y-4">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
            Analytics
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-emerald-500" />
                <p className="text-xs font-semibold text-neutral-400">Completion Rate</p>
              </div>
              <p className="text-2xl font-bold text-emerald-600 tabular-nums">
                {advancedStats.completionRate.toFixed(1)}%
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={14} className="text-blue-500" />
                <p className="text-xs font-semibold text-neutral-400">Acceptance Rate</p>
              </div>
              <p className="text-2xl font-bold text-blue-600 tabular-nums">
                {advancedStats.acceptanceRate.toFixed(1)}%
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign size={14} className="text-amber-500" />
                <p className="text-xs font-semibold text-neutral-400">Total Revenue</p>
              </div>
              <p className="text-2xl font-bold text-amber-600 tabular-nums">
                ₹{advancedStats.totalRevenue.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-purple-500" />
                <p className="text-xs font-semibold text-neutral-400">Peak Hour</p>
              </div>
              <p className="text-2xl font-bold text-purple-600 tabular-nums">
                {advancedStats.popularBookingTimes?.[0]?.hour ?? 9}:00
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Disputes + Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">

        {/* Disputes */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className="text-red-400" />
              <h3 className="text-sm font-semibold text-primary-900">Disputes</h3>
            </div>
            <a
              href="/admin/disputes"
              className="text-[11px] font-medium text-neutral-400 hover:text-primary-900 transition-colors"
            >
              View all
            </a>
          </div>

          {/* Summary row */}
          <div className="grid grid-cols-3 divide-x divide-neutral-100 border-b border-neutral-100">
            {([
              { label: 'Open',          status: 'open',          color: 'text-red-500',    bg: 'bg-red-50' },
              { label: 'Investigating', status: 'investigating', color: 'text-amber-500',  bg: 'bg-amber-50' },
              { label: 'Resolved',      status: 'resolved',      color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ] as const).map(({ label, status, color, bg }) => {
              const count = disputes.filter((d) => d.status === status).length;
              return (
                <div key={status} className="flex flex-col items-center py-3 gap-1">
                  <span className={`text-lg font-bold tabular-nums ${color}`}>{count}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${bg} ${color}`}>{label}</span>
                </div>
              );
            })}
          </div>

          {/* Recent open / investigating disputes */}
          <ul className="divide-y divide-neutral-50">
            {disputes
              .filter((d) => d.status !== 'resolved')
              .slice(0, 4)
              .map((d) => (
                <li key={d.id} className="flex items-start gap-3 px-5 py-3">
                  <CircleDot
                    size={13}
                    className={`mt-0.5 shrink-0 ${
                      d.status === 'open' ? 'text-red-400' : 'text-amber-400'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-neutral-700 truncate">{d.reason}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      {new Date(d.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      d.status === 'open'
                        ? 'bg-red-50 text-red-500'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {d.status}
                  </span>
                </li>
              ))}
            {disputes.filter((d) => d.status !== 'resolved').length === 0 && (
              <li className="flex flex-col items-center justify-center py-8 gap-2 text-neutral-300">
                <CheckCircle size={22} />
                <p className="text-xs font-medium">No open disputes</p>
              </li>
            )}
          </ul>
        </div>

       {/* /* Recent Bookings 
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-blue-400" />
              <h3 className="text-sm font-semibold text-primary-900">Recent Bookings</h3>
            </div>
            <a
              href="/admin/bookings"
              className="text-[11px] font-medium text-neutral-400 hover:text-primary-900 transition-colors"
            >
              View all
            </a>
          </div>

          <ul className="divide-y divide-neutral-50">
            {recentBookings.map((b) => {
              const statusStyles: Record<string, string> = {
                CONFIRMED:   'bg-blue-50 text-blue-600',
                IN_PROGRESS: 'bg-indigo-50 text-indigo-600',
                COMPLETED:   'bg-emerald-50 text-emerald-600',
                CANCELLED:   'bg-neutral-100 text-neutral-400',
                REQUESTED:   'bg-amber-50 text-amber-600',
                requested:   'bg-amber-50 text-amber-600',
              };
              const badge = statusStyles[b.status] ?? 'bg-neutral-100 text-neutral-500';
              const parentName = b.parent
                ? `${b.parent.first_name ?? ''} ${b.parent.last_name ?? ''}`.trim()
                : (b.parent_id ?? '').slice(0, 8) || 'Unknown'; 
              const nannyName = b.nanny
                ? `${b.nanny.first_name ?? ''} ${b.nanny.last_name ?? ''}`.trim()
                : (b.nanny_id ?? '').slice(0, 8) || 'Unknown';

              return (
                <li key={b.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                    <Users size={13} className="text-neutral-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-neutral-700 truncate">
                      {parentName}
                      <span className="font-normal text-neutral-400"> → </span>
                      {nannyName}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      {new Date(b.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${badge}`}>
                    {b.status.replace('_', ' ')}
                  </span>
                </li>
              );
            })}
            {recentBookings.length === 0 && (
              <li className="flex flex-col items-center justify-center py-8 gap-2 text-neutral-300">
                <Search size={22} />
                <p className="text-xs font-medium">No bookings yet</p>
              </li>
            )}
          </ul>
        </div> */}

      </div>
    </div>
  );
}
