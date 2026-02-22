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

// Removed hardcoded BASE_HOURLY_RATE

export default function ShadowTeacherModal({ onClose }: ShadowTeacherModalProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [missingLocation, setMissingLocation] = useState(false);
    const [hourlyRate, setHourlyRate] = useState<number>(500); // Default to 500 until fetched
    const [isLoadingPrice, setIsLoadingPrice] = useState(false);

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

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoadingPrice(true);
            try {
                const services = await api.services.list();
                const stService = services.find(s => s.name === 'ST' || s.name === 'Shadow Teacher');
                if (stService) {
                    setHourlyRate(Number(stService.hourly_rate));
                }
            } catch (error) {
                console.error('Failed to fetch services:', error);
            } finally {
                setIsLoadingPrice(false);
            }
        };
        fetchServices();
    }, []);

    const calculatePricing = () => {
        const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === formData.planType);
        if (!selectedPlan || !formData.duration) return null;

        const durationHours = Number(formData.duration);
        const sessionCost = hourlyRate * durationHours;
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

            const numStudents = formData.numStudents === '5+' ? 5 : Number(formData.numStudents);

            const payload = {
                category: 'ST',
                date: formData.date,
                start_time: formData.startTime,
                duration_hours: Number(formData.duration),
                num_children: numStudents,
                child_ids: [],
                children_ages: [],
                required_skills: ['shadow_teacher', 'special_education'],
                special_requirements: formData.specialRequirements,
                max_hourly_rate: hourlyRate,
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

    const ServiceSummary = () => (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 font-display">Service Summary</h3>

            {/* Service Info */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 rounded-full bg-[#E8F2EC] flex items-center justify-center text-2xl">
                    🎓
                </div>
                <div>
                    <div className="font-bold text-gray-900 text-sm">Shadow Teacher</div>
                    <div className="text-xs text-gray-500">Educational Support</div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-medium text-gray-900">
                        {SUBSCRIPTION_PLANS.find(p => p.id === formData.planType)?.label || 'One-Time'}
                    </span>
                </div>
                {formData.date && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Date</span>
                        <span className="font-medium text-gray-900">
                            {new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                )}
                {formData.startTime && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Time</span>
                        <span className="font-medium text-gray-900">{formData.startTime}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium text-gray-900">{formData.duration || 0} hours</span>
                </div>

                <div className="border-t border-gray-200 my-4" />

                {pricing ? (
                    <>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500">Session Cost</span>
                            <span className="font-medium">₹{pricing.sessionCost.toLocaleString()}</span>
                        </div>
                        {pricing.discount > 0 && (
                            <div className="flex justify-between text-sm mb-2 text-green-600">
                                <span>Discount ({pricing.discount}%)</span>
                                <span>-₹{pricing.discountAmount.toLocaleString()}</span>
                            </div>
                        )}
                        {formData.planType !== 'ONE_TIME' && (
                            <div className="flex justify-between text-sm font-medium pt-2 border-t border-dashed border-gray-200">
                                <span className="text-gray-700">Monthly</span>
                                <span>₹{pricing.monthlyCost.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-baseline pt-4 mt-2 border-t border-gray-200">
                            <span className="text-xs font-bold tracking-wider text-gray-500">TOTAL</span>
                            <span className="text-xl font-bold text-primary">₹{pricing.totalCost.toLocaleString()}</span>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-sm text-gray-400 py-2">
                        Pricing calculated based on duration
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <motion.div
            variants={overlayVars}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center sm:p-4"
            onClick={onClose}
        >
            <motion.div
                variants={modalVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                className="bg-white sm:rounded-[32px] w-full max-w-6xl h-full sm:h-auto sm:max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="w-8 h-8 -ml-2 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors sm:hidden"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 19L8 12L15 5" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-xl font-bold font-display text-gray-900">Booking</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="hidden sm:flex w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 items-center justify-center transition-colors text-gray-500"
                        >
                            <X size={18} />
                        </button>
                        <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors sm:hidden">
                            <span className="font-bold text-gray-900 text-xl tracking-widest pb-2">...</span>
                        </button>
                    </div>
                </div>

                {/* Location Warning */}
                {missingLocation && (
                    <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 shrink-0">
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

                {/* Responsive Layout Container */}
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

                    {/* LEFT Panel (Form) */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <form onSubmit={handleSubmit} className="p-6 space-y-8 pb-32 lg:pb-6">

                            {/* Title */}
                            <h1 className="text-3xl font-display font-medium text-primary">
                                Book a Shadow Teacher
                            </h1>

                            {/* Subscription Plan Selection */}
                            <div>
                                <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                    Choose Your Plan
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {SUBSCRIPTION_PLANS.map((plan) => {
                                        const isSelected = formData.planType === plan.id;
                                        return (
                                            <button
                                                key={plan.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, planType: plan.id })}
                                                className={`relative p-5 rounded-2xl border transition-all text-left group ${isSelected
                                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/10'
                                                    : 'bg-white border-gray-200 hover:border-primary hover:bg-gray-50'
                                                    }`}
                                            >
                                                {plan.popular && (
                                                    <div className="absolute -top-3 left-6 bg-[#CC7A68] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide">
                                                        POPULAR
                                                    </div>
                                                )}
                                                <div className="flex items-start justify-between mb-1">
                                                    <div>
                                                        <h4 className="font-bold text-base font-display">{plan.label}</h4>
                                                        <p className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                                                            {plan.description}
                                                        </p>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                                            <Check className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                {plan.discount > 0 && (
                                                    <div className={`mt-3 inline-block text-[10px] font-bold px-2 py-1 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        Save {plan.discount}%
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Date Selection */}
                            <div>
                                <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                    Select Date
                                </div>
                                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                                    {availableDates.map((date) => {
                                        const dateStr = formatDate(date);
                                        const isSelected = formData.date === dateStr;
                                        return (
                                            <button
                                                key={dateStr}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, date: dateStr })}
                                                className={`flex-shrink-0 flex flex-col items-center p-4 rounded-2xl border transition-all min-w-[70px] ${isSelected
                                                    ? 'bg-primary text-white border-primary shadow-md'
                                                    : 'bg-white border-gray-200 hover:border-primary hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className={`text-[10px] font-bold uppercase mb-1 ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                </span>
                                                <span className="text-xl font-bold mb-1">
                                                    {date.getDate()}
                                                </span>
                                                <span className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-gray-400'}`}>
                                                    {date.toLocaleDateString('en-US', { month: 'short' })}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Selection */}
                            <div>
                                <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                    Start Time
                                </div>
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                    {TIME_SLOTS.map((time) => {
                                        const isSelected = formData.startTime === time;
                                        return (
                                            <button
                                                key={time}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, startTime: time })}
                                                className={`py-2 px-1 rounded-xl text-sm font-medium border transition-all ${isSelected
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:border-primary hover:bg-gray-50'
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Duration & Students Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {/* Duration */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Duration
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {DURATION_OPTIONS.slice(0, 4).map((option) => {
                                            const isSelected = formData.duration === option.value;
                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, duration: option.value })}
                                                    className={`flex-1 min-w-[80px] py-3 rounded-xl text-sm font-medium border transition-all ${isSelected
                                                        ? 'bg-[#6b5b3d] text-white border-[#6b5b3d]'
                                                        : 'bg-white border-gray-200 text-gray-700 hover:border-[#6b5b3d]'
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {DURATION_OPTIONS.slice(4).map((option) => {
                                            const isSelected = formData.duration === option.value;
                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, duration: option.value })}
                                                    className={`flex-1 min-w-[80px] py-3 rounded-xl text-sm font-medium border transition-all ${isSelected
                                                        ? 'bg-[#6b5b3d] text-white border-[#6b5b3d]'
                                                        : 'bg-white border-gray-200 text-gray-700 hover:border-[#6b5b3d]'
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Number of Students */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Number of Students
                                    </div>
                                    <div className="flex gap-2">
                                        {['1', '2', '3', '4', '5+'].map((num) => {
                                            const isSelected = formData.numStudents === num;
                                            return (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, numStudents: num })}
                                                    className={`w-12 h-12 rounded-xl font-bold border transition-all ${isSelected
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'bg-white border-gray-200 text-gray-700 hover:border-primary'
                                                        }`}
                                                >
                                                    {num}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Special Educational Requirements */}
                            <div>
                                <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                    Special Educational Requirements
                                </div>
                                <textarea
                                    value={formData.specialRequirements}
                                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                                    placeholder="Learning needs, educational goals, specific support required..."
                                    className="w-full h-28 px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none text-sm bg-gray-50/50"
                                />
                            </div>

                            {/* Mobile Only: Service Summary at Bottom */}
                            <div className="lg:hidden mt-8 pt-8 border-t border-gray-100">
                                <ServiceSummary />
                                <button
                                    type="submit"
                                    disabled={loading || missingLocation || !formData.date || !formData.duration}
                                    className="w-full bg-primary hover:bg-primary-800 text-white py-4 rounded-full font-bold text-base mt-6 transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
                                >
                                    {loading ? 'Finding Shadow Teachers...' : 'Confirm Request →'}
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* RIGHT Panel (Desktop Only) */}
                    <div className="hidden lg:flex w-[400px] border-l border-gray-100 bg-white flex-col p-8 shrink-0">
                        <div className="sticky top-0">
                            <ServiceSummary />
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={loading || missingLocation || !formData.date || !formData.duration}
                                    className="w-full bg-primary hover:bg-primary-800 text-white py-4 rounded-full font-bold text-base transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
                                >
                                    {loading ? 'Finding Shadow Teachers...' : 'Confirm Request →'}
                                </button>
                                {(!formData.date || !formData.duration) && (
                                    <p className="text-xs text-amber-600 mt-3 text-center font-medium opacity-80">
                                        Please select date and duration
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
