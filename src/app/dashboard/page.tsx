"use client";

import React from 'react';
import Link from 'next/link';
import { Calendar, MessageSquare, Star, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
    const { user, loading } = useAuth();

    const stats = [
        { label: 'Total Bookings', value: '12', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Unread Messages', value: '3', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Hours of Care', value: '48', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'Average Rating', value: '4.9', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    ];

    const bookings = [
        { id: 1, title: 'Child Care for Sarah', date: 'Oct 24', time: '2:00 PM - 6:00 PM', status: 'confirmed', day: '24', month: 'Oct' },
        { id: 2, title: 'Senior Care for Robert', date: 'Oct 26', time: '9:00 AM - 1:00 PM', status: 'pending', day: '26', month: 'Oct' },
        { id: 3, title: 'Pet Sitting for Max', date: 'Oct 28', time: '10:00 AM - 11:00 AM', status: 'confirmed', day: '28', month: 'Oct' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 font-display">Dashboard Overview</h1>
                    <p className="text-neutral-500 mt-1">
                        {loading ? 'Welcome back!' : `Welcome back, ${user?.profiles?.first_name || 'User'}! Here's what's happening today.`}
                    </p>
                </div>
                <Button className="rounded-full bg-primary hover:bg-primary-600 text-white shadow-lg hover:shadow-xl transition-all px-6">
                    Find Care
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-soft hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</h3>
                                </div>
                                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                                    <Icon size={20} className={stat.color} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Bookings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-neutral-900 font-display">Upcoming Bookings</h2>
                        <Link href="/dashboard/bookings">
                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary-600 hover:bg-primary-50">
                                View All <ChevronRight size={16} className="ml-1" />
                            </Button>
                        </Link>
                    </div>

                    {/* Next Booking Card with Gradient Border */}
                    {bookings.length > 0 && (
                        <div className="p-[2px] rounded-[26px] bg-gradient-to-r from-primary to-secondary shadow-md">
                            <div className="bg-white rounded-[24px] p-6">
                                <div className="flex items-center gap-2 mb-4 text-primary font-bold text-sm uppercase tracking-wider">
                                    <Star size={14} fill="currentColor" /> Next Booking
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                    <div className="flex-shrink-0 w-20 h-20 bg-primary-50 rounded-2xl flex flex-col items-center justify-center text-primary">
                                        <span className="text-xs font-bold uppercase">{bookings[0].month}</span>
                                        <span className="text-2xl font-bold">{bookings[0].day}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-neutral-900 mb-2">{bookings[0].title}</h3>
                                        <div className="flex flex-wrap gap-4 text-neutral-500 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Clock size={16} />
                                                {bookings[0].time}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                Confirmed
                                            </div>
                                        </div>
                                    </div>
                                    <Button className="rounded-xl">View Details</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Other Bookings */}
                    <div className="bg-white rounded-[24px] border border-neutral-100 shadow-soft overflow-hidden">
                        <div className="divide-y divide-neutral-100">
                            {bookings.slice(1).map((booking) => (
                                <div key={booking.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-neutral-50 transition-colors">
                                    <div className="flex-shrink-0 w-14 h-14 bg-neutral-50 rounded-xl flex flex-col items-center justify-center text-neutral-600">
                                        <span className="text-[10px] font-bold uppercase">{booking.month}</span>
                                        <span className="text-lg font-bold">{booking.day}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-bold text-neutral-900 truncate">{booking.title}</h4>
                                        <p className="text-neutral-500 flex items-center gap-2 mt-1 text-sm">
                                            <Clock size={14} />
                                            {booking.time}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity / Notifications Placeholder */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-neutral-900 font-display">Recent Activity</h2>
                    <div className="bg-white rounded-[24px] border border-neutral-100 shadow-soft p-6 space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary flex-shrink-0">
                                    <MessageSquare size={18} />
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-900 font-medium">New message from Sarah</p>
                                    <p className="text-xs text-neutral-500 mt-1">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full rounded-xl border-neutral-200">View All Activity</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
