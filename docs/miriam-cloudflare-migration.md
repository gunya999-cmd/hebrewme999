# Miriam: private Cloudflare preview rollout

PR #28 now routes VoiceDialogue through `/api/voice-config`,
`/api/gemini-live`, and `/api/translate`. There is no legacy provider fallback.
The browser receives only a model name; the permanent Gemini key is attached
only to requests from Pages Functions to Google. No `VITE_*` Gemini secret.

## Current verification boundary (2026-10-16)

- Previous commit `51ef421`: GitHub CI #51 passed; Pages preview deployed.
- The dashboard browser reached Cloudflare sign-in. The selected Google login
  returned “Something went wrong”; account settings were not inspected/changed.
- The independent Workers integration reported a failed deployment. Its logs
  have not been inspected; do not confuse this with the successful Pages build.
- Route tests mock Google and sign real test JWTs. They prove access rejection,
  input bounds, upstream error sanitization and socket handoff, **not** live
  Gemini authentication, PCM quality, ASR accuracy, latency, or real device QA.
- Rollout stays disabled until the following preview configuration and real
  provider checks succeed. Do not merge on CI smoke checks alone.

## Configure Preview only in Pages → hebrewme999 → Settings

1. Protect the **whole preview host** with Cloudflare Access, including the
   three `/api/*` routes. Allow only the existing project owner/testers. Do not
   use a public Allow Everyone policy or add new users without authorization.
   Protecting only API paths can make browser requests redirect to login;
   visit/sign into the protected preview home before testing voice.
2. Add `GOOGLE_AI_API_KEY` as an encrypted **Preview secret**. Never put it in
   build output, client environment variables, source, screenshots or logs.
3. Set these Preview variables (do not invent their values):

   | Variable | Value |
   | --- | --- |
   | `MIRIAM_ACCESS_TEAM_DOMAIN` | Existing team host, e.g. `team.cloudflareaccess.com`, without scheme/path |
   | `MIRIAM_ACCESS_AUD` | Audience tag of the preview Access application |
   | `MIRIAM_LIVE_MODEL` | Live-capable model confirmed available to this Google project |
   | `MIRIAM_VOICE_PROXY_ENABLED` | `true` only for the protected test preview |
   | `MIRIAM_TRANSLATION_ENABLED` | `true` only for the protected test preview |

   Missing flags, key, model or Access configuration fail closed. The Functions
   verify RS256 signature, issuer, audience, expiration and required claims
   using the team's fixed `/cdn-cgi/access/certs` endpoint. Origin checks are
   additional CSRF protection, not authentication.
4. Redeploy the preview. Keep Production flags unset/false. Configure request
   rate limits and Google project quotas before broader access. Access is a
   private tester gate, not a per-user usage/concurrency budget.

## Live acceptance checks before merge

- Anonymous, expired and wrong-audience callers cannot reach Google through
  either proxy. Same-host wrong-scheme/port Origins must also be rejected.
- `/api/voice-config` returns only `{model}`, with `Cache-Control: no-store`.
- Translation of `שלום, אני לומד עברית` returns natural Russian.
- A same-origin WebSocket receives HTTP 101, Gemini `setupComplete`, then
  native audio plus output transcription for a short Hebrew greeting.
- Send PCM16 mono 16 kHz audio: confirm `inputTranscription`, a coherent Hebrew
  response, PCM output playback, turn completion and clean disconnect.
- Confirm Google's WebSocket endpoint accepts the server `x-goog-api-key`
  header. This remains unverified; if unsupported, adapt only the server
  handshake using Google's documented method. Never restore a browser key.
- On a physical iPhone/iPad: microphone permission, first playback, mute,
  reconnect, AirPods routing and translation. Browser emulation does not prove
  microphone recognition quality or device audio behavior.
- Inspect browser requests/bundle: no permanent key, no call to
  `gemini-voice-config`, no direct Google WebSocket and no legacy translation.

## Legacy endpoint and key retirement

The source of `supabase/functions/gemini-voice-config` is now a 410 tombstone.
A GitHub/Pages deploy does **not** deploy this Supabase function. The previously
published endpoint may still return its old key until separately retired.
Coordinate tombstone deployment and revocation/rotation of that key after the
new route passes staging checks. Account credentials and service access were
not available in this session; do not claim this external remediation is done.

## Package manager

Use npm and the root `package-lock.json`. The obsolete root `bun.lock` and
`bun.lockb` were removed: a frozen Bun install reproducibly rejected the newly
added server dependencies, while a clean `npm ci` passed. The archived nested
project is unchanged. GitHub Actions run #52 passed all 10 Chromium/iPad-WebKit
cases (including mocked PCM and translation), plus the server and build checks.
The new Pages build initially failed; dashboard logs remain needed to confirm
whether the package-manager mismatch caused that deployment failure.

## Reproducible checks

```sh
npm ci
npm run check:functions
npm run test:functions
npx wrangler pages functions build --outdir=/tmp/miriam-functions
npm run build
npm test -- --run
npx playwright install --with-deps chromium webkit
npx playwright test --config=playwright.miriam.config.ts
```

CI now includes server type checking, Functions bundling and route tests, and
runs when translation, security helpers or dependencies change.

References:
- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/
- https://developers.cloudflare.com/workers/examples/websockets/
- https://ai.google.dev/gemini-api/docs/live-api/get-started-websocket
