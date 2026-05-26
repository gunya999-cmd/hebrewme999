export type VerbDropCategory = "movement" | "food" | "communication" | "home" | "study" | "daily";

export interface VerbDropCard {
  id: string;
  infinitive_hebrew: string;
  transcription_ru: string;
  translation_ru: string;
  binyan: "פעל" | "נפעל" | "פיעל" | "הפעיל" | "התפעל";
  root: string;
  category: VerbDropCategory;
  visualType: string;
  frequencyRank: number;
}

export const VERB_DROP_CATEGORIES: Array<{ id: VerbDropCategory | "all"; title: string; desc: string; emoji: string }> = [
  { id: "movement", title: "Движение", desc: "идти, приходить, входить", emoji: "🚶" },
  { id: "food", title: "Еда и быт", desc: "есть, пить, покупать", emoji: "🍽️" },
  { id: "communication", title: "Общение", desc: "говорить, слушать, звонить", emoji: "💬" },
  { id: "home", title: "Дом", desc: "открывать, закрывать, убирать", emoji: "🏠" },
  { id: "study", title: "Учёба", desc: "читать, писать, понимать", emoji: "📚" },
  { id: "daily", title: "Каждый день", desc: "самые частые действия", emoji: "✨" },
  { id: "all", title: "Все глаголы", desc: "смешанная тренировка", emoji: "🎮" },
];

