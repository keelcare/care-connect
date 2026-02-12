import React from 'react';
import { motion } from 'framer-motion';

interface BadgePillProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'info';
  className?: string;
}

export function BadgePill({ text, variant = 'primary', className = '' }: BadgePillProps) {
  const variantStyles = {
    primary: 'bg-primary-50 text-primary-900',
    secondary: 'bg-secondary/20 text-secondary',
    accent: 'bg-[#CC7A68]/10 text-[#CC7A68]',
    info: 'bg-blue-50 text-blue-600',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${variantStyles[variant]} ${className}`}
    >
      {text}
    </motion.span>
  );
}
