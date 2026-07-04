import { MudraRule } from "../../types/rule";

export const alapadmaRule: MudraRule = {
  name: "Alapadma",
  description: "A blooming lotus gesture where fingers are spread wide and curled in a graduated, wavy pattern.",
  fingerRules: {
    thumb: { expectedState: "Extended" },
    index: { expectedState: "Extended" },
    middle: { expectedState: "Partially Bent" },
    ring: { expectedState: "Partially Bent" },
    little: { expectedState: "Extended" },
  },
  palmRule: {
    expectedOrientation: "Facing Camera",
    expectedDirection: "Pointing Up",
  },
  expectedSpread: "Wide",
  fingertipContacts: [],
};
