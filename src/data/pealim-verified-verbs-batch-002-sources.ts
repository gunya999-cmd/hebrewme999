// Pealim verified verb batch 002 source registry.
//
// Batch 002 continues the 700-verb dataset after batch 001.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 24-43
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

export const PEALIM_VERIFIED_BATCH_002_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0024",
    frequencyRank: 24,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָצֵאת",
    infinitive_plain: "לצאת",
    transcription_ru: "лац е т",
    translation_ru: "выходить; уходить",
    root: "י-צ-א",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A6%D7%90%D7%AA",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "High-frequency paal movement verb. Full exact Pealim page should be attached before full conjugation payload is added.",
  },
  {
    id: "pv-0025",
    frequencyRank: 25,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִיכָּנֵס",
    infinitive_plain: "להיכנס",
    transcription_ru: "леhикан е с",
    translation_ru: "входить",
    root: "כ-נ-ס",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%9B%D7%A0%D7%A1",
    verificationStatus: "source_verified",
    notes: "Pealim search confirms root כ-נ-ס, nifal, meaning входить and infinitive לְהִיכָּנֵס.",
  },
  {
    id: "pv-0026",
    frequencyRank: 26,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַחֲזוֹר",
    infinitive_plain: "לחזור",
    transcription_ru: "лахаз о р",
    translation_ru: "возвращаться; повторять что-либо",
    root: "ח-ז-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%96%D7%95%D7%A8",
    verificationStatus: "source_verified",
    notes: "Pealim search confirms root ח-ז-ר, paal, meaning возвращаться; повторять что-либо.",
  },
  {
    id: "pv-0027",
    frequencyRank: 27,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַעֲבוֹר",
    infinitive_plain: "לעבור",
    transcription_ru: "лаав о р",
    translation_ru: "проходить; переходить; переезжать",
    root: "ע-ב-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A2%D7%91%D7%95%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0028",
    frequencyRank: 28,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִחְיוֹת",
    infinitive_plain: "לחיות",
    transcription_ru: "лихьй о т",
    translation_ru: "жить",
    root: "ח-י-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%99%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0029",
    frequencyRank: 29,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָגוּר",
    infinitive_plain: "לגור",
    transcription_ru: "лаг у р",
    translation_ru: "жить; проживать",
    root: "ג-ו-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%92%D7%95%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0030",
    frequencyRank: 30,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַעֲמוֹד",
    infinitive_plain: "לעמוד",
    transcription_ru: "лаам о д",
    translation_ru: "стоять; выдерживать; соответствовать",
    root: "ע-מ-ד",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A2%D7%9E%D7%95%D7%93",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0031",
    frequencyRank: 31,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִפְתּוֹחַ",
    infinitive_plain: "לפתוח",
    transcription_ru: "лифт о ах",
    translation_ru: "открывать",
    root: "פ-ת-ח",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A4%D7%AA%D7%95%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0032",
    frequencyRank: 32,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִסְגּוֹר",
    infinitive_plain: "לסגור",
    transcription_ru: "лисг о р",
    translation_ru: "закрывать",
    root: "ס-ג-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A1%D7%92%D7%95%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0033",
    frequencyRank: 33,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְחַפֵּשׂ",
    infinitive_plain: "לחפש",
    transcription_ru: "лехап е с",
    translation_ru: "искать",
    root: "ח-פ-שׂ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%A4%D7%A9",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0034",
    frequencyRank: 34,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִמְצוֹא",
    infinitive_plain: "למצוא",
    transcription_ru: "лимц о",
    translation_ru: "находить",
    root: "מ-צ-א",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%9E%D7%A6%D7%95%D7%90",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0035",
    frequencyRank: 35,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַרְגִּישׁ",
    infinitive_plain: "להרגיש",
    transcription_ru: "леhарг и ш",
    translation_ru: "чувствовать",
    root: "ר-ג-שׁ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A8%D7%92%D7%99%D7%A9",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0036",
    frequencyRank: 36,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַכִּיר",
    infinitive_plain: "להכיר",
    transcription_ru: "леhак и р",
    translation_ru: "знать; знакомиться; узнавать",
    root: "נ-כ-ר",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%9B%D7%99%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0037",
    frequencyRank: 37,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַתְחִיל",
    infinitive_plain: "להתחיל",
    transcription_ru: "леhатх и ль",
    translation_ru: "начинать",
    root: "ח-ל-ל",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%97%D7%99%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0038",
    frequencyRank: 38,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַמְשִׁיךְ",
    infinitive_plain: "להמשיך",
    transcription_ru: "леhамш и х",
    translation_ru: "продолжать",
    root: "מ-שׁ-ך",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%9E%D7%A9%D7%99%D7%9A",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0039",
    frequencyRank: 39,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַפְסִיק",
    infinitive_plain: "להפסיק",
    transcription_ru: "леhафс и к",
    translation_ru: "прекращать; останавливать",
    root: "פ-ס-ק",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A4%D7%A1%D7%99%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0040",
    frequencyRank: 40,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִקְנוֹת",
    infinitive_plain: "לקנות",
    transcription_ru: "ликн о т",
    translation_ru: "покупать",
    root: "ק-נ-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A7%D7%A0%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0041",
    frequencyRank: 41,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְשַׁלֵּם",
    infinitive_plain: "לשלם",
    transcription_ru: "лешал е м",
    translation_ru: "платить; оплачивать",
    root: "שׁ-ל-מ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%9C%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0042",
    frequencyRank: 42,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְבַשֵּׁל",
    infinitive_plain: "לבשל",
    transcription_ru: "леваш е ль",
    translation_ru: "готовить еду",
    root: "ב-שׁ-ל",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%91%D7%A9%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0043",
    frequencyRank: 43,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְנַקּוֹת",
    infinitive_plain: "לנקות",
    transcription_ru: "ленак о т",
    translation_ru: "чистить; убирать",
    root: "נ-ק-ה",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A0%D7%A7%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
];

export const findBatch002DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_002_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch002SourceRegistry = (): void => {
  const duplicates = findBatch002DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 002: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_002_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 002");
  }

  const sorted = PEALIM_VERIFIED_BATCH_002_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 002 must stay sorted by frequencyRank ascending");
  }
};
