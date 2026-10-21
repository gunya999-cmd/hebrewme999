// Pealim verified verb batch 014 source registry.
//
// Batch 014 continues the 700-verb dataset after batch 013.
// It is separate from the live app dictionary and safe to merge later.
//
// Scope in this batch:
// - ranks 264-283
// - useful transport/city/navigation/teamwork/document/app verbs
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

export const PEALIM_VERIFIED_BATCH_014_SOURCES: PealimVerbBatchSource[] = [
  {
    id: "pv-0264",
    frequencyRank: 264,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִנְהוֹג",
    infinitive_plain: "לנהוג",
    transcription_ru: "линh о г",
    translation_ru: "водить; вести себя; поступать",
    root: "נ-ה-ג",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A0%D7%94%D7%95%D7%92",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0265",
    frequencyRank: 265,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָטוּס",
    infinitive_plain: "לטוס",
    transcription_ru: "лат у с",
    translation_ru: "лететь; летать",
    root: "ט-ו-ס",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%98%D7%95%D7%A1",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0266",
    frequencyRank: 266,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְטַיֵּל",
    infinitive_plain: "לטייל",
    transcription_ru: "летай е ль",
    translation_ru: "гулять; путешествовать",
    root: "ט-י-ל",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%98%D7%99%D7%99%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0267",
    frequencyRank: 267,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַחֲנוֹת",
    infinitive_plain: "לחנות",
    transcription_ru: "лахан о т",
    translation_ru: "парковаться; ставить машину",
    root: "ח-נ-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%A0%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0268",
    frequencyRank: 268,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַחֲצוֹת",
    infinitive_plain: "לחצות",
    transcription_ru: "лахац о т",
    translation_ru: "пересекать; переходить",
    root: "ח-צ-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%A6%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0269",
    frequencyRank: 269,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִפְנוֹת",
    infinitive_plain: "לפנות",
    transcription_ru: "лифн о т",
    translation_ru: "поворачивать; обращаться; освобождать место",
    root: "פ-נ-ה",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A4%D7%A0%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0270",
    frequencyRank: 270,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִסְתּוֹבֵב",
    infinitive_plain: "להסתובב",
    transcription_ru: "леhистов е в",
    translation_ru: "поворачиваться; гулять; крутиться",
    root: "ס-ב-ב",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A1%D7%AA%D7%95%D7%91%D7%91",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0271",
    frequencyRank: 271,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְמַצֵּא",
    infinitive_plain: "להתמצא",
    transcription_ru: "леhитмац е",
    translation_ru: "ориентироваться; разбираться",
    root: "מ-צ-א",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%9E%D7%A6%D7%90",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0272",
    frequencyRank: 272,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְאַבֵּד",
    infinitive_plain: "לאבד",
    transcription_ru: "леаб е д",
    translation_ru: "терять; утрачивать",
    root: "א-ב-ד",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%90%D7%91%D7%93",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0273",
    frequencyRank: 273,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהוֹבִיל",
    infinitive_plain: "להוביל",
    transcription_ru: "леhов и ль",
    translation_ru: "вести; перевозить; лидировать",
    root: "י-ב-ל",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%95%D7%91%D7%99%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0274",
    frequencyRank: 274,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְלַוּוֹת",
    infinitive_plain: "ללוות",
    transcription_ru: "лелав о т",
    translation_ru: "сопровождать; одалживать",
    root: "ל-ו-ה",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%9C%D7%95%D7%95%D7%AA",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0275",
    frequencyRank: 275,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִצְטָרֵף",
    infinitive_plain: "להצטרף",
    transcription_ru: "леhицтар е ф",
    translation_ru: "присоединяться",
    root: "צ-ר-פ",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A6%D7%98%D7%A8%D7%A3",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0276",
    frequencyRank: 276,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְצָרֵף",
    infinitive_plain: "לצרף",
    transcription_ru: "лецар е ф",
    translation_ru: "прикреплять; присоединять; добавлять",
    root: "צ-ר-פ",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A6%D7%A8%D7%A3",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0277",
    frequencyRank: 277,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִיפָּגֵשׁ",
    infinitive_plain: "להיפגש",
    transcription_ru: "леhипаг е ш",
    translation_ru: "встречаться",
    root: "פ-ג-שׁ",
    binyan: "נפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%99%D7%A4%D7%92%D7%A9",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0278",
    frequencyRank: 278,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהַצִּיג",
    infinitive_plain: "להציג",
    transcription_ru: "леhац и г",
    translation_ru: "представлять; показывать",
    root: "י-צ-ג",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A6%D7%99%D7%92",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0279",
    frequencyRank: 279,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְיַצֵּג",
    infinitive_plain: "לייצג",
    transcription_ru: "лейац е г",
    translation_ru: "представлять; быть представителем",
    root: "י-צ-ג",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%99%D7%99%D7%A6%D7%92",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0280",
    frequencyRank: 280,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִכְלוֹל",
    infinitive_plain: "לכלול",
    transcription_ru: "лихл о ль",
    translation_ru: "включать; содержать в себе",
    root: "כ-ל-ל",
    binyan: "פעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%9B%D7%9C%D7%95%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0281",
    frequencyRank: 281,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהָכִיל",
    infinitive_plain: "להכיל",
    transcription_ru: "леhах и ль",
    translation_ru: "содержать; вмещать",
    root: "כ-ו-ל",
    binyan: "הפעיל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%9B%D7%99%D7%9C",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0282",
    frequencyRank: 282,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְחַלֵּק",
    infinitive_plain: "לחלק",
    transcription_ru: "лехал е к",
    translation_ru: "делить; раздавать; распределять",
    root: "ח-ל-ק",
    binyan: "פיעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%97%D7%9C%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  },
  {
    id: "pv-0283",
    frequencyRank: 283,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְהִתְחַלֵּק",
    infinitive_plain: "להתחלק",
    transcription_ru: "леhитхал е к",
    translation_ru: "делиться; распределяться",
    root: "ח-ל-ק",
    binyan: "התפעל",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%97%D7%9C%D7%A7",
    verificationStatus: "needs_full_conjugation_entry"
  }
];

export const findBatch014DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_BATCH_014_SOURCES) {
    if (seen.has(verb.infinitive_plain)) duplicates.add(verb.infinitive_plain);
    seen.add(verb.infinitive_plain);
  }

  return [...duplicates];
};

export const assertBatch014SourceRegistry = (): void => {
  const duplicates = findBatch014DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in batch 014: ${duplicates.join(", ")}`);
  }

  const ranks = PEALIM_VERIFIED_BATCH_014_SOURCES.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate ranks in batch 014");
  }

  const sorted = PEALIM_VERIFIED_BATCH_014_SOURCES.every((verb, index, array) => index === 0 || array[index - 1].frequencyRank < verb.frequencyRank);
  if (!sorted) {
    throw new Error("Batch 014 must stay sorted by frequencyRank ascending");
  }
};
