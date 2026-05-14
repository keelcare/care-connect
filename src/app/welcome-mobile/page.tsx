'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useAuth } from '@/context/AuthContext';

export default function WelcomeMobilePage() {
    const router = useRouter();
    const { user, loading } = useAuth();


    // Redirect logged-in users
    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'parent') router.push('/parent-dashboard');
            else if (user.role === 'nanny') router.push('/dashboard');
            else if (user.role === 'admin') router.push('/admin');
        }
    }, [user, loading, router]);



    return (
        <div className="fixed inset-0 bg-primary-900 text-white overflow-hidden flex flex-col touch-none">
            {/* Background Video/Animation Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-primary-900/25 via-primary-900/60 to-primary-900/75 z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    webkit-playsinline="true"
                    preload="auto"
                    poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                    className="w-full h-full object-cover opacity-60"
                >
                    <source src="/welcomescreen_mobile.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Content */}
            <div className="relative z-20 flex-1 flex flex-col px-6 py-10 justify-between">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex justify-center"
                >
                    <span className="text-3xl font-display font-bold tracking-tight">Keel</span>
                </motion.div>

                {/* Hero section */}
                <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full"
                    >
                        <h1 className="text-4xl md:text-5xl font-display font-semibold leading-[1.1] text-center">
                            Where Big Needs Meet <br />
                            <span className="font-serif italic font-medium text-primary-300">Gentle</span> Care
                        </h1>
                    </motion.div>
                </div>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="space-y-4"
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
                            Join as a Caregiver 
                        </Button>
                    </div>

                    <p className="text-center text-white/50 text-sm pt-2">
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
