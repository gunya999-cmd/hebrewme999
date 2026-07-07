import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, RotateCcw, XCircle, Volume2 } from "lucide-react";
import { DICTIONARY_VERBS } from "@/data/dictionary-verbs";
import { Binyan, BINYAN_NAMES, ConjugationForm, PERSON_LABELS, TENSE_LABELS, Verb } from "@/types/verb";
import { useLearning } from "@/hooks/useLearning";
import { playVerbAudio, speakHebrewWithBrowser } from "@/lib/verb-audio";

export type SmartTrainerMode = "form-choice" | "form-build" | "root-find" | "binyan-choice";

type TenseId = "present" | "past" | "future" | "imperative";
type ConjRecord = Partial<Record<TenseId, Record<string, ConjugationForm>>>;
type Tile = { id: string; value: string };

interface FormRecord {
  verb: Verb;
  hebrew: string;
  transcription: string;
  translation: string;
  tense: TenseId;
  person: string;
  grammar: string;
}

interface TrainerQuestion {
  id: string;
  mode: SmartTrainerMode;
  verb: Verb;
  title: string;
  task: string;
  correctText: string;
  correctLabel: string;
  grammar: string;
  explanation: string;
  options?: Array<{ value: string; label: string; subLabel?: string }>;
}

interface FeedbackState {
  status: "correct" | "wrong";
  selected?: string;
}

const SESSION_SIZE = 10;
const TENSES: TenseId[] = ["present", "past", "future", "imperative"];
const ALL_BINYANS: Binyan[] = ["פעל", "נפעל", "פיעל", "הפעיל", "התפעל", "פועל", "הופעל"];

const MODE_COPY: Record<SmartTrainerMode, { title: string; kicker: string; desc: string }> = {
  "form-choice": {
    title: "Тренажёр формы",
    kicker: "выбери и объясни",
    desc: "Форма не просто проверяется: после ошибки нужно исправить ответ, а карточка вернётся позже.",
  },
  "form-build": {
    title: "Собери форму",
    kicker: "буквы вместо угадайки",
    desc: "Сначала собираем форму из букв. Ручной ввод можно добавлять как следующий уровень сложности.",
  },
  "root-find": {
    title: "Найди корень",
    kicker: "вытащи 3 буквы",
    desc: "Нажимай корневые буквы прямо внутри инфинитива, а не угадывай случайный вариант.",
  },
  "binyan-choice": {
    title: "Узнай модель",
    kicker: "7 беньянов",
    desc: "Определи модель глагола и сразу смотри подсказку по шаблону.",
  },
};

