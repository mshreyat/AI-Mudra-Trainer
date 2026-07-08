import React from "react";
import { ProgressRing } from "../tutor/ProgressRing";

interface PerformanceSummaryProps {
  expectedMudra: string;
  averageAccuracy: number;
  durationSeconds: number;
  totalFrames: number;
  detectedFrames: number;
}

export const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({
  expectedMudra,
  averageAccuracy,
  durationSeconds,
  totalFrames,
  detectedFrames,
}) => {
  return (
    <div className="glass-card p-6 border border-surface-700/50 flex flex-col md:flex-row items-center gap-6 justify-between">
      <div className="space-y-4 text-center md:text-left">
        <div>
          <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider block mb-1">
            Mudra Reviewing
          </span>
          <h2 className="text-3xl font-display font-bold text-white">
            {expectedMudra}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-[10px] text-surface-500 uppercase tracking-wider block">
              Video Duration
            </span>
            <span className="text-sm font-semibold text-surface-200">
              {durationSeconds}s
            </span>
          </div>
          <div>
            <span className="text-[10px] text-surface-500 uppercase tracking-wider block">
              Hand Detected
            </span>
            <span className="text-sm font-semibold text-surface-200">
              {detectedFrames} / {totalFrames} frames
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] text-surface-500 uppercase tracking-wider block">
              Detection Rate
            </span>
            <span className="text-sm font-semibold text-surface-200">
              {totalFrames > 0 ? Math.round((detectedFrames / totalFrames) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center shrink-0 space-y-2">
        <ProgressRing score={averageAccuracy} size={130} strokeWidth={10} />
        <span className="text-xs font-semibold text-surface-450 uppercase tracking-widest block">
          Average Accuracy
        </span>
      </div>
    </div>
  );
};
