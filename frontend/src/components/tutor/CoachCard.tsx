import React from "react";

interface CoachCardProps {
  /** The primary coach instruction for the user. */
  coachMessage: string;
  /** List of all suggested corrections. */
  suggestedCorrections: string[];
  /** Whether the mudra is currently correct. */
  isCorrect: boolean;
  /** Whether a hand is being tracked. */
  isTracking: boolean;
}

/**
 * Displays the current coach instruction in a visually prominent card.
 * Background shifts to green when the mudra is correct.
 * Lists all suggested corrections as bullet points below.
 */
export const CoachCard: React.FC<CoachCardProps> = ({
  coachMessage,
  suggestedCorrections,
  isCorrect,
  isTracking,
}) => {
  const bgClass = !isTracking
    ? "bg-surface-800/50 border-surface-700/50"
    : isCorrect
      ? "bg-green-950/40 border-green-800/50"
      : "bg-amber-950/30 border-amber-800/40";

  const iconColor = !isTracking
    ? "text-surface-500"
    : isCorrect
      ? "text-green-400"
      : "text-amber-400";

  return (
    <div className={`rounded-2xl border p-6 transition-colors duration-500 ${bgClass}`}>
      {/* Header with icon */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`mt-0.5 shrink-0 ${iconColor}`}>
          {isCorrect && isTracking ? (
            // Checkmark icon
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            // Hand/pointer icon
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
              <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" />
              <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
              <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
            </svg>
          )}
        </div>

        <div>
          <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1">
            Coach
          </h3>
          <p className="text-base font-medium text-white leading-relaxed">
            {coachMessage}
          </p>
        </div>
      </div>

      {/* Suggested corrections list */}
      {isTracking && suggestedCorrections.length > 0 && !isCorrect && (
        <div className="mt-4 pt-4 border-t border-surface-700/30">
          <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
            Corrections
          </h4>
          <ul className="space-y-2">
            {suggestedCorrections.map((correction, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-surface-300">
                <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                {correction}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
