import React from "react";
import type { WeeklyStats } from "@/types/analytics";

interface ProgressChartProps {
  /** 7-day stats array (oldest first). */
  weeklyStats: WeeklyStats;
}

/**
 * SVG-based 7-day bar chart showing daily average scores.
 * No external charting library — pure SVG for zero bundle impact.
 */
export const ProgressChart: React.FC<ProgressChartProps> = ({ weeklyStats }) => {
  const chartHeight = 160;
  const barWidth = 32;
  const gap = 12;
  const totalWidth = weeklyStats.length * (barWidth + gap) - gap;
  const maxScore = 100;

  const dayLabels = weeklyStats.map((d) => {
    const date = new Date(d.date + "T00:00:00");
    return date.toLocaleDateString("en-US", { weekday: "short" });
  });

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-5">
        Weekly Progress
      </h3>

      {weeklyStats.every((d) => d.sessionCount === 0) ? (
        <div className="flex items-center justify-center h-40 text-surface-500 text-sm">
          No practice data this week. Start a session to see your progress!
        </div>
      ) : (
        <div className="flex justify-center overflow-x-auto">
          <svg
            width={totalWidth + 40}
            height={chartHeight + 40}
            viewBox={`0 0 ${totalWidth + 40} ${chartHeight + 40}`}
            className="block"
          >
            {/* Horizontal grid lines */}
            {[0, 25, 50, 75, 100].map((pct) => {
              const y = chartHeight - (pct / maxScore) * chartHeight + 10;
              return (
                <g key={pct}>
                  <line
                    x1={30}
                    y1={y}
                    x2={totalWidth + 30}
                    y2={y}
                    stroke="currentColor"
                    className="text-surface-800"
                    strokeDasharray={pct === 0 ? undefined : "4 4"}
                  />
                  <text
                    x={24}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-surface-500"
                    fontSize={10}
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    {pct}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {weeklyStats.map((day, i) => {
              const barHeight = (day.averageScore / maxScore) * chartHeight;
              const x = i * (barWidth + gap) + 34;
              const y = chartHeight - barHeight + 10;

              const isToday = i === weeklyStats.length - 1;
              const hasData = day.sessionCount > 0;

              return (
                <g key={day.date}>
                  {/* Bar background */}
                  <rect
                    x={x}
                    y={10}
                    width={barWidth}
                    height={chartHeight}
                    rx={6}
                    className="fill-surface-800/50"
                  />

                  {/* Bar fill */}
                  {hasData && (
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx={6}
                      className={isToday ? "fill-primary-500" : "fill-primary-700"}
                      style={{
                        transition: "height 0.5s ease-out, y 0.5s ease-out",
                      }}
                    />
                  )}

                  {/* Score label */}
                  {hasData && (
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      textAnchor="middle"
                      className="fill-surface-300"
                      fontSize={11}
                      fontWeight={600}
                      fontFamily="Inter, system-ui, sans-serif"
                    >
                      {day.averageScore}
                    </text>
                  )}

                  {/* Day label */}
                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + 28}
                    textAnchor="middle"
                    className={isToday ? "fill-primary-400" : "fill-surface-500"}
                    fontSize={11}
                    fontWeight={isToday ? 600 : 400}
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    {dayLabels[i]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
};
