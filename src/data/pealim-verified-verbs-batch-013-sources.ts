// Pealim verified verb batch 013 source registry.
//
// Batch 013 continues the 700-verb dataset after batch 012.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 244-263
// - useful movement/state/app/registration/communication/development verbs
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

export const PEALIM_VERIFIED_BATCH_013_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0244",
    frequencyRank: 244,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְרַחֵק",
    infinitive_plain: "להתרחק",
    transcription_ru: "леhитрах е к",
    translation_ru: "отдаляться; держаться подальше",
    root: "ר-ח-ק",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A8%D7%97%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0245",
    frequencyRank: 245,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְקָרֵב",
    infinitive_plain: "לקרב",
    transcription_ru: "лекар е в",
    translation_ru: "приближать; сближать",
    root: "ק-ר-ב",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A7%D7%A8%D7%91",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0246",
    frequencyRank: 246,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְקָרֵר",
    infinitive_plain: "להתקרר",
    transcription_ru: "леhиткар е р",
    translation_ru: "остывать; простужаться",
    root: "ק-ר-ר",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A7%D7%A8%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0247",
    frequencyRank: 247,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְחַמֵּם",
    infinitive_plain: "לחמם",
    transcription_ru: "лехам е м",
    translation_ru: "греть; нагревать",
    root: "ח-מ-מ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%9E%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0248",
    frequencyRank: 248,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְחַמֵּם",
    infinitive_plain: "להתחמם",
    transcription_ru: "леhитхам е м",
    translation_ru: "согреваться; разогреваться",
    root: "ח-מ-מ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%97%D7%9E%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0249",
    frequencyRank: 249,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְחַזֵּק",
    infinitive_plain: "לחזק",
    transcription_ru: "лехаз е к",
    translation_ru: "укреплять; усиливать",
    root: "ח-ז-ק",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%96%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0250",
    frequencyRank: 250,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְחַזֵּק",
    infinitive_plain: "להתחזק",
    transcription_ru: "леhитхаз е к",
    translation_ru: "укрепляться; становиться сильнее",
    root: "ח-ז-ק",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%97%D7%96%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0251",
    frequencyRank: 251,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהֵיחָלֵשׁ",
    infinitive_plain: "להיחלש",
    transcription_ru: "леhехал е ш",
    translation_ru: "слабеть; ослабевать",
    root: "ח-ל-שׁ",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%97%D7%9C%D7%A9",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0252",
    frequencyRank: 252,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהֵיפָתַח",
    infinitive_plain: "להיפתח",
    transcription_ru: "леhипат а х",
    translation_ru: "открываться",
    root: "פ-ת-ח",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%A4%D7%AA%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0253",
    frequencyRank: 253,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִיסָּגֵר",
    infinitive_plain: "להיסגר",
    transcription_ru: "леhисаг е р",
    translation_ru: "закрываться",
    root: "ס-ג-ר",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%A1%D7%92%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0254",
    frequencyRank: 254,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִישָּׁבֵר",
    infinitive_plain: "להישבר",
    transcription_ru: "леhишав е р",
    translation_ru: "ломаться; разбиваться",
    root: "שׁ-ב-ר",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%A9%D7%91%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0255",
    frequencyRank: 255,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִיבָּנוֹת",
    infinitive_plain: "להיבנות",
    transcription_ru: "леhибан о т",
    translation_ru: "строиться; быть построенным",
    root: "ב-נ-ה",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%91%D7%A0%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0256",
    frequencyRank: 256,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהוֹפִיעַ",
    infinitive_plain: "להופיע",
    transcription_ru: "леhоф и а",
    translation_ru: "появляться; выступать",
    root: "י-פ-ע",
    binyan: "הופעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%95%D7%A4%D7%99%D7%A2",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Check exact Pealim binyan/root display before full conjugation entry; common infinitive is להופיע."
  },
  {
    id: "pv-0257",
    frequencyRank: 257,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהֵיעָלֵם",
    infinitive_plain: "להיעלם",
    transcription_ru: "леhеал е м",
    translation_ru: "исчезать; пропадать",
    root: "ע-ל-מ",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%A2%D7%9C%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0258",
    frequencyRank: 258,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְקַבֵּל",
    infinitive_plain: "להתקבל",
    transcription_ru: "леhиткаб е ль",
    translation_ru: "быть принятым; поступать; приниматься",
    root: "ק-ב-ל",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A7%D7%91%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0259",
    frequencyRank: 259,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְשַׁחְרֵר",
    infinitive_plain: "לשחרר",
    transcription_ru: "лешахр е р",
    translation_ru: "освобождать; выпускать; отпускать",
    root: "שׁ-ח-ר-ר",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%97%D7%A8%D7%A8",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0260",
    frequencyRank: 260,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִשְׁתַּחְרֵר",
    infinitive_plain: "להשתחרר",
    transcription_ru: "леhиштахр е р",
    translation_ru: "освобождаться; выписываться; увольняться",
    root: "שׁ-ח-ר-ר",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A9%D7%AA%D7%97%D7%A8%D7%A8",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0261",
    frequencyRank: 261,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהָגִיב",
    infinitive_plain: "להגיב",
    transcription_ru: "леhаг и в",
    translation_ru: "реагировать; отвечать комментарием",
    root: "ג-ו-ב",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%92%D7%99%D7%91",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0262",
    frequencyRank: 262,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהֵירָשֵׁם",
    infinitive_plain: "להירשם",
    transcription_ru: "леhераш е м",
    translation_ru: "регистрироваться; записываться",
    root: "ר-שׁ-מ",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%A8%D7%A9%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0263",
    frequencyRank: 263,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִרְשׁוֹם",
    infinitive_plain: "לרשום",
    transcription_ru: "лирш о м",
    translation_ru: "записывать; регистрировать",
    root: "ר-שׁ-מ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A8%D7%A9%D7%95%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  }
];

export const findBatch013DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_013_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch013SourceRegistry = (): void => {
  const duplicates = findBatch013DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 013: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_013_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 013");
  }

  const sorted = PEALIM_VERIFIED_BATCH_013_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 013 must stay sorted by frequencyRank ascending");
  }
};
