import { Verb } from "@/types/verb";

// New high-value infinitives for the user-facing dictionary.
// They intentionally do not duplicate existing full-conjugation records;
// if a duplicate still appears in the source data, verbs-unique.ts removes it
// by normalized Hebrew infinitive before rendering.
export const COMMON_ADDED_VERBS: Verb[] = [
  // פעל — Paal / Qal: very common everyday verbs
  { id: "common-paal-001", infinitive_hebrew: "לשבת", transcription_ru: "лашэ́вет", translation_ru: "сидеть", root: "ישב", binyan: "פעל", difficulty: "easy" },
  { id: "common-paal-002", infinitive_hebrew: "לשים", transcription_ru: "ласи́м", translation_ru: "класть, ставить", root: "שימ", binyan: "פעל", difficulty: "easy" },
  { id: "common-paal-003", infinitive_hebrew: "לצאת", transcription_ru: "лаце́т", translation_ru: "выходить", root: "יצא", binyan: "פעל", difficulty: "easy" },
  { id: "common-paal-004", infinitive_hebrew: "לחיות", transcription_ru: "лихйо́т", translation_ru: "жить", root: "חיה", binyan: "פעל", difficulty: "easy" },
  { id: "common-paal-005", infinitive_hebrew: "לקרות", transcription_ru: "ликро́т", translation_ru: "случаться, происходить", root: "קרה", binyan: "פעל", difficulty: "easy" },
  { id: "common-paal-006", infinitive_hebrew: "לעבור", transcription_ru: "лааво́р", translation_ru: "проходить, переезжать", root: "עבר", binyan: "פעל", difficulty: "easy" },
  { id: "common-paal-007", infinitive_hebrew: "לפתוח", transcription_ru: "лифто́ах", translation_ru: "открывать", root: "פתח", binyan: "פעל", difficulty: "easy" },
  { id: "common-paal-008", infinitive_hebrew: "לסגור", transcription_ru: "лисго́р", translation_ru: "закрывать", root: "סגר", binyan: "פעל", difficulty: "easy" },
  { id: "common-paal-009", infinitive_hebrew: "לגעת", transcription_ru: "лага́ат", translation_ru: "трогать, касаться", root: "נגע", binyan: "פעל", difficulty: "medium" },
  { id: "common-paal-010", infinitive_hebrew: "לבחור", transcription_ru: "ливхо́р", translation_ru: "выбирать", root: "בחר", binyan: "פעל", difficulty: "medium" },

  // נפעל — Nifal: common passive/reflexive/intransitive verbs
  { id: "common-nifal-001", infinitive_hebrew: "להישאר", transcription_ru: "леhишаэ́р", translation_ru: "оставаться", root: "שאר", binyan: "נפעל", difficulty: "medium" },
  { id: "common-nifal-002", infinitive_hebrew: "להיכנס", transcription_ru: "леhиканэ́с", translation_ru: "входить", root: "כנס", binyan: "נפעל", difficulty: "medium" },
  { id: "common-nifal-003", infinitive_hebrew: "להיפתח", transcription_ru: "леhипате́ах", translation_ru: "открываться", root: "פתח", binyan: "נפעל", difficulty: "medium" },
  { id: "common-nifal-004", infinitive_hebrew: "להיסגר", transcription_ru: "леhисаге́р", translation_ru: "закрываться", root: "סגר", binyan: "נפעל", difficulty: "medium" },
  { id: "common-nifal-005", infinitive_hebrew: "להימצא", transcription_ru: "леhимаце́", translation_ru: "находиться", root: "מצא", binyan: "נפעל", difficulty: "medium" },
  { id: "common-nifal-006", infinitive_hebrew: "להיראות", transcription_ru: "леhерао́т", translation_ru: "выглядеть, казаться", root: "ראה", binyan: "נפעל", difficulty: "medium" },
  { id: "common-nifal-007", infinitive_hebrew: "להיבנות", transcription_ru: "леhибано́т", translation_ru: "строиться", root: "בנה", binyan: "נפעל", difficulty: "medium" },
  { id: "common-nifal-008", infinitive_hebrew: "להישבר", transcription_ru: "леhишаве́р", translation_ru: "ломаться", root: "שבר", binyan: "נפעל", difficulty: "medium" },
  { id: "common-nifal-009", infinitive_hebrew: "להיגמר", transcription_ru: "леhигаме́р", translation_ru: "заканчиваться", root: "גמר", binyan: "נפעל", difficulty: "medium" },
  { id: "common-nifal-010", infinitive_hebrew: "להיזכר", transcription_ru: "леhизахе́р", translation_ru: "вспоминать", root: "זכר", binyan: "נפעל", difficulty: "medium" },

  // פיעל — Piel: common active/intensive verbs
  { id: "common-piel-001", infinitive_hebrew: "לבשל", transcription_ru: "леваше́ль", translation_ru: "готовить еду", root: "בשל", binyan: "פיעל", difficulty: "easy" },
  { id: "common-piel-002", infinitive_hebrew: "לנקות", transcription_ru: "ленако́т", translation_ru: "убирать, чистить", root: "נקה", binyan: "פיעל", difficulty: "easy" },
  { id: "common-piel-003", infinitive_hebrew: "לתקן", transcription_ru: "летаке́н", translation_ru: "чинить, исправлять", root: "תקנ", binyan: "פיעל", difficulty: "easy" },
  { id: "common-piel-004", infinitive_hebrew: "לצלם", transcription_ru: "лецале́м", translation_ru: "фотографировать", root: "צלמ", binyan: "פיעל", difficulty: "easy" },
  { id: "common-piel-005", infinitive_hebrew: "לשנות", transcription_ru: "лешано́т", translation_ru: "изменять", root: "שנה", binyan: "פיעל", difficulty: "medium" },
  { id: "common-piel-006", infinitive_hebrew: "לסדר", transcription_ru: "лесаде́р", translation_ru: "приводить в порядок", root: "סדר", binyan: "פיעל", difficulty: "easy" },
  { id: "common-piel-007", infinitive_hebrew: "לקלקל", transcription_ru: "лекалке́ль", translation_ru: "портить", root: "קלקל", binyan: "פיעל", difficulty: "medium" },
  { id: "common-piel-008", infinitive_hebrew: "לחזק", transcription_ru: "лехазе́к", translation_ru: "усиливать, укреплять", root: "חזק", binyan: "פיעל", difficulty: "medium" },
  { id: "common-piel-009", infinitive_hebrew: "לקצר", transcription_ru: "лекаце́р", translation_ru: "сокращать", root: "קצר", binyan: "פיעל", difficulty: "medium" },
  { id: "common-piel-010", infinitive_hebrew: "לשפר", transcription_ru: "лешапе́р", translation_ru: "улучшать", root: "שפר", binyan: "פיעל", difficulty: "medium" },

  // הפעיל — Hifil: common causative/everyday verbs
  { id: "common-hifil-001", infinitive_hebrew: "להרגיש", transcription_ru: "леhарги́ш", translation_ru: "чувствовать", root: "רגש", binyan: "הפעיל", difficulty: "easy" },
  { id: "common-hifil-002", infinitive_hebrew: "להראות", transcription_ru: "леhаро́т", translation_ru: "показывать", root: "ראה", binyan: "הפעיל", difficulty: "easy" },
  { id: "common-hifil-003", infinitive_hebrew: "להפסיק", transcription_ru: "леhафси́к", translation_ru: "останавливать, прекращать", root: "פסק", binyan: "הפעיל", difficulty: "easy" },
  { id: "common-hifil-004", infinitive_hebrew: "להמשיך", transcription_ru: "леhамши́х", translation_ru: "продолжать", root: "משכ", binyan: "הפעיל", difficulty: "easy" },
  { id: "common-hifil-005", infinitive_hebrew: "להחזיר", transcription_ru: "леhахзи́р", translation_ru: "возвращать", root: "חזר", binyan: "הפעיל", difficulty: "easy" },
  { id: "common-hifil-006", infinitive_hebrew: "להוריד", transcription_ru: "леhори́д", translation_ru: "опускать, скачивать", root: "ירד", binyan: "הפעיל", difficulty: "easy" },
  { id: "common-hifil-007", infinitive_hebrew: "להעלות", transcription_ru: "леhаало́т", translation_ru: "поднимать, загружать", root: "עלה", binyan: "הפעיל", difficulty: "medium" },
  { id: "common-hifil-008", infinitive_hebrew: "להכיר", transcription_ru: "леhаки́р", translation_ru: "знать, знакомиться", root: "נכר", binyan: "הפעיל", difficulty: "easy" },
  { id: "common-hifil-009", infinitive_hebrew: "להצליח", transcription_ru: "леhацли́ах", translation_ru: "успевать, добиваться успеха", root: "צלח", binyan: "הפעיל", difficulty: "easy" },
  { id: "common-hifil-010", infinitive_hebrew: "להכין", transcription_ru: "леhахи́н", translation_ru: "готовить, подготавливать", root: "כונ", binyan: "הפעיל", difficulty: "easy" },

  // התפעל — Hitpael: common reflexive/reciprocal verbs
  { id: "common-hitpael-001", infinitive_hebrew: "להתקשר", transcription_ru: "леhиткаше́р", translation_ru: "звонить, связываться", root: "קשר", binyan: "התפעל", difficulty: "easy" },
  { id: "common-hitpael-002", infinitive_hebrew: "להתכתב", transcription_ru: "леhиткате́в", translation_ru: "переписываться", root: "כתב", binyan: "התפעל", difficulty: "medium" },
  { id: "common-hitpael-003", infinitive_hebrew: "להתאמן", transcription_ru: "леhитаме́н", translation_ru: "тренироваться", root: "אמנ", binyan: "התפעל", difficulty: "easy" },
  { id: "common-hitpael-004", infinitive_hebrew: "להתעניין", transcription_ru: "леhитанье́н", translation_ru: "интересоваться", root: "ענינ", binyan: "התפעל", difficulty: "medium" },
  { id: "common-hitpael-005", infinitive_hebrew: "להתבלבל", transcription_ru: "леhитбальбе́ль", translation_ru: "путаться, confused", root: "בלבל", binyan: "התפעל", difficulty: "medium" },
  { id: "common-hitpael-006", infinitive_hebrew: "להתקדם", transcription_ru: "леhиткаде́м", translation_ru: "продвигаться", root: "קדמ", binyan: "התפעל", difficulty: "medium" },
  { id: "common-hitpael-007", infinitive_hebrew: "להתקרב", transcription_ru: "леhиткаре́в", translation_ru: "приближаться", root: "קרב", binyan: "התפעל", difficulty: "medium" },
  { id: "common-hitpael-008", infinitive_hebrew: "להתרגל", transcription_ru: "леhитраге́ль", translation_ru: "привыкать", root: "רגל", binyan: "התפעל", difficulty: "medium" },
  { id: "common-hitpael-009", infinitive_hebrew: "להסתדר", transcription_ru: "леhистаде́р", translation_ru: "справляться, устраиваться", root: "סדר", binyan: "התפעל", difficulty: "medium" },
  { id: "common-hitpael-010", infinitive_hebrew: "להתכונן", transcription_ru: "леhитконэ́н", translation_ru: "готовиться", root: "כונ", binyan: "התפעל", difficulty: "medium" },
];
