# Cloudflare deployment through GitHub Actions

This repository should be the source of truth for deployment.

## Deployment model

- Pull requests run CI only: install dependencies, build the app, run tests.
- Pushes to `main` deploy the Vite app to Cloudflare Pages.
- Pushes to `main` deploy the Worker from `workers/health-check.ts` using `wrangler.worker.toml`.
- Local manual deployment is not required for normal releases.

## GitHub Secrets required

Add these secrets in GitHub repository settings:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PAGES_PROJECT_NAME`

The API token must be allowed to deploy both Cloudflare Pages and Workers for the target account.

## Workflows

- `.github/workflows/ci.yml`
  - Runs on pull requests into `main` and manual dispatch.
  - Runs `npm ci`, `npm run build`, and `npm test`.

- `.github/workflows/deploy-pages.yml`
  - Runs on pushes to `main` and manual dispatch.
  - Builds the Vite app.
  - Deploys `dist` to Cloudflare Pages using `wrangler pages deploy`.

- `.github/workflows/deploy-worker.yml`
  - Runs on pushes to `main` and manual dispatch.
  - Deploys the Worker using `wrangler deploy --config wrangler.worker.toml`.

## Current Cloudflare project assumptions

- Vite build output directory: `dist`.
- Existing Pages config file: `wrangler.toml`.
- Worker config file: `wrangler.worker.toml`.
- Worker name: `hebrewme-worker`.

If the Cloudflare Pages project has a different name, set `CLOUDFLARE_PAGES_PROJECT_NAME` to the exact project name in Cloudflare.
