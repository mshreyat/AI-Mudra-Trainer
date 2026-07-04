import { MudraRule } from "../../types/rule";

export const hamsapakshaRule: MudraRule = {
  name: "Hamsapaksha",
  description: "Fingers extended and spread wide, thumb bent inwards.",
  fingerRules: {
    thumb: { expectedState: "Bent" },
    index: { expectedState: "Bent" },
    middle: { expectedState: "Bent" },
    ring: { expectedState: "Bent" },
    little: { expectedState: "Extended" },
  },
  palmRule: {
    expectedOrientation: "Facing Camera",
    expectedDirection: "Pointing Up",
  },
  expectedSpread: "Wide",
  fingertipContacts: [],
};
