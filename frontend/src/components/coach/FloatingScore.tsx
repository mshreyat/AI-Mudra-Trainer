import React, { useEffect, useState } from 'react';

interface FloatingScoreProps {
  score: number;
}

export const FloatingScore: React.FC<FloatingScoreProps> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(score);

  // Smoothly interpolate score changes
  useEffect(() => {
    let animationFrameId: number;
    let currentScore = displayScore;
    
    const animate = () => {
      const diff = score - currentScore;
      if (Math.abs(diff) < 0.5) {
        setDisplayScore(score);
        return;
      }
      
      currentScore += diff * 0.1; // Ease towards target
      setDisplayScore(currentScore);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [score]); // intentionally omitting displayScore to avoid dependency loop

  const roundedScore = Math.round(displayScore);
  const isCorrect = roundedScore >= 80;

  return (
    <div className="absolute top-6 right-6 z-40 bg-surface-950/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-surface-700/50 shadow-2xl flex items-center gap-4 transition-colors duration-500">
      <div className="flex flex-col items-end">
        <span className="text-xs font-semibold text-surface-400 uppercase tracking-widest mb-1">Accuracy</span>
        <span className={`text-3xl font-display font-bold tabular-nums transition-colors duration-500 ${isCorrect ? 'text-green-400' : 'text-white'}`}>
          {roundedScore}%
        </span>
      </div>
      
      {/* Mini circular progress */}
      <div className="relative w-12 h-12">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="currentColor"
            className="text-surface-800"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke={isCorrect ? '#22c55e' : '#f59e0b'}
            strokeWidth="3"
            strokeDasharray="100"
            strokeDashoffset={100 - roundedScore}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>
      </div>
    </div>
  );
};
