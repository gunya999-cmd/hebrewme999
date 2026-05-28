const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'src/data');
const BATCH_FILE_RE = /^verbs-pealim-batch-.*\.ts$/;

function normalizeHebrew(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/[\u0591-\u05C7]/g, '')
    .replace(/[\u200E\u200F]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

function getStringProperty(block, name) {
  const match = block.match(new RegExp(`${name}\\s*:\\s*\"([^\"]*)\"`));
  return match ? match[1] : '';
}

function getNumberProperty(block, name) {
  const match = block.match(new RegExp(`${name}\\s*:\\s*(\\d+)`));
  return match ? Number(match[1]) : undefined;
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

function listBatchFiles() {
  if (!fs.existsSync(DATA_DIR)) return [];
  return fs.readdirSync(DATA_DIR)
    .filter((file) => BATCH_FILE_RE.test(file))
    .map((file) => path.join(DATA_DIR, file));
}

function validateBatchFiles() {
  const files = listBatchFiles();
  const errors = [];
  const seenIds = new Map();
  const seenInfinitives = new Map();
  const seenRanks = new Map();
  let count = 0;

  for (const file of files) {
    const relPath = path.relative(ROOT, file);
    const content = fs.readFileSync(file, 'utf8');
    const blocks = getObjectBlocks(content);

    for (const block of blocks) {
      count += 1;
      const id = getStringProperty(block, 'id');
      const infinitive = getStringProperty(block, 'infinitive_hebrew');
      const rank = getNumberProperty(block, 'frequencyRank');
      const label = `${relPath}:${id || 'missing-id'}:${infinitive || 'missing-infinitive'}`;

      if (!id) errors.push(`${label} missing id`);
      if (!infinitive) errors.push(`${label} missing infinitive_hebrew`);
      if (!rank) errors.push(`${label} missing frequencyRank`);
      if (!/conjugations\s*:/.test(block)) errors.push(`${label} missing conjugations`);

      for (const field of ['transcription_ru', 'translation_ru', 'root', 'binyan', 'difficulty']) {
        if (!getStringProperty(block, field)) errors.push(`${label} missing ${field}`);
      }

      for (const tense of ['present', 'past', 'future', 'imperative']) {
        if (!hasPath(block, ['conjugations', tense])) errors.push(`${label} missing ${tense}`);
      }
      for (const person of ['ms', 'fs', 'mp', 'fp']) {
        if (!hasPath(block, ['present', person])) errors.push(`${label} missing present.${person}`);
        if (!hasPath(block, ['imperative', person])) errors.push(`${label} missing imperative.${person}`);
      }
      for (const tense of ['past', 'future']) {
        for (const person of ['ani', 'ata', 'at', 'hu', 'hi', 'anachnu', 'atem', 'aten', 'hem', 'hen']) {
          if (!hasPath(block, [tense, person])) errors.push(`${label} missing ${tense}.${person}`);
        }
      }

      if (id) {
        if (seenIds.has(id)) errors.push(`Duplicate batch id ${id}: ${seenIds.get(id)} and ${relPath}`);
        seenIds.set(id, relPath);
      }

      const normalizedInfinitive = normalizeHebrew(infinitive);
      if (normalizedInfinitive) {
        if (seenInfinitives.has(normalizedInfinitive)) {
          errors.push(`Duplicate batch infinitive ${infinitive}: ${seenInfinitives.get(normalizedInfinitive)} and ${relPath}`);
        }
        seenInfinitives.set(normalizedInfinitive, relPath);
      }

      if (rank) {
        if (seenRanks.has(rank)) errors.push(`Duplicate frequencyRank ${rank}: ${seenRanks.get(rank)} and ${relPath}`);
        seenRanks.set(rank, relPath);
      }
    }
  }

  console.log(`Pealim batch validator checked ${count} records in ${files.length} files.`);

  if (errors.length) {
    console.error(`Errors (${errors.length}):`);
    for (const error of errors.slice(0, 100)) console.error(`- ${error}`);
    if (errors.length > 100) console.error(`...and ${errors.length - 100} more errors`);
    process.exit(1);
  }

  console.log('Pealim batch validator passed.');
}

validateBatchFiles();
