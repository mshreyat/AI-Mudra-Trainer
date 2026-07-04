import { MudraRule } from "../../types/rule";

export const ardhachandraRule: MudraRule = {
  name: "Ardhachandra",
  description: "An open palm where all fingers are extended and the thumb is stretched wide apart, forming a crescent shape.",
  fingerRules: {
    thumb: { expectedState: "Extended" },
    index: { expectedState: "Extended" },
    middle: { expectedState: "Extended" },
    ring: { expectedState: "Extended" },
    little: { expectedState: "Extended" },
  },
  palmRule: {
    expectedOrientation: "Facing Camera",
    expectedDirection: "Pointing Up",
  },
  expectedSpread: "Medium",
  fingertipContacts: [],
};
