import React from "react";

interface ReviewProgressProps {
  progress: number;
  status: string;
}

export const ReviewProgress: React.FC<ReviewProgressProps> = ({
  progress,
  status,
}) => {
  return (
    <div className="glass-card p-8 border border-surface-700/50 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in max-w-md mx-auto">
      {/* Animated icon indicator */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-surface-800" />
        <div 
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin" 
          style={{ animationDuration: "1.5s" }}
        />
        <span className="text-sm font-semibold font-mono text-white">
          {progress}%
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-display font-semibold text-white">
          Analyzing Performance
        </h3>
        <p className="text-sm text-surface-400">
          {status}
        </p>
      </div>

      {/* Progress Bar container */}
      <div className="w-full bg-surface-900 rounded-full h-2 overflow-hidden border border-surface-850">
        <div
          className="bg-primary-600 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-[10px] text-surface-500 uppercase tracking-widest font-mono">
        MediaPipe + Rule Engine
      </span>
    </div>
  );
};
