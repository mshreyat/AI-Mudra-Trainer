import { MudraRule } from "../../types/rule";

export const patakaRule: MudraRule = {
  name: "Pataka",
  description: "All five fingers are fully extended and held close together (palm facing the camera).",
  fingerRules: {
    thumb: { expectedState: "Bent" },
    index: { expectedState: "Extended" },
    middle: { expectedState: "Extended" },
    ring: { expectedState: "Extended" },
    little: { expectedState: "Extended" },
  },
  palmRule: {
    expectedOrientation: "Facing Camera",
    expectedDirection: "Pointing Up",
  },
  expectedSpread: "Close",
  fingertipContacts: [],
};
