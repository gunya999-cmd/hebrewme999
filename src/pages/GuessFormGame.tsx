import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UNIQUE_SEED_VERBS } from "@/data/verbs-unique";
import { PERSON_LABELS, ConjugationForm, VerbConjugations } from "@/types/verb";
import { useLearning } from "@/hooks/useLearning";


type TenseKey = "present" | "past" | "future";

function getTenseForms(conjugations: VerbConjugations, tense: TenseKey): Record<string, ConjugationForm> {
  return conjugations[tense] as unknown as Record<string, ConjugationForm>;
}

interface Question {
  verbId: string;
  verbHebrewInf: string;
  verbTranscription: string;
  verbTranslation: string;
  person: string;
  personLabel: string;
  tense: string;
  correctAnswer: ConjugationForm;
  options: ConjugationForm[];
}

// Fisher-Yates shuffle — честная случайность
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(count: number): Question[] {
  const verbsWithConj = UNIQUE_SEED_VERBS.filter((v) => v.conjugations);
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
    const forms = getTenseForms(verb.conjugations!, tense);
    const persons = Object.keys(forms);
    const person = persons[Math.floor(Math.random() * persons.length)];
    const correct = forms[person];

    const allForms: ConjugationForm[] = [];
    tenses.forEach((t) => {
      const tf = getTenseForms(verb.conjugations!, t);
      Object.values(tf).forEach((f) => {
        if (f.hebrew !== correct.hebrew) allForms.push(f);
      });
    });

    const wrong = shuffle(allForms).slice(0, 3);
    const options = shuffle([...wrong, correct]);

    questions.push({
      verbId: verb.id,
      verbHebrewInf: verb.infinitive_hebrew,
      verbTranscription: verb.transcription_ru,
      verbTranslation: verb.translation_ru,
      person,
      personLabel: PERSON_LABELS[person] || person,
      tense,
      correctAnswer: correct,
      options,
    });
  }
  return questions;
}

const TENSE_RU: Record<string, string> = {
  present: "настоящее",
  past: "прошедшее",
  future: "будущее",
};

export default function GuessFormGame() {
  const navigate = useNavigate();
  const { markCorrect, markWrong } = useLearning();
  // gameKey — при изменении генерируются новые вопросы
  const [allQuestions, setAllQuestions] = useState<Question[]>(() => generateQuestions(10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Очищаем таймер при анмаунте — предотвращает утечку памяти
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const question = allQuestions[currentIndex];
  const isFinished = currentIndex >= allQuestions.length;

  const handleSelect = useCallback(
    (option: ConjugationForm) => {
      if (selected) return;
      setSelected(option.hebrew);
      const isCorrect = option.hebrew === question.correctAnswer.hebrew;
      if (isCorrect) {
        setScore((s) => s + 1);
        markCorrect(question.verbId);
      } else {
        markWrong(question.verbId);
      }
      setShowResult(true);
      timerRef.current = setTimeout(() => {
        setSelected(null);
        setShowResult(false);
        setCurrentIndex((i) => i + 1);
      }, 1500);
    },
    [selected, question, markCorrect, markWrong]
  );

  const handleRestart = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAllQuestions(generateQuestions(10));
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
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
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">{score >= 7 ? "🎉" : score >= 4 ? "👍" : "💪"}</div>
          <h2 className="text-3xl font-black text-foreground mb-2">
            {score} из {allQuestions.length}
          </h2>
          <p className="text-muted-foreground mb-8">
            {score >= 7 ? "Отлично!" : score >= 4 ? "Хорошо, продолжай!" : "Давай повторим!"}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/games")}
              className="px-6 py-3 bg-muted text-foreground rounded-xl font-bold"
            >
              К играм
            </button>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold"
            >
              Ещё раз
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/games")} className="text-muted-foreground">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
          <motion.div
            className="h-full bg-success rounded-full"
            animate={{ width: `${(currentIndex / allQuestions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-sm font-bold text-muted-foreground">
          {currentIndex + 1}/{allQuestions.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.25 }}
        >
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground font-medium mb-2">
              {TENSE_RU[question.tense]} время — {question.personLabel}
            </p>
            <h2 className="font-hebrew text-3xl font-bold text-foreground mb-1">
              {question.verbHebrewInf}
            </h2>
            <p className="text-sm text-muted-foreground mb-1">{question.verbTranscription}</p>
            <p className="text-lg text-muted-foreground">{question.verbTranslation}</p>
          </div>

          <div className="space-y-3">
            {question.options.map((option, i) => {
              const isCorrect = option.hebrew === question.correctAnswer.hebrew;
              const isSelected = selected === option.hebrew;
              let bg = "bg-card border-border";
              if (showResult && isCorrect) bg = "bg-success/10 border-success";
              else if (showResult && isSelected && !isCorrect) bg = "bg-destructive/10 border-destructive";

              return (
                <motion.button
                  key={i}
                  whileTap={!selected ? { scale: 0.97 } : {}}
                  onClick={() => handleSelect(option)}
                  aria-label={`Вариант: ${option.hebrew} — ${option.transcription}`}
                  className={`w-full rounded-xl p-4 border-2 text-left transition-colors ${bg} ${
                    selected ? "cursor-default" : "active:scale-[0.98]"
                  }`}
                  animate={showResult && isSelected && !isCorrect ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-hebrew text-xl font-bold text-foreground">{option.hebrew}</span>
                      <p className="text-sm text-muted-foreground mt-0.5">{option.transcription}</p>
                    </div>
                    {showResult && isCorrect && <CheckCircle2 className="w-6 h-6 text-success" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-destructive" />}
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
