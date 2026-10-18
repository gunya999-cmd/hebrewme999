import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ChevronRight, Search, X } from "lucide-react";
import { DICTIONARY_VERBS } from "@/data/dictionary-verbs";
import { BINYAN_NAMES, type Binyan } from "@/types/verb";
import { useLearning } from "@/hooks/useLearning";

const ALL_BINYANIM: Binyan[] = ["פעל", "נפעל", "פיעל", "הפעיל", "התפעל", "פועל", "הופעל"];
const PAGE_SIZE = 80;

export default function Dictionary() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedBinyan, setSelectedBinyan] = useState<Binyan | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { progress } = useLearning();

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase();
    return DICTIONARY_VERBS.filter(v =>
      (!q || v.translation_ru.toLocaleLowerCase().includes(q) ||
        v.transcription_ru.toLocaleLowerCase().includes(q) ||
        v.infinitive_hebrew.includes(q) || v.root.includes(q)) &&
      (!selectedBinyan || v.binyan === selectedBinyan),
    );
  }, [search, selectedBinyan]);

  const changeSearch = (value: string) => {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  };
  const changeBinyan = (value: Binyan | null) => {
    setSelectedBinyan(value);
    setVisibleCount(PAGE_SIZE);
  };
  const reset = () => {
    changeSearch("");
    changeBinyan(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fc] pb-28 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-8 sm:pt-10">
        <header>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-700">Слова и формы</p>
          <h1 className="mt-1 text-3xl font-extrabold">Словарь глаголов</h1>
          <p className="mt-2 text-sm text-slate-600">Ищи по переводу, ивриту, транскрипции или корню.</p>
        </header>
        <section className="sticky top-0 z-10 -mx-4 mt-5 border-b border-slate-200 bg-[#f5f7fc]/95 px-4 pb-3 pt-3 backdrop-blur-xl sm:-mx-8 sm:px-8" aria-label="Поиск и фильтры">
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              aria-label="Найти глагол"
              placeholder="Например: идти или ללכת"
              value={search}
              onChange={event => changeSearch(event.target.value)}
              className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white py-3 pl-12 pr-12 text-base text-slate-900 shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
            />
            {search && (
              <button type="button" onClick={() => changeSearch("")} aria-label="Очистить поиск" className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500">
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            )}
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Беньян">
            <button type="button" aria-pressed={!selectedBinyan} onClick={() => changeBinyan(null)} className={"min-h-11 shrink-0 rounded-xl px-4 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 " + (!selectedBinyan ? "bg-indigo-700 text-white" : "border border-slate-200 bg-white text-slate-700")}>Все</button>
            {ALL_BINYANIM.map(b => (
              <button type="button" key={b} aria-pressed={selectedBinyan === b} onClick={() => changeBinyan(selectedBinyan === b ? null : b)} className={"min-h-11 shrink-0 rounded-xl px-4 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 " + (selectedBinyan === b ? "bg-indigo-700 text-white" : "border border-slate-200 bg-white text-slate-700")}>
                <span lang="he" dir="rtl" className="font-hebrew">{b}</span> {BINYAN_NAMES[b]}
              </button>
            ))}
          </div>
        </section>

        <div className="mt-4 flex items-center justify-between gap-3" role="status">
          <p className="text-sm font-semibold text-slate-700">Найдено {filtered.length} из {DICTIONARY_VERBS.length}</p>
          <p className="text-xs text-slate-500">Показано {Math.min(visibleCount, filtered.length)}</p>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-5 rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center">
            <BookOpen aria-hidden="true" className="mx-auto h-9 w-9 text-indigo-600" />
            <h2 className="mt-3 text-lg font-extrabold">Ничего не найдено</h2>
            <p className="mt-2 text-sm text-slate-600">Попробуй другую форму слова или убери фильтр беньяна.</p>
            <button type="button" onClick={reset} className="mt-5 min-h-11 rounded-xl bg-indigo-700 px-6 text-sm font-bold text-white focus-visible:ring-4 focus-visible:ring-indigo-300">Сбросить фильтры</button>
          </div>
        ) : (
          <>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, visibleCount).map(verb => {
                const level = progress[verb.id]?.level || 0;
                return (
                  <button type="button" key={verb.id} onClick={() => navigate("/verb/" + verb.id)} className="flex min-h-[90px] items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-hebrew text-sm font-bold text-indigo-800" dir="rtl" lang="he">{verb.root}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-bold text-slate-950" dir="rtl" lang="he">{verb.infinitive_hebrew}</span>
                      <span className="mt-0.5 block truncate text-sm text-slate-700">{verb.translation_ru}</span>
                      <span className="block truncate text-xs text-slate-500">{verb.transcription_ru}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      <span className="rounded-full bg-slate-100 px-2 py-1 font-hebrew text-xs font-semibold text-indigo-800" lang="he">{verb.binyan}</span>
                      {level > 0 && <span className="text-[11px] font-bold text-emerald-700" aria-label={"Уровень освоения: " + level + " из 5"}>{level}/5</span>}
                      <ChevronRight aria-hidden="true" className="h-4 w-4 text-slate-400" />
                    </span>
                  </button>
                );
              })}
            </div>
            {visibleCount < filtered.length && (
              <button type="button" onClick={() => setVisibleCount(count => count + PAGE_SIZE)} className="mt-6 min-h-12 w-full rounded-2xl border border-indigo-200 bg-white px-5 text-sm font-extrabold text-indigo-800 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300">
                Показать ещё {Math.min(PAGE_SIZE, filtered.length - visibleCount)} глаголов
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
