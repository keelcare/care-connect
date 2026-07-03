'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { PaymentPlan, PaymentPlanStats, PriceSnapshot } from '@/types/api';
import { Spinner } from '@/components/ui/Spinner';
import {
  Wallet,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  TrendingUp,
  CreditCard,
  ChevronRight,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminPageHeader, StatCard } from '@/components/admin/ui';
import { logger } from '@/lib/logger';

export default function AdminPaymentPlansPage() {
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [stats, setStats] = useState<PaymentPlanStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const [plansData, statsData] = await Promise.all([
        api.admin.getPaymentPlans(),
        api.admin.getPaymentPlanStats(),
      ]);

      setPlans(plansData);
      setStats(statsData);
    } catch (err) {
      logger.error('Failed to load payment plans:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredPlans = plans.filter((plan) => {
    const fullName = `${plan.users?.profiles?.first_name || ''} ${plan.users?.profiles?.last_name || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || plan.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getProgress = (plan: PaymentPlan) => {
    // NEW: price_snapshots replaces payment_installments; 'charged' replaces 'paid'
    const paidCount = plan.price_snapshots?.filter(s => s.status === 'charged').length || 0;
    const total = plan.total_cycles || plan.price_snapshots?.length || 1;
    return Math.min(Math.round((paidCount / total) * 100), 100);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <AdminPageHeader
        eyebrow="Finance"
        title="Payment Plans"
        subtitle="Monitor subscriptions, installment progress, and collective revenue."
        icon={Wallet}
        actions={
          <Button variant="outline" size="sm" onClick={() => fetchData(true)} disabled={refreshing || loading} className="rounded-xl gap-2">
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Collected Revenue" value={loading ? '—' : formatCurrency(stats?.totalRevenue || 0)} icon={TrendingUp} tone="emerald" />
        <StatCard label="Total Plans" value={loading ? '—' : stats?.totalPlans || 0} icon={CreditCard} tone="violet" />
        <StatCard label="Active Plans" value={loading ? '—' : stats?.activePlans || 0} icon={Clock} tone="amber" />
        <StatCard label="Completed" value={loading ? '—' : stats?.completedPlans || 0} icon={CheckCircle2} tone="sky" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user name..."
            className="h-10 w-full pl-9 pr-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-accent/50 outline-none text-sm transition-all"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-4 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white outline-none text-sm min-w-[150px]"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Plans Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="h-80 flex flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="text-red-500 text-sm">{error}</p>
            <button
              onClick={() => fetchData()}
              className="px-4 py-2 rounded-xl bg-primary-900 text-white text-sm font-medium hover:bg-primary-800 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center text-neutral-400 gap-2">
            <Wallet size={40} className="opacity-20" />
            <p className="text-sm">No payment plans found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">User & Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">Duration</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Pricing</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Progress</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filteredPlans.map((plan) => {
                  const progress = getProgress(plan);
                  const userName = `${plan.users?.profiles?.first_name || 'Anonymous'} ${plan.users?.profiles?.last_name || ''}`;

                  return (
                    <tr key={plan.id} className="hover:bg-neutral-50/70 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-primary-900 leading-tight">
                              {userName}
                            </p>
                            <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider mt-0.5">
                              {plan.service_requests?.category || 'General Service'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {/* NEW: total_cycles replaces total_months */}
                        <p className="text-sm font-semibold text-neutral-700">{plan.total_cycles} Cycles</p>
                      </td>
                      <td className="px-6 py-4">
                        {/* NEW: read amount from price_snapshots instead of plan.total_amount / monthly_rate */}
                        {plan.price_snapshots && plan.price_snapshots.length > 0 ? (
                          <>
                            <p className="text-sm font-bold text-neutral-900">
                              {formatCurrency(plan.price_snapshots.reduce((sum: number, s: PriceSnapshot) => sum + (s.final_amount || 0), 0))}
                            </p>
                            <p className="text-[10px] text-neutral-400">
                              {formatCurrency(plan.price_snapshots[0]?.final_amount || 0)} / cycle
                            </p>
                          </>
                        ) : (
                          <p className="text-[10px] text-neutral-400">Pending first cycle</p>
                        )}
                      </td>
                      <td className="px-6 py-4 w-48">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-neutral-500 uppercase tracking-tighter">Installments</span>
                            <span className="text-accent">{progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(plan.status)}`}>
                          {plan.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 rounded-lg text-neutral-400 hover:text-primary-900 hover:bg-neutral-100 transition-all">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
