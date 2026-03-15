import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Delete } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SEED_VERBS } from "@/data/verbs";
import { PERSON_LABELS, ConjugationForm } from "@/types/verb";
import { useLearning } from "@/hooks/useLearning";

const HEBREW_KEYBOARD = [
  ["ק", "ר", "א", "ט", "ו", "ן", "ם", "פ"],
  ["ש", "ד", "ג", "כ", "ע", "י", "ח", "ל"],
  ["ז", "ס", "ב", "ה", "נ", "מ", "צ", "ת", "ץ"],
];

const TENSE_RU: Record<string, string> = { present: "настоящее", past: "прошедшее", future: "будущее" };

interface Question {
  verbId: string;
  verbHebrewInf: string;
  verbTranslation: string;
  person: string;
  personLabel: string;
  tense: string;
  correctAnswer: ConjugationForm;
}

function generateQuestions(count: number): Question[] {
  const verbsWithConj = SEED_VERBS.filter((v) => v.conjugations);
  if (verbsWithConj.length === 0) return [];
  const tenses = ["present", "past", "future"] as const;
  return Array.from({ length: count }, () => {
    const verb = verbsWithConj[Math.floor(Math.random() * verbsWithConj.length)];
    const tense = tenses[Math.floor(Math.random() * tenses.length)];
    const forms = (verb.conjugations as any)[tense] as Record<string, ConjugationForm>;
    const persons = Object.keys(forms);
    const person = persons[Math.floor(Math.random() * persons.length)];
    return {
      verbId: verb.id,
      verbHebrewInf: verb.infinitive_hebrew,
      verbTranslation: verb.translation_ru,
      person,
      personLabel: PERSON_LABELS[person] || person,
      tense,
      correctAnswer: forms[person],
    };
  });
}

export default function WriteFormGame() {
  const navigate = useNavigate();
  const { markCorrect, markWrong } = useLearning();
  const [questions] = useState(() => generateQuestions(10));
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const question = questions[idx];
  const isFinished = idx >= questions.length || questions.length === 0;

  const handleKey = (letter: string) => {
    if (submitted) return;
    setInput((prev) => prev + letter);
  };

  const handleBackspace = () => {
    if (submitted) return;
    setInput((prev) => prev.slice(0, -1));
  };

  const handleSubmit = useCallback(() => {
    if (submitted || !input.trim()) return;
    setSubmitted(true);
    const isCorrect = input.trim() === question.correctAnswer.hebrew;
    if (isCorrect) { setScore((s) => s + 1); markCorrect(question.verbId); }
    else { markWrong(question.verbId); }
    setTimeout(() => { setInput(""); setSubmitted(false); setIdx((i) => i + 1); }, 2500);
  }, [submitted, input, question, markCorrect, markWrong]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-xl font-black text-foreground mb-2">Нет глаголов</h2>
        <button onClick={() => navigate("/games")} className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold">К играм</button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="text-center w-full max-w-sm">
          <div className="text-6xl mb-4">{score >= 7 ? "⌨️🎉" : "⌨️💪"}</div>
          <h2 className="text-3xl font-black text-foreground mb-2">{score} из {questions.length}</h2>
          <p className="text-muted-foreground mb-8">{score >= 7 ? "Отлично пишешь на иврите!" : "Практика делает мастера!"}</p>
          <div className="flex gap-3">
            <button onClick={() => navigate("/games")} className="flex-1 py-3 bg-muted text-foreground rounded-xl font-bold">К играм</button>
            <button onClick={() => { setIdx(0); setScore(0); }} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold">Ещё раз</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const isCorrect = submitted && input.trim() === question.correctAnswer.hebrew;
  const isWrong = submitted && input.trim() !== question.correctAnswer.hebrew;

  return (
    <div className="min-h-screen bg-background pb-4 px-4 pt-8 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/games")} className="text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
        <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
          <motion.div className="h-full bg-success rounded-full" animate={{ width: `${(idx / questions.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>
        <span className="text-sm font-bold text-muted-foreground">{idx + 1}/{questions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground font-medium mb-2">
              {TENSE_RU[question.tense]} время — <span className="text-primary font-bold">{question.personLabel}</span>
            </p>
            <h2 className="font-hebrew text-3xl font-bold text-foreground mb-1">{question.verbHebrewInf}</h2>
            <p className="text-lg text-muted-foreground">{question.verbTranslation}</p>
            <p className="text-sm text-muted-foreground/70 mt-1">{question.correctAnswer.translation}</p>
          </div>

          {/* Input display */}
          <div className={`mx-auto w-full max-w-xs rounded-2xl border-2 p-4 text-center mb-4 min-h-[60px] flex items-center justify-center transition-colors ${
            isCorrect ? "border-success bg-success/10" : isWrong ? "border-destructive bg-destructive/10" : "border-border bg-card"
          }`}>
            <span className="font-hebrew text-2xl font-bold text-foreground" dir="rtl">
              {input || <span className="text-muted-foreground/40">הקלד כאן</span>}
            </span>
            {isCorrect && <CheckCircle2 className="w-6 h-6 text-success ml-2" />}
            {isWrong && <XCircle className="w-6 h-6 text-destructive ml-2" />}
          </div>

          {isWrong && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-4">
              <p className="text-sm text-muted-foreground">Правильный ответ:</p>
              <p className="font-hebrew text-xl font-bold text-success">{question.correctAnswer.hebrew}</p>
              <p className="text-sm text-muted-foreground">{question.correctAnswer.transcription}</p>
            </motion.div>
          )}

          <div className="mt-auto">
            {/* Hebrew keyboard */}
            <div className="space-y-1.5 mb-3">
              {HEBREW_KEYBOARD.map((row, ri) => (
                <div key={ri} className="flex justify-center gap-1">
                  {row.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => handleKey(letter)}
                      disabled={submitted}
                      className="w-9 h-11 bg-card border border-border rounded-lg font-hebrew text-lg font-bold text-foreground active:bg-primary/20 active:scale-95 transition-all disabled:opacity-40"
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={handleBackspace} disabled={submitted}
                className="flex-1 py-3 bg-muted rounded-xl flex items-center justify-center gap-1 text-muted-foreground font-bold disabled:opacity-40">
                <Delete className="w-5 h-5" /> מחק
              </button>
              <button onClick={handleSubmit} disabled={submitted || !input.trim()}
                className="flex-[2] py-3 bg-primary text-primary-foreground rounded-xl font-bold disabled:opacity-40">
                בדוק ✓
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
