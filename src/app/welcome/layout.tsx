import { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Keel | Trusted Shadow Teachers & Caregivers',
  description:
    'Keel connects families with vetted, background-checked shadow teachers, special-needs caregivers, and developmental nannies. Get in touch to find the right fit for your family.',
  openGraph: {
    title: 'Keel | Trusted Shadow Teachers & Caregivers',
    description:
      'Vetted shadow teachers, special-needs caregivers, and developmental nannies matched to your child. Get in touch with Keel.',
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
