'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ShieldX, Mail, FileText, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { User } from '@/types/api';

interface BannedModalProps {
  user: User;
  onLogout: () => void;
}

type AppealStep = 'idle' | 'form' | 'submitting' | 'submitted';

export function BannedModal({ user, onLogout }: BannedModalProps) {
  const [step, setStep] = useState<AppealStep>('idle');
  const [appealDescription, setAppealDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const firstName = user.profiles?.first_name ?? user.email.split('@')[0];
  const banReason = user.ban_reason ?? 'No specific reason was provided.';

  const handleSubmitAppeal = async () => {
    if (!appealDescription.trim()) {
      setError('Please describe why you believe this ban is a mistake.');
      return;
    }

    setError(null);
    setStep('submitting');

    try {
      await api.support.createTicket({
        subject: 'Account Ban Appeal',
        description: appealDescription.trim(),
        category: 'account',
        priority: 'high',
      });
      setStep('submitted');
    } catch (err: any) {
      setError(err.message ?? 'Failed to submit appeal. Please try emailing us instead.');
      setStep('form');
    }
  };

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-neutral-950/90 backdrop-blur-md">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">

        {/* Red header bar */}
        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-8 py-8 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <ShieldX size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display tracking-tight">Account Suspended</h1>
              <p className="text-red-100 text-sm mt-0.5">Hi {firstName}, your account has been deactivated.</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6">

          {/* Ban reason */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-900 mb-1">Reason for suspension</p>
                <p className="text-sm text-red-800/80 leading-relaxed">{banReason}</p>
              </div>
            </div>
          </div>

          {step === 'submitted' ? (
            /* Success state */
            <div className="text-center py-4 space-y-3">
              <div className="flex justify-center">
                <div className="p-4 bg-green-50 rounded-full">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">Appeal Submitted</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Our team will review your appeal within 24–48 hours and get back to you via email.
              </p>
            </div>
          ) : step === 'form' || step === 'submitting' ? (
            /* Appeal form */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-800 mb-2">
                  Why do you believe this is a mistake?
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-sm text-neutral-900 resize-none focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent placeholder:text-neutral-400 transition"
                  rows={4}
                  placeholder="Explain your situation clearly. Include any relevant details that might help us review your case..."
                  value={appealDescription}
                  onChange={(e) => setAppealDescription(e.target.value)}
                  disabled={step === 'submitting'}
                />
                {error && (
                  <p className="mt-2 text-xs text-red-600">{error}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setStep('idle'); setError(null); }}
                  disabled={step === 'submitting'}
                  className="flex-1 py-3 rounded-2xl border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitAppeal}
                  disabled={step === 'submitting' || !appealDescription.trim()}
                  className="flex-1 py-3 rounded-2xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {step === 'submitting' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    'Submit Appeal'
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Default actions */
            <div className="space-y-3">
              <p className="text-sm text-neutral-600 leading-relaxed">
                You no longer have access to Keel. If you believe this is a mistake, you can contest the decision or reach out to our support team.
              </p>

              <button
                onClick={() => setStep('form')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-neutral-200 hover:border-primary-200 hover:bg-primary-50/30 transition-all group text-left"
              >
                <div className="p-3 bg-neutral-100 text-neutral-600 rounded-xl group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors shrink-0">
                  <FileText size={22} />
                </div>
                <div>
                  <div className="font-semibold text-neutral-900 group-hover:text-primary-700 text-sm">Contest This Decision</div>
                  <div className="text-xs text-neutral-500">Submit an in-app appeal for our team to review</div>
                </div>
              </button>

              <a
                href={`mailto:support@careconnect.com?subject=Account%20Suspension%20Appeal&body=My%20account%20email%3A%20${encodeURIComponent(user.email)}`}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-neutral-200 hover:border-primary-200 hover:bg-primary-50/30 transition-all group"
              >
                <div className="p-3 bg-neutral-100 text-neutral-600 rounded-xl group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <div className="font-semibold text-neutral-900 group-hover:text-primary-700 text-sm">Contact Support</div>
                  <div className="text-xs text-neutral-500">Email our safety team directly</div>
                </div>
              </a>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-neutral-100 bg-neutral-50/60">
          <button
            onClick={onLogout}
            className="w-full py-3 text-sm text-neutral-500 hover:text-neutral-700 font-medium transition"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(content, document.body);
}
