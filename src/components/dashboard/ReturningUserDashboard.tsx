
import React from 'react';
import { useRouter } from 'next/navigation';
import { GreetingHero } from '@/components/dashboard/GreetingHero';
import { api } from '@/lib/api';
import { SessionCard } from '@/components/dashboard/SessionCard';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { ActivityPanel } from '@/components/dashboard/ActivityPanel';
import { UpcomingSchedule } from '@/components/dashboard/UpcomingSchedule';
import { ServiceSelectionModal } from '@/components/dashboard/ServiceSelectionModal';
import { UserPlus, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AnimatePresence } from 'framer-motion';

export interface ReturningUserDashboardProps {
    activeSession: any;
    upcomingBookings: any[];
    notifications: any[];
}

export function ReturningUserDashboard({ activeSession, upcomingBookings, notifications }: ReturningUserDashboardProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [isServiceModalOpen, setIsServiceModalOpen] = React.useState(false);

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
        <div className="min-h-screen pb-10">
            <GreetingHero
                userName={user?.profiles?.first_name || 'Parent'}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Current Session */}
                    <section>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <h2 className="text-lg font-heading font-semibold text-dashboard-text-primary">Current Session</h2>
                        </div>
                        <SessionCard session={activeSession} />
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
                                onClick={() => router.push('/contact')}
                            />
                        </div>
                    </section>


                </div>

                {/* Right Sidebar Column */}
                <div className="lg:col-span-1 space-y-5">
                    <UpcomingSchedule bookings={upcomingBookings} />

                    <ActivityPanel activities={notifications} />

                    {/* Additional widgets can go here */}
                    <div className="bg-gradient-to-br from-dashboard-success/20 to-dashboard-mint rounded-[20px] p-5 border border-dashboard-success/10">
                        <h3 className="font-heading font-bold text-dashboard-childcare-teal text-base mb-1.5">Did you know?</h3>
                        <p className="text-dashboard-childcare-teal/80 text-[13px] leading-relaxed">
                            Consistent routines help children feel secure. Try booking the same caregiver for recurring sessions.
                        </p>
                    </div>
                </div>
            </div>

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
