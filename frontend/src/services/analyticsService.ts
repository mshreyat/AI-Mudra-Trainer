import type {
  PracticeSession,
  SessionSummary,
  WeeklyStats,
  DailyStats,
  FingerStatistics,
  ProgressMetrics,
} from "../types/analytics";
import type { FingerName } from "../utils/geometry/fingertipContact";

// ─── Storage Key ─────────────────────────────────────────────────────

const STORAGE_KEY = "mudrasense_practice_sessions";

// ─── Helpers ─────────────────────────────────────────────────────────

/** Get today's date as YYYY-MM-DD. */
const todayDateStr = (): string => new Date().toISOString().slice(0, 10);

/** Get a date string N days before today. */
const daysAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

/** Extract YYYY-MM-DD from an ISO timestamp. */
const dateOf = (iso: string): string => iso.slice(0, 10);

// ─── Core CRUD ───────────────────────────────────────────────────────

/**
 * Load all sessions from localStorage.
 *
 * When migrating to Supabase, replace with:
 *   `const { data } = await supabase.from('sessions').select('*')`
 */
export const loadSessions = (): PracticeSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PracticeSession[];
  } catch {
    return [];
  }
};

/**
 * Persist the full sessions array.
 */
const writeSessions = (sessions: PracticeSession[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

/**
 * Save (append) a completed practice session.
 */
export const saveSession = (session: PracticeSession): void => {
  const sessions = loadSessions();
  sessions.push(session);
  writeSessions(sessions);
};

/**
 * Delete a session by ID.
 */
export const deleteSession = (id: string): void => {
  const sessions = loadSessions().filter((s) => s.id !== id);
  writeSessions(sessions);
};

/**
 * Remove all stored sessions.
 */
export const clearAllSessions = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// ─── Derived Queries ─────────────────────────────────────────────────

/**
 * Build a SessionSummary from a full PracticeSession.
 */
const toSummary = (s: PracticeSession): SessionSummary => ({
  id: s.id,
  mudraName: s.mudraName,
  date: s.startTime,
  durationMs: s.durationMs,
  bestScore: s.bestScore,
  averageScore: s.averageScore,
  completed: s.completed,
  mostIncorrectFinger: s.mostIncorrectFinger,
});

/**
 * Return the N most recent session summaries, newest first.
 */
export const getRecentSessions = (n: number): SessionSummary[] => {
  const sessions = loadSessions();
  return sessions
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, n)
    .map(toSummary);
};

/**
 * Compute the current consecutive-day practice streak.
 */
const computeStreak = (sessions: PracticeSession[]): number => {
  if (sessions.length === 0) return 0;

  const practiceDays = new Set(sessions.map((s) => dateOf(s.startTime)));
  let streak = 0;
  const d = new Date();

  // Check today first
  if (practiceDays.has(d.toISOString().slice(0, 10))) {
    streak = 1;
    d.setDate(d.getDate() - 1);
  } else {
    // If no practice today, start checking from yesterday
    d.setDate(d.getDate() - 1);
    if (!practiceDays.has(d.toISOString().slice(0, 10))) {
      return 0;
    }
  }

  // Walk backwards
  while (practiceDays.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  return streak;
};

/**
 * Compute weekly improvement: average score this week minus average score last week.
 */
const computeWeeklyImprovement = (sessions: PracticeSession[]): number => {
  const today = new Date();
  const startOfThisWeek = new Date(today);
  startOfThisWeek.setDate(today.getDate() - 6);
  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

  const thisWeekStr = startOfThisWeek.toISOString().slice(0, 10);
  const lastWeekStr = startOfLastWeek.toISOString().slice(0, 10);
  const todayStr = todayDateStr();

  const thisWeek = sessions.filter((s) => {
    const d = dateOf(s.startTime);
    return d >= thisWeekStr && d <= todayStr;
  });

  const lastWeek = sessions.filter((s) => {
    const d = dateOf(s.startTime);
    return d >= lastWeekStr && d < thisWeekStr;
  });

  const avgThis = thisWeek.length > 0
    ? thisWeek.reduce((sum, s) => sum + s.averageScore, 0) / thisWeek.length
    : 0;

  const avgLast = lastWeek.length > 0
    ? lastWeek.reduce((sum, s) => sum + s.averageScore, 0) / lastWeek.length
    : 0;

  if (lastWeek.length === 0) return 0;
  return Math.round(avgThis - avgLast);
};

/**
 * Compute aggregate progress metrics from all stored sessions.
 */
export const getProgressMetrics = (): ProgressMetrics => {
  const sessions = loadSessions();
  const today = todayDateStr();

  if (sessions.length === 0) {
    return {
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
  }

  const totalPracticeTimeMs = sessions.reduce((sum, s) => sum + s.durationMs, 0);
  const bestScore = Math.max(...sessions.map((s) => s.bestScore));
  const averageScore = Math.round(
    sessions.reduce((sum, s) => sum + s.averageScore, 0) / sessions.length
  );

  // Mudra frequency map
  const mudraCount: Record<string, number> = {};
  for (const s of sessions) {
    mudraCount[s.mudraName] = (mudraCount[s.mudraName] || 0) + 1;
  }
  const mudraEntries = Object.entries(mudraCount);
  mudraEntries.sort((a, b) => b[1] - a[1]);
  const mostPracticedMudra = mudraEntries.length > 0 ? mudraEntries[0][0] : null;
  const leastPracticedMudra = mudraEntries.length > 0 ? mudraEntries[mudraEntries.length - 1][0] : null;

  const todaySessions = sessions.filter((s) => dateOf(s.startTime) === today);

  return {
    totalSessions: sessions.length,
    totalPracticeTimeMs,
    bestScore,
    averageScore,
    practiceStreak: computeStreak(sessions),
    mudrasPracticed: new Set(sessions.map((s) => s.mudraName)).size,
    mostPracticedMudra,
    leastPracticedMudra,
    highestSessionScore: Math.max(...sessions.map((s) => s.averageScore)),
    lowestSessionScore: Math.min(...sessions.map((s) => s.averageScore)),
    averageDurationMs: Math.round(totalPracticeTimeMs / sessions.length),
    weeklyImprovement: computeWeeklyImprovement(sessions),
    todaySessions: todaySessions.length,
    todayPracticeTimeMs: todaySessions.reduce((sum, s) => sum + s.durationMs, 0),
  };
};

/**
 * Compute 7-day stats (today + 6 preceding days), zero-filled for days with no practice.
 */
export const getWeeklyStats = (): WeeklyStats => {
  const sessions = loadSessions();
  const stats: WeeklyStats = [];

  for (let i = 6; i >= 0; i--) {
    const day = daysAgo(i);
    const daySessions = sessions.filter((s) => dateOf(s.startTime) === day);

    const entry: DailyStats = {
      date: day,
      averageScore:
        daySessions.length > 0
          ? Math.round(
              daySessions.reduce((sum, s) => sum + s.averageScore, 0) / daySessions.length
            )
          : 0,
      totalDurationMs: daySessions.reduce((sum, s) => sum + s.durationMs, 0),
      sessionCount: daySessions.length,
    };
    stats.push(entry);
  }

  return stats;
};

/**
 * Aggregate finger mistake counts across all stored sessions.
 */
export const getFingerStatistics = (): FingerStatistics => {
  const sessions = loadSessions();
  const fingers: FingerName[] = ["thumb", "index", "middle", "ring", "little"];

  const stats = {} as FingerStatistics;
  for (const f of fingers) {
    stats[f] = 0;
  }

  for (const s of sessions) {
    for (const f of fingers) {
      stats[f] += s.fingerMistakes[f] || 0;
    }
  }

  return stats;
};
