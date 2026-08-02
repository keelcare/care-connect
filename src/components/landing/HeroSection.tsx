'use client';

import { useEffect, useState } from 'react'; // useState kept for isLoaded/scrollY
import CircularText from './CircularText';

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Calculate image translation based on scroll (moves up as you scroll down)
  const imageTranslateY = Math.min(scrollY * 0.5, 400);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-primary-900">
      {/* Video Background with Scroll Effect */}
      <div className="absolute inset-0 overflow-hidden bg-primary-900">
        <div
          className="absolute inset-0 transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: `scale(${isLoaded ? 1 : 1.07}) translateY(-${imageTranslateY}px)`,
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            preload="auto"
            poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/waves.mp4" type="video/mp4" />
          </video>
        </div>
        {/* Overlay for better text readability - using primary-900 tint */}
        <div className="absolute inset-0 bg-primary-900/60" />
        {/* Subtle gradient overlay for extra contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-900 to-transparent" />
      </div>

      {/* Circular Text — desktop only; on mobile it collides with the CTA */}
      <div
        className="pointer-events-none absolute right-12 bottom-12 z-[1] hidden transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:block"
        style={{
          transform: `translateY(-${imageTranslateY}px)`,
        }}
        aria-hidden="true"
      >
        <div
          className="transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded
              ? 'translateY(20%) scale(0.9)'
              : 'translateY(40px) scale(0.9)',
            transitionDelay: '600ms',
          }}
        >
          <CircularText
            text="BACKBONE*OF*CARE*"
            onHover="slowDown"
            spinDuration={20}
            className="opacity-90 font-sans"
          />
        </div>
      </div>

      {/* Content Overlay - centered, nudged down for breathing room below the fixed navbar */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-8 pt-24 pb-16 sm:px-12 sm:pt-28 lg:px-16">
        <div className="w-full max-w-4xl text-center">
          {/* Heading with Typing Effect */}
          <h1
            className="mb-6 text-5xl font-sans font-bold leading-tight tracking-tight text-white transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-lg"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(70px)',
              transitionDelay: '200ms',
            }}
          >
            Where Big Needs Meet <span className="font-serif italic font-medium">Gentle</span> Care
          </h1>

          {/* Subheading — carries the concrete value prop the poetic H1 leaves out */}
          <p
            className="mx-auto mb-9 max-w-2xl font-body text-lg font-medium leading-relaxed text-white/90 drop-shadow-md transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-xl md:text-2xl md:leading-relaxed"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(50px)',
              transitionDelay: '350ms',
            }}
          >
            Vetted shadow teachers and special needs caregivers for families. Background checked and matched to your child.
          </p>

          <div
            className="transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(50px)',
              transitionDelay: '500ms',
            }}
          >
            <a href="/contact">
              <button className="group relative rounded-full bg-white px-10 py-5 text-lg font-bold text-primary-900 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] focus:outline-none focus:ring-4 focus:ring-white/30 active:scale-95 cursor-pointer">
                <span className="relative z-10">Get in touch</span>
                <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-blue-100 to-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
