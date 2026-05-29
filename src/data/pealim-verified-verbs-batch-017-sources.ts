// Pealim verified verb batch 017 source registry.
//
// Batch 017 continues the 700-verb dataset after batch 016.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 324-343
// - useful document/legal/school/admin/digital verbs
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

export const PEALIM_VERIFIED_BATCH_017_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0324",
    frequencyRank: 324,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַחְתּוֹם",
    infinitive_plain: "לחתום",
    transcription_ru: "лахт о м",
    translation_ru: "подписывать; завершать",
    root: "ח-ת-מ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%AA%D7%95%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0325",
    frequencyRank: 325,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְאַשֵּׁר",
    infinitive_plain: "לאשר",
    transcription_ru: "леаш е р",
    translation_ru: "подтверждать; одобрять",
    root: "א-שׁ-ר",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%90%D7%A9%D7%A8",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Duplicate-risk check against batch 008 before final unified merge."
  },
  {
    id: "pv-0326",
    frequencyRank: 326,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְאַחֵר",
    infinitive_plain: "לאחר",
    transcription_ru: "леах е р",
    translation_ru: "опаздывать; задерживать",
    root: "א-ח-ר",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%90%D7%97%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0327",
    frequencyRank: 327,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַקְדִּים",
    infinitive_plain: "להקדים",
    transcription_ru: "леhакд и м",
    translation_ru: "приходить раньше; переносить на более ранний срок; предварять",
    root: "ק-ד-מ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A7%D7%93%D7%99%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0328",
    frequencyRank: 328,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְעַכֵּב",
    infinitive_plain: "להתעכב",
    transcription_ru: "леhитак е в",
    translation_ru: "задерживаться",
    root: "ע-כ-ב",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A2%D7%9B%D7%91",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0329",
    frequencyRank: 329,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְעַכֵּב",
    infinitive_plain: "לעכב",
    transcription_ru: "леак е в",
    translation_ru: "задерживать; тормозить",
    root: "ע-כ-ב",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A2%D7%9B%D7%91",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0330",
    frequencyRank: 330,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִדְרוֹשׁ",
    infinitive_plain: "לדרוש",
    transcription_ru: "лидр о ш",
    translation_ru: "требовать; запрашивать",
    root: "ד-ר-שׁ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%93%D7%A8%D7%95%D7%A9",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0331",
    frequencyRank: 331,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִתְבּוֹעַ",
    infinitive_plain: "לתבוע",
    transcription_ru: "литб о а",
    translation_ru: "требовать; подавать иск",
    root: "ת-ב-ע",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%AA%D7%91%D7%95%D7%A2",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0332",
    frequencyRank: 332,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְלַבֵּט",
    infinitive_plain: "להתלבט",
    transcription_ru: "леhитлаб е т",
    translation_ru: "сомневаться; колебаться между вариантами",
    root: "ל-ב-ט",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%9C%D7%91%D7%98",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0333",
    frequencyRank: 333,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְיַחֵד",
    infinitive_plain: "להתייחד",
    transcription_ru: "леhитъях е д",
    translation_ru: "выделяться; уединяться",
    root: "י-ח-ד",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%99%D7%99%D7%97%D7%93",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0334",
    frequencyRank: 334,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְאַחֵד",
    infinitive_plain: "לאחד",
    transcription_ru: "леах е д",
    translation_ru: "объединять",
    root: "א-ח-ד",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%90%D7%97%D7%93",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0335",
    frequencyRank: 335,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְאַחֵד",
    infinitive_plain: "להתאחד",
    transcription_ru: "леhитах е д",
    translation_ru: "объединяться",
    root: "א-ח-ד",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%90%D7%97%D7%93",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0336",
    frequencyRank: 336,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְפַרְסֵם",
    infinitive_plain: "לפרסם",
    transcription_ru: "лефарс е м",
    translation_ru: "публиковать; рекламировать",
    root: "פ-ר-ס-מ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A4%D7%A8%D7%A1%D7%9D",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0337",
    frequencyRank: 337,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְפַּרְסֵם",
    infinitive_plain: "להתפרסם",
    transcription_ru: "леhитфарс е м",
    translation_ru: "становиться известным; публиковаться",
    root: "פ-ר-ס-מ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A4%D7%A8%D7%A1%D7%9D",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0338",
    frequencyRank: 338,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִסְרוֹק",
    infinitive_plain: "לסרוק",
    transcription_ru: "лиcр о к",
    translation_ru: "сканировать; расчёсывать",
    root: "ס-ר-ק",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A1%D7%A8%D7%95%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0339",
    frequencyRank: 339,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַצְפִּין",
    infinitive_plain: "להצפין",
    transcription_ru: "леhацп и н",
    translation_ru: "шифровать; направляться на север",
    root: "צ-פ-נ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A6%D7%A4%D7%99%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0340",
    frequencyRank: 340,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְפַעְנֵחַ",
    infinitive_plain: "לפענח",
    transcription_ru: "лефаан е ах",
    translation_ru: "расшифровывать; разгадывать",
    root: "פ-ע-נ-ח",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A4%D7%A2%D7%A0%D7%97",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0341",
    frequencyRank: 341,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַצְלִיב",
    infinitive_plain: "להצליב",
    transcription_ru: "леhацл и в",
    translation_ru: "перекрещивать; сопоставлять",
    root: "צ-ל-ב",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A6%D7%9C%D7%99%D7%91",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0342",
    frequencyRank: 342,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַעֲרֹךְ",
    infinitive_plain: "לערוך",
    transcription_ru: "лаар о х",
    translation_ru: "редактировать; проводить; устраивать",
    root: "ע-ר-כ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A2%D7%A8%D7%95%D7%9A",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0343",
    frequencyRank: 343,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהֵעָרֵךְ",
    infinitive_plain: "להיערך",
    transcription_ru: "леhеар е х",
    translation_ru: "готовиться; организовываться; быть проведённым",
    root: "ע-ר-כ",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%A2%D7%A8%D7%9A",
    verificationStatus: "needs_full_conjugation_entry"
  }
];

export const findBatch017DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_017_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch017SourceRegistry = (): void => {
  const duplicates = findBatch017DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 017: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_017_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 017");
  }

  const sorted = PEALIM_VERIFIED_BATCH_017_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 017 must stay sorted by frequencyRank ascending");
  }
};
