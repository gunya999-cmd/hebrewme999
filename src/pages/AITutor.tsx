import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mic, Sparkles, MessageCircle, CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import miriamAvatar from "@/assets/miriam-avatar.png";
import { MiriamAvatar3D } from "@/components/MiriamAvatar3D";

/* ── Loora-style AI tutor landing ──
 * Inspired by loora.ai: big avatar, warm gradient, scenario cards.
 * Each scenario starts a real-time voice call (Gemini Live) via VoiceDialogue,
 * passing a custom Hebrew system prompt + opening line so Miriam jumps
 * straight into the role-play.
 */

type Level = "beginner" | "intermediate" | "advanced";

interface Scenario {
  id: string;
  emoji: string;
  title: string;
  titleHe: string;
  desc: string;
  level: Level;
  instruction: string;
  greet: string;
}

const CORRECTION = ` חשוב מאוד: כאשר התלמיד טועה, תקני אותו בעדינות. פתחי תמיד באחת מהצורות: «נכון לומר…», «עדיף לומר…» או «נכון להגיד…», מיד אחר כך אמרי את הצורה הנכונה המלאה ואז המשיכי בשאלה קצרה. אסור להשתמש ברוסית או באנגלית גם בזמן התיקון.`;

const SCENARIOS: Scenario[] = [
  {
    id: "free", emoji: "💬", title: "Свободный разговор", titleHe: "שיחה חופשית",
    desc: "Просто поговори со мной на любую тему", level: "beginner",
    instruction: `את מרים, מורה לעברית מתל אביב. דברי רק בעברית, פשוט וחם, משפטים קצרים. עודדי את התלמיד לדבר, שאלי שאלות פתוחות.${CORRECTION}`,
    greet: "ברכי אותי בקצרה ושאלי איך אני מרגיש היום.",
  },
  {
    id: "cafe", emoji: "☕", title: "В кафе", titleHe: "בבית קפה",
    desc: "Закажи кофе и поболтай с официанткой", level: "beginner",
    instruction: `את מלצרית בבית קפה תל אביבי. דברי רק בעברית פשוטה. הציעי לתלמיד תפריט, שאלי מה הוא רוצה לשתות ולאכול, נהלי שיחה קלילה.${CORRECTION}`,
    greet: "ברכי את הלקוח לשלום, הציגי את עצמך כמלצרית ושאלי מה הוא רוצה להזמין.",
  },
  {
    id: "taxi", emoji: "🚕", title: "В такси", titleHe: "במונית",
    desc: "Объясни водителю, куда едешь", level: "beginner",
    instruction: `את נהגת מונית בתל אביב. דברי רק בעברית פשוטה. שאלי לאן הלקוח רוצה לנסוע, דברי על התנועה ועל מזג האוויר.${CORRECTION}`,
    greet: "ברכי את הנוסע לשלום ושאלי לאן ניסע היום.",
  },
  {
    id: "market", emoji: "🛒", title: "На рынке", titleHe: "בשוק",
    desc: "Поторгуйся с продавцом на шуке", level: "intermediate",
    instruction: `את מוכרת בשוק הכרמל. דברי רק בעברית, השתמשי בסלנג קל. הציעי פירות וירקות, נקבי במחירים, התמקחי קצת.${CORRECTION}`,
    greet: "קראי בקול חם «בואו, בואו!» ושאלי מה הלקוח רוצה היום.",
  },
  {
    id: "doctor", emoji: "🏥", title: "У врача", titleHe: "אצל הרופא",
    desc: "Расскажи, что болит", level: "intermediate",
    instruction: `את רופאת משפחה בקופת חולים. דברי רק בעברית. שאלי מה כואב, כמה זמן, ותני המלצה פשוטה.${CORRECTION}`,
    greet: "ברכי את המטופל ושאלי על מה הוא מתלונן היום.",
  },
  {
    id: "airport", emoji: "✈️", title: "В аэропорту", titleHe: "בנמל התעופה",
    desc: "Пройди паспортный контроль", level: "intermediate",
    instruction: `את פקידת ביקורת דרכונים בנתב"ג. דברי רק בעברית, רשמית אך נעימה. שאלי על מטרת הביקור, משך השהייה ומקום מגורים.${CORRECTION}`,
    greet: "אמרי «שלום, דרכון בבקשה» ושאלי לאן התלמיד טס או מהיכן הגיע.",
  },
  {
    id: "friend", emoji: "🧑‍🤝‍🧑", title: "Встреча с другом", titleHe: "מפגש עם חבר",
    desc: "Поболтайте о выходных", level: "intermediate",
    instruction: `את חברה ותיקה של התלמיד. דברי רק בעברית, סלנג ישראלי טבעי. שאלי איך עבר הסופ"ש, ספרי משהו על עצמך.${CORRECTION}`,
    greet: "ברכי את החבר בחום «היי, מה נשמע?» ושאלי איך עבר הסופ\"ש.",
  },
  {
    id: "interview", emoji: "💼", title: "Собеседование", titleHe: "ראיון עבודה",
    desc: "Расскажи о себе работодателю", level: "advanced",
    instruction: `את מנהלת משאבי אנוש בחברת הייטק. דברי רק בעברית, רשמית אך ידידותית. שאלי על ניסיון, חוזקות ומוטיבציה.${CORRECTION}`,
    greet: "ברכי את המועמד, הציגי את עצמך וביקשי שיספר קצת על עצמו.",
  },
  {
    id: "news", emoji: "📰", title: "Новости и культура", titleHe: "חדשות ותרבות",
    desc: "Обсуди свежие темы Израиля", level: "advanced",
    instruction: `את עיתונאית ישראלית. דברי רק בעברית מתקדמת, השתמשי בביטויים ובסלנג. הציעי נושא אקטואלי לדיון ושאלי דעה.${CORRECTION}`,
    greet: "הציעי נושא אקטואלי לדיון בעברית ושאלי מה דעת התלמיד.",
  },
];

