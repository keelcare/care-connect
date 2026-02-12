import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Baby, GraduationCap, HeartPulse, ChevronRight, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const containerVars = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const itemVars = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
};

const overlayVars = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const modalVars = {
  hidden: { scale: 0.95, opacity: 0, y: 10 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', damping: 25, stiffness: 300 } 
  },
  exit: { 
    scale: 0.95, 
    opacity: 0, 
    y: 10, 
    transition: { duration: 0.2 } 
  }
};

export function ServiceSelectionModal({ isOpen, onClose }: ServiceSelectionModalProps) {
  const router = useRouter();

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSelect = (service: string) => {
    router.push(`/book-service?service=${service}`);
    onClose();
  };

  return (
    <motion.div
      variants={overlayVars}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        variants={modalVars}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[32px] w-full max-w-3xl shadow-2xl overflow-hidden relative"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100/50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all duration-200 z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-10">
            <h2 className="text-3xl font-display font-semibold text-center text-[#1B3022] mb-3">Which service do you need?</h2>
            <p className="text-gray-500 mb-10 text-center max-w-lg mx-auto leading-relaxed text-lg">
                Select a service to get started. We'll connect you with verified professionals tailored to your needs.
            </p>
            
            <motion.div 
                variants={containerVars}
                initial="hidden"
                animate="show"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
            {/* Child Care */}
            <motion.button
                variants={itemVars}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect('CHILD_CARE')}
                className="flex flex-col items-center p-6 rounded-[24px] transition-all duration-300 border border-transparent hover:border-[#1B3022]/10 hover:shadow-xl bg-gradient-to-br from-[#F2F7F4] to-white group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[#F2F7F4] opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10 text-[#1B3022]">
                <Baby strokeWidth={1.5} className="w-8 h-8" />
                </div>
                <span className="font-heading font-semibold text-lg text-[#1B3022] mb-1 relative z-10">Child Care</span>
                <span className="text-xs text-[#1B3022]/70 font-medium tracking-wide uppercase relative z-10 mb-3">0-6 Years</span>

                <div className="mt-auto w-8 h-8 rounded-full bg-[#1B3022]/10 flex items-center justify-center relative z-10 group-hover:bg-[#1B3022] group-hover:text-white transition-colors duration-300">
                    <ChevronRight size={16} />
                </div>
            </motion.button>

            {/* Shadow Teacher */}
            <motion.button
                variants={itemVars}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect('SHADOW_TEACHER')}
                className="flex flex-col items-center p-6 rounded-[24px] transition-all duration-300 border border-transparent hover:border-[#8DA399]/10 hover:shadow-xl bg-gradient-to-br from-[#F5F8F6] to-white group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[#F5F8F6] opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10 text-[#8DA399]">
                <GraduationCap strokeWidth={1.5} className="w-8 h-8" />
                </div>
                <span className="font-heading font-semibold text-lg text-[#8DA399] mb-1 relative z-10">Shadow Teacher</span>
                <span className="text-xs text-[#8DA399]/70 font-medium tracking-wide uppercase relative z-10 mb-3">Education Support</span>
                
                <div className="mt-auto w-8 h-8 rounded-full bg-[#8DA399]/10 flex items-center justify-center relative z-10 group-hover:bg-[#8DA399] group-hover:text-white transition-colors duration-300">
                    <ChevronRight size={16} />
                </div>
            </motion.button>

            {/* Special Needs */}
            <motion.button
                variants={itemVars}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect('SPECIAL_NEEDS')}
                className="flex flex-col items-center p-6 rounded-[24px] transition-all duration-300 border border-transparent hover:border-[#CC7A68]/10 hover:shadow-xl bg-gradient-to-br from-[#FDF3F1] to-white group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[#FDF3F1] opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10 text-[#CC7A68]">
                <HeartPulse strokeWidth={1.5} className="w-8 h-8" />
                </div>
                <span className="font-heading font-semibold text-lg text-[#CC7A68] mb-1 relative z-10">Special Needs</span>
                <span className="text-xs text-[#CC7A68]/70 font-medium tracking-wide uppercase relative z-10 mb-3">Specialized Care</span>
                
                <div className="mt-auto w-8 h-8 rounded-full bg-[#CC7A68]/10 flex items-center justify-center relative z-10 group-hover:bg-[#CC7A68] group-hover:text-white transition-colors duration-300">
                    <ChevronRight size={16} />
                </div>
            </motion.button>
            </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
