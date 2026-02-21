'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [status, setStatus] = useState<
    'loading' | 'success' | 'error' | 'no-token'
  >('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      return;
    }

    const verifyEmail = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/auth/verify?token=${token}`);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Verification failed');
        }

        setStatus('success');
        setMessage('Your email has been verified successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(
          err instanceof Error
            ? err.message
            : 'Verification failed. The link may be invalid or expired.'
        );
      }
    };

    verifyEmail();
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="h-dvh w-full flex bg-neutral-50 justify-center overflow-hidden">
        <div className="w-full max-w-[1920px] h-full flex bg-white shadow-2xl mx-auto overflow-hidden">
          <div className="w-full h-full flex flex-col justify-center items-center px-8 py-12">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-stone-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-3 font-display">
              Verifying your email...
            </h1>
            <p className="text-neutral-500">
              Please wait while we verify your email address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'no-token') {
    return (
      <div className="h-dvh w-full flex bg-neutral-50 justify-center overflow-hidden">
        <div className="w-full max-w-[1920px] h-full flex bg-white shadow-2xl mx-auto overflow-hidden">
          <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 py-12 overflow-y-auto">
            <div className="w-full max-w-md mx-auto my-auto text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-amber-600" />
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-3 font-display">
                Email Verification
              </h1>
              <p className="text-neutral-500 mb-8">
                Please check your email inbox and click the verification link we
                sent you when you signed up.
              </p>
              <div className="space-y-4">
                <Link href="/auth/login">
                  <Button className="w-full rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white h-12 font-medium">
                    Go to Sign in
                  </Button>
                </Link>
                <div className="text-sm text-neutral-400">
                  Didn&apos;t receive the email?{' '}
                  <button
                    onClick={async () => {
                      try {
                        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
                        // Since we don't have the email here easily without a token, 
                        // this button usually works after a signup attempt or from a login failure.
                        // For now, let's assume we can't resend without knowing WHO to resend to.
                        // But if we want to be proactive, we could ask the user for their email.
                        alert('Please try signing in. If your email is not verified, you will have an option to resend there.');
                      } catch (err) {
                        alert('Failed to resend verification email');
                      }
                    }}
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Resend verification email
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Decorative */}
          <div className="hidden lg:flex w-1/2 h-full bg-gradient-to-br from-amber-50 to-stone-100 relative overflow-hidden items-center justify-center">
            <div className="text-center p-12">
              <div className="w-32 h-32 bg-white/50 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <Mail className="w-16 h-16 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-stone-800 mb-4">
                Check Your Inbox
              </h2>
              <p className="text-stone-600 max-w-xs mx-auto">
                We sent you a verification link. Click it to verify your email.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="h-dvh w-full flex bg-neutral-50 justify-center overflow-hidden">
        <div className="w-full max-w-[1920px] h-full flex bg-white shadow-2xl mx-auto overflow-hidden">
          <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 py-12 overflow-y-auto">
            <div className="w-full max-w-md mx-auto my-auto text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-3 font-display">
                Email Verified!
              </h1>
              <p className="text-neutral-500 mb-8">{message}</p>
              <Link href="/auth/login">
                <Button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-medium">
                  Continue to Sign in
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Decorative */}
          <div className="hidden lg:flex w-1/2 h-full bg-gradient-to-br from-emerald-50 to-stone-100 relative overflow-hidden items-center justify-center">
            <div className="text-center p-12">
              <div className="w-32 h-32 bg-white/50 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <CheckCircle className="w-16 h-16 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-stone-800 mb-4">
                Welcome to Keel
              </h2>
              <p className="text-stone-600 max-w-xs mx-auto">
                Your account is now verified. You can start using all features!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="h-dvh w-full flex bg-neutral-50 justify-center overflow-hidden">
      <div className="w-full max-w-[1920px] h-full flex bg-white shadow-2xl mx-auto overflow-hidden">
        <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 py-12 overflow-y-auto">
          <div className="w-full max-w-md mx-auto my-auto text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-3 font-display">
              Verification Failed
            </h1>
            <p className="text-neutral-500 mb-8">{message}</p>
            <div className="space-y-4">
              <Link href="/auth/signup">
                <Button className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white h-12 font-medium">
                  Sign up again
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="w-full rounded-xl h-12 font-medium"
                >
                  Go to Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Decorative */}
        <div className="hidden lg:flex w-1/2 h-full bg-gradient-to-br from-red-50 to-stone-100 relative overflow-hidden items-center justify-center">
          <div className="text-center p-12">
            <div className="w-32 h-32 bg-white/50 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800 mb-4">
              Link Expired
            </h2>
            <p className="text-stone-600 max-w-xs mx-auto">
              The verification link has expired or is invalid. Please try again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="h-dvh w-full flex items-center justify-center bg-neutral-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
