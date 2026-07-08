import React from "react";

interface GuruReviewCardProps {
  reviewText: string;
  loading: boolean;
}

export const GuruReviewCard: React.FC<GuruReviewCardProps> = ({
  reviewText,
  loading,
}) => {
  return (
    <div className="glass-card p-6 border border-surface-700/50 relative overflow-hidden animate-fade-in">
      {/* Background ambient light */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary-600/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl" role="img" aria-label="Guru icon">
          🙏
        </span>
        <h3 className="text-sm font-semibold text-white tracking-wide">
          Guru Nataraja's Assessment
        </h3>
      </div>

      {loading ? (
        <div className="space-y-3 py-2 animate-pulse-slow">
          <div className="h-4 bg-surface-700/60 rounded w-full" />
          <div className="h-4 bg-surface-700/60 rounded w-5/6" />
          <div className="h-4 bg-surface-700/60 rounded w-2/3" />
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-surface-200 font-sans italic">
            "{reviewText}"
          </p>
          <div className="pt-2 flex items-center justify-between text-[10px] text-surface-500 font-mono">
            <span>Role: Guru Nataraja AI</span>
            <span>Word Count: ~{reviewText.split(/\s+/).filter(Boolean).length} words</span>
          </div>
        </div>
      )}
    </div>
  );
};
