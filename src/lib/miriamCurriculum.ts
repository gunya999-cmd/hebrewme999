export type CefrLevel = "A1" | "A2" | "B1" | "B2";
export type Lesson = {
  id: string; level: CefrLevel; title: string; objective: string;
  minutes: number; vocabulary: string[]; grammar: string; challenge: string;
};
export const LESSONS: Lesson[] = [
  { id:"a1-greetings",level:"A1",title:"Приветствие и знакомство",objective:"Поздороваться, представиться и спросить имя",minutes:7,vocabulary:["שלום","קוראים לי","מה שלומך","נעים מאוד"],grammar:"Личные местоимения и фраза קוראים לי",challenge:"Представься и задай два вопроса" },
  { id:"a1-cafe",level:"A1",title:"Заказ в кафе",objective:"Заказать напиток и спросить цену",minutes:8,vocabulary:["אני רוצה","קפה","מים","כמה עולה"],grammar:"אני רוצה + существительное",challenge:"Закажи два товара и узнай стоимость" },
  { id:"a1-directions",level:"A1",title:"Как пройти?",objective:"Спросить дорогу и понять простые направления",minutes:8,vocabulary:["איפה","ימינה","שמאלה","ישר"],grammar:"Вопросительные слова и повелительные формы",challenge:"Спроси дорогу и повтори маршрут" },
  { id:"a2-shopping",level:"A2",title:"Покупки и размеры",objective:"Сравнить товары и попросить другой размер",minutes:9,vocabulary:["מידה","גדול","קטן","אפשר"],grammar:"Согласование прилагательных",challenge:"Выбери одежду, уточни размер и цену" },
  { id:"a2-past",level:"A2",title:"Что было вчера",objective:"Рассказать о прошедшем дне",minutes:9,vocabulary:["אתמול","הלכתי","אכלתי","ראיתי"],grammar:"Прошедшее время, первое лицо",challenge:"Расскажи о трёх событиях вчера" },
  { id:"a2-appointments",level:"A2",title:"Запись на приём",objective:"Назначить время и перенести встречу",minutes:8,vocabulary:["תור","פגישה","מחר","בשעה"],grammar:"Время и предлоги",challenge:"Запишись и затем попроси перенести время" },
  { id:"b1-work",level:"B1",title:"Работа и опыт",objective:"Описать опыт и обязанности",minutes:10,vocabulary:["ניסיון","אחריות","עבודה","למדתי"],grammar:"Связные высказывания в прошедшем и настоящем",challenge:"Опиши свой опыт за одну минуту" },
  { id:"b1-opinion",level:"B1",title:"Выразить мнение",objective:"Обосновать позицию и ответить на возражение",minutes:10,vocabulary:["לדעתי","כי","למרות","מסכים"],grammar:"Причина и уступка",challenge:"Выскажи мнение и приведи два аргумента" },
  { id:"b1-story",level:"B1",title:"Рассказать историю",objective:"Связно описать события",minutes:10,vocabulary:["בהתחלה","אחר כך","פתאום","בסוף"],grammar:"Последовательность событий",challenge:"Расскажи историю с началом, поворотом и концом" },
  { id:"b2-debate",level:"B2",title:"Дискуссия",objective:"Защитить позицию и рассмотреть альтернативу",minutes:10,vocabulary:["מצד אחד","מצד שני","לעומת זאת","לסיכום"],grammar:"Сложные связки и контраргументы",challenge:"Проведи короткие дебаты с Мирьям" },
  { id:"b2-media",level:"B2",title:"Медиа и критическое мышление",objective:"Отделить факт от мнения",minutes:10,vocabulary:["מקור","טענה","ראיה","אמינות"],grammar:"Косвенная речь и модальность",challenge:"Проанализируй вымышленную новость без неподтверждённых фактов" },
  { id:"b2-interview",level:"B2",title:"Сложное собеседование",objective:"Уверенно отвечать на уточняющие вопросы",minutes:10,vocabulary:["הישג","אתגר","פתרון","יוזמה"],grammar:"Развёрнутые объяснения и условные конструкции",challenge:"Ответь на три сложных вопроса о своём опыте" }
];
export type ReviewItem = { term: string; translation?: string; dueAt: number; intervalDays: number; repetitions: number };
export function nextReview(item: ReviewItem, correct: boolean, now = Date.now()): ReviewItem {
  const intervalDays = correct ? (item.repetitions === 0 ? 1 : item.repetitions === 1 ? 3 : Math.min(item.intervalDays * 2, 60)) : 1;
  return {...item, repetitions: correct ? item.repetitions + 1 : 0, intervalDays, dueAt: now + intervalDays * 86400000};
}
export function lessonPrompt(lesson: Lesson): string {
  return `את מרים, מורה לעברית ישראלית. זהו שיעור מובנה של ${lesson.minutes} דקות ברמת ${lesson.level}.
מטרה: ${lesson.objective}. מילים: ${lesson.vocabulary.join(", ")}. דקדוק: ${lesson.grammar}.
התחילי בהסבר קצר ברוסית למתחילים ברמת A1, ואז תרגלי בעיקר בעברית. ברמת A2 אפשר להסביר ברוסית רק כשמבקשים. ברמות B1-B2 דברי בעיקר בעברית.
מבנה: דקה אחת הסבר, שתי דקות דוגמה, שלוש עד חמש דקות תרגול אינטראקטיבי, ואז מבחן קצר. שאלי שאלה אחת בכל פעם, חכי לתשובה, תני משוב קצר ומדויק. אל תטעני שזיהית שגיאת הגייה אם השמע לא ברור. אל תמציאי ציון הגייה מדויק. במשימת הסיום: ${lesson.challenge}. בסוף הציגי סיכום, עד שלוש שגיאות עם תיקון ודוגמאות לחזרה, וציון ידע משוער מתוך 5 לפי התשובות שניתנו. אל תסיימי את השיחה אוטומטית.`;
}
