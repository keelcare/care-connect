'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { RecurringServiceRequest, Booking } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Clock, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { NannyAssignmentModal } from '@/components/admin/NannyAssignmentModal';

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
            console.error('Failed to fetch recurring request details:', error);
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

    const getStatusClass = (status: string) => {
        switch (status.toUpperCase()) {
            case 'CONFIRMED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'COMPLETED': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
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
        <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button
                        onClick={() => router.push('/admin/recurring-requests')}
                        className="flex items-center gap-2 text-neutral-500 hover:text-primary-600 transition-colors mb-2 text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Back to Recurring Requests
                    </button>
                    <h1 className="text-3xl font-bold text-primary-900 font-display">
                        Monthly Plan Details
                    </h1>
                    <p className="text-[11px] text-neutral-400 mt-1 font-mono uppercase tracking-tighter">
                        ID: #{request.id}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-neutral-100 shadow-soft p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <p className="text-xs font-bold tracking-wider text-neutral-400 uppercase">Recurrence</p>
                        <div className="text-neutral-900 font-medium capitalize text-lg">
                            {request.recurrence_type.replace('_', ' ')}
                        </div>
                        <div className="text-neutral-500 text-sm">
                            Starts: {formatDate(request.start_date)}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-bold tracking-wider text-neutral-400 uppercase">Schedule</p>
                        <div className="text-neutral-900 font-medium text-lg">
                            {request.start_time}
                        </div>
                        <div className="text-neutral-500 text-sm">
                            {request.duration_hours} hours per session
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-bold tracking-wider text-neutral-400 uppercase">Parent Details</p>
                        <div className="text-neutral-900 font-medium text-lg">
                            {request.parent?.email || 'N/A'}
                        </div>
                        <div className="text-neutral-500 text-sm">
                            {request.num_children} {request.num_children === 1 ? 'Child' : 'Children'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-neutral-900">
                    Generated Bookings ({request.bookings?.length || 0})
                </h2>

                <div className="grid grid-cols-1 gap-4">
                    {request.bookings?.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-2xl border border-neutral-100 p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                    {new Date(booking.start_time).getDate()}
                                </div>
                                <div>
                                    <div className="font-bold text-neutral-900 text-lg">
                                        {formatDate(booking.start_time)}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge className={`${getStatusClass(booking.status)}`}>
                                            {booking.status}
                                        </Badge>
                                        {booking.nanny && (
                                            <span className="text-sm text-neutral-600 flex items-center gap-1">
                                                <User size={14} /> Assigned to: {booking.nanny.profiles?.first_name || booking.nanny.email}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <Button 
                                variant={booking.status === 'CONFIRMED' ? 'outline' : 'default'}
                                onClick={() => handleAssignClick(booking)}
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
