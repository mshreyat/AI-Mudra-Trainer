import React from "react";

interface StatsCardProps {
  /** Short label (e.g. "Best Score"). */
  label: string;
  /** Display value (e.g. "92%", "5 min", "3 🔥"). */
  value: string;
  /** SVG icon element. */
  icon: React.ReactNode;
  /** Optional trend text (e.g. "+12% this week"). */
  trend?: string;
  /** Positive trend = green, negative = red. */
  trendPositive?: boolean;
}

/**
 * Compact analytics stat tile with glassmorphism styling.
 * Material 3 inspired with icon, value, label, and optional trend indicator.
 */
export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon,
  trend,
  trendPositive,
}) => {
  return (
    <div className="glass-card p-5 group hover:border-surface-600/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-surface-700/50 flex items-center justify-center text-primary-400 group-hover:bg-primary-900/30 transition-colors duration-300">
          {icon}
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              trendPositive
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-white tracking-tight">
        {value}
      </p>
      <p className="text-sm text-surface-400 mt-1">{label}</p>
    </div>
  );
};
