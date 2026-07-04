import { useEffect, useRef, useState } from 'react';
import { HandLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision';
import { getHandLandmarker } from '@/services/mediapipe';
import { calculateHandGeometry, HandGeometry } from '@/utils/geometry/handGeometry';

export interface UseHandTrackingReturn {
  handDetected: boolean;
  landmarks: NormalizedLandmark[] | null;
  handedness: string | null;
  handGeometry: HandGeometry | null;
  fps: number;
}

export const useHandTracking = (videoRef: React.RefObject<HTMLVideoElement | null>): UseHandTrackingReturn => {
  const [handDetected, setHandDetected] = useState(false);
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[] | null>(null);
  const [handedness, setHandedness] = useState<string | null>(null);
  const [handGeometry, setHandGeometry] = useState<HandGeometry | null>(null);
  const [fps, setFps] = useState(0);

  const requestRef = useRef<number>(0);
  const lastVideoTimeRef = useRef<number>(-1);
  const landmarkerRef = useRef<HandLandmarker | null>(null);

  // Use a ref to track the boolean state internally to avoid unnecessary re-renders
  const lastHandDetectedRef = useRef(false);

  // FPS Tracking
  const frameCountRef = useRef<number>(0);
  const lastFpsTimeRef = useRef<number>(performance.now());

  // Initialize the HandLandmarker
  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        const landmarker = await getHandLandmarker();
        if (active) landmarkerRef.current = landmarker;
      } catch (err) {
        console.error("Failed to initialize HandLandmarker:", err);
      }
    };
    init();
    return () => { active = false; };
  }, []);

  // Run the detection loop using requestAnimationFrame
  useEffect(() => {
    const detect = () => {
      if (!videoRef.current || !landmarkerRef.current) {
        requestRef.current = requestAnimationFrame(detect);
        return;
      }

      const video = videoRef.current;

      // Only process when video has loaded and is playing
      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        const startTimeMs = performance.now();

        // Only run inference if there's a new video frame
        if (lastVideoTimeRef.current !== video.currentTime) {
          lastVideoTimeRef.current = video.currentTime;

          try {
            const results = landmarkerRef.current.detectForVideo(video, startTimeMs);
            const hasHand = results.landmarks && results.landmarks.length > 0;

            if (hasHand) {
              setLandmarks(results.landmarks[0]);
              const detectedHand =
                results.handednesses[0]?.[0]?.categoryName || "Unknown";

              // Since the webcam is mirrored, flip the displayed label
              const displayHand =
                detectedHand === "Left"
                  ? "Right"
                  : detectedHand === "Right"
                    ? "Left"
                    : "Unknown";

              setHandedness(displayHand);
              setHandGeometry(calculateHandGeometry(results.landmarks[0], displayHand));
              if (!lastHandDetectedRef.current) {
                setHandDetected(true);
                lastHandDetectedRef.current = true;
              }
            } else {
              // No hand detected in this frame
              if (lastHandDetectedRef.current) {
                setLandmarks(null);
                setHandedness(null);
                setHandGeometry(null);
                setHandDetected(false);
                lastHandDetectedRef.current = false;
              }
            }
          } catch (error) {
            console.error("Error during hand detection:", error);
          }
        }
      }

      // Calculate and update FPS every second
      frameCountRef.current += 1;
      const now = performance.now();
      const elapsed = now - lastFpsTimeRef.current;
      if (elapsed >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / elapsed));
        frameCountRef.current = 0;
        lastFpsTimeRef.current = now;
      }

      // Schedule next frame
      requestRef.current = requestAnimationFrame(detect);
    };

    // Start the loop
    requestRef.current = requestAnimationFrame(detect);

    // Cleanup
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [videoRef]); // videoRef is stable, so this effect runs once and loops internally

  return { handDetected, landmarks, handedness, handGeometry, fps };
};
