"use client";

import React from 'react';
import Link from 'next/link';
import { Heart, Users, Shield, Award, Target, Sparkles, Sun, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
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
                        <span className="text-sm font-medium text-neutral-600">Trusted by Families</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.1] animate-fade-in">
                        About <span className="text-primary">CareConnect</span>
                    </h1>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        Connecting families with trusted caregivers to create safe, nurturing environments for children to thrive.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                                <Target className="text-primary" size={20} />
                                <span className="text-primary font-semibold">Our Mission</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight font-display">
                                Making Quality Childcare Accessible
                            </h2>
                            <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                                We believe every family deserves access to reliable, professional childcare. CareConnect was built to bridge the gap between parents seeking quality care and experienced caregivers looking to make a difference.
                            </p>
                            <p className="text-lg text-neutral-600 leading-relaxed">
                                Our platform combines cutting-edge technology with a human touch, ensuring safe, verified connections that families can trust.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-soft relative group hover:scale-[1.02] transition-transform duration-500">
                                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] rounded-[2.5rem]"></div>
                                <Heart size={120} className="text-primary/30 relative z-10 group-hover:text-primary/40 transition-colors duration-1000" />
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 font-display">Our Core Values</h2>
                        <p className="text-lg text-neutral-600">The principles that guide everything we do</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-soft hover:shadow-strong hover:-translate-y-1 transition-all duration-300">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Shield className="text-primary" size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Safety First</h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Every caregiver is thoroughly vetted and verified. We prioritize the safety and well-being of children above all else.
                            </p>
                        </div>
                        <div className="group bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-soft hover:shadow-strong hover:-translate-y-1 transition-all duration-300">
                            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Users className="text-secondary" size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Community</h3>
                            <p className="text-neutral-600 leading-relaxed">
                                We're building a supportive community where families and caregivers can connect, share, and grow together.
                            </p>
                        </div>
                        <div className="group bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-soft hover:shadow-strong hover:-translate-y-1 transition-all duration-300">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Award className="text-primary" size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Excellence</h3>
                            <p className="text-neutral-600 leading-relaxed">
                                We're committed to providing the highest quality service, continuously improving our platform based on user feedback.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
                            <Sparkles className="text-secondary" size={20} />
                            <span className="text-secondary font-semibold">Our Story</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 font-display">
                            How CareConnect Began
                        </h2>
                    </div>
                    <div className="space-y-6 text-lg text-neutral-600 leading-relaxed bg-white p-10 rounded-[2.5rem] shadow-sm border border-neutral-100">
                        <p>
                            CareConnect was founded by parents who experienced firsthand the challenges of finding reliable, trustworthy childcare. We understood the anxiety of leaving your children with someone new, and the difficulty of finding caregivers who truly care.
                        </p>
                        <p>
                            What started as a simple idea—connecting families with local caregivers—has grown into a comprehensive platform that serves thousands of families. We've built features like real-time matching, verified profiles, and secure messaging to make the process as smooth and safe as possible.
                        </p>
                        <p>
                            Today, CareConnect continues to evolve, driven by feedback from our community of parents and caregivers. We're not just a platform; we're a partner in your childcare journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 font-display">
                        Join Our Community
                    </h2>
                    <p className="text-xl text-neutral-600 mb-10 max-w-2xl mx-auto">
                        Whether you're a parent seeking care or a caregiver looking to help families, we'd love to have you.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/auth/signup">
                            <Button className="w-full sm:w-auto rounded-full h-14 px-8 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all bg-primary hover:bg-primary-600 text-black">
                                Get Started
                                <ArrowRight size={20} className="ml-2" />
                            </Button>
                        </Link>
                        <Link href="/search">
                            <Button variant="outline" className="w-full sm:w-auto rounded-full h-14 px-8 text-lg border-2 hover:bg-neutral-50">
                                Find Caregivers
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
