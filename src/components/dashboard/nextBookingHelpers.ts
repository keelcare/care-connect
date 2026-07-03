import { useEffect, useState } from 'react';
import { Booking } from '@/types/api';

export interface NextBookingDisplay {
    /** The other party: the nanny when viewed by a parent, the parent when viewed by a nanny. */
    counterpartName: string;
    counterpartImage: string;
    counterpartRole: 'Nanny' | 'Parent';
    isLive: boolean;
    isPending: boolean;
    dayLabel: string;      // "Today" | "Tomorrow" | "Fri, Jul 4"
    timeRange: string;     // "3:00 PM — 7:00 PM"
    startTime: string;     // "3:00 PM"
    countdown: string | null; // "Starts in 2h 15m" (null once started or > 24h away)
    dateBlock: { day: string; month: string };
}

const formatTime = (isoString?: string | null) => {
    if (!isoString) return '...';
    try {
        return new Date(isoString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } catch {
        return String(isoString);
    }
};

export function getNextBookingDisplay(
    booking: Booking,
    now: Date = new Date(),
    viewerRole: 'parent' | 'nanny' = 'parent',
): NextBookingDisplay {
    let counterpartName: string;
    let counterpartImage: string;
    if (viewerRole === 'nanny') {
        counterpartName = booking.parent?.profiles?.first_name
            ? `${booking.parent.profiles.first_name} ${booking.parent.profiles.last_name || ''}`.trim()
            : 'Family Session';
        counterpartImage = booking.parent?.profiles?.profile_image_url || '/placeholder-avatar.png';
    } else {
        counterpartName = booking.nanny?.profiles?.first_name
            ? `${booking.nanny.profiles.first_name} ${booking.nanny.profiles.last_name || ''}`.trim()
            : (booking.nanny_name || 'Caregiver');
        counterpartImage = booking.nanny?.profiles?.profile_image_url || '/placeholder-avatar.png';
    }

    const start = new Date(booking.start_time);
    const isLive = booking.status === 'IN_PROGRESS';
    const isPending = booking.status === 'REQUESTED';

    const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayDiff = Math.round((startOfDay(start) - startOfDay(now)) / 86_400_000);
    const dayLabel = dayDiff === 0
        ? 'Today'
        : dayDiff === 1
            ? 'Tomorrow'
            : start.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    const msUntil = start.getTime() - now.getTime();
    let countdown: string | null = null;
    if (!isLive && msUntil > 0 && msUntil < 24 * 60 * 60 * 1000) {
        const totalMins = Math.ceil(msUntil / 60_000);
        const h = Math.floor(totalMins / 60);
        const m = totalMins % 60;
        countdown = h > 0 ? `Starts in ${h}h ${m}m` : `Starts in ${m}m`;
    }

    return {
        counterpartName,
        counterpartImage,
        counterpartRole: viewerRole === 'nanny' ? 'Parent' : 'Nanny',
        isLive,
        isPending,
        dayLabel,
        startTime: formatTime(booking.start_time),
        timeRange: `${formatTime(booking.start_time)} — ${booking.end_time ? formatTime(booking.end_time) : '...'}`,
        countdown,
        dateBlock: {
            day: start.getDate().toString(),
            month: start.toLocaleString('default', { month: 'short' }).toUpperCase(),
        },
    };
}

/** Returns the current time, refreshed every minute, so countdowns stay fresh. */
export function useMinuteNow() {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(id);
    }, []);
    return now;
}
