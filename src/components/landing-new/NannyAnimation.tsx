"use client";
import React, { useRef, MouseEvent } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

const NannyAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax Y movement: Moves against scroll for depth
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  
  // Scale: Enters small, grows to full presence, shrinks slightly on exit
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.8], [0.85, 1, 0.95]);
   
  // Opacity: Fade in quickly, stay visible until almost strictly out of view
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.9, 1], [0, 1, 1, 0]);

  // -- 3D TILT LOGIC --
  const x = useMotionValue(0);
  const yMove = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 30 });
  const mouseY = useSpring(yMove, { stiffness: 150, damping: 30 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  // Gloss moves opposite to rotation for realistic sheen
  const glossX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glossY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate mouse position from center (-0.5 to 0.5)
    // 0 = left/top, 1 = right/bottom
    const mouseXPos = (event.clientX - rect.left) / width; 
    const mouseYPos = (event.clientY - rect.top) / height;
    
    x.set(mouseXPos - 0.5);
    yMove.set(mouseYPos - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    yMove.set(0);
  }

  return (
    <div ref={containerRef} className="w-full flex justify-center items-center relative py-12 px-6 perspective-[1000px]">
       
       <motion.div
        style={{ 
            y, 
            scale, 
            opacity,
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-lg rounded-[48px] overflow-hidden shadow-2xl border-[6px] border-white/40 cursor-pointer bg-white"
       >
         {/* Inner Cinematic Breathe for organic 'alive' feeling (Subtle scale only) */}
         <motion.div
            className="w-full h-full transform-gpu"
         >
             <img 
                src="/sunandcare.png" 
                alt="Compassionate Care" 
                className="w-full h-auto object-cover pointer-events-none" 
             />
         </motion.div>

         {/* Premium Dynamic Gloss Sheen */}
         <motion.div 
            style={{ 
                background: `radial-gradient(circle at ${glossX} ${glossY}, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)`,
                opacity: 0.8
            }}
            className="absolute inset-0 pointer-events-none mix-blend-overlay z-10" 
         />
         
         {/* Subtle Border Light for Glass Edge */}
         <div className="absolute inset-0 rounded-[42px] ring-1 ring-white/50 pointer-events-none z-20" />
       </motion.div>
    </div>
  );
};

export default NannyAnimation;
