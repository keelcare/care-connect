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
  Heart,
} from 'lucide-react';
import ParentLayout from '@/components/layout/ParentLayout';
import ChildCareModal from '@/components/booking/ChildCareModal';
import ShadowTeacherModal from '@/components/booking/ShadowTeacherModal';
import SeniorCareModal from '@/components/booking/SeniorCareModal';

type ServiceType = 'CHILD_CARE' | 'SHADOW_TEACHER' | 'SENIOR_CARE' | 'PET_CARE' | 'HOUSEKEEPING' | null;

// Animation variants
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
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const SERVICES = [
  {
    id: 'CHILD_CARE' as const,
    label: 'Child Care',
    description: 'Verified nannies and babysitters trained in special needs care for children of all ages',
    icon: Baby,
    gradient: 'from-[#8B7FDB] to-[#A594F9]',
    lightBg: 'bg-[#F5F3FF]',
    textColor: 'text-[#8B7FDB]',
    borderHover: 'hover:border-[#8B7FDB]/30',
    features: ['Background verified', 'Special needs trained', 'Flexible scheduling'],
  },
  {
    id: 'SHADOW_TEACHER' as const,
    label: 'Shadow Teacher',
    description: 'Specialized educational support for unique learning needs and developmental goals',
    icon: GraduationCap,
    gradient: 'from-[#7FC7D9] to-[#A5D8E6]',
    lightBg: 'bg-[#F0F9FF]',
    textColor: 'text-[#5BA8BC]',
    borderHover: 'hover:border-[#7FC7D9]/30',
    features: ['Education specialists', 'Individualized approach', 'Progress tracking'],
  },
  {
    id: 'SENIOR_CARE' as const,
    label: 'Senior Care',
    description: 'Compassionate companionship and assistance for aging loved ones with dignity',
    icon: HeartPulse,
    gradient: 'from-[#E8B4B8] to-[#F2CCCF]',
    lightBg: 'bg-[#FFF5F6]',
    textColor: 'text-[#D4868C]',
    borderHover: 'hover:border-[#E8B4B8]/30',
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
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const handleServiceSelect = (serviceId: ServiceType) => {
    setSelectedService(serviceId);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  return (
    <ParentLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-16 relative"
        >
          {/* Background gradient hint */}
          <div className="absolute inset-0 bg-hero-gradient opacity-50 rounded-3xl -z-10 blur-3xl" />
          
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2.5 rounded-full mb-8 border border-[#8B7FDB]/15"
          >
            <Sparkles className="w-4 h-4 text-[#8B7FDB]" />
            <span className="text-[#8B7FDB] font-medium text-sm">Special Needs Care Specialists</span>
          </motion.div>
          
          <motion.h1
            variants={itemVariants}
            className="fluid-5xl font-heading text-neutral-800 mb-6 tracking-tight text-balance"
          >
            What care does your{' '}
            <span className="gradient-text">family need</span>?
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="fluid-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed"
          >
            Select a service below to connect with verified professionals trained 
            to support children with unique needs.
          </motion.p>
        </motion.section>

        {/* Services Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16"
        >
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            const isHovered = hoveredService === service.id;
            
            return (
              <motion.button
                key={service.id}
                variants={itemVariants}
                custom={index}
                onClick={() => handleServiceSelect(service.id)}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
                className={`${service.lightBg} rounded-[1.75rem] p-8 text-left border border-transparent ${service.borderHover} group relative overflow-hidden transition-all duration-500`}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Hover glow effect */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-500`}
                />
                
                <div className="relative z-10">
                  {/* Icon with gradient background */}
                  <motion.div 
                    className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className={`fluid-2xl font-medium text-neutral-800 mb-3`}>
                    {service.label}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed mb-6 fluid-base">
                    {service.description}
                  </p>

                  {/* Features with staggered reveal */}
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <motion.li 
                        key={feature} 
                        className="flex items-center gap-2.5 text-neutral-600 fluid-sm"
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: isHovered ? 1 : 0.7 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${service.textColor} flex-shrink-0`} />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className={`flex items-center gap-2 fluid-sm font-medium ${service.textColor} transition-colors duration-300`}>
                    <span>Book Now</span>
                    <motion.div
                      animate={{ x: isHovered ? 6 : 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Trust Banner - Frosted Glass */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-8 md:p-10 mb-16"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-[#8B7FDB] to-[#7FC7D9] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Shield className="w-7 h-7 text-white" />
            </motion.div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="fluid-xl font-medium text-neutral-800 mb-2">
                All Specialists Are Verified & Trained
              </h4>
              <p className="text-neutral-600 fluid-base leading-relaxed">
                Every caregiver on our platform undergoes rigorous background checks, 
                specialized training verification, and reference validation. We ensure 
                they have the skills to support children with unique needs.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="mb-16"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <span className="text-[#7FC7D9] font-medium fluid-sm uppercase tracking-wider">
              Why Choose Keel
            </span>
            <h2 className="fluid-3xl mt-3">A Seamless Experience</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BENEFITS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  custom={index}
                  className="text-center p-6"
                >
                  <div className="w-14 h-14 bg-[#F5F3FF] rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-6 h-6 text-[#8B7FDB]" />
                  </div>
                  <h4 className="fluid-lg font-medium text-neutral-800 mb-2">{item.title}</h4>
                  <p className="text-neutral-600 fluid-sm leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="bg-section-alt noise-overlay rounded-3xl p-10 md:p-14 text-center"
        >
          <Heart className="w-10 h-10 text-[#E8B4B8] mx-auto mb-6" />
          <h3 className="fluid-3xl text-balance mb-4">
            Need help choosing?
          </h3>
          <p className="text-neutral-600 fluid-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Our care coordinators can help you find the perfect match 
            for your child&apos;s specific needs.
          </p>
          <a 
            href="/contact" 
            className="btn-secondary inline-flex items-center gap-2"
          >
            Contact Us
            <ArrowRight className="w-4 h-4" />
          </a>
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
