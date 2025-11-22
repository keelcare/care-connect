"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Hero: React.FC = () => {
    return (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-50 to-white px-6 pt-32 pb-20">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-purple-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '4s' }}></div>
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
                    <div className="inline-flex flex-col md:flex-row items-center bg-white rounded-[2rem] shadow-soft p-2 md:pl-8 border border-neutral-100 max-w-3xl mx-auto w-full">
                        <div className="flex items-center gap-3 w-full md:w-auto py-3 md:py-0 px-4 md:px-0">
                            <span className="text-neutral-500 font-medium whitespace-nowrap">I am looking for</span>
                            <select className="bg-transparent font-semibold text-neutral-900 outline-none cursor-pointer appearance-none min-w-[120px]">
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
                                className="bg-transparent font-semibold text-neutral-900 outline-none w-full md:w-32 placeholder-neutral-300"
                            />
                        </div>

                        <Button className="w-full md:w-auto rounded-full h-14 px-8 bg-primary hover:bg-primary-600 text-white shadow-lg hover:shadow-xl transition-all ml-auto mt-2 md:mt-0">
                            <i className="lni lni-search-alt text-xl"></i>
                        </Button>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-12 pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center gap-2 text-neutral-600">
                        <i className="lni lni-shield-check text-primary text-xl"></i>
                        <span className="font-medium">Background Checked</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                        <i className="lni lni-star-filled text-yellow-400 text-xl"></i>
                        <span className="font-medium">4.8/5 Average Rating</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-600">
                        <i className="lni lni-users text-secondary text-xl"></i>
                        <span className="font-medium">10k+ Caregivers</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
