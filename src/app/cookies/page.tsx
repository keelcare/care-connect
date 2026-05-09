import React from 'react';
import { Navbar } from '@/components/landing-new/Navbar';
import { Footer } from '@/components/landing-new/Footer';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="bg-primary-900 pb-20">
        <Navbar />
        <div className="pt-32 px-6 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Cookie Policy</h1>
          <p className="text-white/70">Last updated: May 6, 2026</p>
        </div>
      </div>
      
      <main className="max-w-4xl mx-auto px-6 py-16 prose prose-lg prose-blue">
        <h2>1. What are Cookies?</h2>
        <p>
          Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide statistical information to the owners of the site.
        </p>

        <h2>2. How We Use Cookies</h2>
        <p>
          At Keel, we use cookies for the following purposes:
        </p>
        <ul>
          <li><strong>Essential Cookies:</strong> These are required for the operation of our platform. They include, for example, cookies that enable you to log into secure areas of our website.</li>
          <li><strong>Analytical/Performance Cookies:</strong> They allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works.</li>
          <li><strong>Functionality Cookies:</strong> These are used to recognize you when you return to our website, enabling us to personalize our content for you and remember your preferences.</li>
        </ul>

        <h2>3. Third-Party Cookies</h2>
        <p>
          Please note that third parties (including, for example, analytics software and external services) may also use cookies, over which we have no control. These cookies are likely to be analytical/performance cookies or targeting cookies.
        </p>

        <h2>4. Managing Your Cookies</h2>
        <p>
          You can block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies. However, if you use your browser settings to block all cookies (including essential cookies), you may not be able to access all or parts of our site.
        </p>

        <h2>5. Changes to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. Any changes we make will be posted on this page.
        </p>
      </main>
      
      <Footer />
    </div>
  );
}
