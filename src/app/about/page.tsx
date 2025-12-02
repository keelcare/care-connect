"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Users, Shield, Award, Target, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
    const values = [
        {
            icon: Shield,
            title: "Safety First",
            description: "Every caregiver undergoes thorough background checks and identity verification. Your family's safety is non-negotiable."
        },
        {
            icon: Heart,
            title: "Compassionate Care",
            description: "We connect you with caregivers who genuinely care, bringing warmth and dedication to every interaction."
        },
        {
            icon: Users,
            title: "Community Driven",
            description: "Building meaningful relationships between families and caregivers that go beyond just services."
        },
        {
            icon: Award,
            title: "Excellence",
            description: "Committed to the highest standards in everything we do, continuously improving based on your feedback."
        }
    ];

    const stats = [
        { value: "50k+", label: "Families Served" },
        { value: "15k+", label: "Active Caregivers" },
        { value: "98%", label: "Satisfaction Rate" },
        { value: "4.9", label: "Average Rating" }
    ];

    const team = [
        {
            name: "Sarah Johnson",
            role: "Founder & CEO",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
            bio: "Former pediatric nurse turned entrepreneur"
        },
        {
            name: "Michael Chen",
            role: "Head of Operations",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            bio: "10+ years in family services"
        },
        {
            name: "Emily Rodriguez",
            role: "Head of Trust & Safety",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
            bio: "Background in child welfare advocacy"
        },
        {
            name: "David Park",
            role: "Head of Product",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
            bio: "Building products that matter"
        }
    ];

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 bg-white overflow-hidden">
                {/* Background elements */}
                <div className="absolute top-20 right-0 w-96 h-96 bg-stone-100 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-stone-200/30 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Content */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-full">
                                <span className="flex h-2 w-2 rounded-full bg-stone-600" />
                                <span className="text-sm font-medium text-stone-600">About CareConnect</span>
                            </div>

                            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1]">
                                We believe every family deserves
                                <span className="relative inline-block mx-2">
                                    <span className="relative z-10">trusted</span>
                                    <span className="absolute bottom-1 left-0 w-full h-3 bg-amber-200/60 -rotate-1" />
                                </span>
                                care.
                            </h1>

                            <p className="text-lg text-stone-600 leading-relaxed max-w-lg">
                                Founded by parents who understood the challenge of finding reliable caregivers, 
                                CareConnect is on a mission to make quality care accessible to every family.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link href="/browse">
                                    <Button className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold group">
                                        Find Caregivers
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/auth/signup">
                                    <Button variant="outline" className="h-12 px-6 border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl font-semibold">
                                        Join as Caregiver
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="relative hidden lg:block">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-stone-300/50 aspect-[4/3]">
                                <Image
                                    src="https://images.unsplash.com/photo-1491013516836-7db643ee125a?q=80&w=800&auto=format&fit=crop"
                                    alt="Happy family"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent" />
                            </div>

                            {/* Floating stat card */}
                            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl border border-stone-100">
                                <p className="text-3xl font-bold text-stone-900">50k+</p>
                                <p className="text-sm text-stone-500">Happy families</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-6 bg-stone-900">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-4xl md:text-5xl font-bold text-white">{stat.value}</p>
                                <p className="text-stone-400 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Image */}
                        <div className="relative">
                            <div className="relative rounded-3xl overflow-hidden aspect-square bg-stone-100">
                                <Image
                                    src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=800&auto=format&fit=crop"
                                    alt="Caregiver with child"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full rounded-3xl bg-stone-200" />
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-full">
                                <Target className="w-4 h-4 text-stone-600" />
                                <span className="text-sm font-medium text-stone-600">Our Mission</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
                                Making quality care accessible to every family
                            </h2>

                            <p className="text-lg text-stone-600 leading-relaxed">
                                We started CareConnect because we experienced firsthand how difficult it can be 
                                to find reliable, trustworthy care for our loved ones. We knew there had to be a better way.
                            </p>

                            <p className="text-lg text-stone-600 leading-relaxed">
                                Today, we've built a platform that combines rigorous verification with an intuitive 
                                experience, making it easier than ever to find the perfect caregiver match.
                            </p>

                            <ul className="space-y-3 pt-4">
                                {["Background-verified caregivers", "Transparent reviews and ratings", "Secure messaging and payments", "24/7 customer support"].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-stone-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 px-6 bg-stone-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-3">Our Values</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
                            What guides everything we do
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => {
                            const IconComponent = value.icon;
                            return (
                                <div
                                    key={index}
                                    className="group bg-white rounded-2xl p-6 hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 hover:-translate-y-1 border border-stone-100"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors duration-300">
                                        <IconComponent className="w-7 h-7 text-stone-600 group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-stone-900 mb-2">{value.title}</h3>
                                    <p className="text-stone-500 text-sm leading-relaxed">{value.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-full mb-4">
                            <Sparkles className="w-4 h-4 text-stone-600" />
                            <span className="text-sm font-medium text-stone-600">Our Story</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
                            How CareConnect began
                        </h2>
                    </div>

                    <div className="prose prose-lg prose-stone max-w-none">
                        <div className="bg-stone-50 rounded-2xl p-8 md:p-10 border border-stone-100">
                            <p className="text-stone-600 leading-relaxed mb-6">
                                In 2020, our founders—working parents themselves—found themselves struggling to find 
                                reliable childcare. The process was fragmented, stressful, and often felt like a leap of faith.
                            </p>
                            <p className="text-stone-600 leading-relaxed mb-6">
                                They realized they weren't alone. Millions of families face the same challenge every day: 
                                finding someone they can trust to care for their most precious loved ones.
                            </p>
                            <p className="text-stone-600 leading-relaxed mb-6">
                                CareConnect was born from this experience. We set out to build a platform that would 
                                make finding trusted care as simple and stress-free as possible—one where every caregiver 
                                is verified, every review is genuine, and every family feels confident in their choice.
                            </p>
                            <p className="text-stone-600 leading-relaxed">
                                Today, we've helped over 50,000 families find the care they need. But we're just getting started. 
                                Our vision is a world where every family has access to safe, reliable, affordable care.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 px-6 bg-stone-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-3">Our Team</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
                            Meet the people behind CareConnect
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, index) => (
                            <div key={index} className="group text-center">
                                <div className="relative w-40 h-40 mx-auto mb-4 rounded-2xl overflow-hidden">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-stone-900">{member.name}</h3>
                                <p className="text-sm text-stone-500 font-medium">{member.role}</p>
                                <p className="text-sm text-stone-400 mt-1">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-stone-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to join our community?
                    </h2>
                    <p className="text-lg text-stone-400 mb-8 max-w-2xl mx-auto">
                        Whether you're a family looking for care or a caregiver ready to make a difference, 
                        we'd love to have you.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/auth/signup">
                            <Button className="h-12 px-8 bg-white hover:bg-stone-100 text-stone-900 rounded-xl font-semibold group">
                                Get Started Free
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/browse">
                            <Button variant="outline" className="h-12 px-8 border-stone-600 text-white hover:bg-stone-800 rounded-xl font-semibold">
                                Browse Caregivers
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
