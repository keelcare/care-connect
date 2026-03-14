'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api, setTokenRefresher, fetchApi } from '@/lib/api';
import { User, AuthResponse } from '@/types/api';
import { App } from '@capacitor/app';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { BannedModal } from '@/components/banned/BannedModal';



interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: User | AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize native push notifications (only active if Capacitor and authenticated)
  usePushNotifications();

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
      if (
        error.message?.includes('No refresh token') ||
        error.message?.includes('Unauthorized')
      ) {
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

  const checkAuth = useCallback(async () => {
    try {
      console.log('AuthContext: Verifying session...');

      // If user explicitly logged out, skip check to prevent "zombie" cookie login
      if (typeof window !== 'undefined' && localStorage.getItem('is_logged_out')) {
        console.log('AuthContext: User explicitly logged out, skipping session check.');
        setUser(null);
        return;
      }

      // Just call /users/me. If we have valid cookies, it returns the user.
      const userData = await fetchApi<User>('/users/me', {}, false, true);
      console.log('AuthContext: User verified', userData.email);

      // BannedModal is shown globally when user.is_active === false — no redirect needed.
      setUser(userData);
    } catch (error: any) {
      console.log('AuthContext: No active session / Guest mode');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Removed duplicate deep-link listener as it's handled in layout.tsx for better app-wide consistency

  // Initial Auth Check
  useEffect(() => {
    // Skip auth check on callback page to prevent race conditions
    // (Callback page handles the session exchange and login manually)
    if (pathname?.startsWith('/auth/callback')) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [checkAuth, pathname]);

  const login = async (data: User | AuthResponse) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('is_logged_out');

      // Check if data is AuthResponse and store tokens
      if ('access_token' in data) {
        if (data.access_token) localStorage.setItem('access_token', data.access_token);
        if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
        setUser(data.user);
      } else {
        setUser(data);
      }
    } else {
      setUser('user' in data ? (data as any).user : data);
    }

    setLoading(false);
    const userData = 'user' in data ? data.user : data;
    console.log('Logged in user:', userData);

    // If user is banned, BannedModal will render — don't route them to any dashboard.
    if (userData.is_active === false) {
      return;
    }

    // Redirect immediately based on role
    if (userData.role === 'nanny') {
      router.push('/dashboard');
    } else if (userData.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/parent-dashboard');
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout failed silently', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.setItem('is_logged_out', 'true');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
      // ALWAYS cleanup client state
      setUser(null);
      router.push('/');
    }
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
      {/* Blocking ban overlay — renders above everything when user is suspended */}
      {user && user.is_active === false && (
        <BannedModal user={user} onLogout={logout} />
      )}
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
