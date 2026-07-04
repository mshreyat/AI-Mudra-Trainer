import { MudraRule } from "../../types/rule";

export const mushtiRule: MudraRule = {
  name: "Mushti",
  description: "All fingers bent tightly into a fist, thumb folded over the other fingers.",
  fingerRules: {
    thumb: { expectedState: "Bent" },
    index: { expectedState: "Bent" },
    middle: { expectedState: "Bent" },
    ring: { expectedState: "Bent" },
    little: { expectedState: "Bent" },
  },
  palmRule: {
    expectedOrientation: "Facing Camera",
    expectedDirection: "Pointing Up",
  },
  expectedSpread: "Close",
  fingertipContacts: [],
};
