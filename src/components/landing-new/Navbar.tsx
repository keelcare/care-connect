'use client';

import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-6">
      <nav
        className="max-w-5xl mx-auto rounded-full px-8 py-2 flex items-center justify-between transition-all duration-500"
        style={{
          background: scrolled
            ? 'rgba(255,255,255,0.75)'
            : 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: scrolled
            ? '1px solid rgba(255,255,255,0.5)'
            : '1px solid rgba(255,255,255,0.25)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.6)'
            : '0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.3)',
        }}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: scrolled ? 'rgba(241,245,249,0.9)' : 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <img src="/logo.svg" alt="Keel Logo" className="h-6 w-auto" />
          </div>
          <span
            className="text-xl font-bold font-display tracking-tight transition-colors duration-300"
            style={{ color: scrolled ? 'var(--color-primary)' : 'white' }}
          >
            Keel
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'About', href: '/about' },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-bold font-body transition-colors duration-300"
              style={{ color: scrolled ? 'rgba(var(--color-primary-rgb),0.7)' : 'rgba(255,255,255,0.85)' }}
            >
              {label}
            </Link>
          ))}
          {[
            { label: 'Services', id: 'expertise' },
            { label: 'How it Works', id: 'how-it-works' },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm font-bold font-body transition-colors duration-300"
              style={{ color: scrolled ? 'rgba(var(--color-primary-rgb),0.7)' : 'rgba(255,255,255,0.85)' }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-bold transition-colors duration-300"
              style={{ color: scrolled ? 'var(--color-primary)' : 'rgba(255,255,255,0.9)' }}
            >
              Log In
            </Link>
            <Link href="/auth/signup">
              <button
                className="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-lg"
                style={{
                  background: scrolled ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: scrolled ? 'none' : '1px solid rgba(255,255,255,0.4)',
                  boxShadow: scrolled ? '0 4px 14px rgba(0,0,0,0.15)' : '0 4px 14px rgba(0,0,0,0.1)',
                }}
              >
                Sign Up
              </button>
            </Link>
          </div>

          <button
            className="md:hidden transition-colors duration-300"
            style={{ color: scrolled ? 'var(--color-primary)' : 'white' }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -12 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden mt-3 rounded-3xl p-6 flex flex-col gap-4 max-w-sm mx-auto"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.7)',
            }}
          >
            <Link href="/about" className="text-lg font-medium font-body text-primary" onClick={() => setIsOpen(false)}>
              About
            </Link>
            <button className="text-lg font-medium font-body text-primary text-left" onClick={() => { scrollTo('expertise'); setIsOpen(false); }}>
              Services
            </button>
            <button className="text-lg font-medium font-body text-primary text-left" onClick={() => { scrollTo('how-it-works'); setIsOpen(false); }}>
              How it Works
            </button>
            <div className="h-px bg-primary/10 my-1" />
            <Link href="/auth/login" className="text-lg font-medium text-primary" onClick={() => setIsOpen(false)}>
              Log In
            </Link>
            <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
              <button className="w-full bg-primary text-white px-8 py-4 rounded-full font-semibold">
                Sign Up
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
