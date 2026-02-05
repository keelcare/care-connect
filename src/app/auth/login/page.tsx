'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.auth.login(formData);
      await login(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const redirectUri = `${window.location.origin}/auth/callback`;
    window.location.href = `${apiUrl}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8F9FA]">
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
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-2 font-body">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-[20px] border-2 border-gray-200 focus:border-[#1F6F5B] focus:ring-4 focus:ring-[#1F6F5B]/10 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#0F172A] font-body">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-[#1F6F5B] hover:text-[#1a5f4f] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-[20px] border-2 border-gray-200 focus:border-[#1F6F5B] focus:ring-4 focus:ring-[#1F6F5B]/10 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1F6F5B] hover:bg-[#1a5f4f] text-white py-4 rounded-full font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
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
                className="font-bold text-[#1F6F5B] hover:text-[#1a5f4f] transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0F172A] via-[#1e3a5f] to-[#0F172A] relative overflow-hidden items-center justify-center">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E08E79] rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1F6F5B] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F1B92B] rounded-full mix-blend-multiply filter blur-3xl opacity-10" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center px-12 max-w-lg"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-5xl font-bold text-white mb-6 font-display leading-tight">
              Welcome to <br />
              <span className="text-[#F1B92B]">Keel Care</span>
            </h2>
            <p className="text-xl text-gray-300 font-body leading-relaxed">
              Your trusted platform for finding verified caregivers and professionals for your family's needs.
            </p>
          </motion.div>

          {/* Floating Cards */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              { icon: '👶', label: 'Child Care' },
              { icon: '📚', label: 'Education' },
              { icon: '❤️', label: 'Senior Care' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="text-sm text-white font-medium">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
