import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SEED_VERBS } from "@/data/verbs";
import { BINYAN_NAMES, Binyan } from "@/types/verb";
import { useLearning } from "@/hooks/useLearning";

const ALL_BINYANIM = Object.keys(BINYAN_NAMES) as Binyan[];

const BINYAN_HINTS: Record<string, string> = {
  "פעל": "Основной биньян. Наст. вр. м.р.: פּוֹ-עֵ-ל",
  "נפעל": "Пассив/возвратный. Начинается с נ- или הִ-",
  "פיעל": "Интенсивный. Наст. вр.: מְ-פַ-עֵ-ל",
  "הפעיל": "Каузативный. Начинается с הִ-/מַ-",
  "התפעל": "Возвратный. Начинается с הִתְ-/מִתְ-",
};

interface Question {
  verbId: string;
  verbHebrewInf: string;
  verbTranslation: string;
  verbTranscription: string;
  correctBinyan: Binyan;
  options: Binyan[];
  root: string;
}

function generateQuestions(count: number): Question[] {
  return Array.from({ length: count }, () => {
    const verb = SEED_VERBS[Math.floor(Math.random() * SEED_VERBS.length)];
    const wrong = ALL_BINYANIM.filter((b) => b !== verb.binyan).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [...wrong, verb.binyan].sort(() => Math.random() - 0.5);
    return { verbId: verb.id, verbHebrewInf: verb.infinitive_hebrew, verbTranslation: verb.translation_ru, verbTranscription: verb.transcription_ru, correctBinyan: verb.binyan, options, root: verb.root };
  });
}

export default function GuessBinyanGame() {
  const navigate = useNavigate();
  const { markCorrect, markWrong } = useLearning();
  const [questions] = useState(() => generateQuestions(10));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const question = questions[idx];
  const isFinished = idx >= questions.length;

  const handleSelect = useCallback((opt: Binyan) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === question.correctBinyan;
    if (correct) { setScore((s) => s + 1); markCorrect(question.verbId); }
    else { markWrong(question.verbId); }
    setShowResult(true);
    setTimeout(() => { setSelected(null); setShowResult(false); setShowHint(false); setIdx((i) => i + 1); }, 2000);
  }, [selected, question, markCorrect, markWrong]);

  if (isFinished) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="text-center w-full max-w-sm">
          <div className="text-6xl mb-4">{score >= 7 ? "🏗️🎉" : "🏗️💪"}</div>
          <h2 className="text-3xl font-black text-foreground mb-2">{score} из {questions.length}</h2>
          <p className="text-muted-foreground mb-8">{score >= 7 ? "Биньяны освоены!" : "Биньяны — это система, продолжай!"}</p>
          <div className="bg-card border border-border rounded-2xl p-4 mb-6 text-left space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Биньяны — напоминание</p>
            {Object.entries(BINYAN_NAMES).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <span className="font-hebrew font-bold text-primary">{k}</span>
                <span className="text-sm text-muted-foreground">— {v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate("/games")} className="flex-1 py-3 bg-muted text-foreground rounded-xl font-bold">К играм</button>
            <button onClick={() => { setIdx(0); setScore(0); }} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold">Ещё раз</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/games")} className="text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
        <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
          <motion.div className="h-full bg-destructive rounded-full" animate={{ width: `${(idx / questions.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
        <span className="text-sm font-bold text-muted-foreground">{idx + 1}/{questions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.25 }}>
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground font-medium mb-2">К какому биньяну относится?</p>
            <h2 className="font-hebrew text-4xl font-bold text-foreground mb-1">{question.verbHebrewInf}</h2>
            <p className="text-base text-muted-foreground">{question.verbTranslation}</p>
            <p className="text-sm text-muted-foreground/60">{question.verbTranscription}</p>
          </div>

          <button onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 mx-auto mb-4 text-xs font-bold text-primary bg-primary/10 rounded-full px-3 py-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            {showHint ? "Скрыть подсказку" : "Подсказка (корень)"}
          </button>
          {showHint && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-4 text-center">
              <p className="text-sm">Корень: <span className="font-hebrew font-bold text-foreground text-lg">{question.root}</span></p>
            </motion.div>
          )}

          <div className="space-y-2.5">
            {question.options.map((opt, i) => {
              const isCorrect = opt === question.correctBinyan;
              const isSelected = selected === opt;
              let cls = "bg-card border-2 border-border";
              if (showResult && isCorrect) cls = "bg-success/10 border-2 border-success";
              else if (showResult && isSelected && !isCorrect) cls = "bg-destructive/10 border-2 border-destructive";
              return (
                <motion.button key={i} whileTap={!selected ? { scale: 0.97 } : {}} onClick={() => handleSelect(opt)}
                  className={`w-full rounded-xl p-4 text-left transition-colors ${cls} ${selected ? "cursor-default" : ""}`}
                  animate={showResult && isSelected && !isCorrect ? { x: [0, -4, 4, -4, 4, 0] } : {}} transition={{ duration: 0.4 }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-hebrew text-xl font-bold text-foreground">{opt}</span>
                      <span className="ml-2 text-sm text-muted-foreground">{BINYAN_NAMES[opt]}</span>
                      {(showResult) && (
                        <p className="text-xs text-muted-foreground mt-0.5">{BINYAN_HINTS[opt]}</p>
                      )}
                    </div>
                    {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
