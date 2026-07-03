'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { NannyPerformance } from '@/types/api';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  Star,
  Clock,
  Lightbulb,
  TrendingUp,
  ChevronRight,
  Award,
  Smile,
  Meh,
  Frown,
} from 'lucide-react';
import { logger } from '@/lib/logger';

/* ── metric bar ─────────────────────────────────────────────────── */

function MetricBar({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-primary-900">{label}</span>
        </div>
        <span className="text-sm font-bold text-primary-900">{value}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

/* ── star display ────────────────────────────────────────────────── */

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
        />
      ))}
    </div>
  );
}

/* ── main page ───────────────────────────────────────────────────── */

export default function PerformancePage() {
  const { user } = useAuth();
  const [perf, setPerf] = useState<NannyPerformance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.nanny.getPerformance()
      .then(setPerf)
      .catch(logger.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute allowedRoles={['nanny']}>
      <div className="space-y-6">

        {/* ── Header ── */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary-900 tracking-tight">Performance Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">Analyse your service quality scores and client feedback.</p>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

          {/* Left: rating overview + metrics */}
          <div className="space-y-5">
            {/* Rating + metric bars */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
              {loading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-16 bg-slate-50 rounded-xl" />
                  <div className="h-4 bg-slate-50 rounded" />
                  <div className="h-4 bg-slate-50 rounded" />
                  <div className="h-4 bg-slate-50 rounded" />
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Big rating number */}
                  <div className="flex flex-col items-center justify-center sm:border-r sm:border-slate-100 sm:pr-6 pb-4 sm:pb-0 border-b sm:border-b-0 border-slate-100">
                    <p className="text-5xl font-black text-primary-900">{(perf?.averageRating ?? 0).toFixed(1)}</p>
                    <StarRating rating={perf?.averageRating ?? 0} size={18} />
                    <p className="text-xs text-slate-400 mt-2">Based on {perf?.totalReviews ?? 0} reviews</p>
                  </div>

                  {/* Metric bars */}
                  <div className="flex-1 space-y-4">
                    <MetricBar
                      label="Punctuality"
                      value={perf?.punctualityScore ?? 0}
                      color="bg-emerald-500"
                      icon={<Clock size={14} className="text-emerald-600" />}
                    />
                    <MetricBar
                      label="Expertise"
                      value={perf?.expertiseScore ?? 0}
                      color="bg-primary-600"
                      icon={<Award size={14} className="text-primary-600" />}
                    />
                    <MetricBar
                      label="Professionalism"
                      value={perf?.professionalismScore ?? 0}
                      color="bg-indigo-500"
                      icon={<TrendingUp size={14} className="text-indigo-600" />}
                    />
                    {perf && (
                      <div className="pt-2 border-t border-slate-50">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 font-medium">Completion Rate</span>
                          <span className="font-bold text-primary-900">{perf.completionRate}%</span>
                        </div>
                        <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${perf.completionRate}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Feedback */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                <h2 className="font-bold text-primary-900 text-sm">Recent Feedback</h2>
                <button className="text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1">
                  View All <ChevronRight size={12} />
                </button>
              </div>

              {loading ? (
                <div className="p-5 space-y-3 animate-pulse">
                  {[...Array(2)].map((_, i) => <div key={i} className="h-20 bg-slate-50 rounded-xl" />)}
                </div>
              ) : (perf?.recentReviews ?? []).length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star size={18} className="text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-primary-900">No reviews yet</p>
                  <p className="text-xs text-slate-400 mt-1">Reviews from completed sessions will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {perf!.recentReviews.map((review) => (
                    <div key={review.id} className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        {/* Avatar initials */}
                        <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary-700">
                          {review.reviewerInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <p className="text-sm font-bold text-primary-900">{review.reviewerName}</p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <p className="text-[10px] text-slate-400 mb-2">
                            {review.category === 'CC' ? 'Child Care Session' : review.category === 'ST' ? 'Shadow Teacher' : 'Care Service'}
                          </p>
                          <StarRating rating={review.rating} size={13} />
                          {review.comment && (
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: sentiment + pro tip */}
          <div className="space-y-5">
            {/* Client Sentiment */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="font-bold text-primary-900 text-sm mb-4">Client Sentiment</h2>
              {loading ? (
                <div className="space-y-2 animate-pulse">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-slate-50 rounded-xl" />)}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-emerald-50 rounded-xl p-3 text-center">
                      <Smile size={18} className="text-emerald-500 mx-auto mb-1" />
                      <p className="text-xl font-black text-emerald-600">{perf?.sentiment.positive ?? 0}%</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Positive</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <Meh size={18} className="text-slate-400 mx-auto mb-1" />
                      <p className="text-xl font-black text-slate-500">{perf?.sentiment.neutral ?? 0}%</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neutral</p>
                    </div>
                  </div>
                  {(perf?.sentiment.negative ?? 0) > 0 && (
                    <div className="bg-red-50 rounded-xl p-3 text-center">
                      <Frown size={18} className="text-red-400 mx-auto mb-1" />
                      <p className="text-xl font-black text-red-500">{perf?.sentiment.negative ?? 0}%</p>
                      <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Needs Work</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Pro Tip */}
            <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-primary-600" />
                <p className="text-xs font-black text-primary-700 uppercase tracking-widest">Pro Tip</p>
              </div>
              <p className="text-sm text-primary-800 leading-relaxed">
                Mentioning arrival times 15 mins early boosts positive reviews by 12%. Parents consistently rate punctuality as the top factor.
              </p>
            </div>

            {/* Total stats summary */}
            {!loading && perf && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                <h2 className="font-bold text-primary-900 text-sm">All-Time Stats</h2>
                <div className="space-y-2">
                  {[
                    { label: 'Total Reviews', value: perf.totalReviews },
                    { label: 'Avg Rating',     value: `${perf.averageRating.toFixed(1)} / 5` },
                    { label: 'Completion Rate', value: `${perf.completionRate}%` },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{stat.label}</span>
                      <span className="font-bold text-primary-900">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
