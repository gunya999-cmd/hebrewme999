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
    const { userText, expectedText, level } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Ты — AI-анализатор произношения иврита. Пользователь пытался сказать фразу на иврите, и система распознавания речи расшифровала его речь.

Сравни ожидаемый текст с тем, что распознала система, и дай оценку.

ФОРМАТ ОТВЕТА — строго JSON:
{
  "overallScore": число от 0 до 100,
  "feedback": "краткий комментарий на русском (1-2 предложения)",
  "wordScores": [
    { "word": "слово на иврите", "score": число 0-100, "tip": "совет если < 80" }
  ],
  "encouragement": "мотивирующая фраза на русском"
}

Правила:
- Если userText пустой или совсем не похож — score 0-20
- Если частично совпадает — 40-70
- Если хорошее совпадение — 80-100
- Будь снисходительным к транслитерации и небольшим ошибкам распознавания
- Учитывай уровень: ${level === "beginner" ? "начинающий — будь очень мягким" : level === "intermediate" ? "средний" : "продвинутый — будь строже"}`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Ожидаемый текст: "${expectedText}"\nРаспознанный текст: "${userText}"`,
            },
          ],
        }),
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
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Ошибка AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return new Response(jsonMatch[0], {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ overallScore: 50, feedback: "Не удалось проанализировать.", wordScores: [], encouragement: "Попробуй ещё раз!" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("ai-pronunciation error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
