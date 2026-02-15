'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  LogOut,
  Mail,
  FileText,
  MessageCircle,
  BookOpen,
  AlertCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NannyHelpPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isContestingBan, setIsContestingBan] = useState(false);
  const [contestMessage, setContestMessage] = useState('');

  const isBanned = user?.is_active === false;

  const handleContestBan = async () => {
    if (!contestMessage.trim()) {
      alert(
        'Please enter a message explaining why you think this ban is incorrect.'
      );
      return;
    }

    // TODO: Send to backend API
    alert(
      'Your appeal has been submitted. Our team will review it within 24-48 hours.'
    );
    setIsContestingBan(false);
    setContestMessage('');
  };

  return (
    <div className="min-h-dvh bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
            >
              ←
            </button>
            <h1 className="text-xl font-bold text-stone-900 font-display">
              Help & Support
            </h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="rounded-xl"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Ban Alert - Only show if user is banned */}
        {isBanned && (
          <div className="bg-red-50 border border-red-200 rounded-[24px] p-6 shadow-soft">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-xl text-red-600 shrink-0">
                <ShieldAlert size={24} />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="font-bold text-red-900 text-lg mb-1">
                    Account Suspended
                  </h2>
                  <p className="text-red-700 text-sm">
                    Your account has been temporarily suspended due to:{' '}
                    <strong>
                      {user.ban_reason || 'Terms of Service violation'}
                    </strong>
                  </p>
                </div>

                {!isContestingBan && (
                  <Button
                    onClick={() => setIsContestingBan(true)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                  >
                    <AlertCircle size={18} className="mr-2" />
                    Contest This Ban
                  </Button>
                )}

                {isContestingBan && (
                  <div className="bg-white rounded-xl p-4 border border-red-200 space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-stone-900 mb-2">
                        Why do you believe this ban is incorrect?
                      </label>
                      <textarea
                        value={contestMessage}
                        onChange={(e) => setContestMessage(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                        placeholder="Provide details about why you think this suspension was made in error..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleContestBan}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl flex-1"
                      >
                        Submit Appeal
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsContestingBan(false)}
                        className="rounded-xl"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* General Help Resources */}
        <div className="bg-white rounded-[24px] border border-stone-100 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-stone-100">
            <h2 className="text-lg font-bold text-stone-900 font-display">
              How Can We Help You?
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Browse our help resources or contact support directly
            </p>
          </div>

          <div className="divide-y divide-stone-100">
            {/* Contact Support */}
            <a
              href="mailto:support@careconnect.com?subject=Nanny Support Request"
              className="flex items-center justify-between p-5 hover:bg-stone-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:bg-emerald-200 transition-colors">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="font-semibold text-stone-900">
                    Contact Support
                  </div>
                  <div className="text-sm text-stone-500">
                    Get help from our team via email
                  </div>
                </div>
              </div>
              <ExternalLink
                size={18}
                className="text-stone-300 group-hover:text-emerald-500"
              />
            </a>

            {/* Community Guidelines */}
            <a
              href="#"
              className="flex items-center justify-between p-5 hover:bg-stone-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="font-semibold text-stone-900">
                    Community Guidelines
                  </div>
                  <div className="text-sm text-stone-500">
                    Review platform policies and rules
                  </div>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-stone-300 group-hover:text-blue-500"
              />
            </a>

            {/* FAQ */}
            <a
              href="#"
              className="flex items-center justify-between p-5 hover:bg-stone-50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-xl group-hover:bg-purple-200 transition-colors">
                  <BookOpen size={24} />
                </div>
                <div>
                  <div className="font-semibold text-stone-900">
                    FAQ & Help Center
                  </div>
                  <div className="text-sm text-stone-500">
                    Find answers to common questions
                  </div>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-stone-300 group-hover:text-purple-500"
              />
            </a>

            {/* Live Chat (if available) */}
            <button
              onClick={() => alert('Live chat coming soon!')}
              className="w-full flex items-center justify-between p-5 hover:bg-stone-50 transition-colors group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl group-hover:bg-amber-200 transition-colors">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <div className="font-semibold text-stone-900">
                    Live Chat Support
                  </div>
                  <div className="text-sm text-stone-500">
                    Chat with our support team in real-time
                  </div>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-stone-300 group-hover:text-amber-500"
              />
            </button>
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-white rounded-[24px] border border-stone-100 shadow-soft p-6">
          <h3 className="font-bold text-stone-900 mb-4">Common Questions</h3>
          <div className="space-y-4">
            <details className="group">
              <summary className="cursor-pointer font-medium text-stone-900 hover:text-emerald-600 transition-colors">
                How do I update my profile information?
              </summary>
              <p className="mt-2 text-sm text-stone-600 pl-4">
                Go to Dashboard → Profile → Edit Profile. You can update your
                bio, skills, hourly rate, and availability.
              </p>
            </details>
            <details className="group">
              <summary className="cursor-pointer font-medium text-stone-900 hover:text-emerald-600 transition-colors">
                How do I get verified?
              </summary>
              <p className="mt-2 text-sm text-stone-600 pl-4">
                Navigate to Verification page and upload your identity documents
                (Aadhar/PAN/Voter ID). Admin will review within 24-48 hours.
              </p>
            </details>
            <details className="group">
              <summary className="cursor-pointer font-medium text-stone-900 hover:text-emerald-600 transition-colors">
                How do bookings work?
              </summary>
              <p className="mt-2 text-sm text-stone-600 pl-4">
                Parents send you booking requests. You can accept or decline
                from your Dashboard. Once accepted, you'll receive booking
                details and can chat with the parent.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
