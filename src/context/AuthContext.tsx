"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api, setTokenRefresher } from '@/lib/api';
import { User } from '@/types/api';
import { tokenStorage } from '@/lib/tokenStorage';

// Token expires after 15 days for refresh token
const TOKEN_EXPIRY_DAYS = 15;
// Refresh access token 2 minutes before expiry
const TOKEN_REFRESH_BUFFER_MS = 2 * 60 * 1000;

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // With cookie-based auth, we rely on the API 401 response to trigger logout.
    // We register a simple refresher that just calls the refresh endpoint (cookies handled automatically)
    const refreshSession = useCallback(async (): Promise<boolean> => {
        try {
            console.log('Refreshing session (cookie-based)...');
            await api.auth.refresh();
            console.log('Session refreshed successfully');
            return true;
        } catch (error: any) {
            // If there's no refresh token, it just means the user isn't logged in or session expired completely
            if (error.message?.includes('No refresh token') || error.message?.includes('Unauthorized')) {
                console.log('Session refresh failed (no token):', error.message);
            } else {
                console.error('Failed to refresh session:', error);
            }
            setUser(null);
            return false;
        }
    }, []);

    // Register the token refresher with the API module
    useEffect(() => {
        setTokenRefresher(refreshSession);
        return () => {
            // @ts-ignore
            setTokenRefresher(() => Promise.resolve(false));
        };
    }, [refreshSession]);

    // Initial Auth Check
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            console.log('AuthContext: Verifying session...');
            // Just call /users/me. If we have valid cookies, it returns the user.
            const userData = await api.users.me();
            console.log('AuthContext: User verified', userData.email);

            // Handle Ban Check
            if (userData.is_active === false) {
                console.log('User is banned, redirecting to /nanny/help');
                router.push('/nanny/help');
                // We still set the user so functionality like "Contest Ban" can work?
                // Or maybe the middleware handles it? Middleware handles route protection.
                // We should set the user so the UI knows who they are.
            }

            setUser(userData);
        } catch (error: any) {
            console.error('AuthContext: Auth check failed / No session');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (userData: User) => {
        // Standard login: user data provided, set immediately
        setUser(userData);
        console.log('Logged in user:', userData);

        // Check if user is banned - redirect to help page
        if (userData.is_active === false) {
            console.log('User is banned, redirecting to /nanny/help');
            router.push('/nanny/help');
            return;
        }

        // Redirect immediately based on role
        if (userData.role === 'nanny') {
            router.push('/dashboard');
        } else if (userData.role === 'admin') {
            router.push('/admin');
        } else {
            router.push('/browse');
        }
    };

    const logout = async () => {
        try {
            await api.auth.logout();
        } catch (error) {
            console.error('Logout failed silently', error);
        }
        setUser(null);
        router.push('/auth/login');
    };

    const refreshUser = async () => {
        await checkAuth();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
