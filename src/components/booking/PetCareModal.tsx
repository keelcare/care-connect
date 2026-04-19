'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, PawPrint, FileText, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ServiceInfoModal } from './ServiceInfoModal';
import { SubscriptionPlanType } from '@/types/api';
import { SUBSCRIPTION_PLANS } from '@/constants/booking';

interface PetCareModalProps {
    onClose: () => void;
}

const DURATION_OPTIONS = [
    { value: '1', label: '1 hour' },
    { value: '2', label: '2 hours' },
    { value: '3', label: '3 hours' },
    { value: '4', label: '4 hours' },
    { value: '6', label: '6 hours' },
    { value: '8', label: '8 hours' },
];

const TIME_SLOTS = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00',
];

const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Other'];

export default function PetCareModal({ onClose }: PetCareModalProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [missingLocation, setMissingLocation] = useState(false);
    const [hourlyRate, setHourlyRate] = useState<number | null>(null);
    const [isLoadingPrice, setIsLoadingPrice] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        duration: '',
        petType: '',
        numPets: '1',
        specialInstructions: '',
        planType: 'ONE_TIME',
        useInstallments: false,
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
            }
        }
    }, [user]);

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoadingPrice(true);
            try {
                const services = await api.services.list();
                const pcService = services.find(s => s.name === 'PC' || s.name === 'Pet Care');
                if (pcService) {
                    setHourlyRate(Number(pcService.hourly_rate));
                }
            } catch (error) {
                console.error('Failed to fetch services:', error);
            } finally {
                setIsLoadingPrice(false);
            }
        };
        fetchServices();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (missingLocation) {
            addToast({ message: 'Please set your location in your profile first', type: 'error' });
            return;
        }

        if (!formData.date || !formData.startTime || !formData.duration || !formData.petType) {
            addToast({ message: 'Please fill in all required fields', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const requirements = `Pet Type: ${formData.petType}. ${formData.specialInstructions}`;

            const payload = {
                category: 'PC',
                date: formData.date,
                start_time: formData.startTime,
                duration_hours: Number(formData.duration),
                num_children: Number(formData.numPets),
                children_ages: [],
                required_skills: ['pet_care', 'animal_handling'],
                special_requirements: requirements,
                plan_type: (formData.planType as SubscriptionPlanType) || 'ONE_TIME',
                plan_duration_months: SUBSCRIPTION_PLANS.find(p => p.id === formData.planType)?.duration || 1,
                discount_percentage: SUBSCRIPTION_PLANS.find(p => p.id === formData.planType)?.discount || 0,
                use_installments: formData.useInstallments,
            };

            await api.requests.create(payload);
            addToast({ message: 'Pet care request submitted! Finding the best match for you...', type: 'success' });
            router.push('/bookings');
            onClose();
        } catch (error) {
            addToast({ message: 'Failed to create service request. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const isToday = (date: Date) => date.toDateString() === new Date().toDateString();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[40px] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
                <div className="sticky top-0 bg-gradient-to-r from-[#C9C6E5] to-[#b8b4d9] text-[#0F172A] p-8 rounded-t-[40px] z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold font-display mb-2 flex items-center gap-3">
                                Pet Care Booking
                                <button
                                    type="button"
                                    onClick={() => setIsInfoModalOpen(true)}
                                    className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors"
                                >
                                    <Info size={18} />
                                </button>
                            </h2>
                            <p className="text-gray-700 font-body">Professional care for your furry friends</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {missingLocation && (
                    <div className="mx-8 mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                        <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-amber-800">Location Required</p>
                            <p className="text-sm text-amber-700 mt-1">
                                Please set your location in your <Link href="/dashboard/profile" className="underline font-medium text-amber-900">profile settings</Link>.
                            </p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-8">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <PawPrint className="w-5 h-5 text-[#8B87C7]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Pet Type</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {PET_TYPES.map((type) => {
                                const isSelected = formData.petType === type;
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, petType: type })}
                                        className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${isSelected ? 'bg-[#C9C6E5] text-[#0F172A] border-[#C9C6E5]' : 'bg-white border-gray-200 hover:border-[#C9C6E5] hover:bg-[#F5F4FB]'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Subscription Plan Selection */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-[#8B87C7]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Choose Your Plan</h3>
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
                                        className={`relative p-5 rounded-2xl border-2 transition-all text-left group ${isSelected
                                            ? 'bg-[#C9C6E5] text-[#0F172A] border-[#C9C6E5] shadow-lg shadow-[#C9C6E5]/10'
                                            : 'bg-white border-gray-200 hover:border-[#C9C6E5] hover:bg-gray-50'
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
                                                <p className={`text-xs mt-1 ${isSelected ? 'text-[#0F172A]/80' : 'text-gray-500'}`}>
                                                    {plan.description}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <div className="w-5 h-5 rounded-full bg-[#0F172A]/10 flex items-center justify-center">
                                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M10 3L4.5 8.5L2 6" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        {plan.discount > 0 && (
                                            <div className={`mt-3 inline-block text-[10px] font-bold px-2 py-1 rounded-full ${isSelected ? 'bg-[#0F172A]/10 text-[#0F172A]' : 'bg-green-100 text-green-800'
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
                        <div className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                             <div className="flex items-center gap-2 mb-4">
                                <FileText className="w-5 h-5 text-[#8B87C7]" />
                                <h3 className="text-xl font-bold text-[#0F172A] font-display">Payment Option</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, useInstallments: false })}
                                    className={`p-4 rounded-2xl border-2 transition-all text-center ${!formData.useInstallments
                                        ? 'bg-[#C9C6E5] text-[#0F172A] border-[#C9C6E5] shadow-md shadow-[#C9C6E5]/10'
                                        : 'bg-white border-gray-200 hover:border-[#C9C6E5] hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="font-bold text-sm">Pay in Full</div>
                                    <div className={`text-[10px] mt-0.5 ${!formData.useInstallments ? 'text-[#0F172A]/80' : 'text-gray-500'}`}>
                                        One payment upfront
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, useInstallments: true })}
                                    className={`p-4 rounded-2xl border-2 transition-all text-center ${formData.useInstallments
                                        ? 'bg-[#C9C6E5] text-[#0F172A] border-[#C9C6E5] shadow-md shadow-[#C9C6E5]/10'
                                        : 'bg-white border-gray-200 hover:border-[#0F172A] hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="font-bold text-sm">Monthly Installments</div>
                                    <div className={`text-[10px] mt-0.5 ${formData.useInstallments ? 'text-[#0F172A]/80' : 'text-gray-500'}`}>
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

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-[#8B87C7]" />
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
                                        className={`flex-shrink-0 flex flex-col items-center p-4 rounded-2xl border-2 transition-all min-w-[80px] ${isSelected ? 'bg-[#C9C6E5] text-[#0F172A] border-[#C9C6E5]' : 'bg-white border-gray-200 hover:border-[#C9C6E5] hover:bg-[#F5F4FB]'
                                            }`}
                                    >
                                        <span className={`text-xs font-medium mb-1 ${isSelected ? 'text-gray-700' : 'text-gray-500'}`}>
                                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                        </span>
                                        <span className={`text-2xl font-bold ${isToday(date) && !isSelected ? 'text-[#8B87C7]' : ''}`}>{date.getDate()}</span>
                                        <span className={`text-xs ${isSelected ? 'text-gray-700' : 'text-gray-400'}`}>
                                            {date.toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-[#8B87C7]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Start Time</h3>
                        </div>
                        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                            {TIME_SLOTS.map((time) => {
                                const isSelected = formData.startTime === time;
                                return (
                                    <button
                                        key={time}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, startTime: time })}
                                        className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all ${isSelected ? 'bg-[#C9C6E5] text-[#0F172A] border-[#C9C6E5]' : 'bg-white border-gray-200 hover:border-[#C9C6E5] hover:bg-[#F5F4FB]'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-[#8B87C7]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Duration</h3>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                            {DURATION_OPTIONS.map((option) => {
                                const isSelected = formData.duration === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, duration: option.value })}
                                        className={`py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${isSelected ? 'bg-[#C9C6E5] text-[#0F172A] border-[#C9C6E5]' : 'bg-white border-gray-200 hover:border-[#C9C6E5] hover:bg-[#F5F4FB]'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <PawPrint className="w-5 h-5 text-[#8B87C7]" />
                            <h3 className="text-xl font-bold text-[#0F172A] font-display">Number of Pets</h3>
                        </div>
                        <div className="flex gap-3">
                            {['1', '2', '3', '4+'].map((num) => {
                                const isSelected = formData.numPets === num;
                                return (
                                    <button
                                        key={num}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, numPets: num })}
                                        className={`w-14 h-14 rounded-xl font-semibold border-2 transition-all ${isSelected ? 'bg-[#C9C6E5] text-[#0F172A] border-[#C9C6E5]' : 'bg-white border-gray-200 hover:border-[#C9C6E5]'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {(() => {
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
                            sessionsPerMonth = 4;
                            monthlyCost = sessionCostAfterDiscount * sessionsPerMonth;
                            totalCost = monthlyCost * (selectedPlan.duration || 1);
                        }

                        return (
                            <div className="mb-6 p-5 bg-[#C9C6E5]/10 rounded-[24px] border border-[#C9C6E5]/20">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Session Cost</span>
                                        <span className="font-medium">₹{sessionCost.toLocaleString()}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-sm text-green-600 font-medium">
                                            <span>Plan Discount ({discount}%)</span>
                                            <span>-₹{discountAmount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    {selectedPlan.id !== 'ONE_TIME' && (
                                        <div className="flex justify-between text-sm font-medium pt-2 border-t border-dashed border-gray-300">
                                            <span className="text-gray-700">{formData.useInstallments ? 'First Installment' : 'Monthly Cost'}</span>
                                            <span>₹{monthlyCost.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                                            {formData.useInstallments ? 'TOTAL COMMITMENT' : 'Estimated Total'}
                                        </p>
                                        <p className="text-[10px] text-gray-400">Based on {formData.duration} hours @ ₹{hourlyRate}/hr</p>
                                    </div>
                                    <div className="text-2xl font-bold text-[#0F172A]">
                                        ₹{totalCost.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    <button
                        type="submit"
                        disabled={loading || missingLocation}
                        className="w-full bg-[#C9C6E5] hover:bg-[#b8b4d9] text-[#0F172A] py-5 rounded-full font-bold text-lg transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
                    >
                        {loading ? 'Finding Pet Caregivers...' : 'Find My Pet Caregiver'}
                    </button>
                </form>
            </motion.div>

            <ServiceInfoModal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
                category="Pet Care"
            />
        </motion.div>
    );
}
