import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2, Gamepad2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DICTIONARY_VERBS } from "@/data/dictionary-verbs";
import { BINYAN_NAMES, PERSON_LABELS, TENSE_LABELS, ConjugationForm, VerbConjugations } from "@/types/verb";
import { SpeechRateSelector } from "@/components/SpeechRateSelector";
import VerbCardScene from "@/components/VerbCardScene";
import { playVerbAudio, speakHebrewWithBrowser } from "@/lib/verb-audio";

const TENSES = ["present", "past", "future", "imperative"] as const;

type TenseKey = keyof VerbConjugations;

function getTenseForms(conjugations: VerbConjugations, tense: string): Record<string, ConjugationForm> | undefined {
  if (!(tense in conjugations)) return undefined;
  return conjugations[tense as TenseKey] as unknown as Record<string, ConjugationForm>;
}

export default function VerbDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTense, setActiveTense] = useState<string>("present");

  const verb = DICTIONARY_VERBS.find((v) => v.id === id);
  if (!verb) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="glass-card rounded-[2rem] p-8 text-center">
          <p className="text-lg font-black text-foreground">Глагол не найден</p>
          <button onClick={() => navigate("/dictionary")} className="mt-4 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">Вернуться в словарь</button>
        </div>
      </div>
    );
  }

  const conjugation = verb.conjugations;
  const activeForms: Record<string, ConjugationForm> | undefined = conjugation
    ? getTenseForms(conjugation, activeTense)
    : undefined;

  const speak = (text: string) => {
    speakHebrewWithBrowser(text);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,_rgba(124,58,237,0.25),_transparent_30%),radial-gradient(circle_at_90%_12%,_rgba(34,211,238,0.20),_transparent_28%),linear-gradient(180deg,_#080b24_0%,_#111433_34%,_hsl(var(--background))_34%,_hsl(var(--background))_100%)] pb-28">
      <div className="px-5 pt-8 text-white">
        <button onClick={() => navigate(-1)} className="mb-5 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-xl">
          <ArrowLeft className="h-5 w-5" />
        </button>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2.4rem] neon-panel p-5 text-center">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />
          <div className="absolute -bottom-14 -left-8 h-44 w-44 rounded-full bg-violet-400/25 blur-2xl" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-100/75">карточка глагола</p>
            <h1 className="mt-2 font-hebrew text-6xl font-black text-white hebrew-glow" dir="rtl">{verb.infinitive_hebrew}</h1>
            <p className="mt-2 text-lg font-bold text-white/75">{verb.transcription_ru}</p>
            <p className="mt-1 text-2xl font-black text-white">{verb.translation_ru}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-black text-white/85">
                Корень: <span className="font-hebrew" dir="rtl">{verb.root}</span>
              </span>
              <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-black text-white/85">
                <span className="font-hebrew" dir="rtl">{verb.binyan}</span> {BINYAN_NAMES[verb.binyan]}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button onClick={() => void playVerbAudio(verb)} className="rounded-full bg-cyan-300 p-3 text-slate-950 shadow-lg shadow-cyan-400/25" title="Слушать инфинитив">
                <Volume2 className="h-5 w-5" />
              </button>
              <button onClick={() => navigate("/games/verb-drops")} className="rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-xl" title="Тренировать в игре">
                <Gamepad2 className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex justify-center"><SpeechRateSelector variant="compact" /></div>
          </div>
        </motion.div>
      </div>

      {verb.imageSrc && (
        <div className="px-5 mt-5">
          <div className="glass-card mx-auto max-w-[300px] rounded-[2rem] p-2">
            <VerbCardScene
              verbId={verb.id}
              src={verb.imageSrc}
              alt={`${verb.infinitive_hebrew} - ${verb.translation_ru}`}
              className="aspect-square w-full rounded-[1.5rem]"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {conjugation ? (
        <div className="px-5 mt-6">
          <div className="mb-4 flex gap-1 rounded-2xl bg-white/75 p-1 shadow-sm backdrop-blur-xl">
            {TENSES.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTense(t)}
                className={`flex-1 rounded-xl py-2 text-xs font-black transition-all ${
                  activeTense === t
                    ? "bg-slate-950 text-white shadow-lg"
                    : "text-muted-foreground"
                }`}
              >
                {TENSE_LABELS[t]}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTense}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {activeForms && Object.entries(activeForms).length > 0 ? Object.entries(activeForms).map(([person, form]) => (
                <button
                  key={person}
                  onClick={() => speak(form.hebrew)}
                  className="glass-card w-full rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform text-left"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <span className="text-xs font-black">{PERSON_LABELS[person]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-hebrew text-xl font-black text-foreground" dir="rtl">{form.hebrew}</span>
                    <div className="mt-0.5 flex flex-wrap gap-2">
                      <span className="text-sm font-semibold text-muted-foreground">{form.transcription}</span>
                      <span className="text-sm text-muted-foreground/70">— {form.translation}</span>
                    </div>
                  </div>
                  <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>
              )) : (
                <div className="glass-card rounded-[2rem] p-6 text-center">
                  <p className="text-sm font-bold text-muted-foreground">В этом времени нет форм для этого глагола.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="px-5 mt-6">
          <div className="glass-card rounded-[2rem] p-8 text-center">
            <p className="text-sm font-bold text-muted-foreground">Спряжения пока не подключены для этого глагола.</p>
          </div>
        </div>
      )}
    </div>
  );
}
