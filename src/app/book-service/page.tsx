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
} from 'lucide-react';
import ParentLayout from '@/components/layout/ParentLayout';
import ChildCareModal from '@/components/booking/ChildCareModal';
import ShadowTeacherModal from '@/components/booking/ShadowTeacherModal';
import SeniorCareModal from '@/components/booking/SeniorCareModal';

type ServiceType = 'CHILD_CARE' | 'SHADOW_TEACHER' | 'SENIOR_CARE' | 'PET_CARE' | 'HOUSEKEEPING' | null;

const SERVICES = [
  {
    id: 'CHILD_CARE' as const,
    label: 'Child Care',
    description: 'Verified nannies and babysitters for children aged 5 months to 6+ years',
    icon: Baby,
    color: 'bg-[#4A6C5B]',
    lightBg: 'bg-[#F4F7F5]',
    textColor: 'text-[#4A6C5B]',
    borderColor: 'border-[#4A6C5B]/20',
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
    borderColor: 'border-[#C19A4E]/20',
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
    borderColor: 'border-[#B87356]/20',
    features: ['Trained caregivers', 'Medical support', 'Companionship focus'],
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
        {/* Hero Section - Clean & Elegant */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[#4A6C5B] font-medium text-sm tracking-wide uppercase mb-4"
          >
            Book a Service
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-[#37322D] mb-5 tracking-tight"
          >
            What service do you need?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[#6B5D52] text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Select a service below to get started. We'll connect you with verified professionals who bring expertise and care to your home.
          </motion.p>
        </motion.section>

        {/* Services Grid - Premium Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
          {SERVICES.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleServiceSelect(service.id)}
                className={`${service.lightBg} rounded-[1.75rem] p-8 text-left transition-all duration-300 border ${service.borderColor} hover:border-[#D9D1C6] hover:shadow-xl group relative overflow-hidden`}
              >
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className={`text-2xl font-medium ${service.textColor} mb-3`}>
                    {service.label}
                  </h3>
                  <p className="text-[#6B5D52] leading-relaxed mb-6 text-[15px]">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-[#6B5D52] text-sm">
                        <CheckCircle2 className={`w-4 h-4 ${service.textColor}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sm font-medium text-[#37322D] group-hover:text-[#4A6C5B] transition-colors">
                    <span>Book Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Trust Banner - Elegant Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-[1.75rem] p-8 border border-[#E4DDD3]"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-14 h-14 bg-[#F4F7F5] rounded-2xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-[#4A6C5B]" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-xl font-medium text-[#37322D] mb-2">
                All Professionals Are Verified
              </h4>
              <p className="text-[#6B5D52] text-[15px] leading-relaxed">
                Every caregiver on our platform undergoes rigorous background checks, identity verification, and reference validation to ensure your family's safety and peace of mind.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Additional Info Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: 'Easy Booking',
              description: 'Book in just a few taps. Select your service, choose a caregiver, and confirm your appointment.',
            },
            {
              title: 'Flexible Scheduling',
              description: 'Find care that fits your schedule. From one-time bookings to recurring appointments.',
            },
            {
              title: 'Secure Payments',
              description: 'Pay safely through our platform. Your transactions are encrypted and protected.',
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="text-center p-6"
            >
              <h4 className="text-lg font-medium text-[#37322D] mb-2">{item.title}</h4>
              <p className="text-[#6B5D52] text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
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
