'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { ServiceRequest } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Filter, Calendar, MapPin, User, Clock, ChevronRight } from 'lucide-react';
import { NannyAssignmentModal } from '@/components/admin/NannyAssignmentModal';
import { useToast } from '@/components/ui/ToastProvider';

export default function ManualAssignmentPage() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const router = useRouter();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }
        fetchPendingRequests();
    }, [user]);

    const fetchPendingRequests = async () => {
        setLoading(true);
        try {
            const data = await api.admin.manualAssignment.getRequests();
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
            addToast({ type: 'error', message: 'Failed to load pending requests' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAssignModal = (request: ServiceRequest) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const filteredRequests = requests.filter(req =>
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.location?.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && requests.length === 0) {
        return (
            <div className="h-[calc(100vh-120px)] flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    const formatTime = (timeInput: string) => {
        if (!timeInput) return '—';
        try {
            if (timeInput.includes('T')) {
                const date = new Date(timeInput);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    });
                }
            }
            if (timeInput.includes(':')) {
                const parts = timeInput.split(':');
                let h = parseInt(parts[0], 10);
                let m = parseInt(parts[1], 10);
                if (!isNaN(h) && !isNaN(m)) {
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    const h12 = h % 12 || 12;
                    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
                }
            }
            return timeInput;
        } catch (e) {
            return timeInput;
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(undefined, {
                weekday: 'short',
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
                        Manual Assignment
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        Manage Shadow Teacher and Special Needs assignments
                    </p>
                </div>

                <div className="bg-white p-2 rounded-2xl border border-neutral-100 shadow-soft flex items-center gap-3 w-full md:w-auto max-w-md">
                    <div className="pl-3 text-neutral-400">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by ID or location..."
                        className="bg-transparent border-none outline-none text-neutral-700 py-2 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-neutral-900">
                        Pending Requests ({filteredRequests.length})
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={fetchPendingRequests}
                        className="text-primary-600"
                    >
                        Refresh List
                    </Button>
                </div>

                {filteredRequests.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredRequests.map((request) => (
                            <div
                                key={request.id}
                                className="bg-white rounded-3xl border border-neutral-100 shadow-soft hover:shadow-hover transition-all overflow-hidden group border-l-4 border-l-primary-500"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
                                        {/* Request Type & Icon */}
                                        <div className="flex-shrink-0 flex items-center gap-4 lg:border-r border-neutral-100 lg:pr-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${request.category === 'ST' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                {request.category === 'ST' ? <Clock size={28} /> : <User size={28} />}
                                            </div>
                                            <div>
                                                <Badge className={`${request.category === 'ST' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                                                    }`}>
                                                    {request.category === 'ST' ? 'Shadow Teacher' : 'Special Needs'}
                                                </Badge>
                                                <p className="text-[11px] text-neutral-400 mt-1 font-mono uppercase tracking-tighter">
                                                    ID: #{request.id.slice(0, 8)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">Schedule</p>
                                                <div className="flex items-center gap-2 text-neutral-700 font-medium">
                                                    <Calendar size={16} className="text-neutral-300" />
                                                    {formatDate(request.date)}
                                                </div>
                                                <div className="flex items-center gap-2 text-neutral-500 text-sm">
                                                    <Clock size={16} className="text-neutral-300" />
                                                    {formatTime(request.start_time)} • {request.duration_hours}h
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">Location</p>
                                                <div className="flex items-start gap-2 text-neutral-700 font-medium">
                                                    <MapPin size={16} className="text-neutral-300 mt-1 shrink-0" />
                                                    <span className="line-clamp-2">{request.location?.address}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">Parent / Child</p>
                                                <div className="flex items-center gap-2 text-neutral-700 font-medium">
                                                    <User size={16} className="text-neutral-300" />
                                                    {request.parent?.profiles?.first_name} {request.parent?.profiles?.last_name}
                                                </div>
                                                <div className="text-neutral-500 text-sm pl-6">
                                                    {request.num_children} {request.num_children === 1 ? 'Child' : 'Children'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="flex-shrink-0 pt-4 lg:pt-0 lg:pl-6">
                                            <Button
                                                onClick={() => handleOpenAssignModal(request)}
                                                className="w-full lg:w-auto rounded-xl px-8 shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                                            >
                                                Find Nanny
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
                            <Clock size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-900">No pending assignments</h3>
                        <p className="text-neutral-500 mt-2 max-w-sm mx-auto">
                            All Shadow Teacher and Special Needs requests have been handled. New requests will appear here.
                        </p>
                    </div>
                )}
            </div>

            <NannyAssignmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                request={selectedRequest}
                onAssigned={fetchPendingRequests}
            />
        </div>
    );
}
