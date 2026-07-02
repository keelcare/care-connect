import { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { AboutStory } from '@/components/about/AboutStory';

export const metadata: Metadata = {
  title: 'Our Story | Keel',
  description:
    'Keel was founded by someone who grew up with ADHD, whose mother became his shadow teacher before the role had a name. A platform for special children, from a special child.',
  openGraph: {
    title: 'Our Story | Keel',
    description:
      'The story of a boy, his mother, and the care platform they unknowingly built together.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-primary-900 selection:bg-primary selection:text-white font-sans">
      <Navbar />
      <main>
        <AboutStory />
      </main>
      <Footer />
    </div>
  );
}
