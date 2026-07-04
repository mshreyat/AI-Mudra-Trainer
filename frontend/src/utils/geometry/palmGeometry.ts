import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { getVector } from "./calculateAngles";

export interface PalmGeometry {
  center: { x: number; y: number; z: number };
  orientation: string;
  direction: string;
}

const crossProduct = (v1: {x:number, y:number, z:number}, v2: {x:number, y:number, z:number}) => {
  return {
    x: v1.y * v2.z - v1.z * v2.y,
    y: v1.z * v2.x - v1.x * v2.z,
    z: v1.x * v2.y - v1.y * v2.x
  };
};

export const analyzePalm = (landmarks: NormalizedLandmark[], handedness: string): PalmGeometry => {
  const wrist = landmarks[0];
  const indexMcp = landmarks[5];
  const pinkyMcp = landmarks[17];

  // Center is approximately the average of wrist, indexMcp, pinkyMcp
  const center = {
    x: (wrist.x + indexMcp.x + pinkyMcp.x) / 3,
    y: (wrist.y + indexMcp.y + pinkyMcp.y) / 3,
    z: (wrist.z + indexMcp.z + pinkyMcp.z) / 3,
  };

  const v1 = getVector(wrist, indexMcp);
  const v2 = getVector(wrist, pinkyMcp);

  // Normal vector. Handedness affects cross product direction.
  let normal = crossProduct(v1, v2);
  if (handedness === "Left") {
    // Invert normal for left hand to standardize "out of palm" direction
    normal = { x: -normal.x, y: -normal.y, z: -normal.z };
  }

  let orientation = "Neutral";
  if (normal.z < -0.02) orientation = "Facing Camera";
  else if (normal.z > 0.02) orientation = "Facing Away";
  
  let direction = "Neutral";
  if (v1.y < -0.05) direction = "Pointing Up";
  else if (v1.y > 0.05) direction = "Pointing Down";
  else if (v1.x < -0.05) direction = "Pointing Left";
  else if (v1.x > 0.05) direction = "Pointing Right";

  return { center, orientation, direction };
};
