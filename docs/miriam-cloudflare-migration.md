# Miriam Cloudflare voice migration

The current voice UI still uses the existing Supabase `gemini-voice-config` endpoint. Do not remove that service until the Cloudflare route is verified in a deployed preview.

## New experimental endpoint
`functions/api/gemini-live.ts` accepts same-origin WebSocket connections at `/api/gemini-live` and forwards them to Gemini Live without returning the Gemini API key to the browser.

Set `GOOGLE_AI_API_KEY` as an **encrypted Cloudflare Pages secret**, never a `VITE_*` variable. Test WebSocket upgrade and bidirectional audio in a preview environment before enabling the route in `VoiceDialogue.tsx`.

**Security prerequisite:** restrict abuse with Cloudflare rate limits, Turnstile/session authorization or equivalent controls. Origin checking alone does not authenticate clients. Confirm Google Live WebSocket support for `x-goog-api-key` upstream and Cloudflare's upgrade proxy behavior before cutover.

The existing `ai-dialogue` translation function is a separate dependency and is not migrated yet. No main-branch deployment should be made based only on browser smoke tests.
