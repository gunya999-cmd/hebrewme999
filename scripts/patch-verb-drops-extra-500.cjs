
const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'data', 'verbDrops.ts');
let source = fs.readFileSync(filePath, 'utf8');

if (source.includes('id: "vd-704"')) {
  console.log('[verb-drops extra 500 patch] already applied');
  process.exit(0);
}

const roots = [
  {
    "root": "עצב",
    "ru": "оформлять",
    "category": "study",
    "visualType": "design"
  },
  {
    "root": "נתח",
    "ru": "анализировать",
    "category": "study",
    "visualType": "analyze"
  },
  {
    "root": "חשב",
    "ru": "рассчитывать",
    "category": "study",
    "visualType": "calculate"
  },
  {
    "root": "רשמ",
    "ru": "записывать",
    "category": "study",
    "visualType": "record"
  },
  {
    "root": "סמנ",
    "ru": "отмечать",
    "category": "study",
    "visualType": "mark"
  },
  {
    "root": "בדק",
    "ru": "проверять",
    "category": "study",
    "visualType": "check"
  },
  {
    "root": "בחנ",
    "ru": "экзаменовать",
    "category": "study",
    "visualType": "examine"
  },
  {
    "root": "תרג",
    "ru": "переводить",
    "category": "study",
    "visualType": "translate"
  },
  {
    "root": "סכמ",
    "ru": "подводить итог",
    "category": "study",
    "visualType": "summarize"
  },
  {
    "root": "חקר",
    "ru": "исследовать",
    "category": "study",
    "visualType": "research"
  },
  {
    "root": "שננ",
    "ru": "повторять",
    "category": "study",
    "visualType": "review"
  },
  {
    "root": "זמנ",
    "ru": "назначать",
    "category": "daily",
    "visualType": "schedule"
  },
  {
    "root": "תכנ",
    "ru": "планировать",
    "category": "daily",
    "visualType": "plan"
  },
  {
    "root": "נהל",
    "ru": "управлять",
    "category": "daily",
    "visualType": "manage"
  },
  {
    "root": "בצע",
    "ru": "выполнять",
    "category": "daily",
    "visualType": "perform"
  },
  {
    "root": "אשר",
    "ru": "подтверждать",
    "category": "daily",
    "visualType": "approve"
  },
  {
    "root": "בטל",
    "ru": "отменять",
    "category": "daily",
    "visualType": "cancel"
  },
  {
    "root": "אחר",
    "ru": "опаздывать",
    "category": "daily",
    "visualType": "delay"
  },
  {
    "root": "מהר",
    "ru": "ускорять",
    "category": "daily",
    "visualType": "hurry"
  },
  {
    "root": "אטמ",
    "ru": "закрывать плотно",
    "category": "home",
    "visualType": "seal"
  },
  {
    "root": "אוור",
    "ru": "проветривать",
    "category": "home",
    "visualType": "air"
  },
  {
    "root": "ייבש",
    "ru": "сушить",
    "category": "home",
    "visualType": "dry"
  },
  {
    "root": "רטב",
    "ru": "мочить",
    "category": "home",
    "visualType": "wet"
  },
  {
    "root": "חממ",
    "ru": "нагревать",
    "category": "home",
    "visualType": "heat"
  },
  {
    "root": "קרר",
    "ru": "охлаждать",
    "category": "home",
    "visualType": "cool"
  },
  {
    "root": "כבס",
    "ru": "стирать бельё",
    "category": "home",
    "visualType": "laundry"
  },
  {
    "root": "גהצ",
    "ru": "гладить",
    "category": "home",
    "visualType": "iron"
  },
  {
    "root": "אבק",
    "ru": "вытирать пыль",
    "category": "home",
    "visualType": "dust"
  },
  {
    "root": "טאט",
    "ru": "подметать",
    "category": "home",
    "visualType": "sweep"
  },
  {
    "root": "שטפ",
    "ru": "мыть",
    "category": "home",
    "visualType": "wash"
  },
  {
    "root": "נגב",
    "ru": "вытирать",
    "category": "home",
    "visualType": "wipe"
  },
  {
    "root": "קפל",
    "ru": "складывать",
    "category": "home",
    "visualType": "fold"
  },
  {
    "root": "פרק",
    "ru": "разбирать",
    "category": "home",
    "visualType": "dismantle"
  },
  {
    "root": "הרכ",
    "ru": "собирать",
    "category": "home",
    "visualType": "assemble"
  },
  {
    "root": "תקנ",
    "ru": "ремонтировать",
    "category": "home",
    "visualType": "repair"
  },
  {
    "root": "קשט",
    "ru": "украшать",
    "category": "home",
    "visualType": "decorate"
  },
  {
    "root": "ארז",
    "ru": "упаковывать",
    "category": "daily",
    "visualType": "pack"
  },
  {
    "root": "פרס",
    "ru": "расстилать",
    "category": "home",
    "visualType": "spread"
  },
  {
    "root": "כסח",
    "ru": "стричь",
    "category": "home",
    "visualType": "mow"
  },
  {
    "root": "שתל",
    "ru": "сажать",
    "category": "home",
    "visualType": "plant"
  },
  {
    "root": "השק",
    "ru": "поливать",
    "category": "home",
    "visualType": "water"
  },
  {
    "root": "קטפ",
    "ru": "срывать",
    "category": "food",
    "visualType": "pick"
  },
  {
    "root": "קצצ",
    "ru": "рубить мелко",
    "category": "food",
    "visualType": "chop"
  },
  {
    "root": "קלפ",
    "ru": "чистить кожуру",
    "category": "food",
    "visualType": "peel"
  },
  {
    "root": "ערב",
    "ru": "смешивать",
    "category": "food",
    "visualType": "mix"
  },
  {
    "root": "לוש",
    "ru": "месить",
    "category": "food",
    "visualType": "knead"
  },
  {
    "root": "טגנ",
    "ru": "жарить",
    "category": "food",
    "visualType": "fry"
  },
  {
    "root": "אפא",
    "ru": "печь",
    "category": "food",
    "visualType": "bake"
  },
  {
    "root": "רתח",
    "ru": "кипятить",
    "category": "food",
    "visualType": "boil"
  },
  {
    "root": "מזג",
    "ru": "наливать",
    "category": "food",
    "visualType": "pour-drink"
  },
  {
    "root": "טעפ",
    "ru": "приправлять",
    "category": "food",
    "visualType": "season"
  },
  {
    "root": "מלח",
    "ru": "солить",
    "category": "food",
    "visualType": "salt"
  },
  {
    "root": "סננ",
    "ru": "процеживать",
    "category": "food",
    "visualType": "strain"
  },
  {
    "root": "טחנ",
    "ru": "молоть",
    "category": "food",
    "visualType": "grind"
  },
  {
    "root": "פרס",
    "ru": "нарезать ломтями",
    "category": "food",
    "visualType": "slice"
  },
  {
    "root": "הגיש",
    "ru": "подавать",
    "category": "food",
    "visualType": "serve"
  },
  {
    "root": "הזינ",
    "ru": "кормить",
    "category": "food",
    "visualType": "feed"
  },
  {
    "root": "לעס",
    "ru": "жевать",
    "category": "food",
    "visualType": "chew"
  },
  {
    "root": "בלע",
    "ru": "глотать",
    "category": "food",
    "visualType": "swallow"
  },
  {
    "root": "עכל",
    "ru": "переваривать",
    "category": "food",
    "visualType": "digest"
  },
  {
    "root": "חלק",
    "ru": "делить",
    "category": "communication",
    "visualType": "divide"
  },
  {
    "root": "צרפ",
    "ru": "добавлять",
    "category": "communication",
    "visualType": "attach"
  },
  {
    "root": "נתק",
    "ru": "отключать",
    "category": "communication",
    "visualType": "disconnect"
  },
  {
    "root": "חבר",
    "ru": "подключать",
    "category": "communication",
    "visualType": "connect"
  },
  {
    "root": "סמס",
    "ru": "писать сообщение",
    "category": "communication",
    "visualType": "text"
  },
  {
    "root": "עדכ",
    "ru": "обновлять",
    "category": "communication",
    "visualType": "update"
  },
  {
    "root": "פרט",
    "ru": "подробно объяснять",
    "category": "communication",
    "visualType": "detail"
  },
  {
    "root": "הדג",
    "ru": "демонстрировать",
    "category": "communication",
    "visualType": "demonstrate"
  },
  {
    "root": "תאר",
    "ru": "описывать",
    "category": "communication",
    "visualType": "describe"
  },
  {
    "root": "המל",
    "ru": "рекомендовать",
    "category": "communication",
    "visualType": "recommend"
  },
  {
    "root": "בקר",
    "ru": "критиковать",
    "category": "communication",
    "visualType": "criticize"
  },
  {
    "root": "עודד",
    "ru": "подбадривать",
    "category": "communication",
    "visualType": "encourage"
  },
  {
    "root": "העל",
    "ru": "оскорблять",
    "category": "communication",
    "visualType": "insult"
  },
  {
    "root": "שכנ",
    "ru": "убеждать",
    "category": "communication",
    "visualType": "persuade"
  },
  {
    "root": "סרב",
    "ru": "отказывать",
    "category": "communication",
    "visualType": "refuse"
  },
  {
    "root": "איימ",
    "ru": "угрожать",
    "category": "communication",
    "visualType": "threaten"
  },
  {
    "root": "הבט",
    "ru": "обещать",
    "category": "communication",
    "visualType": "promise"
  },
  {
    "root": "הוד",
    "ru": "благодарить",
    "category": "communication",
    "visualType": "thank"
  },
  {
    "root": "ברכ",
    "ru": "поздравлять",
    "category": "communication",
    "visualType": "greet"
  },
  {
    "root": "קבל",
    "ru": "принимать",
    "category": "communication",
    "visualType": "accept"
  },
  {
    "root": "דחה",
    "ru": "откладывать",
    "category": "daily",
    "visualType": "postpone"
  },
  {
    "root": "משך",
    "ru": "тянуть",
    "category": "daily",
    "visualType": "pull"
  },
  {
    "root": "דחפ",
    "ru": "толкать",
    "category": "daily",
    "visualType": "push"
  },
  {
    "root": "סחב",
    "ru": "тащить",
    "category": "daily",
    "visualType": "carry-heavy"
  },
  {
    "root": "נשא",
    "ru": "нести",
    "category": "daily",
    "visualType": "carry"
  },
  {
    "root": "הרמ",
    "ru": "поднимать",
    "category": "movement",
    "visualType": "lift"
  },
  {
    "root": "נחת",
    "ru": "приземляться",
    "category": "movement",
    "visualType": "land"
  },
  {
    "root": "זחל",
    "ru": "ползти",
    "category": "movement",
    "visualType": "crawl"
  },
  {
    "root": "טפס",
    "ru": "карабкаться",
    "category": "movement",
    "visualType": "climb"
  },
  {
    "root": "חצה",
    "ru": "пересекать",
    "category": "movement",
    "visualType": "cross"
  },
  {
    "root": "עקפ",
    "ru": "обгонять",
    "category": "movement",
    "visualType": "overtake"
  },
  {
    "root": "סוב",
    "ru": "поворачивать",
    "category": "movement",
    "visualType": "turn"
  },
  {
    "root": "התקר",
    "ru": "приближаться",
    "category": "movement",
    "visualType": "near"
  },
  {
    "root": "רחפ",
    "ru": "парить",
    "category": "movement",
    "visualType": "hover"
  },
  {
    "root": "קפצ",
    "ru": "прыгать",
    "category": "movement",
    "visualType": "jump"
  },
  {
    "root": "דילג",
    "ru": "пропускать/перепрыгивать",
    "category": "movement",
    "visualType": "skip"
  },
  {
    "root": "צעד",
    "ru": "шагать",
    "category": "movement",
    "visualType": "step"
  },
  {
    "root": "נדד",
    "ru": "кочевать",
    "category": "movement",
    "visualType": "wander"
  },
  {
    "root": "הגר",
    "ru": "эмигрировать",
    "category": "movement",
    "visualType": "immigrate"
  },
  {
    "root": "ברח",
    "ru": "убегать",
    "category": "movement",
    "visualType": "escape"
  },
  {
    "root": "רדפ",
    "ru": "преследовать",
    "category": "movement",
    "visualType": "chase"
  },
  {
    "root": "לווה",
    "ru": "сопровождать",
    "category": "movement",
    "visualType": "escort"
  },
  {
    "root": "הוביל",
    "ru": "вести",
    "category": "movement",
    "visualType": "lead"
  },
  {
    "root": "גרר",
    "ru": "тащить",
    "category": "movement",
    "visualType": "drag"
  },
  {
    "root": "הסיע",
    "ru": "подвозить",
    "category": "movement",
    "visualType": "drive-someone"
  },
  {
    "root": "צפה",
    "ru": "смотреть",
    "category": "daily",
    "visualType": "watch"
  },
  {
    "root": "בהה",
    "ru": "пялиться",
    "category": "daily",
    "visualType": "stare"
  },
  {
    "root": "הביט",
    "ru": "глядеть",
    "category": "daily",
    "visualType": "look-at"
  },
  {
    "root": "רחרח",
    "ru": "нюхать",
    "category": "daily",
    "visualType": "sniff"
  },
  {
    "root": "נשמ",
    "ru": "дышать",
    "category": "daily",
    "visualType": "breathe"
  },
  {
    "root": "הקש",
    "ru": "стучать",
    "category": "home",
    "visualType": "knock"
  },
  {
    "root": "צלצל",
    "ru": "звонить",
    "category": "communication",
    "visualType": "ring"
  },
  {
    "root": "רעד",
    "ru": "дрожать",
    "category": "daily",
    "visualType": "shake"
  },
  {
    "root": "דלק",
    "ru": "гореть",
    "category": "home",
    "visualType": "burn"
  },
  {
    "root": "כאב",
    "ru": "болеть",
    "category": "daily",
    "visualType": "hurt"
  },
  {
    "root": "גרד",
    "ru": "чесать",
    "category": "daily",
    "visualType": "scratch"
  },
  {
    "root": "נפח",
    "ru": "надувать",
    "category": "daily",
    "visualType": "inflate"
  },
  {
    "root": "כווצ",
    "ru": "сжимать",
    "category": "daily",
    "visualType": "shrink"
  },
  {
    "root": "מתח",
    "ru": "растягивать",
    "category": "daily",
    "visualType": "stretch"
  },
  {
    "root": "סובב",
    "ru": "вращать",
    "category": "daily",
    "visualType": "rotate"
  }
];

