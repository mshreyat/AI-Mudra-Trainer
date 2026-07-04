import { MudraRule } from "../../types/rule";

export const tripatakaRule: MudraRule = {
  name: "Tripataka",
  description: "Similar to Pataka, but the ring finger is bent inward at the joints.",
  fingerRules: {
    thumb: { expectedState: "Bent" },
    index: { expectedState: "Extended" },
    middle: { expectedState: "Extended" },
    ring: { expectedState: "Bent" },
    little: { expectedState: "Extended" },
  },
  palmRule: {
    expectedOrientation: "Facing Camera",
    expectedDirection: "Pointing Up",
  },
  expectedSpread: "Close",
  fingertipContacts: [],
};
