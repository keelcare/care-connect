"use client";

import React from 'react';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

// Mock data until API is ready
const MOCK_BOOKINGS = [
    {
        id: '1',
        service: 'Nanny Service',
        provider: 'Sarah Jenkins',
        date: '2023-11-25',
        time: '09:00 AM - 05:00 PM',
        status: 'confirmed',
    },
    {
        id: '2',
        service: 'Babysitting',
        provider: 'Michael Chen',
        date: '2023-11-28',
        time: '06:00 PM - 10:00 PM',
        status: 'pending',
    },
    {
        id: '3',
        service: 'Nanny Service',
        provider: 'Emily Davis',
        date: '2023-11-20',
        time: '08:00 AM - 04:00 PM',
        status: 'cancelled',
    }
];

export default function BookingsPage() {
    const getStatusClass = (status: string) => {
        switch (status) {
            case 'confirmed': return styles.status_confirmed;
            case 'pending': return styles.status_pending;
            case 'cancelled': return styles.status_cancelled;
            default: return '';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleString('default', { month: 'short' })
        };
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Bookings</h1>
                <p className={styles.subtitle}>Manage your upcoming and past appointments</p>
            </div>

            {MOCK_BOOKINGS.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No bookings found.</p>
                    <Button variant="primary" style={{ marginTop: '1rem' }} onClick={() => window.location.href = '/search'}>
                        Find Care
                    </Button>
                </div>
            ) : (
                <div className={styles.bookingsList}>
                    {MOCK_BOOKINGS.map((booking) => {
                        const { day, month } = formatDate(booking.date);
                        return (
                            <div key={booking.id} className={styles.bookingCard}>
                                <div className={styles.bookingInfo}>
                                    <div className={styles.dateBox}>
                                        <span className={styles.day}>{day}</span>
                                        <span className={styles.month}>{month}</span>
                                    </div>
                                    <div className={styles.details}>
                                        <span className={styles.serviceTitle}>{booking.service}</span>
                                        <span className={styles.provider}>with {booking.provider}</span>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)' }}>{booking.time}</span>
                                    </div>
                                </div>
                                <span className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
