'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { SupportTicket, SupportStatus, SupportPriority } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Calendar,
    MessageSquare,
    Clock,
    ShieldCheck,
    AlertCircle,
    Save,
    CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from 'sonner';

export default function TicketDetail() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const { user } = useAuth();
    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [updateData, setUpdateData] = useState({
        status: '' as SupportStatus,
        priority: '' as SupportPriority,
        admin_notes: ''
    });

    useEffect(() => {
        if (user?.role !== 'admin') {
            router.push('/dashboard');
            return;
        }
        fetchTicket();
    }, [id, user]);

    const fetchTicket = async () => {
        try {
            setLoading(true);
            const data = await api.support.getTicket(id as string);
            setTicket(data);
            setUpdateData({
                status: data.status,
                priority: data.priority,
                admin_notes: data.admin_notes || ''
            });
        } catch (error) {
            console.error('Failed to fetch ticket:', error);
            toast.error('Failed to load ticket details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setSubmitting(true);
            await api.support.admin.update(id as string, updateData);
            toast.success('Ticket updated successfully');
            fetchTicket();
        } catch (error) {
            console.error('Failed to update ticket:', error);
            toast.error('Failed to update ticket');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="text-center py-12">
                <p className="text-neutral-500">Ticket not found</p>
                <Button onClick={() => router.push('/admin/support')} className="mt-4">Back to Dashboard</Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/admin/support')}
                    className="rounded-full w-10 h-10 p-0 hover:bg-neutral-100"
                >
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-primary-900 font-display">Ticket {ticket.ticket_number}</h1>
                    <p className="text-sm text-neutral-500">Created on {format(new Date(ticket.created_at), 'PPP')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details & Update Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[32px] p-8 border border-neutral-100 shadow-soft space-y-6">
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900 mb-2">{ticket.subject}</h2>
                            <div className="flex items-center gap-3 mb-6">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${ticket.status === 'open' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    ticket.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        ticket.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            'bg-neutral-50 text-neutral-600 border-neutral-200'
                                    }`}>
                                    {ticket.status?.replace('_', ' ')}
                                </span>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{ticket.category}</span>
                            </div>
                            <div className="bg-neutral-50 rounded-2xl p-6 text-neutral-700 whitespace-pre-wrap leading-relaxed border border-neutral-100">
                                {ticket.description}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest font-display">Resolution & Management</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-neutral-700">Update Status</label>
                                    <select
                                        className="w-full h-11 px-4 rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-accent outline-none appearance-none font-medium"
                                        value={updateData.status}
                                        onChange={(e) => setUpdateData({ ...updateData, status: e.target.value as SupportStatus })}
                                    >
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-neutral-700">Adjust Priority</label>
                                    <select
                                        className="w-full h-11 px-4 rounded-xl border border-neutral-200 bg-white focus:ring-2 focus:ring-accent outline-none appearance-none font-medium"
                                        value={updateData.priority}
                                        onChange={(e) => setUpdateData({ ...updateData, priority: e.target.value as SupportPriority })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-neutral-700">Admin Notes</label>
                                <Textarea
                                    placeholder="Internal notes or resolution details..."
                                    className="min-h-[140px] rounded-2xl bg-white border-neutral-200 resize-none font-medium p-4 focus:ring-accent"
                                    value={updateData.admin_notes}
                                    onChange={(e) => setUpdateData({ ...updateData, admin_notes: e.target.value })}
                                />
                                <p className="text-[10px] text-neutral-400">These notes are visible to the user as the ticket resolution progress.</p>
                            </div>

                            <Button
                                onClick={handleUpdate}
                                className="w-full h-12 rounded-xl shadow-md hover:shadow-lg transition-all gap-2 font-bold"
                                disabled={submitting}
                            >
                                {submitting ? <Spinner size="sm" /> : <><Save size={18} /> Update Ticket</>}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Column: User Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[32px] p-6 border border-neutral-100 shadow-soft">
                        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest font-display mb-6">Requester Info</h3>

                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-3xl font-bold text-primary-900 border-4 border-white shadow-md mb-3">
                                {ticket.users?.profiles?.first_name?.[0] || 'U'}
                            </div>
                            <h4 className="text-lg font-bold text-neutral-900">
                                {ticket.users?.profiles ? `${ticket.users.profiles.first_name} ${ticket.users.profiles.last_name}` : 'Unknown User'}
                            </h4>
                            <p className={`text-xs font-bold px-2 py-0.5 rounded mt-1 ${ticket.role === 'parent' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'}`}>
                                {ticket.role.toUpperCase()}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-neutral-600">
                                <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center flex-shrink-0 text-neutral-400">
                                    <Mail size={16} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">Email</p>
                                    <p className="text-sm font-medium truncate">{ticket.users?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-neutral-600">
                                <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center flex-shrink-0 text-neutral-400">
                                    <Phone size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">Phone</p>
                                    <p className="text-sm font-medium">{ticket.users?.profiles?.phone || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-neutral-600">
                                <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center flex-shrink-0 text-neutral-400">
                                    <ShieldCheck size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">Verification</p>
                                    <p className="text-sm font-medium capitalize">{ticket.users?.identity_verification_status || 'unverified'}</p>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full mt-8 rounded-xl border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                            onClick={() => router.push(`/admin/users/${ticket.user_id}`)}
                        >
                            View Full Profile
                        </Button>
                    </div>

                    <div className="bg-neutral-900 rounded-[32px] p-6 text-white shadow-xl">
                        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest font-display mb-4">Support Tips</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-xs text-neutral-300">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                                Double check payment transaction IDs before resolving payment disputes.
                            </li>
                            <li className="flex items-start gap-2 text-xs text-neutral-300">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                                Always leave detail notes for other admins to follow the context.
                            </li>
                            <li className="flex items-start gap-2 text-xs text-neutral-300">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                                Mark as "Resolved" only after confirmation from the user if possible.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
