// Pealim verified verb batch 007 source registry.
//
// Batch 007 continues the 700-verb dataset after batch 006.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 124-143
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

export const PEALIM_VERIFIED_BATCH_007_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0124",
    frequencyRank: 124,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְגַּלֵּחַ",
    infinitive_plain: "להתגלח",
    transcription_ru: "леhитгал е ах",
    translation_ru: "бриться",
    root: "ג-ל-ח",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%92%D7%9C%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0125",
    frequencyRank: 125,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְצַחְצֵחַ",
    infinitive_plain: "לצחצח",
    transcription_ru: "лецахц е ах",
    translation_ru: "чистить; полировать",
    root: "צ-ח-צ-ח",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A6%D7%97%D7%A6%D7%97",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Quadriliteral root; common in phrase לצחצח שיניים = чистить зубы."
  },
  {
    id: "pv-0126",
    frequencyRank: 126,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִשְׁטֹף",
    infinitive_plain: "לשטוף",
    transcription_ru: "лишт о ф",
    translation_ru: "мыть; промывать",
    root: "שׁ-ט-ף",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%98%D7%95%D7%A3",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0127",
    frequencyRank: 127,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִרְחוֹץ",
    infinitive_plain: "לרחוץ",
    transcription_ru: "лирх о ц",
    translation_ru: "мыть; купать",
    root: "ר-ח-צ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A8%D7%97%D7%95%D7%A5",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0128",
    frequencyRank: 128,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְכַבֵּס",
    infinitive_plain: "לכבס",
    transcription_ru: "лехаб е с",
    translation_ru: "стирать бельё",
    root: "כ-ב-ס",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%9B%D7%91%D7%A1",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0129",
    frequencyRank: 129,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְגַהֵץ",
    infinitive_plain: "לגהץ",
    transcription_ru: "легаh е ц",
    translation_ru: "гладить утюгом",
    root: "ג-ה-צ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%92%D7%94%D7%A5",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0130",
    frequencyRank: 130,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִסְפּוֹר",
    infinitive_plain: "לספור",
    transcription_ru: "лисп о р",
    translation_ru: "считать; пересчитывать",
    root: "ס-פ-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A1%D7%A4%D7%95%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0131",
    frequencyRank: 131,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִמְדֹּד",
    infinitive_plain: "למדוד",
    transcription_ru: "лимд о д",
    translation_ru: "измерять; мерить",
    root: "מ-ד-ד",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%9E%D7%93%D7%95%D7%93",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0132",
    frequencyRank: 132,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַחְתֹּךְ",
    infinitive_plain: "לחתוך",
    transcription_ru: "лахт о х",
    translation_ru: "резать; отрезать",
    root: "ח-ת-ך",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%AA%D7%95%D7%9A",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0133",
    frequencyRank: 133,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְעַרְבֵּב",
    infinitive_plain: "לערבב",
    transcription_ru: "леарб е в",
    translation_ru: "смешивать; перемешивать",
    root: "ע-ר-ב-ב",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A2%D7%A8%D7%91%D7%91",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded/quadriliteral root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0134",
    frequencyRank: 134,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְטַגֵּן",
    infinitive_plain: "לטגן",
    transcription_ru: "летаг е н",
    translation_ru: "жарить",
    root: "ט-ג-נ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%98%D7%92%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0135",
    frequencyRank: 135,
    tier: "top_conversational_350",
    infinitive_hebrew: "לֶאֱפוֹת",
    infinitive_plain: "לאפות",
    transcription_ru: "леэф о т",
    translation_ru: "печь; выпекать",
    root: "א-פ-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%90%D7%A4%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0136",
    frequencyRank: 136,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִטְעֹם",
    infinitive_plain: "לטעום",
    transcription_ru: "литъ о м",
    translation_ru: "пробовать на вкус",
    root: "ט-ע-מ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%98%D7%A2%D7%95%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0137",
    frequencyRank: 137,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִמְכּוֹר",
    infinitive_plain: "למכור",
    transcription_ru: "лимк о р",
    translation_ru: "продавать",
    root: "מ-כ-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%9E%D7%9B%D7%95%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0138",
    frequencyRank: 138,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַרְוִויחַ",
    infinitive_plain: "להרוויח",
    transcription_ru: "леhарв и ах",
    translation_ru: "зарабатывать; выигрывать",
    root: "ר-ו-ח",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A8%D7%95%D7%95%D7%99%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0139",
    frequencyRank: 139,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְבַזְבֵּז",
    infinitive_plain: "לבזבז",
    transcription_ru: "левазб е з",
    translation_ru: "тратить впустую; растрачивать",
    root: "ב-ז-ב-ז",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%91%D7%96%D7%91%D7%96",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0140",
    frequencyRank: 140,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַחְסוֹךְ",
    infinitive_plain: "לחסוך",
    transcription_ru: "лахс о х",
    translation_ru: "экономить; сберегать",
    root: "ח-ס-ך",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%A1%D7%95%D7%9A",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0141",
    frequencyRank: 141,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִשְׂכּוֹר",
    infinitive_plain: "לשכור",
    transcription_ru: "лиск о р",
    translation_ru: "арендовать; нанимать",
    root: "שׂ-כ-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%9B%D7%95%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0142",
    frequencyRank: 142,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַשְׂכִּיר",
    infinitive_plain: "להשכיר",
    transcription_ru: "леhаск и р",
    translation_ru: "сдавать в аренду",
    root: "שׂ-כ-ר",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A9%D7%9B%D7%99%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0143",
    frequencyRank: 143,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְתַכְנֵן",
    infinitive_plain: "לתכנן",
    transcription_ru: "летахн е н",
    translation_ru: "планировать",
    root: "ת-כ-נ-נ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%AA%D7%9B%D7%A0%D7%9F",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded root spelling kept explicit for later manual conjugation verification."
  },
];

export const findBatch007DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_007_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch007SourceRegistry = (): void => {
  const duplicates = findBatch007DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 007: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_007_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 007");
  }

  const sorted = PEALIM_VERIFIED_BATCH_007_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 007 must stay sorted by frequencyRank ascending");
  }
};
