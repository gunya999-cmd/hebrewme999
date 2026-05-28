// Pealim verified verb batch 006 source registry.
//
// Batch 006 continues the 700-verb dataset after batch 005.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 104-123
// - useful school/family/street/app verbs
// - sorted by practical spoken usefulness
// - no duplicate infinitive_plain values inside this batch

export type PealimVerbBatchSource = {
  id: string;
  frequencyRank: number;
  tier: "top_conversational_350" | "mid_frequency_350";
  infinitive_hebrew: string;
  infinitive_plain: string;
  transcription_ru: string;
  translation_ru: string;
  root: string;
  binyan: "פעל" | "נפעל" | "פיעל" | "פועל" | "הפעיל" | "הופעל" | "התפעל";
  source: "pealim";
  sourceUrl: string;
  verificationStatus: "source_verified" | "needs_full_conjugation_entry" | "full_conjugation_entered";
  notes?: string;
};

export const PEALIM_VERIFIED_BATCH_006_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0104",
    frequencyRank: 104,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִבְדֹּק",
    infinitive_plain: "לבדוק",
    transcription_ru: "ливд о к",
    translation_ru: "проверять",
    root: "ב-ד-ק",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%91%D7%93%D7%95%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0105",
    frequencyRank: 105,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהוֹסִיף",
    infinitive_plain: "להוסיף",
    transcription_ru: "леhос и ф",
    translation_ru: "добавлять",
    root: "י-ס-ף",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%95%D7%A1%D7%99%D7%A3",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0106",
    frequencyRank: 106,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַדְלִיק",
    infinitive_plain: "להדליק",
    transcription_ru: "леhадл и к",
    translation_ru: "включать; зажигать",
    root: "ד-ל-ק",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%93%D7%9C%D7%99%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0107",
    frequencyRank: 107,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְכַבּוֹת",
    infinitive_plain: "לכבות",
    transcription_ru: "лехаб о т",
    translation_ru: "выключать; гасить",
    root: "כ-ב-ה",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%9B%D7%91%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0108",
    frequencyRank: 108,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַפְעִיל",
    infinitive_plain: "להפעיל",
    transcription_ru: "леhафъ и ль",
    translation_ru: "запускать; включать; приводить в действие",
    root: "פ-ע-ל",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A4%D7%A2%D7%99%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0109",
    frequencyRank: 109,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַעֲצֹר",
    infinitive_plain: "לעצור",
    transcription_ru: "лаац о р",
    translation_ru: "останавливать; арестовывать",
    root: "ע-צ-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A2%D7%A6%D7%95%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0110",
    frequencyRank: 110,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִסְתַּכֵּל",
    infinitive_plain: "להסתכל",
    transcription_ru: "леhистак е ль",
    translation_ru: "смотреть",
    root: "ס-כ-ל",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A1%D7%AA%D7%9B%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0111",
    frequencyRank: 111,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִצְפּוֹת",
    infinitive_plain: "לצפות",
    transcription_ru: "лицп о т",
    translation_ru: "смотреть; ожидать",
    root: "צ-פ-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A6%D7%A4%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0112",
    frequencyRank: 112,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְפַחֵד",
    infinitive_plain: "לפחד",
    transcription_ru: "лефах е д",
    translation_ru: "бояться",
    root: "פ-ח-ד",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A4%D7%97%D7%93",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0113",
    frequencyRank: 113,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִכְעֹס",
    infinitive_plain: "לכעוס",
    transcription_ru: "лихъ о с",
    translation_ru: "сердиться; злиться",
    root: "כ-ע-ס",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%9B%D7%A2%D7%95%D7%A1",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0114",
    frequencyRank: 114,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִבְכּוֹת",
    infinitive_plain: "לבכות",
    transcription_ru: "ливк о т",
    translation_ru: "плакать",
    root: "ב-כ-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%91%D7%9B%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0115",
    frequencyRank: 115,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִצְחוֹק",
    infinitive_plain: "לצחוק",
    transcription_ru: "лицх о к",
    translation_ru: "смеяться",
    root: "צ-ח-ק",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A6%D7%97%D7%95%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0116",
    frequencyRank: 116,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְחַיֵּךְ",
    infinitive_plain: "לחייך",
    transcription_ru: "лехай е х",
    translation_ru: "улыбаться",
    root: "ח-י-ך",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%99%D7%99%D7%9A",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0117",
    frequencyRank: 117,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִצְעֹק",
    infinitive_plain: "לצעוק",
    transcription_ru: "лицъ о к",
    translation_ru: "кричать",
    root: "צ-ע-ק",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A6%D7%A2%D7%95%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0118",
    frequencyRank: 118,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָשִׁיר",
    infinitive_plain: "לשיר",
    transcription_ru: "лаш и р",
    translation_ru: "петь",
    root: "ש-י-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%99%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0119",
    frequencyRank: 119,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִרְקֹד",
    infinitive_plain: "לרקוד",
    transcription_ru: "лирк о д",
    translation_ru: "танцевать",
    root: "ר-ק-ד",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A8%D7%A7%D7%95%D7%93",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0120",
    frequencyRank: 120,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְנַגֵּן",
    infinitive_plain: "לנגן",
    transcription_ru: "ленаг е н",
    translation_ru: "играть на музыкальном инструменте",
    root: "נ-ג-נ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A0%D7%92%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0121",
    frequencyRank: 121,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְצַיֵּר",
    infinitive_plain: "לצייר",
    transcription_ru: "лецай е р",
    translation_ru: "рисовать",
    root: "צ-י-ר",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A6%D7%99%D7%99%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0122",
    frequencyRank: 122,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְצַלֵּם",
    infinitive_plain: "לצלם",
    transcription_ru: "лецал е м",
    translation_ru: "фотографировать; снимать",
    root: "צ-ל-מ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A6%D7%9C%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0123",
    frequencyRank: 123,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְקַלֵּחַ",
    infinitive_plain: "להתקלח",
    transcription_ru: "леhиткал е ах",
    translation_ru: "принимать душ; мыться в душе",
    root: "ק-ל-ח",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A7%D7%9C%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
];

export const findBatch006DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_006_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch006SourceRegistry = (): void => {
  const duplicates = findBatch006DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 006: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_006_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 006");
  }

  const sorted = PEALIM_VERIFIED_BATCH_006_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 006 must stay sorted by frequencyRank ascending");
  }
};
