# Pealim import pipeline

This pipeline replaces manual typing of verb cards with a repeatable source-map → worklist → promotion → validation flow.

## Files

- `src/data/pealim-source-map-top350.ts` — source map with ranks, infinitives, Russian translations and Pealim URLs.
- `scripts/pealim-import.mjs` — creates a JSON worklist for a selected rank range.
- `scripts/pealim-promote-worklist.mjs` — converts a filled worklist into `PealimVerifiedVerb[]` TypeScript data.
- `scripts/pealim-validate.mjs` — validates required fields and all conjugation slots.

## Recommended workflow

```bash
node scripts/pealim-import.mjs --from=34 --to=53 --out=tmp/pealim-034-053.json
```

Fill `extractedForms` in the generated JSON from Pealim tables. Then promote it:

```bash
node scripts/pealim-promote-worklist.mjs \
  --input=tmp/pealim-034-053.json \
  --out=src/data/generated/pealim-verified-verbs-034-053.ts \
  --constName=GENERATED_PEALIM_VERBS_034_053
```

Validate before commit:

```bash
node scripts/pealim-validate.mjs tmp/pealim-034-053.json
```

## Quality gates

Do not mark a batch as final-reviewed until:

1. Every Pealim URL resolves to the intended verb.
2. Every present / past / future / imperative slot is filled.
3. Weak-root verbs are spot-checked manually.
4. Formal feminine plural future/imperative forms are checked against Pealim notes.
5. No duplicate `frequencyRank` or `infinitive_hebrew_plain` remains.

## Why this is faster

The slow step is no longer creating TypeScript objects. The slow step becomes only extracting or pasting forms from Pealim into the worklist. Promotion and validation are automatic.