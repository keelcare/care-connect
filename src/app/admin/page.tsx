"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { AdminStats } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { Users, Calendar, CheckCircle, Bell } from 'lucide-react';
import styles from './page.module.css';

export default function AdminDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }

        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.admin.getStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
            setError(err instanceof Error ? err.message : 'Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[calc(100vh-120px)] flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center p-8">
                <p className="text-red-600 mb-4">{error || 'Failed to load dashboard'}</p>
                <Button onClick={fetchStats}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900 font-display">Admin Dashboard</h1>
                <p className="text-neutral-500 mt-2 text-lg">Manage users, bookings, and system settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-soft flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-900">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500">Total Users</p>
                        <p className="text-2xl font-bold text-neutral-900">{stats.totalUsers}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-soft flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500">Total Bookings</p>
                        <p className="text-2xl font-bold text-neutral-900">{stats.totalBookings}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-soft flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-neutral-500">Active Bookings</p>
                        <p className="text-2xl font-bold text-neutral-900">{stats.activeBookings}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-neutral-900">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                        className="h-auto py-6 text-lg justify-start px-8 rounded-2xl shadow-md hover:shadow-lg transition-all"
                        onClick={() => router.push('/admin/users')}
                    >
                        <Users className="mr-3" size={24} />
                        Manage Users
                    </Button>
                    <Button
                        className="h-auto py-6 text-lg justify-start px-8 rounded-2xl shadow-md hover:shadow-lg transition-all"
                        onClick={() => router.push('/admin/bookings')}
                    >
                        <Calendar className="mr-3" size={24} />
                        Manage Bookings
                    </Button>
                    <Button
                        className="h-auto py-6 text-lg justify-start px-8 rounded-2xl shadow-md hover:shadow-lg transition-all bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50"
                        onClick={() => router.push('/admin/notifications')}
                    >
                        <Bell className="mr-3" size={24} />
                        Send Notifications
                    </Button>
                </div>
            </div>
        </div>
    );
}
