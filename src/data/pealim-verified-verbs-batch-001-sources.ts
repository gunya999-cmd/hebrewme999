// Pealim verified verb batch 001 source registry.
//
// Purpose:
// - Keep the next 20 verbs sorted by spoken usefulness.
// - Store Pealim source pages before adding full conjugation payloads.
// - Prevent duplicate infinitives before generating/importing app-ready data.
//
// This file is intentionally separate from the live app dictionary.

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
  verificationStatus: "source_verified" | "full_conjugation_entered";
  notes?: string;
};

export const PEALIM_VERIFIED_BATCH_001_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0004",
    frequencyRank: 4,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָלֶכֶת",
    infinitive_plain: "ללכת",
    transcription_ru: "лал е хет",
    translation_ru: "идти",
    root: "ה-ל-ך",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/dict/7-lalechet/",
    verificationStatus: "source_verified",
    notes: "Pealim: verb paal, root ה-ל-ך, translation идти. Full table opened and checked before adding to this batch.",
  },
  {
    id: "pv-0005",
    frequencyRank: 5,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָבוֹא",
    infinitive_plain: "לבוא",
    transcription_ru: "лав о",
    translation_ru: "приходить; приезжать",
    root: "ב-ו-א",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%91%D7%95%D7%90",
    verificationStatus: "source_verified",
    notes: "Search page to be replaced with exact full-conjugation page after URL-safe open succeeds.",
  },
  {
    id: "pv-0006",
    frequencyRank: 6,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִרְאוֹת",
    infinitive_plain: "לראות",
    transcription_ru: "лиръ о т",
    translation_ru: "видеть",
    root: "ר-א-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/dict/1972-lirot/",
    verificationStatus: "source_verified",
    notes: "Pealim: verb paal, root ר-א-ה, translation видеть. Full table opened and checked before adding to this batch.",
  },
  {
    id: "pv-0007",
    frequencyRank: 7,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִשְׁמוֹעַ",
    infinitive_plain: "לשמוע",
    transcription_ru: "лишм о а",
    translation_ru: "слышать; слушать",
    root: "ש-מ-ע",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/dict/2250-lishmoa/",
    verificationStatus: "source_verified",
    notes: "Pealim: verb paal, root ש-מ-ע, translation слышать; слушать. Full table opened and checked before adding to this batch.",
  },
  {
    id: "pv-0008",
    frequencyRank: 8,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָדַעַת",
    infinitive_plain: "לדעת",
    transcription_ru: "лад а ат",
    translation_ru: "знать",
    root: "י-ד-ע",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%93%D7%A2%D7%AA",
    verificationStatus: "source_verified",
    notes: "Pealim search confirms verb paal, root י-ד-ע, translation знать and infinitive לָדַעַת.",
  },
  {
    id: "pv-0009",
    frequencyRank: 9,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִרְצוֹת",
    infinitive_plain: "לרצות",
    transcription_ru: "лирц о т",
    translation_ru: "хотеть",
    root: "ר-צ-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A8%D7%A6%D7%95%D7%AA",
    verificationStatus: "source_verified",
    notes: "Pealim search has two homographs; this entry is paal לִרְצוֹת = хотеть, not pi'el לְרַצּוֹת.",
  },
  {
    id: "pv-0010",
    frequencyRank: 10,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָתֵת",
    infinitive_plain: "לתת",
    transcription_ru: "лат е т",
    translation_ru: "давать; позволять",
    root: "נ-ת-ן",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%AA%D7%AA",
    verificationStatus: "source_verified",
    notes: "Pealim search confirms verb paal, root נ-ת-ן, translation давать; позволять and infinitive לָתֵת.",
  },
  {
    id: "pv-0011",
    frequencyRank: 11,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָקַחַת",
    infinitive_plain: "לקחת",
    transcription_ru: "лак а хат",
    translation_ru: "брать; взять",
    root: "ל-ק-ח",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A7%D7%97%D7%AA",
    verificationStatus: "source_verified"
  },
  {
    id: "pv-0012",
    frequencyRank: 12,
    tier: "top_conversational_350",
    infinitive_hebrew: "לֶאֱכוֹל",
    infinitive_plain: "לאכול",
    transcription_ru: "леэх о ль",
    translation_ru: "есть",
    root: "א-כ-ל",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%90%D7%9B%D7%95%D7%9C",
    verificationStatus: "source_verified"
  },
  {
    id: "pv-0013",
    frequencyRank: 13,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִשְׁתּוֹת",
    infinitive_plain: "לשתות",
    transcription_ru: "лишт о т",
    translation_ru: "пить",
    root: "ש-ת-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%AA%D7%95%D7%AA",
    verificationStatus: "source_verified"
  },
  {
    id: "pv-0014",
    frequencyRank: 14,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִקְרוֹא",
    infinitive_plain: "לקרוא",
    transcription_ru: "ликр о",
    translation_ru: "читать; звать",
    root: "ק-ר-א",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A7%D7%A8%D7%95%D7%90",
    verificationStatus: "source_verified"
  },
  {
    id: "pv-0015",
    frequencyRank: 15,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִלְמוֹד",
    infinitive_plain: "ללמוד",
    transcription_ru: "лильм о д",
    translation_ru: "учиться; изучать",
    root: "ל-מ-ד",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%9C%D7%9E%D7%95%D7%93",
    verificationStatus: "source_verified"
  },
  {
    id: "pv-0016",
    frequencyRank: 16,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהָבִין",
    infinitive_plain: "להבין",
    transcription_ru: "леhав и н",
    translation_ru: "понимать",
    root: "ב-י-ן",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%91%D7%99%D7%9F",
    verificationStatus: "source_verified"
  },
  {
    id: "pv-0017",
    frequencyRank: 17,
    tier: "top_conversational_350",
    infinitive_hebrew: "לֶאֱהוֹב",
    infinitive_plain: "לאהוב",
    transcription_ru: "леэh о в",
    translation_ru: "любить",
    root: "א-ה-ב",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%90%D7%94%D7%95%D7%91",
    verificationStatus: "source_verified"
  },
  {
    id: "pv-0018",
    frequencyRank: 18,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַעֲבוֹד",
    infinitive_plain: "לעבוד",
    transcription_ru: "лаав о д",
    translation_ru: "работать",
    root: "ע-ב-ד",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A2%D7%91%D7%95%D7%93",
    verificationStatus: "source_verified"
  },
  {
    id: "pv-0019",
    frequencyRank: 19,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַחֲשׁוֹב",
    infinitive_plain: "לחשוב",
    transcription_ru: "лахаш о в",
    translation_ru: "думать; считать",
    root: "ח-ש-ב",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%A9%D7%95%D7%91",
    verificationStatus: "source_verified"
  },
  {
    id: "pv-0020",
    frequencyRank: 20,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִשְׁאוֹל",
    infinitive_plain: "לשאול",
    transcription_ru: "лишъ о ль",
    translation_ru: "спрашивать",
    root: "ש-א-ל",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%90%D7%95%D7%9C",
    verificationStatus: "source_verified"
  },
  {
    id: "pv-0021",
    frequencyRank: 21,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַעֲנוֹת",
    infinitive_plain: "לענות",
    transcription_ru: "лаан о т",
    translation_ru: "отвечать",
    root: "ע-נ-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A2%D7%A0%D7%95%D7%AA",
    verificationStatus: "source_verified"
  },
  {
    id: "pv-0022",
    frequencyRank: 22,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָשֶׁבֶת",
    infinitive_plain: "לשבת",
    transcription_ru: "лаш е вет",
    translation_ru: "сидеть",
    root: "י-ש-ב",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%91%D7%AA",
    verificationStatus: "source_verified"
  },
  {
    id: "pv-0023",
    frequencyRank: 23,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָשִׂים",
    infinitive_plain: "לשים",
    transcription_ru: "лас и м",
    translation_ru: "класть; ставить",
    root: "ש-י-ם",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%99%D7%9D",
    verificationStatus: "source_verified"
  },
];

export const findBatch001DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_001_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch001SourceRegistry = (): void => {
  const duplicates = findBatch001DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 001: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_001_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 001");
  }

  const sorted = PEALIM_VERIFIED_BATCH_001_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 001 must stay sorted by frequencyRank ascending");
  }
};
