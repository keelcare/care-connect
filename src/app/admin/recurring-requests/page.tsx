'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { RecurringServiceRequest } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Clock, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

export default function RecurringRequestsPage() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const router = useRouter();
    const [requests, setRequests] = useState<RecurringServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }
        if (user) {
            fetchRequests();
        }
    }, [user]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await api.recurringRequests.getAllAdmin();
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch recurring requests:', error);
            addToast({ type: 'error', message: 'Failed to load recurring requests' });
        } finally {
            setLoading(false);
        }
    };

    if (loading && requests.length === 0) {
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
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button
                        onClick={() => router.push('/admin')}
                        className="flex items-center gap-2 text-neutral-500 hover:text-primary-600 transition-colors mb-2 text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-primary-900 font-display">
                        Recurring Requests
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        Manage monthly plans and assign nannies to specific dates
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-neutral-900">
                        All Recurring Requests ({requests.length})
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={fetchRequests}
                        className="text-primary-600"
                    >
                        Refresh List
                    </Button>
                </div>

                {requests.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {requests.map((request) => (
                            <div
                                key={request.id}
                                className="bg-white rounded-3xl border border-neutral-100 shadow-soft hover:shadow-hover transition-all overflow-hidden group border-l-4 border-l-primary-500"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
                                        <div className="flex-shrink-0 flex items-center gap-4 lg:border-r border-neutral-100 lg:pr-6">
                                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600">
                                                <Calendar size={28} />
                                            </div>
                                            <div>
                                                <Badge className="bg-blue-50 text-blue-700 border-blue-100">
                                                    Monthly Plan
                                                </Badge>
                                                <p className="text-[11px] text-neutral-400 mt-1 font-mono uppercase tracking-tighter">
                                                    ID: #{request.id.slice(0, 8)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">Recurrence</p>
                                                <div className="flex items-center gap-2 text-neutral-700 font-medium capitalize">
                                                    {request.recurrence_type.replace('_', ' ')}
                                                </div>
                                                <div className="text-neutral-500 text-sm">
                                                    Starts: {formatDate(request.start_date)}
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">Details</p>
                                                <div className="flex items-center gap-2 text-neutral-700 font-medium">
                                                    <Clock size={16} className="text-neutral-300" />
                                                    {request.start_time} • {request.duration_hours}h
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">Parent</p>
                                                <div className="flex items-center gap-2 text-neutral-700 font-medium">
                                                    <User size={16} className="text-neutral-300" />
                                                    {request.parent?.email || 'N/A'}
                                                </div>
                                                <div className="text-neutral-500 text-sm pl-6">
                                                    {request.num_children} {request.num_children === 1 ? 'Child' : 'Children'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex-shrink-0 pt-4 lg:pt-0 lg:pl-6">
                                            <Button
                                                onClick={() => router.push(`/admin/recurring-requests/${request.id}`)}
                                                className="w-full lg:w-auto rounded-xl px-8 shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                                            >
                                                View Bookings
                                                <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[32px] border border-neutral-100 p-20 text-center shadow-soft">
                        <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
                            <Calendar size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900">No recurring requests</h3>
                        <p className="text-neutral-500 mt-2 max-w-sm mx-auto">
                            There are currently no active monthly plans.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
