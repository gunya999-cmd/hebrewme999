import { VERB_DROPS_TOP_1000_ROWS } from "@/data/verbDropsTop1000";

export type VerbDropCategory =
  | "movement"
  | "food"
  | "communication"
  | "home"
  | "study"
  | "work"
  | "people"
  | "feelings"
  | "body"
  | "money"
  | "nature"
  | "technology"
  | "daily";
export type VerbDropBinyan = "פעל" | "נפעל" | "פיעל" | "הפעיל" | "התפעל" | "פועל" | "הופעל";
export type VerbDropTopic =
  | VerbDropCategory
  | "binyan_paal"
  | "binyan_nifal"
  | "binyan_piel"
  | "binyan_hifil"
  | "binyan_hitpael"
  | "binyan_pual"
  | "binyan_hufal"
  | "all";

export interface VerbDropCard {
  id: string;
  infinitive_hebrew: string;
  transcription_ru: string;
  translation_ru: string;
  binyan: VerbDropBinyan;
  root: string;
  category: VerbDropCategory;
  visualType: string;
  frequencyRank: number;
  imageSrc?: string;
}

export const VERB_DROP_CATEGORIES: Array<{ id: VerbDropTopic; title: string; desc: string; emoji: string }> = [
  { id: "movement", title: "Движение", desc: "идти, приходить, ехать", emoji: "🚶" },
  { id: "food", title: "Еда и покупки", desc: "есть, пить, покупать", emoji: "🍽️" },
  { id: "communication", title: "Общение", desc: "говорить, слушать, звонить", emoji: "💬" },
  { id: "home", title: "Дом", desc: "жить, спать, убирать", emoji: "🏠" },
  { id: "study", title: "Учёба и мысли", desc: "учить, знать, понимать", emoji: "📚" },
  { id: "work", title: "Работа и дела", desc: "работать, строить, решать", emoji: "🧰" },
  { id: "people", title: "Люди и отношения", desc: "любить, помогать, встречать", emoji: "🤝" },
  { id: "feelings", title: "Чувства", desc: "хотеть, бояться, радоваться", emoji: "💜" },
  { id: "body", title: "Тело и здоровье", desc: "болеть, лечить, дышать", emoji: "🫀" },
  { id: "money", title: "Деньги и сделки", desc: "платить, продавать, получать", emoji: "💰" },
  { id: "nature", title: "Природа", desc: "расти, цвести, светить", emoji: "🌿" },
  { id: "technology", title: "Техника", desc: "включать, выключать, загружать", emoji: "⚙️" },
  { id: "daily", title: "Каждый день", desc: "частые действия вперемешку", emoji: "✨" },
  { id: "binyan_paal", title: "Пааль", desc: "פעל • простые активные", emoji: "פעל" },
  { id: "binyan_nifal", title: "Нифаль", desc: "נפעל • пассив и возвратность", emoji: "נפעל" },
  { id: "binyan_piel", title: "Пиэль", desc: "פיעל • усиленное действие", emoji: "פיעל" },
  { id: "binyan_hifil", title: "Хифиль", desc: "הפעיל • заставить сделать", emoji: "הפעיל" },
  { id: "binyan_hitpael", title: "Хитпаэль", desc: "התפעל • возвратные действия", emoji: "התפעל" },
  { id: "binyan_pual", title: "Пуаль", desc: "פועל • пассив Пиэль", emoji: "פועל" },
  { id: "binyan_hufal", title: "Хуфаль", desc: "הופעל • пассив Хифиль", emoji: "הופעל" },
  { id: "all", title: "Все глаголы", desc: "смешанная тренировка", emoji: "🎮" },
];

function hasAny(text: string, words: string[]): boolean {
  return words.some((word) => text.includes(word));
}

function cleanTranscription(value: string): string {
  return value.replace(/\s+/g, "").trim();
}

