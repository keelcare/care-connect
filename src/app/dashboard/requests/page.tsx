"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { ServiceRequest } from '@/types/api';
import styles from './page.module.css';

export default function RequestsPage() {
    const { user, loading: authLoading } = useAuth();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequests = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const data = await api.requests.getParentRequests(user.id);
                setRequests(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load requests');
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user) {
            fetchRequests();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 font-display">My Requests</h1>
                </div>
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 font-display">My Requests</h1>
                </div>
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
                    <p className="text-red-600 mb-4">Please log in to view your requests.</p>
                    <Link href="/auth/login">
                        <Button>Log In</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusBadgeStyles = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-700';
            case 'ASSIGNED': return 'bg-blue-100 text-blue-700';
            case 'ACCEPTED': return 'bg-green-100 text-green-700';
            case 'IN_PROGRESS': return 'bg-purple-100 text-purple-700';
            case 'COMPLETED': return 'bg-neutral-100 text-neutral-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-neutral-100 text-neutral-700';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 font-display">My Requests</h1>
                    <p className="text-neutral-500 mt-1">Manage your service requests and bookings</p>
                </div>
                <Link href="/dashboard/requests/create">
                    <Button className="rounded-full px-6 shadow-lg hover:shadow-xl transition-all">
                        <Plus size={18} className="mr-2" /> New Request
                    </Button>
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-600">
                    {error}
                </div>
            )}

            {requests.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-[24px] border border-neutral-100 shadow-soft">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <Plus size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">No Requests Yet</h3>
                    <p className="text-neutral-500 mb-6 max-w-md mx-auto">You haven't created any service requests yet. Create one now to find the perfect caregiver.</p>
                    <Link href="/dashboard/requests/create">
                        <Button className="rounded-xl">
                            Create Your First Request
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((request) => (
                        <Link href={`/dashboard/requests/${request.id}`} key={request.id} className="group block bg-white rounded-[24px] border border-neutral-100 shadow-soft hover:shadow-md transition-all duration-200 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${getStatusBadgeStyles(request.status)}`}>
                                        {request.status.replace('_', ' ')}
                                    </span>
                                    <span className="text-xs text-neutral-400 font-medium">
                                        {new Date(request.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-neutral-900 mb-4 group-hover:text-primary transition-colors">
                                    {request.title || 'Service Request'}
                                </h3>

                                <div className="space-y-3 text-sm text-neutral-600">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                                            <Calendar size={16} />
                                        </div>
                                        <span>{new Date(request.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                                            <Clock size={16} />
                                        </div>
                                        <span>{request.startTime} ({request.durationHours} hrs)</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
                                            <MapPin size={16} />
                                        </div>
                                        <span className="truncate">{request.location.address}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                                <span className="text-sm font-medium text-neutral-600">
                                    {request.numChildren} Child{request.numChildren !== 1 ? 'ren' : ''}
                                </span>
                                <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-400 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
