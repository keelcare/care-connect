import React from 'react';
import { Clock, MapPin, Play, MessageSquare, ChevronRight } from 'lucide-react';
import { Booking } from '@/types/api';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface NextUpSessionProps {
    booking?: Booking;
    onMessage?: () => void;
    onCheckIn?: () => void;
}

export function NextUpSession({ booking, onMessage, onCheckIn }: NextUpSessionProps) {
    if (!booking) {
        return (
             <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center h-[300px]">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">No upcoming sessions</h3>
                <p className="text-gray-500 max-w-xs">You're all caught up! Enjoy your free time.</p>
            </div>
        );
    }

    const parentName = booking.parent?.profiles?.first_name 
        ? `${booking.parent.profiles.first_name} ${booking.parent.profiles.last_name || ''}`
        : 'Parent';
    
    // Fallback logic for child image if not available
    const childImage = '/placeholder-child.png'; 

    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={childImage} alt="Child" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    
                    <div className="pt-2">
                        {booking.status === 'IN_PROGRESS' ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full mb-2 animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Current Session
                            </div>
                        ) : (
                            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full mb-2">
                                Next Up
                            </div>
                        )}
                        <h2 className="text-fluid-3xl font-display font-bold text-gray-900 mb-1">
                            Session with {booking.job?.title || 'Family'}
                        </h2>
                        <p className="text-gray-500 font-medium">The {parentName} Family</p>
                    </div>
                </div>

                {/* Decorative circle */}
                <div className="hidden md:flex w-20 h-20 rounded-full bg-gray-50 items-center justify-center">
                    <ChevronRight className="w-8 h-8 text-gray-300" />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 mb-8 relative z-10">
                <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">
                        {format(new Date(booking.start_time), 'h:mm a')} - {booking.end_time ? format(new Date(booking.end_time), 'h:mm a') : 'Unknown'}
                    </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">
                        {/* Mock address since it might not be fully populated in booking object yet */}
                         742 Evergreen Terrace
                    </span>
                </div>
            </div>

            <div className="flex gap-4 relative z-10">
                <Button 
                    onClick={onCheckIn}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-base font-semibold shadow-lg shadow-blue-200"
                >
                    <Play className="w-4 h-4 mr-2 fill-current" /> Check In
                </Button>
                <Button 
                    onClick={onMessage}
                    variant="outline"
                    className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl py-6 text-base font-semibold"
                >
                    <MessageSquare className="w-4 h-4 mr-2" /> Message Parent
                </Button>
            </div>
        </div>
    );
}
