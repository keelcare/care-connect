"use client";

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

function CallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            // Try to get token from different possible query parameters
            const token = searchParams.get('token') || searchParams.get('access_token');
            const error = searchParams.get('error');

            if (error) {
                console.error('Auth error:', error);
                // Redirect to login with error
                router.push(`/auth/login?error=${encodeURIComponent(error)}`);
                return;
            }

            if (token) {
                try {
                    await login(token);
                    // login function in AuthContext handles the redirect to /dashboard
                } catch (err) {
                    console.error('Failed to login with token:', err);
                    router.push('/auth/login?error=auth_failed');
                }
            } else {
                console.error('No token found in URL');
                router.push('/auth/login?error=no_token');
            }
        };

        handleCallback();
    }, [searchParams, login, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-pink-50">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6 shadow-lg"></div>
            <p className="text-xl font-display font-medium text-neutral-700 animate-pulse">Verifying your credentials...</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className={styles.container}><div className={styles.spinner} /></div>}>
            <CallbackContent />
        </Suspense>
    );
}
