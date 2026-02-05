'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Baby,
  HeartPulse,
  GraduationCap,
  ArrowRight,
  Shield,
  CheckCircle2,
  Sparkles,
  Calendar,
  CreditCard,
} from 'lucide-react';
import ParentLayout from '@/components/layout/ParentLayout';
import ChildCareModal from '@/components/booking/ChildCareModal';
import ShadowTeacherModal from '@/components/booking/ShadowTeacherModal';
import SeniorCareModal from '@/components/booking/SeniorCareModal';

type ServiceType = 'CHILD_CARE' | 'SHADOW_TEACHER' | 'SENIOR_CARE' | 'PET_CARE' | 'HOUSEKEEPING' | null;

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // ease-out-expo
    },
  },
};

const cardHoverVariants = {
  rest: { 
    y: 0,
    boxShadow: '0 4px 6px rgba(55, 50, 45, 0.04), 0 2px 4px rgba(55, 50, 45, 0.03)',
  },
  hover: { 
    y: -6,
    boxShadow: '0 20px 40px rgba(55, 50, 45, 0.1), 0 8px 16px rgba(55, 50, 45, 0.06)',
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const SERVICES = [
  {
    id: 'CHILD_CARE' as const,
    label: 'Child Care',
    description: 'Verified nannies and babysitters for children aged 5 months to 6+ years',
    icon: Baby,
    color: 'bg-[#4A6C5B]',
    lightBg: 'bg-[#F4F7F5]',
    textColor: 'text-[#4A6C5B]',
    borderColor: 'border-[#4A6C5B]/15',
    hoverBorder: 'hover:border-[#4A6C5B]/30',
    features: ['Background verified', 'First aid certified', 'Flexible scheduling'],
  },
  {
    id: 'SHADOW_TEACHER' as const,
    label: 'Shadow Teacher',
    description: 'Specialized educational support for unique learning needs',
    icon: GraduationCap,
    color: 'bg-[#C19A4E]',
    lightBg: 'bg-[#FBF6F0]',
    textColor: 'text-[#C19A4E]',
    borderColor: 'border-[#C19A4E]/15',
    hoverBorder: 'hover:border-[#C19A4E]/30',
    features: ['Education specialists', 'Individualized approach', 'Progress tracking'],
  },
  {
    id: 'SENIOR_CARE' as const,
    label: 'Senior Care',
    description: 'Compassionate companionship and assistance for aging loved ones',
    icon: HeartPulse,
    color: 'bg-[#B87356]',
    lightBg: 'bg-[#FBF6F4]',
    textColor: 'text-[#B87356]',
    borderColor: 'border-[#B87356]/15',
    hoverBorder: 'hover:border-[#B87356]/30',
    features: ['Trained caregivers', 'Medical support', 'Companionship focus'],
  },
];

const BENEFITS = [
  {
    title: 'Easy Booking',
    description: 'Book in just a few taps. Select your service, choose a caregiver, and confirm.',
    icon: Calendar,
  },
  {
    title: 'Flexible Scheduling',
    description: 'Find care that fits your schedule. One-time or recurring appointments.',
    icon: Sparkles,
  },
  {
    title: 'Secure Payments',
    description: 'Pay safely through our platform. Encrypted and protected transactions.',
    icon: CreditCard,
  },
];

export default function BookServicePage() {
  const [selectedService, setSelectedService] = useState<ServiceType>(null);

  const handleServiceSelect = (serviceId: ServiceType) => {
    setSelectedService(serviceId);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  return (
    <ParentLayout>
      <div className="min-h-screen">
        {/* Hero Section - Clean & Elegant with Fluid Typography */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-[#F4F7F5] px-4 py-2 rounded-full mb-6 border border-[#4A6C5B]/10"
          >
            <Sparkles className="w-4 h-4 text-[#4A6C5B]" />
            <span className="text-[#4A6C5B] font-medium text-sm">Book a Service</span>
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="fluid-5xl font-display font-normal text-[#37322D] mb-6 tracking-tight text-balance"
          >
            What service do you need?
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="fluid-lg text-[#6B5D52] max-w-2xl mx-auto leading-relaxed"
          >
            Select a service below to get started. We connect you with verified professionals who bring expertise and care to your home.
          </motion.p>
        </motion.section>

        {/* Services Grid - Premium Cards with Advanced Interactions */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16"
        >
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.button
                key={service.id}
                variants={itemVariants}
                custom={index}
                initial="rest"
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                onClick={() => handleServiceSelect(service.id)}
                className={`${service.lightBg} rounded-[1.75rem] p-8 text-left border ${service.borderColor} ${service.hoverBorder} group relative overflow-hidden transition-colors duration-300`}
              >
                <motion.div variants={cardHoverVariants} className="relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-400`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className={`fluid-2xl font-medium ${service.textColor} mb-3`}>
                    {service.label}
                  </h3>
                  <p className="text-[#6B5D52] leading-relaxed mb-6 fluid-base">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <motion.li 
                        key={feature} 
                        className="flex items-center gap-2.5 text-[#6B5D52] fluid-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${service.textColor} flex-shrink-0`} />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center gap-2 fluid-sm font-medium text-[#37322D] group-hover:text-[#4A6C5B] transition-colors duration-300">
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </motion.div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Trust Banner - Frosted Glass Design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/80 backdrop-blur-sm rounded-[1.75rem] p-8 md:p-10 border border-[#E4DDD3] shadow-[0_4px_24px_rgba(55,50,45,0.04)] mb-16"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="w-16 h-16 bg-[#F4F7F5] rounded-2xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7 text-[#4A6C5B]" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="fluid-xl font-medium text-[#37322D] mb-2">
                All Professionals Are Verified
              </h4>
              <p className="text-[#6B5D52] fluid-base leading-relaxed">
                Every caregiver on our platform undergoes rigorous background checks, identity verification, and reference validation to ensure your family&apos;s safety and peace of mind.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Benefits Section - Staggered Animation */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {BENEFITS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                custom={index}
                className="text-center p-6"
              >
                <div className="w-12 h-12 bg-[#F4F7F5] rounded-xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-5 h-5 text-[#4A6C5B]" />
                </div>
                <h4 className="fluid-lg font-medium text-[#37322D] mb-2">{item.title}</h4>
                <p className="text-[#6B5D52] fluid-sm leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.section>

        {/* Modals */}
        <AnimatePresence>
          {selectedService === 'CHILD_CARE' && (
            <ChildCareModal onClose={handleCloseModal} />
          )}
          {selectedService === 'SHADOW_TEACHER' && (
            <ShadowTeacherModal onClose={handleCloseModal} />
          )}
          {selectedService === 'SENIOR_CARE' && (
            <SeniorCareModal onClose={handleCloseModal} />
          )}
        </AnimatePresence>
      </div>
    </ParentLayout>
  );
}
