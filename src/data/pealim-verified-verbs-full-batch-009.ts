// Full Pealim-verified conjugation batch 009.
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

export const PEALIM_VERIFIED_FULL_BATCH_009: PealimVerifiedVerb[] = [
  {
    id: "pv-0033",
    frequencyRank: 33,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְחַפֵּשׂ",
    infinitive_hebrew_plain: "לחפש",
    transcription_ru: "лехап е с",
    translation_ru: "искать",
    root: "ח-פ-שׂ",
    binyan: "פיעל",
    difficulty: "easy",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%A4%D7%A9",
    checkedAt: "2026-05-29",
    notes: "Pi'el verb. Feminine plural future/imperative forms are formal; modern spoken Hebrew usually prefers the masculine plural forms.",
    conjugations: {
      present: {
        ms: f("מְחַפֵּשׂ", "מחפש", "мехап е с", "ищет / я, ты, он ищет"),
        fs: f("מְחַפֶּשֶׂת", "מחפשת", "мехап е сет", "ищет / я, ты, она ищет"),
        mp: f("מְחַפְּשִׂים", "מחפשים", "мехапс и м", "ищут / мы, вы, они м. р. ищут"),
        fp: f("מְחַפְּשׂוֹת", "מחפשות", "мехапс о т", "ищут / мы, вы, они ж. р. ищут"),
      },
      past: {
        ani: f("חִפַּשְׂתִּי", "חיפשתי", "хип а сти", "я искал(а)"),
        ata: f("חִפַּשְׂתָּ", "חיפשת", "хип а ста", "ты м. р. искал"),
        at: f("חִפַּשְׂתְּ", "חיפשת", "хип а ст", "ты ж. р. искала"),
        hu: f("חִפֵּשׂ", "חיפש", "хип е с", "он искал"),
        hi: f("חִפְּשָׂה", "חיפשה", "хипс а", "она искала"),
        anachnu: f("חִפַּשְׂנוּ", "חיפשנו", "хип а сну", "мы искали"),
        atem: f("חִפַּשְׂתֶּם", "חיפשתם", "хипаст е м", "вы м. р. искали"),
        aten: f("חִפַּשְׂתֶּן", "חיפשתן", "хипаст е н", "вы ж. р. искали"),
        hem: f("חִפְּשׂוּ", "חיפשו", "хипс у", "они м. р. искали"),
        hen: f("חִפְּשׂוּ", "חיפשו", "хипс у", "они ж. р. искали"),
      },
      future: {
        ani: f("אֲחַפֵּשׂ", "אחפש", "ахап е с", "я поищу / буду искать"),
        ata: f("תְּחַפֵּשׂ", "תחפש", "техап е с", "ты м. р. поищешь / будешь искать"),
        at: f("תְּחַפְּשִׂי", "תחפשי", "техапс и", "ты ж. р. поищешь / будешь искать"),
        hu: f("יְחַפֵּשׂ", "יחפש", "йехап е с", "он поищет / будет искать"),
        hi: f("תְּחַפֵּשׂ", "תחפש", "техап е с", "она поищет / будет искать"),
        anachnu: f("נְחַפֵּשׂ", "נחפש", "нехап е с", "мы поищем / будем искать"),
        atem: f("תְּחַפְּשׂוּ", "תחפשו", "техапс у", "вы м. р. поищете / будете искать"),
        aten: f("תְּחַפֵּשְׂנָה", "תחפשנה", "техап е сна", "вы ж. р. поищете / будете искать"),
        hem: f("יְחַפְּשׂוּ", "יחפשו", "йехапс у", "они м. р. поищут / будут искать"),
        hen: f("תְּחַפֵּשְׂנָה", "תחפשנה", "техап е сна", "они ж. р. поищут / будут искать"),
      },
      imperative: {
        ms: f("חַפֵּשׂ!", "חפש", "хап е с!", "ищи! мужчине"),
        fs: f("חַפְּשִׂי!", "חפשי", "хапс и!", "ищи! женщине"),
        mp: f("חַפְּשׂוּ!", "חפשו", "хапс у!", "ищите! мужчинам или смешанной группе"),
        fp: f("חַפֵּשְׂנָה!", "חפשנה", "хап е сна!", "ищите! женщинам"),
      },
    },
  },
];

export const findFullBatch009DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_FULL_BATCH_009) {
    if (seen.has(verb.infinitive_hebrew_plain)) duplicates.add(verb.infinitive_hebrew_plain);
    seen.add(verb.infinitive_hebrew_plain);
  }

  return [...duplicates];
};

export const assertFullBatch009 = (): void => {
  const duplicates = findFullBatch009DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in full batch 009: ${duplicates.join(", ")}`);
  }
};
