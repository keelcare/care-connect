import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Trusted Caregivers Near You | Keel',
  description:
    'Keel connects families with vetted, background-checked nannies and caregivers. Browse profiles, check availability, and book with confidence.',
  openGraph: {
    title: 'Find Trusted Caregivers Near You | Keel',
    description:
      'Browse vetted nannies and caregivers in your area. Book child care, shadow teachers, and special-needs support on Keel.',
    type: 'website',
  },
};

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
