'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User as UserIcon,
  GraduationCap,
  Heart,
  IndianRupee,
  ShieldCheck,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/ToastProvider';
import { api } from '@/lib/api';
import {
  NannyProfileFormState,
  buildInitialFormState,
  toUpdateUserDto,
  toUpsertOnboardingDto,
} from '@/types/nannyProfileForm';
import { PersonalInfoSection } from '@/components/nanny-profile/PersonalInfoSection';
import { EducationExperienceSection } from '@/components/nanny-profile/EducationExperienceSection';
import { SkillsInterestsSection } from '@/components/nanny-profile/SkillsInterestsSection';
import { CompensationSection } from '@/components/nanny-profile/CompensationSection';
import { ConsentsSection } from '@/components/nanny-profile/ConsentsSection';
import { DocumentsSection } from '@/components/nanny-profile/DocumentsSection';

const STEPS = [
  {
    label: 'Personal details',
    hint: 'Who you are',
    icon: UserIcon,
    heading: 'Let’s start with the basics',
    blurb: 'Tell us who you are and how families can reach you.',
  },
  {
    label: 'Education & experience',
    hint: 'Your background',
    icon: GraduationCap,
    heading: 'Your teaching background',
    blurb: 'Share your qualifications and the children you’ve worked with.',
  },
  {
    label: 'Skills & interests',
    hint: 'What you offer',
    icon: Heart,
    heading: 'What you bring to the child',
    blurb: 'The subjects you teach and the activities you love.',
  },
  {
    label: 'Compensation',
    hint: 'Salary & start date',
    icon: IndianRupee,
    heading: 'Compensation & availability',
    blurb: 'Let us know your expectations and when you can begin.',
  },
  {
    label: 'Agreements',
    hint: 'Consents',
    icon: ShieldCheck,
    heading: 'A few agreements',
    blurb: 'Please review and confirm the following before we proceed.',
  },
  {
    label: 'Documents',
    hint: 'Verification',
    icon: FileText,
    heading: 'Upload your documents',
    blurb: 'The final step — verify your identity to go live.',
  },
];

export default function NannyOnboardingPage() {
  return (
    <Suspense fallback={null}>
      <NannyOnboardingContent />
    </Suspense>
  );
}

