import { VERB_CONJUGATIONS_V8_0001_0250 } from "@/data/verb-conjugations-v8-0001-0250";
import { VERB_CONJUGATIONS_V8_0251_0500 } from "@/data/verb-conjugations-v8-0251-0500";
import { VERB_CONJUGATIONS_V8_0501_0750 } from "@/data/verb-conjugations-v8-0501-0750";
import { VERB_CONJUGATIONS_V8_0751_1000 } from "@/data/verb-conjugations-v8-0751-1000";
import { unpackVerbConjugations } from "@/data/verb-conjugations-v8-types";
import type { VerbConjugations } from "@/types/verb";

const PACKED_ROWS = [
  ...VERB_CONJUGATIONS_V8_0001_0250,
  ...VERB_CONJUGATIONS_V8_0251_0500,
  ...VERB_CONJUGATIONS_V8_0501_0750,
  ...VERB_CONJUGATIONS_V8_0751_1000,
];

export const VERB_CONJUGATIONS_V8_BY_ID: Record<string, VerbConjugations> = Object.fromEntries(
  PACKED_ROWS.map(([rank, forms]) => [
    `v8-${String(rank).padStart(4, "0")}`,
    unpackVerbConjugations(forms),
  ])
);
