import { NormalizedLandmark } from "@mediapipe/tasks-vision";

export const getVector = (p1: NormalizedLandmark, p2: NormalizedLandmark) => {
  return {
    x: p2.x - p1.x,
    y: p2.y - p1.y,
    z: p2.z - p1.z
  };
};

export const getMagnitude = (v: {x: number, y: number, z: number}) => {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
};

export const getDotProduct = (v1: {x: number, y: number, z: number}, v2: {x: number, y: number, z: number}) => {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};

// Returns angle in degrees between three points (p1 -> p2 -> p3)
export const calculateAngle3D = (p1: NormalizedLandmark, p2: NormalizedLandmark, p3: NormalizedLandmark): number => {
  const v1 = getVector(p2, p1); // Vector from p2 to p1
  const v2 = getVector(p2, p3); // Vector from p2 to p3

  const mag1 = getMagnitude(v1);
  const mag2 = getMagnitude(v2);

  if (mag1 === 0 || mag2 === 0) return 0;

  const dot = getDotProduct(v1, v2);
  let cosTheta = dot / (mag1 * mag2);
  
  // Clamp to [-1, 1] to avoid NaN from floating point errors
  cosTheta = Math.max(-1, Math.min(1, cosTheta));
  
  return (Math.acos(cosTheta) * 180.0) / Math.PI;
};
