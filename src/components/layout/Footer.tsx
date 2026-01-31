import React from 'react';
import Link from 'next/link';
import { Heart, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <span className="text-2xl font-bold text-stone-900 font-display">
                Keel
              </span>
            </Link>
            <p className="text-stone-600 leading-relaxed">
              Connecting families with trusted caregivers for child care, senior
              care, pet care, and more.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-stone-900 mb-4">
              For Families
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/search"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Find Care
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Safety
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-stone-900 mb-4">
              For Caregivers
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/jobs"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/insurance"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Insurance
                </Link>
              </li>
              <li>
                <Link
                  href="/success-stories"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-stone-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-stone-200">
          <p className="text-stone-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Keel. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-stone-400 hover:text-stone-900 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="text-stone-400 hover:text-stone-900 transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-stone-400 hover:text-stone-900 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="#"
              className="text-stone-400 hover:text-stone-900 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
