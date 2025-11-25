import React, { useEffect, useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface GlassJarProps {
  noteCount: number;
  isShaking?: boolean;
  onClick?: () => void;
  showLid?: boolean;
  centerContent?: React.ReactNode;
  onOpenGallery?: () => void;
  onOpenRandom?: () => void;
}

export const GlassJar: React.FC<GlassJarProps> = ({ 
  noteCount, 
  isShaking, 
  onClick, 
  showLid = true,
  centerContent,
  onOpenGallery,
  onOpenRandom
}) => {
  const [settledStars, setSettledStars] = useState<{left: number, bottom: number, rot: number, size: number}[]>([]);

  // Accumulate stars over time logic
  useEffect(() => {
    // Determine max stars based on note count or just time running
    // We'll just let it accumulate slowly up to a visual limit to simulate "time passing"
    const maxSettled = 50; 
    
    const interval = setInterval(() => {
        setSettledStars(prev => {
            if (prev.length >= maxSettled) return prev;
            return [...prev, {
                left: Math.random() * 80 + 10,
                bottom: Math.random() * 15 + 2, // Pile at bottom
                rot: Math.random() * 360,
                size: Math.random() * 6 + 10
            }];
        });
    }, 2000); // Add a star every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Generate deterministic "notes" inside the jar based on count
  const renderNotes = () => {
    const notes = [];
    const maxVisualNotes = Math.min(noteCount, 60); 
    
    for (let i = 0; i < maxVisualNotes; i++) {
      const left = (i * 13 + 7) % 80 + 5;
      const top = (95 - (i * 2)) % 90 + 5;
      const rotation = (i * 67) % 360;
      
      // Light Pink & Mint Pastel Palette for notes
      const colors = ['#fdf2f8', '#fff1f2', '#ecfdf5', '#fffbe6'];
      const color = colors[i % colors.length];

      notes.push(
        <div
          key={i}
          className="absolute rounded-sm shadow-sm border border-white/40 transition-all duration-700"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: '32px',
            height: '32px',
            transform: `rotate(${rotation}deg) scale(${0.8 + (i % 4) * 0.05})`,
            backgroundColor: color,
            opacity: 0.9,
            boxShadow: '1px 2px 4px rgba(0,0,0,0.05)',
            zIndex: 10 + i
          }}
        >
            <div className="w-3/4 h-[1px] bg-stone-400/10 mx-auto mt-2 rounded-full"></div>
            <div className="w-1/2 h-[1px] bg-stone-400/10 mx-auto mt-1 rounded-full"></div>
        </div>
      );
    }
    return notes;
  };

  // Render falling stars overlay
  const renderFallingStars = () => {
    return Array.from({ length: 8 }).map((_, i) => {
        const left = Math.random() * 60 + 20;
        const delay = Math.random() * 5;
        const duration = 4 + Math.random() * 3;
        const size = Math.random() * 8 + 12;
        return (
            <div 
                key={`falling-star-${i}`}
                className="absolute text-yellow-300 drop-shadow-[0_0_2px_rgba(253,224,71,0.8)] z-30 pointer-events-none animate-fall-spin"
                style={{
                    left: `${left}%`,
                    top: '-10%',
                    fontSize: `${size}px`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`
                }}
            >
                ★
            </div>
        )
    });
  }

  // Render accumulated stars at bottom
  const renderSettledStars = () => {
      return settledStars.map((star, i) => (
          <div
            key={`settled-${i}`}
            className="absolute text-yellow-300/80 drop-shadow-sm transition-opacity duration-1000"
            style={{
                left: `${star.left}%`,
                bottom: `${star.bottom}%`,
                transform: `rotate(${star.rot}deg)`,
                fontSize: `${star.size}px`,
                zIndex: 25 // Just above notes, below glass front
            }}
          >
              ★
          </div>
      ));
  }

  return (
    <div 
      className={`relative w-80 h-[32rem] mx-auto transition-transform duration-300 ${isShaking ? 'animate-jar-shake' : ''} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Falling Stars Animation Layer */}
      {renderFallingStars()}

      {/* --- 3D Lid Area & Hanging Charms --- */}
      {showLid && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-64 h-20 z-50">
            {/* 3D Wood Lid Structure - Lighter Cork */}
            <div className="relative w-full h-full">
                {/* Lid Top Face */}
                <div className="absolute top-0 w-full h-12 bg-[#f3e6da] rounded-t-lg z-20 
                                border-t border-white/60 shadow-inner"
                     style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.1\'/%3E%3C/svg%3E")',
                        boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.8)'
                     }}>
                </div>
                
                {/* Lid Side Face */}
                <div className="absolute top-10 w-full h-6 bg-[#e6d0bf] rounded-b-md z-10 border-b-2 border-[#d4bea8] shadow-lg flex items-end justify-center">
                     <div className="w-[90%] h-[1px] bg-[#d4bea8]/40 mb-2"></div>
                </div>
            </div>

            {/* Hanging Buttons (Charms) - Light Pink Style */}
            {(onOpenGallery || onOpenRandom) && (
              <div className="absolute top-12 left-0 w-full flex justify-between px-[-10px] z-30 pointer-events-none">
                 
                 {/* Open Gallery Charm */}
                 {onOpenGallery && (
                   <div className="pointer-events-auto relative group" style={{ left: '-10px' }}>
                       <div className="absolute -top-4 left-1/2 w-[1px] h-6 bg-pink-200"></div>
                       <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-pink-300 rounded-full"></div>
                       
                       <button 
                          onClick={(e) => { e.stopPropagation(); onOpenGallery(); }}
                          className="relative top-2 bg-[#fff5f7] border-b-4 border-pink-200 text-pink-700/80 
                                     text-[11px] font-bold px-3 py-2 rounded-xl shadow-md flex items-center gap-1
                                     transform transition-all group-hover:-translate-y-1 group-hover:shadow-lg active:translate-y-0 active:border-b-0 active:mt-[4px]"
                       >
                          <BookOpen size={14} className="text-pink-400" />
                          打开看看
                       </button>
                   </div>
                 )}

                 {/* Random Charm */}
                 {onOpenRandom && (
                    <div className="pointer-events-auto relative group" style={{ right: '-10px' }}>
                       <div className="absolute -top-4 left-1/2 w-[1px] h-6 bg-pink-200"></div>
                       <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-pink-300 rounded-full"></div>

                       <button 
                          onClick={(e) => { e.stopPropagation(); onOpenRandom(); }}
                          className="relative top-2 bg-[#fff5f7] border-b-4 border-pink-200 text-pink-700/80 
                                     text-[11px] font-bold px-3 py-2 rounded-xl shadow-md flex items-center gap-1
                                     transform transition-all group-hover:-translate-y-1 group-hover:shadow-lg active:translate-y-0 active:border-b-0 active:mt-[4px]"
                       >
                         <Sparkles size={14} className="text-pink-400" />
                         随机治愈
                       </button>
                    </div>
                 )}
              </div>
            )}
        </div>
      )}

      {/* --- Jar Body --- */}
      <div className="absolute inset-0 z-10">
        
        {/* 1. Back Glass Layer (Clearer, Minty-Pink Tint) */}
        <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-b from-white/20 via-emerald-50/5 to-pink-50/10 
                        border-[1px] border-white/50 backdrop-blur-[2px] shadow-inner"></div>

        {/* 2. Notes & Stars Layer */}
        <div className="absolute inset-4 bottom-8 rounded-[2.5rem] overflow-hidden z-20">
            {renderNotes()}
            {renderSettledStars()}
        </div>

        {/* 3. Center Content (The Heart) */}
        {centerContent && (
           <div className="absolute inset-0 flex items-center justify-center z-40 pb-12 pl-1 pt-16">
               <div className="relative group hover:scale-105 transition-transform duration-300">
                  {centerContent}
               </div>
           </div>
        )}

        {/* 4. Front Glass Overlay (Reflections, Highlights) */}
        <div className="absolute inset-0 rounded-[3rem] z-30 pointer-events-none 
                        border-4 border-white/30 
                        shadow-[0_20px_50px_-12px_rgba(20,184,166,0.1),inset_0_0_40px_rgba(255,255,255,0.6)]
                        bg-gradient-to-tr from-white/10 via-transparent to-white/10">
            
            {/* Left High Gloss Highlight */}
            <div className="absolute top-16 left-5 w-4 h-32 bg-gradient-to-b from-white/80 via-white/30 to-transparent rounded-full blur-[3px]"></div>
            
            {/* Right Rim Highlight */}
            <div className="absolute top-16 right-6 w-1.5 h-20 bg-white/60 rounded-full blur-[1px]"></div>
            
            {/* Bottom Curve Reflection */}
            <div className="absolute bottom-3 left-10 right-10 h-6 bg-gradient-to-t from-pink-100/20 to-transparent rounded-[50%] blur-md"></div>
        </div>
      </div>
      
      {/* --- Label on Jar --- */}
      <div className="absolute top-[28%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
        <div className="bg-[#fffdfb] px-6 py-4 min-w-[150px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] 
                        border border-stone-100 rounded-[2px] relative rotate-[-1deg]
                        before:content-[''] before:absolute before:inset-0 before:border-[1px] before:border-[#f7f0e7] before:m-1">
            
            <div className="absolute inset-0 opacity-5 bg-repeat" style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h4v4H0z' fill='%23000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
            }}></div>

            <h2 className="text-3xl font-bold text-stone-600 tracking-[0.2em] leading-none text-center font-serif whitespace-nowrap drop-shadow-sm">
                停止自怜
            </h2>
        </div>
      </div>
    </div>
  );
};