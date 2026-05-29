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

if (!input) {
  console.error("Usage: node scripts/pealim-promote-worklist.mjs --input=worklist.json --out=src/data/generated/file.ts");
  process.exit(1);
}

const stripNiqqud = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0591-\u05C7]/g, "")
  .normalize("NFC");

const makeForm = (hebrew, translation_ru) => ({
  hebrew: String(hebrew || "").trim(),
  hebrew_plain: stripNiqqud(hebrew).trim(),
  transcription_ru: "",
  translation_ru,
});

const normalizeBinyan = (entry) => {
  const value = String(entry.binyan || entry.binyan_hebrew || "").trim();
  if (value) return value;
  return "פעל";
};

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

const promoteEntry = (entry) => {
  const forms = entry.extractedForms || {};
  const t = defaultTranslations(entry.translation_ru);

  return {
    id: `pv-${String(entry.rank).padStart(4, "0")}`,
    frequencyRank: entry.rank,
    tier: entry.tier,
    infinitive_hebrew: entry.infinitive_hebrew || entry.infinitive,
    infinitive_hebrew_plain: entry.infinitive,
    transcription_ru: entry.transcription_ru || "",
    translation_ru: entry.translation_ru,
    root: entry.root || "CHECK_ROOT",
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
const verbs = entries.map(promoteEntry);
const errors = validatePealimVerbs(verbs);

if (errors.length) {
  console.error(`Cannot promote worklist; ${errors.length} validation issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const output = `// Generated by scripts/pealim-promote-worklist.mjs.\n// Human spot-check required before marking final-reviewed.\n\nimport type { PealimVerifiedVerb } from "../pealim-verified-verbs-700";\n\nexport const ${constName}: PealimVerifiedVerb[] = ${JSON.stringify(verbs, null, 2)};\n`;

const outPath = resolve(out);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, output, "utf8");
console.log(`Promoted ${verbs.length} verb(s) to ${outPath}`);
