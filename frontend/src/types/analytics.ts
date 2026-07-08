import { FingerName } from "../utils/geometry/fingertipContact";

// ─── Practice Session ────────────────────────────────────────────────

/**
 * Complete record of a single practice session.
 * Persisted to storage after the session ends.
 */
export interface PracticeSession {
  /** Unique session identifier (UUID). */
  id: string;
  /** Name of the mudra practiced. */
  mudraName: string;
  /** ISO-8601 timestamp when the session started. */
  startTime: string;
  /** ISO-8601 timestamp when the session ended. */
  endTime: string;
  /** Total practice duration in milliseconds. */
  durationMs: number;
  /** Highest score achieved during this session (0–100). */
  bestScore: number;
  /** Running average of all recorded scores (0–100). */
  averageScore: number;
  /** Total number of score samples recorded. */
  totalScoreSamples: number;
  /** Whether the mudra was held successfully for the completion threshold. */
  completed: boolean;
  /** Per-finger mistake counts accumulated during the session. */
  fingerMistakes: Record<FingerName, number>;
  /** The finger with the most mistakes, or null if no mistakes. */
  mostIncorrectFinger: FingerName | null;
}

// ─── Session Summary ─────────────────────────────────────────────────

/**
 * Lightweight view of a practice session for lists and cards.
 */
export interface SessionSummary {
  id: string;
  mudraName: string;
  date: string;
  durationMs: number;
  bestScore: number;
  averageScore: number;
  completed: boolean;
  mostIncorrectFinger: FingerName | null;
}

// ─── Weekly Stats ────────────────────────────────────────────────────

/**
 * Aggregated statistics for a single day.
 */
export interface DailyStats {
  /** ISO-8601 date string (YYYY-MM-DD). */
  date: string;
  /** Average score across all sessions that day. */
  averageScore: number;
  /** Total practice duration in milliseconds for that day. */
  totalDurationMs: number;
  /** Number of sessions completed that day. */
  sessionCount: number;
}

/**
 * Stats for the past 7 days (always 7 entries, zero-filled for no-practice days).
 */
export type WeeklyStats = DailyStats[];

// ─── Finger Statistics ───────────────────────────────────────────────

/**
 * Cumulative mistake counts per finger across all stored sessions.
 */
export type FingerStatistics = Record<FingerName, number>;

// ─── Progress Metrics ────────────────────────────────────────────────

/**
 * Derived analytics computed from all stored sessions.
 */
export interface ProgressMetrics {
  /** Total number of sessions ever recorded. */
  totalSessions: number;
  /** Total practice time in milliseconds across all sessions. */
  totalPracticeTimeMs: number;
  /** Highest score ever achieved in any session. */
  bestScore: number;
  /** Average score across all sessions. */
  averageScore: number;
  /** Current consecutive-day practice streak. */
  practiceStreak: number;
  /** Number of unique mudras the user has practiced. */
  mudrasPracticed: number;
  /** Name of the most frequently practiced mudra, or null. */
  mostPracticedMudra: string | null;
  /** Name of the least frequently practiced mudra, or null. */
  leastPracticedMudra: string | null;
  /** Highest average score across all sessions (best session). */
  highestSessionScore: number;
  /** Lowest average score across all sessions (worst session). */
  lowestSessionScore: number;
  /** Average session duration in milliseconds. */
  averageDurationMs: number;
  /** Score change comparing this week vs. last week (positive = improvement). */
  weeklyImprovement: number;
  /** Number of sessions completed today. */
  todaySessions: number;
  /** Total practice time today in milliseconds. */
  todayPracticeTimeMs: number;
}
