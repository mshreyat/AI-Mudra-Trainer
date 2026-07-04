import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { analyzeFinger, analyzeThumb, FingerGeometry } from "./fingerState";
import { analyzePalm, PalmGeometry } from "./palmGeometry";
import { analyzeFingerSpread, FingerSpread } from "./fingerSpread";
import { analyzeFingertipContacts, FingertipContact, FingerName } from "./fingertipContact";

export interface HandGeometry {
  thumb: FingerGeometry;
  index: FingerGeometry;
  middle: FingerGeometry;
  ring: FingerGeometry;
  little: FingerGeometry;
  palm: PalmGeometry;
  spread: FingerSpread;
  contacts: FingertipContact[];
}

/**
 * Extracts a complete semantic hand geometry snapshot from MediaPipe landmarks.
 *
 * @param landmarks - 21 normalized hand landmarks from MediaPipe
 * @param handedness - "Left" or "Right" (display-corrected)
 * @param contactPairs - Optional pairs of fingers to check for contact.
 *                       Defaults to empty (no contact checks) unless specified.
 */
export const calculateHandGeometry = (
  landmarks: NormalizedLandmark[],
  handedness: string,
  contactPairs: { finger1: FingerName; finger2: FingerName }[] = []
): HandGeometry | null => {
  if (!landmarks || landmarks.length < 21) return null;

  return {
    thumb: analyzeThumb(landmarks),
    index: analyzeFinger(landmarks, 5, 6, 7, 8),
    middle: analyzeFinger(landmarks, 9, 10, 11, 12),
    ring: analyzeFinger(landmarks, 13, 14, 15, 16),
    little: analyzeFinger(landmarks, 17, 18, 19, 20),
    palm: analyzePalm(landmarks, handedness),
    spread: analyzeFingerSpread(landmarks),
    contacts: analyzeFingertipContacts(landmarks, contactPairs),
  };
};
