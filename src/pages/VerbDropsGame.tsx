import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, RotateCcw, Sparkles, Timer, Trophy, Volume2, XCircle } from "lucide-react";
import VerbDropArtwork from "@/components/VerbDropArtwork";
import { VERB_DROP_CATEGORIES, VERB_DROPS_SEED, VerbDropCard, VerbDropCategory } from "@/data/verbDrops";
import { getWeakVerbIds, loadVerbDropsProgress, markVerbDropAnswer, VerbDropProgress } from "@/lib/verbDropsProgress";

type TopicId = VerbDropCategory | "all";
type GameMode = "intro" | "picture" | "audio" | "letters";
type ResultState = "correct" | "wrong" | null;
type LetterTile = { id: string; value: string };

interface SessionStep {
  id: string;
  mode: GameMode;
  verb: VerbDropCard;
  options: VerbDropCard[];
}

const SESSION_TASK_COUNT = 14;
const SESSION_SECONDS = 5 * 60;
const TOP350_ID_RE = /(\d{3})$/;

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

function createOptions(verb: VerbDropCard, pool: VerbDropCard[]): VerbDropCard[] {
  const wrong = shuffle(pool.filter((item) => item.id !== verb.id)).slice(0, 3);
  return shuffle([verb, ...wrong]);
}

