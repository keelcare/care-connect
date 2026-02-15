'use client';

import React, { useEffect, useState } from 'react';
import ParentLayout from '@/components/layout/ParentLayout';
import { useAuth } from '@/context/AuthContext';
import { ReturningUserDashboard } from '@/components/dashboard/ReturningUserDashboard';
import { NewUserDashboard } from '@/components/dashboard/NewUserDashboard';
import { api } from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { useSocket } from '@/context/SocketProvider';

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

    const fetchDashboardData = React.useCallback(async () => {
        if (authLoading || !user) {
            if (!authLoading && !user) setLoading(false);
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
            // ONLY show IN_PROGRESS as current session
            const inProgressBooking = allBookings.find((b: any) => b.status === 'IN_PROGRESS');
            let currentActive = inProgressBooking || null;

            // Process upcoming bookings (all confirmed/requested, excluding featured)
            const upcomingBookings = allBookings
                .filter(b =>
                    (b.status === 'CONFIRMED' || b.status === 'REQUESTED') &&
                    b.id !== currentActive?.id
                )
                .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

            // Deep enrichment for nanny details if missing
            const nannyIdsToFetch = new Set<string>();
            if (currentActive?.nanny_id && !currentActive.nanny?.profiles?.first_name) {
                nannyIdsToFetch.add(currentActive.nanny_id);
            }
            upcomingBookings.forEach(b => {
                if (b.nanny_id && !b.nanny?.profiles?.first_name) {
                    nannyIdsToFetch.add(b.nanny_id);
                }
            });

            const nannyMap = new Map<string, any>();
            for (const nannyId of Array.from(nannyIdsToFetch)) {
                try {
                    const nannyDetails = await api.users.get(nannyId);
                    nannyMap.set(nannyId, nannyDetails);
                    await new Promise(resolve => setTimeout(resolve, 50));
                } catch (err) {
                    console.error(`Failed to fetch nanny ${nannyId}:`, err);
                }
            }

            const enrich = (b: any) => {
                if (b.nanny_id && nannyMap.has(b.nanny_id)) {
                    return { ...b, nanny: nannyMap.get(b.nanny_id) };
                }
                // Fallback to existing field if present
                if (!b.nanny && b.users_bookings_nanny_idTousers) {
                    return { ...b, nanny: b.users_bookings_nanny_idTousers };
                }
                return b;
            };

            setDashboardData({
                activeSession: currentActive ? enrich(currentActive) : null,
                upcomingBookings: upcomingBookings.map(enrich).slice(0, 3),
                notifications: notifs || []
            });

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setBookingCount(0);
        } finally {
            setLoading(false);
        }
    }, [user, authLoading]);

    // 1. Initial Load
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // 2. Real-time Refresh
    const { onRefresh, offRefresh } = useSocket();

    useEffect(() => {
        const handleRefresh = (data: any) => {
            console.log('Real-time refresh triggered in Parent Dashboard:', data);
            // Re-fetch everything if a booking changes
            if (data.category === 'booking' || data.category === 'request') {
                fetchDashboardData();
            }
        };

        onRefresh(handleRefresh);
        return () => offRefresh(handleRefresh);
    }, [onRefresh, offRefresh, fetchDashboardData]);

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
