'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileCard } from '@/components/features/ProfileCard';
import { CancellationModal } from '@/components/ui/CancellationModal';
import { api } from '@/lib/api';
import { ServiceRequest, User } from '@/types/api';
import styles from './page.module.css';

export default function RequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [assignedNanny, setAssignedNanny] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const data = await api.requests.get(id);
        setRequest(data);

        if (data.nanny_id) {
          const nanny = await api.users.get(data.nanny_id);
          setAssignedNanny(nanny);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load request details');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [params.id]);

  const handleCancel = async (reason: string) => {
    if (!request) return;

    try {
      setCancelling(true);
      await api.requests.cancel(request.id, reason);
      // Refresh data
      const updated = await api.requests.get(request.id);
      setRequest(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to cancel request');
      throw err; // Re-throw so the modal knows it failed
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">
            Request Details
          </h1>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">
            Request Details
          </h1>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
          <p className="text-red-600 mb-4">{error || 'Request not found'}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          color: 'text-amber-700 bg-amber-100',
          icon: <Clock size={20} />,
          text: 'Pending Assignment',
        };
      case 'ASSIGNED':
        return {
          color: 'text-stone-700 bg-stone-100',
          icon: <CheckCircle size={20} />,
          text: 'Nanny Assigned',
        };
      case 'ACCEPTED':
        return {
          color: 'text-primary-700 bg-primary-100',
          icon: <CheckCircle size={20} />,
          text: 'Booking Confirmed',
        };
      case 'IN_PROGRESS':
        return {
          color: 'text-stone-700 bg-stone-100',
          icon: <Clock size={20} />,
          text: 'Service In Progress',
        };
      case 'COMPLETED':
        return {
          color: 'text-stone-700 bg-stone-100',
          icon: <CheckCircle size={20} />,
          text: 'Completed',
        };
      case 'CANCELLED':
        return {
          color: 'text-red-700 bg-red-100',
          icon: <XCircle size={20} />,
          text: 'Cancelled',
        };
      default:
        return {
          color: 'text-stone-700 bg-stone-100',
          icon: <AlertTriangle size={20} />,
          text: status,
        };
    }
  };

  const statusInfo = getStatusInfo(request.status);

  return (
    <div className="space-y-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="pl-0 hover:bg-transparent hover:text-stone-900"
      >
        <ChevronLeft size={20} className="mr-1" /> Back to Requests
      </Button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 font-display">
            Request Details
          </h1>
          <p className="text-neutral-500 mt-1 font-mono text-sm">
            ID: {request.id}
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-full flex items-center gap-2 font-medium ${statusInfo.color}`}
        >
          {statusInfo.icon}
          <span>{statusInfo.text}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[24px] border border-neutral-100 shadow-soft p-8">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              Service Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-900 flex-shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-500 mb-1">
                    Date
                  </label>
                  <p className="text-neutral-900 font-medium">
                    {new Date(request.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-500 mb-1">
                    Time
                  </label>
                  <p className="text-neutral-900 font-medium">
                    {request.start_time} ({request.duration_hours} hours)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 flex-shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-500 mb-1">
                    Children
                  </label>
                  <p className="text-neutral-900 font-medium">
                    {request.num_children} (Ages:{' '}
                    {request.children_ages.join(', ')})
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-500 mb-1">
                    Location
                  </label>
                  <p className="text-neutral-900 font-medium">
                    {request.location?.address || 'No location specified'}
                  </p>
                </div>
              </div>
            </div>

            {request.special_requirements && (
              <div className="mt-8 pt-8 border-t border-neutral-100">
                <label className="block text-sm font-medium text-neutral-500 mb-2">
                  Special Requirements
                </label>
                <p className="text-neutral-900 bg-neutral-50 p-4 rounded-xl">
                  {request.special_requirements}
                </p>
              </div>
            )}

            {request.cancellation_reason && (
              <div className="mt-8 pt-8 border-t border-neutral-100">
                <label className="block text-sm font-medium text-red-600 mb-2">
                  Cancellation Reason
                </label>
                <p className="text-neutral-900 bg-red-50 p-4 rounded-xl border border-red-100">
                  {request.cancellation_reason}
                </p>
              </div>
            )}
          </div>

          {assignedNanny && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-neutral-900">
                Assigned Caregiver
              </h2>
              <ProfileCard
                name={`${assignedNanny.profiles?.first_name} ${assignedNanny.profiles?.last_name}`}
                rating={4.9}
                reviewCount={12}
                location={assignedNanny.profiles?.address || ''}
                description={assignedNanny.nanny_details?.bio || ''}
                hourlyRate={
                  Number(assignedNanny.nanny_details?.hourly_rate) || 0
                }
                experience={`${assignedNanny.nanny_details?.experience_years} years`}
                isVerified={assignedNanny.is_verified}
                onViewProfile={() =>
                  router.push(`/caregiver/${assignedNanny.id}`)
                }
                onBook={() => router.push(`/book/${assignedNanny.id}`)}
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-[24px] border border-neutral-100 shadow-soft p-6 sticky top-24">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">Actions</h2>
            <div className="space-y-3">
              {request.status === 'PENDING' && (
                <Button
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 rounded-xl"
                  onClick={() => setIsCancelModalOpen(true)}
                  isLoading={cancelling}
                >
                  Cancel Request
                </Button>
              )}
              {request.status === 'CANCELLED' && (
                <div className="p-4 bg-red-50 rounded-xl text-center">
                  <p className="text-red-700 font-medium">
                    This request has been cancelled.
                  </p>
                </div>
              )}
              {['ACCEPTED', 'IN_PROGRESS'].includes(request.status) && (
                <Button className="w-full rounded-xl shadow-lg hover:shadow-xl transition-all">
                  Message Nanny
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <CancellationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancel}
        type="request"
        startTime={`${request.date}T${request.start_time}`}
        title="Cancel Service Request"
      />
    </div>
  );
}
