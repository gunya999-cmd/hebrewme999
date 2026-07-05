import { VERB_DROPS_TOP_1000_ROWS } from "@/data/verbDropsTop1000";

export type VerbDropCategory = "movement" | "food" | "communication" | "home" | "study" | "daily";
export type VerbDropBinyan = "פעל" | "נפעל" | "פיעל" | "הפעיל" | "התפעל" | "פועל" | "הופעל";

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

  if (hasAny(text, ["идти", "ходить", "приход", "выход", "вход", "возвращ", "проход", "переезж", "ехать", "ездить", "бежать", "бегать", "подним", "спуск", "двиг", "стоять", "сидеть", "лежать", "падать", "прыгать", "плавать", "плыть", "взлет", "приземл", "садиться", "лететь", "летать"])) {
    return "movement";
  }

  if (hasAny(text, ["есть", "пить", "готовить", "варить", "печь", "жарить", "покупать", "заказывать", "продавать", "платить", "еда", "кормить", "пробовать"])) {
    return "food";
  }

  if (hasAny(text, ["говор", "сказать", "слуш", "слыш", "спраш", "отвеч", "звон", "рассказ", "объяс", "просить", "сообщ", "молиться", "смешить", "смеяться", "читать", "писать"])) {
    return "communication";
  }

  if (hasAny(text, ["откры", "закры", "убир", "мыть", "стирать", "чинить", "класть", "полож", "жить", "спать", "искать", "находить", "включ", "выключ", "разрушать", "портить", "касаться", "кашлять", "чихать"])) {
    return "home";
  }

  if (hasAny(text, ["учиться", "учить", "поним", "знать", "помнить", "думать", "решать", "провер", "считать", "изуч", "обязываться", "обязательство"])) {
    return "study";
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
