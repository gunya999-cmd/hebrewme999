// Pealim verified verb batch 010 source registry.
//
// Batch 010 continues the 700-verb dataset after batch 009.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 184-203
// - useful school/family/street/app/reading verbs
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

export const PEALIM_VERIFIED_BATCH_010_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0184",
    frequencyRank: 184,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַצְבִּיעַ",
    infinitive_plain: "להצביע",
    transcription_ru: "леhацб и а",
    translation_ru: "указывать; голосовать",
    root: "צ-ב-ע",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A6%D7%91%D7%99%D7%A2",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0185",
    frequencyRank: 185,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַבְטִיחַ",
    infinitive_plain: "להבטיח",
    transcription_ru: "леhавт и ах",
    translation_ru: "обещать; обеспечивать",
    root: "ב-ט-ח",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%91%D7%98%D7%99%D7%97",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0186",
    frequencyRank: 186,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַזְהִיר",
    infinitive_plain: "להזהיר",
    transcription_ru: "леhазh и р",
    translation_ru: "предупреждать",
    root: "ז-ה-ר",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%96%D7%94%D7%99%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0187",
    frequencyRank: 187,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִיזָּהֵר",
    infinitive_plain: "להיזהר",
    transcription_ru: "леhизаh е р",
    translation_ru: "остерегаться; быть осторожным",
    root: "ז-ה-ר",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%96%D7%94%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0188",
    frequencyRank: 188,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְקַל",
    infinitive_plain: "להיתקל",
    transcription_ru: "леhитак е ль",
    translation_ru: "сталкиваться; наталкиваться",
    root: "נ-ת-ק-ל",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%AA%D7%A7%D7%9C",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Check exact Pealim root representation before full conjugation entry; common form is להיתקל."
  },
  {
    id: "pv-0189",
    frequencyRank: 189,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְבַּלְבֵּל",
    infinitive_plain: "להתבלבל",
    transcription_ru: "леhитбалб е ль",
    translation_ru: "путаться; запутываться",
    root: "ב-ל-ב-ל",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%91%D7%9C%D7%91%D7%9C",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Quadriliteral/expanded root."
  },
  {
    id: "pv-0190",
    frequencyRank: 190,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְבַלְבֵּל",
    infinitive_plain: "לבלבל",
    transcription_ru: "левалб е ль",
    translation_ru: "путать; сбивать с толку",
    root: "ב-ל-ב-ל",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%91%D7%9C%D7%91%D7%9C",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Quadriliteral/expanded root."
  },
  {
    id: "pv-0191",
    frequencyRank: 191,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִשְׁתַּנּוֹת",
    infinitive_plain: "להשתנות",
    transcription_ru: "леhиштан о т",
    translation_ru: "меняться; изменяться",
    root: "שׁ-נ-ה",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A9%D7%AA%D7%A0%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0192",
    frequencyRank: 192,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְשַׁנּוֹת",
    infinitive_plain: "לשנות",
    transcription_ru: "лешан о т",
    translation_ru: "менять; изменять",
    root: "שׁ-נ-ה",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%A0%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0193",
    frequencyRank: 193,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְשַׁתֵּף",
    infinitive_plain: "לשתף",
    transcription_ru: "лешат е ф",
    translation_ru: "делиться; участвовать совместно; подключать к общему доступу",
    root: "שׁ-ת-פ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%AA%D7%A3",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0194",
    frequencyRank: 194,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִשְׁתַּתֵּף",
    infinitive_plain: "להשתתף",
    transcription_ru: "леhиштат е ф",
    translation_ru: "участвовать",
    root: "שׁ-ת-פ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A9%D7%AA%D7%AA%D7%A3",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0195",
    frequencyRank: 195,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְשַׁפֵּר",
    infinitive_plain: "לשפר",
    transcription_ru: "лешап е р",
    translation_ru: "улучшать",
    root: "שׁ-פ-ר",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%A4%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0196",
    frequencyRank: 196,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִשְׁתַּפֵּר",
    infinitive_plain: "להשתפר",
    transcription_ru: "леhиштап е р",
    translation_ru: "улучшаться",
    root: "שׁ-פ-ר",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A9%D7%AA%D7%A4%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0197",
    frequencyRank: 197,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַגְדִּיל",
    infinitive_plain: "להגדיל",
    transcription_ru: "леhагд и ль",
    translation_ru: "увеличивать",
    root: "ג-ד-ל",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%92%D7%93%D7%99%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0198",
    frequencyRank: 198,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִגְדּוֹל",
    infinitive_plain: "לגדול",
    transcription_ru: "лигд о ль",
    translation_ru: "расти; вырастать",
    root: "ג-ד-ל",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%92%D7%93%D7%95%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0199",
    frequencyRank: 199,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַקְטִין",
    infinitive_plain: "להקטין",
    transcription_ru: "леhакт и н",
    translation_ru: "уменьшать",
    root: "ק-ט-נ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A7%D7%98%D7%99%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0200",
    frequencyRank: 200,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִקְטוֹן",
    infinitive_plain: "לקטון",
    transcription_ru: "ликт о н",
    translation_ru: "уменьшаться; становиться меньше",
    root: "ק-ט-נ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A7%D7%98%D7%95%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0201",
    frequencyRank: 201,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַרְחִיב",
    infinitive_plain: "להרחיב",
    transcription_ru: "леhарх и в",
    translation_ru: "расширять",
    root: "ר-ח-ב",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A8%D7%97%D7%99%D7%91",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0202",
    frequencyRank: 202,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְצַמְצֵם",
    infinitive_plain: "לצמצם",
    transcription_ru: "лецамц е м",
    translation_ru: "сокращать; сужать",
    root: "צ-מ-צ-מ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A6%D7%9E%D7%A6%D7%9D",
    verificationStatus: "needs_full_conjugation_entry",
    notes: "Quadriliteral/expanded root."
  },
  {
    id: "pv-0203",
    frequencyRank: 203,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַשְׁלִים",
    infinitive_plain: "להשלים",
    transcription_ru: "леhашл и м",
    translation_ru: "завершать; дополнять; мириться",
    root: "שׁ-ל-מ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A9%D7%9C%D7%99%D7%9D",
    verificationStatus: "needs_full_conjugation_entry"
  }
];

export const findBatch010DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_010_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch010SourceRegistry = (): void => {
  const duplicates = findBatch010DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 010: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_010_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 010");
  }

  const sorted = PEALIM_VERIFIED_BATCH_010_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 010 must stay sorted by frequencyRank ascending");
  }
};
