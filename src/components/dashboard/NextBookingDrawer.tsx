import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, Clock, MessageSquare, Timer, CalendarClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusPill } from './StatusPill';
import { Booking } from '@/types/api';
import { getNextBookingDisplay, useMinuteNow } from './nextBookingHelpers';

interface NextBookingDrawerProps {
    /** Live (IN_PROGRESS) session takes priority over the next upcoming booking. */
    activeSession?: Booking | null;
    nextBooking?: Booking | null;
    userRole?: 'parent' | 'nanny';
}

// Per-role styling: parent dashboard uses the dashboard-* palette and has a
// BottomNavBar to clear; the nanny dashboard uses primary/emerald/amber and
// has no bottom nav, so the strip sits at the screen edge.
const ROLE_THEME = {
    parent: {
        stripBottom: 'bottom-[calc(5.5rem+env(safe-area-inset-bottom))]',
        liveColor: 'bg-dashboard-success',
        liveText: 'text-dashboard-success',
        countdownChip: 'text-dashboard-success bg-dashboard-success/10',
        countdownBlock: 'bg-dashboard-success/10 border-dashboard-success/20 text-dashboard-success',
        primaryBtn: 'bg-dashboard-accent-start hover:bg-dashboard-accent-end shadow-dashboard-accent-start/10',
        detailsHref: (id: string) => `/bookings/${id}`,
        messagesHref: (id: string) => `/dashboard/messages/${id}`,
    },
    nanny: {
        stripBottom: 'bottom-[calc(0.75rem+env(safe-area-inset-bottom))]',
        liveColor: 'bg-amber-500',
        liveText: 'text-amber-600',
        countdownChip: 'text-emerald-700 bg-emerald-50',
        countdownBlock: 'bg-emerald-50 border-emerald-100 text-emerald-700',
        primaryBtn: 'bg-primary-900 hover:bg-primary-800 shadow-primary-900/10',
        detailsHref: (id: string) => `/dashboard/bookings/${id}`,
        messagesHref: (id: string) => `/dashboard/messages/${id}`,
    },
} as const;

/**
 * Mobile-only persistent bottom drawer (Zepto/Urban Company style).
 * Collapsed: a compact strip pinned above the bottom nav bar.
 * Tap to expand into a full detail sheet with actions.
 */
