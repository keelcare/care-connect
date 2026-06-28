'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { SupportTicket, SupportCategory, SupportPriority } from '@/types/api';
import ParentLayout from '@/components/layout/ParentLayout';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from 'sonner';
import {
  Plus, Search, MessageSquare, Clock, CheckCircle2, AlertCircle,
  LifeBuoy, ChevronRight, Mail, Phone, ShieldAlert, X,
  ChevronDown, Headphones, FileText,
} from 'lucide-react';

/* ── status + priority meta ──────────────────────────────────────── */

const STATUS_META: Record<string, { label: string; dot: string; text: string; bg: string; border: string }> = {
  open:        { label: 'Open',        dot: 'bg-sky-500',             text: 'text-sky-700',     bg: 'bg-sky-50',     border: 'border-sky-100' },
  in_progress: { label: 'In Progress', dot: 'bg-amber-500 animate-pulse', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
  resolved:    { label: 'Resolved',    dot: 'bg-emerald-500',         text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  closed:      { label: 'Closed',      dot: 'bg-slate-400',           text: 'text-slate-500',   bg: 'bg-slate-100',  border: 'border-slate-200' },
};

const PRIORITY_META: Record<string, { label: string; text: string; bg: string }> = {
  low:      { label: 'Low',      text: 'text-slate-500',   bg: 'bg-slate-100' },
  medium:   { label: 'Medium',   text: 'text-primary-600', bg: 'bg-primary-50' },
  high:     { label: 'High',     text: 'text-amber-600',   bg: 'bg-amber-50' },
  critical: { label: 'Critical', text: 'text-red-600',     bg: 'bg-red-50' },
};

/* ── FAQ data ────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: 'How do I book a service?',
    a: 'Tap "Book a Service" from your home screen, choose the type of care, date, time, and number of children. We\'ll match you with a verified caregiver.',
  },
  {
    q: 'Are all caregivers background-checked?',
    a: 'Yes. Every caregiver on CareConnect undergoes identity verification and a police background check before being approved on the platform. Our team reviews all documentation within 24–48 hours.',
  },
  {
    q: 'Can I cancel a booking?',
    a: 'You can cancel up to 24 hours before the session starts with no penalty. Cancellations within 24 hours may incur a fee. Go to My Bookings → tap the booking → Cancel.',
  },
  {
    q: 'How are payments handled?',
    a: 'Payments are processed securely via Razorpay after each session is marked complete. For subscription plans, billing cycles are shown on your Payments page.',
  },
  {
    q: 'How do I report a concern about a caregiver?',
    a: 'Raise a support ticket with category "Grievance" and mark it High priority. Our team responds within 4 hours for urgent safety concerns.',
  },
];

/* ── accordion FAQ item ──────────────────────────────────────────── */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-xl border transition-all ${open ? 'border-primary-100 bg-primary-50/40' : 'border-slate-100 bg-white'}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <span className="text-sm font-semibold text-primary-900 leading-snug">{q}</span>
        <ChevronDown size={15} className={`text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

/* ── ticket card ─────────────────────────────────────────────────── */

function TicketCard({ ticket }: { ticket: SupportTicket }) {
  const status = STATUS_META[ticket.status] ?? STATUS_META['open'];
  const priority = PRIORITY_META[ticket.priority] ?? PRIORITY_META['medium'];

  const ago = (() => {
    const diff = Date.now() - new Date(ticket.created_at).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  })();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary-100 transition-all overflow-hidden">
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
              {ticket.ticket_number}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${priority.bg} ${priority.text}`}>
              {priority.label}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide capitalize">
              {ticket.category}
            </span>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex-shrink-0 ${status.bg} ${status.text} ${status.border} border`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* Subject */}
        <p className="font-bold text-primary-900 text-sm mb-1 leading-snug">{ticket.subject}</p>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{ticket.description}</p>

        {/* Timestamp */}
        <div className="flex items-center gap-1.5 mt-3 text-[10px] text-slate-400 font-medium">
          <Clock size={10} />
          <span>Opened {ago}</span>
        </div>

        {/* Admin response */}
        {ticket.admin_notes && (
          <div className="mt-4 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center">
                <Headphones size={10} className="text-primary-600" />
              </div>
              <p className="text-[10px] font-black text-primary-700 uppercase tracking-widest">Support Response</p>
              {ticket.resolved_at && (
                <p className="text-[10px] text-slate-400 ml-auto">
                  {new Date(ticket.resolved_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-3 border-l-2 border-primary-100">
              {ticket.admin_notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── new ticket modal ────────────────────────────────────────────── */

const INPUT_CLS = "w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:outline-none text-sm text-primary-900 bg-white placeholder:text-slate-400 transition-all";

function NewTicketModal({
  open, onClose, onSuccess,
}: {
  open: boolean; onClose: () => void; onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    subject: '', description: '',
    category: 'other' as SupportCategory,
    priority: 'medium' as SupportPriority,
  });
  const [submitting, setSubmitting] = useState(false);

  const CATEGORIES: { value: SupportCategory; label: string }[] = [
    { value: 'payment',   label: 'Payment Issue' },
    { value: 'booking',   label: 'Booking / Schedule' },
    { value: 'technical', label: 'Technical Bug' },
    { value: 'grievance', label: 'Grievance / Safety' },
    { value: 'account',   label: 'Account Access' },
    { value: 'other',     label: 'Other' },
  ];

  const PRIORITIES: { value: SupportPriority; label: string; hint: string }[] = [
    { value: 'low',      label: 'Low',      hint: 'General question' },
    { value: 'medium',   label: 'Medium',   hint: 'Needs resolution soon' },
    { value: 'high',     label: 'High',     hint: 'Affecting my bookings' },
    { value: 'critical', label: 'Critical', hint: 'Safety / financial issue' },
  ];

  const PRIORITY_ACTIVE: Record<string, string> = {
    low:      'bg-slate-700 text-white border-slate-700',
    medium:   'bg-primary-900 text-white border-primary-900',
    high:     'bg-amber-500 text-white border-amber-500',
    critical: 'bg-red-600 text-white border-red-600',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.description.trim()) {
      toast.error('Please fill in both subject and description.');
      return;
    }
    setSubmitting(true);
    try {
      await api.support.createTicket(form);
      toast.success('Ticket submitted — we\'ll be in touch shortly!');
      setForm({ subject: '', description: '', category: 'other', priority: 'medium' });
      onClose();
      onSuccess();
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">

        {/* Drag pill */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 sm:px-6 pt-4 pb-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-bold text-primary-900 text-base">New Support Ticket</h2>
            <p className="text-xs text-slate-400 mt-0.5">We typically respond within a few hours.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors">
            <X size={16} className="text-slate-400" />
          </button>
        </div>

        {/* Scrollable form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-5">

          {/* Category */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map(c => (
                <button
                  key={c.value} type="button"
                  onClick={() => setForm(f => ({ ...f, category: c.value }))}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border-2 transition-all text-left ${
                    form.category === c.value
                      ? 'bg-primary-900 text-white border-primary-900'
                      : 'border-slate-200 text-slate-600 hover:border-primary-200 hover:bg-primary-50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Priority</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRIORITIES.map(p => (
                <button
                  key={p.value} type="button"
                  onClick={() => setForm(f => ({ ...f, priority: p.value }))}
                  className={`py-2.5 px-3 rounded-xl border-2 transition-all text-center ${
                    form.priority === p.value
                      ? PRIORITY_ACTIVE[p.value]
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold">{p.label}</p>
                  <p className={`text-[10px] mt-0.5 leading-tight ${form.priority === p.value ? 'opacity-75' : 'text-slate-400'}`}>{p.hint}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Subject</label>
            <input
              type="text" required
              value={form.subject}
              onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              placeholder="Brief summary of the issue"
              className={INPUT_CLS}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
            <textarea
              required rows={4}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe your issue in detail — the more context you give, the faster we can help."
              className={`${INPUT_CLS} resize-none`}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0 bg-white">
          <Button
            type="button" variant="outline"
            onClick={onClose}
            className="h-11 px-4 rounded-xl border-slate-200 text-slate-600 text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit as any}
            disabled={submitting}
            className="flex-1 h-11 rounded-xl bg-primary-900 text-white font-bold text-sm gap-2 hover:bg-primary-800 disabled:opacity-50"
          >
            {submitting
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
              : <><FileText size={15} /> Submit Ticket</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── ban appeal section ──────────────────────────────────────────── */

function BanAlert({ banReason, onSubmit }: { banReason?: string; onSubmit: (msg: string) => Promise<void> }) {
  const [contesting, setContesting] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) { toast.error('Please enter your appeal message.'); return; }
    setSubmitting(true);
    try { await onSubmit(message); setContesting(false); setMessage(''); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl overflow-hidden">
      <div className="h-1 bg-red-500" />
      <div className="p-5 flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
          <ShieldAlert size={18} className="text-red-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-red-900 text-sm mb-1">Account Suspended</p>
          <p className="text-xs text-red-700 leading-relaxed mb-4">
            Reason: <span className="font-semibold">{banReason || 'Terms of Service violation'}</span>
          </p>

          {!contesting ? (
            <Button
              onClick={() => setContesting(true)}
              className="h-9 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold gap-2"
            >
              <AlertCircle size={13} /> Contest This Ban
            </Button>
          ) : (
            <div className="space-y-3">
              <textarea
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Explain why you believe this suspension was made in error…"
                className="w-full px-4 py-3 rounded-xl border-2 border-red-200 bg-white focus:border-red-400 focus:outline-none text-sm resize-none placeholder:text-red-300"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="h-9 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                >
                  {submitting ? 'Submitting…' : 'Submit Appeal'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setContesting(false)}
                  className="h-9 px-4 rounded-xl text-red-600 text-xs font-semibold"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── main page ───────────────────────────────────────────────────── */

export default function SupportPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const isBanned = user?.is_active === false;

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await api.support.getUserTickets();
      setTickets([...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch { toast.error('Failed to load tickets'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (user) fetchTickets(); }, [user]);

  const handleContestBan = async (msg: string) => {
    await api.support.createTicket({
      subject: 'Account Suspension Appeal',
      description: msg,
      category: 'account' as SupportCategory,
      priority: 'high' as SupportPriority,
    });
    toast.success('Appeal submitted — our team will review it within 24–48 hours.');
    fetchTickets();
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return tickets;
    return tickets.filter(t =>
      t.subject.toLowerCase().includes(q) ||
      t.ticket_number.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  }, [search, tickets]);

  return (
    <ParentLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary-900 tracking-tight">Support</h1>
            <p className="text-slate-500 text-sm mt-0.5">We're here to help — raise a ticket or browse common questions.</p>
          </div>
          <Button
            onClick={() => setModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-primary-900 text-white text-sm font-bold gap-2 flex-shrink-0 shadow-md shadow-primary-900/20"
          >
            <Plus size={15} /> New Ticket
          </Button>
        </div>

        {/* ── Ban alert ── */}
        {isBanned && (
          <BanAlert banReason={user.ban_reason} onSubmit={handleContestBan} />
        )}

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 lg:gap-6">

          {/* LEFT: ticket list */}
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tickets by subject or ID…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-xl text-sm focus:border-primary-400 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all"
              />
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-32 bg-white rounded-2xl border border-slate-100 animate-pulse" />
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <LifeBuoy size={20} className="text-slate-300" />
                </div>
                <p className="font-bold text-primary-900 text-sm mb-1">No tickets yet</p>
                <p className="text-slate-400 text-xs mb-5 max-w-xs mx-auto">
                  If you have an issue, raise a ticket and we'll be in touch quickly.
                </p>
                <Button
                  onClick={() => setModalOpen(true)}
                  className="h-9 px-5 rounded-xl bg-primary-900 text-white text-xs font-bold gap-2"
                >
                  <Plus size={13} /> Raise a Ticket
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                <Search size={20} className="text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No tickets match your search.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
              </div>
            )}
          </div>

          {/* RIGHT: contact + FAQ */}
          <div className="space-y-5">
            {/* Contact options */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-50">
                <p className="font-bold text-primary-900 text-sm">Contact Us</p>
                <p className="text-xs text-slate-400 mt-0.5">Our team is available Mon–Sat, 9 AM – 7 PM</p>
              </div>
              <div className="divide-y divide-slate-50">
                <a
                  href="mailto:support@careconnect.in"
                  className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                    <Mail size={15} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary-900">Email Us</p>
                    <p className="text-xs text-slate-400">support@careconnect.in</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                </a>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                    <Phone size={15} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary-900">Call Us</p>
                    <p className="text-xs text-slate-400">+91 98765 43210</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                </a>
              </div>
            </div>

            {/* Response time info */}
            <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Clock size={14} className="text-primary-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary-900">Response Times</p>
                  <div className="mt-2 space-y-1">
                    {[
                      { label: 'Critical',  time: '< 2 hours' },
                      { label: 'High',      time: '< 4 hours' },
                      { label: 'Medium',    time: '< 24 hours' },
                      { label: 'Low',       time: '1–3 business days' },
                    ].map(r => (
                      <div key={r.label} className="flex items-center justify-between text-xs">
                        <span className="text-primary-700 font-medium">{r.label}</span>
                        <span className="text-primary-600 font-semibold">{r.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="font-bold text-primary-900 text-sm mb-4">Common Questions</p>
              <div className="space-y-2">
                {FAQS.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewTicketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchTickets}
      />
    </ParentLayout>
  );
}
