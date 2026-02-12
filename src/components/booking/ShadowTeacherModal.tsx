'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Users, FileText, AlertCircle, Check, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ShadowTeacherModalProps {
    onClose: () => void;
}

const SUBSCRIPTION_PLANS = [
    {
        id: 'ONE_TIME',
        label: 'One-Time Session',
        duration: 0,
        discount: 0,
        popular: false,
        description: 'Perfect for trying out our service',
    },
    {
        id: 'MONTHLY',
        label: 'Monthly Plan',
        duration: 1,
        discount: 10,
        popular: false,
        description: 'Save 10% with monthly commitment',
    },
    {
        id: 'SIX_MONTH',
        label: '6-Month Plan',
        duration: 6,
        discount: 15,
        popular: true,
        description: 'Save 15% with 6-month commitment',
    },
    {
        id: 'YEARLY',
        label: 'Yearly Plan',
        duration: 12,
        discount: 20,
        popular: false,
        description: 'Save 20% with yearly commitment',
    },
];

const DURATION_OPTIONS = [
    { value: '1', label: '1 hour' },
    { value: '2', label: '2 hours' },
    { value: '3', label: '3 hours' },
    { value: '4', label: '4 hours' },
    { value: '5', label: '5 hours' },
    { value: '6', label: '6 hours' },
    { value: '7', label: '7 hours' },
    { value: '8', label: '8 hours' },
];

const TIME_SLOTS = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00',
];

const BASE_HOURLY_RATE = 500; // ₹500 per hour base rate

