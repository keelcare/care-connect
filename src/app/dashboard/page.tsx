'use client';

import { toast } from 'sonner';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useSSE, SSE_EVENT_TYPES } from '@/context/SSEProvider';
import { api } from '@/lib/api';
import { Booking, Review } from '@/types/api';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { NannyOnboardingWizard } from '@/components/onboarding/NannyOnboardingWizard';
import { NannyVerificationBanner } from '@/components/onboarding/NannyVerificationBanner';
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
  const [wizardDismissed, setWizardDismissed] = useState(false);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [bookingsData, reviewsData] = await Promise.all([
        api.bookings.getNannyBookings(),
        user?.id ? api.reviews.getByUser(user.id) : Promise.resolve([]),
      ]);

      setBookings(bookingsData);
      setReviews(reviewsData || []);

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load dashboard data'
      );
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (authLoading || !user || user.role !== 'nanny') return;
    fetchDashboardData();
  }, [authLoading, user?.id, fetchDashboardData]);

  // Real-time Refresh via SSE
  const { subscribe } = useSSE();

  useEffect(() => {
    const nannyEvents = [
      SSE_EVENT_TYPES.BOOKING_CREATED,
      SSE_EVENT_TYPES.BOOKING_UPDATED,
      SSE_EVENT_TYPES.BOOKING_STARTED,
      SSE_EVENT_TYPES.BOOKING_COMPLETED,
      SSE_EVENT_TYPES.BOOKING_CANCELLED,
      SSE_EVENT_TYPES.BOOKING_RESCHEDULED,
      SSE_EVENT_TYPES.ASSIGNMENT_CREATED,
      SSE_EVENT_TYPES.ASSIGNMENT_ACCEPTED,
      SSE_EVENT_TYPES.ASSIGNMENT_REJECTED,
    ];

    const unsubscribers = nannyEvents.map((eventType) =>
      subscribe(eventType, () => {
        console.log('[SSE] Nanny dashboard refreshing on event:', eventType);
        fetchDashboardData();
      })
    );

    return () => unsubscribers.forEach((unsub) => unsub());
  }, [subscribe, fetchDashboardData]);

  const handleMessageBooking = async (booking: Booking) => {
    try {
      const chat = await api.chat.create({ bookingId: booking.id });
      router.push(`/dashboard/messages?booking=${booking.id}`);
    } catch (err) {
      console.error('Failed to start chat:', err);
    }
  };

  const handleCheckIn = async (booking: Booking) => {
    try {
      setLoading(true);
      // Attempt to get geolocation
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              await api.bookings.start(booking.id, { latitude, longitude });
              toast.success('Successfully checked in!');
              fetchDashboardData();
            } catch (err: any) {
              toast.error(err.message || 'Failed to check in. You might be too far from the location.');
              setLoading(false);
            }
          },
          async (geoErr) => {
            console.error('Geolocation error:', geoErr);
            toast.error('Location access denied. Cannot verify geofence.');
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        toast.error('Geolocation is not supported by your browser.');
        setLoading(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to check in.');
      setLoading(false);
    }
  };

  const upcomingBookings = bookings
    .filter((b) => ['CONFIRMED', 'IN_PROGRESS'].includes(b.status))
    .sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

  // Determine "current session"
  // ONLY show IN_PROGRESS as current session
  const currentSession = bookings.find(b => b.status === 'IN_PROGRESS');
  const featuredBooking = currentSession;

  // Remaining upcoming bookings for the list
  // If no current session, show top-3. If current session, show top-3 excluding it.
  const remainingUpcoming = upcomingBookings
    .filter(b => b.id !== featuredBooking?.id)
    .slice(0, 3);


  if (authLoading || loading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-live="polite">
        {/* NannyHero skeleton */}
        <div className="rounded-3xl p-8 bg-gradient-to-br from-neutral-100 to-neutral-50 animate-pulse">
          <Skeleton variant="text" className="w-36 mb-3" />
          <Skeleton variant="title" className="w-64 mb-2" />
          <Skeleton variant="text" className="w-48" />
        </div>
        {/* Main grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* Session card skeleton */}
            <Skeleton variant="card" className="h-44" />
            {/* Quick actions skeleton */}
            <div className="grid grid-cols-2 gap-4">
              <Skeleton variant="card" className="h-28" />
              <Skeleton variant="card" className="h-28" />
              <Skeleton variant="card" className="h-28" />
              <Skeleton variant="card" className="h-28" />
            </div>
          </div>
          <div className="space-y-4">
            {/* Upcoming schedule skeleton */}
            <Skeleton variant="card" className="h-72" />
            {/* Feedback skeleton */}
            <Skeleton variant="card" className="h-44" />
          </div>
        </div>
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

  const needsOnboarding =
    !wizardDismissed &&
    user?.role === 'nanny' &&
    user.identity_verification_status !== 'verified';

  return (
    <ProtectedRoute allowedRoles={['nanny']}>
      <div className="font-sans text-wellness-text">

        {/* Onboarding wizard — shown until identity is verified or dismissed */}
        {needsOnboarding && user && (
          <NannyOnboardingWizard
            user={user}
            onComplete={() => setWizardDismissed(true)}
          />
        )}

        {/* 1. Hero Section */}
        <NannyHero />

        {/* Verification status banner — shown after wizard is dismissed or on return */}
        {user && user.identity_verification_status !== 'verified' && (
          <NannyVerificationBanner
            status={user.identity_verification_status ?? null}
            onResubmit={() => setWizardDismissed(false)}
          />
        )}

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
