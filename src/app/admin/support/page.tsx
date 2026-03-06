'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { SupportTicket } from '@/types/api';
import { Spinner } from '@/components/ui/Spinner';
import {
    Search,
    RefreshCw,
    LifeBuoy,
    Clock,
    MessageSquare,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Zap,
    ChevronRight,
    TrendingUp,
    Tag,
    Filter,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

/* ─── helpers ───────────────────────────────────────────────── */

const STATUS_TABS = [
    { key: 'all', label: 'All' },
    { key: 'open', label: 'Open' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
    { key: 'closed', label: 'Closed' },
] as const;

const PRIORITY_OPTS = [
    { key: 'all', label: 'All Priorities' },
    { key: 'critical', label: 'Critical' },
    { key: 'high', label: 'High' },
    { key: 'medium', label: 'Medium' },
    { key: 'low', label: 'Low' },
] as const;

const CATEGORY_OPTS = [
    'all', 'payment', 'booking', 'technical', 'grievance', 'account', 'other',
];

function statusStyle(status: string) {
    switch (status) {
        case 'open': return { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-100', icon: Clock, label: 'Open' };
        case 'in_progress': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', icon: MessageSquare, label: 'In Progress' };
        case 'resolved': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: CheckCircle2, label: 'Resolved' };
        case 'closed': return { bg: 'bg-neutral-100', text: 'text-neutral-500', border: 'border-neutral-200', icon: XCircle, label: 'Closed' };
        default: return { bg: 'bg-neutral-100', text: 'text-neutral-500', border: 'border-neutral-200', icon: Clock, label: status };
    }
}

function priorityStyle(priority: string) {
    switch (priority) {
        case 'critical': return { dot: 'bg-red-500', badge: 'bg-red-50 text-red-600 border-red-100', label: 'Critical' };
        case 'high': return { dot: 'bg-orange-400', badge: 'bg-orange-50 text-orange-600 border-orange-100', label: 'High' };
        case 'medium': return { dot: 'bg-blue-400', badge: 'bg-blue-50 text-blue-600 border-blue-100', label: 'Medium' };
        default: return { dot: 'bg-neutral-300', badge: 'bg-neutral-50 text-neutral-500 border-neutral-200', label: 'Low' };
    }
}

function initials(ticket: SupportTicket) {
    const p = ticket.users?.profiles;
    if (p?.first_name) return `${p.first_name[0]}${p.last_name?.[0] ?? ''}`.toUpperCase();
    return ticket.users?.email?.[0]?.toUpperCase() ?? '?';
}

function fullName(ticket: SupportTicket) {
    const p = ticket.users?.profiles;
    if (p?.first_name) return `${p.first_name} ${p.last_name ?? ''}`.trim();
    return 'Unknown User';
}

/* ─── stat card ─────────────────────────────────────────────── */
interface StatCardProps {
    label: string;
    value: number;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    valueColor?: string;
    onClick?: () => void;
}

function StatCard({ label, value, icon: Icon, iconBg, iconColor, valueColor = 'text-primary-900', onClick }: StatCardProps) {
    return (
        <button
            onClick={onClick}
            className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 text-left w-full group"
        >
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-neutral-500">{label}</p>
                <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
                    <Icon size={16} className={iconColor} />
                </div>
            </div>
            <p className={`text-3xl font-bold tabular-nums ${valueColor}`}>{value}</p>
        </button>
    );
}

/* ─── main ──────────────────────────────────────────────────── */

export default function AdminSupportDashboard() {
    const router = useRouter();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    useEffect(() => { fetchTickets(); }, []);

    const fetchTickets = async (silent = false) => {
        try {
            if (silent) setRefreshing(true);
            else setLoading(true);
            const data = await api.support.admin.listAll();
            setTickets(data);
        } catch {
            toast.error('Failed to load support tickets');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    /* ── stats ── */
    const stats = useMemo(() => ({
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        critical: tickets.filter(t => t.priority === 'critical' && t.status !== 'closed' && t.status !== 'resolved').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
    }), [tickets]);

    /* ── filtered list ── */
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return tickets.filter(t => {
            if (activeTab !== 'all' && t.status !== activeTab) return false;
            if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
            if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
            if (q) {
                return (
                    t.subject.toLowerCase().includes(q) ||
                    t.ticket_number.toLowerCase().includes(q) ||
                    fullName(t).toLowerCase().includes(q) ||
                    (t.users?.email?.toLowerCase().includes(q) ?? false)
                );
            }
            return true;
        });
    }, [tickets, search, activeTab, priorityFilter, categoryFilter]);

    /* ── sort: critical + open first ── */
    const sorted = useMemo(() => {
        const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
        const statusOrder: Record<string, number> = { open: 0, in_progress: 1, resolved: 2, closed: 3 };
        return [...filtered].sort((a, b) => {
            const sA = statusOrder[a.status] ?? 9;
            const sB = statusOrder[b.status] ?? 9;
            if (sA !== sB) return sA - sB;
            return (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9);
        });
    }, [filtered]);

    if (loading) {
        return (
            <div className="h-[50vh] flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 lg:space-y-8">

            {/* ── Header ── */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-primary-900 font-display leading-tight flex items-center gap-2">
                        <LifeBuoy size={22} className="text-accent" />
                        Support
                    </h1>
                    <p className="text-neutral-400 mt-1 text-xs sm:text-sm">
                        Manage and resolve user tickets across the platform.
                    </p>
                </div>
                <button
                    onClick={() => fetchTickets(true)}
                    disabled={refreshing}
                    className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 transition-colors px-3 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 shrink-0"
                >
                    <RefreshCw size={12} className={refreshing ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="All Tickets" value={stats.total} icon={TrendingUp} iconBg="bg-indigo-50" iconColor="text-indigo-500" onClick={() => setActiveTab('all')} />
                <StatCard label="Open" value={stats.open} icon={Clock} iconBg="bg-sky-50" iconColor="text-sky-500" valueColor="text-sky-700" onClick={() => setActiveTab('open')} />
                <StatCard label="In Progress" value={stats.inProgress} icon={MessageSquare} iconBg="bg-amber-50" iconColor="text-amber-500" valueColor="text-amber-700" onClick={() => setActiveTab('in_progress')} />
                <StatCard label="Critical" value={stats.critical} icon={Zap} iconBg="bg-red-50" iconColor="text-red-500" valueColor="text-red-600" onClick={() => setPriorityFilter(priorityFilter === 'critical' ? 'all' : 'critical')} />
            </div>

            {/* ── Filters Row ── */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 flex flex-wrap items-center gap-3">

                {/* Search */}
                <div className="relative flex-1 min-w-[180px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                    <input
                        type="text"
                        placeholder="Search ticket, user, email…"
                        className="h-9 w-full pl-9 pr-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-accent/50 outline-none text-sm transition-all"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Priority select */}
                <div className="relative">
                    <Filter size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <select
                        className="h-9 pl-8 pr-8 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-accent/50 outline-none text-xs font-medium text-neutral-600 appearance-none cursor-pointer transition-all"
                        value={priorityFilter}
                        onChange={e => setPriorityFilter(e.target.value)}
                    >
                        {PRIORITY_OPTS.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                    </select>
                </div>

                {/* Category select */}
                <div className="relative">
                    <Tag size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                    <select
                        className="h-9 pl-8 pr-8 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-accent/50 outline-none text-xs font-medium text-neutral-600 appearance-none cursor-pointer transition-all"
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                    >
                        {CATEGORY_OPTS.map(c => (
                            <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                    </select>
                </div>

                {/* Active filter count badge */}
                {(priorityFilter !== 'all' || categoryFilter !== 'all' || search) && (
                    <button
                        onClick={() => { setSearch(''); setPriorityFilter('all'); setCategoryFilter('all'); }}
                        className="text-xs font-medium text-accent hover:text-accent/80 transition-colors"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* ── Status Tabs ── */}
            <div className="flex items-center gap-1 bg-white border border-neutral-100 rounded-xl shadow-sm p-1 w-fit">
                {STATUS_TABS.map(tab => {
                    const count = tab.key === 'all'
                        ? tickets.length
                        : tickets.filter(t => t.status === tab.key).length;
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${isActive ? 'bg-accent text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
                                }`}
                        >
                            {tab.label}
                            <span className={`text-[10px] font-bold tabular-nums rounded-full px-1.5 py-0.5 ${isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-400'
                                }`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                {sorted.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-300">
                        <LifeBuoy size={36} />
                        <p className="text-sm font-medium text-neutral-400">No tickets match your filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-neutral-50 border-b border-neutral-100">
                                    <th className="px-5 py-3.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Ticket</th>
                                    <th className="px-5 py-3.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">User</th>
                                    <th className="px-5 py-3.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Subject</th>
                                    <th className="px-5 py-3.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-center">Priority</th>
                                    <th className="px-5 py-3.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                                    <th className="px-5 py-3.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Age</th>
                                    <th className="px-5 py-3.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {sorted.map(ticket => {
                                    const st = statusStyle(ticket.status);
                                    const pr = priorityStyle(ticket.priority);
                                    const StatusIcon = st.icon;
                                    const isCritical = ticket.priority === 'critical' && ticket.status !== 'closed' && ticket.status !== 'resolved';
                                    return (
                                        <tr
                                            key={ticket.id}
                                            onClick={() => router.push(`/admin/support/${ticket.id}`)}
                                            className={`group cursor-pointer transition-colors hover:bg-neutral-50/70 ${isCritical ? 'border-l-2 border-l-red-400' : ''}`}
                                        >
                                            {/* Ticket # */}
                                            <td className="px-5 py-4">
                                                <p className="font-mono text-xs font-bold text-primary-900">{ticket.ticket_number}</p>
                                                <p className="text-[10px] text-neutral-400 mt-0.5">
                                                    {format(new Date(ticket.created_at), 'MMM d, HH:mm')}
                                                </p>
                                            </td>

                                            {/* User */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-[11px] font-bold text-primary-900 shrink-0 border border-neutral-200">
                                                        {initials(ticket)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-semibold text-neutral-800 truncate leading-tight">{fullName(ticket)}</p>
                                                        <p className="text-[10px] text-neutral-400 truncate">{ticket.users?.email}</p>
                                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block ${ticket.role === 'parent' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                                                            }`}>
                                                            {ticket.role.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Subject */}
                                            <td className="px-5 py-4 max-w-[220px]">
                                                <p className="text-sm font-medium text-neutral-800 truncate">{ticket.subject}</p>
                                                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">{ticket.category}</span>
                                            </td>

                                            {/* Priority */}
                                            <td className="px-5 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded border ${pr.badge}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${pr.dot}`} />
                                                    {pr.label}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${st.bg} ${st.text} ${st.border}`}>
                                                    <StatusIcon size={11} />
                                                    {st.label}
                                                </span>
                                            </td>

                                            {/* Age */}
                                            <td className="px-5 py-4">
                                                <p className="text-[11px] text-neutral-500 font-medium">
                                                    {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                                                </p>
                                            </td>

                                            {/* CTA */}
                                            <td className="px-5 py-4 text-right">
                                                <div className="inline-flex items-center gap-1 text-xs font-medium text-neutral-400 group-hover:text-accent transition-colors">
                                                    Manage <ChevronRight size={14} />
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer */}
                {sorted.length > 0 && (
                    <div className="px-5 py-3 border-t border-neutral-50 bg-neutral-50/50">
                        <p className="text-[10px] text-neutral-400 font-medium">
                            Showing {sorted.length} of {tickets.length} tickets
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
