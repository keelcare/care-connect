'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { RecurringServiceRequest, Booking } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { ArrowLeft, User } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { NannyAssignmentModal } from '@/components/admin/NannyAssignmentModal';
import { AdminPageHeader, SectionCard, StatusBadge, BadgeTone } from '@/components/admin/ui';
import { logger } from '@/lib/logger';

const STATUS_TONE: Record<string, BadgeTone> = {
  CONFIRMED: 'success',
  IN_PROGRESS: 'info',
  COMPLETED: 'neutral',
  CANCELLED: 'danger',
};

export default function RecurringRequestDetailPage({ params }: { params: { id: string } }) {
    const { user } = useAuth();
    const { addToast } = useToast();
    const router = useRouter();
    const [request, setRequest] = useState<RecurringServiceRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }
        if (user && params.id) {
            fetchRequestDetails();
        }
    }, [user, params.id]);

    const fetchRequestDetails = async () => {
        setLoading(true);
        try {
            const data = await api.recurringRequests.get(params.id);
            setRequest(data);
        } catch (error) {
            logger.error('Failed to fetch recurring request details:', error);
            addToast({ type: 'error', message: 'Failed to load details' });
        } finally {
            setLoading(false);
        }
    };

    const handleAssignClick = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
    };

    if (loading || !request) {
        return (
            <div className="h-[calc(100vh-120px)] flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    // Construct mock AdminManualRequest to pass to the NannyAssignmentModal
    // The NannyAssignmentModal will use the booking.id for assignments.
    const mockRequestForAssignment = selectedBooking ? {
        id: selectedBooking.id, // we pass bookingId as id so modal uses it
        category: request.category,
        date: selectedBooking.start_time, // Use booking's actual date
        start_time: selectedBooking.start_time,
        duration_hours: request.duration_hours.toString(),
        status: selectedBooking.status,
        address: 'Saved Location', // Address might be needed from parent
        parent_name: request.parent?.profiles?.first_name || request.parent?.email || 'Parent',
        children_count: request.num_children,
        children_names: 'Children',
        special_requirements: '',
        location_lat: 0,
        location_lng: 0,
        isBookingId: true // flag to tell modal this is a bookingId
    } : null;

    return (
        <div className="max-w-6xl mx-auto">
            <button
                onClick={() => router.push('/admin/recurring-requests')}
                className="flex items-center gap-2 text-neutral-500 hover:text-primary-600 transition-colors mb-4 text-sm font-medium"
            >
                <ArrowLeft size={16} /> Back to Recurring Requests
            </button>

            <AdminPageHeader
                eyebrow={`Plan #${request.id.slice(0, 8)}`}
                title="Monthly Plan Details"
                subtitle="Review the schedule and assign caregivers to each generated booking."
            />

            <SectionCard bodyClassName="p-6 lg:p-8" className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <p className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">Recurrence</p>
                        <div className="text-neutral-900 font-semibold capitalize text-lg">{request.recurrence_type.replace('_', ' ')}</div>
                        <div className="text-neutral-500 text-sm">Starts {formatDate(request.start_date)}</div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">Schedule</p>
                        <div className="text-neutral-900 font-semibold text-lg">{request.start_time}</div>
                        <div className="text-neutral-500 text-sm">{request.duration_hours} hours per session</div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">Parent</p>
                        <div className="text-neutral-900 font-semibold text-lg truncate">{request.parent?.email || 'N/A'}</div>
                        <div className="text-neutral-500 text-sm">{request.num_children} {request.num_children === 1 ? 'Child' : 'Children'}</div>
                    </div>
                </div>
            </SectionCard>

            <div className="space-y-4">
                <h2 className="font-display text-xl font-bold text-primary-900">
                    Generated Bookings ({request.bookings?.length || 0})
                </h2>

                <div className="grid grid-cols-1 gap-4">
                    {request.bookings?.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-[24px] border border-neutral-100 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-soft hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold font-display">
                                    {new Date(booking.start_time).getDate()}
                                </div>
                                <div>
                                    <div className="font-bold text-neutral-900 text-lg">
                                        {booking.start_time_formatted || formatDate(booking.start_time)}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <StatusBadge tone={STATUS_TONE[booking.status?.toUpperCase()] ?? 'warning'}>
                                            {booking.status}
                                        </StatusBadge>
                                        {booking.nanny && (
                                            <span className="text-sm text-neutral-600 flex items-center gap-1">
                                                <User size={14} /> {booking.nanny.profiles?.first_name || booking.nanny.email}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant={booking.status === 'CONFIRMED' ? 'outline' : 'default'}
                                onClick={() => handleAssignClick(booking)}
                                className="rounded-xl"
                            >
                                {booking.status === 'CONFIRMED' ? 'Reassign Nanny' : 'Assign Nanny'}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <NannyAssignmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                request={mockRequestForAssignment as any}
                onAssigned={fetchRequestDetails}
            />
        </div>
    );
}
