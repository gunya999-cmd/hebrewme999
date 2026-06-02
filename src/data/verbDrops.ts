import { TABLE_TOP_350_VERBS } from "@/data/verbs-table-top350";

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
  imageSrc?: string;
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

function hasAny(text: string, words: string[]): boolean {
  return words.some((word) => text.includes(word));
}

function getVerbDropCategory(translation: string): VerbDropCategory {
  const text = translation.toLowerCase();

  if (hasAny(text, ["идти", "ходить", "приход", "выход", "вход", "возвращ", "проход", "переезж", "ехать", "ездить", "бежать", "бегать", "подним", "спуск", "двиг", "стоять", "сидеть", "лежать", "падать", "прыгать", "плавать", "плыть", "взлет", "приземл", "садиться"])) {
    return "movement";
  }

  if (hasAny(text, ["есть", "пить", "готовить", "варить", "печь", "жарить", "покупать", "заказывать", "продавать", "платить", "еда", "кормить", "пробовать"])) {
    return "food";
  }

  if (hasAny(text, ["говор", "сказать", "слуш", "слыш", "спраш", "отвеч", "звон", "рассказ", "объяс", "просить", "сообщ", "молиться", "смешить", "смеяться"])) {
    return "communication";
  }

  if (hasAny(text, ["откры", "закры", "убир", "мыть", "стирать", "чинить", "класть", "полож", "жить", "спать", "искать", "находить", "включ", "выключ", "разрушать", "портить", "касаться", "кашлять", "чихать"])) {
    return "home";
  }

  if (hasAny(text, ["читать", "писать", "учиться", "учить", "поним", "знать", "помнить", "думать", "решать", "провер", "считать", "изуч", "обязываться", "обязательство"])) {
    return "study";
  }

  return "daily";
}

// Uses the same authoritative order as the main dictionary.
// Card images are stored at /verb-cards/001.webp ... /verb-cards/350.webp.
export const VERB_DROPS_SEED: VerbDropCard[] = TABLE_TOP_350_VERBS.map((verb, index) => {
  const frequencyRank = index + 1;
  const number = String(frequencyRank).padStart(3, "0");

  return {
    id: verb.id || `top350-${number}`,
    infinitive_hebrew: verb.infinitive_hebrew,
    transcription_ru: verb.transcription_ru,
    translation_ru: verb.translation_ru,
    binyan: verb.binyan,
    root: verb.root || "",
    category: getVerbDropCategory(verb.translation_ru),
    visualType: `card-${number}`,
    frequencyRank,
    imageSrc: `/verb-cards/${number}.webp`,
  };
});
