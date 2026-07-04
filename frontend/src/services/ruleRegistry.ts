import { MudraRule } from "../types/rule";
import { patakaRule } from "../rules/mudras/pataka";
import { tripatakaRule } from "../rules/mudras/tripataka";
import { ardhapatakaRule } from "../rules/mudras/ardhapataka";
import { ardhachandraRule } from "../rules/mudras/ardhachandra";
import { alapadmaRule } from "../rules/mudras/alapadma";
import { mushtiRule } from "../rules/mudras/mushti";
import { shikharaRule } from "../rules/mudras/shikhara";
import { mayuraRule } from "../rules/mudras/mayura";
import { mrigashirshaRule } from "../rules/mudras/mrigashirsha";
import { katakamukhaRule } from "../rules/mudras/katakamukha";
import { hamsapakshaRule } from "../rules/mudras/hamsapaksha";

/**
 * Registry mapping mudra names to their semantic rule definitions.
 *
 * To add a new mudra:
 *   1. Create its rule file in `rules/mudras/`
 *   2. Import it here
 *   3. Add it to the registry below
 *
 * The registry is keyed by the same name used in `MudraDefinition.name`
 * (from mudraLibrary), so the PracticePage can look up rules generically.
 */
const ruleRegistry: Record<string, MudraRule> = {
  Pataka: patakaRule,
  Tripataka: tripatakaRule,
  Ardhapataka: ardhapatakaRule,
  Ardhachandra: ardhachandraRule,
  Alapadma: alapadmaRule,
  Mushti: mushtiRule,
  Shikhara: shikharaRule,
  Mayura: mayuraRule,
  Mrigashirsha: mrigashirshaRule,
  Katakamukha: katakamukhaRule,
  Hamsapaksha: hamsapakshaRule,
};

/**
 * Looks up the semantic rule for a mudra by name.
 * Returns null if no rule is registered for the given name.
 */
export const getRuleByName = (name: string): MudraRule | null => {
  return ruleRegistry[name] || null;
};

/**
 * Returns all registered mudra rules.
 */
export const getAllRules = (): MudraRule[] => {
  return Object.values(ruleRegistry);
};
