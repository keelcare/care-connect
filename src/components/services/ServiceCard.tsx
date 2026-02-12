import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { BadgePill } from '@/components/ui/BadgePill';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  badge?: {
    text: string;
    variant?: 'primary' | 'secondary' | 'accent' | 'info';
  };
  pricing?: {
    label: string;
    sublabel?: string;
  };
  imagePlaceholder?: ReactNode;
  onClick: () => void;
  delay?: number;
}

export function ServiceCard({
  title,
  description,
  badge,
  pricing,
  imagePlaceholder,
  onClick,
  delay = 0,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white rounded-[24px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      {/* Image Placeholder Section */}
      <div className="relative h-48 bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
        {imagePlaceholder && (
          <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            {imagePlaceholder}
          </div>
        )}
        
        {/* Floating Badge */}
        {badge && (
          <div className="absolute top-4 right-4">
            <BadgePill text={badge.text} variant={badge.variant} />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-2xl font-display font-bold text-primary-900 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 font-body mb-6 leading-relaxed">
          {description}
        </p>

        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          {/* Pricing Info */}
          {pricing && (
            <div>
              <p className="text-lg font-semibold text-primary-900">
                {pricing.label}
              </p>
              {pricing.sublabel && (
                <p className="text-sm text-gray-500">{pricing.sublabel}</p>
              )}
            </div>
          )}

          {/* Button */}
          <PrimaryButton size="sm" className="group-hover:brightness-110">
            Book Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </PrimaryButton>
        </div>
      </div>
    </motion.div>
  );
}
