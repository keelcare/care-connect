import React from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 px-6">
      <nav className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl shadow-navy-900/5 px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-[#F1F5F9] rounded-full flex items-center justify-center group-hover:bg-[#E2E8F0] transition-colors">
            <img src="/logo.svg" alt="Keel Logo" className="h-6 w-auto" />
          </div>
          <span className="text-xl font-bold font-display text-[#0F172A] tracking-tight">Keel</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/about" className="text-sm font-bold font-body text-[#0F172A]/70 hover:text-[#0F172A] transition-colors">
            About
          </Link>
          <Link href="/how-it-works" className="text-sm font-bold font-body text-[#0F172A]/70 hover:text-[#0F172A] transition-colors">
            How it Works
          </Link>
          <Link href="/book-service" className="text-sm font-bold font-body text-[#0F172A]/70 hover:text-[#0F172A] transition-colors">
            Find Care
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-bold text-[#0F172A] hover:text-[#0F172A]/70 transition-colors">
              Log In
            </Link>
            <Link href="/auth/signup">
              <button className="bg-[#0F172A] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#1e3a5f] transition-all shadow-lg shadow-navy-900/10">
                Sign Up
              </button>
            </Link>
          </div>

          <button className="md:hidden text-[#0F172A]" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="md:hidden mt-4 bg-white rounded-3xl p-6 border border-gray-100 flex flex-col gap-4 shadow-2xl max-w-sm mx-auto"
        >
          <Link href="/about" className="text-lg font-medium font-body text-[#0F172A]" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link href="/how-it-works" className="text-lg font-medium font-body text-[#0F172A]" onClick={() => setIsOpen(false)}>
            How it Works
          </Link>
          <Link href="/search" className="text-lg font-medium font-body text-[#0F172A]" onClick={() => setIsOpen(false)}>
            Find Care
          </Link>
          <div className="h-px bg-gray-100 my-2" />
          <Link href="/auth/login" className="text-lg font-medium text-[#0F172A]" onClick={() => setIsOpen(false)}>
            Log In
          </Link>
          <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
            <button className="w-full bg-[#0F172A] text-white px-8 py-4 rounded-full font-semibold">
              Sign Up
            </button>
          </Link>
        </motion.div>
      )}
    </div>
  );
};
