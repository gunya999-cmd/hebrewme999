import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, RotateCcw, Sparkles, Timer, Trophy, Volume2, XCircle } from "lucide-react";
import VerbDropArtwork from "@/components/VerbDropArtwork";
import { VERB_CONJUGATIONS_V8_BY_ID } from "@/data/verb-conjugations-v8";
import { VERB_DROP_CATEGORIES, VERB_DROPS_SEED, VerbDropBinyan, VerbDropCard, VerbDropTopic } from "@/data/verbDrops";
import { getWeakVerbIds, loadVerbDropsProgress, markVerbDropAnswer, VerbDropProgress } from "@/lib/verbDropsProgress";

type TopicId = VerbDropTopic;
type GameMode = "intro" | "picture" | "audio" | "letters";
type ResultState = "correct" | "wrong" | null;
type LetterTile = { id: string; value: string };
type TenseId = "present" | "past" | "future" | "imperative";
type ConjugationLike = Partial<Record<TenseId, Record<string, { hebrew?: string; transcription?: string; translation?: string }>>>;

interface VerbDropForm {
  id: string;
  verb: VerbDropCard;
  hebrew: string;
  transcription: string;
  translation: string;
  grammar: string;
  isInfinitive: boolean;
}

interface SessionStep {
  id: string;
  mode: GameMode;
  form: VerbDropForm;
  options: VerbDropForm[];
}

const SESSION_TASK_COUNT = 14;
const SESSION_SECONDS = 5 * 60;
const TOP350_ID_RE = /(\d{3})$/;

const BINYAN_TOPIC_MAP: Partial<Record<TopicId, VerbDropBinyan>> = {
  binyan_paal: "פעל",
  binyan_nifal: "נפעל",
  binyan_piel: "פיעל",
  binyan_hifil: "הפעיל",
  binyan_hitpael: "התפעל",
  binyan_pual: "פועל",
  binyan_hufal: "הופעל",
};

const TENSE_LABELS: Record<TenseId, string> = {
  present: "Настоящее",
  past: "Прошедшее",
  future: "Будущее",
  imperative: "Повелительное",
};

const PERSON_ORDER: Record<TenseId, string[]> = {
  present: ["ms", "fs", "mp", "fp"],
  past: ["ani", "ata", "at", "hu", "hi", "anachnu", "atem", "aten", "hem", "hen"],
  future: ["ani", "ata", "at", "hu", "hi", "anachnu", "atem", "aten", "hem", "hen"],
  imperative: ["ms", "fs", "mp", "fp"],
};

const PERSON_LABELS: Record<string, string> = {
  ms: "муж. ед.",
  fs: "жен. ед.",
  mp: "муж. мн.",
  fp: "жен. мн.",
  ani: "я",
  ata: "ты м.",
  at: "ты ж.",
  hu: "он",
  hi: "она",
  anachnu: "мы",
  atem: "вы м.",
  aten: "вы ж.",
  hem: "они м.",
  hen: "они ж.",
};

