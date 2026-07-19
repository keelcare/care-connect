'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else {
    // Section lives on the landing page — navigate there from another route
    window.location.href = `/welcome#${id}`;
  }
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
            className="w-10 h-10 rounded-full overflow-hidden transition-all duration-300 shadow-md relative"
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Image 
              src="/logo.jpeg" 
              alt="Keel Logo" 
              fill
              className="object-cover" 
            />
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
            { label: 'Services', id: 'services' },
            { label: 'How it Works', id: 'how-it-works' },
            { label: 'FAQ', id: 'faq' },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm font-bold font-body transition-all duration-300 relative group py-1"
              style={{ color: scrolled ? 'var(--color-primary)' : 'white' }}
            >
              <span className={cn(
                "transition-opacity duration-300",
                scrolled ? "opacity-70 group-hover:opacity-100" : "opacity-85 group-hover:opacity-100"
              )}>
                {label}
              </span>
              <span 
                className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full rounded-full",
                  scrolled ? "bg-primary" : "bg-white"
                )} 
              />
            </button>
          ))}
          <button
            onClick={() => scrollTo('about')}
            className="text-sm font-bold font-body transition-all duration-300 relative group py-1"
            style={{ color: scrolled ? 'var(--color-primary)' : 'white' }}
          >
            <span className={cn(
              "transition-opacity duration-300",
              scrolled ? "opacity-70 group-hover:opacity-100" : "opacity-85 group-hover:opacity-100"
            )}>
              About
            </span>
            <span
              className={cn(
                "absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full rounded-full",
                scrolled ? "bg-primary" : "bg-white"
              )}
            />
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4">
            {process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true' ? (
              <a href="#waitlist">
                <button
                  className="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-lg"
                  style={{
                    background: scrolled ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: scrolled ? 'none' : '1px solid rgba(255,255,255,0.4)',
                    boxShadow: scrolled ? '0 4px 14px rgba(0,0,0,0.15)' : '0 4px 14px rgba(0,0,0,0.1)',
                  }}
                >
                  Join Waitlist
                </button>
              </a>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={cn(
                    "text-sm font-bold transition-all duration-300 hover:opacity-100",
                    scrolled ? "text-primary opacity-70" : "text-white opacity-90"
                  )}
                >
                  Log In
                </Link>
                <Link href="/auth/signup">
                  <button
                    className="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-lg cursor-pointer"
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
              </>
            )}
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
            <button 
              className="text-lg font-bold font-body text-primary-900 text-left hover:translate-x-2 transition-transform duration-300 flex items-center gap-2 group" 
              onClick={() => { scrollTo('services'); setIsOpen(false); }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              Services
            </button>
            <button
              className="text-lg font-bold font-body text-primary-900 text-left hover:translate-x-2 transition-transform duration-300 flex items-center gap-2 group"
              onClick={() => { scrollTo('how-it-works'); setIsOpen(false); }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              How it Works
            </button>
            <button
              className="text-lg font-bold font-body text-primary-900 text-left hover:translate-x-2 transition-transform duration-300 flex items-center gap-2 group"
              onClick={() => { scrollTo('faq'); setIsOpen(false); }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              FAQ
            </button>
            <button
              className="text-lg font-bold font-body text-primary-900 text-left hover:translate-x-2 transition-transform duration-300 flex items-center gap-2 group"
              onClick={() => { scrollTo('about'); setIsOpen(false); }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              About
            </button>
            <div className="h-px bg-primary/10 my-1" />
            {process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true' ? (
               <a href="#waitlist" onClick={() => setIsOpen(false)}>
                 <button
                  className="w-full bg-primary text-white px-8 py-4 rounded-full font-semibold"
                >
                  Join Waitlist
                </button>
              </a>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="text-lg font-bold font-body text-primary-900 text-left hover:translate-x-2 transition-transform duration-300 flex items-center gap-2 group" 
                  onClick={() => setIsOpen(false)}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  Log In
                </Link>
                <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                  <button className="w-full bg-primary text-white px-8 py-4 rounded-full font-semibold cursor-pointer">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
