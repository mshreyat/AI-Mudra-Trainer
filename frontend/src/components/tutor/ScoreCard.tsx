import React from "react";
import { ProgressRing } from "./ProgressRing";

interface ScoreCardProps {
  /** Smoothed overall score (0–100). */
  score: number;
  /** Name of the mudra being practiced. */
  mudraName: string;
  /** Whether the hand currently matches the target mudra. */
  isCorrect: boolean;
  /** Performance band (e.g., Excellent, Good). */
  performanceBand?: string;
  /** Whether the mudra has been successfully held for 3 seconds. */
  isCompleted?: boolean;
  /** Whether a hand is currently being tracked. */
  isTracking: boolean;
}

/**
 * Glass-card panel displaying the overall score via a ProgressRing,
 * the mudra name, and a live status indicator.
 */
export const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  mudraName,
  isCorrect,
  performanceBand,
  isCompleted,
  isTracking,
}) => {
  const statusText = !isTracking
    ? "Waiting for hand..."
    : isCompleted
      ? "Completed!"
      : performanceBand || "Keep adjusting...";

  const statusColor = !isTracking
    ? "text-surface-400"
    : isCompleted
      ? "text-green-400 font-bold"
      : isCorrect
        ? "text-primary-300"
        : "text-amber-400";

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-5">
        Overall Score
      </h3>

      <div className="flex flex-col items-center relative">
        <ProgressRing score={isTracking ? score : 0} size={140} strokeWidth={10} />
        
        {isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-full rounded-full border-4 border-green-500/50 animate-ping absolute top-0 left-0"></div>
          </div>
        )}

        <div className="mt-5 text-center">
          <p className="text-lg font-display font-semibold text-white tracking-tight">
            {mudraName}
          </p>
          <p className={`text-sm font-medium mt-1 transition-colors duration-300 ${statusColor}`}>
            {statusText}
          </p>
        </div>
      </div>
    </div>
  );
};
