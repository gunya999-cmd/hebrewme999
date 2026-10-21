// Pealim verified verb batch 011 source registry.
//
// Batch 011 continues the 700-verb dataset after batch 010.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 204-223
// - useful school/family/street/app/reading verbs
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

export const PEALIM_VERIFIED_BATCH_011_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0204",
    frequencyRank: 204,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַפְרִיד",
    infinitive_plain: "להפריד",
    transcription_ru: "леhафр и д",
    translation_ru: "разделять; отделять",
    root: "פ-ר-ד",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A4%D7%A8%D7%99%D7%93",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0205",
    frequencyRank: 205,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִיפָּרֵד",
    infinitive_plain: "להיפרד",
    transcription_ru: "леhипар е д",
    translation_ru: "расставаться; прощаться",
    root: "פ-ר-ד",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%A4%D7%A8%D7%93",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0206",
    frequencyRank: 206,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְגַלּוֹת",
    infinitive_plain: "לגלות",
    transcription_ru: "легал о т",
    translation_ru: "обнаруживать; раскрывать",
    root: "ג-ל-ה",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%92%D7%9C%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0207",
    frequencyRank: 207,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַסְתִּיר",
    infinitive_plain: "להסתיר",
    transcription_ru: "леhаст и р",
    translation_ru: "прятать; скрывать",
    root: "ס-ת-ר",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A1%D7%AA%D7%99%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0208",
    frequencyRank: 208,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהָגֵן",
    infinitive_plain: "להגן",
    transcription_ru: "леhаг е н",
    translation_ru: "защищать",
    root: "ג-נ-נ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%92%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0209",
    frequencyRank: 209,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִתְקֹף",
    infinitive_plain: "לתקוף",
    transcription_ru: "литк о ф",
    translation_ru: "атаковать; нападать",
    root: "ת-ק-פ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%AA%D7%A7%D7%95%D7%A3",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0210",
    frequencyRank: 210,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִילָּחֵם",
    infinitive_plain: "להילחם",
    transcription_ru: "леhилах е м",
    translation_ru: "воевать; бороться",
    root: "ל-ח-מ",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%9C%D7%97%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0211",
    frequencyRank: 211,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִבְרוֹחַ",
    infinitive_plain: "לברוח",
    transcription_ru: "ливр о ах",
    translation_ru: "убегать; сбегать",
    root: "ב-ר-ח",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%91%D7%A8%D7%95%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0212",
    frequencyRank: 212,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַצִּיל",
    infinitive_plain: "להציל",
    transcription_ru: "леhац и ль",
    translation_ru: "спасать",
    root: "נ-צ-ל",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A6%D7%99%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0213",
    frequencyRank: 213,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִינָּצֵל",
    infinitive_plain: "להינצל",
    transcription_ru: "леhинац е ль",
    translation_ru: "спасаться; быть спасённым",
    root: "נ-צ-ל",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%A0%D7%A6%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0214",
    frequencyRank: 214,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְטַפֵּל",
    infinitive_plain: "לטפל",
    transcription_ru: "летап е ль",
    translation_ru: "лечить; ухаживать; заниматься вопросом",
    root: "ט-פ-ל",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%98%D7%A4%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0215",
    frequencyRank: 215,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהֵירָגַע",
    infinitive_plain: "להירגע",
    transcription_ru: "леhераг а",
    translation_ru: "успокаиваться",
    root: "ר-ג-ע",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%A8%D7%92%D7%A2",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0216",
    frequencyRank: 216,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַרְגִּיעַ",
    infinitive_plain: "להרגיע",
    transcription_ru: "леhарг и а",
    translation_ru: "успокаивать",
    root: "ר-ג-ע",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A8%D7%92%D7%99%D7%A2",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0217",
    frequencyRank: 217,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְעוֹרֵר",
    infinitive_plain: "להתעורר",
    transcription_ru: "леhитор е р",
    translation_ru: "просыпаться; пробуждаться",
    root: "ע-ו-ר",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A2%D7%95%D7%A8%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0218",
    frequencyRank: 218,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהָעִיר",
    infinitive_plain: "להעיר",
    transcription_ru: "леhа и р",
    translation_ru: "будить; замечать; комментировать",
    root: "ע-ו-ר",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A2%D7%99%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0219",
    frequencyRank: 219,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִנְשׁוֹם",
    infinitive_plain: "לנשום",
    transcription_ru: "линш о м",
    translation_ru: "дышать",
    root: "נ-שׁ-מ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A0%D7%A9%D7%95%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0220",
    frequencyRank: 220,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהָרִיחַ",
    infinitive_plain: "להריח",
    transcription_ru: "леhар и ах",
    translation_ru: "нюхать; пахнуть",
    root: "ר-י-ח",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A8%D7%99%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0221",
    frequencyRank: 221,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִכְאוֹב",
    infinitive_plain: "לכאוב",
    transcription_ru: "лихъ о в",
    translation_ru: "болеть; причинять боль",
    root: "כ-א-ב",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%9B%D7%90%D7%95%D7%91",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0222",
    frequencyRank: 222,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַחֲלוֹת",
    infinitive_plain: "לחלות",
    transcription_ru: "лахал о т",
    translation_ru: "болеть; заболеть",
    root: "ח-ל-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%9C%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0223",
    frequencyRank: 223,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַבְרִיא",
    infinitive_plain: "להבריא",
    transcription_ru: "леhавр и",
    translation_ru: "выздоравливать; оздоравливать",
    root: "ב-ר-א",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%91%D7%A8%D7%99%D7%90",
    verificationStatus: "needs_full_conjugation_entry"
  }
];

export const findBatch011DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_011_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch011SourceRegistry = (): void => {
  const duplicates = findBatch011DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 011: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_011_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 011");
  }

  const sorted = PEALIM_VERIFIED_BATCH_011_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 011 must stay sorted by frequencyRank ascending");
  }
};
