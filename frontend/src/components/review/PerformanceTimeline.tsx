import React from "react";
import type { PerformanceFrameResult } from "@/types/review";

interface PerformanceTimelineProps {
  timeline: PerformanceFrameResult[];
}

export const PerformanceTimeline: React.FC<PerformanceTimelineProps> = ({
  timeline,
}) => {
  const getScoreDotColor = (score: number, handDetected: boolean): string => {
    if (!handDetected) return "bg-surface-600";
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const getScoreTextClass = (score: number, handDetected: boolean): string => {
    if (!handDetected) return "text-surface-500";
    if (score >= 75) return "text-green-400 font-semibold";
    if (score >= 50) return "text-amber-400 font-semibold";
    return "text-red-400 font-semibold";
  };

  const formatTime = (sec: number): string => {
    const min = Math.floor(sec / 60);
    const remainingSec = Math.floor(sec % 60);
    const ms = Math.round((sec % 1) * 100);
    return `${min.toString().padStart(2, "0")}:${remainingSec.toString().padStart(2, "0")}.${ms.toString().padEnd(2, "0")}`;
  };

  return (
    <div className="glass-card p-6 border border-surface-700/50">
      <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
        Timeline Analysis Breakdown
      </h3>

      <div className="max-h-96 overflow-y-auto pr-2 space-y-3 scrollbar">
        {timeline.map((frame, idx) => {
          const dotColor = getScoreDotColor(frame.score, frame.handDetected);
          const scoreClass = getScoreTextClass(frame.score, frame.handDetected);

          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-surface-900/40 border border-surface-800/40 hover:border-surface-750 transition-colors gap-4"
            >
              {/* Left: Time and dot */}
              <div className="flex items-center gap-3 shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} />
                <span className="text-xs font-mono text-surface-400">
                  {formatTime(frame.timestamp)}
                </span>
              </div>

              {/* Center: Details */}
              <div className="flex-1 min-w-0">
                {!frame.handDetected ? (
                  <span className="text-xs text-surface-550 italic">Hand Out of Frame</span>
                ) : frame.incorrectFingers.length === 0 ? (
                  <span className="text-xs text-green-400 font-medium">Perfect Alignment</span>
                ) : (
                  <span className="text-xs text-surface-400 truncate block">
                    Correction needed: <span className="text-amber-400 font-medium">{frame.incorrectFingers.join(", ")}</span>
                  </span>
                )}
              </div>

              {/* Right: Accuracy score */}
              <div className="text-right shrink-0">
                <span className={`text-xs font-mono ${scoreClass}`}>
                  {frame.handDetected ? `${frame.score}%` : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
