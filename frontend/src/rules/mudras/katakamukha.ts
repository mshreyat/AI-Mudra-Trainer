import { MudraRule } from "../../types/rule";

export const katakamukhaRule: MudraRule = {
  name: "Katakamukha",
  description: "Index and middle fingers touching the thumb, ring and little fingers extended.",
  fingerRules: {
    thumb: { expectedState: "Partially Bent" },
    index: { expectedState: "Bent" },
    middle: { expectedState: "Bent" },
    ring: { expectedState: "Extended" },
    little: { expectedState: "Extended" },
  },
  palmRule: {
    expectedOrientation: "Facing Camera",
    expectedDirection: "Pointing Up",
  },
  expectedSpread: "Close",
  fingertipContacts: [
    { finger1: "thumb", finger2: "index" },
    { finger1: "thumb", finger2: "middle" }
  ],
};
