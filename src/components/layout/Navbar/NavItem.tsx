
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
    href: string;
    label: string;
    isActive: boolean;
    icon?: LucideIcon;
    className?: string;
}

export function NavItem({ href, label, isActive, icon: Icon, className }: NavItemProps) {
    return (
        <Link href={href} className={cn("relative z-0 group focus:outline-none", className)}>
            {isActive && (
                <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                    }}
                />
            )}
            <span className={cn(
                "relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200",
                isActive 
                    ? "text-dashboard-accent-start" 
                    : "text-dashboard-text-secondary hover:text-dashboard-text-primary"
            )}>
                {Icon && <Icon className={cn("w-4 h-4", isActive ? "text-dashboard-accent-start" : "text-dashboard-text-secondary group-hover:text-dashboard-text-primary")} />}
                {label}
            </span>
        </Link>
    );
}
