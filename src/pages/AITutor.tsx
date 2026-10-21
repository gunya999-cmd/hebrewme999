import { useLanguage } from "@/lib/i18n";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { readProgress, dueTerms, reviewTerm } from "@/lib/miriamProgress";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MiriamAvatar3D } from "@/components/MiriamAvatar3D";
import { LESSONS, lessonPrompt, type Lesson } from "@/lib/miriamCurriculum";

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

const CORRECTION = ` חשוב: בשיחה חופשית אל תקטעי את התלמיד על כל שגיאה. תקני רק שגיאות שמשנות משמעות או חוזרות כמה פעמים, ובסוף התור, במשפט קצר ובעברית פשוטה. אם התלמיד מבקש הסבר, הסבירי את התיקון. אל תטעני שאת יודעת לזהות שגיאת הגייה ללא ראיה מספקת מהאודיו.`;

const SCENARIOS: Scenario[] = [
  {
    id: "free", emoji: "💬", title: "Свободный разговор", titleHe: "שיחה חופשית",
    desc: "Просто поговори со мной на любую тему", level: "beginner",
    instruction: `את רחל, מורה לעברית מתל אביב. דברי רק בעברית, פשוט וחם, משפטים קצרים. עודדי את התלמיד לדבר, שאלי שאלות פתוחות.${CORRECTION}`,
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

export default function AITutor() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(readProgress);
  const [selectedLevel, setSelectedLevel] = useState<Lesson["level"]>("A1");
  const handleReview = (term: string, correct: boolean) => {
    setProgress(reviewTerm(term, correct));
  };

  const start = (s: Scenario) => {
    navigate("/voice-dialogue", {
      state: {
        level: s.level,
        autoStart: true,
        customInstruction: s.instruction,
        customGreet: s.greet,
        customTitle: `Ракель · ${t(s.title)}`,
      },
    });
  };

  const startLesson = (lesson: Lesson) => {
    navigate("/voice-dialogue", {
      state: {
        level: lesson.level === "A1" ? "beginner" : lesson.level === "A2" ? "intermediate" : "advanced",
        autoStart: true,
        customInstruction: lessonPrompt(lesson),
        customGreet: lesson.level === "A1"
          ? `Начни урок «${lesson.title}»: объясни цель одной короткой фразой на русском, затем переходи к ивриту.`
          : `התחילי את השיעור: ${t(lesson.objective)}. שאלי שאלה ראשונה.`,
        customTitle: `Ракель · ${lesson.level} · ${lesson.title}`,
        lessonId: lesson.id,
      },
    });
  };

  const due = dueTerms(progress);
  const lessonAttempts = new Set(progress.attempts.map(attempt => attempt.lessonId));
  const levels = ["A1", "A2", "B1", "B2"] as const;
  const currentLessons = LESSONS.filter(lesson => lesson.level === selectedLevel);

  return (
    <div className="min-h-screen bg-[#f5f7fc] pb-28 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 pb-10 pt-5 sm:px-8 sm:pt-8">
        <header className="flex items-center gap-3">
          <button type="button" onClick={() => navigate("/")} aria-label={t("Вернуться на главную")} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/60">
            <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-700">HebrewMe</p>
            <h1 className="text-xl font-extrabold">{t("AI Репетитор")}</h1>
          </div>
        </header>

        <section className="mt-6 overflow-hidden rounded-[2rem] border border-indigo-100 bg-white shadow-[0_16px_55px_rgba(28,39,75,0.08)]" aria-labelledby="tutor-title">
          <div className="grid items-center gap-4 p-5 sm:p-8 md:grid-cols-[1fr_auto] md:gap-8">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-800"><Sparkles aria-hidden="true" className="h-4 w-4" /> {t("Разговорная практика")}</span>
              <h2 id="tutor-title" className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl">{t("Привет, я Ракель")}</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">{t("Выбирай урок или жизненную ситуацию. Мы будем разговаривать на иврите, а сложные моменты разберём по ходу.")}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                <span className="rounded-full bg-slate-100 px-3 py-1.5">{t("Уроки A1–B2")}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5">{t("Разговор голосом")}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5">{t("Повторение слов")}</span>
              </div>
              <button type="button" onClick={() => start(SCENARIOS[0])} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-700 px-6 text-sm font-extrabold text-white transition hover:bg-indigo-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/60 sm:w-auto">
                <Phone aria-hidden="true" className="h-5 w-5" /> {t("Позвонить Ракель")}
              </button>
              <p className="mt-2 text-xs text-slate-500">{t("Для разговора потребуется доступ к микрофону и подключение к голосовому сервису.")}</p>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="order-first mx-auto flex max-w-full justify-center md:order-last" aria-label={t("Аватар Ракель")}>
              <MiriamAvatar3D size={190} speaking={false} showRing={false} />
            </motion.div>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="lesson-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-700">{t("Обучение по шагам")}</p>
              <h2 id="lesson-title" className="mt-1 text-2xl font-extrabold">{t("Уроки с Ракель")}</h2>
              <p className="mt-1 text-sm text-slate-600">{LESSONS.length} {language === "ru" ? "уроков по 7–10 минут · записано попыток:" : language === "en" ? "lessons, 7–10 minutes each · attempts:" : "שיעורים, 7–10 דקות כל אחד · ניסיונות:"} {progress.attempts.length}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 rounded-2xl bg-indigo-100/70 p-1.5" role="group" aria-label={t("Уровень языка")}>
            {levels.map(level => (
              <button type="button" key={level} onClick={() => setSelectedLevel(level)} aria-pressed={selectedLevel === level} className={"min-h-11 rounded-xl text-sm font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 " + (selectedLevel === level ? "bg-white text-indigo-900 shadow-sm" : "text-indigo-700 hover:bg-white/60")}>{level}</button>
            ))}
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {currentLessons.map((lesson, index) => (
              <button type="button" key={lesson.id} onClick={() => startLesson(lesson)} className="flex min-h-[106px] items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/60">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-extrabold text-indigo-800">{index + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-extrabold leading-snug">{t(lesson.title)}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-600">{lesson.objective}</span>
                  <span className="mt-2 block text-xs font-bold text-indigo-700">{lesson.minutes} {language === "ru" ? "мин" : language === "en" ? "min" : "דק׳"}{lessonAttempts.has(lesson.id) ? (language === "ru" ? " · уже пробовали" : language === "en" ? " · attempted" : " · נוסה") : (language === "ru" ? " · новый урок" : language === "en" ? " · new lesson" : " · שיעור חדש")}</span>
                </span>
                <ArrowLeft aria-hidden="true" className="mt-2 h-4 w-4 shrink-0 rotate-180 text-slate-400" />
              </button>
            ))}
          </div>
        </section>

        <section className="mt-9" aria-labelledby="scenarios-title">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-700">{t("Без учебника")}</p>
            <h2 id="scenarios-title" className="mt-1 text-2xl font-extrabold">{t("Попробуй в жизни")}</h2>
            <p className="mt-1 text-sm text-slate-600">{t("Выбери ситуацию — Ракель начнёт разговор по теме.")}</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SCENARIOS.slice(1).map(s => (
              <button type="button" key={s.id} onClick={() => start(s)} className="flex min-h-[115px] items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/60">
                <span aria-hidden="true" className="text-3xl leading-none">{s.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold">{t(s.title)}</span>
                  <span dir="rtl" lang="he" className="mt-1 block text-sm font-medium text-indigo-700">{s.titleHe}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600">{t(s.desc)}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-9 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="review-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-700">{t("Закрепление")}</p>
              <h2 id="review-title" className="mt-1 text-xl font-extrabold">{t("Повторить слова")}</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">{language === "ru" ? "Сейчас к повторению:" : language === "en" ? "Due for review:" : "מילים לחזרה:"} {due.length}</span>
          </div>
          {due.length === 0 ? (
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{t("Пока нет слов, срок повторения которых наступил. Они появятся здесь после уроков.")}</p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {due.slice(0, 6).map(item => (
                <div key={item.term} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p dir="rtl" lang="he" className="font-hebrew text-2xl font-bold text-slate-900">{item.term}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button variant="outline" className="min-h-11" onClick={() => handleReview(item.term, false)}>{t("Ещё учить")}</Button>
                    <Button className="min-h-11" onClick={() => handleReview(item.term, true)}>{t("Помню")}</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