export function NextBookingDrawer({ activeSession, nextBooking, userRole = 'parent' }: NextBookingDrawerProps) {
    const [expanded, setExpanded] = React.useState(false);
    const now = useMinuteNow();

    const booking = activeSession ?? nextBooking;
    const theme = ROLE_THEME[userRole];
    if (!booking) return null;

    const d = getNextBookingDisplay(booking, now, userRole);

    return (
        <div className="lg:hidden">
            {/* Collapsed strip — sits just above the BottomNavBar */}
            <AnimatePresence>
                {!expanded && (
                    <motion.button
                        initial={{ y: 80, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 80, opacity: 0 }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                        onClick={() => setExpanded(true)}
                        className={`fixed left-3 right-3 z-30 ${theme.stripBottom} bg-white/90 backdrop-blur-xl border border-gray-200/60 shadow-2xl rounded-2xl px-3 py-2.5 flex items-center gap-3 text-left`}
                        aria-label="View session details"
                    >
                        <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 relative">
                                <Image src={d.counterpartImage} alt={d.counterpartName} fill className="object-cover" />
                            </div>
                            {d.isLive && (
                                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${theme.liveColor} border-2 border-white animate-pulse`} />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-dashboard-text-secondary">
                                {d.isLive ? (
                                    <>
                                        <span className={`w-1.5 h-1.5 rounded-full ${theme.liveColor} animate-pulse`} />
                                        <span className={theme.liveText}>Happening Now</span>
                                    </>
                                ) : (
                                    <>
                                        <CalendarClock className="w-3 h-3" />
                                        <span>Up Next</span>
                                    </>
                                )}
                            </div>
                            <p className="text-sm font-semibold text-dashboard-text-primary truncate">
                                {d.counterpartName}
                                <span className="font-normal text-dashboard-text-secondary">
                                    {' '}· {d.isLive ? `until ${booking.end_time ? d.timeRange.split('—')[1].trim() : '...'}` : `${d.dayLabel}, ${d.startTime}`}
                                </span>
                            </p>
                        </div>

                        {d.countdown && !d.isLive && (
                            <span className={`shrink-0 text-[11px] font-bold px-2 py-1 rounded-full ${theme.countdownChip}`}>
                                {d.countdown.replace('Starts in ', 'in ')}
                            </span>
                        )}
                        <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Expanded sheet */}
            <AnimatePresence>
                {expanded && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setExpanded(false)}
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', bounce: 0.1, duration: 0.45 }}
                            drag="y"
                            dragConstraints={{ top: 0, bottom: 0 }}
                            dragElastic={{ top: 0, bottom: 0.6 }}
                            onDragEnd={(_, info) => {
                                if (info.offset.y > 90 || info.velocity.y > 500) setExpanded(false);
                            }}
                            className="fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
                        >
                            {/* Drag handle */}
                            <div className="flex justify-center pt-3 pb-1">
                                <div className="w-10 h-1.5 rounded-full bg-gray-300" />
                            </div>

                            <div className="px-5 pt-2">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-dashboard-text-secondary font-medium text-xs tracking-widest uppercase">
                                        <CalendarClock className="w-4 h-4" />
                                        <span>{d.isLive ? 'Current Session' : 'Up Next'}</span>
                                    </div>
                                    <StatusPill
                                        status={d.isLive ? 'active' : d.isPending ? 'pending' : 'active'}
                                        text={d.isLive ? 'Live' : d.isPending ? 'Pending' : 'Confirmed'}
                                        showDot={d.isLive || !d.isPending}
                                    />
                                </div>

                                {/* Counterpart */}
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-16 h-16 rounded-full p-0.5 bg-white border border-gray-100 shadow-sm relative shrink-0">
                                        <div className="w-full h-full rounded-full overflow-hidden relative">
                                            <Image src={d.counterpartImage} alt={d.counterpartName} fill className="object-cover" />
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-fluid-xl font-display font-medium text-dashboard-text-primary truncate">{d.counterpartName}</h3>
                                        <p className="text-dashboard-text-secondary text-sm">{d.counterpartRole}</p>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-2.5 mb-6">
                                    <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-dashboard-sage shrink-0" />
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wide text-dashboard-text-secondary">When</p>
                                            <p className="text-sm font-semibold text-dashboard-text-primary">{d.dayLabel} · {d.timeRange}</p>
                                        </div>
                                    </div>
                                    {d.countdown && (
                                        <div className={`border rounded-2xl px-4 py-3 flex items-center gap-3 ${theme.countdownBlock}`}>
                                            <Timer className="w-4 h-4 shrink-0" />
                                            <p className="text-sm font-semibold">{d.countdown}</p>
                                        </div>
                                    )}
                                    {booking.notes && (
                                        <div className="bg-gray-50 rounded-2xl px-4 py-3">
                                            <p className="text-[11px] font-bold uppercase tracking-wide text-dashboard-text-secondary mb-0.5">Notes</p>
                                            <p className="text-sm text-dashboard-text-primary line-clamp-3">{booking.notes}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3">
                                    <Link href={theme.detailsHref(booking.id)} className="flex-1 block">
                                        <Button className={`w-full min-h-tap rounded-2xl ${theme.primaryBtn} text-fluid-sm font-semibold text-white shadow-lg`}>
                                            View Details
                                        </Button>
                                    </Link>
                                    <Link href={theme.messagesHref(booking.id)} className="flex-1 block">
                                        <Button
                                            variant="ghost"
                                            className="w-full min-h-tap rounded-2xl bg-white border border-gray-200 text-fluid-sm font-semibold text-dashboard-text-primary hover:bg-gray-50"
                                        >
                                            <MessageSquare className="w-4 h-4 mr-1.5" />
                                            Message
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
