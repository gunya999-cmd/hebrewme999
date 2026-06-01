import { Verb } from "@/types/verb";
import { SEED_VERBS } from "./verbs";
import { COMMON_ADDED_VERBS } from "./verbs-added-common";
import { TABLE_TOP_350_VERB_BASES_1_100 } from "./verbs-table-top350-1-100";
import { TABLE_TOP_350_VERB_BASES_101_200 } from "./verbs-table-top350-101-200";
import { TABLE_TOP_350_VERB_BASES_201_300 } from "./verbs-table-top350-201-300";
import { TABLE_TOP_350_VERB_BASES_301_350 } from "./verbs-table-top350-301-350";

export interface TableTop350VerbBase {
  rank: number;
  infinitive_hebrew: string;
  transcription_ru: string;
  binyan: Verb["binyan"];
  difficulty: Verb["difficulty"];
}

function normalizeHebrew(value: string): string {
  return value
    .normalize("NFC")
    .replace(/[\u0591-\u05C7]/g, "")
    .replace(/[\u200E\u200F]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

const TABLE_TOP_350_VERB_BASES: TableTop350VerbBase[] = [
  ...TABLE_TOP_350_VERB_BASES_1_100,
  ...TABLE_TOP_350_VERB_BASES_101_200,
  ...TABLE_TOP_350_VERB_BASES_201_300,
  ...TABLE_TOP_350_VERB_BASES_301_350,
];

const existingByInfinitive = new Map(
  [...SEED_VERBS, ...COMMON_ADDED_VERBS].map((verb) => [normalizeHebrew(verb.infinitive_hebrew), verb])
);

// Authoritative dictionary list from hebrewme_top350_pealim_audit_top350_ru_transcriptions_filled.csv.
// Existing app translations/roots/conjugations are preserved when a matching infinitive already exists.
// Table values override rank/order, infinitive, transcription, binyan and difficulty.
export const TABLE_TOP_350_VERBS: Verb[] = TABLE_TOP_350_VERB_BASES.map((base) => {
  const existing = existingByInfinitive.get(normalizeHebrew(base.infinitive_hebrew));

  return {
    ...(existing || {}),
    id: `top350-${String(base.rank).padStart(3, "0")}`,
    infinitive_hebrew: base.infinitive_hebrew,
    transcription_ru: base.transcription_ru,
    translation_ru: existing?.translation_ru || "",
    root: existing?.root || "",
    binyan: base.binyan,
    difficulty: base.difficulty,
    conjugations: existing?.conjugations,
  };
});
