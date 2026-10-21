import type { ConjugationForm, VerbConjugations } from "@/types/verb";

export type PackedConjugationKey =
  | "pms"
  | "pfs"
  | "pmp"
  | "pfp"
  | "pa"
  | "ptm"
  | "ptf"
  | "phu"
  | "phi"
  | "pn"
  | "ptmp"
  | "ptfp"
  | "phm"
  | "phf"
  | "fa"
  | "ftm"
  | "ftf"
  | "fhu"
  | "fhi"
  | "fn"
  | "ftmp"
  | "ftfp"
  | "fhm"
  | "fhf"
  | "ims"
  | "ifs"
  | "imp"
  | "ifp";

export type PackedConjugationValue = readonly [hebrew: string, transcription: string];
export type PackedVerbConjugationRow = readonly [rank: number, forms: Partial<Record<PackedConjugationKey, PackedConjugationValue>>];

const KEY_MAP: Record<PackedConjugationKey, [keyof VerbConjugations, string, string]> = {
  pms: ["present", "ms", "муж. ед."],
  pfs: ["present", "fs", "жен. ед."],
  pmp: ["present", "mp", "муж. мн."],
  pfp: ["present", "fp", "жен. мн."],
  pa: ["past", "ani", "я"],
  ptm: ["past", "ata", "ты (м)"],
  ptf: ["past", "at", "ты (ж)"],
  phu: ["past", "hu", "он"],
  phi: ["past", "hi", "она"],
  pn: ["past", "anachnu", "мы"],
  ptmp: ["past", "atem", "вы (м)"],
  ptfp: ["past", "aten", "вы (ж)"],
  phm: ["past", "hem", "они"],
  phf: ["past", "hen", "они"],
  fa: ["future", "ani", "я"],
  ftm: ["future", "ata", "ты (м)"],
  ftf: ["future", "at", "ты (ж)"],
  fhu: ["future", "hu", "он"],
  fhi: ["future", "hi", "она"],
  fn: ["future", "anachnu", "мы"],
  ftmp: ["future", "atem", "вы (м)"],
  ftfp: ["future", "aten", "вы (ж)"],
  fhm: ["future", "hem", "они (м)"],
  fhf: ["future", "hen", "они (ж)"],
  ims: ["imperative", "ms", "ты (м)"],
  ifs: ["imperative", "fs", "ты (ж)"],
  imp: ["imperative", "mp", "вы (м)"],
  ifp: ["imperative", "fp", "вы (ж)"],
};

export function unpackVerbConjugations(forms: Partial<Record<PackedConjugationKey, PackedConjugationValue>>): VerbConjugations {
  const conjugations: VerbConjugations = {};

  for (const [packedKey, value] of Object.entries(forms) as Array<[PackedConjugationKey, PackedConjugationValue]>) {
    const [tense, person, translation] = KEY_MAP[packedKey];
    conjugations[tense] ??= {};
    (conjugations[tense] as Record<string, ConjugationForm>)[person] = {
      hebrew: value[0],
      transcription: value[1],
      translation,
    };
  }

  return conjugations;
}