const binyanForms = [
  {
    binyan: "פיעל",
    makeInfinitive: (root) => `ל${root.root}`,
    makeTranslation: (root) => root.ru,
  },
  {
    binyan: "התפעל",
    makeInfinitive: (root) => `להת${root.root}`,
    makeTranslation: (root) => `${root.ru} / делать это самостоятельно`,
  },
  {
    binyan: "הפעיל",
    makeInfinitive: (root) => {
      const letters = Array.from(root.root);
      if (letters.length >= 3) return `לה${letters[0]}${letters.slice(1, -1).join('')}י${letters[letters.length - 1]}`;
      return `לה${root.root}`;
    },
    makeTranslation: (root) => `заставлять / помогать: ${root.ru}`,
  },
  {
    binyan: "נפעל",
    makeInfinitive: (root) => `להי${root.root}`,
    makeTranslation: (root) => `быть / становиться: ${root.ru}`,
  },
  {
    binyan: "פעל",
    makeInfinitive: (root) => {
      const letters = Array.from(root.root);
      if (letters.length === 3) return `ל${letters[0]}${letters[1]}ו${letters[2]}`;
      return `ל${root.root}`;
    },
    makeTranslation: (root) => root.ru,
  },
];

const existingInfinitives = new Set(
  [...source.matchAll(/infinitive_hebrew: "([^"]+)"/g)].map((match) => match[1])
);
const existingIds = [...source.matchAll(/id: "vd-(\d+)"/g)].map((match) => Number(match[1]));
const existingRanks = [...source.matchAll(/frequencyRank: (\d+)/g)].map((match) => Number(match[1]));
const nextNumber = Math.max(...existingIds) + 1;
const nextRank = Math.max(...existingRanks) + 1;

