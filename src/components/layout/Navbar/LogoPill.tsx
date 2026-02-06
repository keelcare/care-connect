
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function LogoPill() {
    return (
        <Link href="/" className="group focus:outline-none">
            <motion.div 
                className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 shadow-sm transition-colors hover:bg-white/80"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="w-8 h-8 bg-dashboard-accent-start rounded-full flex items-center justify-center text-white font-bold text-lg leading-none shadow-sm">
                    K
                </div>
                <span className="font-display font-bold text-lg text-dashboard-accent-start tracking-tight">
                    Keel
                </span>
            </motion.div>
        </Link>
    );
}
