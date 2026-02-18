'use client';

import React from 'react';
import ScrollFloat from './ScrollFloat';

export const ExpertiseIntro = () => {
  return (
    <section className="min-h-dvh bg-primary-900 flex items-center justify-center px-6">
      <ScrollFloat
        animationDuration={1}
        ease="back.inOut(2)"
        scrollStart="center bottom+=50%"
        scrollEnd="bottom bottom-=40%"
        stagger={0.03}
        containerClassName="!text-white"
        textClassName="font-display font-medium"
      >
        Our Care Expertise
      </ScrollFloat>
    </section>
  );
};
