'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api, setTokenRefresher, fetchApi } from '@/lib/api';
import { logger } from '@/lib/logger';
import { User, AuthResponse } from '@/types/api';
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

  // With cookie-based auth, refresh is done via the HttpOnly refresh_token cookie.
  // No token is read from localStorage — the browser sends the cookie automatically.
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      await api.auth.refresh();
      return true;
    } catch {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('has_session');
      }
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
      // Check for session flag before attempting network request
      if (typeof window !== 'undefined' && !localStorage.getItem('has_session')) {
        setUser(null);
        setLoading(false);
        return;
      }

      logger.log('AuthContext: Verifying session...');
      const userData = await fetchApi<User>('/users/me', {}, false, true);
      logger.log('AuthContext: User verified');

      // BannedModal is shown globally when user.is_active === false — no redirect needed.
      setUser(userData);
    } catch (error: any) {
      logger.log('AuthContext: No active session / Guest mode');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('has_session');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Removed duplicate deep-link listener as it's handled in layout.tsx for better app-wide consistency

  // Initial Auth Check — runs once on mount only.
  // Subsequent pages are protected by ProtectedRoute; the API interceptor
  // handles 401s via setTokenRefresher, so there is no need to re-verify
  // the session on every client-side navigation.
  useEffect(() => {
    if (pathname?.startsWith('/auth/callback')) {
      setLoading(false);
      return;
    }
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // ← intentionally empty: mount-only

  const login = async (data: User | AuthResponse) => {
    // Mark session active — non-sensitive flag used to skip /users/me on cold load
    if (typeof window !== 'undefined') {
      localStorage.setItem('has_session', 'true');
      localStorage.removeItem('is_logged_out');
    }

    // Tokens live in HttpOnly cookies set by the backend — never in localStorage
    const userData = 'user' in data ? (data as AuthResponse).user : (data as User);
    setUser(userData);
    setLoading(false);

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
      logger.error('Logout failed silently', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('has_session');
        localStorage.removeItem('is_logged_out');
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
