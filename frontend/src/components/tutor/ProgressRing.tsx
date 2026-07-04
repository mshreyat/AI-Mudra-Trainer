import React from "react";

interface ProgressRingProps {
  /** Score value from 0 to 100. */
  score: number;
  /** Diameter of the ring in pixels. Default: 120. */
  size?: number;
  /** Stroke width in pixels. Default: 8. */
  strokeWidth?: number;
}

/**
 * Computes a gradient-like color based on score:
 *   0–39:  red
 *   40–69: amber
 *   70+:   green
 */
const getScoreColor = (score: number): string => {
  if (score >= 70) return "#22c55e"; // green-500
  if (score >= 40) return "#f59e0b"; // amber-500
  return "#ef4444"; // red-500
};

/**
 * Animated SVG circular progress ring.
 * Displays the score number in the center and fills the ring proportionally.
 */
export const ProgressRing: React.FC<ProgressRingProps> = ({
  score,
  size = 120,
  strokeWidth = 8,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="transform -rotate-90"
    >
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-surface-800"
        strokeWidth={strokeWidth}
      />

      {/* Foreground progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 0.4s ease-out, stroke 0.4s ease-out",
        }}
      />

      {/* Score text (rotated back to upright) */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-white font-display font-bold"
        fontSize={size * 0.28}
        style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
      >
        {score}
      </text>
    </svg>
  );
};
