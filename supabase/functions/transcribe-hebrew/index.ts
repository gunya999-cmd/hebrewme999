// Hebrew speech-to-text using Gemini via the Lovable AI Gateway.
// Accepts JSON: { audio: string (base64), mimeType?: string, expectedText?: string }
// Returns: { transcript: string }
//
// We deliberately use Gemini (not the browser Web Speech API) because Chrome's
// SpeechRecognition for "he-IL" is unreliable and frequently mis-recognises
// Hebrew as Thai/Arabic/romanised text. Gemini's audio understanding gives
// dramatically better Hebrew transcription quality.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    const guideline = expectedText
      ? `Пользователь, скорее всего, произнёс примерно эту фразу на иврите: "${expectedText}". Запиши то, что реально слышно, не подгоняй под ожидание.`
      : "";

    const systemPrompt =
      `Ты — точный транскрибатор устной речи на иврите. ` +
      `Твоя задача: вернуть ТОЛЬКО ту фразу, которую произнёс пользователь, на иврите, как есть, ` +
      `без огласовок, без перевода, без пояснений, без кавычек, без эмодзи, ` +
      `без вступлений и без знаков препинания в начале/конце. ` +
      `Если речь не распознаётся — верни пустую строку. ${guideline}`;

    const body = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: "Транскрибируй эту запись на иврите." },
            {
              type: "input_audio",
              input_audio: {
                data: audio,
                format: (mimeType && mimeType.includes("wav")) ? "wav" : "webm",
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
    let transcript: string = data.choices?.[0]?.message?.content || "";
    transcript = transcript
      .replace(/^["'`«»\s]+|["'`«»\s]+$/g, "")
      .replace(/^\s*תמלול[:\-]?\s*/i, "")
      .trim();

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
