import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Caregivers | Keel',
  description:
    'Find verified nannies, shadow teachers, and special-needs caregivers near you. Filter by availability, rate, and care type.',
  openGraph: {
    title: 'Browse Caregivers | Keel',
    description:
      'Search and connect with trusted caregivers in your area on Keel.',
    type: 'website',
  },
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
