import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { prepositions, PREP_CATEGORY_LABELS, PrepCategory } from "@/data/prepositions";

const ALL_CATEGORIES: PrepCategory[] = ['place', 'direction', 'relation', 'possession', 'conjunction_connect', 'conjunction_oppose', 'conjunction_divide', 'particle', 'other'];

export default function Prepositions() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PrepCategory | null>(null);

  const filtered = useMemo(() => {
    return prepositions.filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        p.meaning.toLowerCase().includes(q) ||
        p.baseTranscription.toLowerCase().includes(q) ||
        p.base.includes(q);
      const matchesCategory = !selectedCategory || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 pt-8 pb-3">
        <h1 className="font-hebrew text-2xl font-black text-foreground mb-1" dir="rtl">מילות יחס</h1>
        <p className="text-sm text-muted-foreground mb-4">Предлоги, союзы и частицы</p>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск по значению, транскрипции..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-xl py-2.5 pl-9 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              !selectedCategory ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            Все
          </button>
          {ALL_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(selectedCategory === c ? null : c)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                selectedCategory === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {PREP_CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-2">
        <AnimatePresence>
          {filtered.map((prep, i) => {
            const firstForms = [prep.forms.ani, prep.forms.ata, prep.forms.hu]
              .filter((f) => f.hebrew !== '—')
              .map((f) => f.transcription);
            return (
              <motion.button
                key={prep.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => navigate(`/preposition/${prep.id}`)}
                className="w-full bg-card rounded-xl p-3.5 flex items-center gap-3 border border-border shadow-sm active:scale-[0.98] transition-transform text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-hebrew text-primary font-bold text-lg" dir="rtl">{prep.base}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-hebrew text-foreground font-bold" dir="rtl">{prep.base}</span>
                    <span className="text-muted-foreground text-xs font-medium">{prep.baseTranscription}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{prep.meaning}</p>
                  {firstForms.length > 0 && (
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5 truncate">
                      {firstForms.join(' · ')}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5">
                    {PREP_CATEGORY_LABELS[prep.category]}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
