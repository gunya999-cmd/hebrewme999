import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Flame, Gamepad2, GraduationCap, Layers3, MessageCircle, Mic2, RotateCcw, Sparkles, Target, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLearning } from "@/hooks/useLearning";
import { VERB_DROPS_SEED } from "@/data/verbDrops";

const DAILY_GOAL = 10;
const tools = [
  { title: "Словарь глаголов", description: "Значения, формы и примеры", route: "/dictionary", icon: BookOpen },
  { title: "Тренировка на слух", description: "Слушай и отвечай голосом", route: "/games/conjugation-voice", icon: Volume2 },
  { title: "Предлоги", description: "Употребление в речи", route: "/prepositions", icon: Layers3 },
  { title: "Местоименные формы", description: "לי, אותי, עליו, ממך", route: "/pronoun-forms", icon: GraduationCap },
  { title: "Живые фразы", description: "Язык повседневных ситуаций", route: "/street-talk", icon: MessageCircle },
  { title: "Все игры", description: "Формы, корни и беньяны", route: "/games", icon: Gamepad2 },
];

const actionFocus = "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400/70 focus-visible:ring-offset-2";

export default function Home() {
  const navigate = useNavigate();
  const { stats, progress, learnedCount } = useLearning();
  const total = VERB_DROPS_SEED.length;
  const progressPercent = total > 0 ? Math.min(100, Math.round((learnedCount / total) * 100)) : 0;
  const todayDone = stats.newLearned;
  const dueCount = Object.values(progress).filter(item =>
    item.level >= 1 && !!item.nextReview && Date.parse(item.nextReview) <= Date.now(),
  ).length;

  return (
    <div className="min-h-screen bg-[#f5f7fc] pb-28 text-slate-900 md:pb-32">
      <div className="mx-auto max-w-5xl px-4 pb-8 pt-6 sm:px-8 sm:pt-10">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-700">HebrewMe</p>
            <p className="mt-1 text-sm text-slate-600">Практический иврит каждый день</p>
          </div>
          <div className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 text-sm font-bold text-amber-900" aria-label={"Серия занятий: " + stats.streak}>
            <Flame aria-hidden="true" className="h-5 w-5" />
            {stats.streak} дн.
          </div>
        </header>

        <section className="mt-7 overflow-hidden rounded-[2rem] bg-[#202750] text-white shadow-[0_18px_50px_rgba(27,37,79,0.17)] md:mt-9">
          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1.4fr_0.8fr] md:items-center md:p-10">
            <div>
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-100">Маленькие занятия — устойчивый навык</span>
              <h1 className="mt-5 max-w-lg text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Иврит через действия</h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-indigo-100">Говори с Ракель, тренируй глаголы и закрепляй материал в удобном темпе.</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => navigate("/games/verb-drops")} className={"inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#c8f96b] px-5 text-sm font-extrabold text-slate-950 transition hover:bg-[#ddff9d] " + actionFocus}>
                  Начать 5 минут <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => navigate("/ai-tutor")} className={"inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/35 px-5 text-sm font-bold text-white transition hover:bg-white/10 " + actionFocus}>
                  <Mic2 aria-hidden="true" className="h-4 w-4" /> Говорить с Ракель
                </button>
              </div>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5" aria-label="Прогресс изучения">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold text-indigo-100">Изучено глаголов</span>
                <span className="text-xs text-indigo-200">из {total}</span>
              </div>
              <p className="mt-3 text-4xl font-extrabold tabular-nums">{learnedCount}</p>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/20" role="progressbar" aria-label="Доля изученных глаголов" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercent}>
                <div className="h-full rounded-full bg-[#c8f96b] transition-[width]" style={{ width: progressPercent + "%" }} />
              </div>
              <p className="mt-2 text-xs text-indigo-100">{progressPercent}% словаря · данные этого устройства</p>
            </div>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="today-title">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-700">Твой ритм</p>
              <h2 id="today-title" className="mt-1 text-2xl font-extrabold">Сегодня</h2>
            </div>
            <span className="text-sm font-medium text-slate-600">Цель: {DAILY_GOAL} новых слов</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
              <Target aria-hidden="true" className="h-5 w-5 text-indigo-700" />
              <p className="mt-3 text-2xl font-extrabold tabular-nums sm:text-3xl">{todayDone}<span className="text-base font-semibold text-slate-500">/{DAILY_GOAL}</span></p>
              <p className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">новых слов</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
              <RotateCcw aria-hidden="true" className="h-5 w-5 text-indigo-700" />
              <p className="mt-3 text-2xl font-extrabold tabular-nums sm:text-3xl">{stats.reviewed}</p>
              <p className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">повторений сделано</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
              <CheckCircle2 aria-hidden="true" className="h-5 w-5 text-indigo-700" />
              <p className="mt-3 text-2xl font-extrabold tabular-nums sm:text-3xl">{dueCount}</p>
              <p className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">пора повторить</p>
            </div>
          </div>
        </section>

        <section className="mt-9" aria-labelledby="ways-title">
          <div className="mb-4">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-700">Что делать дальше</p>
            <h2 id="ways-title" className="mt-1 text-2xl font-extrabold">Выбери формат</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <button type="button" onClick={() => navigate("/ai-tutor")} className={"group flex min-h-36 flex-col items-start rounded-3xl border border-indigo-100 bg-white p-5 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md " + actionFocus}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-800"><MessageCircle aria-hidden="true" /></span>
              <span className="mt-4 text-lg font-extrabold">Разговор с Ракель</span>
              <span className="mt-1 text-sm leading-relaxed text-slate-600">Уроки A1–B2 и диалоги в реальных ситуациях</span>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-indigo-700">Выбрать урок <ChevronRight aria-hidden="true" className="h-4 w-4" /></span>
            </button>
            <button type="button" onClick={() => navigate("/games/verb-drops")} className={"group flex min-h-36 flex-col items-start rounded-3xl border border-indigo-100 bg-white p-5 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md " + actionFocus}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-100 text-lime-900"><Sparkles aria-hidden="true" /></span>
              <span className="mt-4 text-lg font-extrabold">Глаголопад</span>
              <span className="mt-1 text-sm leading-relaxed text-slate-600">Вспомнить перевод и формы глагола в игре</span>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-indigo-700">Играть <ChevronRight aria-hidden="true" className="h-4 w-4" /></span>
            </button>
            <button type="button" onClick={() => navigate("/dictionary")} className={"group flex min-h-36 flex-col items-start rounded-3xl border border-indigo-100 bg-white p-5 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md " + actionFocus}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-900"><BookOpen aria-hidden="true" /></span>
              <span className="mt-4 text-lg font-extrabold">Словарь и формы</span>
              <span className="mt-1 text-sm leading-relaxed text-slate-600">Разобрать значение, корень и спряжение</span>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-indigo-700">Открыть словарь <ChevronRight aria-hidden="true" className="h-4 w-4" /></span>
            </button>
          </div>
        </section>

        <section className="mt-9" aria-labelledby="library-title">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id="library-title" className="text-xl font-extrabold">Другие тренировки</h2>
            <span className="text-xs font-semibold text-slate-500">Учись в своём темпе</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(item => (
              <button type="button" key={item.route} onClick={() => navigate(item.route)} className={"flex min-h-[76px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-indigo-300 " + actionFocus}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-indigo-700"><item.icon aria-hidden="true" className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-900">{item.title}</span>
                  <span className="mt-1 block text-xs text-slate-600">{item.description}</span>
                </span>
                <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="about-link-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-700">HebrewMe</p>
              <h2 id="about-link-heading" className="mt-1 text-xl font-extrabold">О приложении</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">Познакомься с создателями — семьёй Гуревич.</p>
            </div>
            <button type="button" onClick={() => navigate("/about")} className={"inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-indigo-700 px-5 text-sm font-bold text-white transition hover:bg-indigo-800 " + actionFocus}>
              О приложении и создателях <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
