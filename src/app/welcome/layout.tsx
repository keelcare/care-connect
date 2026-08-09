import { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Keel | Trusted Shadow Teachers & Special Needs Trainers',
  description:
    'Keel connects families with vetted, background-checked shadow teachers and special needs trainers. Get in touch to find the right fit for your family.',
  openGraph: {
    title: 'Keel | Trusted Shadow Teachers & Special Needs Trainers',
    description:
      'Vetted shadow teachers and special needs trainers matched to your child. Get in touch with Keel.',
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
