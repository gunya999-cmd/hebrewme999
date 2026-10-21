// Pealim verified verb batch 003 source registry.
//
// Batch 003 continues the 700-verb dataset after batch 002.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 44-63
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

export const PEALIM_VERIFIED_BATCH_003_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0044",
    frequencyRank: 44,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְתַקֵּן",
    infinitive_plain: "לתקן",
    transcription_ru: "летак е н",
    translation_ru: "чинить; исправлять",
    root: "ת-ק-נ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%AA%D7%A7%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0045",
    frequencyRank: 45,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְסַדֵּר",
    infinitive_plain: "לסדר",
    transcription_ru: "лесад е р",
    translation_ru: "приводить в порядок; организовывать",
    root: "ס-ד-ר",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A1%D7%93%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0046",
    frequencyRank: 46,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְקַשֵּׁר",
    infinitive_plain: "להתקשר",
    transcription_ru: "леhиткаш е р",
    translation_ru: "звонить; связываться",
    root: "ק-שׁ-ר",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A7%D7%A9%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0047",
    frequencyRank: 47,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְכַּתֵּב",
    infinitive_plain: "להתכתב",
    transcription_ru: "леhиткат е в",
    translation_ru: "переписываться",
    root: "כ-ת-ב",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%9B%D7%AA%D7%91",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0048",
    frequencyRank: 48,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְאַמֵּן",
    infinitive_plain: "להתאמן",
    transcription_ru: "леhитам е н",
    translation_ru: "тренироваться; практиковаться",
    root: "א-מ-נ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%90%D7%9E%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0049",
    frequencyRank: 49,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְעַנְיֵן",
    infinitive_plain: "להתעניין",
    transcription_ru: "леhитанй е н",
    translation_ru: "интересоваться",
    root: "ע-נ-י-נ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A2%D7%A0%D7%99%D7%99%D7%9F",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Quadriliteral/expanded root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0050",
    frequencyRank: 50,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִסְתַּדֵּר",
    infinitive_plain: "להסתדר",
    transcription_ru: "леhистад е р",
    translation_ru: "справляться; устраиваться; ладить",
    root: "ס-ד-ר",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A1%D7%AA%D7%93%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0051",
    frequencyRank: 51,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְכּוֹנֵן",
    infinitive_plain: "להתכונן",
    transcription_ru: "леhиткон е н",
    translation_ru: "готовиться",
    root: "כ-ו-נ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%9B%D7%95%D7%A0%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0052",
    frequencyRank: 52,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַעֲלוֹת",
    infinitive_plain: "לעלות",
    transcription_ru: "лаал о т",
    translation_ru: "подниматься; заходить; стоить",
    root: "ע-ל-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A2%D7%9C%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0053",
    frequencyRank: 53,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָרֶדֶת",
    infinitive_plain: "לרדת",
    transcription_ru: "лар е дет",
    translation_ru: "спускаться; снижаться",
    root: "י-ר-ד",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A8%D7%93%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0054",
    frequencyRank: 54,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָרוּץ",
    infinitive_plain: "לרוץ",
    transcription_ru: "лар у ц",
    translation_ru: "бежать",
    root: "ר-ו-צ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A8%D7%95%D7%A5",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0055",
    frequencyRank: 55,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְקַדֵּם",
    infinitive_plain: "להתקדם",
    transcription_ru: "леhиткад е м",
    translation_ru: "продвигаться; двигаться вперёд",
    root: "ק-ד-מ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A7%D7%93%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0056",
    frequencyRank: 56,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְקַבֵּל",
    infinitive_plain: "לקבל",
    transcription_ru: "лекаб е ль",
    translation_ru: "получать; принимать",
    root: "ק-ב-ל",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A7%D7%91%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0057",
    frequencyRank: 57,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַחְלִיט",
    infinitive_plain: "להחליט",
    transcription_ru: "леhахл и т",
    translation_ru: "решать; принимать решение",
    root: "ח-ל-ט",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%97%D7%9C%D7%99%D7%98",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0058",
    frequencyRank: 58,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִשְׁתַּמֵּשׁ",
    infinitive_plain: "להשתמש",
    transcription_ru: "леhиштам е ш",
    translation_ru: "пользоваться; использовать",
    root: "שׁ-מ-שׁ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A9%D7%AA%D7%9E%D7%A9",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0059",
    frequencyRank: 59,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִנְסוֹעַ",
    infinitive_plain: "לנסוע",
    transcription_ru: "линс о а",
    translation_ru: "ехать; ездить",
    root: "נ-ס-ע",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A0%D7%A1%D7%95%D7%A2",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0060",
    frequencyRank: 60,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַסְבִּיר",
    infinitive_plain: "להסביר",
    transcription_ru: "леhасб и р",
    translation_ru: "объяснять",
    root: "ס-ב-ר",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A1%D7%91%D7%99%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0061",
    frequencyRank: 61,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַרְאוֹת",
    infinitive_plain: "להראות",
    transcription_ru: "леhаръ о т",
    translation_ru: "показывать",
    root: "ר-א-ה",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A8%D7%90%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0062",
    frequencyRank: 62,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִישׁוֹן",
    infinitive_plain: "לישון",
    transcription_ru: "лиш о н",
    translation_ru: "спать",
    root: "י-שׁ-נ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%99%D7%A9%D7%95%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0063",
    frequencyRank: 63,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהוֹצִיא",
    infinitive_plain: "להוציא",
    transcription_ru: "леhоц и",
    translation_ru: "вынимать; выводить; доставать",
    root: "י-צ-א",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%95%D7%A6%D7%99%D7%90",
    verificationStatus: "needs_full_conjugation_entry"
  },
];

export const findBatch003DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_003_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch003SourceRegistry = (): void => {
  const duplicates = findBatch003DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 003: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_003_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 003");
  }

  const sorted = PEALIM_VERIFIED_BATCH_003_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 003 must stay sorted by frequencyRank ascending");
  }
};
