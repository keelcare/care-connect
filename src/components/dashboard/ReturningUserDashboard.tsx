
import React from 'react';
import { useRouter } from 'next/navigation';
import { GreetingHero } from '@/components/dashboard/GreetingHero';
import { SessionCard } from '@/components/dashboard/SessionCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { ActivityPanel } from '@/components/dashboard/ActivityPanel';
import { UpcomingSchedule } from '@/components/dashboard/UpcomingSchedule';
import { NextBookingCard } from '@/components/dashboard/NextBookingCard';
import { NextBookingDrawer } from '@/components/dashboard/NextBookingDrawer';
import { ServiceSelectionModal } from '@/components/dashboard/ServiceSelectionModal';
import { UserPlus, Bell } from 'lucide-react';
import { Booking, Notification } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import { AnimatePresence } from 'framer-motion';

export interface ReturningUserDashboardProps {
    activeSession: Booking | null;
    upcomingBookings: Booking[];
    notifications: Notification[];
}

export function ReturningUserDashboard({ activeSession, upcomingBookings, notifications }: ReturningUserDashboardProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [isServiceModalOpen, setIsServiceModalOpen] = React.useState(false);

    // Soonest upcoming booking (already sorted by start_time ascending)
    const nextBooking = upcomingBookings[0] ?? null;
    const hasDrawer = Boolean(activeSession || nextBooking);

    return (
        <div className={`min-h-dvh ${hasDrawer ? 'pb-28 lg:pb-10' : 'pb-10'}`}>
            <GreetingHero
                userName={user?.profiles?.first_name || ''}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Current Session — desktop only; mobile uses the bottom drawer */}
                    <section className="hidden lg:block">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h2 className="text-lg font-heading font-semibold text-dashboard-text-primary">Current Session</h2>
                        </div>
                        <SessionCard session={activeSession} />
                    </section>

                    {/* Up Next — desktop only; mobile uses the bottom drawer */}
                    <section className="hidden lg:block">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h2 className="text-lg font-heading font-semibold text-dashboard-text-primary">Up Next</h2>
                        </div>
                        <NextBookingCard booking={nextBooking} />
                    </section>

                    {/* Quick Actions */}
                    <section>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h2 className="text-lg font-heading font-semibold text-dashboard-text-primary">Quick Actions</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <QuickActionCard
                                title="Book Caregiver"
                                subtitle="Find a specialist for next week"
                                icon={UserPlus}
                                color="bg-gray-50"
                                onClick={() => setIsServiceModalOpen(true)}
                            />
                            <QuickActionCard
                                title="Concierge Support"
                                subtitle="Get help with your care plan"
                                icon={Bell}
                                color="bg-dashboard-success/10"
                                onClick={() => router.push('/support')}
                            />
                        </div>
                    </section>


                </div>

                {/* Right Sidebar Column */}
                <div className="lg:col-span-1 space-y-5">
                    <UpcomingSchedule bookings={upcomingBookings} />

                    <ActivityPanel activities={notifications} />

                </div>
            </div>

            {/* Mobile bottom drawer for the live/next session (Zepto-style) */}
            <NextBookingDrawer activeSession={activeSession} nextBooking={nextBooking} />

            <AnimatePresence>
                {isServiceModalOpen && (
                    <ServiceSelectionModal
                        isOpen={isServiceModalOpen}
                        onClose={() => setIsServiceModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
