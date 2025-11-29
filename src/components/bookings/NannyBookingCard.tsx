import React from 'react';
import Image from 'next/image';
import { Star, MessageCircle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/types/api';

interface NannyBookingCardProps {
    nanny: User;
    selectedDate?: string;
    selectedTime?: string;
    duration?: string;
    onMessage?: () => void;
}

export const NannyBookingCard: React.FC<NannyBookingCardProps> = ({
    nanny,
    selectedDate,
    selectedTime,
    duration,
    onMessage
}) => {
    const { profiles, nanny_details } = nanny;
    const fullName = `${profiles?.first_name} ${profiles?.last_name}`;
    const rating = 4.9; // Mock rating if not available
    const hourlyRate = nanny_details?.hourly_rate || 0;

    return (
        <div className="bg-white rounded-[32px] p-6 shadow-xl border border-neutral-100 sticky top-24">
            {/* Header with Image and Contact */}
            <div className="relative mb-6">
                <div className="h-24 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl mb-8"></div>
                <div className="absolute top-12 left-4 flex justify-between items-end w-full pr-8">
                    <div className="relative w-20 h-20 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-white">
                        <Image
                            src={profiles?.profile_image_url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"}
                            alt={fullName}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <Button
                        size="sm"
                        className="bg-white text-neutral-900 hover:bg-neutral-50 border border-neutral-200 shadow-sm rounded-xl mb-2"
                        onClick={onMessage}
                    >
                        Contact
                    </Button>
                </div>
            </div>

            {/* Info */}
            <div className="mb-6">
                <div className="flex justify-between items-start mb-1">
                    <h2 className="text-xl font-bold text-neutral-900">{fullName}</h2>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-yellow-700">{rating}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-neutral-500 text-sm mb-4">
                    <MapPin size={14} />
                    {profiles?.address || 'Location hidden'}
                </div>
                <div className="text-2xl font-bold text-primary">
                    ₹{hourlyRate}<span className="text-sm text-neutral-500 font-normal">/hr</span>
                </div>
            </div>

            {/* Selected Slot Summary */}
            {(selectedDate || selectedTime) && (
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-primary font-bold">
                            {new Date(selectedDate || Date.now()).getDate()}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-900">
                                {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select date'}
                            </p>
                            <p className="text-xs text-primary font-medium">
                                {selectedTime ? `${selectedTime} ${duration ? `(${duration} hrs)` : ''}` : 'Select time'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
