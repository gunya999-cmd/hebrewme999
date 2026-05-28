const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DATA_FILES = [
  'src/data/verbs.ts',
  'src/data/verbs-paal.ts',
  'src/data/verbs-other.ts',
  'src/data/verbs-extra.ts',
  'src/data/verbs-more.ts',
  'src/data/verbs-added-common.ts',
];

const TARGET_COUNT = Number(process.env.DICTIONARY_TARGET_COUNT || 500);
const STRICT_COUNT = process.argv.includes('--strict-count');

const REQUIRED_FIELDS = [
  'id',
  'infinitive_hebrew',
  'transcription_ru',
  'translation_ru',
  'root',
  'binyan',
  'difficulty',
];

const REQUIRED_TENSES = ['present', 'past', 'future', 'imperative'];
const REQUIRED_PRESENT = ['ms', 'fs', 'mp', 'fp'];
const REQUIRED_PAST_FUTURE = ['ani', 'ata', 'at', 'hu', 'hi', 'anachnu', 'atem', 'hem'];
const REQUIRED_IMPERATIVE = ['ms', 'fs', 'mp', 'fp'];

function normalizeHebrew(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/[\u0591-\u05C7]/g, '')
    .replace(/[\u200E\u200F]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

function readExistingFiles() {
  return DATA_FILES
    .map((relPath) => ({ relPath, absPath: path.join(ROOT, relPath) }))
    .filter(({ absPath }) => fs.existsSync(absPath))
    .map(({ relPath, absPath }) => ({ relPath, content: fs.readFileSync(absPath, 'utf8') }));
}

function getStringProperty(block, name) {
  const match = block.match(new RegExp(`${name}\\s*:\\s*\"([^\"]*)\"`));
  return match ? match[1] : '';
}

function getObjectBlocks(content) {
  const blocks = [];
  const idRegex = /\{\s*id\s*:\s*\"[^\"]+\"/g;
  let match;
  while ((match = idRegex.exec(content))) {
    let depth = 0;
    let start = match.index;
    let end = start;
    let inString = false;
    let escaped = false;

    for (let i = start; i < content.length; i += 1) {
      const ch = content[i];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === '"') {
        inString = !inString;
        continue;
      }
      if (inString) continue;
      if (ch === '{') depth += 1;
      if (ch === '}') {
        depth -= 1;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    if (end > start) blocks.push(content.slice(start, end));
  }
  return blocks;
}

function hasPath(block, parts) {
  let searchStart = 0;
  for (const part of parts) {
    const re = new RegExp(`${part}\\s*:`);
    const slice = block.slice(searchStart);
    const match = slice.match(re);
    if (!match) return false;
    searchStart += match.index + match[0].length;
  }
  return true;
}

function validate() {
  const errors = [];
  const warnings = [];
  const files = readExistingFiles();
  const verbs = [];

  for (const file of files) {
    for (const block of getObjectBlocks(file.content)) {
      const verb = {
        file: file.relPath,
        id: getStringProperty(block, 'id'),
        infinitive: getStringProperty(block, 'infinitive_hebrew'),
        block,
      };
      if (!verb.id || !verb.infinitive) continue;
      verbs.push(verb);

      for (const field of REQUIRED_FIELDS) {
        if (!getStringProperty(block, field)) {
          errors.push(`${file.relPath}: ${verb.id} missing ${field}`);
        }
      }

      if (!/conjugations\s*:/.test(block)) {
        errors.push(`${file.relPath}: ${verb.id} ${verb.infinitive} missing conjugations`);
        continue;
      }

      for (const tense of REQUIRED_TENSES) {
        if (!hasPath(block, ['conjugations', tense])) {
          errors.push(`${file.relPath}: ${verb.id} ${verb.infinitive} missing ${tense}`);
        }
      }
      for (const person of REQUIRED_PRESENT) {
        if (!hasPath(block, ['present', person])) {
          errors.push(`${file.relPath}: ${verb.id} ${verb.infinitive} missing present.${person}`);
        }
      }
      for (const tense of ['past', 'future']) {
        for (const person of REQUIRED_PAST_FUTURE) {
          if (!hasPath(block, [tense, person])) {
            errors.push(`${file.relPath}: ${verb.id} ${verb.infinitive} missing ${tense}.${person}`);
          }
        }
      }
      for (const person of REQUIRED_IMPERATIVE) {
        if (!hasPath(block, ['imperative', person])) {
          warnings.push(`${file.relPath}: ${verb.id} ${verb.infinitive} missing imperative.${person}`);
        }
      }
    }
  }

  const ids = new Map();
  const infinitives = new Map();

  for (const verb of verbs) {
    if (ids.has(verb.id)) {
      errors.push(`Duplicate id ${verb.id}: ${ids.get(verb.id)} and ${verb.file}`);
    } else {
      ids.set(verb.id, verb.file);
    }

    const normalizedInfinitive = normalizeHebrew(verb.infinitive);
    if (infinitives.has(normalizedInfinitive)) {
      errors.push(`Duplicate infinitive ${verb.infinitive}: ${infinitives.get(normalizedInfinitive)} and ${verb.file}`);
    } else {
      infinitives.set(normalizedInfinitive, verb.file);
    }
  }

  if (STRICT_COUNT && verbs.length !== TARGET_COUNT) {
    errors.push(`Expected exactly ${TARGET_COUNT} verbs, found ${verbs.length}`);
  }

  console.log(`Dictionary validator checked ${verbs.length} verb records.`);
  if (warnings.length) {
    console.warn(`Warnings (${warnings.length}):`);
    for (const warning of warnings.slice(0, 50)) console.warn(`- ${warning}`);
    if (warnings.length > 50) console.warn(`...and ${warnings.length - 50} more warnings`);
  }

  if (errors.length) {
    console.error(`Errors (${errors.length}):`);
    for (const error of errors.slice(0, 100)) console.error(`- ${error}`);
    if (errors.length > 100) console.error(`...and ${errors.length - 100} more errors`);
    process.exit(1);
  }

  console.log('Dictionary validator passed.');
}

validate();
