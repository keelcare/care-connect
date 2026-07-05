'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SplashLoader } from '@/components/ui/SplashLoader';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketProvider';
import { SSEProvider } from '@/context/SSEProvider';
import { NotificationProvider } from '@/context/NotificationContext';
import { NotificationOverlay } from '@/components/notifications/NotificationOverlay';
import { ConsentBanner } from '@/components/compliance/ConsentBanner';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from 'sonner';
import '../bones/registry';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('splashShown') !== 'true') {
      setShowSplash(true);
    }
  }, []);

  // Handle deep-link returns from Capacitor in-app browser (Google OAuth mobile flow)
  useEffect(() => {
    const isCapacitor = typeof (window as any).Capacitor !== 'undefined';
    if (!isCapacitor) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const { App } = await import('@capacitor/app');
      const { Browser } = await import('@capacitor/browser');

      const handle = await App.addListener('appUrlOpen', async (event) => {
        const url = event.url;
        if (url.startsWith('keel://auth/callback')) {
          await Browser.close();
          const tokenMatch = url.match(/[?&]token=([^&]+)/);
          if (tokenMatch) {
            router.push(`/auth/callback?token=${tokenMatch[1]}`);
          } else {
            router.push('/auth/login?error=oauth_failed');
          }
        } else if (url.startsWith('keel://payment/callback')) {
          await Browser.close();
          const statusMatch = url.match(/[?&]status=([^&]+)/);
          const errorMatch = url.match(/[?&]error=([^&]+)/);
          window.dispatchEvent(
            new CustomEvent('careconnect-payment-result', {
              detail: {
                status: statusMatch?.[1] ?? 'failed',
                error: errorMatch ? decodeURIComponent(errorMatch[1]) : undefined,
              },
            })
          );
        }
      });

      cleanup = () => handle.remove();
    })();

    return () => cleanup?.();
  }, [router]);

  // Don't show Header/Footer on auth pages (they have their own layout)
  // Don't show Header/Footer on dashboard pages (they have their own layout)
  // Don't show Header/Footer on parent pages (ParentLayout includes its own Footer)
  const hideHeader =
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/admin') ||
    pathname === '/' ||
    pathname?.startsWith('/welcome') ||
    pathname?.startsWith('/about') ||
    pathname?.startsWith('/how-it-works') ||
    pathname?.startsWith('/parent-dashboard') ||
    pathname?.startsWith('/nanny/onboarding') ||
    pathname?.startsWith('/services') ||
    pathname?.startsWith('/book-service') ||
    pathname?.startsWith('/bookings') ||
    pathname?.startsWith('/messages') ||
    pathname?.startsWith('/settings') ||
    pathname?.startsWith('/notifications') ||
    pathname?.startsWith('/caregiver') ||
    pathname?.startsWith('/book') ||
    pathname?.startsWith('/welcome-mobile') ||
    pathname?.startsWith('/privacy') ||
    pathname?.startsWith('/terms') ||
    pathname?.startsWith('/cookies');

  const hideFooter =
    hideHeader ||
    pathname?.startsWith('/browse') ||
    pathname?.startsWith('/book-service') ||
    pathname?.startsWith('/bookings') ||
    pathname?.startsWith('/messages') ||
    pathname?.startsWith('/book') ||
    pathname?.startsWith('/settings') ||
    pathname?.startsWith('/notifications') ||
    pathname?.startsWith('/recurring-bookings') ||
    pathname?.startsWith('/book-recurring') ||
    pathname?.startsWith('/welcome-mobile');

  return (
    <>
      {showSplash && (
        <SplashLoader
          onFinish={() => {
            sessionStorage.setItem('splashShown', 'true');
            setShowSplash(false);
          }}
        />
      )}
      <ToastProvider>
        <AuthProvider>
          <SSEProvider>
            <SocketProvider>
              <NotificationProvider>
                {!hideHeader && <Navbar />}
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:text-primary-900 focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:shadow-lg"
                >
                  Skip to main content
                </a>
                <main
                  id="main-content"
                  className={!hideHeader ? 'pt-24' : ''}
                  style={{
                    minHeight: hideHeader ? '100vh' : 'calc(100vh - 96px)',
                  }}
                >
                  {children}
                </main>
                {!hideFooter && <Footer />}
                <NotificationOverlay />
                <ConsentBanner />
              </NotificationProvider>
            </SocketProvider>
          </SSEProvider>
        </AuthProvider>
      </ToastProvider>
      <Toaster position="top-right" richColors closeButton />
      <SpeedInsights />
    </>
  );
}
