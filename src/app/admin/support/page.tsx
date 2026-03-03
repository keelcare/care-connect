'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { SupportTicket, SupportStatus, SupportPriority } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import {
    Search,
    Filter,
    ChevronRight,
    User,
    Clock,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    ArrowUpDown,
    ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminSupportDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchTickets();
        } else if (user) {
            router.push('/dashboard');
        }
    }, [user]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const data = await api.support.admin.listAll();
            setTickets(data);
        } catch (error) {
            console.error('Failed to fetch admin tickets:', error);
            toast.error('Failed to load all support tickets');
        } finally {
            setLoading(false);
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.users?.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1.5 w-fit">
                    <Clock size={12} /> Open
                </span>;
            case 'in_progress':
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1.5 w-fit">
                    <MessageSquare size={12} /> In Progress
                </span>;
            case 'resolved':
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1.5 w-fit">
                    <CheckCircle2 size={12} /> Resolved
                </span>;
            case 'closed':
                return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-50 text-neutral-600 border border-neutral-200 flex items-center gap-1.5 w-fit">
                    <AlertCircle size={12} /> Closed
                </span>;
            default: return null;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'critical': return <span className="text-[10px] font-bold text-red-600 uppercase tracking-tight bg-red-50 px-1.5 py-0.5 rounded border border-red-100">Critical</span>;
            case 'high': return <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tight bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">High</span>;
            case 'medium': return <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Medium</span>;
            default: return <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-tight bg-neutral-50 px-1.5 py-0.5 rounded border border-neutral-100">Low</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary-900 font-display">Support Management</h1>
                    <p className="text-neutral-500 mt-2">Manage and resolve user grievances across the platform.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search tickets, users..."
                            className="h-11 pl-10 pr-4 rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-accent outline-none w-64 text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-white border border-neutral-200 rounded-xl p-1">
                        <button
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === 'all' ? 'bg-accent text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                            onClick={() => setStatusFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === 'open' ? 'bg-accent text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                            onClick={() => setStatusFilter('open')}
                        >
                            Open
                        </button>
                        <button
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === 'in_progress' ? 'bg-accent text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                            onClick={() => setStatusFilter('in_progress')}
                        >
                            Pending
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-neutral-100 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-100">
                                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Ticket</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Subject</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-center">Priority</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {filteredTickets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 font-medium">
                                        No tickets found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-neutral-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="font-mono text-sm font-bold text-primary-900">{ticket.ticket_number}</div>
                                            <div className="text-[10px] text-neutral-400 mt-1 uppercase font-semibold">{format(new Date(ticket.created_at), 'MMM d, HH:mm')}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-primary-900 font-bold border border-white shadow-sm overflow-hidden">
                                                    {ticket.users?.profiles?.first_name?.[0] || ticket.users?.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-neutral-900 leading-tight">
                                                        {ticket.users?.profiles ? `${ticket.users.profiles.first_name} ${ticket.users.profiles.last_name}` : 'Unknown User'}
                                                    </div>
                                                    <div className="text-xs text-neutral-500 mt-0.5">{ticket.users?.email}</div>
                                                    <div className={`text-[10px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded ${ticket.role === 'parent' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                                        {ticket.role.toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-medium text-neutral-900 truncate max-w-[240px]">{ticket.subject}</div>
                                            <div className="text-xs text-neutral-400 mt-1 uppercase font-bold tracking-tighter">{ticket.category}</div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex justify-center">
                                                {getPriorityBadge(ticket.priority)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStatusBadge(ticket.status)}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="rounded-xl hover:bg-neutral-100 text-neutral-500 hover:text-accent group-hover:scale-105 transition-all gap-1.5"
                                                onClick={() => router.push(`/admin/support/${ticket.id}`)}
                                            >
                                                Manage <ExternalLink size={14} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Total Active</p>
                    <p className="text-3xl font-black text-primary-900">{tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').length}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Open Tickets</p>
                    <p className="text-3xl font-black text-blue-600">{tickets.filter(t => t.status === 'open').length}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">In Progress</p>
                    <p className="text-3xl font-black text-amber-600">{tickets.filter(t => t.status === 'in_progress').length}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Critical Issues</p>
                    <p className="text-3xl font-black text-red-600">{tickets.filter(t => t.priority === 'critical' && t.status !== 'closed').length}</p>
                </div>
            </div>
        </div>
    );
}
