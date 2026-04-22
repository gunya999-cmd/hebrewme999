import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SEED_VERBS } from "@/data/verbs";
import { useLearning } from "@/hooks/useLearning";

interface Question {
  verbId: string;
  verbHebrew: string;
  verbTranscription: string;
  verbTranslation: string;
  correctRoot: string;
  options: string[];
}

function generateQuestions(count: number): Question[] {
  const verbs = SEED_VERBS.filter((v) => v.root);
  const questions: Question[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < count && usedIds.size < verbs.length; i++) {
    let verb;
    do {
      verb = verbs[Math.floor(Math.random() * verbs.length)];
    } while (usedIds.has(verb.id) && usedIds.size < verbs.length);
    usedIds.add(verb.id);

    const otherRoots = verbs
      .filter((v) => v.root !== verb.root)
      .map((v) => v.root)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const uniqueRoots = [...new Set(otherRoots)].slice(0, 3);
    while (uniqueRoots.length < 3) {
      const fallback = verbs[Math.floor(Math.random() * verbs.length)];
      if (fallback.root !== verb.root && !uniqueRoots.includes(fallback.root)) {
        uniqueRoots.push(fallback.root);
      }
    }

    const options = [...uniqueRoots, verb.root].sort(() => Math.random() - 0.5);

    questions.push({
      verbId: verb.id,
      verbHebrew: verb.infinitive_hebrew,
      verbTranscription: verb.transcription_ru,
      verbTranslation: verb.translation_ru,
      correctRoot: verb.root,
      options,
    });
  }
  return questions;
}

export default function GuessRootGame() {
  const navigate = useNavigate();
  const { markCorrect, markWrong } = useLearning();
  const [questions] = useState(() => generateQuestions(10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;

  const handleSelect = useCallback((root: string) => {
    if (selected) return;
    setSelected(root);
    const isCorrect = root === question.correctRoot;
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
            <p className="text-sm text-muted-foreground font-medium mb-3">Какой корень у этого глагола?</p>
            <h2 className="font-hebrew text-4xl font-bold text-foreground mb-2" dir="rtl">{question.verbHebrew}</h2>
            <p className="text-muted-foreground">{question.verbTranscription} — {question.verbTranslation}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {question.options.map((root, i) => {
              const isCorrect = root === question.correctRoot;
              const isSelected = selected === root;
              let bg = "bg-card border-border";
              if (showResult && isCorrect) bg = "bg-success/10 border-success";
              else if (showResult && isSelected && !isCorrect) bg = "bg-destructive/10 border-destructive";

              return (
                <motion.button
                  key={i}
                  whileTap={!selected ? { scale: 0.95 } : {}}
                  onClick={() => handleSelect(root)}
                  className={`rounded-xl p-5 border-2 text-center transition-colors ${bg}`}
                  animate={showResult && isSelected && !isCorrect ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                >
                  <span className="font-hebrew text-2xl font-bold text-foreground" dir="rtl">{root}</span>
                  {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-success mx-auto mt-2" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive mx-auto mt-2" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}