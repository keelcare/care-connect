'use client';

import { useEffect } from 'react';

/**
 * Deep links like /welcome#about or /welcome#service-card-* can land short
 * of the real target: the browser's native hash scroll often fires before
 * images/fonts/layout settle, and the roles section uses sticky stacked cards
 * that change the scroll height as you move.
 *
 * This re-scrolls to the hash target a few times while the layout settles so
 * anchors (#about, #services, #service-card-*, #faq, …) land on the right
 * element. It no-ops for hashes with no matching element (e.g. #waitlist,
 * which opens the modal instead).
 */
export function HashScrollHandler() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;

    let cancelled = false;
    const scrollToTarget = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
    };

    // Re-scroll while sticky cards / media finish laying out over the first ~1.2s.
    const timers = [0, 150, 400, 800, 1200].map((t) => window.setTimeout(scrollToTarget, t));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
