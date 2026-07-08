import { useState, useCallback, useRef } from "react";
import type { FingerName } from "@/utils/geometry/fingertipContact";
import type {
  PracticeSession,
  ProgressMetrics,
  WeeklyStats,
  FingerStatistics,
  SessionSummary,
} from "@/types/analytics";
import * as sessionService from "@/services/sessionService";
import * as analyticsService from "@/services/analyticsService";

// ─── Return Type ─────────────────────────────────────────────────────

export interface UseAnalyticsReturn {
  /** Start a new practice session for the given mudra. */
  startSession: (mudraName: string) => void;
  /** Finish the current session, persist it, and return the completed session. */
  finishSession: () => PracticeSession | null;
  /** Record a score sample from the tutor. */
  recordScore: (score: number) => void;
  /** Record a finger mistake. */
  recordMistake: (finger: FingerName) => void;
  /** Mark the active session as completed (mudra held successfully). */
  markCompleted: () => void;
  /** Whether a session is currently active. */
  isSessionActive: boolean;
  /** The last completed session (for showing the summary card). */
  lastCompletedSession: PracticeSession | null;
  /** Dismiss the session summary card. */
  dismissSummary: () => void;
  /** Aggregate progress metrics (refreshed on session end). */
  analytics: ProgressMetrics;
  /** Weekly stats (refreshed on session end). */
  weeklyStats: WeeklyStats;
  /** Finger statistics (refreshed on session end). */
  fingerStats: FingerStatistics;
  /** Recent session summaries (refreshed on session end). */
  recentSessions: SessionSummary[];
  /** Force refresh analytics from storage. */
  refreshAnalytics: () => void;
}

// ─── Hook ────────────────────────────────────────────────────────────

const EMPTY_METRICS: ProgressMetrics = {
  totalSessions: 0,
  totalPracticeTimeMs: 0,
  bestScore: 0,
  averageScore: 0,
  practiceStreak: 0,
  mudrasPracticed: 0,
  mostPracticedMudra: null,
  leastPracticedMudra: null,
  highestSessionScore: 0,
  lowestSessionScore: 0,
  averageDurationMs: 0,
  weeklyImprovement: 0,
  todaySessions: 0,
  todayPracticeTimeMs: 0,
};

export const useAnalytics = (): UseAnalyticsReturn => {
  const [isActive, setIsActive] = useState(false);
  const [lastCompletedSession, setLastCompletedSession] = useState<PracticeSession | null>(null);
  const [analytics, setAnalytics] = useState<ProgressMetrics>(EMPTY_METRICS);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>([]);
  const [fingerStats, setFingerStats] = useState<FingerStatistics>({
    thumb: 0, index: 0, middle: 0, ring: 0, little: 0,
  });
  const [recentSessions, setRecentSessions] = useState<SessionSummary[]>([]);

  // Throttle score recording to avoid excessive updates (every 500ms)
  const lastScoreTimeRef = useRef<number>(0);
  const lastMistakeTimeRef = useRef<number>(0);

  const refreshAnalytics = useCallback(() => {
    setAnalytics(analyticsService.getProgressMetrics());
    setWeeklyStats(analyticsService.getWeeklyStats());
    setFingerStats(analyticsService.getFingerStatistics());
    setRecentSessions(analyticsService.getRecentSessions(10));
  }, []);

  const startSession = useCallback((mudraName: string) => {
    // If a session is already active, finish it first
    if (sessionService.isSessionActive()) {
      const finished = sessionService.finishSession();
      if (finished && finished.totalScoreSamples > 0) {
        analyticsService.saveSession(finished);
      }
    }

    sessionService.startSession(mudraName);
    setIsActive(true);
    lastScoreTimeRef.current = 0;
    lastMistakeTimeRef.current = 0;
  }, []);

  const finishSession = useCallback((): PracticeSession | null => {
    const session = sessionService.finishSession();
    setIsActive(false);

    if (session && session.totalScoreSamples > 0) {
      analyticsService.saveSession(session);
      setLastCompletedSession(session);
      refreshAnalytics();
    }

    return session;
  }, [refreshAnalytics]);

  const recordScore = useCallback((score: number) => {
    const now = performance.now();
    // Throttle: only record once every 500ms to avoid flooding storage calculations
    if (now - lastScoreTimeRef.current < 500) return;
    lastScoreTimeRef.current = now;
    sessionService.recordScore(score);
  }, []);

  const recordMistake = useCallback((finger: FingerName) => {
    const now = performance.now();
    // Throttle: only record once every 1000ms per call
    if (now - lastMistakeTimeRef.current < 1000) return;
    lastMistakeTimeRef.current = now;
    sessionService.recordMistake(finger);
  }, []);

  const markCompleted = useCallback(() => {
    sessionService.markCompleted();
  }, []);

  const dismissSummary = useCallback(() => {
    setLastCompletedSession(null);
  }, []);

  return {
    startSession,
    finishSession,
    recordScore,
    recordMistake,
    markCompleted,
    isSessionActive: isActive,
    lastCompletedSession,
    dismissSummary,
    analytics,
    weeklyStats,
    fingerStats,
    recentSessions,
    refreshAnalytics,
  };
};