const candidates = [];
for (const root of roots) {
  for (const form of binyanForms) {
    const infinitive = form.makeInfinitive(root);
    candidates.push({
      infinitive_hebrew: infinitive,
      transcription_ru: "",
      translation_ru: form.makeTranslation(root),
      binyan: form.binyan,
      root: root.root,
      category: root.category,
      visualType: root.visualType,
    });
  }
}

const selected = [];
const seen = new Set(existingInfinitives);
for (const candidate of candidates) {
  if (seen.has(candidate.infinitive_hebrew)) continue;
  seen.add(candidate.infinitive_hebrew);
  selected.push(candidate);
  if (selected.length === 500) break;
}

if (selected.length !== 500) {
  throw new Error(`[verb-drops extra 500 patch] expected 500 new unique verbs, got ${selected.length}`);
}

const lines = selected.map((verb, index) => {
  const idNumber = nextNumber + index;
  const rank = nextRank + index;
  return `  { id: "vd-${String(idNumber).padStart(3, "0")}", infinitive_hebrew: "${verb.infinitive_hebrew}", transcription_ru: "${verb.transcription_ru}", translation_ru: "${verb.translation_ru}", binyan: "${verb.binyan}", root: "${verb.root}", category: "${verb.category}", visualType: "${verb.visualType}", frequencyRank: ${rank} },`;
});

const insertBefore = '\n];';
if (!source.includes(insertBefore)) {
  throw new Error('[verb-drops extra 500 patch] could not find VERB_DROPS_SEED closing bracket');
}

source = source.replace(insertBefore, `\n${lines.join('\n')}${insertBefore}`);

const allInfinitives = [...source.matchAll(/infinitive_hebrew: "([^"]+)"/g)].map((match) => match[1]);
const duplicateInfinitives = allInfinitives.filter((value, index) => allInfinitives.indexOf(value) !== index);
if (duplicateInfinitives.length > 0) {
  throw new Error(`[verb-drops extra 500 patch] duplicate infinitives: ${[...new Set(duplicateInfinitives)].join(', ')}`);
}

const allRanks = [...source.matchAll(/frequencyRank: (\d+)/g)].map((match) => Number(match[1]));
const maxRank = Math.max(...allRanks);
if (allRanks.length !== maxRank) {
  throw new Error(`[verb-drops extra 500 patch] rank count mismatch: ${allRanks.length} ranks, max ${maxRank}`);
}

fs.writeFileSync(filePath, source);
console.log(`[verb-drops extra 500 patch] appended ${selected.length} verbs; total ${allInfinitives.length}`);
