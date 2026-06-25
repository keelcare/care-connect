'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ParentLayout from '@/components/layout/ParentLayout';
import { api } from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { format, isBefore } from 'date-fns';
import { 
    CreditCard, 
    CalendarDays, 
    CheckCircle2, 
    ChevronDown, 
    ChevronUp, 
    Info, 
    Clock, 
    AlertCircle,
    X
} from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from 'boneyard-js/react';

export default function ManagePaymentsPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
    const { handlePayment, loading: paymentLoading } = usePayment();

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const data = await api.payments.getPlans();
            setPlans(data || []);
        } catch (error) {
            console.error('Failed to fetch subscription plans:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    // NEW: onPayNow no longer takes installmentId — server resolves cycle automatically
    const onPayNow = (bookingId: string, amount: number) => {
        handlePayment({
            amount,
            bookingId,
            onSuccess: () => {
                fetchPlans();
            },
            onError: (err) => {
                console.error("Payment Error: ", err);
            }
        });
    };



    return (
        <ParentLayout>
            <Skeleton
                name="payments-page"
                loading={loading}
                fixture={
                    <div className="max-w-4xl mx-auto space-y-8 px-4 pb-20 opacity-50">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="p-3 bg-indigo-100 rounded-2xl w-14 h-14" />
                            <div>
                                <div className="h-10 w-64 bg-gray-200 rounded-lg mb-2" />
                                <div className="h-5 w-80 bg-gray-100 rounded-lg" />
                            </div>
                        </div>
                        {[1, 2].map(i => (
                            <div key={i} className="h-64 w-full bg-white rounded-3xl border border-gray-100 shadow-sm" />
                        ))}
                    </div>
                }
            >
                <div className="max-w-4xl mx-auto space-y-8 px-4 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-100 rounded-2xl">
                            <CreditCard className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 font-display">Subscription Plans</h1>
                            <p className="text-gray-500 mt-0.5">Manage your active service contracts and payments.</p>
                        </div>
                    </div>
                </div>

                {plans.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CreditCard className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">No active plans found</h3>
                        <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                            When you book a service with monthly installments, your payment plans will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {plans.map((plan) => (
                            <SubscriptionPlanCard 
                                key={plan.id} 
                                plan={plan} 
                                isExpanded={expandedPlanId === plan.id}
                                onToggle={() => setExpandedPlanId(expandedPlanId === plan.id ? null : plan.id)}
                                onPayNow={onPayNow}
                                paymentLoading={paymentLoading}
                            />
                        ))}
                    </div>
                )}
            </div>
            </Skeleton>
        </ParentLayout>
    );
}

