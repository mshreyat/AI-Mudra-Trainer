import { NormalizedLandmark } from '@mediapipe/tasks-vision';

// Hand landmark connections based on MediaPipe's topology
export const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index finger
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle finger
  [5, 9], [9, 10], [10, 11], [11, 12],
  // Ring finger
  [9, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]
];

export const drawHandSkeleton = (
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  width: number,
  height: number
) => {
  ctx.clearRect(0, 0, width, height);
  
  if (!landmarks || landmarks.length === 0) return;

  // Set line styles for the skeleton
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  // Draw connections (bones)
  ctx.strokeStyle = 'rgba(238, 122, 17, 0.8)'; // Using primary-500 from the Tailwind palette
  for (const connection of HAND_CONNECTIONS) {
    const start = landmarks[connection[0]];
    const end = landmarks[connection[1]];
    
    if (start && end) {
      ctx.beginPath();
      ctx.moveTo(start.x * width, start.y * height);
      ctx.lineTo(end.x * width, end.y * height);
      ctx.stroke();
    }
  }

  // Draw landmarks (joints)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'; // White dots
  ctx.strokeStyle = 'rgba(238, 122, 17, 1)'; // Primary border
  ctx.lineWidth = 2;

  for (const landmark of landmarks) {
    ctx.beginPath();
    ctx.arc(landmark.x * width, landmark.y * height, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
};
