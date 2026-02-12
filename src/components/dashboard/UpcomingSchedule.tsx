import React from 'react';
import Link from 'next/link';
import { Calendar, MoreVertical, Clock } from 'lucide-react';
import { GlassCard, StatusPill } from './StatusPill';
import { Booking } from '@/types/api';

interface UpcomingScheduleProps {
    bookings?: Booking[];
    userRole?: 'parent' | 'nanny';
}

export function UpcomingSchedule({ bookings = [], userRole = 'parent' }: UpcomingScheduleProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            day: date.getDate().toString(),
            month: date.toLocaleString('default', { month: 'short' }).toUpperCase()
        };
    };

    const formatTime = (timeStr: string) => {
         try {
            const [hours, minutes] = timeStr.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes));
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        } catch (e) { return timeStr; }
    };

    return (
        <div className="@container space-y-fluid-xs">
             <div className="flex items-center justify-between px-1 mb-2">
                <h3 className="font-heading font-semibold text-fluid-lg text-dashboard-text-primary">Upcoming</h3>
                <Link href={userRole === 'nanny' ? "/dashboard/schedule" : "/bookings"} className="text-[10px] font-bold text-dashboard-sage hover:underline uppercase tracking-wide">
                    See All
                </Link>
            </div>

            <div className="space-y-2.5">
                {bookings.length === 0 ? (
                     <div className="p-fluid-xs text-center bg-white/50 rounded-xl border border-gray-100">
                        <p className="text-dashboard-text-secondary text-fluid-sm">No upcoming bookings</p>
                     </div>
                ) : (
                    bookings.map((booking) => {
                        // Use any cast to avoid type errors
                        const bookingDate = (booking as any).date || booking.created_at;
                        const { day, month } = formatDate(bookingDate);
                        
                        let displayName = 'Booking';
                        if (userRole === 'nanny') {
                             displayName = booking.parent?.profiles?.first_name 
                                ? `${booking.parent.profiles.first_name} ${booking.parent.profiles.last_name || ''}`.trim()
                                : 'Family Session';
                        } else {
                            displayName = booking.nanny?.profiles?.first_name 
                                ? `${booking.nanny.profiles.first_name} ${booking.nanny.profiles.last_name || ''}`.trim()
                                : 'Caregiver Booking';
                        }

                        return (
                            <GlassCard key={booking.id} hoverEffect className="p-fluid-xs flex items-center justify-between rounded-xl">
                                <div className="flex items-center gap-fluid-xs">
                                    <div className="bg-white rounded-xl min-w-[3rem] h-[3rem] flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                                        <span className="text-[9px] font-bold uppercase text-dashboard-text-secondary tracking-wider">{month}</span>
                                        <span className="text-fluid-lg font-heading font-bold text-dashboard-text-primary leading-none mt-0.5">{day}</span>
                                    </div>
                                    
                                    <div>
                                        <h4 className="font-semibold text-dashboard-text-primary text-fluid-sm line-clamp-1">
                                            {displayName}
                                        </h4>
                                        <div className="flex items-center gap-1.5 text-[11px] text-dashboard-text-secondary mt-0.5">
                                            <span>
                                                 {booking.status === 'CONFIRMED' ? 'Confirmed' : 'Pending'}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <Clock className="w-3 h-3" />
                                            <span>{formatTime(booking.start_time)}</span>
                                        </div>
                                    </div>
                                </div>
        
                                {/* <StatusPill 
                                    status={booking.status.toLowerCase() as any} 
                                    showDot={false} 
                                    className="bg-transparent border-0 px-0"
                                    text={booking.status === 'CONFIRMED' ? 'Confirmed' : 'Pending'} 
                                /> */}
                            </GlassCard>
                        );
                    })
                )}
            </div>
            
            {/* Calendar Sync Widget */}
            {/* <div className="bg-dashboard-mint/50 rounded-2xl p-4 flex items-center gap-3 border border-dashboard-success/10 cursor-pointer hover:bg-dashboard-mint transition-colors">
                <div className="w-10 h-10 rounded-full bg-dashboard-success/20 flex items-center justify-center text-dashboard-success">
                    <Calendar className="w-5 h-5" />
                </div>
                <div className="text-sm font-medium text-dashboard-childcare-primary">
                    Sync with your calendar
                </div>
            </div> */}
        </div>
    );
}
