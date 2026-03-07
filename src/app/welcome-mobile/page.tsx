'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck, Heart, Sparkles, UserPlus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BadgePill } from '@/components/ui/BadgePill';

import { useAuth } from '@/context/AuthContext';

export default function WelcomeMobilePage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // Redirect logged-in users
    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'parent') router.push('/parent-dashboard');
            else if (user.role === 'nanny') router.push('/dashboard');
            else if (user.role === 'admin') router.push('/admin');
        }
    }, [user, loading, router]);

    const features = [
        {
            icon: ShieldCheck,
            title: "Verified Care",
            desc: "Rigorous 5-step vetting process."
        },
        {
            icon: Heart,
            title: "Specialized Support",
            desc: "Tailored to your unique needs."
        },
        {
            icon: Sparkles,
            title: "Expert Matching",
            desc: "Perfect fit for your family."
        }
    ];

    return (
        <div className="min-h-dvh bg-primary-900 text-white overflow-hidden flex flex-col">
            {/* Background Video/Animation Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-900/40 via-primary-900/80 to-primary-900 z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-60"
                >
                    <source src="/waves.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Content */}
            <div className="relative z-20 flex-1 flex flex-col px-6 pt-16 pb-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex justify-center mb-8"
                >
                    <span className="text-3xl font-display font-bold tracking-tight">Keel</span>
                </motion.div>

                {/* Hero section */}
                <div className="flex-1 flex flex-col justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="flex justify-center mb-6">
                            <BadgePill text="PREMIUM CARE FOR PRECIOUS LIVES" variant="primary" className="bg-white/10 text-white border-white/20 backdrop-blur-md" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-[1.1]">
                            Where Big Needs Meet <br />
                            <span className="italic text-primary-300">Gentle Care</span>
                        </h1>
                        <p className="text-lg text-white/70 font-body mb-10 max-w-sm mx-auto leading-relaxed">
                            Connect with verified professionals who bring harmony and professional support to your home.
                        </p>
                    </motion.div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 gap-4 mb-12">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
                                className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl text-left"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary-400/20 flex items-center justify-center text-primary-300 shrink-0">
                                    <f.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">{f.title}</h3>
                                    <p className="text-xs text-white/50">{f.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="space-y-4 pt-4"
                >
                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={() => router.push('/auth/signup?role=parent')}
                            className="w-full bg-white text-primary-900 hover:bg-white/90 h-14 rounded-2xl font-bold text-lg shadow-xl"
                        >
                            Find Care for Family <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/auth/signup?role=nanny')}
                            className="w-full border-white/20 bg-transparent text-white hover:bg-white/5 h-14 rounded-2xl font-bold text-lg"
                        >
                            Join as a Caregiver <Star className="ml-2 w-5 h-5 fill-current" />
                        </Button>
                    </div>

                    <p className="text-center text-white/50 text-sm py-4">
                        Already have an account? {' '}
                        <button
                            onClick={() => router.push('/auth/login')}
                            className="text-white font-bold underline underline-offset-4"
                        >
                            Sign in
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
