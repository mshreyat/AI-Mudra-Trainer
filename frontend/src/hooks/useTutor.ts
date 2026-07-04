import { useRef, useMemo, useState, useEffect } from "react";
import { HandGeometry } from "../utils/geometry/handGeometry";
import { MudraRule, ComparisonResult } from "../types/rule";
import { FingerName } from "../utils/geometry/fingertipContact";
import { evaluateTutor, TutorEvaluation } from "../services/tutorEngine";
import { checkCameraQuality } from "../services/cameraQuality";
import { NormalizedLandmark } from "@mediapipe/tasks-vision";

// ─── Types ───────────────────────────────────────────────────────────

export type PerformanceBand = 
  | "Excellent" 
  | "Very Good" 
  | "Good" 
  | "Needs Improvement" 
  | "Practice Again";

export interface TutorData {
  smoothedScore: number;
  performanceBand: PerformanceBand;
  fingerAccuracy: Record<FingerName, number>;
  mostIncorrectFinger: FingerName | null;
  coachMessage: string;
  suggestedCorrections: string[];
  isCorrect: boolean;
  isCompleted: boolean;
  latestResult: ComparisonResult | null;
}

// ─── Constants ───────────────────────────────────────────────────────

const BUFFER_SIZE = 30; // Increased buffer for heavier smoothing
const SUCCESS_THRESHOLD = 75; // Treat 75% and above as successful mudra
const COMPLETION_TIME_MS = 3000; // 3 seconds continuous hold

const FINGER_NAMES: FingerName[] = ["thumb", "index", "middle", "ring", "little"];

const IDLE_TUTOR_DATA: TutorData = {
  smoothedScore: 0,
  performanceBand: "Practice Again",
  fingerAccuracy: { thumb: 0, index: 0, middle: 0, ring: 0, little: 0 },
  mostIncorrectFinger: null,
  coachMessage: "Show your hand to the camera to begin.",
  suggestedCorrections: [],
  isCorrect: false,
  isCompleted: false,
  latestResult: null,
};

// ─── Helper ──────────────────────────────────────────────────────────

const getPerformanceBand = (score: number): PerformanceBand => {
  if (score >= 95) return "Excellent";
  if (score >= 85) return "Very Good";
  if (score >= 75) return "Good";
  if (score >= 60) return "Needs Improvement";
  return "Practice Again";
};

// ─── Hook ────────────────────────────────────────────────────────────

export const useTutor = (
  handGeometry: HandGeometry | null,
  mudraRule: MudraRule | null,
  landmarks: NormalizedLandmark[] | null
): TutorData => {
  const bufferRef = useRef<TutorEvaluation[]>([]);
  const prevRuleNameRef = useRef<string | null>(null);
  
  // Track temporal completion
  const firstSuccessTimeRef = useRef<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Track start of buffer for positive reinforcement
  const startScoreRef = useRef<number>(0);

  // Reset states when rule changes
  if (mudraRule && mudraRule.name !== prevRuleNameRef.current) {
    bufferRef.current = [];
    prevRuleNameRef.current = mudraRule.name;
    firstSuccessTimeRef.current = null;
    setIsCompleted(false);
    startScoreRef.current = 0;
  }

  const tutorData = useMemo<TutorData>(() => {
    // 1. Evaluate Camera Quality first
    const cameraGuidance = checkCameraQuality(landmarks);

    if (cameraGuidance || !handGeometry || !mudraRule) {
      // If there's an issue with tracking, suspend evaluation
      return {
        ...IDLE_TUTOR_DATA,
        coachMessage: cameraGuidance || IDLE_TUTOR_DATA.coachMessage,
      };
    }

    // 2. Run Tutor Engine
    const evaluation = evaluateTutor(handGeometry, mudraRule);

    const buffer = bufferRef.current;
    if (buffer.length === 0) {
      startScoreRef.current = evaluation.overallScore;
    }
    
    buffer.push(evaluation);
    if (buffer.length > BUFFER_SIZE) {
      // Slide the window and update the anchor score for improvement tracking
      const removed = buffer.shift();
      if (removed) {
        startScoreRef.current = buffer[0].overallScore;
      }
    }

    // 3. Heavy Smoothing
    const smoothedScore = Math.round(
      buffer.reduce((sum, e) => sum + e.overallScore, 0) / buffer.length
    );

    const performanceBand = getPerformanceBand(smoothedScore);
    const isCorrect = smoothedScore >= SUCCESS_THRESHOLD;

    // 4. Temporal Completion Logic
    let currentIsCompleted = isCompleted;
    if (isCorrect) {
      const now = performance.now();
      if (!firstSuccessTimeRef.current) {
        firstSuccessTimeRef.current = now;
      } else if (now - firstSuccessTimeRef.current >= COMPLETION_TIME_MS) {
        currentIsCompleted = true;
      }
    } else {
      // Dropped below threshold, reset timer
      firstSuccessTimeRef.current = null;
    }

    // 5. Positive Reinforcement
    let coachMessage = evaluation.coachMessage;
    if (isCorrect && currentIsCompleted) {
      coachMessage = "Mudra completed successfully.";
    } else if (smoothedScore - startScoreRef.current > 15) {
      coachMessage = "Great improvement!";
    } else if (isCorrect && !currentIsCompleted) {
      coachMessage = "Nice, hold the mudra.";
    }

    // Smooth per-finger accuracy
    const fingerAccuracy = {} as Record<FingerName, number>;
    for (const name of FINGER_NAMES) {
      const correctCount = buffer.filter((e) =>
        e.fingerScores.find((f) => f.name === name)?.correct
      ).length;
      fingerAccuracy[name] = Math.round((correctCount / buffer.length) * 100);
    }

    let mostIncorrectFinger: FingerName | null = null;
    let lowestAccuracy = 100;
    for (const name of FINGER_NAMES) {
      if (fingerAccuracy[name] < lowestAccuracy) {
        lowestAccuracy = fingerAccuracy[name];
        mostIncorrectFinger = name;
      }
    }
    if (lowestAccuracy === 100) mostIncorrectFinger = null;

    return {
      smoothedScore,
      performanceBand,
      fingerAccuracy,
      mostIncorrectFinger,
      coachMessage,
      suggestedCorrections: evaluation.suggestedCorrections,
      isCorrect,
      isCompleted: currentIsCompleted,
      latestResult: evaluation.evaluationResult,
    };
  }, [handGeometry, mudraRule, landmarks, isCompleted]);

  // Sync state if completed changed
  useEffect(() => {
    if (tutorData.isCompleted !== isCompleted) {
      setIsCompleted(tutorData.isCompleted);
    }
  }, [tutorData.isCompleted, isCompleted]);

  return tutorData;
};
