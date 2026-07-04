import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { getMagnitude, getVector } from "./calculateAngles";

export type FingerSpread = "Close" | "Medium" | "Wide";

/**
 * Fingertip landmark indices for the five fingers.
 * Thumb(4), Index(8), Middle(12), Ring(16), Little(20)
 */
const TIP_INDICES = [4, 8, 12, 16, 20] as const;

/**
 * Analyzes the overall finger spread by measuring Euclidean distances
 * between adjacent fingertip landmarks and averaging them.
 *
 * Thresholds are calibrated for MediaPipe normalized landmark space
 * where coordinates range from 0 to 1.
 */
export const analyzeFingerSpread = (landmarks: NormalizedLandmark[]): FingerSpread => {
  // Compute distances between adjacent fingertip pairs:
  // thumb-index, index-middle, middle-ring, ring-little
  let totalDistance = 0;
  for (let i = 0; i < TIP_INDICES.length - 1; i++) {
    const vec = getVector(landmarks[TIP_INDICES[i]], landmarks[TIP_INDICES[i + 1]]);
    totalDistance += getMagnitude(vec);
  }

  const avgDistance = totalDistance / (TIP_INDICES.length - 1);

  // Thresholds in normalized landmark space:
  // Close:  fingers held together, avg tip distance < 0.06
  // Medium: slight splay,          avg tip distance 0.06–0.12
  // Wide:   full splay,            avg tip distance > 0.12
  if (avgDistance > 0.12) return "Wide";
  if (avgDistance > 0.06) return "Medium";
  return "Close";
};
