import { HandGeometry } from "./handGeometry";
import {
  MudraRule,
  ComparisonResult,
  SpreadComparisonResult,
  ContactsComparisonResult,
} from "../../types/rule";
import { FingerName } from "./fingertipContact";
import { compareFinger } from "./compareFinger";
import { comparePalm } from "./comparePalm";

// ─── Score Weights ───────────────────────────────────────────────────
// Finger states: 50% (10% each), Palm: 20%, Spread: 15%, Contacts: 15%
const WEIGHT_FINGER = 10;   // per finger, 5 × 10 = 50
const WEIGHT_PALM = 20;
const WEIGHT_SPREAD = 15;
const WEIGHT_CONTACTS = 15;

// ─── Spread Comparison ──────────────────────────────────────────────

const compareSpread = (
  actualSpread: HandGeometry["spread"],
  expectedSpread: MudraRule["expectedSpread"]
): SpreadComparisonResult => {
  const correct = actualSpread === expectedSpread;

  let feedback = "Finger spread is correct.";
  if (!correct) {
    const spreadOrder = ["Close", "Medium", "Wide"] as const;
    const actualIdx = spreadOrder.indexOf(actualSpread);
    const expectedIdx = spreadOrder.indexOf(expectedSpread);

    if (actualIdx < expectedIdx) {
      feedback = "Spread your fingers wider apart.";
    } else {
      feedback = "Bring your fingers closer together.";
    }
  }

  return { correct, actual: actualSpread, expected: expectedSpread, feedback };
};

// ─── Contacts Comparison ─────────────────────────────────────────────

const compareContacts = (
  actualContacts: HandGeometry["contacts"],
  expectedContacts: MudraRule["fingertipContacts"]
): ContactsComparisonResult => {
  // No contact requirements means this check automatically passes
  if (expectedContacts.length === 0) {
    return { correct: true, feedback: "No fingertip contacts required." };
  }

  const missingContacts: string[] = [];
  for (const expected of expectedContacts) {
    const match = actualContacts.find(
      (c) =>
        c.finger1 === expected.finger1 &&
        c.finger2 === expected.finger2
    );
    if (!match || !match.touching) {
      missingContacts.push(`${expected.finger1} and ${expected.finger2}`);
    }
  }

  if (missingContacts.length === 0) {
    return { correct: true, feedback: "Fingertip contacts are correct." };
  }

  const feedback = `Touch your ${missingContacts.join(", ")} fingertips together.`;
  return { correct: false, feedback };
};

// ─── Main Hand Comparison ────────────────────────────────────────────

export const compareHand = (
  handGeometry: HandGeometry,
  mudraRule: MudraRule
): ComparisonResult => {
  // Compare each finger
  const fingerNames: FingerName[] = ["thumb", "index", "middle", "ring", "little"];

  const fingerResults = {
    thumb: compareFinger(handGeometry.thumb, mudraRule.fingerRules.thumb, "thumb"),
    index: compareFinger(handGeometry.index, mudraRule.fingerRules.index, "index"),
    middle: compareFinger(handGeometry.middle, mudraRule.fingerRules.middle, "middle"),
    ring: compareFinger(handGeometry.ring, mudraRule.fingerRules.ring, "ring"),
    little: compareFinger(handGeometry.little, mudraRule.fingerRules.little, "little"),
  };

  // Compare palm, spread, contacts
  const palm = comparePalm(handGeometry.palm, mudraRule.palmRule);
  const spread = compareSpread(handGeometry.spread, mudraRule.expectedSpread);
  const contacts = compareContacts(handGeometry.contacts, mudraRule.fingertipContacts);

  // Build correctFingers / incorrectFingers lists
  const correctFingers: FingerName[] = [];
  const incorrectFingers: FingerName[] = [];
  for (const name of fingerNames) {
    if (fingerResults[name].correct) {
      correctFingers.push(name);
    } else {
      incorrectFingers.push(name);
    }
  }

  // Compile issues and suggested corrections
  const issues: string[] = [];
  const suggestedCorrections: string[] = [];

  for (const name of fingerNames) {
    if (!fingerResults[name].correct) {
      issues.push(`${name.charAt(0).toUpperCase() + name.slice(1)}: expected ${fingerResults[name].expectedState}, got ${fingerResults[name].actualState}.`);
      suggestedCorrections.push(fingerResults[name].feedback);
    }
  }

  if (!palm.correct) {
    issues.push(`Palm position incorrect.`);
    suggestedCorrections.push(palm.feedback);
  }

  if (!spread.correct) {
    issues.push(`Finger spread: expected ${spread.expected}, got ${spread.actual}.`);
    suggestedCorrections.push(spread.feedback);
  }

  if (!contacts.correct) {
    issues.push("Fingertip contacts not met.");
    suggestedCorrections.push(contacts.feedback);
  }

  // Compute weighted score
  // Fingers: 10 points each (binary), Palm: 0-20, Spread: binary 0/15, Contacts: binary 0/15
  let score = 0;
  for (const name of fingerNames) {
    score += fingerResults[name].correct ? WEIGHT_FINGER : 0;
  }
  score += (palm.score / 100) * WEIGHT_PALM;
  score += spread.correct ? WEIGHT_SPREAD : 0;
  score += contacts.correct ? WEIGHT_CONTACTS : 0;
  score = Math.round(score);

  const isCorrect =
    incorrectFingers.length === 0 &&
    palm.correct &&
    spread.correct &&
    contacts.correct;

  return {
    score,
    isCorrect,
    correctFingers,
    incorrectFingers,
    fingers: fingerResults,
    palm,
    spread,
    contacts,
    issues,
    suggestedCorrections,
  };
};
