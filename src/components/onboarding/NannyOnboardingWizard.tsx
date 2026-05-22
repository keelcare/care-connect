'use client';

import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  FileText,
  ArrowRight,
  BadgeCheck,
  AlertCircle,
} from 'lucide-react';
import { User } from '@/types/api';
import VerificationUploadForm from '@/components/verification/VerificationUploadForm';

import { WizardAvailabilityStep } from '@/components/onboarding/WizardAvailabilityStep';
import { Button } from '@/components/ui/button';

interface NannyOnboardingWizardProps {
  user: User;
  onComplete: () => void;
}

type WizardStep = 1 | 2 | 3;

function getInitialStep(user: User): WizardStep {
  const status = user.identity_verification_status;
  if (status === 'pending') return 3;
  return 1;
}

const STEPS = [
  { label: 'Identity', icon: FileText },
  { label: 'Availability', icon: Clock },
  { label: 'Review', icon: BadgeCheck },
];

export function NannyOnboardingWizard({
  user,
  onComplete,
}: NannyOnboardingWizardProps) {
  const [step, setStep] = useState<WizardStep>(getInitialStep(user));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleUploadSuccess = (data: { identity_verification_status?: string }) => {
    void data;
    setStep(2);
  };

  const handleAvailabilitySaved = () => setStep(3);
  const handleAvailabilitySkipped = () => setStep(3);
  const handleFinish = () => onComplete();

  const isRejected = user.identity_verification_status === 'rejected';

  return (
    <div
      className={`
        fixed inset-0 z-100 flex items-center justify-center p-4
        transition-all duration-300
        ${visible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0D2B45]/70 backdrop-blur-sm" />

      {/* Wizard Card */}
      <div
        className={`
          relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl
          overflow-hidden flex flex-col max-h-[92dvh]
          transition-all duration-300
          ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
      >
        {/* Header — navy brand bar */}
        <div className="relative bg-[#0D2B45] px-8 py-7 shrink-0 overflow-hidden">
          {/* Subtle circle accents */}
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-white/50 mb-2">
              Getting Started
            </p>
            <h1 className="font-heading text-2xl font-medium text-white leading-snug">
              Welcome to Keel
            </h1>
            <p className="text-sm text-white/60 mt-1">
              Complete these steps to start accepting care requests.
            </p>
          </div>

          {/* Step progress */}
          {step !== 3 && (
            <div className="relative z-10 mt-6 flex items-center gap-2">
              {STEPS.map((s, i) => {
                const stepNum = (i + 1) as WizardStep;
                const isCompleted = step > stepNum;
                const isCurrent = step === stepNum;
                return (
                  <React.Fragment key={s.label}>
                    <div
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                        transition-all duration-300
                        ${isCurrent
                          ? 'bg-white text-[#0D2B45] shadow-md'
                          : isCompleted
                            ? 'bg-white/20 text-white'
                            : 'bg-white/8 text-white/40'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={11} className="text-[#6AAE8A]" />
                      ) : (
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold
                            ${isCurrent ? 'bg-[#0D2B45] text-white' : 'bg-white/10 text-white/40'}
                          `}
                        >
                          {stepNum}
                        </span>
                      )}
                      {s.label}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-px transition-all duration-500 ${isCompleted ? 'bg-white/40' : 'bg-white/15'}`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        {/* Step Content — scrollable */}
        <div className="flex-1 overflow-y-auto bg-neutral-50">

          {/* ── Step 1: Identity Upload ────────────────────────────────── */}
          {step === 1 && (
            <div className="p-6 md:p-8">
              {isRejected && user.verification_rejection_reason && (
                <div className="mb-6 flex items-start gap-3 p-4 bg-error-50 border border-error-100 rounded-2xl">
                  <AlertCircle className="w-5 h-5 text-error-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-error-700">
                      Previous submission was rejected
                    </p>
                    <p className="text-sm text-error-600 mt-0.5">
                      {user.verification_rejection_reason}
                    </p>
                  </div>
                </div>
              )}
              <VerificationUploadForm onSuccess={handleUploadSuccess} />
            </div>
          )}

          {/* ── Step 2: Availability ───────────────────────────────────── */}
          {step === 2 && (
            <div className="p-6 md:p-8 flex flex-col min-h-[380px]">
              <WizardAvailabilityStep
                user={user}
                onSave={handleAvailabilitySaved}
                onSkip={handleAvailabilitySkipped}
              />
            </div>
          )}

          {/* ── Step 3: Awaiting Verification ─────────────────────────── */}
          {step === 3 && (
            <div className="p-8 md:p-10 text-center flex flex-col items-center">
              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-[#0D2B45]/8 border border-[#0D2B45]/10 flex items-center justify-center">
                  <ShieldCheck className="w-9 h-9 text-[#0D2B45]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#6AAE8A] border-2 border-white flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              {/* Status pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D2B45]/8 text-[#0D2B45] text-xs font-semibold tracking-wide uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6AAE8A] animate-pulse" />
                Under Review
              </div>

              <h2 className="font-heading text-2xl font-medium text-[#0D2B45] mb-2">
                You&apos;re almost there
              </h2>
              <p className="text-sm text-neutral-500 max-w-xs mb-8 leading-relaxed">
                Our team is reviewing your identity documents — usually within{' '}
                <span className="font-semibold text-neutral-700">1–2 business days</span>.
              </p>

              {/* What's next */}
              <div className="w-full max-w-xs text-left space-y-2.5 mb-8">
                {[
                  {
                    title: 'Documents submitted',
                    desc: 'Your documents are in our queue',
                    done: true,
                  },
                  {
                    title: 'Manual verification',
                    desc: 'Our team reviews your documents',
                    done: false,
                  },
                  {
                    title: 'Profile goes live',
                    desc: 'You can start accepting requests',
                    done: false,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 px-4 py-3 rounded-xl border transition-all ${
                      item.done
                        ? 'bg-[#6AAE8A]/10 border-[#6AAE8A]/20'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      item.done ? 'bg-[#6AAE8A]' : 'bg-neutral-200'
                    }`}>
                      {item.done
                        ? <CheckCircle2 size={12} className="text-white" />
                        : <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                      }
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${item.done ? 'text-[#0D2B45]' : 'text-neutral-600'}`}>
                        {item.title}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Email notice */}
              <p className="text-xs text-neutral-400 mb-7">
                We&apos;ll notify{' '}
                <span className="font-semibold text-neutral-600">{user.email}</span>{' '}
                once you&apos;re approved.
              </p>

              <Button onClick={handleFinish} size="lg">
                Go to Dashboard
                <ArrowRight size={16} className="ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
