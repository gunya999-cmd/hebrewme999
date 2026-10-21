#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, "").split("=");
  return [key, rest.join("=") || "true"];
}));

if (!args.worklist || !args.rank || !args.text) {
  console.error("Usage: node scripts/pealim-paste-extract.mjs --worklist=tmp/batch.json --rank=34 --text=tmp/34.txt --out=tmp/batch.updated.json");
  process.exit(1);
}

const out = args.out || args.worklist;
const rank = Number(args.rank);
const worklist = JSON.parse(readFileSync(resolve(args.worklist), "utf8"));
const pageText = readFileSync(resolve(args.text), "utf8");
const entries = Array.isArray(worklist) ? worklist : worklist.entries;
const entry = entries.find((item) => item.rank === rank);

if (!entry) throw new Error(`Rank not found in worklist: ${rank}`);

const hasHebrew = (value) => /[א-ת]/.test(String(value || ""));
const tokens = (value) => (String(value || "").match(/[א-ת][א-תָ-ּׂ-ֿ׳״־\s-]*/g) || [])
  .map((item) => item.trim())
  .filter((item) => hasHebrew(item) && item.length > 1);

const section = (startWords, stopWords) => {
  const lines = pageText.split(/\r?\n/);
  const outLines = [];
  let active = false;
  for (const line of lines) {
    if (startWords.some((word) => line.includes(word))) active = true;
    else if (active && stopWords.some((word) => line.includes(word))) break;
    if (active) outLines.push(line);
  }
  return tokens(outLines.join("\n"));
};

const present = section(["Настоящее", "Present", "הווה"], ["Прошедшее", "Past", "עבר"]);
const past = section(["Прошедшее", "Past", "עבר"], ["Будущее", "Future", "עתיד"]);
const future = section(["Будущее", "Future", "עתיד"], ["Повелительное", "Imperative", "ציווי"]);
const imperative = section(["Повелительное", "Imperative", "ציווי"], ["Инфинитив", "Infinitive", "שם הפועל"]);

entry.candidateForms = { present, past, future, imperative };
entry.extractionStatus = "paste_candidate_extracted";
entry.reviewStatus = "needs_spot_check";

if (args.apply === "true") {
  entry.extractedForms ||= {};
  entry.extractedForms.present = { ms: present[0] || "", fs: present[1] || "", mp: present[2] || "", fp: present[3] || "" };
  entry.extractedForms.past = {
    ani: past[0] || "", ata: past[1] || "", at: past[2] || "", hu: past[3] || "", hi: past[4] || "",
    anachnu: past[5] || "", atem: past[6] || "", aten: past[7] || "", hem: past[8] || "", hen: past[9] || "",
  };
  entry.extractedForms.future = {
    ani: future[0] || "", ata: future[1] || "", at: future[2] || "", hu: future[3] || "", hi: future[4] || "",
    anachnu: future[5] || "", atem: future[6] || "", aten: future[7] || "", hem: future[8] || "", hen: future[9] || "",
  };
  entry.extractedForms.imperative = { ms: imperative[0] || "", fs: imperative[1] || "", mp: imperative[2] || "", fp: imperative[3] || "" };
  entry.workflowStatus = "extracted";
}

writeFileSync(resolve(out), `${JSON.stringify(worklist, null, 2)}\n`, "utf8");
console.log(`Updated rank ${rank}: ${entry.infinitive}`);
console.log(JSON.stringify({ present: present.length, past: past.length, future: future.length, imperative: imperative.length }, null, 2));
