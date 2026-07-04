import React from 'react';
import { FingerName } from '@/utils/geometry/fingertipContact';
import { HighlightColor } from '@/services/visualCoach';

interface FingerOverlayProps {
  landmarks: { x: number; y: number; z: number }[];
  fingerColors: Record<FingerName, HighlightColor>;
}

const colorMap = {
  green: '#22c55e',
  yellow: '#f59e0b',
  red: '#ef4444',
  none: 'transparent',
};

const fingerIndices = {
  thumb: [0, 1, 2, 3, 4],
  index: [0, 5, 6, 7, 8],
  middle: [0, 9, 10, 11, 12],
  ring: [0, 13, 14, 15, 16],
  little: [0, 17, 18, 19, 20],
};

export const FingerOverlay: React.FC<FingerOverlayProps> = ({ landmarks, fingerColors }) => {
  if (!landmarks || landmarks.length === 0) return null;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
      {(Object.keys(fingerIndices) as FingerName[]).map((finger) => {
        const color = colorMap[fingerColors[finger]];
        if (color === 'transparent') return null;

        const indices = fingerIndices[finger];
        
        // Build the SVG path string
        const d = indices.map((idx, i) => {
          const lm = landmarks[idx];
          // x is scaled up to 100%, need to handle mirroring if CameraView does scale-x[-1]
          // The canvas itself is transformed, but this SVG might sit on top of a transformed container.
          // Wait, CameraView flips the video horizontally `scale-x-[-1]`. We should position normally 
          // and let the SVG inherit or we explicitly scale it.
          // If we put this SVG inside a div that is NOT flipped, we need to flip X (1 - lm.x).
          // We will flip X here to match the mirrored video.
          const x = (1 - lm.x) * 100;
          const y = lm.y * 100;
          return `${i === 0 ? 'M' : 'L'} ${x}% ${y}%`;
        }).join(' ');

        return (
          <path
            key={finger}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors duration-500 ease-out shadow-lg drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
          />
        );
      })}
    </svg>
  );
};
