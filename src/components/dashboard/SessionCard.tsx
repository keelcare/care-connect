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
            <div className="bg-white rounded-[32px] p-10 md:p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-dashboard-sage/10 flex items-center justify-center mb-6">
                    <Leaf className="w-8 h-8 text-dashboard-sage" />
                </div>
                
                <h3 className="text-3xl font-display font-medium text-dashboard-text-primary mb-4">
                    {userRole === 'nanny' ? 'No session active' : 'No session active right now'}
                </h3>
                
                <p className="text-dashboard-text-secondary/80 text-lg max-w-md mb-10 leading-relaxed">
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
    const formatTime = (timeStr: string) => {
        try {
            const [hours, minutes] = timeStr.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes));
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } catch (e) { return timeStr; }
    };

    const startTime = formatTime(session.start_time);
    const endTime = session.end_time ? formatTime(session.end_time) : '...';

    return (
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-premium rounded-[32px] p-8 md:p-10 relative overflow-hidden">
            {/* Top Row: Label and Status */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-dashboard-text-secondary font-medium text-xs tracking-widest uppercase">
                    <Sun className="w-4 h-4" />
                    <span>Current Session</span>
                </div>
                <div className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gray-100 flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-dashboard-success animate-pulse"></span>
                    <span className="text-xs font-bold text-dashboard-text-primary uppercase tracking-wide">Active Now</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 mb-8">
                {/* Avatar with Ring */}
                <div className="relative">
                    <div className="w-24 h-24 rounded-full p-1 bg-white border border-gray-100 shadow-sm relative">
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
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-dashboard-accent-start rounded-full flex items-center justify-center border-2 border-white shadow-md text-white">
                        <span className="text-[10px] font-bold">✓</span>
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <h3 className="text-3xl font-display font-medium text-dashboard-text-primary mb-1">{displayName}</h3>
                        <div className="flex items-center gap-2 text-dashboard-text-secondary/80 font-medium">
                            <div className="w-4 h-4 rounded bg-dashboard-sage/20 flex items-center justify-center">
                                <span className="text-[10px] text-dashboard-sage">
                                    {userRole === 'nanny' ? '🏠' : '🎓'}
                                </span>
                            </div>
                            <span>{displayRole}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="bg-white/80 px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2 text-sm font-medium text-dashboard-text-primary">
                            <Clock className="w-4 h-4 text-dashboard-sage" />
                            {startTime} — {endTime}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <Link href={`/dashboard/messages?booking=${session.id}`} className="block">
                    <Button 
                        className="h-12 px-8 rounded-2xl bg-dashboard-accent-start hover:bg-dashboard-accent-end text-white text-sm font-semibold shadow-lg shadow-dashboard-accent-start/10 transition-all hover:scale-[1.02]"
                    >
                        Message
                    </Button>
                </Link>
                <Link href={userRole === 'nanny' ? `/dashboard/schedule` : `/bookings/${session.id}`} className="block">
                    <Button 
                        variant="ghost" 
                        className="h-12 px-8 rounded-2xl bg-white border border-gray-200 text-dashboard-text-primary hover:bg-gray-50 text-sm font-semibold transition-all hover:scale-[1.02]"
                    >
                        View Details
                    </Button>
                </Link>
            </div>
        </div>
    );
}
