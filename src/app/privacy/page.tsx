import React from 'react';
import { Navbar } from '@/components/landing-new/Navbar';
import { Footer } from '@/components/landing-new/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="bg-primary-900 pb-20">
        <Navbar />
        <div className="pt-32 px-6 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Privacy Policy</h1>
          <p className="text-white/70">Last updated: May 6, 2026</p>
        </div>
      </div>
      
      <main className="max-w-4xl mx-auto px-6 py-16 prose prose-lg prose-blue">
        <h2>1. Information We Collect</h2>
        <p>
          At Keel, we collect information to provide better services to our users. This includes:
        </p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email address, phone number, and physical address when you register.</li>
          <li><strong>Child Details:</strong> Optional information you provide regarding your care needs.</li>
          <li><strong>Usage Data:</strong> Information on how you interact with our platform.</li>
        </ul>

        <h2>2. How We Use Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Connect parents with verified care professionals.</li>
          <li>Provide, maintain, and improve our services.</li>
          <li>Process payments securely.</li>
          <li>Communicate with you regarding updates, security alerts, and support messages.</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>
          Keel respects your privacy. We do not sell your personal information. We only share information with:
        </p>
        <ul>
          <li>Care providers you choose to interact with on the platform.</li>
          <li>Service providers (like payment processors and background check agencies) under strict confidentiality agreements.</li>
          <li>Law enforcement when required by law to protect the safety of our users.</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement a variety of security measures to maintain the safety of your personal information. Your data is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal information at any time through your account settings or by contacting our support team.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at privacy@keel.care.
        </p>
      </main>
      
      <Footer />
    </div>
  );
}
