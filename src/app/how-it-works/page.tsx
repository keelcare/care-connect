"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, UserCheck, Calendar, MessageSquare, Shield, Star, ArrowRight, Check, CreditCard, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HowItWorksPage() {
    const parentSteps = [
        {
            step: "01",
            title: "Create Your Profile",
            description: "Sign up and tell us about your family and care needs. It only takes 2 minutes to get started.",
            icon: UserCheck,
            features: ["Quick & easy signup", "Set your preferences", "Specify your requirements"]
        },
        {
            step: "02",
            title: "Browse & Connect",
            description: "Search through our network of verified caregivers. Filter by location, experience, and availability.",
            icon: Search,
            features: ["Advanced search filters", "Read genuine reviews", "View detailed profiles"]
        },
        {
            step: "03",
            title: "Message & Interview",
            description: "Chat directly with caregivers, ask questions, and schedule interviews to find your perfect match.",
            icon: MessageSquare,
            features: ["Secure in-app messaging", "Video call option", "Share documents safely"]
        },
        {
            step: "04",
            title: "Book & Pay Securely",
            description: "Schedule care sessions and pay securely through the platform. No cash needed, just simple payments.",
            icon: CreditCard,
            features: ["Flexible scheduling", "Secure payments", "Automatic receipts"]
        }
    ];

    const caregiverSteps = [
        {
            icon: UserCheck,
            title: "Build Your Profile",
            description: "Showcase your experience, certifications, and what makes you special. Add photos and references."
        },
        {
            icon: Shield,
            title: "Get Verified",
            description: "Complete our verification process including background checks to earn your trust badge."
        },
        {
            icon: Bell,
            title: "Receive Requests",
            description: "Get notified when families in your area are looking for care that matches your skills."
        },
        {
            icon: Calendar,
            title: "Start Earning",
            description: "Accept bookings, provide great care, and build your reputation through reviews."
        }
    ];

    const safetyFeatures = [
        {
            title: "Identity Verification",
            description: "Every user verifies their identity with government-issued ID."
        },
        {
            title: "Background Checks",
            description: "Comprehensive criminal background screening for all caregivers."
        },
        {
            title: "Reference Checks",
            description: "We verify work history and contact previous employers."
        },
        {
            title: "Secure Payments",
            description: "All transactions are encrypted and protected."
        },
        {
            title: "In-App Communication",
            description: "Keep all conversations on platform for your protection."
        },
        {
            title: "24/7 Support",
            description: "Our team is always available if you need assistance."
        }
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
                        <span className="text-sm font-medium text-stone-600">Simple & Secure Process</span>
                    </div>

                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1] mb-6">
                        Finding trusted care
                        <br />
                        <span className="text-stone-500">shouldn't be complicated.</span>
                    </h1>

                    <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed mb-8">
                        We've streamlined the entire process so you can find, connect, and book 
                        verified caregivers in just a few simple steps.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/auth/signup">
                            <Button className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold group">
                                Get Started Free
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/browse">
                            <Button variant="outline" className="h-12 px-6 border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl font-semibold">
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
                        <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-3">For Families</p>
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
                                            <span className="text-6xl font-bold text-stone-200">{step.step}</span>
                                            <div className="w-14 h-14 rounded-xl bg-emerald-600 flex items-center justify-center">
                                                <IconComponent className="w-7 h-7 text-white" />
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-2xl font-bold text-stone-900">{step.title}</h3>
                                        <p className="text-lg text-stone-600 leading-relaxed">{step.description}</p>
                                        
                                        <ul className="space-y-2 pt-2">
                                            {step.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-2 text-stone-600">
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
                                        <div className="relative bg-white rounded-2xl p-8 shadow-lg shadow-stone-200/50 border border-stone-100">
                                            <div className="aspect-video bg-stone-100 rounded-xl flex items-center justify-center">
                                                <IconComponent className="w-20 h-20 text-stone-300" />
                                            </div>
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
                        <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-3">For Caregivers</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
                            Build your caregiving career
                        </h2>
                        <p className="text-stone-600 mt-4 max-w-2xl mx-auto">
                            Join thousands of caregivers who have found rewarding work through CareConnect.
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
                                    <h3 className="text-xl font-bold text-stone-900 mb-2">{step.title}</h3>
                                    <p className="text-stone-500 text-sm leading-relaxed">{step.description}</p>
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
                                <span className="text-sm font-medium text-white">Safety First</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-white">
                                Your safety is our
                                <br />
                                <span className="text-stone-400">top priority.</span>
                            </h2>

                            <p className="text-lg text-stone-400 leading-relaxed">
                                We've built multiple layers of protection to ensure that every interaction 
                                on CareConnect is safe and secure for families and caregivers alike.
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
                                <div key={index} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                                    <p className="text-sm text-stone-400">{feature.description}</p>
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
                        <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-3">FAQ</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
                            Common questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                question: "How much does CareConnect cost?",
                                answer: "CareConnect is free to join and browse. You only pay when you book care. Our transparent pricing means no hidden fees."
                            },
                            {
                                question: "How are caregivers verified?",
                                answer: "All caregivers undergo identity verification, background checks, and reference verification before they can accept bookings."
                            },
                            {
                                question: "Can I interview caregivers before booking?",
                                answer: "Absolutely! We encourage families to message and video call with caregivers before making any commitments."
                            },
                            {
                                question: "What if I'm not satisfied with my caregiver?",
                                answer: "Your satisfaction is our priority. If you're not happy, contact our support team and we'll help you find a better match."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-stone-50 rounded-xl p-6 border border-stone-100">
                                <h3 className="font-semibold text-stone-900 mb-2">{faq.question}</h3>
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
                                    <Button variant="outline" className="h-12 px-8 border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl font-semibold">
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
