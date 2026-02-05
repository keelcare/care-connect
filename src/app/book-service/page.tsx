'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Baby,
  HeartPulse,
  GraduationCap,
  X,
} from 'lucide-react';
import ParentLayout from '@/components/layout/ParentLayout';
import ChildCareModal from '@/components/booking/ChildCareModal';
import ShadowTeacherModal from '@/components/booking/ShadowTeacherModal';
import SeniorCareModal from '@/components/booking/SeniorCareModal';
// import PetCareModal from '@/components/booking/PetCareModal';
// import HousekeepingModal from '@/components/booking/HousekeepingModal';

type ServiceType = 'CHILD_CARE' | 'SHADOW_TEACHER' | 'SENIOR_CARE' | 'PET_CARE' | 'HOUSEKEEPING' | null;

const SERVICES = [
  {
    id: 'CHILD_CARE' as const,
    label: 'Child Care',
    description: 'Verified nannies and babysitters for children aged 5 months to 6+ years',
    icon: Baby,
    color: 'bg-[#1F6F5B]',
    hoverColor: 'hover:bg-[#1a5f4f]',
    lightBg: 'bg-[#E5F1EC]',
    textColor: 'text-[#1F6F5B]',
  },
  {
    id: 'SHADOW_TEACHER' as const,
    label: 'Shadow Teacher',
    description: 'Specialized educational support for unique learning needs',
    icon: GraduationCap,
    color: 'bg-[#F1B92B]',
    hoverColor: 'hover:bg-[#d9a526]',
    lightBg: 'bg-[#FEF7E6]',
    textColor: 'text-[#F1B92B]',
  },
  {
    id: 'SENIOR_CARE' as const,
    label: 'Senior Care',
    description: 'Compassionate companionship and assistance for aging loved ones',
    icon: HeartPulse,
    color: 'bg-[#E08E79]',
    hoverColor: 'hover:bg-[#d17d6a]',
    lightBg: 'bg-[#FDF3F1]',
    textColor: 'text-[#E08E79]',
  },
  // Pet Care and Housekeeping services commented out - not available yet
  // {
  //   id: 'PET_CARE' as const,
  //   label: 'Pet Care',
  //   description: 'Professional dog walking, pet sitting, and comprehensive care',
  //   icon: PawPrint,
  //   color: 'bg-[#C9C6E5]',
  //   hoverColor: 'hover:bg-[#b8b4d9]',
  //   lightBg: 'bg-[#F5F4FB]',
  //   textColor: 'text-[#8B87C7]',
  // },
  // {
  //   id: 'HOUSEKEEPING' as const,
  //   label: 'Housekeeping',
  //   description: 'Professional home cleaning and maintenance services',
  //   icon: Home,
  //   color: 'bg-[#0F172A]',
  //   hoverColor: 'hover:bg-[#1e293b]',
  //   lightBg: 'bg-[#F1F5F9]',
  //   textColor: 'text-[#0F172A]',
  // },
];

export default function BookServicePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<ServiceType>(null);

  const handleServiceSelect = (serviceId: ServiceType) => {
    setSelectedService(serviceId);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  return (
    <ParentLayout>
      <div className="min-h-screen bg-[#F8F9FA] pb-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#0F172A] via-[#1e3a5f] to-[#0F172A] relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E08E79] rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1F6F5B] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2" />

          <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-6xl font-display font-medium text-white mb-6 leading-tight">
                What service do you need?
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto font-body">
                Select a service below to get started. We'll connect you with verified professionals who bring expertise and care to your home.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.2, 0.8, 0.2, 1],
                  }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`${service.lightBg} rounded-[40px] p-8 text-left transition-all duration-300 border-2 border-transparent hover:border-white hover:shadow-2xl group relative overflow-hidden`}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[40px]" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className={`text-2xl font-bold ${service.textColor} mb-3 font-display`}>
                      {service.label}
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-body">
                      {service.description}
                    </p>

                    {/* Arrow indicator */}
                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">
                      <span>Book Now</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 bg-white rounded-[40px] p-8 shadow-xl border border-gray-100"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-[#1F6F5B]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-8 h-8 text-[#1F6F5B]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h4 className="text-xl font-bold text-[#0F172A] mb-2 font-display">
                  All Professionals Are Verified
                </h4>
                <p className="text-gray-600 font-body">
                  Every caregiver on our platform undergoes rigorous background checks, identity verification, and reference validation to ensure your family's safety and peace of mind.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

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
          {/* Pet Care and Housekeeping modals commented out - services not available yet */}
          {/* {selectedService === 'PET_CARE' && (
            <PetCareModal onClose={handleCloseModal} />
          )} */}
          {/* {selectedService === 'HOUSEKEEPING' && (
            <HousekeepingModal onClose={handleCloseModal} />
          )} */}
        </AnimatePresence>
      </div>
    </ParentLayout>
  );
}
