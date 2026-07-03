'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ParentLayout from '@/components/layout/ParentLayout';
import { api } from '@/lib/api';
import { usePayment } from '@/hooks/usePayment';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Clock, CheckCircle2, ChevronDown, ChevronUp,
  Info, Shield, AlertCircle, X, Wallet, CalendarDays,
} from 'lucide-react';
import { logger } from '@/lib/logger';

/* ── helpers ─────────────────────────────────────────────────────── */

function fmt(n: number) {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatDate(iso: string) {
  try { return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return iso; }
}

/* ── snapshot timeline ───────────────────────────────────────────── */

function SnapshotTimeline({ snapshots, plan, onPayNow, paymentLoading }: any) {
  const nextCycle = (plan.cycles_completed ?? 0) + 1;
  const payable = snapshots.find((s: any) => s.cycle_number === nextCycle && s.status === 'pending');

  return (
    <div className="px-5 pb-5 sm:px-6 sm:pb-6 space-y-3">
      {snapshots.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-4">No billing cycles recorded yet.</p>
      ) : (
        snapshots.map((snap: any) => {
          const isCharged = snap.status === 'charged' || snap.payments?.status === 'captured';
          const isPending = snap.status === 'pending' && !isCharged;
          const canPay   = snap.cycle_number === nextCycle && isPending;

          return (
            <div key={snap.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
              canPay ? 'bg-primary-50 border-primary-100' : isCharged ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-100'
            }`}>
              {/* Cycle indicator */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black ${
                isCharged ? 'bg-emerald-100 text-emerald-700' :
                canPay    ? 'bg-primary-900 text-white' :
                            'bg-slate-100 text-slate-400'
              }`}>
                {isCharged ? <CheckCircle2 size={14} /> : snap.cycle_number}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-sm font-bold text-primary-900">Cycle {snap.cycle_number}</p>
                    {snap.hours_billed && (
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {snap.hours_billed}h @ ₹{snap.base_hourly_rate_used}/hr
                        {snap.discount_percent_used > 0 ? ` · ${snap.discount_percent_used}% off` : ''}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-base font-black text-primary-900">₹{fmt(Number(snap.final_amount))}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-wide ${
                        isCharged ? 'text-emerald-600' : canPay ? 'text-primary-600' : 'text-slate-400'
                      }`}>
                        {isCharged ? 'Paid' : canPay ? 'Due Now' : 'Upcoming'}
                      </p>
                    </div>

                    {canPay && (
                      plan.bookings?.nanny_id ? (
                        <button
                          onClick={() => onPayNow(plan.booking_id, Number(snap.final_amount ?? 0))}
                          disabled={paymentLoading}
                          className="h-9 px-4 bg-primary-900 text-white text-xs font-bold rounded-xl hover:bg-primary-800 transition-colors disabled:opacity-50 flex-shrink-0"
                        >
                          {paymentLoading ? 'Processing…' : 'Pay Now'}
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-xl border border-amber-100">
                          <Clock size={11} /> Awaiting nanny
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Security note */}
      <div className="flex items-start gap-3 mt-2 p-4 bg-slate-50 rounded-xl border border-slate-100">
        <Shield size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-500 leading-relaxed">
          All payments are processed securely via Razorpay. Only the immediate upcoming cycle is payable to maintain billing integrity. Prices are locked at your booking rate.
        </p>
      </div>
    </div>
  );
}

/* ── plan card ───────────────────────────────────────────────────── */

function PlanCard({ plan, onPayNow, paymentLoading }: { plan: any; onPayNow: (bookingId: string, amount: number) => void; paymentLoading: boolean }) {
  const [expanded, setExpanded] = useState(false);

  const snapshots   = plan.price_snapshots ?? [];
  const paidCount   = plan.cycles_completed ?? snapshots.filter((s: any) => s.status === 'charged').length;
  const totalCycles = plan.total_cycles || snapshots.length || 1;
  const progress    = Math.min((paidCount / totalCycles) * 100, 100);

  const nannyProfile = plan.bookings?.users_bookings_nanny_idTousers?.profiles;
  const nannyName    = nannyProfile?.first_name ? `${nannyProfile.first_name} ${nannyProfile.last_name ?? ''}`.trim() : 'Caregiver';
  const categoryName = plan.bookings?.service_requests?.category === 'ST' ? 'Shadow Teacher' : 'Child Care';
  const initial      = nannyName[0]?.toUpperCase() ?? 'C';

  const nextCycle     = paidCount + 1;
  const snapshotToPay = snapshots.find((s: any) => s.cycle_number === nextCycle && s.status === 'pending');
  const displayAmount = snapshots.find((s: any) => s.cycle_number === 1)?.final_amount ?? snapshotToPay?.final_amount ?? 0;

  const hasAction = nextCycle <= totalCycles;
  const isActive  = plan.status === 'active';

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${isActive ? 'border-slate-100 hover:border-primary-100' : 'border-slate-100 opacity-80'}`}>
      {/* Top colour stripe */}
      <div className={`h-0.5 ${isActive ? 'bg-primary-600' : 'bg-slate-300'}`} />

      {/* Plan header */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Nanny avatar */}
          <div className="w-12 h-12 rounded-xl bg-primary-50 overflow-hidden flex items-center justify-center flex-shrink-0 border border-primary-100">
            {nannyProfile?.profile_image_url ? (
              <Image src={nannyProfile.profile_image_url} alt={nannyName} width={48} height={48} className="object-cover w-full h-full" />
            ) : (
              <span className="text-primary-700 font-bold text-lg">{initial}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {plan.status}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 py-0.5 bg-slate-50 rounded-full">
                    {categoryName}
                  </span>
                </div>
                <p className="font-bold text-primary-900 text-base">{nannyName}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-xl font-black text-primary-900">₹{fmt(Number(displayAmount))}</p>
                <p className="text-xs text-slate-400 font-medium">/ cycle</p>
              </div>
            </div>

            {/* Metadata row */}
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1">
                <CalendarDays size={11} className="text-slate-400" />
                {totalCycles}-cycle plan
              </span>
              {plan.next_due_date && (
                <span className="flex items-center gap-1">
                  <Clock size={11} className="text-slate-400" />
                  Next: {formatDate(plan.next_due_date)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>Payment Progress</span>
            <span className="text-primary-700 font-bold">{paidCount} / {totalCycles} cycles</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-primary-700 rounded-full"
            />
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 pt-4 border-t border-slate-50 w-full flex items-center justify-between text-sm font-semibold text-slate-600 hover:text-primary-800 transition-colors"
        >
          <span>{expanded ? 'Hide Schedule' : 'View Payment Schedule'}</span>
          <div className="flex items-center gap-2">
            {hasAction && isActive && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Action required
              </span>
            )}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>
      </div>

      {/* Expandable timeline — desktop inline, mobile drawer */}
      <AnimatePresence>
        {expanded && (
          <>
            {/* Desktop: inline expand */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="hidden sm:block overflow-hidden border-t border-slate-50"
            >
              <SnapshotTimeline snapshots={snapshots} plan={plan} onPayNow={onPayNow} paymentLoading={paymentLoading} />
            </motion.div>

            {/* Mobile: bottom sheet */}
            <div className="sm:hidden fixed inset-0 z-50">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setExpanded(false)}
              />
              <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto pb-8"
              >
                <div className="sticky top-0 bg-white pt-4 pb-3 px-5 border-b border-slate-50 flex items-center justify-between z-10">
                  <div>
                    <p className="font-bold text-primary-900 text-base">Payment Schedule</p>
                    <p className="text-xs text-slate-400">{nannyName} · {categoryName}</p>
                  </div>
                  <button onClick={() => setExpanded(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <X size={16} className="text-slate-500" />
                  </button>
                </div>
                <div className="pt-4">
                  <SnapshotTimeline snapshots={snapshots} plan={plan} onPayNow={onPayNow} paymentLoading={paymentLoading} />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── main page ───────────────────────────────────────────────────── */

export default function PaymentsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { handlePayment, loading: paymentLoading } = usePayment();

  const fetchPlans = async () => {
    setLoading(true);
    try { setPlans((await api.payments.getPlans()) ?? []); }
    catch (err) { logger.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPlans(); }, []);

  const onPayNow = (bookingId: string, amount: number) => {
    handlePayment({ amount, bookingId, onSuccess: fetchPlans, onError: logger.error });
  };

  return (
    <ParentLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary-900 tracking-tight">Payments</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage your active service plans and billing cycles.</p>
          </div>
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Wallet size={18} className="text-primary-700" />
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-52 bg-white rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={22} className="text-slate-300" />
            </div>
            <p className="font-bold text-primary-900 text-base mb-1">No active payment plans</p>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              When you book a service with monthly billing, your payment plans will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {plans.map(plan => (
              <PlanCard key={plan.id} plan={plan} onPayNow={onPayNow} paymentLoading={paymentLoading} />
            ))}
          </div>
        )}
      </div>
    </ParentLayout>
  );
}
