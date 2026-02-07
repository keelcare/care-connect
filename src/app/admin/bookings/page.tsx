'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import styles from './page.module.css';

// Extended booking type to handle Prisma relation names from backend
interface AdminBooking extends Omit<Booking, 'users_bookings_nanny_idTousers' | 'users_bookings_parent_idTousers'> {
  // Prisma relation names from backend
  jobs?: { title?: string; description?: string };
  users_bookings_nanny_idTousers?: {
    id: string;
    email: string;
    profiles?: {
      first_name?: string | null;
      last_name?: string | null;
    }
  };
  users_bookings_parent_idTousers?: {
    id: string;
    email: string;
    profiles?: {
      first_name?: string | null;
      last_name?: string | null;
    }
  };
}

export default function AdminBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.admin.getBookings();

      // Enrich bookings with parent/nanny details if not already populated
      const enrichedBookings = await Promise.all(
        data.map(async (booking: AdminBooking) => {
          let enrichedBooking = { ...booking };

          // Fetch parent details if missing
          const parentFromPrisma = booking.users_bookings_parent_idTousers;
          const parentFromBooking = booking.parent;

          if (
            !parentFromPrisma?.profiles?.first_name &&
            !parentFromBooking?.profiles?.first_name &&
            booking.parent_id
          ) {
            try {
              const parentDetails = await api.users.get(booking.parent_id);
              enrichedBooking.parent = parentDetails;
            } catch (err) {
              console.error(
                `Failed to fetch parent details for booking ${booking.id}:`,
                err
              );
            }
          }

          // Fetch nanny details if missing
          const nannyFromPrisma = booking.users_bookings_nanny_idTousers;
          const nannyFromBooking = booking.nanny;

          if (
            !nannyFromPrisma?.profiles?.first_name &&
            !nannyFromBooking?.profiles?.first_name &&
            booking.nanny_id
          ) {
            try {
              const nannyDetails = await api.users.get(booking.nanny_id);
              enrichedBooking.nanny = nannyDetails;
            } catch (err) {
              console.error(
                `Failed to fetch nanny details for booking ${booking.id}:`,
                err
              );
            }
          }

          return enrichedBooking;
        })
      );

      setBookings(enrichedBookings);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get job title from various sources
  const getJobTitle = (booking: AdminBooking): string => {
    // Try Prisma relation name first
    if (booking.jobs?.title) {
      return booking.jobs.title;
    }
    // Try standard job relation
    if (booking.job?.title) {
      return booking.job.title;
    }
    // Fallback based on how booking was created
    return 'Direct Booking';
  };

  // Helper function to get parent name
  const getParentName = (booking: AdminBooking): string => {
    // Try Prisma relation name first
    const prismaParent = booking.users_bookings_parent_idTousers;
    if (
      prismaParent?.profiles?.first_name &&
      prismaParent?.profiles?.last_name
    ) {
      return `${prismaParent.profiles.first_name} ${prismaParent.profiles.last_name}`;
    }
    if (prismaParent?.email) {
      return prismaParent.email;
    }

    // Try standard parent relation
    const parent = booking.parent;
    if (parent?.profiles?.first_name && parent?.profiles?.last_name) {
      return `${parent.profiles.first_name} ${parent.profiles.last_name}`;
    }
    if (parent?.email) {
      return parent.email;
    }

    return 'N/A';
  };

  // Helper function to get nanny name
  const getNannyName = (booking: AdminBooking): string => {
    // Try Prisma relation name first
    const prismaNanny = booking.users_bookings_nanny_idTousers;
    if (prismaNanny?.profiles?.first_name && prismaNanny?.profiles?.last_name) {
      return `${prismaNanny.profiles.first_name} ${prismaNanny.profiles.last_name}`;
    }
    if (prismaNanny?.email) {
      return prismaNanny.email;
    }

    // Try standard nanny relation
    const nanny = booking.nanny;
    if (nanny?.profiles?.first_name && nanny?.profiles?.last_name) {
      return `${nanny.profiles.first_name} ${nanny.profiles.last_name}`;
    }
    if (nanny?.email) {
      return nanny.email;
    }

    return 'N/A';
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-100 text-emerald-700';
      case 'IN_PROGRESS':
        return 'bg-neutral-100 text-neutral-700';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchBookings}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin')}
          className="rounded-xl"
        >
          ← Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-primary-900 font-display">
          Booking Management
        </h1>
      </div>

      <div className="bg-white rounded-[32px] border border-neutral-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Parent
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Nanny
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-neutral-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-neutral-900">
                    {getJobTitle(booking)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                    {getParentName(booking)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                    {getNannyName(booking)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-neutral-500">
                    {new Date(booking.start_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusClass(booking.status)}`}
                    >
                      {booking.status.toLowerCase().replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/bookings/${booking.id}`)
                      }
                      className="rounded-lg hover:bg-neutral-50"
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
