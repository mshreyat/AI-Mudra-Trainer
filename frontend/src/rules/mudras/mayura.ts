import { MudraRule } from "../../types/rule";

export const mayuraRule: MudraRule = {
  name: "Mayura",
  description: "Ring finger meets thumb tip, other fingers extended and spread.",
  fingerRules: {
    thumb: { expectedState: "Partially Bent" },
    index: { expectedState: "Extended" },
    middle: { expectedState: "Extended" },
    ring: { expectedState: "Bent" },
    little: { expectedState: "Extended" },
  },
  palmRule: {
    expectedOrientation: "Facing Camera",
    expectedDirection: "Pointing Up",
  },
  expectedSpread: "Medium",
  fingertipContacts: [
    { finger1: "thumb", finger2: "ring" }
  ],
};
