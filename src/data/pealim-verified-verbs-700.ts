// Pealim-verified Hebrew verb dataset for future import into the app.
//
// Target scope requested:
// - 350 very useful conversational verbs.
// - 350 mid-frequency verbs for reading, school, news and advanced speech.
// - Total target: 700 verbs.
//
// Hard rule for this file:
// Do NOT add guessed or generated conjugations.
// Add only verbs checked manually against https://www.pealim.com/ru/.
// Keep sourceUrl for every verb.
// Keep frequencyRank unique and sorted from most common/useful spoken verbs to rarer verbs.
// Keep infinitive_hebrew unique. No duplicate infinitives.

export type PealimVerbTier = "top_conversational_350" | "mid_frequency_350";
export type VerbDifficulty = "easy" | "medium" | "hard";
export type VerbBinyan = "פעל" | "נפעל" | "פיעל" | "פועל" | "הפעיל" | "הופעל" | "התפעל";

export type VerbForm = {
  hebrew: string;
  hebrew_plain: string;
  transcription_ru: string;
  translation_ru: string;
};

export type PresentForms = {
  ms: VerbForm;
  fs: VerbForm;
  mp: VerbForm;
  fp: VerbForm;
};

export type TenPersonForms = {
  ani: VerbForm;
  ata: VerbForm;
  at: VerbForm;
  hu: VerbForm;
  hi: VerbForm;
  anachnu: VerbForm;
  atem: VerbForm;
  aten: VerbForm;
  hem: VerbForm;
  hen: VerbForm;
};

export type ImperativeForms = {
  ms: VerbForm;
  fs: VerbForm;
  mp: VerbForm;
  fp: VerbForm;
};

export type PealimVerifiedVerb = {
  id: string;
  frequencyRank: number;
  tier: PealimVerbTier;
  infinitive_hebrew: string;
  infinitive_hebrew_plain: string;
  transcription_ru: string;
  translation_ru: string;
  root: string;
  binyan: VerbBinyan;
  difficulty: VerbDifficulty;
  source: "pealim";
  sourceUrl: string;
  checkedAt: string;
  notes?: string;
  conjugations: {
    present: PresentForms;
    past: TenPersonForms;
    future: TenPersonForms;
    imperative: ImperativeForms;
  };
};

const f = (
  hebrew: string,
  hebrew_plain: string,
  transcription_ru: string,
  translation_ru: string,
): VerbForm => ({ hebrew, hebrew_plain, transcription_ru, translation_ru });

export const PEALIM_VERIFIED_VERBS_TARGET = {
  total: 700,
  topConversational: 350,
  midFrequency: 350,
  currentVerified: 3,
  status: "partial_verified_batch_001",
} as const;

