import React from 'react';
import { FingerName } from '@/utils/geometry/fingertipContact';

interface CoachBubbleProps {
  landmarks: { x: number; y: number; z: number }[];
  highlightedFinger: FingerName | null;
  message: string | null;
}

// Map each finger to its corresponding tip landmark index
const tipIndices: Record<FingerName, number> = {
  thumb: 4,
  index: 8,
  middle: 12,
  ring: 16,
  little: 20,
};

export const CoachBubble: React.FC<CoachBubbleProps> = ({ landmarks, highlightedFinger, message }) => {
  if (!landmarks || landmarks.length === 0 || !message || !highlightedFinger) return null;

  const tipIndex = tipIndices[highlightedFinger];
  const lm = landmarks[tipIndex];

  // Mirrored X because video is flipped
  const x = (1 - lm.x) * 100;
  const y = lm.y * 100;

  return (
    <div 
      className="absolute pointer-events-none z-40 transition-all duration-500 ease-out"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -150%)', // Position above the finger tip
      }}
    >
      <div className="bg-surface-950/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-surface-700/80 shadow-2xl flex items-center gap-2 whitespace-nowrap">
        {/* Simple elegant icon - could adjust based on message content, but keeping it minimal */}
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div>
        <span className="text-sm font-medium text-white tracking-wide">{message}</span>
      </div>
      {/* Downward triangle/caret */}
      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-surface-700/80 mx-auto mt-[-1px]"></div>
    </div>
  );
};
