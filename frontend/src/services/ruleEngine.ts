import { HandGeometry } from "../utils/geometry/handGeometry";
import { MudraRule, ComparisonResult } from "../types/rule";
import { compareHand } from "../utils/geometry/compareHand";

/**
 * Evaluates the user's hand geometry against a target mudra rule.
 *
 * This is the public API of the Rule Engine (Module 7).
 * It delegates to the semantic comparison pipeline, which compares
 * finger states, palm orientation, finger spread, and fingertip contacts
 * instead of raw angles.
 *
 * @param handGeometry - The extracted semantic geometry from the user's hand landmarks
 * @param mudraRule - The semantic rules defining the target mudra
 * @returns An object detailing the overall score, correct/incorrect fingers, issues, and suggested corrections
 */
export const evaluateMudra = (
  handGeometry: HandGeometry,
  mudraRule: MudraRule
): ComparisonResult => {
  return compareHand(handGeometry, mudraRule);
};
