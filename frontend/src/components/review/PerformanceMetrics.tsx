import React from "react";

interface PerformanceMetricsProps {
  bestFrame: { timestamp: number; score: number };
  worstFrame: { timestamp: number; score: number };
  commonFingerErrors: { finger: string; count: number }[];
  detectedFrames: number;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  bestFrame,
  worstFrame,
  commonFingerErrors,
  detectedFrames,
}) => {
  const maxErrors = Math.max(...commonFingerErrors.map((e) => e.count), 1);

  // Format timestamp into mm:ss or seconds
  const formatTime = (sec: number): string => {
    const min = Math.floor(sec / 60);
    const remainingSec = Math.floor(sec % 60);
    return `${min.toString().padStart(2, "0")}:${remainingSec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Best & Worst Frame Card */}
      <div className="glass-card p-6 border border-surface-700/50 flex flex-col justify-between">
        <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
          Peak Performances
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-green-950/20 border border-green-800/30">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 shrink-0">
              <svg xmlns="http://www.w3.org/2050/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] text-green-550 uppercase tracking-wider block font-semibold">
                Best Alignment
              </span>
              <p className="text-xl font-display font-bold text-white">
                {bestFrame.score}% <span className="text-xs font-normal text-surface-400">at {formatTime(bestFrame.timestamp)}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-red-955/20 border border-red-800/30">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
              <svg xmlns="http://www.w3.org/2050/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transform rotate-90 scale-y-[-1]">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] text-red-550 uppercase tracking-wider block font-semibold">
                Lowest Alignment
              </span>
              <p className="text-xl font-display font-bold text-white">
                {worstFrame.score}% <span className="text-xs font-normal text-surface-400">at {formatTime(worstFrame.timestamp)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Finger Error Distribution */}
      <div className="glass-card p-6 border border-surface-700/50">
        <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
          Common Finger Alignment Errors
        </h3>

        {detectedFrames === 0 ? (
          <div className="text-center py-8 text-sm text-surface-550">
            No hand detected for analysis.
          </div>
        ) : (
          <div className="space-y-3.5">
            {commonFingerErrors.map(({ finger, count }) => {
              const percentage = Math.round((count / detectedFrames) * 100);
              const barWidth = (count / maxErrors) * 100;
              const formattedName = finger.charAt(0).toUpperCase() + finger.slice(1);
              
              const barColor = count > 0 ? "bg-amber-600" : "bg-surface-700/40";

              return (
                <div key={finger} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-surface-300 font-medium">{formattedName}</span>
                    <span className="text-surface-450 font-mono">
                      {count} frames ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-surface-900 rounded-full overflow-hidden border border-surface-850">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
