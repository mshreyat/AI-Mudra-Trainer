import React from "react";
import type { PracticeSession } from "@/types/analytics";

interface SessionSummaryCardProps {
  /** The completed practice session to summarize. */
  session: PracticeSession;
  /** Callback to dismiss/close the summary card. */
  onDismiss: () => void;
}

/**
 * Format milliseconds into a human-readable duration string.
 */
const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
};

/**
 * Generate a positive feedback message based on the session performance.
 */
const getFeedbackMessage = (session: PracticeSession): string => {
  if (session.completed && session.bestScore >= 90) {
    return "Outstanding! You've mastered this mudra beautifully. 🎉";
  }
  if (session.completed) {
    return "Great job completing this mudra! Keep refining your form. ✨";
  }
  if (session.bestScore >= 75) {
    return "You're making excellent progress! Almost there. 💪";
  }
  if (session.bestScore >= 50) {
    return "Good effort! Regular practice will help you improve. 🌱";
  }
  return "Every practice session brings you closer to perfection. Keep going! 🙏";
};

/**
 * Post-session summary overlay showing key stats and positive feedback.
 */
export const SessionSummaryCard: React.FC<SessionSummaryCardProps> = ({
  session,
  onDismiss,
}) => {
  const fingerLabel = session.mostIncorrectFinger
    ? session.mostIncorrectFinger.charAt(0).toUpperCase() + session.mostIncorrectFinger.slice(1)
    : "None";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-950/80 backdrop-blur-sm"
        onClick={onDismiss}
      />

      {/* Card */}
      <div className="relative glass-card p-8 max-w-md w-full animate-slide-up border-surface-600/50">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-600/20 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary-400"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="text-xl font-display font-bold text-white">Session Complete</h2>
          <p className="text-surface-400 text-sm mt-1">{session.mudraName}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-surface-800/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-white">
              {session.bestScore}%
            </p>
            <p className="text-xs text-surface-400 mt-1">Best Score</p>
          </div>
          <div className="bg-surface-800/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-white">
              {session.averageScore}%
            </p>
            <p className="text-xs text-surface-400 mt-1">Average Score</p>
          </div>
          <div className="bg-surface-800/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-white">
              {formatDuration(session.durationMs)}
            </p>
            <p className="text-xs text-surface-400 mt-1">Duration</p>
          </div>
          <div className="bg-surface-800/50 rounded-xl p-4 text-center">
            <p className="text-2xl font-display font-bold text-white">{fingerLabel}</p>
            <p className="text-xs text-surface-400 mt-1">Needs Work</p>
          </div>
        </div>

        {/* Completion status */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div
            className={`w-2 h-2 rounded-full ${
              session.completed ? "bg-green-400" : "bg-amber-400"
            }`}
          />
          <span
            className={`text-sm font-medium ${
              session.completed ? "text-green-400" : "text-amber-400"
            }`}
          >
            {session.completed ? "Mudra Completed ✓" : "Keep Practicing"}
          </span>
        </div>

        {/* Feedback */}
        <p className="text-center text-surface-300 text-sm leading-relaxed mb-6">
          {getFeedbackMessage(session)}
        </p>

        {/* Dismiss button */}
        <button
          onClick={onDismiss}
          className="w-full h-11 rounded-full bg-primary-600 text-white font-medium hover:bg-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface-950 cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
