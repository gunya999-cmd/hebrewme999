// Fast app-ready conjugation candidate batch 034-053.
//
// Purpose: stop the manual bottleneck and make the full 20-verb block available
// in app-ready shape. This is NOT final-reviewed data. Every entry keeps its
// Pealim sourceUrl and must still pass final line-by-line Pealim audit before
// promotion into the final verified series.

import type { PealimVerifiedVerb, VerbForm } from "./pealim-verified-verbs-700";

type VerbSpec = {
  rank: number;
  infinitive: string;
  translation: string;
  root: string;
  binyan: PealimVerifiedVerb["binyan"];
  difficulty: PealimVerifiedVerb["difficulty"];
  sourceUrl: string;
  present: [string, string, string, string];
  past: [string, string, string, string, string, string, string, string, string, string];
  future: [string, string, string, string, string, string, string, string, string, string];
  imperative: [string, string, string, string];
};

const f = (hebrew: string, translation_ru: string): VerbForm => ({
  hebrew,
  hebrew_plain: hebrew,
  transcription_ru: "",
  translation_ru,
});

const tr = {
  present: (base: string) => ({
    ms: `${base} / я, ты, он`,
    fs: `${base} / я, ты, она`,
    mp: `${base} / мы, вы, они м. р.`,
    fp: `${base} / мы, вы, они ж. р.`,
  }),
  past: (base: string) => ({
    ani: `я: ${base}`,
    ata: `ты м. р.: ${base}`,
    at: `ты ж. р.: ${base}`,
    hu: `он: ${base}`,
    hi: `она: ${base}`,
    anachnu: `мы: ${base}`,
    atem: `вы м. р.: ${base}`,
    aten: `вы ж. р.: ${base}`,
    hem: `они м. р.: ${base}`,
    hen: `они ж. р.: ${base}`,
  }),
  future: (base: string) => ({
    ani: `я буду: ${base}`,
    ata: `ты м. р. будешь: ${base}`,
    at: `ты ж. р. будешь: ${base}`,
    hu: `он будет: ${base}`,
    hi: `она будет: ${base}`,
    anachnu: `мы будем: ${base}`,
    atem: `вы м. р. будете: ${base}`,
    aten: `вы ж. р. будете: ${base}`,
    hem: `они м. р. будут: ${base}`,
    hen: `они ж. р. будут: ${base}`,
  }),
  imperative: (base: string) => ({
    ms: `${base}! мужчине`,
    fs: `${base}! женщине`,
    mp: `${base}! мужчинам или смешанной группе`,
    fp: `${base}! женщинам`,
  }),
};

const makeVerb = (spec: VerbSpec): PealimVerifiedVerb => {
  const present = tr.present(spec.translation);
  const past = tr.past(spec.translation);
  const future = tr.future(spec.translation);
  const imperative = tr.imperative(spec.translation);

  return {
    id: `pv-${String(spec.rank).padStart(4, "0")}`,
    frequencyRank: spec.rank,
    tier: "top_conversational_350",
    infinitive_hebrew: spec.infinitive,
    infinitive_hebrew_plain: spec.infinitive,
    transcription_ru: "",
    translation_ru: spec.translation,
    root: spec.root,
    binyan: spec.binyan,
    difficulty: spec.difficulty,
    source: "pealim",
    sourceUrl: spec.sourceUrl,
    checkedAt: "2026-05-29",
    notes: "FAST_CANDIDATE: app-ready shape created to stop the manual bottleneck; final Pealim line-by-line audit is still required before final-reviewed promotion.",
    conjugations: {
      present: {
        ms: f(spec.present[0], present.ms),
        fs: f(spec.present[1], present.fs),
        mp: f(spec.present[2], present.mp),
        fp: f(spec.present[3], present.fp),
      },
      past: {
        ani: f(spec.past[0], past.ani),
        ata: f(spec.past[1], past.ata),
        at: f(spec.past[2], past.at),
        hu: f(spec.past[3], past.hu),
        hi: f(spec.past[4], past.hi),
        anachnu: f(spec.past[5], past.anachnu),
        atem: f(spec.past[6], past.atem),
        aten: f(spec.past[7], past.aten),
        hem: f(spec.past[8], past.hem),
        hen: f(spec.past[9], past.hen),
      },
      future: {
        ani: f(spec.future[0], future.ani),
        ata: f(spec.future[1], future.ata),
        at: f(spec.future[2], future.at),
        hu: f(spec.future[3], future.hu),
        hi: f(spec.future[4], future.hi),
        anachnu: f(spec.future[5], future.anachnu),
        atem: f(spec.future[6], future.atem),
        aten: f(spec.future[7], future.aten),
        hem: f(spec.future[8], future.hem),
        hen: f(spec.future[9], future.hen),
      },
      imperative: {
        ms: f(spec.imperative[0], imperative.ms),
        fs: f(spec.imperative[1], imperative.fs),
        mp: f(spec.imperative[2], imperative.mp),
        fp: f(spec.imperative[3], imperative.fp),
      },
    },
  };
};

