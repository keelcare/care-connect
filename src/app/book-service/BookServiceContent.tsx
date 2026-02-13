'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Baby, GraduationCap, Heart } from 'lucide-react';
import { ServiceCard } from '@/components/services/ServiceCard';
import { BadgePill } from '@/components/ui/BadgePill';
import ChildCareModal from '@/components/booking/ChildCareModal';
import ShadowTeacherModal from '@/components/booking/ShadowTeacherModal';
import SpecialNeedsModal from '@/components/booking/SpecialNeedsModal';

type ServiceType = 'CHILD_CARE' | 'SHADOW_TEACHER' | 'SPECIAL_NEEDS' | null;

export default function BookServiceContent() {
  const searchParams = useSearchParams();
  const [selectedService, setSelectedService] = useState<ServiceType>(null);

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      if (['CHILD_CARE', 'SHADOW_TEACHER', 'SPECIAL_NEEDS'].includes(serviceParam)) {
        setSelectedService(serviceParam as ServiceType);
      }
    }
  }, [searchParams]);

  const handleServiceSelect = (serviceId: ServiceType) => {
    setSelectedService(serviceId);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-2 pt-5 pb-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Top Badge */}
          <div className="flex justify-center mb-6">
            <BadgePill text="PREMIUM FAMILY CARE" variant="primary" />
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-display font-medium text-primary-900 mb-6 leading-tight">
            How can we support{' '}
            <span className="italic text-primary-700">your family</span> today?
          </h1>

          {/* Subtext */}
          <p className="text-lg text-gray-600 font-body leading-relaxed max-w-xl mx-auto">
            Choose from our suite of specialized care services, each designed to bring harmony and professional support to your home.
          </p>
        </motion.div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Child Care Card */}
          <ServiceCard
            title="Child Care"
            description="Safety, engagement, developmental milestones focus."
            pricing={{ label: '₹200/hr', sublabel: 'Starting from' }}
            imagePlaceholder={
              <div className="w-full h-full flex items-center justify-center text-primary-900/20">
                <Baby className="w-24 h-24" strokeWidth={1.5} />
              </div>
            }
            onClick={() => handleServiceSelect('CHILD_CARE')}
            delay={0}
          />

          {/* Shadow Teacher Card */}
          <ServiceCard
            title="Shadow Teacher"
            description="Specialized educational support for unique learning needs."
            pricing={{ label: 'Custom Plans', sublabel: 'Tailored pricing' }}
            imagePlaceholder={
              <div className="w-full h-full flex items-center justify-center text-primary-900/20">
                <GraduationCap className="w-24 h-24" strokeWidth={1.5} />
              </div>
            }
            onClick={() => handleServiceSelect('SHADOW_TEACHER')}
            delay={0.1}
          />

          {/* Special Needs Card */}
          <ServiceCard
            title="Special Needs"
            description="Specialized care and support for individuals with unique requirements."
            pricing={{ label: 'Evaluation', sublabel: 'Assessed' }}
            imagePlaceholder={
              <div className="w-full h-full flex items-center justify-center text-primary-900/20">
                <Heart className="w-24 h-24" strokeWidth={1.5} />
              </div>
            }
            onClick={() => handleServiceSelect('SPECIAL_NEEDS')}
            delay={0.2}
          />
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedService === 'CHILD_CARE' && (
          <ChildCareModal onClose={handleCloseModal} />
        )}
        {selectedService === 'SHADOW_TEACHER' && (
          <ShadowTeacherModal onClose={handleCloseModal} />
        )}
        {selectedService === 'SPECIAL_NEEDS' && (
          <SpecialNeedsModal onClose={handleCloseModal} />
        )}
      </AnimatePresence>
    </div>
  );
}
