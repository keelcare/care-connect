'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  UserCheck,
  Search,
  MessageSquare,
  CreditCard,
  Shield,
  Bell,
  Calendar,
  CheckCircle,
  MapPin,
  Star,
  Heart,
  Clock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';

// Animations
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Step 1: Profile Animation
const ProfileAnimation = () => (
  <div className="relative w-full aspect-square max-w-sm mx-auto bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 overflow-hidden">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4"
    >
      <div className="w-12 h-12 bg-[#E5F1EC] rounded-full flex items-center justify-center">
        <UserCheck className="w-6 h-6 text-[#1F6F5B]" />
      </div>
      <div>
        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-20 bg-gray-100 rounded" />
      </div>
    </motion.div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.2 }}
          className="h-10 w-full bg-gray-50 rounded-xl border border-gray-100"
        />
      ))}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
        className="flex items-center gap-2 mt-4"
      >
        <div className="w-5 h-5 bg-[#1F6F5B] rounded flex items-center justify-center">
          <CheckCircle className="w-3 h-3 text-white" />
        </div>
        <div className="h-3 w-40 bg-gray-100 rounded" />
      </motion.div>
    </div>

    {/* Floating Elements */}
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-4 right-4 bg-[#F1B92B] text-white text-xs px-2 py-1 rounded-full"
    >
      Parent
    </motion.div>
  </div>
);

// Step 2: Search Animation
const SearchAnimation = () => (
  <div className="relative w-full aspect-square max-w-sm mx-auto p-4">
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      className="bg-white rounded-2xl shadow-xl p-4 mb-4 border border-gray-100 flex items-center gap-3"
    >
      <Search className="w-5 h-5 text-gray-400" />
      <div className="h-4 w-full bg-gray-100 rounded" />
    </motion.div>

    <div className="space-y-3">
      {[
        { color: "bg-[#E08E79]", name: "Sarah" },
        { color: "bg-[#1F6F5B]", name: "Mike" },
        { color: "bg-[#F1B92B]", name: "Emma" }
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 + (i * 0.15) }}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-3 shadow-md flex items-center gap-3"
        >
          <div className={`w-10 h-10 ${item.color} rounded-full opacity-20`} />
          <div className="flex-1">
            <div className="h-3 w-24 bg-gray-200 rounded mb-1" />
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className="w-2 h-2 text-[#F1B92B] fill-current" />
              ))}
            </div>
          </div>
          <Heart className="w-4 h-4 text-gray-300" />
        </motion.div>
      ))}
    </div>
  </div>
);

