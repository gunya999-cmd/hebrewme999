# HebrewMe / Rachel voice release gate — 2026-10-25

This is the **secure voice cutover** in draft PR #33. Current production
`main` is intentionally untouched until live Preview and device QA pass.

## Already staged in PR #33

- Permanent `GOOGLE_AI_API_KEY` stays server-side in Cloudflare Pages Functions.
- Strict same-origin API, signed Cloudflare Access JWT (issuer, audience, RS256, expiration).
- `/api/voice-config` returns a public model ID, never a credential.
- `/api/gemini-live` proxies WebSocket upgrade with server-side credentials.
- `/api/translate` supports Russian and English with bounded input; Hebrew UI displays
  the original text directly without translation.
- No direct Google WebSocket URL or old `gemini-voice-config` fetch in the client.
- Full-duplex PCM and `START_OF_ACTIVITY_INTERRUPTS` for barge-in. Echo and
  interruption quality require real device QA.
- Each finalized spoken lesson turn is recorded to localStorage under a stable
  session ID; terminal socket closes release mic/AudioContext resources.
- Mocked WebSocket, server security, app build and Chromium/iPad-WebKit CI.

## Fail-closed Cloudflare Preview requirements

Configure **Preview only**, maintaining existing Production settings:

| Variable | Preview configuration |
| --- | --- |
| `GOOGLE_AI_API_KEY` | encrypted `secret_text` |
| `MIRIAM_ACCESS_TEAM_DOMAIN` | existing *.cloudflareaccess.com team host |
| `MIRIAM_ACCESS_AUD` | matching Preview Access application AUD |
| `MIRIAM_LIVE_MODEL` | tested Live API model enabled for the Google project |
| `MIRIAM_VOICE_PROXY_ENABLED` | `true` only for protected Preview smoke |
| `MIRIAM_TRANSLATION_ENABLED` | `true` only for protected Preview smoke |

Recommended candidates from current Google documentation: `gemini-3.8-live`
and `gemini-live-2.5-flash-native-audio`. Neither is automatically selected:
first confirm exact API model ID and availability for this project's key.
Never hardcode a permanent key into JavaScript or Vite variables.
Check Google WebSocket upgrade using the proxy's server `x-goog-api-key`
header, which has only mock coverage so far.

Do not enable broad public Access policies. API origin validation is not a
replacement for authentication. Run the read-only audit workflow on the draft PR.

## Acceptance criteria before main/production rollout

1. Protected Preview home opens under the owner's Cloudflare Access session.
   Anonymous, invalid-audience and expired tokens are rejected at all voice APIs.
2. `/api/voice-config` returns `{ "model": "..." }` only; never key material.
3. Real WebSocket returns 101, `setupComplete`, valid audio chunks and Hebrew
   input/output transcripts.
4. In a complete 5-minute A1 lesson, pronunciation is intelligible, no
   unrequested Russian voice from Rachel, grammar corrections are context-appropriate,
   and the user can interrupt Rachel during playback.
5. iPhone Safari, iPad WebKit, Chrome: permission, first playback, speaker/earpiece,
   mute/unmute, hang-up, network drop and reconnect, Bluetooth/AirPods.
6. Russian/English UI receives the selected translation; Hebrew UI shows Hebrew
   without the extra translated line. Lesson introduction respects UI language.
7. A finalized spoken turn survives tab close or lost socket and does not create
   duplicate attempts on the same session. Resources release after disconnect.
8. Inspect browser bundle and network: **no** Google permanent key, old Supabase
   key endpoint, or direct Google WebSocket connection.
9. Confirm Cloudflare Pages **Preview deployment**, not merely GitHub green CI.
   Verify actual deployed SHA and automatic build. Do not confuse Workers Builds
   failures with Pages deployment status.

## Cutover order

- Run all CI and real protected Preview/device checks.
- Prepare Production Cloudflare secret, model and guarded rollout with least
  privilege, retaining existing Supabase app bindings.
- Coordinate rollback/release window, enable guarded Production and deploy Pages.
- **Separately** deploy Supabase `gemini-voice-config` tombstone (410). A GitHub
  Pages deployment does not deploy Supabase functions.
- Rotate/revoke the previously exposed Google key after confirmed migration.
  Verify no old endpoints remain accessible and monitor quota/errors.
- Merge only with green required CI, live provider acceptance and a rollback plan.

No account secrets or Access tokens should be posted in PR text, logs or chat.
