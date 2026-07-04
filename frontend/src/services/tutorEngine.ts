import { HandGeometry } from "../utils/geometry/handGeometry";
import { MudraRule, ComparisonResult } from "../types/rule";
import { FingerName } from "../utils/geometry/fingertipContact";
import { evaluateMudra } from "./ruleEngine";

// ─── Types ───────────────────────────────────────────────────────────

export interface FingerScoreEntry {
  name: FingerName;
  correct: boolean;
  feedback: string;
}

export interface TutorEvaluation {
  overallScore: number;
  fingerScores: FingerScoreEntry[];
  mostIncorrectFinger: FingerName | null;
  coachMessage: string;
  suggestedCorrections: string[];
  evaluationResult: ComparisonResult;
}

// ─── Coach Message Generation ────────────────────────────────────────

const FINGER_NAMES: FingerName[] = ["thumb", "index", "middle", "ring", "little"];

/**
 * Generates a single, focused coach message — the most important thing
 * the user should fix right now.
 *
 * Priority order:
 *   1. All correct → praise
 *   2. Incorrect fingers → target the first incorrect finger
 *   3. Palm position → palm correction
 *   4. Spread → spread correction
 *   5. Contacts → contact correction
 *   6. Fallback → first suggested correction
 */
const generateCoachMessage = (result: ComparisonResult): string => {
  if (result.isCorrect) {
    return "Perfect! Hold this position.";
  }

  // Find the first incorrect finger and give its specific feedback
  for (const name of FINGER_NAMES) {
    if (!result.fingers[name].correct) {
      return result.fingers[name].feedback;
    }
  }

  // Palm
  if (!result.palm.correct) {
    return result.palm.feedback;
  }

  // Spread
  if (!result.spread.correct) {
    return result.spread.feedback;
  }

  // Contacts
  if (!result.contacts.correct) {
    return result.contacts.feedback;
  }

  // Fallback
  return result.suggestedCorrections[0] || "Keep adjusting your hand position.";
};

/**
 * Determines which finger is most incorrect.
 * Returns the first finger in standard order that doesn't match its expected state,
 * or null if all fingers are correct.
 */
const findMostIncorrectFinger = (result: ComparisonResult): FingerName | null => {
  if (result.incorrectFingers.length === 0) return null;
  return result.incorrectFingers[0];
};

// ─── Main Tutor Engine ───────────────────────────────────────────────

/**
 * Evaluates the user's hand against a mudra rule and produces
 * a structured tutoring output.
 *
 * This is a pure function — no state, no side effects.
 * Temporal smoothing and buffering are handled by the useTutor hook.
 */
export const evaluateTutor = (
  handGeometry: HandGeometry,
  mudraRule: MudraRule
): TutorEvaluation => {
  const result = evaluateMudra(handGeometry, mudraRule);

  const fingerScores: FingerScoreEntry[] = FINGER_NAMES.map((name) => ({
    name,
    correct: result.fingers[name].correct,
    feedback: result.fingers[name].feedback,
  }));

  return {
    overallScore: result.score,
    fingerScores,
    mostIncorrectFinger: findMostIncorrectFinger(result),
    coachMessage: generateCoachMessage(result),
    suggestedCorrections: result.suggestedCorrections,
    evaluationResult: result,
  };
};
