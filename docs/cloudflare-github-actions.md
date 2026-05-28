# Cloudflare deployment through GitHub Actions

This repository should be the source of truth for deployment.

## Deployment model

- Pull requests run CI only: install dependencies, build the app, run tests.
- Pushes to `main` deploy the Vite app to Cloudflare Pages.
- Pushes to `main` deploy the Worker from `workers/health-check.ts` using `wrangler.worker.toml`.
- Local manual deployment is not required for normal releases.

## GitHub Secrets required

These secrets are expected to exist in GitHub repository settings:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The Pages project name is not a secret. It is set in the Pages workflow as:

```text
hebrewme999
```

This matches the existing `wrangler.toml` project name.

The API token must be allowed to deploy both Cloudflare Pages and Workers for the target account.

## Workflows

- `.github/workflows/ci.yml`
  - Runs on pull requests into `main` and manual dispatch.
  - Runs `npm ci`, `npm run build`, and `npm test -- --passWithNoTests`.

- `.github/workflows/deploy-pages.yml`
  - Runs on pushes to `main` and manual dispatch.
  - Builds the Vite app.
  - Deploys `dist` to Cloudflare Pages using `wrangler pages deploy`.
  - Uses the existing GitHub secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

- `.github/workflows/deploy-worker.yml`
  - Runs on pushes to `main` and manual dispatch.
  - Deploys the Worker using `wrangler deploy --config wrangler.worker.toml`.
  - Uses the existing GitHub secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

## Current Cloudflare project assumptions

- Cloudflare Pages project name: `hebrewme999`.
- Vite build output directory: `dist`.
- Existing Pages config file: `wrangler.toml`.
- Worker config file: `wrangler.worker.toml`.
- Worker name: `hebrewme-worker`.

## Last deployment trigger

- Triggered from GitHub on 2026-05-28 to verify automatic Pages and Worker deployments from `main`.
