import React from 'react';
import { Flower } from 'lucide-react';

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Flower className="w-6 h-6 text-white" strokeWidth={1.5} />
      <span className="font-medium text-white text-lg tracking-tight">Keel</span>
    </div>
  );
};
