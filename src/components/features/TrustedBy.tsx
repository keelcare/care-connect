"use client";

import React from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

export const TrustedBy: React.FC = () => {
    const testimonials = [
        {
            name: "Sarah Mitchell",
            role: "Parent of 2",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
            quote: "Found the perfect nanny within a week. The verification process gave us total peace of mind.",
            rating: 5
        },
        {
            name: "David Kim",
            role: "Working Dad",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
            quote: "The flexibility to book care on short notice has been a game-changer for our family.",
            rating: 5
        },
        {
            name: "Jessica Thompson",
            role: "Mother of 3",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
            quote: "We've been using CareConnect for over a year now. Best decision we ever made.",
            rating: 5
        },
        {
            name: "Michael Rodriguez",
            role: "Single Parent",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
            quote: "The caregivers are professional, caring, and my kids absolutely love them.",
            rating: 5
        },
    ];

    const stats = [
        { value: "50k+", label: "Happy Families" },
        { value: "15k+", label: "Verified Caregivers" },
        { value: "4.9", label: "Average Rating" },
        { value: "98%", label: "Would Recommend" },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <p className="text-4xl md:text-5xl font-bold text-stone-900">{stat.value}</p>
                            <p className="text-stone-500 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Section Header */}
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-3">Testimonials</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
                        Loved by families everywhere
                    </h2>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="group relative bg-stone-50 rounded-2xl p-6 hover:bg-stone-100 transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-200/50 flex items-center justify-center">
                                <Quote className="w-4 h-4 text-stone-400" />
                            </div>

                            {/* Rating */}
                            <div className="flex gap-0.5 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-stone-600 text-sm leading-relaxed mb-6">
                                &ldquo;{testimonial.quote}&rdquo;
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-stone-900">{testimonial.name}</p>
                                    <p className="text-xs text-stone-500">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
