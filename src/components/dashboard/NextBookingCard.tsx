import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarClock, Clock, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusPill } from './StatusPill';
import { Booking } from '@/types/api';
import { getNextBookingDisplay, useMinuteNow } from './nextBookingHelpers';

interface NextBookingCardProps {
    booking?: Booking | null;
}

export function NextBookingCard({ booking }: NextBookingCardProps) {
    const now = useMinuteNow();

    // Empty state
    if (!booking) {
        return (
            <div className="@container bg-white rounded-3xl p-fluid-sm shadow-sm border border-gray-100 flex items-center gap-fluid-xs">
                <div className="w-12 h-12 rounded-full bg-dashboard-sage/10 flex items-center justify-center shrink-0">
                    <CalendarClock className="w-6 h-6 text-dashboard-sage" />
                </div>
                <div className="flex-1">
                    <h3 className="font-heading font-semibold text-dashboard-text-primary text-fluid-base">No upcoming sessions</h3>
                    <p className="text-dashboard-text-secondary text-fluid-sm">Book a caregiver to see your next session here.</p>
                </div>
                <Link href="/book-service">
                    <Button className="min-h-tap px-5 rounded-2xl bg-dashboard-accent-start hover:bg-dashboard-accent-end text-white text-fluid-sm font-semibold">
                        Book Now
                    </Button>
                </Link>
            </div>
        );
    }

    const d = getNextBookingDisplay(booking, now);

    return (
        <div className="@container bg-white/60 backdrop-blur-xl border border-white/60 shadow-premium rounded-3xl p-fluid-sm relative overflow-hidden">
            {/* Top Row: Label and Status */}
            <div className="flex items-center justify-between mb-fluid-xs">
                <div className="flex items-center gap-2 text-dashboard-text-secondary font-medium text-xs tracking-widest uppercase">
                    <CalendarClock className="w-4 h-4" />
                    <span>Up Next</span>
                </div>
                <StatusPill
                    status={d.isPending ? 'pending' : 'active'}
                    text={d.isPending ? 'Pending' : 'Confirmed'}
                    showDot={!d.isPending}
                />
            </div>

            {/* Main Content */}
            <div className="flex items-start gap-fluid-xs mb-fluid-xs">
                {/* Date Block */}
                <div className="bg-white rounded-2xl min-w-[3.5rem] h-[3.5rem] flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                    <span className="text-[9px] font-bold uppercase text-dashboard-text-secondary tracking-wider">{d.dateBlock.month}</span>
                    <span className="text-fluid-lg font-heading font-bold text-dashboard-text-primary leading-none mt-0.5">{d.dateBlock.day}</span>
                </div>

                {/* Avatar */}
                <div className="w-14 h-14 rounded-full p-0.5 bg-white border border-gray-100 shadow-sm relative shrink-0">
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                        <Image src={d.counterpartImage} alt={d.counterpartName} fill className="object-cover" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-fluid-xl font-display font-medium text-dashboard-text-primary truncate">{d.counterpartName}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <div className="bg-white/80 px-3 py-1.5 rounded-xl border border-gray-100 flex items-center gap-2 text-fluid-sm font-medium text-dashboard-text-primary">
                            <Clock className="w-3.5 h-3.5 text-dashboard-sage" />
                            {d.dayLabel} · {d.timeRange}
                        </div>
                        {d.countdown && (
                            <div className="bg-dashboard-success/10 px-3 py-1.5 rounded-xl border border-dashboard-success/20 flex items-center gap-1.5 text-fluid-sm font-semibold text-dashboard-success">
                                <Timer className="w-3.5 h-3.5" />
                                {d.countdown}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-fluid-xs">
                <Link href={`/bookings/${booking.id}`} className="block">
                    <Button className="min-h-tap px-6 rounded-2xl bg-dashboard-accent-start hover:bg-dashboard-accent-end text-white text-fluid-sm font-semibold shadow-lg shadow-dashboard-accent-start/10 transition-all hover:scale-[1.02]">
                        View Details
                    </Button>
                </Link>
                <Link href={`/dashboard/messages/${booking.id}`} className="block">
                    <Button
                        variant="ghost"
                        className="min-h-tap px-6 rounded-2xl bg-white border border-gray-200 text-dashboard-text-primary hover:bg-gray-50 text-fluid-sm font-semibold transition-all hover:scale-[1.02]"
                    >
                        Message
                    </Button>
                </Link>
            </div>
        </div>
    );
}
