"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { User } from '@/types/api';

// Token expires after 15 days
const TOKEN_EXPIRY_DAYS = 15;

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const isTokenExpired = (): boolean => {
        const loginTimestamp = localStorage.getItem('login_timestamp');
        if (!loginTimestamp) {
            return true; // No timestamp means expired
        }

        const loginDate = new Date(parseInt(loginTimestamp));
        const now = new Date();
        const daysSinceLogin = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24);

        return daysSinceLogin >= TOKEN_EXPIRY_DAYS;
    };

    const checkAuth = async () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            console.log('AuthContext: No token found');
            setToken(null);
            setLoading(false);
            return null;
        }

        // Check if token has expired (15 days)
        if (isTokenExpired()) {
            console.log('AuthContext: Token expired (15 days), logging out');
            localStorage.removeItem('token');
            localStorage.removeItem('login_timestamp');
            localStorage.removeItem('user_preferences');
            setToken(null);
            setUser(null);
            setLoading(false);
            return null;
        }

        setToken(storedToken);

        try {
            console.log('AuthContext: Verifying token...');
            const userData = await api.users.me();
            console.log('AuthContext: User verified', userData.email);
            setUser(userData);
            return userData;
        } catch (error: any) {
            console.error('AuthContext: Auth check failed:', error);
            // Only remove token if it's an auth error (401/403)
            if (error.message?.includes('401') || error.message?.includes('403') || error.message?.includes('Unauthorized')) {
                console.log('AuthContext: Invalid token, removing');
                localStorage.removeItem('token');
                setUser(null);
            }
            // For other errors (network, server), keep the token but maybe set user to null? 
            // Or keep the previous user?
            // For now, let's set user to null but keep token so we can retry?
            // Actually, if we set user to null, the app thinks we are logged out.
            // But we shouldn't log out on network error.

            // If it's NOT a 401, we might want to keep the user logged in if we had one?
            // But this is checkAuth, so we don't have a user yet.

            if (error.message?.includes('401') || error.message?.includes('403') || error.message?.includes('Unauthorized')) {
                setUser(null);
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    const login = async (token: string) => {
        localStorage.setItem('token', token);
        // Store login timestamp for 15-day expiration
        localStorage.setItem('login_timestamp', Date.now().toString());
        const userData = await checkAuth();

        console.log('Logged in user:', userData); // Debugging

        if (userData?.role === 'nanny') {
            router.push('/dashboard');
        } else {
            // Default to browse for parents and others
            router.push('/browse');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('login_timestamp');
        localStorage.removeItem('user_preferences'); // Clear preferences on logout
        setUser(null);
        setToken(null);
        router.push('/auth/login');
    };

    const refreshUser = async () => {
        await checkAuth();
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
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
