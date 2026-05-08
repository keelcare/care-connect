'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Users, FileText, AlertCircle, HeartHandshake, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChildSelector } from './ChildSelector';
import { ChildProfileModal } from '@/components/dashboard/ChildProfileModal';
import { Child, SubscriptionPlanType } from '@/types/api';
import { ServiceInfoModal } from './ServiceInfoModal';
import { LocationModal } from '@/components/features/LocationModal';
import { SUBSCRIPTION_PLANS } from '@/constants/booking';

interface SpecialNeedsModalProps {
    onClose: () => void;
}

const STORAGE_KEY = 'careconnect_specialneeds_form';

const DURATION_OPTIONS = [
    { value: '2', label: '2 hours' },
    { value: '4', label: '4 hours' },
    { value: '6', label: '6 hours' },
    { value: '8', label: '8 hours' },
    { value: '12', label: '12 hours' },
];

const TIME_SLOTS = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00',
];

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getDaysInMonth(y: number, m: number): number {
    return new Date(y, m + 1, 0).getDate();
}

function getFirstDay(y: number, m: number): number {
    return new Date(y, m, 1).getDay();
}

export default function SpecialNeedsModal({ onClose }: SpecialNeedsModalProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [missingLocation, setMissingLocation] = useState(false);
    const [hourlyRate, setHourlyRate] = useState<number | null>(null);
    const [isLoadingPrice, setIsLoadingPrice] = useState(false);

    // Family Data
    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
    const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        duration: '',
        numPeople: '1',
        medicalConditions: '',
        mobilityAssistance: false,
        specialRequirements: '',
        planType: 'ONE_TIME',
        useInstallments: false,
    });

    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    // Calendar state
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    // Check if form is complete
    const isFormComplete = selectedDate !== null && formData.startTime !== '' && formData.duration !== '' && (children.length === 0 || selectedChildIds.length > 0);

    // Persistence: Load on mount
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.selectedChildIds) setSelectedChildIds(parsed.selectedChildIds);
                if (parsed.formData) setFormData(parsed.formData);
                if (parsed.selectedDate) setSelectedDate(parsed.selectedDate);
                if (parsed.currentYear) setCurrentYear(parsed.currentYear);
                if (parsed.currentMonth) setCurrentMonth(parsed.currentMonth);
            } catch (e) {
                console.error('Failed to load persisted state:', e);
            }
        }
    }, []);

    // Persistence: Save on change
    useEffect(() => {
        const stateToSave = {
            selectedChildIds,
            formData,
            selectedDate,
            currentYear,
            currentMonth
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }, [selectedChildIds, formData, selectedDate, currentYear, currentMonth]);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const data = await api.family.list();
                setChildren(data);
            } catch (error) {
                console.error('Failed to fetch children:', error);
            }
        };
        fetchChildren();

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
                // Match either SN or Special Needs
                const snService = services.find(s => s.name === 'SN' || s.name === 'Special Needs');
                if (snService) {
                    setHourlyRate(Number(snService.hourly_rate));
                }
            } catch (error) {
                console.error('Failed to fetch services:', error);
            } finally {
                setIsLoadingPrice(false);
            }
        };
        fetchServices();
    }, []);

    const handleChildSelect = (ids: string[]) => {
        setSelectedChildIds(ids);
        if (ids.length > 0) {
            setFormData(prev => ({ ...prev, numPeople: ids.length.toString() }));
        }
    };

    const handleChildSave = async (childData: Partial<Child>) => {
        try {
            const newChild = await api.family.create({ ...childData, profile_type: 'SPECIAL_NEEDS' });
            setChildren(prev => [...prev, newChild]);
            setSelectedChildIds(prev => [...prev, newChild.id]);
            setIsAddChildModalOpen(false);
            addToast({ message: 'Child profile added successfully!', type: 'success' });
        } catch (error) {
            console.error('Failed to create child:', error);
            addToast({ message: 'Failed to add child profile', type: 'error' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (missingLocation) {
            addToast({ message: 'Please set your location in your profile first', type: 'error' });
            return;
        }

        if (!selectedDate || !formData.startTime || !formData.duration) {
            addToast({ message: 'Please fill in all required fields', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const requirements = [
                formData.medicalConditions ? `Medical: ${formData.medicalConditions}` : '',
                formData.mobilityAssistance ? 'Mobility assistance required' : '',
                formData.specialRequirements,
            ].filter(Boolean).join('. ');

            const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}`;
            const numChildren = selectedChildIds.length > 0
                ? selectedChildIds.length
                : Math.max(1, Number(formData.numPeople) || 1);

            const payload = {
                category: 'SN',
                date: dateStr,
                start_time: formData.startTime,
                duration_hours: Number(formData.duration),
                num_children: numChildren,
                child_ids: selectedChildIds,
                children_ages: [],
                required_skills: ['special_needs_care', 'compassionate_care'],
                special_requirements: requirements,
                plan_type: (formData.planType as SubscriptionPlanType) || 'ONE_TIME',
                plan_duration_months: SUBSCRIPTION_PLANS.find(p => p.id === formData.planType)?.duration || 1,
                discount_percentage: SUBSCRIPTION_PLANS.find(p => p.id === formData.planType)?.discount || 0,
                use_installments: formData.useInstallments,
            };

            await api.requests.create(payload);
            addToast({ message: 'Special needs care request submitted! Finding the best match for you...', type: 'success' });
            localStorage.removeItem(STORAGE_KEY);
            router.push('/bookings');
            onClose();
        } catch (error) {
            addToast({ message: 'Failed to create service request. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDay(currentYear, currentMonth);

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(y => y - 1);
        } else {
            setCurrentMonth(m => m - 1);
        }
        setSelectedDate(null);
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(y => y + 1);
        } else {
            setCurrentMonth(m => m + 1);
        }
        setSelectedDate(null);
    };

    const formattedDate = selectedDate
        ? `${MONTH_NAMES[currentMonth].slice(0, 3)} ${selectedDate}, ${currentYear}`
        : "—";

    const getAvailableTimeSlots = () => {
        if (!selectedDate) return TIME_SLOTS;

        const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}`;
        const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

        if (dateStr === todayStr) {
            const currentTimePlus30 = new Date(today.getTime() + 30 * 60000);
            const currentHours = currentTimePlus30.getHours();
            const currentMinutes = currentTimePlus30.getMinutes();

            return TIME_SLOTS.filter(time => {
                const [slotHours, slotMinutes] = time.split(':').map(Number);
                if (slotHours > currentHours) return true;
                if (slotHours === currentHours && slotMinutes >= currentMinutes) return true;
                return false;
            });
        }
        return TIME_SLOTS;
    };

    const calCells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) calCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) calCells.push(d);

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

    const calculatePricing = () => {
        const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === formData.planType);
        if (!selectedPlan || !formData.duration || !hourlyRate) return null;

        const durationHours = Number(formData.duration);
        const sessionCost = hourlyRate * durationHours;
        const discount = selectedPlan.discount;
        const discountAmount = (sessionCost * discount) / 100;
        const sessionCostAfterDiscount = sessionCost - discountAmount;

        let totalCost = sessionCostAfterDiscount;
        let sessionsPerMonth = 0;
        let monthlyCost = 0;

        if (selectedPlan.id !== 'ONE_TIME') {
            // Assume 4 sessions per month for subscription plans
            sessionsPerMonth = 4;
            monthlyCost = sessionCostAfterDiscount * sessionsPerMonth;
            totalCost = monthlyCost * (selectedPlan.duration || 1);
        }

        return {
            sessionCost,
            discount,
            discountAmount,
            sessionCostAfterDiscount,
            totalCost,
            monthlyCost,
            sessionsPerMonth,
        };
    };

    const pricing = calculatePricing();

    const ServiceSummary = () => (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 font-display">Service Summary</h3>

            {/* Service Info */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 rounded-full bg-[#FDF3F1] flex items-center justify-center text-2xl">
                    💝
                </div>
                <div>
                    <div className="font-bold text-gray-900 text-sm">Special Needs Care</div>
                    <div className="text-xs text-gray-500">Professional Support</div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-medium text-gray-900">
                        {SUBSCRIPTION_PLANS.find(p => p.id === formData.planType)?.label || 'One-Time'}
                        {formData.planType !== 'ONE_TIME' && (
                            <span className="ml-1 text-[10px] bg-[#CC7A68]/10 text-[#CC7A68] px-1.5 py-0.5 rounded">
                                {formData.useInstallments ? 'Monthly' : 'Full'}
                            </span>
                        )}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium text-gray-900">
                        {formattedDate}
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium text-gray-900">{formData.startTime || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium text-gray-900">{formData.duration || 0} hours</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">People</span>
                    <span className="font-medium text-gray-900">
                        {selectedChildIds.length > 0 ? selectedChildIds.length : formData.numPeople}
                    </span>
                </div>
            </div>

            <div className="border-t border-gray-200 my-4" />

            {pricing ? (
                <>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Session Cost</span>
                        <span className="font-medium">₹{pricing.sessionCost.toLocaleString()}</span>
                    </div>
                    {pricing.discount > 0 && (
                        <div className="flex justify-between text-sm mb-2 text-green-600 font-medium">
                            <span>Plan Discount ({pricing.discount}%)</span>
                            <span>-₹{pricing.discountAmount.toLocaleString()}</span>
                        </div>
                    )}
                    {formData.planType !== 'ONE_TIME' && (
                        <div className="flex justify-between text-sm font-medium pt-2 mb-4 border-t border-dashed border-gray-200">
                            <span className="text-gray-700">{formData.useInstallments ? 'First Installment' : 'Monthly Cost'}</span>
                            <span>₹{pricing.monthlyCost.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-baseline pt-4 mt-2 border-t border-gray-200">
                        <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                            {formData.useInstallments ? 'TOTAL COMMITMENT' : 'TOTAL EST.'}
                        </span>
                        <span className="text-xl font-bold text-[#CC7A68]">
                            ₹{pricing.totalCost.toLocaleString()}
                        </span>
                    </div>
                    <div className="text-right text-[10px] text-gray-400 mt-1">
                        Based on ₹{hourlyRate?.toLocaleString() || 0}/hr
                    </div>
                </>
            ) : (
                <div className="text-center text-sm text-gray-400 py-2">
                    Pricing calculated based on duration
                </div>
            )}
        </div>
    );

    return (
        <>
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
                    className="bg-white sm:rounded-[32px] w-full max-w-6xl h-full sm:h-auto sm:max-h-[85vh] shadow-2xl relative overflow-hidden flex flex-col"
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

                    {missingLocation && (
                        <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 shrink-0">
                            <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-amber-800">Location Required</p>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-sm text-amber-700">
                                        Please set your location to use auto-matching.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setIsLocationModalOpen(true)}
                                        className="text-sm font-bold text-amber-900 underline hover:no-underline"
                                    >
                                        Update Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Responsive Layout Container */}
                    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

                        {/* LEFT Panel (Form) */}
                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-8 pb-32 lg:pb-6">

                                {/* Title */}
                                <h1 className="text-3xl font-display font-medium text-[#CC7A68] flex items-center gap-3">
                                    Special Needs Care
                                    <button
                                        type="button"
                                        onClick={() => setIsInfoModalOpen(true)}
                                        className="w-8 h-8 rounded-full bg-[#CC7A68]/10 text-[#CC7A68] flex items-center justify-center hover:bg-[#CC7A68]/20 transition-colors"
                                    >
                                        <Info size={18} />
                                    </button>
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
                                                    onClick={() => setFormData({
                                                        ...formData,
                                                        planType: plan.id,
                                                        useInstallments: plan.duration > 1 ? formData.useInstallments : false
                                                    })}
                                                    className={`relative p-5 rounded-2xl border transition-all text-left group ${isSelected
                                                        ? 'bg-[#CC7A68] text-white border-[#CC7A68] shadow-lg shadow-[#CC7A68]/10'
                                                        : 'bg-white border-gray-200 hover:border-[#CC7A68] hover:bg-gray-50'
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
                                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
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

                                {/* Payment Type Selection (Only for Subscriptions with duration > 1) */}
                                {formData.planType !== 'ONE_TIME' && (SUBSCRIPTION_PLANS.find(p => p.id === formData.planType)?.duration || 0) > 1 && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                            Payment Option
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, useInstallments: false })}
                                                className={`p-4 rounded-2xl border transition-all text-center ${!formData.useInstallments
                                                    ? 'bg-[#CC7A68] text-white border-[#CC7A68] shadow-md shadow-[#CC7A68]/10'
                                                    : 'bg-white border-gray-200 hover:border-[#CC7A68] hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="font-bold text-sm">Pay in Full</div>
                                                <div className={`text-[10px] mt-0.5 ${!formData.useInstallments ? 'text-white/80' : 'text-gray-500'}`}>
                                                    One payment upfront
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, useInstallments: true })}
                                                className={`p-4 rounded-2xl border transition-all text-center ${formData.useInstallments
                                                    ? 'bg-[#CC7A68] text-white border-[#CC7A68] shadow-md shadow-[#CC7A68]/10'
                                                    : 'bg-white border-gray-200 hover:border-[#CC7A68] hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="font-bold text-sm">Monthly Installments</div>
                                                <div className={`text-[10px] mt-0.5 ${formData.useInstallments ? 'text-white/80' : 'text-gray-500'}`}>
                                                    Pay month by month
                                                </div>
                                            </button>
                                        </div>
                                        <div className="mt-3 flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                            <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-[10px] text-blue-700 leading-relaxed">
                                                {formData.useInstallments
                                                    ? "You will only be charged for the first month today. Subsequent payments will be automatically scheduled each month."
                                                    : "The total amount for the entire duration will be charged in a single upfront payment today."}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Date Selection */}
                                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="font-display font-medium text-xl text-gray-800">
                                            {MONTH_NAMES[currentMonth]} {currentYear}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={prevMonth}
                                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition"
                                            >
                                                ‹
                                            </button>
                                            <button
                                                type="button"
                                                onClick={nextMonth}
                                                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition"
                                            >
                                                ›
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 mb-2">
                                        {DAYS.map(d => (
                                            <div key={d} className="text-center text-xs font-bold text-gray-400 py-2">
                                                {d}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-y-2">
                                        {calCells.map((day, idx) => {
                                            if (!day) return <div key={`e${idx}`} />;
                                            const isSel = day === selectedDate;

                                            const dateObj = new Date(currentYear, currentMonth, day);
                                            const todayStart = new Date();
                                            todayStart.setHours(0, 0, 0, 0);
                                            const isPast = dateObj < todayStart;

                                            return (
                                                <div key={day} className="flex justify-center">
                                                    <button
                                                        type="button"
                                                        disabled={isPast}
                                                        onClick={() => !isPast && setSelectedDate(day)}
                                                        className={`w-10 h-10 rounded-full text-sm font-medium transition flex items-center justify-center ${isPast
                                                            ? 'text-gray-300 cursor-not-allowed'
                                                            : isSel
                                                                ? 'bg-[#CC7A68] text-white shadow-md shadow-[#CC7A68]/20'
                                                                : 'text-gray-700 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {day}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Time Selection */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Start Time
                                    </div>
                                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2">
                                        {getAvailableTimeSlots().map((time) => {
                                            const isSelected = formData.startTime === time;
                                            return (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, startTime: time })}
                                                    className={`py-2 px-1 rounded-xl text-sm font-medium border transition-all ${isSelected
                                                        ? 'bg-[#CC7A68] text-white border-[#CC7A68]'
                                                        : 'bg-white border-gray-200 text-gray-700 hover:border-[#CC7A68] hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                        {getAvailableTimeSlots().length === 0 && (
                                            <div className="col-span-full text-sm text-gray-500 py-2">
                                                No time slots available for today.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Duration */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Duration
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {DURATION_OPTIONS.map((option) => {
                                            const isSelected = formData.duration === option.value;
                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, duration: option.value })}
                                                    className={`flex-1 min-w-[80px] py-3 rounded-xl text-sm font-medium border transition-all ${isSelected
                                                        ? 'bg-[#b06a5b] text-white border-[#b06a5b]'
                                                        : 'bg-white border-gray-200 text-gray-700 hover:border-[#b06a5b]'
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Whom For (Children/People) */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Who is this for?
                                    </div>

                                    {/* Fallback Manual Counter if no children */}
                                    {children.length === 0 && (
                                        <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-600 mb-3">
                                                No profiles found. You can select the number of people below, or add a profile for better matching.
                                            </p>
                                            <div className="flex gap-3">
                                                {['1', '2', '3'].map((num) => {
                                                    const isSelected = formData.numPeople === num;
                                                    return (
                                                        <button
                                                            key={num}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, numPeople: num })}
                                                            className={`w-12 h-12 rounded-xl font-bold border transition-all ${isSelected
                                                                ? 'bg-[#CC7A68] text-white border-[#CC7A68]'
                                                                : 'bg-white border-gray-200 text-gray-700 hover:border-[#CC7A68]'
                                                                }`}
                                                        >
                                                            {num}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <ChildSelector
                                        childrenMap={children}
                                        selectedIds={selectedChildIds}
                                        onChange={handleChildSelect}
                                        onAddNew={() => setIsAddChildModalOpen(true)}
                                    />
                                    {children.length > 0 && selectedChildIds.length === 0 && (
                                        <p className="text-xs text-amber-600 mt-2 font-medium">
                                            Please select at least one profile to continue
                                        </p>
                                    )}
                                </div>

                                {/* Specific Requirements */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Specific Requirements
                                    </div>
                                    <textarea
                                        value={formData.medicalConditions}
                                        onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                                        placeholder="Please describe any specific needs, conditions, or routines we should know about..."
                                        className="w-full h-24 px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#CC7A68] focus:ring-1 focus:ring-[#CC7A68] focus:outline-none resize-none text-sm bg-gray-50/50"
                                    />
                                </div>

                                {/* Mobility */}
                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.mobilityAssistance}
                                            onChange={(e) => setFormData({ ...formData, mobilityAssistance: e.target.checked })}
                                            className="w-5 h-5 rounded border-2 border-gray-300 text-[#CC7A68] focus:ring-[#CC7A68]"
                                        />
                                        <span className="text-gray-700 font-medium text-sm">Mobility assistance required</span>
                                    </label>
                                </div>

                                {/* Additional Notes */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Additional Notes (Optional)
                                    </div>
                                    <textarea
                                        value={formData.specialRequirements}
                                        onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                                        placeholder="Any other preferences or special instructions..."
                                        className="w-full h-24 px-4 py-3 rounded-2xl border border-gray-200 focus:border-[#CC7A68] focus:ring-1 focus:ring-[#CC7A68] focus:outline-none resize-none text-sm bg-gray-50/50"
                                    />
                                </div>

                                {/* Mobile Only: Service Summary at Bottom */}
                                <div className="lg:hidden mt-8 pt-8 border-t border-gray-100">
                                    <ServiceSummary />
                                    <button
                                        type="submit"
                                        disabled={loading || !isFormComplete}
                                        className="w-full bg-[#CC7A68] hover:bg-[#b06a5b] text-white py-4 rounded-full font-bold text-base mt-6 transition-all disabled:opacity-50 shadow-xl shadow-[#CC7A68]/20"
                                    >
                                        {loading ? 'Finding Caregivers...' : missingLocation ? 'Set Location to Book' : 'Confirm Request →'}
                                    </button>
                                    {missingLocation && isFormComplete && (
                                        <button
                                            type="button"
                                            onClick={() => setIsLocationModalOpen(true)}
                                            className="w-full mt-3 text-sm font-bold text-[#CC7A68] underline"
                                        >
                                            Set Location Now
                                        </button>
                                    )}
                                </div>

                            </form>
                        </div>

                        {/* RIGHT Panel (Desktop Only) */}
                        <div className="hidden lg:flex w-[350px] border-l border-gray-100 bg-white flex-col p-6 shrink-0 overflow-y-auto">
                            <div className="sticky top-0">
                                <ServiceSummary />
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        onClick={(e) => {
                                            if (missingLocation) {
                                                setIsLocationModalOpen(true);
                                                return;
                                            }
                                            handleSubmit(e);
                                        }}
                                        disabled={loading || !isFormComplete}
                                        className="w-full bg-[#CC7A68] hover:bg-[#b06a5b] text-white py-4 rounded-full font-bold text-base transition-all disabled:opacity-50 shadow-xl shadow-[#CC7A68]/20"
                                    >
                                        {loading ? 'Finding Caregivers...' : missingLocation ? 'Set Location to Book' : 'Confirm Request →'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <ChildProfileModal
                isOpen={isAddChildModalOpen}
                onClose={() => setIsAddChildModalOpen(false)}
                onSave={handleChildSave}
                initialData={{ profile_type: 'SPECIAL_NEEDS' }}
            />

            <ServiceInfoModal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
                category="Special Needs"
            />

            {/* Location Modal */}
            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
            />
        </>
    );
}
