#!/usr/bin/env node

import { readFileSync } from "node:fs";

const REQUIRED_PRESENT = ["ms", "fs", "mp", "fp"];
const REQUIRED_TEN_PERSON = ["ani", "ata", "at", "hu", "hi", "anachnu", "atem", "aten", "hem", "hen"];
const REQUIRED_IMPERATIVE = ["ms", "fs", "mp", "fp"];
const VALID_BINYANIM = new Set(["פעל", "נפעל", "פיעל", "פועל", "הפעיל", "הופעל", "התפעל"]);

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

const assertUnique = (items, getKey, label, errors) => {
  const seen = new Map();
  for (const item of items) {
    const key = getKey(item);
    if (seen.has(key)) {
      errors.push(`Duplicate ${label}: ${key} at ranks ${seen.get(key)} and ${item.frequencyRank ?? item.rank}`);
    } else {
      seen.set(key, item.frequencyRank ?? item.rank);
    }
  }
};

const assertVerbForm = (form, label, errors) => {
  if (!form || typeof form !== "object") {
    errors.push(`${label}: missing form object`);
    return;
  }
  for (const field of ["hebrew", "hebrew_plain", "transcription_ru", "translation_ru"]) {
    if (typeof form[field] !== "string" || form[field].trim() === "") {
      errors.push(`${label}: missing ${field}`);
    }
  }
};

const assertFormGroup = (group, keys, label, errors) => {
  if (!group || typeof group !== "object") {
    errors.push(`${label}: missing group`);
    return;
  }
  for (const key of keys) assertVerbForm(group[key], `${label}.${key}`, errors);
};

export const validatePealimVerbs = (verbs) => {
  const errors = [];

  if (!Array.isArray(verbs)) {
    return ["Input must be an array of PealimVerifiedVerb-like objects"];
  }

  assertUnique(verbs, (verb) => verb.frequencyRank, "frequencyRank", errors);
  assertUnique(verbs, (verb) => verb.infinitive_hebrew_plain, "infinitive_hebrew_plain", errors);

  for (const verb of verbs) {
    const label = `rank ${verb.frequencyRank ?? "?"} ${verb.infinitive_hebrew_plain ?? "?"}`;

    if (!Number.isInteger(verb.frequencyRank)) errors.push(`${label}: frequencyRank must be integer`);
    if (!verb.id) errors.push(`${label}: missing id`);
    if (!verb.infinitive_hebrew) errors.push(`${label}: missing infinitive_hebrew`);
    if (!verb.infinitive_hebrew_plain) errors.push(`${label}: missing infinitive_hebrew_plain`);
    if (!verb.translation_ru) errors.push(`${label}: missing translation_ru`);
    if (!verb.root) errors.push(`${label}: missing root`);
    if (!VALID_BINYANIM.has(verb.binyan)) errors.push(`${label}: invalid or missing binyan ${verb.binyan}`);
    if (verb.source !== "pealim") errors.push(`${label}: source must be pealim`);
    if (!String(verb.sourceUrl ?? "").startsWith("https://www.pealim.com/")) errors.push(`${label}: invalid sourceUrl`);

    const conjugations = verb.conjugations;
    if (!conjugations || typeof conjugations !== "object") {
      errors.push(`${label}: missing conjugations`);
      continue;
    }

    assertFormGroup(conjugations.present, REQUIRED_PRESENT, `${label}.present`, errors);
    assertFormGroup(conjugations.past, REQUIRED_TEN_PERSON, `${label}.past`, errors);
    assertFormGroup(conjugations.future, REQUIRED_TEN_PERSON, `${label}.future`, errors);
    assertFormGroup(conjugations.imperative, REQUIRED_IMPERATIVE, `${label}.imperative`, errors);
  }

  return errors;
};

const maybeMain = () => {
  const inputPath = process.argv[2];
  if (!inputPath) return;

  const payload = readJson(inputPath);
  const verbs = Array.isArray(payload) ? payload : payload.verbs;
  const errors = validatePealimVerbs(verbs);

  if (errors.length) {
    console.error(`Pealim validation failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`Pealim validation passed: ${verbs.length} verb(s).`);
};

maybeMain();
