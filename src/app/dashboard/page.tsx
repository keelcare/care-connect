'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  MessageSquare,
  Star,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking } from '@/types/api';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface DashboardStats {
  totalBookings: number;
  unreadMessages: number;
  hoursOfCare: number;
  averageRating: number;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    unreadMessages: 0,
    hoursOfCare: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    // Auth checks moved to ProtectedRoute
    if (user && user.role === 'nanny') {
        fetchDashboardData();
    }
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [bookingsData, userData] = await Promise.all([
        api.bookings.getNannyBookings(),
        user?.id ? api.users.get(user.id) : Promise.resolve(null),
      ]);

      // Enrich bookings with parent details if not already populated
      const parentIdsToFetch = new Set<string>();
      bookingsData.forEach((booking) => {
        if (
          booking.parent_id &&
          !booking.parent?.profiles?.first_name &&
          !booking.parent?.profiles?.full_name
        ) {
          parentIdsToFetch.add(booking.parent_id);
        }
      });

      const parentMap = new Map<string, any>();
      const parentIds = Array.from(parentIdsToFetch);

      for (const parentId of parentIds) {
        try {
          const parentDetails = await api.users.get(parentId);
          parentMap.set(parentId, parentDetails);
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (err) {
          console.error(`Failed to fetch parent ${parentId}:`, err);
        }
      }

      const enrichedBookings = bookingsData.map((booking) => {
        if (booking.parent_id && parentMap.has(booking.parent_id)) {
          return { ...booking, parent: parentMap.get(booking.parent_id) };
        }
        return booking;
      });

      setBookings(enrichedBookings);

      const totalBookings = bookingsData.length;
      const completedBookings = bookingsData.filter(
        (b) => b.status === 'COMPLETED'
      );

      let totalHours = 0;
      completedBookings.forEach((booking) => {
        if (booking.start_time && booking.end_time) {
          const start = new Date(booking.start_time);
          const end = new Date(booking.end_time);
          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          totalHours += hours;
        }
      });

      const averageRating = (userData as any)?.averageRating || 0;

      setStats({
        totalBookings,
        unreadMessages: 0,
        hoursOfCare: Math.round(totalHours),
        averageRating: averageRating,
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load dashboard data'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString(),
      month: date.toLocaleString('default', { month: 'short' }),
    };
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getParentName = (booking: Booking) => {
    return booking.parent?.profiles?.first_name &&
      booking.parent?.profiles?.last_name
      ? `${booking.parent.profiles.first_name} ${booking.parent.profiles.last_name}`
      : booking.parent?.email || 'Parent';
  };

  const handleMessageBooking = async (booking: Booking) => {
    try {
      const chat = await api.chat.create({ bookingId: booking.id });
      router.push(`/dashboard/messages?booking=${booking.id}`);
    } catch (err) {
      console.error('Failed to start chat:', err);
    }
  };

  const upcomingBookings = bookings
    .filter((b) => ['CONFIRMED', 'IN_PROGRESS'].includes(b.status))
    .sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    )
    .slice(0, 3);

  const statsDisplay = [
    {
      icon: Calendar,
      label: 'Total Bookings',
      value: stats.totalBookings,
      color: 'text-primary-900',
      bg: 'bg-primary-50',
    },
    {
      icon: MessageSquare,
      label: 'Unread Messages',
      value: stats.unreadMessages,
      color: 'text-accent',
      bg: 'bg-accent/50',
    },
    {
      label: 'Hours of Care',
      value: stats.hoursOfCare.toString(),
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Average Rating',
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A',
      icon: Star,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50',
      href: '/nanny/reviews',
    },
  ];

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['nanny']}>
    <div className="min-h-screen bg-wellness-cream p-4 md:p-8 font-sans text-wellness-text">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. Welcome & Philosophy Section (Top-Left, Large) */}
            <div className="lg:col-span-2 bg-wellness-beige rounded-[32px] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden shadow-sm">
                 {/* Decorative background shape */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-wellness-peach rounded-full blur-[80px] opacity-60 -translate-y-1/2 translate-x-1/2"></div>
                 
                 <div className="relative z-10">
                    <p className="text-wellness-text/60 font-medium mb-4 uppercase tracking-widest text-xs">Daily Overview</p>
                    <h1 className="text-4xl md:text-5xl font-heading font-medium text-wellness-navy mb-6 leading-tight">
                        Hello, {user?.profiles?.first_name || 'Friend'}.<br/>
                        <span className="opacity-80 font-display italic">Ready for a mindful day?</span>
                    </h1>
                    
                    <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-md px-6 py-3 rounded-full text-wellness-text font-medium">
                        <span className="w-2 h-2 rounded-full bg-wellness-green"></span>
                        {bookings.length > 0 ? `You have ${bookings.length} active bookings` : "No bookings scheduled today"}
                    </div>
                 </div>
            </div>

            {/* 2. Stats / Quick Actions (Right Column, Vertical Stack) */}
            <div className="space-y-6">
                {/* Stats Card */}
                 <div className="bg-wellness-navy text-white rounded-[32px] p-8 shadow-md relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                         <Star size={120} />
                     </div>
                     <p className="opacity-70 text-sm mb-1 uppercase tracking-wider">Total Care Hours</p>
                     <p className="text-5xl font-display">{stats.hoursOfCare}</p>
                     <div className="mt-8 flex gap-2">
                         <div className="bg-white/10 px-4 py-2 rounded-full text-xs backdrop-blur-sm">
                             Since joining Keel
                         </div>
                     </div>
                 </div>

                 {/* Notifications / Messages */}
                 <Link href="/dashboard/messages" className="block">
                     <div className="bg-wellness-green/20 hover:bg-wellness-green/30 transition-colors rounded-[32px] p-8 flex items-center justify-between cursor-pointer group">
                        <div>
                             <p className="text-wellness-navy font-bold text-xl">{stats.unreadMessages} New Messages</p>
                             <p className="text-wellness-text/70 text-sm">Check your inbox</p>
                        </div>
                        <div className="bg-wellness-green text-white w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MessageSquare size={20} />
                        </div>
                     </div>
                 </Link>
            </div>

            {/* 3. Upcoming Bookings (Full Width Bottom) */}
            <div className="lg:col-span-3">
                 <div className="flex items-center justify-between mb-6 px-2">
                     <h2 className="text-2xl font-heading text-wellness-navy">Upcoming Schedule</h2>
                     <Link href="/dashboard/bookings" className="text-wellness-text/60 hover:text-wellness-navy text-sm font-medium transition-colors">
                        View Calendar →
                     </Link>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingBookings.length === 0 ? (
                        <div className="col-span-full bg-white rounded-[32px] p-12 text-center border border-wellness-beige">
                            <p className="text-wellness-text/50">No upcoming bookings. Time to relax!</p>
                            <Link href="/dashboard">
                                <Button className="mt-4 rounded-full bg-wellness-navy text-white hover:bg-wellness-navy/90">Book Care</Button>
                            </Link>
                        </div>
                    ) : (
                        upcomingBookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-[32px] p-6 border border-wellness-beige hover:border-wellness-peach transition-colors shadow-sm group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-wellness-cream p-3 rounded-2xl text-center min-w-[60px]">
                                        <div className="text-xs uppercase text-wellness-text/60">{formatDate(booking.start_time).month}</div>
                                        <div className="text-xl font-display font-bold text-wellness-navy">{formatDate(booking.start_time).day}</div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        booking.status === 'CONFIRMED' ? 'bg-wellness-green/20 text-wellness-navy' : 'bg-neutral-100 text-neutral-500'
                                    }`}>
                                        {booking.status}
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-heading text-wellness-navy mb-1">{booking.job?.title || 'Care Session'}</h3>
                                <p className="text-wellness-text/70 text-sm mb-6">with {getParentName(booking)}</p>
                                
                                <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                                    <div className="flex items-center text-xs text-wellness-text/60 gap-1">
                                        <Clock size={14} />
                                        {formatTime(booking.start_time)}
                                    </div>
                                    <button 
                                        onClick={() => handleMessageBooking(booking)}
                                        className="text-wellness-navy hover:text-wellness-terracotta transition-colors"
                                    >
                                        <MessageSquare size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                 </div>
            </div>
        </div>

    </div>
    </ProtectedRoute>
  );
}
