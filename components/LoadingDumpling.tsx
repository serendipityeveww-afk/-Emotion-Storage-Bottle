import React, { useEffect, useRef, useState } from 'react';

export const LoadingDumpling: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [progress, setProgress] = useState(0);
  const [expression, setExpression] = useState<'neutral' | 'thinking' | 'happy'>('neutral');
  const [isBlinking, setIsBlinking] = useState(false);

  // Mouse tracking logic (Parallax)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Limit the movement range
      const limit = 8; // Increased range slightly
      const dx = Math.min(Math.max((e.clientX - centerX) / 10, -limit), limit);
      const dy = Math.min(Math.max((e.clientY - centerY) / 10, -limit), limit);
      
      setEyePos({ x: dx, y: dy });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Blinking Logic
  useEffect(() => {
    const blinkLoop = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200); // Blink duration
      
      // Random next blink between 2s and 6s
      const nextBlink = Math.random() * 4000 + 2000;
      setTimeout(blinkLoop, nextBlink);
    };
    
    const timeoutId = setTimeout(blinkLoop, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  // Simulation of Progress and Expression Changes
  useEffect(() => {
    const duration = 2500; // Total loading time
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
        currentStep++;
        const newProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
        setProgress(newProgress);

        // Change expression based on progress
        if (newProgress < 30) {
            setExpression('neutral');
        } else if (newProgress < 80) {
            setExpression('thinking');
        } else {
            setExpression('happy');
        }

        if (currentStep >= steps) {
            clearInterval(timer);
        }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Visual States
  const isHappy = expression === 'happy';
  const isThinking = expression === 'thinking';
  
  // Render Eyes
  const renderEye = (isRight: boolean) => {
    if (isBlinking) {
       return <div className="w-4 h-0.5 bg-stone-700 rounded-full mt-1.5"></div>;
    }

    if (isHappy) {
       return <div className="w-5 h-2 border-t-2 border-stone-700 rounded-full mt-2"></div>;
    }
    
    // Normal Dot Eye
    return <div className="w-3 h-3 bg-stone-700 rounded-full"></div>;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-10 animate-float">
      {/* The Dumpling Character */}
      <div 
        ref={containerRef}
        className="relative w-36 h-32 bg-white rounded-[50%_50%_45%_45%] shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-stone-100 flex items-center justify-center transition-transform duration-300 hover:scale-105"
      >
        {/* Soft blush - Intensifies when happy */}
        <div className={`absolute top-16 left-5 w-6 h-3 bg-rose-200/40 rounded-full blur-[3px] transition-all duration-500 ${isHappy ? 'bg-rose-300/60 scale-125' : ''}`}></div>
        <div className={`absolute top-16 right-5 w-6 h-3 bg-rose-200/40 rounded-full blur-[3px] transition-all duration-500 ${isHappy ? 'bg-rose-300/60 scale-125' : ''}`}></div>

        {/* Face Container */}
        <div className="relative flex flex-col items-center justify-center space-y-3 transition-transform duration-200 ease-out"
             style={{ transform: isHappy ? 'translate(0, -2px)' : `translate(${eyePos.x}px, ${eyePos.y}px)` }}>
            
            {/* Eyes */}
            <div className="flex gap-9">
                <div className="relative w-4 h-4 flex items-center justify-center">{renderEye(false)}</div>
                <div className="relative w-4 h-4 flex items-center justify-center">{renderEye(true)}</div>
            </div>
            
            {/* Mouth */}
            <div className={`transition-all duration-300 border-stone-600 ${
                isThinking 
                    ? 'w-2 h-2 border-2 rounded-full bg-transparent translate-y-1' // 'O' mouth small
                    : isHappy
                        ? 'w-4 h-2 border-b-2 rounded-full mt-1 scale-110' // Smile
                        : 'w-3 h-1 border-b-2 rounded-full' // Neutral
            }`}></div>
        </div>

        {/* Highlight */}
        <div className="absolute top-5 left-7 w-8 h-4 bg-white rounded-full blur-[1px] opacity-90"></div>
      </div>

      {/* Percentage Loading Bar */}
      <div className="flex flex-col items-center space-y-3 w-72">
          <div className="flex justify-between w-full text-xs font-serif text-stone-400 tracking-widest px-1">
             <span>我们一起重新看见你的感受</span>
             <span>{progress}%</span>
          </div>
          
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden border border-stone-50">
              <div 
                className="h-full bg-stone-800/80 rounded-full transition-all duration-100 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
          </div>
          
          <p className="text-[10px] text-stone-300 font-serif italic pt-1 h-4 transition-opacity duration-500 text-center min-w-full">
             {expression === 'thinking' ? "正在斟酌温暖的词句..." : expression === 'happy' ? "找到了！" : ""}
          </p>
      </div>
    </div>
  );
};
