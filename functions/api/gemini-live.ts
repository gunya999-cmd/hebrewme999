// Cloudflare Pages Function: keep the Gemini key server-side.
// Set GOOGLE_AI_API_KEY as an encrypted Cloudflare Pages secret.
// Browser connects to /api/gemini-live with a WebSocket upgrade.
interface Env { GOOGLE_AI_API_KEY?: string }
interface Context { request: Request; env: Env }
const upstream = "https://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";

export async function onRequest(context: Context): Promise<Response> {
  const { request, env } = context;
  if (request.method !== "GET" || request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
    return new Response("WebSocket upgrade required", { status: 426 });
  }
  if (!env.GOOGLE_AI_API_KEY) return new Response("Voice service not configured", { status: 503 });
  const origin = request.headers.get("Origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return new Response("Origin not allowed", { status: 403 });
  }
  const response = await fetch(upstream, {
    headers: {
      Upgrade: "websocket",
      Authorization: `Bearer ${env.GOOGLE_AI_API_KEY}`,
    },
  });
  if (response.status !== 101 || !response.webSocket) {
    return new Response("Voice upstream unavailable", { status: 502 });
  }
  return new Response(null, { status: 101, webSocket: response.webSocket });
}
