import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SEED_VERBS } from "@/data/verbs";
import { BINYAN_NAMES, PERSON_LABELS, TENSE_LABELS, ConjugationForm } from "@/types/verb";
import { useLearning } from "@/hooks/useLearning";

const TENSES = ["present", "past", "future", "imperative"] as const;

const SRS_LEVEL_LABELS = ["Новый", "Ур. 1", "Ур. 2", "Ур. 3", "Ур. 4", "Выучен ✓"];
const SRS_LEVEL_COLORS = [
  "bg-muted text-muted-foreground",
  "bg-primary/20 text-primary",
  "bg-primary/40 text-primary",
  "bg-success/30 text-success",
  "bg-success/50 text-success",
  "bg-success text-success-foreground",
];

export default function VerbDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTense, setActiveTense] = useState<string>("present");
  const { progress } = useLearning();

  const verb = SEED_VERBS.find((v) => v.id === id);
  if (!verb) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Глагол не найден</p>
      </div>
    );
  }

  const verbProgress = progress[verb.id];
  const srsLevel = verbProgress?.level ?? 0;

  const conjugation = verb.conjugations;
  const activeForms: Record<string, ConjugationForm> | undefined = conjugation
    ? (conjugation as any)[activeTense]
    : undefined;

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "he-IL";
    speechSynthesis.speak(utterance);
  };

  const pealimUrl = `https://www.pealim.com/search/?q=${encodeURIComponent(verb.infinitive_hebrew)}`;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary px-4 pt-10 pb-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)} className="text-primary-foreground/80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className={`text-xs font-bold rounded-full px-3 py-1 ${SRS_LEVEL_COLORS[srsLevel]}`}>
            {SRS_LEVEL_LABELS[srsLevel]}
          </span>
        </div>
        <div className="text-center">
          <h1 className="font-hebrew text-4xl font-bold text-primary-foreground mb-1">{verb.infinitive_hebrew}</h1>
          <p className="text-primary-foreground/80 font-medium text-lg">{verb.transcription_ru}</p>
          <p className="text-primary-foreground/60 text-sm mt-1">{verb.translation_ru}</p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="bg-primary-foreground/20 rounded-full px-3 py-1 text-xs font-bold text-primary-foreground">
              Корень: <span className="font-hebrew">{verb.root}</span>
            </span>
            <span className="bg-primary-foreground/20 rounded-full px-3 py-1 text-xs font-bold text-primary-foreground">
              <span className="font-hebrew">{verb.binyan}</span> {BINYAN_NAMES[verb.binyan]}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <button
              onClick={() => speak(verb.infinitive_hebrew)}
              className="bg-primary-foreground/20 rounded-full p-2.5 active:scale-90 transition-transform"
            >
              <Volume2 className="w-5 h-5 text-primary-foreground" />
            </button>
            <a
              href={pealimUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-foreground/20 rounded-full px-3 py-2 text-xs font-bold text-primary-foreground flex items-center gap-1 active:scale-90 transition-transform"
            >
              Pealim <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Tense Tabs */}
      {conjugation ? (
        <div className="px-4 mt-6">
          <div className="flex gap-1 bg-muted rounded-xl p-1 mb-4">
            {TENSES.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTense(t)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTense === t
                    ? "bg-card text-foreground shadow-sm"
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
              {activeForms && Object.entries(activeForms).map(([person, form]) => (
                <button
                  key={person}
                  onClick={() => speak(form.hebrew)}
                  className="w-full bg-card rounded-xl p-3.5 flex items-center gap-3 border border-border shadow-sm active:scale-[0.98] transition-transform text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">{PERSON_LABELS[person]}</span>
                  </div>
                  <div className="flex-1">
                    <span className="font-hebrew text-foreground font-bold text-lg">{form.hebrew}</span>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-sm text-muted-foreground">{form.transcription}</span>
                      <span className="text-sm text-muted-foreground/60">— {form.translation}</span>
                    </div>
                  </div>
                  <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="px-4 mt-6">
          <div className="bg-card rounded-2xl p-8 text-center border border-border">
            <p className="text-muted-foreground font-medium">Спряжения будут добавлены позже</p>
          </div>
        </div>
      )}
    </div>
  );
}
