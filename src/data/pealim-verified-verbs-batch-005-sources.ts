// Pealim verified verb batch 005 source registry.
//
// Batch 005 continues the 700-verb dataset after batch 004.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 84-103
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

export const PEALIM_VERIFIED_BATCH_005_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0084",
    frequencyRank: 84,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַסְפִּיק",
    infinitive_plain: "להספיק",
    transcription_ru: "леhасп и к",
    translation_ru: "успевать; быть достаточным",
    root: "ס-פ-ק",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A1%D7%A4%D7%99%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0085",
    frequencyRank: 85,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַזִּיז",
    infinitive_plain: "להזיז",
    transcription_ru: "леhаз и з",
    translation_ru: "двигать; сдвигать",
    root: "ז-ו-ז",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%96%D7%99%D7%96",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0086",
    frequencyRank: 86,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַחְלִיף",
    infinitive_plain: "להחליף",
    transcription_ru: "леhахл и ф",
    translation_ru: "менять; заменять",
    root: "ח-ל-פ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%97%D7%9C%D7%99%D7%A3",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0087",
    frequencyRank: 87,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָקוּם",
    infinitive_plain: "לקום",
    transcription_ru: "лак у м",
    translation_ru: "вставать; подниматься",
    root: "ק-ו-מ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A7%D7%95%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0088",
    frequencyRank: 88,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִפּוֹל",
    infinitive_plain: "ליפול",
    transcription_ru: "лип о ль",
    translation_ru: "падать",
    root: "נ-פ-ל",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%99%D7%A4%D7%95%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0089",
    frequencyRank: 89,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהָרִים",
    infinitive_plain: "להרים",
    transcription_ru: "леhар и м",
    translation_ru: "поднимать",
    root: "ר-ו-מ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A8%D7%99%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0090",
    frequencyRank: 90,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהוֹרִיד",
    infinitive_plain: "להוריד",
    transcription_ru: "леhор и д",
    translation_ru: "снимать; опускать; скачивать",
    root: "י-ר-ד",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%95%D7%A8%D7%99%D7%93",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0091",
    frequencyRank: 91,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִלְבּוֹשׁ",
    infinitive_plain: "ללבוש",
    transcription_ru: "лильб о ш",
    translation_ru: "надевать; носить одежду",
    root: "ל-ב-שׁ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%9C%D7%91%D7%95%D7%A9",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0092",
    frequencyRank: 92,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְלַבֵּשׁ",
    infinitive_plain: "להתלבש",
    transcription_ru: "леhитлаб е ш",
    translation_ru: "одеваться",
    root: "ל-ב-שׁ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%9C%D7%91%D7%A9",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0093",
    frequencyRank: 93,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָגַעַת",
    infinitive_plain: "לגעת",
    transcription_ru: "лаг а ат",
    translation_ru: "касаться; трогать",
    root: "נ-ג-ע",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%92%D7%A2%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0094",
    frequencyRank: 94,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַחֲזִיק",
    infinitive_plain: "להחזיק",
    transcription_ru: "леhахаз и к",
    translation_ru: "держать; владеть",
    root: "ח-ז-ק",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%97%D7%96%D7%99%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0095",
    frequencyRank: 95,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִזְרֹק",
    infinitive_plain: "לזרוק",
    transcription_ru: "лизр о к",
    translation_ru: "бросать; выбрасывать",
    root: "ז-ר-ק",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%96%D7%A8%D7%95%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0096",
    frequencyRank: 96,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִתְפּוֹס",
    infinitive_plain: "לתפוס",
    transcription_ru: "литп о с",
    translation_ru: "ловить; хватать; понимать",
    root: "ת-פ-ס",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%AA%D7%A4%D7%95%D7%A1",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0097",
    frequencyRank: 97,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְנַצֵּחַ",
    infinitive_plain: "לנצח",
    transcription_ru: "ленац е ах",
    translation_ru: "побеждать",
    root: "נ-צ-ח",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A0%D7%A6%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0098",
    frequencyRank: 98,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַפְסִיד",
    infinitive_plain: "להפסיד",
    transcription_ru: "леhафс и д",
    translation_ru: "проигрывать; терять",
    root: "פ-ס-ד",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A4%D7%A1%D7%99%D7%93",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0099",
    frequencyRank: 99,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִקְרוֹת",
    infinitive_plain: "לקרות",
    transcription_ru: "ликр о т",
    translation_ru: "случаться; происходить",
    root: "ק-ר-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A7%D7%A8%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0100",
    frequencyRank: 100,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַצְלִיחַ",
    infinitive_plain: "להצליח",
    transcription_ru: "леhацл и ах",
    translation_ru: "успевать; удаваться; добиваться успеха",
    root: "צ-ל-ח",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A6%D7%9C%D7%99%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0101",
    frequencyRank: 101,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִיכָּשֵׁל",
    infinitive_plain: "להיכשל",
    transcription_ru: "леhикаш е ль",
    translation_ru: "проваливаться; терпеть неудачу",
    root: "כ-שׁ-ל",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%9B%D7%A9%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0102",
    frequencyRank: 102,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְרַגֵּל",
    infinitive_plain: "להתרגל",
    transcription_ru: "леhитраг е ль",
    translation_ru: "привыкать",
    root: "ר-ג-ל",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A8%D7%92%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0103",
    frequencyRank: 103,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַאֲמִין",
    infinitive_plain: "להאמין",
    transcription_ru: "леhаам и н",
    translation_ru: "верить",
    root: "א-מ-נ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%90%D7%9E%D7%99%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
];

export const findBatch005DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_005_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch005SourceRegistry = (): void => {
  const duplicates = findBatch005DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 005: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_005_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 005");
  }

  const sorted = PEALIM_VERIFIED_BATCH_005_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 005 must stay sorted by frequencyRank ascending");
  }
};
