'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';

import { Capacitor } from '@capacitor/core';

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: '', password: '' });
    setIsLoading(true);
    try {
      const response = await api.auth.login(formData);
      await login(response.user);
    } catch (error: any) {
      console.error('Login failed:', error);
      setErrors((prev) => ({
        ...prev,
        password: error?.message || 'Login failed. Please check your credentials.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    let isNative = false;
    if (typeof window !== 'undefined' && typeof (window as any).Capacitor !== 'undefined') {
      isNative = Capacitor.isNativePlatform();
    }
    const origin = isNative
      ? 'keel://auth/callback'
      : `${window.location.origin}/auth/callback`;

    const url = `${apiUrl}/auth/google?origin=${encodeURIComponent(origin)}${isNative ? '&platform=mobile' : ''
      }`;

    if (isNative) {
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url });
    } else {
      window.location.href = url;
    }
  };

  return (
    <div className="min-h-dvh w-full flex bg-background">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-20 xl:px-32 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#0F172A] transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Logo */}
          <div className="mb-10">
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold text-[#0F172A] tracking-tight font-display">
                Keel
              </span>
            </Link>
            <h1 className="text-4xl font-bold text-[#0F172A] mb-3 font-display">
              Welcome back
            </h1>
            <p className="text-gray-600 font-body">
              Sign in to continue to your account
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Input */}
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              leftIcon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              error={errors.email}
              className="bg-white border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-[20px]"
            />

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-[#0F172A] font-body">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-primary hover:text-primary-800 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-5 h-5" />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                error={errors.password}
                className="bg-white border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-[20px]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-auth-blue text-white py-4 rounded-full font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#F8F9FA] text-gray-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-4 border-2 border-gray-200 rounded-full bg-white hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-700 font-medium shadow-sm hover:shadow"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm font-body">
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="font-bold text-primary hover:text-primary-800 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Animation */}
      <div className="hidden lg:flex fixed right-0 top-0 w-1/2 h-dvh bg-[#F0FDF4] overflow-hidden items-center justify-center">
        <style jsx>{`
          @keyframes sway {
            0%,
            100% {
              transform: rotate(-3deg);
            }
            50% {
              transform: rotate(3deg);
            }
          }
          @keyframes bloom {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          @keyframes pulse-soft {
            0%,
            100% {
              opacity: 0.6;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.1);
            }
          }
          .flower-container {
            transform-origin: bottom center;
            animation: sway 8s ease-in-out infinite;
          }
          .flower-head {
            transform-origin: 200px 250px;
            animation: bloom 5s ease-in-out infinite;
          }
          .glow {
            animation: pulse-soft 4s ease-in-out infinite;
          }
        `}</style>

        <div className="relative w-[500px] h-[500px] flex items-center justify-center">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-teal-100 rounded-full blur-3xl opacity-40 glow"></div>

          {/* Flower Animation */}
          <div className="relative w-full h-full flex items-center justify-center flower-container">
            <svg
              width="400"
              height="500"
              viewBox="0 0 400 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Stem */}
              <path
                d="M200 500 C200 400 220 350 200 250"
                stroke="#5EEAD4"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Leaves */}
              <path
                d="M200 400 Q140 380 120 320 Q180 340 200 380"
                fill="#99F6E4"
                className="opacity-90"
              />
              <path
                d="M200 320 Q260 300 280 240 Q220 260 200 300"
                fill="#99F6E4"
                className="opacity-90"
              />

              {/* Flower Head Group */}
              <g className="flower-head">
                {/* Petals */}
                <circle
                  cx="200"
                  cy="190"
                  r="35"
                  fill="#FDBA74"
                  className="opacity-90"
                />
                <circle
                  cx="200"
                  cy="310"
                  r="35"
                  fill="#FDBA74"
                  className="opacity-90"
                />
                <circle
                  cx="148"
                  cy="220"
                  r="35"
                  fill="#FDBA74"
                  className="opacity-90"
                />
                <circle
                  cx="252"
                  cy="220"
                  r="35"
                  fill="#FDBA74"
                  className="opacity-90"
                />
                <circle
                  cx="148"
                  cy="280"
                  r="35"
                  fill="#FDBA74"
                  className="opacity-90"
                />
                <circle
                  cx="252"
                  cy="280"
                  r="35"
                  fill="#FDBA74"
                  className="opacity-90"
                />

                {/* Center */}
                <circle cx="200" cy="250" r="45" fill="#FFEDD5" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
