#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  }),
);

const from = Number(args.from || 34);
const to = Number(args.to || 53);
const out = resolve(repoRoot, args.out || `src/data/generated/pealim-import-worklist-${from}-${to}.json`);

const sourceMapPath = resolve(repoRoot, "src/data/pealim-source-map-top350.ts");
const sourceMapText = readFileSync(sourceMapPath, "utf8");

const sourceEntries = [...sourceMapText.matchAll(
  /rank: (\d+), infinitive: "([^"]+)", translation_ru: "([^"]+)", pealimUrl: "([^"]+)", tier: "([^"]+)", difficulty: "([^"]+)"/g,
)].map((match) => ({
  rank: Number(match[1]),
  infinitive: match[2],
  translation_ru: match[3],
  pealimUrl: match[4],
  tier: match[5],
  difficulty: match[6],
}));

const selected = sourceEntries.filter((entry) => entry.rank >= from && entry.rank <= to);

if (selected.length === 0) {
  throw new Error(`No Pealim source entries found for ranks ${from}-${to}`);
}

const worklist = {
  range: { from, to },
  status: "needs_pealim_extraction",
  instructions: [
    "Open each pealimUrl and copy the Pealim tables into extractedForms.",
    "Then run scripts/pealim-validate.mjs against the generated JSON before committing app data.",
    "Do not mark an entry as final-reviewed until a human spot-checks weak roots and feminine plural forms.",
  ],
  entries: selected.map((entry) => ({
    ...entry,
    extractionStatus: "pending",
    extractedForms: {
      present: { ms: "", fs: "", mp: "", fp: "" },
      past: { ani: "", ata: "", at: "", hu: "", hi: "", anachnu: "", atem: "", aten: "", hem: "", hen: "" },
      future: { ani: "", ata: "", at: "", hu: "", hi: "", anachnu: "", atem: "", aten: "", hem: "", hen: "" },
      imperative: { ms: "", fs: "", mp: "", fp: "" },
    },
  })),
};

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(worklist, null, 2)}\n`, "utf8");
console.log(`Wrote ${selected.length} Pealim worklist entries to ${out}`);
