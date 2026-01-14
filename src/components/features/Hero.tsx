"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Shield, Star, Users, Search, ChevronDown, MapPin, ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
    const router = useRouter();

    const [serviceType, setServiceType] = useState('Child Care');
    const [isSelectOpen, setIsSelectOpen] = useState(false);

    const serviceOptions = ['Child Care', 'Senior Care', 'Pet Care', 'Housekeeping'];

    const handleSearch = () => {
        router.push('/auth/signup?role=parent');
    };



    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-warm-white">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Gradient orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-stone-200/40 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-stone-300/30 rounded-full blur-3xl" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 lg:py-0">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Content */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-stone-200">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-medium text-stone-600">Trusted by 50,000+ families</span>
                        </div>

                        {/* Main Heading */}
                        <div className="space-y-4">
                            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-heading-gray leading-[1.1]">
                                Care you can
                                <span className="relative inline-block mx-3">
                                    <span className="relative z-10">trust,</span>
                                    <span className="absolute bottom-2 left-0 w-full h-3 bg-amber-200/60 -rotate-1" />
                                </span>
                                <br />
                                for the people who
                                <br />
                                <span className="text-stone-500">matter most.</span>
                            </h1>
                            <p className="text-lg text-stone-600 max-w-lg leading-relaxed">
                                Connect with verified, background-checked caregivers in your area. 
                                From childcare to senior care, we make finding trusted help simple.
                            </p>
                        </div>

                        {/* Search Box */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 p-2 border border-stone-200">
                            <div className="flex flex-col md:flex-row gap-2 items-center">
                                {/* Service Type Dropdown */}
                                <div className="relative flex-1 w-full">
                                    <button
                                        onClick={() => setIsSelectOpen(!isSelectOpen)}
                                        className="w-full flex items-center justify-between gap-2 px-4 py-4 rounded-xl hover:bg-stone-50 transition-colors text-left"
                                    >
                                        <div>
                                            <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">I'm looking for...</p>
                                            <p className="text-stone-900 font-semibold">{serviceType}</p>
                                        </div>
                                        <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {isSelectOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-stone-200 py-2 z-50">
                                            {serviceOptions.map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => {
                                                        setServiceType(option);
                                                        setIsSelectOpen(false);
                                                    }}
                                                    className={`w-full px-4 py-3 text-left hover:bg-stone-50 transition-colors ${
                                                        serviceType === option ? 'bg-stone-50 text-stone-900 font-medium' : 'text-stone-600'
                                                    }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Search Button */}
                                <Button
                                    onClick={handleSearch}
                                    className="w-full md:w-auto h-auto py-4 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all group whitespace-nowrap"
                                >
                                    SEARCH
                                </Button>
                                
                                {/* I'm a Caregiver Link */}
                                <div className="px-4 whitespace-nowrap">
                                     <button 
                                        onClick={() => router.push('/auth/signup?role=nanny')}
                                        className="text-sm font-bold text-emerald-700 hover:text-emerald-800 uppercase tracking-wide"
                                     >
                                        I'M A CAREGIVER
                                     </button>
                                </div>
                            </div>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap gap-6 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-stone-700" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-stone-900">Verified</p>
                                    <p className="text-xs text-stone-500">Background checked</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                                    <Star className="w-5 h-5 text-stone-700" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-stone-900">4.9 Rating</p>
                                    <p className="text-xs text-stone-500">From 10k+ reviews</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-stone-700" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-stone-900">15k+</p>
                                    <p className="text-xs text-stone-500">Active caregivers</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Image Grid */}
                    <div className="relative hidden lg:block">
                        <div className="relative">
                            {/* Main large image */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-stone-300/50 aspect-[4/5] hover:shadow-3xl transition-shadow duration-500">
                                <Image
                                    src="https://images.unsplash.com/photo-1544776193-352d25ca82cd?q=80&w=800&auto=format&fit=crop"
                                    alt="Caregiver with child"
                                    fill
                                    className="object-cover contrast-75 brightness-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 to-transparent mix-blend-overlay" />
                                <div className="absolute inset-0 bg-orange-50/10 pointer-events-none" /> {/* Warm overlay */}
                            </div>

                            {/* Floating card - Top Right */}
                            <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl shadow-stone-200/50 border border-stone-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-stone-900">100% Verified</p>
                                        <p className="text-xs text-stone-500">All caregivers checked</p>
                                    </div>
                                </div>
                            </div>

                            {/* Floating card - Bottom Left */}
                            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl shadow-stone-200/50 border border-stone-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                                                <Image
                                                    src={`https://images.unsplash.com/photo-${
                                                        i === 1 ? '1438761681033-6461ffad8d80' :
                                                        i === 2 ? '1500648767791-00dcc994a43e' :
                                                        i === 3 ? '1494790108377-be9c29b29330' :
                                                        '1507003211169-0a1dd7228f2d'
                                                    }?w=100&h=100&fit=crop`}
                                                    alt="User"
                                                    width={32}
                                                    height={32}
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-stone-900">Join 50k+</p>
                                        <p className="text-xs text-stone-500">Happy families</p>
                                    </div>
                                </div>
                            </div>

                            {/* Rating badge */}
                            <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-white rounded-xl p-3 shadow-lg border border-stone-100">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-xs text-stone-600 mt-1 text-center">Excellent</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
