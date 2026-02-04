import React from 'react';
import { LeftPreviewPanel } from './LeftPreviewPanel';
import { RightPreviewPanel } from './RightPreviewPanel';

export const LandingHero = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-16 flex justify-center">
      <div className="w-full relative min-h-[800px] flex flex-col-reverse lg:flex-row items-start lg:items-stretch gap-8 lg:gap-0">
        <LeftPreviewPanel />
        <RightPreviewPanel />
      </div>
    </div>
  );
};
