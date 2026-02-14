import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare, ArrowRight, Clock, Sun, Leaf, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Booking } from '@/types/api';

interface SessionCardProps {
    session?: Booking | null;
    onMessage?: () => void;
    onViewDetails?: () => void;
    userRole?: 'parent' | 'nanny';
}

export function SessionCard({
    session,
    onMessage,
    onViewDetails,
    userRole = 'parent'
}: SessionCardProps) {
    // Empty State
    if (!session) {
        return (
            <div className="@container bg-white rounded-3xl p-fluid-sm shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[21.25rem]">
                <div className="w-14 h-14 rounded-full bg-dashboard-sage/10 flex items-center justify-center mb-5">
                    <Leaf className="w-7 h-7 text-dashboard-sage" />
                </div>

                <h3 className="text-fluid-2xl font-display font-medium text-dashboard-text-primary mb-3">
                    {userRole === 'nanny' ? 'No session active' : 'No session active right now'}
                </h3>

                <p className="text-dashboard-text-secondary/80 text-fluid-base max-w-md mb-8 leading-relaxed">
                    {userRole === 'nanny'
                        ? 'You have no confirmed sessions happening right now.'
                        : 'You have no confirmed sessions happening right now.'}
                </p>


            </div>
        );
    }

    // Active Session State
    let displayName = 'User';
    let displayRole = 'User';
    let displayImage = '/placeholder-avatar.png';

    if (userRole === 'nanny') {
        // Show Parent Details
        displayName = session.parent?.profiles?.first_name
            ? `${session.parent.profiles.first_name} ${session.parent.profiles.last_name || ''}`.trim()
            : 'Parent';
        displayRole = 'Parent';
        // Use a generic placeholder for parent if no image (or add parent image field if available)
        displayImage = session.parent?.profiles?.profile_image_url || '/placeholder-avatar.png';
    } else {
        // Show Nanny Details (Default)
        displayName = session.nanny?.profiles?.first_name
            ? `${session.nanny.profiles.first_name} ${session.nanny.profiles.last_name || ''}`.trim()
            : 'Caregiver';
        displayRole = 'Nanny';
        displayImage = session.nanny?.profiles?.profile_image_url || '/placeholder-avatar.png';
    }

    // Simple time formatting
    const formatTime = (isoString?: string | null) => {
        if (!isoString) return '...';
        try {
            const date = new Date(isoString);
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } catch (e) { return isoString; }
    };

    const startTime = formatTime(session.start_time);
    const endTime = session.end_time ? formatTime(session.end_time) : '...';

    return (
        <div className="@container bg-white/60 backdrop-blur-xl border border-white/60 shadow-premium rounded-3xl p-fluid-sm relative overflow-hidden">
            {/* Top Row: Label and Status */}
            <div className="flex items-center justify-between mb-fluid-xs">
                <div className="flex items-center gap-2 text-dashboard-text-secondary font-medium text-xs tracking-widest uppercase">
                    <Sun className="w-4 h-4" />
                    <span>Current Session</span>
                </div>
                <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-dashboard-success animate-pulse"></span>
                    <span className="text-[10px] font-bold text-dashboard-text-primary uppercase tracking-wide">Active Now</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col @md:flex-row items-start gap-fluid-xs mb-fluid-xs">
                {/* Avatar with Ring */}
                <div className="relative">
                    <div className="w-20 h-20 rounded-full p-1 bg-white border border-gray-100 shadow-sm relative">
                        <div className="w-full h-full rounded-full overflow-hidden relative">
                            <Image
                                src={displayImage}
                                alt={displayName}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    {/* Verified/Online Badge */}
                    <div className="absolute bottom-0 right-0 w-7 h-7 bg-dashboard-accent-start rounded-full flex items-center justify-center border-2 border-white shadow-md text-white">
                        <span className="text-[9px] font-bold">✓</span>
                    </div>
                </div>

                <div className="flex-1 space-y-3">
                    <div>
                        <h3 className="text-fluid-2xl font-display font-medium text-dashboard-text-primary mb-1">{displayName}</h3>
                        <div className="flex items-center gap-2 text-dashboard-text-secondary/80 font-medium">
                            <div className="w-4 h-4 rounded bg-dashboard-sage/20 flex items-center justify-center">
                                <span className="text-[10px] text-dashboard-sage">
                                    {userRole === 'nanny' ? '🏠' : '🎓'}
                                </span>
                            </div>
                            <span>{displayRole}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <div className="bg-white/80 px-3 py-1.5 rounded-xl border border-gray-100 flex items-center gap-2 text-fluid-sm font-medium text-dashboard-text-primary">
                            <Clock className="w-3.5 h-3.5 text-dashboard-sage" />
                            {startTime} — {endTime}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-fluid-xs">
                <Link href={`/dashboard/messages?booking=${session.id}`} className="block">
                    <Button
                        className="min-h-tap px-6 rounded-2xl bg-dashboard-accent-start hover:bg-dashboard-accent-end text-white text-fluid-sm font-semibold shadow-lg shadow-dashboard-accent-start/10 transition-all hover:scale-[1.02]"
                    >
                        Message
                    </Button>
                </Link>
                <Link href={userRole === 'nanny' ? `/dashboard/bookings` : `/bookings/${session.id}`} className="block">
                    <Button
                        variant="ghost"
                        className="min-h-tap px-6 rounded-2xl bg-white border border-gray-200 text-dashboard-text-primary hover:bg-gray-50 text-fluid-sm font-semibold transition-all hover:scale-[1.02]"
                    >
                        View Details
                    </Button>
                </Link>
            </div>
        </div>
    );
}
