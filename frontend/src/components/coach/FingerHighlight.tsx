import React from 'react';
import { FingerName } from '@/utils/geometry/fingertipContact';
import { HighlightColor, AnimationType } from '@/services/visualCoach';

interface FingerHighlightProps {
  landmarks: { x: number; y: number; z: number }[];
  highlightedFinger: FingerName | null;
  highlightColor: HighlightColor;
  animationType: AnimationType;
}

const colorMap = {
  green: 'rgba(34, 197, 94, 0.7)',
  yellow: 'rgba(245, 158, 11, 0.7)',
  red: 'rgba(239, 68, 68, 0.7)',
  none: 'transparent',
};

// Map each finger to its corresponding tip landmark index
const tipIndices: Record<FingerName, number> = {
  thumb: 4,
  index: 8,
  middle: 12,
  ring: 16,
  little: 20,
};

export const FingerHighlight: React.FC<FingerHighlightProps> = ({ 
  landmarks, 
  highlightedFinger, 
  highlightColor, 
  animationType 
}) => {
  if (!landmarks || landmarks.length === 0 || !highlightedFinger) return null;

  const tipIndex = tipIndices[highlightedFinger];
  const lm = landmarks[tipIndex];

  // Mirrored X because video is flipped
  const x = (1 - lm.x) * 100;
  const y = lm.y * 100;

  const color = colorMap[highlightColor];
  
  if (color === 'transparent') return null;

  let animationClass = '';
  if (animationType === 'pulse') animationClass = 'animate-pulse';
  if (animationType === 'glow') animationClass = 'shadow-[0_0_20px_10px_rgba(34,197,94,0.5)]'; // specifically green glow

  return (
    <div 
      className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full border-4 pointer-events-none z-30 transition-all duration-300 ${animationClass}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        borderColor: color,
        backgroundColor: color.replace('0.7', '0.2'),
      }}
    />
  );
};
