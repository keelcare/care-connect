import React from 'react';

export const FloatingWidget = () => {
  return (
    <div className="absolute bottom-8 right-[-20px] md:right-[-40px] z-20 w-[280px] md:w-[320px] animate-float">
      <div className="bg-white/70 backdrop-blur-md p-5 rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/50 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces" 
            alt="Therapist" 
            className="w-10 h-10 rounded-full object-cover border-2 border-white" 
          />
          <div>
            <p className="text-xs font-bold text-gray-800">Dr. Sarah Mitchell</p>
            <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Online Now
            </p>
          </div>
        </div>
        <div className="bg-white/50 rounded-xl p-3 text-sm text-gray-700 leading-relaxed font-medium">
          "Are you uncomfortable discussing anything from past events now with me?"
        </div>
      </div>
    </div>
  );
};
