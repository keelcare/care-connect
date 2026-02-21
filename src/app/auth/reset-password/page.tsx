'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = () => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to reset password');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="h-dvh w-full flex bg-neutral-50 justify-center overflow-hidden">
        <div className="w-full max-w-[1920px] h-full flex bg-white shadow-2xl mx-auto overflow-hidden">
          <div className="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 py-12">
            <div className="w-full max-w-md mx-auto my-auto text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-3 font-display">
                Invalid Reset Link
              </h1>
              <p className="text-neutral-500 mb-8">
                The password reset link is invalid or has expired. Please
                request a new one.
              </p>
              <Link href="/auth/forgot-password">
                <Button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-medium">
                  Request New Link
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="h-dvh w-full flex bg-neutral-50 justify-center overflow-hidden">
        <div className="w-full max-w-[1920px] h-full flex bg-white shadow-2xl mx-auto overflow-hidden">
          <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 py-12 overflow-y-auto">
            <div className="w-full max-w-md mx-auto my-auto text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-3 font-display">
                Password Reset!
              </h1>
              <p className="text-neutral-500 mb-8">
                Your password has been successfully reset. You can now sign in
                with your new password.
              </p>
              <Link href="/auth/login">
                <Button className="w-full rounded-xl bg-primary-900 hover:bg-primary-800 text-white h-12 font-medium">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Decorative */}
          <div className="hidden lg:flex w-1/2 h-full bg-gradient-to-br from-primary-50 to-stone-100 relative overflow-hidden items-center justify-center">
            <div className="text-center p-12">
              <div className="w-32 h-32 bg-white/50 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <CheckCircle className="w-16 h-16 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-stone-800 mb-4">
                Success!
              </h2>
              <p className="text-stone-600 max-w-xs mx-auto">
                Your password has been updated. You&apos;re all set!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh w-full flex bg-neutral-50 justify-center overflow-hidden">
      <div className="w-full max-w-[1920px] h-full flex bg-white shadow-2xl mx-auto overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 py-12 overflow-y-auto">
          <div className="w-full max-w-md mx-auto my-auto">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8 group"
            >
              <ArrowLeft
                size={16}
                className="mr-2 group-hover:-translate-x-1 transition-transform"
              />
              Back to Sign in
            </Link>

            <div className="mb-10">
              <Link href="/" className="inline-block mb-8">
                <span className="text-2xl font-bold text-stone-900 tracking-tight font-display">
                  Keel
                </span>
              </Link>
              <h1 className="text-3xl font-bold text-neutral-900 mb-3 font-display">
                Set new password
              </h1>
              <p className="text-neutral-500">
                Your new password must be at least 8 characters long.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white border-neutral-200 rounded-xl focus:ring-2 focus:ring-stone-200 focus:border-stone-400 h-12"
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-white border-neutral-200 rounded-xl focus:ring-2 focus:ring-stone-200 focus:border-stone-400 h-12"
              />

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${password.length >= (i + 1) * 3
                          ? password.length >= 12
                            ? 'bg-primary-500'
                            : password.length >= 8
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          : 'bg-neutral-200'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500">
                    {password.length < 8
                      ? 'Weak'
                      : password.length < 12
                        ? 'Good'
                        : 'Strong'}{' '}
                    password
                  </p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                className="w-full rounded-xl bg-primary-900 hover:bg-primary-800 text-white h-12 font-medium shadow-none transition-all"
              >
                Reset password
              </Button>
            </form>
          </div>
        </div>

        {/* Right Side - Decorative */}
        <div className="hidden lg:flex w-1/2 h-full bg-gradient-to-br from-stone-100 to-primary-50 relative overflow-hidden items-center justify-center">
          <div className="text-center p-12">
            <div className="w-32 h-32 bg-white/50 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Lock className="w-16 h-16 text-stone-600" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Secure Password
            </h2>
            <p className="text-stone-600 max-w-xs mx-auto">
              Choose a strong password to keep your account safe and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="h-dvh w-full flex items-center justify-center bg-neutral-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
