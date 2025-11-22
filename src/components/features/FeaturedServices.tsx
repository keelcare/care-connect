"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const FeaturedServices: React.FC = () => {
    const services = [
        {
            title: "Child Care",
            icon: "lni-baby",
        },
        {
            title: "Senior Care",
            icon: "lni-heart",
        },
        {
            title: "Pet Care",
            icon: "lni-paw",
        },
        {
            title: "Housekeeping",
            icon: "lni-home",
        },
        {
            title: "Tutoring",
            icon: "lni-book",
        },
        {
            title: "Special Needs",
            icon: "lni-hand",
        },
    ];

    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group relative aspect-square bg-white rounded-[24px] border border-neutral-100 shadow-soft hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] flex flex-col items-center justify-center cursor-pointer overflow-hidden"
                        >
                            <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                                <i className={`lni ${service.icon} text-4xl text-primary group-hover:text-white transition-colors duration-300`}></i>
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-800 group-hover:text-primary transition-colors">
                                {service.title}
                            </h3>

                            {/* Hover Overlay Effect */}
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
