'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { BookOpen, Baby, HeartPulse, LucideIcon } from 'lucide-react';

export const ExpertiseScroll = () => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<SVGGElement>(null);
  const iconsRef = useRef<(SVGGElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Register ScrollTrigger safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  const steps: {
      id: number;
      title: string;
      description: string;
      Icon?: LucideIcon;
  }[] = [
    {
      id: 0,
      title: 'Our Care Expertise',
      description: 'Comprehensive support services tailored to your needs.',
    },
    {
      id: 1,
      title: 'Shadow Teacher',
      description: 'Specialized educational support for unique learning needs.',
      Icon: BookOpen,
    },
    {
      id: 2,
      title: 'Child Care',
      description: 'Verified nannies and sitters for every age.',
      Icon: Baby,
    },
    {
      id: 3,
      title: 'Special Needs',
      description: 'Professional support for unique requirements.',
      Icon: HeartPulse,
    }
  ];

  // Configuration
  const RADIUS = 1500; // Large radius for flat horizon
  const ANGLE_STEP = 25; // Degrees between items
  
  // Total rotation needed: Step 0 is at 0. Step 3 is at 3 * 25 = 75.
  // We rotate the wheel by -75 degrees to bring Step 3 to center.
  const TOTAL_ROTATION = ANGLE_STEP * (steps.length - 1); 

  useEffect(() => {
    if (!triggerRef.current || !wheelRef.current) return;
    
    // Reset refs array
    iconsRef.current = iconsRef.current.slice(0, steps.length);

    const ctx = gsap.context(() => {
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: (value) => {
              const snapStep = 1 / (steps.length - 1);
              return Math.round(value / snapStep) * snapStep;
            },
            duration: { min: 0.2, max: 0.6 },
            delay: 0.1,
            ease: 'power2.out'
          },
          onUpdate: (self) => {
             const p = self.progress;
             const totalSteps = steps.length - 1;
             const stepSize = 1 / totalSteps;
             const index = Math.round(p / stepSize);
             setActiveIndex(Math.min(Math.max(index, 0), totalSteps));
          }
        }
      });

      tl.to(wheelRef.current, {
        rotation: -TOTAL_ROTATION,
        svgOrigin: "0 0",
        ease: "none",
        duration: 1
      }, 0);

      iconsRef.current.forEach((iconGroup, index) => {
          if (!iconGroup) return;
          const angle = index * ANGLE_STEP;
          gsap.set(iconGroup, { rotation: -angle, svgOrigin: "0 0" });
          tl.to(iconGroup, {
             rotation: -angle + TOTAL_ROTATION,
             svgOrigin: "0 0",
             ease: "none",
             duration: 1
          }, 0);
      });

    }, triggerRef);

    // Refresh after layout settles to prevent initial jump
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [TOTAL_ROTATION]);

  return (
    <div id="expertise" ref={triggerRef} className="relative w-full bg-primary-900 overflow-hidden font-sans text-white">
      <div className="h-dvh flex flex-col items-center justify-start py-12 md:py-20 relative">
        
        {/* Title removed - now in ExpertiseIntro */}

        {/* Text Area */}
        <div className="relative z-20 mt-16 sm:mt-24 md:mt-32 h-[200px] sm:h-[220px] md:h-[240px] w-full flex flex-col items-center justify-center text-center px-4 md:px-6 max-w-4xl mx-auto pointer-events-none">
             {steps.map((step, index) => (
                <div 
                  key={step.id} 
                  className={cn(
                    "absolute top-0 left-0 w-full flex flex-col items-center transition-all duration-700",
                    activeIndex === index 
                        ? "opacity-100 transform-none blur-0" 
                        : "opacity-0 translate-y-8 blur-sm scale-95"
                  )}
                >
                   <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-medium text-white mb-3 md:mb-6 leading-tight">
                     {step.title}
                   </h2>
                   <p className="text-sm sm:text-lg md:text-2xl text-white/70 font-serif max-w-xl leading-relaxed">
                     {step.description}
                   </p>
                </div>
             ))}
        </div>

        {/* The Horizon Wheel */}
        {/* Positioned so the top edge (0, -RADIUS) touches the "horizon" line visual */}
        <div className="absolute top-[55%] sm:top-[58%] md:top-[60%] left-1/2 -translate-x-1/2 w-full h-[1000px] z-10 flex justify-center">
           <svg 
              /* ViewBox config: 
                 Center (0,0). 
                 Radius 1500. 
                 Need to see the top part clearly.
                 Left/Right: -1600 to 1600.
                 Top/Bottom: -1600 to -1200 (Active area) but we can just show the whole upper arc.
                 Let's create a box that covers the top sector. 
              */
              viewBox="-1600 -1600 3200 1600" 
              className="w-[3200px] h-[1600px] overflow-visible"
           >
              {/* Definitions */}
              <defs>
                 <linearGradient id="horizon-fade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                 </linearGradient>
              </defs>

              {/* The Rotating Group */}
              <g ref={wheelRef}>
                 
                 {/* The Horizon Line (Circle Rim) */}
                 <circle cx="0" cy="0" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="8 8" />
                 
                 {/* Items */}
                 {steps.map((step, index) => {
                    const angle = index * ANGLE_STEP;
                    
                    const isActive = activeIndex === index;

                    return (
                       <g key={step.id} 
                          transform={`rotate(${angle}) translate(0, -${RADIUS})`}
                         >
                          
                          {/* Anchor/Tick Mark on the wheel */}
                          <line x1="0" y1="0" x2="0" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                          {/* The Icon Container */}
                          {/* Inner group counter-rotates to keep icon upright. Controlled by GSAP. */}
                          <g 
                            ref={(el) => { iconsRef.current[index] = el; }}
                            className="origin-center" // Ensure rotation happens around center of this group (0,0 local)
                          > 
                             {/* Content Wrapper */}
                             <g transform="translate(0, -60)"> {/* Lift icon above the line */}
                                
                                {/* Glow/Circle Background */}
                                <circle 
                                  r={isActive ? 40 : 10} 
                                  className={cn(
                                      "transition-all duration-700 ease-out", 
                                      isActive ? "fill-secondary stroke-white" : "fill-primary-800 stroke-primary-700"
                                  )}
                                  strokeWidth={1.5}
                                />
                                
                                {/* Icon */}
                                {step.Icon && (
                                  <g className={cn("transition-all duration-500", isActive ? "opacity-100 scale-100" : "opacity-0 scale-0")}>
                                      {/* Centering the icon */}
                                      <step.Icon 
                                        size={32}
                                        x={-16}
                                        y={-16}
                                        className="text-primary-900" 
                                      />
                                  </g>
                                )}

                                {/* Dot for inactive state */}
                                <circle r={4} className={cn("fill-primary-300 transition-opacity duration-500", isActive ? "opacity-0" : "opacity-60")} />
                                
                             </g>
                          </g>

                       </g>
                    );
                 })}
              </g>

              {/* Static Center Marker (Red/Accent Line) at Zenith */}
              <line x1="0" y1={-RADIUS - 20} x2="0" y2={-RADIUS + 20} stroke="#CC7A68" strokeWidth="2" className="opacity-80 drop-shadow-lg" />

           </svg>
        </div>

      </div>
      {/* Bottom fade to blend into SafetyPromise warm background */}
      <div className="absolute bottom-0 left-0 right-0 h-5 pointer-events-none" style={{ background: "linear-gradient(to top, hsl(38, 60%, 97%), transparent)" }} />
    </div>
  );
};
