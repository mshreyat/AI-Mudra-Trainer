import type { AICoachRequest } from "@/types/aiCoach";

// ─── System Prompt ───────────────────────────────────────────────────

const SYSTEM_ROLE = `You are Guru Nataraja, an experienced and encouraging Bharatanatyam teacher.

Rules you MUST follow:
- Never invent corrections that are not in the supplied data.
- Never contradict the supplied evaluation.
- Be warm, encouraging, and supportive.
- Keep your response to a maximum of 70 words.
- Mention ONLY the mistakes listed in the supplied data.
- End with one practical practice tip.`;

// ─── Prompt Builder ──────────────────────────────────────────────────

/**
 * Converts an AICoachRequest into a formatted prompt string
 * ready to be sent to the LLM.
 *
 * The prompt embeds all evaluation data so the LLM has full context
 * without needing to infer or hallucinate corrections.
 */
export const buildPrompt = (request: AICoachRequest): string => {
  const lines: string[] = [
    `Mudra: ${request.mudra}`,
    `Accuracy: ${request.score}%`,
    `Correct fingers: ${request.correctFingers.length > 0 ? request.correctFingers.join(", ") : "none"}`,
    `Incorrect fingers: ${request.incorrectFingers.length > 0 ? request.incorrectFingers.join(", ") : "none"}`,
    `Current coach message: "${request.coachMessage}"`,
  ];

  if (request.suggestedCorrections.length > 0) {
    lines.push(`Suggested corrections:`);
    for (const correction of request.suggestedCorrections) {
      lines.push(`  - ${correction}`);
    }
  }

  lines.push("");
  lines.push(
    "Based on the above evaluation, provide brief, encouraging coaching feedback for this student. Follow your rules strictly."
  );

  return lines.join("\n");
};

/**
 * Returns the system role prompt for the AI coach.
 * Separated so the caller can pass it as the system message to the LLM.
 */
export const getSystemPrompt = (): string => SYSTEM_ROLE;