const BINYAN_EXPLANATIONS: Record<Binyan, string> = {
  "פעל": "Пааль — базовое активное действие. Часто это самый простой глагольный шаблон.",
  "נפעל": "Нифаль часто показывает пассивность, вход в состояние или возвратность.",
  "פיעל": "Пиэль часто усиливает действие или делает его более активным и направленным.",
  "הפעיל": "Хифиль часто означает заставить, включить, объяснить, привести к действию.",
  "התפעל": "Хитпаэль часто показывает возвратное действие: одеваться, встречаться, волноваться.",
  "פועל": "Пуаль — пассивная пара к Пиэль. Действие совершается над объектом.",
  "הופעל": "Хуфаль — пассивная пара к Хифиль. Кто-то был приведён к действию или состоянию.",
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function stripHebrewMarks(text: string): string {
  return text.replace(/[\u0591-\u05C7]/g, "").replace(/\s+/g, "").trim();
}

function normalizeAnswer(text: string): string {
  return stripHebrewMarks(text).replace(/[־\-–—]/g, "");
}

function getTenseForms(verb: Verb, tense: TenseId): Record<string, ConjugationForm> | undefined {
  const conjugations = verb.conjugations as unknown as ConjRecord | undefined;
  return conjugations?.[tense];
}

function getAllForms(verb: Verb): FormRecord[] {
  if (!verb.conjugations) return [];

  return TENSES.flatMap((tense) => {
    const forms = getTenseForms(verb, tense);
    if (!forms) return [];

    return Object.entries(forms)
      .filter(([, form]) => form?.hebrew && form.hebrew !== "—")
      .map(([person, form]) => ({
        verb,
        hebrew: form.hebrew,
        transcription: form.transcription,
        translation: form.translation,
        tense,
        person,
        grammar: `${TENSE_LABELS[tense] || tense} · ${PERSON_LABELS[person] || person}`,
      }));
  });
}

function getFormsPool(): FormRecord[] {
  return DICTIONARY_VERBS.flatMap((verb) => getAllForms(verb));
}

function tenseHint(form: FormRecord): string {
  if (form.tense === "past") {
    const ending: Record<string, string> = {
      ani: "־תי",
      ata: "־תָ",
      at: "־תְּ",
      hi: "־ה",
      anachnu: "־נו",
      atem: "־תם",
      aten: "־תן",
      hem: "־ו",
      hen: "־ו",
    };
    return ending[form.person] ? `В прошедшем времени часто смотри на окончание ${ending[form.person]}.` : "В прошедшем времени форма показывает лицо через окончание.";
  }

  if (form.tense === "future") {
    const prefix: Record<string, string> = {
      ani: "א",
      ata: "ת",
      at: "ת",
      hu: "י",
      hi: "ת",
      anachnu: "נ",
      atem: "ת",
      aten: "ת",
      hem: "י",
      hen: "י",
    };
    return prefix[form.person] ? `В будущем времени часто смотри на начальную букву ${prefix[form.person]}.` : "В будущем времени лицо часто видно по приставке.";
  }

  if (form.tense === "present") {
    return "В настоящем времени форма обычно меняется по роду и числу: муж./жен., ед./мн.";
  }

  return "В повелительном наклонении форма зависит от адресата: кому ты даёшь команду.";
}

function explainForm(form: FormRecord): string {
  return `${form.grammar}. Инфинитив: ${form.verb.infinitive_hebrew} — ${form.verb.translation_ru}. ${tenseHint(form)}`;
}

function makeFormQuestion(mode: SmartTrainerMode, form: FormRecord, allForms: FormRecord[]): TrainerQuestion {
  const sameVerbWrong = getAllForms(form.verb).filter((item) => normalizeAnswer(item.hebrew) !== normalizeAnswer(form.hebrew));
  const samePersonOtherTense = sameVerbWrong.filter((item) => item.person === form.person || item.tense === form.tense);
  const randomWrong = allForms.filter((item) => normalizeAnswer(item.hebrew) !== normalizeAnswer(form.hebrew));

  const wrong = [...samePersonOtherTense, ...sameVerbWrong, ...shuffle(randomWrong)]
    .filter((item, index, arr) => arr.findIndex((candidate) => normalizeAnswer(candidate.hebrew) === normalizeAnswer(item.hebrew)) === index)
    .slice(0, 3);

  return {
    id: `${mode}-${form.verb.id}-${form.tense}-${form.person}-${Math.random().toString(16).slice(2)}`,
    mode,
    verb: form.verb,
    title: form.verb.infinitive_hebrew,
    task: mode === "form-build" ? "Собери правильную форму из букв" : "Выбери правильную форму",
    correctText: form.hebrew,
    correctLabel: form.transcription,
    grammar: form.grammar,
    explanation: explainForm(form),
    options: mode === "form-choice"
      ? shuffle([form, ...wrong]).map((item) => ({
          value: item.hebrew,
          label: item.hebrew,
          subLabel: `${item.transcription} · ${item.grammar}`,
        }))
      : undefined,
  };
}

function rootCanBeFound(verb: Verb): boolean {
  const word = normalizeAnswer(verb.infinitive_hebrew);
  const root = normalizeAnswer(verb.root);
  if (root.length < 2 || root.length > 4) return false;

  let cursor = 0;
  for (const letter of Array.from(root)) {
    const next = word.indexOf(letter, cursor);
    if (next === -1) return false;
    cursor = next + 1;
  }
  return true;
}

function makeRootQuestion(verb: Verb): TrainerQuestion {
  return {
    id: `root-${verb.id}-${Math.random().toString(16).slice(2)}`,
    mode: "root-find",
    verb,
    title: verb.infinitive_hebrew,
    task: "Нажми корневые буквы в правильном порядке",
    correctText: normalizeAnswer(verb.root),
    correctLabel: verb.root,
    grammar: `Беньян: ${verb.binyan} · ${BINYAN_NAMES[verb.binyan]}`,
    explanation: `Корень: ${verb.root}. Сначала убираем служебные части инфинитива, потом ищем основные буквы действия.`,
  };
}

function makeBinyanQuestion(verb: Verb): TrainerQuestion {
  return {
    id: `binyan-${verb.id}-${Math.random().toString(16).slice(2)}`,
    mode: "binyan-choice",
    verb,
    title: verb.infinitive_hebrew,
    task: "Выбери беньян глагола",
    correctText: verb.binyan,
    correctLabel: BINYAN_NAMES[verb.binyan],
    grammar: `Корень: ${verb.root}`,
    explanation: BINYAN_EXPLANATIONS[verb.binyan],
    options: shuffle(ALL_BINYANS).map((binyan) => ({
      value: binyan,
      label: binyan,
      subLabel: BINYAN_NAMES[binyan],
    })),
  };
}

function generateQuestions(mode: SmartTrainerMode, count = SESSION_SIZE): TrainerQuestion[] {
  if (mode === "form-choice" || mode === "form-build") {
    const allForms = getFormsPool();
    return shuffle(allForms)
      .slice(0, count)
      .map((form) => makeFormQuestion(mode, form, allForms));
  }

  if (mode === "root-find") {
    return shuffle(DICTIONARY_VERBS.filter((verb) => verb.root && rootCanBeFound(verb)))
      .slice(0, count)
      .map(makeRootQuestion);
  }

  return shuffle(DICTIONARY_VERBS.filter((verb) => ALL_BINYANS.includes(verb.binyan)))
    .slice(0, count)
    .map(makeBinyanQuestion);
}

function makeTiles(text: string, addNoise = false): Tile[] {
  const letters = Array.from(normalizeAnswer(text));
  const noise = addNoise ? shuffle(["א", "ה", "ו", "י", "מ", "ת"]).slice(0, 2) : [];
  return shuffle([...letters, ...noise].map((value, index) => ({
    id: `${value}-${index}-${Math.random().toString(16).slice(2)}`,
    value,
  })));
}

function speak(text: string) {
  speakHebrewWithBrowser(text);
}

export default function SmartHebrewTrainer({ mode }: { mode: SmartTrainerMode }) {
  const navigate = useNavigate();
  const { markCorrect, markWrong } = useLearning();
  const copy = MODE_COPY[mode];
  const [questions, setQuestions] = useState<TrainerQuestion[]>(() => generateQuestions(mode));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);
  const [letterBank, setLetterBank] = useState<Tile[]>([]);
  const [rootIndexes, setRootIndexes] = useState<number[]>([]);

  const question = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;
  const progress = questions.length ? Math.round((currentIndex / questions.length) * 100) : 0;

  useEffect(() => {
    if (!question) return;
    setFeedback(null);
    setSelectedOption(null);
    setSelectedTiles([]);
    setRootIndexes([]);
    if (question.mode === "form-build") setLetterBank(makeTiles(question.correctText));
    else setLetterBank([]);
  }, [question?.id]);

  const addRetry = useCallback((wrongQuestion: TrainerQuestion) => {
    setQuestions((current) => {
      const copyQuestions = [...current];
      const retry: TrainerQuestion = { ...wrongQuestion, id: `${wrongQuestion.id}-retry-${Date.now()}` };
      copyQuestions.splice(Math.min(currentIndex + 3, copyQuestions.length), 0, retry);
      return copyQuestions;
    });
  }, [currentIndex]);

  const acceptCorrect = useCallback((q: TrainerQuestion, countScore = true) => {
    setFeedback({ status: "correct" });
    if (countScore) {
      setScore((current) => current + 1);
      setAttempts((current) => current + 1);
      markCorrect(q.verb.id);
    }
  }, [markCorrect]);

  const acceptWrong = useCallback((q: TrainerQuestion, selected?: string) => {
    setFeedback({ status: "wrong", selected });
    setAttempts((current) => current + 1);
    markWrong(q.verb.id);
    addRetry(q);
  }, [addRetry, markWrong]);

  const chooseOption = useCallback((value: string) => {
    if (!question || feedback?.status === "correct") return;

    const isCorrect = normalizeAnswer(value) === normalizeAnswer(question.correctText);
    setSelectedOption(value);

    if (feedback?.status === "wrong") {
      if (isCorrect) acceptCorrect(question, false);
      return;
    }

    if (isCorrect) acceptCorrect(question, true);
    else acceptWrong(question, value);
  }, [acceptCorrect, acceptWrong, feedback?.status, question]);

  const submitBuilt = useCallback((tiles: Tile[]) => {
    if (!question || feedback?.status === "correct") return;
    const answer = tiles.map((tile) => tile.value).join("");
    if (normalizeAnswer(answer) === normalizeAnswer(question.correctText)) acceptCorrect(question, feedback?.status !== "wrong");
    else acceptWrong(question, answer);
  }, [acceptCorrect, acceptWrong, feedback?.status, question]);

  const chooseTile = useCallback((tile: Tile) => {
    if (!question || feedback?.status === "correct") return;
    const next = [...selectedTiles, tile];
    setSelectedTiles(next);
    setLetterBank((current) => current.filter((item) => item.id !== tile.id));
    if (next.length === Array.from(normalizeAnswer(question.correctText)).length) {
      window.setTimeout(() => submitBuilt(next), 120);
    }
  }, [feedback?.status, question, selectedTiles, submitBuilt]);

  const resetBuild = useCallback(() => {
    if (!question) return;
    setFeedback(null);
    setSelectedTiles([]);
    setLetterBank(makeTiles(question.correctText));
  }, [question]);

  const chooseRootIndex = useCallback((index: number) => {
    if (!question || feedback?.status === "correct" || rootIndexes.includes(index)) return;
    const next = [...rootIndexes, index];
    setRootIndexes(next);
    const targetLength = Array.from(normalizeAnswer(question.correctText)).length;
    if (next.length === targetLength) {
      const wordLetters = Array.from(normalizeAnswer(question.verb.infinitive_hebrew));
      const answer = next.map((item) => wordLetters[item]).join("");
      if (normalizeAnswer(answer) === normalizeAnswer(question.correctText)) acceptCorrect(question, feedback?.status !== "wrong");
      else acceptWrong(question, answer);
    }
  }, [acceptCorrect, acceptWrong, feedback?.status, question, rootIndexes]);

  const resetRoot = useCallback(() => {
    setFeedback(null);
    setRootIndexes([]);
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentIndex((index) => index + 1);
  }, []);

  const restart = useCallback(() => {
    setQuestions(generateQuestions(mode));
    setCurrentIndex(0);
    setScore(0);
    setAttempts(0);
    setFeedback(null);
    setSelectedOption(null);
    setSelectedTiles([]);
    setLetterBank([]);
    setRootIndexes([]);
  }, [mode]);

  const rootLetters = useMemo(() => question ? Array.from(normalizeAnswer(question.verb.infinitive_hebrew)) : [], [question]);

  if (!question && !isFinished) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="glass-card rounded-[2rem] p-8 text-center">
          <p className="font-bold text-muted-foreground">Нет доступных вопросов</p>
          <button onClick={() => navigate("/games")} className="mt-4 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">К играм</button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const percent = attempts > 0 ? Math.round((score / attempts) * 100) : 0;
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,_rgba(124,58,237,0.22),_transparent_32%),hsl(var(--background))] flex flex-col items-center justify-center px-6 pb-24">
        <motion.div initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card w-full max-w-sm rounded-[2rem] p-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-slate-950 text-cyan-200">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-black text-foreground">Тренировка завершена</h2>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">{score} правильных из {attempts} первых попыток · {percent}%</p>
          <p className="mt-2 text-xs text-muted-foreground">Ошибки автоматически возвращались внутри сессии.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => navigate("/games")} className="flex-1 rounded-xl bg-muted py-3 font-bold text-foreground">К играм</button>
            <button onClick={restart} className="flex-1 rounded-xl bg-primary py-3 font-bold text-primary-foreground">Ещё раз</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_18%_0%,_rgba(124,58,237,0.24),_transparent_30%),radial-gradient(circle_at_90%_12%,_rgba(34,211,238,0.18),_transparent_28%),linear-gradient(180deg,_#080b24_0%,_#111433_28%,_hsl(var(--background))_28%,_hsl(var(--background))_100%)] pb-28 px-5 pt-8">
      <div className="mb-5 flex items-center gap-3 text-white">
        <button onClick={() => navigate("/games")} className="rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-xl">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-cyan-200/80">{copy.kicker}</p>
          <h1 className="truncate text-2xl font-black tracking-tight">{copy.title}</h1>
        </div>
        <button onClick={restart} className="rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-xl">
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs font-black text-white/70">
          <span>{currentIndex + 1} / {questions.length}</span>
          <span>{score} правильно</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/18">
          <motion.div className="h-full rounded-full bg-cyan-300" animate={{ width: `${progress}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={question.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
          <section className="relative overflow-hidden rounded-[2.2rem] neon-panel p-5 text-white">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />
            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100/75">{question.task}</p>
              <h2 dir="rtl" className="mt-3 font-hebrew text-5xl font-black hebrew-glow">{question.title}</h2>
              <p className="mt-2 text-lg font-black">{question.verb.translation_ru}</p>
              <p className="mt-1 text-sm font-semibold text-white/70">{question.grammar}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{copy.desc}</p>
              <button onClick={() => void playVerbAudio(question.verb)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-black text-white backdrop-blur-xl">
                <Volume2 className="h-4 w-4" /> Слушать инфинитив
              </button>
            </div>
          </section>

          {question.mode === "form-choice" || question.mode === "binyan-choice" ? (
            <div className="mt-5 space-y-3">
              {question.options?.map((option) => {
                const correct = normalizeAnswer(option.value) === normalizeAnswer(question.correctText);
                const selected = normalizeAnswer(selectedOption || "") === normalizeAnswer(option.value);
                const lockedWrong = feedback?.status === "wrong" && !correct;
                const state = feedback?.status === "correct" && correct
                  ? "border-success bg-success/15 text-success"
                  : feedback?.status === "wrong" && selected && !correct
                    ? "border-destructive bg-destructive/15 text-destructive"
                    : "border-white/75 bg-white/88 text-foreground";

                return (
                  <button
                    key={option.value}
                    onClick={() => chooseOption(option.value)}
                    disabled={feedback?.status === "correct" || lockedWrong}
                    className={`w-full rounded-2xl border-2 p-4 text-left shadow-xl backdrop-blur-xl transition-colors disabled:opacity-60 ${state}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p dir="rtl" className="font-hebrew text-2xl font-black">{option.label}</p>
                        {option.subLabel && <p className="mt-1 text-xs font-bold opacity-70">{option.subLabel}</p>}
                      </div>
                      {feedback?.status === "correct" && correct && <CheckCircle2 className="h-6 w-6" />}
                      {feedback?.status === "wrong" && selected && !correct && <XCircle className="h-6 w-6" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}

          {question.mode === "form-build" ? (
            <div className="mt-5">
              <div dir="rtl" className="mb-4 flex min-h-[76px] items-center justify-center gap-2 rounded-[2rem] border-2 border-dashed border-primary/35 bg-white/72 p-3 shadow-inner">
                {selectedTiles.length === 0 ? <span className="text-sm font-bold text-muted-foreground">нажми буквы снизу</span> : selectedTiles.map((tile) => (
                  <button key={tile.id} className="h-12 min-w-12 rounded-2xl bg-slate-950 px-3 font-hebrew text-2xl font-black text-cyan-200">{tile.value}</button>
                ))}
              </div>
              <div dir="rtl" className="grid grid-cols-5 gap-2">
                {letterBank.map((tile) => (
                  <button key={tile.id} onClick={() => chooseTile(tile)} disabled={feedback?.status === "correct"} className="h-14 rounded-2xl border border-white/75 bg-white/90 font-hebrew text-2xl font-black text-foreground shadow-lg disabled:opacity-50">{tile.value}</button>
                ))}
              </div>
            </div>
          ) : null}

          {question.mode === "root-find" ? (
            <div className="mt-5">
              <div dir="rtl" className="flex flex-wrap justify-center gap-2 rounded-[2rem] bg-white/75 p-4 shadow-inner backdrop-blur-xl">
                {rootLetters.map((letter, index) => {
                  const active = rootIndexes.includes(index);
                  return (
                    <button key={`${letter}-${index}`} onClick={() => chooseRootIndex(index)} disabled={feedback?.status === "correct" || active} className={`h-14 min-w-12 rounded-2xl border-2 px-3 font-hebrew text-2xl font-black transition-colors ${active ? "border-cyan-300 bg-slate-950 text-cyan-200" : "border-white bg-white text-foreground"}`}>
                      {letter}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-center text-xs font-bold text-muted-foreground">Выбрано: {rootIndexes.length} / {Array.from(normalizeAnswer(question.correctText)).length}</p>
            </div>
          ) : null}

          {feedback && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`mt-5 rounded-[2rem] p-5 ${feedback.status === "correct" ? "bg-success/12 border border-success/30" : "bg-destructive/10 border border-destructive/25"}`}>
              <div className="flex items-center gap-2">
                {feedback.status === "correct" ? <CheckCircle2 className="h-6 w-6 text-success" /> : <XCircle className="h-6 w-6 text-destructive" />}
                <p className="font-black text-foreground">{feedback.status === "correct" ? "Правильно" : "Нужно исправить"}</p>
              </div>
              <p dir="rtl" className="mt-3 font-hebrew text-3xl font-black text-foreground">{question.correctText}</p>
              <p className="mt-1 text-sm font-bold text-muted-foreground">{question.correctLabel}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{question.explanation}</p>
              {feedback.status === "wrong" && (question.mode === "form-choice" || question.mode === "binyan-choice") && (
                <p className="mt-2 text-sm font-black text-destructive">Теперь нажми правильный вариант. Карточка вернётся через несколько вопросов.</p>
              )}
              {feedback.status === "wrong" && question.mode === "form-build" && (
                <button onClick={resetBuild} className="mt-4 w-full rounded-xl bg-destructive/10 py-3 font-black text-destructive">Собрать заново</button>
              )}
              {feedback.status === "wrong" && question.mode === "root-find" && (
                <button onClick={resetRoot} className="mt-4 w-full rounded-xl bg-destructive/10 py-3 font-black text-destructive">Выбрать корень заново</button>
              )}
              {feedback.status === "correct" && (
                <button onClick={nextQuestion} className="mt-4 w-full rounded-xl bg-primary py-3 font-black text-primary-foreground">Следующий вопрос</button>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
