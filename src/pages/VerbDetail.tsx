import { useLanguage } from "@/lib/i18n";
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
  const { t: tr } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTense, setActiveTense] = useState<string>("present");

  const verb = DICTIONARY_VERBS.find((v) => v.id === id);
  if (!verb) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="glass-card rounded-[2rem] p-8 text-center">
          <p className="text-lg font-black text-foreground">{tr("Глагол не найден")}</p>
          <button onClick={() => navigate("/dictionary")} className="mt-4 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">{tr("Вернуться в словарь")}</button>
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
    <div className="min-h-screen bg-[#f5f7fc] pb-28">
      <div className="mx-auto max-w-4xl px-4 pt-6 text-white sm:px-8 sm:pt-10">
        <button type="button" onClick={() => navigate("/dictionary")} aria-label={tr("Вернуться в словарь")} className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300">
          <ArrowLeft className="h-5 w-5" />
        </button>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2rem] border border-indigo-100 bg-[#202750] p-6 text-center shadow-[0_16px_48px_rgba(28,39,75,0.14)]">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />
          <div className="absolute -bottom-14 -left-8 h-44 w-44 rounded-full bg-violet-400/25 blur-2xl" />
          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-100/75">{tr("карточка глагола")}</p>
            <h1 className="mt-2 font-hebrew text-5xl font-extrabold text-white sm:text-6xl" dir="rtl">{verb.infinitive_hebrew}</h1>
            <p className="mt-2 text-lg font-bold text-white/75">{verb.transcription_ru}</p>
            <p className="mt-1 text-2xl font-black text-white">{verb.translation_ru}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-black text-white/85">
                {tr("Корень:")} <span className="font-hebrew" dir="rtl">{verb.root}</span>
              </span>
              <span className="rounded-full bg-white/16 px-3 py-1 text-xs font-black text-white/85">
                <span className="font-hebrew" dir="rtl">{verb.binyan}</span> {BINYAN_NAMES[verb.binyan]}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button type="button" onClick={() => void playVerbAudio(verb)} aria-label={tr("Слушать инфинитив")} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c8f96b] text-slate-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300" title={tr("Слушать инфинитив")}>
                <Volume2 className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => navigate("/games/verb-drops")} aria-label={tr("Тренировать в игре")} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300" title={tr("Тренировать в игре")}>
                <Gamepad2 className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex justify-center"><SpeechRateSelector variant="compact" /></div>
          </div>
        </motion.div>
      </div>

      {verb.imageSrc && (
        <div className="mx-auto mt-5 max-w-4xl px-4 sm:px-8">
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
        <div className="mx-auto mt-6 max-w-4xl px-4 sm:px-8">
          <div className="mb-4 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm" role="group" aria-label={tr("Время глагола")}>
            {TENSES.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={activeTense === t}
                onClick={() => setActiveTense(t)}
                className={`min-h-11 min-w-[88px] flex-1 rounded-xl px-2 py-2 text-xs font-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  activeTense === t
                    ? "bg-indigo-700 text-white shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                {tr(TENSE_LABELS[t])}
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
                  className="flex min-h-[72px] w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition hover:border-indigo-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300"
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
                  <p className="text-sm font-bold text-muted-foreground">{tr("В этом времени нет форм для этого глагола.")}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="mx-auto mt-6 max-w-4xl px-4 sm:px-8">
          <div className="glass-card rounded-[2rem] p-8 text-center">
            <p className="text-sm font-bold text-muted-foreground">{tr("Спряжения пока не подключены для этого глагола.")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