const FEATURES = [
  { icon: Mic, text: "Говори со мной голосом — я отвечаю как живой собеседник" },
  { icon: CheckCircle2, text: "Мгновенно поправлю произношение и грамматику" },
  { icon: Sparkles, text: "Каждый раз новый разговор по выбранной ситуации" },
];

export default function AITutor() {
  const navigate = useNavigate();

  const start = (s: Scenario) => {
    navigate("/voice-dialogue", {
      state: {
        level: s.level,
        autoStart: true,
        customInstruction: s.instruction,
        customGreet: s.greet,
        customTitle: `Мирьям · ${s.title}`,
      },
    });
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-orange-50 via-amber-50 to-background dark:from-orange-950/40 dark:via-background dark:to-background">
      {/* Header */}
      <div className="px-4 pt-5 pb-2 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-base font-bold text-foreground">AI Репетитор</h1>
      </div>

      {/* Hero */}
      <div className="px-6 pt-4 pb-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="relative"
        >
          <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-tr from-orange-400/40 via-pink-400/30 to-amber-300/40 blur-2xl" />
          <img
            src={miriamAvatar}
            alt="Мирьям"
            width={168}
            height={168}
            className="relative rounded-full border-4 border-white/70 dark:border-white/10 shadow-xl"
          />
          <motion.span
            className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-green-500 border-4 border-white dark:border-background flex items-center justify-center text-base"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            🎙
          </motion.span>
        </motion.div>

        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-5 text-2xl font-extrabold text-foreground"
        >
          Я Мирьям —<br />твой AI-репетитор иврита
        </motion.h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Понимаешь иврит, но не можешь говорить? Будем практиковаться каждый день — голосом, в реальном диалоге.
        </p>

        {/* Features list — Loora-style bullets */}
        <ul className="mt-5 w-full max-w-sm space-y-2 text-left">
          {FEATURES.map((f, i) => (
            <motion.li
              key={i}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="flex items-start gap-3 px-3 py-2 rounded-xl bg-white/60 dark:bg-card/60 backdrop-blur-sm border border-white/40 dark:border-border"
            >
              <span className="mt-0.5 w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <f.icon className="w-4 h-4" />
              </span>
              <span className="text-sm text-foreground/90 leading-snug">{f.text}</span>
            </motion.li>
          ))}
        </ul>

        {/* Primary CTA — free conversation */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => start(SCENARIOS[0])}
          className="mt-6 w-full max-w-sm flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold shadow-lg shadow-orange-500/30"
        >
          <Phone className="w-5 h-5" />
          Позвонить Мирьям
        </motion.button>
      </div>

      {/* Scenarios */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3 px-1">
          <MessageCircle className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">
            Выбери ситуацию
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {SCENARIOS.slice(1).map((s, i) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileTap={{ scale: 0.96 }}
              onClick={() => start(s)}
              className="text-left p-4 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all flex flex-col gap-2 min-h-[124px]"
            >
              <span className="text-3xl">{s.emoji}</span>
              <div>
                <p className="font-semibold text-sm text-foreground leading-tight">{s.title}</p>
                <p dir="rtl" lang="he" className="font-hebrew text-xs text-muted-foreground mt-0.5">
                  {s.titleHe}
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-snug mt-auto">{s.desc}</p>
            </motion.button>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 px-6">
          Нажми на ситуацию — Мирьям сразу позвонит и начнёт разговор на иврите.
        </p>
      </div>
    </div>
  );
}
