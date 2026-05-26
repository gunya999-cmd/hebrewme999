import { SEED_VERBS } from "@/data/verbs";
import { COMMON_ADDED_VERBS } from "@/data/verbs-added-common";
import { Verb } from "@/types/verb";

export interface VerbDuplicateReportItem {
  keptId: string;
  removedId: string;
  infinitive: string;
  keptTranslation: string;
  removedTranslation: string;
}

function normalizeHebrew(value: string): string {
  return value
    .normalize("NFC")
    .replace(/[\u0591-\u05C7]/g, "")
    .replace(/[\u200E\u200F]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

// Approximate spoken-Hebrew usefulness order for the learning dictionary:
// highest-frequency / most useful everyday verbs first, rarer or more formal verbs later.
// Missing verbs fall back to their original data order after the ranked block.
const POPULARITY_ORDER = [
  "להיות", "לעשות", "ללכת", "לבוא", "לדבר", "לראות", "לדעת", "לרצות", "לתת", "לקחת",
  "לאכול", "לשתות", "לשמוע", "לכתוב", "לקרוא", "ללמוד", "להבין", "לאהוב", "לעבוד", "לחשוב",
  "לשאול", "לענות", "לחיות", "לשבת", "לשים", "לצאת", "להיכנס", "להישאר", "לעבור", "לקרות",
  "להמשיך", "להפסיק", "להתחיל", "לחזור", "להחזיר", "לקנות", "לשלם", "למכור", "לחפש", "למצוא",
  "לפתוח", "לסגור", "להביא", "להוציא", "להראות", "להרגיש", "להכיר", "להכין", "להזמין", "להצליח",
  "לשחק", "לספר", "להסביר", "לעזור", "לבקש", "לקבל", "לבחור", "לנסוע", "לרדת", "לעלות",
  "להוריד", "להעלות", "לזכור", "לשכוח", "לפגוש", "לגור", "לישון", "לקום", "לעמוד", "לרוץ",
  "לטוס", "לשחות", "לנקות", "לבשל", "לתקן", "לסדר", "לשנות", "לשפר", "לצלם", "לטייל",
  "להתקשר", "להתכתב", "להתאמן", "להתעניין", "להסתדר", "להתקדם", "להתרגל", "להתכונן", "להתקרב", "להתבלבל",
  "להיפגש", "להתעורר", "להתרגש", "להתלבש", "להשתמש", "להחליט", "להרגיז", "להזכיר", "להשאיר", "להחליף",
  "להיפתח", "להיסגר", "להימצא", "להיראות", "להיבנות", "להישבר", "להיגמר", "להיזכר", "להיוולד", "להיעלם",
  "לבקר", "לנסות", "לחזק", "לקצר", "לקלקל", "להיכשל", "להימנע", "להילחם", "להישלח", "להיכתב",
];

const popularityRank = new Map(
  POPULARITY_ORDER.map((infinitive, index) => [normalizeHebrew(infinitive), index])
);

function getPopularityRank(verb: Verb): number {
  return popularityRank.get(normalizeHebrew(verb.infinitive_hebrew)) ?? Number.MAX_SAFE_INTEGER;
}

export const ALL_VERBS_WITH_ADDED: Verb[] = [...SEED_VERBS, ...COMMON_ADDED_VERBS];

export function uniqueVerbsByInfinitive(verbs: Verb[]): Verb[] {
  const seen = new Set<string>();
  const unique: Verb[] = [];

  for (const verb of verbs) {
    const key = normalizeHebrew(verb.infinitive_hebrew);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(verb);
  }

  return unique;
}

export function sortVerbsBySpokenPopularity(verbs: Verb[]): Verb[] {
  return [...verbs].sort((a, b) => {
    const rankDiff = getPopularityRank(a) - getPopularityRank(b);
    if (rankDiff !== 0) return rankDiff;

    // Keep the original dataset order for verbs outside the explicit frequency list.
    return 0;
  });
}

export function getDuplicateVerbReport(verbs: Verb[] = ALL_VERBS_WITH_ADDED): VerbDuplicateReportItem[] {
  const seen = new Map<string, Verb>();
  const duplicates: VerbDuplicateReportItem[] = [];

  for (const verb of verbs) {
    const key = normalizeHebrew(verb.infinitive_hebrew);
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, verb);
      continue;
    }

    duplicates.push({
      keptId: existing.id,
      removedId: verb.id,
      infinitive: verb.infinitive_hebrew,
      keptTranslation: existing.translation_ru,
      removedTranslation: verb.translation_ru,
    });
  }

  return duplicates;
}

export const UNIQUE_SEED_VERBS: Verb[] = sortVerbsBySpokenPopularity(
  uniqueVerbsByInfinitive(ALL_VERBS_WITH_ADDED)
);
