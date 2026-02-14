'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { AdminCategoryRequest, CategoryRequestStatus } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminCategoryRequestsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState<AdminCategoryRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] =
        useState<CategoryRequestStatus>('pending');
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        if (user) {
            fetchRequests();
        }
    }, [user, statusFilter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await api.admin.getCategoryRequests(statusFilter);
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (!confirm('Are you sure you want to approve this request?')) return;
        setProcessingId(id);
        try {
            await api.admin.approveCategoryRequest(id);
            fetchRequests();
        } catch (error) {
            console.error('Failed to approve request:', error);
            alert('Failed to approve request');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Enter rejection reason (optional):');
        if (reason === null) return;

        setProcessingId(id);
        try {
            await api.admin.rejectCategoryRequest(id, reason);
            fetchRequests();
        } catch (error) {
            console.error('Failed to reject request:', error);
            alert('Failed to reject request');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-6">
            <div className="flex items-center gap-4">
                <Link href="/admin">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft size={16} className="mr-2" /> Back
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-primary-900 font-display">
                    Category Requests
                </h1>
            </div>

            <div className="flex gap-2 border-b border-neutral-200 pb-1">
                {(['pending', 'approved', 'rejected'] as CategoryRequestStatus[]).map(
                    (status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${statusFilter === status
                                    ? 'bg-primary-50 text-primary-900 border-b-2 border-primary-900'
                                    : 'text-neutral-500 hover:text-neutral-900'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    )
                )}
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner />
                </div>
            ) : requests.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <p className="text-neutral-500">No {statusFilter} requests found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex flex-col md:flex-row justify-between gap-6"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-primary-900">
                                        {request.users.profiles?.first_name}{' '}
                                        {request.users.profiles?.last_name}
                                    </h3>
                                    <span className="text-sm text-neutral-500">
                                        ({request.users.email})
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-700 mb-1">
                                        Requested Categories:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {request.requested_categories.map((category) => (
                                            <span
                                                key={category}
                                                className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs font-medium"
                                            >
                                                {category}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-neutral-400">
                                    Submitted on {new Date(request.created_at).toLocaleDateString()}
                                </p>
                                {request.admin_notes && (
                                    <p className="text-sm text-neutral-600 bg-neutral-50 p-2 rounded">
                                        <span className="font-semibold">Note:</span> {request.admin_notes}
                                    </p>
                                )}
                            </div>

                            {request.status === 'pending' && (
                                <div className="flex items-start gap-3">
                                    <Button
                                        onClick={() => handleApprove(request.id)}
                                        disabled={!!processingId}
                                        isLoading={processingId === request.id}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle size={16} className="mr-2" /> Approve
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleReject(request.id)}
                                        disabled={!!processingId}
                                        className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                        <XCircle size={16} className="mr-2" /> Reject
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
