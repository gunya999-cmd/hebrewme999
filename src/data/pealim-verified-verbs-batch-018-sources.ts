// Pealim verified verb batch 018 source registry.
//
// Batch 018 completes the first 350 top-conversational verb source entries.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 344-350
// - useful final top-conversational verbs
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

export const PEALIM_VERIFIED_BATCH_018_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0344",
    frequencyRank: 344,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְרַגֵּשׁ",
    infinitive_plain: "להתרגש",
    transcription_ru: "леhитраг е ш",
    translation_ru: "волноваться; испытывать эмоции",
    root: "ר-ג-שׁ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A8%D7%92%D7%A9",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0345",
    frequencyRank: 345,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְרַגֵּשׁ",
    infinitive_plain: "לרגש",
    transcription_ru: "лераг е ш",
    translation_ru: "волновать; трогать эмоционально",
    root: "ר-ג-שׁ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A8%D7%92%D7%A9",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0346",
    frequencyRank: 346,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְאַכְזֵב",
    infinitive_plain: "להתאכזב",
    transcription_ru: "леhитахз е в",
    translation_ru: "разочаровываться",
    root: "א-כ-ז-ב",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%90%D7%9B%D7%96%D7%91",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0347",
    frequencyRank: 347,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְאַכְזֵב",
    infinitive_plain: "לאכזב",
    transcription_ru: "леахз е в",
    translation_ru: "разочаровывать",
    root: "א-כ-ז-ב",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%90%D7%9B%D7%96%D7%91",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0348",
    frequencyRank: 348,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְקַנֵּא",
    infinitive_plain: "לקנא",
    transcription_ru: "лекан е",
    translation_ru: "завидовать; ревновать",
    root: "ק-נ-א",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A7%D7%A0%D7%90",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0349",
    frequencyRank: 349,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְבַּיֵּשׁ",
    infinitive_plain: "להתבייש",
    transcription_ru: "леhитбай е ш",
    translation_ru: "стесняться; стыдиться",
    root: "ב-ו-שׁ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%91%D7%99%D7%99%D7%A9",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0350",
    frequencyRank: 350,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְבַיֵּשׁ",
    infinitive_plain: "לבייש",
    transcription_ru: "левай е ш",
    translation_ru: "стыдить; смущать",
    root: "ב-ו-שׁ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%91%D7%99%D7%99%D7%A9",
    verificationStatus: "needs_full_conjugation_entry"
  }
];

export const findBatch018DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_018_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch018SourceRegistry = (): void => {
  const duplicates = findBatch018DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 018: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_018_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 018");
  }

  const sorted = PEALIM_VERIFIED_BATCH_018_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 018 must stay sorted by frequencyRank ascending");
  }
};
