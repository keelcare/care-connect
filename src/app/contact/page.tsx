'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageCircle,
    Clock,
    CheckCircle,
    ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            details: 'support@keel.care',
            description: 'We typically respond within 24 hours',
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: '+1 (555) 123-4567',
            description: 'Mon-Fri from 9am to 6pm EST',
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            details: '123 Care Street, Suite 100',
            description: 'San Francisco, CA 94102',
        },
    ];

    const faqs = [
        {
            question: 'How quickly can I find a caregiver?',
            answer:
                'Most families find a suitable caregiver within 48 hours of posting their needs.',
        },
        {
            question: 'Are all caregivers background checked?',
            answer:
                'Yes, every caregiver undergoes a comprehensive background check and identity verification.',
        },
        {
            question: 'What are your payment terms?',
            answer:
                'We offer flexible payment options including hourly rates and package deals. Payment is processed securely through our platform.',
        },
    ];

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 bg-white overflow-hidden">
                {/* Background elements */}
                <div className="absolute top-20 right-0 w-96 h-96 bg-stone-100 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-stone-200/30 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-7xl mx-auto">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm text-stone-500 hover:text-stone-900 transition-colors mb-4 group"
                        >
                            <ArrowLeft
                                size={16}
                                className="mr-2 group-hover:-translate-x-1 transition-transform"
                            />
                            Back to Home
                        </Link>

                        <div className="inline-flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-full">
                            <MessageCircle className="w-4 h-4 text-stone-600" />
                            <span className="text-sm font-medium text-stone-600">
                                Get in Touch
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1]">
                            We're here to
                            <span className="relative inline-block mx-2">
                                <span className="relative z-10">help</span>
                                <span className="absolute bottom-1 left-0 w-full h-3 bg-accent/30 -rotate-1" />
                            </span>
                        </h1>

                        <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
                            Have a question or need assistance? Our team is ready to support
                            you. Reach out and we'll get back to you as soon as possible.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-16 px-6 bg-stone-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-6">
                        {contactInfo.map((info, index) => {
                            const IconComponent = info.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 border border-stone-100 hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center mb-4">
                                        <IconComponent className="w-6 h-6 text-stone-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-stone-900 mb-1">
                                        {info.title}
                                    </h3>
                                    <p className="text-stone-900 font-medium mb-1">
                                        {info.details}
                                    </p>
                                    <p className="text-sm text-stone-500">{info.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Form */}
                        <div className="lg:col-span-3">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-stone-900 mb-2">
                                    Send us a message
                                </h2>
                                <p className="text-stone-600">
                                    Fill out the form below and we'll get back to you within 24
                                    hours.
                                </p>
                            </div>

                            {isSubmitted ? (
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center animate-fade-in">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-green-900 mb-2">
                                        Message sent successfully!
                                    </h3>
                                    <p className="text-green-700">
                                        We've received your message and will respond shortly.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <Input
                                        label="Your Name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        required
                                        className="bg-stone-50 border-stone-200 focus:bg-white transition-all"
                                    />

                                    <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        required
                                        className="bg-stone-50 border-stone-200 focus:bg-white transition-all"
                                    />

                                    <Input
                                        label="Subject"
                                        placeholder="How can we help?"
                                        value={formData.subject}
                                        onChange={(e) =>
                                            setFormData({ ...formData, subject: e.target.value })
                                        }
                                        required
                                        className="bg-stone-50 border-stone-200 focus:bg-white transition-all"
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            rows={6}
                                            placeholder="Tell us more about your inquiry..."
                                            value={formData.message}
                                            onChange={(e) =>
                                                setFormData({ ...formData, message: e.target.value })
                                            }
                                            required
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all resize-none"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-12 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-semibold group"
                                    >
                                        {isSubmitting ? (
                                            'Sending...'
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Office Hours */}
                            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-stone-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-stone-900">
                                        Office Hours
                                    </h3>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-stone-600">Monday - Friday</span>
                                        <span className="font-medium text-stone-900">
                                            9am - 6pm
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-stone-600">Saturday</span>
                                        <span className="font-medium text-stone-900">
                                            10am - 4pm
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-stone-600">Sunday</span>
                                        <span className="font-medium text-stone-900">Closed</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick FAQs */}
                            <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
                                <h3 className="text-lg font-bold text-stone-900 mb-4">
                                    Quick Answers
                                </h3>
                                <div className="space-y-4">
                                    {faqs.map((faq, index) => (
                                        <div key={index}>
                                            <p className="font-medium text-stone-900 text-sm mb-1">
                                                {faq.question}
                                            </p>
                                            <p className="text-xs text-stone-600">{faq.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-stone-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to find trusted care?
                    </h2>
                    <p className="text-lg text-stone-400 mb-8 max-w-2xl mx-auto">
                        Join thousands of families who have found reliable caregivers
                        through Keel.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/auth/signup">
                            <Button className="h-12 px-8 bg-white hover:bg-stone-100 text-stone-900 rounded-xl font-semibold">
                                Get Started Free
                            </Button>
                        </Link>
                        <Link href="/browse">
                            <Button
                                variant="outline"
                                className="h-12 px-8 border-stone-600 text-white hover:bg-stone-800 rounded-xl font-semibold"
                            >
                                Browse Caregivers
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
