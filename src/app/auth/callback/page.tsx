"use client";

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

function CallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login } = useAuth();
    const [hasProcessed, setHasProcessed] = React.useState(false);

    useEffect(() => {
        // Prevent multiple executions
        if (hasProcessed) return;

        const handleCallback = async () => {
            console.log('CallbackPage: Starting handleCallback');
            setHasProcessed(true);

            // Check for errors in query params
            const error = searchParams.get('error');
            if (error) {
                console.error('CallbackPage: Auth error found in params:', error);
                router.push(`/auth/login?error=${encodeURIComponent(error)}`);
                return;
            }

            // Try hash fragment first (more secure - not sent to server)
            let token: string | null = null;
            let userData: any = null;

            console.log('CallbackPage: Checking hash:', window.location.hash);
            if (typeof window !== 'undefined' && window.location.hash) {
                try {
                    const hash = window.location.hash.substring(1);
                    const params = new URLSearchParams(hash);
                    token = params.get('access_token') || params.get('token');
                    const userJson = params.get('user');
                    console.log('CallbackPage: Token from hash:', token ? 'Found' : 'Not Found');
                    if (userJson) {
                        userData = JSON.parse(decodeURIComponent(userJson));
                        console.log('CallbackPage: User data from hash:', userData);
                    }
                    // Clear hash immediately after reading for security
                    window.history.replaceState(null, '', window.location.pathname + window.location.search);
                } catch (e) {
                    console.error('CallbackPage: Failed to parse hash data:', e);
                }
            }

            // Fallback to query params (current backend behavior)
            if (!token) {
                token = searchParams.get('token') || searchParams.get('access_token');
                console.log('CallbackPage: Token from query params:', token ? 'Found' : 'Not Found');
            }

            if (token) {
                try {
                    console.log('CallbackPage: Attempting login with token...');
                    // Pass user data if available (from hash), otherwise login will fetch it
                    await login(token, userData);
                    console.log('CallbackPage: Login successful');
                } catch (err) {
                    console.error('CallbackPage: Failed to login with token:', err);
                    router.push('/auth/login?error=auth_failed');
                }
            } else {
                console.error('CallbackPage: No token found in URL');
                router.push('/auth/login?error=no_token');
            }
        };

        handleCallback();
    }, [searchParams, login, router, hasProcessed]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-teal-50 to-pink-50">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
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
