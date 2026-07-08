import React from "react";
import type { WeeklyStats } from "@/types/analytics";

interface PracticeStreakProps {
  /** Current consecutive-day streak count. */
  streak: number;
  /** Weekly stats to show which days had practice. */
  weeklyStats: WeeklyStats;
}

/**
 * 7-day streak calendar with active/inactive day indicators
 * and the current streak count displayed prominently.
 */
export const PracticeStreak: React.FC<PracticeStreakProps> = ({
  streak,
  weeklyStats,
}) => {
  const dayLabels = weeklyStats.map((d) => {
    const date = new Date(d.date + "T00:00:00");
    return date.toLocaleDateString("en-US", { weekday: "narrow" });
  });

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
        Practice Streak
      </h3>

      <div className="flex items-center gap-4 mb-5">
        <div className="text-4xl font-display font-bold text-white">{streak}</div>
        <div className="text-sm text-surface-400 leading-snug">
          <span className="text-primary-400 font-semibold">
            {streak === 1 ? "day" : "days"}
          </span>
          <br />
          in a row
        </div>
        {streak >= 3 && (
          <span className="text-2xl ml-auto" role="img" aria-label="streak fire">
            🔥
          </span>
        )}
      </div>

      {/* Day dots */}
      <div className="flex justify-between gap-1">
        {weeklyStats.map((day, i) => {
          const hasPractice = day.sessionCount > 0;
          return (
            <div key={day.date} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  hasPractice
                    ? "bg-primary-600 text-white shadow-sm shadow-primary-900/50"
                    : "bg-surface-800 text-surface-500"
                }`}
              >
                {hasPractice ? "✓" : "·"}
              </div>
              <span className="text-xs text-surface-500">{dayLabels[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
