import {
  Flame,
  Target,
  BookCheck,
  Sparkles,
  AlignJustify,
  Info,
  MessageCircle,
  Mic,
  GraduationCap,
  Languages,
  Bot,
  Headphones,
  Brain,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProgressCircle from "@/components/ProgressCircle";
import { useLearning } from "@/hooks/useLearning";
import { SEED_VERBS } from "@/data/verbs";

const quickActions = [
  {
    title: "AI Репетитор",
    description: "Мирьям объясняет, слушает и поправляет",
    icon: Bot,
    path: "/ai-tutor",
    badge: "Главный режим",
  },
  {
    title: "Спряжение голосом",
    description: "Скажи форму глагола и получи проверку",
    icon: Mic,
    path: "/games/conjugation-voice",
    badge: "Voice",
  },
  {
    title: "Голосовой диалог",
    description: "Тренировка живых фраз на иврите",
    icon: MessageCircle,
    path: "/voice-dialogue",
    badge: "Speaking",
  },
  {
    title: "Игры",
    description: "Формы, корни, биньяны и предлоги",
    icon: Sparkles,
    path: "/games",
    badge: "6 режимов",
  },
];

const learningFlow = [
  "AI произносит фразу на иврите",
  "Ты находишь глагол и называешь инфинитив",
  "Меняешь фразу по времени, лицу, роду или числу",
  "Ошибки уходят в повторение",
];

export default function Home() {
  const navigate = useNavigate();
  const { stats, learnedCount, masteredCount } = useLearning();
  const totalVerbs = SEED_VERBS.length;
  const progressPercent = totalVerbs > 0 ? Math.round((learnedCount / totalVerbs) * 100) : 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <section className="relative overflow-hidden bg-primary px-6 pt-10 pb-8 rounded-b-[2rem]">
        <div className="absolute -right-14 -top-16 h-44 w-44 rounded-full bg-primary-foreground/10" />
        <div className="absolute -left-16 bottom-4 h-36 w-36 rounded-full bg-primary-foreground/10" />

        <div className="relative flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-bold text-primary-foreground/90 mb-3">
              <GraduationCap className="h-4 w-4" /> HebrewMe AI
            </p>
            <h1 className="text-3xl font-black leading-tight text-primary-foreground">
              Иврит, который ты реально говоришь
            </h1>
            <p className="mt-2 max-w-xs text-sm font-medium text-primary-foreground/75">
              Голосовой тренажёр глаголов, фраз, аудирования и живого диалога с AI-репетитором.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-full bg-primary-foreground/20 px-3 py-2">
            <Flame className="h-5 w-5 text-streak" />
            <span className="text-lg font-black text-primary-foreground">{stats.streak}</span>
          </div>
        </div>

        <motion.div
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="relative grid grid-cols-[1fr_auto] items-center gap-5 rounded-3xl bg-primary-foreground/12 p-4 backdrop-blur"
        >
          <div>
            <p className="text-sm font-bold text-primary-foreground">Прогресс по глаголам</p>
            <p className="mt-1 text-xs text-primary-foreground/70">
              {learnedCount} из {totalVerbs} изучено · {masteredCount} доведено до уверенного уровня
            </p>
            <button
              onClick={() => navigate("/dictionary")}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground px-4 py-2 text-sm font-bold text-primary shadow-sm"
            >
              Открыть словарь <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <ProgressCircle current={learnedCount} total={totalVerbs} />
        </motion.div>
      </section>

      <section className="px-6 -mt-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-card p-4 shadow-lg"
        >
          <div className="text-center">
            <Sparkles className="mx-auto mb-1 h-5 w-5 text-primary" />
            <p className="text-2xl font-black text-foreground">{stats.newLearned}</p>
            <p className="text-xs font-medium text-muted-foreground">Новых</p>
          </div>
          <div className="text-center">
            <BookCheck className="mx-auto mb-1 h-5 w-5 text-success" />
            <p className="text-2xl font-black text-foreground">{stats.reviewed}</p>
            <p className="text-xs font-medium text-muted-foreground">Повторено</p>
          </div>
          <div className="text-center">
            <Target className="mx-auto mb-1 h-5 w-5 text-streak" />
            <p className="text-2xl font-black text-foreground">{progressPercent}%</p>
            <p className="text-xs font-medium text-muted-foreground">Прогресс</p>
          </div>
        </motion.div>
      </section>

      <section className="px-6 mt-6 space-y-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => navigate("/ai-tutor")}
          className="w-full rounded-3xl bg-success px-5 py-5 text-left text-success-foreground shadow-lg shadow-success/25"
        >
          <span className="flex items-center justify-between gap-4">
            <span>
              <span className="block text-xl font-black">Начать тренировку с Мирьям</span>
              <span className="mt-1 block text-sm font-medium opacity-85">
                Слушай фразу, отвечай голосом и исправляй ошибки
              </span>
            </span>
            <Mic className="h-8 w-8 shrink-0" />
          </span>
        </motion.button>

        <button
          onClick={() => navigate("/games/guess-form")}
          className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-left font-bold text-foreground shadow-sm"
        >
          🎯 Быстрый урок: формы глаголов
        </button>
      </section>

      <section className="px-6 mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black text-foreground">Как проходит урок</h2>
          <Headphones className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-2 rounded-2xl border border-border bg-card p-4 shadow-sm">
          {learningFlow.map((item, index) => (
            <div key={item} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                {index + 1}
              </span>
              <p className="text-sm font-medium text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 mt-6 grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <motion.button
            key={action.path}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(action.path)}
            className="rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <action.icon className="h-6 w-6 text-primary" />
              <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground">
                {action.badge}
              </span>
            </div>
            <p className="text-sm font-black text-foreground">{action.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{action.description}</p>
          </motion.button>
        ))}
      </section>

      <section className="px-6 mt-6 grid grid-cols-2 gap-3">
        <button onClick={() => navigate("/dictionary")} className="rounded-2xl border border-border bg-card p-4 text-left shadow-sm">
          <BookCheck className="mb-2 h-6 w-6 text-primary" />
          <p className="text-sm font-bold text-foreground">Словарь</p>
          <p className="text-xs text-muted-foreground">{totalVerbs} глаголов</p>
        </button>
        <button onClick={() => navigate("/prepositions")} className="rounded-2xl border border-border bg-card p-4 text-left shadow-sm">
          <AlignJustify className="mb-2 h-6 w-6 text-streak" />
          <p className="text-sm font-bold text-foreground">Предлоги</p>
          <p className="text-xs text-muted-foreground">20 частых предлогов</p>
        </button>
        <button onClick={() => navigate("/vocabulary")} className="rounded-2xl border border-border bg-card p-4 text-left shadow-sm">
          <Languages className="mb-2 h-6 w-6 text-success" />
          <p className="text-sm font-bold text-foreground">Слова и фразы</p>
          <p className="text-xs text-muted-foreground">База для школы и жизни</p>
        </button>
        <button onClick={() => navigate("/about")} className="rounded-2xl border border-border bg-card p-4 text-left shadow-sm">
          <Info className="mb-2 h-6 w-6 text-primary" />
          <p className="text-sm font-bold text-foreground">О приложении</p>
          <p className="text-xs text-muted-foreground">Версия и контакты</p>
        </button>
      </section>

      <section className="px-6 mt-6">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Brain className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div>
              <p className="font-black text-foreground">Фокус следующего обновления</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Тетрадь ошибок: приложение будет сохранять неправильные ответы и чаще возвращать слабые темы.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-success">
                <CheckCircle2 className="h-4 w-4" /> Готово для добавления в следующий релиз
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
