
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ProfileChipProps {
    name: string;
    image?: string;
    onClick?: () => void;
}

export function ProfileChip({ name, image, onClick }: ProfileChipProps) {
    return (
        <motion.button
            onClick={onClick}
            className="flex items-center gap-3 bg-white/50 backdrop-blur-md pl-1 pr-4 py-1 rounded-full border border-white/60 shadow-sm hover:shadow-md transition-all group focus:outline-none"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white relative">
                <Image
                    src={image || '/placeholder-avatar.png'}
                    alt={name}
                    fill
                    className="object-cover"
                />
            </div>
            <span className="text-sm font-medium text-dashboard-text-primary group-hover:text-dashboard-accent-start transition-colors">
                {name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-dashboard-text-secondary/60 group-hover:text-dashboard-text-primary transition-colors" />
        </motion.button>
    );
}