export const VERB_DROPS_SEED: VerbDropCard[] = [
  { id: "vd-001", infinitive_hebrew: "להיות", transcription_ru: "лиhйо́т", translation_ru: "быть", binyan: "פעל", root: "היה", category: "daily", visualType: "be", frequencyRank: 1 },
  { id: "vd-002", infinitive_hebrew: "לעשות", transcription_ru: "лаасо́т", translation_ru: "делать", binyan: "פעל", root: "עשה", category: "daily", visualType: "do", frequencyRank: 2 },
  { id: "vd-003", infinitive_hebrew: "ללכת", transcription_ru: "лале́хет", translation_ru: "идти", binyan: "פעל", root: "הלך", category: "movement", visualType: "walk", frequencyRank: 3 },
  { id: "vd-004", infinitive_hebrew: "לבוא", transcription_ru: "лаво́", translation_ru: "приходить", binyan: "פעל", root: "בוא", category: "movement", visualType: "come", frequencyRank: 4 },
  { id: "vd-005", infinitive_hebrew: "לדבר", transcription_ru: "ледабе́р", translation_ru: "говорить", binyan: "פיעל", root: "דבר", category: "communication", visualType: "speak", frequencyRank: 5 },
  { id: "vd-006", infinitive_hebrew: "לראות", transcription_ru: "лиръо́т", translation_ru: "видеть", binyan: "פעל", root: "ראה", category: "daily", visualType: "see", frequencyRank: 6 },
  { id: "vd-007", infinitive_hebrew: "לשמוע", transcription_ru: "лишמו́а", translation_ru: "слышать", binyan: "פעל", root: "שמע", category: "communication", visualType: "listen", frequencyRank: 7 },
  { id: "vd-008", infinitive_hebrew: "לדעת", transcription_ru: "лада́ат", translation_ru: "знать", binyan: "פעל", root: "ידע", category: "study", visualType: "know", frequencyRank: 8 },
  { id: "vd-009", infinitive_hebrew: "לרצות", transcription_ru: "лирцо́т", translation_ru: "хотеть", binyan: "פעל", root: "רצה", category: "daily", visualType: "want", frequencyRank: 9 },
  { id: "vd-010", infinitive_hebrew: "לתת", transcription_ru: "лате́т", translation_ru: "давать", binyan: "פעל", root: "נתנ", category: "daily", visualType: "give", frequencyRank: 10 },
  { id: "vd-011", infinitive_hebrew: "לקחת", transcription_ru: "лака́хат", translation_ru: "брать", binyan: "פעל", root: "לקח", category: "daily", visualType: "take", frequencyRank: 11 },
  { id: "vd-012", infinitive_hebrew: "לאכול", transcription_ru: "леэхо́ль", translation_ru: "есть", binyan: "פעל", root: "אכל", category: "food", visualType: "eat", frequencyRank: 12 },
  { id: "vd-013", infinitive_hebrew: "לשתות", transcription_ru: "лишто́т", translation_ru: "пить", binyan: "פעל", root: "שתה", category: "food", visualType: "drink", frequencyRank: 13 },
  { id: "vd-014", infinitive_hebrew: "לכתוב", transcription_ru: "лихто́в", translation_ru: "писать", binyan: "פעל", root: "כתב", category: "study", visualType: "write", frequencyRank: 14 },
  { id: "vd-015", infinitive_hebrew: "לקרוא", transcription_ru: "ликро́", translation_ru: "читать", binyan: "פעל", root: "קרא", category: "study", visualType: "read", frequencyRank: 15 },
  { id: "vd-016", infinitive_hebrew: "ללמוד", transcription_ru: "лилмо́д", translation_ru: "учиться", binyan: "פעל", root: "למד", category: "study", visualType: "study", frequencyRank: 16 },
  { id: "vd-017", infinitive_hebrew: "להבין", transcription_ru: "леhави́н", translation_ru: "понимать", binyan: "הפעיל", root: "בינ", category: "study", visualType: "understand", frequencyRank: 17 },
  { id: "vd-018", infinitive_hebrew: "לאהוב", transcription_ru: "леэhо́в", translation_ru: "любить", binyan: "פעל", root: "אהב", category: "daily", visualType: "love", frequencyRank: 18 },
  { id: "vd-019", infinitive_hebrew: "לעבוד", transcription_ru: "лааво́д", translation_ru: "работать", binyan: "פעל", root: "עבד", category: "daily", visualType: "work", frequencyRank: 19 },
  { id: "vd-020", infinitive_hebrew: "לחשוב", transcription_ru: "лахшо́в", translation_ru: "думать", binyan: "פעל", root: "חשב", category: "daily", visualType: "think", frequencyRank: 20 },
  { id: "vd-021", infinitive_hebrew: "לשאול", transcription_ru: "лишо́ль", translation_ru: "спрашивать", binyan: "פעל", root: "שאל", category: "communication", visualType: "ask", frequencyRank: 21 },
  { id: "vd-022", infinitive_hebrew: "לענות", transcription_ru: "лаано́т", translation_ru: "отвечать", binyan: "פעל", root: "ענה", category: "communication", visualType: "answer", frequencyRank: 22 },
  { id: "vd-023", infinitive_hebrew: "לשבת", transcription_ru: "лаше́вет", translation_ru: "сидеть", binyan: "פעל", root: "ישב", category: "home", visualType: "sit", frequencyRank: 23 },
  { id: "vd-024", infinitive_hebrew: "לשים", transcription_ru: "ласи́м", translation_ru: "класть", binyan: "פעל", root: "שימ", category: "home", visualType: "put", frequencyRank: 24 },
  { id: "vd-025", infinitive_hebrew: "לצאת", transcription_ru: "лаце́т", translation_ru: "выходить", binyan: "פעל", root: "יצא", category: "movement", visualType: "exit", frequencyRank: 25 },
  { id: "vd-026", infinitive_hebrew: "להיכנס", transcription_ru: "леhикане́с", translation_ru: "входить", binyan: "נפעל", root: "כנס", category: "movement", visualType: "enter", frequencyRank: 26 },
  { id: "vd-027", infinitive_hebrew: "להישאר", transcription_ru: "леhишаэ́р", translation_ru: "оставаться", binyan: "נפעל", root: "שאר", category: "daily", visualType: "stay", frequencyRank: 27 },
  { id: "vd-028", infinitive_hebrew: "לעבור", transcription_ru: "лааво́р", translation_ru: "проходить / переезжать", binyan: "פעל", root: "עבר", category: "movement", visualType: "move", frequencyRank: 28 },
  { id: "vd-029", infinitive_hebrew: "להתחיל", transcription_ru: "леhатхи́ль", translation_ru: "начинать", binyan: "הפעיל", root: "חלל", category: "daily", visualType: "start", frequencyRank: 29 },
  { id: "vd-030", infinitive_hebrew: "להמשיך", transcription_ru: "леhамши́х", translation_ru: "продолжать", binyan: "הפעיל", root: "משכ", category: "daily", visualType: "continue", frequencyRank: 30 },
  { id: "vd-031", infinitive_hebrew: "להפסיק", transcription_ru: "леhафси́к", translation_ru: "прекращать", binyan: "הפעיל", root: "פסק", category: "daily", visualType: "stop", frequencyRank: 31 },
  { id: "vd-032", infinitive_hebrew: "לחזור", transcription_ru: "лахзо́р", translation_ru: "возвращаться", binyan: "פעל", root: "חזר", category: "movement", visualType: "return", frequencyRank: 32 },
  { id: "vd-033", infinitive_hebrew: "לקנות", transcription_ru: "ликно́т", translation_ru: "покупать", binyan: "פעל", root: "קנה", category: "food", visualType: "buy", frequencyRank: 33 },
  { id: "vd-034", infinitive_hebrew: "לשלם", transcription_ru: "лешале́м", translation_ru: "платить", binyan: "פיעל", root: "שלמ", category: "daily", visualType: "pay", frequencyRank: 34 },
  { id: "vd-035", infinitive_hebrew: "לפתוח", transcription_ru: "лифто́ах", translation_ru: "открывать", binyan: "פעל", root: "פתח", category: "home", visualType: "open", frequencyRank: 35 },
  { id: "vd-036", infinitive_hebrew: "לסגור", transcription_ru: "лисго́р", translation_ru: "закрывать", binyan: "פעל", root: "סגר", category: "home", visualType: "close", frequencyRank: 36 },
  { id: "vd-037", infinitive_hebrew: "לחפש", transcription_ru: "лехапе́с", translation_ru: "искать", binyan: "פיעל", root: "חפש", category: "daily", visualType: "search", frequencyRank: 37 },
  { id: "vd-038", infinitive_hebrew: "למצוא", transcription_ru: "лимцо́", translation_ru: "находить", binyan: "פעל", root: "מצא", category: "daily", visualType: "find", frequencyRank: 38 },
  { id: "vd-039", infinitive_hebrew: "להרגיש", transcription_ru: "леhарги́ш", translation_ru: "чувствовать", binyan: "הפעיל", root: "רגש", category: "daily", visualType: "feel", frequencyRank: 39 },
  { id: "vd-040", infinitive_hebrew: "להכיר", transcription_ru: "леhаки́р", translation_ru: "знакомиться / знать", binyan: "הפעיל", root: "נכר", category: "communication", visualType: "meet", frequencyRank: 40 },
  { id: "vd-041", infinitive_hebrew: "לבשל", transcription_ru: "леваше́ль", translation_ru: "готовить еду", binyan: "פיעל", root: "בשל", category: "food", visualType: "cook", frequencyRank: 41 },
  { id: "vd-042", infinitive_hebrew: "לנקות", transcription_ru: "ленако́т", translation_ru: "убирать", binyan: "פיעל", root: "נקה", category: "home", visualType: "clean", frequencyRank: 42 },
  { id: "vd-043", infinitive_hebrew: "לתקן", transcription_ru: "летаке́н", translation_ru: "чинить", binyan: "פיעל", root: "תקנ", category: "home", visualType: "fix", frequencyRank: 43 },
  { id: "vd-044", infinitive_hebrew: "לסדר", transcription_ru: "лесаде́р", translation_ru: "наводить порядок", binyan: "פיעל", root: "סדר", category: "home", visualType: "organize", frequencyRank: 44 },
  { id: "vd-045", infinitive_hebrew: "להתקשר", transcription_ru: "леhиткаше́р", translation_ru: "звонить", binyan: "התפעל", root: "קשר", category: "communication", visualType: "call", frequencyRank: 45 },
  { id: "vd-046", infinitive_hebrew: "להתכתב", transcription_ru: "леhиткате́в", translation_ru: "переписываться", binyan: "התפעל", root: "כתב", category: "communication", visualType: "message", frequencyRank: 46 },
  { id: "vd-047", infinitive_hebrew: "להתאמן", transcription_ru: "леhитаме́н", translation_ru: "тренироваться", binyan: "התפעל", root: "אמנ", category: "daily", visualType: "train", frequencyRank: 47 },
  { id: "vd-048", infinitive_hebrew: "להתעניין", transcription_ru: "леhитанье́н", translation_ru: "интересоваться", binyan: "התפעל", root: "ענינ", category: "study", visualType: "interest", frequencyRank: 48 },
  { id: "vd-049", infinitive_hebrew: "להסתדר", transcription_ru: "леhистаде́р", translation_ru: "справляться", binyan: "התפעל", root: "סדר", category: "daily", visualType: "manage", frequencyRank: 49 },
  { id: "vd-050", infinitive_hebrew: "להתכונן", transcription_ru: "леhитконэ́н", translation_ru: "готовиться", binyan: "התפעל", root: "כונ", category: "study", visualType: "prepare", frequencyRank: 50 },
];
