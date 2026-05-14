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
import { Chatbot } from '@/components/ai/Chatbot';
import { NotificationOverlay } from '@/components/notifications/NotificationOverlay';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from 'sonner';
import { Lora, DM_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import 'lineicons/dist/lineicons.css';
import './globals.css';
import '../bones/registry';

const satoshi = localFont({
  src: [
    {
      path: './fonts/Satoshi-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Satoshi-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Satoshi-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '700'],
});

function RootLayoutContent({ children }: { children: React.ReactNode }) {
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
    pathname?.startsWith('/services') ||
    pathname?.startsWith('/contact') ||
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
    pathname?.startsWith('/search') ||
    pathname?.startsWith('/book-service') ||
    pathname?.startsWith('/bookings') ||
    pathname?.startsWith('/messages') ||
    pathname?.startsWith('/book') ||
    pathname?.startsWith('/settings') ||
    pathname?.startsWith('/notifications') ||
    pathname?.startsWith('/recurring-bookings') ||
    pathname?.startsWith('/book-recurring') ||
    pathname?.startsWith('/favorites') ||
    pathname?.startsWith('/welcome-mobile');

  return (
    <body suppressHydrationWarning className={`${satoshi.variable} ${lora.variable} ${dmSans.variable} font-body bg-background text-primary-900`}>
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
                <main
                  className={!hideHeader ? 'pt-24' : ''}
                  style={{
                    minHeight: hideHeader
                      ? '100vh'
                      : 'calc(100vh - 96px-400px)',
                  }}
                >
                  {children}
                </main>
                {/* <Chatbot /> */}
                {!hideFooter && <Footer />}
                <NotificationOverlay />
              </NotificationProvider>
            </SocketProvider>
          </SSEProvider>
        </AuthProvider>
      </ToastProvider>
      <Toaster position="top-right" richColors closeButton />
      <SpeedInsights />
    </body>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Keel - Find Trusted Caregivers</title>
        <meta
          name="description"
          content="Connect with trusted local caregivers for child care, special needs support, and housekeeping. Verified professionals, secure booking, and peace of mind."
        />
        <meta
          name="keywords"
          content="child care, nanny, babysitter, special needs support, housekeeper, maid, cleaning, caregiver, trusted, verified"
        />
        <meta name="color-scheme" content="light" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <link rel="icon" href="/logo.jpeg" />
      </head>
      <RootLayoutContent>{children}</RootLayoutContent>
    </html>
  );
}
