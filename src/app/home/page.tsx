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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserStatus = async () => {
            if (authLoading) return;
            
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Fetch bookings to determine if user is new or returning
                const bookings = await api.bookings.getParentBookings();
                setBookingCount(bookings.length);
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
                // Default to new user view on error to be safe, or could show error state
                setBookingCount(0); 
            } finally {
                setLoading(false);
            }
        };

        checkUserStatus();
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
    // Show ReturningUserDashboard if they have any bookings history
    const isNewUser = bookingCount === 0;

    return (
        <ParentLayout>
            {isNewUser ? <NewUserDashboard /> : <ReturningUserDashboard />}
        </ParentLayout>
    );
}
