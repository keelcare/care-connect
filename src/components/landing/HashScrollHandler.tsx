'use client';

import { useEffect } from 'react';

/**
 * The landing page contains a GSAP-pinned section (ExpertiseScroll) that injects
 * a large pin spacer into the layout *after* hydration. When you arrive at a deep
 * anchor like /welcome#about, the browser's native hash scroll fires before that
 * spacer exists, so it lands too high (in the expertise region) instead of on the
 * real target.
 *
 * This re-scrolls to the hash target a few times while the layout settles, so
 * anchors below the pinned section (#about, #service-card-*, #services, …) land
 * on the right element. It no-ops for hashes with no matching element (e.g.
 * #waitlist, which opens the modal instead).
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

    // Re-scroll as the pin spacers expand the layout over the first ~1.2s.
    const timers = [0, 150, 400, 800, 1200].map((t) => window.setTimeout(scrollToTarget, t));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
