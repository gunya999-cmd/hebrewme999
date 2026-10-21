#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { validatePealimVerbs } from "./pealim-validate.mjs";

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  }),
);

const input = args.input;
const out = args.out || "src/data/generated/pealim-verified-verbs-promoted.ts";
const constName = args.constName || "GENERATED_PEALIM_VERBS_PROMOTED";
const allowPending = args.allowPending === "true";

if (!input) {
  console.error("Usage: node scripts/pealim-promote-worklist.mjs --input=worklist.json --out=src/data/generated/file.ts");
  process.exit(1);
}

const stripNiqqud = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0591-\u05C7]/g, "")
  .normalize("NFC");

const isFilled = (value) => String(value || "").trim().length > 0;

const makeForm = (hebrew, translation_ru) => ({
  hebrew: String(hebrew || "").trim(),
  hebrew_plain: stripNiqqud(hebrew).trim(),
  transcription_ru: "",
  translation_ru,
});

const normalizeBinyan = (entry) => {
  const value = String(entry.pealimMeta?.binyan || entry.binyan || entry.binyan_hebrew || "").trim();
  if (value) return value;
  return "פעל";
};

const getRoot = (entry) => String(entry.pealimMeta?.root || entry.root || "").trim();
const getInfinitiveWithNiqqud = (entry) => String(entry.pealimMeta?.infinitiveWithNiqqud || entry.infinitive_hebrew || entry.infinitive || "").trim();
const getPealimMeaning = (entry) => String(entry.pealimMeta?.pealimMeaning || entry.translation_ru || "").trim();

const defaultTranslations = (ru) => ({
  present: {
    ms: `${ru} / я, ты, он`,
    fs: `${ru} / я, ты, она`,
    mp: `${ru} / мы, вы, они м. р.`,
    fp: `${ru} / мы, вы, они ж. р.`,
  },
  past: {
    ani: `я: ${ru}`,
    ata: `ты м. р.: ${ru}`,
    at: `ты ж. р.: ${ru}`,
    hu: `он: ${ru}`,
    hi: `она: ${ru}`,
    anachnu: `мы: ${ru}`,
    atem: `вы м. р.: ${ru}`,
    aten: `вы ж. р.: ${ru}`,
    hem: `они м. р.: ${ru}`,
    hen: `они ж. р.: ${ru}`,
  },
  future: {
    ani: `я: ${ru}`,
    ata: `ты м. р.: ${ru}`,
    at: `ты ж. р.: ${ru}`,
    hu: `он: ${ru}`,
    hi: `она: ${ru}`,
    anachnu: `мы: ${ru}`,
    atem: `вы м. р.: ${ru}`,
    aten: `вы ж. р.: ${ru}`,
    hem: `они м. р.: ${ru}`,
    hen: `они ж. р.: ${ru}`,
  },
  imperative: {
    ms: `${ru}! мужчине`,
    fs: `${ru}! женщине`,
    mp: `${ru}! мужчинам или смешанной группе`,
    fp: `${ru}! женщинам`,
  },
});

const validateWorkflow = (entries) => {
  const errors = [];

  for (const entry of entries) {
    const label = `rank ${entry.rank} ${entry.infinitive}`;
    const status = entry.workflowStatus || entry.extractionStatus || "pending";

    if (status === "blocked") {
      errors.push(`${label}: blocked (${entry.blockerReason || "no reason"})`);
      continue;
    }

    if (!allowPending && status === "pending") {
      errors.push(`${label}: still pending; set workflowStatus to extracted/reviewed or pass --allowPending=true`);
    }

    if (entry.pealimUrl?.includes("/search/") && !entry.pealimMeta?.exactDictUrlConfirmed) {
      errors.push(`${label}: Pealim URL is still a search URL; replace it with exact /dict/ URL`);
    }

    if (!isFilled(getRoot(entry))) errors.push(`${label}: missing pealimMeta.root`);
    if (!isFilled(normalizeBinyan(entry))) errors.push(`${label}: missing pealimMeta.binyan`);
    if (!isFilled(getInfinitiveWithNiqqud(entry))) errors.push(`${label}: missing pealimMeta.infinitiveWithNiqqud`);

    const forms = entry.extractedForms || {};
    const required = [
      ["present.ms", forms.present?.ms], ["present.fs", forms.present?.fs], ["present.mp", forms.present?.mp], ["present.fp", forms.present?.fp],
      ["past.ani", forms.past?.ani], ["past.ata", forms.past?.ata], ["past.at", forms.past?.at], ["past.hu", forms.past?.hu], ["past.hi", forms.past?.hi],
      ["past.anachnu", forms.past?.anachnu], ["past.atem", forms.past?.atem], ["past.aten", forms.past?.aten], ["past.hem", forms.past?.hem], ["past.hen", forms.past?.hen],
      ["future.ani", forms.future?.ani], ["future.ata", forms.future?.ata], ["future.at", forms.future?.at], ["future.hu", forms.future?.hu], ["future.hi", forms.future?.hi],
      ["future.anachnu", forms.future?.anachnu], ["future.atem", forms.future?.atem], ["future.aten", forms.future?.aten], ["future.hem", forms.future?.hem], ["future.hen", forms.future?.hen],
      ["imperative.ms", forms.imperative?.ms], ["imperative.fs", forms.imperative?.fs], ["imperative.mp", forms.imperative?.mp], ["imperative.fp", forms.imperative?.fp],
    ];

    for (const [name, value] of required) {
      if (!isFilled(value)) errors.push(`${label}: missing extractedForms.${name}`);
    }
  }

  return errors;
};

