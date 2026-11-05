// Cloudflare Pages: Hebrew -> Russian translation without Supabase/Lovable.
import { checkOrigin, json, requireAccess, requireFreeTier, type MiriamContext } from "../../server/miriamSecurity";

export async function onRequestPost(context: MiriamContext): Promise<Response> {
  const { request, env } = context;
  const originDenied = checkOrigin(request, true);
  if (originDenied) return originDenied;
  if (env.MIRIAM_TRANSLATION_ENABLED !== "true") return json({ error: "Translation rollout disabled" }, 503);
  const freeTierDenied = requireFreeTier(env);
  if (freeTierDenied) return freeTierDenied;
  if (!env.GOOGLE_AI_API_KEY) return json({ error: "Translation not configured" }, 503);
  const accessDenied = await requireAccess(context);
  if (accessDenied) return accessDenied;
  if (request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return json({ error: "JSON required" }, 415);
  }
  let body: { text?: unknown; targetLanguage?: unknown };
  // Bound actual streamed bytes too: Content-Length alone can be forged/absent.
  const reader = request.body?.getReader();
  if (!reader) return json({ error: "Invalid JSON" }, 400);
  try {
    let raw = "";
    let bytes = 0;
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 16384) {
        await reader.cancel();
        return json({ error: "Request too large" }, 413);
      }
      raw += decoder.decode(value, { stream: true });
    }
    body = JSON.parse(raw + decoder.decode());
  } catch { return json({ error: "Invalid JSON" }, 400); }
  finally { reader.releaseLock(); }
  if (!body || typeof body.text !== "string" || !body.text.trim() || body.text.length > 2000) {
    return json({ error: "Text must be 1-2000 characters" }, 400);
  }
  const targetLanguage = body.targetLanguage ?? "ru";
  if (targetLanguage !== "ru" && targetLanguage !== "en") {
    return json({ error: "Unsupported translation language" }, 400);
  }
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent", {
      method: "POST",
      signal: AbortSignal.timeout(15000),
      redirect: "error",
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.GOOGLE_AI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: targetLanguage === "ru" ? "Translate Hebrew into natural Russian. Return only the translation, no commentary." : "Translate Hebrew into natural English. Return only the translation, no commentary." }] },
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
