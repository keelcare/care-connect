"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Baby, Heart, PawPrint, Home, BookOpen, Accessibility, ArrowRight } from 'lucide-react';

export const FeaturedServices: React.FC = () => {
    const router = useRouter();

    const services = [
        {
            title: "Child Care",
            description: "Experienced nannies and babysitters for children of all ages",
            icon: Baby,
            count: "5,200+ caregivers",
            image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=400&auto=format&fit=crop"
        },
        {
            title: "Senior Care",
            description: "Compassionate care for elderly family members",
            icon: Heart,
            count: "3,100+ caregivers",
            image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=400&auto=format&fit=crop"
        },
        {
            title: "Pet Care",
            description: "Trusted pet sitters and dog walkers in your area",
            icon: PawPrint,
            count: "2,800+ caregivers",
            image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=400&auto=format&fit=crop"
        },
        {
            title: "Housekeeping",
            description: "Professional house cleaners and organizers",
            icon: Home,
            count: "1,900+ helpers",
            image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop"
        },
        {
            title: "Tutoring",
            description: "Qualified tutors for academic support",
            icon: BookOpen,
            count: "1,400+ tutors",
            image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=400&auto=format&fit=crop"
        },
        {
            title: "Special Needs",
            description: "Specialized care for those who need extra attention",
            icon: Accessibility,
            count: "800+ specialists",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop"
        },
    ];

    const handleServiceClick = (serviceTitle: string) => {
        router.push(`/browse?service=${encodeURIComponent(serviceTitle)}`);
    };

    return (
        <section className="py-24 px-6 bg-stone-50">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                    <div>
                        <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest mb-3">Our Services</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-900 max-w-lg">
                            Care for every need, all in one place
                        </h2>
                    </div>
                    <p className="text-stone-600 max-w-md">
                        Whether you need help with childcare, eldercare, or everyday tasks, 
                        we have verified professionals ready to assist.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => {
                        const IconComponent = service.icon;
                        return (
                            <div
                                key={index}
                                onClick={() => handleServiceClick(service.title)}
                                className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-500 hover:-translate-y-1 border border-stone-100"
                            >
                                {/* Card Content */}
                                <div className="p-6">
                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors duration-300">
                                        <IconComponent className="w-7 h-7 text-stone-600 group-hover:text-white transition-colors duration-300" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-stone-700 transition-colors">
                                        {service.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-stone-500 text-sm mb-4 leading-relaxed">
                                        {service.description}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                                        <span className="text-xs font-medium text-stone-400">
                                            {service.count}
                                        </span>
                                        <div className="flex items-center gap-1 text-sm font-semibold text-stone-900 group-hover:gap-2 transition-all">
                                            <span>Browse</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Hover gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
