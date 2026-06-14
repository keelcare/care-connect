'use client';

import React from 'react';
import { motion } from 'framer-motion';
import BookingConfigurator from './BookingConfigurator';

interface SpecialNeedsModalProps {
    onClose: () => void;
    /** When true, renders inner content only (no overlay / outer container). Use inside BookingSheet. */
    embedded?: boolean;
}

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

export default function SpecialNeedsModal({ onClose, embedded = false }: SpecialNeedsModalProps) {
    const content = <BookingConfigurator serviceType="SPECIAL_NEEDS" onClose={onClose} />;

    if (embedded) {
        return <>{content}</>;
    }

    return (
        <motion.div
            variants={overlayVars}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center sm:p-4"
            onClick={onClose}
        >
            <motion.div
                variants={modalVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                className="bg-white sm:rounded-[32px] w-full max-w-5xl h-full sm:h-auto sm:max-h-[85vh] shadow-2xl relative overflow-hidden flex flex-col"
            >
                {content}
            </motion.div>
        </motion.div>
    );
}
