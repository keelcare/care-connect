'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      // Role-based protection: redirect to appropriate dashboard if role doesn't match
      if (user.role === 'nanny') router.push('/dashboard');
      else if (user.role === 'parent') router.push('/parent-dashboard');
      else if (user.role === 'admin') router.push('/admin');
      else router.push('/'); 
    }
  }, [user, loading, router, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-4 border-stone-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
};
