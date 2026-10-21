import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Volume2, Layers } from "lucide-react";
import { PRONOUN_FORM_CATEGORIES, PRONOUN_FORM_TOTAL, PronounFormCategoryId, PronounFormItem } from "@/data/pronoun-forms";
import { speakHebrewWithBrowser } from "@/lib/verb-audio";

type FilterId = "all" | PronounFormCategoryId;

function normalize(value: string): string {
  return value.toLowerCase().replace(/[\u0591-\u05C7]/g, "").trim();
}

function FormRow({ form }: { form: PronounFormItem }) {
  return (
    <motion.div layout className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-black text-muted-foreground">{form.personRu}</span>
          <p dir="rtl" className="mt-2 font-hebrew text-3xl font-black leading-tight text-foreground">{form.hebrew}</p>
          <p className="mt-1 text-sm font-bold text-muted-foreground">{form.transcription}</p>
          <p className="mt-1 text-sm font-black text-foreground">{form.russian}</p>
          {form.note && <p className="mt-1 text-xs font-semibold text-muted-foreground">{form.note}</p>}
        </div>
        <button onClick={() => speakHebrewWithBrowser(form.hebrew)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-200" aria-label="Слушать">
          <Volume2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default function PronounForms() {
  const navigate = useNavigate();
  const [active, setActive] = useState<FilterId>("all");
  const [query, setQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const q = normalize(query);
    return PRONOUN_FORM_CATEGORIES
      .filter((category) => active === "all" || category.id === active)
      .map((category) => ({
        ...category,
        forms: category.forms.filter((form) => {
          if (!q) return true;
          return [category.title, category.subtitle, category.base, form.hebrew, form.transcription, form.russian, form.personRu, form.note || ""].some((value) => normalize(value).includes(q));
        }),
      }))
      .filter((category) => category.forms.length > 0);
  }, [active, query]);

  const visibleTotal = filteredCategories.reduce((sum, category) => sum + category.forms.length, 0);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,_rgba(124,58,237,0.24),_transparent_30%),radial-gradient(circle_at_90%_12%,_rgba(34,211,238,0.18),_transparent_28%),linear-gradient(180deg,_#080b24_0%,_#111433_34%,_hsl(var(--background))_34%,_hsl(var(--background))_100%)] pb-28">
      <header className="px-5 pt-8 text-white">
        <div className="mb-5 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-xl">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200/80">грамматика</p>
            <h1 className="text-3xl font-black tracking-tight">Местоименные формы</h1>
          </div>
        </div>

        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2.3rem] neon-panel p-5">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
          <div className="relative">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
              <Layers className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black">Предлоги + местоимения</h2>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-white/72">
              Личные, объектные, притяжательные и основные формы: לי, אותי, שלי, עליו, ממך, איתי, אצלי, בשבילך.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-black text-white/85">{PRONOUN_FORM_CATEGORIES.length} категорий</span>
              <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-black text-white/85">{PRONOUN_FORM_TOTAL} форм</span>
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
              placeholder="Поиск: אותי, עליו, тебе, как я..."
              className="w-full rounded-2xl border border-border bg-card py-3 pl-9 pr-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <button onClick={() => setActive("all")} className={`shrink-0 rounded-full px-3 py-2 text-xs font-black transition-colors ${active === "all" ? "bg-slate-950 text-cyan-200" : "bg-muted text-muted-foreground"}`}>Все</button>
            {PRONOUN_FORM_CATEGORIES.map((category) => (
              <button key={category.id} onClick={() => setActive(category.id)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-black transition-colors ${active === category.id ? "bg-slate-950 text-cyan-200" : "bg-muted text-muted-foreground"}`}>
                <span dir="rtl" className="font-hebrew">{category.mark}</span> · {category.title}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 rounded-[1.5rem] border border-primary/15 bg-primary/10 p-4">
          <p className="text-xs font-semibold leading-relaxed text-muted-foreground">
            אותי / אותם — объектные формы. ממך / עליו / בה / אצלי / לו — предлоги с местоименным суффиксом.
          </p>
        </div>

        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-black text-foreground">Показано: {visibleTotal}</p>
          <button onClick={() => { setActive("all"); setQuery(""); }} className="text-xs font-black text-primary">Сбросить</button>
        </div>

        <AnimatePresence mode="popLayout">
          <div className="space-y-5">
            {filteredCategories.map((category) => (
              <motion.section key={category.id} layout className="glass-card rounded-[2rem] p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p dir="rtl" className="font-hebrew text-3xl font-black text-primary">{category.mark}</p>
                    <h2 className="text-lg font-black text-foreground">{category.title}</h2>
                    <p className="text-xs font-semibold text-muted-foreground">{category.subtitle}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-950 px-3 py-2 text-center text-cyan-200">
                    <p dir="rtl" className="font-hebrew text-lg font-black">{category.base}</p>
                    <p className="text-[10px] font-black text-white/55">{category.forms.length}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {category.forms.map((form, index) => (
                    <FormRow key={`${category.id}-${form.person}-${index}-${form.hebrew}`} form={form} />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        </AnimatePresence>

        {filteredCategories.length === 0 && (
          <div className="glass-card rounded-[2rem] p-8 text-center">
            <p className="font-black text-foreground">Ничего не найдено</p>
            <p className="mt-1 text-sm text-muted-foreground">Попробуй другую форму, перевод или категорию.</p>
          </div>
        )}
      </main>
    </div>
  );
}
