// Pealim verified verb batch 009 source registry.
//
// Batch 009 continues the 700-verb dataset after batch 008.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 164-183
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

export const PEALIM_VERIFIED_BATCH_009_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0164",
    frequencyRank: 164,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְלַמֵּד",
    infinitive_plain: "ללמד",
    transcription_ru: "лелам е д",
    translation_ru: "учить; преподавать",
    root: "ל-מ-ד",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%9C%D7%9E%D7%93",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0165",
    frequencyRank: 165,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְתַרְגֵּם",
    infinitive_plain: "לתרגם",
    transcription_ru: "летарг е м",
    translation_ru: "переводить",
    root: "ת-ר-ג-מ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%AA%D7%A8%D7%92%D7%9D",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Quadriliteral root; common for school and apps."
  },
  {
    id: "pv-0166",
    frequencyRank: 166,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְתַרְגֵּל",
    infinitive_plain: "לתרגל",
    transcription_ru: "летарг е ль",
    translation_ru: "практиковать; упражняться",
    root: "ת-ר-ג-ל",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%AA%D7%A8%D7%92%D7%9C",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Quadriliteral root; useful in learning context."
  },
  {
    id: "pv-0167",
    frequencyRank: 167,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַקְלִיט",
    infinitive_plain: "להקליט",
    transcription_ru: "леhакл и т",
    translation_ru: "записывать аудио/видео",
    root: "ק-ל-ט",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A7%D7%9C%D7%99%D7%98",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0168",
    frequencyRank: 168,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַקְשׁוֹת",
    infinitive_plain: "להקשות",
    transcription_ru: "леhакш о т",
    translation_ru: "затруднять; усложнять",
    root: "ק-שׁ-ה",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A7%D7%A9%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0169",
    frequencyRank: 169,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהָקֵל",
    infinitive_plain: "להקל",
    transcription_ru: "леhак е ль",
    translation_ru: "облегчать; смягчать",
    root: "ק-ל-ל",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A7%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0170",
    frequencyRank: 170,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַשְׁווֹת",
    infinitive_plain: "להשוות",
    transcription_ru: "леhашв о т",
    translation_ru: "сравнивать; уравнивать",
    root: "שׁ-ו-ה",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A9%D7%95%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0171",
    frequencyRank: 171,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַשְׁווֹיץ",
    infinitive_plain: "להשוויץ",
    transcription_ru: "леhашв и ц",
    translation_ru: "хвастаться",
    root: "שׁ-ו-ו-צ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A9%D7%95%D7%95%D7%99%D7%A5",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Colloquial useful verb; expanded root spelling kept explicit."
  },
  {
    id: "pv-0172",
    frequencyRank: 172,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַמְלִיץ",
    infinitive_plain: "להמליץ",
    transcription_ru: "леhамл и ц",
    translation_ru: "рекомендовать",
    root: "מ-ל-צ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%9E%D7%9C%D7%99%D7%A5",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0173",
    frequencyRank: 173,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַצִּיעַ",
    infinitive_plain: "להציע",
    transcription_ru: "леhац и а",
    translation_ru: "предлагать",
    root: "י-צ-ע",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A6%D7%99%D7%A2",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0174",
    frequencyRank: 174,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהוֹדִיעַ",
    infinitive_plain: "להודיע",
    transcription_ru: "леhод и а",
    translation_ru: "сообщать; уведомлять",
    root: "י-ד-ע",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%95%D7%93%D7%99%D7%A2",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0175",
    frequencyRank: 175,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַחֲזִיר",
    infinitive_plain: "להחזיר",
    transcription_ru: "леhахаз и р",
    translation_ru: "возвращать; отдавать обратно",
    root: "ח-ז-ר",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%97%D7%96%D7%99%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0176",
    frequencyRank: 176,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַעֲבִיר",
    infinitive_plain: "להעביר",
    transcription_ru: "леhаав и р",
    translation_ru: "передавать; переводить; переносить",
    root: "ע-ב-ר",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A2%D7%91%D7%99%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0177",
    frequencyRank: 177,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְנַהֵג",
    infinitive_plain: "להתנהג",
    transcription_ru: "леhитнаh е г",
    translation_ru: "вести себя",
    root: "נ-ה-ג",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A0%D7%94%D7%92",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0178",
    frequencyRank: 178,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַפְרִיעַ",
    infinitive_plain: "להפריע",
    transcription_ru: "леhафр и а",
    translation_ru: "мешать; беспокоить",
    root: "פ-ר-ע",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A4%D7%A8%D7%99%D7%A2",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0179",
    frequencyRank: 179,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְוַוכֵּחַ",
    infinitive_plain: "להתווכח",
    transcription_ru: "леhитвак е ах",
    translation_ru: "спорить; препираться",
    root: "ו-כ-ח",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%95%D7%95%D7%9B%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0180",
    frequencyRank: 180,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְנַצֵּל",
    infinitive_plain: "להתנצל",
    transcription_ru: "леhитнац е ль",
    translation_ru: "извиняться",
    root: "נ-צ-ל",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A0%D7%A6%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0181",
    frequencyRank: 181,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַתְאִים",
    infinitive_plain: "להתאים",
    transcription_ru: "леhатъ и м",
    translation_ru: "подходить; соответствовать",
    root: "ת-א-מ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%90%D7%99%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0182",
    frequencyRank: 182,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַשְׁפִּיעַ",
    infinitive_plain: "להשפיע",
    transcription_ru: "леhашп и а",
    translation_ru: "влиять",
    root: "שׁ-פ-ע",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A9%D7%A4%D7%99%D7%A2",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0183",
    frequencyRank: 183,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַרְשׁוֹת",
    infinitive_plain: "להרשות",
    transcription_ru: "леhарш о т",
    translation_ru: "разрешать; позволять",
    root: "ר-שׁ-ה",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A8%D7%A9%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
];

export const findBatch009DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_009_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch009SourceRegistry = (): void => {
  const duplicates = findBatch009DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 009: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_009_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 009");
  }

  const sorted = PEALIM_VERIFIED_BATCH_009_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 009 must stay sorted by frequencyRank ascending");
  }
};
