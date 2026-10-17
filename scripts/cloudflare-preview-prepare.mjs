// Apply only private Preview guardrails; never replace existing secrets.
const token = process.env.CF_TOKEN;
const account = process.env.CF_ACCOUNT_ID;
if (!token || !/^[a-f0-9]{32}$/i.test(account || '')) throw new Error('Missing scoped Cloudflare credentials');
const endpoint = `https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/hebrewme999`;
async function call(method, body) {
  const response = await fetch(endpoint, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}), redirect: 'error', signal: AbortSignal.timeout(20000) });
  let data;
  try { data = await response.json(); } catch { /* No raw responses in logs. */ }
  if (!response.ok || !data?.success) throw new Error(`Pages ${method}: HTTP ${response.status}; error codes ${(data?.errors || []).map(e => Number(e.code)).filter(Number.isFinite).join(',')}`);
  return data.result;
}
const before = await call('GET');
if (before?.name !== 'hebrewme999') throw new Error('Unexpected project');
const vars = before.deployment_configs?.preview?.env_vars || {};
if (vars.GOOGLE_AI_API_KEY?.type !== 'secret_text') throw new Error('Preview Google key must be an encrypted secret');
if (!vars.MIRIAM_ACCESS_AUD || !vars.MIRIAM_ACCESS_TEAM_DOMAIN) throw new Error('Missing Preview Access bindings');
const changes = {};
for (const name of ['MIRIAM_VOICE_PROXY_ENABLED', 'MIRIAM_TRANSLATION_ENABLED']) {
  if (!vars[name]) changes[name] = { type: 'plain_text', value: 'false' };
}
// The documented PATCH merges supplied env entries; omitted secrets are preserved.
await call('PATCH', { deployment_configs: { preview: { fail_open: false, env_vars: changes } } });
const after = await call('GET');
if (after.deployment_configs?.preview?.fail_open !== false) throw new Error('Preview fail-closed verification failed');
for (const name of Object.keys(vars)) {
  const next = after.deployment_configs?.preview?.env_vars?.[name];
  if (!next || next.type !== vars[name].type) throw new Error('Existing Preview binding was not preserved');
}
if (JSON.stringify(before.deployment_configs?.production) !== JSON.stringify(after.deployment_configs?.production)) throw new Error('Production config changed unexpectedly');
console.log('Pages write permission confirmed. Preview fail-closed verified. Missing rollout flags saved as false.');
console.log('Existing Preview bindings preserved. Production configuration unchanged. No secret values printed.');
