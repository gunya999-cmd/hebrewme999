// Pealim verified verb batch 016 source registry.
//
// Batch 016 continues the 700-verb dataset after batch 015.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 304-323
// - useful app/management/task/discussion/document verbs
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

export const PEALIM_VERIFIED_BATCH_016_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0304",
    frequencyRank: 304,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִסְתַּיֵּם",
    infinitive_plain: "להסתיים",
    transcription_ru: "леhистай е м",
    translation_ru: "заканчиваться; завершаться",
    root: "ס-י-מ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A1%D7%AA%D7%99%D7%99%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0305",
    frequencyRank: 305,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַתְקִין",
    infinitive_plain: "להתקין",
    transcription_ru: "леhатк и н",
    translation_ru: "устанавливать; монтировать",
    root: "ת-ק-נ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A7%D7%99%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0306",
    frequencyRank: 306,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְעַדְכֵּן",
    infinitive_plain: "לעדכן",
    transcription_ru: "леадк е н",
    translation_ru: "обновлять; сообщать актуальную информацию",
    root: "ע-ד-כ-נ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A2%D7%93%D7%9B%D7%9F",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0307",
    frequencyRank: 307,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְעַדְכֵּן",
    infinitive_plain: "להתעדכן",
    transcription_ru: "леhитадк е н",
    translation_ru: "обновляться; быть в курсе",
    root: "ע-ד-כ-נ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A2%D7%93%D7%9B%D7%9F",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0308",
    frequencyRank: 308,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְשַׁדְרֵג",
    infinitive_plain: "לשדרג",
    transcription_ru: "лешадр е г",
    translation_ru: "улучшать; апгрейдить",
    root: "שׁ-ד-ר-ג",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%93%D7%A8%D7%92",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Modern/quadriliteral root."
  },
  {
    id: "pv-0309",
    frequencyRank: 309,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְעַצֵּב",
    infinitive_plain: "לעצב",
    transcription_ru: "леац е в",
    translation_ru: "дизайнить; оформлять; формировать",
    root: "ע-צ-ב",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A2%D7%A6%D7%91",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0310",
    frequencyRank: 310,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְנַהֵל",
    infinitive_plain: "לנהל",
    transcription_ru: "ленаh е ль",
    translation_ru: "управлять; вести; менеджерить",
    root: "נ-ה-ל",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A0%D7%94%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0311",
    frequencyRank: 311,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְנַהֵל",
    infinitive_plain: "להתנהל",
    transcription_ru: "леhитнаh е ль",
    translation_ru: "вести себя; функционировать; управляться",
    root: "נ-ה-ל",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A0%D7%94%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0312",
    frequencyRank: 312,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהָקִים",
    infinitive_plain: "להקים",
    transcription_ru: "леhак и м",
    translation_ru: "создавать; основывать; поднимать",
    root: "ק-ו-מ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A7%D7%99%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0313",
    frequencyRank: 313,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְקַיֵּם",
    infinitive_plain: "לקיים",
    transcription_ru: "лекай е м",
    translation_ru: "проводить; поддерживать; выполнять",
    root: "ק-י-מ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A7%D7%99%D7%99%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0314",
    frequencyRank: 314,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַגְדִּיר",
    infinitive_plain: "להגדיר",
    transcription_ru: "леhагд и р",
    translation_ru: "определять; задавать настройку",
    root: "ג-ד-ר",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%92%D7%93%D7%99%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0315",
    frequencyRank: 315,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְפָרֵט",
    infinitive_plain: "לפרט",
    transcription_ru: "лефар е т",
    translation_ru: "детализировать; перечислять",
    root: "פ-ר-ט",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A4%D7%A8%D7%98",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0316",
    frequencyRank: 316,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְסַכֵּם",
    infinitive_plain: "לסכם",
    transcription_ru: "лесак е м",
    translation_ru: "резюмировать; договариваться; подводить итог",
    root: "ס-כ-מ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A1%D7%9B%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0317",
    frequencyRank: 317,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְנַתֵּחַ",
    infinitive_plain: "לנתח",
    transcription_ru: "ленат е ах",
    translation_ru: "анализировать; оперировать хирургически",
    root: "נ-ת-ח",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A0%D7%AA%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0318",
    frequencyRank: 318,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְנַמֵּק",
    infinitive_plain: "לנמק",
    transcription_ru: "ленам е к",
    translation_ru: "обосновывать; аргументировать",
    root: "נ-מ-ק",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A0%D7%9E%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0319",
    frequencyRank: 319,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַסִּיק",
    infinitive_plain: "להסיק",
    transcription_ru: "леhас и к",
    translation_ru: "делать вывод; выводить заключение",
    root: "נ-ס-ק",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A1%D7%99%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0320",
    frequencyRank: 320,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַסְבִּיר",
    infinitive_plain: "להסביר",
    transcription_ru: "леhасб и р",
    translation_ru: "объяснять",
    root: "ס-ב-ר",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A1%D7%91%D7%99%D7%A8",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Duplicate-risk check against prior batches required before merge into final unified dataset."
  },
  {
    id: "pv-0321",
    frequencyRank: 321,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַדְרִיךְ",
    infinitive_plain: "להדריך",
    transcription_ru: "леhадр и х",
    translation_ru: "инструктировать; направлять; проводить экскурсию",
    root: "ד-ר-כ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%93%D7%A8%D7%99%D7%9A",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0322",
    frequencyRank: 322,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְיַעֵץ",
    infinitive_plain: "לייעץ",
    transcription_ru: "лея э ц",
    translation_ru: "советовать; консультировать",
    root: "י-ע-צ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%99%D7%99%D7%A2%D7%A5",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0323",
    frequencyRank: 323,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְיַעֵץ",
    infinitive_plain: "להתייעץ",
    transcription_ru: "леhитя э ц",
    translation_ru: "советоваться; консультироваться",
    root: "י-ע-צ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%99%D7%99%D7%A2%D7%A5",
    verificationStatus: "needs_full_conjugation_entry"
  }
];

export const findBatch016DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_016_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch016SourceRegistry = (): void => {
  const duplicates = findBatch016DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 016: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_016_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 016");
  }

  const sorted = PEALIM_VERIFIED_BATCH_016_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 016 must stay sorted by frequencyRank ascending");
  }
};
