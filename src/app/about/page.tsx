"use client";

import React from 'react';
import Link from 'next/link';
import { Heart, Users, Shield, Award, Target, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
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
                        About <span className="text-primary">CareConnect</span>
                    </h1>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        Connecting families with trusted caregivers to create safe, nurturing environments for children to thrive.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                                <Target className="text-primary" size={20} />
                                <span className="text-primary font-semibold">Our Mission</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
                                Making Quality Childcare Accessible
                            </h2>
                            <p className="text-lg text-neutral-600 leading-relaxed mb-4">
                                We believe every family deserves access to reliable, professional childcare. CareConnect was built to bridge the gap between parents seeking quality care and experienced caregivers looking to make a difference.
                            </p>
                            <p className="text-lg text-neutral-600 leading-relaxed">
                                Our platform combines cutting-edge technology with a human touch, ensuring safe, verified connections that families can trust.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-soft">
                                <Heart size={120} className="text-primary/30" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-6 bg-neutral-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Our Core Values</h2>
                        <p className="text-lg text-neutral-600">The principles that guide everything we do</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-soft hover:shadow-strong transition-shadow">
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="text-primary" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Safety First</h3>
                            <p className="text-neutral-600 leading-relaxed">
                                Every caregiver is thoroughly vetted and verified. We prioritize the safety and well-being of children above all else.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-soft hover:shadow-strong transition-shadow">
                            <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                                <Users className="text-secondary" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900 mb-4">Community</h3>
                            <p className="text-neutral-600 leading-relaxed">
                                We're building a supportive community where families and caregivers can connect, share, and grow together.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-soft hover:shadow-strong transition-shadow">
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                <Award className="text-primary" size={28} />
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
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
                            <Sparkles className="text-secondary" size={20} />
                            <span className="text-secondary font-semibold">Our Story</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                            How CareConnect Began
                        </h2>
                    </div>
                    <div className="space-y-6 text-lg text-neutral-600 leading-relaxed">
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
            <section className="py-20 px-6 bg-gradient-to-br from-primary to-primary/80">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                        Join Our Community
                    </h2>
                    <p className="text-xl text-neutral-900/80 mb-8 max-w-2xl mx-auto">
                        Whether you're a parent seeking care or a caregiver looking to help families, we'd love to have you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/signup">
                            <Button className="rounded-full h-14 px-8 bg-white hover:bg-neutral-50 shadow-lg hover:shadow-xl transition-all font-semibold" style={{ color: '#171717' }}>
                                Get Started
                            </Button>
                        </Link>
                        <Link href="/search">
                            <Button variant="outline" className="rounded-full h-14 px-8 bg-white/10 hover:bg-white/20 border-2 border-white/30 font-semibold" style={{ color: '#171717' }}>
                                Find Caregivers
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
