import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LEVEL_PROMPTS: Record<string, string> = {
  beginner: `רמה: מתחילים.
השתמש רק במשפטים פשוטים מאוד (3-5 מילים). דבר לאט.
נושאים: ברכות, מספרים, צבעים, אוכל, משפחה.
אם התלמיד טועה - תקן בעדינות וחזור על הגרסה הנכונה.
שאל שאלות פשוטות כדי להמשיך את השיחה.`,

  intermediate: `רמה: בינוניים.
השתמש במשפטים בינוניים (5-10 מילים). הכנס אוצר מילים חדש בהדרגה.
נושאים: קניות, טיולים, עבודה, תחביבים, תיאור אנשים.
תקן טעויות והסבר את הכלל. שאל שאלות פתוחות.`,

  advanced: `רמה: מתקדמים.
דבר בצורה טבעית, כמו עם דובר שפת אם. השתמש בסלנג, ביטויים ומטפורות.
נושאים: פוליטיקה, תרבות, חדשות, פילוסופיה, הומור.
עודד תשובות מפורטות ודיון.`,
};

const TOPICS: Record<string, string[]> = {
  beginner: [
    "Знакомство — представься и спроси имя",
    "В кафе — закажи напиток и еду",
    "Семья — расскажи о своей семье",
    "Погода — обсуди какая сегодня погода",
    "Цвета и одежда — опиши что ты носишь",
    "Числа — посчитай и назови цены",
    "Дом — опиши свою комнату",
    "Животные — расскажи о домашних питомцах",
  ],
  intermediate: [
    "В магазине — торгуйся и выбирай товар",
    "Путешествие — спланируй поездку в Израиль",
    "Работа — расскажи о своей профессии",
    "Здоровье — визит к врачу",
    "Ресторан — закажи ужин и обсуди меню",
    "Хобби — поговори о увлечениях",
    "Транспорт — спроси дорогу и купи билет",
    "Праздники — обсуди израильские праздники",
  ],
  advanced: [
    "Культура Израиля — обсуди кино и музыку",
    "Новости — обсуди текущие события",
    "Образование — дебаты о системе образования",
    "Технологии — стартапы и инновации",
    "Кулинария — обсуди рецепт израильского блюда",
    "История — обсуди историю Израиля",
    "Экология — проблемы окружающей среды",
    "Юмор — расскажи анекдот на иврите",
  ],
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, level, action, text } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Translate Hebrew text to Russian
    if (action === "translate") {
      const translateResp = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite",
            messages: [
              {
                role: "system",
                content: "Ты переводчик с иврита на русский. Переведи текст на русский язык. Если текст содержит и иврит и русский, переведи только ивритскую часть. Отвечай ТОЛЬКО переводом, без пояснений.",
              },
              { role: "user", content: text || "" },
            ],
          }),
        }
      );
      if (!translateResp.ok) {
        return new Response(
          JSON.stringify({ translation: text || "" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const translateData = await translateResp.json();
      const translation = translateData.choices?.[0]?.message?.content || text || "";
      return new Response(
        JSON.stringify({ translation }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return random topic for the level
    if (action === "get_topic") {
      const lvl = level || "beginner";
      const topics = TOPICS[lvl] || TOPICS.beginner;
      const topic = topics[Math.floor(Math.random() * topics.length)];
      return new Response(JSON.stringify({ topic }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lvl = level || "beginner";
    const levelPrompt = LEVEL_PROMPTS[lvl] || LEVEL_PROMPTS.beginner;

    const systemPrompt = `אתה מרים (מִרְיָם), מורה ידידותית לעברית מתל אביב.
אתה מנהלת תרגול שיחה בעברית בפורמט דיאלוג חי.

${levelPrompt}

כללים חשובים:
1. דבר רק בעברית! אסור לדבר ברוסית או באנגלית בשום מצב.
2. את מתחילה ומנהלת את הדיאלוג. שאלי שאלות, הציעי מצבים.
3. היי חמה ומעודדת. שבחי על הצלחות, תקני טעויות בעדינות.
4. שמרי על דיאלוג חי - הגיבי לתשובות התלמיד, פתחי את הנושא.
5. לפעמים הכניסי עובדות תרבותיות על ישראל.
6. ענה בקצרה - 2-4 משפטים מקסימום.
7. אם התלמיד כותב ברוסית - ענה בעברית ועזור לו לתרגם.`;

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
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          stream: true,
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

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-dialogue error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
