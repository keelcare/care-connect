'use client';

import React, { useEffect, useState } from 'react';
import {
  MapPin,
  Baby,
  Rocket,
  ArrowRight,
  CheckCircle2,
  Loader2,
  LocateFixed,
  CalendarDays,
  ChevronDown,
} from 'lucide-react';
import { User, Child } from '@/types/api';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface ParentOnboardingWizardProps {
  user: User;
  onComplete: () => void;
}

type WizardStep = 1 | 2 | 3;

const STEPS = [
  { label: 'Your Location', icon: MapPin },
  { label: 'First Child', icon: Baby },
  { label: 'Get Started', icon: Rocket },
];

// ─── Step 1: Address ──────────────────────────────────────────────────────────

function AddressStep({
  user,
  onSave,
}: {
  user: User;
  onSave: () => void;
}) {
  const [address, setAddress] = useState(user.profiles?.address ?? '');
  const [detecting, setDetecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDetect = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setDetecting(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const result = await api.location.reverseGeocode(
            pos.coords.latitude,
            pos.coords.longitude
          );
          const resolved =
            (result as any)?.data?.address ?? (result as any)?.address ?? '';
          if (resolved) setAddress(resolved);
          else setError('Could not resolve your location to an address.');
        } catch {
          setError('Failed to detect location. Please enter manually.');
        } finally {
          setDetecting(false);
        }
      },
      () => {
        setDetecting(false);
        setError('Location access denied. Please enter your address manually.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSave = async () => {
    if (!address.trim()) {
      setError('Please enter your address.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      // Geocode address to get lat/lng
      let lat: number | undefined;
      let lng: number | undefined;
      try {
        const geo = await api.location.geocode(address.trim());
        lat = (geo as any)?.data?.lat ?? (geo as any)?.lat;
        lng = (geo as any)?.data?.lng ?? (geo as any)?.lng;
      } catch {
        // Geocode failure is non-fatal — save address without coords
      }
      await api.users.update(user.id, {
        address: address.trim(),
        ...(lat != null && lng != null ? { lat, lng } : {}),
      });
      onSave();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save address. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-5">
      <div className="flex items-start gap-4 p-4 bg-[#0D2B45]/5 border border-[#0D2B45]/10 rounded-2xl">
        <div className="w-10 h-10 rounded-xl bg-[#0D2B45] flex items-center justify-center shrink-0 mt-0.5">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0D2B45]">
            Why do we need your address?
          </p>
          <p className="text-sm text-neutral-500 mt-0.5 leading-relaxed">
            We use it to match you with caregivers in your area and show
            accurate distances.
          </p>
        </div>
      </div>

      {/* Address input */}
      <div className="space-y-2">
        <label
          htmlFor="parent-address"
          className="block text-sm font-semibold text-[#0D2B45]"
        >
          Home Address
        </label>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          <input
            id="parent-address"
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. 12 Bandra West, Mumbai"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0D2B45]/20 focus:border-[#0D2B45]/40 transition"
          />
        </div>

        {/* Detect location */}
        <button
          type="button"
          onClick={handleDetect}
          disabled={detecting}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0D2B45] hover:text-[#0D2B45]/70 disabled:opacity-50 transition mt-1"
        >
          {detecting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LocateFixed className="w-3.5 h-3.5" />
          )}
          {detecting ? 'Detecting your location…' : 'Use my current location'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      <Button
        onClick={handleSave}
        disabled={saving || !address.trim()}
        className="w-full"
        size="lg"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving…
          </>
        ) : (
          <>
            Save & Continue
            <ArrowRight size={16} className="ml-1" />
          </>
        )}
      </Button>
    </div>
  );
}

// ─── Step 2: First Child ──────────────────────────────────────────────────────

