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
import { User } from '@/types/api';



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
  const pathname = usePathname();

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

      // Handle Ban Check
      if (userData.is_active === false) {
        console.log('User is banned, redirecting to /nanny/help');
        router.push('/nanny/help');
        // We still set the user so the UI knows who they are.
      }

      setUser(userData);
    } catch (error: any) {
      console.log('AuthContext: No active session / Guest mode');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [router]);

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

  const login = async (userData: User) => {
    if (typeof window !== 'undefined') localStorage.removeItem('is_logged_out');
    // Standard login: user data provided, set immediately
    setUser(userData);
    setLoading(false);
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
    } finally {
      if (typeof window !== 'undefined') localStorage.setItem('is_logged_out', 'true');
      // ALWAYS cleanup client state
      setUser(null);
      router.push('/auth/login');
    }
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
