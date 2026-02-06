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
}

export function SessionCard({
    session,
    onMessage,
    onViewDetails
}: SessionCardProps) {
    // Empty State (No Active Session) - Matching user's reference image
    if (!session) {
        return (
            <div className="bg-white rounded-[32px] p-10 md:p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-dashboard-sage/10 flex items-center justify-center mb-6">
                    <Leaf className="w-8 h-8 text-dashboard-sage" />
                </div>
                
                <h3 className="text-3xl font-display font-medium text-dashboard-text-primary mb-4">
                    No session active right now
                </h3>
                
                <p className="text-dashboard-text-secondary/80 text-lg max-w-md mb-10 leading-relaxed">
                    Take a moment to relax or plan ahead. Your care team is ready when you are.
                </p>

                <div className="flex items-center gap-4">
                    <Link href="/book-service">
                        <Button className="h-12 px-6 bg-dashboard-navy hover:bg-dashboard-navy/90 text-black rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-dashboard-navy/20">
                            <Search className="w-4 h-4" />
                            Book a Service
                        </Button>
                    </Link>
                    
                    <Link href="/dashboard/bookings">
                        <Button variant="outline" className="h-12 px-6 border-gray-200 text-dashboard-text-primary hover:bg-gray-50 rounded-xl font-medium flex items-center gap-2 transition-all">
                            <Calendar className="w-4 h-4" />
                            View Schedule
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Active Session State
    const caregiverName = session.nanny?.profiles?.first_name 
        ? `${session.nanny.profiles.first_name} ${session.nanny.profiles.last_name || ''}`
        : 'Caregiver';
    const caregiverRole = 'Nanny'; // TODO: fetch from details if available
    const caregiverImage = session.nanny?.profiles?.profile_image_url;
    
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
                                src={caregiverImage || '/placeholder-avatar.png'}
                                alt={caregiverName}
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
                        <h3 className="text-3xl font-display font-medium text-dashboard-text-primary mb-1">{caregiverName}</h3>
                        <div className="flex items-center gap-2 text-dashboard-text-secondary/80 font-medium">
                            <div className="w-4 h-4 rounded bg-dashboard-sage/20 flex items-center justify-center">
                                <span className="text-[10px] text-dashboard-sage">🎓</span>
                            </div>
                            <span>{caregiverRole}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="bg-white/80 px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2 text-sm font-medium text-dashboard-text-primary">
                            <Clock className="w-4 h-4 text-dashboard-sage" />
                            {startTime} — {endTime}
                        </div>
                        {/* <div className="bg-white/80 px-4 py-2 rounded-xl border border-gray-100 flex items-center gap-2 text-sm font-medium text-dashboard-text-primary">
                            <span className="text-dashboard-sage">⏳</span>
                             Session
                        </div> */}
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
                <Link href={`/dashboard/bookings/${session.id}`} className="block">
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
