'use client';

import React from 'react';
import { Clock, AlertCircle, ArrowRight } from 'lucide-react';

interface NannyVerificationBannerProps {
  status: 'pending' | 'rejected' | null;
  onResubmit?: () => void;
}

export function NannyVerificationBanner({
  status,
  onResubmit,
}: NannyVerificationBannerProps) {
  if (status === 'pending') {
    return (
      <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0D2B45]/5 border border-[#0D2B45]/10">
        <div className="w-8 h-8 rounded-full bg-[#0D2B45]/10 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4 text-[#0D2B45]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#0D2B45]">
            Verification in progress
          </p>
          <p className="text-xs text-[#0D2B45]/60 mt-0.5">
            Your documents are under review. You&apos;ll be notified once approved — usually within 1–2 business days.
          </p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0D2B45]/8 text-[#0D2B45] text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6AAE8A] animate-pulse" />
          Pending
        </span>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl bg-error-50 border border-error-100">
        <div className="w-8 h-8 rounded-full bg-error-100 flex items-center justify-center shrink-0">
          <AlertCircle className="w-4 h-4 text-error-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-error-700">
            Verification rejected
          </p>
          <p className="text-xs text-error-600/80 mt-0.5">
            Your documents could not be verified. Please resubmit with valid ID.
          </p>
        </div>
        {onResubmit && (
          <button
            onClick={onResubmit}
            className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-error-600 text-white text-xs font-semibold hover:bg-error-700 transition-colors"
          >
            Resubmit
            <ArrowRight size={11} />
          </button>
        )}
      </div>
    );
  }

  // null / undefined — not yet started (wizard handles this state; banner stays silent)
  return null;
}
