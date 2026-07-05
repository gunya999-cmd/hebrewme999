import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DICTIONARY_VERBS } from "@/data/dictionary-verbs";
import { BINYAN_NAMES, Binyan } from "@/types/verb";
import { useLearning } from "@/hooks/useLearning";

const ALL_BINYANIM: Binyan[] = ["פעל", "נפעל", "פיעל", "הפעיל", "התפעל", "פועל", "הופעל"];

export default function Dictionary() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedBinyan, setSelectedBinyan] = useState<Binyan | null>(null);
  const { progress } = useLearning();

  const filtered = useMemo(() => {
    return DICTIONARY_VERBS.filter((v) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || v.translation_ru.toLowerCase().includes(q) || v.transcription_ru.toLowerCase().includes(q) || v.infinitive_hebrew.includes(q) || v.root.includes(q);
      const matchesBinyan = !selectedBinyan || v.binyan === selectedBinyan;
      return matchesSearch && matchesBinyan;
    });
  }, [search, selectedBinyan]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-4 pt-8 pb-3">
        <h1 className="text-2xl font-black text-foreground mb-1">Словарь</h1>
        <p className="text-xs font-bold text-muted-foreground mb-4">{filtered.length} из {DICTIONARY_VERBS.length} глаголов</p>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск по глаголу, корню..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-xl py-2.5 pl-9 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Binyan filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedBinyan(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              !selectedBinyan ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            Все
          </button>
          {ALL_BINYANIM.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBinyan(selectedBinyan === b ? null : b)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                selectedBinyan === b ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              <span className="font-hebrew">{b}</span> {BINYAN_NAMES[b]}
            </button>
          ))}
        </div>
      </div>

      {/* Verb list */}
      <div className="px-4 space-y-2">
        <AnimatePresence>
          {filtered.map((verb) => {
            const p = progress[verb.id];
            const level = p?.level || 0;
            return (
              <motion.button
                key={verb.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => navigate(`/verb/${verb.id}`)}
                className="w-full bg-card rounded-xl p-3.5 flex items-center gap-3 border border-border shadow-sm active:scale-[0.98] transition-transform text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-hebrew text-primary font-bold text-sm">{verb.root}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-hebrew text-foreground font-bold">{verb.infinitive_hebrew}</span>
                    <span className="text-muted-foreground text-xs font-medium">{verb.transcription_ru}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{verb.translation_ru}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2 py-0.5 font-hebrew">{verb.binyan}</span>
                  {level > 0 && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div
                          key={j}
                          className={`w-1.5 h-1.5 rounded-full ${j < level ? "bg-success" : "bg-muted"}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
