'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  UserCheck,
  Calendar,
  MessageSquare,
  Shield,
  Star,
  ArrowRight,
  Check,
  CreditCard,
  Bell,
  Heart,
  MapPin,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/Checkbox';

// Step 1 Animation: Profile Creation - Using Input, Avatar, Badge, Checkbox
const ProfileCreationAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <style jsx>{`
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes pulse-ring {
        0% {
          transform: scale(0.95);
          opacity: 0.5;
        }
        50% {
          transform: scale(1.05);
          opacity: 0.3;
        }
        100% {
          transform: scale(0.95);
          opacity: 0.5;
        }
      }
      @keyframes check-appear {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.2);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      @keyframes typeText {
        0% {
          width: 0;
        }
        100% {
          width: 100%;
        }
      }
      .profile-card {
        animation: fadeInUp 0.6s ease-out forwards;
      }
      .field-1 {
        animation: fadeInUp 0.5s ease-out 0.3s forwards;
        opacity: 0;
      }
      .field-2 {
        animation: fadeInUp 0.5s ease-out 0.5s forwards;
        opacity: 0;
      }
      .field-3 {
        animation: fadeInUp 0.5s ease-out 0.7s forwards;
        opacity: 0;
      }
      .field-4 {
        animation: fadeInUp 0.5s ease-out 0.9s forwards;
        opacity: 0;
      }
      .avatar-ring {
        animation: pulse-ring 2s ease-in-out infinite;
      }
      .check-badge {
        animation: check-appear 0.4s ease-out 1.2s forwards;
        opacity: 0;
      }
      .typing-text {
        animation: typeText 1s ease-out 0.5s forwards;
        overflow: hidden;
        white-space: nowrap;
        width: 0;
      }
    `}</style>

    <div className="profile-card bg-white rounded-2xl shadow-xl p-5 w-72 border border-stone-100">
      {/* Avatar Section */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-stone-100">
        <div className="relative">
          <div className="avatar-ring absolute inset-0 rounded-full bg-emerald-200 scale-110"></div>
          <Avatar size="lg" fallback="JD" ringColor="bg-emerald-200" />
          <div className="check-badge absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
            <Check className="w-3 h-3 text-white" />
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-stone-800">Jane Doe</div>
          <div className="text-xs text-stone-500">Parent Account</div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-3">
        <div className="field-1">
          <Input
            placeholder="Enter your name"
            value="Jane Doe"
            className="h-9 text-sm bg-stone-50 border-stone-200 rounded-lg"
            readOnly
          />
        </div>
        <div className="field-2">
          <Input
            placeholder="Your location"
            value="Mumbai, India"
            className="h-9 text-sm bg-stone-50 border-stone-200 rounded-lg"
            leftIcon={<MapPin size={14} />}
            readOnly
          />
        </div>
        <div className="field-3 flex gap-2 flex-wrap">
          <Badge variant="success" className="text-xs px-2 py-0.5">
            Childcare
          </Badge>
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            Elderly Care
          </Badge>
          <Badge className="text-xs px-2 py-0.5">Pet Care</Badge>
        </div>
        <div className="field-4 pt-1">
          <Checkbox
            label={
              <span className="text-xs text-stone-600">
                I agree to the Terms of Service
              </span>
            }
            checked
            readOnly
          />
        </div>
      </div>
    </div>
  </div>
);

