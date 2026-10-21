// Pealim verified verb batch 012 source registry.
//
// Batch 012 continues the 700-verb dataset after batch 011.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 224-243
// - useful school/family/health/communication/reading verbs
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

export const PEALIM_VERIFIED_BATCH_012_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0224",
    frequencyRank: 224,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִיפָּגַע",
    infinitive_plain: "להיפגע",
    transcription_ru: "леhипаг а",
    translation_ru: "получать травму; быть задетым; пострадать",
    root: "פ-ג-ע",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%A4%D7%92%D7%A2",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0225",
    frequencyRank: 225,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִפְגּוֹעַ",
    infinitive_plain: "לפגוע",
    transcription_ru: "лифг о а",
    translation_ru: "задевать; вредить; попадать в цель",
    root: "פ-ג-ע",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A4%D7%92%D7%95%D7%A2",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0226",
    frequencyRank: 226,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְרַפֵּא",
    infinitive_plain: "לרפא",
    transcription_ru: "лерап е",
    translation_ru: "лечить; исцелять",
    root: "ר-פ-א",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A8%D7%A4%D7%90",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0227",
    frequencyRank: 227,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַחְלִים",
    infinitive_plain: "להחלים",
    transcription_ru: "леhахл и м",
    translation_ru: "выздоравливать; поправляться",
    root: "ח-ל-מ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%97%D7%9C%D7%99%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0228",
    frequencyRank: 228,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְאַבְחֵן",
    infinitive_plain: "לאבחן",
    transcription_ru: "леавх е н",
    translation_ru: "диагностировать; различать",
    root: "א-ב-ח-נ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%90%D7%91%D7%97%D7%9F",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0229",
    frequencyRank: 229,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִטְעוֹת",
    infinitive_plain: "לטעות",
    transcription_ru: "литъ о т",
    translation_ru: "ошибаться",
    root: "ט-ע-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%98%D7%A2%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0230",
    frequencyRank: 230,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְשַׁכְנֵעַ",
    infinitive_plain: "לשכנע",
    transcription_ru: "лешахн е а",
    translation_ru: "убеждать",
    root: "שׁ-כ-נ-ע",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%9B%D7%A0%D7%A2",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0231",
    frequencyRank: 231,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִשְׁתַּכְנֵעַ",
    infinitive_plain: "להשתכנע",
    transcription_ru: "леhиштахн е а",
    translation_ru: "убеждаться; быть убеждённым",
    root: "שׁ-כ-נ-ע",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A9%D7%AA%D7%9B%D7%A0%D7%A2",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Expanded root spelling kept explicit for later manual conjugation verification."
  },
  {
    id: "pv-0232",
    frequencyRank: 232,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהוֹדוֹת",
    infinitive_plain: "להודות",
    transcription_ru: "леhод о т",
    translation_ru: "благодарить; признавать",
    root: "י-ד-ה",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%95%D7%93%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0233",
    frequencyRank: 233,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַעֲרִיךְ",
    infinitive_plain: "להעריך",
    transcription_ru: "леhаар и х",
    translation_ru: "оценивать; ценить",
    root: "ע-ר-כ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A2%D7%A8%D7%99%D7%9A",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0234",
    frequencyRank: 234,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְכַּוֵּן",
    infinitive_plain: "להתכוון",
    transcription_ru: "леhиткав е н",
    translation_ru: "намереваться; иметь в виду",
    root: "כ-ו-נ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%9B%D7%95%D7%95%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0235",
    frequencyRank: 235,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְכַוֵּן",
    infinitive_plain: "לכוון",
    transcription_ru: "лекав е н",
    translation_ru: "направлять; настраивать; целиться",
    root: "כ-ו-נ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%9B%D7%95%D7%95%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0236",
    frequencyRank: 236,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְסָרֵב",
    infinitive_plain: "לסרב",
    transcription_ru: "лесар е в",
    translation_ru: "отказываться",
    root: "ס-ר-ב",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A1%D7%A8%D7%91",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0237",
    frequencyRank: 237,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַכְרִיחַ",
    infinitive_plain: "להכריח",
    transcription_ru: "леhахр и ах",
    translation_ru: "заставлять; принуждать",
    root: "כ-ר-ח",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%9B%D7%A8%D7%99%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0238",
    frequencyRank: 238,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַעֲדִיף",
    infinitive_plain: "להעדיף",
    transcription_ru: "леhаад и ф",
    translation_ru: "предпочитать",
    root: "ע-ד-פ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A2%D7%93%D7%99%D7%A3",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0239",
    frequencyRank: 239,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְגַּעְגֵּעַ",
    infinitive_plain: "להתגעגע",
    transcription_ru: "леhитгааг е а",
    translation_ru: "скучать по кому-либо; тосковать",
    root: "ג-ע-ג-ע",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%92%D7%A2%D7%92%D7%A2",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Quadriliteral/expanded root."
  },
  {
    id: "pv-0240",
    frequencyRank: 240,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִסְבּוֹל",
    infinitive_plain: "לסבול",
    transcription_ru: "лисб о ль",
    translation_ru: "страдать; терпеть",
    root: "ס-ב-ל",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A1%D7%91%D7%95%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0241",
    frequencyRank: 241,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְיַחֵס",
    infinitive_plain: "להתייחס",
    transcription_ru: "леhитъях е с",
    translation_ru: "относиться; обращаться с кем-либо; ссылаться",
    root: "י-ח-ס",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%99%D7%99%D7%97%D7%A1",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0242",
    frequencyRank: 242,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְקַיֵּם",
    infinitive_plain: "להתקיים",
    transcription_ru: "леhиткай е м",
    translation_ru: "существовать; состояться; проходить",
    root: "ק-י-מ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A7%D7%99%D7%99%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0243",
    frequencyRank: 243,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְקָרֵב",
    infinitive_plain: "להתקרב",
    transcription_ru: "леhиткар е в",
    translation_ru: "приближаться; сближаться",
    root: "ק-ר-ב",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A7%D7%A8%D7%91",
    verificationStatus: "needs_full_conjugation_entry"
  }
];

export const findBatch012DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_012_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch012SourceRegistry = (): void => {
  const duplicates = findBatch012DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 012: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_012_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 012");
  }

  const sorted = PEALIM_VERIFIED_BATCH_012_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 012 must stay sorted by frequencyRank ascending");
  }
};
