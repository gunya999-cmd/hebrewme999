import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mic } from "lucide-react";
import tutorAvatar from "@/assets/tutor-avatar.png";

type CEFR = "A1" | "A2" | "B1" | "B2";

const LEVELS: { id: CEFR; title: string; desc: string; emoji: string }[] = [
  { id: "A1", title: "A1 — Начальный", desc: "Базовые глаголы: לאכול, לשתות, ללכת", emoji: "🌱" },
  { id: "A2", title: "A2 — Элементарный", desc: "Биньяны Пааль и Пиэль, простые времена", emoji: "📗" },
  { id: "B1", title: "B1 — Средний", desc: "Все 5 биньянов, прошлое/будущее", emoji: "📘" },
  { id: "B2", title: "B2 — Выше среднего", desc: "Сложные глаголы, повелительное наклонение", emoji: "🎓" },
];

const LEVEL_VERB_HINT: Record<CEFR, string> = {
  A1: "השתמש רק בפעלים בסיסיים: לאכול, לשתות, ללכת, לראות, לדעת, לרצות, לבוא, לישון, לקרוא, לכתוב.",
  A2: "השתמש בפעלים מהבניינים פעל ופיעל: לדבר, ללמד, לשחק, לבקר, לעבוד, לשמוע, לחזור, לפגוש.",
  B1: "השתמש בפעלים מכל חמשת הבניינים, כולל הפעיל והתפעל: להזמין, להתלבש, להסביר, להתחיל, להחליט, להתעורר.",
  B2: "השתמש בפעלים מורכבים יותר, כולל ציווי ובניין נפעל: להיכנס, להיפגש, להזכיר, להתרגש, להתכתב.",
};

function buildSystemInstruction(level: CEFR): string {
  return `אתה מרים — מורה לעברית בתל אביב, מנהלת תרגול קולי קצר על נטיית פעלים.

רמת התלמיד: ${level}.
${LEVEL_VERB_HINT[level]}

המשחק עובד בשני שלבים, ואתה חייב לעקוב אחריהם בדיוק:

📍 שלב 1 — זיהוי שם הפועל (אינפיניטיב):
1. אמור משפט קצר אחד בעברית (3-7 מילים) שמכיל פועל מצומד.
2. בקש מהתלמיד לומר את שם הפועל (אינפיניטיב, צורת ה-«ל...») של הפועל מהמשפט.
3. חכה לתשובה.
4. אם התלמיד אמר את האינפיניטיב הנכון (גם אם ההגייה לא מושלמת — קבל תשובה דומה) — אמור «נכון» ועבור לשלב 2 עם אותו פועל.
5. אם טעה — אמור בדיוק: «לא נכון. צריך להגיד:» ואז את האינפיניטיב הנכון, ואז «תגיד שוב». אל תעבור הלאה עד שהתלמיד יאמר נכון.

📍 שלב 2 — שינוי המשפט:
1. בקש מהתלמיד לשנות את המשפט המקורי לפי פרמטר אחד: זמן (עבר/הווה/עתיד), גוף (אני/אתה/את/הוא/היא/אנחנו/אתם/הם), או מספר/מין.
   לדוגמה: «עכשיו תגיד את המשפט בעבר», «תגיד אותו בגוף ראשון רבים», «תגיד בנקבה».
2. חכה שהתלמיד יאמר את המשפט החדש בקול.
3. אם נכון — אמור «נכון» ועבור לתרגיל הבא (חזור לשלב 1 עם פועל אחר).
4. אם טעה — אמור «לא נכון. צריך להגיד:» ואז את המשפט הנכון, ואז «תגיד שוב». אל תעבור הלאה עד שיאמר נכון.

חוקים מחייבים:
• דבר רק בעברית. לעולם אל תשתמש ברוסית או באנגלית.
• דבר קצר מאוד — משפט אחד-שניים, לא יותר.
• אל תקפיץ שלבים. תמיד שלב 1 → שלב 2 → תרגיל חדש.
• אל תוסיף הסברים מיותרים. רק הוראה / תיקון / משוב קצר.
• אם התלמיד שותק יותר מדי — חזור על המשימה בקצרה.
• בחר פעלים פשוטים בהתאם לרמה ${level}.

התחל עכשיו את התרגיל הראשון: בחר פועל ברמה ${level}, אמור משפט קצר, ובקש מהתלמיד לומר את שם הפועל (אינפיניטיב).`;
}

export default function ConjugationVoice() {
  const navigate = useNavigate();

  const start = (level: CEFR) => {
    navigate("/voice-dialogue", {
      state: {
        level: "intermediate", // Internal: needed by VoiceDialogue to skip its own picker
        autoStart: true,
        customInstruction: buildSystemInstruction(level),
        customGreet: `התחל את התרגיל הראשון כעת. אמור משפט קצר ברמה ${level} ובקש מהתלמיד לומר את שם הפועל.`,
        customTitle: `Спряжение глаголов — ${level}`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-6 pb-3 flex items-center gap-3 border-b border-border">
        <button onClick={() => navigate("/games")} className="text-muted-foreground">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Голосовой тренажёр спряжения</h1>
      </div>

      <div className="px-4 pt-6 flex flex-col items-center gap-5">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
          <img src={tutorAvatar} alt="Мирьям" width={110} height={110} className="rounded-full border-4 border-primary/20 shadow-lg" />
          <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-primary rounded-full border-2 border-background flex items-center justify-center">
            <Mic className="w-4 h-4 text-primary-foreground" />
          </div>
        </motion.div>

        <div className="text-center max-w-sm">
          <h2 className="text-xl font-black text-foreground">Мирьям-репетитор</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Голосовая игра в 2 этапа: <br />
            <span className="font-semibold text-foreground">1)</span> услышь предложение и назови инфинитив глагола.{" "}
            <span className="font-semibold text-foreground">2)</span> измени предложение по заданию (время / лицо / число).
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Параллельно в чате появляется текст на иврите.
          </p>
        </div>

        <p className="text-sm font-semibold text-foreground mt-2">Выберите уровень</p>
        <div className="w-full max-w-md space-y-3">
          {LEVELS.map((l, i) => (
            <motion.button
              key={l.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => start(l.id)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-accent transition-colors text-left"
            >
              <span className="text-3xl">{l.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-foreground">{l.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{l.desc}</p>
              </div>
              <Mic className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
