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

function textIncludesAny(text: string, items: string[]): boolean {
  return items.some((item) => text.includes(item));
}

function getVerbDropCategory(translation: string): VerbDropCategory {
  const text = translation.toLowerCase();

  if (textIncludesAny(text, [
    "идти", "ходить", "приход", "выход", "вход", "возвращ", "проход", "переезж", "двиг",
    "ехать", "ездить", "лететь", "летать", "бежать", "бегать", "подним", "спуск", "плыть",
    "плавать", "стоять", "сидеть", "лежать", "падать", "прыгать", "гулять", "приезж", "уезж",
  ])) {
    return "movement";
  }

  if (textIncludesAny(text, [
    "есть", "кушать", "пить", "готовить", "варить", "печь", "жарить", "резать", "покупать",
    "заказывать", "платить", "продавать", "еда", "кормить", "пробовать", "наливать",
  ])) {
    return "food";
  }

  if (textIncludesAny(text, [
    "говор", "сказать", "слуш", "слыш", "спраш", "отвеч", "звон", "рассказ", "объяс",
    "просить", "поздрав", "обещ", "крич", "молч", "сообщ",
  ])) {
    return "communication";
  }

  if (textIncludesAny(text, [
    "откры", "закры", "убир", "мыть", "стирать", "чинить", "строить", "класть", "полож",
    "надев", "снимать", "одев", "жить", "спать", "просып", "вставать", "искать", "находить",
    "выбрасывать", "держать", "нести", "ставить", "включ", "выключ",
  ])) {
    return "home";
  }

  if (textIncludesAny(text, [
    "читать", "писать", "учиться", "учить", "поним", "знать", "помнить", "забывать",
    "думать", "решать", "провер", "считать", "изуч", "перевод", "рисовать",
    "печатать", "планировать", "выбирать",
  ])) {
    return "study";
  }

  return "daily";
}

// Uses the same authoritative order as the main dictionary.
// Card images are expected at /verb-cards/001.webp ... /verb-cards/350.webp.
export const VERB_DROPS_SEED: VerbDropCard[] = TABLE_TOP_350_VERBS.map((verb, index) => {
  const frequencyRank = index + 1;

  return {
    id: verb.id || `top350-${String(frequencyRank).padStart(3, "0")}`,
    infinitive_hebrew: verb.infinitive_hebrew,
    transcription_ru: verb.transcription_ru,
    translation_ru: verb.translation_ru,
    binyan: verb.binyan,
    root: verb.root || "",
    category: getVerbDropCategory(verb.translation_ru),
    visualType: `card-${String(frequencyRank).padStart(3, "0")}`,
    frequencyRank,
    imageSrc: `/verb-cards/${String(frequencyRank).padStart(3, "0")}.webp`,
  };
});
