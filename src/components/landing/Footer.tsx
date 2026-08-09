'use client';

import React from 'react';
import Image from 'next/image';
import { Instagram } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  // Match the navbar's behaviour: if the target section is on the current page,
  // smooth-scroll to it without touching the URL; otherwise let the Link
  // navigate to /welcome#id (the legal pages), where HashScrollHandler lands it.
  const handleSectionScroll = (e: React.MouseEvent, id: string) => {
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-primary-900 px-6 pt-20 pb-10">
      <div className="max-w-6xl mx-auto">

        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-16 border-b border-white/10">

          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-md shrink-0 relative">
                <Image src="/logo.jpeg" alt="Keel Logo" fill className="object-cover" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Keel</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Connecting families with trusted, verified care professionals across India.
            </p>
            <Link href="/welcome#about" onClick={(e) => handleSectionScroll(e, 'about')} className="text-sm text-white/60 hover:text-white transition-colors font-medium w-fit">
              About Keel →
            </Link>
            <a
              href="https://www.instagram.com/keelcare.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-white/50 hover:text-white transition-colors w-fit group"
            >
              <div className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Instagram size={16} />
              </div>
              <span className="text-sm font-medium">@keelcare.in</span>
            </a>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-5">
            <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest">Services</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/welcome#service-card-shadow-teacher" onClick={(e) => handleSectionScroll(e, 'service-card-shadow-teacher')} className="text-sm text-white/60 hover:text-white transition-colors font-medium">Shadow Teacher</Link></li>
              <li><Link href="/welcome#service-card-special-needs" onClick={(e) => handleSectionScroll(e, 'service-card-special-needs')} className="text-sm text-white/60 hover:text-white transition-colors font-medium">Special Needs Trainer</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-5">
            <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest">Legal</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/privacy" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-sm text-white/60 hover:text-white transition-colors font-medium">Cookie Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/25 font-medium">
            © {new Date().getFullYear()} Keel Inc. All rights reserved.
          </p>
          <p className="text-xs text-white/25 font-medium">
            Made with care, for families that deserve it.
          </p>
        </div>

      </div>
    </footer>
  );
};
