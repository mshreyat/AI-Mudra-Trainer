import { FingerGeometry } from "./fingerState";
import { FingerRule, FingerComparisonResult } from "../../types/rule";

/**
 * Compares a single finger's detected geometry against its semantic rule.
 * Scoring is purely state-based — no angle comparison.
 */
export const compareFinger = (
  fingerGeometry: FingerGeometry,
  fingerRule: FingerRule,
  fingerName: string
): FingerComparisonResult => {
  const actualState = fingerGeometry.state;
  const expectedState = fingerRule.expectedState;
  const correct = actualState === expectedState;

  // Capitalize finger name for feedback
  const displayName = fingerName === "thumb" ? "thumb" : `${fingerName} finger`;
  const capitalizedDisplayName =
    fingerName === "thumb"
      ? "Thumb"
      : `${fingerName.charAt(0).toUpperCase() + fingerName.slice(1)} finger`;

  let feedback = "";

  if (correct) {
    feedback = `${capitalizedDisplayName} is correct.`;
  } else if (expectedState === "Extended") {
    feedback = fingerName === "thumb"
      ? "Extend your thumb."
      : `Straighten your ${displayName}.`;
  } else if (expectedState === "Bent") {
    feedback = `Bend your ${displayName} fully.`;
  } else {
    // Expected is "Partially Bent"
    if (actualState === "Extended") {
      feedback = `Bend your ${displayName} slightly.`;
    } else {
      feedback = `Extend your ${displayName} slightly.`;
    }
  }

  return {
    correct,
    actualState,
    expectedState,
    feedback,
  };
};
