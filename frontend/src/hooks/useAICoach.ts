import { useState, useEffect, useRef, useCallback } from "react";
import type { AICoachRequest } from "@/types/aiCoach";
import { generateAICoaching } from "@/services/llmService";

// Global cache to store responses and avoid repeated API calls
const coachCache = new Map<string, string>();

/**
 * Checks if two string arrays are equal regardless of ordering.
 */
const arrayEquals = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
};

/**
 * Generates a unique JSON cache key for an AICoachRequest.
 * Sorted finger lists are used to ensure order-independent caching.
 */
const getCacheKey = (req: AICoachRequest): string => {
  return JSON.stringify({
    mudra: req.mudra,
    score: req.score,
    correctFingers: [...req.correctFingers].sort(),
    incorrectFingers: [...req.incorrectFingers].sort(),
    coachMessage: req.coachMessage,
    suggestedCorrections: [...req.suggestedCorrections].sort(),
  });
};

/**
 * React hook that manages the explainable AI Coach interaction logic.
 *
 * It accepts the current tutor evaluation and selected mudra name, handles
 * input change thresholds, debounces calls to Groq by 700ms, and implements
 * request caching to optimize performance and prevent API call flooding.
 */
export const useAICoach = (
  evaluation: any,
  mudraName: string
) => {
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastRequest, setLastRequest] = useState<AICoachRequest | null>(null);

  // Manual refresh count to trigger update cycles manually
  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const lastProcessedRefreshRef = useRef<number>(0);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Forces the hook to regenerate AI feedback based on the current evaluation.
   */
  const refresh = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!evaluation) {
      return;
    }

    // 1. Standardize the evaluation data structure (supports TutorEvaluation and TutorData)
    const score =
      typeof evaluation.overallScore === "number"
        ? evaluation.overallScore
        : typeof evaluation.smoothedScore === "number"
        ? evaluation.smoothedScore
        : 0;

    let correctFingers: string[] = [];
    let incorrectFingers: string[] = [];

    const result = evaluation.evaluationResult || evaluation.latestResult;
    if (result) {
      correctFingers = result.correctFingers || [];
      incorrectFingers = result.incorrectFingers || [];
    } else if (Array.isArray(evaluation.fingerScores)) {
      correctFingers = evaluation.fingerScores
        .filter((f: any) => f.correct)
        .map((f: any) => f.name);
      incorrectFingers = evaluation.fingerScores
        .filter((f: any) => !f.correct)
        .map((f: any) => f.name);
    } else if (evaluation.fingerAccuracy) {
      for (const [finger, acc] of Object.entries(evaluation.fingerAccuracy)) {
        if ((acc as number) >= 80) {
          correctFingers.push(finger);
        } else {
          incorrectFingers.push(finger);
        }
      }
    }

    const currentRequest: AICoachRequest = {
      mudra: mudraName,
      score,
      correctFingers,
      incorrectFingers,
      coachMessage: evaluation.coachMessage || "",
      suggestedCorrections: evaluation.suggestedCorrections || [],
    };

    // 2. Evaluate update rules (Mudra change, score change >= 10%, finger list change, or refresh)
    const isFirstRequest = lastRequest === null;
    const mudraChanged = lastRequest ? currentRequest.mudra !== lastRequest.mudra : false;
    const scoreChangedSignificantly = lastRequest ? Math.abs(currentRequest.score - lastRequest.score) >= 10 : false;
    const incorrectFingersChanged = lastRequest ? !arrayEquals(currentRequest.incorrectFingers, lastRequest.incorrectFingers) : false;
    const isRefreshTriggered = refreshCounter > lastProcessedRefreshRef.current;

    const shouldUpdate =
      isFirstRequest ||
      mudraChanged ||
      scoreChangedSignificantly ||
      incorrectFingersChanged ||
      isRefreshTriggered;

    if (!shouldUpdate) {
      return;
    }

    // 3. Clear any pending debounced requests
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // 4. Set debounce timeout to 700ms to throttle API calls during fluid movement
    debounceTimeoutRef.current = setTimeout(async () => {
      lastProcessedRefreshRef.current = refreshCounter;
      const cacheKey = getCacheKey(currentRequest);

      // Check cache for an identical request
      if (coachCache.has(cacheKey)) {
        const cachedResponse = coachCache.get(cacheKey)!;
        setFeedback(cachedResponse);
        setLastRequest(currentRequest);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await generateAICoaching(currentRequest);
        coachCache.set(cacheKey, response.feedback);
        setFeedback(response.feedback);
        setLastRequest(currentRequest);
      } catch (err: any) {
        setError(err instanceof Error ? err : new Error(String(err)));
        // Fall back to rule-based message on failure
        setFeedback(currentRequest.coachMessage);
      } finally {
        setLoading(false);
      }
    }, 700);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [evaluation, mudraName, refreshCounter, lastRequest]);

  return {
    feedback,
    loading,
    error,
    refresh,
    lastRequest,
  };
};