const promoteEntry = (entry) => {
  const forms = entry.extractedForms || {};
  const ru = getPealimMeaning(entry);
  const t = defaultTranslations(ru);

  return {
    id: `pv-${String(entry.rank).padStart(4, "0")}`,
    frequencyRank: entry.rank,
    tier: entry.tier,
    infinitive_hebrew: getInfinitiveWithNiqqud(entry),
    infinitive_hebrew_plain: entry.infinitive,
    transcription_ru: entry.transcription_ru || "",
    translation_ru: ru,
    root: getRoot(entry),
    binyan: normalizeBinyan(entry),
    difficulty: entry.difficulty,
    source: "pealim",
    sourceUrl: entry.pealimUrl,
    checkedAt: entry.checkedAt || new Date().toISOString().slice(0, 10),
    notes: entry.notes || "Promoted from Pealim worklist. Human spot-check required before final release.",
    conjugations: {
      present: {
        ms: makeForm(forms.present?.ms, t.present.ms),
        fs: makeForm(forms.present?.fs, t.present.fs),
        mp: makeForm(forms.present?.mp, t.present.mp),
        fp: makeForm(forms.present?.fp, t.present.fp),
      },
      past: {
        ani: makeForm(forms.past?.ani, t.past.ani),
        ata: makeForm(forms.past?.ata, t.past.ata),
        at: makeForm(forms.past?.at, t.past.at),
        hu: makeForm(forms.past?.hu, t.past.hu),
        hi: makeForm(forms.past?.hi, t.past.hi),
        anachnu: makeForm(forms.past?.anachnu, t.past.anachnu),
        atem: makeForm(forms.past?.atem, t.past.atem),
        aten: makeForm(forms.past?.aten, t.past.aten),
        hem: makeForm(forms.past?.hem, t.past.hem),
        hen: makeForm(forms.past?.hen, t.past.hen),
      },
      future: {
        ani: makeForm(forms.future?.ani, t.future.ani),
        ata: makeForm(forms.future?.ata, t.future.ata),
        at: makeForm(forms.future?.at, t.future.at),
        hu: makeForm(forms.future?.hu, t.future.hu),
        hi: makeForm(forms.future?.hi, t.future.hi),
        anachnu: makeForm(forms.future?.anachnu, t.future.anachnu),
        atem: makeForm(forms.future?.atem, t.future.atem),
        aten: makeForm(forms.future?.aten, t.future.aten),
        hem: makeForm(forms.future?.hem, t.future.hem),
        hen: makeForm(forms.future?.hen, t.future.hen),
      },
      imperative: {
        ms: makeForm(forms.imperative?.ms, t.imperative.ms),
        fs: makeForm(forms.imperative?.fs, t.imperative.fs),
        mp: makeForm(forms.imperative?.mp, t.imperative.mp),
        fp: makeForm(forms.imperative?.fp, t.imperative.fp),
      },
    },
  };
};

const payload = JSON.parse(readFileSync(resolve(input), "utf8"));
const entries = Array.isArray(payload) ? payload : payload.entries;

const workflowErrors = validateWorkflow(entries);
if (workflowErrors.length) {
  console.error(`Cannot promote worklist; ${workflowErrors.length} workflow issue(s):`);
  for (const error of workflowErrors) console.error(`- ${error}`);
  process.exit(1);
}

const verbs = entries.map(promoteEntry);
const dataErrors = validatePealimVerbs(verbs);

if (dataErrors.length) {
  console.error(`Cannot promote worklist; ${dataErrors.length} data validation issue(s):`);
  for (const error of dataErrors) console.error(`- ${error}`);
  process.exit(1);
}

const output = `// Generated by scripts/pealim-promote-worklist.mjs.\n// Human spot-check required before marking final-reviewed.\n\nimport type { PealimVerifiedVerb } from "../pealim-verified-verbs-700";\n\nexport const ${constName}: PealimVerifiedVerb[] = ${JSON.stringify(verbs, null, 2)};\n`;

const outPath = resolve(out);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, output, "utf8");
console.log(`Promoted ${verbs.length} verb(s) to ${outPath}`);
