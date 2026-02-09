'use client';

import React, { useEffect, useState } from 'react';
import ParentLayout from '@/components/layout/ParentLayout';
import { useAuth } from '@/context/AuthContext';
import { ReturningUserDashboard } from '@/components/dashboard/ReturningUserDashboard';
import { NewUserDashboard } from '@/components/dashboard/NewUserDashboard';
import { api } from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

export default function HomePage() {
    const { user, loading: authLoading } = useAuth();
    const [bookingCount, setBookingCount] = useState<number | null>(null);
    const [dashboardData, setDashboardData] = useState<{
        activeSession: any | null;
        upcomingBookings: any[];
        notifications: any[];
    }>({
        activeSession: null,
        upcomingBookings: [],
        notifications: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (authLoading) return;
            
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Fetch all data in parallel for better performance
                const [activeResponse, allBookings, notifs] = await Promise.all([
                    api.bookings.getActive(),
                    api.bookings.getParentBookings(),
                    api.enhancedNotifications.list().catch(() => []) // Gracefully handle notification errors
                ]);

                // Determine booking count for new/returning user logic
                setBookingCount(allBookings.length);

                // Process active session
                let currentActive = null;
                if (activeResponse && activeResponse.length > 0) {
                    const inProgressBooking = activeResponse.find((b: any) => b.status === 'IN_PROGRESS');
                    if (inProgressBooking) {
                        currentActive = inProgressBooking;
                        // Map nanny details if needed
                        if (!currentActive.nanny && currentActive.users_bookings_nanny_idTousers) {
                            currentActive.nanny = currentActive.users_bookings_nanny_idTousers;
                        }
                    }
                }

                // Process upcoming bookings
                const upcoming = allBookings
                    .filter(b =>
                        (b.status === 'CONFIRMED' || b.status === 'REQUESTED') &&
                        b.id !== currentActive?.id
                    )
                    .sort((a, b) => new Date((a as any).date || a.created_at).getTime() - new Date((b as any).date || b.created_at).getTime())
                    .slice(0, 3)
                    .map((b: any) => {
                        if (!b.nanny && b.users_bookings_nanny_idTousers) {
                            return { ...b, nanny: b.users_bookings_nanny_idTousers };
                        }
                        return b;
                    });

                setDashboardData({
                    activeSession: currentActive,
                    upcomingBookings: upcoming,
                    notifications: notifs || []
                });

            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                setBookingCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <ParentLayout>
                <div className="min-h-[500px] flex items-center justify-center">
                    <Spinner />
                </div>
            </ParentLayout>
        );
    }

    // Determine which dashboard to show
    const isNewUser = bookingCount === 0;

    return (
        <ParentLayout>
            {isNewUser ? (
                <NewUserDashboard />
            ) : (
                <ReturningUserDashboard
                    activeSession={dashboardData.activeSession}
                    upcomingBookings={dashboardData.upcomingBookings}
                    notifications={dashboardData.notifications}
                />
            )}
        </ParentLayout>
    );
}
