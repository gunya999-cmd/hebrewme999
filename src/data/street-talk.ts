export type StreetTalkCategory =
  | "all"
  | "greetings"
  | "street"
  | "shop"
  | "transport"
  | "airport"
  | "school"
  | "work"
  | "gym"
  | "neighbors"
  | "emotions"
  | "slang"
  | "boundaries";

export interface StreetTalkPhrase {
  id: string;
  category: Exclude<StreetTalkCategory, "all">;
  hebrew: string;
  transcription: string;
  russian: string;
  context: string;
  tone: "neutral" | "friendly" | "slang" | "rude" | "urgent";
}

export const STREET_TALK_CATEGORIES: Array<{ id: StreetTalkCategory; title: string; desc: string; mark: string }> = [
  { id: "all", title: "Все", desc: "живые фразы", mark: "100" },
  { id: "greetings", title: "Встреча", desc: "привет, как дела", mark: "היי" },
  { id: "street", title: "Улица", desc: "дорога, прохожие", mark: "רח" },
  { id: "shop", title: "Магазин", desc: "касса, цена, очередь", mark: "₪" },
  { id: "transport", title: "Транспорт", desc: "автобус, место, выход", mark: "קו" },
  { id: "airport", title: "Аэропорт", desc: "регистрация, посадка, багаж", mark: "✈" },
  { id: "school", title: "Школа", desc: "учитель, дети, урок", mark: "כת" },
  { id: "work", title: "Работа", desc: "офис, задачи", mark: "עב" },
  { id: "gym", title: "Спортзал", desc: "подходы, тренажёры", mark: "כח" },
  { id: "neighbors", title: "Соседи", desc: "дом, лифт, шум", mark: "בנ" },
  { id: "emotions", title: "Реакции", desc: "круто, жарко, устал", mark: "ווא" },
  { id: "slang", title: "Слэнг", desc: "разговорная речь", mark: "יאל" },
  { id: "boundaries", title: "Границы", desc: "отстань, что делаешь", mark: "די" },
];

