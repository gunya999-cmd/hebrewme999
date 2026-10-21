# HebrewMe QA / stability pass

## What was checked

- TypeScript compile: `npx tsc --noEmit`
- Production build: `npm run build`
- Unit/smoke tests: `npm run test -- --reporter=verbose`
- ESLint: `npm run lint`
- Production dependency audit: `npm audit --omit=dev`

## Current status

- TypeScript: pass
- Production build: pass
- Tests: 4 passing tests
- ESLint: 0 errors, 7 warnings from generated shadcn/ui component files
- Production dependencies: 0 vulnerabilities

## Notes

- `npm audit` including dev dependencies reports moderate Vite/esbuild development-server advisories. The automatic fix requires a breaking upgrade to Vite 8, so it was intentionally not applied in this pass.
- Browserslist caniuse-lite warning is informational. Cloudflare build still completes successfully.
- Cloudflare Pages build settings should stay:
  - Framework preset: None if Vite is not listed
  - Build command: `bun run build` or `npm run build`
  - Build output directory: `dist`
  - Root directory: empty
  - No `npx wrangler deploy` deploy command
