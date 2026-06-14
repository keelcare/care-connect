'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Baby, GraduationCap, Heart, CalendarCheck } from 'lucide-react';
import { ServiceCard } from '@/components/services/ServiceCard';
import { BookingSheet } from '@/components/services/BookingSheet';
import { BadgePill } from '@/components/ui/BadgePill';
import ChildCareModal from '@/components/booking/ChildCareModal';
import ShadowTeacherModal from '@/components/booking/ShadowTeacherModal';
import SpecialNeedsModal from '@/components/booking/SpecialNeedsModal';
import { useAuth } from '@/context/AuthContext';

type ServiceType = 'CHILD_CARE' | 'SHADOW_TEACHER' | 'SPECIAL_NEEDS' | null;

/* ─────────────────────────────────────────────
   Service config
───────────────────────────────────────────── */
const SERVICES = [
  {
    id: 'CHILD_CARE' as const,
    icon: <Baby size={22} strokeWidth={1.75} />,
    title: 'Child Care',
    description: 'Professional home-based care focused on safety, play & developmental milestones.',
    pricingLabel: 'Starting ₹200/hr',
    pricingSublabel: 'Flexible one-time & subscription plans',
    badge: 'Most Popular',
    delay: 0,
  },
  {
    id: 'SHADOW_TEACHER' as const,
    icon: <GraduationCap size={22} strokeWidth={1.75} />,
    title: 'Shadow Teacher',
    description: 'Specialized one-on-one academic support for children with unique learning needs.',
    pricingLabel: 'Custom Plans',
    pricingSublabel: 'Tailored to your child\'s curriculum',
    delay: 0.07,
  },
  {
    id: 'SPECIAL_NEEDS' as const,
    icon: <Heart size={22} strokeWidth={1.75} />,
    title: 'Special Needs Care',
    description: 'Compassionate, trained caregivers specializing in personalized support.',
    pricingLabel: 'Needs Assessment',
    pricingSublabel: 'Pricing after evaluation',
    delay: 0.14,
  },
] as const;

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function BookServiceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [selectedService, setSelectedService] = useState<ServiceType>(null);

  /* ── Auth guard ── */
  useEffect(() => {
    if (user === null) router.push('/auth/login');
  }, [user, router]);

  /* ── Restore from localStorage ── */
  useEffect(() => {
    const saved = localStorage.getItem('careconnect_selected_service');
    if (saved && ['CHILD_CARE', 'SHADOW_TEACHER', 'SPECIAL_NEEDS'].includes(saved)) {
      setSelectedService(saved as ServiceType);
    }
  }, []);

  /* ── Persist selected service ── */
  useEffect(() => {
    if (selectedService) {
      localStorage.setItem('careconnect_selected_service', selectedService);
    } else {
      localStorage.removeItem('careconnect_selected_service');
    }
  }, [selectedService]);

  /* ── URL param deep-link ── */
  useEffect(() => {
    const param = searchParams?.get('service');
    if (param && ['CHILD_CARE', 'SHADOW_TEACHER', 'SPECIAL_NEEDS'].includes(param)) {
      setSelectedService(param as ServiceType);
    }
  }, [searchParams]);

  const handleOpen = useCallback((id: ServiceType) => setSelectedService(id), []);
  const handleClose = useCallback(() => setSelectedService(null), []);

  /* ── Inner booking form — rendered inside BookingSheet ── */
  const renderBookingForm = () => {
    switch (selectedService) {
      case 'CHILD_CARE':
        return <ChildCareModal onClose={handleClose} embedded />;
      case 'SHADOW_TEACHER':
        return <ShadowTeacherModal onClose={handleClose} embedded />;
      case 'SPECIAL_NEEDS':
        return <SpecialNeedsModal onClose={handleClose} embedded />;
      default:
        return null;
    }
  };

  const selectedLabel =
    SERVICES.find((s) => s.id === selectedService)?.title ?? 'Book a Service';

  return (
    <div className="min-h-dvh bg-background pb-20">

      {/* ── Hero ── */}
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-4"
        >
          {/* Badge */}
          <BadgePill text="PREMIUM FAMILY CARE" variant="primary" />

          {/* Heading */}
          <h1 className="text-fluid-3xl md:text-fluid-4xl font-display font-medium text-[hsl(var(--primary))] leading-tight tracking-tight">
            How can we support{' '}
            <span className="italic text-[hsl(var(--primary-700))]">your family</span> today?
          </h1>

          {/* Sub-copy */}
          <p className="text-[hsl(var(--muted-foreground))] font-body leading-relaxed max-w-lg text-fluid-base">
            Choose from our suite of specialized care services — each designed to bring
            professional support and harmony to your home.
          </p>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]"
          >
            <CalendarCheck size={14} className="text-[hsl(var(--primary))]" />
            <span>Instant booking · Background-verified caregivers · 24/7 support</span>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Services Grid ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {SERVICES.map((svc) => (
            <ServiceCard
              key={svc.id}
              id={svc.id}
              icon={svc.icon}
              title={svc.title}
              description={svc.description}
              pricingLabel={svc.pricingLabel}
              pricingSublabel={svc.pricingSublabel}
              badge={'badge' in svc ? (svc as { badge?: string }).badge : undefined}
              delay={svc.delay}
              onClick={() => handleOpen(svc.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Booking Sheet / Modal ── */}
      <BookingSheet
        isOpen={selectedService !== null}
        onClose={handleClose}
        ariaLabel={`Book ${selectedLabel}`}
      >
        {renderBookingForm()}
      </BookingSheet>
    </div>
  );
}
