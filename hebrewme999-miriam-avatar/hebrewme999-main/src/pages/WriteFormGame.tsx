import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SEED_VERBS } from "@/data/verbs";
import { PERSON_LABELS, ConjugationForm } from "@/types/verb";
import { useLearning } from "@/hooks/useLearning";

interface Question {
  verbId: string;
  verbTranslation: string;
  verbTranscription: string;
  person: string;
  personLabel: string;
  tense: string;
  correctAnswer: ConjugationForm;
}

const TENSE_RU: Record<string, string> = {
  present: "настоящее",
  past: "прошедшее",
  future: "будущее",
};

function generateQuestions(count: number): Question[] {
  const verbsWithConj = SEED_VERBS.filter((v) => v.conjugations);
  const questions: Question[] = [];
  const tenses = ["present", "past", "future"] as const;
  const usedIds = new Set<string>();

  let attempts = 0;
  while (questions.length < count && attempts < count * 3) {
    attempts++;
    const verb = verbsWithConj[Math.floor(Math.random() * verbsWithConj.length)];
    if (usedIds.has(verb.id)) continue;
    usedIds.add(verb.id);

    const tense = tenses[Math.floor(Math.random() * tenses.length)];
    const forms = (verb.conjugations as any)[tense] as Record<string, ConjugationForm>;
    const persons = Object.keys(forms);
    const person = persons[Math.floor(Math.random() * persons.length)];
    const correct = forms[person];

    questions.push({
      verbId: verb.id,
      verbTranslation: verb.translation_ru,
      verbTranscription: verb.transcription_ru,
      person,
      personLabel: PERSON_LABELS[person] || person,
      tense,
      correctAnswer: correct,
    });
  }
  return questions;
}

export default function WriteFormGame() {
  const navigate = useNavigate();
  const { markCorrect, markWrong } = useLearning();
  const [allQuestions, setAllQuestions] = useState<Question[]>(() => generateQuestions(10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Очищаем таймер при анмаунте
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const question = allQuestions[currentIndex];
  const isFinished = currentIndex >= allQuestions.length;

  const handleSubmit = useCallback(() => {
    if (result || !input.trim()) return;
    const isCorrect = input.trim() === question.correctAnswer.hebrew;
    setResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setScore((s) => s + 1);
      markCorrect(question.verbId);
    } else {
      markWrong(question.verbId);
    }
    timerRef.current = setTimeout(() => {
      setResult(null);
      setInput("");
      setShowHint(false);
      setCurrentIndex((i) => i + 1);
    }, 2000);
  }, [result, input, question, markCorrect, markWrong]);

  const handleRestart = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAllQuestions(generateQuestions(10));
    setCurrentIndex(0);
    setScore(0);
    setInput("");
    setResult(null);
    setShowHint(false);
  }, []);

  if (!question && !isFinished) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Нет доступных вопросов</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="text-6xl mb-4">{score >= 7 ? "🎉" : score >= 4 ? "👍" : "💪"}</div>
          <h2 className="text-3xl font-black text-foreground mb-2">{score} из {allQuestions.length}</h2>
          <p className="text-muted-foreground mb-8">
            {score >= 7 ? "Отлично!" : score >= 4 ? "Хорошо!" : "Нужно повторить!"}
          </p>
          <div className="flex gap-3">
            <button onClick={() => navigate("/games")} className="px-6 py-3 bg-muted text-foreground rounded-xl font-bold">К играм</button>
            <button onClick={handleRestart} className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold">Ещё раз</button>
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
          <motion.div className="h-full bg-success rounded-full" animate={{ width: `${(currentIndex / allQuestions.length) * 100}%` }} />
        </div>
        <span className="text-sm font-bold text-muted-foreground">{currentIndex + 1}/{allQuestions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground font-medium mb-2">
              {TENSE_RU[question.tense]} время — {question.personLabel}
            </p>
            <h2 className="text-2xl font-black text-foreground mb-1">{question.verbTranslation}</h2>
            <p className="text-sm text-muted-foreground">{question.verbTranscription} — Напиши форму на иврите</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              dir="rtl"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              disabled={!!result}
              placeholder="הקלד כאן..."
              className={`w-full font-hebrew text-2xl text-center p-4 rounded-xl border-2 bg-card outline-none transition-colors ${
                result === "correct" ? "border-success bg-success/10" :
                result === "wrong" ? "border-destructive bg-destructive/10" :
                "border-border focus:border-primary"
              }`}
            />

            {result === "wrong" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                <p className="text-destructive font-medium">Правильный ответ:</p>
                <p className="font-hebrew text-2xl font-bold text-foreground">{question.correctAnswer.hebrew}</p>
                <p className="text-sm text-muted-foreground">{question.correctAnswer.transcription}</p>
              </motion.div>
            )}

            {result === "correct" && (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex justify-center">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </motion.div>
            )}

            {!result && (
              <>
                <button onClick={handleSubmit} disabled={!input.trim()} className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg disabled:opacity-50">
                  Проверить
                </button>
                <button onClick={() => setShowHint(true)} className="w-full py-3 text-muted-foreground text-sm">
                  {showHint ? (
                    <span className="font-hebrew text-lg text-primary">{question.correctAnswer.hebrew.slice(0, 2)}...</span>
                  ) : "Показать подсказку"}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
