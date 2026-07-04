import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let handLandmarker: HandLandmarker | null = null;
let isInitializing = false;

export const getHandLandmarker = async (): Promise<HandLandmarker> => {
  if (handLandmarker) return handLandmarker;
  
  if (isInitializing) {
    // Wait for initialization to complete if already requested
    while (isInitializing) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return handLandmarker!;
  }

  isInitializing = true;
  
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    );

    handLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numHands: 1 // Detect only one hand as required
    });
    
    return handLandmarker;
  } finally {
    isInitializing = false;
  }
};
