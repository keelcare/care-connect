'use client';

import React, { useState } from 'react';
import { X, Mail, FileText, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpPanel({ isOpen, onClose }: HelpPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="h-full w-full bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 font-display">
              Help & Support
            </h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-neutral-400 hover:text-neutral-500 rounded-full hover:bg-neutral-50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Status Explanation */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-600 shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-amber-900">
                    Why was I suspended?
                  </h3>
                  <p className="text-sm text-amber-800/80 leading-relaxed">
                    Accounts are usually suspended for violations of our
                    Community Guidelines or Terms of Service. Common reasons
                    include safety concerns, repeated cancellations, or
                    verification issues.
                  </p>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                Support Options
              </h3>

              {/* Option 1: Contact Support */}
              <a
                href="mailto:support@careconnect.com?subject=Account%20Suspension%20Appeal"
                className="block p-4 rounded-2xl border border-neutral-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-neutral-100 text-neutral-600 rounded-xl group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                    <Mail size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900 group-hover:text-emerald-700">
                      Contact Support
                    </div>
                    <div className="text-sm text-neutral-500">
                      Email our safety team directly
                    </div>
                  </div>
                  <ExternalLink
                    size={16}
                    className="text-neutral-300 group-hover:text-emerald-400"
                  />
                </div>
              </a>

              {/* Option 2: Community Guidelines */}
              <a
                href="#"
                className="block p-4 rounded-2xl border border-neutral-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-neutral-100 text-neutral-600 rounded-xl group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900 group-hover:text-emerald-700">
                      Community Guidelines
                    </div>
                    <div className="text-sm text-neutral-500">
                      Review our policies
                    </div>
                  </div>
                  <ExternalLink
                    size={16}
                    className="text-neutral-300 group-hover:text-emerald-400"
                  />
                </div>
              </a>
            </div>

            {/* Appeal Section */}
            <div className="pt-6 border-t border-neutral-100">
              <h3 className="font-semibold text-neutral-900 mb-2">
                Think this is a mistake?
              </h3>
              <p className="text-sm text-neutral-500 mb-4">
                If you believe your account was suspended in error, you can
                submit an appeal request. Our team usually reviews appeals
                within 24-48 hours.
              </p>
              <Button className="w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl py-6">
                Submit Appeal Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
