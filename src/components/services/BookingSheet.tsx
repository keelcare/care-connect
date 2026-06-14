'use client';

import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X } from 'lucide-react';

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */
interface BookingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  /** Content inside the sheet / modal */
  children: React.ReactNode;
  /** Optional title shown in the header area (used as aria-label) */
  ariaLabel?: string;
}

/* ─────────────────────────────────────────────
   Utility: focus trap
───────────────────────────────────────────── */
const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

function useFocusTrap(ref: React.RefObject<HTMLDivElement | null>, active: boolean) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const focusable = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusable.length) focusable[0].focus();

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    el.addEventListener('keydown', handleTab);
    return () => el.removeEventListener('keydown', handleTab);
  }, [active, ref]);
}

/* ─────────────────────────────────────────────
   BookingSheet
───────────────────────────────────────────── */
export function BookingSheet({ isOpen, onClose, children, ariaLabel }: BookingSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Mount guard (SSR safe) */
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  /* Detect mobile breakpoint */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* Body scroll lock */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  /* Focus trap */
  useFocusTrap(containerRef, isOpen);

  /* Swipe-down dismiss */
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > 120 || info.velocity.y > 500) {
        onClose();
      }
    },
    [onClose]
  );

  if (!mounted) return null;

  /* ── Animation variants ── */

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  /* Bottom Sheet (mobile) */
  const sheetVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 28, stiffness: 300 },
    },
    exit: {
      y: '100%',
      opacity: 0,
      transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
    },
  };

  /* Dialog (desktop) */
  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 12 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', damping: 28, stiffness: 320 },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: 12,
      transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
    },
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        /* Backdrop */
        <motion.div
          key="bs-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-[2px]"
          onClick={onClose}
          role="presentation"
          aria-hidden="true"
        >
          {isMobile ? (
            /* ══════════ MOBILE — Bottom Sheet ══════════ */
            <motion.div
              key="bs-sheet"
              ref={containerRef}
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={handleDragEnd}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={ariaLabel}
              className={[
                'absolute bottom-0 inset-x-0',
                'bg-white',
                'rounded-t-[28px]',
                'shadow-[0_-8px_40px_rgba(13,43,69,0.18)]',
                /* ~85% of viewport height */
                'h-[88dvh]',
                'flex flex-col',
                'overflow-hidden',
                /* safe area inset for home bar */
                'pb-[env(safe-area-inset-bottom)]',
              ].join(' ')}
            >
              {/* Drag handle */}
              <div className="pt-3 pb-1 flex justify-center shrink-0">
                <div className="w-10 h-1 rounded-full bg-[hsl(var(--border))]" />
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close"
                className={[
                  'absolute top-3 right-4',
                  'w-8 h-8 rounded-full flex items-center justify-center',
                  'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
                  'hover:bg-[hsl(var(--border))] transition-colors',
                ].join(' ')}
              >
                <X size={16} />
              </button>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {children}
              </div>
            </motion.div>
          ) : (
            /* ══════════ DESKTOP — Centered Modal ══════════ */
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div
                key="bs-dialog"
                ref={containerRef}
                variants={dialogVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                className={[
                  'relative w-full max-w-5xl',
                  'max-h-[88vh]',
                  'bg-white rounded-[28px]',
                  'shadow-[0_24px_64px_rgba(13,43,69,0.22)]',
                  'flex flex-col overflow-hidden',
                ].join(' ')}
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className={[
                    'absolute top-4 right-4 z-10',
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
                    'hover:bg-[hsl(var(--border))] hover:text-[hsl(var(--foreground))]',
                    'transition-colors duration-150',
                  ].join(' ')}
                >
                  <X size={16} />
                </button>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto overscroll-contain">
                  {children}
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
