import Groq from "groq-sdk";
import type { AICoachRequest, AICoachResponse } from "@/types/aiCoach";
import { buildPrompt, getSystemPrompt } from "@/services/promptBuilder";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Sends a test prompt to Groq and returns the generated text.
 */
export const testGroq = async (): Promise<string> => {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "user",
        content: "Say hello to the MudraSense AI project in one sentence.",
      },
    ],
  });

  return response.choices[0]?.message?.content ?? "";
};

/**
 * Generates AI coaching feedback based on TutorEvaluation.
 * If the API call fails, falls back to the original rule engine's coach message.
 */
export const generateAICoaching = async (
  request: AICoachRequest
): Promise<AICoachResponse> => {
  try {
    const systemPrompt = getSystemPrompt();
    const userPrompt = buildPrompt(request);

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 150,
    });

    const feedback = response.choices[0]?.message?.content ?? request.coachMessage;
    return { feedback };
  } catch (error) {
    console.error("Groq AI coaching generation failed, using fallback coach message:", error);
    return { feedback: request.coachMessage };
  }
};

/**
 * Generates a professional Bharatanatyam Guru Review for a completed video performance report.
 * Constrained to 120 words maximum, ends with one practice recommendation.
 */
export const generateGuruPerformanceReview = async (
  report: {
    expectedMudra: string;
    averageAccuracy: number;
    bestFrame: { timestamp: number; score: number };
    worstFrame: { timestamp: number; score: number };
    commonFingerErrors: { finger: string; count: number }[];
  }
): Promise<string> => {
  const topErrors = report.commonFingerErrors
    .filter((e) => e.count > 0)
    .map((e) => `${e.finger} (${e.count} times)`)
    .join(", ");

  const prompt = [
    `You are Guru Nataraja, an experienced Bharatanatyam teacher reviewing a student's recorded practice video.`,
    `Review this report summary and provide your professional feedback:`,
    `- Expected Mudra: ${report.expectedMudra}`,
    `- Average Accuracy: ${report.averageAccuracy}%`,
    `- Best Accuracy: ${report.bestFrame.score}% at ${report.bestFrame.timestamp}s`,
    `- Worst Accuracy: ${report.worstFrame.score}% at ${report.worstFrame.timestamp}s`,
    `- Finger Errors: ${topErrors || "None detected"}`,
    ``,
    `Rules:`,
    `1. Be encouraging, warm, but critical of alignment as a classical guru would.`,
    `2. Strict maximum of 120 words.`,
    `3. Recommend a specific mudra to practice next based on their performance.`,
  ].join("\n");

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 200,
    });

    return response.choices[0]?.message?.content ?? getDefaultGuruReview(report);
  } catch (error) {
    console.error("Groq AI Guru Performance Review failed, using local fallback review:", error);
    return getDefaultGuruReview(report);
  }
};

/**
 * Local fallback review in case Groq is unavailable.
 */
const getDefaultGuruReview = (report: {
  expectedMudra: string;
  averageAccuracy: number;
  commonFingerErrors: { finger: string; count: number }[];
}): string => {
  const primaryError = report.commonFingerErrors[0]?.finger;
  const errorText = primaryError
    ? `Pay close attention to your ${primaryError} position, as it was the most frequent source of alignment issues.`
    : "Your fingers maintained excellent structure throughout the practice.";

  return `Blessings, student. You practiced the ${report.expectedMudra} mudra with an average accuracy of ${report.averageAccuracy}%. ${errorText} For your next lesson, I recommend practicing the Tripataka mudra to expand your control over finger extension. Continue your practice with dedication.`;
};

