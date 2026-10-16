// Cloudflare Pages Function: keep the Gemini key server-side.
// Set GOOGLE_AI_API_KEY as an encrypted Cloudflare Pages secret.
// Browser connects to /api/gemini-live with a WebSocket upgrade.
import { checkOrigin, json, voiceAccess, type MiriamContext } from "../../server/miriamSecurity";
const upstream = "https://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";

export async function onRequest(context: MiriamContext): Promise<Response> {
  const { request, env } = context;
  if (request.method !== "GET" || request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
    return json({ error: "WebSocket upgrade required" }, 426);
  }
  const denied = checkOrigin(request, true) || await voiceAccess(context);
  if (denied) return denied;
  try {
    const response = await fetch(upstream, {
      headers: {
        Upgrade: "websocket",
        "x-goog-api-key": env.GOOGLE_AI_API_KEY!,
      },
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    if (response.status !== 101 || !response.webSocket) {
      return json({ error: "Voice upstream unavailable" }, 502);
    }
    return new Response(null, { status: 101, webSocket: response.webSocket });
  } catch {
    return json({ error: "Voice upstream unavailable" }, 502);
  }
}