export default function ShadowTeacherModal({ onClose }: ShadowTeacherModalProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [missingLocation, setMissingLocation] = useState(false);

    const [formData, setFormData] = useState({
        planType: 'ONE_TIME',
        date: '',
        startTime: '',
        duration: '',
        numStudents: '1',
        specialRequirements: '',
    });

    const getNextDays = () => {
        const days = [];
        for (let i = 0; i < 14; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const availableDates = getNextDays();

    useEffect(() => {
        if (user?.profiles) {
            if (!user.profiles.lat || !user.profiles.lng) {
                setMissingLocation(true);
            } else {
                setMissingLocation(false);
            }
        }
    }, [user]);

    const calculatePricing = () => {
        const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === formData.planType);
        if (!selectedPlan || !formData.duration) return null;

        const durationHours = Number(formData.duration);
        const sessionCost = BASE_HOURLY_RATE * durationHours;
        const discount = selectedPlan.discount;
        const discountAmount = (sessionCost * discount) / 100;
        const sessionCostAfterDiscount = sessionCost - discountAmount;

        let totalCost = sessionCostAfterDiscount;
        let sessionsPerMonth = 0;

        if (selectedPlan.id !== 'ONE_TIME') {
            // Assume 4 sessions per month for subscription plans
            sessionsPerMonth = 4;
            const monthlyCost = sessionCostAfterDiscount * sessionsPerMonth;
            totalCost = monthlyCost * selectedPlan.duration;
        }

        return {
            sessionCost,
            discount,
            discountAmount,
            sessionCostAfterDiscount,
            totalCost,
            monthlyCost: selectedPlan.id !== 'ONE_TIME' ? sessionCostAfterDiscount * sessionsPerMonth : 0,
            sessionsPerMonth,
        };
    };

    const pricing = calculatePricing();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (missingLocation) {
            addToast({
                message: 'Please set your location in your profile first',
                type: 'error',
            });
            return;
        }

        if (!formData.date || !formData.startTime || !formData.duration) {
            addToast({
                message: 'Please fill in all required fields',
                type: 'error',
            });
            return;
        }

        setLoading(true);

        try {
            const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === formData.planType);

            const payload = {
                category: 'ST',
                date: formData.date,
                start_time: formData.startTime,
                duration_hours: Number(formData.duration),
                num_children: Number(formData.numStudents),
                children_ages: [],
                max_hourly_rate: undefined,
                required_skills: ['shadow_teacher', 'special_education'],
                special_requirements: formData.specialRequirements,
                plan_type: formData.planType as any,
                plan_duration_months: selectedPlan?.duration || 0,
                monthly_rate: pricing?.monthlyCost || 0,
                discount_percentage: selectedPlan?.discount || 0,
            };

            await api.requests.create(payload);

            addToast({
                message: 'Shadow teacher request submitted! Finding the best match for you...',
                type: 'success',
            });
            router.push('/bookings');
            onClose();
        } catch (error) {
            console.error('Service request failed:', error);
            addToast({
                message: 'Failed to create service request. Please try again.',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };


    // Animation Variants
    const overlayVars = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0, transition: { duration: 0.3 } }
    };

    const modalVars = {
        hidden: { scale: 0.95, opacity: 0, y: 10 },
        visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: { type: 'spring', damping: 25, stiffness: 300 }
        },
        exit: {
            scale: 0.95,
            opacity: 0,
            y: 10,
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div
            variants={overlayVars}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                variants={modalVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[32px] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative overflow-hidden"
            >
                {/* Header */}
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-[#F1B92B] to-[#d9a526] text-[#0F172A] p-8 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold font-display mb-2">Shadow Teacher Booking</h2>
                            <p className="text-gray-800 font-body">Specialized educational support with flexible plans</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Location Warning */}
                {missingLocation && (
                    <div className="mx-8 mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                        <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-amber-800">Location Required</p>
                            <p className="text-sm text-amber-700 mt-1">
                                Please set your location in your{' '}
                                <Link href="/dashboard/profile" className="underline font-medium text-amber-900">
                                    profile settings
                                </Link>{' '}
                                to use auto-matching.
                            </p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8">
                    {/* Subscription Plan Selection */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-[#F1B92B]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Choose Your Plan</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {SUBSCRIPTION_PLANS.map((plan) => {
                                const isSelected = formData.planType === plan.id;
                                return (
                                    <button
                                        key={plan.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, planType: plan.id })}
                                        className={`relative p-6 rounded-2xl border-2 transition-all text-left ${isSelected
                                            ? 'bg-[#F1B92B] text-[#0F172A] border-[#F1B92B] shadow-xl'
                                            : 'bg-white border-gray-200 hover:border-[#F1B92B] hover:bg-[#FEF7E6]'
                                            }`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E08E79] text-white text-xs font-bold px-3 py-1 rounded-full">
                                                MOST POPULAR
                                            </div>
                                        )}
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-bold text-lg font-display">{plan.label}</h4>
                                                <p className={`text-sm mt-1 ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
                                                    {plan.description}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <div className="w-6 h-6 rounded-full bg-[#0F172A] flex items-center justify-center">
                                                    <Check className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        {plan.discount > 0 && (
                                            <div className="mt-3 inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                                                Save {plan.discount}%
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date Selection */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-[#F1B92B]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Select Date</h3>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {availableDates.map((date) => {
                                const dateStr = formatDate(date);
                                const isSelected = formData.date === dateStr;
                                return (
                                    <button
                                        key={dateStr}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, date: dateStr })}
                                        className={`flex-shrink-0 flex flex-col items-center p-4 rounded-2xl border-2 transition-all min-w-[80px] ${isSelected
                                            ? 'bg-[#F1B92B] text-[#0F172A] border-[#F1B92B]'
                                            : 'bg-white border-gray-200 hover:border-[#F1B92B] hover:bg-[#FEF7E6]'
                                            }`}
                                    >
                                        <span className={`text-xs font-medium mb-1 ${isSelected ? 'text-gray-800' : 'text-gray-500'}`}>
                                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                        </span>
                                        <span className={`text-2xl font-bold ${isToday(date) && !isSelected ? 'text-[#F1B92B]' : ''}`}>
                                            {date.getDate()}
                                        </span>
                                        <span className={`text-xs ${isSelected ? 'text-gray-800' : 'text-gray-400'}`}>
                                            {date.toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-[#F1B92B]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Start Time</h3>
                        </div>
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                            {TIME_SLOTS.map((time) => {
                                const isSelected = formData.startTime === time;
                                return (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, startTime: time })}
                                        className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all ${isSelected
                                            ? 'bg-[#F1B92B] text-[#0F172A] border-[#F1B92B]'
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-[#F1B92B] hover:bg-[#FEF7E6]'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Duration */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-[#F1B92B]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Session Duration</h3>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {DURATION_OPTIONS.map((option) => {
                                const isSelected = formData.duration === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, duration: option.value })}
                                        className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${isSelected
                                            ? 'bg-[#F1B92B] text-[#0F172A] border-[#F1B92B]'
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-[#F1B92B] hover:bg-[#FEF7E6]'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Number of Students */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-[#F1B92B]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Number of Students</h3>
                        </div>
                        <div className="flex gap-3">
                            {['1', '2', '3', '4', '5+'].map((num) => {
                                const isSelected = formData.numStudents === num;
                                return (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, numStudents: num })}
                                        className={`w-14 h-14 rounded-xl font-semibold border-2 transition-all ${isSelected
                                            ? 'bg-[#F1B92B] text-[#0F172A] border-[#F1B92B]'
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-[#F1B92B]'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Special Educational Requirements */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-[#F1B92B]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Special Educational Requirements</h3>
                        </div>
                        <textarea
                            value={formData.specialRequirements}
                            onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                            placeholder="Learning needs, educational goals, specific support required..."
                            className="w-full h-32 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#F1B92B] focus:ring-2 focus:ring-[#F1B92B]/20 focus:outline-none resize-none text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Pricing Summary */}
                    {pricing && (
                        <div className="mb-8 p-6 bg-gradient-to-br from-[#FEF7E6] to-[#FFF9F0] rounded-2xl border-2 border-[#F1B92B]/30">
                            <h4 className="font-bold text-lg text-[#0F172A] mb-4 font-display">Pricing Summary</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Session Cost ({formData.duration || 0} hours)</span>
                                    <span className="font-semibold text-gray-900">₹{pricing.sessionCost.toLocaleString()}</span>
                                </div>
                                {pricing.discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-600">Discount ({pricing.discount}%)</span>
                                        <span className="font-semibold text-green-600">-₹{pricing.discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                {formData.planType !== 'ONE_TIME' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Monthly Cost ({pricing.sessionsPerMonth} sessions/month)</span>
                                            <span className="font-semibold text-gray-900">₹{pricing.monthlyCost.toLocaleString()}/month</span>
                                        </div>
                                        <div className="h-px bg-[#F1B92B]/30 my-2" />
                                    </>
                                )}
                                <div className="flex justify-between text-lg pt-2">
                                    <span className="font-bold text-[#0F172A]">
                                        {formData.planType === 'ONE_TIME' ? 'Total' : 'Total Plan Cost'}
                                    </span>
                                    <span className="font-bold text-[#F1B92B]">₹{pricing.totalCost.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || missingLocation}
                        className="w-full bg-[#F1B92B] hover:bg-[#d9a526] text-[#0F172A] py-5 rounded-full font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {loading ? 'Finding Shadow Teachers...' : 'Find My Shadow Teacher'}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}
