'use client';

import React, { useEffect, useState } from 'react';
import ParentLayout from '@/components/layout/ParentLayout';
import { api } from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { format, isAfter, isBefore, addDays } from 'date-fns';
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

    const onPayNow = (installmentId: string, bookingId: string, amount: number) => {
        handlePayment({
            amount,
            bookingId,
            installmentId,
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
                minHeight="100vh"
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
    const installments = plan.payment_installments || [];
    const paidCount = installments.filter((i: any) => i.status === 'paid' || i.payments?.status === 'captured').length;
    const progress = (paidCount / plan.total_months) * 100;

    const nannyProfile = plan.bookings?.users_bookings_nanny_idTousers?.profiles;
    const nannyName = nannyProfile?.first_name ? `${nannyProfile.first_name} ${nannyProfile.last_name || ''}` : 'Nanny';
    const categoryName = plan.bookings?.service_requests?.category === 'ST' ? 'Shadow Teacher' : 'Care Service';

    // Find first pending installment
    const firstPending = installments.find((i: any) => i.status === 'pending');

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:border-indigo-200 transition-colors">
            {/* Main Plan Overview */}
            <div 
                className="p-6 md:p-8 cursor-pointer group"
                onClick={onToggle}
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start space-x-4">
                        <div className="relative w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0">
                            {nannyProfile?.profile_image_url ? (
                                <img src={nannyProfile.profile_image_url} alt={nannyName} className="w-full h-full object-cover" />
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
                                <span>{plan.total_months}-Month Plan</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2">
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-gray-900">₹{Number(plan.monthly_amount).toLocaleString('en-IN')}</span>
                            <span className="text-sm font-medium text-gray-500">/mo</span>
                        </div>
                        <div className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            Next payment: <span className="text-gray-900">{format(new Date(plan.next_due_date), 'MMM d, yyyy')}</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar Area */}
                <div className="mt-8 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-gray-700">Payment Progress</span>
                        <span className="text-indigo-600 font-bold">{paidCount} <span className="text-gray-400 font-medium">of {plan.total_months} months paid</span></span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full relative"
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px]" />
                        </motion.div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between group-hover:text-indigo-600 transition-colors">
                    <span className="text-sm font-bold flex items-center gap-1.5">
                        {isExpanded ? 'Hide Schedule' : 'View Full Schedule'}
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                    {firstPending && (
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
                        <InstallmentTimeline 
                            installments={installments} 
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
                        className="md:hidden fixed inset-0 z-[60]"
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

                            <InstallmentTimeline 
                                installments={installments} 
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

function InstallmentTimeline({ installments, plan, onPayNow, paymentLoading }: any) {
    const firstPendingId = installments.find((i: any) => 
        i.status === 'pending' && i.payments?.status !== 'captured'
    )?.id;

    return (
        <div className="p-8">
            <div className="space-y-6 relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-200" />

                {installments.map((inst: any, idx: number) => {
                    const isPaid = inst.status === 'paid' || inst.payments?.status === 'captured';
                    const isPending = inst.status === 'pending' && !isPaid;
                    const isOverdue = isPending && isBefore(new Date(inst.due_date), new Date());
                    const canPay = inst.id === firstPendingId;

                    return (
                        <div key={inst.id} className="relative flex items-center space-x-6 z-10">
                            {/* State Indicator */}
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm flex-shrink-0 ${
                                isPaid ? 'bg-green-500 text-white' : 
                                isOverdue ? 'bg-orange-500 text-white' :
                                isPending && canPay ? 'bg-indigo-600 text-white animate-pulse' : 'bg-gray-200 text-gray-400'
                            }`}>
                                {isPaid ? <CheckCircle2 className="w-6 h-6" /> : 
                                 isOverdue ? <AlertCircle className="w-6 h-6" /> :
                                 isPending && canPay ? <div className="text-sm font-black">{inst.installment_no}</div> : <div className="text-xs font-bold">{inst.installment_no}</div>}
                            </div>

                            {/* Details Card */}
                            <div className={`flex-1 bg-white p-4 md:p-6 rounded-2xl border transition-all ${
                                canPay ? 'border-indigo-200 shadow-md shadow-indigo-500/5' : 'border-gray-100'
                            }`}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-gray-900">Month {inst.installment_no}</span>
                                            {isOverdue && <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Overdue</span>}
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium">
                                            Due on {format(new Date(inst.due_date), 'PPP')}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8">
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-gray-900">₹{Number(inst.amount_due).toLocaleString('en-IN')}</div>
                                            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{inst.status}</div>
                                        </div>

                                        {isPending && canPay && (
                                            plan.bookings?.nanny_id ? (
                                                <button
                                                    onClick={() => onPayNow(inst.id, plan.booking_id, Number(inst.amount_due))}
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
                                        {isPaid && (
                                            <div className="flex items-center gap-1.5 text-green-600">
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                                <span className="text-xs font-bold font-display">Completed</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-10 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-start gap-4">
                <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-indigo-800 leading-relaxed">
                    <p className="font-bold mb-1 italic">Security Note:</p>
                    All payments are processed securely through Razorpay. You can only pay for the immediate upcoming installment to maintain the monthly billing integrity.
                </div>
            </div>
        </div>
    );
}
