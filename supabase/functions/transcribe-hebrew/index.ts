// Hebrew speech-to-text using Gemini via the Lovable AI Gateway.
// Accepts JSON: { audio: string (base64), mimeType?: string, expectedText?: string }
// Returns: { transcript: string }

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Determine correct audio format for Gemini based on MIME type
function resolveAudioFormat(mime?: string): string {
  if (!mime) return "webm";
  if (mime.includes("wav"))  return "wav";
  if (mime.includes("mp4") || mime.includes("m4a") || mime.includes("aac")) return "mp4";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("webm")) return "webm";
  return "webm";
}

// Strip any non-Hebrew content from the transcript result
function cleanTranscript(text: string): string {
  return text
    // Remove surrounding quotes and whitespace
    .replace(/^["'`«»\s]+|["'`«»\s]+$/g, "")
    // Remove Hebrew label prefixes like "תמלול:" 
    .replace(/^\s*תמלול[:\-]?\s*/i, "")
    // Remove any Latin characters (transliteration / English)
    .replace(/[a-zA-Z]+/g, "")
    // Remove any Cyrillic characters (Russian)
    .replace(/[\u0400-\u04FF]+/g, "")
    // Remove Arabic characters
    .replace(/[\u0600-\u06FF]+/g, "")
    // Remove Thai characters
    .replace(/[\u0E00-\u0E7F]+/g, "")
    // Remove trailing/leading punctuation
    .replace(/^[.,!?;:\-]+|[.,!?;:\-]+$/g, "")
    .trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio, mimeType, expectedText } = await req.json();
    if (!audio || typeof audio !== "string") {
      return new Response(
        JSON.stringify({ error: "audio (base64) is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const audioFormat = resolveAudioFormat(mimeType);

    const guideline = expectedText
      ? `Подсказка: пользователь должен был произнести примерно «${expectedText}». Записывай то что реально слышно — не подгоняй под ожидание, но используй подсказку если речь нечёткая.`
      : "";

    const systemPrompt =
      `Ты — точный транскрибатор устной речи на иврите. ` +
      `СТРОГИЕ ПРАВИЛА:\n` +
      `1. Верни ТОЛЬКО ивритские буквы (алеф-бет). Без огласовок.\n` +
      `2. Запрещено: перевод, транслитерация, латиница, русские буквы, арабский текст, тайский текст.\n` +
      `3. Без кавычек, без эмодзи, без пояснений, без вступлений.\n` +
      `4. Без знаков препинания в начале и конце строки.\n` +
      `5. Если слышна нечёткая речь — напиши ближайшее ивритское слово.\n` +
      `6. Если речь вообще не распознаётся или тишина — верни пустую строку и только её.\n` +
      `${guideline}`;

    const body = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: "Транскрибируй эту аудиозапись. Верни только ивритский текст без каких-либо добавлений." },
            {
              type: "input_audio",
              input_audio: {
                data: audio,
                format: audioFormat,
              },
            },
          ],
        },
      ],
    };

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Слишком много запросов. Подождите." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Исчерпан лимит AI-запросов." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("transcribe-hebrew gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Ошибка AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const raw: string = data.choices?.[0]?.message?.content || "";
    const transcript = cleanTranscript(raw);

    console.log(`[transcribe-hebrew] format=${audioFormat} raw="${raw}" → clean="${transcript}"`);

    return new Response(JSON.stringify({ transcript }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("transcribe-hebrew error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
