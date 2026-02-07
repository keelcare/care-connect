
import React from 'react';
import { useRouter } from 'next/navigation';
import { GreetingHero } from '@/components/dashboard/GreetingHero';
import { api } from '@/lib/api';
import { SessionCard } from '@/components/dashboard/SessionCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { ActivityPanel } from '@/components/dashboard/ActivityPanel';
import { UpcomingSchedule } from '@/components/dashboard/UpcomingSchedule';
import { UserPlus, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function ReturningUserDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [activeSession, setActiveSession] = React.useState<any | null>(null);
    const [upcomingBookings, setUpcomingBookings] = React.useState<any[]>([]);
    const [notifications, setNotifications] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch active bookings from backend (returns requested, pending, accepted, CONFIRMED, IN_PROGRESS)
                const activeResponse = await api.bookings.getActive();

                let currentActive = null;

                if (activeResponse && activeResponse.length > 0) {
                    // 1. Find the actual IN_PROGRESS booking
                    const inProgressBooking = activeResponse.find((b: any) => b.status === 'IN_PROGRESS');

                    if (inProgressBooking) {
                        currentActive = inProgressBooking;
                    }
                    // Optional: If no IN_PROGRESS, maybe show CONFIRMED if it's starting very soon?
                    // For now, strict "Active Now" requires IN_PROGRESS status.
                }

                // Map backend data structure to frontend Booking interface if needed
                if (currentActive) {
                    // Backend returns users_bookings_nanny_idTousers, manual map to 'nanny' if missing
                    if (!currentActive.nanny && currentActive.users_bookings_nanny_idTousers) {
                        currentActive.nanny = currentActive.users_bookings_nanny_idTousers;
                    }
                    setActiveSession(currentActive);
                } else {
                    setActiveSession(null);
                }

                // Fetch all bookings for History/Upcoming
                const allBookings = await api.bookings.getParentBookings();
                if (allBookings && allBookings.length > 0) {
                    const upcoming = allBookings
                        .filter(b =>
                            (b.status === 'CONFIRMED' || b.status === 'REQUESTED') &&
                            b.id !== currentActive?.id // Exclude current if it somehow appears
                        )
                        // Use any cast to avoid type errors with mock/incomplete data for now
                        .sort((a, b) => new Date((a as any).date || a.created_at).getTime() - new Date((b as any).date || b.created_at).getTime())
                        .slice(0, 3);

                    // Map nanny details for upcoming as well
                    const upcomingWithDetails = upcoming.map((b: any) => {
                        if (!b.nanny && b.users_bookings_nanny_idTousers) {
                            return { ...b, nanny: b.users_bookings_nanny_idTousers };
                        }
                        return b;
                    });

                    setUpcomingBookings(upcomingWithDetails);
                }

                // Fetch notifications for activity panel
                try {
                    const notifs = await api.enhancedNotifications.list();
                    setNotifications(notifs || []);
                } catch (err) {
                    console.warn('Failed to fetch notifications', err);
                    setNotifications([]);
                }

            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    // Map active session data
    const currentSession = activeSession ? {
        booking: activeSession,
        caregiverName: activeSession.nanny?.profiles?.first_name
            ? `${activeSession.nanny.profiles.first_name} ${activeSession.nanny.profiles.last_name || ''}`
            : 'Caregiver',
        caregiverRole: 'Nanny', // Defaulting for now
        caregiverImage: activeSession.nanny?.profiles?.profile_image_url || undefined,
        startTime: activeSession.start_time,
        endTime: activeSession.end_time || 'Unknown',
        duration: '4h', // Calculate this properly in SessionCard or here
        status: 'active' as const,
        isOnline: true
    } : null;

    return (
        <div className="min-h-screen pb-12">
            <GreetingHero
                userName={user?.profiles?.first_name || 'Parent'}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Main Content Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Current Session */}
                    <section>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h2 className="text-xl font-heading font-semibold text-dashboard-text-primary">Current Session</h2>
                        </div>
                        <SessionCard session={activeSession} />
                    </section>

                    {/* Quick Actions */}
                    <section>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h2 className="text-xl font-heading font-semibold text-dashboard-text-primary">Quick Actions</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <QuickActionCard
                                title="Book Caregiver"
                                subtitle="Find a specialist for next week"
                                icon={UserPlus}
                                color="bg-gray-50"
                                onClick={() => router.push('/book-service')}
                            />
                            <QuickActionCard
                                title="Concierge Support"
                                subtitle="Get help with your care plan"
                                icon={Bell}
                                color="bg-dashboard-success/10"
                                onClick={() => router.push('/contact')}
                            />
                        </div>
                    </section>

                    {/* Activity Panel */}
                    <section>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h2 className="text-xl font-heading font-semibold text-dashboard-text-primary">Activity</h2>
                        </div>
                        <ActivityPanel activities={notifications} />
                    </section>
                </div>

                {/* Right Sidebar Column */}
                <div className="lg:col-span-1 space-y-6">
                    <UpcomingSchedule bookings={upcomingBookings} />

                    {/* Additional widgets can go here */}
                    <div className="bg-gradient-to-br from-dashboard-success/20 to-dashboard-mint rounded-[24px] p-6 border border-dashboard-success/10">
                        <h3 className="font-heading font-bold text-dashboard-childcare-teal text-lg mb-2">Did you know?</h3>
                        <p className="text-dashboard-childcare-teal/80 text-sm leading-relaxed">
                            Consistent routines help children feel secure. Try booking the same caregiver for recurring sessions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
