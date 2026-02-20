'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  User,
  Heart,
  Mail,
  Lock,
  ArrowRight,
  Sun,
  Shield,
  Star,
  Briefcase,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { MultiSelect } from '@/components/ui/MultiSelect';
import { api } from '@/lib/api';

type Role = 'family' | 'caregiver';

import { Suspense } from 'react';
import { Spinner } from '@/components/ui/Spinner';

function SignupContent() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  // Map 'parent' -> 'family' and 'nanny' -> 'caregiver'
  const initialRole: Role = roleParam === 'nanny' ? 'caregiver' : 'family';

  const [role, setRole] = useState<Role>(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    categories: [] as string[],
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    categories: '',
    terms: '',
  });

  const categoriesOptions = [
    { label: 'Elder Care', value: 'EC' },
    { label: 'Child Care', value: 'CC' },
    { label: 'Special Needs', value: 'SN' },
    { label: 'Shadow Teacher', value: 'ST' },
  ];

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      categories: '',
      terms: '',
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (role === 'caregiver' && formData.categories.length === 0) {
      newErrors.categories = 'Please select at least one category';
      isValid = false;
    }

    if (!formData.agreeToTerms) {
      newErrors.terms = 'You must agree to the terms';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const backendRole = role === 'family' ? 'parent' : 'nanny';

      await api.auth.signup({
        ...formData,
        role: backendRole,
      });
      // Auto login or redirect to login
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Theme Configuration
  const themes = {
    family: {
      gradient: 'from-stone-50 via-white to-stone-100',
      accent: 'text-stone-900',
      button: 'bg-accent hover:bg-accent-600',
      border: 'border-stone-900',
      bgSoft: 'bg-stone-50',
      title: (
        <>
          Find Trusted <br />
          <span className="text-stone-900">Caregivers</span>
        </>
      ),
      description:
        'Connect with verified professionals who treat your family like their own.',
      icons: [
        {
          Icon: Sun,
          color: 'text-yellow-400 fill-yellow-400',
          delay: '0s',
          pos: 'top-[15%] left-[10%]',
        },
        {
          Icon: Heart,
          color: 'text-rose-400 fill-rose-400',
          delay: '1s',
          pos: 'top-[20%] right-[15%]',
        },
        {
          Icon: Shield,
          color: 'text-stone-600 fill-stone-200',
          delay: '2s',
          pos: 'bottom-[20%] left-[15%]',
        },
      ],
    },
    caregiver: {
      gradient: 'from-accent-50 via-white to-blue-50',
      accent: 'text-accent-600',
      button: 'bg-accent hover:bg-accent-600',
      border: 'border-accent-600',
      bgSoft: 'bg-accent-50',
      title: (
        <>
          Find Your Perfect <br />
          <span className="text-accent-600">Care Job</span>
        </>
      ),
      description:
        'Build your career, set your own rates, and connect with great families.',
      icons: [
        {
          Icon: Star,
          color: 'text-yellow-400 fill-yellow-400',
          delay: '0s',
          pos: 'top-[15%] left-[10%]',
        },
        {
          Icon: Briefcase,
          color: 'text-accent-500 fill-accent-100',
          delay: '1s',
          pos: 'top-[20%] right-[15%]',
        },
        {
          Icon: Sparkles,
          color: 'text-blue-500 fill-blue-100',
          delay: '2s',
          pos: 'bottom-[20%] left-[15%]',
        },
      ],
      testimonial: {
        text: 'I love the flexibility Keel gives me. I found a wonderful family to work with in just a week.',
        author: 'Sarah M.',
        role: 'Nanny',
      },
    },
  };

  const currentTheme = themes[role];

  return (
    <div className="h-dvh flex bg-neutral-50 justify-center transition-colors duration-500 overflow-hidden">
      <div className="w-full max-w-[1920px] h-full flex bg-white shadow-2xl mx-auto overflow-hidden">
        {/* Left Side - Branding (Desktop Only) */}
        <div
          className={`hidden lg:flex lg:w-1/2 h-full relative bg-gradient-to-br ${currentTheme.gradient} overflow-hidden items-center justify-center p-12 transition-all duration-700`}
        >
          {/* The Frame Animation (Sun & Soil) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <style jsx>{`
              @keyframes shine-pulse {
                0%,
                100% {
                  transform: scale(1);
                  opacity: 0.8;
                }
                50% {
                  transform: scale(1.1);
                  opacity: 1;
                }
              }
              @keyframes grow-wave {
                0%,
                100% {
                  transform: translateY(0) scale(1);
                  opacity: 0.8;
                }
                50% {
                  transform: translateY(-10px) scale(1.05);
                  opacity: 1;
                }
              }
              @keyframes drift {
                0%,
                100% {
                  transform: translate(0, 0);
                }
                50% {
                  transform: translate(5px, 5px);
                }
              }

              .corner-shape {
                transition: all 1.5s cubic-bezier(0.4, 0, 0.2, 1);
              }
              .is-active-corner {
                filter: drop-shadow(0 0 30px rgba(var(--glow-color), 0.5));
                opacity: 1;
              }
              .is-passive-corner {
                opacity: 0.3;
                filter: blur(2px);
                transform: scale(0.9);
              }

              .sun-rays {
                transform-origin: top left;
              }
              .soil-growth {
                transform-origin: bottom right;
              }

              .active-sun .sun-rays {
                animation: shine-pulse 4s ease-in-out infinite;
              }
              .active-soil .soil-growth {
                animation: grow-wave 5s ease-in-out infinite;
              }
            `}</style>

            <div
              className="relative w-full h-full"
              style={
                {
                  '--glow-color':
                    role === 'family' ? '94, 234, 212' : '16, 185, 129',
                } as React.CSSProperties
              }
            >
              {/* Top-Left: The Source (Sun/Rays) - Active for Family */}
              <div
                className={`absolute -top-20 -left-20 w-[500px] h-[500px] corner-shape ${role === 'family' ? 'is-active-corner active-sun' : 'is-passive-corner'}`}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 500 500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g className="sun-rays">
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      stroke={role === 'family' ? '#0D9488' : '#A7F3D0'}
                      strokeWidth="2"
                      className="transition-colors duration-1000"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="150"
                      stroke={role === 'family' ? '#5EEAD4' : '#D1FAE5'}
                      strokeWidth="40"
                      strokeOpacity="0.2"
                      className="transition-colors duration-1000"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="250"
                      stroke={role === 'family' ? '#99F6E4' : '#E0F2F1'}
                      strokeWidth="60"
                      strokeOpacity="0.1"
                      className="transition-colors duration-1000"
                    />
                    {/* Decorative Rays */}
                    <path
                      d="M100 100 L400 250"
                      stroke={role === 'family' ? '#5EEAD4' : '#A7F3D0'}
                      strokeWidth="2"
                      strokeDasharray="10 20"
                      className="transition-colors duration-1000"
                    />
                    <path
                      d="M100 100 L250 400"
                      stroke={role === 'family' ? '#5EEAD4' : '#A7F3D0'}
                      strokeWidth="2"
                      strokeDasharray="10 20"
                      className="transition-colors duration-1000"
                    />
                  </g>
                </svg>
              </div>

              {/* Bottom-Right: The Foundation (Growth/Leaves) - Active for Caregiver */}
              <div
                className={`absolute -bottom-20 -right-20 w-[600px] h-[600px] corner-shape ${role === 'caregiver' ? 'is-active-corner active-soil' : 'is-passive-corner'}`}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 600 600"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g className="soil-growth">
                    <path
                      d="M600 600 Q 400 500 300 300"
                      stroke={role === 'caregiver' ? '#059669' : '#6EE7B7'}
                      strokeWidth="2"
                      className="transition-colors duration-1000"
                    />
                    <circle
                      cx="500"
                      cy="500"
                      r="120"
                      fill={role === 'caregiver' ? '#10B981' : '#A7F3D0'}
                      fillOpacity="0.1"
                      className="transition-colors duration-1000"
                    />
                    <circle
                      cx="550"
                      cy="550"
                      r="200"
                      fill={role === 'caregiver' ? '#34D399' : '#D1FAE5'}
                      fillOpacity="0.1"
                      className="transition-colors duration-1000"
                    />
                    {/* Organic Shapes */}
                    <path
                      d="M600 400 Q 500 450 450 600"
                      stroke={role === 'caregiver' ? '#059669' : '#6EE7B7'}
                      strokeWidth="2"
                      strokeDasharray="5 10"
                      className="transition-colors duration-1000"
                    />
                    <circle
                      cx="350"
                      cy="350"
                      r="20"
                      fill={role === 'caregiver' ? '#047857' : '#6EE7B7'}
                      className="transition-colors duration-1000 opacity-60"
                    />
                    <circle
                      cx="450"
                      cy="450"
                      r="40"
                      fill={role === 'caregiver' ? '#059669' : '#34D399'}
                      className="transition-colors duration-1000 opacity-40"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div
            key={role}
            className="relative z-10 max-w-lg text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700"
          >
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight text-neutral-900 leading-[1.1]">
                {currentTheme.title}
              </h1>
              <p className="text-xl text-neutral-600 leading-relaxed">
                {currentTheme.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 md:p-12 overflow-y-auto">
          <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 my-auto">
            <div className="text-center lg:text-left">
              <Link
                href="/"
                className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8 group"
              >
                <ArrowLeft
                  size={16}
                  className="mr-2 group-hover:-translate-x-1 transition-transform"
                />
                Back to Home
              </Link>
              <h2 className="text-3xl font-bold text-neutral-900 font-display">
                Create Account
              </h2>
              <p className="text-neutral-500 mt-2">
                Start your journey with us today
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 ${role === 'family'
                  ? `${themes.family.border} ${themes.family.bgSoft} ${themes.family.accent} shadow-sm scale-[1.02]`
                  : 'border-neutral-100 hover:border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                  }`}
                onClick={() => setRole('family')}
              >
                <User
                  size={24}
                  className={
                    role === 'family'
                      ? themes.family.accent
                      : 'text-neutral-400'
                  }
                />
                <span className="font-bold text-sm">I need care</span>
              </div>
              <div
                className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 ${role === 'caregiver'
                  ? `${themes.caregiver.border} ${themes.caregiver.bgSoft} ${themes.caregiver.accent} shadow-sm scale-[1.02]`
                  : 'border-neutral-100 hover:border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                  }`}
                onClick={() => setRole('caregiver')}
              >
                <Heart
                  size={24}
                  className={
                    role === 'caregiver'
                      ? themes.caregiver.accent
                      : 'text-neutral-400'
                  }
                />
                <span className="font-bold text-sm">I want to care</span>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="Jane"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  error={errors.firstName}
                  className="bg-neutral-50 border-neutral-200 focus:bg-white transition-all duration-300 focus:ring-2 focus:ring-offset-0"
                  style={
                    {
                      '--tw-ring-color':
                        role === 'caregiver' ? '#9333ea' : '#0d9488',
                    } as React.CSSProperties
                  }
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  error={errors.lastName}
                  className="bg-neutral-50 border-neutral-200 focus:bg-white transition-all duration-300 focus:ring-2 focus:ring-offset-0"
                  style={
                    {
                      '--tw-ring-color':
                        role === 'caregiver' ? '#9333ea' : '#0d9488',
                    } as React.CSSProperties
                  }
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail size={18} />}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={errors.email}
                className="bg-neutral-50 border-neutral-200 focus:bg-white transition-all duration-300 focus:ring-2 focus:ring-offset-0"
                style={
                  {
                    '--tw-ring-color':
                      role === 'caregiver' ? '#059669' : '#0d9488',
                  } as React.CSSProperties
                }
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                leftIcon={<Lock size={18} />}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
                className="bg-neutral-50 border-neutral-200 focus:bg-white transition-all duration-300 focus:ring-2 focus:ring-offset-0"
                style={
                  {
                    '--tw-ring-color':
                      role === 'caregiver' ? '#059669' : '#0d9488',
                  } as React.CSSProperties
                }
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                leftIcon={<Lock size={18} />}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                error={errors.confirmPassword}
                className="bg-neutral-50 border-neutral-200 focus:bg-white transition-all duration-300 focus:ring-2 focus:ring-offset-0"
                style={
                  {
                    '--tw-ring-color':
                      role === 'caregiver' ? '#059669' : '#0d9488',
                  } as React.CSSProperties
                }
              />

              {role === 'caregiver' && (
                <div className="space-y-1">
                  <MultiSelect
                    label="Select Categories"
                    placeholder="Select services you provide..."
                    options={categoriesOptions}
                    value={formData.categories}
                    onChange={(categories) =>
                      setFormData({ ...formData, categories })
                    }
                    error={errors.categories}
                    className="w-full"
                  />
                  {!errors.categories && (
                    <p className="text-xs text-neutral-500">
                      Select at least one category to proceed.
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-start pt-2 flex-col gap-1">
                <Checkbox
                  label={
                    <span className="text-sm text-neutral-500">
                      I agree to the{' '}
                      <Link
                        href="/terms"
                        className={`hover:underline ${currentTheme.accent}`}
                      >
                        Terms
                      </Link>{' '}
                      and{' '}
                      <Link
                        href="/privacy"
                        className={`hover:underline ${currentTheme.accent}`}
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  }
                  checked={formData.agreeToTerms}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      agreeToTerms: !formData.agreeToTerms,
                    })
                  }
                />
                {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}
              </div>

              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                className={`w-full rounded-full text-white shadow-lg hover:shadow-xl transition-all h-12 text-base font-medium ${currentTheme.button}`}
              >
                Create Account
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500">OR</span>
              </div>
            </div>

            <button
              onClick={async () => {
                // Validate categories for nannies
                if (role === 'caregiver' && formData.categories.length === 0) {
                  alert('Please select at least one category before signing up with Google.');
                  return;
                }

                const backendRole = role === 'family' ? 'parent' : 'nanny';
                const apiUrl =
                  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
                const isCapacitor = typeof window !== 'undefined' && typeof (window as any).Capacitor !== 'undefined';
                const origin = isCapacitor
                  ? 'careconnect://auth/callback'
                  : `${window.location.origin}/auth/callback`;

                // Build URL with role, origin, and platform flag
                let oauthUrl = `${apiUrl}/auth/google?role=${backendRole}&origin=${encodeURIComponent(origin)}${
                  isCapacitor ? '&platform=mobile' : ''
                }`;

                // Add categories for nannies
                if (role === 'caregiver' && formData.categories.length > 0) {
                  const categoriesParam = formData.categories.join(',');
                  oauthUrl += `&categories=${encodeURIComponent(categoriesParam)}`;
                }

                if (isCapacitor) {
                  const { Browser } = await import('@capacitor/browser');
                  await Browser.open({ url: oauthUrl });
                } else {
                  window.location.href = oauthUrl;
                }
              }}
              type="button"
              disabled={role === 'caregiver' && formData.categories.length === 0}
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-200 rounded-full bg-white transition-colors text-neutral-700 font-medium h-12 ${role === 'caregiver' && formData.categories.length === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-neutral-50'
                }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </button>

            <div className="text-center">
              <p className="text-neutral-500">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className={`font-medium hover:underline transition-colors ${currentTheme.accent}`}
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="h-dvh flex items-center justify-center bg-stone-50"><Spinner /></div>}>
      <SignupContent />
    </Suspense>
  );
}
