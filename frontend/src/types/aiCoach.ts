// ─── AI Coach Types ──────────────────────────────────────────────────

/**
 * Structured request derived from TutorEvaluation data.
 * Passed to the prompt builder to create a coaching prompt.
 */
export interface AICoachRequest {
  /** Name of the mudra being practiced. */
  mudra: string;
  /** Overall accuracy score (0–100). */
  score: number;
  /** Finger names that are correctly positioned. */
  correctFingers: string[];
  /** Finger names that need correction. */
  incorrectFingers: string[];
  /** The existing tutor engine's coach message. */
  coachMessage: string;
  /** Suggested corrections from the rule engine. */
  suggestedCorrections: string[];
}

/**
 * Response from the AI coach LLM.
 */
export interface AICoachResponse {
  /** Generated coaching feedback text. */
  feedback: string;
}
