import React from 'react';
import { Heart, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-primary-900 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Heart className="text-white w-6 h-6" fill="currentColor" />
              </div>
              <span className="text-2xl font-bold text-white">Keel</span>
            </div>
            <p className="text-lg text-white/50 max-w-sm mb-8 leading-relaxed">
              Professional care tailored to your needs. Building trust and wellness through verified human connection.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Linkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Icon size={20} className="text-white/70" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Services</h4>
            <ul className="space-y-4 text-white/50 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Child Care</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Special Needs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pet Care</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Housekeeping</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <ul className="space-y-4 text-white/50 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trust &amp; Safety</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Support</h4>
            <ul className="space-y-4 text-white/50 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Resource Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/30 font-medium text-sm">
            © 2026 Keel Inc. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-medium text-white/30">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
