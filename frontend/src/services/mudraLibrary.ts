import { pataka } from '../data/mudras/pataka';
import { tripataka } from '../data/mudras/tripataka';
import { ardhachandra } from '../data/mudras/ardhachandra';
import { alapadma } from '../data/mudras/alapadma';
import { mushti } from '../data/mudras/mushti';
import { shikhara } from '../data/mudras/shikhara';
import { mayura } from '../data/mudras/mayura';
import { mrigashirsha } from '../data/mudras/mrigashirsha';
import { katakamukha } from '../data/mudras/katakamukha';
import { hamsapaksha } from '../data/mudras/hamsapaksha';

export interface MudraDefinition {
  name: string;
  description: string;
  difficulty: string;
  image: string;
  history: string;
  steps: string[];
  commonMistakes: string[];
}

const mudraDatabase: Record<string, MudraDefinition> = {
  "Pataka": pataka,
  "Tripataka": tripataka,
  "Ardhachandra": ardhachandra,
  "Alapadma": alapadma,
  "Mushti": mushti,
  "Shikhara": shikhara,
  "Mayura": mayura,
  "Mrigashirsha": mrigashirsha,
  "Katakamukha": katakamukha,
  "Hamsapaksha": hamsapaksha
};

export const getAllMudras = (): MudraDefinition[] => {
  return Object.values(mudraDatabase);
};

export const getMudraByName = (name: string): MudraDefinition | null => {
  return mudraDatabase[name] || null;
};
