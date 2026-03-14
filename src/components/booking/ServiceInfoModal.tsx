'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ServiceInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

export function ServiceInfoModal({ isOpen, onClose, category }: ServiceInfoModalProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      const fetchInfo = async () => {
        setLoading(true);
        try {
          // Map category to file suffix
          const categoryMap: Record<string, string> = {
            'Child Care': 'CC',
            'Shadow Teacher': 'ST',
            'Special Needs': 'SN',
            'Pet Care': 'PC',
            'Housekeeping': 'HK',
          };

          const suffix = categoryMap[category] || 'general';
          const response = await fetch(`/info-${suffix}.md`);
          
          if (!response.ok) {
            setContent('No information available for this service.');
            return;
          }

          const text = await response.text();
          setContent(text.trim());
        } catch (error) {
          console.error('Failed to fetch service info:', error);
          setContent('Failed to load service information.');
        } finally {
          setLoading(false);
        }
      };

      fetchInfo();
    }
  }, [isOpen, category]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Info size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-900 font-display">Service Information</h2>
                <p className="text-xs text-neutral-500 uppercase tracking-widest">{category}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-500 hover:text-neutral-900"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-neutral-50/50">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                <p className="text-sm text-neutral-500 font-medium">Loading information...</p>
              </div>
            ) : (
              <div className="prose prose-neutral max-w-none prose-h1:text-2xl prose-h1:font-bold prose-h1:font-display prose-p:text-neutral-600 prose-p:leading-relaxed prose-li:text-neutral-600">
                <ReactMarkdown
                    components={{
                        h1: ({node, ...props}) => <h1 className="text-2xl font-bold font-display mb-4 text-neutral-900" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-xl font-bold font-display mb-3 mt-6 text-neutral-900" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-neutral-600" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4 space-y-2" {...props} />,
                        li: ({node, ...props}) => <li className="text-neutral-600" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-neutral-900" {...props} />,
                    }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-neutral-100 bg-white shrink-0 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-neutral-900 text-white font-bold text-sm hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-900/10"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
