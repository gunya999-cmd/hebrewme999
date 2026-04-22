import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SEED_VERBS } from "@/data/verbs";
import { Binyan, BINYAN_NAMES } from "@/types/verb";
import { useLearning } from "@/hooks/useLearning";

interface Question {
  verbId: string;
  verbHebrew: string;
  verbTranscription: string;
  verbTranslation: string;
  correctBinyan: Binyan;
  options: Binyan[];
}

const ALL_BINYANS: Binyan[] = ["פעל", "נפעל", "פיעל", "הפעיל", "התפעל"];

function generateQuestions(count: number): Question[] {
  const verbs = [...SEED_VERBS].sort(() => Math.random() - 0.5);
  const questions: Question[] = [];

  for (let i = 0; i < Math.min(count, verbs.length); i++) {
    const verb = verbs[i];
    const wrongBinyans = ALL_BINYANS.filter((b) => b !== verb.binyan)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [...wrongBinyans, verb.binyan].sort(() => Math.random() - 0.5);

    questions.push({
      verbId: verb.id,
      verbHebrew: verb.infinitive_hebrew,
      verbTranscription: verb.transcription_ru,
      verbTranslation: verb.translation_ru,
      correctBinyan: verb.binyan,
      options,
    });
  }
  return questions;
}

export default function GuessBinyanGame() {
  const navigate = useNavigate();
  const { markCorrect, markWrong } = useLearning();
  const [questions] = useState(() => generateQuestions(10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<Binyan | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;

  const handleSelect = useCallback((binyan: Binyan) => {
    if (selected) return;
    setSelected(binyan);
    const isCorrect = binyan === question.correctBinyan;
    if (isCorrect) { setScore((s) => s + 1); markCorrect(question.verbId); }
    else { markWrong(question.verbId); }
    setShowResult(true);
    setTimeout(() => { setSelected(null); setShowResult(false); setCurrentIndex((i) => i + 1); }, 1500);
  }, [selected, question, markCorrect, markWrong]);

  if (isFinished) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="text-6xl mb-4">{score >= 7 ? "🎉" : score >= 4 ? "👍" : "💪"}</div>
          <h2 className="text-3xl font-black text-foreground mb-2">{score} из {questions.length}</h2>
          <p className="text-muted-foreground mb-8">{score >= 7 ? "Отлично!" : score >= 4 ? "Хорошо!" : "Повтори!"}</p>
          <div className="flex gap-3">
            <button onClick={() => navigate("/games")} className="px-6 py-3 bg-muted text-foreground rounded-xl font-bold">К играм</button>
            <button onClick={() => { setCurrentIndex(0); setScore(0); }} className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold">Ещё раз</button>
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
          <motion.div className="h-full bg-success rounded-full" animate={{ width: `${(currentIndex / questions.length) * 100}%` }} />
        </div>
        <span className="text-sm font-bold text-muted-foreground">{currentIndex + 1}/{questions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground font-medium mb-3">К какому биньяну относится глагол?</p>
            <h2 className="font-hebrew text-4xl font-bold text-foreground mb-2" dir="rtl">{question.verbHebrew}</h2>
            <p className="text-muted-foreground">{question.verbTranscription} — {question.verbTranslation}</p>
          </div>

          <div className="space-y-3">
            {question.options.map((binyan, i) => {
              const isCorrect = binyan === question.correctBinyan;
              const isSelected = selected === binyan;
              let bg = "bg-card border-border";
              if (showResult && isCorrect) bg = "bg-success/10 border-success";
              else if (showResult && isSelected && !isCorrect) bg = "bg-destructive/10 border-destructive";

              return (
                <motion.button
                  key={i}
                  whileTap={!selected ? { scale: 0.97 } : {}}
                  onClick={() => handleSelect(binyan)}
                  className={`w-full rounded-xl p-4 border-2 transition-colors ${bg} flex items-center justify-between`}
                  animate={showResult && isSelected && !isCorrect ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-hebrew text-xl font-bold text-foreground" dir="rtl">{binyan}</span>
                    <span className="text-sm text-muted-foreground">({BINYAN_NAMES[binyan]})</span>
                  </div>
                  {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-success" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-destructive" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}