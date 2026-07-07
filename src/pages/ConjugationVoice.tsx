import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mic, Volume2, MessageCircle } from "lucide-react";
import tutorAvatar from "@/assets/tutor-avatar.png";

type CEFR = "A1" | "A2" | "B1" | "B2";

const LEVELS: { id: CEFR; title: string; desc: string; mark: string }[] = [
  { id: "A1", title: "A1 — Начальный", desc: "Базовые глаголы: לאכול, לשתות, ללכת", mark: "א" },
  { id: "A2", title: "A2 — Элементарный", desc: "Пааль, Пиэль и простые времена", mark: "ב" },
  { id: "B1", title: "B1 — Средний", desc: "Все активные беньяны, прошлое и будущее", mark: "ג" },
  { id: "B2", title: "B2 — Выше среднего", desc: "Сложные глаголы, пассивы и повелительное", mark: "ד" },
];

const LEVEL_VERB_HINT: Record<CEFR, string> = {
  A1: "השתמש רק בפעלים בסיסיים: לאכול, לשתות, ללכת, לראות, לדעת, לרצות, לבוא, לישון, לקרוא, לכתוב.",
  A2: "השתמש בפעלים מהבניינים פעל ופיעל: לדבר, ללמד, לשחק, לבקר, לעבוד, לשמוע, לחזור, לפגוש.",
  B1: "השתמש בפעלים מכל חמשת הבניינים, כולל הפעיל והתפעל: להזמין, להתלבש, להסביר, להתחיל, להחליט, להתעורר.",
  B2: "השתמש בפעלים מורכבים יותר, כולל ציווי, פועל, הופעל ובניין נפעל: להיכנס, להיפגש, להזכיר, להתרגש, להתכתב.",
};

function buildSystemInstruction(level: CEFR): string {
  return `את מרים — מורה לעברית בתל אביב, מנהלת תרגול קולי קצר על נטיית פעלים.

רמת התלמיד: ${level}.
${LEVEL_VERB_HINT[level]}

המשחק עובד בשני שלבים, ואת חייבת לעקוב אחריהם בדיוק:

שלב 1 — זיהוי שם הפועל:
1. אמרי משפט קצר אחד בעברית שמכיל פועל מצומד.
2. בקשי מהתלמיד לומר את שם הפועל, כלומר צורת ל... של הפועל.
3. חכי לתשובה.
4. אם התלמיד אמר נכון או קרוב מספיק — אמרי «נכון» ועברי לשלב 2 עם אותו פועל.
5. אם טעה — אמרי «לא נכון. צריך להגיד:» ואז את שם הפועל הנכון. בקשי ממנו להגיד שוב.

שלב 2 — שינוי המשפט:
1. בקשי מהתלמיד לשנות את המשפט המקורי לפי זמן, גוף, מין או מספר.
2. חכי שהתלמיד יאמר את המשפט החדש בקול.
3. אם נכון — אמרי «נכון» ועברי לתרגיל הבא.
4. אם טעה — אמרי «לא נכון. צריך להגיד:» ואז את המשפט הנכון. בקשי ממנו להגיד שוב.

חוקים מחייבים:
• דברי רק בעברית.
• דברי קצר מאוד — משפט אחד או שניים.
• אל תקפצי שלבים.
• אל תוסיפי הסברים מיותרים בזמן המשחק.
• בחרי פעלים פשוטים בהתאם לרמה ${level}.

התחילי עכשיו את התרגיל הראשון: בחרי פועל ברמה ${level}, אמרי משפט קצר, ובקשי מהתלמיד לומר את שם הפועל.`;
}

export default function ConjugationVoice() {
  const navigate = useNavigate();

  const start = (level: CEFR) => {
    navigate("/voice-dialogue", {
      state: {
        level: "intermediate",
        autoStart: true,
        customInstruction: buildSystemInstruction(level),
        customGreet: `התחילי את התרגיל הראשון כעת. אמרי משפט קצר ברמה ${level} ובקשי מהתלמיד לומר את שם הפועל.`,
        customTitle: `Спряжение глаголов — ${level}`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,_rgba(124,58,237,0.22),_transparent_30%),radial-gradient(circle_at_90%_12%,_rgba(34,211,238,0.16),_transparent_28%),hsl(var(--background))] pb-28">
      <div className="px-5 pt-8 pb-3 flex items-center gap-3">
        <button onClick={() => navigate("/games")} className="rounded-2xl border border-border bg-card p-2 text-muted-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">голосовой протокол</p>
          <h1 className="text-xl font-black text-foreground">Спряжение голосом</h1>
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col items-center gap-5">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
          <div className="absolute inset-0 -m-4 rounded-full bg-primary/20 blur-2xl" />
          <img src={tutorAvatar} alt="Мирьям" width={118} height={118} className="relative rounded-full border-4 border-white shadow-xl" />
          <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-slate-950 rounded-full border-2 border-background flex items-center justify-center">
            <Mic className="w-5 h-5 text-cyan-200" />
          </div>
        </motion.div>

        <div className="text-center max-w-sm">
          <h2 className="text-2xl font-black text-foreground">Мирьям ведёт упражнение</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Перед стартом понятно, что делать: сначала назвать инфинитив, потом изменить предложение по заданию.
          </p>
        </div>

        <div className="grid w-full max-w-md grid-cols-2 gap-3">
          <div className="glass-card rounded-2xl p-4">
            <Volume2 className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm font-black text-foreground">1. Слушай</p>
            <p dir="rtl" className="mt-2 font-hebrew text-xl font-black text-foreground">אני הולך הביתה</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">Назови инфинитив: ללכת</p>
          </div>
          <div className="glass-card rounded-2xl p-4">
            <MessageCircle className="mb-2 h-5 w-5 text-primary" />
            <p className="text-sm font-black text-foreground">2. Измени</p>
            <p dir="rtl" className="mt-2 font-hebrew text-xl font-black text-foreground">הלכתי הביתה</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">Например: скажи в прошлом</p>
          </div>
        </div>

        <p className="text-sm font-black text-foreground mt-1">Выберите уровень</p>
        <div className="w-full max-w-md space-y-3">
          {LEVELS.map((level, index) => (
            <motion.button
              key={level.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => start(level.id)}
              className="glass-card w-full flex items-center gap-4 rounded-2xl p-4 text-left"
            >
              <span dir="rtl" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 font-hebrew text-2xl font-black text-cyan-200">{level.mark}</span>
              <div className="flex-1">
                <p className="font-black text-foreground">{level.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{level.desc}</p>
              </div>
              <Mic className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
