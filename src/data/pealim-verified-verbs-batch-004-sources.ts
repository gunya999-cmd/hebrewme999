// Pealim verified verb batch 004 source registry.
//
// Batch 004 continues the 700-verb dataset after batch 003.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 64-83
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

export const PEALIM_VERIFIED_BATCH_004_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0064",
    frequencyRank: 64,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְנַסּוֹת",
    infinitive_plain: "לנסות",
    transcription_ru: "ленас о т",
    translation_ru: "пытаться; пробовать",
    root: "נ-ס-ה",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A0%D7%A1%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0065",
    frequencyRank: 65,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהָבִיא",
    infinitive_plain: "להביא",
    transcription_ru: "леhав и",
    translation_ru: "приносить; приводить",
    root: "ב-ו-א",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%91%D7%99%D7%90",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0066",
    frequencyRank: 66,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִשְׁלֹחַ",
    infinitive_plain: "לשלוח",
    transcription_ru: "лишл о ах",
    translation_ru: "посылать; отправлять",
    root: "שׁ-ל-ח",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%9C%D7%95%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0067",
    frequencyRank: 67,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְבַקֵּשׁ",
    infinitive_plain: "לבקש",
    transcription_ru: "левакаш е ",
    translation_ru: "просить; искать; запрашивать",
    root: "ב-ק-שׁ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%91%D7%A7%D7%A9",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0068",
    frequencyRank: 68,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַזְמִין",
    infinitive_plain: "להזמין",
    transcription_ru: "леhазм и н",
    translation_ru: "приглашать; заказывать",
    root: "ז-מ-נ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%96%D7%9E%D7%99%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0069",
    frequencyRank: 69,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְשַׂחֵק",
    infinitive_plain: "לשחק",
    transcription_ru: "лесах е к",
    translation_ru: "играть",
    root: "שׂ-ח-ק",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%97%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0070",
    frequencyRank: 70,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִפְגּוֹשׁ",
    infinitive_plain: "לפגוש",
    transcription_ru: "лифг о ш",
    translation_ru: "встречать; встречаться с",
    root: "פ-ג-שׁ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A4%D7%92%D7%95%D7%A9",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0071",
    frequencyRank: 71,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְחַכּוֹת",
    infinitive_plain: "לחכות",
    transcription_ru: "лехак о т",
    translation_ru: "ждать",
    root: "ח-כ-ה",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%9B%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0072",
    frequencyRank: 72,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִזְכּוֹר",
    infinitive_plain: "לזכור",
    transcription_ru: "лизк о р",
    translation_ru: "помнить",
    root: "ז-כ-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%96%D7%9B%D7%95%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0073",
    frequencyRank: 73,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִשְׁכֹּחַ",
    infinitive_plain: "לשכוח",
    transcription_ru: "лишк о ах",
    translation_ru: "забывать",
    root: "שׁ-כ-ח",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%9B%D7%95%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0074",
    frequencyRank: 74,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַעֲזוֹר",
    infinitive_plain: "לעזור",
    transcription_ru: "лааз о р",
    translation_ru: "помогать",
    root: "ע-ז-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A2%D7%96%D7%95%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0075",
    frequencyRank: 75,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִשְׁמוֹר",
    infinitive_plain: "לשמור",
    transcription_ru: "лишм о р",
    translation_ru: "сохранять; охранять; беречь",
    root: "שׁ-מ-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%9E%D7%95%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0076",
    frequencyRank: 76,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַשְׁאִיר",
    infinitive_plain: "להשאיר",
    transcription_ru: "леhашъ и р",
    translation_ru: "оставлять",
    root: "שׁ-א-ר",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A9%D7%90%D7%99%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0077",
    frequencyRank: 77,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִשָּׁאֵר",
    infinitive_plain: "להישאר",
    transcription_ru: "леhиша э р",
    translation_ru: "оставаться",
    root: "שׁ-א-ר",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%A9%D7%90%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0078",
    frequencyRank: 78,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַקְשִׁיב",
    infinitive_plain: "להקשיב",
    transcription_ru: "леhакш и в",
    translation_ru: "слушать внимательно",
    root: "ק-שׁ-ב",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A7%D7%A9%D7%99%D7%91",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0079",
    frequencyRank: 79,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְסַפֵּר",
    infinitive_plain: "לספר",
    transcription_ru: "лесап е р",
    translation_ru: "рассказывать; стричь",
    root: "ס-פ-ר",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A1%D7%A4%D7%A8",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Primary conversational sense here is рассказывать; Pealim may also list homographic meanings."
  },
  {
    id: "pv-0080",
    frequencyRank: 80,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְסַיֵּם",
    infinitive_plain: "לסיים",
    transcription_ru: "лесай е м",
    translation_ru: "заканчивать; завершать",
    root: "ס-י-מ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A1%D7%99%D7%99%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0081",
    frequencyRank: 81,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִבְחוֹר",
    infinitive_plain: "לבחור",
    transcription_ru: "ливх о р",
    translation_ru: "выбирать",
    root: "ב-ח-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%91%D7%97%D7%95%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0082",
    frequencyRank: 82,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַסְכִּים",
    infinitive_plain: "להסכים",
    transcription_ru: "леhаск и м",
    translation_ru: "соглашаться",
    root: "ס-כ-מ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A1%D7%9B%D7%99%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0083",
    frequencyRank: 83,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִפְתֹּר",
    infinitive_plain: "לפתור",
    transcription_ru: "лифт о р",
    translation_ru: "решать задачу; разрешать проблему",
    root: "פ-ת-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A4%D7%AA%D7%95%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
];

export const findBatch004DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_004_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch004SourceRegistry = (): void => {
  const duplicates = findBatch004DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 004: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_004_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 004");
  }

  const sorted = PEALIM_VERIFIED_BATCH_004_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 004 must stay sorted by frequencyRank ascending");
  }
};
