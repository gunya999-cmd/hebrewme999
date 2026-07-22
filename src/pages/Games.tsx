import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, PenLine, Puzzle, Layers, BookOpen, Mic, Sparkles, ArrowLeft, MessageCircle, ArrowUpRight, Clock3 } from "lucide-react";

const featuredGame = {
  id: "verb-drops",
  title: "Глаголопад",
  desc: "5 минут: формы, времена, лица, картинки, звук и буквы",
  path: "/games/verb-drops",
};

const games = [
  { id: "guess-form", title: "Тренажёр формы", desc: "Выбери форму, получи объяснение и исправь ошибку", icon: Brain, path: "/games/guess-form", tag: "формы" },
  { id: "write-form", title: "Собери форму", desc: "Собери форму из букв вместо жёсткого ручного ввода", icon: PenLine, path: "/games/write-form", tag: "письмо" },
  { id: "guess-root", title: "Найди корень", desc: "Нажимай корневые буквы прямо внутри инфинитива", icon: Puzzle, path: "/games/guess-root", tag: "корни" },
  { id: "guess-binyan", title: "Узнай модель", desc: "7 беньянов с объяснением шаблонов и пассивов", icon: Layers, path: "/games/guess-binyan", tag: "беньяны" },
  { id: "street-talk", title: "Уличный разговор", desc: "Реальные фразы: улица, магазин, транспорт, спортзал, слэнг", icon: MessageCircle, path: "/street-talk", tag: "речь" },
  { id: "prep-fill", title: "Вставь предлог", desc: "Вставь правильный предлог в предложение на иврите", icon: BookOpen, path: "/games/prep-fill", tag: "грамматика" },
  { id: "conjugation-voice", title: "Спряжение голосом", desc: "Назови инфинитив и измени предложение голосом", icon: Mic, path: "/games/conjugation-voice", tag: "голос" },
];

export default function Games() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_8%_0%,rgba(124,58,237,0.28),transparent_28%),radial-gradient(circle_at_92%_8%,rgba(34,211,238,0.22),transparent_26%),linear-gradient(180deg,#080b24_0%,#111433_31%,hsl(var(--background))_31%,hsl(var(--background))_100%)] px-5 pb-28 pt-8 md:px-8 md:pb-32 md:pt-10 xl:px-10 xl:pb-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-7 flex items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="rounded-2xl border border-white/15 bg-white/10 p-2.5 backdrop-blur-xl transition hover:bg-white/15">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200/80">Игровая лаборатория</p>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">Тренировки</h1>
            </div>
          </div>
          <div className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-white/75 backdrop-blur-xl md:block">7 режимов</div>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(featuredGame.path)}
          className="group relative mb-7 w-full overflow-hidden rounded-[2.4rem] border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.17),rgba(255,255,255,0.05))] p-5 text-left text-white shadow-[0_30px_80px_rgba(8,11,36,0.28)] backdrop-blur-2xl md:p-7"
        >
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-violet-400/25 blur-3xl" />
          <div className="relative grid items-center gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-300 px-3 py-1.5 text-xs font-black text-slate-950">
                <Sparkles className="h-4 w-4" /> Главная тренировка
              </div>
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">{featuredGame.title}</h2>
              <p className="mt-3 max-w-xl text-sm font-semibold leading-relaxed text-white/70 md:text-base">{featuredGame.desc}. Быстрый режим для ежедневной практики без перегруза.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-white/75">5 минут</span>
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-white/75">картинки</span>
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-white/75">звук</span>
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-white/75">1000 глаголов</span>
              </div>
            </div>

            <div className="relative flex min-h-44 items-center justify-center rounded-[2rem] border border-white/15 bg-slate-950/35 p-5 md:min-h-56">
              <div className="absolute inset-5 rounded-[1.5rem] border border-cyan-200/20" />
              <div className="relative text-center">
                <p dir="rtl" className="font-hebrew text-6xl font-black text-cyan-200 drop-shadow-[0_0_24px_rgba(34,211,238,0.45)] md:text-7xl">ללכת</p>
                <p className="mt-2 text-xl font-black text-white">идти</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950 transition group-hover:translate-x-1">
                  Запустить <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </motion.button>

        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">Выбери формат</p>
            <h2 className="mt-1 text-2xl font-black text-foreground md:text-3xl">Остальные тренажёры</h2>
          </div>
          <div className="hidden items-center gap-2 text-xs font-bold text-muted-foreground md:flex"><Clock3 className="h-4 w-4" /> 5–10 минут</div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 min-[980px]:grid-cols-3">
          {games.map((game, index) => (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(game.path)}
              className="group min-h-[205px] rounded-[1.8rem] border border-white/80 bg-white/88 p-5 text-left shadow-[0_18px_45px_rgba(15,23,42,0.07)] backdrop-blur-xl transition hover:shadow-[0_24px_60px_rgba(15,23,42,0.11)]"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-cyan-200 transition group-hover:scale-105">
                  <game.icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-primary/8 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-primary">{game.tag}</span>
              </div>
              <p className="text-lg font-black text-foreground">{game.title}</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">{game.desc}</p>
              <div className="mt-5 flex items-center justify-between text-xs font-black text-primary">
                <span>Открыть</span>
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
