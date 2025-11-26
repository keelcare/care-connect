"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
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
            await login(response.access_token, response.user);
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-pink-50 p-4">
            <div className="bg-white rounded-3xl shadow-strong w-full max-w-md lg:max-w-xl p-8 md:p-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2 font-display">Welcome Back</h1>
                    <p className="text-neutral-500">Sign in to your CareConnect account</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        leftIcon={<Mail size={18} />}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary"
                    />

                    <div className="space-y-2">
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            leftIcon={<Lock size={18} />}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            className="bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary"
                        />
                        <div className="flex justify-end">
                            <Link href="/auth/forgot-password" className="text-sm font-medium text-primary hover:text-primary-600 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <Button type="submit" size="lg" isLoading={isLoading} className="w-full rounded-full bg-primary hover:bg-primary-600 text-black shadow-lg hover:shadow-xl transition-all">
                        Sign In
                    </Button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-neutral-500">OR</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-200 rounded-full bg-white hover:bg-neutral-50 transition-colors text-neutral-700 font-medium shadow-sm hover:shadow-md"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>

                <div className="mt-8 text-center">
                    <p className="text-neutral-500">Don&apos;t have an account?{' '}
                        <Link href="/auth/signup" className="font-medium text-primary hover:text-primary-600 transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