const SPECS: VerbSpec[] = [
  { rank: 34, infinitive: "למצוא", translation: "находить", root: "מ-צ-א", binyan: "פעל", difficulty: "medium", sourceUrl: "https://www.pealim.com/ru/dict/1083-limtzo/", present: ["מוצא", "מוצאת", "מוצאים", "מוצאות"], past: ["מצאתי", "מצאת", "מצאת", "מצא", "מצאה", "מצאנו", "מצאתם", "מצאתן", "מצאו", "מצאו"], future: ["אמצא", "תמצא", "תמצאי", "ימצא", "תמצא", "נמצא", "תמצאו", "תמצאנה", "ימצאו", "תמצאנה"], imperative: ["מצא", "מצאי", "מצאו", "מצאנה"] },
  { rank: 35, infinitive: "להרגיש", translation: "чувствовать; чувствовать себя", root: "ר-ג-ש", binyan: "הפעיל", difficulty: "medium", sourceUrl: "https://www.pealim.com/ru/dict/1993-lehargish/", present: ["מרגיש", "מרגישה", "מרגישים", "מרגישות"], past: ["הרגשתי", "הרגשת", "הרגשת", "הרגיש", "הרגישה", "הרגשנו", "הרגשתם", "הרגשתן", "הרגישו", "הרגישו"], future: ["ארגיש", "תרגיש", "תרגישי", "ירגיש", "תרגיש", "נרגיש", "תרגישו", "תרגשנה", "ירגישו", "תרגשנה"], imperative: ["הרגש", "הרגישי", "הרגישו", "הרגשנה"] },
  { rank: 36, infinitive: "להכיר", translation: "знать; быть знакомым; узнавать", root: "נ-כ-ר", binyan: "הפעיל", difficulty: "medium", sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%9B%D7%99%D7%A8", present: ["מכיר", "מכירה", "מכירים", "מכירות"], past: ["הכרתי", "הכרת", "הכרת", "הכיר", "הכירה", "הכרנו", "הכרתם", "הכרתן", "הכירו", "הכירו"], future: ["אכיר", "תכיר", "תכירי", "יכיר", "תכיר", "נכיר", "תכירו", "תכרנה", "יכירו", "תכרנה"], imperative: ["הכר", "הכירי", "הכירו", "הכרנה"] },
  { rank: 37, infinitive: "להתחיל", translation: "начинать", root: "ת-ח-ל", binyan: "הפעיל", difficulty: "medium", sourceUrl: "https://www.pealim.com/ru/dict/2359-lehatchil/", present: ["מתחיל", "מתחילה", "מתחילים", "מתחילות"], past: ["התחלתי", "התחלת", "התחלת", "התחיל", "התחילה", "התחלנו", "התחלתם", "התחלתן", "התחילו", "התחילו"], future: ["אתחיל", "תתחיל", "תתחילי", "יתחיל", "תתחיל", "נתחיל", "תתחילו", "תתחלנה", "יתחילו", "תתחלנה"], imperative: ["התחל", "התחילי", "התחילו", "התחלנה"] },
  { rank: 38, infinitive: "להמשיך", translation: "продолжать", root: "מ-ש-ך", binyan: "הפעיל", difficulty: "medium", sourceUrl: "https://www.pealim.com/ru/dict/1110-lehamshich/", present: ["ממשיך", "ממשיכה", "ממשיכים", "ממשיכות"], past: ["המשכתי", "המשכת", "המשכת", "המשיך", "המשיכה", "המשכנו", "המשכתם", "המשכתן", "המשיכו", "המשיכו"], future: ["אמשיך", "תמשיך", "תמשיכי", "ימשיך", "תמשיך", "נמשיך", "תמשיכו", "תמשכנה", "ימשיכו", "תמשכנה"], imperative: ["המשך", "המשיכי", "המשיכו", "המשכנה"] },
  { rank: 39, infinitive: "להפסיק", translation: "прекращать; переставать", root: "פ-ס-ק", binyan: "הפעיל", difficulty: "medium", sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A4%D7%A1%D7%99%D7%A7", present: ["מפסיק", "מפסיקה", "מפסיקים", "מפסיקות"], past: ["הפסקתי", "הפסקת", "הפסקת", "הפסיק", "הפסיקה", "הפסקנו", "הפסקתם", "הפסקתן", "הפסיקו", "הפסיקו"], future: ["אפסיק", "תפסיק", "תפסיקי", "יפסיק", "תפסיק", "נפסיק", "תפסיקו", "תפסקנה", "יפסיקו", "תפסקנה"], imperative: ["הפסק", "הפסיקי", "הפסיקו", "הפסקנה"] },
  { rank: 40, infinitive: "לקנות", translation: "покупать; приобретать", root: "ק-נ-ה", binyan: "פעל", difficulty: "medium", sourceUrl: "https://www.pealim.com/ru/dict/1913-liknot/", present: ["קונה", "קונה", "קונים", "קונות"], past: ["קניתי", "קנית", "קנית", "קנה", "קנתה", "קנינו", "קניתם", "קניתן", "קנו", "קנו"], future: ["אקנה", "תקנה", "תקני", "יקנה", "תקנה", "נקנה", "תקנו", "תקנינה", "יקנו", "תקנינה"], imperative: ["קנה", "קני", "קנו", "קנינה"] },
  { rank: 41, infinitive: "לשלם", translation: "платить", root: "ש-ל-ם", binyan: "פיעל", difficulty: "easy", sourceUrl: "https://www.pealim.com/ru/dict/2232-leshalem/", present: ["משלם", "משלמת", "משלמים", "משלמות"], past: ["שילמתי", "שילמת", "שילמת", "שילם", "שילמה", "שילמנו", "שילמתם", "שילמתן", "שילמו", "שילמו"], future: ["אשלם", "תשלם", "תשלמי", "ישלם", "תשלם", "נשלם", "תשלמו", "תשלמנה", "ישלמו", "תשלמנה"], imperative: ["שלם", "שלמי", "שלמו", "שלמנה"] },
  { rank: 42, infinitive: "לבשל", translation: "варить; готовить", root: "ב-ש-ל", binyan: "פיעל", difficulty: "easy", sourceUrl: "https://www.pealim.com/ru/dict/273-levashel/", present: ["מבשל", "מבשלת", "מבשלים", "מבשלות"], past: ["בישלתי", "בישלת", "בישלת", "בישל", "בישלה", "בישלנו", "בישלתם", "בישלתן", "בישלו", "בישלו"], future: ["אבשל", "תבשל", "תבשלי", "יבשל", "תבשל", "נבשל", "תבשלו", "תבשלנה", "יבשלו", "תבשלנה"], imperative: ["בשל", "בשלי", "בשלו", "בשלנה"] },
  { rank: 43, infinitive: "לנקות", translation: "чистить; убирать", root: "נ-ק-ה", binyan: "פיעל", difficulty: "medium", sourceUrl: "https://www.pealim.com/ru/dict/1252-lenakot/", present: ["מנקה", "מנקה", "מנקים", "מנקות"], past: ["ניקיתי", "ניקית", "ניקית", "ניקה", "ניקתה", "ניקינו", "ניקיתם", "ניקיתן", "ניקו", "ניקו"], future: ["אנקה", "תנקה", "תנקי", "ינקה", "תנקה", "ננקה", "תנקו", "תנקינה", "ינקו", "תנקינה"], imperative: ["נקה", "נקי", "נקו", "נקינה"] },
  { rank: 44, infinitive: "לתקן", translation: "чинить; исправлять", root: "ת-ק-ן", binyan: "פיעל", difficulty: "easy", sourceUrl: "https://www.pealim.com/ru/dict/2392-letaken/", present: ["מתקן", "מתקנת", "מתקנים", "מתקנות"], past: ["תיקנתי", "תיקנת", "תיקנת", "תיקן", "תיקנה", "תיקנו", "תיקנתם", "תיקנתן", "תיקנו", "תיקנו"], future: ["אתקן", "תתקן", "תתקני", "יתקן", "תתקן", "נתקן", "תתקנו", "תתקנה", "יתקנו", "תתקנה"], imperative: ["תקן", "תקני", "תקנו", "תקנה"] },
  { rank: 45, infinitive: "לסדר", translation: "упорядочивать; налаживать", root: "ס-ד-ר", binyan: "פיעל", difficulty: "easy", sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A1%D7%93%D7%A8", present: ["מסדר", "מסדרת", "מסדרים", "מסדרות"], past: ["סידרתי", "סידרת", "סידרת", "סידר", "סידרה", "סידרנו", "סידרתם", "סידרתן", "סידרו", "סידרו"], future: ["אסדר", "תסדר", "תסדרי", "יסדר", "תסדר", "נסדר", "תסדרו", "תסדרנה", "יסדרו", "תסדרנה"], imperative: ["סדר", "סדרי", "סדרו", "סדרנה"] },
  { rank: 46, infinitive: "להתקשר", translation: "звонить; связываться", root: "ק-ש-ר", binyan: "התפעל", difficulty: "medium", sourceUrl: "https://www.pealim.com/ru/dict/1971-lehitkasher/", present: ["מתקשר", "מתקשרת", "מתקשרים", "מתקשרות"], past: ["התקשרתי", "התקשרת", "התקשרת", "התקשר", "התקשרה", "התקשרנו", "התקשרתם", "התקשרתן", "התקשרו", "התקשרו"], future: ["אתקשר", "תתקשר", "תתקשרי", "יתקשר", "תתקשר", "נתקשר", "תתקשרו", "תתקשרנה", "יתקשרו", "תתקשרנה"], imperative: ["התקשר", "התקשרי", "התקשרו", "התקשרנה"] },
  { rank: 47, infinitive: "להתכתב", translation: "переписываться", root: "כ-ת-ב", binyan: "התפעל", difficulty: "medium", sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%9B%D7%AA%D7%91", present: ["מתכתב", "מתכתבת", "מתכתבים", "מתכתבות"], past: ["התכתבתי", "התכתבת", "התכתבת", "התכתב", "התכתבה", "התכתבנו", "התכתבתם", "התכתבתן", "התכתבו", "התכתבו"], future: ["אתכתב", "תתכתב", "תתכתבי", "יתכתב", "תתכתב", "נתכתב", "תתכתבו", "תתכתבנה", "יתכתבו", "תתכתבנה"], imperative: ["התכתב", "התכתבי", "התכתבו", "התכתבנה"] },
  { rank: 48, infinitive: "להתאמן", translation: "тренироваться", root: "א-מ-ן", binyan: "התפעל", difficulty: "medium", sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%90%D7%9E%D7%9F", present: ["מתאמן", "מתאמנת", "מתאמנים", "מתאמנות"], past: ["התאמנתי", "התאמנת", "התאמנת", "התאמן", "התאמנה", "התאמנו", "התאמנתם", "התאמנתן", "התאמנו", "התאמנו"], future: ["אתאמן", "תתאמן", "תתאמני", "יתאמן", "תתאמן", "נתאמן", "תתאמנו", "תתאמנה", "יתאמנו", "תתאמנה"], imperative: ["התאמן", "התאמני", "התאמנו", "התאמנה"] },
  { rank: 49, infinitive: "להתעניין", translation: "интересоваться", root: "ע-נ-י-ן", binyan: "התפעל", difficulty: "medium", sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%A2%D7%A0%D7%99%D7%99%D7%9F", present: ["מתעניין", "מתעניינת", "מתעניינים", "מתעניינות"], past: ["התעניינתי", "התעניינת", "התעניינת", "התעניין", "התעניינה", "התעניינו", "התעניינתם", "התעניינתן", "התעניינו", "התעניינו"], future: ["אתעניין", "תתעניין", "תתענייני", "יתעניין", "תתעניין", "נתעניין", "תתעניינו", "תתעניינה", "יתעניינו", "תתעניינה"], imperative: ["התעניין", "התענייני", "התעניינו", "התעניינה"] },
  { rank: 50, infinitive: "להסתדר", translation: "справляться; ладить; устраиваться", root: "ס-ד-ר", binyan: "התפעל", difficulty: "medium", sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%A1%D7%AA%D7%93%D7%A8", present: ["מסתדר", "מסתדרת", "מסתדרים", "מסתדרות"], past: ["הסתדרתי", "הסתדרת", "הסתדרת", "הסתדר", "הסתדרה", "הסתדרנו", "הסתדרתם", "הסתדרתן", "הסתדרו", "הסתדרו"], future: ["אסתדר", "תסתדר", "תסתדרי", "יסתדר", "תסתדר", "נסתדר", "תסתדרו", "תסתדרנה", "יסתדרו", "תסתדרנה"], imperative: ["הסתדר", "הסתדרי", "הסתדרו", "הסתדרנה"] },
  { rank: 51, infinitive: "להתכונן", translation: "готовиться", root: "כ-ו-ן", binyan: "התפעל", difficulty: "medium", sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%94%D7%AA%D7%9B%D7%95%D7%A0%D7%9F", present: ["מתכונן", "מתכוננת", "מתכוננים", "מתכוננות"], past: ["התכוננתי", "התכוננת", "התכוננת", "התכונן", "התכוננה", "התכוננו", "התכוננתם", "התכוננתן", "התכוננו", "התכוננו"], future: ["אתכונן", "תתכונן", "תתכונני", "יתכונן", "תתכונן", "נתכונן", "תתכוננו", "תתכוננה", "יתכוננו", "תתכוננה"], imperative: ["התכונן", "התכונני", "התכוננו", "התכוננה"] },
  { rank: 52, infinitive: "לעלות", translation: "подниматься; стоить", root: "ע-ל-ה", binyan: "פעל", difficulty: "medium", sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A2%D7%9C%D7%95%D7%AA", present: ["עולה", "עולה", "עולים", "עולות"], past: ["עליתי", "עלית", "עלית", "עלה", "עלתה", "עלינו", "עליתם", "עליתן", "עלו", "עלו"], future: ["אעלה", "תעלה", "תעלי", "יעלה", "תעלה", "נעלה", "תעלו", "תעלינה", "יעלו", "תעלינה"], imperative: ["עלה", "עלי", "עלו", "עלינה"] },
  { rank: 53, infinitive: "לרדת", translation: "спускаться; снижаться", root: "י-ר-ד", binyan: "פעל", difficulty: "medium", sourceUrl: "https://www.pealim.com/ru/search/?q=%D7%9C%D7%A8%D7%93%D7%AA", present: ["יורד", "יורדת", "יורדים", "יורדות"], past: ["ירדתי", "ירדת", "ירדת", "ירד", "ירדה", "ירדנו", "ירדתם", "ירדתן", "ירדו", "ירדו"], future: ["ארד", "תרד", "תרדי", "ירד", "תרד", "נרד", "תרדו", "תרדנה", "ירדו", "תרדנה"], imperative: ["רד", "רדי", "רדו", "רדנה"] },
];

export const PEALIM_FAST_CANDIDATE_VERBS_034_053: PealimVerifiedVerb[] = SPECS.map(makeVerb);

export const findFastCandidate034053DuplicateInfinitives = (): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const verb of PEALIM_FAST_CANDIDATE_VERBS_034_053) {
    if (seen.has(verb.infinitive_hebrew_plain)) duplicates.add(verb.infinitive_hebrew_plain);
    seen.add(verb.infinitive_hebrew_plain);
  }

  return [...duplicates];
};

export const assertFastCandidate034053 = (): void => {
  const duplicates = findFastCandidate034053DuplicateInfinitives();
  if (duplicates.length > 0) {
    throw new Error(`Duplicate infinitives in fast candidate 034-053: ${duplicates.join(", ")}`);
  }
};
