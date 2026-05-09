import React from 'react';
import { Navbar } from '@/components/landing-new/Navbar';
import { Footer } from '@/components/landing-new/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="bg-primary-900 pb-20">
        <Navbar />
        <div className="pt-32 px-6 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Terms of Service</h1>
          <p className="text-white/70">Last updated: May 6, 2026</p>
        </div>
      </div>
      
      <main className="max-w-4xl mx-auto px-6 py-16 prose prose-lg prose-blue">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using the Keel platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Keel is a marketplace platform that connects parents and families seeking care services ("Parents") with independent care professionals ("Providers"). <strong>Keel does not directly employ the Providers.</strong> We provide a platform for connection, background verification, and payment processing.
        </p>

        <h2>3. User Responsibilities</h2>
        <p>As a user of Keel, you agree to:</p>
        <ul>
          <li>Provide accurate and truthful information during registration.</li>
          <li>Maintain the confidentiality of your account credentials.</li>
          <li>Treat all members of the Keel community with respect.</li>
          <li>Not use the platform for any illegal or unauthorized purpose.</li>
        </ul>

        <h2>4. Vetting and Background Checks</h2>
        <p>
          While Keel conducts preliminary background checks and verifications on Providers, Parents are ultimately responsible for making the final hiring decision and conducting their own interviews or reference checks.
        </p>

        <h2>5. Payments and Fees</h2>
        <p>
          All payments for care services must be processed through the Keel platform. Circumventing the platform's payment system is a violation of these terms and may result in immediate account termination.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          Keel acts solely as a connecting platform. We are not liable for any disputes, damages, or injuries that arise from the direct interaction between Parents and Providers.
        </p>

        <h2>7. Modifications to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. We will notify users of any material changes via email or platform notification.
        </p>

        <h2>8. Contact</h2>
        <p>
          For any questions regarding these Terms, please reach out to legal@keel.care.
        </p>
      </main>
      
      <Footer />
    </div>
  );
}
