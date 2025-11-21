"use client";

import React from 'react';
import { Calendar, MessageSquare, Star, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function DashboardPage() {
    const { user, loading } = useAuth();

    const stats = [
        { label: 'Total Bookings', value: '12', icon: Calendar },
        { label: 'Unread Messages', value: '3', icon: MessageSquare },
        { label: 'Hours of Care', value: '48', icon: Clock },
        { label: 'Average Rating', value: '4.9', icon: Star },
    ];

    const bookings = [
        { id: 1, title: 'Child Care for Sarah', date: 'Oct 24', time: '2:00 PM - 6:00 PM', status: 'confirmed', day: '24', month: 'Oct' },
        { id: 2, title: 'Senior Care for Robert', date: 'Oct 26', time: '9:00 AM - 1:00 PM', status: 'pending', day: '26', month: 'Oct' },
        { id: 3, title: 'Pet Sitting for Max', date: 'Oct 28', time: '10:00 AM - 11:00 AM', status: 'confirmed', day: '28', month: 'Oct' },
    ];

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Dashboard Overview</h1>
                <p className={styles.subtitle}>
                    {loading ? 'Welcome back!' : `Welcome back, ${user?.profiles?.first_name || 'User'}! Here's what's happening today.`}
                </p>
            </div>

            <div className={styles.statsGrid}>
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className={styles.statCard}>
                            <div className={styles.statInfo}>
                                <span className={styles.statLabel}>{stat.label}</span>
                                <span className={styles.statValue}>{stat.value}</span>
                            </div>
                            <div className={styles.statIcon}>
                                <Icon size={20} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Upcoming Bookings</h2>
                    <Button variant="text" size="sm" onClick={() => window.location.href = '/dashboard/bookings'}>
                        View All <ChevronRight size={16} />
                    </Button>
                </div>
                <div className={styles.bookingList}>
                    {bookings.map((booking) => (
                        <div key={booking.id} className={styles.bookingItem}>
                            <div className={styles.dateBox}>
                                <span className={styles.month}>{booking.month}</span>
                                <span className={styles.day}>{booking.day}</span>
                            </div>
                            <div className={styles.bookingInfo}>
                                <span className={styles.bookingTitle}>{booking.title}</span>
                                <span className={styles.bookingTime}>{booking.time}</span>
                            </div>
                            <span className={`${styles.statusBadge} ${booking.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
