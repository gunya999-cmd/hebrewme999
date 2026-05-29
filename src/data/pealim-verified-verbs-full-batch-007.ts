// Full Pealim-verified conjugation batch 007.
//
// This file continues converting source-registry entries into full app-ready verb cards.
// Rule: add only manually checked Pealim forms, do not generate guessed conjugations.

import type { PealimVerifiedVerb, VerbForm } from "./pealim-verified-verbs-700";

const f = (
  hebrew: string,
  hebrew_plain: string,
  transcription_ru: string,
  translation_ru: string,
): VerbForm => ({ hebrew, hebrew_plain, transcription_ru, translation_ru });

export const PEALIM_VERIFIED_FULL_BATCH_007: PealimVerifiedVerb[] = [
  {
    id: "pv-0028",
    frequencyRank: 28,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִחְיוֹת",
    infinitive_hebrew_plain: "לחיות",
    transcription_ru: "лихй о т",
    translation_ru: "жить",
    root: "ח-י-ה",
    binyan: "פעל",
    difficulty: "medium",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/dict/797-lichyot/",
    checkedAt: "2026-05-29",
    notes: "Manually checked against Pealim. Final root letter is weak and first root letter is guttural. Feminine plural future/imperative forms are formal; Pealim notes that modern Hebrew usually uses the masculine plural forms instead.",
    conjugations: {
      present: {
        ms: f("חַי", "חי", "х а й", "живёт / я, ты, он живёт"),
        fs: f("חַיָּה", "חיה", "ха я", "живёт / я, ты, она живёт"),
        mp: f("חַיִּים", "חיים", "хай и м", "живут / мы, вы, они м. р. живут"),
        fp: f("חַיּוֹת", "חיות", "хай о т", "живут / мы, вы, они ж. р. живут"),
      },
      past: {
        ani: f("חָיִיתִי", "חייתי", "хай и ти", "я жил(а)"),
        ata: f("חָיִיתָ", "חיית", "хай и та", "ты м. р. жил"),
        at: f("חָיִית", "חיית", "хай и т", "ты ж. р. жила"),
        hu: f("חַי", "חי", "х а й", "он жил"),
        hi: f("חָיְתָה", "חייתה", "хайт а", "она жила"),
        anachnu: f("חָיִינוּ", "חיינו", "хай и ну", "мы жили"),
        atem: f("חֲיִיתֶם", "חייתם", "хайит е м", "вы м. р. жили"),
        aten: f("חֲיִיתֶן", "חייתן", "хайит е н", "вы ж. р. жили"),
        hem: f("חָיוּ", "חיו", "ха ю", "они м. р. жили"),
        hen: f("חָיוּ", "חיו", "ха ю", "они ж. р. жили"),
      },
      future: {
        ani: f("אֶחְיֶה", "אחיה", "эхй е", "я буду жить / проживу"),
        ata: f("תִּחְיֶה", "תחיה", "тихй е", "ты м. р. будешь жить"),
        at: f("תִּחְיִי", "תחיי", "тихй и", "ты ж. р. будешь жить"),
        hu: f("יִחְיֶה", "יחיה", "йихй е", "он будет жить"),
        hi: f("תִּחְיֶה", "תחיה", "тихй е", "она будет жить"),
        anachnu: f("נִחְיֶה", "נחיה", "нихй е", "мы будем жить"),
        atem: f("תִּחְיוּ", "תחיו", "тихь ю", "вы м. р. будете жить"),
        aten: f("תִּחְיֶינָה", "תחיינה", "тихй е на", "вы ж. р. будете жить"),
        hem: f("יִחְיוּ", "יחיו", "йихь ю", "они м. р. будут жить"),
        hen: f("תִּחְיֶינָה", "תחיינה", "тихй е на", "они ж. р. будут жить"),
      },
      imperative: {
        ms: f("חֲיֵה!", "חיה", "хай е!", "живи! мужчине"),
        fs: f("חֲיִי!", "חיי", "хай и!", "живи! женщине"),
        mp: f("חֲיוּ!", "חיו", "ха ю!", "живите! мужчинам или смешанной группе"),
        fp: f("חֲיֶינָה!", "חיינה", "хай е на!", "живите! женщинам"),
      },
    },
  },
];

export const findFullBatch007DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_FULL_BATCH_007) {
    if (seen.has(verb.infinitive_hebrew_plain)) duplicates.add(verb.infinitive_hebrew_plain);
    seen.add(verb.infinitive_hebrew_plain);
  }

  return [...duplicates];
};

export const assertFullBatch007 = (): void => {
  const duplicates = findFullBatch007DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in full batch 007: ${duplicates.join(", ")}`);
  }
};
