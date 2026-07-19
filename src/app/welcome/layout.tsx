import { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Join the Waitlist | Keel — Trusted Caregivers, Launching Soon',
  description:
    'Keel connects families with vetted, background-checked shadow teachers and special-needs caregivers in Delhi. Join the waitlist for early access — launching soon.',
  openGraph: {
    title: 'Join the Waitlist | Keel — Trusted Caregivers, Launching Soon',
    description:
      'Be first when Keel launches in Delhi. Join the waitlist for vetted shadow teachers and special-needs caregivers.',
    type: 'website',
  },
};

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
