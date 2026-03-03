'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { SupportTicket, SupportCategory, SupportPriority } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import {
    Plus,
    ChevronRight,
    HelpCircle,
    Search,
    Filter,
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    X
} from 'lucide-react';
import { format } from 'date-fns';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from 'sonner';

export default function SupportPage() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        category: 'other' as SupportCategory,
        priority: 'medium' as SupportPriority
    });

    useEffect(() => {
        if (user) {
            fetchTickets();
        }
    }, [user]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const data = await api.support.getUserTickets();
            setTickets(data);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
            toast.error('Failed to load support tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.subject || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setSubmitting(true);
            await api.support.createTicket(formData);
            toast.success('Support ticket created successfully');
            setIsModalOpen(false);
            setFormData({
                subject: '',
                description: '',
                category: 'other',
                priority: 'medium'
            });
            fetchTickets();
        } catch (error) {
            console.error('Failed to create ticket:', error);
            toast.error('Failed to create support ticket');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'open': return <Clock size={16} className="text-blue-500" />;
            case 'in_progress': return <MessageSquare size={16} className="text-amber-500" />;
            case 'resolved': return <CheckCircle2 size={16} className="text-emerald-500" />;
            case 'closed': return <AlertCircle size={16} className="text-neutral-400" />;
            default: return <HelpCircle size={16} />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-200';
            case 'high': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
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
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900">Support Center</h1>
                    <p className="text-neutral-500 mt-1">Need help? We're here for you.</p>
                </div>

                <Button
                    className="rounded-full px-6 shadow-md hover:shadow-lg transition-all gap-2"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus size={20} />
                    New Ticket
                </Button>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Create Support Ticket"
                >
                    <form onSubmit={handleCreateTicket} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700">Category</label>
                            <select
                                className="w-full h-12 px-4 rounded-xl border-2 border-neutral-300 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none appearance-none transition-all"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as SupportCategory })}
                            >
                                <option value="payment">Payment Issue</option>
                                <option value="technical">Technical Difficulty</option>
                                <option value="grievance">Grievance</option>
                                <option value="account">Account Management</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <Input
                            label="Subject"
                            placeholder="Summarize your issue"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            required
                        />

                        <Textarea
                            label="Description"
                            placeholder="Provide more details about the problem..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700">Priority</label>
                            <select
                                className="w-full h-12 px-4 rounded-xl border-2 border-neutral-300 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none appearance-none transition-all"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as SupportPriority })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 rounded-xl"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 rounded-xl shadow-sm"
                                disabled={submitting}
                            >
                                {submitting ? <Spinner size="sm" /> : 'Create Ticket'}
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-neutral-800">Your Tickets</h2>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="text-neutral-500 rounded-lg">
                                <Filter size={16} className="mr-2" />
                                Filter
                            </Button>
                            <Button variant="ghost" size="sm" className="text-neutral-500 rounded-lg">
                                <Search size={16} />
                            </Button>
                        </div>
                    </div>

                    {tickets.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-dashed border-neutral-300 p-12 text-center">
                            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                                <MessageSquare size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-neutral-900">No support tickets found</h3>
                            <p className="text-neutral-500 mt-1 max-w-xs mx-auto">
                                If you have any issues or questions, feel free to create a new ticket.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-mono font-medium text-neutral-500 uppercase">
                                                    {ticket.ticket_number}
                                                </span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-neutral-900 truncate group-hover:text-accent transition-colors">
                                                {ticket.subject}
                                            </h3>
                                            <p className="text-sm text-neutral-500 line-clamp-1 mt-1">
                                                {ticket.description}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize border ${ticket.status === 'open' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                ticket.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    ticket.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                        'bg-neutral-50 text-neutral-600 border-neutral-200'
                                                }`}>
                                                {getStatusIcon(ticket.status)}
                                                {ticket.status?.replace('_', ' ')}
                                            </div>
                                            <span className="text-xs text-neutral-400">
                                                {format(new Date(ticket.created_at), 'MMM d, yyyy')}
                                            </span>
                                        </div>
                                    </div>

                                    {ticket.admin_notes && (
                                        <div className="mt-4 p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs text-neutral-600">
                                            <span className="font-semibold text-neutral-800 mr-2">Admin Notes:</span>
                                            {ticket.admin_notes}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary-900 to-primary-800 rounded-3xl p-6 text-white shadow-xl overflow-hidden relative group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2">Instant Help</h3>
                            <p className="text-primary-100 text-sm mb-4 leading-relaxed">
                                Check out our comprehensive FAQ section for quick answers to common questions.
                            </p>
                            <Button variant="secondary" className="w-full rounded-2xl shadow-lg border-none">
                                Browse FAQ
                            </Button>
                        </div>
                        {/* Abstract Background pattern */}
                        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
                        <div className="absolute -left-4 -top-4 w-24 h-24 bg-primary-700/50 rounded-full blur-xl" />
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-sm">
                        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Contact Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-600 flex-shrink-0">
                                    <HelpCircle size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-800">Email Support</p>
                                    <p className="text-xs text-neutral-500">support@keelcare.com</p>
                                    <p className="text-[10px] text-neutral-400 mt-1">Response time: 24-48h</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                    <MessageSquare size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-800">WhatsApp</p>
                                    <p className="text-xs text-neutral-500">+91 98765 43210</p>
                                    <p className="text-[10px] text-neutral-400 mt-1">Mon-Fri, 9am - 6pm</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
