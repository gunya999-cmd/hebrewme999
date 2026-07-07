import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { VOCABULARY, VOCAB_CATEGORIES, VocabWord } from "@/data/vocabulary";
import { toast } from "sonner";
import { isSupabaseConfigured, SUPABASE_CONFIG_ERROR } from "@/lib/env";

const CATS: Array<{ key: VocabWord["category"] | "all"; label: string }> = [
  { key: "all", label: "Все" },
  { key: "greeting", label: VOCAB_CATEGORIES.greeting },
  { key: "wish", label: VOCAB_CATEGORIES.wish },
  { key: "phrase", label: VOCAB_CATEGORIES.phrase },
  { key: "everyday", label: VOCAB_CATEGORIES.everyday },
  { key: "noun", label: VOCAB_CATEGORIES.noun },
  { key: "adjective", label: VOCAB_CATEGORIES.adjective },
];

export default function Vocabulary() {
  const [cat, setCat] = useState<VocabWord["category"] | "all">("all");
  const [search, setSearch] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cacheRef = useRef<Map<string, string>>(new Map());

  const list = useMemo(() => {
    return VOCABULARY.filter((w) => {
      if (cat !== "all" && w.category !== cat) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        w.hebrew.includes(search) ||
        w.transcription.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q)
      );
    });
  }, [cat, search]);

  const play = async (w: VocabWord) => {
    try {
      if (!isSupabaseConfigured) {
        toast.error(SUPABASE_CONFIG_ERROR);
        return;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      let url = cacheRef.current.get(w.id);
      if (!url) {
        setPlayingId(w.id);
        const { data, error } = await supabase.functions.invoke("tts-word", {
          body: { text: w.hebrew.replace(/[\u0591-\u05C7]/g, "") },
        });
        if (error) throw error;
        if (!data?.audio) throw new Error("Нет аудио");
        const bin = atob(data.audio);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const blob = new Blob([bytes], { type: data.mime || "audio/wav" });
        url = URL.createObjectURL(blob);
        cacheRef.current.set(w.id, url);
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      setPlayingId(w.id);
      audio.onended = () => setPlayingId(null);
      audio.onerror = () => setPlayingId(null);
      await audio.play();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Не удалось воспроизвести");
      setPlayingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,_rgba(124,58,237,0.20),_transparent_30%),radial-gradient(circle_at_90%_10%,_rgba(34,211,238,0.16),_transparent_28%),hsl(var(--background))] pb-28">
      <div className="sticky top-0 z-10 bg-background/85 backdrop-blur-xl px-5 pt-8 pb-3">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">vocabulary</p>
        <h1 className="text-3xl font-black text-foreground mb-1">Слова и фразы</h1>
        <p className="text-xs text-muted-foreground font-medium mb-4">
          50 нужных слов и фраз • голос Мирьям
        </p>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск…"
            className="w-full bg-card border border-border rounded-2xl py-3 pl-9 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATS.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                cat === c.key ? "bg-slate-950 text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 grid grid-cols-2 gap-3">
        <AnimatePresence>
          {list.map((w, index) => {
            const isPlaying = playingId === w.id;
            return (
              <motion.button
                key={w.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.015 }}
                onClick={() => play(w)}
                className="glass-card relative overflow-hidden rounded-[1.7rem] p-4 text-center active:scale-[0.97] transition-transform"
              >
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  {isPlaying ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-primary" />
                  )}
                </div>

                <div className="mx-auto mb-3 mt-1 flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-slate-950 text-cyan-200 shadow-xl shadow-slate-900/10">
                  <span dir="rtl" className="font-hebrew text-3xl font-black">{w.hebrew.slice(0, 1)}</span>
                </div>

                <div
                  dir="rtl"
                  className="font-hebrew text-2xl font-black text-foreground leading-tight mb-1 min-h-[2.5rem] flex items-center justify-center"
                >
                  {w.hebrew}
                </div>

                <div className="text-[11px] text-muted-foreground font-semibold tracking-wide mb-1">
                  {w.transcription}
                </div>
                <div className="text-sm text-foreground font-black">{w.translation}</div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {list.length === 0 && (
        <p className="text-center text-muted-foreground mt-12 text-sm">Ничего не найдено</p>
      )}
    </div>
  );
}
