#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const input = process.argv[2] || process.argv.find((arg) => arg.startsWith("--input="))?.split("=").slice(1).join("=");

if (!input) {
  console.error("Usage: node scripts/pealim-worklist-status.mjs tmp/pealim-034-053.json");
  process.exit(1);
}

const payload = JSON.parse(readFileSync(resolve(input), "utf8"));
const entries = Array.isArray(payload) ? payload : payload.entries;

if (!Array.isArray(entries)) {
  console.error("Input must be a worklist JSON with an entries array.");
  process.exit(1);
}

const formSlots = [
  "present.ms", "present.fs", "present.mp", "present.fp",
  "past.ani", "past.ata", "past.at", "past.hu", "past.hi", "past.anachnu", "past.atem", "past.aten", "past.hem", "past.hen",
  "future.ani", "future.ata", "future.at", "future.hu", "future.hi", "future.anachnu", "future.atem", "future.aten", "future.hem", "future.hen",
  "imperative.ms", "imperative.fs", "imperative.mp", "imperative.fp",
];

const get = (object, path) => path.split(".").reduce((current, key) => current?.[key], object);
const filled = (value) => String(value || "").trim().length > 0;

const statusCounts = { pending: 0, extracted: 0, reviewed: 0, blocked: 0, other: 0 };
const rows = [];
let totalMissingForms = 0;
let promotionBlockers = 0;

for (const entry of entries) {
  const status = entry.workflowStatus || "pending";
  if (statusCounts[status] === undefined) statusCounts.other += 1;
  else statusCounts[status] += 1;

  const missingForms = formSlots.filter((slot) => !filled(get(entry.extractedForms || {}, slot)));
  const metaMissing = [];
  if (!filled(entry.pealimMeta?.root)) metaMissing.push("root");
  if (!filled(entry.pealimMeta?.binyan)) metaMissing.push("binyan");
  if (!filled(entry.pealimMeta?.infinitiveWithNiqqud)) metaMissing.push("infinitiveWithNiqqud");
  if (entry.pealimUrl?.includes("/search/") && !entry.pealimMeta?.exactDictUrlConfirmed) metaMissing.push("exactDictUrl");

  const blockers = [];
  if (status === "pending") blockers.push("pending");
  if (status === "blocked") blockers.push(`blocked:${entry.blockerReason || "no_reason"}`);
  if (missingForms.length) blockers.push(`${missingForms.length}_missing_forms`);
  if (metaMissing.length) blockers.push(`missing_meta:${metaMissing.join(",")}`);

  if (blockers.length) promotionBlockers += 1;
  totalMissingForms += missingForms.length;

  rows.push({
    rank: entry.rank,
    infinitive: entry.infinitive,
    status,
    missingForms: missingForms.length,
    missingMeta: metaMissing.join(",") || "-",
    flags: (entry.reviewFlags || []).join(",") || "-",
    blockers: blockers.join(";") || "-",
  });
}

console.log("Pealim worklist status");
console.log(JSON.stringify({
  total: entries.length,
  statusCounts,
  totalMissingForms,
  promotionBlockers,
}, null, 2));

console.table(rows);

if (promotionBlockers > 0) {
  process.exitCode = 1;
}
