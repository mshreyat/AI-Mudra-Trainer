import { FingerState } from "../utils/geometry/fingerState";
import { FingerName } from "../utils/geometry/fingertipContact";
import { FingerSpread } from "../utils/geometry/fingerSpread";

// ─── Rule Definitions ────────────────────────────────────────────────

export interface FingerRule {
  expectedState: FingerState;
}

export interface FingertipContactRule {
  finger1: FingerName;
  finger2: FingerName;
}

export interface PalmRule {
  expectedOrientation?: string; // e.g., "Facing Camera", "Facing Away", "Neutral"
  expectedDirection?: string;   // e.g., "Pointing Up", "Pointing Down", "Pointing Left", "Pointing Right", "Neutral"
}

export interface MudraRule {
  name: string;
  description: string;
  fingerRules: {
    thumb: FingerRule;
    index: FingerRule;
    middle: FingerRule;
    ring: FingerRule;
    little: FingerRule;
  };
  palmRule: PalmRule;
  expectedSpread: FingerSpread;
  fingertipContacts: FingertipContactRule[];
}

// ─── Comparison Results ──────────────────────────────────────────────

export interface FingerComparisonResult {
  correct: boolean;
  actualState: FingerState;
  expectedState: FingerState;
  feedback: string;
}

export interface PalmComparisonResult {
  correct: boolean;
  orientationCorrect: boolean;
  directionCorrect: boolean;
  actualOrientation: string;
  actualDirection: string;
  score: number; // 0 to 100
  feedback: string;
}

export interface SpreadComparisonResult {
  correct: boolean;
  actual: FingerSpread;
  expected: FingerSpread;
  feedback: string;
}

export interface ContactsComparisonResult {
  correct: boolean;
  feedback: string;
}

export interface ComparisonResult {
  score: number; // 0 to 100
  isCorrect: boolean;
  correctFingers: FingerName[];
  incorrectFingers: FingerName[];
  fingers: {
    thumb: FingerComparisonResult;
    index: FingerComparisonResult;
    middle: FingerComparisonResult;
    ring: FingerComparisonResult;
    little: FingerComparisonResult;
  };
  palm: PalmComparisonResult;
  spread: SpreadComparisonResult;
  contacts: ContactsComparisonResult;
  issues: string[];
  suggestedCorrections: string[];
}
