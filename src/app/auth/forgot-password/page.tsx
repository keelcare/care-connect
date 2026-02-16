'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send reset email');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="h-dvh w-full flex bg-neutral-50 justify-center overflow-hidden">
        <div className="w-full max-w-[1920px] h-full flex bg-white shadow-2xl mx-auto overflow-hidden">
          <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 py-12 overflow-y-auto">
            <div className="w-full max-w-md mx-auto my-auto text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-3 font-display">
                Check your email
              </h1>
              <p className="text-neutral-500 mb-8">
                We&apos;ve sent a password reset link to{' '}
                <span className="font-medium text-neutral-700">{email}</span>
              </p>
              <p className="text-sm text-neutral-400 mb-8">
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  try again
                </button>
              </p>
              <Link href="/auth/login">
                <Button className="w-full rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white h-12 font-medium">
                  Back to Sign in
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Decorative */}
          <div className="hidden lg:flex w-1/2 h-full bg-gradient-to-br from-stone-100 to-stone-200 relative overflow-hidden items-center justify-center">
            <div className="text-center p-12">
              <div className="w-32 h-32 bg-white/50 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Mail className="w-16 h-16 text-stone-600" />
              </div>
              <h2 className="text-2xl font-bold text-stone-800 mb-4">
                Email Sent
              </h2>
              <p className="text-stone-600 max-w-xs mx-auto">
                Follow the link in your email to reset your password securely.
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
                Forgot password?
              </h1>
              <p className="text-neutral-500">
                No worries, we&apos;ll send you reset instructions.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white border-neutral-200 rounded-xl focus:ring-2 focus:ring-stone-200 focus:border-stone-400 h-12"
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-medium shadow-none transition-all"
              >
                Reset password
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-neutral-500 text-sm">
                Remember your password?{' '}
                <Link
                  href="/auth/login"
                  className="font-medium text-neutral-900 hover:underline transition-all"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Decorative */}
        <div className="hidden lg:flex w-1/2 h-full bg-gradient-to-br from-emerald-50 to-stone-100 relative overflow-hidden items-center justify-center">
          <div className="text-center p-12">
            <div className="w-32 h-32 bg-white/50 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <Mail className="w-16 h-16 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Reset Password
            </h2>
            <p className="text-stone-600 max-w-xs mx-auto">
              Enter your email and we&apos;ll send you a link to reset your
              password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
