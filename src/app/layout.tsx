import type { Metadata, Viewport } from 'next';
import { Lora, DM_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from './Providers';

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

export const metadata: Metadata = {
  title: 'Keel - Find Trusted Caregivers',
  description:
    'Connect with trusted local caregivers for child care, special needs support, and housekeeping. Verified professionals, secure booking, and peace of mind.',
  keywords:
    'child care, nanny, babysitter, special needs support, housekeeper, maid, cleaning, caregiver, trusted, verified',
  icons: { icon: '/logo.jpeg' },
};

export const viewport: Viewport = {
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  // Pinch-zoom is disabled only in the native (Capacitor) shell; the web build
  // keeps it enabled to satisfy WCAG 1.4.4 (Resize Text).
  ...(process.env.BUILD_TARGET === 'capacitor'
    ? { maximumScale: 1, userScalable: false }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${satoshi.variable} ${lora.variable} ${dmSans.variable} font-body bg-background text-primary-900`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