// Step 2 Animation: Browse & Search - Using SearchInput, Card, Avatar, Badge
const BrowseSearchAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
    <style jsx>{`
      @keyframes slideIn {
        0% {
          opacity: 0;
          transform: translateX(-30px);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes cardFloat {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-6px);
        }
      }
      @keyframes searchPulse {
        0%,
        100% {
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
        }
        50% {
          box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
        }
      }
      @keyframes heartBeat {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.2);
        }
      }
      .search-bar {
        animation: slideIn 0.5s ease-out forwards;
      }
      .card-1 {
        animation:
          slideIn 0.5s ease-out 0.3s forwards,
          cardFloat 3s ease-in-out 1s infinite;
        opacity: 0;
      }
      .card-2 {
        animation:
          slideIn 0.5s ease-out 0.5s forwards,
          cardFloat 3s ease-in-out 1.5s infinite;
        opacity: 0;
      }
      .card-3 {
        animation:
          slideIn 0.5s ease-out 0.7s forwards,
          cardFloat 3s ease-in-out 2s infinite;
        opacity: 0;
      }
      .search-icon {
        animation: searchPulse 2s ease-in-out infinite;
      }
      .heart-icon {
        animation: heartBeat 1s ease-in-out infinite;
      }
    `}</style>

    <div className="w-72">
      {/* Search Bar using Input component */}
      <div className="search-bar mb-4">
        <Input
          placeholder="Search caregivers..."
          value="Childcare in Mumbai"
          className="h-11 bg-white shadow-lg border-stone-100 rounded-xl text-sm"
          leftIcon={
            <div className="search-icon">
              <Search size={18} className="text-emerald-500" />
            </div>
          }
          readOnly
        />
      </div>

      {/* Mini Profile Cards */}
      <div className="space-y-2">
        {[
          {
            initials: 'PM',
            name: 'Priya M.',
            rate: '₹250/hr',
            rating: '4.9',
            color: 'bg-gradient-to-br from-violet-400 to-purple-500',
            fav: true,
          },
          {
            initials: 'RK',
            name: 'Rahul K.',
            rate: '₹200/hr',
            rating: '4.8',
            color: 'bg-gradient-to-br from-orange-400 to-rose-500',
            fav: false,
          },
          {
            initials: 'AS',
            name: 'Anita S.',
            rate: '₹300/hr',
            rating: '5.0',
            color: 'bg-gradient-to-br from-cyan-400 to-blue-500',
            fav: false,
          },
        ].map((caregiver, i) => (
          <Card
            key={i}
            className={`card-${i + 1} p-0 border-stone-100 shadow-md hover:shadow-lg transition-shadow`}
          >
            <CardContent className="p-3 flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${caregiver.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}
              >
                {caregiver.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-stone-800 truncate">
                  {caregiver.name}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-stone-500">
                      {caregiver.rating}
                    </span>
                  </div>
                  <Badge variant="verified" className="text-[10px] px-1.5 py-0">
                    {caregiver.rate}
                  </Badge>
                </div>
              </div>
              <Heart
                className={`w-5 h-5 shrink-0 ${caregiver.fav ? 'heart-icon text-rose-500 fill-rose-500' : 'text-stone-300'}`}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// Step 3 Animation: Messaging - Using Avatar, Card, Button
const MessagingAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <style jsx>{`
      @keyframes messageFadeIn {
        0% {
          opacity: 0;
          transform: translateY(10px) scale(0.95);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      @keyframes typing {
        0%,
        60%,
        100% {
          opacity: 0.3;
        }
        30% {
          opacity: 1;
        }
      }
      @keyframes onlinePulse {
        0%,
        100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.5;
          transform: scale(1.1);
        }
      }
      .msg-1 {
        animation: messageFadeIn 0.4s ease-out forwards;
      }
      .msg-2 {
        animation: messageFadeIn 0.4s ease-out 0.6s forwards;
        opacity: 0;
      }
      .msg-3 {
        animation: messageFadeIn 0.4s ease-out 1.2s forwards;
        opacity: 0;
      }
      .msg-4 {
        animation: messageFadeIn 0.4s ease-out 1.8s forwards;
        opacity: 0;
      }
      .typing-dot {
        animation: typing 1.4s ease-in-out infinite;
      }
      .typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }
      .typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }
      .online-dot {
        animation: onlinePulse 2s ease-in-out infinite;
      }
    `}</style>

    <Card className="w-72 p-0 overflow-hidden border-stone-100 shadow-xl">
      {/* Chat Header */}
      <div className="bg-stone-50 px-4 py-3 flex items-center justify-between border-b border-stone-100">
        <div className="flex items-center gap-3">
          <Avatar size="sm" fallback="SP" ringColor="bg-emerald-200" />
          <div>
            <div className="text-sm font-semibold text-stone-800">
              Sneha Patel
            </div>
            <div className="flex items-center gap-1">
              <span className="online-dot w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs text-stone-500">Online</span>
            </div>
          </div>
        </div>
        <Badge variant="verified" className="text-[10px]">
          Verified
        </Badge>
      </div>

      {/* Messages */}
      <CardContent className="p-3 space-y-2 h-52 bg-white">
        <div className="msg-1 flex justify-end">
          <div className="bg-emerald-500 text-white text-xs px-3 py-2 rounded-2xl rounded-tr-sm max-w-[85%]">
            Hi! Are you available this Saturday?
          </div>
        </div>
        <div className="msg-2 flex justify-start">
          <div className="bg-stone-100 text-stone-800 text-xs px-3 py-2 rounded-2xl rounded-tl-sm max-w-[85%]">
            Yes, I&apos;m free from 9 AM! 😊
          </div>
        </div>
        <div className="msg-3 flex justify-end">
          <div className="bg-emerald-500 text-white text-xs px-3 py-2 rounded-2xl rounded-tr-sm max-w-[85%]">
            Great! Can you come to Andheri West?
          </div>
        </div>
        <div className="msg-4 flex justify-start">
          <div className="bg-stone-100 text-stone-800 text-xs px-3 py-2 rounded-2xl rounded-tl-sm flex items-center gap-1">
            <span className="typing-dot w-1.5 h-1.5 bg-stone-400 rounded-full"></span>
            <span className="typing-dot w-1.5 h-1.5 bg-stone-400 rounded-full"></span>
            <span className="typing-dot w-1.5 h-1.5 bg-stone-400 rounded-full"></span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Step 4 Animation: Book & Pay - Using Card, Button, Badge
const BookPayAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <style jsx>{`
      @keyframes calendarFadeIn {
        0% {
          opacity: 0;
          transform: scale(0.9);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      @keyframes selectDate {
        0%,
        100% {
          background-color: #10b981;
        }
        50% {
          background-color: #059669;
          transform: scale(1.1);
        }
      }
      @keyframes confirmSlide {
        0% {
          opacity: 0;
          transform: translateY(20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes checkmarkDraw {
        0% {
          stroke-dashoffset: 24;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
      .calendar {
        animation: calendarFadeIn 0.5s ease-out forwards;
      }
      .date-selected {
        animation: selectDate 2s ease-in-out infinite;
      }
      .confirm-card {
        animation: confirmSlide 0.5s ease-out 0.8s forwards;
        opacity: 0;
      }
      .checkmark-circle {
        animation: calendarFadeIn 0.3s ease-out 1.3s forwards;
        opacity: 0;
      }
      .checkmark path {
        stroke-dasharray: 24;
        animation: checkmarkDraw 0.4s ease-out 1.5s forwards;
        stroke-dashoffset: 24;
      }
      .pay-btn {
        animation: confirmSlide 0.5s ease-out 1.8s forwards;
        opacity: 0;
      }
      .shimmer-btn {
        background: linear-gradient(
          90deg,
          #10b981 0%,
          #34d399 50%,
          #10b981 100%
        );
        background-size: 200% 100%;
        animation: shimmer 2s ease-in-out infinite;
      }
    `}</style>

    <div className="w-72">
      {/* Mini Calendar */}
      <Card className="calendar p-0 border-stone-100 shadow-xl mb-3">
        <div className="px-4 py-3 flex items-center justify-between border-b border-stone-100">
          <span className="font-semibold text-stone-800 text-sm">
            December 2024
          </span>
          <Calendar className="w-4 h-4 text-emerald-500" />
        </div>
        <CardContent className="p-3">
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="text-stone-400 py-1 font-medium">
                {d}
              </div>
            ))}
            {[...Array(31)].map((_, i) => (
              <div
                key={i}
                className={`py-1 rounded-md transition-all ${
                  i === 14
                    ? 'date-selected bg-emerald-500 text-white font-bold shadow-md'
                    : i === 13 || i === 15
                      ? 'bg-emerald-100 text-emerald-700 font-medium'
                      : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Card */}
      <Card className="confirm-card p-0 border-stone-100 shadow-lg">
        <CardContent className="p-3 flex items-center gap-3">
          <div className="checkmark-circle w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <svg className="checkmark w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-stone-800">
              Booking Confirmed!
            </div>
            <div className="flex items-center gap-1 text-xs text-stone-500">
              <Clock size={10} />
              <span>Dec 15, 9:00 AM - 1:00 PM</span>
            </div>
          </div>
          <Badge variant="success" className="text-[10px] shrink-0">
            Paid
          </Badge>
        </CardContent>
      </Card>

      {/* Pay Button */}
      <div className="pay-btn mt-3">
        <Button className="w-full h-10 shimmer-btn text-white rounded-xl text-sm font-semibold gap-2 shadow-lg">
          <CreditCard size={16} />
          Pay ₹1,000
        </Button>
      </div>
    </div>
  </div>
);

// Animation components array
const stepAnimations = [
  ProfileCreationAnimation,
  BrowseSearchAnimation,
  MessagingAnimation,
  BookPayAnimation,
];

export default function HowItWorksPage() {
  const parentSteps = [
    {
      step: '01',
      title: 'Create Your Profile',
      description:
        'Sign up and tell us about your family and care needs. It only takes 2 minutes to get started.',
      icon: UserCheck,
      features: [
        'Quick & easy signup',
        'Set your preferences',
        'Specify your requirements',
      ],
    },
    {
      step: '02',
      title: 'Browse & Connect',
      description:
        'Search through our network of verified caregivers. Filter by location, experience, and availability.',
      icon: Search,
      features: [
        'Advanced search filters',
        'Read genuine reviews',
        'View detailed profiles',
      ],
    },
    {
      step: '03',
      title: 'Message & Interview',
      description:
        'Chat directly with caregivers, ask questions, and discuss requirements to find your perfect match.',
      icon: MessageSquare,
      features: [
        'Secure in-app messaging',
        'Ask questions directly',
        'Share documents safely',
      ],
    },
    {
      step: '04',
      title: 'Book & Pay Securely',
      description:
        'Schedule care sessions and pay securely through the platform. No cash needed, just simple payments.',
      icon: CreditCard,
      features: [
        'Flexible scheduling',
        'Secure payments',
        'Automatic receipts',
      ],
    },
  ];

  const caregiverSteps = [
    {
      icon: UserCheck,
      title: 'Build Your Profile',
      description:
        'Showcase your experience, certifications, and what makes you special. Add photos and references.',
    },
    {
      icon: Shield,
      title: 'Get Verified',
      description:
        'Complete our verification process including background checks to earn your trust badge.',
    },
    {
      icon: Bell,
      title: 'Receive Requests',
      description:
        'Get notified when families in your area are looking for care that matches your skills.',
    },
    {
      icon: Calendar,
      title: 'Start Earning',
      description:
        'Accept bookings, provide great care, and build your reputation through reviews.',
    },
  ];

  const safetyFeatures = [
    {
      title: 'Identity Verification',
      description:
        'Every user verifies their identity with government-issued ID.',
    },
    {
      title: 'Background Checks',
      description:
        'Comprehensive criminal background screening for all caregivers.',
    },
    {
      title: 'Reference Checks',
      description: 'We verify work history and contact previous employers.',
    },
    {
      title: 'Secure Payments',
      description: 'All transactions are encrypted and protected.',
    },
    {
      title: 'In-App Communication',
      description: 'Keep all conversations on platform for your protection.',
    },
    {
      title: '24/7 Support',
      description: 'Our team is always available if you need assistance.',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-white overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-40 left-0 w-72 h-72 bg-stone-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-stone-200/30 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-full mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-stone-600">
              Simple & Secure Process
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1] mb-6">
            Finding trusted care
            <br />
            <span className="text-stone-500">shouldn't be complicated.</span>
          </h1>

          <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed mb-8">
            We've streamlined the entire process so you can find, connect, and
            book verified caregivers in just a few simple steps.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold group">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button
                variant="outline"
                className="h-12 px-6 border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl font-semibold"
              >
                Browse Caregivers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Parents Section */}
      <section className="py-24 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-3">
              For Families
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              Find your perfect caregiver in 4 steps
            </h2>
          </div>

          <div className="space-y-8">
            {parentSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isEven = index % 2 === 1;

              return (
                <div
                  key={index}
                  className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}
                >
                  {/* Content */}
                  <div className={`space-y-4 ${isEven ? 'lg:order-2' : ''}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-6xl font-bold text-stone-200">
                        {step.step}
                      </span>
                      <div className="w-14 h-14 rounded-xl bg-emerald-600 flex items-center justify-center">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-stone-900">
                      {step.title}
                    </h3>
                    <p className="text-lg text-stone-600 leading-relaxed">
                      {step.description}
                    </p>

                    <ul className="space-y-2 pt-2">
                      {step.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-stone-600"
                        >
                          <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-stone-600" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className={`${isEven ? 'lg:order-1' : ''}`}>
                    <div className="relative bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-8 shadow-lg shadow-stone-200/50 border border-stone-100 min-h-[280px]">
                      {React.createElement(stepAnimations[index])}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* For Caregivers Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-3">
              For Caregivers
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              Build your caregiving career
            </h2>
            <p className="text-stone-600 mt-4 max-w-2xl mx-auto">
              Join thousands of caregivers who have found rewarding work through
              CareConnect.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {caregiverSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-stone-50 rounded-2xl p-6 hover:bg-white hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-stone-100"
                >
                  {/* Step number */}
                  <span className="absolute top-4 right-4 text-4xl font-bold text-stone-200 group-hover:text-stone-100 transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="w-14 h-14 rounded-xl bg-stone-200 flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors duration-300">
                    <IconComponent className="w-7 h-7 text-stone-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/auth/signup?role=caregiver">
              <Button className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold group">
                Apply as Caregiver
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="py-24 px-6 bg-stone-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  Safety First
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Your safety is our
                <br />
                <span className="text-stone-400">top priority.</span>
              </h2>

              <p className="text-lg text-stone-400 leading-relaxed">
                We've built multiple layers of protection to ensure that every
                interaction on CareConnect is safe and secure for families and
                caregivers alike.
              </p>

              <Link href="/about">
                <Button className="h-12 px-6 bg-white hover:bg-stone-100 text-stone-900 rounded-xl font-semibold group">
                  Learn More About Safety
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Safety Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {safetyFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-stone-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-3">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              Common questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'How much does CareConnect cost?',
                answer:
                  'CareConnect is free to join and browse. You only pay when you book care. Our transparent pricing means no hidden fees.',
              },
              {
                question: 'How are caregivers verified?',
                answer:
                  'All caregivers undergo identity verification, background checks, and reference verification before they can accept bookings.',
              },
              {
                question: 'Can I interview caregivers before booking?',
                answer:
                  'Absolutely! We encourage families to message caregivers and ask questions before making any commitments.',
              },
              {
                question: "What if I'm not satisfied with my caregiver?",
                answer:
                  "Your satisfaction is our priority. If you're not happy, contact our support team and we'll help you find a better match.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-stone-50 rounded-xl p-6 border border-stone-100"
              >
                <h3 className="font-semibold text-stone-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-stone-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-white rounded-3xl p-10 md:p-16 shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-stone-100 rounded-full blur-3xl opacity-50" />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
                Ready to get started?
              </h2>
              <p className="text-lg text-stone-600 mb-8">
                Join thousands of families and caregivers who trust CareConnect.
                It's free to sign up and takes less than 2 minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth/signup">
                  <Button className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold group">
                    Create Free Account
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button
                    variant="outline"
                    className="h-12 px-8 border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl font-semibold"
                  >
                    Browse Caregivers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
