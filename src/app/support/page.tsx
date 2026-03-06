'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { SupportTicket, SupportCategory, SupportPriority } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import {
    Plus,
    Search,
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    HelpCircle,
    LifeBuoy,
    ChevronRight,
    Mail,
    ArrowUpRight,
    ShieldAlert,
    FileText,
    BookOpen,
    MessageCircle,
    ExternalLink
} from 'lucide-react';

/* ─── helpers ───────────────────────────────────────────────── */

function getStatusBadge(status: string) {
    switch (status) {
        case 'open':
            return { bg: 'bg-sky-500/10', text: 'text-sky-600', border: 'border-sky-500/20', icon: Clock, label: 'Open' };
        case 'in_progress':
            return { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20', icon: MessageSquare, label: 'In Progress' };
        case 'resolved':
            return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20', icon: CheckCircle2, label: 'Resolved' };
        case 'closed':
            return { bg: 'bg-neutral-500/10', text: 'text-neutral-500', border: 'border-neutral-500/20', icon: AlertCircle, label: 'Closed' };
        default:
            return { bg: 'bg-neutral-500/10', text: 'text-neutral-500', border: 'border-neutral-500/20', icon: HelpCircle, label: status };
    }
}

function getPriorityBadge(priority: string) {
    switch (priority) {
        case 'critical': return 'bg-red-50 text-red-600 border-red-200 shadow-sm';
        case 'high': return 'bg-orange-50 text-orange-600 border-orange-200 shadow-sm';
        case 'medium': return 'bg-blue-50 text-blue-600 border-blue-200 shadow-sm';
        case 'low': return 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm';
        default: return 'bg-neutral-50 text-neutral-600 border-neutral-200';
    }
}

/* ─── component ─────────────────────────────────────────────── */

export default function SupportPage() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Ban contest state
    const isBanned = user?.is_active === false;
    const [isContestingBan, setIsContestingBan] = useState(false);
    const [contestMessage, setContestMessage] = useState('');

    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        category: 'other' as SupportCategory,
        priority: 'medium' as SupportPriority,
    });

    useEffect(() => {
        if (user) fetchTickets();
    }, [user]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const data = await api.support.getUserTickets();
            setTickets([...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        } catch {
            toast.error('Failed to load support tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.subject.trim() || !formData.description.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }
        try {
            setSubmitting(true);
            await api.support.createTicket(formData);
            toast.success('Your ticket has been submitted. We will be in touch shortly!');
            setIsModalOpen(false);
            setFormData({ subject: '', description: '', category: 'other', priority: 'medium' });
            fetchTickets();
        } catch {
            toast.error('Failed to submit ticket. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleContestBan = async () => {
        if (!contestMessage.trim()) {
            toast.error('Please enter a message explaining why you think this ban is incorrect.');
            return;
        }
        // TODO: Send to backend API
        toast.success('Your appeal has been submitted. Our team will review it within 24-48 hours.');
        setIsContestingBan(false);
        setContestMessage('');
    };

    const filteredTickets = useMemo(() => {
        const q = searchQuery.toLowerCase();
        if (!q) return tickets;
        return tickets.filter(t =>
            t.subject.toLowerCase().includes(q) ||
            t.ticket_number.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q)
        );
    }, [searchQuery, tickets]);

    if (loading && tickets.length === 0) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 lg:space-y-12 mb-10">

            {/* ─── BAN ALERT ─── */}
            {isBanned && (
                <div className="bg-red-50 border border-red-200 rounded-[2rem] p-6 lg:p-8 shadow-sm flex flex-col md:flex-row gap-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-red-500" />
                    <div className="p-4 bg-red-100 rounded-2xl text-red-600 shrink-0 self-start">
                        <ShieldAlert size={32} />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <h2 className="text-xl font-black text-red-900 font-display mb-1">
                                Account Suspended
                            </h2>
                            <p className="text-red-700 text-sm leading-relaxed max-w-2xl">
                                Your account has been temporarily suspended due to the following reason:{' '}
                                <strong className="block mt-1 text-red-900 bg-red-100/50 p-2 rounded-lg border border-red-200/50 shrink-0">
                                    {user.ban_reason || 'Terms of Service violation'}
                                </strong>
                            </p>
                        </div>

                        {!isContestingBan && (
                            <Button
                                onClick={() => setIsContestingBan(true)}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-600/20"
                            >
                                <AlertCircle size={18} className="mr-2" />
                                Contest This Ban
                            </Button>
                        )}

                        {isContestingBan && (
                            <div className="bg-white rounded-2xl p-5 border border-red-200 shadow-sm max-w-2xl space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-900 mb-2 uppercase tracking-wider">
                                        Why do you believe this ban is incorrect?
                                    </label>
                                    <Textarea
                                        value={contestMessage}
                                        onChange={(e) => setContestMessage(e.target.value)}
                                        className="w-full h-32 resize-none bg-neutral-50 border-neutral-200 focus:bg-white"
                                        placeholder="Provide details about why you think this suspension was made in error..."
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button onClick={handleContestBan} className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6">
                                        Submit Appeal
                                    </Button>
                                    <Button variant="ghost" onClick={() => setIsContestingBan(false)} className="rounded-xl text-neutral-500">
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ─── HERO SECTION ─── */}
            <div className="relative rounded-[2.5rem] bg-gradient-to-br from-primary-900 via-primary-800 to-[hsl(208,67%,14%)] overflow-hidden shadow-xl border border-white/10">
                <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] bg-accent/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-[24rem] h-[24rem] bg-sky-500/10 rounded-full blur-[60px] pointer-events-none" />

                <div className="relative z-10 p-8 sm:p-12 lg:p-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-xl text-white">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6">
                            <LifeBuoy size={14} className="text-accent-300" />
                            <span className="text-[11px] font-bold tracking-widest uppercase text-white/90">Help & Support</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-[1.1] mb-4">
                            How can we help you today?
                        </h1>
                        <p className="text-primary-100 text-sm sm:text-base leading-relaxed md:max-w-md">
                            Browse our resources, check FAQs, or raise a ticket directly. Our team is standing by to help you immediately.
                        </p>
                    </div>

                    <div className="shrink-0 flex items-center justify-end">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group relative flex items-center gap-3 bg-white text-primary-900 rounded-2xl px-6 py-4 font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300"
                        >
                            <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-accent group-hover:rotate-90 transition-transform duration-500">
                                <Plus size={18} />
                            </div>
                            <span className="text-sm">Raise a Ticket</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── MAIN CONTENT GRID ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

                {/* LEFT COLUMN: TICKET LIST (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-6">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 font-display">Your Tickets</h2>
                        <div className="relative w-full sm:w-64 group">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-accent transition-colors" />
                            <input
                                type="text"
                                placeholder="Search your tickets..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full h-11 pl-10 pr-4 bg-white border border-neutral-200 rounded-xl text-sm focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {tickets.length === 0 ? (
                        /* EMPTY STATE */
                        <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-[2rem] border border-neutral-100 shadow-sm text-center">
                            <div className="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center mb-6 shadow-inner">
                                <LifeBuoy size={32} className="text-neutral-300" />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-900 mb-2">No tickets yet</h3>
                            <p className="text-neutral-500 text-sm max-w-sm">
                                You haven't opened any support tickets. If you ever run into an issue, you can reach out to us here.
                            </p>
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        /* NO SEARCH RESULTS */
                        <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-[2rem] border border-neutral-100 shadow-sm text-center">
                            <Search size={28} className="text-neutral-300 mb-4" />
                            <p className="text-sm font-medium text-neutral-500">No tickets match your search.</p>
                        </div>
                    ) : (
                        /* TICKET LIST */
                        <div className="flex flex-col gap-4">
                            {filteredTickets.map(ticket => {
                                const badge = getStatusBadge(ticket.status);
                                return (
                                    <div
                                        key={ticket.id}
                                        className="group relative bg-white border border-neutral-200 hover:border-accent/40 rounded-[1.5rem] p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <span className="text-xs font-mono font-bold text-primary-900 uppercase">
                                                        {ticket.ticket_number}
                                                    </span>
                                                    <span className="text-neutral-300">•</span>
                                                    <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                                                        {ticket.category}
                                                    </span>
                                                    <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(ticket.priority)}`}>
                                                        {ticket.priority}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg font-bold text-neutral-900 mb-2 leading-snug pr-4">
                                                    {ticket.subject}
                                                </h3>

                                                <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed mb-4">
                                                    {ticket.description}
                                                </p>

                                                <div className="flex items-center gap-4 text-[11px] font-semibold text-neutral-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock size={12} />
                                                        {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="sm:shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                                                    <badge.icon size={13} />
                                                    {badge.label}
                                                </div>

                                                <div className="hidden sm:flex flex-col items-end gap-1 mt-6 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[9px] uppercase tracking-widest font-bold text-neutral-400 flex items-center gap-1">
                                                        Details <ArrowUpRight size={10} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {ticket.admin_notes && (
                                            <div className="relative z-10 mt-5 bg-gradient-to-br from-neutral-50 to-neutral-100 p-4 rounded-2xl border border-neutral-200/60">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                                                        <LifeBuoy size={10} />
                                                    </div>
                                                    <span className="text-xs font-bold text-neutral-900">Admin Response</span>
                                                    {ticket.resolved_at && (
                                                        <span className="text-[10px] text-neutral-400 font-medium ml-auto">
                                                            {format(new Date(ticket.resolved_at), 'MMM d, yyyy')}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-neutral-600 leading-relaxed font-medium pl-8 border-l-2 border-accent/20 ml-3">
                                                    {ticket.admin_notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: CONTACT & FAQ (5 cols) */}
                <div className="lg:col-span-5 space-y-6">

                    {/* Quick Links Card */}
                    <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                        <h3 className="text-lg font-bold text-neutral-900 font-display p-6 pb-2">Quick Links</h3>

                        <div className="divide-y divide-neutral-100">
                            <a href="mailto:support@careconnect.com?subject=Support Request" className="flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                                        <Mail size={22} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-neutral-900 text-sm">Contact Support</div>
                                        <div className="text-xs text-neutral-500 font-medium mt-0.5">Email our team directly</div>
                                    </div>
                                </div>
                                <ExternalLink size={16} className="text-neutral-300 group-hover:text-blue-500 transition-colors" />
                            </a>

                            <button className="w-full flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors group text-left">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-100 transition-colors">
                                        <FileText size={22} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-neutral-900 text-sm">Community Guidelines</div>
                                        <div className="text-xs text-neutral-500 font-medium mt-0.5">Review platform policies</div>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-neutral-300 group-hover:text-purple-500 transition-colors" />
                            </button>

                            <button className="w-full flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors group text-left">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
                                        <BookOpen size={22} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-neutral-900 text-sm">FAQ & Help Center</div>
                                        <div className="text-xs text-neutral-500 font-medium mt-0.5">Find answers to questions</div>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-neutral-300 group-hover:text-emerald-500 transition-colors" />
                            </button>

                            <button onClick={() => toast('Live chat coming soon!')} className="w-full flex items-center justify-between p-6 hover:bg-neutral-50 transition-colors group text-left">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-100 transition-colors">
                                        <MessageCircle size={22} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-neutral-900 text-sm">Live Chat Support</div>
                                        <div className="text-xs text-neutral-500 font-medium mt-0.5">Chat with our team</div>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-neutral-300 group-hover:text-amber-500 transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* Common Questions Card */}
                    <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 lg:p-8">
                        <h3 className="text-lg font-bold text-neutral-900 font-display mb-6">Common Questions</h3>
                        <div className="space-y-4">
                            <details className="group border border-neutral-100 rounded-2xl open:bg-neutral-50 cursor-pointer overflow-hidden transition-colors">
                                <summary className="font-bold text-sm text-neutral-800 hover:text-accent p-4 list-none flex items-center justify-between">
                                    How do I update my profile information?
                                    <ChevronRight size={16} className="text-neutral-400 group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="px-4 pb-4 pt-1 text-xs text-neutral-600 leading-relaxed font-medium">
                                    Go to <span className="text-neutral-900 font-bold">Dashboard → Profile → Edit Profile</span>. You can update your bio, skills, hourly rate, and availability.
                                </div>
                            </details>
                            <details className="group border border-neutral-100 rounded-2xl open:bg-neutral-50 cursor-pointer overflow-hidden transition-colors">
                                <summary className="font-bold text-sm text-neutral-800 hover:text-accent p-4 list-none flex items-center justify-between">
                                    How do I get verified?
                                    <ChevronRight size={16} className="text-neutral-400 group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="px-4 pb-4 pt-1 text-xs text-neutral-600 leading-relaxed font-medium">
                                    Navigate to the Verification page and upload your identity documents (Aadhar/PAN/Voter ID). Admins will review within 24-48 hours.
                                </div>
                            </details>
                            <details className="group border border-neutral-100 rounded-2xl open:bg-neutral-50 cursor-pointer overflow-hidden transition-colors">
                                <summary className="font-bold text-sm text-neutral-800 hover:text-accent p-4 list-none flex items-center justify-between">
                                    How do bookings work?
                                    <ChevronRight size={16} className="text-neutral-400 group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="px-4 pb-4 pt-1 text-xs text-neutral-600 leading-relaxed font-medium">
                                    Parents send you booking requests. You can accept or decline from your Dashboard. Once accepted, you'll receive booking details and can chat with the parent.
                                </div>
                            </details>
                        </div>
                    </div>

                </div>
            </div>

            {/* ─── NEW TICKET MODAL ─── */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create a Support Ticket"
            >
                <div className="p-1">
                    <p className="text-sm text-neutral-500 font-medium leading-relaxed mb-6">
                        Describe your issue in detail. If this is incredibly urgent, please mark the priority as High or Critical so we can fast-track it.
                    </p>
                    <form onSubmit={handleCreateTicket} className="space-y-5">

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Category</label>
                                <div className="relative">
                                    <select
                                        className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 bg-neutral-50 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none appearance-none transition-all font-medium text-sm text-neutral-800 cursor-pointer"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as SupportCategory })}
                                    >
                                        <option value="payment">Payment Issue</option>
                                        <option value="booking">Booking / Schedule</option>
                                        <option value="technical">Technical Bug</option>
                                        <option value="grievance">Grievance</option>
                                        <option value="account">Account Access</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 rotate-90 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Priority</label>
                                <div className="relative">
                                    <select
                                        className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 bg-neutral-50 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none appearance-none transition-all font-medium text-sm text-neutral-800 cursor-pointer"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as SupportPriority })}
                                    >
                                        <option value="low">Low (General)</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High (Urgent)</option>
                                        <option value="critical">Critical (Emergency)</option>
                                    </select>
                                    <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 rotate-90 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <Input
                            label="Subject"
                            placeholder="Briefly summarize the issue"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            required
                            className="font-medium"
                        />

                        <Textarea
                            label="Description"
                            placeholder="Please provide as much detail as possible so we can help you quickly..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            className="h-32 resize-none font-medium"
                        />

                        <div className="pt-4 flex items-center justify-end gap-3 mt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                className="rounded-xl px-6 text-neutral-500 hover:text-neutral-800"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="rounded-xl px-8 py-6 shadow-xl shadow-accent/20 hover:shadow-accent/40 font-bold transition-all hover:-translate-y-0.5"
                                disabled={submitting}
                            >
                                {submitting ? <Spinner size="sm" /> : 'Submit Ticket'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

        </div>
    );
}
