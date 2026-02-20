'use client';



import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BookingInterface } from '@/components/bookings/BookingInterface';
import { api } from '@/lib/api';
import { User } from '@/types/api';
import { useToast } from '@/components/ui/ToastProvider';
import { useAuth } from '@/context/AuthContext';
import ParentLayout from '@/components/layout/ParentLayout';
import { Button } from '@/components/ui/button';

/*
export default function DirectBookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [nanny, setNanny] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    duration: '',
    numChildren: '',
    specialRequirements: '',
    serviceType: '', // Not used for direct booking but kept for compatibility
  });

  useEffect(() => {
    const fetchNanny = async () => {
      if (!params.nannyId) return;
      try {
        const id = Array.isArray(params.nannyId)
          ? params.nannyId[0]
          : params.nannyId;
        const data = await api.users.get(id);
        setNanny(data);
      } catch (error) {
        console.error('Failed to fetch nanny:', error);
        addToast({ message: 'Failed to load nanny details', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchNanny();
  }, [params.nannyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push(
        '/auth/login?redirect=' + encodeURIComponent(window.location.pathname)
      );
      return;
    }

    if (!nanny) return;

    setSubmitting(true);
    try {
      if (!formData.numChildren || Number(formData.numChildren) < 1) {
        addToast({
          message: 'Please specify the number of children',
          type: 'error',
        });
        setSubmitting(false);
        return;
      }

      // Calculate end time
      const [hours, minutes] = formData.startTime.split(':').map(Number);
      const startDate = new Date(formData.date);
      startDate.setHours(hours, minutes, 0, 0);
      const endDate = new Date(
        startDate.getTime() + Number(formData.duration) * 60 * 60 * 1000
      );
      const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

      const payload = {
        nannyId: nanny.id,
        date: formData.date,
        startTime: formData.startTime,
        endTime: endTime,
        numChildren: Number(formData.numChildren),
        notes: formData.specialRequirements || undefined,
      };

      await api.bookings.create(payload);
      addToast({
        message: `Booking request sent to ${nanny.profiles?.first_name}!`,
        type: 'success',
      });
      router.push('/bookings');
    } catch (error: any) {
      console.error('Booking failed:', error);
      addToast({
        message: error.message || 'Failed to create booking',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ParentLayout>
        <div className="flex items-center justify-center min-h-dvh bg-stone-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900"></div>
        </div>
      </ParentLayout>
    );
  }

  if (!nanny) {
    return (
      <ParentLayout>
        <div className="flex flex-col items-center justify-center min-h-dvh bg-stone-50">
          <h2 className="text-xl font-bold text-stone-900">Nanny not found</h2>
          <Button
            onClick={() => router.push('/browse')}
            className="mt-4 bg-primary-900 hover:bg-primary-800 rounded-xl"
          >
            Browse Caregivers
          </Button>
        </div>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <BookingInterface
        nanny={nanny}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        loading={submitting}
        title={`Book ${nanny.profiles?.first_name}`}
      />
    </ParentLayout>
  );
}
*/

export default function DirectBookingPage() {
  return (
    <ParentLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-stone-50 px-4 text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Direct Booking Disabled</h2>
        <p className="text-stone-500 mb-8 max-w-md">
          Direct booking is currently unavailable. Please use our matching service to find the best caregiver for your needs.
        </p>
       
      </div>
    </ParentLayout>
  );
}
