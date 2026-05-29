// Full Pealim-verified conjugation batch 008.
//
// Continuation of full app-ready verb cards.
// Rule: add only checked forms; do not generate guessed conjugations.

import type { PealimVerifiedVerb, VerbForm } from "./pealim-verified-verbs-700";

const f = (
  hebrew: string,
  hebrew_plain: string,
  transcription_ru: string,
  translation_ru: string,
): VerbForm => ({ hebrew, hebrew_plain, transcription_ru, translation_ru });

export const PEALIM_VERIFIED_FULL_BATCH_008: PealimVerifiedVerb[] = [
  {
    id: "pv-0032",
    frequencyRank: 32,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִסְגּוֹר",
    infinitive_hebrew_plain: "לסגור",
    transcription_ru: "лисг о р",
    translation_ru: "закрывать",
    root: "ס-ג-ר",
    binyan: "פעל",
    difficulty: "easy",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A1%D7%92%D7%95%D7%A8",
    checkedAt: "2026-05-29",
    notes: "Pa'al strong-root verb. Feminine plural future/imperative forms are formal; modern spoken Hebrew usually prefers the masculine plural forms.",
    conjugations: {
      present: {
        ms: f("סוֹגֵר", "סוגר", "сог е р", "закрывает / я, ты, он закрывает"),
        fs: f("סוֹגֶרֶת", "סוגרת", "сог е рет", "закрывает / я, ты, она закрывает"),
        mp: f("סוֹגְרִים", "סוגרים", "согр и м", "закрывают / мы, вы, они м. р. закрывают"),
        fp: f("סוֹגְרוֹת", "סוגרות", "согр о т", "закрывают / мы, вы, они ж. р. закрывают"),
      },
      past: {
        ani: f("סָגַרְתִּי", "סגרתי", "саг а рти", "я закрыл(а)"),
        ata: f("סָגַרְתָּ", "סגרת", "саг а рта", "ты м. р. закрыл"),
        at: f("סָגַרְתְּ", "סגרת", "саг а рт", "ты ж. р. закрыла"),
        hu: f("סָגַר", "סגר", "саг а р", "он закрыл"),
        hi: f("סָגְרָה", "סגרה", "сагр а", "она закрыла"),
        anachnu: f("סָגַרְנוּ", "סגרנו", "саг а рну", "мы закрыли"),
        atem: f("סְגַרְתֶּם", "סגרתם", "сегарт е м", "вы м. р. закрыли"),
        aten: f("סְגַרְתֶּן", "סגרתן", "сегарт е н", "вы ж. р. закрыли"),
        hem: f("סָגְרוּ", "סגרו", "сагр у", "они м. р. закрыли"),
        hen: f("סָגְרוּ", "סגרו", "сагр у", "они ж. р. закрыли"),
      },
      future: {
        ani: f("אֶסְגֹּר", "אסגור", "эсг о р", "я закрою / буду закрывать"),
        ata: f("תִּסְגֹּר", "תסגור", "тисг о р", "ты м. р. закроешь / будешь закрывать"),
        at: f("תִּסְגְּרִי", "תסגרי", "тисгер и", "ты ж. р. закроешь / будешь закрывать"),
        hu: f("יִסְגֹּר", "יסגור", "йисг о р", "он закроет / будет закрывать"),
        hi: f("תִּסְגֹּר", "תסגור", "тисг о р", "она закроет / будет закрывать"),
        anachnu: f("נִסְגֹּר", "נסגור", "нисг о р", "мы закроем / будем закрывать"),
        atem: f("תִּסְגְּרוּ", "תסגרו", "тисгер у", "вы м. р. закроете / будете закрывать"),
        aten: f("תִּסְגֹּרְנָה", "תסגורנה", "тисг о рна", "вы ж. р. закроете / будете закрывать"),
        hem: f("יִסְגְּרוּ", "יסגרו", "йисгер у", "они м. р. закроют / будут закрывать"),
        hen: f("תִּסְגֹּרְנָה", "תסגורנה", "тисг о рна", "они ж. р. закроют / будут закрывать"),
      },
      imperative: {
        ms: f("סְגֹר!", "סגור", "сг о р!", "закрой! мужчине"),
        fs: f("סִגְרִי!", "סגרי", "сигр и!", "закрой! женщине"),
        mp: f("סִגְרוּ!", "סגרו", "сигр у!", "закройте! мужчинам или смешанной группе"),
        fp: f("סְגֹרְנָה!", "סגורנה", "сг о рна!", "закройте! женщинам"),
      },
    },
  },
];

export const findFullBatch008DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_FULL_BATCH_008) {
    if (seen.has(verb.infinitive_hebrew_plain)) duplicates.add(verb.infinitive_hebrew_plain);
    seen.add(verb.infinitive_hebrew_plain);
  }

  return [...duplicates];
};

export const assertFullBatch008 = (): void => {
  const duplicates = findFullBatch008DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in full batch 008: ${duplicates.join(", ")}`);
  }
};
