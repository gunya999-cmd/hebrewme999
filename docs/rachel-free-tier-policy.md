## Free Tier policy for Rachel voice

As of 2026-10-25 the pricing published at
https://ai.google.dev/gemini-api/docs/pricing lists these free-of-charge
audio-capable Live models: `gemini-3.8-live`,
`gemini-3.1-flash-live-preview` and
`gemini-2.5-flash-native-audio-preview-12-2025`.

**A free model is NOT a guarantee of free usage under a Paid Tier project.**
This application fails closed until all of these independent controls are set:

- Only models on the Free Tier allowlist can be used.
- `MIRIAM_FREE_TIER_CONFIRMED=true`: manually attest the *Google AI
  Studio project* linked to `GOOGLE_AI_API_KEY` is on Free Tier (not
  Paid, and billing disabled). This cannot be inferred from a key or model ID.
- `MIRIAM_VOICE_PROXY_ENABLED=true` and
  `MIRIAM_TRANSLATION_ENABLED=true`: separate private Preview rollouts.
- Signed, owner-restricted Cloudflare Access remains enforced.

The Preview preparation workflow writes only a free model and **disabled**
flags where missing. It does not enable API calls and never changes
Production. Keep `MIRIAM_FREE_TIER_CONFIRMED=false` until the billing
status is verified outside this repository. Google API rate limits can change
and eligible project accounts can be restricted.

For translation use `gemini-3.5-flash-lite`, also listed as free of charge
under Free Tier. If the API project cannot use Free Tier, do not upgrade
billing; leave this tutor unavailable instead of falling back to paid usage.

After confirming the project's Free Tier status, verify Access app policy
and then enable guarded Preview *only*, perform a real 5-minute voice
session and real-device tests before production cutover.

References:
- https://ai.google.dev/gemini-api/docs/pricing
- https://ai.google.dev/gemini-api/docs/billing
- https://ai.google.dev/gemini-api/docs/troubleshooting
