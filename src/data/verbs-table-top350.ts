import { Verb, ConjugationForm, VerbConjugations } from "@/types/verb";
import { SEED_VERBS } from "./verbs";
import { COMMON_ADDED_VERBS } from "./verbs-added-common";
import { TABLE_TOP_350_PACKED_ROWS_1_100 } from "./verbs-table-top350-1-100";
import { TABLE_TOP_350_PACKED_ROWS_101_200 } from "./verbs-table-top350-101-200";
import { TABLE_TOP_350_PACKED_ROWS_201_300 } from "./verbs-table-top350-201-300";
import { TABLE_TOP_350_PACKED_ROWS_301_350 } from "./verbs-table-top350-301-350";

export type TableTop350PackedRow = [
  rank: number,
  infinitive_hebrew: string,
  transcription_ru: string,
  binyan: Verb["binyan"],
  difficulty: Verb["difficulty"],
  packedForms: string
];

const FORM_SLOTS = [
  "present_ms", "present_fs", "present_mp", "present_fp",
  "past_ani", "past_ata", "past_at", "past_hu", "past_hi", "past_anachnu", "past_atem", "past_aten", "past_hem", "past_hen",
  "future_ani", "future_ata", "future_at", "future_hu", "future_hi", "future_anachnu", "future_atem", "future_aten", "future_hem", "future_hen",
  "imperative_ms", "imperative_fs", "imperative_mp", "imperative_fp",
] as const;

type FormSlot = typeof FORM_SLOTS[number];

const FORM_SLOT_TO_PATH: Record<FormSlot, [keyof VerbConjugations, string]> = {
  present_ms: ["present", "ms"],
  present_fs: ["present", "fs"],
  present_mp: ["present", "mp"],
  present_fp: ["present", "fp"],
  past_ani: ["past", "ani"],
  past_ata: ["past", "ata"],
  past_at: ["past", "at"],
  past_hu: ["past", "hu"],
  past_hi: ["past", "hi"],
  past_anachnu: ["past", "anachnu"],
  past_atem: ["past", "atem"],
  past_aten: ["past", "aten"],
  past_hem: ["past", "hem"],
  past_hen: ["past", "hen"],
  future_ani: ["future", "ani"],
  future_ata: ["future", "ata"],
  future_at: ["future", "at"],
  future_hu: ["future", "hu"],
  future_hi: ["future", "hi"],
  future_anachnu: ["future", "anachnu"],
  future_atem: ["future", "atem"],
  future_aten: ["future", "aten"],
  future_hem: ["future", "hem"],
  future_hen: ["future", "hen"],
  imperative_ms: ["imperative", "ms"],
  imperative_fs: ["imperative", "fs"],
  imperative_mp: ["imperative", "mp"],
  imperative_fp: ["imperative", "fp"],
};

const FORM_TRANSLATIONS: Record<FormSlot, string> = {
  present_ms: "настоящее, муж. ед.",
  present_fs: "настоящее, жен. ед.",
  present_mp: "настоящее, муж. мн.",
  present_fp: "настоящее, жен. мн.",
  past_ani: "прошедшее, я",
  past_ata: "прошедшее, ты (м)",
  past_at: "прошедшее, ты (ж)",
  past_hu: "прошедшее, он",
  past_hi: "прошедшее, она",
  past_anachnu: "прошедшее, мы",
  past_atem: "прошедшее, вы (м)",
  past_aten: "прошедшее, вы (ж)",
  past_hem: "прошедшее, они (м)",
  past_hen: "прошедшее, они (ж)",
  future_ani: "будущее, я",
  future_ata: "будущее, ты (м)",
  future_at: "будущее, ты (ж)",
  future_hu: "будущее, он",
  future_hi: "будущее, она",
  future_anachnu: "будущее, мы",
  future_atem: "будущее, вы (м)",
  future_aten: "будущее, вы (ж)",
  future_hem: "будущее, они (м)",
  future_hen: "будущее, они (ж)",
  imperative_ms: "повелительное, муж. ед.",
  imperative_fs: "повелительное, жен. ед.",
  imperative_mp: "повелительное, муж. мн.",
  imperative_fp: "повелительное, жен. мн.",
};

function normalizeHebrew(value: string): string {
  return value
    .normalize("NFC")
    .replace(/[\u0591-\u05C7]/g, "")
    .replace(/[\u200E\u200F]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function f(hebrew: string, transcription: string, translation: string): ConjugationForm {
  return { hebrew, transcription, translation };
}

function emptyConjugations(): VerbConjugations {
  const empty = f("", "", "");
  return {
    present: { ms: empty, fs: empty, mp: empty, fp: empty },
    past: { ani: empty, ata: empty, at: empty, hu: empty, hi: empty, anachnu: empty, atem: empty, aten: empty, hem: empty, hen: empty },
    future: { ani: empty, ata: empty, at: empty, hu: empty, hi: empty, anachnu: empty, atem: empty, aten: empty, hem: empty, hen: empty },
    imperative: { ms: empty, fs: empty, mp: empty, fp: empty },
  };
}

function unpackConjugations(packedForms: string): VerbConjugations {
  const conjugations = emptyConjugations();
  const packedItems = packedForms.split(";");

  FORM_SLOTS.forEach((slot, index) => {
    const [hebrew = "", transcription = ""] = (packedItems[index] || "").split("|");
    const [tense, person] = FORM_SLOT_TO_PATH[slot];
    (conjugations[tense] as Record<string, ConjugationForm>)[person] = f(hebrew, transcription, FORM_TRANSLATIONS[slot]);
  });

  return conjugations;
}

const TABLE_TOP_350_PACKED_ROWS: TableTop350PackedRow[] = [
  ...TABLE_TOP_350_PACKED_ROWS_1_100,
  ...TABLE_TOP_350_PACKED_ROWS_101_200,
  ...TABLE_TOP_350_PACKED_ROWS_201_300,
  ...TABLE_TOP_350_PACKED_ROWS_301_350,
];

const existingByInfinitive = new Map(
  [...SEED_VERBS, ...COMMON_ADDED_VERBS].map((verb) => [normalizeHebrew(verb.infinitive_hebrew), verb])
);

// Authoritative dictionary list from hebrewme_top350_pealim_audit_top350_ru_transcriptions_filled.csv.
// The CSV provides the 350 infinitives and 10,150 checked Pealim forms.
// Existing app translations/roots are preserved when a matching infinitive already exists.
export const TABLE_TOP_350_VERBS: Verb[] = TABLE_TOP_350_PACKED_ROWS.map(([rank, infinitive_hebrew, transcription_ru, binyan, difficulty, packedForms]) => {
  const existing = existingByInfinitive.get(normalizeHebrew(infinitive_hebrew));

  return {
    ...(existing || {}),
    id: `top350-${String(rank).padStart(3, "0")}`,
    infinitive_hebrew,
    transcription_ru,
    translation_ru: existing?.translation_ru || "",
    root: existing?.root || "",
    binyan,
    difficulty,
    conjugations: unpackConjugations(packedForms),
  };
});
