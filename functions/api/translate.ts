// Cloudflare Pages: Hebrew -> Russian translation without Supabase/Lovable.
interface Env { GOOGLE_AI_API_KEY?: string; MIRIAM_TRANSLATION_ENABLED?: string }
interface Context { request: Request; env: Env }
const json = (body: object, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
});
export async function onRequestPost({ request, env }: Context): Promise<Response> {
  if (request.headers.get("Origin") && new URL(request.headers.get("Origin")!).host !== new URL(request.url).host) {
    return json({ error: "Origin not allowed" }, 403);
  }
  if (env.MIRIAM_TRANSLATION_ENABLED !== "true") return json({ error: "Translation rollout disabled" }, 503);
  if (!env.GOOGLE_AI_API_KEY) return json({ error: "Translation not configured" }, 503);
  let body: { text?: unknown };
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  if (typeof body.text !== "string" || !body.text.trim() || body.text.length > 2000) {
    return json({ error: "Text must be 1-2000 characters" }, 400);
  }
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.GOOGLE_AI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: "Translate Hebrew into natural Russian. Return only the translation, no commentary." }] },
        contents: [{ role: "user", parts: [{ text: body.text }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 400 },
      }),
    });
    if (!response.ok) return json({ error: "Translation provider unavailable" }, 502);
    const result = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const translation = result.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("").trim();
    if (!translation) return json({ error: "Empty translation" }, 502);
    return json({ translation });
  } catch {
    return json({ error: "Translation request failed" }, 502);
  }
}
