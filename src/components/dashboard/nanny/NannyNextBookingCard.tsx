import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarClock, Clock, MessageSquare, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Booking } from '@/types/api';
import { getNextBookingDisplay, useMinuteNow } from '../nextBookingHelpers';

interface NannyNextBookingCardProps {
    booking?: Booking | null;
}

/** "Up Next" card for the nanny dashboard, styled to match its white/slate/navy scheme. */
export function NannyNextBookingCard({ booking }: NannyNextBookingCardProps) {
    const now = useMinuteNow();

    if (!booking) {
        return (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-11 h-11 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
                    <CalendarClock size={19} className="text-primary-400" />
                </div>
                <div>
                    <p className="font-semibold text-primary-900 text-sm">No upcoming sessions</p>
                    <p className="text-slate-400 text-xs mt-0.5">New bookings will show up here.</p>
                </div>
            </div>
        );
    }

    const d = getNextBookingDisplay(booking, now, 'nanny');

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            {/* Label + status */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <CalendarClock size={13} />
                    Up Next
                </div>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${d.isPending ? 'bg-amber-50 text-amber-700' : 'bg-primary-50 text-primary-700'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${d.isPending ? 'bg-amber-500' : 'bg-primary-600'}`} />
                    {d.isPending ? 'Pending' : 'Confirmed'}
                </span>
            </div>

            {/* Main content */}
            <div className="flex items-start gap-4 mb-4">
                {/* Date block */}
                <div className="bg-primary-50 rounded-xl min-w-[3.25rem] h-[3.25rem] flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] font-black uppercase text-primary-400 tracking-wider">{d.dateBlock.month}</span>
                    <span className="text-lg font-black text-primary-900 leading-none mt-0.5">{d.dateBlock.day}</span>
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 relative shrink-0">
                    <Image src={d.counterpartImage} alt={d.counterpartName} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-bold text-primary-900 text-sm truncate">{d.counterpartName}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock size={12} className="text-primary-400" />
                            {d.dayLabel} · {d.timeRange}
                        </span>
                        {d.countdown && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                <Timer size={12} />
                                {d.countdown}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <Link href={`/dashboard/bookings/${booking.id}`} className="flex-1 block">
                    <Button className="w-full h-9 rounded-xl bg-primary-900 hover:bg-primary-800 text-xs font-bold text-white">
                        View Details
                    </Button>
                </Link>
                <Link href={`/dashboard/messages/${booking.id}`} className="flex-1 block">
                    <Button
                        variant="outline"
                        className="w-full h-9 rounded-xl border-slate-200 text-xs font-semibold text-slate-600 gap-1.5"
                    >
                        <MessageSquare size={12} />
                        Message
                    </Button>
                </Link>
            </div>
        </div>
    );
}
