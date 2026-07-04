import { MudraRule } from "../../types/rule";

export const shikharaRule: MudraRule = {
  name: "Shikhara",
  description: "Fist closed, thumb extended upwards.",
  fingerRules: {
    thumb: { expectedState: "Extended" },
    index: { expectedState: "Bent" },
    middle: { expectedState: "Bent" },
    ring: { expectedState: "Bent" },
    little: { expectedState: "Bent" },
  },
  palmRule: {
    expectedOrientation: "Neutral",
    expectedDirection: "Pointing Up",
  },
  expectedSpread: "Close",
  fingertipContacts: [],
};
