// Full Pealim-verified conjugation batch 002.
//
// This file continues converting source-registry entries into full app-ready verb cards.
// Rule: add only manually checked Pealim forms, do not generate guessed conjugations.

import type { PealimVerifiedVerb, VerbForm } from "./pealim-verified-verbs-700";

const f = (
  hebrew: string,
  hebrew_plain: string,
  transcription_ru: string,
  translation_ru: string,
): VerbForm => ({ hebrew, hebrew_plain, transcription_ru, translation_ru });

export const PEALIM_VERIFIED_FULL_BATCH_002: PealimVerifiedVerb[] = [
  {
    id: "pv-0006",
    frequencyRank: 6,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִרְאוֹת",
    infinitive_hebrew_plain: "לראות",
    transcription_ru: "лиръ о т",
    translation_ru: "видеть",
    root: "ר-א-ה",
    binyan: "פעל",
    difficulty: "easy",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/dict/1972-lirot/",
    checkedAt: "2026-05-29",
    notes: "Manually checked against Pealim. Pealim marks final weak root letter and second guttural root letter. Feminine plural future/imperative forms are formal; modern spoken usage often uses the masculine plural forms.",
    conjugations: {
      present: {
        ms: f("רוֹאֶה", "רואה", "ро э", "видит / я, ты, он видит"),
        fs: f("רוֹאָה", "רואה", "ро а", "видит / я, ты, она видит"),
        mp: f("רוֹאִים", "רואים", "ро и м", "видят / мы, вы, они м. р. видят"),
        fp: f("רוֹאוֹת", "רואות", "ро о т", "видят / мы, вы, они ж. р. видят"),
      },
      past: {
        ani: f("רָאִיתִי", "ראיתי", "ра и ти", "я видел(а)"),
        ata: f("רָאִיתָ", "ראית", "ра и та", "ты м. р. видел"),
        at: f("רָאִית", "ראית", "ра и т", "ты ж. р. видела"),
        hu: f("רָאָה", "ראה", "ра а", "он видел"),
        hi: f("רָאֲתָה", "ראתה", "раат а", "она видела"),
        anachnu: f("רָאִינוּ", "ראינו", "ра и ну", "мы видели"),
        atem: f("רְאִיתֶם", "ראיתם", "реит е м", "вы м. р. видели"),
        aten: f("רְאִיתֶן", "ראיתן", "реит е н", "вы ж. р. видели"),
        hem: f("רָאוּ", "ראו", "ра у", "они м. р. видели"),
        hen: f("רָאוּ", "ראו", "ра у", "они ж. р. видели"),
      },
      future: {
        ani: f("אֶרְאֶה", "אראה", "эръ э", "я увижу / буду видеть"),
        ata: f("תִּרְאֶה", "תראה", "тиръ э", "ты м. р. увидишь / будешь видеть"),
        at: f("תִּרְאִי", "תראי", "тиръ и", "ты ж. р. увидишь / будешь видеть"),
        hu: f("יִרְאֶה", "יראה", "йиръ э", "он увидит / будет видеть"),
        hi: f("תִּרְאֶה", "תראה", "тиръ э", "она увидит / будет видеть"),
        anachnu: f("נִרְאֶה", "נראה", "ниръ э", "мы увидим / будем видеть"),
        atem: f("תִּרְאוּ", "תראו", "тиръ у", "вы м. р. увидите / будете видеть"),
        aten: f("תִּרְאֶינָה", "תראינה", "тиръ э на", "вы ж. р. увидите / будете видеть"),
        hem: f("יִרְאוּ", "יראו", "йиръ у", "они м. р. увидят / будут видеть"),
        hen: f("תִּרְאֶינָה", "תראינה", "тиръ э на", "они ж. р. увидят / будут видеть"),
      },
      imperative: {
        ms: f("רְאֵה!", "ראה", "ре э!", "смотри / посмотри! мужчине"),
        fs: f("רְאִי!", "ראי", "ре и!", "смотри / посмотри! женщине"),
        mp: f("רְאוּ!", "ראו", "ре у!", "смотрите / посмотрите! мужчинам или смешанной группе"),
        fp: f("רְאֶינָה!", "ראינה", "ре э на!", "смотрите / посмотрите! женщинам"),
      },
    },
  },
  {
    id: "pv-0007",
    frequencyRank: 7,
    tier: "top_conversational_350",
    infinitive_hebrew: "לִשְׁמוֹעַ",
    infinitive_hebrew_plain: "לשמוע",
    transcription_ru: "лишм о а",
    translation_ru: "слышать; слушать",
    root: "שׁ-מ-ע",
    binyan: "פעל",
    difficulty: "easy",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/dict/2250-lishmoa/",
    checkedAt: "2026-05-29",
    notes: "Manually checked against Pealim. Pealim marks final guttural root letter. Feminine plural future/imperative forms are formal; modern spoken usage often uses masculine plural forms.",
    conjugations: {
      present: {
        ms: f("שׁוֹמֵעַ", "שומע", "шом е а", "слышит / я, ты, он слышит"),
        fs: f("שׁוֹמַעַת", "שומעת", "шом а ат", "слышит / я, ты, она слышит"),
        mp: f("שׁוֹמְעִים", "שומעים", "шомъ и м", "слышат / мы, вы, они м. р. слышат"),
        fp: f("שׁוֹמְעוֹת", "שומעות", "шомъ о т", "слышат / мы, вы, они ж. р. слышат"),
      },
      past: {
        ani: f("שָׁמַעְתִּי", "שמעתי", "шам а ти", "я слышал(а)"),
        ata: f("שָׁמַעְתָּ", "שמעת", "шам а та", "ты м. р. слышал"),
        at: f("שָׁמַעְתְּ", "שמעת", "шам а т", "ты ж. р. слышала"),
        hu: f("שָׁמַע", "שמע", "шам а", "он слышал"),
        hi: f("שָׁמְעָה", "שמעה", "шамъ а", "она слышала"),
        anachnu: f("שָׁמַעְנוּ", "שמענו", "шам а ну", "мы слышали"),
        atem: f("שְׁמַעְתֶּם", "שמעתם", "шмаат е м", "вы м. р. слышали"),
        aten: f("שְׁמַעְתֶּן", "שמעתן", "шмаат е н", "вы ж. р. слышали"),
        hem: f("שָׁמְעוּ", "שמעו", "шамъ у", "они м. р. слышали"),
        hen: f("שָׁמְעוּ", "שמעו", "шамъ у", "они ж. р. слышали"),
      },
      future: {
        ani: f("אֶשְׁמַע", "אשמע", "эшм а", "я услышу / буду слушать"),
        ata: f("תִּשְׁמַע", "תשמע", "тишм а", "ты м. р. услышишь / будешь слушать"),
        at: f("תִּשְׁמְעִי", "תשמעי", "тишме и", "ты ж. р. услышишь / будешь слушать"),
        hu: f("יִשְׁמַע", "ישמע", "йишм а", "он услышит / будет слушать"),
        hi: f("תִּשְׁמַע", "תשמע", "тишм а", "она услышит / будет слушать"),
        anachnu: f("נִשְׁמַע", "נשמע", "нишм а", "мы услышим / будем слушать"),
        atem: f("תִּשְׁמְעוּ", "תשמעו", "тишме у", "вы м. р. услышите / будете слушать"),
        aten: f("תִּשְׁמַעְנָה", "תשמענה", "тишм а на", "вы ж. р. услышите / будете слушать"),
        hem: f("יִשְׁמְעוּ", "ישמעו", "йишме у", "они м. р. услышат / будут слушать"),
        hen: f("תִּשְׁמַעְנָה", "תשמענה", "тишм а на", "они ж. р. услышат / будут слушать"),
      },
      imperative: {
        ms: f("שְׁמַע!", "שמע", "шм а!", "слушай / послушай! мужчине"),
        fs: f("שִׁמְעִי!", "שמעי", "шимъ и!", "слушай / послушай! женщине"),
        mp: f("שִׁמְעוּ!", "שמעו", "шимъ у!", "слушайте / послушайте! мужчинам или смешанной группе"),
        fp: f("שְׁמַעְנָה!", "שמענה", "шм а на!", "слушайте / послушайте! женщинам"),
      },
    },
  },
  {
    id: "pv-0008",
    frequencyRank: 8,
    tier: "top_conversational_350",
    infinitive_hebrew: "לָדַעַת",
    infinitive_hebrew_plain: "לדעת",
    transcription_ru: "лад а ат",
    translation_ru: "знать",
    root: "י-ד-ע",
    binyan: "פעל",
    difficulty: "easy",
    source: "pealim",
    sourceUrl: "https://www.pealim.com/ru/dict/791-ladaat/",
    checkedAt: "2026-05-29",
    notes: "Manually checked against Pealim. Pealim marks first weak root letter and final guttural root letter. Feminine plural future/imperative forms are formal; modern spoken usage often uses masculine plural forms.",
    conjugations: {
      present: {
        ms: f("יוֹדֵעַ", "יודע", "йод е а", "знает / я, ты, он знает"),
        fs: f("יוֹדַעַת", "יודעת", "йод а ат", "знает / я, ты, она знает"),
        mp: f("יוֹדְעִים", "יודעים", "йодъ и м", "знают / мы, вы, они м. р. знают"),
        fp: f("יוֹדְעוֹת", "יודעות", "йодъ о т", "знают / мы, вы, они ж. р. знают"),
      },
      past: {
        ani: f("יָדַעְתִּי", "ידעתי", "яд а ти", "я знал(а)"),
        ata: f("יָדַעְתָּ", "ידעת", "яд а та", "ты м. р. знал"),
        at: f("יָדַעְתְּ", "ידעת", "яд а т", "ты ж. р. знала"),
        hu: f("יָדַע", "ידע", "яд а", "он знал"),
        hi: f("יָדְעָה", "ידעה", "йадъ а", "она знала"),
        anachnu: f("יָדַעְנוּ", "ידענו", "яд а ну", "мы знали"),
        atem: f("יְדַעְתֶּם", "ידעתם", "йедаат е м", "вы м. р. знали"),
        aten: f("יְדַעְתֶּן", "ידעתן", "йедаат е н", "вы ж. р. знали"),
        hem: f("יָדְעוּ", "ידעו", "йадъ у", "они м. р. знали"),
        hen: f("יָדְעוּ", "ידעו", "йадъ у", "они ж. р. знали"),
      },
      future: {
        ani: f("אֵדַע", "אדע", "эд а", "я узнаю / буду знать"),
        ata: f("תֵּדַע", "תדע", "тед а", "ты м. р. узнаешь / будешь знать"),
        at: f("תֵּדְעִי", "תדעי", "тедъ и", "ты ж. р. узнаешь / будешь знать"),
        hu: f("יֵדַע", "ידע", "йед а", "он узнает / будет знать"),
        hi: f("תֵּדַע", "תדע", "тед а", "она узнает / будет знать"),
        anachnu: f("נֵדַע", "נדע", "нед а", "мы узнаем / будем знать"),
        atem: f("תֵּדְעוּ", "תדעו", "тедъ у", "вы м. р. узнаете / будете знать"),
        aten: f("תֵּדַעְנָה", "תדענה", "тед а на", "вы ж. р. узнаете / будете знать"),
        hem: f("יֵדְעוּ", "ידעו", "йедъ у", "они м. р. узнают / будут знать"),
        hen: f("תֵּדַעְנָה", "תדענה", "тед а на", "они ж. р. узнают / будут знать"),
      },
      imperative: {
        ms: f("דַּע!", "דע", "д а!", "знай! мужчине"),
        fs: f("דְּעִי!", "דעי", "де и!", "знай! женщине"),
        mp: f("דְּעוּ!", "דעו", "де у!", "знайте! мужчинам или смешанной группе"),
        fp: f("דַּעְנָה!", "דענה", "д а на!", "знайте! женщинам"),
      },
    },
  },
];

export const findFullBatch002DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_VERIFIED_FULL_BATCH_002) {
    if (seen.has(verb.infinitive_hebrew_plain)) duplicates.add(verb.infinitive_hebrew_plain);
    seen.add(verb.infinitive_hebrew_plain);
  }

  return [...duplicates];
};

export const assertFullBatch002 = (): void => {
  const duplicates = findFullBatch002DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in full batch 002: ${duplicates.join(", ")}`);
  }
};
