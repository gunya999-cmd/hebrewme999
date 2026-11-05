import { createRemoteJWKSet, jwtVerify } from "jose";

export interface MiriamEnv {
  GOOGLE_AI_API_KEY?: string;
  MIRIAM_VOICE_PROXY_ENABLED?: string;
  MIRIAM_TRANSLATION_ENABLED?: string;
  MIRIAM_LIVE_MODEL?: string;
  // Set only after verifying the Google AI Studio project is on Free Tier.
  // This is a manual authorization gate, not a programmatic billing API check.
  MIRIAM_FREE_TIER_CONFIRMED?: string;
  MIRIAM_ACCESS_TEAM_DOMAIN?: string;
  MIRIAM_ACCESS_AUD?: string;
}

export interface MiriamContext { request: Request; env: MiriamEnv }

export function json(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

// Origin is CSRF protection, not authentication. Match scheme and port too.
export function checkOrigin(request: Request, required = false): Response | null {
  const origin = request.headers.get("Origin");
  if (!origin && !required) return null;
  if (origin !== new URL(request.url).origin) return json({ error: "Origin not allowed" }, 403);
  return null;
}

// Private preview rollout: verify the signed Access assertion, not just its
// presence or decoded claims. Never trust an issuer/jku supplied by a client.
let keySet: { issuer: string; keys: ReturnType<typeof createRemoteJWKSet> } | undefined;
export async function requireAccess({ request, env }: MiriamContext): Promise<Response | null> {
  const team = env.MIRIAM_ACCESS_TEAM_DOMAIN;
  const audience = env.MIRIAM_ACCESS_AUD;
  if (!team || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.cloudflareaccess\.com$/.test(team) || !audience?.trim()) {
    return json({ error: "Private preview access not configured" }, 503);
  }
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token || token.length > 16384) return json({ error: "Access sign-in required" }, 401);
  try {
    const issuer = `https://${team}`;
    if (keySet?.issuer !== issuer) {
      keySet = { issuer, keys: createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`), { timeoutDuration: 5000 }) };
    }
    await jwtVerify(token, keySet.keys, {
      issuer,
      audience,
      algorithms: ["RS256"],
      requiredClaims: ["exp", "iat", "sub"],
    });
    return null;
  } catch {
    // Do not leak JWTs, provider errors, or key URLs in responses/logs.
    return json({ error: "Access sign-in required" }, 401);
  }
}

// Official Free Tier pricing as of 2026-10-25. Paid-only and arbitrary
// model IDs must not be selected by mistake through environment variables.
export const FREE_LIVE_MODELS = new Set([
  "gemini-3.8-live",
  "gemini-3.1-flash-live-preview",
  "gemini-2.5-flash-native-audio-preview-12-2025",
]);

export function liveModel(env: MiriamEnv): string | null {
  const model = env.MIRIAM_LIVE_MODEL;
  return model && FREE_LIVE_MODELS.has(model) ? model : null;
}

export function requireFreeTier(env: MiriamEnv): Response | null {
  if (env.MIRIAM_FREE_TIER_CONFIRMED !== "true") {
    return json({ error: "Free Tier project not verified" }, 503);
  }
  return null;
}

export async function voiceAccess(context: MiriamContext): Promise<Response | null> {
  if (context.env.MIRIAM_VOICE_PROXY_ENABLED !== "true") return json({ error: "Voice proxy rollout disabled" }, 503);
  const freeTierDenied = requireFreeTier(context.env);
  if (freeTierDenied) return freeTierDenied;
  if (!context.env.GOOGLE_AI_API_KEY || !liveModel(context.env)) return json({ error: "Voice service not configured" }, 503);
  return requireAccess(context);
}
