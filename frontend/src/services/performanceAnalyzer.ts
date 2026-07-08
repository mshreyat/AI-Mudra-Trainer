import { getHandLandmarker } from "./mediapipe";
import { calculateHandGeometry } from "@/utils/geometry/handGeometry";
import { evaluateMudra } from "./ruleEngine";
import { getRuleByName } from "./ruleRegistry";
import { loadVideo, extractFrames } from "./videoFrameExtractor";
import type { PerformanceReport, PerformanceFrameResult } from "@/types/review";

/**
 * Analyzes an uploaded video file frame-by-frame for a specific target mudra.
 *
 * Runs MediaPipe, calculateHandGeometry, and the Semantic Rule Engine on each frame,
 * compiling a final report containing summary statistics and a precise time-based timeline.
 *
 * @param videoFile - The uploaded video file (MP4/etc)
 * @param mudraName - Name of the expected mudra to check against
 * @param onProgress - Callback to notify parent components of percent progress (0 to 100)
 */
export const analyzeVideoPerformance = async (
  videoFile: File,
  mudraName: string,
  onProgress: (percentage: number) => void
): Promise<PerformanceReport> => {
  // 1. Get the hand landmarker and mudra rule
  const landmarker = await getHandLandmarker();
  const mudraRule = getRuleByName(mudraName);
  if (!mudraRule) {
    throw new Error(`Mudra rule not found for: ${mudraName}`);
  }

  // 2. Load the video file
  const video = await loadVideo(videoFile);
  const durationSeconds = video.duration;

  const timeline: PerformanceFrameResult[] = [];

  // 3. Process video frames sequentially every 250ms
  const sampleRateMs = 250;
  
  await extractFrames(
    video,
    sampleRateMs,
    async (canvas, timestampSeconds) => {
      const timestampMs = Math.round(timestampSeconds * 1000);
      
      // Perform MediaPipe inference
      const results = landmarker.detectForVideo(canvas, timestampMs);
      const hasHand = results.landmarks && results.landmarks.length > 0;

      if (hasHand) {
        const rawLandmarks = results.landmarks[0];
        // For uploaded video, the handedness is anatomical (no mirroring needed)
        const handedness = results.handednesses[0]?.[0]?.categoryName || "Right";
        
        const geometry = calculateHandGeometry(
          rawLandmarks,
          handedness,
          mudraRule.fingertipContacts
        );

        if (geometry) {
          const comparison = evaluateMudra(geometry, mudraRule);
          
          timeline.push({
            timestamp: parseFloat(timestampSeconds.toFixed(2)),
            handDetected: true,
            score: comparison.score,
            correctFingers: comparison.correctFingers,
            incorrectFingers: comparison.incorrectFingers,
          });
          return;
        }
      }

      // If no hand detected, record empty results
      timeline.push({
        timestamp: parseFloat(timestampSeconds.toFixed(2)),
        handDetected: false,
        score: 0,
        correctFingers: [],
        incorrectFingers: ["thumb", "index", "middle", "ring", "little"],
      });
    },
    onProgress
  );

  // 4. Calculate aggregates
  let totalScoreSum = 0;
  let detectedCount = 0;
  let bestScore = -1;
  let bestTimestamp = 0;
  let worstScore = 101;
  let worstTimestamp = 0;

  const fingerErrorCounts: Record<string, number> = {
    thumb: 0,
    index: 0,
    middle: 0,
    ring: 0,
    little: 0,
  };

  for (const result of timeline) {
    if (result.handDetected) {
      const score = result.score;
      totalScoreSum += score;
      detectedCount++;

      if (score > bestScore) {
        bestScore = score;
        bestTimestamp = result.timestamp;
      }
      if (score < worstScore) {
        worstScore = score;
        worstTimestamp = result.timestamp;
      }

      for (const finger of result.incorrectFingers) {
        fingerErrorCounts[finger] = (fingerErrorCounts[finger] || 0) + 1;
      }
    }
  }

  const averageAccuracy = detectedCount > 0 ? Math.round(totalScoreSum / detectedCount) : 0;
  const bestFrame = {
    timestamp: bestTimestamp,
    score: bestScore >= 0 ? bestScore : 0,
  };
  const worstFrame = {
    timestamp: worstTimestamp,
    score: worstScore <= 100 ? worstScore : 0,
  };

  const commonFingerErrors = Object.entries(fingerErrorCounts)
    .map(([finger, count]) => ({ finger, count }))
    .sort((a, b) => b.count - a.count);

  return {
    expectedMudra: mudraName,
    totalFrames: timeline.length,
    detectedFrames: detectedCount,
    averageAccuracy,
    bestFrame,
    worstFrame,
    commonFingerErrors,
    durationSeconds: parseFloat(durationSeconds.toFixed(1)),
    timeline,
  };
};
