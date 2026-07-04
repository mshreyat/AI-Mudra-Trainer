import React from "react";
import { FingerName } from "@/utils/geometry/fingertipContact";

interface FingerScoreProps {
  /** Per-finger accuracy percentages (0–100) over the rolling buffer. */
  fingerAccuracy: Record<FingerName, number>;
}

interface RowData {
  label: string;
  accuracy: number;
}

const getAccuracyColor = (accuracy: number): string => {
  if (accuracy >= 80) return "bg-green-500";
  if (accuracy >= 50) return "bg-amber-500";
  return "bg-red-500";
};

const getDotColor = (accuracy: number): string => {
  if (accuracy >= 80) return "bg-green-400";
  if (accuracy >= 50) return "bg-amber-400";
  return "bg-red-400";
};

/**
 * Displays a compact breakdown of per-finger accuracy, plus palm and spread status.
 * Each row shows a colored dot, label, accuracy bar, and percentage.
 */
export const FingerScore: React.FC<FingerScoreProps> = ({
  fingerAccuracy,
}) => {
  const fingerNames: FingerName[] = ["thumb", "index", "middle", "ring", "little"];

  const rows: RowData[] = fingerNames.map((name) => ({
    label: name.charAt(0).toUpperCase() + name.slice(1),
    accuracy: fingerAccuracy[name],
  }));

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
        Detail Breakdown
      </h3>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            {/* Status dot */}
            <div className={`w-2 h-2 rounded-full shrink-0 ${getDotColor(row.accuracy)}`} />

            {/* Label */}
            <span className="text-sm text-surface-300 w-16 shrink-0">{row.label}</span>

            {/* Accuracy bar */}
            <div className="flex-1 h-1.5 bg-surface-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${getAccuracyColor(row.accuracy)}`}
                style={{
                  width: `${row.accuracy}%`,
                  transition: "width 0.4s ease-out",
                }}
              />
            </div>

            {/* Percentage */}
            <span className="text-xs font-mono text-surface-400 w-10 text-right">
              {row.accuracy}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
