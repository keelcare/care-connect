'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import {
  PaymentAuditListResponse,
  PaymentAuditQuery,
  PaymentAuditRow,
  PaymentAuditStatus,
  PaymentAuditSummary,
} from '@/types/api';
import { Spinner } from '@/components/ui/Spinner';
import {
  AlertTriangle,
  CreditCard,
  RefreshCw,
  Search,
  ShieldAlert,
  Timer,
} from 'lucide-react';

const DEFAULT_PAGE_SIZE = 20;

function toIsoFromDateInput(value: string): string | undefined {
  if (!value) return undefined;
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

function toIsoToDateInput(value: string): string | undefined {
  if (!value) return undefined;
  return new Date(`${value}T23:59:59.999Z`).toISOString();
}

function formatDateTime(value?: string | null): string {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString();
}

function toInputDate(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function getStatusTone(statusRaw?: string) {
  const status = (statusRaw || '').toLowerCase();
  if (status === 'captured') {
    return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
  }
  if (status === 'failed') {
    return 'bg-red-100 text-red-700 border border-red-200';
  }
  return 'bg-amber-100 text-amber-700 border border-amber-200';
}

function normalizeAuditRow(item: Record<string, unknown>): PaymentAuditRow {
  const payment = (item.payment as Record<string, unknown> | undefined) ||
    (item.payments as Record<string, unknown> | undefined) ||
    null;

  return {
    id: String(item.id || ''),
    paymentId: (item.paymentId as string) || (item.payment_id as string) || undefined,
    orderId:
      (item.orderId as string) ||
      (item.order_id as string) ||
      (payment?.orderId as string) ||
      (payment?.order_id as string) ||
      undefined,
    bookingId:
      (item.bookingId as string) ||
      (item.booking_id as string) ||
      (payment?.bookingId as string) ||
      (payment?.booking_id as string) ||
      undefined,
    fromStatus:
      (item.fromStatus as string) ||
      (item.from_status as string) ||
      null,
    toStatus:
      ((item.toStatus as string) || (item.to_status as string) || 'created') as
        | PaymentAuditStatus
        | string,
    triggeredBy:
      (item.triggeredBy as string) ||
      (item.triggered_by as string) ||
      null,
    metadata:
      (item.metadata as Record<string, unknown>) ||
      (item.meta as Record<string, unknown>) ||
      null,
    createdAt:
      (item.createdAt as string) ||
      (item.created_at as string) ||
      new Date().toISOString(),
    payment: payment
      ? {
          id: (payment.id as string) || undefined,
          orderId:
            (payment.orderId as string) ||
            (payment.order_id as string) ||
            undefined,
          bookingId:
            (payment.bookingId as string) ||
            (payment.booking_id as string) ||
            undefined,
          razorpayOrderId:
            (payment.razorpayOrderId as string) ||
            (payment.razorpay_order_id as string) ||
            undefined,
          razorpayPaymentId:
            (payment.razorpayPaymentId as string) ||
            (payment.razorpay_payment_id as string) ||
            null,
          status: (payment.status as string) || undefined,
          amount: typeof payment.amount === 'number' ? payment.amount : undefined,
          currency:
            (payment.currency as string) ||
            undefined,
          createdAt:
            (payment.createdAt as string) ||
            (payment.created_at as string) ||
            undefined,
          updatedAt:
            (payment.updatedAt as string) ||
            (payment.updated_at as string) ||
            undefined,
        }
      : null,
  };
}

function normalizeAuditListResponse(
  response: PaymentAuditListResponse | Record<string, unknown>
): PaymentAuditListResponse {
  const rawItems = Array.isArray((response as Record<string, unknown>).items)
    ? ((response as Record<string, unknown>).items as Record<string, unknown>[])
    : [];

  const rawPagination =
    ((response as Record<string, unknown>).pagination as Record<string, unknown>) || {};

  const page = Number(rawPagination.page || 1);
  const pageSize = Number(rawPagination.pageSize || rawPagination.page_size || DEFAULT_PAGE_SIZE);
  const total = Number(rawPagination.total || rawPagination.count || 0);
  const totalPages = Number(
    rawPagination.totalPages || rawPagination.total_pages || Math.max(1, Math.ceil(total / pageSize))
  );

  return {
    items: rawItems.map(normalizeAuditRow),
    pagination: {
      page: Number.isFinite(page) ? page : 1,
      pageSize: Number.isFinite(pageSize) ? pageSize : DEFAULT_PAGE_SIZE,
      total: Number.isFinite(total) ? total : 0,
      totalPages: Number.isFinite(totalPages) ? totalPages : 1,
    },
  };
}

function getAuditPaymentId(row: PaymentAuditRow): string {
  return row.payment?.razorpayPaymentId || 'N/A';
}

function getAuditAmount(row: PaymentAuditRow): string {
  if (typeof row.payment?.amount !== 'number') return 'N/A';
  const currency = (row.payment.currency || 'INR').toUpperCase();
  return `${currency} ${row.payment.amount.toLocaleString()}`;
}

export default function AdminPaymentAuditPage() {
  const [summary, setSummary] = useState<PaymentAuditSummary | null>(null);
  const [auditRows, setAuditRows] = useState<PaymentAuditRow[]>([]);

  const [filters, setFilters] = useState<{
    orderId: string;
    bookingId: string;
    razorpayPaymentId: string;
    toStatus: '' | PaymentAuditStatus;
    triggeredBy: string;
    from: string;
    to: string;
  }>({
    orderId: '',
    bookingId: '',
    razorpayPaymentId: '',
    toStatus: '',
    triggeredBy: '',
    from: '',
    to: '',
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo<PaymentAuditQuery>(
    () => ({
      orderId: filters.orderId || undefined,
      bookingId: filters.bookingId || undefined,
      razorpayPaymentId: filters.razorpayPaymentId || undefined,
      toStatus: filters.toStatus || undefined,
      triggeredBy: filters.triggeredBy || undefined,
      from: toIsoFromDateInput(filters.from),
      to: toIsoToDateInput(filters.to),
      page,
      pageSize,
    }),
    [filters, page, pageSize]
  );

  const fetchSummary = useCallback(async () => {
    try {
      setSummaryLoading(true);
      const data = await api.payments.getAuditSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load payment audit summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const fetchAuditList = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        setError(null);
        const data = await api.payments.getAudit(query);
        const normalized = normalizeAuditListResponse(data as PaymentAuditListResponse);

        setAuditRows(normalized.items);
        setPagination(normalized.pagination);
      } catch (err) {
        console.error('Failed to load payment audits:', err);
        setError(err instanceof Error ? err.message : 'Failed to load audit logs');
      } finally {
        if (isRefresh) setRefreshing(false);
        else setLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchAuditList();
  }, [fetchAuditList]);

  const handleRefresh = async () => {
    await Promise.all([fetchSummary(), fetchAuditList(true)]);
  };

  const handleFilterChange = (
    key:
      | 'orderId'
      | 'bookingId'
      | 'razorpayPaymentId'
      | 'toStatus'
      | 'triggeredBy'
      | 'from'
      | 'to',
    value: string
  ) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setPage(1);
    setFilters({
      orderId: '',
      bookingId: '',
      razorpayPaymentId: '',
      toStatus: '',
      triggeredBy: '',
      from: '',
      to: '',
    });
  };

  const canPrev = pagination.page > 1;
  const canNext = pagination.page < pagination.totalPages;

  return (
    <div className="w-full space-y-6 lg:space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-primary-900 font-display leading-tight flex items-center gap-2">
            <CreditCard size={22} className="text-accent" />
            Payment Audit
          </h1>
          <p className="text-neutral-400 mt-1 text-xs sm:text-sm">
            Inspect payment state transitions, failures, and duplicate attempts.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 transition-colors px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 disabled:opacity-60"
        >
          <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-neutral-500">Failed (Last 7 Days)</p>
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle size={16} className="text-red-500" />
            </div>
          </div>
          {summaryLoading ? (
            <p className="text-sm text-neutral-400">Loading...</p>
          ) : (
            <p className="text-3xl font-bold tabular-nums text-red-600">
              {summary?.failedLast7Days ?? 0}
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-neutral-500">Duplicate Attempts (Last 7 Days)</p>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <ShieldAlert size={16} className="text-amber-600" />
            </div>
          </div>
          {summaryLoading ? (
            <p className="text-sm text-neutral-400">Loading...</p>
          ) : (
            <p className="text-3xl font-bold tabular-nums text-amber-700">
              {summary?.duplicateAttemptsLast7Days ?? 0}
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-neutral-500">Created Stuck {'>'}24h</p>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Timer size={16} className="text-indigo-600" />
            </div>
          </div>
          {summaryLoading ? (
            <p className="text-sm text-neutral-400">Loading...</p>
          ) : (
            <p className="text-3xl font-bold tabular-nums text-indigo-700">
              {summary?.createdStuckOver24Hours ?? 0}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
          <input
            type="text"
            value={filters.orderId}
            onChange={(e) => handleFilterChange('orderId', e.target.value)}
            placeholder="Order ID"
            className="h-9 w-full pl-9 pr-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-accent/50 outline-none text-sm transition-all"
          />
        </div>

        <input
          type="text"
          value={filters.bookingId}
          onChange={(e) => handleFilterChange('bookingId', e.target.value)}
          placeholder="Booking ID"
          className="h-9 min-w-[180px] px-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-accent/50 outline-none text-sm transition-all"
        />

        <input
          type="text"
          value={filters.razorpayPaymentId}
          onChange={(e) => handleFilterChange('razorpayPaymentId', e.target.value)}
          placeholder="Razorpay Payment ID"
          className="h-9 min-w-[220px] px-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-accent/50 outline-none text-sm transition-all"
        />

        <input
          type="text"
          value={filters.triggeredBy}
          onChange={(e) => handleFilterChange('triggeredBy', e.target.value)}
          placeholder="Triggered By"
          className="h-9 min-w-40 px-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-accent/50 outline-none text-sm transition-all"
        />

        <select
          value={filters.toStatus}
          onChange={(e) => handleFilterChange('toStatus', e.target.value)}
          className="h-9 min-w-[140px] px-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-accent/50 outline-none text-sm transition-all"
        >
          <option value="">All Statuses</option>
          <option value="created">created</option>
          <option value="captured">captured</option>
          <option value="failed">failed</option>
        </select>

        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-500">From</label>
          <input
            type="date"
            value={toInputDate(filters.from)}
            onChange={(e) => handleFilterChange('from', e.target.value)}
            className="h-9 px-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-accent/50 outline-none text-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-500">To</label>
          <input
            type="date"
            value={toInputDate(filters.to)}
            onChange={(e) => handleFilterChange('to', e.target.value)}
            className="h-9 px-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-accent/50 outline-none text-sm transition-all"
          />
        </div>

        <button
          onClick={clearFilters}
          className="text-xs font-medium text-accent hover:text-accent/80 transition-colors"
        >
          Clear filters
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <Spinner />
          </div>
        ) : error ? (
          <div className="h-80 flex flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="text-red-500 text-sm">{error}</p>
            <button
              onClick={() => fetchAuditList()}
              className="px-3 py-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-sm"
            >
              Retry
            </button>
          </div>
        ) : auditRows.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-sm text-neutral-400">
            No payment audit entries found for current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th className="px-5 py-3.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Time</th>
                  <th className="px-5 py-3.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-5 py-3.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Booking ID</th>
                  <th className="px-5 py-3.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Transition</th>
                  <th className="px-5 py-3.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Triggered By</th>
                  <th className="px-5 py-3.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Razorpay Payment ID</th>
                  <th className="px-5 py-3.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {auditRows.map((row) => (
                  <tr key={row.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="px-5 py-4 text-xs text-neutral-600 whitespace-nowrap">
                      {formatDateTime(row.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-primary-900 whitespace-nowrap">
                      {row.orderId || row.payment?.orderId || 'N/A'}
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-neutral-700 whitespace-nowrap">
                      {row.bookingId || row.payment?.bookingId || 'N/A'}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">{row.fromStatus || 'unknown'}</span>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStatusTone(String(row.toStatus))}`}>
                          {String(row.toStatus)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-neutral-700 whitespace-nowrap">
                      {row.triggeredBy || 'system'}
                    </td>
                    <td className="px-5 py-4 text-xs font-mono text-neutral-700 whitespace-nowrap">
                      {getAuditPaymentId(row)}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-right text-neutral-800 whitespace-nowrap">
                      {getAuditAmount(row)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-neutral-500">
          Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total records)
        </p>

        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setPage(1);
              setPageSize(newSize);
            }}
            className="h-9 px-3 rounded-lg border border-neutral-200 bg-white text-xs"
          >
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>

          <button
            onClick={() => canPrev && setPage((p) => p - 1)}
            disabled={!canPrev}
            className="px-3 py-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <button
            onClick={() => canNext && setPage((p) => p + 1)}
            disabled={!canNext}
            className="px-3 py-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {summary?.generatedAt && (
        <p className="text-[11px] text-neutral-400">
          Summary generated at: {formatDateTime(summary.generatedAt)}
        </p>
      )}
    </div>
  );
}
