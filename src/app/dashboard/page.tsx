'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSSE, SSE_EVENT_TYPES } from '@/context/SSEProvider';
import { api } from '@/lib/api';
import { Booking } from '@/types/api';
import { NannyDashboardSummary } from '@/types/api';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NannyVerificationBanner } from '@/components/onboarding/NannyVerificationBanner';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  BarChart2,
  Star,
  Wallet,
  ArrowUpRight,
  Play,
  Eye,
  MessageSquare,
  IndianRupee,
} from 'lucide-react';

/* ── helpers ─────────────────────────────────────────────────────── */

function formatTime(iso?: string | null) {
  if (!iso) return '—';
  try {
    if (iso.includes('T')) return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const [h, m] = iso.split(':').map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  } catch { return iso; }
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function todayLabel() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

const STATUS_META: Record<string, { dot: string; label: string; bg: string; text: string }> = {
  CONFIRMED:   { dot: 'bg-primary-600', label: 'Upcoming',    bg: 'bg-primary-50',  text: 'text-primary-700' },
  IN_PROGRESS: { dot: 'bg-amber-500 animate-pulse', label: 'In Progress', bg: 'bg-amber-50', text: 'text-amber-700' },
  COMPLETED:   { dot: 'bg-emerald-500', label: 'Completed',  bg: 'bg-emerald-50', text: 'text-emerald-700' },
  ASSIGNED:    { dot: 'bg-primary-400', label: 'Upcoming',    bg: 'bg-primary-50',  text: 'text-primary-700' },
};

/* ── main component ─────────────────────────────────────────────── */

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [summary, setSummary] = useState<NannyDashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [bookingsData, summaryData] = await Promise.all([
        api.bookings.getNannyBookings(),
        api.nanny.getDashboardSummary().catch(() => null),
      ]);
      setBookings(bookingsData);
      setSummary(summaryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !user || user.role !== 'nanny') return;
    fetchData();
  }, [authLoading, user?.id, fetchData]);

  useEffect(() => {
    if (authLoading || !user || user.role !== 'nanny') return;
    if (!user.profiles?.onboarding_completed) {
      router.replace('/nanny/onboarding');
    }
  }, [authLoading, user, router]);

  const { subscribe } = useSSE();
  useEffect(() => {
    const events = [
      SSE_EVENT_TYPES.BOOKING_CREATED, SSE_EVENT_TYPES.BOOKING_UPDATED,
      SSE_EVENT_TYPES.BOOKING_STARTED, SSE_EVENT_TYPES.BOOKING_COMPLETED,
      SSE_EVENT_TYPES.BOOKING_CANCELLED,
    ];
    const unsubs = events.map((e) => subscribe(e, fetchData));
    return () => unsubs.forEach((u) => u());
  }, [subscribe, fetchData]);

  const handleCheckIn = async (booking: Booking) => {
    if (!('geolocation' in navigator)) { toast.error('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          await api.bookings.start(booking.id, { latitude: coords.latitude, longitude: coords.longitude });
          toast.success('Checked in successfully!');
          fetchData();
        } catch (err: any) { toast.error(err.message || 'Check-in failed'); }
      },
      () => toast.error('Location access denied'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  /* skeleton */
  if (authLoading || loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-white rounded-2xl border border-slate-100" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 h-80 bg-white rounded-2xl border border-slate-100" />
          <div className="h-80 bg-white rounded-2xl border border-slate-100" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    );
  }

  const firstName = user?.profiles?.first_name || 'there';
  const currentSession = bookings.find((b) => b.status === 'IN_PROGRESS');
  const todaySchedule = summary?.todaySchedule ?? [];
  const upcomingToday = todaySchedule.filter((s) => s.status !== 'COMPLETED');

  return (
    <ProtectedRoute allowedRoles={['nanny']}>
      <div className="space-y-6">
        {user && user.identity_verification_status !== 'verified' && (
          <NannyVerificationBanner
            status={user.identity_verification_status ?? null}
            onResubmit={() => router.push('/nanny/onboarding?step=documents')}
          />
        )}

        {/* ── Header row ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary-900 tracking-tight">
              {getGreeting()}, {firstName}.
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Here's your summary for {todayLabel()}.</p>
          </div>
          {/* Online / Offline toggle */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 self-start sm:self-auto shadow-sm">
            <button
              onClick={() => setIsOnline(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isOnline ? 'bg-emerald-50 text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              Online
            </button>
            <button
              onClick={() => setIsOnline(false)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!isOnline ? 'bg-slate-100 text-slate-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Go Offline
            </button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Today's earnings */}
          <div className="col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Earnings</p>
            <p className="text-3xl font-black text-primary-900">
              ₹{(summary?.todayEarnings ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {summary?.earningsChange != null && (
              <p className={`flex items-center gap-1 text-xs font-semibold mt-1 ${summary.earningsChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {summary.earningsChange >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {summary.earningsChange >= 0 ? '+' : ''}{summary.earningsChange}% vs last {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
              </p>
            )}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-50">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Completed</p>
                <p className="text-xl font-bold text-primary-900 mt-0.5">{summary?.completedToday ?? 0}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Pending</p>
                <p className="text-xl font-bold text-primary-900 mt-0.5">{summary?.pendingToday ?? 0}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Sessions</p>
                <p className="text-xl font-bold text-primary-900 mt-0.5">{todaySchedule.length}</p>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pro Rating</p>
              <Star size={16} className="text-amber-400 fill-amber-400" />
            </div>
            <p className="text-3xl font-black text-primary-900">{(user?.averageRating ?? 5.0).toFixed(1)}</p>
            <p className="text-xs text-slate-400 mt-0.5">/ 5.0</p>
            <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${((user?.averageRating ?? 5) / 5) * 100}%` }} />
            </div>
          </div>

          {/* Completion rate */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completion</p>
              <CheckCircle2 size={16} className="text-primary-600" />
            </div>
            <p className="text-3xl font-black text-primary-900">
              {bookings.length > 0
                ? `${Math.round((bookings.filter(b => b.status === 'COMPLETED').length / bookings.filter(b => ['COMPLETED','CANCELLED'].includes(b.status)).length || 1) * 100)}%`
                : '—'}
            </p>
            <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600 rounded-full"
                style={{ width: bookings.length > 0 ? `${Math.round((bookings.filter(b => b.status === 'COMPLETED').length / Math.max(bookings.filter(b => ['COMPLETED','CANCELLED'].includes(b.status)).length, 1)) * 100)}%` : '0%' }} />
            </div>
          </div>
        </div>

        {/* ── Main 2-col layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left: today's schedule ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-primary-900">Today's Schedule</h2>
              <Link href="/dashboard/bookings" className="text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1">
                View All <ChevronRight size={13} />
              </Link>
            </div>

            {todaySchedule.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar size={20} className="text-primary-400" />
                </div>
                <p className="font-semibold text-primary-900 text-sm">No sessions today</p>
                <p className="text-slate-400 text-xs mt-1">Enjoy your day off!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {todaySchedule.map((session) => {
                  const meta = STATUS_META[session.status] ?? STATUS_META['CONFIRMED'];
                  const matchedBooking = bookings.find((b) => b.id === session.id);
                  const isUpcoming = session.status === 'CONFIRMED' || session.status === 'ASSIGNED';
                  const isActive = session.status === 'IN_PROGRESS';
                  const isDone = session.status === 'COMPLETED';

                  return (
                    <div
                      key={session.id}
                      className={`bg-white rounded-2xl border shadow-sm p-4 flex flex-col gap-3 transition-all ${isActive ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-100'} ${isDone ? 'opacity-75' : ''}`}
                    >
                      {/* Status + amount */}
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${meta.bg} ${meta.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                        <span className="text-sm font-bold text-primary-900">
                          #{session.id.slice(0, 6).toUpperCase()}
                        </span>
                      </div>

                      {/* Service info */}
                      <div>
                        <p className="font-bold text-primary-900 text-sm">
                          {session.category === 'CC' ? 'Child Care' : 'Shadow Teacher'} Session
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {session.numChildren} {session.numChildren === 1 ? 'child' : 'children'} · {session.parentName}
                        </p>
                      </div>

                      {/* Time & location */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock size={12} className="text-primary-400 flex-shrink-0" />
                          {formatTime(session.startTime)}
                          {session.endTime ? ` – ${formatTime(session.endTime)}` : ''}
                        </div>
                        {session.location && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin size={12} className="text-emerald-500 flex-shrink-0" />
                            <span className="truncate">{session.location}</span>
                          </div>
                        )}
                      </div>

                      {/* CTA */}
                      {isUpcoming && matchedBooking && (
                        <div className="flex gap-2 mt-1">
                          <Button
                            onClick={() => handleCheckIn(matchedBooking)}
                            className="flex-1 h-8 rounded-xl bg-primary-900 text-white text-xs font-bold hover:bg-primary-800 gap-1.5"
                          >
                            <Play size={11} />
                            Start Job
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => router.push(`/dashboard/bookings/${session.id}`)}
                            className="h-8 w-8 rounded-xl border-slate-200 p-0 flex items-center justify-center"
                          >
                            <Eye size={13} className="text-slate-500" />
                          </Button>
                        </div>
                      )}
                      {isActive && (
                        <Button
                          onClick={() => router.push(`/dashboard/bookings/${session.id}`)}
                          className="w-full h-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold gap-1.5"
                        >
                          View Active Session
                        </Button>
                      )}
                      {isDone && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-emerald-600">Payment Processed</span>
                          <button
                            onClick={() => router.push(`/dashboard/bookings/${session.id}`)}
                            className="text-xs text-primary-600 font-semibold hover:underline"
                          >
                            Receipt
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: quick links ── */}
          <div className="space-y-4">
            {/* Quick nav cards */}
            <h2 className="text-base font-bold text-primary-900">Quick Access</h2>
            <div className="space-y-2">
              {[
                { href: '/dashboard/earnings', icon: Wallet, label: 'Earnings', sub: 'View income & analytics', color: 'text-primary-600', bg: 'bg-primary-50' },
                { href: '/dashboard/bookings', icon: Calendar, label: 'Bookings', sub: 'Manage your sessions', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { href: '/dashboard/availability', icon: Clock, label: 'Availability', sub: 'Block time off', color: 'text-amber-600', bg: 'bg-amber-50' },
                { href: '/dashboard/performance', icon: BarChart2, label: 'Performance', sub: 'Ratings & feedback', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl p-3.5 shadow-sm hover:border-primary-200 hover:bg-primary-50/30 transition-all group"
                >
                  <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <item.icon size={17} className={item.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-primary-900">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.sub}</p>
                  </div>
                  <ChevronRight size={15} className="text-slate-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>

            {/* Current session highlight if IN_PROGRESS */}
            {currentSession && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <p className="text-xs font-black text-amber-700 uppercase tracking-widest">Session Active</p>
                </div>
                <p className="font-bold text-primary-900 text-sm mb-1">
                  {currentSession.parent?.profiles?.first_name ?? 'Client'}
                </p>
                <p className="text-xs text-slate-500 mb-3">
                  {formatTime(currentSession.start_time)} – {formatTime(currentSession.end_time)}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push(`/dashboard/messages?booking=${currentSession.id}`)}
                    className="flex-1 h-8 rounded-xl bg-primary-900 text-white text-xs font-bold gap-1.5"
                  >
                    <MessageSquare size={11} /> Message
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/bookings/${currentSession.id}`)}
                    className="flex-1 h-8 rounded-xl border-slate-200 text-xs font-semibold text-slate-600"
                  >
                    Details
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
