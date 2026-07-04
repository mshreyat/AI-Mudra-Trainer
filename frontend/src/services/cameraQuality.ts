import { NormalizedLandmark } from '@mediapipe/tasks-vision';

export type CameraGuidance = 
  | "Move closer to the camera"
  | "Move your hand slightly back"
  | "Keep your entire hand inside the frame"
  | "Hold your hand steady"
  | null;

let lastWristPositions: { x: number; y: number; time: number }[] = [];

/**
 * Evaluates the raw MediaPipe landmarks to detect suboptimal camera conditions.
 * Returns a guidance string if an issue is detected, or null if the frame is good.
 */
export const checkCameraQuality = (landmarks: NormalizedLandmark[] | null): CameraGuidance => {
  if (!landmarks || landmarks.length === 0) {
    lastWristPositions = [];
    return null;
  }

  // Extract all X and Y coordinates
  const xs = landmarks.map(l => l.x);
  const ys = landmarks.map(l => l.y);
  
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  // 1. Keep hand in frame / Move back
  // If landmarks are touching the extreme edges of the camera view
  if (minX < 0.02 || maxX > 0.98 || minY < 0.02 || maxY > 0.98) {
    return "Keep your entire hand inside the frame";
  }

  // 2. Check scale (distance to camera)
  const width = maxX - minX;
  const height = maxY - minY;
  
  // Hand is too small (too far away)
  if (width < 0.15 && height < 0.15) {
    return "Move closer to the camera";
  }
  
  // Hand is too large (too close)
  if (width > 0.85 || height > 0.85) {
    return "Move your hand slightly back";
  }

  // 3. Check steadiness (velocity of wrist)
  const wrist = landmarks[0];
  const now = performance.now();
  
  lastWristPositions.push({ x: wrist.x, y: wrist.y, time: now });
  
  // Keep only the last 10 frames (~300ms at 30fps)
  if (lastWristPositions.length > 10) {
    lastWristPositions.shift();
  }

  if (lastWristPositions.length >= 5) {
    const oldest = lastWristPositions[0];
    const newest = lastWristPositions[lastWristPositions.length - 1];
    const dt = newest.time - oldest.time;
    
    if (dt > 0) {
      const dx = newest.x - oldest.x;
      const dy = newest.y - oldest.y;
      // Calculate velocity in normalized screen units per second
      const velocity = Math.sqrt(dx * dx + dy * dy) / (dt / 1000); 
      
      // If moving more than ~80% of the screen width per second, it's too fast
      if (velocity > 0.8) {
        return "Hold your hand steady";
      }
    }
  }

  return null;
};
