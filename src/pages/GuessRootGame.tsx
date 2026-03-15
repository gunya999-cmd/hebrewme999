import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SEED_VERBS } from "@/data/verbs";
import { useLearning } from "@/hooks/useLearning";

interface Question {
  verbId: string;
  verbHebrewInf: string;
  verbTranslation: string;
  verbTranscription: string;
  correctRoot: string;
  options: string[];
}

function generateQuestions(count: number): Question[] {
  const verbs = SEED_VERBS;
  return Array.from({ length: count }, () => {
    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const wrongRoots = verbs
      .filter((v) => v.root !== verb.root)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((v) => v.root);
    const options = [...wrongRoots, verb.root].sort(() => Math.random() - 0.5);
    return { verbId: verb.id, verbHebrewInf: verb.infinitive_hebrew, verbTranslation: verb.translation_ru, verbTranscription: verb.transcription_ru, correctRoot: verb.root, options };
  });
}

export default function GuessRootGame() {
  const navigate = useNavigate();
  const { markCorrect, markWrong } = useLearning();
  const [questions] = useState(() => generateQuestions(10));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = questions[idx];
  const isFinished = idx >= questions.length;

  const handleSelect = useCallback((opt: string) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === question.correctRoot;
    if (correct) { setScore((s) => s + 1); markCorrect(question.verbId); }
    else { markWrong(question.verbId); }
    setShowResult(true);
    setTimeout(() => { setSelected(null); setShowResult(false); setIdx((i) => i + 1); }, 1500);
  }, [selected, question, markCorrect, markWrong]);

  if (isFinished) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="text-center w-full max-w-sm">
          <div className="text-6xl mb-4">{score >= 7 ? "🧩🎉" : "🧩💪"}</div>
          <h2 className="text-3xl font-black text-foreground mb-2">{score} из {questions.length}</h2>
          <p className="text-muted-foreground mb-8">{score >= 7 ? "Отличное знание корней!" : "Корни — основа иврита, продолжай!"}</p>
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
          <motion.div className="h-full bg-streak rounded-full" animate={{ width: `${(idx / questions.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
        <span className="text-sm font-bold text-muted-foreground">{idx + 1}/{questions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.25 }}>
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground font-medium mb-2">Найдите корень (שורש) глагола</p>
            <h2 className="font-hebrew text-4xl font-bold text-foreground mb-2">{question.verbHebrewInf}</h2>
            <p className="text-base text-muted-foreground">{question.verbTranslation}</p>
            <p className="text-sm text-muted-foreground/60 mt-0.5">{question.verbTranscription}</p>
            <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                💡 Корень — 3–4 буквы, которые несут основное значение слова. Они повторяются во всех формах глагола.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt, i) => {
              const isCorrect = opt === question.correctRoot;
              const isSelected = selected === opt;
              let cls = "bg-card border-2 border-border";
              if (showResult && isCorrect) cls = "bg-success/10 border-2 border-success";
              else if (showResult && isSelected && !isCorrect) cls = "bg-destructive/10 border-2 border-destructive";
              return (
                <motion.button key={i} whileTap={!selected ? { scale: 0.95 } : {}} onClick={() => handleSelect(opt)}
                  className={`rounded-2xl p-5 text-center transition-colors ${cls} ${selected ? "cursor-default" : ""}`}
                  animate={showResult && isSelected && !isCorrect ? { x: [0, -4, 4, -4, 4, 0] } : {}} transition={{ duration: 0.4 }}>
                  <span className="font-hebrew text-2xl font-bold text-foreground">{opt}</span>
                  {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-success mx-auto mt-1" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive mx-auto mt-1" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
