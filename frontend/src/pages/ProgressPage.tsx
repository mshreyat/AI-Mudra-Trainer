import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";
import { StatsCard } from "@/components/analytics/StatsCard";
import { ProgressChart } from "@/components/analytics/ProgressChart";
import { FingerHeatmap } from "@/components/analytics/FingerHeatmap";
import { PracticeStreak } from "@/components/analytics/PracticeStreak";
import { Button } from "@/components/common/Button";

// ─── Helpers ─────────────────────────────────────────────────────────

const formatTime = (ms: number): string => {
  const totalMinutes = Math.floor(ms / 60000);
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

const formatTodayTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) return `${minutes}m ${seconds}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
};

// ─── Icons (inline SVG) ──────────────────────────────────────────────

const TodayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
);

const AvgIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
);

const TimerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>
);

const StreakIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
);

const MudraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
);

// ─── Component ───────────────────────────────────────────────────────

export default function ProgressPage() {
  const {
    analytics,
    weeklyStats,
    fingerStats,
    recentSessions,
    refreshAnalytics,
  } = useAnalytics();

  // Load analytics on mount
  useEffect(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  const hasData = analytics.totalSessions > 0;

  return (
    <div className="flex-grow py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Your Progress
          </h1>
          <p className="text-surface-400">
            {hasData
              ? "Track your Mudra practice journey. Every session makes you better."
              : "Start practicing to see your analytics here."}
          </p>
        </div>

        {!hasData ? (
          /* Empty State */
          <div className="glass-card p-12 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-surface-800 flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-surface-500"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            </div>
            <h2 className="text-xl font-display font-semibold text-white mb-2">
              No Practice Data Yet
            </h2>
            <p className="text-surface-400 text-sm mb-6">
              Complete your first practice session to start tracking your progress and see detailed analytics.
            </p>
            <Link to="/practice">
              <Button size="md">Start Practice</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatsCard
                label="Today's Practice"
                value={analytics.todaySessions > 0 ? formatTodayTime(analytics.todayPracticeTimeMs) : "None yet"}
                icon={<TodayIcon />}
                trend={analytics.todaySessions > 0 ? `${analytics.todaySessions} session${analytics.todaySessions > 1 ? "s" : ""}` : undefined}
                trendPositive={analytics.todaySessions > 0}
              />
              <StatsCard
                label="Best Score"
                value={`${analytics.bestScore}%`}
                icon={<TrophyIcon />}
              />
              <StatsCard
                label="Average Score"
                value={`${analytics.averageScore}%`}
                icon={<AvgIcon />}
                trend={analytics.weeklyImprovement !== 0 ? `${analytics.weeklyImprovement > 0 ? "+" : ""}${analytics.weeklyImprovement}% this week` : undefined}
                trendPositive={analytics.weeklyImprovement > 0}
              />
              <StatsCard
                label="Total Practice Time"
                value={formatTime(analytics.totalPracticeTimeMs)}
                icon={<TimerIcon />}
              />
              <StatsCard
                label="Practice Streak"
                value={`${analytics.practiceStreak} day${analytics.practiceStreak !== 1 ? "s" : ""}`}
                icon={<StreakIcon />}
              />
              <StatsCard
                label="Mudras Practiced"
                value={`${analytics.mudrasPracticed}`}
                icon={<MudraIcon />}
                trend={analytics.mostPracticedMudra ? `Favorite: ${analytics.mostPracticedMudra}` : undefined}
                trendPositive
              />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ProgressChart weeklyStats={weeklyStats} />
              <PracticeStreak streak={analytics.practiceStreak} weeklyStats={weeklyStats} />
            </div>

            {/* Finger Accuracy */}
            <FingerHeatmap fingerStats={fingerStats} />

            {/* Recent Sessions */}
            <div className="glass-card p-6">
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
                Recent Sessions
              </h3>

              {recentSessions.length === 0 ? (
                <p className="text-surface-500 text-sm text-center py-4">
                  No sessions recorded yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {recentSessions.map((s) => {
                    const date = new Date(s.date);
                    const dateStr = date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                    const timeStr = date.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    });
                    const durationMin = Math.floor(s.durationMs / 60000);
                    const durationSec = Math.floor((s.durationMs % 60000) / 1000);
                    const durationStr = durationMin > 0 ? `${durationMin}m ${durationSec}s` : `${durationSec}s`;

                    return (
                      <div
                        key={s.id}
                        className="flex items-center gap-4 p-3 rounded-xl bg-surface-800/30 hover:bg-surface-800/60 transition-colors"
                      >
                        {/* Status */}
                        <div
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            s.completed ? "bg-green-400" : "bg-amber-400"
                          }`}
                        />

                        {/* Mudra name */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {s.mudraName}
                          </p>
                          <p className="text-xs text-surface-500">
                            {dateStr} · {timeStr}
                          </p>
                        </div>

                        {/* Score */}
                        <div className="text-right shrink-0">
                          <p className="text-sm font-mono font-semibold text-white">
                            {s.bestScore}%
                          </p>
                          <p className="text-xs text-surface-500">{durationStr}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
