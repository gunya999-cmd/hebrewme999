// Pealim verified verb batch 008 source registry.
//
// Batch 008 continues the 700-verb dataset after batch 007.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 144-163
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

export const PEALIM_VERIFIED_BATCH_008_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0144",
    frequencyRank: 144,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִבְנוֹת",
    infinitive_plain: "לבנות",
    transcription_ru: "ливн о т",
    translation_ru: "строить",
    root: "ב-נ-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%91%D7%A0%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0145",
    frequencyRank: 145,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִשְׁבֹּר",
    infinitive_plain: "לשבור",
    transcription_ru: "лишб о р",
    translation_ru: "ломать; разбивать",
    root: "שׁ-ב-ר",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A9%D7%91%D7%95%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0146",
    frequencyRank: 146,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִתְלוֹת",
    infinitive_plain: "לתלות",
    transcription_ru: "литл о т",
    translation_ru: "вешать; зависеть от",
    root: "ת-ל-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%AA%D7%9C%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0147",
    frequencyRank: 147,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְקַפֵּל",
    infinitive_plain: "לקפל",
    transcription_ru: "лекап е ль",
    translation_ru: "складывать; сгибать",
    root: "ק-פ-ל",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A7%D7%A4%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0148",
    frequencyRank: 148,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִמְשֹׁךְ",
    infinitive_plain: "למשוך",
    transcription_ru: "лимш о х",
    translation_ru: "тянуть; привлекать",
    root: "מ-שׁ-ך",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%9E%D7%A9%D7%95%D7%9A",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0149",
    frequencyRank: 149,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִדְחוֹף",
    infinitive_plain: "לדחוף",
    transcription_ru: "лидх о ф",
    translation_ru: "толкать",
    root: "ד-ח-פ",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%93%D7%97%D7%95%D7%A3",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0150",
    frequencyRank: 150,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְחַבֵּר",
    infinitive_plain: "לחבר",
    transcription_ru: "лехаб е р",
    translation_ru: "соединять; подключать",
    root: "ח-ב-ר",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%91%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0151",
    frequencyRank: 151,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְנַתֵּק",
    infinitive_plain: "לנתק",
    transcription_ru: "ленат е к",
    translation_ru: "отсоединять; отключать; прерывать связь",
    root: "נ-ת-ק",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A0%D7%AA%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0152",
    frequencyRank: 152,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְסַמֵּן",
    infinitive_plain: "לסמן",
    transcription_ru: "лесам е н",
    translation_ru: "отмечать; помечать",
    root: "ס-מ-נ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A1%D7%9E%D7%9F",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0153",
    frequencyRank: 153,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִמְחוֹק",
    infinitive_plain: "למחוק",
    transcription_ru: "лимх о к",
    translation_ru: "стирать; удалять",
    root: "מ-ח-ק",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%9E%D7%97%D7%95%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0154",
    frequencyRank: 154,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַעֲתִיק",
    infinitive_plain: "להעתיק",
    transcription_ru: "леhаат и к",
    translation_ru: "копировать; списывать; переносить",
    root: "ע-ת-ק",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A2%D7%AA%D7%99%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0155",
    frequencyRank: 155,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַדְבִּיק",
    infinitive_plain: "להדביק",
    transcription_ru: "леhадб и к",
    translation_ru: "приклеивать; вставлять; заражать",
    root: "ד-ב-ק",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%93%D7%91%D7%99%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0156",
    frequencyRank: 156,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַקְלִיד",
    infinitive_plain: "להקליד",
    transcription_ru: "леhакл и д",
    translation_ru: "печатать на клавиатуре; набирать текст",
    root: "ק-ל-ד",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A7%D7%9C%D7%99%D7%93",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0157",
    frequencyRank: 157,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַדְפִּיס",
    infinitive_plain: "להדפיס",
    transcription_ru: "леhадп и с",
    translation_ru: "печатать; распечатывать",
    root: "ד-פ-ס",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%93%D7%A4%D7%99%D7%A1",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0158",
    frequencyRank: 158,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַעֲלוֹת",
    infinitive_plain: "להעלות",
    transcription_ru: "леhаал о т",
    translation_ru: "поднимать; загружать онлайн",
    root: "ע-ל-ה",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A2%D7%9C%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0159",
    frequencyRank: 159,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַגִּישׁ",
    infinitive_plain: "להגיש",
    transcription_ru: "леhаг и ш",
    translation_ru: "подавать; сдавать работу; отправлять заявку",
    root: "נ-ג-שׁ",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%92%D7%99%D7%A9",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0160",
    frequencyRank: 160,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִקְבּוֹעַ",
    infinitive_plain: "לקבוע",
    transcription_ru: "ликб о а",
    translation_ru: "назначать; устанавливать; договариваться",
    root: "ק-ב-ע",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A7%D7%91%D7%95%D7%A2",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0161",
    frequencyRank: 161,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְבַטֵּל",
    infinitive_plain: "לבטל",
    transcription_ru: "леват е ль",
    translation_ru: "отменять; аннулировать",
    root: "ב-ט-ל",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%91%D7%98%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0162",
    frequencyRank: 162,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְאַשֵּׁר",
    infinitive_plain: "לאשר",
    transcription_ru: "леаш е р",
    translation_ru: "подтверждать; одобрять",
    root: "א-שׁ-ר",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%90%D7%A9%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0163",
    frequencyRank: 163,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַזְכִּיר",
    infinitive_plain: "להזכיר",
    transcription_ru: "леhазк и р",
    translation_ru: "напоминать; упоминать",
    root: "ז-כ-ר",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%96%D7%9B%D7%99%D7%A8",
    verificationStatus: "needs_full_conjugation_entry"
  },
];

export const findBatch008DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_008_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch008SourceRegistry = (): void => {
  const duplicates = findBatch008DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 008: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_008_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 008");
  }

  const sorted = PEALIM_VERIFIED_BATCH_008_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 008 must stay sorted by frequencyRank ascending");
  }
};
