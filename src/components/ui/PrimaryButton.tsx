import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function PrimaryButton({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  size = 'md',
  fullWidth = false 
}: PrimaryButtonProps) {
  const baseStyles = 'font-semibold rounded-full transition-all duration-200 inline-flex items-center justify-center gap-2';
  
  const variantStyles = {
    primary: 'bg-primary-900 text-white hover:bg-primary-800 shadow-md hover:shadow-lg',
    secondary: 'bg-secondary text-white hover:brightness-110 shadow-md hover:shadow-lg',
    outline: 'border-2 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
}
