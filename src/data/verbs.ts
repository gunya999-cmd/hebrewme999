import { Verb } from "@/types/verb";
import { CORE_VERBS } from "./verbs-core";
import { PAAL_VERBS } from "./verbs-paal";
import { OTHER_BINYAN_VERBS } from "./verbs-other";
import { EXTRA_VERBS } from "./verbs-extra";
import { MORE_VERBS } from "./verbs-more";
import { VERIFIED_EXTRA_VERBS } from "./verbs-verified-extra";

function normalizeHebrew(value: string): string {
  return value
    .normalize("NFC")
    .replace(/[\u0591-\u05C7]/g, "")
    .replace(/[\u200E\u200F]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

// Approximate learner-facing frequency order for the main dictionary.
// Lower number means the verb appears earlier in /dictionary.
const COMMON_FREQUENCY_RANK_BY_INFINITIVE: Record<string, number> = {
  "לעשות": 1,
  "ללכת": 2,
  "לבוא": 3,
  "לראות": 4,
  "לשמוע": 5,
  "לדעת": 6,
  "לרצות": 7,
  "לתת": 8,
  "לקחת": 9,
  "לומר": 10,
  "לדבר": 11,
  "לכתוב": 12,
  "לאכול": 13,
  "לשתות": 14,
  "לחשוב": 15,
  "לעבוד": 16,
  "לגור": 17,
  "ללמוד": 18,
  "להבין": 19,
  "להתחיל": 20,
  "להמשיך": 21,
  "להגיע": 22,
  "להכיר": 23,
  "לשאול": 24,
  "לקבל": 25,
  "להשתמש": 26,
  "להחליט": 27,
  "להרגיש": 28,
  "להצליח": 29,
};

const verifiedInfinitives = new Set(
  VERIFIED_EXTRA_VERBS.map((verb) => normalizeHebrew(verb.infinitive_hebrew))
);

const LEGACY_SEED_VERBS: Verb[] = [
  ...CORE_VERBS,
  ...PAAL_VERBS,
  ...OTHER_BINYAN_VERBS,
  ...EXTRA_VERBS,
  ...MORE_VERBS,
];

const legacyWithoutVerifiedDuplicates = LEGACY_SEED_VERBS.filter(
  (verb) => !verifiedInfinitives.has(normalizeHebrew(verb.infinitive_hebrew))
);

const withFrequencyRank = (verb: Verb): Verb => ({
  ...verb,
  frequencyRank:
    verb.frequencyRank ??
    COMMON_FREQUENCY_RANK_BY_INFINITIVE[normalizeHebrew(verb.infinitive_hebrew)],
});

export const SEED_VERBS: Verb[] = [
  ...legacyWithoutVerifiedDuplicates,
  ...VERIFIED_EXTRA_VERBS,
]
  .map(withFrequencyRank)
  .sort((a, b) => {
    const rankA = a.frequencyRank ?? Number.MAX_SAFE_INTEGER;
    const rankB = b.frequencyRank ?? Number.MAX_SAFE_INTEGER;
    if (rankA !== rankB) return rankA - rankB;
    return a.id.localeCompare(b.id, undefined, { numeric: true });
  });
