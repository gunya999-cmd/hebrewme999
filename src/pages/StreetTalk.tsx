import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Volume2, MessageCircle, ShieldAlert } from "lucide-react";
import { STREET_TALK_CATEGORIES, STREET_TALK_PHRASES, StreetTalkCategory, StreetTalkPhrase } from "@/data/street-talk";
import { speakHebrewWithBrowser } from "@/lib/verb-audio";

const TONE_LABELS: Record<StreetTalkPhrase["tone"], string> = {
  neutral: "нейтр.",
  friendly: "друж.",
  slang: "сленг",
  rude: "резко",
  urgent: "срочно",
};

const TONE_CLASS: Record<StreetTalkPhrase["tone"], string> = {
  neutral: "bg-muted text-muted-foreground",
  friendly: "bg-success/10 text-success",
  slang: "bg-primary/10 text-primary",
  rude: "bg-destructive/10 text-destructive",
  urgent: "bg-streak/15 text-streak",
};

function normalize(text: string): string {
  return text.toLowerCase().replace(/[\u0591-\u05C7]/g, "").trim();
}

function PhraseCard({ phrase }: { phrase: StreetTalkPhrase }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="glass-card rounded-[1.65rem] p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p dir="rtl" className="font-hebrew text-3xl font-black leading-tight text-foreground">{phrase.hebrew}</p>
          <p className="mt-1 text-sm font-bold text-muted-foreground">{phrase.transcription}</p>
          <p className="mt-2 text-base font-black text-foreground">{phrase.russian}</p>
        </div>
        <button
          onClick={() => speakHebrewWithBrowser(phrase.hebrew)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-200 shadow-lg"
          aria-label="Слушать фразу"
        >
          <Volume2 className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-[11px] font-black ${TONE_CLASS[phrase.tone]}`}>{TONE_LABELS[phrase.tone]}</span>
        <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-bold text-muted-foreground">{phrase.context}</span>
      </div>
    </motion.div>
  );
}

export default function StreetTalk() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<StreetTalkCategory>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query);
    return STREET_TALK_PHRASES.filter((phrase) => {
      if (category !== "all" && phrase.category !== category) return false;
      if (!q) return true;
      return [phrase.hebrew, phrase.transcription, phrase.russian, phrase.context].some((value) => normalize(value).includes(q));
    });
  }, [category, query]);

  const rudeCount = STREET_TALK_PHRASES.filter((phrase) => phrase.tone === "rude" || phrase.tone === "urgent").length;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,_rgba(124,58,237,0.24),_transparent_30%),radial-gradient(circle_at_90%_12%,_rgba(34,211,238,0.18),_transparent_28%),linear-gradient(180deg,_#080b24_0%,_#111433_34%,_hsl(var(--background))_34%,_hsl(var(--background))_100%)] pb-28">
      <header className="px-5 pt-8 text-white">
        <div className="mb-5 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-xl">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200/80">живой иврит</p>
            <h1 className="text-3xl font-black tracking-tight">Уличный разговор</h1>
          </div>
        </div>

        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2.3rem] neon-panel p-5">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
          <div className="absolute -bottom-14 -left-8 h-44 w-44 rounded-full bg-violet-400/25 blur-2xl" />
          <div className="relative">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black">Фразы для реальной жизни</h2>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-white/72">
              Улица, магазин, транспорт, школа, работа, соседи, спортзал, реакции, слэнг и резкие фразы без тяжёлого мата.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-black text-white/85">{STREET_TALK_PHRASES.length} фраз</span>
              <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-black text-white/85">{rudeCount} резких</span>
            </div>
          </div>
        </motion.section>
      </header>

      <main className="px-5 pt-5">
        <div className="glass-card sticky top-0 z-10 mb-4 rounded-[1.5rem] p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск: жарко, автобус, отстань, gym..."
              className="w-full rounded-2xl border border-border bg-card py-3 pl-9 pr-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {STREET_TALK_CATEGORIES.map((item) => (
              <button
                key={item.id}
                onClick={() => setCategory(item.id)}
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-black transition-colors ${category === item.id ? "bg-slate-950 text-cyan-200" : "bg-muted text-muted-foreground"}`}
              >
                <span dir="rtl" className="font-hebrew">{item.mark}</span> · {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex items-start gap-3 rounded-[1.5rem] border border-destructive/15 bg-destructive/8 p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <p className="text-xs font-semibold leading-relaxed text-muted-foreground">
            Метки `резко` и `срочно` — для понимания речи и защиты границ. Использовать осторожно: тон в иврите часто важнее самой фразы.
          </p>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-black text-foreground">Найдено: {filtered.length}</p>
          <button onClick={() => { setCategory("all"); setQuery(""); }} className="text-xs font-black text-primary">Сбросить</button>
        </div>

        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {filtered.map((phrase) => <PhraseCard key={phrase.id} phrase={phrase} />)}
          </div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="glass-card rounded-[2rem] p-8 text-center">
            <p className="font-black text-foreground">Ничего не найдено</p>
            <p className="mt-1 text-sm text-muted-foreground">Попробуй другой запрос или категорию.</p>
          </div>
        )}
      </main>
    </div>
  );
}
