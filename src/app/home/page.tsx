'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Baby,
  GraduationCap,
  HeartPulse,
  Shield,
  Clock,
  Star,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import ParentLayout from '@/components/layout/ParentLayout';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1], // ease-out-expo
    },
  },
};

export default function HomePage() {
  const { user } = useAuth();

  const services = [
    {
      name: 'Child Care',
      icon: Baby,
      description: 'Verified nannies and babysitters for your little ones',
      image: '/babysitter_playing.png',
      color: 'bg-[#4A6C5B]',
      lightBg: 'bg-[#F4F7F5]',
      textColor: 'text-[#4A6C5B]',
    },
    {
      name: 'Shadow Teacher',
      icon: GraduationCap,
      description: 'Educational support specialists for unique learning needs',
      image: '/ShadowTeacher.png',
      color: 'bg-[#C19A4E]',
      lightBg: 'bg-[#FBF6F0]',
      textColor: 'text-[#C19A4E]',
    },
    {
      name: 'Senior Care',
      icon: HeartPulse,
      description: 'Compassionate care and companionship for elders',
      image: '/mother_child_caring.png',
      color: 'bg-[#B87356]',
      lightBg: 'bg-[#FBF6F4]',
      textColor: 'text-[#B87356]',
    },
  ];

  const stats = [
    { value: '100%', label: 'Verified Professionals', icon: Shield },
    { value: '50K+', label: 'Happy Families', icon: Star },
    { value: '24/7', label: 'Support Available', icon: Clock },
  ];

  const quickActions = [
    {
      title: 'Book a Service',
      description: 'Find the perfect caregiver for your needs',
      href: '/book-service',
      color: 'bg-[#4A6C5B]',
      lightBg: 'bg-[#F4F7F5]',
      textColor: 'text-[#4A6C5B]',
    },
    {
      title: 'My Bookings',
      description: 'View and manage your appointments',
      href: '/bookings',
      color: 'bg-[#C19A4E]',
      lightBg: 'bg-[#FBF6F0]',
      textColor: 'text-[#C19A4E]',
    },
    {
      title: 'Browse Services',
      description: 'Explore all available care options',
      href: '/services',
      color: 'bg-[#B87356]',
      lightBg: 'bg-[#FBF6F4]',
      textColor: 'text-[#B87356]',
    },
  ];

  return (
    <ParentLayout>
      <div className="space-y-24">
        {/* Hero Section - Warm & Inviting with Fluid Typography */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative"
        >
          <div className="bg-[#F4F7F5] rounded-[2.5rem] overflow-hidden relative">
            {/* Subtle noise texture */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
              }} 
            />
            
            <div className="flex flex-col lg:flex-row relative z-10">
              {/* Left Content */}
              <div className="flex-1 p-8 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-center">
                <motion.div 
                  variants={itemVariants}
                  className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full w-fit mb-6 border border-[#4A6C5B]/10"
                >
                  <Sparkles className="w-4 h-4 text-[#4A6C5B]" />
                  <span className="text-[#4A6C5B] font-medium text-sm">
                    Welcome back{user?.profiles?.first_name ? `, ${user.profiles.first_name}` : ''}
                  </span>
                </motion.div>
                
                <motion.h1
                  variants={itemVariants}
                  className="fluid-5xl font-display font-normal text-[#37322D] mb-6 tracking-tight text-balance"
                >
                  Find trusted care
                  <br />
                  <span className="text-[#4A6C5B]">for your family</span>
                </motion.h1>
                
                <motion.p
                  variants={itemVariants}
                  className="fluid-lg text-[#6B5D52] leading-relaxed mb-10 max-w-md"
                >
                  Connect with verified caregivers who bring expertise, warmth, and dedication to your home.
                </motion.p>
                
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col sm:flex-row items-start gap-4"
                >
                  <Link
                    href="/book-service"
                    className="inline-flex items-center gap-3 bg-[#4A6C5B] hover:bg-[#3D5A4B] text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-[0_4px_16px_rgba(74,108,91,0.25)] hover:shadow-[0_8px_24px_rgba(74,108,91,0.3)] hover:-translate-y-0.5 group"
                  >
                    Book a Service
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 text-[#6B5D52] hover:text-[#37322D] font-medium transition-colors duration-300 py-4 group"
                  >
                    Learn more
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
                  </Link>
                </motion.div>
              </div>

              {/* Right Image with parallax-like effect */}
              <motion.div
                variants={itemVariants}
                className="lg:w-[48%] relative min-h-[320px] lg:min-h-[540px]"
              >
                <div className="absolute inset-0 lg:inset-6 lg:rounded-[2rem] overflow-hidden">
                  <Image
                    src="/image1.png"
                    alt="Family care"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F4F7F5]/20 to-transparent lg:hidden" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Quick Actions - Staggered Animation */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-10">
            <h2 className="fluid-3xl font-display font-normal text-[#37322D] tracking-tight">
              Quick Actions
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                variants={itemVariants}
                custom={index}
              >
                <Link href={action.href} className="block group h-full">
                  <div className={`${action.lightBg} rounded-[1.75rem] p-8 h-full border border-transparent hover:border-[#D9D1C6] transition-all duration-400 hover:shadow-[0_10px_40px_rgba(55,50,45,0.08)] hover:-translate-y-1`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform duration-300`}
                      style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    >
                      <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform duration-300" />
                    </div>
                    <h3 className={`fluid-xl font-medium ${action.textColor} mb-2`}>
                      {action.title}
                    </h3>
                    <p className="text-[#6B5D52] fluid-sm leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Our Services - Premium Cards with Layered Elevation */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-10">
            <h2 className="fluid-3xl font-display font-normal text-[#37322D] tracking-tight">
              Our Services
            </h2>
            <Link
              href="/services"
              className="text-[#4A6C5B] hover:text-[#3D5A4B] font-medium fluid-sm flex items-center gap-1 transition-colors duration-300 group"
            >
              View all
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.name}
                  variants={itemVariants}
                  custom={index}
                  className="group"
                >
                  <div className="bg-white rounded-[1.75rem] overflow-hidden border border-[#E4DDD3] transition-all duration-400 hover:border-[#D9D1C6] hover:shadow-[0_20px_50px_rgba(55,50,45,0.1)] hover:-translate-y-1"
                    style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
                    </div>
                    <div className="p-7">
                      <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mb-5 -mt-12 relative z-10 shadow-lg group-hover:scale-105 transition-transform duration-300`}
                        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="fluid-xl font-medium text-[#37322D] mb-2">
                        {service.name}
                      </h3>
                      <p className="text-[#6B5D52] fluid-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Stats Section - Clean & Minimal with Frosted Glass */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-[2rem] p-10 md:p-14 border border-[#E4DDD3] shadow-[0_4px_24px_rgba(55,50,45,0.04)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    custom={index}
                    className="text-center"
                  >
                    <div className="w-14 h-14 bg-[#F4F7F5] rounded-full flex items-center justify-center mx-auto mb-5">
                      <Icon className="w-6 h-6 text-[#4A6C5B]" />
                    </div>
                    <h3 className="fluid-4xl font-display font-normal text-[#37322D] mb-2 tracking-tight">
                      {stat.value}
                    </h3>
                    <p className="text-[#6B5D52] fluid-sm">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.section>

        {/* CTA Section - Premium with Layered Shadows */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="bg-[#4A6C5B] rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden"
          >
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
              }}
            />
            
            <div className="relative z-10">
              <h2 className="fluid-3xl font-display font-normal text-white mb-5 tracking-tight text-balance">
                Ready to find the perfect caregiver?
              </h2>
              <p className="fluid-lg text-[#C4D5CA] mb-10 max-w-xl mx-auto">
                Browse our verified professionals and book your first service today.
              </p>
              <Link
                href="/book-service"
                className="inline-flex items-center gap-3 bg-white hover:bg-[#FDFCFA] text-[#4A6C5B] px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </ParentLayout>
  );
}
