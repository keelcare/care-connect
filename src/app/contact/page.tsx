'use client';

import React, { useState } from 'react';
import {
    Mail,
    Phone,
    Send,
    MessageSquare,
    CheckCircle2,
    Sparkles,
    ArrowUpRight,
    ExternalLink
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
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            href: 'mailto:support@keelcare.com'
        },
        {
            icon: Phone,
            title: 'Call Us',
            value: '+91 98765 43210',
            description: 'Mon-Fri, 9AM-6PM IST',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            href: 'tel:+919876543210'
        },
    ];

    return (
        <ParentLayout>
            <div className="p-6 md:p-10 lg:p-12">
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary-50 px-4 py-1.5 rounded-full border border-primary-100 mb-4">
                        <Sparkles size={14} className="text-primary-600" />
                        <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">We're Here to Help</span>
                    </div>
                    <h1 className="text-4xl font-bold text-primary-900 font-display mb-3">Get in Touch</h1>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
                        Have questions about our services or need assistance? Reach out to us and we'll get back to you as soon as possible.
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {contactInfo.map((info) => (
                        <a 
                            key={info.title}
                            href={info.href}
                            className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md hover:border-primary-100 transition-all group"
                        >
                            <div className={`w-14 h-14 ${info.bg} ${info.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform`}>
                                <info.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-primary-900 mb-2 font-display">{info.title}</h3>
                            <p className="text-lg font-bold text-slate-900 mb-1">{info.value}</p>
                            <p className="text-sm text-slate-500 font-medium">{info.description}</p>
                        </a>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Form Section */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 md:p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl">
                                    <MessageSquare size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-primary-900 font-display">Send us a message</h2>
                            </div>

                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={40} className="text-emerald-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-primary-900 mb-2 font-display">Message Sent!</h3>
                                    <p className="text-slate-500 font-medium">We'll get back to you within 24 hours.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Your Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-slate-900"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-slate-900"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-slate-900"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            required
                                            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-slate-900"
                                            placeholder="How can we help?"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                            rows={5}
                                            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all resize-none font-medium text-slate-900"
                                            placeholder="Tell us more about your inquiry..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2 group"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Section */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Illustration/Image */}
                        <div className="relative h-72 rounded-2xl overflow-hidden shadow-md border border-slate-100">
                            <Image
                                src="/image2.png"
                                alt="Contact us"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="text-xl font-bold font-display">Dedicated Support</h3>
                                <p className="text-sm text-white/80 font-medium">Always ready to assist your family.</p>
                            </div>
                        </div>

                        {/* Quick Help Card */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                            <h3 className="text-lg font-bold text-primary-900 font-display mb-6">Quick Help</h3>
                            <div className="space-y-5">
                                {[
                                    { q: 'How do I book a service?', a: 'Select your service type, date, and time from the "Book Service" page.' },
                                    { q: 'Are caregivers verified?', a: 'Yes, all our caregivers undergo strict identity and background checks.' },
                                ].map((faq, index) => (
                                    <div key={index}>
                                        <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-start gap-2">
                                            <ArrowUpRight size={14} className="text-primary-500 mt-0.5 shrink-0" />
                                            {faq.q}
                                        </h4>
                                        <p className="text-slate-500 text-xs font-medium leading-relaxed pl-5">
                                            {faq.a}
                                        </p>
                                    </div>
                                ))}
                                <a href="/support" className="flex items-center justify-center gap-2 text-primary-600 font-bold text-sm mt-4 hover:text-primary-700 transition-colors">
                                    Visit Support Center
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ParentLayout>
    );
}
