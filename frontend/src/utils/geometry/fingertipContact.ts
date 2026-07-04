import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { getMagnitude, getVector } from "./calculateAngles";

export type FingerName = "thumb" | "index" | "middle" | "ring" | "little";

export interface FingertipContact {
  finger1: FingerName;
  finger2: FingerName;
  touching: boolean;
}

/**
 * Maps finger names to their tip landmark indices.
 */
const TIP_INDEX_MAP: Record<FingerName, number> = {
  thumb: 4,
  index: 8,
  middle: 12,
  ring: 16,
  little: 20,
};

/**
 * Contact threshold in normalized landmark space.
 * Two fingertips closer than this distance are considered touching.
 */
const CONTACT_THRESHOLD = 0.04;

/**
 * Checks whether specified pairs of fingertips are in contact.
 *
 * @param landmarks - MediaPipe hand landmarks (21 points)
 * @param pairs - Pairs of fingers to check for contact
 * @returns Array of contact results for each requested pair
 */
export const analyzeFingertipContacts = (
  landmarks: NormalizedLandmark[],
  pairs: { finger1: FingerName; finger2: FingerName }[]
): FingertipContact[] => {
  return pairs.map(({ finger1, finger2 }) => {
    const tip1 = landmarks[TIP_INDEX_MAP[finger1]];
    const tip2 = landmarks[TIP_INDEX_MAP[finger2]];
    const vec = getVector(tip1, tip2);
    const distance = getMagnitude(vec);

    return {
      finger1,
      finger2,
      touching: distance < CONTACT_THRESHOLD,
    };
  });
};
