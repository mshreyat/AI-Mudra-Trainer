export interface PerformanceFrameResult {
  timestamp: number; // in seconds
  handDetected: boolean;
  score: number;
  correctFingers: string[];
  incorrectFingers: string[];
}

export interface PerformanceReport {
  expectedMudra: string;
  totalFrames: number;
  detectedFrames: number;
  averageAccuracy: number;
  bestFrame: { timestamp: number; score: number };
  worstFrame: { timestamp: number; score: number };
  commonFingerErrors: { finger: string; count: number }[];
  durationSeconds: number;
  timeline: PerformanceFrameResult[];
}
