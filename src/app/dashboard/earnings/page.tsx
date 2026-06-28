'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { NannyEarningsAnalytics } from '@/types/api';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  TrendingUp,
  TrendingDown,
  Download,
  CheckCircle2,
  Wallet,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ── helpers ─────────────────────────────────────────────────────── */

function fmt(n: number) {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function shortDay(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'short' });
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ── simple bar chart ────────────────────────────────────────────── */

function RevenueChart({ trend }: { trend: { date: string; amount: number; projection?: number }[] }) {
  const maxAmount = Math.max(...trend.map((t) => t.amount), 1);
  const yLabels = [0, 250, 500, 750, 1000].filter((v) => v <= maxAmount * 1.2);

  return (
    <div className="relative">
      {/* Y axis labels */}
      <div className="flex">
        <div className="flex flex-col-reverse justify-between text-[10px] text-slate-400 font-mono pr-3 py-1" style={{ height: 160 }}>
          {yLabels.map((v) => (
            <span key={v}>₹{v >= 1000 ? `${v / 1000}k` : v}</span>
          ))}
        </div>

        {/* Bars + grid */}
        <div className="flex-1 relative" style={{ height: 160 }}>
          {/* Horizontal grid lines */}
          {yLabels.map((_, i) => (
            <div key={i} className="absolute w-full border-t border-slate-100"
              style={{ bottom: `${(i / (yLabels.length - 1)) * 100}%` }} />
          ))}

          {/* Bar columns */}
          <div className="absolute inset-0 flex items-end gap-1 px-1">
            {trend.map((t, i) => {
              const pct = maxAmount > 0 ? (t.amount / maxAmount) * 100 : 0;
              const isProjection = t.projection != null && t.amount === 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full relative flex items-end justify-center" style={{ height: 140 }}>
                    <div
                      className={`w-full rounded-t-lg transition-all ${isProjection ? 'bg-slate-200' : 'bg-primary-600'}`}
                      style={{ height: `${Math.max(pct, isProjection ? 10 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* X axis */}
      <div className="flex pl-10 mt-2 gap-1">
        {trend.map((t, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-slate-400 font-medium">
            {trend.length <= 7 ? shortDay(t.date) : i % 5 === 0 ? shortDate(t.date) : ''}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── main component ─────────────────────────────────────────────── */

type Period = 'week' | 'month';

export default function EarningsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<NannyEarningsAnalytics | null>(null);
  const [period, setPeriod] = useState<Period>('week');
  const [loading, setLoading] = useState(true);
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

  const fetchData = async (p: Period) => {
    try {
      setLoading(true);
      const data = await api.payments.getNannyEarningsAnalytics(p);
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load earnings analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(period); }, [period]);

  const periodLabel = period === 'week' ? 'This Week' : 'This Month';

  return (
    <ProtectedRoute allowedRoles={['nanny']}>
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary-900 tracking-tight">Earnings Analytics</h1>
            <p className="text-slate-500 text-sm mt-0.5">Track your income, payouts, and financial performance.</p>
          </div>
          <div className="flex items-center gap-2 self-start">
            {/* Period selector */}
            <div className="relative">
              <button
                onClick={() => setShowPeriodMenu(!showPeriodMenu)}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-primary-900 hover:border-primary-200 transition-all shadow-sm"
              >
                {periodLabel}
                <ChevronDown size={14} className={`transition-transform ${showPeriodMenu ? 'rotate-180' : ''}`} />
              </button>
              {showPeriodMenu && (
                <div className="absolute right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                  {(['week', 'month'] as Period[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPeriod(p); setShowPeriodMenu(false); }}
                      className={`block w-full px-5 py-2.5 text-sm font-semibold text-left hover:bg-primary-50 transition-colors ${period === p ? 'text-primary-700 bg-primary-50' : 'text-slate-600'}`}
                    >
                      {p === 'week' ? 'This Week' : 'This Month'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button variant="outline" className="h-9 rounded-xl border-slate-200 text-slate-600 gap-2 shadow-sm text-sm">
              <Download size={14} />
              Export
            </Button>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total available */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Available</p>
            {loading ? (
              <div className="h-8 w-32 bg-slate-100 animate-pulse rounded-lg mt-1" />
            ) : (
              <>
                <p className="text-3xl font-black text-primary-900">₹{fmt(analytics?.totalAvailable ?? 0)}</p>
                {analytics?.periodChange != null && (
                  <p className={`flex items-center gap-1 text-xs font-semibold mt-1.5 ${analytics.periodChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {analytics.periodChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {analytics.periodChange >= 0 ? '+' : ''}{analytics.periodChange}% vs last {period}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Pending processing */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Processing</p>
            {loading ? (
              <div className="h-8 w-28 bg-slate-100 animate-pulse rounded-lg mt-1" />
            ) : (
              <>
                <p className="text-3xl font-black text-primary-900">₹{fmt(analytics?.pendingProcessing ?? 0)}</p>
                <p className="text-xs text-slate-400 mt-1.5">Expected next Tuesday</p>
              </>
            )}
          </div>

          {/* Jobs completed */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jobs Completed</p>
            {loading ? (
              <div className="h-8 w-16 bg-slate-100 animate-pulse rounded-lg mt-1" />
            ) : (
              <>
                <p className="text-3xl font-black text-primary-900">{analytics?.jobsCompleted ?? 0}</p>
                <p className="flex items-center gap-1 text-xs text-slate-400 mt-1.5">
                  <CheckCircle2 size={11} className="text-emerald-500" />
                  {analytics?.jobsThisPeriod ?? 0} {period === 'week' ? 'this week' : 'this month'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Revenue Trends chart ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-primary-900 text-base">Revenue Trends</h2>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                Income
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                Projection
              </span>
            </div>
          </div>

          {loading ? (
            <div className="h-48 bg-slate-50 animate-pulse rounded-xl" />
          ) : analytics?.trend.length ? (
            <RevenueChart trend={analytics.trend} />
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              No earnings data for this period
            </div>
          )}
        </div>

        {/* ── Recent transactions ── */}
        {!loading && analytics && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-5 border-b border-slate-50">
              <h2 className="font-bold text-primary-900 text-base">Income Breakdown</h2>
              <p className="text-xs text-slate-400 mt-0.5">Daily earnings for the selected period</p>
            </div>
            <div className="divide-y divide-slate-50">
              {analytics.trend.filter((t) => t.amount > 0).map((t, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <Wallet size={14} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-900">
                        {new Date(t.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-slate-400">Care session earnings</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-emerald-600">+₹{fmt(t.amount)}</p>
                </div>
              ))}
              {analytics.trend.every((t) => t.amount === 0) && (
                <div className="px-5 py-8 text-center text-slate-400 text-sm">
                  No earnings recorded for this period
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
