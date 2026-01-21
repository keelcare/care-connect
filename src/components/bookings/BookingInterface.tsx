import React from 'react';
import { NannyBookingCard } from './NannyBookingCard';
import { BookingForm } from './BookingForm';
import { User } from '@/types/api';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface BookingInterfaceProps {
  nanny?: User | null;
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  title?: string;
}

export const BookingInterface: React.FC<BookingInterfaceProps> = ({
  nanny,
  formData,
  setFormData,
  onSubmit,
  loading,
  title = 'Book a Service',
}) => {
  const router = useRouter();
  const isDirectBooking = !!nanny;

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4 -ml-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100"
            onClick={() => router.back()}
          >
            <ChevronLeft size={20} className="mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-stone-900">{title}</h1>
          <p className="text-stone-500 mt-1">
            Fill in the details to complete your booking
          </p>
        </div>

        <div
          className={`grid gap-8 ${isDirectBooking ? 'lg:grid-cols-12' : 'max-w-3xl mx-auto'}`}
        >
          {/* Left Column - Nanny Card (Only for Direct Booking) */}
          {isDirectBooking && (
            <div className="lg:col-span-4">
              <NannyBookingCard
                nanny={nanny}
                selectedDate={formData.date}
                selectedTime={formData.startTime}
                duration={formData.duration}
              />
            </div>
          )}

          {/* Right Column - Booking Form */}
          <div className={isDirectBooking ? 'lg:col-span-8' : 'w-full'}>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl shadow-stone-200/50 border border-stone-100">
              <BookingForm
                isAutoAssign={!isDirectBooking}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
                loading={loading}
                hourlyRate={
                  nanny
                    ? parseFloat(nanny.nanny_details?.hourly_rate || '0')
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
