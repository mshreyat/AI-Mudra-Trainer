import { FingerName } from "../utils/geometry/fingertipContact";
import { TutorData } from "../hooks/useTutor";

export type HighlightColor = "green" | "yellow" | "red" | "none";
export type AnimationType = "pulse" | "glow" | "none";

export interface VisualInstructions {
  highlightedFinger: FingerName | null;
  highlightColor: HighlightColor;
  fingerColors: Record<FingerName, HighlightColor>;
  overlayMessage: string | null;
  animationType: AnimationType;
}

const getAccuracyColor = (accuracy: number): HighlightColor => {
  if (accuracy >= 80) return "green";
  if (accuracy >= 50) return "yellow";
  return "red";
};

/**
 * Converts smoothed TutorData into visual instructions for the UI layer.
 * Pure service with no React dependencies.
 */
export const getVisualInstructions = (tutorData: TutorData): VisualInstructions => {
  const fingerColors = {} as Record<FingerName, HighlightColor>;
  const FINGER_NAMES: FingerName[] = ["thumb", "index", "middle", "ring", "little"];
  
  FINGER_NAMES.forEach(finger => {
    fingerColors[finger] = getAccuracyColor(tutorData.fingerAccuracy[finger]);
  });

  // Only highlight one finger - the most incorrect one
  const highlightedFinger = tutorData.mostIncorrectFinger;
  const highlightColor = highlightedFinger ? fingerColors[highlightedFinger] : "none";
  
  // Choose animation type based on state
  const animationType: AnimationType = tutorData.isCorrect ? "glow" : (highlightedFinger ? "pulse" : "none");
  
  // Format the coach message
  let overlayMessage = null;
  if (tutorData.isCorrect) {
    overlayMessage = "Hold this position";
  } else if (highlightedFinger) {
    // We already have the formatted feedback in tutorData.coachMessage.
    // Assuming coachMessage targets the most important error which matches the highlighted finger.
    overlayMessage = tutorData.coachMessage;
  } else {
    overlayMessage = tutorData.coachMessage;
  }

  return {
    highlightedFinger,
    highlightColor,
    fingerColors,
    overlayMessage,
    animationType
  };
};
