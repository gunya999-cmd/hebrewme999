import { Flame, Target, BookCheck, Sparkles, AlignJustify, Info, MessageCircle, Mic, GraduationCap, Languages, Gamepad2, Volume2, RotateCcw, ArrowRight, Layers, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLearning } from "@/hooks/useLearning";
import { VERB_DROPS_SEED } from "@/data/verbDrops";

const DAILY_GOAL = 10;
const BINYAN_COUNT = 7;

const floatingLetters = ["ל", "ה", "ת", "פ", "ע", "ל", "נ", "מ", "כ"];

const fastModes = [
  "5 минут",
  "10 новых",
  "Только ошибки",
  "Только аудио",
  "Только картинки",
  "По беньянам",
];

const binyanCards = [
  { ru: "Пааль", he: "פעל" },
  { ru: "Нифаль", he: "נפעל" },
  { ru: "Пиэль", he: "פיעל" },
  { ru: "Хифиль", he: "הפעיל" },
  { ru: "Хитпаэль", he: "התפעל" },
  { ru: "Пуаль", he: "פועל" },
  { ru: "Хуфаль", he: "הופעל" },
];

export default function Home() {
  const navigate = useNavigate();
  const { stats, learnedCount } = useLearning();
  const totalVerbs = VERB_DROPS_SEED.length;
  const todayLeft = Math.max(DAILY_GOAL - stats.newLearned, 0);
  const learnedPercent = Math.round((learnedCount / totalVerbs) * 100);

  return (
    <div className="min-h-screen overflow-hidden neon-shell pb-28">
      <section className="relative px-5 pt-10 text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {floatingLetters.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              dir="rtl"
              className="absolute font-hebrew text-5xl font-black text-white/10 hebrew-glow"
              style={{ left: `${8 + index * 10}%`, top: `${10 + (index % 3) * 18}%` }}
              animate={{ y: [0, 18, 0], opacity: [0.14, 0.34, 0.14] }}
              transition={{ duration: 3.2 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-200/80">Hebr 2.0</p>
            <h1 className="mt-2 text-4xl font-black leading-[0.96] tracking-tight">Иврит<br />через действия</h1>
            <p className="mt-3 max-w-[310px] text-sm font-semibold leading-relaxed text-white/72">1000 глаголов, 7 беньянов, картинки, звук и спряжения в игровом формате.</p>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 backdrop-blur-xl">
            <Flame className="h-5 w-5 text-amber-300" />
            <span className="font-black text-white">{stats.streak}</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="relative mt-7 overflow-hidden rounded-[2.4rem] neon-panel p-5"
        >
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />
          <div className="absolute -bottom-14 -left-8 h-44 w-44 rounded-full bg-violet-400/25 blur-2xl" />
          <div className="relative grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-100/75">активная карточка</p>
              <h2 dir="rtl" className="mt-2 font-hebrew text-6xl font-black text-white hebrew-glow">ללכת</h2>
              <p className="mt-1 text-2xl font-black text-white">идти</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-black text-white/85">פעל</span>
                <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-black text-white/85">корень הלך</span>
              </div>
            </div>
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-cyan-200/30 bg-white/10">
              <div className="absolute inset-3 rounded-full border-8 border-cyan-200/80 border-t-violet-300" />
              <div className="text-center">
                <p className="text-2xl font-black text-white">{learnedCount}</p>
                <p className="text-[10px] font-black text-white/55">из {totalVerbs}</p>
              </div>
            </div>
          </div>

          <div className="relative mt-5 grid grid-cols-2 gap-3">
            <button onClick={() => navigate("/games/verb-drops")} className="rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/25">
              Начать 5 минут
            </button>
            <button onClick={() => navigate("/dictionary")} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-black text-white backdrop-blur-xl">
              Открыть словарь
            </button>
          </div>
        </motion.div>
      </section>

      <main className="px-5 pt-6">
        <motion.section
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-[2rem] p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">Сегодня</p>
              <h2 className="mt-1 text-xl font-black text-foreground">Продолжить обучение</h2>
              <p className="mt-1 text-sm text-muted-foreground">Осталось {todayLeft} из {DAILY_GOAL} новых глаголов. Прогресс: {learnedPercent}%.</p>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <Target className="h-7 w-7 text-primary" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-950 p-3 text-center text-white">
              <Sparkles className="mx-auto mb-1 h-5 w-5 text-cyan-300" />
              <p className="text-2xl font-black">{stats.newLearned}</p>
              <p className="text-xs font-bold text-white/55">новых</p>
            </div>
            <div className="rounded-2xl bg-slate-950 p-3 text-center text-white">
              <RotateCcw className="mx-auto mb-1 h-5 w-5 text-emerald-300" />
              <p className="text-2xl font-black">{stats.reviewed}</p>
              <p className="text-xs font-bold text-white/55">повторить</p>
            </div>
            <div className="rounded-2xl bg-slate-950 p-3 text-center text-white">
              <GraduationCap className="mx-auto mb-1 h-5 w-5 text-amber-300" />
              <p className="text-2xl font-black">{BINYAN_COUNT}</p>
              <p className="text-xs font-bold text-white/55">беньянов</p>
            </div>
          </div>
        </motion.section>

        <section className="mt-5 grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/games/verb-drops")}
            className="col-span-2 overflow-hidden rounded-[2rem] bg-slate-950 p-5 text-left text-white shadow-2xl shadow-slate-900/18"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-cyan-300">главная игра</p>
                <h2 className="mt-1 text-2xl font-black">Глаголопад</h2>
                <p className="mt-1 text-sm font-medium text-white/65">Инфинитив, времена, лица, звук и буквы.</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
                <Gamepad2 className="h-8 w-8" />
              </div>
            </div>
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/dictionary")} className="glass-card rounded-2xl p-4 text-left">
            <BookCheck className="mb-2 h-6 w-6 text-primary" />
            <p className="text-sm font-black text-foreground">Словарь</p>
            <p className="text-xs font-semibold text-muted-foreground">{totalVerbs} глаголов</p>
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/games")} className="glass-card rounded-2xl p-4 text-left">
            <Zap className="mb-2 h-6 w-6 text-streak" />
            <p className="text-sm font-black text-foreground">Игры</p>
            <p className="text-xs font-semibold text-muted-foreground">формы, корни, аудио</p>
          </motion.button>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">быстрый запуск</p>
              <h2 className="text-xl font-black text-foreground">Выбери тренировку</h2>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {fastModes.map((mode) => (
              <button key={mode} onClick={() => navigate("/games/verb-drops")} className="shrink-0 rounded-full border border-white/70 bg-white/85 px-4 py-2 text-sm font-black text-foreground shadow-sm backdrop-blur-xl">
                {mode}
              </button>
            ))}
          </div>
        </section>

        <motion.section whileTap={{ scale: 0.98 }} onClick={() => navigate("/games/verb-drops")} className="mt-6 cursor-pointer rounded-[2rem] border border-primary/15 bg-white/82 p-5 shadow-xl shadow-slate-900/8 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-primary">беньяны</p>
              <h2 className="mt-1 text-xl font-black text-foreground">7 моделей глагола</h2>
              <p className="mt-1 text-sm text-muted-foreground">От простого действия до пассива и возвратных форм.</p>
            </div>
            <Layers className="h-8 w-8 shrink-0 text-primary" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {binyanCards.map((item) => (
              <div key={item.he} className="rounded-2xl bg-slate-950 px-2 py-2 text-center text-white">
                <p dir="rtl" className="font-hebrew text-lg font-black text-cyan-200">{item.he}</p>
                <p className="text-[10px] font-bold text-white/55">{item.ru}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <section className="mt-6 grid grid-cols-2 gap-3">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/games/conjugation-voice")} className="glass-card rounded-2xl p-4 text-left">
            <Mic className="mb-2 h-6 w-6 text-primary" />
            <p className="text-sm font-black text-foreground">Спряжение голосом</p>
            <p className="text-xs font-semibold text-muted-foreground">тренажёр с Мирьям</p>
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/ai-tutor")} className="glass-card rounded-2xl p-4 text-left">
            <Volume2 className="mb-2 h-6 w-6 text-primary" />
            <p className="text-sm font-black text-foreground">AI Учитель</p>
            <p className="text-xs font-semibold text-muted-foreground">диалоги и практика</p>
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/prepositions")} className="glass-card rounded-2xl p-4 text-left">
            <AlignJustify className="mb-2 h-6 w-6 text-streak" />
            <p className="text-sm font-black text-foreground">Предлоги</p>
            <p className="text-xs font-semibold text-muted-foreground">20 предлогов</p>
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/voice-dialogue")} className="glass-card rounded-2xl p-4 text-left">
            <MessageCircle className="mb-2 h-6 w-6 text-success" />
            <p className="text-sm font-black text-foreground">Голосовой диалог</p>
            <p className="text-xs font-semibold text-muted-foreground">живое общение</p>
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/street-talk")} className="glass-card col-span-2 rounded-2xl p-4 text-left">
            <MessageCircle className="mb-2 h-6 w-6 text-primary" />
            <p className="text-sm font-black text-foreground">Уличный разговор</p>
            <p className="text-xs font-semibold text-muted-foreground">фразы, реакции, слэнг, спортзал, транспорт</p>
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/vocabulary")} className="glass-card col-span-2 rounded-2xl p-4 text-left">
            <Languages className="mb-2 h-6 w-6 text-success" />
            <p className="text-sm font-black text-foreground">Слова и фразы</p>
            <p className="text-xs font-semibold text-muted-foreground">50 нужных слов и фраз с озвучкой</p>
          </motion.button>

          <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate("/about")} className="glass-card col-span-2 rounded-2xl p-4 text-left">
            <Info className="mb-2 h-6 w-6 text-primary" />
            <p className="text-sm font-black text-foreground">О приложении</p>
            <p className="text-xs font-semibold text-muted-foreground">разработчики · версия · контакты</p>
          </motion.button>
        </section>
      </main>
    </div>
  );
}
