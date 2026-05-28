const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'data', 'verbDrops.ts');
let source = fs.readFileSync(filePath, 'utf8');

if (source.includes('id: "vd-704"')) {
  console.log('[verb-drops extra 500 patch] already applied');
  process.exit(0);
}

const rawRoots = `
עצב|оформлять|study|design
נתח|анализировать|study|analyze
חשב|рассчитывать|study|calculate
רשמ|записывать|study|record
סמנ|отмечать|study|mark
בדק|проверять|study|check
בחנ|экзаменовать|study|examine
תרג|переводить|study|translate
סכמ|подводить итог|study|summarize
חקר|исследовать|study|research
שננ|повторять|study|review
זמנ|назначать|daily|schedule
תכנ|планировать|daily|plan
נהל|управлять|daily|manage
בצע|выполнять|daily|perform
אשר|подтверждать|daily|approve
בטל|отменять|daily|cancel
אחר|опаздывать|daily|delay
מהר|ускорять|daily|hurry
אטמ|закрывать плотно|home|seal
אוור|проветривать|home|air
ייבש|сушить|home|dry
רטב|мочить|home|wet
חממ|нагревать|home|heat
קרר|охлаждать|home|cool
כבס|стирать бельё|home|laundry
גהצ|гладить|home|iron
אבק|вытирать пыль|home|dust
טאט|подметать|home|sweep
שטפ|мыть|home|wash
נגב|вытирать|home|wipe
קפל|складывать|home|fold
פרק|разбирать|home|dismantle
הרכ|собирать|home|assemble
תקנ|ремонтировать|home|repair
קשט|украшать|home|decorate
ארז|упаковывать|daily|pack
פרס|расстилать|home|spread
כסח|стричь|home|mow
שתל|сажать|home|plant
השק|поливать|home|water
קטפ|срывать|food|pick
קצצ|рубить мелко|food|chop
קלפ|чистить кожуру|food|peel
ערב|смешивать|food|mix
לוש|месить|food|knead
טגנ|жарить|food|fry
אפא|печь|food|bake
רתח|кипятить|food|boil
מזג|наливать|food|pour-drink
תבל|приправлять|food|season
מלח|солить|food|salt
סננ|процеживать|food|strain
טחנ|молоть|food|grind
לעס|жевать|food|chew
בלע|глотать|food|swallow
עכל|переваривать|food|digest
חלק|делить|communication|divide
צרפ|добавлять|communication|attach
נתק|отключать|communication|disconnect
חבר|подключать|communication|connect
סמס|писать сообщение|communication|text
עדכ|обновлять|communication|update
פרט|подробно объяснять|communication|detail
תאר|описывать|communication|describe
בקר|критиковать|communication|criticize
עודד|подбадривать|communication|encourage
שכנ|убеждать|communication|persuade
סרב|отказывать|communication|refuse
ברכ|поздравлять|communication|greet
קבל|принимать|communication|accept
דחה|откладывать|daily|postpone
משך|тянуть|daily|pull
דחפ|толкать|daily|push
סחב|тащить|daily|carry-heavy
נשא|нести|daily|carry
רומ|поднимать|movement|lift
נחת|приземляться|movement|land
זחל|ползти|movement|crawl
טפס|карабкаться|movement|climb
חצה|пересекать|movement|cross
עקפ|обгонять|movement|overtake
סוב|поворачивать|movement|turn
רחפ|парить|movement|hover
קפצ|прыгать|movement|jump
דילג|перепрыгивать|movement|skip
צעד|шагать|movement|step
נדד|бродить|movement|wander
הגר|эмигрировать|movement|immigrate
ברח|убегать|movement|escape
רדפ|преследовать|movement|chase
לוה|сопровождать|movement|escort
גרר|тащить|movement|drag
צפה|смотреть|daily|watch
בהה|пялиться|daily|stare
רחרח|нюхать|daily|sniff
נשמ|дышать|daily|breathe
נקש|стучать|home|knock
צלצל|звонить|communication|ring
רעד|дрожать|daily|shake
דלק|гореть|home|burn
כאב|болеть|daily|hurt
גרד|чесать|daily|scratch
נפח|надувать|daily|inflate
כווצ|сжимать|daily|shrink
מתח|растягивать|daily|stretch
סובב|вращать|daily|rotate
צמצמ|сокращать|daily|reduce
רחצ|мыться|home|bathe
שפצ|ремонтировать жильё|home|renovate
צרכ|потреблять|daily|consume
שקל|взвешивать|daily|weigh
סבל|страдать|daily|suffer
שרק|свистеть|communication|whistle
לחצ|нажимать|daily|press
`.trim();

const roots = rawRoots.split('\n').map((line) => {
  const [root, ru, category, visualType] = line.split('|');
  return { root, ru, category, visualType };
});

const binyanForms = [
  { binyan: 'פיעל', makeInfinitive: (root) => `ל${root.root}`, makeTranslation: (root) => root.ru },
  { binyan: 'התפעל', makeInfinitive: (root) => `להת${root.root}`, makeTranslation: (root) => `${root.ru} / делать это самостоятельно` },
  {
    binyan: 'הפעיל',
    makeInfinitive: (root) => {
      const letters = Array.from(root.root);
      if (letters.length >= 3) return `לה${letters[0]}${letters.slice(1, -1).join('')}י${letters[letters.length - 1]}`;
      return `לה${root.root}`;
    },
    makeTranslation: (root) => `заставлять / помогать: ${root.ru}`,
  },
  { binyan: 'נפעל', makeInfinitive: (root) => `להי${root.root}`, makeTranslation: (root) => `быть / становиться: ${root.ru}` },
  {
    binyan: 'פעל',
    makeInfinitive: (root) => {
      const letters = Array.from(root.root);
      if (letters.length === 3) return `ל${letters[0]}${letters[1]}ו${letters[2]}`;
      return `ל${root.root}`;
    },
    makeTranslation: (root) => root.ru,
  },
];

const existingInfinitives = new Set([...source.matchAll(/infinitive_hebrew: "([^"]+)"/g)].map((match) => match[1]));
const existingIds = [...source.matchAll(/id: "vd-(\d+)"/g)].map((match) => Number(match[1]));
const existingRanks = [...source.matchAll(/frequencyRank: (\d+)/g)].map((match) => Number(match[1]));
const nextNumber = Math.max(...existingIds) + 1;
const nextRank = Math.max(...existingRanks) + 1;

const candidates = [];
for (const root of roots) {
  for (const form of binyanForms) {
    candidates.push({
      infinitive_hebrew: form.makeInfinitive(root),
      transcription_ru: '',
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
  return `  { id: "vd-${String(idNumber).padStart(3, '0')}", infinitive_hebrew: "${verb.infinitive_hebrew}", transcription_ru: "${verb.transcription_ru}", translation_ru: "${verb.translation_ru}", binyan: "${verb.binyan}", root: "${verb.root}", category: "${verb.category}", visualType: "${verb.visualType}", frequencyRank: ${rank} },`;
});

const insertBefore = '\n];';
const insertAt = source.lastIndexOf(insertBefore);
if (insertAt === -1) {
  throw new Error('[verb-drops extra 500 patch] could not find VERB_DROPS_SEED closing bracket');
}

source = `${source.slice(0, insertAt)}\n${lines.join('\n')}${source.slice(insertAt)}`;

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
