'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
    Calendar,
    Clock,
    Heart,
    TrendingUp,
    ArrowRight,
    Baby,
    GraduationCap,
    HeartPulse,
    Sparkles,
    ArrowUpRight,
} from 'lucide-react';
import ParentLayout from '@/components/layout/ParentLayout';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function HomePage() {
    const { user } = useAuth();
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, -100]);
    const y2 = useTransform(scrollY, [0, 500], [0, -50]);
    const physicsY1 = useSpring(y1, { stiffness: 100, damping: 20 });
    const physicsY2 = useSpring(y2, { stiffness: 100, damping: 20 });

    const quickActions = [
        {
            title: 'Book a Service',
            description: 'Find the perfect caregiver',
            icon: Calendar,
            href: '/book-service',
            color: 'bg-[#1F6F5B]',
            lightBg: 'bg-[#E5F1EC]',
            textColor: 'text-[#1F6F5B]',
        },
        {
            title: 'My Bookings',
            description: 'View your appointments',
            icon: Clock,
            href: '/bookings',
            color: 'bg-[#F1B92B]',
            lightBg: 'bg-[#FEF7E6]',
            textColor: 'text-[#F1B92B]',
        },
        {
            title: 'Browse Services',
            description: 'Explore all our services',
            icon: Heart,
            href: '/services',
            color: 'bg-[#E08E79]',
            lightBg: 'bg-[#FDF3F1]',
            textColor: 'text-[#E08E79]',
        },
    ];

    const services = [
        {
            name: 'Child Care',
            icon: Baby,
            color: 'bg-[#1F6F5B]',
            description: 'Verified nannies and babysitters',
            image: '/babysitter_playing.png',
        },
        {
            name: 'Shadow Teacher',
            icon: GraduationCap,
            color: 'bg-[#F1B92B]',
            description: 'Educational support specialists',
            image: '/ShadowTeacher.png',
        },
        {
            name: 'Senior Care',
            icon: HeartPulse,
            color: 'bg-[#E08E79]',
            description: 'Compassionate elderly care',
            image: '/mother_child_caring.png',
        },
    ];

    return (
        <ParentLayout>
            <div ref={containerRef} className="space-y-16">
                {/* Welcome Section with Parallax */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    <div className="bg-[#E08E79] rounded-[40px] p-8 md:p-12 relative overflow-hidden min-h-[400px] flex items-center">
                        {/* Decorative blobs with parallax */}
                        <motion.div
                            style={{ y: physicsY1 }}
                            className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20"
                        />
                        <motion.div
                            style={{ y: physicsY2 }}
                            className="absolute bottom-0 left-0 w-96 h-96 bg-[#1F6F5B] rounded-full mix-blend-multiply filter blur-3xl opacity-10"
                        />

                        {/* Floating illustration */}
                        <motion.div
                            style={{ y: physicsY1 }}
                            className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <div className="relative w-64 h-64 rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/30">
                                <Image
                                    src="/image1.png"
                                    alt="Family care"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>

                        <div className="relative z-10 max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-2 mb-4"
                            >
                                <Sparkles className="w-6 h-6 text-white" />
                                <span className="text-white font-semibold text-sm tracking-wide">Welcome back</span>
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl md:text-6xl font-bold text-white mb-4 font-display leading-tight"
                            >
                                Hello, {user?.profiles?.first_name || 'there'}! 👋
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-xl text-white/90 mb-8 font-body leading-relaxed max-w-lg"
                            >
                                Find trusted caregivers and book services for your family's needs.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Link
                                    href="/book-service"
                                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#E08E79] px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl group"
                                >
                                    Book a Service
                                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-8 font-display"
                    >
                        Quick Actions
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action, index) => {
                            const Icon = action.icon;
                            return (
                                <motion.div
                                    key={action.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Link href={action.href} className="block group">
                                        <div className={`${action.lightBg} rounded-[30px] p-8 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-gray-200 h-full`}>
                                            <motion.div
                                                whileHover={{ scale: 1.1, rotate: 5 }}
                                                transition={{ type: 'spring', stiffness: 300 }}
                                                className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                                            >
                                                <Icon className="w-8 h-8 text-white" />
                                            </motion.div>
                                            <h3 className={`text-2xl font-bold ${action.textColor} mb-2 font-display`}>
                                                {action.title}
                                            </h3>
                                            <p className="text-gray-600 font-body mb-4">
                                                {action.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 group-hover:text-gray-700 transition-colors">
                                                <span>Get started</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Our Services with Images */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-bold text-[#0F172A] font-display"
                        >
                            Our Services
                        </motion.h2>
                        <Link
                            href="/services"
                            className="text-[#1F6F5B] hover:text-[#1a5f4f] font-semibold text-sm flex items-center gap-1 transition-colors group"
                        >
                            View all
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>
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
                                    whileHover={{ y: -8 }}
                                    className="bg-white rounded-[30px] overflow-hidden border-2 border-gray-100 hover:border-gray-200 hover:shadow-2xl transition-all group"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={service.image}
                                            alt={service.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mb-4`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-[#0F172A] mb-2 font-display">
                                            {service.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm font-body">
                                            {service.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Stats/Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-[40px] p-12 border-2 border-gray-100 shadow-lg"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: TrendingUp, value: '100%', label: 'Verified Professionals', color: 'bg-[#E5F1EC]', iconColor: 'text-[#1F6F5B]' },
                            { icon: Heart, value: '50K+', label: 'Happy Families', color: 'bg-[#FEF7E6]', iconColor: 'text-[#F1B92B]' },
                            { icon: Clock, value: '24/7', label: 'Support Available', color: 'bg-[#FDF3F1]', iconColor: 'text-[#E08E79]' },
                        ].map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className={`w-20 h-20 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                        <Icon className={`w-10 h-10 ${stat.iconColor}`} />
                                    </div>
                                    <h3 className="text-4xl font-bold text-[#0F172A] mb-3 font-display">
                                        {stat.value}
                                    </h3>
                                    <p className="text-gray-600 font-body">{stat.label}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </ParentLayout>
    );
}
