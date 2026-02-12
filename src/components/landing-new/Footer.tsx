import React from 'react';
import { Heart, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#F9F7F2] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-[#1B3022] rounded-xl flex items-center justify-center">
                <Heart className="text-white w-6 h-6" fill="currentColor" />
              </div>
              <span className="text-2xl font-bold text-[#1B3022]">Keel</span>
            </div>
            <p className="text-lg text-gray-500 max-w-sm mb-8 leading-relaxed">
              Professional care tailored to your needs. Building trust and wellness through verified human connection.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Linkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 hover:text-[#CC7A68] transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#1B3022] mb-6">Services</h4>
            <ul className="space-y-4 text-gray-500 font-medium">
              <li><a href="#" className="hover:text-[#1B3022]">Child Care</a></li>
                <li><a href="#" className="hover:text-[#CC7A68] transition-colors">Special Needs</a></li>
              <li><a href="#" className="hover:text-[#1B3022]">Pet Care</a></li>
              <li><a href="#" className="hover:text-[#1B3022]">Housekeeping</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#1B3022] mb-6">Company</h4>
            <ul className="space-y-4 text-gray-500 font-medium">
              <li><a href="#" className="hover:text-[#1B3022]">About Us</a></li>
              <li><a href="#" className="hover:text-[#1B3022]">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-[#1B3022]">Careers</a></li>
              <li><a href="#" className="hover:text-[#1B3022]">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#1B3022] mb-6">Support</h4>
            <ul className="space-y-4 text-gray-500 font-medium">
              <li><a href="#" className="hover:text-[#1B3022]">Help Center</a></li>
              <li><a href="#" className="hover:text-[#1B3022]">Contact Support</a></li>
              <li><a href="#" className="hover:text-[#1B3022]">Safety Center</a></li>
              <li><a href="#" className="hover:text-[#1B3022]">Resource Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 font-medium text-sm">
            © 2026 Keel Inc. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-[#1B3022]">Privacy Policy</a>
            <a href="#" className="hover:text-[#1B3022]">Terms of Service</a>
            <a href="#" className="hover:text-[#1B3022]">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
