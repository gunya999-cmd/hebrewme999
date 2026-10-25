import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { exportJWK, generateKeyPair, SignJWT } from "jose";
import { requireAccess, type MiriamEnv } from "../../server/miriamSecurity";
import { onRequest as voice } from "../../functions/api/gemini-live";
import { onRequestGet as config } from "../../functions/api/voice-config";
import { onRequestPost as translate } from "../../functions/api/translate";

const base = "https://preview.example";
const env: MiriamEnv = {
  GOOGLE_AI_API_KEY: "server-only-test-key",
  MIRIAM_VOICE_PROXY_ENABLED: "true",
  MIRIAM_TRANSLATION_ENABLED: "true",
  MIRIAM_LIVE_MODEL: "gemini-3.8-live",
  MIRIAM_FREE_TIER_CONFIRMED: "true",
  MIRIAM_ACCESS_TEAM_DOMAIN: "miriam-test.cloudflareaccess.com",
  MIRIAM_ACCESS_AUD: "private-preview",
};
let pair: Awaited<ReturnType<typeof generateKeyPair>>;
let token: string;
let fetchMock: ReturnType<typeof vi.fn>;
let provider: () => Response | object;
const NativeResponse = Response;

async function sign(claims: Record<string, unknown> = {}, key = pair.privateKey) {
  return new SignJWT({ sub: "test-user", ...claims })
    .setProtectedHeader({ alg: "RS256", kid: "test" })
    .setIssuer(`https://${env.MIRIAM_ACCESS_TEAM_DOMAIN}`)
    .setAudience(env.MIRIAM_ACCESS_AUD!)
    .setIssuedAt().setExpirationTime("5m").sign(key);
}
function request(path: string, options: { body?: string; origin?: string | null; assertion?: string | null; upgrade?: boolean; contentType?: string; method?: string } = {}) {
  const headers = new Headers();
  if (options.origin !== null) headers.set("Origin", options.origin ?? base);
  if (options.assertion !== null) headers.set("Cf-Access-Jwt-Assertion", options.assertion ?? token);
  if (options.upgrade) headers.set("Upgrade", "websocket");
  if (options.body !== undefined) headers.set("Content-Type", options.contentType ?? "application/json");
  return new Request(base + path, { method: options.method ?? (options.body === undefined ? "GET" : "POST"), headers, body: options.body });
}
const translationRequest = (body = JSON.stringify({ text: "שלום" }), options = {}) => request("/api/translate", { body, ...options });
const apiCalls = () => fetchMock.mock.calls.filter(([url]) => String(url).includes("generativelanguage.googleapis.com"));

