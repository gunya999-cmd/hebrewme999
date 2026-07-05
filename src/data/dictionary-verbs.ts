import { VERB_DROPS_TOP_1000_ROWS } from "@/data/verbDropsTop1000";
import type { Difficulty, Verb } from "@/types/verb";

function getDifficulty(rank: number): Difficulty {
  if (rank <= 250) return "easy";
  if (rank <= 700) return "medium";
  return "hard";
}

// Full V8 dictionary source: 1000 verbs aligned with the generated card/assets rank order.
export const DICTIONARY_VERBS: Verb[] = VERB_DROPS_TOP_1000_ROWS.map(
  ([rank, infinitive_hebrew, transcription_ru, translation_ru, binyan, root]) => {
    const number = String(rank).padStart(4, "0");

    return {
      id: `v8-${number}`,
      infinitive_hebrew,
      transcription_ru,
      translation_ru,
      root,
      binyan,
      difficulty: getDifficulty(rank),
    };
  }
);
