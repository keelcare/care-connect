'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { SupportTicket, SupportStatus, SupportPriority } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { Textarea } from '@/components/ui/Textarea';
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    MessageSquare,
    Clock,
    ShieldCheck,
    Save,
    CheckCircle2,
    XCircle,
    Zap,
    User,
    ExternalLink,
    Tag,
    AlertTriangle,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

/* ─── helpers ───────────────────────────────────────────────── */

const STATUS_ACTIONS: { status: SupportStatus; label: string; className: string }[] = [
    { status: 'open', label: 'Open', className: 'border-sky-200 text-sky-700 bg-sky-50 hover:bg-sky-100' },
    { status: 'in_progress', label: 'In Progress', className: 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100' },
    { status: 'resolved', label: 'Resolved', className: 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100' },
    { status: 'closed', label: 'Closed', className: 'border-neutral-200 text-neutral-600 bg-neutral-50 hover:bg-neutral-100' },
];

const PRIORITY_OPTS: { value: SupportPriority; label: string; dot: string }[] = [
    { value: 'low', label: 'Low', dot: 'bg-neutral-300' },
    { value: 'medium', label: 'Medium', dot: 'bg-blue-400' },
    { value: 'high', label: 'High', dot: 'bg-orange-400' },
    { value: 'critical', label: 'Critical', dot: 'bg-red-500' },
];

function statusStyle(status: string) {
    switch (status) {
        case 'open': return 'bg-sky-50 text-sky-700 border-sky-100';
        case 'in_progress': return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'closed': return 'bg-neutral-100 text-neutral-500 border-neutral-200';
        default: return 'bg-neutral-100 text-neutral-500 border-neutral-200';
    }
}

function categoryIcon(category: string) {
    switch (category) {
        case 'payment': return '💳';
        case 'booking': return '📅';
        case 'technical': return '🔧';
        case 'grievance': return '⚠️';
        case 'account': return '👤';
        default: return '📬';
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

/* ─── component ─────────────────────────────────────────────── */

export default function TicketDetail() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [priority, setPriority] = useState<SupportPriority>('medium');
    const [notesDirty, setNotesDirty] = useState(false);

    useEffect(() => { fetchTicket(); }, [id]);

    const fetchTicket = async () => {
        try {
            setLoading(true);
            const data = await api.support.admin.listAll();
            const found = data.find(t => t.id === id);
            if (!found) throw new Error('not found');
            setTicket(found);
            setAdminNotes(found.admin_notes ?? '');
            setPriority(found.priority);
            setNotesDirty(false);
        } catch {
            toast.error('Could not load ticket');
        } finally {
            setLoading(false);
        }
    };

    const updateTicket = async (patch: { status?: SupportStatus; priority?: SupportPriority; admin_notes?: string }) => {
        if (!ticket) return;
        try {
            setSaving(true);
            const updated = await api.support.admin.update(ticket.id, patch);
            setTicket(updated);
            setAdminNotes(updated.admin_notes ?? '');
            setPriority(updated.priority);
            setNotesDirty(false);
            toast.success('Ticket updated');
        } catch {
            toast.error('Update failed');
        } finally {
            setSaving(false);
        }
    };

    const handleStatusChange = (status: SupportStatus) => updateTicket({ status });
    const handleSaveNotes = () => updateTicket({ priority, admin_notes: adminNotes });

    /* ── loading / 404 ── */
    if (loading) return <div className="h-[50vh] flex items-center justify-center"><Spinner /></div>;
    if (!ticket) return (
        <div className="text-center py-16">
            <p className="text-neutral-500 mb-4">Ticket not found.</p>
            <Button onClick={() => router.push('/admin/support')}>Back to Support</Button>
        </div>
    );

    const isCritical = ticket.priority === 'critical';

    return (
        <div className="w-full space-y-6 max-w-5xl">

            {/* ── Back + header ── */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.push('/admin/support')}
                    className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors shrink-0"
                >
                    <ArrowLeft size={17} />
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-xl font-bold text-primary-900 font-display">{ticket.ticket_number}</h1>
                        {isCritical && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                <Zap size={10} /> Critical
                            </span>
                        )}
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusStyle(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                        Opened {format(new Date(ticket.created_at), 'PPP')} · {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                    </p>
                </div>
            </div>

            {/* ── Body grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: ticket content + admin actions */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Ticket body */}
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-5">
                        <div>
                            <div className="flex items-start gap-3 flex-wrap mb-4">
                                <span className="text-xl">{categoryIcon(ticket.category)}</span>
                                <div>
                                    <h2 className="text-base font-bold text-neutral-900 leading-snug">{ticket.subject}</h2>
                                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{ticket.category}</span>
                                </div>
                            </div>
                            <div className="bg-neutral-50 rounded-xl p-5 text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed border border-neutral-100 font-medium">
                                {ticket.description}
                            </div>
                        </div>

                        {/* Metadata chips */}
                        <div className="flex flex-wrap gap-2 pt-1">
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-lg px-3 py-1.5">
                                <Calendar size={12} /> Created {format(new Date(ticket.created_at), 'PPp')}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-lg px-3 py-1.5">
                                <Tag size={12} /> {ticket.category}
                            </div>
                            {ticket.resolved_at && (
                                <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5">
                                    <CheckCircle2 size={12} /> Resolved {format(new Date(ticket.resolved_at), 'PPp')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status quick-actions */}
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Change Status</p>
                        <div className="flex flex-wrap gap-2">
                            {STATUS_ACTIONS.map(action => (
                                <button
                                    key={action.status}
                                    disabled={saving || ticket.status === action.status}
                                    onClick={() => handleStatusChange(action.status)}
                                    className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border transition-all duration-150 disabled:opacity-50 ${ticket.status === action.status
                                            ? `${action.className} ring-2 ring-offset-1 ring-current opacity-100`
                                            : action.className
                                        }`}
                                >
                                    {action.status === 'open' && <Clock size={12} />}
                                    {action.status === 'in_progress' && <MessageSquare size={12} />}
                                    {action.status === 'resolved' && <CheckCircle2 size={12} />}
                                    {action.status === 'closed' && <XCircle size={12} />}
                                    {action.label}
                                    {ticket.status === action.status && <span className="ml-1 text-[9px] font-bold opacity-60">CURRENT</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Priority + Admin Notes */}
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-4">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Admin Management</p>

                        {/* Priority selector */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-neutral-600">Priority Level</label>
                            <div className="flex gap-2 flex-wrap">
                                {PRIORITY_OPTS.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setPriority(opt.value); setNotesDirty(true); }}
                                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${priority === opt.value
                                                ? 'bg-neutral-800 text-white border-neutral-800'
                                                : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'
                                            }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Admin notes */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-neutral-600">Internal Notes</label>
                            <Textarea
                                placeholder="Add internal notes for other admins, resolution details, escalation context…"
                                className="min-h-[120px] rounded-xl bg-white border-neutral-200 resize-none text-sm font-medium p-4 focus:ring-accent"
                                value={adminNotes}
                                onChange={e => { setAdminNotes(e.target.value); setNotesDirty(true); }}
                            />
                            <p className="text-[10px] text-neutral-400">These notes are only visible to admins.</p>
                        </div>

                        <Button
                            onClick={handleSaveNotes}
                            disabled={saving || !notesDirty}
                            className="h-10 px-6 rounded-xl gap-2 text-sm font-semibold shadow-sm"
                        >
                            {saving ? <Spinner size="sm" /> : <><Save size={15} /> Save Changes</>}
                        </Button>
                    </div>
                </div>

                {/* RIGHT: user info + tips */}
                <div className="space-y-5">

                    {/* User info */}
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-5">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Requester</p>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-neutral-100 border-2 border-white shadow-md flex items-center justify-center text-2xl font-bold text-primary-900 mb-3">
                                {initials(ticket)}
                            </div>
                            <h3 className="text-base font-bold text-neutral-900">{fullName(ticket)}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded mt-1 ${ticket.role === 'parent' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                {ticket.role.toUpperCase()}
                            </span>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3 text-neutral-600">
                                <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                                    <Mail size={13} className="text-neutral-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase">Email</p>
                                    <p className="text-xs truncate">{ticket.users?.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-neutral-600">
                                <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                                    <Phone size={13} className="text-neutral-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase">Phone</p>
                                    <p className="text-xs">{ticket.users?.profiles?.phone || 'Not provided'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-neutral-600">
                                <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                                    <ShieldCheck size={13} className="text-neutral-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase">Verification</p>
                                    <p className="text-xs capitalize">{ticket.users?.identity_verification_status ?? 'Unknown'}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push(`/admin/users/${ticket.user_id}`)}
                            className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-accent border border-neutral-200 hover:border-accent/30 rounded-xl py-2.5 transition-all"
                        >
                            <ExternalLink size={12} /> View Profile
                        </button>
                    </div>

                    {/* Ticket metadata */}
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-3">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Timeline</p>
                        <div className="space-y-2">
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                                <div>
                                    <p className="text-[10px] font-semibold text-neutral-500">Opened</p>
                                    <p className="text-xs text-neutral-700">{format(new Date(ticket.created_at), 'PPp')}</p>
                                </div>
                            </div>
                            {ticket.updated_at !== ticket.created_at && (
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-300 mt-1.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-semibold text-neutral-500">Last Updated</p>
                                        <p className="text-xs text-neutral-700">{format(new Date(ticket.updated_at), 'PPp')}</p>
                                    </div>
                                </div>
                            )}
                            {ticket.resolved_at && (
                                <div className="flex items-start gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-semibold text-neutral-500">Resolved</p>
                                        <p className="text-xs text-neutral-700">{format(new Date(ticket.resolved_at), 'PPp')}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Support tips */}
                    <div className="bg-neutral-900 rounded-2xl p-5 text-white">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Support Tips</p>
                        <ul className="space-y-2.5">
                            {[
                                'Check payment transaction IDs before resolving billing disputes.',
                                'Leave detailed notes so other admins have full context.',
                                'Mark "Resolved" only after confirming resolution with the user.',
                                'Critical tickets should be escalated within 24 hours.',
                            ].map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-[11px] text-neutral-300 leading-relaxed">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
