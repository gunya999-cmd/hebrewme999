import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, PenLine, Puzzle, Layers, BookOpen, Mic, Sparkles, ArrowLeft, Gamepad2 } from "lucide-react";

const games = [
  {
    id: "verb-drops",
    title: "Глаголопад",
    desc: "5 минут: формы, времена, лица, картинки, звук и буквы",
    icon: Sparkles,
    path: "/games/verb-drops",
    featured: true,
  },
  {
    id: "guess-form",
    title: "Угадай форму",
    desc: "Выбери правильную форму глагола из 4 вариантов",
    icon: Brain,
    path: "/games/guess-form",
  },
  {
    id: "write-form",
    title: "Напиши форму",
    desc: "Напечатай форму глагола на иврите вручную",
    icon: PenLine,
    path: "/games/write-form",
  },
  {
    id: "guess-root",
    title: "Угадай корень",
    desc: "Определи трёхбуквенный корень глагола",
    icon: Puzzle,
    path: "/games/guess-root",
  },
  {
    id: "guess-binyan",
    title: "Угадай беньян",
    desc: "К какой модели относится глагол?",
    icon: Layers,
    path: "/games/guess-binyan",
  },
  {
    id: "prep-fill",
    title: "Вставь предлог",
    desc: "Вставь правильный предлог в предложение на иврите",
    icon: BookOpen,
    path: "/games/prep-fill",
  },
  {
    id: "conjugation-voice",
    title: "Спряжение голосом",
    desc: "Назови инфинитив и измени предложение голосом",
    icon: Mic,
    path: "/games/conjugation-voice",
  },
];

export default function Games() {
  const navigate = useNavigate();
  const [featured, ...rest] = games;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_12%_0%,_rgba(124,58,237,0.25),_transparent_30%),radial-gradient(circle_at_90%_8%,_rgba(34,211,238,0.20),_transparent_28%),linear-gradient(180deg,_#080b24_0%,_#111433_34%,_hsl(var(--background))_34%,_hsl(var(--background))_100%)] pb-28 px-5 pt-8">
      <div className="mb-5 flex items-center gap-3 text-white">
        <button onClick={() => navigate(-1)} className="rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-xl">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200/80">Action Lab</p>
          <h1 className="text-3xl font-black tracking-tight">Игры</h1>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate(featured.path)}
        className="relative mb-5 w-full overflow-hidden rounded-[2.4rem] neon-panel p-5 text-left text-white"
      >
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
        <div className="absolute -left-14 -bottom-14 h-44 w-44 rounded-full bg-violet-400/25 blur-2xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-200/80">главная тренировка</p>
            <h2 className="mt-1 text-3xl font-black">{featured.title}</h2>
            <p className="mt-2 max-w-[330px] text-sm font-semibold leading-relaxed text-white/72">{featured.desc}</p>
            <div className="mt-4 inline-flex items-center rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950">Запустить</div>
          </div>
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] bg-white/12">
            <Gamepad2 className="h-10 w-10" />
          </div>
        </div>
      </motion.button>

      <div className="grid grid-cols-2 gap-3">
        {rest.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(game.path)}
            className="glass-card rounded-[1.65rem] p-4 text-left"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-cyan-200">
              <game.icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-black text-foreground">{game.title}</p>
            <p className="mt-1 text-xs font-semibold leading-snug text-muted-foreground">{game.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
