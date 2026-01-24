'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { AuthProvider } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketProvider';
import { Chatbot } from '@/components/ai/Chatbot';
import 'lineicons/dist/lineicons.css';
import './globals.css';

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show Header/Footer on auth pages (they have their own layout)
  // Don't show Header/Footer on dashboard pages (they have their own layout)
  // Don't show Header/Footer on parent pages (ParentLayout includes its own Footer)
  const hideHeaderFooter =
    pathname?.startsWith('/auth') ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/admin') ||
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
    <body>
      <ToastProvider>
        <AuthProvider>
          <SocketProvider>
            {!hideHeaderFooter && <Header />}
            <main
              style={{
                minHeight: hideHeaderFooter
                  ? '100vh'
                  : 'calc(100vh - 72px - 400px)',
              }}
            >
              {children}
            </main>
            {/* <Chatbot /> */}
            {!hideHeaderFooter && <Footer />}
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
        <title>CareConnect - Find Trusted Caregivers</title>
        <meta
          name="description"
          content="Connect with trusted caregivers for child care, senior care, pet care, and more."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@100..800&family=Manrope:wght@200..800&family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <RootLayoutContent>{children}</RootLayoutContent>
    </html>
  );
}
