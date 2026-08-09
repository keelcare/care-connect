'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  Mail,
  Instagram,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

// ─── Contact Information ───
const WHATSAPP_NUMBER = '918076512682';
const WHATSAPP_DISPLAY = '+91 80765 12682';
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi Keel! I'd like to learn more about your care services and find out more details."
);
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const EMAIL_ADDRESS = 'keelcarecon@gmail.com';
const EMAIL_HREF = `mailto:${EMAIL_ADDRESS}?subject=${encodeURIComponent('Inquiry about Keel Care Services')}`;

const INSTAGRAM_HANDLE = '@keelcare.in';
const INSTAGRAM_HREF = 'https://www.instagram.com/keelcare.in';

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-[#F4F1EA] selection:bg-primary selection:text-white font-sans text-primary-900 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl font-display font-medium text-primary-900 leading-[1.15] tracking-tight">
                We&apos;re here to help your family{' '}
                <span className="italic text-sky-700">thrive.</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed font-body">
                Have questions about our shadow teachers or special needs trainers? Connect directly with our dedicated team.
              </p>
            </motion.div>
          </div>

          {/* Contact methods — asymmetric layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            {/* Primary: WhatsApp bar */}
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 rounded-2xl bg-[#0B1F3A] px-6 py-6 sm:px-7 sm:py-7 transition-opacity hover:opacity-[0.97]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]">
                  <MessageCircle size={20} className="text-[#E1F5EE]" strokeWidth={2} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#1D9E75]">
                    Fastest way to reach us
                  </p>
                  <p className="text-[19px] font-medium leading-snug text-white">
                    Chat with a care coordinator now
                  </p>
                </div>
              </div>

              <span className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#1D9E75] px-5 py-2.5 text-sm font-medium text-[#E1F5EE] transition-colors group-hover:bg-[#188a66]">
                {WHATSAPP_DISPLAY}
                <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-0.5" />
              </span>
            </a>

            {/* Secondary: Email + Instagram */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={EMAIL_HREF}
                className="group flex items-center justify-between gap-3 rounded-xl border border-[#D3D1C7] px-4 py-4 transition-colors hover:border-[#185FA5]/40"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Mail size={18} className="shrink-0 text-[#185FA5]" strokeWidth={2} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[#0B1F3A]">Email</p>
                    <p className="truncate text-xs text-stone-500">{EMAIL_ADDRESS}</p>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#185FA5]"
                />
              </a>

              <a
                href={INSTAGRAM_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-xl border border-[#D3D1C7] px-4 py-4 transition-colors hover:border-[#993556]/40"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Instagram size={18} className="shrink-0 text-[#993556]" strokeWidth={2} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[#0B1F3A]">Instagram</p>
                    <p className="truncate text-xs text-stone-500">{INSTAGRAM_HANDLE}</p>
                  </div>
                </div>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-stone-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#993556]"
                />
              </a>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