function NannyOnboardingContent() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<NannyProfileFormState>(buildInitialFormState(null));
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      setForm(buildInitialFormState(user));
      if (searchParams.get('step') === 'documents') {
        setStep(STEPS.length - 1);
      }
      setReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  const update = (patch: Partial<NannyProfileFormState>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const persistProgress = async () => {
    if (!user) return;
    if (step === 0) {
      await api.users.update(user.id, toUpdateUserDto(form));
    }
    await api.nannyOnboarding.update(toUpsertOnboardingDto(form));
  };

  const handleNext = async () => {
    if (step === 0 && form.phone.slice(4).replace(/\D/g, '').length !== 10) {
      addToast({ message: 'Phone number must be exactly 10 digits.', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      if (step === 0) {
        const { isAvailable } = await api.users.checkPhone(form.phone);
        if (!isAvailable) {
          throw new Error('This phone number is already registered to another account.');
        }
      }
      await persistProgress();
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
      await refreshUser();
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      addToast({ message: err.message || 'Failed to save. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinish = async () => {
    const pendingDocs = Object.keys(form.pendingDocuments || {});
    const uploadedTypes = new Set((user?.identity_documents || []).map((d: any) => d.type));
    const allDocTypes = new Set([...Array.from(uploadedTypes), ...pendingDocs]);
    
    const missingDocs = ['AADHAR', 'PAN', 'RESUME'].filter((t) => !allDocTypes.has(t));
    if (missingDocs.length > 0) {
      addToast({ message: `Missing required documents: ${missingDocs.join(', ')}`, type: 'error' });
      return;
    }

    for (const type of pendingDocs) {
      if ((type === 'PAN' || type === 'AADHAR') && !form.pendingDocuments[type].idNumber.trim()) {
        addToast({ message: `Please provide ID number for ${type}`, type: 'error' });
        return;
      }
    }

    if (!form.trainingAgreement || !form.placementFeeAgreement || !form.policeVerificationConsent || !form.declarationConfirmed) {
      addToast({ message: 'All consents and the declaration must be confirmed before submitting', type: 'error' });
      return;
    }

    setSaving(true);
    try {
      // Upload pending documents sequentially to avoid hitting rate limits or overwhelming the server
      for (const [type, doc] of Object.entries(form.pendingDocuments || {})) {
        const formData = new FormData();
        formData.append('idType', type);
        if (doc.idNumber) formData.append('idNumber', doc.idNumber);
        formData.append('file', doc.file);
        await api.verification.upload(formData);
      }

      await persistProgress();
      await api.nannyOnboarding.complete();
      await refreshUser();
      
      update({ pendingDocuments: {} });
      
      addToast({ message: 'Onboarding submitted for review!', type: 'success' });
      router.push('/dashboard');
    } catch (err: any) {
      addToast({ message: err.message || 'Please complete all required fields first.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !ready) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#0D2B45]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  const active = STEPS[step];
  const progressPct = Math.round(((step + 1) / STEPS.length) * 100);
  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="min-h-dvh lg:h-dvh flex flex-col lg:flex-row bg-neutral-50 lg:overflow-hidden">
      {/* ─────────────── Branded side panel ─────────────── */}
      <aside className="relative lg:w-[38%] lg:max-w-md bg-[#0D2B45] text-white overflow-hidden shrink-0">
        {/* soft decorative accents */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 w-56 h-56 rounded-full bg-white/5" />

        <div className="relative h-full flex flex-col px-8 py-8 lg:px-10 lg:py-12">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden">
              <Image src="/logo_transparent.png" alt="Keel" width={28} height={28} className="object-contain" />
            </div>
            <span className="font-heading text-xl tracking-tight">Keel</span>
          </div>

          {/* Heading */}
          <div className="mt-10 lg:mt-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Caregiver onboarding
            </p>
            <h1 className="font-heading text-2xl lg:text-[28px] leading-snug mt-3 max-w-xs">
              Build a profile families trust
            </h1>
            <p className="text-sm text-white/60 mt-3 leading-relaxed max-w-xs">
              A complete profile helps us match you with the right children and
              move your placement forward faster.
            </p>
          </div>

          {/* Vertical step tracker (desktop) */}
          <nav className="hidden lg:block mt-12 flex-1">
            <ol className="space-y-1">
              {STEPS.map((s, i) => {
                const done = step > i;
                const current = step === i;
                return (
                  <li key={s.label} className="relative flex items-start gap-4 py-2.5">
                    {/* connector line */}
                    {i < STEPS.length - 1 && (
                      <span
                        className={`absolute left-[15px] top-9 h-[calc(100%-4px)] w-px transition-colors duration-300 ${
                          done ? 'bg-[#6AAE8A]/60' : 'bg-white/10'
                        }`}
                      />
                    )}
                    <span
                      className={`relative z-10 shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        current
                          ? 'bg-white text-[#0D2B45] shadow-lg shadow-black/20 ring-4 ring-white/15'
                          : done
                          ? 'bg-[#6AAE8A] text-white'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {done ? <Check size={14} strokeWidth={3} /> : i + 1}
                    </span>
                    <div className="pt-1">
                      <p
                        className={`text-sm font-semibold leading-none transition-colors ${
                          current ? 'text-white' : done ? 'text-white/70' : 'text-white/40'
                        }`}
                      >
                        {s.label}
                      </p>
                      <p
                        className={`text-xs mt-1 transition-colors ${
                          current ? 'text-white/50' : 'text-white/25'
                        }`}
                      >
                        {s.hint}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Reassurance footer (desktop) */}
          <div className="hidden lg:flex items-center gap-2.5 mt-auto pt-8 text-white/45">
            <Lock size={13} className="shrink-0" />
            <p className="text-xs leading-relaxed">
              Your information is encrypted and only shared with verified families.
            </p>
          </div>

          {/* Mobile progress bar */}
          <div className="lg:hidden mt-8">
            <div className="flex items-center justify-between text-xs text-white/60 mb-2">
              <span className="font-semibold text-white">{active.label}</span>
              <span>
                Step {step + 1} of {STEPS.length}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#6AAE8A] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* ─────────────── Form panel ─────────────── */}
      <main className="flex-1 flex flex-col lg:overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col px-5 py-8 lg:px-12 lg:py-14">
          {/* Step header */}
          <header className="mb-8">
            <p className="hidden lg:block text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 className="font-heading text-2xl lg:text-3xl text-primary-900 mt-2">
              {active.heading}
            </h2>
            <p className="text-neutral-500 mt-2 leading-relaxed">{active.blurb}</p>
          </header>

          {/* Search-visibility notice — nannies with incomplete profiles are not
              shown to families. */}
          <div className="mb-8 flex items-start gap-3 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200/70">
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              Your profile stays <span className="font-semibold">hidden from families</span> until
              you finish every step and submit for review. Caregivers with missing
              details don’t appear in family searches.
            </p>
          </div>

          {/* Step body */}
          <div className="flex-1">
            {step === 0 && (
              <PersonalInfoSection
                form={form}
                update={update}
                email={user?.email || ''}
                onAvatarUploaded={refreshUser}
              />
            )}
            {step === 1 && <EducationExperienceSection form={form} update={update} />}
            {step === 2 && <SkillsInterestsSection form={form} update={update} />}
            {step === 3 && <CompensationSection form={form} update={update} />}
            {step === 4 && <ConsentsSection form={form} update={update} />}
            {step === 5 && (
              <DocumentsSection
                documents={user?.identity_documents || []}
                form={form}
                update={update}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-neutral-200/70">
            {step > 0 ? (
              <Button type="button" variant="ghost" onClick={handleBack} disabled={saving}>
                <ArrowLeft size={16} />
                Back
              </Button>
            ) : (
              // No "finish later" escape — nannies must complete onboarding before
              // they can be matched. Empty spacer keeps "Continue" right-aligned.
              <span aria-hidden className="w-px" />
            )}

            {!isLastStep ? (
              <Button type="button" onClick={handleNext} isLoading={saving} className="px-8">
                Continue
                <ArrowRight size={16} />
              </Button>
            ) : (
              <Button type="button" onClick={handleFinish} isLoading={saving} className="px-8">
                {saving 
                  ? Object.keys(form.pendingDocuments || {}).length > 0 ? 'Uploading documents...' : 'Submitting...' 
                  : 'Submit for review'}
                {!saving && <Check size={16} />}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
