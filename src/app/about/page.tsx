'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import {
  Heart,
  Users,
  Shield,
  Award,
  Target,
  Sparkles,
  Check,
  ArrowRight,
  Quote
} from 'lucide-react';
import Link from 'next/link';
import PublicLayout from '@/components/layout/PublicLayout';

const ValueCard = ({ value, index }: { value: any, index: number }) => {
  const Icon = value.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group p-8 rounded-[32px] bg-white border border-gray-100 hover:shadow-xl hover:shadow-[#1F6F5B]/5 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-1/2 -translate-y-1/2">
        <Icon size={120} />
      </div>
      <div className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-gray-200`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-[#0F172A] mb-3 font-display">
        {value.title}
      </h3>
      <p className="text-gray-600 font-body leading-relaxed">
        {value.description}
      </p>
    </motion.div>
  );
}

const StatItem = ({ stat, index }: { stat: any, index: number }) => (
  <motion.div
    initial={{ scale: 0.5, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    transition={{ delay: index * 0.1, type: "spring" }}
    className="text-center relative"
  >
    <div className="text-4xl md:text-6xl font-bold font-display text-white mb-2">
      {stat.value}
    </div>
    <div className="text-[#E5F1EC] font-medium text-lg uppercase tracking-wide opacity-80">
      {stat.label}
    </div>
  </motion.div>
)

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: "Every caregiver undergoes thorough background checks and identity verification. Your family's safety is non-negotiable.",
      color: "bg-[#0F172A]"
    },
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'We connect you with caregivers who genuinely care, bringing warmth and dedication to every interaction.',
      color: "bg-[#E08E79]"
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Building meaningful relationships between families and caregivers that go beyond just services.',
      color: "bg-[#1F6F5B]"
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to the highest standards in everything we do, continuously improving based on your feedback.',
      color: "bg-[#F1B92B]"
    },
  ];

  const stats = [
    { value: '50k+', label: 'Families Served' },
    { value: '15k+', label: 'Verified Caregivers' },
    { value: '98%', label: 'Top Rating' },
    { value: '24/7', label: 'Support' },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      bio: 'Former pediatric nurse turned entrepreneur'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: '10+ years in family services'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Trust & Safety',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      bio: 'Background in child welfare advocacy'
    },
    {
      name: 'David Park',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      bio: 'Building products that matter'
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 bg-white border border-gray-100 px-4 py-2 rounded-full mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#F1B92B]" />
              <span className="text-sm font-bold text-[#0F172A]">Our Story</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-[#0F172A] leading-[1.1] font-display mb-8">
              We believe every family deserves <br />
              <span className="text-[#E08E79]">trusted care.</span>
            </h1>
            <p className="text-xl text-gray-600 font-body leading-relaxed mb-8 max-w-lg">
              Keel was born from a simple mission: to make finding safe, reliable, and loving care effortless for families everywhere.
            </p>
            <div className="flex gap-4">
              <Link href="/book-service">
                <button className="bg-[#1F6F5B] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#155243] transition-all shadow-lg hover:translate-y-[-2px]">
                  Find Care
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="bg-white border-2 border-gray-200 text-[#0F172A] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all">
                  Join Our Team
                </button>
              </Link>
            </div>
          </motion.div>

          <div className="relative">
            <motion.div
              style={{ y }}
              className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border-4 border-white"
            >
              <Image
                src="/mother_child_caring.png"
                alt="Founder with family"
                width={600}
                height={800}
                className="object-cover w-full h-[600px]"
              />
            </motion.div>
            <div className="absolute -bottom-10 -left-10 w-full h-full bg-[#E5F1EC] rounded-[40px] -z-10 transform rotate-3" />
            <div className="absolute top-10 -right-10 w-full h-full bg-[#FEF7E6] rounded-[40px] -z-10 transform -rotate-2" />
          </div>
        </div>
      </div>

      {/* Stats Section with Parallax Background */}
      <div className="relative py-24 bg-[#E08E79] overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-grid-lg" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <StatItem key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="py-32 px-6 bg-[#FDFBF7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 font-display">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide every decision we make and every caregiver we welcome into our network.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <ValueCard key={i} value={value} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-32 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-[#E5F1EC] px-4 py-2 rounded-full mb-6">
              <Users className="w-4 h-4 text-[#1F6F5B]" />
              <span className="text-sm font-bold text-[#1F6F5B]">The Team</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 font-display">
              Meet the visionaries
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group text-center"
              >
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-1 font-display">
                  {member.name}
                </h3>
                <p className="text-[#E08E79] font-bold text-sm mb-2 uppercase tracking-wide">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission / Quote */}
      <div className="py-24 px-6 bg-[#E5F1EC] overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Quote className="w-16 h-16 text-[#1F6F5B] mx-auto mb-8 opacity-30" />
          <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] leading-tight font-display italic mb-8">
            "We started Keel because we knew there had to be a better way to find care. Today, we're proud to be that better way for thousands of families."
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="text-left">
              <div className="font-bold text-[#0F172A] text-lg">Sarah Johnson</div>
              <div className="text-[#1F6F5B]">Founder & CEO</div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#1F6F5B] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#F1B92B] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
      </div>
    </PublicLayout>
  );
}

