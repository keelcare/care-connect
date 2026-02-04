import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="flex items-center gap-8">
      <div className="hidden lg:flex items-center gap-8">
        <Link 
          href="/" 
          className="text-sm font-medium text-white/90 hover:text-white transition-colors"
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className="text-sm font-medium text-white/90 hover:text-white transition-colors"
        >
          About Us
        </Link>
        <Link 
          href="/pricing" 
          className="text-sm font-medium text-white/90 hover:text-white transition-colors"
        >
          Pricing
        </Link>
      </div>
      
      <button 
        className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors group"
        aria-label="Menu"
      >
        <Menu size={20} className="text-white group-hover:scale-105 transition-transform" />
      </button>
    </nav>
  );
};