// Step 3: Message Animation
const MessageAnimation = () => (
  <div className="relative w-full aspect-square max-w-sm mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
    <div className="bg-[#F8F9FA] p-4 border-b border-gray-100 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-[#E08E79]" />
      <div className="h-3 w-24 bg-gray-200 rounded" />
      <div className="w-2 h-2 bg-[#1F6F5B] rounded-full ml-auto" />
    </div>
    <div className="flex-1 p-4 space-y-4">
      <motion.div
        initial={{ scale: 0, originX: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-100 rounded-2xl rounded-tl-none p-3 max-w-[80%]"
      >
        <div className="h-2 w-full bg-gray-300 rounded mb-2" />
        <div className="h-2 w-2/3 bg-gray-300 rounded" />
      </motion.div>
      <motion.div
        initial={{ scale: 0, originX: 1 }}
        whileInView={{ scale: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-[#1F6F5B] text-white rounded-2xl rounded-tr-none p-3 max-w-[80%] ml-auto"
      >
        <div className="h-2 w-full bg-white/30 rounded mb-2" />
        <div className="h-2 w-1/2 bg-white/30 rounded" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex gap-1"
      >
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75" />
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150" />
      </motion.div>
    </div>
  </div>
);

// Step 4: Book Animation
const BookAnimation = () => (
  <div className="relative w-full aspect-square max-w-sm mx-auto bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 flex flex-col items-center justify-center">
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-16 h-16 bg-[#E5F1EC] rounded-2xl flex items-center justify-center mb-6"
    >
      <Calendar className="w-8 h-8 text-[#1F6F5B]" />
    </motion.div>
    <div className="w-full space-y-3 mb-6">
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Date</span>
        <span className="font-semibold text-[#0F172A]">Oct 24, 2024</span>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Time</span>
        <span className="font-semibold text-[#0F172A]">09:00 AM</span>
      </div>
      <div className="h-px bg-gray-100 my-2" />
      <div className="flex justify-between items-center text-lg font-bold text-[#0F172A]">
        <span>Total</span>
        <span>$120.00</span>
      </div>
    </div>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="w-full bg-[#0F172A] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
    >
      <CreditCard className="w-4 h-4" />
      Confirm Booking
    </motion.button>

    <motion.div
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{ delay: 0.5, type: 'spring' }}
      className="absolute -top-4 -right-4 w-12 h-12 bg-[#1F6F5B] rounded-full flex items-center justify-center shadow-lg border-4 border-white"
    >
      <CheckCircle className="w-6 h-6 text-white" />
    </motion.div>
  </div>
);

export default function HowItWorksPage() {
  const steps = [
    {
      id: "01",
      title: "Create Your Profile",
      desc: "Sign up in minutes. Tell us about your family's needs, preferences, and schedule.",
      Animation: ProfileAnimation,
      color: "bg-[#F1B92B]"
    },
    {
      id: "02",
      title: "Browse & Connect",
      desc: "Filter through verified caregivers, read reviews, and view detailed profiles.",
      Animation: SearchAnimation,
      color: "bg-[#E08E79]"
    },
    {
      id: "03",
      title: "Chat & Interview",
      desc: "Message candidates safe & securely. Schedule interviews to find the perfect match.",
      Animation: MessageAnimation,
      color: "bg-[#1F6F5B]"
    },
    {
      id: "04",
      title: "Book & Pay",
      desc: "Schedule care and pay securely through the platform. No cash handling required.",
      Animation: BookAnimation,
      color: "bg-[#0F172A]"
    }
  ];

  return (
    <PublicLayout>
      <div className="pt-32 pb-20 px-6">
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-[#0F172A] mb-6 font-display"
          >
            Simple. Secure. <br />
            <span className="text-[#E08E79]">Stress-free.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto font-body leading-relaxed"
          >
            Finding the perfect caregiver shouldn't be a second job. We've streamlined the process to help you find trusted care in just a few clicks.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 mb-32 last:mb-0 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-display shadow-lg`}>
                  {step.id}
                </div>
                <h2 className="text-4xl font-bold text-[#0F172A] font-display">
                  {step.title}
                </h2>
                <p className="text-xl text-gray-600 font-body leading-relaxed">
                  {step.desc}
                </p>
                <ul className="space-y-3">
                  {[1, 2, 3].map((_, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-[#E5F1EC] flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-[#1F6F5B]" />
                      </div>
                      <span className="font-medium">
                        {index === 0 && ["Quick signup process", "Detailed preferences", "Personalized matches"][i]}
                        {index === 1 && ["Verified backgrounds", "Real reviews", "Experience badges"][i]}
                        {index === 2 && ["Secure messaging", "Video interviews", "Document sharing"][i]}
                        {index === 3 && ["Automated payments", "Booking history", "Instant receipts"][i]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Animation Graphic */}
              <div className="flex-1 w-full">
                <div className="relative">
                  {/* Blob Background */}
                  <div className={`absolute -inset-10 ${step.color} opacity-10 blur-3xl rounded-full`} />
                  <step.Animation />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto bg-[#E08E79] rounded-[40px] p-12 text-center text-white mt-32 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Sparkles size={200} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display relative z-10">
            Ready to find trusted care?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto relative z-10">
            Join thousands of families who found their perfect match on Keel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/auth/signup">
              <button className="bg-white text-[#E08E79] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-lg hover:scale-105">
                Get Started Now
              </button>
            </Link>
            <Link href="/book-service">
              <button className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                Browse Caregivers
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </PublicLayout>
  );
}

function Sparkles({ size = 24, className = "" }: { size?: number, className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
    </svg>
  );
}

