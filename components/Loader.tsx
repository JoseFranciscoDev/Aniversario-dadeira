import React from 'react';

interface LoaderProps {
  text: string;
}

export const Loader: React.FC<LoaderProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in">
      <div className="relative w-24 h-24">
        {/* Magic Circle Effect */}
        <div className="absolute inset-0 border border-spirit-teal/20 rounded-full animate-[spin_8s_linear_infinite]"></div>
        <div className="absolute inset-2 border border-dotted border-ancient-gold/40 rounded-full animate-[spin_12s_reverse_linear_infinite]"></div>
        
        {/* Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-spirit-teal rounded-full animate-pulse shadow-[0_0_15px_#2dd4bf]"></div>
        </div>
        
        {/* Orbital particles */}
        <div className="absolute top-0 left-1/2 w-1 h-1 bg-cursed-rose rounded-full -translate-x-1/2 animate-[ping_2s_infinite]"></div>
      </div>
      <p className="text-lg font-mono uppercase tracking-widest text-gray-400 animate-pulse text-center max-w-xs">
        {text}
      </p>
    </div>
  );
};