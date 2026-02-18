'use client';

import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageSquare,
    Clock,
    CheckCircle,
    Sparkles,
    ArrowUpRight,
} from 'lucide-react';
import ParentLayout from '@/components/layout/ParentLayout';
import Image from 'next/image';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, -100]);
    const y2 = useTransform(scrollY, [0, 500], [0, -50]);
    const physicsY1 = useSpring(y1, { stiffness: 100, damping: 20 });
    const physicsY2 = useSpring(y2, { stiffness: 100, damping: 20 });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
        }, 3000);
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            value: 'support@keelcare.com',
            description: 'We will respond within 24 hours',
            color: 'bg-primary',
            lightBg: 'bg-background',
        },
        {
            icon: Phone,
            title: 'Call Us',
            value: '+91 98765 43210',
            description: 'Mon-Fri, 9AM-6PM IST',
            color: 'bg-[#8DA399]',
            lightBg: 'bg-[#F5F8F6]',
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            value: 'Mumbai, India',
            description: 'Serving families nationwide',
            color: 'bg-[#CC7A68]',
            lightBg: 'bg-[#FDF3F1]',
        },
    ];

    return (
        <ParentLayout>
            <div ref={containerRef} className="space-y-16">
                {/* Header with Parallax Background */}
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
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-[#0F172A]">We're Here to Help</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold text-[#0F172A] mb-6 font-display leading-tight">
                        Get in Touch
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 font-body leading-relaxed">
                        Have questions? We're here to help. Reach out to us and we'll get back to you as soon as possible.
                    </p>
                </motion.div>

                {/* Contact Info Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {contactInfo.map((info, index) => {
                        const Icon = info.icon;
                        return (
                            <motion.div
                                key={info.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className={`${info.lightBg} rounded-[30px] p-8 text-center hover:shadow-2xl transition-all border-2 border-transparent hover:border-gray-200`}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className={`w-16 h-16 ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}
                                >
                                    <Icon className="w-8 h-8 text-white" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-[#0F172A] mb-2 font-display">
                                    {info.title}
                                </h3>
                                <p className="text-2xl font-semibold text-gray-900 mb-2">
                                    {info.value}
                                </p>
                                <p className="text-sm text-gray-600 font-body">
                                    {info.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Contact Form & Info */}
                <div className="grid md:grid-cols-5 gap-12 items-start">
                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="md:col-span-3 bg-white rounded-[40px] p-8 md:p-12 border-2 border-gray-100 shadow-lg"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <MessageSquare className="w-7 h-7 text-primary" />
                            <h2 className="text-3xl font-bold text-[#0F172A] font-display">
                                Send us a message
                            </h2>
                        </div>

                        {isSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-16"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                                    className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle className="w-12 h-12 text-primary" />
                                </motion.div>
                                <h3 className="text-3xl font-bold text-[#0F172A] mb-3 font-display">
                                    Message Sent!
                                </h3>
                                <p className="text-lg text-gray-600 font-body">
                                    We'll get back to you within 24 hours.
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[#0F172A] mb-2 font-body">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="w-full px-5 py-4 rounded-[20px] border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#0F172A] mb-2 font-body">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="w-full px-5 py-4 rounded-[20px] border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#0F172A] mb-2 font-body">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-5 py-4 rounded-[20px] border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#0F172A] mb-2 font-body">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        required
                                        className="w-full px-5 py-4 rounded-[20px] border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-lg"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#0F172A] mb-2 font-body">
                                        Message
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        rows={6}
                                        className="w-full px-5 py-4 rounded-[20px] border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none text-lg"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary hover:bg-primary-800 text-white py-5 rounded-full font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>

                    {/* Sidebar with Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="md:col-span-2 space-y-6"
                    >
                        {/* Illustration */}
                        <div className="relative h-64 rounded-[30px] overflow-hidden shadow-2xl">
                            <Image
                                src="/image2.png"
                                alt="Contact us"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Business Hours */}
                        <div className="bg-[#CC7A68] rounded-[30px] p-8 text-white relative overflow-hidden">
                            <motion.div style={{ y: physicsY1 }} className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full mix-blend-overlay filter blur-3xl" />
                            <motion.div style={{ y: physicsY1 }} className="absolute bottom-0 left-0 w-48 h-48 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

                            <Clock className="w-10 h-10 text-white mb-4" />
                            <h3 className="text-2xl font-bold mb-4 font-display">
                                Quick Response Time
                            </h3>
                            <p className="text-white/90 mb-6 font-body leading-relaxed">
                                Our support team typically responds within 24 hours during business days.
                            </p>
                            <div className="space-y-3">
                                {[
                                    { day: 'Monday - Friday', time: '9AM - 6PM IST' },
                                    { day: 'Saturday', time: '10AM - 4PM IST' },
                                    { day: 'Sunday', time: 'Closed' },
                                ].map((schedule, index) => (
                                    <motion.div
                                        key={schedule.day}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-2 h-2 bg-[#8DA399] rounded-full" />
                                        <span className="text-gray-300 flex-1">{schedule.day}</span>
                                        <span className="text-white font-semibold">{schedule.time}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="bg-background rounded-[30px] p-8">
                            <h3 className="text-xl font-bold text-[#0F172A] mb-6 font-display">
                                Quick Answers
                            </h3>
                            <div className="space-y-5">
                                {[
                                    { q: 'How do I book a service?', a: 'Simply click "Book a Service" and select your preferred service type, date, and time.' },
                                    { q: 'Are all caregivers verified?', a: 'Yes, all our caregivers undergo thorough background checks and verification.' },
                                    { q: 'Can I cancel a booking?', a: 'Yes, you can cancel up to 24 hours before your scheduled appointment.' },
                                ].map((faq, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <h4 className="font-semibold text-[#0F172A] mb-2 flex items-start gap-2">
                                            <ArrowUpRight className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                                            {faq.q}
                                        </h4>
                                        <p className="text-gray-600 text-sm font-body pl-6">
                                            {faq.a}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </ParentLayout>
    );
}