function buildSession(topic: TopicId, progress: Record<string, VerbDropProgress>): SessionStep[] {
  const pool = VERB_DROPS_SEED
    .filter((verb) => topic === "all" || verb.category === topic)
    .sort((a, b) => a.frequencyRank - b.frequencyRank);

  const weakIds = new Set(getWeakVerbIds(progress));
  const weak = pool.filter((verb) => weakIds.has(verb.id)).slice(0, 3);
  const newOnes = pool.filter((verb) => !progress[verb.id]).slice(0, 3);
  const review = pool.filter((verb) => !weakIds.has(verb.id)).slice(0, 8);
  const sessionVerbs = shuffle([...weak, ...newOnes, ...review])
    .filter((verb, index, arr) => arr.findIndex((item) => item.id === verb.id) === index)
    .slice(0, 8);

  const steps: SessionStep[] = [];
  sessionVerbs.slice(0, 3).forEach((verb) => {
    steps.push({ id: `intro-${verb.id}`, mode: "intro", verb, options: createOptions(verb, pool) });
  });
  sessionVerbs.forEach((verb, index) => {
    const modes: GameMode[] = index % 3 === 0 ? ["picture", "letters"] : index % 3 === 1 ? ["audio"] : ["picture"];
    modes.forEach((mode) => steps.push({ id: `${mode}-${verb.id}-${index}`, mode, verb, options: createOptions(verb, pool) }));
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

  const prepareLetters = useCallback((verb: VerbDropCard) => {
    const letters = Array.from(stripHebrewMarks(verb.infinitive_hebrew)).map((value, index) => ({
      id: `${value}-${index}-${Math.random().toString(16).slice(2)}`,
      value,
    }));
    setSelectedLetters([]);
    setLetterBank(shuffle(letters));
  }, []);

  useEffect(() => {
    if (currentStep?.mode === "letters") prepareLetters(currentStep.verb);
  }, [currentStep?.id, currentStep?.mode, currentStep?.verb, prepareLetters]);

  useEffect(() => {
    if (!steps.length) return;
    const upcoming = Array.from({ length: Math.min(6, steps.length) }, (_, offset) => steps[(currentIndex + offset) % steps.length].verb);
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
    warmAudioCache(nextSteps.map((step) => step.verb));
  }, [progress, warmAudioCache]);

  const playAudio = useCallback(async (verb: VerbDropCard) => {
    const text = stripHebrewMarks(verb.infinitive_hebrew);
    const token = audioPlayTokenRef.current + 1;
    audioPlayTokenRef.current = token;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }

    const audioUrls = getCachedAudioUrls(verb);
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
    const isCorrect = stripHebrewMarks(answer) === stripHebrewMarks(currentStep.verb.infinitive_hebrew);
    setSelectedAnswer(answer);
    setResult(isCorrect ? "correct" : "wrong");
    setScore((current) => ({ correct: current.correct + (isCorrect ? 1 : 0), wrong: current.wrong + (isCorrect ? 0 : 1) }));
    setProgress((current) => markVerbDropAnswer(current, currentStep.verb.id, isCorrect));
    void playAudio(currentStep.verb);
  }, [currentStep, playAudio, result]);

  const submitLetters = useCallback((letters = selectedLetters) => {
    if (!currentStep || result) return;
    const answer = letters.map((letter) => letter.value).join("");
    if (answer.length !== stripHebrewMarks(currentStep.verb.infinitive_hebrew).length) return;
    submitAnswer(answer);
  }, [currentStep, result, selectedLetters, submitAnswer]);

  const chooseLetter = useCallback((letter: LetterTile) => {
    if (result) return;
    const nextSelected = [...selectedLetters, letter];
    setSelectedLetters(nextSelected);
    setLetterBank((current) => current.filter((item) => item.id !== letter.id));
    if (currentStep && nextSelected.length === stripHebrewMarks(currentStep.verb.infinitive_hebrew).length) {
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
            <p className="text-xs text-muted-foreground font-semibold">5 минут • глаголы • картинки • аудио</p>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative overflow-hidden rounded-[2.25rem] border border-white/75 bg-white/85 shadow-2xl shadow-primary/10 backdrop-blur-md mb-5">
          <div className="relative h-56 overflow-hidden bg-[radial-gradient(circle_at_18%_18%,_hsl(var(--primary)/0.18),_transparent_28%),radial-gradient(circle_at_88%_12%,_hsl(var(--primary)/0.20),_transparent_24%),linear-gradient(135deg,_hsl(var(--primary)/0.10),_hsl(var(--background)),_hsl(var(--success)/0.10))]">
            <div className="absolute left-5 top-16 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/30">
              <Volume2 className="h-6 w-6" />
            </div>

            <div className="absolute left-20 top-7 rotate-[-8deg] rounded-2xl border border-primary/15 bg-white/90 px-5 py-4 text-center shadow-xl">
              <div className="text-3xl">??</div>
              <div className="mt-1 text-sm font-black text-foreground">бежать</div>
            </div>

            <div className="absolute left-10 bottom-7 rotate-[-4deg] rounded-2xl border border-primary/15 bg-white/90 px-4 py-3 text-center shadow-xl">
              <div className="text-2xl">??</div>
              <div className="mt-1 text-xs font-black text-foreground">прыгать</div>
            </div>

            <div className="absolute left-1/2 top-10 -translate-x-1/2">
              <div className="relative h-32 w-32">
                <div className="absolute left-7 top-2 h-16 w-16 rounded-full bg-primary/20" />
                <div className="absolute left-9 top-4 text-6xl">?????</div>
                <div className="absolute -right-6 top-4 text-primary">?</div>
                <div className="absolute -left-5 bottom-4 text-primary/70">?</div>
              </div>
            </div>

            <div className="absolute right-8 top-20 flex gap-1">
              {["?", "?", "?"].map((letter) => (
                <span key={letter} dir="rtl" className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-white/90 font-hebrew text-xl font-black text-primary shadow-md">
                  {letter}
                </span>
              ))}
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-dashed border-primary/25 bg-white/50" />
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-dashed border-primary/25 bg-white/50" />
            </div>

            <div className="absolute bottom-5 right-8 rounded-2xl bg-primary/15 px-4 py-3 shadow-inner">
              <div className="flex gap-2">
                <span className="rounded-lg bg-white px-2 py-1 font-black text-primary">?</span>
                <span className="rounded-lg bg-white px-2 py-1 font-black text-primary">?</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 p-5 pt-4">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary"><Timer className="h-3.5 w-3.5" /> 5-минутная игра</div>
            <h2 className="text-2xl font-black text-foreground">Лови глаголы в действии</h2>
            <p className="text-sm text-muted-foreground mt-2">Смотри, слушай и собирай инфинитив по буквам.</p>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 gap-3">
          {VERB_DROP_CATEGORIES.map((category, index) => (
            <motion.button key={category.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} whileTap={{ scale: 0.96 }} onClick={() => startSession(category.id)} className="rounded-[1.75rem] border border-white/80 bg-white/85 p-4 text-left shadow-xl shadow-black/5 backdrop-blur-sm">
              <div className="text-3xl mb-2">{category.emoji}</div>
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
            <div className="rounded-2xl border border-border bg-card p-4"><p className="text-3xl font-black text-primary">{currentIndex}</p><p className="text-xs text-muted-foreground font-semibold">карточек</p></div>
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

  const correctText = currentStep.verb.infinitive_hebrew;
  const selectedWord = selectedLetters.map((letter) => letter.value).join("");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,_hsl(var(--primary)/0.20),_transparent_34%),radial-gradient(circle_at_90%_22%,_hsl(var(--success)/0.18),_transparent_28%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--muted)/0.55))] pb-24 px-4 pt-8">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setTopic(null)} className="text-muted-foreground"><ArrowLeft className="w-6 h-6" /></button>
        <div className="flex-1"><div className="flex items-center justify-between mb-1"><p className="text-xs font-bold text-muted-foreground">{currentIndex + 1} карточек</p><p className="flex items-center gap-1 text-xs font-black text-primary"><Timer className="h-3.5 w-3.5" />{formatTime(timeLeft)}</p></div><div className="h-2.5 rounded-full bg-white/70 overflow-hidden"><motion.div className="h-full rounded-full bg-primary" animate={{ width: `${progressPercent}%` }} /></div></div>
        <button onClick={restart} className="text-muted-foreground"><RotateCcw className="w-5 h-5" /></button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentStep.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} className="rounded-[2.5rem] border border-white/70 bg-white/80 p-4 shadow-2xl shadow-primary/10 backdrop-blur-md mb-5"><VerbDropArtwork verb={currentStep.verb} className="h-60" /></motion.div>

          {currentStep.mode === "intro" && (
            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 text-center shadow-xl shadow-black/5 backdrop-blur-md">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary"><Sparkles className="h-3.5 w-3.5" /> новая капля</div>
              <h2 dir="rtl" className="font-hebrew text-5xl font-black text-foreground mb-2">{currentStep.verb.infinitive_hebrew}</h2>
              <p className="text-sm text-muted-foreground font-semibold">{currentStep.verb.transcription_ru}</p>
              <p className="text-2xl font-black text-foreground mt-2">{currentStep.verb.translation_ru}</p>
              <div className="mt-3 flex items-center justify-center gap-2"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary font-hebrew">{currentStep.verb.binyan}</span><span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">корень: {currentStep.verb.root}</span></div>
              <div className="mt-6 flex gap-3"><button onClick={() => playAudio(currentStep.verb)} className="flex-1 rounded-xl border border-border bg-card py-3 font-bold text-foreground flex items-center justify-center gap-2">{playing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}Слушать</button><button onClick={goNext} className="flex-1 rounded-xl bg-primary py-3 font-bold text-primary-foreground">Ловлю</button></div>
            </div>
          )}

          {(currentStep.mode === "picture" || currentStep.mode === "audio") && (
            <div>
              <p className="text-center text-sm font-bold text-muted-foreground mb-2">{currentStep.mode === "audio" ? "Слушай и выбери глагол" : "Какой это глагол?"}</p>
              {currentStep.mode === "audio" ? <button onClick={() => playAudio(currentStep.verb)} className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-primary text-primary-foreground shadow-lg">{playing ? <Loader2 className="w-9 h-9 animate-spin" /> : <Volume2 className="w-9 h-9" />}</button> : <h2 className="text-center text-3xl font-black text-foreground mb-5">{currentStep.verb.translation_ru}</h2>}
              <div className="grid grid-cols-2 gap-3">{currentStep.options.map((option) => {
                const isSelected = selectedAnswer === option.infinitive_hebrew;
                const isCorrect = option.infinitive_hebrew === correctText;
                const state = result && isCorrect ? "border-success bg-success/15 text-success shadow-success/10" : result && isSelected ? "border-destructive bg-destructive/15 text-destructive shadow-destructive/10" : "border-white/80 bg-white/90 shadow-black/5";
                return <button key={option.id} dir="rtl" onClick={() => submitAnswer(option.infinitive_hebrew)} disabled={!!result} className={`min-h-[72px] rounded-[2rem] border-2 px-4 py-3 font-hebrew text-2xl font-black shadow-xl backdrop-blur-md transition-colors ${state}`}>{option.infinitive_hebrew}</button>;
              })}</div>
            </div>
          )}

          {currentStep.mode === "letters" && (
            <div>
              <p className="text-center text-sm font-bold text-muted-foreground mb-1">Собери глагол по буквам</p>
              <h2 className="text-center text-2xl font-black text-foreground mb-4">{currentStep.verb.translation_ru}</h2>
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
              <p className="text-sm text-muted-foreground font-semibold">{currentStep.verb.translation_ru}</p>
              <button onClick={goNext} className="mt-4 w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground">Следующая капля</button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
