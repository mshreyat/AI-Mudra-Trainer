import React from "react";

interface AIBadgeProps {
  status: "active" | "offline";
}

/**
 * Status indicator badge for the AI Coach.
 *
 * Displays "🟢 AI Active" when responses are processed by Groq successfully,
 * or "🟡 Offline Coach" when falling back to the local rule-based system.
 */
export const AIBadge: React.FC<AIBadgeProps> = ({ status }) => {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        AI Active
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      Offline Coach
    </span>
  );
};