export const PEALIM_VERIFIED_VERBS: PealimVerifiedVerb[] = [
  {
    id: "pv-0001",
    frequencyRank: 1,
    tier: "top_conversational_350",
    infinitive_hebrew: "לַעֲשׂוֹת",
    infinitive_hebrew_plain: "לעשות",
    transcription_ru: "лаас о т",
    translation_ru: "делать, создавать, совершать",
    root: "ע-שׂ-ה",
    binyan: "פעל",
    difficulty: "easy",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/dict/3-laasot/",
    checkedAt: "2026-05-28",
    notes: "Very common conversational verb. Pealim marks final weak root letter and initial guttural root letter.",
    conjugations: {
      present: {
        ms: f("עוֹשֶׂה", "עושה", "ос е", "делает / я, ты, он делает"),
        fs: f("עוֹשָׂה", "עושה", "ос а", "делает / я, ты, она делает"),
        mp: f("עוֹשִׂים", "עושים", "ос и м", "делают / мы, вы, они м. р. делают"),
        fp: f("עוֹשׂוֹת", "עושות", "ос о т", "делают / мы, вы, они ж. р. делают"),
      },
      past: {
        ani: f("עָשִׂיתִי", "עשיתי", "ас и ти", "я сделал(а)"),
        ata: f("עָשִׂיתָ", "עשית", "ас и та", "ты сделал"),
        at: f("עָשִׂית", "עשית", "ас и т", "ты сделала"),
        hu: f("עָשָׂה", "עשה", "ас а", "он сделал"),
        hi: f("עָשְׂתָה", "עשתה", "аст а", "она сделала"),
        anachnu: f("עָשִׂינוּ", "עשינו", "ас и ну", "мы сделали"),
        atem: f("עֲשִׂיתֶם", "עשיתם", "асит е м", "вы м. р. сделали"),
        aten: f("עֲשִׂיתֶן", "עשיתן", "асит е н", "вы ж. р. сделали"),
        hem: f("עָשׂוּ", "עשו", "ас у", "они м. р. сделали"),
        hen: f("עָשׂוּ", "עשו", "ас у", "они ж. р. сделали"),
      },
      future: {
        ani: f("אֶעֱשֶׂה", "אעשה", "ээс е", "я сделаю / буду делать"),
        ata: f("תַּעֲשֶׂה", "תעשה", "таас е", "ты м. р. сделаешь / будешь делать"),
        at: f("תַּעֲשִׂי", "תעשי", "таас и", "ты ж. р. сделаешь / будешь делать"),
        hu: f("יַעֲשֶׂה", "יעשה", "яас е", "он сделает / будет делать"),
        hi: f("תַּעֲשֶׂה", "תעשה", "таас е", "она сделает / будет делать"),
        anachnu: f("נַעֲשֶׂה", "נעשה", "наас е", "мы сделаем / будем делать"),
        atem: f("תַּעֲשׂוּ", "תעשו", "таас у", "вы м. р. сделаете / будете делать"),
        aten: f("תַּעֲשֶׂינָה", "תעשינה", "таас е на", "вы ж. р. сделаете / будете делать"),
        hem: f("יַעֲשׂוּ", "יעשו", "яас у", "они м. р. сделают / будут делать"),
        hen: f("תַּעֲשֶׂינָה", "תעשינה", "таас е на", "они ж. р. сделают / будут делать"),
      },
      imperative: {
        ms: f("עֲשֵׂה", "עשה", "ас е", "сделай / делай мужчине"),
        fs: f("עֲשִׂי", "עשי", "ас и", "сделай / делай женщине"),
        mp: f("עֲשׂוּ", "עשו", "ас у", "сделайте / делайте мужчинам или смешанной группе"),
        fp: f("עֲשֶׂינָה", "עשינה", "ас е на", "сделайте / делайте женщинам"),
      },
    },
  },
  {
    id: "pv-0002",
    frequencyRank: 2,
    tier: "top_conversational_350",
    infinitive_hebrew: "לְדַבֵּר",
    infinitive_hebrew_plain: "לדבר",
    transcription_ru: "ледаб е р",
    translation_ru: "говорить",
    root: "ד-ב-ר",
    binyan: "פיעל",
    difficulty: "easy",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/dict/2-ledaber/",
    checkedAt: "2026-05-28",
    notes: "Pealim page also contains passive pu'al forms later; this entry intentionally uses active pi'el only.",
    conjugations: {
      present: {
        ms: f("מְדַבֵּר", "מדבר", "медаб е р", "говорит / я, ты, он говорит"),
        fs: f("מְדַבֶּרֶת", "מדברת", "медаб е рет", "говорит / я, ты, она говорит"),
        mp: f("מְדַבְּרִים", "מדברים", "медабр и м", "говорят / мы, вы, они м. р. говорят"),
        fp: f("מְדַבְּרוֹת", "מדברות", "медабр о т", "говорят / мы, вы, они ж. р. говорят"),
      },
      past: {
        ani: f("דִּבַּרְתִּי", "דיברתי", "диб а рти", "я говорил(а)"),
        ata: f("דִּבַּרְתָּ", "דיברת", "диб а рта", "ты говорил"),
        at: f("דִּבַּרְתְּ", "דיברת", "диб а рт", "ты говорила"),
        hu: f("דִּבֵּר", "דיבר", "диб е р", "он говорил"),
        hi: f("דִּבְּרָה", "דיברה", "дибр а", "она говорила"),
        anachnu: f("דִּבַּרְנוּ", "דיברנו", "диб а рну", "мы говорили"),
        atem: f("דִּבַּרְתֶּם", "דיברתם", "дибарт е м", "вы м. р. говорили"),
        aten: f("דִּבַּרְתֶּן", "דיברתן", "дибарт е н", "вы ж. р. говорили"),
        hem: f("דִּבְּרוּ", "דיברו", "дибр у", "они м. р. говорили"),
        hen: f("דִּבְּרוּ", "דיברו", "дибр у", "они ж. р. говорили"),
      },
      future: {
        ani: f("אֲדַבֵּר", "אדבר", "адаб е р", "я буду говорить"),
        ata: f("תְּדַבֵּר", "תדבר", "тедаб е р", "ты м. р. будешь говорить"),
        at: f("תְּדַבְּרִי", "תדברי", "тедабр и", "ты ж. р. будешь говорить"),
        hu: f("יְדַבֵּר", "ידבר", "йедаб е р", "он будет говорить"),
        hi: f("תְּדַבֵּר", "תדבר", "тедаб е р", "она будет говорить"),
        anachnu: f("נְדַבֵּר", "נדבר", "недаб е р", "мы будем говорить"),
        atem: f("תְּדַבְּרוּ", "תדברו", "тедабр у", "вы м. р. будете говорить"),
        aten: f("תְּדַבֵּרְנָה", "תדברנה", "тедаб е рна", "вы ж. р. будете говорить"),
        hem: f("יְדַבְּרוּ", "ידברו", "йедабр у", "они м. р. будут говорить"),
        hen: f("תְּדַבֵּרְנָה", "תדברנה", "тедаб е рна", "они ж. р. будут говорить"),
      },
      imperative: {
        ms: f("דַּבֵּר", "דבר", "даб е р", "говори мужчине"),
        fs: f("דַּבְּרִי", "דברי", "дабр и", "говори женщине"),
        mp: f("דַּבְּרוּ", "דברו", "дабр у", "говорите мужчинам или смешанной группе"),
        fp: f("דַּבֵּרְנָה", "דברנה", "даб е рна", "говорите женщинам"),
      },
    },
  },
  {
    id: "pv-0003",
    frequencyRank: 3,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִכְתּוֹב",
    infinitive_hebrew_plain: "לכתוב",
    transcription_ru: "лихт о в",
    translation_ru: "писать",
    root: "כ-ת-ב",
    binyan: "פעל",
    difficulty: "easy",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/dict/1-lichtov/",
    checkedAt: "2026-05-28",
    notes: "Useful for school, apps and everyday written communication.",
    conjugations: {
      present: {
        ms: f("כּוֹתֵב", "כותב", "кот е в", "пишет / я, ты, он пишет"),
        fs: f("כּוֹתֶבֶת", "כותבת", "кот е вет", "пишет / я, ты, она пишет"),
        mp: f("כּוֹתְבִים", "כותבים", "котв и м", "пишут / мы, вы, они м. р. пишут"),
        fp: f("כּוֹתְבוֹת", "כותבות", "котв о т", "пишут / мы, вы, они ж. р. пишут"),
      },
      past: {
        ani: f("כָּתַבְתִּי", "כתבתי", "кат а вти", "я писал(а)"),
        ata: f("כָּתַבְתָּ", "כתבת", "кат а вта", "ты писал"),
        at: f("כָּתַבְתְּ", "כתבת", "кат а вт", "ты писала"),
        hu: f("כָּתַב", "כתב", "кат а в", "он писал"),
        hi: f("כָּתְבָה", "כתבה", "катв а", "она писала"),
        anachnu: f("כָּתַבְנוּ", "כתבנו", "кат а вну", "мы писали"),
        atem: f("כְּתַבְתֶּם", "כתבתם", "ктавт е м", "вы м. р. писали"),
        aten: f("כְּתַבְתֶּן", "כתבתן", "ктавт е н", "вы ж. р. писали"),
        hem: f("כָּתְבוּ", "כתבו", "катв у", "они м. р. писали"),
        hen: f("כָּתְבוּ", "כתבו", "катв у", "они ж. р. писали"),
      },
      future: {
        ani: f("אֶכְתֹּב", "אכתוב", "эхт о в", "я буду писать"),
        ata: f("תִּכְתֹּב", "תכתוב", "тихт о в", "ты м. р. будешь писать"),
        at: f("תִּכְתְּבִי", "תכתבי", "тихтев и", "ты ж. р. будешь писать"),
        hu: f("יִכְתֹּב", "יכתוב", "йихт о в", "он будет писать"),
        hi: f("תִּכְתֹּב", "תכתוב", "тихт о в", "она будет писать"),
        anachnu: f("נִכְתֹּב", "נכתוב", "нихт о в", "мы будем писать"),
        atem: f("תִּכְתְּבוּ", "תכתבו", "тихтев у", "вы м. р. будете писать"),
        aten: f("תִּכְתֹּבְנָה", "תכתובנה", "тихт о вна", "вы ж. р. будете писать"),
        hem: f("יִכְתְּבוּ", "יכתבו", "йихтев у", "они м. р. будут писать"),
        hen: f("תִּכְתֹּבְנָה", "תכתובנה", "тихт о вна", "они ж. р. будут писать"),
      },
      imperative: {
        ms: f("כְּתֹב", "כתוב", "кт о в", "пиши мужчине"),
        fs: f("כִּתְבִי", "כתבי", "китв и", "пиши женщине"),
        mp: f("כִּתְבוּ", "כתבו", "китв у", "пишите мужчинам или смешанной группе"),
        fp: f("כְּתֹבְנָה", "כתובנה", "кт о вна", "пишите женщинам"),
      },
    },
  },
];

export const findDuplicatePealimInfinitives = (verbs: PealimVerifiedVerb[] = PEALIM_VERIFIED_VERBS): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of verbs) {
    if (seen.has(verb.infinitive_hebrew_plain)) {
      duplicates.add(verb.infinitive_hebrew_plain);
    }
    seen.add(verb.infinitive_hebrew_plain);
  }

  return [...duplicates];
};

export const assertPealimVerifiedVerbDataset = (verbs: PealimVerifiedVerb[] = PEALIM_VERIFIED_VERBS): void => {
  const duplicates = findDuplicatePealimInfinitives(verbs);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate Hebrew infinitives: ${duplicates.join(", ")}`);
  }

  const ranks = verbs.map((verb) => verb.frequencyRank);
  const uniqueRanks = new Set(ranks);
  if (uniqueRanks.size !== ranks.length) {
    throw new Error("Duplicate frequencyRank values in Pealim verified verbs dataset");
  }

  const unsorted = verbs.some((verb, index) => index > 0 && verbs[index - 1].frequencyRank > verb.frequencyRank);
  if (unsorted) {
    throw new Error("PEALIM_VERIFIED_VERBS must stay sorted by frequencyRank ascending");
  }
};
