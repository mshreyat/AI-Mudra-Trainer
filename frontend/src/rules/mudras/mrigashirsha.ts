import { MudraRule } from "../../types/rule";

export const mrigashirshaRule: MudraRule = {
  name: "Mrigashirsha",
  description: "Thumb and little finger extended, middle three fingers bent forward.",
  fingerRules: {
    thumb: { expectedState: "Extended" },
    index: { expectedState: "Bent" },
    middle: { expectedState: "Bent" },
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
