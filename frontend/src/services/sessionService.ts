import type { PracticeSession } from "../types/analytics";
import type { FingerName } from "../utils/geometry/fingertipContact";

// ─── Internal State ──────────────────────────────────────────────────

interface ActiveSession {
  id: string;
  mudraName: string;
  startTime: Date;
  pauseStart: Date | null;
  totalPausedMs: number;
  bestScore: number;
  scoreSum: number;
  scoreSamples: number;
  fingerMistakes: Record<FingerName, number>;
  completed: boolean;
}

let activeSession: ActiveSession | null = null;

// ─── Helpers ─────────────────────────────────────────────────────────

/** Generate a UUID v4-like identifier. */
const generateId = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const emptyFingerMistakes = (): Record<FingerName, number> => ({
  thumb: 0,
  index: 0,
  middle: 0,
  ring: 0,
  little: 0,
});

// ─── Session Lifecycle ───────────────────────────────────────────────

/**
 * Start a new practice session.
 * If a session is already active, it is silently discarded.
 */
export const startSession = (mudraName: string): void => {
  activeSession = {
    id: generateId(),
    mudraName,
    startTime: new Date(),
    pauseStart: null,
    totalPausedMs: 0,
    bestScore: 0,
    scoreSum: 0,
    scoreSamples: 0,
    fingerMistakes: emptyFingerMistakes(),
    completed: false,
  };
};

/**
 * Pause the current session timer.
 * No-op if no session is active or already paused.
 */
export const pauseSession = (): void => {
  if (!activeSession || activeSession.pauseStart) return;
  activeSession.pauseStart = new Date();
};

/**
 * Resume the session timer after a pause.
 */
export const resumeSession = (): void => {
  if (!activeSession || !activeSession.pauseStart) return;
  activeSession.totalPausedMs += new Date().getTime() - activeSession.pauseStart.getTime();
  activeSession.pauseStart = null;
};

/**
 * Record a score sample during practice.
 */
export const recordScore = (score: number): void => {
  if (!activeSession) return;
  activeSession.scoreSum += score;
  activeSession.scoreSamples += 1;
  if (score > activeSession.bestScore) {
    activeSession.bestScore = score;
  }
};

/**
 * Record a finger mistake. Increments the count for the given finger.
 */
export const recordMistake = (finger: FingerName): void => {
  if (!activeSession) return;
  activeSession.fingerMistakes[finger] += 1;
};

/**
 * Mark the session as completed (mudra held successfully).
 */
export const markCompleted = (): void => {
  if (!activeSession) return;
  activeSession.completed = true;
};

/**
 * Finish and return the completed PracticeSession.
 * Returns null if no session is active.
 */
export const finishSession = (): PracticeSession | null => {
  if (!activeSession) return null;

  // If currently paused, resume first to account for pause time
  if (activeSession.pauseStart) {
    activeSession.totalPausedMs +=
      new Date().getTime() - activeSession.pauseStart.getTime();
  }

  const endTime = new Date();
  const totalElapsedMs = endTime.getTime() - activeSession.startTime.getTime();
  const durationMs = Math.max(0, totalElapsedMs - activeSession.totalPausedMs);

  const averageScore =
    activeSession.scoreSamples > 0
      ? Math.round(activeSession.scoreSum / activeSession.scoreSamples)
      : 0;

  // Find most incorrect finger
  const fingers: FingerName[] = ["thumb", "index", "middle", "ring", "little"];
  let mostIncorrectFinger: FingerName | null = null;
  let maxMistakes = 0;
  for (const f of fingers) {
    if (activeSession.fingerMistakes[f] > maxMistakes) {
      maxMistakes = activeSession.fingerMistakes[f];
      mostIncorrectFinger = f;
    }
  }

  const session: PracticeSession = {
    id: activeSession.id,
    mudraName: activeSession.mudraName,
    startTime: activeSession.startTime.toISOString(),
    endTime: endTime.toISOString(),
    durationMs,
    bestScore: activeSession.bestScore,
    averageScore,
    totalScoreSamples: activeSession.scoreSamples,
    completed: activeSession.completed,
    fingerMistakes: { ...activeSession.fingerMistakes },
    mostIncorrectFinger,
  };

  activeSession = null;
  return session;
};

/**
 * Check if a session is currently active.
 */
export const isSessionActive = (): boolean => {
  return activeSession !== null;
};

/**
 * Get a snapshot of the active session for display purposes.
 */
export const getActiveSessionSnapshot = (): {
  mudraName: string;
  bestScore: number;
  averageScore: number;
  durationMs: number;
  scoreSamples: number;
} | null => {
  if (!activeSession) return null;

  const now = new Date();
  let pausedMs = activeSession.totalPausedMs;
  if (activeSession.pauseStart) {
    pausedMs += now.getTime() - activeSession.pauseStart.getTime();
  }

  const elapsed = now.getTime() - activeSession.startTime.getTime();
  const durationMs = Math.max(0, elapsed - pausedMs);

  return {
    mudraName: activeSession.mudraName,
    bestScore: activeSession.bestScore,
    averageScore:
      activeSession.scoreSamples > 0
        ? Math.round(activeSession.scoreSum / activeSession.scoreSamples)
        : 0,
    durationMs,
    scoreSamples: activeSession.scoreSamples,
  };
};
