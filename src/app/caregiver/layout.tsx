import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Caregiver Profile | Keel',
  description:
    'View caregiver qualifications, reviews, availability, and hourly rates. Book a trusted carer for your family on Keel.',
  openGraph: {
    title: 'Caregiver Profile | Keel',
    description:
      'Verified caregiver profile — read reviews and book care on Keel.',
    type: 'profile',
  },
};

export default function CaregiverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
