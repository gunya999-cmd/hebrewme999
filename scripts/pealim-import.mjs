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
const defaultStatus = args.status || "pending";
const out = resolve(repoRoot, args.out || `src/data/generated/pealim-import-worklist-${from}-${to}.json`);

const VALID_STATUSES = new Set(["pending", "extracted", "reviewed", "blocked"]);
if (!VALID_STATUSES.has(defaultStatus)) {
  throw new Error(`Invalid --status=${defaultStatus}. Use pending, extracted, reviewed or blocked.`);
}

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

const emptyForms = () => ({
  present: { ms: "", fs: "", mp: "", fp: "" },
  past: { ani: "", ata: "", at: "", hu: "", hi: "", anachnu: "", atem: "", aten: "", hem: "", hen: "" },
  future: { ani: "", ata: "", at: "", hu: "", hi: "", anachnu: "", atem: "", aten: "", hem: "", hen: "" },
  imperative: { ms: "", fs: "", mp: "", fp: "" },
});

const inferReviewFlags = (entry) => {
  const flags = [];
  if (entry.difficulty !== "easy") flags.push("difficulty_not_easy");
  if (/להת/.test(entry.infinitive)) flags.push("hitpael_or_reflexive_candidate");
  if (/ות$/.test(entry.infinitive)) flags.push("weak_final_he_candidate");
  if (/להכ|להר|להמ|להפ/.test(entry.infinitive)) flags.push("hifil_candidate");
  if (/Pealim search/.test(entry.pealimUrl) || entry.pealimUrl.includes("/search/")) flags.push("needs_exact_dict_url");
  return flags;
};

const createEntry = (entry) => ({
  ...entry,
  workflowStatus: defaultStatus,
  extractionStatus: defaultStatus === "pending" ? "not_started" : defaultStatus,
  reviewStatus: defaultStatus === "reviewed" ? "reviewed" : "needs_spot_check",
  blockerReason: defaultStatus === "blocked" ? "fill_reason_here" : "",
  reviewFlags: inferReviewFlags(entry),
  pealimMeta: {
    exactDictUrlConfirmed: !entry.pealimUrl.includes("/search/"),
    root: "",
    binyan: "",
    infinitiveWithNiqqud: "",
    pealimMeaning: "",
    notes: "",
  },
  extractedForms: emptyForms(),
});

const entries = selected.map(createEntry);

const worklist = {
  range: { from, to },
  status: "needs_pealim_extraction",
  allowedWorkflowStatuses: [...VALID_STATUSES],
  summary: {
    total: entries.length,
    pending: entries.filter((entry) => entry.workflowStatus === "pending").length,
    extracted: entries.filter((entry) => entry.workflowStatus === "extracted").length,
    reviewed: entries.filter((entry) => entry.workflowStatus === "reviewed").length,
    blocked: entries.filter((entry) => entry.workflowStatus === "blocked").length,
    withExactDictUrl: entries.filter((entry) => entry.pealimMeta.exactDictUrlConfirmed).length,
    needsExactDictUrl: entries.filter((entry) => !entry.pealimMeta.exactDictUrlConfirmed).length,
  },
  instructions: [
    "Open each pealimUrl and replace search URLs with exact /dict/ URLs when possible.",
    "Copy root, binyan, infinitive with niqqud and meanings into pealimMeta.",
    "Copy Pealim present, past, future and imperative tables into extractedForms.",
    "Set workflowStatus to extracted after all forms are copied.",
    "Set workflowStatus to reviewed only after human spot-check of weak roots and formal feminine plural forms.",
    "Set workflowStatus to blocked and fill blockerReason if the Pealim page is ambiguous or not found.",
    "Run scripts/pealim-promote-worklist.mjs only when entries are extracted/reviewed and not blocked.",
  ],
  entries,
};

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(worklist, null, 2)}\n`, "utf8");
console.log(`Wrote ${selected.length} Pealim worklist entries to ${out}`);
console.log(`Status summary: ${JSON.stringify(worklist.summary)}`);
