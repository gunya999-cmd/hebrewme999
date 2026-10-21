import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { prepositions, PREP_CATEGORY_LABELS, PREP_PERSON_LABELS } from "@/data/prepositions";
import { getSpeechRate } from "@/hooks/useSpeechRate";
import { SpeechRateSelector } from "@/components/SpeechRateSelector";

const FORM_KEYS = [
  'standalone', 'ani', 'ata', 'at', 'hu', 'hi', 'anakhnu', 'atem', 'aten', 'hem', 'hen'
] as const;

export default function PrepDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const prep = prepositions.find((p) => p.id === Number(id));
  if (!prep) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Предлог не найден</p>
      </div>
    );
  }

  const speak = (text: string) => {
    if (text === '—') return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "he-IL";
    utterance.rate = getSpeechRate();
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const baseClean = prep.base.replace(/[ְִֵֶַָֹֺֻּׁׁׂׂׅ֑֖֛֢֣֤֥֦֧֪֭֮ׄ֨֩֫֬֯]/g, '').replace(/\s/g, '+');

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary px-4 pt-10 pb-6 rounded-b-[2rem]">
        <button onClick={() => navigate(-1)} className="mb-4 text-primary-foreground/80">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="font-hebrew text-4xl font-bold text-primary-foreground mb-1" dir="rtl">{prep.base}</h1>
          <p className="text-primary-foreground/80 font-medium text-lg">{prep.baseTranscription}</p>
          <p className="text-primary-foreground/60 text-sm mt-1">{prep.meaning}</p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="bg-primary-foreground/20 rounded-full px-3 py-1 text-xs font-bold text-primary-foreground">
              {PREP_CATEGORY_LABELS[prep.category]}
            </span>
          </div>
          <button
            onClick={() => speak(prep.base)}
            className="mt-3 bg-primary-foreground/20 rounded-full p-2.5 mx-auto block active:scale-90 transition-transform"
          >
            <Volume2 className="w-5 h-5 text-primary-foreground" />
          </button>
          <div className="mt-3 flex justify-center"><SpeechRateSelector variant="compact" /></div>
        </div>
      </div>

      {/* Note */}
      {prep.note && (
        <div className="mx-4 mt-4 bg-streak/10 border border-streak/30 rounded-xl p-3">
          <p className="text-sm text-foreground">💡 {prep.note}</p>
        </div>
      )}

      {/* Forms */}
      <div className="px-4 mt-4 space-y-2">
        {FORM_KEYS.map((key, i) => {
          const form = prep.forms[key];
          const person = PREP_PERSON_LABELS[key];
          const isDash = form.hebrew === '—';

          return (
            <motion.button
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => !isDash && speak(form.hebrew)}
              disabled={isDash}
              className={`w-full rounded-xl p-3.5 flex items-center gap-3 border shadow-sm text-left transition-transform ${
                isDash
                  ? 'bg-muted/50 border-border/50 opacity-60'
                  : 'bg-card border-border active:scale-[0.98]'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <div className="text-center">
                  <span className="font-hebrew text-xs font-bold text-primary" dir="rtl">{person.hebrew}</span>
                  <p className="text-[9px] text-muted-foreground">{person.russian}</p>
                </div>
              </div>
              <div className="flex-1">
                {isDash ? (
                  <span className="text-sm text-muted-foreground italic">не спрягается</span>
                ) : (
                  <>
                    <span className="font-hebrew text-foreground font-bold text-lg" dir="rtl">{form.hebrew}</span>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-sm text-muted-foreground">{form.transcription}</span>
                      <span className="text-sm text-muted-foreground/60">— {form.translation}</span>
                    </div>
                  </>
                )}
              </div>
              {!isDash && <Volume2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
            </motion.button>
          );
        })}
      </div>

      {/* Pealim link */}
      <div className="px-4 mt-6">
        <a
          href={`https://www.pealim.com/ru/search/?q=${encodeURIComponent(baseClean)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-card border border-border rounded-xl py-3 text-sm font-medium text-primary active:scale-[0.98] transition-transform"
        >
          🔍 Посмотреть на Pealim
        </a>
      </div>
    </div>
  );
}
