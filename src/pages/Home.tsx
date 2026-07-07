import { Flame, Target, BookCheck, Sparkles, AlignJustify, Info, MessageCircle, Mic, GraduationCap, Languages, Gamepad2, Volume2, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProgressCircle from "@/components/ProgressCircle";
import { useLearning } from "@/hooks/useLearning";
import { VERB_DROPS_SEED } from "@/data/verbDrops";

const DAILY_GOAL = 10;
const BINYAN_COUNT = 7;

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

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-primary px-6 pt-12 pb-8 rounded-b-[2.25rem]">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-primary-foreground/70 text-xs font-black uppercase tracking-wide">Hebr 2.0</p>
            <h1 className="mt-1 text-3xl font-black leading-tight text-primary-foreground">Иврит в действии</h1>
            <p className="mt-2 max-w-[260px] text-primary-foreground/75 text-sm font-medium">1000 глаголов • 7 беньянов • картинки • звук • спряжения</p>
          </div>
          <div className="flex items-center gap-1 bg-primary-foreground/20 rounded-full px-3 py-1.5">
            <Flame className="w-5 h-5 text-streak" />
            <span className="text-primary-foreground font-bold text-lg">{stats.streak}</span>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="flex justify-center"
        >
          <ProgressCircle current={learnedCount} total={totalVerbs} />
        </motion.div>
      </div>

      <div className="px-6 -mt-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-2xl shadow-lg p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">Сегодня</p>
              <h2 className="mt-1 text-xl font-black text-foreground">Продолжить обучение</h2>
              <p className="mt-1 text-sm text-muted-foreground">Осталось {todayLeft} из {DAILY_GOAL} новых глаголов на сегодня.</p>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-success/10">
              <Target className="h-7 w-7 text-success" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-muted/70 p-3 text-center">
              <Sparkles className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-black text-foreground">{stats.newLearned}</p>
              <p className="text-xs text-muted-foreground font-medium">новых</p>
            </div>
            <div className="rounded-2xl bg-muted/70 p-3 text-center">
              <RotateCcw className="w-5 h-5 mx-auto mb-1 text-success" />
              <p className="text-2xl font-black text-foreground">{stats.reviewed}</p>
              <p className="text-xs text-muted-foreground font-medium">повторить</p>
            </div>
            <div className="rounded-2xl bg-muted/70 p-3 text-center">
              <GraduationCap className="w-5 h-5 mx-auto mb-1 text-streak" />
              <p className="text-2xl font-black text-foreground">{BINYAN_COUNT}</p>
              <p className="text-xs text-muted-foreground font-medium">беньянов</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-6 mt-6 grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate("/games/verb-drops")}
          className="col-span-2 rounded-[2rem] bg-success p-5 text-left text-success-foreground shadow-lg shadow-success/25"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-success-foreground/75">главная игра</p>
              <h2 className="mt-1 text-2xl font-black">Глаголопад</h2>
              <p className="mt-1 text-sm font-medium text-success-foreground/80">Смотри картинку, слушай и собирай инфинитив.</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <Gamepad2 className="h-8 w-8" />
            </div>
          </div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dictionary")}
          className="bg-card rounded-2xl p-4 shadow-sm text-left border border-border"
        >
          <BookCheck className="w-6 h-6 text-primary mb-2" />
          <p className="font-bold text-foreground text-sm">Словарь</p>
          <p className="text-xs text-muted-foreground">{totalVerbs} глаголов</p>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/games")}
          className="bg-card rounded-2xl p-4 shadow-sm text-left border border-border"
        >
          <Sparkles className="w-6 h-6 text-streak mb-2" />
          <p className="font-bold text-foreground text-sm">Игры</p>
          <p className="text-xs text-muted-foreground">глаголы, аудио, спряжения</p>
        </motion.button>
      </div>

      <div className="px-6 mt-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-muted-foreground">быстрые режимы</p>
            <h2 className="text-xl font-black text-foreground">Выбери тренировку</h2>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {fastModes.map((mode) => (
            <button key={mode} onClick={() => navigate("/games/verb-drops")} className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-foreground shadow-sm">
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 mt-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/games/verb-drops")}
          className="w-full rounded-[2rem] border border-primary/15 bg-primary/10 p-5 text-left"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-primary">тренировка по беньянам</p>
              <h2 className="mt-1 text-xl font-black text-foreground">7 моделей глагола</h2>
              <p className="mt-1 text-sm text-muted-foreground">Пааль, Нифаль, Пиэль, Хифиль, Хитпаэль, Пуаль, Хуфаль.</p>
            </div>
            <GraduationCap className="h-8 w-8 shrink-0 text-primary" />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {binyanCards.map((item) => (
              <div key={item.he} className="rounded-2xl bg-card px-2 py-2 text-center shadow-sm">
                <p dir="rtl" className="font-hebrew text-lg font-black text-primary">{item.he}</p>
                <p className="text-[10px] font-bold text-muted-foreground">{item.ru}</p>
              </div>
            ))}
          </div>
        </motion.button>
      </div>

      <div className="px-6 mt-6 grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/games/conjugation-voice")}
          className="bg-card rounded-2xl p-4 shadow-sm text-left border border-border"
        >
          <Mic className="w-6 h-6 text-primary mb-2" />
          <p className="font-bold text-foreground text-sm">Спряжение голосом</p>
          <p className="text-xs text-muted-foreground">тренажёр с Мирьям</p>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/ai-tutor")}
          className="bg-card rounded-2xl p-4 shadow-sm text-left border border-border"
        >
          <Volume2 className="w-6 h-6 text-primary mb-2" />
          <p className="font-bold text-foreground text-sm">AI Учитель</p>
          <p className="text-xs text-muted-foreground">диалоги и практика</p>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/prepositions")}
          className="bg-card rounded-2xl p-4 shadow-sm text-left border border-border"
        >
          <AlignJustify className="w-6 h-6 text-streak mb-2" />
          <p className="font-bold text-foreground text-sm">Предлоги</p>
          <p className="text-xs text-muted-foreground">20 предлогов</p>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/voice-dialogue")}
          className="bg-card rounded-2xl p-4 shadow-sm text-left border border-border"
        >
          <MessageCircle className="w-6 h-6 text-success mb-2" />
          <p className="font-bold text-foreground text-sm">Голосовой диалог</p>
          <p className="text-xs text-muted-foreground">живое общение</p>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/vocabulary")}
          className="bg-card rounded-2xl p-4 shadow-sm text-left border border-border col-span-2"
        >
          <Languages className="w-6 h-6 text-success mb-2" />
          <p className="font-bold text-foreground text-sm">Слова и фразы</p>
          <p className="text-xs text-muted-foreground">50 нужных слов и фраз с озвучкой</p>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/about")}
          className="bg-card rounded-2xl p-4 shadow-sm text-left border border-border col-span-2"
        >
          <Info className="w-6 h-6 text-primary mb-2" />
          <p className="font-bold text-foreground text-sm">О приложении</p>
          <p className="text-xs text-muted-foreground">разработчики · версия · контакты</p>
        </motion.button>
      </div>
    </div>
  );
}