function ChildProfileStep({
  onSave,
  onSkip,
}: {
  onSave: () => void;
  onSkip: () => void;
}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [profileType, setProfileType] = useState<'STANDARD' | 'SPECIAL_NEEDS'>(
    'STANDARD'
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxDob = new Date().toISOString().split('T')[0];

  const validate = (): string | null => {
    if (!firstName.trim()) return 'First name is required.';
    if (!lastName.trim()) return 'Last name is required.';
    if (!dob) return 'Date of birth is required.';
    if (new Date(dob) >= new Date()) return 'Date of birth must be in the past.';
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.family.create({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        dob,
        gender,
        profile_type: profileType,
      });
      onSave();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to add child profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0D2B45]/20 focus:border-[#0D2B45]/40 transition';
  const labelCls = 'block text-sm font-semibold text-[#0D2B45] mb-1.5';

  return (
    <div className="p-6 md:p-8 space-y-4">
      <p className="text-sm text-neutral-500 leading-relaxed">
        Add your first child's details so caregivers can prepare. You can add
        more children later in{' '}
        <span className="font-semibold text-neutral-700">Family Settings</span>.
      </p>

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Aryan"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Sharma"
            className={inputCls}
          />
        </div>
      </div>

      {/* DOB */}
      <div>
        <label className={labelCls}>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            Date of Birth
          </span>
        </label>
        <input
          type="date"
          value={dob}
          max={maxDob}
          onChange={(e) => {
            setDob(e.target.value);
            if (error) setError(null);
          }}
          className={inputCls}
        />
      </div>

      {/* Gender */}
      <div>
        <label className={labelCls}>Gender</label>
        <div className="relative">
          <select
            value={gender}
            onChange={(e) =>
              setGender(e.target.value as 'MALE' | 'FEMALE' | 'OTHER')
            }
            className={`${inputCls} appearance-none pr-9`}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      {/* Care type */}
      <div>
        <label className={labelCls}>Care Type</label>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              {
                value: 'STANDARD',
                title: 'Standard Care',
                desc: 'Regular childcare needs',
              },
              {
                value: 'SPECIAL_NEEDS',
                title: 'Special Needs',
                desc: 'Additional support required',
              },
            ] as const
          ).map(({ value, title, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setProfileType(value)}
              className={`text-left px-4 py-3 rounded-xl border transition-all ${
                profileType === value
                  ? 'bg-[#0D2B45] border-[#0D2B45] text-white'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:border-[#0D2B45]/40'
              }`}
            >
              <p className="text-sm font-semibold">{title}</p>
              <p
                className={`text-xs mt-0.5 ${profileType === value ? 'text-white/70' : 'text-neutral-400'}`}
              >
                {desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex-1"
          size="lg"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              Add Child
              <ArrowRight size={16} className="ml-1" />
            </>
          )}
        </Button>
        <button
          type="button"
          onClick={onSkip}
          className="text-sm font-medium text-neutral-400 hover:text-neutral-600 transition shrink-0"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: Get Started CTA ──────────────────────────────────────────────────

function GetStartedStep({
  user,
  onFinish,
}: {
  user: User;
  onFinish: () => void;
}) {
  return (
    <div className="p-8 md:p-10 text-center flex flex-col items-center">
      {/* Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-[#6AAE8A]/10 border border-[#6AAE8A]/20 flex items-center justify-center">
          <Rocket className="w-9 h-9 text-[#6AAE8A]" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0D2B45] border-2 border-white flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      {/* Status pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6AAE8A]/10 text-[#6AAE8A] text-xs font-semibold tracking-wide uppercase mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-[#6AAE8A] animate-pulse" />
        Ready to go
      </div>

      <h2 className="font-heading text-2xl font-medium text-[#0D2B45] mb-2">
        You're all set!
      </h2>
      <p className="text-sm text-neutral-500 max-w-xs mb-8 leading-relaxed">
        Your profile is ready. Browse caregivers in your area and book your
        first session.
      </p>

      {/* Checklist */}
      <div className="w-full max-w-xs text-left space-y-2.5 mb-8">
        {[
          { title: 'Address saved', desc: 'Caregivers near you can be found' },
          { title: 'Child profile added', desc: 'Caregivers can prepare for care' },
          { title: 'Profile complete', desc: 'Ready to make your first booking' },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-4 py-3 rounded-xl border bg-[#6AAE8A]/10 border-[#6AAE8A]/20"
          >
            <div className="mt-0.5 w-5 h-5 rounded-full bg-[#6AAE8A] flex items-center justify-center shrink-0">
              <CheckCircle2 size={12} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0D2B45]">{item.title}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-neutral-400 mb-7">
        Logged in as{' '}
        <span className="font-semibold text-neutral-600">{user.email}</span>
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button onClick={onFinish} size="lg" className="w-full">
          Browse Caregivers
          <ArrowRight size={16} className="ml-1" />
        </Button>
        <button
          type="button"
          onClick={onFinish}
          className="text-sm font-medium text-neutral-400 hover:text-neutral-600 transition"
        >
          Go to dashboard
        </button>
      </div>
    </div>
  );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

export function ParentOnboardingWizard({
  user,
  onComplete,
}: ParentOnboardingWizardProps) {
  const [step, setStep] = useState<WizardStep>(1);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleAddressSaved = () => setStep(2);
  const handleChildSaved = () => setStep(3);
  const handleChildSkipped = () => setStep(3);

  const handleFinish = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('parent_onboarding_completed', 'true');
    }
    onComplete();
  };

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
              Let's set up your profile so we can find the right caregiver for
              your family.
            </p>
          </div>

          {/* Step progress — hidden on final step */}
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
                        ${
                          isCurrent
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
          {step === 1 && (
            <AddressStep user={user} onSave={handleAddressSaved} />
          )}
          {step === 2 && (
            <ChildProfileStep
              onSave={handleChildSaved}
              onSkip={handleChildSkipped}
            />
          )}
          {step === 3 && (
            <GetStartedStep user={user} onFinish={handleFinish} />
          )}
        </div>
      </div>
    </div>
  );
}
