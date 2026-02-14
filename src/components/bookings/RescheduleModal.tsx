'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HorizDial } from '@/components/booking/HorizDial';

interface RescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (date: string, startTime: string, endTime: string) => Promise<void>;
    currentDate: string;
    currentStartTime: string;
    currentEndTime: string;
    serviceType?: string;
}

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Time: 7:00 AM – 9:00 PM in 30-min steps
const START_HOUR = 7;
const END_HOUR = 21;
const STEP_MINS = 30;

function slotToTime24(i: number): string {
    const mins = START_HOUR * 60 + i * STEP_MINS;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function time24ToSlot(time: string): number {
    if (!time) return 8; // Default 11am
    let h, m;
    try {
        if (time.includes('AM') || time.includes('PM')) {
            const [t, ampm] = time.split(' ');
            [h, m] = t.split(':').map(Number);
            if (ampm === 'PM' && h < 12) h += 12;
            if (ampm === 'AM' && h === 12) h = 0;
        } else {
            [h, m] = time.split(':').map(Number);
        }
        const mins = h * 60 + m;
        return Math.max(0, Math.floor((mins - START_HOUR * 60) / STEP_MINS));
    } catch (e) {
        return 8;
    }
}

function getDaysInMonth(y: number, m: number): number {
    return new Date(y, m + 1, 0).getDate();
}

function getFirstDay(y: number, m: number): number {
    return new Date(y, m, 1).getDay();
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    currentDate,
    currentStartTime,
    currentEndTime,
    serviceType = 'Service'
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get current date for calendar constraints
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Initial state based on current booking details
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    // Time and duration state
    const [timeSlot, setTimeSlot] = useState(8);
    const [durationIdx, setDurationIdx] = useState(1); // Default to 4h

    const durationOptions = [
        { label: '2 hours', value: 2 },
        { label: '4 hours', value: 4 },
        { label: '6 hours', value: 6 },
        { label: '8 hours', value: 8 },
        { label: '12 hours', value: 12 },
    ];

    useEffect(() => {
        if (isOpen) {
            try {
                // Robust date parsing with fallback to current date
                let initialDate = new Date();
                if (currentDate) {
                    const parsed = new Date(currentDate);
                    // If date is valid and not in the distant past (1970 case)
                    if (!isNaN(parsed.getTime()) && parsed.getFullYear() > 2000) {
                        initialDate = parsed;
                    }
                }

                setCurrentYear(initialDate.getFullYear());
                setCurrentMonth(initialDate.getMonth());
                setSelectedDate(initialDate.getDate());

                const startSlot = time24ToSlot(currentStartTime);
                setTimeSlot(startSlot);

                const endSlot = time24ToSlot(currentEndTime);
                // Difference in hours
                const diffHours = (endSlot - startSlot) * STEP_MINS / 60;
                // Avoid zero or negative duration in display logic, default to 4h if weird
                const absDiffHours = diffHours > 0 ? diffHours : 4;
                const idx = durationOptions.findIndex(d => d.value === absDiffHours);
                setDurationIdx(idx !== -1 ? idx : 1);
            } catch (e) {
                console.error("Error setting initial reschedule modal state:", e);
                // Hard reset to defaults on error
                const now = new Date();
                setCurrentYear(now.getFullYear());
                setCurrentMonth(now.getMonth());
                setSelectedDate(now.getDate());
            }
        }
    }, [isOpen, currentDate, currentStartTime, currentEndTime]);

    const durationHrs = durationOptions[Math.max(0, Math.min(durationIdx, durationOptions.length - 1))]?.value ?? 2;

    const timeSlots = Array.from({ length: 28 }, (_, i) => {
        const mins = START_HOUR * 60 + i * STEP_MINS;
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        const ampm = h < 12 ? "AM" : "PM";
        const h12 = h % 12 === 0 ? 12 : h % 12;
        const timeString = `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
        const showLabel = i % 4 === 0;
        return {
            value: i,
            display: timeString,
            label: showLabel ? `${h12} ${ampm}` : '',
            mins: mins
        };
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) {
            setError('Please select a date');
            return;
        }
        setError(null);
        setLoading(true);

        try {
            const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}`;
            const startTime = slotToTime24(timeSlot);

            const totalMins = START_HOUR * 60 + timeSlot * STEP_MINS + durationHrs * 60;
            const endH = Math.floor(totalMins / 60) % 24;
            const endM = totalMins % 60;
            const endTime = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;

            await onConfirm(dateStr, startTime, endTime);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reschedule');
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

    const getEndTimeLabel = () => {
        const totalMins = START_HOUR * 60 + timeSlot * STEP_MINS + durationHrs * 60;
        let h = Math.floor(totalMins / 60);
        const nextDay = h >= 24 ? " (Next Day)" : "";
        h = h % 24;
        const m = totalMins % 60;
        const ampm = h < 12 ? "AM" : "PM";
        const h12 = h % 12 === 0 ? 12 : h % 12;
        return `${h12}:${m.toString().padStart(2, "0")} ${ampm}${nextDay}`;
    };

    if (!isOpen) return null;

    const calCells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) calCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) calCells.push(d);

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
            <h3 className="text-sm font-bold text-gray-900 mb-4 font-display text-center uppercase tracking-widest">Reschedule Summary</h3>

            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-full bg-[#E8F2EC] flex items-center justify-center text-xl shadow-inner">
                    🔄
                </div>
                <div>
                    <div className="font-bold text-gray-900 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{serviceType}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Updating Appointment</div>
                </div>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium text-xs">NEW DATE</span>
                    <span className="font-bold text-gray-900">{formattedDate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium text-xs">TIME RANGE</span>
                    <span className="font-bold text-gray-900 text-right">
                        {timeSlots[timeSlot]?.display} - {getEndTimeLabel()}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium text-xs">DURATION</span>
                    <span className="font-bold text-gray-900">{durationHrs} hours</span>
                </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-amber-600 mb-2">
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-bold uppercase">Note</span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed italic">
                    Rescheduling is subject to caregiver availability. Your caregiver will be notified of these changes.
                </p>
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
                className="bg-white sm:rounded-[32px] w-full max-w-5xl h-full sm:h-auto sm:max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col"
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="w-8 h-8 -ml-2 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors sm:hidden">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold font-display text-gray-900">Reschedule</h2>
                    </div>
                    <button onClick={onClose} className="hidden sm:flex w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 items-center justify-center transition-colors text-gray-500">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <form onSubmit={handleSubmit} className="p-6 space-y-8 pb-32 lg:pb-6">
                            <h1 className="text-3xl font-display font-medium text-[#1B3022]">Choose New Timing</h1>

                            {/* Calendar */}
                            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-display font-medium text-xl text-gray-800">
                                        {MONTH_NAMES[currentMonth]} {currentYear}
                                    </span>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={prevMonth} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition">‹</button>
                                        <button type="button" onClick={nextMonth} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition">›</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 mb-2">
                                    {DAYS.map(d => <div key={d} className="text-center text-xs font-bold text-gray-400 py-2">{d}</div>)}
                                </div>
                                <div className="grid grid-cols-7 gap-y-2">
                                    {calCells.map((day, idx) => {
                                        if (!day) return <div key={`e${idx}`} />;
                                        const isSel = day === selectedDate;
                                        const dateObj = new Date(currentYear, currentMonth, day);
                                        const dateToday = new Date();
                                        dateToday.setHours(0, 0, 0, 0);
                                        const isPast = dateObj < dateToday;
                                        return (
                                            <div key={day} className="flex justify-center">
                                                <button
                                                    type="button"
                                                    disabled={isPast}
                                                    onClick={() => !isPast && setSelectedDate(day)}
                                                    className={`w-10 h-10 rounded-full text-sm font-medium transition flex items-center justify-center ${isPast ? 'text-gray-300 cursor-not-allowed' : isSel ? 'bg-[#3d6b55] text-white shadow-md shadow-[#3d6b55]/20' : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {day}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div>
                                <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">New Start Time</div>
                                <div className="py-2">
                                    <HorizDial
                                        label="START TIME"
                                        ticks={timeSlots}
                                        current={timeSlot}
                                        onChange={(val) => setTimeSlot(val)}
                                    />
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <div className="text-xs font-bold tracking-wider text-gray-400 mb-4 uppercase">New Duration</div>
                                <div className="py-2">
                                    <HorizDial
                                        label="DURATION"
                                        ticks={durationOptions.map((opt, i) => ({
                                            value: i,
                                            label: opt.value + 'h',
                                            display: opt.label,
                                        }))}
                                        current={durationIdx}
                                        onChange={(idx) => setDurationIdx(idx)}
                                        accent="#6b5b3d"
                                    />
                                </div>
                            </div>

                            {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100">{error}</div>}

                            <div className="lg:hidden mt-8 pt-8 border-t border-gray-100">
                                <ServiceSummary />
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        disabled={loading || !selectedDate}
                                        className="w-full bg-[#1B3022] hover:bg-[#15231b] text-white py-4 rounded-full text-base font-bold transition-all disabled:opacity-50 shadow-xl shadow-[#1B3022]/20"
                                    >
                                        {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="hidden lg:flex w-[380px] border-l border-gray-100 bg-white flex-col p-8 shrink-0">
                        <div className="sticky top-0">
                            <ServiceSummary />
                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
                                    disabled={loading || !selectedDate}
                                    className="w-full bg-[#1B3022] hover:bg-[#15231b] text-white py-4 rounded-full text-base font-bold transition-all disabled:opacity-50 shadow-xl shadow-[#1B3022]/20"
                                >
                                    {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
