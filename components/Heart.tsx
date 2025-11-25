import React from 'react';

interface HeartProps {
  onClick: () => void;
  label: string;
  theme?: 'pink' | 'blue'; 
}

export const Heart: React.FC<HeartProps> = ({ onClick, label, theme = 'pink' }) => {
  // Define gradients
  const gradientStops = theme === 'blue' ? (
    <>
      <stop offset="0%" style={{stopColor:'#bae6fd', stopOpacity:1}} />
      <stop offset="50%" style={{stopColor:'#e0f2fe', stopOpacity:1}} />
      <stop offset="100%" style={{stopColor:'#bae6fd', stopOpacity:1}} />
    </>
  ) : (
    // Light Pink Gradient (Very soft)
    <>
      <stop offset="0%" style={{stopColor:'#fce7f3', stopOpacity:1}} /> 
      <stop offset="50%" style={{stopColor:'#fbcfe8', stopOpacity:1}} />
      <stop offset="100%" style={{stopColor:'#f9a8d4', stopOpacity:1}} />
    </>
  );

  const glowColor = theme === 'blue' ? 'bg-blue-300/30' : 'bg-pink-200/40';
  const textColor = theme === 'blue' ? 'text-blue-400/80' : 'text-pink-400/80';

  return (
    <div 
      className="flex flex-col items-center justify-center cursor-pointer group" 
      onClick={onClick}
    >
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Glow effect layer */}
        <div className={`absolute inset-0 ${glowColor} blur-[24px] rounded-full animate-pulse opacity-80`}></div>
        
        {/* Main Heart Shape with Gradient */}
        <div className="relative w-24 h-24 animate-heartbeat transition-transform duration-500 group-hover:scale-110">
            <svg viewBox="0 0 32 29.6" className="w-full h-full drop-shadow-md overflow-visible">
                <defs>
                    <linearGradient id={`heartGradient-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        {gradientStops}
                    </linearGradient>
                    <filter id={`glow-${theme}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <path 
                    d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
                    c6.1-9.3,16-11.8,16-21.2C32,3.8,28.2,0,23.6,0z" 
                    fill={`url(#heartGradient-${theme})`}
                    filter={`url(#glow-${theme})`}
                    opacity="0.95"
                />
            </svg>
            
            {/* Soft inner highlight */}
            <div className="absolute top-3 right-6 w-4 h-3 bg-white/50 blur-[3px] rounded-full rotate-45"></div>
        </div>
      </div>
      
      {label && (
        <p className={`mt-2 ${textColor} font-bold text-base font-serif tracking-widest animate-pulse drop-shadow-sm`}>
          {label}
        </p>
      )}
    </div>
  );
};