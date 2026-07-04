import { PalmGeometry } from "./palmGeometry";
import { PalmRule, PalmComparisonResult } from "../../types/rule";

/**
 * Compares the detected palm geometry against the expected palm rule.
 * Logic is already semantic (string matching) — this aligns with the new type contract.
 */
export const comparePalm = (
  palmGeometry: PalmGeometry,
  palmRule: PalmRule
): PalmComparisonResult => {
  const actualOrientation = palmGeometry.orientation;
  const actualDirection = palmGeometry.direction;

  const expectedOrientation = palmRule.expectedOrientation;
  const expectedDirection = palmRule.expectedDirection;

  const orientationCorrect = expectedOrientation ? actualOrientation === expectedOrientation : true;
  const directionCorrect = expectedDirection ? actualDirection === expectedDirection : true;
  const correct = orientationCorrect && directionCorrect;

  // Calculate score based on specified requirements
  let score = 100;
  const checks = [];
  if (expectedOrientation) checks.push(orientationCorrect);
  if (expectedDirection) checks.push(directionCorrect);

  if (checks.length > 0) {
    const correctChecks = checks.filter(Boolean).length;
    score = Math.round((correctChecks / checks.length) * 100);
  }

  // Generate actionable feedback
  const feedbacks: string[] = [];

  if (!orientationCorrect && expectedOrientation) {
    if (expectedOrientation === "Facing Camera") {
      feedbacks.push("Turn your palm to face the camera.");
    } else if (expectedOrientation === "Facing Away") {
      feedbacks.push("Turn your palm to face away from the camera.");
    } else {
      feedbacks.push("Keep your palm in a neutral orientation.");
    }
  }

  if (!directionCorrect && expectedDirection) {
    if (expectedDirection === "Pointing Up") {
      feedbacks.push("Point your fingers upward.");
    } else if (expectedDirection === "Pointing Down") {
      feedbacks.push("Point your fingers downward.");
    } else if (expectedDirection === "Pointing Left") {
      feedbacks.push("Point your fingers to the left.");
    } else if (expectedDirection === "Pointing Right") {
      feedbacks.push("Point your fingers to the right.");
    } else {
      feedbacks.push("Keep your hand in a neutral direction.");
    }
  }

  const feedback = correct
    ? "Palm position is correct."
    : feedbacks.join(" ");

  return {
    correct,
    orientationCorrect,
    directionCorrect,
    actualOrientation,
    actualDirection,
    score,
    feedback,
  };
};
