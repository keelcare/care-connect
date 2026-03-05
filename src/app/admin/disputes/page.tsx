'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ShieldX,
  FileText,
  ChevronRight,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { AdminDispute, SupportTicket, SupportStatus } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

type PageTab = 'disputes' | 'appeals';

// ─── Disputes Tab ──────────────────────────────────────────────────────────────

function DisputesTab() {
  const [disputes, setDisputes] = useState<AdminDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'investigating' | 'resolved'>('all');
  const [selectedDispute, setSelectedDispute] = useState<AdminDispute | null>(null);
  const [resolution, setResolution] = useState('');
  const [resolving, setResolving] = useState(false);

  useEffect(() => { fetchDisputes(); }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const data = await api.enhancedAdmin.getDisputes();
      setDisputes(data);
    } catch {
      setError('Failed to load disputes');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedDispute || !resolution.trim()) return;
    setResolving(true);
    try {
      await api.enhancedAdmin.resolveDispute(selectedDispute.id, resolution);
      setDisputes(prev =>
        prev.map(d => d.id === selectedDispute.id ? { ...d, status: 'resolved' as const, resolution } : d)
      );
      setSelectedDispute(null);
      setResolution('');
    } catch (err) {
      console.error('Failed to resolve dispute:', err);
    } finally {
      setResolving(false);
    }
  };

  const filteredDisputes = disputes.filter(d => filter === 'all' || d.status === filter);

  const statusColor = (s: string) => ({
    open: 'bg-red-100 text-red-700 border-red-200',
    investigating: 'bg-amber-100 text-amber-700 border-amber-200',
    resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  }[s] ?? 'bg-stone-100 text-stone-700 border-stone-200');

  if (loading) return <LoadingSpinner />;

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'open', 'investigating', 'resolved'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
              filter === s ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            )}
          >{s}</button>
        ))}
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="space-y-4">
        {filteredDisputes.length === 0 ? (
          <EmptyState message={filter === 'all' ? 'No disputes have been reported yet.' : `No ${filter} disputes.`} />
        ) : (
          filteredDisputes.map(dispute => (
            <div key={dispute.id} className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn('px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border', statusColor(dispute.status))}>
                      {dispute.status === 'resolved' ? <CheckCircle size={12} /> : dispute.status === 'open' ? <AlertTriangle size={12} /> : <Clock size={12} />}
                      {dispute.status}
                    </span>
                    <span className="text-sm text-stone-400">{new Date(dispute.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-semibold text-stone-900 mb-1">Booking #{dispute.booking_id.slice(0, 8)}</h3>
                  <p className="text-stone-600 mb-4">{dispute.reason}</p>
                  {dispute.resolution && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <p className="text-sm font-medium text-emerald-700 mb-1">Resolution:</p>
                      <p className="text-emerald-800">{dispute.resolution}</p>
                    </div>
                  )}
                </div>
                {dispute.status !== 'resolved' && (
                  <Button onClick={() => setSelectedDispute(dispute)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resolution Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-stone-900 mb-2">Resolve Dispute</h3>
            <p className="text-stone-500 mb-4">Provide a resolution for this dispute.</p>
            <div className="bg-stone-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-stone-700 mb-1">Reason:</p>
              <p className="text-stone-600">{selectedDispute.reason}</p>
            </div>
            <textarea
              value={resolution}
              onChange={e => setResolution(e.target.value)}
              placeholder="Enter your resolution..."
              rows={4}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 resize-none mb-4"
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => { setSelectedDispute(null); setResolution(''); }} className="flex-1 rounded-xl">Cancel</Button>
              <Button onClick={handleResolve} disabled={!resolution.trim() || resolving} isLoading={resolving} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl">
                Submit Resolution
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Ban Appeals Tab ────────────────────────────────────────────────────────────

function AppealsTab() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState<SupportStatus>('in_progress');
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchAppeals(); }, []);

  const fetchAppeals = async () => {
    try {
      setLoading(true);
      const data = await api.support.admin.listAll();
      // Show all "account" category tickets (ban appeals)
      setTickets(data.filter(t => t.category === 'account'));
    } catch {
      setError('Failed to load ban appeals');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      const updated = await api.support.admin.update(selected.id, {
        status: newStatus,
        admin_notes: adminNotes.trim() || undefined,
      });
      setTickets(prev => prev.map(t => t.id === selected.id ? updated : t));
      setSelected(null);
      setAdminNotes('');
    } catch (err) {
      console.error('Failed to update ticket:', err);
    } finally {
      setUpdating(false);
    }
  };

  const openSelected = (ticket: SupportTicket) => {
    setSelected(ticket);
    setAdminNotes(ticket.admin_notes ?? '');
    setNewStatus(ticket.status);
  };

  const filtered = tickets.filter(t => filter === 'all' || t.status === filter);

  const statusColor = (s: string) => ({
    open: 'bg-red-100 text-red-700 border-red-200',
    in_progress: 'bg-amber-100 text-amber-700 border-amber-200',
    resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    closed: 'bg-stone-100 text-stone-600 border-stone-200',
  }[s] ?? 'bg-stone-100 text-stone-700 border-stone-200');

  const statusLabel = (s: string) => ({ open: 'Open', in_progress: 'In Progress', resolved: 'Resolved', closed: 'Closed' }[s] ?? s);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filter === s ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            )}
          >{s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <EmptyState message={filter === 'all' ? 'No ban appeals submitted yet.' : `No ${statusLabel(filter).toLowerCase()} appeals.`} />
        ) : (
          filtered.map(ticket => {
            const userName = ticket.users?.profiles
              ? `${ticket.users.profiles.first_name ?? ''} ${ticket.users.profiles.last_name ?? ''}`.trim() || ticket.users.email
              : ticket.users?.email ?? 'Unknown user';

            return (
              <div key={ticket.id} className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Header row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={cn('px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border', statusColor(ticket.status))}>
                        {ticket.status === 'resolved' || ticket.status === 'closed' ? <CheckCircle size={12} /> : ticket.status === 'open' ? <ShieldX size={12} /> : <Clock size={12} />}
                        {statusLabel(ticket.status)}
                      </span>
                      <span className="text-xs font-mono text-stone-400 bg-stone-50 px-2 py-1 rounded-lg">#{ticket.ticket_number}</span>
                      <span className="text-sm text-stone-400">{new Date(ticket.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>

                    {/* User info */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                        <User size={14} className="text-stone-500" />
                      </div>
                      <span className="text-sm font-semibold text-stone-800">{userName}</span>
                      {ticket.users?.email && (
                        <span className="text-xs text-stone-400">{ticket.users.email}</span>
                      )}
                    </div>

                    {/* Subject + description */}
                    <h3 className="font-semibold text-stone-900 mb-1">{ticket.subject}</h3>
                    <p className="text-sm text-stone-600 leading-relaxed line-clamp-2">{ticket.description}</p>

                    {ticket.admin_notes && (
                      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <p className="text-xs font-semibold text-blue-700 mb-1">Admin Notes:</p>
                        <p className="text-sm text-blue-800">{ticket.admin_notes}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => openSelected(ticket)}
                    className="shrink-0 flex items-center gap-1 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-800 transition"
                  >
                    Review <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-xl font-semibold text-stone-900">Ban Appeal</h3>
                <p className="text-xs text-stone-400 font-mono mt-0.5">#{selected.ticket_number}</p>
              </div>
              <span className={cn('px-3 py-1 rounded-full text-xs font-medium border mt-1', statusColor(selected.status))}>
                {statusLabel(selected.status)}
              </span>
            </div>

            {/* User info */}
            {selected.users && (
              <div className="bg-stone-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Submitted by</p>
                <p className="font-medium text-stone-900">
                  {selected.users.profiles
                    ? `${selected.users.profiles.first_name ?? ''} ${selected.users.profiles.last_name ?? ''}`.trim() || selected.users.email
                    : selected.users.email}
                </p>
                <p className="text-sm text-stone-500">{selected.users.email}</p>
              </div>
            )}

            {/* Appeal content */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">Appeal Statement</p>
              <p className="text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">{selected.description}</p>
            </div>

            {/* Admin response */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-stone-700 mb-2">Admin Notes (optional)</label>
              <textarea
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                placeholder="Add internal notes or a response to the user..."
                rows={3}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none text-sm"
              />
            </div>

            {/* Status */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-stone-700 mb-2">Update Status</label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as SupportStatus)}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-sm bg-white appearance-none"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved (Appeal Accepted)</option>
                <option value="closed">Closed (Appeal Denied)</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setSelected(null)} className="flex-1 rounded-xl">Cancel</Button>
              <Button
                onClick={handleUpdate}
                disabled={updating}
                isLoading={updating}
                className="flex-1 bg-stone-900 hover:bg-stone-800 text-white rounded-xl"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Shared helpers ─────────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6">{message}</div>;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-stone-400" />
      </div>
      <h3 className="text-lg font-semibold text-stone-900 mb-2">Nothing here</h3>
      <p className="text-stone-500">{message}</p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────────

export default function AdminDisputesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<PageTab>('disputes');

  // AdminLayout guarantees auth and role = 'admin'

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900 font-display sm:text-3xl">Disputes & Appeals</h1>
            <p className="text-sm text-stone-500 sm:text-base">Review booking disputes and account ban appeals</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex w-full overflow-x-auto pb-1 sm:pb-0 sm:w-fit">
          <div className="flex gap-1 bg-stone-100/80 p-1.5 rounded-xl w-max">
            <button
              onClick={() => setTab('disputes')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-sm font-medium transition-all',
                tab === 'disputes' ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-900/5' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'
              )}
            >
              <AlertTriangle size={16} /> <span className="hidden sm:inline">Booking</span> Disputes
            </button>
            <button
              onClick={() => setTab('appeals')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg text-sm font-medium transition-all',
                tab === 'appeals' ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-900/5' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200/50'
              )}
            >
              <ShieldX size={16} /> Ban Appeals
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
        {tab === 'disputes' ? <DisputesTab /> : <AppealsTab />}
      </div>
    </div>
  );
}
