import { MudraRule } from "../../types/rule";

export const ardhapatakaRule: MudraRule = {
  name: "Ardhapataka",
  description: "Similar to Tripataka, but both the ring and little fingers are bent inward.",
  fingerRules: {
    thumb: { expectedState: "Extended" },
    index: { expectedState: "Extended" },
    middle: { expectedState: "Extended" },
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
