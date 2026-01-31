'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { AdminStats, AdminAdvancedStats } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import {
  Users,
  Calendar,
  CheckCircle,
  Bell,
  AlertTriangle,
  Star,
  Settings,
  TrendingUp,
  DollarSign,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import styles from './page.module.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [advancedStats, setAdvancedStats] = useState<AdminAdvancedStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    let intervalId: NodeJS.Timeout;

    if (user) {
      fetchStats();
      // Poll every 30 seconds
      intervalId = setInterval(() => {
        fetchStats(true);
      }, 30000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [user]);

  const fetchStats = async (isPolling = false) => {
    try {
      if (!isPolling) {
        setLoading(true);
        setError(null);
      }

      const [basicStats, advanced] = await Promise.all([
        api.admin.getStats(),
        api.enhancedAdmin.getAdvancedStats().catch(() => null),
      ]);
      setStats(basicStats);
      setAdvancedStats(advanced);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      if (!isPolling) {
        setError(
          err instanceof Error ? err.message : 'Failed to load statistics'
        );
      }
    } finally {
      if (!isPolling) {
        setLoading(false);
      }
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
        <p className="text-red-600 mb-4">
          {error || 'Failed to load dashboard'}
        </p>
        <Button onClick={() => fetchStats()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 font-display">
          Admin Dashboard
        </h1>
        <p className="text-neutral-500 mt-2 text-lg">
          Manage users, bookings, and system settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-primary-900">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Total Users</p>
            <p className="text-2xl font-bold text-neutral-900">
              {stats.totalUsers}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">
              Total Bookings
            </p>
            <p className="text-2xl font-bold text-primary-900">
              {stats.totalBookings}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">
              Active Bookings
            </p>
            <p className="text-2xl font-bold text-primary-900">
              {stats.activeBookings}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-primary-900">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <Button
            className="h-auto py-6 text-lg justify-start px-8 rounded-2xl shadow-md hover:shadow-lg transition-all bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
            onClick={() => router.push('/admin/disputes')}
          >
            <AlertTriangle className="mr-3" size={24} />
            View Disputes
          </Button>
          <Button
            className="h-auto py-6 text-lg justify-start px-8 rounded-2xl shadow-md hover:shadow-lg transition-all bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
            onClick={() => router.push('/admin/reviews')}
          >
            <Star className="mr-3" size={24} />
            Moderate Reviews
          </Button>
          <Button
            className="h-auto py-6 text-lg justify-start px-8 rounded-2xl shadow-md hover:shadow-lg transition-all bg-neutral-50 text-neutral-700 border border-neutral-200 hover:bg-neutral-100"
            onClick={() => router.push('/admin/settings')}
          >
            <Settings className="mr-3" size={24} />
            System Settings
          </Button>
          <Button
            className="h-auto py-6 text-lg justify-start px-8 rounded-2xl shadow-md hover:shadow-lg transition-all bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
            onClick={() => router.push('/admin/verifications')}
          >
            <ShieldCheck className="mr-3" size={24} />
            Verify Nannies
          </Button>
        </div>
      </div>

      {/* Advanced Analytics Section */}
      {advancedStats && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-primary-900">Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-2xl border border-emerald-200">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={20} className="text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  Completion Rate
                </span>
              </div>
              <p className="text-3xl font-bold text-emerald-800">
                {advancedStats.completionRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle size={20} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  Acceptance Rate
                </span>
              </div>
              <p className="text-3xl font-bold text-blue-800">
                {advancedStats.acceptanceRate.toFixed(1)}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-2xl border border-amber-200">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign size={20} className="text-amber-600" />
                <span className="text-sm font-medium text-amber-700">
                  Total Revenue
                </span>
              </div>
              <p className="text-3xl font-bold text-amber-800">
                ₹{advancedStats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-2xl border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={20} className="text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  Peak Hour
                </span>
              </div>
              <p className="text-3xl font-bold text-purple-800">
                {advancedStats.popularBookingTimes?.[0]?.hour || 9}:00
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