beforeAll(async () => {
  pair = await generateKeyPair("RS256", { extractable: true });
  token = await sign();
});
beforeEach(async () => {
  const jwk = { ...await exportJWK(pair.publicKey), kid: "test", alg: "RS256", use: "sig" };
  provider = () => NativeResponse.json({ candidates: [{ content: { parts: [{ text: "Привет" }] } }] });
  fetchMock = vi.fn(async (url: string | URL) => {
    if (String(url).endsWith("/cdn-cgi/access/certs")) return NativeResponse.json({ keys: [jwk] });
    return provider();
  });
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe("private preview authorization", () => {
  it("verifies an actual RS256 signature and expected issuer/audience", async () => {
    expect(await requireAccess({ request: request("/api/voice-config"), env })).toBeNull();
  });
  it.each([undefined, "attacker.example", "miriam-test.cloudflareaccess.com@attacker.example"])("fails closed for invalid team configuration %s", async team => {
    const response = await requireAccess({ request: request("/"), env: { ...env, MIRIAM_ACCESS_TEAM_DOMAIN: team } });
    expect(response?.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("does not trust an unsigned or merely present JWT header", async () => {
    expect((await requireAccess({ request: request("/", { assertion: "fake.jwt.value" }), env }))?.status).toBe(401);
  });
  it("rejects a JWT signed with another private key", async () => {
    const other = await generateKeyPair("RS256");
    expect((await requireAccess({ request: request("/", { assertion: await sign({}, other.privateKey) }), env }))?.status).toBe(401);
  });
  it.each(["audience", "issuer", "expired", "future", "no-exp"])("rejects %s JWT", async invalid => {
    let jwt = new SignJWT({ sub: "test-user" }).setProtectedHeader({ alg: "RS256", kid: "test" })
      .setIssuer(invalid === "issuer" ? "https://attacker.example" : `https://${env.MIRIAM_ACCESS_TEAM_DOMAIN}`)
      .setAudience(invalid === "audience" ? "another-app" : env.MIRIAM_ACCESS_AUD!).setIssuedAt();
    if (invalid !== "no-exp") jwt = jwt.setExpirationTime(invalid === "expired" ? "-1m" : "5m");
    if (invalid === "future") jwt = jwt.setNotBefore("1h");
    expect((await requireAccess({ request: request("/", { assertion: await jwt.sign(pair.privateKey) }), env }))?.status).toBe(401);
    expect(apiCalls()).toHaveLength(0);
  });
});

describe("voice metadata and upgrade", () => {
  it("returns only a model name, never the permanent key", async () => {
    const response = await config({ request: request("/api/voice-config"), env });
    expect(await response.json()).toEqual({ model: "gemini-3.8-live" });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(apiCalls()).toHaveLength(0);
  });
  it.each([undefined, "false"])("does not connect while rollout flag is %s", async flag => {
    const disabled = { ...env, MIRIAM_VOICE_PROXY_ENABLED: flag };
    expect((await config({ request: request("/api/voice-config"), env: disabled })).status).toBe(503);
    expect((await voice({ request: request("/api/gemini-live", { upgrade: true }), env: disabled })).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each(["GOOGLE_AI_API_KEY", "MIRIAM_LIVE_MODEL", "MIRIAM_ACCESS_AUD"])("fails closed without %s", async name => {
    expect((await config({ request: request("/api/voice-config"), env: { ...env, [name]: undefined } })).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("fails closed before any Google call if free project status was not verified", async () => {
    const unverified = { ...env, MIRIAM_FREE_TIER_CONFIRMED: "false" };
    expect((await config({ request: request("/api/voice-config"), env: unverified })).status).toBe(503);
    expect((await voice({ request: request("/api/gemini-live", { upgrade: true }), env: unverified })).status).toBe(503);
    expect((await translate({ request: translationRequest(), env: unverified })).status).toBe(503);
    expect(apiCalls()).toHaveLength(0);
  });
  it("rejects arbitrary or paid-only Live model identifiers", async () => {
    for (const model of ["test-live-model", "gemini-2.5-pro", "gemini-3.8-live-extended-thinking"]) {
      expect((await config({ request: request("/api/voice-config"), env: { ...env, MIRIAM_LIVE_MODEL: model } })).status).toBe(503);
    }
    expect(apiCalls()).toHaveLength(0);
  });
  it("requires a WebSocket upgrade", async () => {
    expect((await voice({ request: request("/api/gemini-live"), env })).status).toBe(426);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each([null, "null", "invalid", "http://preview.example", "https://preview.example:8443", "https://other.example"])("rejects mismatched or missing WS Origin %s", async origin => {
    expect((await voice({ request: request("/api/gemini-live", { upgrade: true, origin }), env })).status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("rejects anonymous same-origin connections", async () => {
    expect((await voice({ request: request("/api/gemini-live", { upgrade: true, assertion: null }), env })).status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("passes the upgraded socket through with the key only on the upstream request", async () => {
    const socket = { testSocket: true };
    provider = () => ({ status: 101, webSocket: socket });
    vi.stubGlobal("Response", class extends NativeResponse {
      constructor(body: BodyInit | null, init: ResponseInit & { webSocket?: unknown }) {
        super(body, init.status === 101 ? { status: 200 } : init);
        if (init.status === 101) Object.defineProperties(this, { status: { value: 101 }, webSocket: { value: init.webSocket } });
      }
    });
    const response = await voice({ request: request("/api/gemini-live", { upgrade: true }), env });
    expect(response.status).toBe(101);
    expect((response as Response & { webSocket: unknown }).webSocket).toBe(socket);
    const [url, options] = apiCalls()[0];
    expect(String(url)).not.toContain(env.GOOGLE_AI_API_KEY);
    expect(options.headers).toEqual({ Upgrade: "websocket", "x-goog-api-key": env.GOOGLE_AI_API_KEY });
    expect(options.redirect).toBe("error");
    expect(options.headers).not.toHaveProperty("Cf-Access-Jwt-Assertion");
  });
  it.each(["http-error", "missing-socket", "network-error"])("sanitizes upstream %s", async failure => {
    provider = () => { if (failure === "network-error") throw new Error(env.GOOGLE_AI_API_KEY); return { status: failure === "http-error" ? 403 : 101 }; };
    const response = await voice({ request: request("/api/gemini-live", { upgrade: true }), env });
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain(env.GOOGLE_AI_API_KEY);
  });
});

describe("translation", () => {
  it("translates Hebrew using a server-side key and bounded generation", async () => {
    const response = await translate({ request: translationRequest(), env });
    expect(await response.json()).toEqual({ translation: "Привет" });
    const [url, options] = apiCalls()[0];
    expect(String(url)).not.toContain(env.GOOGLE_AI_API_KEY);
    expect(options.headers["x-goog-api-key"]).toBe(env.GOOGLE_AI_API_KEY);
    const body = JSON.parse(options.body);
    expect(body.contents[0].parts[0].text).toBe("שלום");
    expect(body.generationConfig.maxOutputTokens).toBe(400);
  });
  it("translates to the interface language without trusting arbitrary targets", async () => {
    const english = await translate({ request: translationRequest(JSON.stringify({ text: "שלום", targetLanguage: "en" })), env });
    expect(english.status).toBe(200);
    const [, options] = apiCalls()[0];
    const payload = JSON.parse(options.body);
    expect(payload.systemInstruction.parts[0].text).toContain("natural English");
    const invalid = await translate({ request: translationRequest(JSON.stringify({ text: "שלום", targetLanguage: "fr" })), env });
    expect(invalid.status).toBe(400);
    expect(apiCalls()).toHaveLength(1);
  });
  it("requires the separate translation rollout flag", async () => {
    expect((await translate({ request: translationRequest(), env: { ...env, MIRIAM_TRANSLATION_ENABLED: undefined } })).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it("does not accept anonymous callers", async () => {
    expect((await translate({ request: translationRequest(undefined, { assertion: null }), env })).status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each([null, "null", "malformed", "http://preview.example", "https://other.example"])("rejects Origin %s", async origin => {
    expect((await translate({ request: translationRequest(undefined, { origin }), env })).status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each(["null", "[]", "{}", "{", '{"text":2}', '{"text":" "}', JSON.stringify({ text: "x".repeat(2001) })])("rejects invalid input %s", async body => {
    expect((await translate({ request: translationRequest(body), env })).status).toBe(400);
    expect(apiCalls()).toHaveLength(0);
  });
  it("rejects oversized bytes even with no Content-Length", async () => {
    expect((await translate({ request: translationRequest(JSON.stringify({ text: "x", extra: "x".repeat(16384) })), env })).status).toBe(413);
    expect(apiCalls()).toHaveLength(0);
  });
  it("requires application/json", async () => {
    expect((await translate({ request: translationRequest(undefined, { contentType: "text/plain" }), env })).status).toBe(415);
    expect(apiCalls()).toHaveLength(0);
  });
  it.each(["empty", "http-error", "network-error"])("handles provider %s without leaking secrets", async failure => {
    provider = () => { if (failure === "network-error") throw new Error(env.GOOGLE_AI_API_KEY); return failure === "empty" ? NativeResponse.json({}) : new NativeResponse(env.GOOGLE_AI_API_KEY, { status: 403 }); };
    const response = await translate({ request: translationRequest(), env });
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain(env.GOOGLE_AI_API_KEY);
  });
});
