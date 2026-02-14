
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, User, Sparkles, Calendar, ShieldCheck, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface ActionCardProps {
    title: string;
    description: string;
    icon: React.ElementType;
    actionText: string;
    href: string;
    delay?: number;
}

function ActionCard({ title, description, icon: Icon, actionText, href, delay = 0 }: ActionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-300 group flex flex-col items-start h-full"
        >
            <div className="w-11 h-11 rounded-2xl bg-dashboard-bg flex items-center justify-center text-dashboard-accent-start mb-5 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-dashboard-text-primary mb-2">
                {title}
            </h3>
            <p className="text-dashboard-text-primary/70 mb-6 flex-1 leading-relaxed text-sm">
                {description}
            </p>
            <Link href={href}>
                <Button variant="outline" className="rounded-full border-gray-200 hover:bg-dashboard-accent-start hover:text-white hover:border-dashboard-accent-start transition-all group-hover:px-6">
                    {actionText} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </Link>
        </motion.div>
    );
}

function InfoItem({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
    return (
        <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-dashboard-success shrink-0 shadow-sm mt-1">
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <h4 className="font-heading font-semibold text-dashboard-text-primary mb-1">{title}</h4>
                <p className="text-sm text-dashboard-text-primary/70 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

export function NewUserDashboard() {
    const { user } = useAuth();
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-5 pt-10 lg:h-[calc(100vh-140px)]">
            {/* Left Column: Banner & Quick Actions */}
            <div className="lg:col-span-2 space-y-5 flex flex-col h-full">
                {/* Welcome Banner */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-[28px] overflow-hidden flex-1 flex items-center shadow-premium min-h-[255px]"
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                        <Image
                            src="/onboardingimage.png"
                            alt="Welcome"
                            fill
                            className="object-cover object-[100%_100%]"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-dashboard-accent-start/90 via-dashboard-accent-start/20 to-transparent" />
                    </div>

                    <div className="relative z-10 p-6 md:p-10 max-w-xl text-white mt-auto mb-auto">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-3 border border-white/30">
                            <Sparkles className="w-3 h-3" />
                            <span>Welcome</span>
                        </div>
                        
                        <h1 className="text-2xl md:text-4xl font-display font-medium mb-3 leading-tight">
                            Welcome to the Keel family, {user?.profiles?.first_name || 'Friend'}
                        </h1>
                        
                        <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-md">
                            Let's find the perfect support for your family. We're here to help you navigate every step of the way.
                        </p>
                    </div>
                </motion.div>

                 {/* Quick Start Cards */}
                 <div className="shrink-0 pt-1">
                     <div className="flex items-center gap-2 mb-1.5">
                        <h2 className="text-lg font-display font-semibold text-dashboard-accent-start">Your Next Steps</h2>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <ActionCard
                            title="Complete your profile"
                            description="Help us understand your family's unique needs to get started."
                            icon={User}
                            actionText="Start Profile"
                            href="/dashboard/profile"
                            delay={0.1}
                        />
                        <ActionCard
                            title="Book a Service"
                            description="Connect with specialized educators, nannies, or special needs support professionals."
                            icon={Calendar}
                            actionText="Browse Services"
                            href="/book-service"
                            delay={0.2}
                        />
                    </div>
                </div>
            </div>

            {/* Right Sidebar Column */}
            <div className="flex flex-col gap-5 h-full">
                {/* Info Section */}
                 <div className="bg-dashboard-bg/50 rounded-[20px] p-5 border border-gray-100 flex-1 flex flex-col justify-center">
                    <h3 className="text-base font-display font-semibold text-dashboard-accent-start mb-1.5">Getting Started</h3>
                    <p className="text-gray-500 mb-5 text-sm">Verified professionals for child care, special needs support, and household help.</p>
                    
                    <div className="space-y-3">
                        <InfoItem 
                            icon={ShieldCheck}
                            title="Verification Process"
                            description="All caregivers undergo our rigorous 5-step vetting process including background checks."
                        />
                        <InfoItem 
                            icon={Users}
                            title="Matching Guide"
                            description="Learn how our smart algorithm finds the perfect specialist based on 20+ compatibility factors."
                        />
                    </div>
                </div>

                {/* Concierge/Help Card - Dark Blue */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-dashboard-accent-start rounded-[20px] p-5 text-white relative overflow-hidden text-center shrink-0"
                >
                     {/* Decorative Background */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
                     <div className="absolute bottom-0 left-0 w-24 h-24 bg-dashboard-success/10 rounded-full blur-[30px] translate-y-1/3 -translate-x-1/3" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-2.5 border border-white/20">
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        
                        <h3 className="text-base font-display font-semibold mb-1">Need Assistance?</h3>
                        <p className="text-white/70 text-[11px] mb-5 leading-relaxed">
                            Our concierge team is available to help you get started with a personalized plan.
                        </p>

                        <Link href="/contact" className="w-full">
                            <Button className="w-full bg-white text-dashboard-accent-start hover:bg-gray-50 rounded-xl font-semibold h-10 text-sm">
                                Chat with Support
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
