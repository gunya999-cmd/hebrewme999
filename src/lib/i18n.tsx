import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AppLanguage = "ru" | "en" | "he";
const STORAGE_KEY = "hebrewme.app.language.v1";

export const languageNames: Record<AppLanguage, string> = {
  ru: "Русский",
  en: "English",
  he: "עברית",
};

// Each entry is [English, Hebrew]; Russian is the canonical fallback.
const translations: Record<string, readonly [string, string]> = {
  "Язык приложения": [
    "App language",
    "שפת האפליקציה"
  ],
  "Русский": [
    "Русский",
    "Русский"
  ],
  "English": [
    "English",
    "English"
  ],
  "Сегодня": [
    "Today",
    "היום"
  ],
  "Глаголы": [
    "Verbs",
    "פעלים"
  ],
  "Практика": [
    "Practice",
    "תרגול"
  ],
  "Игры": [
    "Games",
    "משחקים"
  ],
  "Ракель": [
    "Rachel",
    "רחל"
  ],
  "Основная навигация": [
    "Main navigation",
    "ניווט ראשי"
  ],
  "Практический иврит каждый день": [
    "Practical Hebrew, every day",
    "עברית שימושית בכל יום"
  ],
  "Маленькие занятия — устойчивый навык": [
    "Small lessons, lasting progress",
    "שיעורים קצרים, התקדמות מתמשכת"
  ],
  "Иврит через действия": [
    "Learn Hebrew by doing",
    "לומדים עברית דרך עשייה"
  ],
  "Говори с Ракель, тренируй глаголы и закрепляй материал в удобном темпе.": [
    "Talk with Rachel, practice verbs, and learn at your own pace.",
    "לדבר עם רחל, לתרגל פעלים וללמוד בקצב שלך."
  ],
  "Начать 5 минут": [
    "Start 5 minutes",
    "מתחילים ב־5 דקות"
  ],
  "Говорить с Ракель": [
    "Talk to Rachel",
    "לדבר עם רחל"
  ],
  "Изучено глаголов": [
    "Verbs learned",
    "פעלים שנלמדו"
  ],
  "Прогресс изучения": [
    "Learning progress",
    "התקדמות בלמידה"
  ],
  "Доля изученных глаголов": [
    "Verbs learned",
    "אחוז הפעלים שנלמדו"
  ],
  "из": [
    "of",
    "מתוך"
  ],
  "Твой ритм": [
    "Your pace",
    "הקצב שלך"
  ],
  "новых слов": [
    "new words",
    "מילים חדשות"
  ],
  "повторений сделано": [
    "reviews completed",
    "חזרות שבוצעו"
  ],
  "пора повторить": [
    "due for review",
    "ממתינות לחזרה"
  ],
  "Что делать дальше": [
    "What's next",
    "מה עכשיו"
  ],
  "Выбери формат": [
    "Choose a format",
    "בחרו דרך ללמוד"
  ],
  "Разговор с Ракель": [
    "Talk with Rachel",
    "שיחה עם רחל"
  ],
  "Уроки A1–B2 и диалоги в реальных ситуациях": [
    "A1–B2 lessons and real-life conversations",
    "שיעורי A1–B2 ושיחות מחיי היום־יום"
  ],
  "Выбрать урок": [
    "Choose a lesson",
    "בחירת שיעור"
  ],
  "Глаголопад": [
    "Verb Drop",
    "מפולת הפעלים"
  ],
  "Вспомнить перевод и формы глагола в игре": [
    "Practice meanings and verb forms through play",
    "תרגול משמעויות ונטיות פועל במשחק"
  ],
  "Играть": [
    "Play",
    "משחקים"
  ],
  "Словарь и формы": [
    "Dictionary and forms",
    "מילון ונטיות"
  ],
  "Разобрать значение, корень и спряжение": [
    "Explore meanings, roots and conjugations",
    "לגלות משמעויות, שורשים ונטיות"
  ],
  "Открыть словарь": [
    "Open dictionary",
    "פתיחת מילון"
  ],
  "Другие тренировки": [
    "More practice",
    "תרגולים נוספים"
  ],
  "Учись в своём темпе": [
    "Learn at your own pace",
    "ללמוד בקצב שלך"
  ],
  "Словарь глаголов": [
    "Verb dictionary",
    "מילון פעלים"
  ],
  "Значения, формы и примеры": [
    "Meanings, forms and examples",
    "משמעויות, נטיות ודוגמאות"
  ],
  "Тренировка на слух": [
    "Listening practice",
    "תרגול שמיעה"
  ],
  "Слушай и отвечай голосом": [
    "Listen and answer aloud",
    "להקשיב ולענות בקול"
  ],
  "Предлоги": [
    "Prepositions",
    "מילות יחס"
  ],
  "Употребление в речи": [
    "Usage in conversation",
    "שימוש בשיחה"
  ],
  "Местоименные формы": [
    "Pronoun forms",
    "צורות כינוי"
  ],
  "Живые фразы": [
    "Everyday phrases",
    "ביטויים יומיומיים"
  ],
  "Язык повседневных ситуаций": [
    "Everyday conversational Hebrew",
    "עברית למצבי יום־יום"
  ],
  "Все игры": [
    "All games",
    "כל המשחקים"
  ],
  "Формы, корни и беньяны": [
    "Forms, roots and verb patterns",
    "נטיות, שורשים ובניינים"
  ],
  "О приложении": [
    "About the app",
    "על האפליקציה"
  ],
  "Познакомься с создателями — семьёй Гуревич.": [
    "Meet the creators: the Gurevich family.",
    "הכירו את היוצרים: משפחת גורביץ'."
  ],
  "О приложении и создателях": [
    "About the app and its creators",
    "על האפליקציה והיוצרים"
  ],
  "Создатели HebrewMe": [
    "HebrewMe creators",
    "יוצרי HebrewMe"
  ],
  "HebrewMe — семейный проект для изучения и практики иврита. Его создатели — семья Гуревич.": [
    "HebrewMe is a family project for learning and practicing Hebrew, created by the Gurevich family.",
    "HebrewMe הוא פרויקט משפחתי ללימוד ולתרגול עברית, שנוצר בידי משפחת גורביץ'."
  ],
  "Семья Гуревич": [
    "The Gurevich family",
    "משפחת גורביץ'"
  ],
  "Наша команда": [
    "Our team",
    "הצוות שלנו"
  ],
  "Создатели приложения": [
    "App creators",
    "יוצרי האפליקציה"
  ],
  "Создано с любовью": [
    "Made with love",
    "נוצר באהבה"
  ],
  "На главную": [
    "Back to home",
    "חזרה לדף הבית"
  ],
  "Навигация по разделу": [
    "Section navigation",
    "ניווט במדור"
  ],
  "Слова и формы": [
    "Words and forms",
    "מילים ונטיות"
  ],
  "Ищи по переводу, ивриту, транскрипции или корню.": [
    "Search by translation, Hebrew, transliteration or root.",
    "חיפוש לפי תרגום, עברית, תעתיק או שורש."
  ],
  "Поиск и фильтры": [
    "Search and filters",
    "חיפוש וסינון"
  ],
  "Найти глагол": [
    "Find a verb",
    "חיפוש פועל"
  ],
  "Например: идти или ללכת": [
    "E.g. to go or ללכת",
    "למשל ללכת או to go"
  ],
  "Очистить поиск": [
    "Clear search",
    "ניקוי החיפוש"
  ],
  "Беньян": [
    "Verb pattern",
    "בניין"
  ],
  "Все": [
    "All",
    "הכול"
  ],
  "Ничего не найдено": [
    "Nothing found",
    "לא נמצאו תוצאות"
  ],
  "Попробуй другую форму слова или убери фильтр беньяна.": [
    "Try another word form or remove the verb-pattern filter.",
    "נסו צורה אחרת או הסירו את סינון הבניין."
  ],
  "Сбросить фильтры": [
    "Reset filters",
    "איפוס סינונים"
  ],
  "Уровень освоения:": [
    "Mastery level:",
    "רמת שליטה:"
  ],
  "из 5": [
    "of 5",
    "מתוך 5"
  ],
  "Тренировка навыков": [
    "Skill practice",
    "תרגול מיומנויות"
  ],
  "Игры и практика": [
    "Games and practice",
    "משחקים ותרגול"
  ],
  "Быстрая практика": [
    "Quick practice",
    "תרגול מהיר"
  ],
  "Повторяй значения, формы и времена в короткой игре. Подходит для ежедневной тренировки.": [
    "Review meanings, forms and tenses in a short game. Great for daily practice.",
    "חזרה על משמעויות, נטיות וזמנים במשחק קצר לתרגול יומי."
  ],
  "По направлениям": [
    "By skill",
    "לפי מיומנות"
  ],
  "Остальные тренажёры": [
    "More exercises",
    "תרגולים נוספים"
  ],
  "Выбери один навык, который хочешь улучшить сейчас.": [
    "Choose a skill to improve right now.",
    "בחרו מיומנות לתרגול עכשיו."
  ],
  "Открыть": [
    "Open",
    "פתיחה"
  ],
  "Вернуться на главную": [
    "Back to home",
    "חזרה לדף הבית"
  ],
  "Тренажёр формы": [
    "Form trainer",
    "תרגול נטיות"
  ],
  "Выбери форму, разберись в ошибке и попробуй снова": [
    "Choose a form, learn from mistakes and try again",
    "בחרו נטייה, למדו מהטעויות ונסו שוב"
  ],
  "Формы": [
    "Forms",
    "נטיות"
  ],
  "Собери форму": [
    "Build the form",
    "בניית נטייה"
  ],
  "Складывай глаголы из букв": [
    "Build verb forms from letters",
    "הרכבת פעלים מאותיות"
  ],
  "Письмо": [
    "Writing",
    "כתיבה"
  ],
  "Найди корень": [
    "Find the root",
    "מציאת השורש"
  ],
  "Определи корневые буквы глагола": [
    "Identify the verb's root letters",
    "זיהוי אותיות השורש של הפועל"
  ],
  "Корни": [
    "Roots",
    "שורשים"
  ],
  "Узнай модель": [
    "Recognize the pattern",
    "זיהוי הבניין"
  ],
  "Различай семь беньянов": [
    "Distinguish the seven verb patterns",
    "הבחנה בין שבעת הבניינים"
  ],
  "Грамматика": [
    "Grammar",
    "דקדוק"
  ],
  "Уличный разговор": [
    "Street talk",
    "שפת רחוב"
  ],
  "Живые фразы для повседневных ситуаций": [
    "Useful phrases for everyday situations",
    "ביטויים לשימוש יומיומי"
  ],
  "Разговор": [
    "Conversation",
    "שיחה"
  ],
  "Вставь предлог": [
    "Fill in the preposition",
    "השלמת מילת יחס"
  ],
  "Подбери правильный предлог в предложении": [
    "Choose the right preposition in a sentence",
    "בחירת מילת היחס הנכונה במשפט"
  ],
  "Спряжение голосом": [
    "Voice conjugation",
    "נטיות בקול"
  ],
  "Произноси инфинитив и меняй форму": [
    "Say the infinitive and change the form",
    "אמירת שם הפועל ושינוי הנטייה"
  ],
  "Аудио": [
    "Audio",
    "שמע"
  ],
  "AI Репетитор": [
    "AI Tutor",
    "מורה AI"
  ],
  "Разговорная практика": [
    "Speaking practice",
    "תרגול דיבור"
  ],
  "Привет, я Ракель": [
    "Hi, I'm Rachel",
    "שלום, אני רחל"
  ],
  "Выбирай урок или жизненную ситуацию. Мы будем разговаривать на иврите, а сложные моменты разберём по ходу.": [
    "Choose a lesson or a real-life scenario. We'll speak Hebrew and work through tricky parts together.",
    "בחרו שיעור או מצב מחיי היום־יום. נדבר בעברית ונעבור יחד על הדברים המאתגרים."
  ],
  "Уроки A1–B2": [
    "A1–B2 lessons",
    "שיעורי A1–B2"
  ],
  "Разговор голосом": [
    "Voice conversation",
    "שיחה קולית"
  ],
  "Повторение слов": [
    "Vocabulary review",
    "חזרה על מילים"
  ],
  "Позвонить Ракель": [
    "Call Rachel",
    "להתקשר לרחל"
  ],
  "Для разговора потребуется доступ к микрофону и подключение к голосовому сервису.": [
    "You need microphone access and a voice-service connection to start a call.",
    "לשיחה נדרשים אישור גישה למיקרופון וחיבור לשירות הקולי."
  ],
  "Аватар Ракель": [
    "Rachel's avatar",
    "דמותה של רחל"
  ],
  "Обучение по шагам": [
    "Step by step",
    "למידה שלב אחר שלב"
  ],
  "Уроки с Ракель": [
    "Lessons with Rachel",
    "שיעורים עם רחל"
  ],
  "Уровень языка": [
    "Language level",
    "רמת השפה"
  ],
  "Без учебника": [
    "Beyond the textbook",
    "מחוץ לספר הלימוד"
  ],
  "Попробуй в жизни": [
    "Real-life practice",
    "תרגול מצבי חיים"
  ],
  "Выбери ситуацию — Ракель начнёт разговор по теме.": [
    "Choose a scenario and Rachel will start the conversation.",
    "בחרו מצב ורחל תפתח בשיחה בנושא."
  ],
  "Закрепление": [
    "Review",
    "חזרה"
  ],
  "Повторить слова": [
    "Review words",
    "חזרה על מילים"
  ],
  "Пока нет слов, срок повторения которых наступил. Они появятся здесь после уроков.": [
    "No words to review yet. They'll appear here after your lessons.",
    "עדיין אין מילים לחזרה. הן יופיעו כאן לאחר השיעורים."
  ],
  "Ещё учить": [
    "Keep learning",
    "להמשיך ללמוד"
  ],
  "Помню": [
    "I remember",
    "זוכר/ת"
  ],
  "Свободный разговор": [
    "Free conversation",
    "שיחה חופשית"
  ],
  "Просто поговори со мной на любую тему": [
    "Let's talk about anything",
    "בואו נדבר על כל נושא"
  ],
  "В кафе": [
    "At a café",
    "בבית קפה"
  ],
  "Закажи кофе и поболтай с официанткой": [
    "Order a coffee and chat with the server",
    "להזמין קפה ולשוחח עם המלצרית"
  ],
  "В такси": [
    "In a taxi",
    "במונית"
  ],
  "Объясни водителю, куда едешь": [
    "Tell the driver where you're going",
    "להסביר לנהג לאן נוסעים"
  ],
  "На рынке": [
    "At the market",
    "בשוק"
  ],
  "Поторгуйся с продавцом на шуке": [
    "Bargain with a market vendor",
    "להתמקח עם מוכר בשוק"
  ],
  "У врача": [
    "At the doctor",
    "אצל הרופא"
  ],
  "Расскажи, что болит": [
    "Explain what's wrong",
    "לתאר מה כואב"
  ],
  "В аэропорту": [
    "At the airport",
    "בנמל התעופה"
  ],
  "Пройди паспортный контроль": [
    "Go through passport control",
    "לעבור ביקורת דרכונים"
  ],
  "Встреча с другом": [
    "Meeting a friend",
    "מפגש עם חבר"
  ],
  "Поболтайте о выходных": [
    "Chat about the weekend",
    "לשוחח על סוף השבוע"
  ],
  "Собеседование": [
    "Job interview",
    "ראיון עבודה"
  ],
  "Расскажи о себе работодателю": [
    "Tell an employer about yourself",
    "לספר על עצמכם למעסיק"
  ],
  "Новости и культура": [
    "News and culture",
    "חדשות ותרבות"
  ],
  "Обсуди свежие темы Израиля": [
    "Discuss current topics in Israel",
    "לדון בנושאים אקטואליים בישראל"
  ],
  "Глагол не найден": [
    "Verb not found",
    "הפועל לא נמצא"
  ],
  "Вернуться в словарь": [
    "Back to dictionary",
    "חזרה למילון"
  ],
  "карточка глагола": [
    "verb card",
    "כרטיס פועל"
  ],
  "Корень:": [
    "Root:",
    "שורש:"
  ],
  "Слушать инфинитив": [
    "Listen to the infinitive",
    "השמעת שם הפועל"
  ],
  "Тренировать в игре": [
    "Practice in a game",
    "תרגול במשחק"
  ],
  "Время глагола": [
    "Verb tense",
    "זמן הפועל"
  ],
  "В этом времени нет форм для этого глагола.": [
    "No forms available for this verb in this tense.",
    "אין נטיות לפועל הזה בזמן הזה."
  ],
  "Спряжения пока не подключены для этого глагола.": [
    "Conjugations aren't available for this verb yet.",
    "נטיות הפועל עדיין אינן זמינות."
  ],
  "Назад": [
    "Back",
    "חזרה"
  ],
  "Сбросить": [
    "Reset",
    "איפוס"
  ],
  "Слушать": [
    "Listen",
    "השמעה"
  ],
  "Слушать фразу": [
    "Listen to phrase",
    "השמעת ביטוי"
  ],
  "Страница не найдена": [
    "Page not found",
    "הדף לא נמצא"
  ],
  "Предлоги, союзы и частицы": [
    "Prepositions, conjunctions and particles",
    "מילות יחס, מילות קישור ומילות תפקוד"
  ],
  "Фразы для реальной жизни": [
    "Phrases for real life",
    "ביטויים לחיי היום־יום"
  ],
  "живой иврит": [
    "Living Hebrew",
    "עברית חיה"
  ],
  "Улица, магазин, транспорт, школа, работа, соседи, спортзал, реакции, слэнг и резкие фразы без тяжёлого мата.": [
    "Streets, shops, transport, school, work, neighbors, gyms, reactions, slang and strong expressions.",
    "רחוב, חנויות, תחבורה, לימודים, עבודה, שכנים, חדר כושר, תגובות וסלנג."
  ],
  "нейтр.": [
    "neutral",
    "ניטרלי"
  ],
  "друж.": [
    "friendly",
    "ידידותי"
  ],
  "сленг": [
    "slang",
    "סלנג"
  ],
  "резко": [
    "strong",
    "בוטה"
  ],
  "срочно": [
    "urgent",
    "דחוף"
  ],
  "Поиск: жарко, автобус, отстань, gym...": [
    "Search: hot, bus, leave me alone, gym...",
    "חיפוש: חם, אוטובוס, עזוב אותי, חדר כושר..."
  ],
  "Метки `резко` и `срочно` — для понимания речи и защиты границ. Использовать осторожно: тон в иврите часто важнее самой фразы.": [
    "The strong and urgent tags help you understand speech and set boundaries. Use with care: tone matters.",
    "הסימונים 'בוטה' ו'דחוף' עוזרים להבין דיבור ולהציב גבולות. השתמשו בזהירות."
  ],
  "Попробуй другой запрос или категорию.": [
    "Try a different search or category.",
    "נסו חיפוש או קטגוריה אחרים."
  ],
  "грамматика": [
    "grammar",
    "דקדוק"
  ],
  "Предлоги + местоимения": [
    "Prepositions + pronouns",
    "מילות יחס וכינויים"
  ],
  "Личные, объектные, притяжательные и основные формы: לי, אותי, שלי, עליו, ממך, איתי, אצלי, בשבילך.": [
    "Personal, object and possessive forms: לי, אותי, שלי, עליו, ממך, איתי, אצלי, בשבילך.",
    "כינויים אישיים, כינויי מושא ושייכות: לי, אותי, שלי, עליו, ממך, איתי, אצלי, בשבילך."
  ],
  "Поиск: אותי, עליו, тебе, как я...": [
    "Search: אותי, עליו, you, like me...",
    "חיפוש: אותי, עליו, לך, כמוני..."
  ],
  "Слова и фразы": [
    "Words and phrases",
    "מילים וביטויים"
  ],
  "50 нужных слов и фраз • голос Мирьям": [
    "50 useful words and phrases • voice audio",
    "50 מילים וביטויים שימושיים • שמע"
  ],
  "Поиск…": [
    "Search…",
    "חיפוש…"
  ],
  "Скорость:": [
    "Speed:",
    "מהירות:"
  ],
  "Не удалось воспроизвести": [
    "Could not play audio",
    "אי אפשר להשמיע"
  ],
  "Нет аудио": [
    "No audio",
    "אין שמע"
  ],
  "Попробуй другую форму, перевод или категорию.": [
    "Try another form, translation or category.",
    "נסו נטייה, תרגום או קטגוריה אחרים."
  ]
};

function loadLanguage(): AppLanguage {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ru" || stored === "en" || stored === "he") return stored;
  } catch {
    // Private-browsing/storage-restricted environments still work.
  }
  return "ru";
}

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (value: AppLanguage) => void;
  t: (russianText: string) => string;
};
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, changeLanguage] = useState<AppLanguage>(loadLanguage);
  const setLanguage = (value: AppLanguage) => {
    changeLanguage(value);
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch { /* storage unavailable */ }
  };
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "he" ? "rtl" : "ltr";
  }, [language]);
  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    t: (russianText) => {
      if (language === "ru") return russianText;
      const text = russianText.trim();
      const translated = translations[text]?.[language === "en" ? 0 : 1];
      return translated ?? russianText;
    },
  }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage requires LanguageProvider");
  return value;
}
