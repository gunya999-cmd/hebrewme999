const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'src/data');
const BATCH_FILE_RE = /^verbs-pealim-batch-.*\.ts$/;
const HEBREW_RE = /[\u0590-\u05FF]/;
const CYRILLIC_RE = /[А-Яа-яЁё]/;
const EXPECTED_FORMS_PER_FULL_VERB = 28;

function listBatchFiles() {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs.readdirSync(DATA_DIR)
    .filter((file) => BATCH_FILE_RE.test(file))
    .map((file) => path.join(DATA_DIR, file));
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

function validateFormTriples(block, label, errors) {
  const formRe = /f\(\s*\"([^\"]*)\"\s*,\s*\"([^\"]*)\"\s*,\s*\"([^\"]*)\"\s*\)/g;
  const matches = [...block.matchAll(formRe)];

  if (matches.length !== EXPECTED_FORMS_PER_FULL_VERB) {
    errors.push(`${label} expected ${EXPECTED_FORMS_PER_FULL_VERB} f(hebrew, transcription, translation) forms, found ${matches.length}`);
  }

  for (const [index, match] of matches.entries()) {
    const [, hebrew, transcription, translation] = match;
    const formLabel = `${label} form #${index + 1}`;

    if (!hebrew.trim()) errors.push(`${formLabel} missing Hebrew text`);
    if (!transcription.trim()) errors.push(`${formLabel} missing Russian transcription`);
    if (!translation.trim()) errors.push(`${formLabel} missing Russian translation`);

    if (!HEBREW_RE.test(hebrew)) errors.push(`${formLabel} Hebrew text does not contain Hebrew letters: ${hebrew}`);
    if (HEBREW_RE.test(transcription)) errors.push(`${formLabel} transcription contains Hebrew letters: ${transcription}`);
    if (!CYRILLIC_RE.test(transcription)) errors.push(`${formLabel} transcription should be Russian-readable Cyrillic: ${transcription}`);
    if (HEBREW_RE.test(translation)) errors.push(`${formLabel} translation contains Hebrew letters: ${translation}`);
  }
}

function validate() {
  const errors = [];
  const files = listBatchFiles();
  let verbCount = 0;

  for (const file of files) {
    const relPath = path.relative(ROOT, file);
    const content = fs.readFileSync(file, 'utf8');

    for (const block of getObjectBlocks(content)) {
      verbCount += 1;
      const id = getStringProperty(block, 'id') || 'missing-id';
      const infinitive = getStringProperty(block, 'infinitive_hebrew') || 'missing-infinitive';
      const infinitiveTranscription = getStringProperty(block, 'transcription_ru');
      const label = `${relPath}:${id}:${infinitive}`;

      if (!infinitiveTranscription.trim()) {
        errors.push(`${label} missing infinitive transcription_ru`);
      } else {
        if (HEBREW_RE.test(infinitiveTranscription)) {
          errors.push(`${label} infinitive transcription contains Hebrew letters: ${infinitiveTranscription}`);
        }
        if (!CYRILLIC_RE.test(infinitiveTranscription)) {
          errors.push(`${label} infinitive transcription should be Russian-readable Cyrillic: ${infinitiveTranscription}`);
        }
      }

      validateFormTriples(block, label, errors);
    }
  }

  console.log(`Pealim transcription validator checked ${verbCount} staged verbs in ${files.length} files.`);

  if (errors.length) {
    console.error(`Errors (${errors.length}):`);
    for (const error of errors.slice(0, 100)) console.error(`- ${error}`);
    if (errors.length > 100) console.error(`...and ${errors.length - 100} more errors`);
    process.exit(1);
  }

  console.log('Pealim transcription validator passed.');
}

validate();
