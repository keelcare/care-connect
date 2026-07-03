'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MapPin, MessageCircleQuestion, CreditCard, PencilLine, ChevronRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { Booking, SupportPriority } from '@/types/api';
import { logger } from '@/lib/logger';

interface Preset {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  priority?: SupportPriority;
  /** Builds the ticket subject/description; `ref` is a short booking reference. */
  subject: (ref: string) => string;
  body: (ref: string) => string;
}

const PARENT_PRESETS: Preset[] = [
  {
    key: 'where_nanny',
    label: 'Where is my nanny?',
    description: 'The caregiver hasn’t arrived or you can’t reach them.',
    icon: <MapPin size={18} />,
    category: 'booking',
    priority: 'high',
    subject: (r) => `Where is my nanny? (Booking ${r})`,
    body: (r) =>
      `I need help locating my assigned caregiver for booking ${r}. They have not arrived / I am unable to reach them.`,
  },
  {
    key: 'query_nanny',
    label: 'Raise a query about my nanny',
    description: 'A concern or question about the assigned caregiver.',
    icon: <MessageCircleQuestion size={18} />,
    category: 'grievance',
    subject: (r) => `Query about my nanny (Booking ${r})`,
    body: (r) => `I would like to raise a query/concern about the caregiver on booking ${r}.`,
  },
  {
    key: 'payment',
    label: 'Payment / billing issue',
    description: 'A problem with payment for this booking.',
    icon: <CreditCard size={18} />,
    category: 'payment',
    subject: (r) => `Payment issue (Booking ${r})`,
    body: (r) => `I am facing a payment / billing issue with booking ${r}.`,
  },
];

const NANNY_PRESETS: Preset[] = [
  {
    key: 'reach_family',
    label: 'Issue reaching the family',
    description: 'You can’t reach or locate the family for this booking.',
    icon: <MapPin size={18} />,
    category: 'booking',
    priority: 'high',
    subject: (r) => `Issue reaching the family (Booking ${r})`,
    body: (r) => `I am unable to reach / locate the family for booking ${r}.`,
  },
  {
    key: 'concern_booking',
    label: 'Concern about this booking',
    description: 'A concern or question about this job.',
    icon: <MessageCircleQuestion size={18} />,
    category: 'grievance',
    subject: (r) => `Concern about booking ${r}`,
    body: (r) => `I would like to raise a concern about booking ${r}.`,
  },
  {
    key: 'payment',
    label: 'Payment / billing issue',
    description: 'A problem with payment for this booking.',
    icon: <CreditCard size={18} />,
    category: 'payment',
    subject: (r) => `Payment issue (Booking ${r})`,
    body: (r) => `I am facing a payment issue with booking ${r}.`,
  },
];

interface BookingHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  role: 'parent' | 'nanny';
}

export function BookingHelpModal({ isOpen, onClose, booking, role }: BookingHelpModalProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [custom, setCustom] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const presets = role === 'parent' ? PARENT_PRESETS : NANNY_PRESETS;
  const ref = `#${booking.id.slice(0, 8)}`;

  const reset = () => {
    setCustom(false);
    setSubject('');
    setDescription('');
    setSubmitting(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const raise = async (payload: {
    subject: string;
    description: string;
    category: string;
    priority?: SupportPriority;
  }) => {
    setSubmitting(true);
    try {
      const ticket = await api.support.createTicket({
        bookingId: booking.id,
        subject: payload.subject,
        description: payload.description,
        category: payload.category,
        priority: payload.priority,
      });
      toast.success('Support ticket created');
      close();
      router.push(`/support?ticket=${ticket.id}`);
    } catch (err) {
      logger.error('Failed to create ticket', err);
      toast.error('Could not create ticket. Please try again.');
      setSubmitting(false);
    }
  };

  const handlePreset = (p: Preset) =>
    raise({
      subject: p.subject(ref),
      description: p.body(ref),
      category: p.category,
      priority: p.priority,
    });

  const handleCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    raise({
      subject: `${subject.trim()} (Booking ${ref})`,
      description: description.trim(),
      category: 'other',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title="Get help with this booking" maxWidth="md">
      {!custom ? (
        <div className="space-y-2.5">
          <p className="text-sm text-neutral-500 mb-2">
            Pick an issue — we’ll open a support ticket linked to booking {ref} and
            connect you with our team.
          </p>
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => handlePreset(p)}
              disabled={submitting}
              className="w-full flex items-center gap-3 p-4 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:bg-primary-50/40 transition-all text-left disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-50 text-primary-700 flex items-center justify-center flex-shrink-0">
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900">{p.label}</p>
                <p className="text-xs text-neutral-500">{p.description}</p>
              </div>
              <ChevronRight size={16} className="text-neutral-300 flex-shrink-0" />
            </button>
          ))}

          <button
            onClick={() => setCustom(true)}
            disabled={submitting}
            className="w-full flex items-center gap-3 p-4 rounded-2xl border border-dashed border-neutral-200 hover:border-primary-200 hover:bg-primary-50/40 transition-all text-left disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-50 text-primary-700 flex items-center justify-center flex-shrink-0">
              <PencilLine size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900">Something else</p>
              <p className="text-xs text-neutral-500">Describe your issue in your own words.</p>
            </div>
            <ChevronRight size={16} className="text-neutral-300 flex-shrink-0" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleCustom} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Subject</label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Briefly, what's the issue?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Details</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what happened…"
              className="min-h-[120px] rounded-xl"
            />
          </div>
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => setCustom(false)}
              className="text-sm text-neutral-500 hover:text-neutral-800"
            >
              ← Back
            </button>
            <Button
              type="submit"
              disabled={submitting || !subject.trim() || !description.trim()}
              className="rounded-xl px-6"
            >
              {submitting ? 'Creating…' : 'Create ticket'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
