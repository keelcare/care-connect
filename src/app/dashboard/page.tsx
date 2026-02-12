'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking, Review } from '@/types/api';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NannyHero } from '@/components/dashboard/nanny/NannyHero';
import { SessionCard } from '@/components/dashboard/SessionCard';
import { QuickActions } from '@/components/dashboard/nanny/QuickActions';
import { RecentFeedback } from '@/components/dashboard/nanny/RecentFeedback';
import { UpcomingSchedule } from '@/components/dashboard/UpcomingSchedule';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    // Auth checks moved to ProtectedRoute
    if (user && user.role === 'nanny') {
        fetchDashboardData();
    }
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [bookingsData, reviewsData] = await Promise.all([
        api.bookings.getNannyBookings(),
        user?.id ? api.reviews.getByUser(user.id) : Promise.resolve([]),
      ]);

      // Enrich bookings with parent details if not already populated
      const parentIdsToFetch = new Set<string>();
      bookingsData.forEach((booking) => {
        if (
          booking.parent_id &&
          !booking.parent?.profiles?.first_name &&
          !booking.parent?.profiles?.full_name
        ) {
          parentIdsToFetch.add(booking.parent_id);
        }
      });

      const parentMap = new Map<string, any>();
      const parentIds = Array.from(parentIdsToFetch);

      for (const parentId of parentIds) {
        try {
          const parentDetails = await api.users.get(parentId);
          parentMap.set(parentId, parentDetails);
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (err) {
          console.error(`Failed to fetch parent ${parentId}:`, err);
        }
      }

      const enrichedBookings = bookingsData.map((booking) => {
        if (booking.parent_id && parentMap.has(booking.parent_id)) {
          return { ...booking, parent: parentMap.get(booking.parent_id) };
        }
        return booking;
      });

      setBookings(enrichedBookings);
      setReviews(reviewsData || []);

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load dashboard data'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMessageBooking = async (booking: Booking) => {
    try {
      const chat = await api.chat.create({ bookingId: booking.id });
      router.push(`/dashboard/messages?booking=${booking.id}`);
    } catch (err) {
      console.error('Failed to start chat:', err);
    }
  };

  const handleCheckIn = async (booking: Booking) => {
      // TODO: Implement check-in logic
      console.log('Check in for booking', booking.id);
  };

  const upcomingBookings = bookings
    .filter((b) => ['CONFIRMED', 'IN_PROGRESS'].includes(b.status))
    .sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

  // Determine "current session" or "next up"
  // Prioritize IN_PROGRESS, then the nearest CONFIRMED
  const currentSession = bookings.find(b => b.status === 'IN_PROGRESS');
  const nextConfirmed = upcomingBookings.length > 0 ? upcomingBookings[0] : undefined;
  
  const featuredBooking = currentSession || nextConfirmed;
  
  // Remaining upcoming bookings for the list (excluding the one shown in main widget)
  const remainingUpcoming = upcomingBookings.filter(b => b.id !== featuredBooking?.id).slice(0, 3);


  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['nanny']}>
        <div className="font-sans text-wellness-text">
            
            {/* 1. Hero Section */}
            <NannyHero />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Next Up / Current Session */}
                    <SessionCard 
                        session={featuredBooking} 
                        onMessage={() => featuredBooking && handleMessageBooking(featuredBooking)}
                        userRole="nanny"
                    />

                    {/* Quick Actions Grid */}
                    <QuickActions />
                </div>

                {/* Right Column (1/3) */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Upcoming List */}
                    <UpcomingSchedule bookings={remainingUpcoming} userRole="nanny" />

                    {/* Recent Feedback */}
                    <RecentFeedback reviews={reviews.slice(0, 1)} />
                </div>

            </div>
        </div>
    </ProtectedRoute>
  );
}
