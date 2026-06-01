import { TABLE_TOP_350_VERBS } from "@/data/verbs-table-top350";
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

export const ALL_VERBS_WITH_ADDED: Verb[] = TABLE_TOP_350_VERBS;

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
  // The uploaded top-350 table is already ordered by popularity_rank.
  return [...verbs];
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

export const UNIQUE_SEED_VERBS: Verb[] = uniqueVerbsByInfinitive(TABLE_TOP_350_VERBS);
