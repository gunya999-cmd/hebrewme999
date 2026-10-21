# HebrewMe deployment through Cloudflare Pages

This project is a Vite + React single-page application.

## Recommended deployment: Cloudflare Pages + GitHub

1. Push this repository to GitHub.
2. Open Cloudflare Dashboard → Workers & Pages → Create application → Pages.
3. Choose **Import an existing Git repository** / **Connect to Git**.
4. Select `gunya999-cmd/hebrewme999`.
5. Use these build settings:
   - Framework preset: **None** if Vite is not listed.
   - Build command: `bun run build` or `npm run build`.
   - Build output directory: `dist`.
   - Root directory: leave empty.
6. Add environment variables in Cloudflare Pages settings:
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`
7. Click **Save and Deploy**.

Cloudflare Pages will redeploy automatically after every push to the `main` branch.

## Important: do not use Worker deploy for this app

Do not configure a deploy command like:

```bash
npx wrangler deploy
```

That is a Workers deployment flow and can fail for a React/Vite Pages app. Cloudflare Pages only needs the build command and the `dist` output directory.

## Direct upload deployment from PowerShell

From the project root:

```powershell
npm.cmd install
npm.cmd run build
npx.cmd wrangler pages deploy dist --project-name hebrewme999
```

The first run will ask you to log in to Cloudflare.

If PowerShell blocks `npm.ps1`, use `npm.cmd` and `npx.cmd` as shown above.

## Why these Cloudflare files exist

- `public/_redirects` prevents 404 errors on refresh for routes like `/ai-tutor`.
- `public/_headers` adds browser safety headers and long caching for generated assets while allowing microphone access for the voice trainer.
- `wrangler.toml` stores the Cloudflare Pages output directory for direct upload/deployment.
