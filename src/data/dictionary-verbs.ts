import { VERB_DROPS_TOP_1000_ROWS } from "@/data/verbDropsTop1000";
import { VERB_CONJUGATIONS_V8_BY_ID } from "@/data/verb-conjugations-v8";
import type { Difficulty, Verb } from "@/types/verb";

function getDifficulty(rank: number): Difficulty {
  if (rank <= 250) return "easy";
  if (rank <= 700) return "medium";
  return "hard";
}

function cleanTranscription(value: string): string {
  return value.replace(/\s+/g, "").trim();
}

function cleanTranslation(value: string): string {
  return value
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanRoot(value: string): string {
  return value.replace(/[\s\-–—]/g, "").trim();
}

// Full V8 dictionary source: 1000 verbs aligned with generated forms and card/assets rank order.
export const DICTIONARY_VERBS: Verb[] = VERB_DROPS_TOP_1000_ROWS.map(
  ([rank, infinitive_hebrew, transcription_ru, translation_ru, binyan, root]) => {
    const number = String(rank).padStart(4, "0");
    const id = `v8-${number}`;

    return {
      id,
      infinitive_hebrew,
      transcription_ru: cleanTranscription(transcription_ru),
      translation_ru: cleanTranslation(translation_ru),
      root: cleanRoot(root),
      binyan,
      difficulty: getDifficulty(rank),
      imageSrc: `/cards/verb-drops/${number}.webp`,
      conjugations: VERB_CONJUGATIONS_V8_BY_ID[id],
    };
  }
);
