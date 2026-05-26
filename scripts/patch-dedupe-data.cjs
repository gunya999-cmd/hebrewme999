const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/Dictionary.tsx',
  'src/pages/VerbDetail.tsx',
  'src/pages/GuessFormGame.tsx',
  'src/pages/WriteFormGame.tsx',
  'src/pages/GuessRootGame.tsx',
  'src/pages/GuessBinyanGame.tsx',
];

for (const relativePath of files) {
  const filePath = path.join(process.cwd(), relativePath);
  let source = fs.readFileSync(filePath, 'utf8');
  const before = source;

  source = source.replace(
    /import \{ SEED_VERBS \} from "@\/data\/verbs";/g,
    'import { UNIQUE_SEED_VERBS } from "@/data/verbs-unique";'
  );
  source = source.replace(/\bSEED_VERBS\b/g, 'UNIQUE_SEED_VERBS');

  if (source !== before) {
    fs.writeFileSync(filePath, source);
    console.log(`[dedupe-data patch] updated ${relativePath}`);
  }
}

const vocabularyPath = path.join(process.cwd(), 'src', 'data', 'vocabulary.ts');
let vocabSource = fs.readFileSync(vocabularyPath, 'utf8');
if (!vocabSource.includes('function uniqueVocabularyByHebrew')) {
  vocabSource = vocabSource.replace(
    'export const VOCAB_CATEGORIES: Record<VocabWord["category"], string> = {',
    `function normalizeHebrewVocabularyKey(value: string): string {
  return value
    .normalize("NFC")
    .replace(/[\\u0591-\\u05C7]/g, "")
    .replace(/[\\u200E\\u200F]/g, "")
    .replace(/\\s+/g, " ")
    .trim();
}

function uniqueVocabularyByHebrew(words: VocabWord[]): VocabWord[] {
  const seen = new Set<string>();
  return words.filter((word) => {
    const key = normalizeHebrewVocabularyKey(word.hebrew);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const RAW_VOCABULARY = VOCABULARY;
VOCABULARY.splice(0, VOCABULARY.length, ...uniqueVocabularyByHebrew(RAW_VOCABULARY));

export const VOCAB_CATEGORIES: Record<VocabWord["category"], string> = {`
  );
  fs.writeFileSync(vocabularyPath, vocabSource);
  console.log('[dedupe-data patch] updated vocabulary.ts');
}
