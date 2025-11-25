"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sun, Heart, Shield, Star, Book, User } from 'lucide-react';

export const Hero: React.FC = () => {
    const router = useRouter();
    const [zipCode, setZipCode] = useState('');
    const [serviceType, setServiceType] = useState('Child Care');

    const handleSearch = () => {
        // Always redirect to browse page, regardless of zipcode validity
        // If zipcode is provided, it could be used for filtering in the future
        if (zipCode.trim()) {
            router.push(`/browse?zipcode=${encodeURIComponent(zipCode)}&service=${encodeURIComponent(serviceType)}`);
        } else {
            router.push('/browse');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-teal-50/50 px-6 pt-32 pb-20">
            {/* Floating Icon Cloud */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Sun - Top Left */}
                <div className="absolute top-[15%] left-[10%] animate-float" style={{ animationDelay: '0s' }}>
                    <div className="bg-white p-4 rounded-full shadow-lg">
                        <Sun className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                    </div>
                </div>

                {/* Heart - Top Right */}
                <div className="absolute top-[20%] right-[15%] animate-float" style={{ animationDelay: '2s' }}>
                    <div className="bg-white p-4 rounded-full shadow-lg">
                        <Heart className="w-8 h-8 text-secondary fill-secondary" />
                    </div>
                </div>

                {/* Shield - Bottom Left */}
                <div className="absolute bottom-[20%] left-[15%] animate-float" style={{ animationDelay: '4s' }}>
                    <div className="bg-white p-4 rounded-full shadow-lg">
                        <Shield className="w-8 h-8 text-primary fill-primary/20" />
                    </div>
                </div>

                {/* Star - Bottom Right */}
                <div className="absolute bottom-[25%] right-[10%] animate-float" style={{ animationDelay: '1s' }}>
                    <div className="bg-white p-4 rounded-full shadow-lg">
                        <Star className="w-8 h-8 text-orange-400 fill-orange-400" />
                    </div>
                </div>

                {/* Book - Middle Left */}
                <div className="absolute top-[50%] left-[5%] animate-float" style={{ animationDelay: '3s' }}>
                    <div className="bg-white p-3 rounded-full shadow-lg">
                        <Book className="w-6 h-6 text-blue-400 fill-blue-400/20" />
                    </div>
                </div>

                {/* User - Middle Right */}
                <div className="absolute top-[45%] right-[5%] animate-float" style={{ animationDelay: '5s' }}>
                    <div className="bg-white p-3 rounded-full shadow-lg">
                        <User className="w-6 h-6 text-purple-400 fill-purple-400/20" />
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
                {/* Main Heading */}
                <div className="space-y-4 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-[1.1]">
                        Care for the ones <br />
                        <span className="text-primary">you love.</span>
                    </h1>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                        Find trusted caregivers for your family. From child care to senior care, we connect you with the help you need.
                    </p>
                </div>

                {/* Conversational Search Box */}
                <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="inline-flex flex-col md:flex-row items-center bg-white rounded-[2rem] shadow-soft p-2 md:pl-8 border border-neutral-100 max-w-3xl mx-auto w-full relative z-20">
                        <div className="flex items-center gap-3 w-full md:w-auto py-3 md:py-0 px-4 md:px-0">
                            <span className="text-neutral-500 font-medium whitespace-nowrap">I am looking for</span>
                            <select
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value)}
                                className="bg-transparent font-semibold text-neutral-900 outline-none cursor-pointer appearance-none min-w-[120px]"
                            >
                                <option>Child Care</option>
                                <option>Senior Care</option>
                                <option>Pet Care</option>
                                <option>Housekeeping</option>
                            </select>
                            <i className="lni lni-chevron-down text-xs text-neutral-400"></i>
                        </div>

                        <div className="hidden md:block w-px h-8 bg-neutral-200 mx-4"></div>

                        <div className="flex items-center gap-3 w-full md:w-auto py-3 md:py-0 px-4 md:px-0 border-t md:border-t-0 border-neutral-100">
                            <span className="text-neutral-500 font-medium whitespace-nowrap">in</span>
                            <input
                                type="text"
                                placeholder="Zip Code"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="bg-transparent font-semibold text-neutral-900 outline-none w-full md:w-32 placeholder-neutral-300"
                            />
                        </div>

                        <Button
                            onClick={handleSearch}
                            className="w-full md:w-auto rounded-full h-14 px-8 bg-primary hover:bg-primary-600 shadow-lg hover:shadow-xl transition-all ml-auto mt-2 md:mt-0"
                        >
                            <i className="lni lni-search-alt text-xl"></i>
                        </Button>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-12 pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center gap-2 text-neutral-600 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 shadow-sm">
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="font-medium">Background Checked</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 shadow-sm">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">4.8/5 Average Rating</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 shadow-sm">
                        <User className="w-5 h-5 text-secondary" />
                        <span className="font-medium">10k+ Caregivers</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