const HERO_WALK_VERB: VerbDropCard = {
  id: "hero-walk",
  infinitive_hebrew: "ללכת",
  transcription_ru: "",
  translation_ru: "идти",
  binyan: "פעל",
  root: "הלך",
  category: "movement",
  visualType: "walk",
  frequencyRank: 0,
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

function formatTime(seconds: number): string {
  const safe = Math.max(0, seconds);
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

function isSemanticTopic(topic: TopicId): topic is VerbDropCard["category"] {
  return topic !== "all" && !topic.startsWith("binyan_");
}

function matchesTopic(verb: VerbDropCard, topic: TopicId): boolean {
  if (topic === "all") return true;

  const binyan = BINYAN_TOPIC_MAP[topic];
  if (binyan) return verb.binyan === binyan;

  return isSemanticTopic(topic) && verb.category === topic;
}

function uniqueForms(forms: VerbDropForm[]): VerbDropForm[] {
  const seen = new Set<string>();
  return forms.filter((form) => {
    const key = `${stripHebrewMarks(form.hebrew)}-${form.grammar}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildFormsForVerb(verb: VerbDropCard): VerbDropForm[] {
  const forms: VerbDropForm[] = [
    {
      id: `${verb.id}-infinitive`,
      verb,
      hebrew: verb.infinitive_hebrew,
      transcription: verb.transcription_ru,
      translation: verb.translation_ru,
      grammar: "Инфинитив",
      isInfinitive: true,
    },
  ];

  const conjugations = VERB_CONJUGATIONS_V8_BY_ID[verb.id] as ConjugationLike | undefined;
  if (!conjugations) return forms;

  (Object.keys(TENSE_LABELS) as TenseId[]).forEach((tense) => {
    const tenseForms = conjugations[tense];
    if (!tenseForms) return;

    PERSON_ORDER[tense].forEach((person) => {
      const form = tenseForms[person];
      if (!form?.hebrew) return;

      const personLabel = form.translation || PERSON_LABELS[person] || person;
      forms.push({
        id: `${verb.id}-${tense}-${person}`,
        verb,
        hebrew: form.hebrew,
        transcription: form.transcription || "",
        translation: verb.translation_ru,
        grammar: `${TENSE_LABELS[tense]} • ${personLabel}`,
        isInfinitive: false,
      });
    });
  });

  return uniqueForms(forms);
}

function createOptions(form: VerbDropForm, pool: VerbDropForm[]): VerbDropForm[] {
  const sameGrammar = pool.filter((item) => item.grammar === form.grammar && item.id !== form.id);
  const source = sameGrammar.length >= 3 ? sameGrammar : pool.filter((item) => item.id !== form.id);
  const normalizedAnswer = stripHebrewMarks(form.hebrew);
  const wrong: VerbDropForm[] = [];
  const used = new Set([normalizedAnswer]);

  for (const option of shuffle(source)) {
    const normalized = stripHebrewMarks(option.hebrew);
    if (!normalized || used.has(normalized)) continue;
    used.add(normalized);
    wrong.push(option);
    if (wrong.length === 3) break;
  }

  return shuffle([form, ...wrong]);
}

function buildSession(topic: TopicId, progress: Record<string, VerbDropProgress>): SessionStep[] {
  const verbPool = VERB_DROPS_SEED
    .filter((verb) => matchesTopic(verb, topic))
    .sort((a, b) => a.frequencyRank - b.frequencyRank);
  const formPool = verbPool.flatMap(buildFormsForVerb);

  const weakIds = new Set(getWeakVerbIds(progress));
  const weak = formPool.filter((form) => weakIds.has(form.verb.id)).slice(0, 4);
  const newOnes = formPool.filter((form) => !progress[form.verb.id]).slice(0, 8);
  const review = formPool.filter((form) => !weakIds.has(form.verb.id)).slice(0, 32);
  const sessionForms = shuffle([...weak, ...newOnes, ...review])
    .filter((form, index, arr) => arr.findIndex((item) => item.id === form.id) === index)
    .slice(0, 8);

  const steps: SessionStep[] = [];
  sessionForms.slice(0, 2).forEach((form) => {
    steps.push({ id: `intro-${form.id}`, mode: "intro", form, options: createOptions(form, formPool) });
  });
  sessionForms.forEach((form, index) => {
    const modes: GameMode[] = index % 3 === 0 ? ["picture", "letters"] : index % 3 === 1 ? ["audio"] : ["picture"];
    modes.forEach((mode) => steps.push({ id: `${mode}-${form.id}-${index}`, mode, form, options: createOptions(form, formPool) }));
  });

  return steps.slice(0, SESSION_TASK_COUNT);
}

function speakWithBrowser(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "he-IL";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function getVerbDropAudioNumber(verb: VerbDropCard): string | null {
  const idMatch = TOP350_ID_RE.exec(verb.id);
  if (idMatch) return idMatch[1];
  if (verb.frequencyRank > 0 && verb.frequencyRank <= 350) return String(verb.frequencyRank).padStart(3, "0");
  return null;
}

function getVerbDropAudioUrls(verb: VerbDropCard): string[] {
  const number = getVerbDropAudioNumber(verb);
  if (!number) return [];
  return [`/audio/verbs/${number}.mp3`, `/audio/verbs/${number}.wav`];
}

export default function VerbDropsGame() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [progress, setProgress] = useState<Record<string, VerbDropProgress>>(() => loadVerbDropsProgress());
  const [steps, setSteps] = useState<SessionStep[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SESSION_SECONDS);
  const [result, setResult] = useState<ResultState>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedLetters, setSelectedLetters] = useState<LetterTile[]>([]);
  const [letterBank, setLetterBank] = useState<LetterTile[]>([]);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<string, string[]>>(new Map());
  const audioPlayTokenRef = useRef(0);

  const currentStep = steps.length ? steps[currentIndex % steps.length] : undefined;
  const isFinished = Boolean(topic && steps.length > 0 && timeLeft <= 0);
  const progressPercent = Math.round(((SESSION_SECONDS - timeLeft) / SESSION_SECONDS) * 100);

  const weakWords = useMemo(() => {
    const weakIds = new Set(getWeakVerbIds(progress));
    return VERB_DROPS_SEED.filter((verb) => weakIds.has(verb.id)).slice(0, 4);
  }, [progress]);

  useEffect(() => {
    if (!topic || isFinished || !steps.length) return undefined;
    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) return 0;
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isFinished, steps.length, topic]);

  const getCachedAudioUrls = useCallback((verb: VerbDropCard): string[] => {
    const cached = audioCacheRef.current.get(verb.id);
    if (cached) return cached;
    const urls = getVerbDropAudioUrls(verb);
    audioCacheRef.current.set(verb.id, urls);
    return urls;
  }, []);

  const warmAudioCache = useCallback((verbs: VerbDropCard[]) => {
    const unique = verbs.filter((verb, index, arr) => arr.findIndex((item) => item.id === verb.id) === index);
    unique.slice(0, 8).forEach((verb) => {
      const [primaryUrl] = getCachedAudioUrls(verb);
      if (!primaryUrl) return;
      const audio = new Audio(primaryUrl);
      audio.preload = "auto";
    });
  }, [getCachedAudioUrls]);

  const prepareLetters = useCallback((form: VerbDropForm) => {
    const letters = Array.from(stripHebrewMarks(form.hebrew)).map((value, index) => ({
      id: `${value}-${index}-${Math.random().toString(16).slice(2)}`,
      value,
    }));
    setSelectedLetters([]);
    setLetterBank(shuffle(letters));
  }, []);

  useEffect(() => {
    if (currentStep?.mode === "letters") prepareLetters(currentStep.form);
  }, [currentStep?.id, currentStep?.mode, currentStep?.form, prepareLetters]);

  useEffect(() => {
    if (!steps.length) return;
    const upcoming = Array.from({ length: Math.min(6, steps.length) }, (_, offset) => steps[(currentIndex + offset) % steps.length].form.verb);
    warmAudioCache(upcoming);
  }, [currentIndex, steps, warmAudioCache]);

  const startSession = useCallback((nextTopic: TopicId) => {
    const nextSteps = buildSession(nextTopic, progress);
    setTopic(nextTopic);
    setSteps(nextSteps);
    setCurrentIndex(0);
    setTimeLeft(SESSION_SECONDS);
    setResult(null);
    setSelectedAnswer(null);
    setSelectedLetters([]);
    setLetterBank([]);
    setScore({ correct: 0, wrong: 0 });
    warmAudioCache(nextSteps.map((step) => step.form.verb));
  }, [progress, warmAudioCache]);

  const playAudio = useCallback(async (form: VerbDropForm) => {
    const text = stripHebrewMarks(form.hebrew);
    const token = audioPlayTokenRef.current + 1;
    audioPlayTokenRef.current = token;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }

    if (!form.isInfinitive) {
      speakWithBrowser(text);
      return;
    }

    const audioUrls = getCachedAudioUrls(form.verb);
    if (!audioUrls.length) {
      speakWithBrowser(text);
      return;
    }

    setPlaying(true);

    for (const audioUrl of audioUrls) {
      if (audioPlayTokenRef.current !== token) return;
      try {
        const audio = new Audio(audioUrl);
        audio.preload = "auto";
        audio.volume = 1;
        audioRef.current = audio;
        audio.onended = () => {
          if (audioPlayTokenRef.current === token) setPlaying(false);
        };
        audio.onerror = () => {
          if (audioPlayTokenRef.current === token) setPlaying(false);
        };
        await audio.play();
        return;
      } catch (error) {
        console.warn("Verb Drops generated audio unavailable; trying next source", audioUrl, error);
      }
    }

    if (audioPlayTokenRef.current === token) {
      setPlaying(false);
      speakWithBrowser(text);
    }
  }, [getCachedAudioUrls]);

  const goNext = useCallback(() => {
    setCurrentIndex((index) => index + 1);
    setResult(null);
    setSelectedAnswer(null);
    setSelectedLetters([]);
    setLetterBank([]);
  }, []);

  const submitAnswer = useCallback((answer: string) => {
    if (!currentStep || result) return;
    const isCorrect = stripHebrewMarks(answer) === stripHebrewMarks(currentStep.form.hebrew);
    setSelectedAnswer(answer);
    setResult(isCorrect ? "correct" : "wrong");
    setScore((current) => ({ correct: current.correct + (isCorrect ? 1 : 0), wrong: current.wrong + (isCorrect ? 0 : 1) }));
    setProgress((current) => markVerbDropAnswer(current, currentStep.form.verb.id, isCorrect));
    void playAudio(currentStep.form);
  }, [currentStep, playAudio, result]);

  const submitLetters = useCallback((letters = selectedLetters) => {
    if (!currentStep || result) return;
    const answer = letters.map((letter) => letter.value).join("");
    if (answer.length !== stripHebrewMarks(currentStep.form.hebrew).length) return;
    submitAnswer(answer);
  }, [currentStep, result, selectedLetters, submitAnswer]);

  const chooseLetter = useCallback((letter: LetterTile) => {
    if (result) return;
    const nextSelected = [...selectedLetters, letter];
    setSelectedLetters(nextSelected);
    setLetterBank((current) => current.filter((item) => item.id !== letter.id));
    if (currentStep && nextSelected.length === stripHebrewMarks(currentStep.form.hebrew).length) {
      window.setTimeout(() => submitLetters(nextSelected), 150);
    }
  }, [currentStep, result, selectedLetters, submitLetters]);

  const undoLetter = useCallback((letter: LetterTile) => {
    if (result) return;
    setSelectedLetters((current) => current.filter((item) => item.id !== letter.id));
    setLetterBank((current) => [...current, letter]);
  }, [result]);

  const restart = useCallback(() => {
    if (topic) startSession(topic);
  }, [startSession, topic]);

  if (!topic) {
    return (
      <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.18),_transparent_34%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--muted)/0.45))] pb-24 px-4 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/games")} className="text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Глаголопад</h1>
            <p className="text-xs text-muted-foreground font-semibold">5 минут • формы • времена • лица</p>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/80 p-5 shadow-2xl shadow-primary/10 backdrop-blur-md mb-5">
          <div className="absolute -top-10 -right-8 h-32 w-32 rounded-full bg-primary/15" />
          <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-success/15" />
          <VerbDropArtwork verb={HERO_WALK_VERB} className="h-44 mb-4 relative z-10" />
          <div className="relative z-10">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary"><Timer className="h-3.5 w-3.5" /> 5-минутная игра</div>
            <h2 className="text-2xl font-black text-foreground">Тренируй формы глаголов</h2>
            <p className="text-sm text-muted-foreground mt-2">Инфинитив, настоящее, прошедшее, будущее, повелительное, лица и род.</p>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 gap-3">
          {VERB_DROP_CATEGORIES.map((category, index) => (
            <motion.button key={category.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} whileTap={{ scale: 0.96 }} onClick={() => startSession(category.id)} className="rounded-[1.75rem] border border-white/80 bg-white/85 p-4 text-left shadow-xl shadow-black/5 backdrop-blur-sm">
              <div dir={category.id.startsWith("binyan_") ? "rtl" : undefined} className="text-3xl mb-2 font-hebrew font-black text-primary">{category.emoji}</div>
              <p className="font-black text-sm text-foreground">{category.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{category.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-background pb-24 px-6 pt-10 flex flex-col justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="mx-auto mb-5 h-20 w-20 rounded-[2rem] bg-success/10 flex items-center justify-center"><Trophy className="h-10 w-10 text-success" /></div>
          <h1 className="text-3xl font-black text-foreground">5 минут завершены</h1>
          <p className="text-muted-foreground mt-2">Количество заданий зависело от скорости прохождения.</p>
          <div className="grid grid-cols-3 gap-3 my-7">
            <div className="rounded-2xl border border-border bg-card p-4"><p className="text-3xl font-black text-success">{score.correct}</p><p className="text-xs text-muted-foreground font-semibold">правильно</p></div>
            <div className="rounded-2xl border border-border bg-card p-4"><p className="text-3xl font-black text-destructive">{score.wrong}</p><p className="text-xs text-muted-foreground font-semibold">ошибок</p></div>
            <div className="rounded-2xl border border-border bg-card p-4"><p className="text-3xl font-black text-primary">{currentIndex}</p><p className="text-xs text-muted-foreground font-semibold">форм</p></div>
          </div>
          {weakWords.length > 0 && (
            <div className="rounded-2xl bg-muted p-4 text-left mb-5">
              <p className="font-bold text-sm text-foreground mb-2">Повторить позже</p>
              <div className="flex flex-wrap gap-2">{weakWords.map((word) => <span key={word.id} dir="rtl" className="rounded-full bg-background px-3 py-1 font-hebrew text-sm font-bold text-foreground">{word.infinitive_hebrew}</span>)}</div>
            </div>
          )}
          <div className="flex gap-3"><button onClick={() => navigate("/games")} className="flex-1 rounded-xl bg-muted py-3 font-bold text-foreground">К играм</button><button onClick={restart} className="flex-1 rounded-xl bg-primary py-3 font-bold text-primary-foreground">Ещё раз</button></div>
        </motion.div>
      </div>
    );
  }

  if (!currentStep) return null;

  const correctText = currentStep.form.hebrew;
  const selectedWord = selectedLetters.map((letter) => letter.value).join("");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,_hsl(var(--primary)/0.20),_transparent_34%),radial-gradient(circle_at_90%_22%,_hsl(var(--success)/0.18),_transparent_28%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--muted)/0.55))] pb-24 px-4 pt-8">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setTopic(null)} className="text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
        <div className="flex-1"><div className="flex items-center justify-between mb-1"><p className="text-xs font-bold text-muted-foreground">{currentIndex + 1} форм</p><p className="flex items-center gap-1 text-xs font-black text-primary"><Timer className="h-3.5 w-3.5" />{formatTime(timeLeft)}</p></div><div className="h-2.5 rounded-full bg-white/70 overflow-hidden"><motion.div className="h-full rounded-full bg-primary" animate={{ width: `${progressPercent}%` }} /></div></div>
        <button onClick={restart} className="text-muted-foreground"><RotateCcw className="w-5 h-5" /></button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentStep.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} className="rounded-[2.5rem] border border-white/70 bg-white/80 p-4 shadow-2xl shadow-primary/10 backdrop-blur-md mb-5"><VerbDropArtwork verb={currentStep.form.verb} className="h-60" /></motion.div>

          {currentStep.mode === "intro" && (
            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 text-center shadow-xl shadow-black/5 backdrop-blur-md">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary"><Sparkles className="h-3.5 w-3.5" /> новая форма</div>
              <h2 dir="rtl" className="font-hebrew text-5xl font-black text-foreground mb-2">{currentStep.form.hebrew}</h2>
              <p className="text-sm text-muted-foreground font-semibold">{currentStep.form.transcription}</p>
              <p className="text-2xl font-black text-foreground mt-2">{currentStep.form.translation}</p>
              <p className="mt-2 text-sm font-black text-primary">{currentStep.form.grammar}</p>
              <div className="mt-3 flex items-center justify-center gap-2"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary font-hebrew">{currentStep.form.verb.binyan}</span><span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">корень: {currentStep.form.verb.root}</span></div>
              <div className="mt-6 flex gap-3"><button onClick={() => playAudio(currentStep.form)} className="flex-1 rounded-xl border border-border bg-card py-3 font-bold text-foreground flex items-center justify-center gap-2">{playing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}Слушать</button><button onClick={goNext} className="flex-1 rounded-xl bg-primary py-3 font-bold text-primary-foreground">Ловлю</button></div>
            </div>
          )}

          {(currentStep.mode === "picture" || currentStep.mode === "audio") && (
            <div>
              <p className="text-center text-sm font-bold text-muted-foreground mb-2">{currentStep.mode === "audio" ? "Слушай и выбери форму" : "Выбери правильную форму"}</p>
              {currentStep.mode === "audio" ? <button onClick={() => playAudio(currentStep.form)} className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-primary text-primary-foreground shadow-lg">{playing ? <Loader2 className="w-9 h-9 animate-spin" /> : <Volume2 className="w-9 h-9" />}</button> : <div className="mb-5 text-center"><h2 className="text-3xl font-black text-foreground">{currentStep.form.translation}</h2><p className="mt-1 text-sm font-black text-primary">{currentStep.form.grammar}</p></div>}
              <div className="grid grid-cols-2 gap-3">{currentStep.options.map((option) => {
                const isSelected = selectedAnswer === option.hebrew;
                const isCorrect = option.hebrew === correctText;
                const state = result && isCorrect ? "border-success bg-success/15 text-success shadow-success/10" : result && isSelected ? "border-destructive bg-destructive/15 text-destructive shadow-destructive/10" : "border-white/80 bg-white/90 text-foreground shadow-black/5";
                return (
                  <button key={option.id} dir="rtl" onClick={() => submitAnswer(option.hebrew)} disabled={!!result} className={`min-h-[96px] rounded-[2rem] border-2 px-4 py-3 shadow-xl backdrop-blur-md transition-colors ${state}`}>
                    <span className="block font-hebrew text-2xl font-black">{option.hebrew}</span>
                    <span dir="ltr" className="mt-1 block text-xs font-bold opacity-75">{option.transcription}</span>
                    <span dir="ltr" className="mt-1 block text-[10px] font-black uppercase tracking-wide opacity-55">{option.grammar}</span>
                  </button>
                );
              })}</div>
            </div>
          )}

          {currentStep.mode === "letters" && (
            <div>
              <p className="text-center text-sm font-bold text-muted-foreground mb-1">Собери форму по буквам</p>
              <h2 className="text-center text-2xl font-black text-foreground mb-1">{currentStep.form.translation}</h2>
              <p className="text-center text-sm font-black text-primary mb-1">{currentStep.form.grammar}</p>
              <p className="text-center text-sm text-muted-foreground font-semibold mb-4">{currentStep.form.transcription}</p>
              <div dir="rtl" className="min-h-[76px] rounded-[2rem] border-2 border-dashed border-primary/30 bg-white/70 p-3 flex items-center justify-center gap-2 mb-4 shadow-inner">
                {selectedLetters.length === 0 ? <span className="text-sm text-muted-foreground">нажми буквы снизу</span> : selectedLetters.map((letter) => <button key={letter.id} onClick={() => undoLetter(letter)} className="h-12 min-w-12 rounded-2xl bg-primary font-hebrew text-2xl font-black text-primary-foreground shadow-lg">{letter.value}</button>)}
              </div>
              <div dir="rtl" className="grid grid-cols-5 gap-2 mb-4">{letterBank.map((letter) => <button key={letter.id} onClick={() => chooseLetter(letter)} disabled={!!result} className="h-14 rounded-2xl border border-white/80 bg-white/90 font-hebrew text-2xl font-black text-foreground shadow-xl shadow-black/5">{letter.value}</button>)}</div>
              <p dir="rtl" className="text-center font-hebrew text-lg text-muted-foreground min-h-7">{selectedWord}</p>
            </div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`mt-5 rounded-2xl p-4 text-center ${result === "correct" ? "bg-success/10" : "bg-destructive/10"}`}>
              <div className="flex items-center justify-center gap-2 mb-1">{result === "correct" ? <CheckCircle2 className="w-6 h-6 text-success" /> : <XCircle className="w-6 h-6 text-destructive" />}<p className="font-black text-foreground">{result === "correct" ? "נכון!" : "Почти"}</p></div>
              <p dir="rtl" className="font-hebrew text-3xl font-black text-foreground">{correctText}</p>
              <p className="text-sm text-muted-foreground font-semibold">{currentStep.form.transcription}</p>
              <p className="text-sm text-muted-foreground font-semibold">{currentStep.form.translation}</p>
              <p className="text-sm font-black text-primary">{currentStep.form.grammar}</p>
              <button onClick={goNext} className="mt-4 w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground">Следующая форма</button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
