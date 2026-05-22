import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create an Account | Keel',
  description:
    'Join Keel as a parent looking for trusted caregivers, or sign up as a nanny to start accepting care requests.',
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
