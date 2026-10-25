// Safe one-time Cloudflare Pages Preview defaults. Never enable voice or
// change Production. No key values/API responses are printed.
const token = process.env.CF_TOKEN;
const account = process.env.CF_ACCOUNT_ID;
if (!token || !/^[0-9a-f]{32}$/i.test(account || "")) throw new Error("Cloudflare credentials not configured");
const endpoint = `https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/hebrewme999`;
const safe = (message) => String(message).replaceAll(token, "[redacted]").replaceAll(account, "[redacted]");
async function call(method, body) {
  const response = await fetch(endpoint, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
    redirect: "error",
    signal: AbortSignal.timeout(20000),
  });
  let data;
  try { data = await response.json(); } catch {}
  if (!response.ok || data?.success !== true) {
    // No response body: Cloudflare sometimes echoes supplied env values in errors.
    console.error(`Cloudflare Pages ${method} failed: HTTP ${response.status}; codes ${(data?.errors || []).map(e => Number(e.code)).filter(Number.isFinite).join(",")}`);
    process.exit(1);
  }
  return data.result;
}
const before = await call("GET");
if (before?.name !== "hebrewme999" || before?.production_branch !== "main") {
  throw new Error("Unexpected Pages project or production branch; refusing to change settings");
}
const vars = before.deployment_configs?.preview?.env_vars || {};
for (const key of ["GOOGLE_AI_API_KEY", "MIRIAM_ACCESS_TEAM_DOMAIN", "MIRIAM_ACCESS_AUD"]) {
  if (vars[key]?.type !== "secret_text") throw new Error(`Required Preview secret ${key} missing or not encrypted`);
}
const allow = new Set(["gemini-3.8-live", "gemini-3.1-flash-live-preview", "gemini-2.5-flash-native-audio-preview-12-2025"]);
const currentModel = vars.MIRIAM_LIVE_MODEL?.value;
if (currentModel && !allow.has(currentModel)) throw new Error("Configured Preview model is not on the Free Tier allowlist");
// An existing "true" release switch is never rewritten, but a true switch
// without a Free Tier attestation is considered unsafe and fails closed.
const freeFlag = vars.MIRIAM_FREE_TIER_CONFIRMED?.value;
if (freeFlag === "true") {
  console.log("Free Tier attestation already present; no automatic billing-status conclusion is drawn.");
} else if (freeFlag && freeFlag !== "false") {
  throw new Error("Unexpected Free Tier attestation flag value");
}
for (const name of ["MIRIAM_VOICE_PROXY_ENABLED", "MIRIAM_TRANSLATION_ENABLED"]) {
  if (vars[name]?.value === "true" && freeFlag !== "true") throw new Error(`Unsafe active Preview switch: ${name}`);
}
const desired = {
  MIRIAM_LIVE_MODEL: "gemini-3.8-live",
  MIRIAM_VOICE_PROXY_ENABLED: "false",
  MIRIAM_TRANSLATION_ENABLED: "false",
  MIRIAM_FREE_TIER_CONFIRMED: "false",
};
const changes = {};
for (const [name, value] of Object.entries(desired)) {
  if (!vars[name]) changes[name] = { type: "plain_text", value };
}
if (Object.keys(changes).length) {
  await call("PATCH", { deployment_configs: { preview: { env_vars: changes } } });
}
const after = await call("GET");
const later = after.deployment_configs?.preview?.env_vars || {};
for (const [name, value] of Object.entries(desired)) {
  // Leave any previously configured safe model / flags unchanged.
  if (!later[name]) throw new Error(`Preview binding ${name} not created`);
  if (name !== "MIRIAM_LIVE_MODEL" && later[name]?.value !== "false" && later[name]?.value !== "true") throw new Error(`Invalid Preview flag ${name}`);
  if (name === "MIRIAM_LIVE_MODEL" && !allow.has(later[name]?.value)) throw new Error("Model not on allowlist");
}
for (const name of Object.keys(vars)) {
  if (!later[name] || later[name].type !== vars[name].type) {
    throw new Error(`Existing Preview binding ${name} lost or changed type`);
  }
}
if (JSON.stringify(before.deployment_configs?.production) !== JSON.stringify(after.deployment_configs?.production)) {
  throw new Error("Production configuration changed; investigate immediately");
}
console.log(`Preview model and disabled guardrails configured (new variables: ${Object.keys(changes).join(", ") || "none"}). Production untouched.`);
console.log("Free Tier eligibility must still be verified in Google AI Studio. No Gemini API calls made.");
