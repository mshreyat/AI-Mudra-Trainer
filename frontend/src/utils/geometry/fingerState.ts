import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { calculateAngle3D } from "./calculateAngles";

export type FingerState = "Extended" | "Partially Bent" | "Bent";

export interface FingerGeometry {
  state: FingerState;
  bendAngle: number;
}

export const analyzeFinger = (
  landmarks: NormalizedLandmark[],
  mcpIdx: number,
  pipIdx: number,
  dipIdx: number,
  tipIdx: number
): FingerGeometry => {
  // We use PIP and DIP joints to determine if the finger is curled
  const pipAngle = calculateAngle3D(landmarks[mcpIdx], landmarks[pipIdx], landmarks[dipIdx]);
  const dipAngle = calculateAngle3D(landmarks[pipIdx], landmarks[dipIdx], landmarks[tipIdx]);
  
  // A perfectly straight joint is ~180 degrees. Deviation from 180 is the "bend".
  const pipBend = 180 - pipAngle;
  const dipBend = 180 - dipAngle;
  
  const totalBend = pipBend + dipBend;

  let state: FingerState = "Extended";
  if (totalBend > 100) {
    state = "Bent";
  } else if (totalBend > 35) {
    state = "Partially Bent";
  }

  return {
    state,
    bendAngle: totalBend
  };
};

export const analyzeThumb = (
  landmarks: NormalizedLandmark[]
): FingerGeometry => {
  // Thumb joints: CMC(1), MCP(2), IP(3), Tip(4)
  const mcpAngle = calculateAngle3D(landmarks[1], landmarks[2], landmarks[3]);
  const ipAngle = calculateAngle3D(landmarks[2], landmarks[3], landmarks[4]);

  const mcpBend = 180 - mcpAngle;
  const ipBend = 180 - ipAngle;

  const totalBend = mcpBend + ipBend;

  let state: FingerState = "Extended";
  // Thumb has slightly different range of motion than other fingers
  if (totalBend > 70) {
    state = "Bent";
  } else if (totalBend > 25) {
    state = "Partially Bent";
  }

  return {
    state,
    bendAngle: totalBend
  };
};
