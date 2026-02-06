
import React from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export function NotificationButton() {
    return (
        <motion.button
            className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-sm border border-white/60 flex items-center justify-center text-dashboard-text-secondary hover:text-dashboard-text-primary hover:bg-white transition-colors relative focus:outline-none focus:ring-2 focus:ring-dashboard-accent-start/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, rotate: 10 }}
        >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-dashboard-success rounded-full ring-2 ring-white" />
        </motion.button>
    );
}