function cleanTranslation(value: string): string {
  return value
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanRoot(value: string): string {
  return value.replace(/[\s\-–—]/g, "").trim();
}

function getVerbDropCategory(translation: string): VerbDropCategory {
  const text = translation.toLowerCase();

  if (hasAny(text, ["идти", "ходить", "приход", "выход", "вход", "возвращ", "проход", "переезж", "ехать", "ездить", "бежать", "бегать", "подним", "спуск", "двиг", "стоять", "сидеть", "лежать", "падать", "прыгать", "плавать", "плыть", "взлет", "приземл", "садиться", "лететь", "летать", "пересек", "перенос", "нести", "вести", "тащить"])) {
    return "movement";
  }

  if (hasAny(text, ["есть", "пить", "готовить", "варить", "печь", "жарить", "покупать", "заказывать", "еда", "кормить", "пробовать", "резать", "чистить", "наливать", "глотать", "жевать", "вкус", "кушать"])) {
    return "food";
  }

  if (hasAny(text, ["говор", "сказать", "слуш", "слыш", "спраш", "отвеч", "звон", "рассказ", "объяс", "просить", "сообщ", "молиться", "смешить", "смеяться", "кричать", "шептать", "обещать", "приглашать", "переводить", "произносить", "называть"])) {
    return "communication";
  }

  if (hasAny(text, ["откры", "закры", "убир", "мыть", "стирать", "чинить", "класть", "полож", "жить", "спать", "искать", "находить", "касаться", "кашлять", "чихать", "одевать", "надевать", "снимать", "держать", "хранить", "вытирать", "комната", "дом", "квартира"])) {
    return "home";
  }

  if (hasAny(text, ["учиться", "учить", "поним", "знать", "помнить", "думать", "провер", "считать", "изуч", "читать", "писать", "обязываться", "обязательство", "забывать", "замечать", "доказывать", "обнаруж", "исслед", "выясн", "сравнивать"])) {
    return "study";
  }

  if (hasAny(text, ["работ", "делать", "создавать", "строить", "производ", "управ", "служить", "использ", "организ", "план", "готовить", "начинать", "заканчивать", "продолж", "решать", "менять", "улучш", "провер", "выполнять", "назначать", "выбирать", "отменять", "соглас", "проект", "ремонт", "постав", "задач"])) {
    return "work";
  }

  if (hasAny(text, ["любить", "встреч", "помог", "жениться", "родить", "рожд", "воспит", "обнимать", "целовать", "прощать", "уважать", "ненавид", "забот", "друж", "приглашать", "провожать", "сопровожд", "гость", "семья", "дет", "человек", "люд"])) {
    return "people";
  }

  if (hasAny(text, ["хотеть", "нрав", "бояться", "страх", "рад", "радоваться", "огорч", "серд", "злиться", "страдать", "надеяться", "чувств", "удив", "плакать", "сожал", "скучать", "стыд", "мечт", "верить", "сомнев", "успока", "волнов"])) {
    return "feelings";
  }

  if (hasAny(text, ["болеть", "лечить", "выздорав", "дышать", "умер", "умирать", "ранить", "повред", "ломать", "сломать", "болезн", "здоров", "рвать", "тошн", "кров", "пахнуть", "смотреть", "видеть", "слышать", "трогать", "ощущать", "спать", "просып", "уставать"])) {
    return "body";
  }

  if (hasAny(text, ["платить", "продавать", "покупать", "получать", "давать", "брать", "занимать", "должен", "стоить", "стоимость", "цена", "деньги", "прибыль", "зараб", "тратить", "возвращать", "обмен", "аренд", "заказывать", "заказ", "счёт", "подарить"])) {
    return "money";
  }

  if (hasAny(text, ["расти", "выраст", "цвести", "светить", "гореть", "течь", "капать", "падать", "дожд", "снег", "ветер", "земля", "вода", "море", "дерево", "растение", "живот", "птиц", "солнце", "луна", "замерз", "таять", "сажать"])) {
    return "nature";
  }

  if (hasAny(text, ["включ", "выключ", "загруж", "скач", "нажать", "нажим", "записывать", "запустить", "печатать", "копировать", "удалять", "сохранять", "отправ", "получать", "подключ", "сломать", "чинить", "машина", "компьют", "телефон", "экран", "фото", "снимать", "показывать"])) {
    return "technology";
  }

  return "daily";
}

// Full V8 set: 1000 Pealim verbs, aligned by rank with /cards/verb-drops/0001.webp ... /1000.webp.
export const VERB_DROPS_SEED: VerbDropCard[] = VERB_DROPS_TOP_1000_ROWS.map(
  ([frequencyRank, infinitive_hebrew, transcription_ru, translation_ru, binyan, root]) => {
    const number = String(frequencyRank).padStart(4, "0");
    const cleanMeaning = cleanTranslation(translation_ru);

    return {
      id: `v8-${number}`,
      infinitive_hebrew,
      transcription_ru: cleanTranscription(transcription_ru),
      translation_ru: cleanMeaning,
      binyan,
      root: cleanRoot(root),
      category: getVerbDropCategory(cleanMeaning),
      visualType: `card-${number}`,
      frequencyRank,
      imageSrc: `/cards/verb-drops/${number}.webp`,
    };
  }
);
