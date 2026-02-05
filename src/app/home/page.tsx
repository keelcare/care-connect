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
} from 'lucide-react';
import ParentLayout from '@/components/layout/ParentLayout';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

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

    return (
        <ParentLayout>
            <div className="space-y-20">
                {/* Hero Section - Warm & Inviting */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    <div className="bg-[#F4F7F5] rounded-[2.5rem] overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                            {/* Left Content */}
                            <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-[#4A6C5B] font-medium text-sm tracking-wide uppercase mb-4"
                                >
                                    Welcome back{user?.profiles?.first_name ? `, ${user.profiles.first_name}` : ''}
                                </motion.p>
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-4xl md:text-5xl lg:text-6xl font-display font-normal text-[#37322D] mb-6 leading-tight tracking-tight"
                                >
                                    Find trusted care
                                    <br />
                                    <span className="text-[#4A6C5B]">for your family</span>
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-[#6B5D52] text-lg leading-relaxed mb-8 max-w-md"
                                >
                                    Connect with verified caregivers who bring expertise, warmth, and dedication to your home.
                                </motion.p>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex flex-col sm:flex-row items-start gap-4"
                                >
                                    <Link
                                        href="/book-service"
                                        className="inline-flex items-center gap-3 bg-[#4A6C5B] hover:bg-[#3D5A4B] text-white px-8 py-4 rounded-full font-medium text-base transition-all shadow-lg hover:shadow-xl group"
                                    >
                                        Book a Service
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        href="/services"
                                        className="inline-flex items-center gap-2 text-[#6B5D52] hover:text-[#37322D] font-medium transition-colors group"
                                    >
                                        Learn more
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Right Image */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="lg:w-[45%] relative min-h-[300px] lg:min-h-[500px]"
                            >
                                <div className="absolute inset-0 lg:inset-4 lg:rounded-[2rem] overflow-hidden">
                                    <Image
                                        src="/image1.png"
                                        alt="Family care"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>

                {/* Quick Actions - Clean & Elegant */}
                <section>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-between mb-10"
                    >
                        <h2 className="text-3xl md:text-4xl font-display font-normal text-[#37322D] tracking-tight">
                            Quick Actions
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
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
                        ].map((action, index) => (
                            <motion.div
                                key={action.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link href={action.href} className="block group h-full">
                                    <div className={`${action.lightBg} rounded-[1.75rem] p-8 h-full border border-transparent hover:border-[#E4DDD3] hover:shadow-lg transition-all duration-300`}>
                                        <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-6`}>
                                            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                        <h3 className={`text-xl font-medium ${action.textColor} mb-2`}>
                                            {action.title}
                                        </h3>
                                        <p className="text-[#6B5D52] text-sm leading-relaxed">
                                            {action.description}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Our Services - Premium Cards */}
                <section>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-between mb-10"
                    >
                        <h2 className="text-3xl md:text-4xl font-display font-normal text-[#37322D] tracking-tight">
                            Our Services
                        </h2>
                        <Link
                            href="/services"
                            className="text-[#4A6C5B] hover:text-[#3D5A4B] font-medium text-sm flex items-center gap-1 transition-colors group"
                        >
                            View all
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={service.name}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group"
                                >
                                    <div className="bg-white rounded-[1.75rem] overflow-hidden border border-[#E4DDD3] hover:border-[#D9D1C6] hover:shadow-xl transition-all duration-300">
                                        <div className="relative h-52 overflow-hidden">
                                            <Image
                                                src={service.image}
                                                alt={service.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                        </div>
                                        <div className="p-6">
                                            <div className={`w-11 h-11 ${service.color} rounded-xl flex items-center justify-center mb-4 -mt-12 relative z-10 shadow-lg`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-xl font-medium text-[#37322D] mb-2">
                                                {service.name}
                                            </h3>
                                            <p className="text-[#6B5D52] text-sm leading-relaxed">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Stats Section - Clean & Minimal */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-[2rem] p-10 md:p-14 border border-[#E4DDD3]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="w-14 h-14 bg-[#F4F7F5] rounded-full flex items-center justify-center mx-auto mb-5">
                                        <Icon className="w-6 h-6 text-[#4A6C5B]" />
                                    </div>
                                    <h3 className="text-4xl font-display font-normal text-[#37322D] mb-2 tracking-tight">
                                        {stat.value}
                                    </h3>
                                    <p className="text-[#6B5D52] text-sm">{stat.label}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.section>

                {/* CTA Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-[#4A6C5B] rounded-[2rem] p-10 md:p-14 text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-display font-normal text-white mb-4 tracking-tight">
                        Ready to find the perfect caregiver?
                    </h2>
                    <p className="text-[#C4D5CA] text-lg mb-8 max-w-xl mx-auto">
                        Browse our verified professionals and book your first service today.
                    </p>
                    <Link
                        href="/book-service"
                        className="inline-flex items-center gap-3 bg-white hover:bg-[#F7F4F0] text-[#4A6C5B] px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-xl group"
                    >
                        Get Started
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.section>
            </div>
        </ParentLayout>
    );
}
