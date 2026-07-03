'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { AdminCategoryRequest, CategoryRequestStatus } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { CheckCircle, XCircle, Tags } from 'lucide-react';
import {
  AdminPageHeader,
  SectionCard,
  StatusBadge,
  BadgeTone,
  EmptyState,
} from '@/components/admin/ui';
import { logger } from '@/lib/logger';

const STATUS_TONE: Record<CategoryRequestStatus, BadgeTone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

export default function AdminCategoryRequestsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<AdminCategoryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<CategoryRequestStatus>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    if (user) fetchRequests();
  }, [user, statusFilter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await api.admin.getCategoryRequests(statusFilter);
      setRequests(data);
    } catch (error) {
      logger.error('Failed to fetch requests:', error);
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
    } catch {
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
    } catch {
      alert('Failed to reject request');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <AdminPageHeader
        eyebrow="Moderation"
        title="Category Requests"
        subtitle="Approve or reject caregiver requests to change their care categories."
        icon={Tags}
      />

      <div className="flex flex-wrap gap-1.5 mb-6">
        {(['pending', 'approved', 'rejected'] as CategoryRequestStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
              statusFilter === status
                ? 'bg-primary-900 text-white'
                : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : requests.length === 0 ? (
        <SectionCard bodyClassName="p-0">
          <EmptyState icon={Tags} title={`No ${statusFilter} requests`} description="There's nothing to review here right now." />
        </SectionCard>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-soft flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-3 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-primary-900 font-display">
                    {request.users.profiles?.first_name} {request.users.profiles?.last_name}
                  </h3>
                  <span className="text-sm text-neutral-400">{request.users.email}</span>
                  <StatusBadge tone={STATUS_TONE[request.status as CategoryRequestStatus] ?? 'neutral'}>
                    {request.status}
                  </StatusBadge>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-1.5">
                    Requested categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {request.requested_categories.map((category) => (
                      <span key={category} className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-neutral-400">
                  Submitted {new Date(request.created_at).toLocaleDateString()}
                </p>
                {request.admin_notes && (
                  <p className="text-sm text-neutral-600 bg-neutral-50 border border-neutral-100 p-3 rounded-xl">
                    <span className="font-semibold">Note:</span> {request.admin_notes}
                  </p>
                )}
              </div>

              {request.status === 'pending' && (
                <div className="flex items-start gap-3 shrink-0">
                  <Button
                    onClick={() => handleApprove(request.id)}
                    disabled={!!processingId}
                    isLoading={processingId === request.id}
                    className="bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                  >
                    <CheckCircle size={16} className="mr-2" /> Approve
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReject(request.id)}
                    disabled={!!processingId}
                    className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl"
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
