import React from "react";
import type { FingerStatistics } from "@/types/analytics";
import type { FingerName } from "@/utils/geometry/fingertipContact";

interface FingerHeatmapProps {
  /** Per-finger cumulative mistake counts. */
  fingerStats: FingerStatistics;
}

const FINGER_ORDER: { key: FingerName; label: string }[] = [
  { key: "thumb", label: "Thumb" },
  { key: "index", label: "Index" },
  { key: "middle", label: "Middle" },
  { key: "ring", label: "Ring" },
  { key: "little", label: "Little" },
];

/**
 * Intensity color based on mistake ratio (0 to 1).
 * More mistakes → warmer / redder color.
 */
const getIntensityClasses = (ratio: number): { bg: string; dot: string } => {
  if (ratio >= 0.8) return { bg: "bg-red-500", dot: "bg-red-400" };
  if (ratio >= 0.6) return { bg: "bg-orange-500", dot: "bg-orange-400" };
  if (ratio >= 0.4) return { bg: "bg-amber-500", dot: "bg-amber-400" };
  if (ratio >= 0.2) return { bg: "bg-yellow-500", dot: "bg-yellow-400" };
  return { bg: "bg-green-500", dot: "bg-green-400" };
};

/**
 * Visual display of per-finger mistake frequency.
 * Higher mistakes = warmer colors (red), lower = cooler (green).
 */
export const FingerHeatmap: React.FC<FingerHeatmapProps> = ({ fingerStats }) => {
  const totalMistakes = Object.values(fingerStats).reduce((a, b) => a + b, 0);

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
        Finger Accuracy
      </h3>

      {totalMistakes === 0 ? (
        <div className="flex items-center justify-center h-24 text-surface-500 text-sm">
          No mistake data yet. Start practicing to see finger accuracy!
        </div>
      ) : (
        <div className="space-y-3">
          {FINGER_ORDER.map(({ key, label }) => {
            const count = fingerStats[key];
            const ratio = totalMistakes > 0 ? count / totalMistakes : 0;
            const widthPct = Math.max(4, ratio * 100);
            const { bg, dot } = getIntensityClasses(ratio);

            return (
              <div key={key} className="flex items-center gap-3">
                {/* Dot */}
                <div className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />

                {/* Label */}
                <span className="text-sm text-surface-300 w-16 shrink-0">{label}</span>

                {/* Bar */}
                <div className="flex-1 h-1.5 bg-surface-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bg}`}
                    style={{
                      width: `${widthPct}%`,
                      transition: "width 0.4s ease-out",
                    }}
                  />
                </div>

                {/* Count */}
                <span className="text-xs font-mono text-surface-400 w-10 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {totalMistakes > 0 && (
        <p className="text-xs text-surface-500 mt-4">
          Total corrections: {totalMistakes} · Higher bars indicate fingers needing more practice
        </p>
      )}
    </div>
  );
};