function SubscriptionPlanCard({ plan, isExpanded, onToggle, onPayNow, paymentLoading }: any) {
    // NEW: use price_snapshots instead of payment_installments
    const snapshots = plan.price_snapshots || [];
    const paidCount = plan.cycles_completed ?? snapshots.filter((s: any) => s.status === 'charged').length;
    const totalCycles = plan.total_cycles || snapshots.length || 1;
    const progress = (paidCount / totalCycles) * 100;

    const nannyProfile = plan.bookings?.users_bookings_nanny_idTousers?.profiles;
    const nannyName = nannyProfile?.first_name ? `${nannyProfile.first_name} ${nannyProfile.last_name || ''}` : 'Nanny';
    const categoryName = plan.bookings?.service_requests?.category === 'ST' ? 'Shadow Teacher' : 'Care Service';

    // NEW: find the next pending snapshot using cycles_completed
    const nextCycleNumber = paidCount + 1;
    const snapshotToPay = snapshots.find(
        (s: any) => s.cycle_number === nextCycleNumber && s.status === 'pending'
    );
    // If no snapshot yet for this cycle, createOrder will generate one automatically
    const hasPendingAction = nextCycleNumber <= totalCycles;

    // Monthly display amount: read from price_snapshots[0]?.final_amount (cycle 1)
    const displayAmount = snapshots.find((s: any) => s.cycle_number === 1)?.final_amount
        ?? snapshotToPay?.final_amount
        ?? 0;

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:border-indigo-200 transition-colors">
            {/* Main Plan Overview */}
            <div 
                className="p-6 md:p-8 cursor-pointer group"
                onClick={onToggle}
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start space-x-4">
                        <div className="relative w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
                            {nannyProfile?.profile_image_url ? (
                                <Image src={nannyProfile.profile_image_url} alt={nannyName} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    {nannyName[0]}
                                </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                                <div className="w-4 h-4 bg-indigo-500 rounded-full" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                                    {categoryName}
                                </span>
                                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                                    plan.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                                }`}>
                                    {plan.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{nannyName}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                <Clock className="w-4 h-4 mr-1.5" />
                                {/* NEW: total_cycles replaces total_months */}
                                <span>{totalCycles}-Cycle Plan</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2">
                        <div className="flex items-baseline gap-1">
                            {/* NEW: read from price_snapshot.final_amount, not plan.monthly_amount */}
                            <span className="text-2xl font-black text-gray-900">₹{Number(displayAmount).toLocaleString('en-IN')}</span>
                            <span className="text-sm font-medium text-gray-500">/cycle</span>
                        </div>
                        {plan.next_due_date && (
                            <div className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                {/* NEW: next_due_date is now a top-level field on the plan */}
                                Next payment: <span className="text-gray-900">{format(new Date(plan.next_due_date), 'MMM d, yyyy')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress Bar Area */}
                <div className="mt-8 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-700">Payment Progress</span>
                        {/* NEW: cycles_completed / total_cycles */}
                        <span className="text-indigo-600 font-bold">{paidCount} <span className="text-gray-400 font-medium">of {totalCycles} cycles paid</span></span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-linear-to-r from-indigo-500 to-indigo-600 rounded-full relative"
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-size-[20px_20px]" />
                        </motion.div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between group-hover:text-indigo-600 transition-colors">
                    <span className="text-sm font-bold flex items-center gap-1.5">
                        {isExpanded ? 'Hide Schedule' : 'View Full Schedule'}
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                    {hasPendingAction && plan.status === 'active' && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-400">Action Required</span>
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop Accordion Timeline */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="hidden md:block bg-gray-50/50 border-t border-gray-100"
                    >
                        <SnapshotTimeline 
                            snapshots={snapshots} 
                            plan={plan}
                            onPayNow={onPayNow} 
                            paymentLoading={paymentLoading}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Bottom Drawer */}
            <AnimatePresence>
                {isExpanded && (
                    <div 
                        className="md:hidden fixed inset-0 z-60"
                    >
                        {/* Overlay */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onToggle}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        {/* Drawer */}
                        <motion.div 
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-white rounded-t-[3rem] shadow-2xl p-8 overflow-y-auto scrollbar-hide pb-20"
                        >
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
                            
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 font-display">Payment Schedule</h4>
                                    <p className="text-sm text-gray-500">{nannyName} • {categoryName}</p>
                                </div>
                                <button 
                                    onClick={onToggle}
                                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            <SnapshotTimeline 
                                snapshots={snapshots} 
                                plan={plan}
                                onPayNow={onPayNow} 
                                paymentLoading={paymentLoading}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// NEW: renamed from InstallmentTimeline → SnapshotTimeline, using price_snapshots fields
function SnapshotTimeline({ snapshots, plan, onPayNow, paymentLoading }: any) {
    // NEW: find the payable snapshot — the next pending cycle not yet charged
    const nextCycleNumber = (plan.cycles_completed ?? 0) + 1;
    const payableSnapshot = snapshots.find(
        (s: any) => s.cycle_number === nextCycleNumber && s.status === 'pending'
    );

    return (
        <div className="p-8">
            <div className="space-y-6 relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-200" />

                {snapshots.map((snapshot: any, idx: number) => {
                    // NEW: use snapshot.status === 'charged' instead of 'paid'
                    const isCharged = snapshot.status === 'charged' || snapshot.payments?.status === 'captured';
                    const isPending = snapshot.status === 'pending' && !isCharged;
                    const canPay = snapshot.cycle_number === nextCycleNumber && isPending;

                    return (
                        <div key={snapshot.id} className="relative flex items-center space-x-6 z-10">
                            {/* State Indicator */}
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm shrink-0 ${
                                isCharged ? 'bg-green-500 text-white' : 
                                isPending && canPay ? 'bg-indigo-600 text-white animate-pulse' : 'bg-gray-200 text-gray-400'
                            }`}>
                                {isCharged ? <CheckCircle2 className="w-6 h-6" /> : 
                                 isPending && canPay ? <div className="text-sm font-black">{snapshot.cycle_number}</div> : 
                                 <div className="text-xs font-bold">{snapshot.cycle_number}</div>}
                            </div>

                            {/* Details Card */}
                            <div className={`flex-1 bg-white p-4 md:p-6 rounded-2xl border transition-all ${
                                canPay ? 'border-indigo-200 shadow-md shadow-indigo-500/5' : 'border-gray-100'
                            }`}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {/* NEW: cycle_number replaces installment_no */}
                                            <span className="text-sm font-bold text-gray-900">Cycle {snapshot.cycle_number}</span>
                                        </div>
                                        {/* Breakdown info from snapshot */}
                                        <div className="text-xs text-gray-500 font-medium">
                                            {snapshot.hours_billed}h @ ₹{snapshot.base_hourly_rate_used}/hr
                                            {snapshot.discount_percent_used > 0 && ` · ${snapshot.discount_percent_used}% off`}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8">
                                        <div className="text-right">
                                            {/* NEW: final_amount replaces amount_due */}
                                            <div className="text-lg font-bold text-gray-900">₹{Number(snapshot.final_amount).toLocaleString('en-IN')}</div>
                                            {/* NEW: 'charged' replaces 'paid' */}
                                            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{snapshot.status}</div>
                                        </div>

                                        {isPending && canPay && (
                                            plan.bookings?.nanny_id ? (
                                                <button
                                                    // NEW: onPayNow no longer passes snapshot.id — only bookingId + amount
                                                    onClick={() => onPayNow(plan.booking_id, Number(snapshot.final_amount ?? 0))}
                                                    disabled={paymentLoading}
                                                    className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition disabled:opacity-50"
                                                >
                                                    {paymentLoading ? 'Wait...' : 'Pay Now'}
                                                </button>
                                            ) : (
                                                <div className="px-4 py-2 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase rounded-xl border border-amber-100 flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Awaiting Nanny Assignment
                                                </div>
                                            )
                                        )}
                                        {isPending && !canPay && (
                                            <div className="px-4 py-2 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase rounded-xl border border-gray-100">
                                                Upcoming
                                            </div>
                                        )}
                                        {isCharged && (
                                            <div className="flex items-center gap-1.5 text-green-600">
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                                <span className="text-xs font-bold font-display">Charged</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* If no snapshots exist yet for the next cycle, show a placeholder */}
                {snapshots.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-8">
                        No billing cycles recorded yet.
                    </div>
                )}
            </div>

            <div className="mt-10 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-start gap-4">
                <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-800 leading-relaxed">
                    <p className="font-bold mb-1 italic">Security Note:</p>
                    All payments are processed securely through Razorpay. You can only pay for the immediate upcoming cycle to maintain billing integrity. Prices shown are locked at your booking rate.
                </div>
            </div>
        </div>
    );
}
