'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
    Baby,
    GraduationCap,
    HeartPulse,
    ArrowRight,
    Check,
    Shield,
    Clock,
    Heart,
    Sparkles,
    ArrowUpRight,
} from 'lucide-react';
import ParentLayout from '@/components/layout/ParentLayout';
import Image from 'next/image';

const SERVICES = [
    {
        id: 'CHILD_CARE',
        name: 'Child Care',
        tagline: 'Nurturing care for your little ones',
        description: 'Professional nannies and babysitters who provide loving, attentive care for children aged 5 months to 6+ years.',
        icon: Baby,
        color: 'bg-[#1F6F5B]',
        lightBg: 'bg-[#E5F1EC]',
        textColor: 'text-[#1F6F5B]',
        image: '/babysitter_playing.png',
        features: [
            'Background-verified caregivers',
            'Flexible scheduling options',
            'Age-appropriate activities',
            'Regular progress updates',
            'Emergency-trained professionals',
        ],
        pricing: 'Starting from ₹300/hour',
    },
    {
        id: 'SHADOW_TEACHER',
        name: 'Shadow Teacher',
        tagline: 'Specialized educational support',
        description: 'Dedicated educational professionals providing one-on-one support for children with unique learning needs.',
        icon: GraduationCap,
        color: 'bg-[#F1B92B]',
        lightBg: 'bg-[#FEF7E6]',
        textColor: 'text-[#F1B92B]',
        image: '/ShadowTeacher.png',
        features: [
            'Individualized learning plans',
            'Special education expertise',
            'Behavioral support strategies',
            'Parent collaboration & updates',
            'Flexible subscription plans',
        ],
        pricing: 'Starting from ₹500/hour',
        badge: 'Subscription Plans Available',
    },
    {
        id: 'SENIOR_CARE',
        name: 'Senior Care',
        tagline: 'Compassionate care for aging loved ones',
        description: 'Experienced caregivers providing companionship, assistance, and medical support for elderly family members.',
        icon: HeartPulse,
        color: 'bg-[#E08E79]',
        lightBg: 'bg-[#FDF3F1]',
        textColor: 'text-[#E08E79]',
        image: '/mother_child_caring.png',
        features: [
            'Medication management',
            'Mobility assistance',
            'Companionship & activities',
            'Meal preparation',
            'Medical condition support',
        ],
        pricing: 'Starting from ₹400/hour',
    },
];

export default function ServicesPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, -80]);
    const physicsY1 = useSpring(y1, { stiffness: 100, damping: 20 });

    return (
        <ParentLayout>
            <div ref={containerRef} className="space-y-16">
                {/* Header with Parallax */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-4xl mx-auto relative"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-100 mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-[#1F6F5B]" />
                        <span className="text-sm font-semibold text-[#0F172A]">Premium Care Services</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold text-[#0F172A] mb-6 font-display leading-tight">
                        Our Services
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 font-body leading-relaxed">
                        Professional, verified caregivers for every stage of life. Choose the service that fits your family's needs.
                    </p>
                </motion.div>

                {/* Services */}
                <div className="space-y-12">
                    {SERVICES.map((service, index) => {
                        const Icon = service.icon;
                        const isEven = index % 2 === 0;

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                            >
                                <div className={`${service.lightBg} rounded-[40px] p-8 md:p-12 border-2 border-transparent hover:border-gray-200 transition-all overflow-hidden`}>
                                    <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                                        {/* Image Side */}
                                        <motion.div
                                            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6, delay: 0.2 }}
                                            className={`relative ${!isEven ? 'md:order-2' : ''}`}
                                        >
                                            <div className="relative h-80 md:h-96 rounded-[30px] overflow-hidden shadow-2xl">
                                                <Image
                                                    src={service.image}
                                                    alt={service.name}
                                                    fill
                                                    className="object-cover hover:scale-110 transition-transform duration-700"
                                                />
                                                {service.badge && (
                                                    <div className="absolute top-4 right-4">
                                                        <span className={`px-4 py-2 ${service.color} text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm`}>
                                                            {service.badge}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>

                                        {/* Content Side */}
                                        <div className={!isEven ? 'md:order-1' : ''}>
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.6, delay: 0.3 }}
                                            >
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                                                        <Icon className="w-8 h-8 text-white" />
                                                    </div>
                                                </div>

                                                <h2 className={`text-4xl md:text-5xl font-bold ${service.textColor} mb-3 font-display`}>
                                                    {service.name}
                                                </h2>
                                                <p className="text-xl text-gray-700 mb-4 font-semibold">
                                                    {service.tagline}
                                                </p>
                                                <p className="text-gray-600 mb-6 leading-relaxed font-body text-lg">
                                                    {service.description}
                                                </p>

                                                <div className="mb-6">
                                                    <h3 className="text-lg font-bold text-[#0F172A] mb-4 font-display">
                                                        What's Included
                                                    </h3>
                                                    <ul className="space-y-3">
                                                        {service.features.map((feature, idx) => (
                                                            <motion.li
                                                                key={idx}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                whileInView={{ opacity: 1, x: 0 }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                                                                className="flex items-start gap-3"
                                                            >
                                                                <div className={`w-6 h-6 ${service.color} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                                                    <Check className="w-4 h-4 text-white" />
                                                                </div>
                                                                <span className="text-gray-700 font-body">{feature}</span>
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                                                    <span className={`text-3xl font-bold ${service.textColor} font-display`}>
                                                        {service.pricing}
                                                    </span>
                                                </div>

                                                <Link
                                                    href={`/book-service?service=${service.id}`}
                                                    className={`inline-flex items-center gap-2 ${service.color} hover:opacity-90 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl group`}
                                                >
                                                    Book Now
                                                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                </Link>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Trust Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-[#E08E79] rounded-[40px] p-12 md:p-16 text-center relative overflow-hidden"
                >
                    <motion.div style={{ y: physicsY1 }} className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20" />
                    <motion.div style={{ y: physicsY1 }} className="absolute bottom-0 left-0 w-96 h-96 bg-[#1F6F5B] rounded-full mix-blend-multiply filter blur-3xl opacity-10" />

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 font-display">
                        Why Choose Keel?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-12 mt-12">
                        {[
                            { icon: Shield, title: '100% Verified', description: 'All caregivers undergo thorough background checks and verification', color: 'bg-white', iconColor: 'text-[#E08E79]' },
                            { icon: Clock, title: 'Flexible Scheduling', description: 'Book services on your schedule, with options for one-time or recurring care', color: 'bg-white', iconColor: 'text-[#E08E79]' },
                            { icon: Heart, title: 'Trusted by Families', description: 'Join 50,000+ families who trust Keel for their care needs', color: 'bg-white', iconColor: 'text-[#E08E79]' },
                        ].map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -8 }}
                                    className="group"
                                >
                                    <div className={`w-20 h-20 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                        <Icon className={`w-10 h-10 ${item.iconColor}`} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3 font-display">
                                        {item.title}
                                    </h3>
                                    <p className="text-white/90 font-body leading-relaxed">
                                        {item.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center bg-white rounded-[40px] p-12 border-2 border-gray-100 shadow-lg"
                >
                    <h2 className="text-4xl font-bold text-[#0F172A] mb-4 font-display">
                        Ready to get started?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 font-body">
                        Book a service today and experience the Keel difference
                    </p>
                    <Link
                        href="/book-service"
                        className="inline-flex items-center gap-2 bg-[#1F6F5B] hover:bg-[#1a5f4f] text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl group"
                    >
                        Book a Service
                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </ParentLayout>
    );
}
