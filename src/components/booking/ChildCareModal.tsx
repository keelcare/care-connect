'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChildSelector } from './ChildSelector';
import { ChildProfileModal } from '@/components/dashboard/ChildProfileModal';
import { Child } from '@/types/api';
import { ServiceInfoModal } from './ServiceInfoModal';

interface ChildCareModalProps {
    onClose: () => void;
}

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const TIME_SLOTS = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00',
];

const DURATION_OPTIONS = [
    { value: '2', label: '2 hours' },
    { value: '4', label: '4 hours' },
    { value: '6', label: '6 hours' },
    { value: '8', label: '8 hours' },
    { value: '12', label: '12 hours' },
];

function getDaysInMonth(y: number, m: number): number {
    return new Date(y, m + 1, 0).getDate();
}

function getFirstDay(y: number, m: number): number {
    return new Date(y, m, 1).getDay();
}

export default function ChildCareModal({ onClose }: ChildCareModalProps) {
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

    // Calendar state
    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    // Time and duration state
    const [startTime, setStartTime] = useState<string>('');
    const [durationStr, setDurationStr] = useState<string>('');
    const [numPeople, setNumPeople] = useState('1');
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    const [specialRequirements, setSpecialRequirements] = useState('');

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
                const ccService = services.find(s => s.name === 'CC' || s.name === 'Child Care');
                if (ccService) {
                    // setHourlyRate(Number(ccService.hourly_rate));
                    setHourlyRate(200); // Explicitly set to 200 as requested
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
            setNumPeople(ids.length.toString());
        }
    };

    const handleChildSave = async (childData: Partial<Child>) => {
        try {
            const newChild = await api.family.create(childData);
            setChildren(prev => [...prev, newChild]);
            setSelectedChildIds(prev => [...prev, newChild.id]);
            setIsAddChildModalOpen(false);
            addToast({ message: 'Child profile added successfully!', type: 'success' });
        } catch (error) {
            console.error('Failed to create child:', error);
            addToast({ message: 'Failed to add child profile', type: 'error' });
        }
    };

    // Time slots generation
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
    const getAvailableTimeSlots = () => {
        if (!selectedDate) return TIME_SLOTS;

        const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}`;
        const todayStr = formatDate(new Date());

        if (dateStr === todayStr) {
            const today = new Date();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (missingLocation) {
            addToast({
                message: 'Please set your location in your profile first',
                type: 'error',
            });
            return;
        }

        // Validate profile selection
        if (selectedChildIds.length === 0) {
            addToast({
                message: 'Please select at least one child profile',
                type: 'error',
            });
            return;
        }

        // Validate date selection
        if (!selectedDate) {
            addToast({
                message: 'Please select a date for the booking',
                type: 'error',
            });
            return;
        }

        // Validate time and duration
        if (!startTime || !durationStr) {
            addToast({
                message: 'Please select start time and duration',
                type: 'error',
            });
            return;
        }

        setLoading(true);

        try {
            const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}`;
            
            const numChildren = selectedChildIds.length > 0
                ? selectedChildIds.length
                : Math.max(1, Number(numPeople) || 1);

            const payload = {
                category: 'CC',
                date: dateStr,
                start_time: startTime,
                duration_hours: Number(durationStr),
                num_children: numChildren,
                child_ids: selectedChildIds,
                children_ages: [],
                max_hourly_rate: hourlyRate || undefined,
                required_skills: [],
                special_requirements: specialRequirements,
            };

            await api.requests.create(payload);

            addToast({
                message: 'Child care request submitted! Finding the best match for you...',
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
    
    // Calculate end time
    const getEndTime = () => {
        if (!startTime || !durationStr) return "—";
        const [hStr, mStr] = startTime.split(':');
        const startMins = Number(hStr) * 60 + Number(mStr);
        const totalMins = startMins + Number(durationStr) * 60;
        let h = Math.floor(totalMins / 60);
        const nextDay = h >= 24 ? " (Next Day)" : "";
        h = h % 24; // Normalize to 24-hour format
        const m = totalMins % 60;
        const ampm = h < 12 ? "AM" : "PM";
        const h12 = h % 12 === 0 ? 12 : h % 12;
        return `${h12}:${m.toString().padStart(2, "0")} ${ampm}${nextDay}`;
    };

    const endTime = getEndTime();

    const selectedChild = selectedChildIds.length > 0 ? children.find(c => c.id === selectedChildIds[0]) : null;

    // Check if form is complete
    const isFormComplete = selectedDate !== null && startTime !== '' && durationStr !== '';

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

    const ServiceSummary = () => (
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 font-display">Service Summary</h3>

            {/* Service & Profile */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-full bg-[#E8F2EC] flex items-center justify-center text-xl">
                    👶
                </div>
                <div>
                    <div className="font-bold text-gray-900 text-sm">Child Care</div>
                    <div className="text-xs text-gray-500">
                         {selectedChildIds.length > 0 
                            ? `For ${selectedChildIds.map(id => children.find(c => c.id === id)?.first_name).join(', ')}`
                            : 'Select a child'}
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium text-gray-900">{formattedDate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium text-gray-900">
                        {startTime !== '' ? startTime : '—'} 
                        {' - '} 
                        {endTime}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium text-gray-900">{durationStr || 0} hours</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Children</span>
                    <span className="font-medium text-gray-900">
                        {selectedChildIds.length > 0 ? selectedChildIds.length : numPeople}
                    </span>
                </div>
            </div>

            {/* Price */}
            <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-bold tracking-wider text-gray-500">ESTIMATED TOTAL</span>
                    <span className={`text-xl font-bold ${hourlyRate ? 'text-primary-900' : 'text-gray-300'}`}>
                        {hourlyRate ? `₹${(hourlyRate * Number(durationStr || 0)).toFixed(0)}` : '—'}
                    </span>
                </div>
                <div className="text-right text-[10px] text-gray-400">
                    {hourlyRate ? `Based on ₹${hourlyRate}/hr` : 'Pricing TBD'}
                </div>
            </div>
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
                    className="bg-white sm:rounded-[32px] w-full max-w-5xl h-full sm:h-auto sm:max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                         <div className="flex items-center gap-4">
                            <button 
                                onClick={onClose}
                                className="w-8 h-8 -ml-2 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors sm:hidden"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15 19L8 12L15 5" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                                
                                {/* 1. Title */}
                                <h1 className="text-fluid-3xl font-display font-medium text-primary-900 flex items-center gap-3">
                                    Book a Child Care
                                    <button
                                        type="button"
                                        onClick={() => setIsInfoModalOpen(true)}
                                        className="w-8 h-8 rounded-full bg-primary-900/10 text-primary-900 flex items-center justify-center hover:bg-primary-900/20 transition-colors"
                                    >
                                        <Info size={18} />
                                    </button>
                                </h1>

                                {/* 2. Profiles */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Who is this booking for?
                                    </div>
                                    
                                    {/* Fallback Manual Counter if no children */}
                                    {children.length === 0 && (
                                        <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-600 mb-3">
                                                No profiles found. You can select the number of children below, or add a profile for better matching.
                                            </p>
                                            <div className="flex gap-3">
                                                {['1', '2', '3'].map((num) => {
                                                    const isSelected = numPeople === num;
                                                    return (
                                                        <button
                                                            key={num}
                                                            type="button"
                                                            onClick={() => setNumPeople(num)}
                                                            className={`w-12 h-12 rounded-xl font-bold border transition-all ${isSelected
                                                                ? 'bg-primary-900 text-white border-primary-900'
                                                                : 'bg-white border-gray-200 text-gray-700 hover:border-primary-900'
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
                                </div>

                                {/* 3. Calendar */}
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
                                                        className={`w-10 h-10 rounded-full text-sm font-medium transition flex items-center justify-center ${
                                                            isPast 
                                                                ? 'text-gray-300 cursor-not-allowed'
                                                                : isSel
                                                                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
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

                                {/* 4. Time Slots */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Start Time
                                    </div>
                                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                        {getAvailableTimeSlots().map((time) => {
                                            const isSelected = startTime === time;
                                            return (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    onClick={() => setStartTime(time)}
                                                    className={`py-2 px-1 rounded-xl text-sm font-medium border transition-all ${isSelected
                                                        ? 'bg-primary-900 text-white border-primary-900'
                                                        : 'bg-white border-gray-200 text-gray-700 hover:border-primary-900 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                        {getAvailableTimeSlots().length === 0 && (
                                            <div className="col-span-full text-sm text-gray-500 py-2">
                                                No time slots available for selected date.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 5. Duration */}
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Duration
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {DURATION_OPTIONS.map((option) => {
                                            const isSelected = durationStr === option.value;
                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => setDurationStr(option.value)}
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

                                {/* 6. Special Requirements */}
                                <div>
                                     <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">
                                        Additional Notes
                                    </div>
                                    <textarea
                                        value={specialRequirements}
                                        onChange={(e) => setSpecialRequirements(e.target.value)}
                                        placeholder="Any specific needs, allergies, preferences..."
                                        className="w-full h-24 px-4 py-3 rounded-2xl border border-gray-200 focus:border-primary-900 focus:ring-1 focus:ring-primary-900 focus:outline-none resize-none text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50/50"
                                    />
                                </div>

                                {/* Mobile Only: Service Summary at Bottom */}
                                <div className="lg:hidden mt-8 pt-8 border-t border-gray-100">
                                    <ServiceSummary />
                                    <div className="mt-6">
                                        <button
                                            type="submit"
                                            disabled={loading || missingLocation || !isFormComplete}
                                            className="w-full bg-primary-900 hover:bg-primary-800 text-white py-4 rounded-full text-base font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary-900/20"
                                        >
                                            {loading ? 'Processing...' : 'Confirm Booking'} 
                                            <span className="ml-2">→</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* RIGHT Panel (Desktop Only) */}
                        <div className="hidden lg:flex w-[380px] border-l border-gray-100 bg-white flex-col p-8 shrink-0">
                             <div className="sticky top-0">
                                <ServiceSummary />
                                <div className="mt-6">
                                    <button
                                        type="button"
                                        onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
                                        disabled={loading || missingLocation || !isFormComplete}
                                        className="w-full bg-primary-900 hover:bg-primary-800 text-white py-4 rounded-full text-base font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary-900/20"
                                    >
                                        {loading ? 'Processing...' : 'Confirm Booking'} 
                                        <span className="ml-2">→</span>
                                    </button>
                                    
                                     {!isFormComplete && (
                                        <p className="text-xs text-amber-600 mt-3 text-center font-medium opacity-80">
                                            Please complete all required fields
                                        </p>
                                    )}
                                </div>
                             </div>
                        </div>

                    </div>
                </motion.div>
            </motion.div>

            {/* Child Profile Modal */}
            <ChildProfileModal
                isOpen={isAddChildModalOpen}
                onClose={() => setIsAddChildModalOpen(false)}
                onSave={handleChildSave}
            />

            {/* Service info Modal */}
            <ServiceInfoModal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
                category="Child Care"
            />
        </>
    );
}
