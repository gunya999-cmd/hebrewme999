// Full Pealim-verified conjugation batch 001.
//
// This file starts converting source-registry entries into full app-ready verb cards.
// Rule: add only manually checked Pealim forms, do not generate guessed conjugations.

import type { PealimVerifiedVerb, VerbForm } from "./pealim-verified-verbs-700";

const f = (
  hebrew: string,
  hebrew_plain: string,
  transcription_ru: string,
  translation_ru: string,
): VerbForm => ({ hebrew, hebrew_plain, transcription_ru, translation_ru });

export const PEALIM_VERIFIED_FULL_BATCH_001: PealimVerifiedVerb[] = [
  {
    id: "pv-0004",
    frequencyRank: 4,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָלֶכֶת",
    infinitive_hebrew_plain: "ללכת",
    transcription_ru: "лал е хет",
    translation_ru: "идти",
    root: "ה-ל-ך",
    binyan: "פעל",
    difficulty: "easy",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/dict/7-lalechet/",
    checkedAt: "2026-05-29",
    notes: "Manually checked against Pealim. Pealim marks first root letter as weak and guttural; some feminine plural future/imperative forms have rare literary variants, with modern spoken usage usually preferring masculine plural forms.",
    conjugations: {
      present: {
        ms: f("הוֹלֵךְ", "הולך", "hол е х", "идёт / я, ты, он идёт"),
        fs: f("הוֹלֶכֶת", "הולכת", "hол е хет", "идёт / я, ты, она идёт"),
        mp: f("הוֹלְכִים", "הולכים", "hольх и м", "идут / мы, вы, они м. р. идут"),
        fp: f("הוֹלְכוֹת", "הולכות", "hольх о т", "идут / мы, вы, они ж. р. идут"),
      },
      past: {
        ani: f("הָלַכְתִּי", "הלכתי", "hал а хти", "я пошёл / пошла"),
        ata: f("הָלַכְתָּ", "הלכת", "hал а хта", "ты м. р. пошёл"),
        at: f("הָלַכְתְּ", "הלכת", "hал а хт", "ты ж. р. пошла"),
        hu: f("הָלַךְ", "הלך", "hал а х", "он пошёл"),
        hi: f("הָלְכָה", "הלכה", "hальх а", "она пошла"),
        anachnu: f("הָלַכְנוּ", "הלכנו", "hал а хну", "мы пошли"),
        atem: f("הֲלַכְתֶּם", "הלכתם", "hалахт е м", "вы м. р. пошли"),
        aten: f("הֲלַכְתֶּן", "הלכתן", "hалахт е н", "вы ж. р. пошли"),
        hem: f("הָלְכוּ", "הלכו", "hальх у", "они м. р. пошли"),
        hen: f("הָלְכוּ", "הלכו", "hальх у", "они ж. р. пошли"),
      },
      future: {
        ani: f("אֵלֵךְ", "אלך", "эл е х", "я пойду"),
        ata: f("תֵּלֵךְ", "תלך", "тел е х", "ты м. р. пойдёшь"),
        at: f("תֵּלְכִי", "תלכי", "тельх и", "ты ж. р. пойдёшь"),
        hu: f("יֵלֵךְ", "ילך", "йел е х", "он пойдёт"),
        hi: f("תֵּלֵךְ", "תלך", "тел е х", "она пойдёт"),
        anachnu: f("נֵלֵךְ", "נלך", "нел е х", "мы пойдём"),
        atem: f("תֵּלְכוּ", "תלכו", "тельх у", "вы м. р. пойдёте"),
        aten: f("תֵּלַכְנָה", "תלכנה", "тел а хна", "вы ж. р. пойдёте"),
        hem: f("יֵלְכוּ", "ילכו", "йельх у", "они м. р. пойдут"),
        hen: f("תֵּלַכְנָה", "תלכנה", "тел а хна", "они ж. р. пойдут"),
      },
      imperative: {
        ms: f("לֵךְ!", "לך", "л е х!", "иди! мужчине"),
        fs: f("לְכִי!", "לכי", "лех и!", "иди! женщине"),
        mp: f("לְכוּ!", "לכו", "лех у!", "идите! мужчинам или смешанной группе"),
        fp: f("לֵכְנָה!", "לכנה", "л е хна!", "идите! женщинам"),
      },
    },
  },
];

export const findFullBatch001DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_FULL_BATCH_001) {
    if (seen.has(verb.infinitive_hebrew_plain)) duplicates.add(verb.infinitive_hebrew_plain);
    seen.add(verb.infinitive_hebrew_plain);
  }

  return [...duplicates];
};

export const assertFullBatch001 = (): void => {
  const duplicates = findFullBatch001DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in full batch 001: ${duplicates.join(", ")}`);
  }
};
