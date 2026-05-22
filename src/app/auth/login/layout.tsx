import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Keel',
  description: 'Sign in to your Keel account to manage bookings and caregivers.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
