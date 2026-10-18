import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Brain, Gamepad2, Layers, MessageCircle, Mic, PenLine, Puzzle, Sparkles } from "lucide-react";

const games = [
  { id: "guess-form", title: "Тренажёр формы", desc: "Выбери форму, разберись в ошибке и попробуй снова", icon: Brain, path: "/games/guess-form", tag: "Формы" },
  { id: "write-form", title: "Собери форму", desc: "Складывай глаголы из букв", icon: PenLine, path: "/games/write-form", tag: "Письмо" },
  { id: "guess-root", title: "Найди корень", desc: "Определи корневые буквы глагола", icon: Puzzle, path: "/games/guess-root", tag: "Корни" },
  { id: "guess-binyan", title: "Узнай модель", desc: "Различай семь беньянов", icon: Layers, path: "/games/guess-binyan", tag: "Грамматика" },
  { id: "street-talk", title: "Уличный разговор", desc: "Живые фразы для повседневных ситуаций", icon: MessageCircle, path: "/street-talk", tag: "Разговор" },
  { id: "prep-fill", title: "Вставь предлог", desc: "Подбери правильный предлог в предложении", icon: BookOpen, path: "/games/prep-fill", tag: "Предлоги" },
  { id: "conjugation-voice", title: "Спряжение голосом", desc: "Произноси инфинитив и меняй форму", icon: Mic, path: "/games/conjugation-voice", tag: "Аудио" },
];

export default function Games() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f5f7fc] pb-28 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-8 sm:pt-10">
        <header className="flex items-center gap-3">
          <button type="button" onClick={() => navigate("/")} aria-label="Вернуться на главную" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300">
            <ArrowLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-700">Тренировка навыков</p>
            <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Игры и практика</h1>
          </div>
        </header>

        <section className="mt-7 overflow-hidden rounded-[2rem] bg-[#202750] p-6 text-white shadow-[0_16px_45px_rgba(28,39,75,0.15)] sm:p-9" aria-labelledby="featured-game-title">
          <div className="grid items-center gap-5 sm:grid-cols-[1.5fr_0.5fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-indigo-100"><Sparkles aria-hidden="true" className="h-4 w-4" /> Быстрая практика</span>
              <h2 id="featured-game-title" className="mt-4 text-3xl font-extrabold">Глаголопад</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-indigo-100 sm:text-base">Повторяй значения, формы и времена в короткой игре. Подходит для ежедневной тренировки.</p>
              <button type="button" onClick={() => navigate("/games/verb-drops")} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#c8f96b] px-6 text-sm font-extrabold text-slate-950 hover:bg-[#ddff9d] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 sm:w-auto">
                Начать 5 минут <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
            <div aria-hidden="true" className="hidden h-36 w-36 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 text-[#c8f96b] sm:flex"><Gamepad2 className="h-16 w-16" /></div>
          </div>
        </section>

        <section className="mt-9" aria-labelledby="games-title">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-700">По направлениям</p>
          <h2 id="games-title" className="mt-1 text-2xl font-extrabold">Остальные тренажёры</h2>
          <p className="mt-2 text-sm text-slate-600">Выбери один навык, который хочешь улучшить сейчас.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {games.map(game => (
              <button type="button" key={game.id} onClick={() => navigate(game.path)} className="flex min-h-[166px] flex-col items-start rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300">
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-800"><game.icon aria-hidden="true" className="h-5 w-5" /></span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{game.tag}</span>
                </div>
                <span className="mt-4 text-base font-extrabold">{game.title}</span>
                <span className="mt-1 text-sm leading-relaxed text-slate-600">{game.desc}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-bold text-indigo-700">Открыть <ArrowRight aria-hidden="true" className="h-4 w-4" /></span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
