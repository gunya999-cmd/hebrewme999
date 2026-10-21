// Pealim verified verb batch 015 source registry.
//
// Batch 015 continues the 700-verb dataset after batch 014.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 284-303
// - useful creation/development/argumentation/organization/support verbs
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

export const PEALIM_VERIFIED_BATCH_015_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0284",
    frequencyRank: 284,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִיצוֹר",
    infinitive_plain: "ליצור",
    transcription_ru: "лиц о р",
    translation_ru: "создавать; творить; связываться",
    root: "י-צ-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%99%D7%A6%D7%95%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0285",
    frequencyRank: 285,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְיַצֵּר",
    infinitive_plain: "לייצר",
    transcription_ru: "лейац е р",
    translation_ru: "производить; создавать",
    root: "י-צ-ר",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%99%D7%99%D7%A6%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0286",
    frequencyRank: 286,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְפַתֵּחַ",
    infinitive_plain: "לפתח",
    transcription_ru: "лефат е ах",
    translation_ru: "развивать; разрабатывать",
    root: "פ-ת-ח",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A4%D7%AA%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0287",
    frequencyRank: 287,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְפַּתֵּחַ",
    infinitive_plain: "להתפתח",
    transcription_ru: "леhитпат е ах",
    translation_ru: "развиваться",
    root: "פ-ת-ח",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A4%D7%AA%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0288",
    frequencyRank: 288,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְאַפְשֵׁר",
    infinitive_plain: "לאפשר",
    transcription_ru: "леафш е р",
    translation_ru: "позволять; давать возможность",
    root: "א-פ-שׁ-ר",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%90%D7%A4%D7%A9%D7%A8",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0289",
    frequencyRank: 289,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִמְנוֹעַ",
    infinitive_plain: "למנוע",
    transcription_ru: "лимн о а",
    translation_ru: "предотвращать; мешать",
    root: "מ-נ-ע",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%9E%D7%A0%D7%95%D7%A2",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0290",
    frequencyRank: 290,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִגְרוֹם",
    infinitive_plain: "לגרום",
    transcription_ru: "лигр о м",
    translation_ru: "вызывать; становиться причиной",
    root: "ג-ר-מ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%92%D7%A8%D7%95%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0291",
    frequencyRank: 291,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְרַחֵשׁ",
    infinitive_plain: "להתרחש",
    transcription_ru: "леhитрах е ш",
    translation_ru: "происходить; случаться",
    root: "ר-ח-שׁ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A8%D7%97%D7%A9",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0292",
    frequencyRank: 292,
    tier: "top_conversational_350",
    infinitive_hebrew: "לֶאֱסוֹף",
    infinitive_plain: "לאסוף",
    transcription_ru: "леэс о ф",
    translation_ru: "собирать; забирать",
    root: "א-ס-פ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%90%D7%A1%D7%95%D7%A3",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0293",
    frequencyRank: 293,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְאַרְגֵּן",
    infinitive_plain: "לארגן",
    transcription_ru: "леарг е н",
    translation_ru: "организовывать",
    root: "א-ר-ג-נ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%90%D7%A8%D7%92%D7%9F",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0294",
    frequencyRank: 294,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְאַרְגֵּן",
    infinitive_plain: "להתארגן",
    transcription_ru: "леhитарг е н",
    translation_ru: "организовываться; собираться; готовиться",
    root: "א-ר-ג-נ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%90%D7%A8%D7%92%D7%9F",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0295",
    frequencyRank: 295,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִדְחוֹת",
    infinitive_plain: "לדחות",
    transcription_ru: "лидх о т",
    translation_ru: "откладывать; отвергать",
    root: "ד-ח-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%93%D7%97%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0296",
    frequencyRank: 296,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִתְמוֹךְ",
    infinitive_plain: "לתמוך",
    transcription_ru: "литм о х",
    translation_ru: "поддерживать",
    root: "ת-מ-ך",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%AA%D7%9E%D7%95%D7%9A",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0297",
    frequencyRank: 297,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְנַגֵּד",
    infinitive_plain: "להתנגד",
    transcription_ru: "леhитнаг е д",
    translation_ru: "возражать; противиться",
    root: "נ-ג-ד",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A0%D7%92%D7%93",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0298",
    frequencyRank: 298,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהוֹכִיחַ",
    infinitive_plain: "להוכיח",
    transcription_ru: "леhох и ах",
    translation_ru: "доказывать; упрекать",
    root: "י-כ-ח",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%95%D7%9B%D7%99%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0299",
    frequencyRank: 299,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַחֲקוֹר",
    infinitive_plain: "לחקור",
    transcription_ru: "лахак о р",
    translation_ru: "исследовать; расследовать",
    root: "ח-ק-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%A7%D7%95%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0300",
    frequencyRank: 300,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִטְעוֹן",
    infinitive_plain: "לטעון",
    transcription_ru: "литъ о н",
    translation_ru: "утверждать; загружать; заряжать",
    root: "ט-ע-נ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%98%D7%A2%D7%95%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0301",
    frequencyRank: 301,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְחַיֵּב",
    infinitive_plain: "לחייב",
    transcription_ru: "лехай е в",
    translation_ru: "обязывать; списывать деньги; заряжать",
    root: "ח-י-ב",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%99%D7%99%D7%91",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0302",
    frequencyRank: 302,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִסְתַּמֵּךְ",
    infinitive_plain: "להסתמך",
    transcription_ru: "леhистам е х",
    translation_ru: "полагаться; опираться на",
    root: "ס-מ-ך",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A1%D7%AA%D7%9E%D7%9A",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0303",
    frequencyRank: 303,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִסְמוֹךְ",
    infinitive_plain: "לסמוך",
    transcription_ru: "лисמ о х",
    translation_ru: "полагаться; доверять",
    root: "ס-מ-ך",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A1%D7%9E%D7%95%D7%9A",
    verificationStatus: "needs_full_conjugation_entry"
  }
];

export const findBatch015DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_015_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch015SourceRegistry = (): void => {
  const duplicates = findBatch015DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 015: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_015_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 015");
  }

  const sorted = PEALIM_VERIFIED_BATCH_015_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 015 must stay sorted by frequencyRank ascending");
  }
};