export const STREET_TALK_PHRASES: StreetTalkPhrase[] = [
  { id: "st-001", category: "greetings", hebrew: "מה נשמע?", transcription: "ма нишма?", russian: "Как дела? Что слышно?", context: "встреча знакомого", tone: "friendly" },
  { id: "st-002", category: "greetings", hebrew: "מה קורה?", transcription: "ма коре?", russian: "Как дела? Что происходит?", context: "очень частое разговорное приветствие", tone: "friendly" },
  { id: "st-003", category: "greetings", hebrew: "הכול טוב?", transcription: "аколь тов?", russian: "Всё хорошо?", context: "быстрый вопрос знакомому", tone: "neutral" },
  { id: "st-004", category: "greetings", hebrew: "בסדר, תודה", transcription: "беседер, тода", russian: "Нормально, спасибо", context: "короткий ответ", tone: "neutral" },
  { id: "st-005", category: "greetings", hebrew: "יאללה, נדבר", transcription: "яла, недабер", russian: "Ладно, поговорим", context: "закончить разговор", tone: "slang" },
  { id: "st-006", category: "greetings", hebrew: "נתראה", transcription: "нитраэ", russian: "Увидимся", context: "прощание", tone: "neutral" },
  { id: "st-007", category: "greetings", hebrew: "שיהיה לך יום טוב", transcription: "ше-йие леха йом тов", russian: "Хорошего тебе дня", context: "вежливое прощание", tone: "friendly" },

  { id: "st-008", category: "street", hebrew: "סליחה, איך מגיעים ל...?", transcription: "слиха, эйх магиим ле...?", russian: "Извините, как пройти / доехать до...?", context: "спросить дорогу", tone: "neutral" },
  { id: "st-009", category: "street", hebrew: "זה רחוק מפה?", transcription: "зе рахок ми-по?", russian: "Это далеко отсюда?", context: "на улице", tone: "neutral" },
  { id: "st-010", category: "street", hebrew: "אני מחפש את הרחוב הזה", transcription: "ани мехапес эт а-рехов а-зе", russian: "Я ищу эту улицу", context: "прохожему", tone: "neutral" },
  { id: "st-011", category: "street", hebrew: "אפשר לעבור?", transcription: "эфшар лаавор?", russian: "Можно пройти?", context: "толпа, проход, узкое место", tone: "neutral" },
  { id: "st-012", category: "street", hebrew: "זה בכיוון הזה?", transcription: "зе бе-кивун а-зе?", russian: "Это в эту сторону?", context: "уточнить направление", tone: "neutral" },
  { id: "st-013", category: "street", hebrew: "רגע, אני בודק במפה", transcription: "рэга, ани бодек ба-мапа", russian: "Секунду, я проверяю на карте", context: "поиск маршрута", tone: "neutral" },
  { id: "st-014", category: "street", hebrew: "תיזהר!", transcription: "тизахер!", russian: "Осторожно!", context: "предупреждение", tone: "urgent" },
  { id: "st-015", category: "street", hebrew: "יש פה מעבר חצייה?", transcription: "еш по маавар хация?", russian: "Здесь есть пешеходный переход?", context: "улица", tone: "neutral" },

  { id: "st-016", category: "shop", hebrew: "כמה זה עולה?", transcription: "кама зе оле?", russian: "Сколько это стоит?", context: "магазин, рынок", tone: "neutral" },
  { id: "st-017", category: "shop", hebrew: "יש מבצע?", transcription: "еш мивца?", russian: "Есть акция / скидка?", context: "магазин", tone: "neutral" },
  { id: "st-018", category: "shop", hebrew: "אפשר לשלם באשראי?", transcription: "эфшар лешалем бе-ашрай?", russian: "Можно оплатить картой?", context: "касса", tone: "neutral" },
  { id: "st-019", category: "shop", hebrew: "אפשר שקית?", transcription: "эфшар сакит?", russian: "Можно пакет?", context: "касса", tone: "neutral" },
  { id: "st-020", category: "shop", hebrew: "אני רק מסתכל", transcription: "ани рак мистакель", russian: "Я просто смотрю", context: "продавец подошёл", tone: "neutral" },
  { id: "st-021", category: "shop", hebrew: "יש מידה אחרת?", transcription: "еш мида ахерет?", russian: "Есть другой размер?", context: "одежда, обувь", tone: "neutral" },
  { id: "st-022", category: "shop", hebrew: "זה יקר מדי", transcription: "зе якар мидай", russian: "Это слишком дорого", context: "рынок, магазин", tone: "neutral" },
  { id: "st-023", category: "shop", hebrew: "אני בתור", transcription: "ани ба-тор", russian: "Я в очереди", context: "кто-то пытается пройти", tone: "neutral" },

  { id: "st-024", category: "transport", hebrew: "אתה יורד בתחנה הבאה?", transcription: "ата йоред ба-тахана а-баа?", russian: "Вы выходите на следующей остановке?", context: "автобус", tone: "neutral" },
  { id: "st-025", category: "transport", hebrew: "את יורדת בתחנה הבאה?", transcription: "ат йоредет ба-тахана а-баа?", russian: "Вы выходите на следующей остановке?", context: "обращение к женщине в автобусе", tone: "neutral" },
  { id: "st-026", category: "transport", hebrew: "אפשר לעבור? אני יורד", transcription: "эфшар лаавор? ани йоред", russian: "Можно пройти? Я выхожу", context: "транспорт", tone: "neutral" },
  { id: "st-027", category: "transport", hebrew: "רוצה לשבת?", transcription: "роце лашевет?", russian: "Хотите сесть?", context: "уступить место мужчине", tone: "friendly" },
  { id: "st-028", category: "transport", hebrew: "רוצה לשבת?", transcription: "роца лашевет?", russian: "Хотите сесть?", context: "уступить место женщине", tone: "friendly" },
  { id: "st-029", category: "transport", hebrew: "אני מפנה לך מקום", transcription: "ани мефане леха маком", russian: "Я уступаю вам место", context: "уступить место мужчине", tone: "friendly" },
  { id: "st-030", category: "transport", hebrew: "איזה קו מגיע לתחנה המרכזית?", transcription: "эйзе кав магиа ле-тахана а-мерказит?", russian: "Какой автобус идёт до центральной станции?", context: "остановка", tone: "neutral" },
  { id: "st-031", category: "transport", hebrew: "הקו הזה עוצר פה?", transcription: "а-кав а-зе оцер по?", russian: "Этот автобус здесь останавливается?", context: "остановка", tone: "neutral" },

  { id: "st-091", category: "airport", hebrew: "איפה דלפק הצ'ק-אין?", transcription: "эйфо дельпак а-чек-ин?", russian: "Где стойка регистрации?", context: "регистрация на рейс", tone: "neutral" },
  { id: "st-092", category: "airport", hebrew: "הנה הדרכון שלי", transcription: "инэ а-даркон шели", russian: "Вот мой паспорт", context: "стойка регистрации, паспортный контроль", tone: "neutral" },
  { id: "st-093", category: "airport", hebrew: "יש לי רק כבודת יד", transcription: "еш ли рак кводат яд", russian: "У меня только ручная кладь", context: "регистрация на рейс", tone: "neutral" },
  { id: "st-094", category: "airport", hebrew: "איפה שער העלייה למטוס?", transcription: "эйфо шаар а-алия ла-матос?", russian: "Где выход на посадку?", context: "поиск гейта", tone: "neutral" },
  { id: "st-095", category: "airport", hebrew: "מתי מתחילה העלייה למטוס?", transcription: "матай матхила а-алия ла-матос?", russian: "Когда начинается посадка?", context: "у выхода на посадку", tone: "neutral" },
  { id: "st-096", category: "airport", hebrew: "הטיסה בזמן?", transcription: "а-тиса ба-зман?", russian: "Рейс вовремя?", context: "табло, справочная", tone: "neutral" },
  { id: "st-097", category: "airport", hebrew: "הטיסה מתעכבת?", transcription: "а-тиса митакевет?", russian: "Рейс задерживается?", context: "табло, справочная", tone: "neutral" },
  { id: "st-098", category: "airport", hebrew: "זה השער לטיסה לתל אביב?", transcription: "зе а-шаар ла-тиса ле-Тель-Авив?", russian: "Это выход на рейс в Тель-Авив?", context: "у гейта", tone: "neutral" },
  { id: "st-099", category: "airport", hebrew: "איזה מושב יש לי?", transcription: "эйзе мошав еш ли?", russian: "Какое у меня место?", context: "посадочный талон, самолёт", tone: "neutral" },
  { id: "st-100", category: "airport", hebrew: "אפשר להחליף מקום?", transcription: "эфшар леахлиф маком?", russian: "Можно поменяться местами?", context: "в самолёте", tone: "neutral" },
  { id: "st-101", category: "airport", hebrew: "אפשר מים, בבקשה?", transcription: "эфшар маим, бевакаша?", russian: "Можно воды, пожалуйста?", context: "в самолёте", tone: "friendly" },
  { id: "st-102", category: "airport", hebrew: "איפה השירותים?", transcription: "эйфо а-шерутим?", russian: "Где туалет?", context: "аэропорт, самолёт", tone: "neutral" },
  { id: "st-103", category: "airport", hebrew: "אני לא מרגיש טוב", transcription: "ани ло маргиш тов", russian: "Я плохо себя чувствую", context: "в самолёте, срочная помощь", tone: "urgent" },
  { id: "st-104", category: "airport", hebrew: "איפה איסוף המזוודות?", transcription: "эйфо исуф а-мизвадот?", russian: "Где получение багажа?", context: "после прилёта", tone: "neutral" },
  { id: "st-105", category: "airport", hebrew: "באיזה מסוע המזוודות?", transcription: "бе-эйзе масуа а-мизвадот?", russian: "На какой ленте багаж?", context: "зал выдачи багажа", tone: "neutral" },
  { id: "st-106", category: "airport", hebrew: "המזוודה שלי לא הגיעה", transcription: "а-мизвада шели ло игиа", russian: "Мой чемодан не прилетел", context: "розыск багажа", tone: "urgent" },
  { id: "st-107", category: "airport", hebrew: "המזוודה שלי נפגעה", transcription: "а-мизвада шели нифгэа", russian: "Мой чемодан повреждён", context: "служба багажа", tone: "urgent" },
  { id: "st-108", category: "airport", hebrew: "לאן צריך לפנות?", transcription: "ле-ан царих лифнот?", russian: "Куда нужно обратиться?", context: "проблема с багажом или документами", tone: "neutral" },
  { id: "st-109", category: "airport", hebrew: "איפה תחנת המוניות?", transcription: "эйфо таханат а-мониёт?", russian: "Где стоянка такси?", context: "выход из аэропорта", tone: "neutral" },
  { id: "st-110", category: "airport", hebrew: "אפשר לשלם באשראי?", transcription: "эфшар лешалем бе-ашрай?", russian: "Можно оплатить картой?", context: "такси из аэропорта", tone: "neutral" },

  { id: "st-032", category: "school", hebrew: "יש שיעורי בית?", transcription: "еш шиурей байт?", russian: "Есть домашнее задание?", context: "школа", tone: "neutral" },
  { id: "st-033", category: "school", hebrew: "באיזה כיתה אתה?", transcription: "бе-эйзе кита ата?", russian: "В каком ты классе?", context: "разговор с учеником", tone: "neutral" },
  { id: "st-034", category: "school", hebrew: "אפשר לשאול שאלה?", transcription: "эфшар лишоль шеэла?", russian: "Можно задать вопрос?", context: "урок", tone: "neutral" },
  { id: "st-035", category: "school", hebrew: "לא הבנתי", transcription: "ло эванти", russian: "Я не понял", context: "урок", tone: "neutral" },
  { id: "st-036", category: "school", hebrew: "אפשר לחזור על זה?", transcription: "эфшар лахзор аль зе?", russian: "Можно повторить это?", context: "урок", tone: "neutral" },
  { id: "st-037", category: "school", hebrew: "מתי המבחן?", transcription: "матай а-мивхан?", russian: "Когда контрольная / экзамен?", context: "школа, институт", tone: "neutral" },
  { id: "st-038", category: "school", hebrew: "יש לי הפסקה", transcription: "еш ли афсака", russian: "У меня перемена / перерыв", context: "школа, институт", tone: "neutral" },

  { id: "st-039", category: "work", hebrew: "אני באמצע משהו", transcription: "ани бе-эмца машеу", russian: "Я сейчас в процессе / занят кое-чем", context: "работа", tone: "neutral" },
  { id: "st-040", category: "work", hebrew: "נדבר אחרי הישיבה", transcription: "недабер ахарей а-ешива", russian: "Поговорим после совещания", context: "работа", tone: "neutral" },
  { id: "st-041", category: "work", hebrew: "שלח לי הודעה", transcription: "шлах ли одаа", russian: "Напиши мне сообщение", context: "работа, быт", tone: "neutral" },
  { id: "st-042", category: "work", hebrew: "אני צריך לבדוק את זה", transcription: "ани царих ливдок эт зе", russian: "Мне нужно это проверить", context: "работа", tone: "neutral" },
  { id: "st-043", category: "work", hebrew: "זה דחוף?", transcription: "зе дахоф?", russian: "Это срочно?", context: "работа", tone: "neutral" },
  { id: "st-044", category: "work", hebrew: "אין לי זמן לזה עכשיו", transcription: "эйн ли зман ле-зе ахшав", russian: "У меня сейчас нет на это времени", context: "работа", tone: "neutral" },
  { id: "st-045", category: "work", hebrew: "סגור", transcription: "сагур", russian: "Договорились / окей", context: "рабочий слэнг", tone: "slang" },

  { id: "st-046", category: "gym", hebrew: "כמה סטים נשארו לך?", transcription: "кама сетим нишару леха?", russian: "Сколько тебе ещё подходов осталось?", context: "тренажёрный зал", tone: "neutral" },
  { id: "st-047", category: "gym", hebrew: "אפשר לעבוד איתך ביחד?", transcription: "эфшар лаавод итха бе-яхад?", russian: "Можно делать упражнение вместе / чередоваться?", context: "спортзал, обращение к мужчине", tone: "neutral" },
  { id: "st-048", category: "gym", hebrew: "אפשר לעבוד איתך ביחד?", transcription: "эфшар лаавод итах бе-яхад?", russian: "Можно делать упражнение вместе / чередоваться?", context: "спортзал, обращение к женщине", tone: "neutral" },
  { id: "st-049", category: "gym", hebrew: "אתה משתמש בזה?", transcription: "ата миштамеш бе-зе?", russian: "Ты этим пользуешься?", context: "спортзал, тренажёр", tone: "neutral" },
  { id: "st-050", category: "gym", hebrew: "אני תכף מסיים", transcription: "ани текаф месаем", russian: "Я сейчас заканчиваю", context: "спортзал", tone: "neutral" },
  { id: "st-051", category: "gym", hebrew: "צריך ספוטר?", transcription: "царих спотер?", russian: "Нужен страхующий?", context: "спортзал", tone: "slang" },
  { id: "st-052", category: "gym", hebrew: "אפשר להיכנס בינך?", transcription: "эфшар леиканес бейнеха?", russian: "Можно вклиниться между подходами?", context: "спортзал, разговорно", tone: "neutral" },
  { id: "st-053", category: "gym", hebrew: "סיימת עם המכשיר?", transcription: "сийамта им а-махшир?", russian: "Ты закончил с тренажёром?", context: "спортзал", tone: "neutral" },

  { id: "st-054", category: "neighbors", hebrew: "בוקר טוב, מה שלומך?", transcription: "бокер тов, ма шломха?", russian: "Доброе утро, как вы?", context: "сосед, знакомый", tone: "friendly" },
  { id: "st-055", category: "neighbors", hebrew: "אפשר קצת שקט?", transcription: "эфшар кцат шекет?", russian: "Можно немного тише?", context: "соседи", tone: "neutral" },
  { id: "st-056", category: "neighbors", hebrew: "המעלית תקועה", transcription: "а-маалит ткуа", russian: "Лифт застрял / не работает", context: "дом", tone: "urgent" },
  { id: "st-057", category: "neighbors", hebrew: "יש בעיה עם המים", transcription: "еш беая им а-маим", russian: "Есть проблема с водой", context: "дом", tone: "neutral" },
  { id: "st-058", category: "neighbors", hebrew: "אפשר לשאול משהו?", transcription: "эфшар лишоль машеу?", russian: "Можно кое-что спросить?", context: "сосед, знакомый", tone: "neutral" },
  { id: "st-059", category: "neighbors", hebrew: "ראית את החבילה שלי?", transcription: "раита эт а-хавила шели?", russian: "Вы видели мою посылку?", context: "соседи, дом", tone: "neutral" },

  { id: "st-060", category: "emotions", hebrew: "חם היום", transcription: "хам а-йом", russian: "Сегодня жарко", context: "маленький разговор", tone: "neutral" },
  { id: "st-061", category: "emotions", hebrew: "איזה חום!", transcription: "эйзе хом!", russian: "Какая жара!", context: "эмоциональная реакция", tone: "friendly" },
  { id: "st-062", category: "emotions", hebrew: "מגניב!", transcription: "магнив!", russian: "Круто!", context: "похвала, реакция", tone: "slang" },
  { id: "st-063", category: "emotions", hebrew: "סבבה", transcription: "сабаба", russian: "Окей / класс / нормально", context: "очень частое разговорное", tone: "slang" },
  { id: "st-064", category: "emotions", hebrew: "איזה יופי!", transcription: "эйзе йофи!", russian: "Как здорово!", context: "радость", tone: "friendly" },
  { id: "st-065", category: "emotions", hebrew: "באסה", transcription: "баса", russian: "Облом / неприятно", context: "разочарование", tone: "slang" },
  { id: "st-066", category: "emotions", hebrew: "אני עייף מת", transcription: "ани аеф мет", russian: "Я смертельно устал", context: "разговорно", tone: "slang" },
  { id: "st-067", category: "emotions", hebrew: "וואלה?", transcription: "вала?", russian: "Серьёзно? Правда?", context: "реакция", tone: "slang" },
  { id: "st-068", category: "emotions", hebrew: "אין מצב!", transcription: "эйн мацав!", russian: "Да не может быть!", context: "удивление", tone: "slang" },

  { id: "st-069", category: "slang", hebrew: "יאללה", transcription: "яла", russian: "Давай / поехали / ну всё", context: "универсальное разговорное слово", tone: "slang" },
  { id: "st-070", category: "slang", hebrew: "אחי", transcription: "ахи", russian: "Брат / дружище", context: "разговорно, часто между мужчинами", tone: "slang" },
  { id: "st-071", category: "slang", hebrew: "עזוב", transcription: "азов", russian: "Забей / оставь", context: "разговорно", tone: "slang" },
  { id: "st-072", category: "slang", hebrew: "בקטנה", transcription: "бе-катана", russian: "Пустяки / ничего страшного", context: "разговорно", tone: "slang" },
  { id: "st-073", category: "slang", hebrew: "חבל על הזמן", transcription: "хаваль аль а-зман", russian: "Очень круто / супер", context: "сленг, буквально другое значение", tone: "slang" },
  { id: "st-074", category: "slang", hebrew: "אין לי כוח", transcription: "эйн ли коах", russian: "У меня нет сил / не хочу", context: "разговорно", tone: "slang" },
  { id: "st-075", category: "slang", hebrew: "תכלס", transcription: "тахлес", russian: "По сути / честно говоря", context: "разговорно", tone: "slang" },
  { id: "st-076", category: "slang", hebrew: "על הפנים", transcription: "аль а-паним", russian: "Ужасно / очень плохо", context: "разговорно", tone: "slang" },

  { id: "st-077", category: "boundaries", hebrew: "מה אתה עושה?", transcription: "ма ата осе?", russian: "Что ты делаешь?", context: "мужчине, нейтрально или резко по тону", tone: "neutral" },
  { id: "st-078", category: "boundaries", hebrew: "מה את עושה?", transcription: "ма ат оса?", russian: "Что ты делаешь?", context: "женщине, нейтрально или резко по тону", tone: "neutral" },
  { id: "st-079", category: "boundaries", hebrew: "מה נסגר איתך?", transcription: "ма нисгар итха?", russian: "Что с тобой такое? / Ты чего?", context: "разговорное возмущение", tone: "rude" },
  { id: "st-080", category: "boundaries", hebrew: "מה אתה רוצה ממני?", transcription: "ма ата роце мимени?", russian: "Что ты от меня хочешь?", context: "защита границ", tone: "rude" },
  { id: "st-081", category: "boundaries", hebrew: "די, מספיק", transcription: "дай, маспик", russian: "Хватит, достаточно", context: "остановить действие", tone: "neutral" },
  { id: "st-082", category: "boundaries", hebrew: "עזוב אותי", transcription: "азов оти", russian: "Отстань от меня / оставь меня", context: "резко, но без мата", tone: "rude" },
  { id: "st-083", category: "boundaries", hebrew: "לך מפה", transcription: "лех ми-по", russian: "Уходи отсюда", context: "резко", tone: "rude" },
  { id: "st-084", category: "boundaries", hebrew: "מה הקטע?", transcription: "ма а-кета?", russian: "В чём прикол? / Что за фигня?", context: "разговорное возмущение", tone: "slang" },
  { id: "st-085", category: "boundaries", hebrew: "מה לעזאזל אתה עושה?", transcription: "ма лаазазель ата осе?", russian: "Какого чёрта ты делаешь?", context: "сильное возмущение, мягче чем мат", tone: "rude" },
  { id: "st-086", category: "boundaries", hebrew: "תירגע", transcription: "тирага", russian: "Успокойся", context: "мужчине", tone: "neutral" },
  { id: "st-087", category: "boundaries", hebrew: "תירגעי", transcription: "тираги", russian: "Успокойся", context: "женщине", tone: "neutral" },
  { id: "st-088", category: "boundaries", hebrew: "אל תיגע בי", transcription: "аль тига би", russian: "Не трогай меня", context: "личные границы", tone: "urgent" },
  { id: "st-089", category: "boundaries", hebrew: "אני לא רוצה לדבר עכשיו", transcription: "ани ло роце ледабер ахшав", russian: "Я не хочу сейчас разговаривать", context: "спокойно поставить границу", tone: "neutral" },
  { id: "st-090", category: "boundaries", hebrew: "תעזוב את זה", transcription: "таазов эт зе", russian: "Оставь это / брось это", context: "ситуация раздражения", tone: "neutral" },
];