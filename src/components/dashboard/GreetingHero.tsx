
import React from 'react';
import { motion } from 'framer-motion';

interface GreetingHeroProps {
    userName: string;
    carePlanUpdate?: string;
}

export function GreetingHero({ userName, carePlanUpdate }: GreetingHeroProps) {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <section className="relative mb-fluid-sm pt-10">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-fluid-5xl font-display font-medium text-dashboard-accent-start mb-2 tracking-tight">
                    {getGreeting()}, {userName}
                </h1>
                <p className="text-dashboard-text-secondary text-fluid-base font-body font-medium antialiased">
                    {carePlanUpdate || "Here's the latest update on your care plan."}
                </p>
            </motion.div>
        </section>
    );
}
