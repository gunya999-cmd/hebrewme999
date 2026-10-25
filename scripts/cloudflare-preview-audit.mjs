// Read-only deployment audit. Never print API responses, credentials or env values.
const token = process.env.CF_TOKEN;
const account = process.env.CF_ACCOUNT_ID;
if (!token || !/^[a-f0-9]{32}$/i.test(account || '')) throw new Error('Missing scoped Cloudflare credentials');
const base = `https://api.cloudflare.com/client/v4/accounts/${account}`;
async function read(path, label) {
  const response = await fetch(base + path, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(20000), redirect: 'error' });
  let data;
  try { data = await response.json(); } catch { /* Never print raw responses. */ }
  console.log(`${label}: HTTP ${response.status}; success=${data?.success === true}`);
  if (!response.ok || !data?.success) {
    console.log(`${label} error codes: ${(data?.errors || []).map(e => Number(e.code)).filter(Number.isFinite).join(',')}`);
    return null;
  }
  return data.result;
}
const project = await read('/pages/projects/hebrewme999', 'Pages configuration read');
if (!project || project.name !== 'hebrewme999') process.exit(1);
for (const stage of ['preview', 'production']) {
  const vars = project.deployment_configs?.[stage]?.env_vars || {};
  for (const name of ['GOOGLE_AI_API_KEY', 'MIRIAM_ACCESS_TEAM_DOMAIN', 'MIRIAM_ACCESS_AUD', 'MIRIAM_LIVE_MODEL', 'MIRIAM_VOICE_PROXY_ENABLED', 'MIRIAM_TRANSLATION_ENABLED']) {
    console.log(`${stage} ${name}: ${vars[name] ? 'configured (' + vars[name].type + ')' : 'absent'}`);
  }
  const google = vars.GOOGLE_AI_API_KEY;
  console.log(`${stage} Google key encrypted: ${google?.type === 'secret_text'}`);
  console.log(`${stage} fail_open: ${project.deployment_configs?.[stage]?.fail_open === true}`);
}
console.log(`production branch is main: ${project.production_branch === 'main'}`);
console.log(`build command: ${project.build_config?.build_command || '(unset)'}`);
console.log(`build output: ${project.build_config?.destination_dir || '(unset)'}`);
const appId = '2b210022-8160-4547-a2cd-f1352a4acbbf';
const app = await read(`/access/apps/${appId}`, 'Access application read');
if (app) {
  console.log(`Access expected preview wildcard: ${app.domain === '*.hebrewme999.pages.dev' || (app.destinations || []).some(d => d.uri === '*.hebrewme999.pages.dev')}`);
  console.log(`Access AUD present: ${typeof app.aud === 'string' && app.aud.length > 0}`);
  const stored = project.deployment_configs?.preview?.env_vars?.MIRIAM_ACCESS_AUD;
  if (stored?.type === 'plain_text') console.log(`Preview AUD matches Access app: ${stored.value === app.aud}`);
}
const policies = await read(`/access/apps/${appId}/policies`, 'Access policies read');
if (Array.isArray(policies)) {
  console.log(`Access policy count: ${policies.length}`);
  for (const [i, policy] of policies.entries()) {
    console.log(`Policy ${i + 1}: action=${['allow','deny','bypass','non_identity'].includes(policy.decision) ? policy.decision : 'other'}; include selectors=${(policy.include || []).map(rule => Object.keys(rule).join('+')).join(',')}; require=${(policy.require || []).length}; exclude=${(policy.exclude || []).length}`);
    console.log(`Policy ${i + 1} owner-only email: ${policy.decision === 'allow' && policy.include?.length === 1 && policy.include[0]?.email?.email === 'gunya999@gmail.com'}`);
  }
}
const org = await read('/access/organizations', 'Access organization read');
if (org) console.log(`Access expected team domain: ${org.auth_domain === 'hebrewme999-pages.cloudflareaccess.com'}`);
await read('/workers/services/hebrewme999', 'Worker service metadata read');
const deployments = await read('/pages/projects/hebrewme999/deployments?per_page=20', 'Pages deployments read');
if (Array.isArray(deployments)) {
  const latestSafePreview = deployments.find(d =>
    d?.deployment_trigger?.metadata?.branch === 'fix/voice-tutor-secure-20261025' &&
    d?.latest_stage?.name === 'deploy' &&
    d?.latest_stage?.status === 'success');
  if (latestSafePreview?.url) {
    const url = new URL('/api/voice-config', latestSafePreview.url);
    if (url.protocol === 'https:' && url.hostname.endsWith('.pages.dev')) {
      try {
        const probe = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(10000) });
        console.log(`Anonymous live Preview voice-config HTTP ${probe.status}`);
        if (probe.ok) {
          // The protected Preview must not disclose any voice metadata
          // to unauthenticated internet requests, even a model name.
          throw new Error('Anonymous Preview voice-config was unexpectedly accessible');
        }
      } catch (error) {
        if (String(error?.message).includes('unexpectedly accessible')) throw error;
        console.log('Anonymous Preview request could not complete; login/network gate must be checked manually.');
      }
    }
  }
  const recent = deployments.filter(d => {
    const branch = d?.deployment_trigger?.metadata?.branch;
    return branch === 'main' || branch === 'fix/voice-tutor-secure-20261025' || branch === 'feature/miriam-v2';
  }).slice(0, 12);
  for (const d of recent) {
    const branch = String(d?.deployment_trigger?.metadata?.branch || 'unknown').slice(0, 80);
    const sha = String(d?.deployment_trigger?.metadata?.commit_hash || '').slice(0, 12);
    const phase = String(d?.latest_stage?.name || 'unknown').slice(0, 50);
    const status = String(d?.latest_stage?.status || 'unknown').slice(0, 50);
    console.log(`Pages deployment environment=${d.environment}; branch=${branch}; sha=${sha}; stage=${phase}; status=${status}`);
  }
}
console.log('Read-only audit complete. No settings, policies, deployments or credentials modified.');
