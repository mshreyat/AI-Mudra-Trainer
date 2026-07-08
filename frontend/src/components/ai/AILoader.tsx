import React from "react";

/**
 * Subtle shimmer loading animation for the AI Coach.
 * Simulates Guru thinking using a premium pulse effect.
 */
export const AILoader: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 py-2 animate-pulse-slow">
      <div className="flex items-center gap-2">
        {/* Shimmering circle representing the Guru avatar */}
        <div className="w-5 h-5 rounded-full bg-surface-700/60 shimmer" />
        <span className="text-xs font-medium text-surface-400">
          Guru is thinking...
        </span>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-surface-700/60 rounded w-full shimmer" />
        <div className="h-4 bg-surface-700/60 rounded w-5/6 shimmer" />
        <div className="h-4 bg-surface-700/60 rounded w-2/3 shimmer" />
      </div>
    </div>
  );
};
