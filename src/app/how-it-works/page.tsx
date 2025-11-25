"use client";

import React from 'react';
import Link from 'next/link';
import { Search, UserCheck, Calendar, MessageSquare, Shield, Star, ArrowRight, Sun, Heart, Book, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section - Matching Landing Page Aesthetic */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-white bg-gradient-to-br from-indigo-50 via-white to-teal-50 px-6 pt-32 pb-20">
                {/* Floating Icon Cloud */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Sun - Top Left */}
                    <div className="absolute top-[15%] left-[10%] animate-bounce-slow" style={{ animationDelay: '0s' }}>
                        <div className="bg-white p-4 rounded-full shadow-lg animate-shimmer" style={{ animationDelay: '0.5s' }}>
                            <Sun className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                        </div>
                    </div>

                    {/* Heart - Top Right */}
                    <div className="absolute top-[20%] right-[15%] animate-bounce-slow" style={{ animationDelay: '1s' }}>
                        <div className="bg-white p-4 rounded-full shadow-lg animate-shimmer" style={{ animationDelay: '1.5s' }}>
                            <Heart className="w-8 h-8 text-secondary fill-secondary" />
                        </div>
                    </div>

                    {/* Shield - Bottom Left */}
                    <div className="absolute bottom-[20%] left-[15%] animate-bounce-slow" style={{ animationDelay: '2s' }}>
                        <div className="bg-white p-4 rounded-full shadow-lg animate-shimmer" style={{ animationDelay: '2.5s' }}>
                            <Shield className="w-8 h-8 text-primary fill-primary/20" />
                        </div>
                    </div>

                    {/* Star - Bottom Right */}
                    <div className="absolute bottom-[25%] right-[10%] animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                        <div className="bg-white p-4 rounded-full shadow-lg animate-shimmer" style={{ animationDelay: '1s' }}>
                            <Star className="w-8 h-8 text-orange-400 fill-orange-400" />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 shadow-sm mb-4 animate-fade-in">
                        <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                        <span className="text-sm font-medium text-neutral-600">Simple & Secure</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.1] animate-fade-in">
                        How CareConnect <br />
                        <span className="text-primary">Works</span>
                    </h1>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        Finding trusted care shouldn't be complicated. We've streamlined the process to help you connect with the perfect match in minutes.
                    </p>
                </div>
            </section>

            {/* For Parents Section - Vertical Timeline */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 font-display">For Parents</h2>
                        <p className="text-lg text-neutral-600">Find the perfect caregiver in 3 simple steps</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 hidden md:block -translate-x-1/2 rounded-full"></div>

                        <div className="space-y-24">
                            {/* Step 1 */}
                            <div className="grid md:grid-cols-2 gap-12 items-center relative">
                                <div className="order-2 md:order-1 md:text-right md:pr-16">
                                    <div className="inline-flex md:hidden items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-xl shadow-lg mb-4">1</div>
                                    <h3 className="text-3xl font-bold text-neutral-900 mb-4">Create Your Profile</h3>
                                    <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                                        Tell us about your family and needs. Whether you need a nanny, senior care, or pet sitter, we'll help you find the right match.
                                    </p>
                                    <ul className="space-y-3 text-neutral-600 inline-block text-left">
                                        <li className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <UserCheck size={14} className="text-primary" />
                                            </div>
                                            Quick 2-minute setup
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Star size={14} className="text-primary" />
                                            </div>
                                            Set your preferences
                                        </li>
                                    </ul>
                                </div>
                                
                                {/* Center Node (Desktop) */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-primary shadow-xl z-10">
                                    <span className="text-2xl font-bold text-primary">1</span>
                                </div>

                                <div className="order-1 md:order-2 md:pl-16">
                                    <div className="aspect-square rounded-[2.5rem] bg-gradient-to-br from-white to-indigo-50 border border-indigo-100 shadow-soft p-8 flex items-center justify-center relative group hover:scale-[1.02] transition-transform duration-500">
                                        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] rounded-[2.5rem]"></div>
                                        <UserCheck size={120} className="text-indigo-200 relative z-10 group-hover:text-indigo-300 transition-colors duration-500" />

                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="grid md:grid-cols-2 gap-12 items-center relative">
                                <div className="md:pr-16">
                                    <div className="aspect-square rounded-[2.5rem] bg-gradient-to-br from-white to-teal-50 border border-teal-100 shadow-soft p-8 flex items-center justify-center relative group hover:scale-[1.02] transition-transform duration-500">
                                        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] rounded-[2.5rem]"></div>
                                        <Search size={120} className="text-teal-200 relative z-10 group-hover:text-teal-300 transition-colors duration-500" />

                                    </div>
                                </div>

                                {/* Center Node (Desktop) */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-secondary shadow-xl z-10">
                                    <span className="text-2xl font-bold text-secondary">2</span>
                                </div>

                                <div className="md:pl-16">
                                    <div className="inline-flex md:hidden items-center justify-center w-12 h-12 rounded-full bg-secondary text-white font-bold text-xl shadow-lg mb-4">2</div>
                                    <h3 className="text-3xl font-bold text-neutral-900 mb-4">Browse & Connect</h3>
                                    <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                                        Search through verified profiles in your area. Read reviews, check availability, and chat with candidates directly.
                                    </p>
                                    <ul className="space-y-3 text-neutral-600">
                                        <li className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                                <Shield size={14} className="text-secondary" />
                                            </div>
                                            100% Verified Profiles
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                                <MessageSquare size={14} className="text-secondary" />
                                            </div>
                                            Secure Messaging
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="grid md:grid-cols-2 gap-12 items-center relative">
                                <div className="order-2 md:order-1 md:text-right md:pr-16">
                                    <div className="inline-flex md:hidden items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-xl shadow-lg mb-4">3</div>
                                    <h3 className="text-3xl font-bold text-neutral-900 mb-4">Book & Pay</h3>
                                    <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                                        Schedule your care and pay securely through the app. No cash needed, just simple, transparent payments.
                                    </p>
                                    <ul className="space-y-3 text-neutral-600 inline-block text-left">
                                        <li className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Calendar size={14} className="text-primary" />
                                            </div>
                                            Easy Scheduling
                                        </li>
                                        <li className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Shield size={14} className="text-primary" />
                                            </div>
                                            Secure Payments
                                        </li>
                                    </ul>
                                </div>

                                {/* Center Node (Desktop) */}
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-primary shadow-xl z-10">
                                    <span className="text-2xl font-bold text-primary">3</span>
                                </div>

                                <div className="order-1 md:order-2 md:pl-16">
                                    <div className="aspect-square rounded-[2.5rem] bg-gradient-to-br from-white to-orange-50 border border-orange-100 shadow-soft p-8 flex items-center justify-center relative group hover:scale-[1.02] transition-transform duration-500">
                                        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] rounded-[2.5rem]"></div>
                                        <Calendar size={120} className="text-orange-200 relative z-10 group-hover:text-orange-300 transition-colors duration-500" />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* For Caregivers Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 font-display">For Caregivers</h2>
                        <p className="text-lg text-neutral-600">Build your career on your terms</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: UserCheck,
                                title: "Create Profile",
                                desc: "Showcase your experience, certifications, and skills to stand out.",
                                color: "text-primary",
                                bg: "bg-primary/10"
                            },
                            {
                                icon: Search,
                                title: "Find Jobs",
                                desc: "Browse jobs in your area that match your schedule and preferences.",
                                color: "text-secondary",
                                bg: "bg-secondary/10"
                            },
                            {
                                icon: Star,
                                title: "Get Hired",
                                desc: "Connect with families, get booked, and earn money doing what you love.",
                                color: "text-orange-500",
                                bg: "bg-orange-100"
                            }
                        ].map((item, i) => (
                            <div key={i} className="group p-8 rounded-[2rem] border border-neutral-100 bg-neutral-50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className={item.color} size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-neutral-900 mb-3">{item.title}</h3>
                                <p className="text-neutral-600 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Safety Section */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        
                        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
                                    <Shield size={16} className="text-primary" />
                                    <span className="text-sm font-medium">Safety First</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display text-white">
                                    Your Safety is Our <br />
                                    <span className="text-teal-400">Top Priority</span>
                                </h2>
                                <p className="text-lg text-neutral-200 leading-relaxed mb-8">
                                    We take safety seriously. Every caregiver on CareConnect undergoes a rigorous verification process to ensure peace of mind for your family.
                                </p>
                                <Button className="bg-primary hover:bg-primary-600 text-white rounded-full px-8 h-12">
                                    Learn More About Safety
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { title: "Identity Verification", desc: "Government-issued ID check for all users." },
                                    { title: "Background Checks", desc: "Comprehensive criminal background screening." },
                                    { title: "Secure Payments", desc: "Encrypted transactions and payment protection." }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                            <Shield size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1 text-white">{item.title}</h4>
                                            <p className="text-neutral-200 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 font-display">
                        Ready to find your match?
                    </h2>
                    <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto">
                        Join thousands of families and caregivers who trust CareConnect.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/auth/signup">
                            <Button className="w-full sm:w-auto rounded-full h-14 px-8 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all bg-primary hover:bg-primary-600 text-blue">
                                Get Started Now
                                <ArrowRight size={20} className="ml-2" />
                            </Button>
                        </Link>
                        <Link href="/search">
                            <Button variant="outline" className="w-full sm:w-auto rounded-full h-14 px-8 text-lg border-2 hover:bg-neutral-50">
                                Browse Caregivers
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
