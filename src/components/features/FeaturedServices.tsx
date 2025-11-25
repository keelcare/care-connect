"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const FeaturedServices: React.FC = () => {
    const services = [
        {
            title: "Child Care",
            icon: "lni-baby",
            color: "text-yellow-600",
            bg: "bg-yellow-100",
            border: "group-hover:border-yellow-600"
        },
        {
            title: "Senior Care",
            icon: "lni-heart",
            color: "text-teal-600",
            bg: "bg-teal-100",
            border: "group-hover:border-teal-600"
        },
        {
            title: "Pet Care",
            icon: "lni-paw",
            color: "text-rose-600",
            bg: "bg-rose-100",
            border: "group-hover:border-rose-600"
        },
        {
            title: "Housekeeping",
            icon: "lni-home",
            color: "text-blue-600",
            bg: "bg-blue-100",
            border: "group-hover:border-blue-600"
        },
        {
            title: "Tutoring",
            icon: "lni-book",
            color: "text-purple-600",
            bg: "bg-purple-100",
            border: "group-hover:border-purple-600"
        },
        {
            title: "Special Needs",
            icon: "lni-hand",
            color: "text-green-600",
            bg: "bg-green-100",
            border: "group-hover:border-green-600"
        },
    ];

    return (
        <section className="py-24 px-6 bg-neutral-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl font-bold text-neutral-900">Explore our services</h2>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                        We have the right caregiver for every need.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`group relative p-8 bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 border-t-4 border-transparent ${service.border} cursor-pointer flex flex-col items-center text-center`}
                        >
                            <div className={`w-20 h-20 rounded-2xl ${service.bg} flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                <i className={`lni ${service.icon} text-4xl ${service.color}`}></i>
                            </div>

                            <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                                {service.title}
                            </h3>

                            <p className="text-neutral-500">
                                Trusted professionals for your {service.title.toLowerCase()} needs.
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
