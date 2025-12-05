import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, ChevronLeft, ChevronRight, Check, Baby, Heart, Home, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

interface BookingFormProps {
    isAutoAssign: boolean;
    formData: any;
    setFormData: (data: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    hourlyRate?: number;
}

const SERVICE_TYPES = [
    { id: 'child-care', label: 'Child Care', icon: Baby, color: 'bg-amber-100 text-amber-700' },
    { id: 'senior-care', label: 'Senior Care', icon: Heart, color: 'bg-rose-100 text-rose-700' },
    { id: 'housekeeping', label: 'Housekeeping', icon: Home, color: 'bg-stone-200 text-stone-700' },
    { id: 'tutoring', label: 'Tutoring', icon: GraduationCap, color: 'bg-stone-300 text-stone-800' },
];

const TIME_SLOTS = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

const DURATION_OPTIONS = [
    { value: '2', label: '2 hours' },
    { value: '4', label: '4 hours' },
    { value: '6', label: '6 hours' },
    { value: '8', label: '8 hours (Full day)' },
    { value: '12', label: '12 hours' },
];

export const BookingForm: React.FC<BookingFormProps> = ({
    isAutoAssign,
    formData,
    setFormData,
    onSubmit,
    loading,
    hourlyRate
}) => {
    const [weekOffset, setWeekOffset] = useState(0);
    const [dates, setDates] = useState<Date[]>([]);

    useEffect(() => {
        const today = new Date();
        const nextDays = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i + (weekOffset * 7));
            nextDays.push(date);
        }
        setDates(nextDays);
    }, [weekOffset]);

    const handleDateSelect = (date: Date) => {
        setFormData({ ...formData, date: date.toISOString().split('T')[0] });
    };

    const handleTimeSelect = (time: string) => {
        setFormData({ ...formData, startTime: time });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleServiceSelect = (serviceId: string) => {
        setFormData({ ...formData, serviceType: serviceId });
    };

    const estimatedCost = formData.duration && hourlyRate
        ? (Number(formData.duration) * hourlyRate).toFixed(2)
        : null;

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            {/* Service Selection (Only for Auto Assign) */}
            {isAutoAssign && (
                <div>
                    <h3 className="text-lg font-bold text-stone-900 mb-4">Select Service</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {SERVICE_TYPES.map((service) => {
                            const Icon = service.icon;
                            const isSelected = formData.serviceType === service.id;
                            return (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => handleServiceSelect(service.id)}
                                    className={`flex flex-col items-center min-w-[100px] p-4 rounded-xl border-2 transition-all ${isSelected
                                        ? 'border-stone-900 bg-stone-50'
                                        : 'border-stone-100 hover:border-stone-300 bg-white'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center mb-2`}>
                                        <Icon size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-stone-900 whitespace-nowrap">{service.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Date Selection */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-stone-900">Choose a Date</h3>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
                            disabled={weekOffset === 0}
                            className="h-8 w-8 p-0 rounded-full border-stone-200 hover:bg-stone-100"
                        >
                            <ChevronLeft size={16} />
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setWeekOffset(prev => prev + 1)}
                            className="h-8 w-8 p-0 rounded-full border-stone-200 hover:bg-stone-100"
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
                <div className="bg-stone-100 rounded-2xl p-4">
                    <div className="grid grid-cols-7 gap-2">
                        {dates.map((date, index) => {
                            const isSelected = formData.date === date.toISOString().split('T')[0];
                            const isToday = new Date().toDateString() === date.toDateString();

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleDateSelect(date)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${isSelected
                                        ? 'bg-emerald-600 shadow-md text-white'
                                        : 'hover:bg-white hover:shadow-sm text-stone-600'
                                        }`}
                                >
                                    <span className="text-xs font-medium mb-1 opacity-70">
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </span>
                                    <span className={`text-lg font-bold ${isToday && !isSelected ? 'text-amber-600' : ''}`}>
                                        {date.getDate()}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Time Selection */}
            <div>
                <h3 className="text-lg font-bold text-stone-900 mb-4">Choose Start Time</h3>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {TIME_SLOTS.map((time) => {
                        const isSelected = formData.startTime === time;
                        
                        // Check if slot is in the past or within 15 mins
                        const selectedDate = new Date(formData.date);
                        const today = new Date();
                        const isToday = selectedDate.toDateString() === today.toDateString();

                        if (isToday) {
                            const [slotHours, slotMinutes] = time.split(':').map(Number);
                            const now = new Date();
                            const slotTime = new Date();
                            slotTime.setHours(slotHours, slotMinutes || 0, 0, 0);
                            
                            // Add 15 minutes buffer to current time
                            const bufferTime = new Date(now.getTime() + 15 * 60000);
                            
                            if (slotTime <= bufferTime) return null;
                        }

                        return (
                            <button
                                key={time}
                                type="button"
                                onClick={() => handleTimeSelect(time)}
                                className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all ${isSelected
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                                    : 'bg-white border-stone-200 text-stone-700 hover:border-stone-400'
                                    }`}
                            >
                                {time}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Duration & Children */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-stone-900 mb-2">Duration</label>
                    <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all bg-white text-stone-900"
                    >
                        <option value="">Select duration</option>
                        {DURATION_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-stone-900 mb-2">Number of Children</label>
                    <Input
                        type="number"
                        name="numChildren"
                        min="1"
                        value={formData.numChildren}
                        onChange={handleChange}
                        required
                        className="w-full"
                        placeholder="e.g. 2"
                    />
                </div>
            </div>

            {/* Special Requirements */}
            <div>
                <label className="block text-sm font-bold text-stone-900 mb-2">Special Requirements</label>
                <textarea
                    name="specialRequirements"
                    value={formData.specialRequirements}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all resize-none text-stone-900 placeholder:text-stone-400"
                    rows={3}
                    placeholder="Any allergies, specific instructions, etc."
                />
            </div>

            {/* Summary & Submit */}
            <div className="bg-stone-100 rounded-2xl p-6 border border-stone-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm text-stone-500">Total Estimated</p>
                        <p className="text-2xl font-bold text-stone-900">
                            {estimatedCost ? `₹${estimatedCost}` : '---'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-stone-500">
                            {formData.duration ? `${formData.duration} hours` : '0 hours'}
                        </p>
                        <p className="text-sm text-stone-500">
                            {hourlyRate ? `₹${hourlyRate}/hr` : 'Rate varies'}
                        </p>
                    </div>
                </div>
                <Button
                    type="submit"
                    disabled={loading || !formData.date || !formData.startTime || !formData.duration || !formData.numChildren}
                    className="w-full h-12 text-lg rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-stone-300/50 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                </Button>
            </div>
        </form>
    );
};
