"use client";

import React from 'react';
import Link from 'next/link';
import { Search, UserCheck, Calendar, MessageSquare, Shield, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden px-6 pt-32 pb-20">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-purple-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.1] animate-fade-in">
                        How It <span className="text-primary">Works</span>
                    </h1>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        Finding trusted childcare has never been easier. Here's how CareConnect helps you every step of the way.
                    </p>
                </div>
            </section>

            {/* For Parents Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">For Parents</h2>
                        <p className="text-lg text-neutral-600">Simple steps to find the perfect caregiver</p>
                    </div>

                    <div className="space-y-20">
                        {/* Step 1 */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-soft">
                                        1
                                    </div>
                                    <h3 className="text-3xl font-bold text-neutral-900">Create Your Profile</h3>
                                </div>
                                <p className="text-lg text-neutral-600 leading-relaxed mb-4">
                                    Sign up and tell us about your family, your children's ages, and your childcare needs. The more we know, the better we can match you.
                                </p>
                                <ul className="space-y-2 text-neutral-600">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                        Quick 5-minute setup
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                        Specify your requirements
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                        Set your location preferences
                                    </li>
                                </ul>
                            </div>
                            <div className="order-1 md:order-2">
                                <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-soft">
                                    <UserCheck size={120} className="text-primary/30" />
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center shadow-soft">
                                    <Search size={120} className="text-secondary/30" />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-soft">
                                        2
                                    </div>
                                    <h3 className="text-3xl font-bold text-neutral-900">Search & Browse</h3>
                                </div>
                                <p className="text-lg text-neutral-600 leading-relaxed mb-4">
                                    Browse verified caregivers in your area or let our smart matching system find the perfect fit for your family.
                                </p>
                                <ul className="space-y-2 text-neutral-600">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                                        Filter by experience, rates, and availability
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                                        View detailed profiles and reviews
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                                        See caregivers near you on a map
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-soft">
                                        3
                                    </div>
                                    <h3 className="text-3xl font-bold text-neutral-900">Connect & Book</h3>
                                </div>
                                <p className="text-lg text-neutral-600 leading-relaxed mb-4">
                                    Message caregivers directly, schedule interviews, and book services when you find the right match.
                                </p>
                                <ul className="space-y-2 text-neutral-600">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                        Secure in-app messaging
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                        Easy booking and scheduling
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                        Transparent pricing
                                    </li>
                                </ul>
                            </div>
                            <div className="order-1 md:order-2">
                                <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-soft">
                                    <Calendar size={120} className="text-primary/30" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* For Caregivers Section */}
            <section className="py-20 px-6 bg-neutral-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">For Caregivers</h2>
                        <p className="text-lg text-neutral-600">Build your career helping families</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-soft hover:shadow-strong transition-shadow">
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                <UserCheck className="text-primary" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900 mb-4">1. Get Verified</h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Create your profile, complete our verification process, and showcase your experience and qualifications.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-soft hover:shadow-strong transition-shadow">
                            <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                                <MessageSquare className="text-secondary" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900 mb-4">2. Get Matched</h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Receive booking requests from families in your area. Review details and accept jobs that fit your schedule.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-soft hover:shadow-strong transition-shadow">
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                <Star className="text-primary" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900 mb-4">3. Build Reputation</h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Provide excellent care, earn great reviews, and grow your client base through our platform.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Safety Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-[2rem] p-12 shadow-soft">
                        <div className="max-w-3xl mx-auto text-center">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Shield className="text-primary" size={32} />
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                                Safety & Trust
                            </h2>
                            <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                                Every caregiver on CareConnect goes through a comprehensive verification process including background checks, reference verification, and identity confirmation. Your family's safety is our top priority.
                            </p>
                            <div className="grid md:grid-cols-3 gap-6 text-left">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-neutral-900 mb-1">Background Checks</h4>
                                        <p className="text-sm text-neutral-600">Comprehensive screening for all caregivers</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-neutral-900 mb-1">Verified Profiles</h4>
                                        <p className="text-sm text-neutral-600">Identity and credential verification</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-neutral-900 mb-1">Secure Platform</h4>
                                        <p className="text-sm text-neutral-600">Encrypted messaging and payments</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-br from-primary to-primary/80">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-neutral-900/80 mb-8 max-w-2xl mx-auto">
                        Join thousands of families and caregivers who trust CareConnect
                    </p>
                    <Link href="/auth/signup">
                        <Button className="rounded-full h-14 px-8 bg-white hover:bg-neutral-50 shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 font-semibold" style={{ color: '#171717' }}>
                            Sign Up Now
                            <ArrowRight size={20} />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
