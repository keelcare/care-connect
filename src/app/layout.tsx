'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketProvider';
import { Chatbot } from '@/components/ai/Chatbot';
import { Fraunces, Lora, Cormorant_Garamond } from 'next/font/google';
import localFont from 'next/font/local';
import 'lineicons/dist/lineicons.css';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

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

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
    pathname?.startsWith('/book');

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
    pathname?.startsWith('/favorites');

  return (
    <body className={`${fraunces.variable} ${lora.variable} ${cormorant.variable} ${satoshi.variable} font-body bg-background text-primary-900`}>
      <ToastProvider>
        <AuthProvider>
          <SocketProvider>
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
          </SocketProvider>
        </AuthProvider>
      </ToastProvider>
    </body>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
        <link rel="icon" href="/logo.jpeg" />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <RootLayoutContent>{children}</RootLayoutContent>
    </html>
  );
}
