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
  rating?: number | string;
  reviewCount?: number;
}

export const NannyBookingCard: React.FC<NannyBookingCardProps> = ({
  nanny,
  selectedDate,
  selectedTime,
  duration,
  onMessage,
  rating = 'New',
  reviewCount,
}) => {
  const { profiles, nanny_details } = nanny;
  const fullName = `${profiles?.first_name} ${profiles?.last_name}`;
  const hourlyRate = nanny_details?.hourly_rate || 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl shadow-stone-200/50 border border-stone-100 sticky top-24">
      {/* Header with Image and Contact */}
      <div className="relative mb-6">
        <div className="h-24 bg-gradient-to-r from-stone-200 to-amber-100 rounded-xl mb-8"></div>
        <div className="absolute top-12 left-4 flex justify-between items-end w-full pr-8">
          <div className="relative w-20 h-20 rounded-xl border-4 border-white shadow-md overflow-hidden bg-white">
            <Image
              src={
                profiles?.profile_image_url ||
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
              }
              alt={fullName}
              fill
              className="object-cover"
            />
          </div>
          <Button
            size="sm"
            className="bg-white text-stone-900 hover:bg-stone-50 border border-stone-200 shadow-sm rounded-xl mb-2"
            onClick={onMessage}
          >
            Contact
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-1">
          <h2 className="text-xl font-bold text-stone-900">{fullName}</h2>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
            <Star size={14} className="text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-amber-700">{rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-stone-500 text-sm mb-4">
          <MapPin size={14} />
          {profiles?.address || 'Location hidden'}
        </div>
        <div className="text-2xl font-bold text-stone-900">
          ₹{hourlyRate}
          <span className="text-sm text-stone-500 font-normal">/hr</span>
        </div>
      </div>

      {/* Selected Slot Summary */}
      {(selectedDate || selectedTime) && (
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-stone-900 font-bold border border-stone-200">
              {new Date(selectedDate || Date.now()).getDate()}
            </div>
            <div>
              <p className="text-sm font-medium text-stone-900">
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Select date'}
              </p>
              <p className="text-xs text-stone-600 font-medium">
                {selectedTime
                  ? `${selectedTime} ${duration ? `(${duration} hrs)` : ''}`
                  : 'Select time'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
