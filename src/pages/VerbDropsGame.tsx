import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, RotateCcw, Trophy, Volume2, XCircle } from "lucide-react";
import VerbIllustration from "@/components/VerbIllustration";
import { supabase } from "@/integrations/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { VERB_DROP_CATEGORIES, VERB_DROPS_SEED, VerbDropCard, VerbDropCategory } from "@/data/verbDrops";
import { getWeakVerbIds, loadVerbDropsProgress, markVerbDropAnswer, VerbDropProgress } from "@/lib/verbDropsProgress";

type TopicId = VerbDropCategory | "all";
type GameMode = "intro" | "picture" | "audio" | "letters";
type ResultState = "correct" | "wrong" | null;

interface SessionStep {
  id: string;
  mode: GameMode;
  verb: VerbDropCard;
  options: VerbDropCard[];
}

const SESSION_TASK_COUNT = 12;

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
    modes.forEach((mode) => {
      steps.push({ id: `${mode}-${verb.id}-${index}`, mode, verb, options: createOptions(verb, pool) });
    });
  });

  return steps.slice(0, SESSION_TASK_COUNT);
}

function speakWithBrowser(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "he-IL";
  utterance.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

export default function VerbDropsGame() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [progress, setProgress] = useState<Record<string, VerbDropProgress>>(() => loadVerbDropsProgress());
  const [steps, setSteps] = useState<SessionStep[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState<ResultState>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [selectedLetters, setSelectedLetters] = useState<Array<{ id: string; value: string }>>([]);
  const [letterBank, setLetterBank] = useState<Array<{ id: string; value: string }>>([]);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<string, string>>(new Map());

  const currentStep = steps[currentIndex];
  const isFinished = Boolean(topic && steps.length > 0 && currentIndex >= steps.length);
  const progressPercent = steps.length ? Math.round((currentIndex / steps.length) * 100) : 0;

  const weakWords = useMemo(() => {
    const weakIds = new Set(getWeakVerbIds(progress));
    return VERB_DROPS_SEED.filter((verb) => weakIds.has(verb.id)).slice(0, 4);
  }, [progress]);

  const startSession = useCallback((nextTopic: TopicId) => {
    const nextSteps = buildSession(nextTopic, progress);
    setTopic(nextTopic);
    setSteps(nextSteps);
    setCurrentIndex(0);
    setResult(null);
    setSelectedAnswer(null);
    setSelectedLetters([]);
    setLetterBank([]);
    setScore({ correct: 0, wrong: 0 });
  }, [progress]);

  const playAudio = useCallback(async (verb: VerbDropCard) => {
    const text = stripHebrewMarks(verb.infinitive_hebrew);
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (!isSupabaseConfigured) {
        speakWithBrowser(text);
        return;
      }

      let audioUrl = audioCacheRef.current.get(verb.id);
      if (!audioUrl) {
        setPlaying(true);
        const { data, error } = await supabase.functions.invoke("tts-word", {
          body: { text },
        });
        if (error || !data?.audio) throw error || new Error("No audio");
        const binary = atob(data.audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: data.mime || "audio/wav" });
        audioUrl = URL.createObjectURL(blob);
        audioCacheRef.current.set(verb.id, audioUrl);
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setPlaying(false);
      audio.onerror = () => {
        setPlaying(false);
        speakWithBrowser(text);
      };
      setPlaying(true);
      await audio.play();
    } catch {
      setPlaying(false);
      speakWithBrowser(text);
    }
  }, []);

  const prepareLetters = useCallback((verb: VerbDropCard) => {
    const letters = Array.from(stripHebrewMarks(verb.infinitive_hebrew)).map((value, index) => ({
      id: `${value}-${index}-${Math.random().toString(16).slice(2)}`,
      value,
    }));
    setSelectedLetters([]);
    setLetterBank(shuffle(letters));
  }, []);

  const goNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    const nextStep = steps[nextIndex];
    setCurrentIndex(nextIndex);
    setResult(null);
    setSelectedAnswer(null);
    setSelectedLetters([]);
    setLetterBank([]);
    if (nextStep?.mode === "letters") prepareLetters(nextStep.verb);
  }, [currentIndex, prepareLetters, steps]);

  const submitAnswer = useCallback((answer: string) => {
    if (!currentStep || result) return;
    const isCorrect = answer === currentStep.verb.infinitive_hebrew;
    setSelectedAnswer(answer);
    setResult(isCorrect ? "correct" : "wrong");
    setScore((current) => ({
      correct: current.correct + (isCorrect ? 1 : 0),
      wrong: current.wrong + (isCorrect ? 0 : 1),
    }));
    setProgress((current) => markVerbDropAnswer(current, currentStep.verb.id, isCorrect));
    void playAudio(currentStep.verb);
  }, [currentStep, playAudio, result]);

  const submitLetters = useCallback((letters = selectedLetters) => {
    if (!currentStep || result) return;
    const answer = letters.map((letter) => letter.value).join("");
    if (answer.length !== stripHebrewMarks(currentStep.verb.infinitive_hebrew).length) return;
    submitAnswer(answer);
  }, [currentStep, result, selectedLetters, submitAnswer]);

  const chooseLetter = useCallback((letter: { id: string; value: string }) => {
    if (result) return;
    const nextSelected = [...selectedLetters, letter];
    setSelectedLetters(nextSelected);
    setLetterBank((current) => current.filter((item) => item.id !== letter.id));
    if (currentStep && nextSelected.length === stripHebrewMarks(currentStep.verb.infinitive_hebrew).length) {
      window.setTimeout(() => submitLetters(nextSelected), 150);
    }
  }, [currentStep, result, selectedLetters, submitLetters]);

  const undoLetter = useCallback((letter: { id: string; value: string }) => {
    if (result) return;
    setSelectedLetters((current) => current.filter((item) => item.id !== letter.id));
    setLetterBank((current) => [...current, letter]);
  }, [result]);

  const restart = useCallback(() => {
    if (topic) startSession(topic);
  }, [startSession, topic]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/games")} className="text-muted-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-foreground">Капли глаголов</h1>
            <p className="text-xs text-muted-foreground font-semibold">5 минут • картинки • аудио • буквы</p>
          </div>
        </div>

        <div className="rounded-[2rem] bg-gradient-to-br from-primary/15 via-accent/20 to-success/15 p-5 mb-5 border border-border">
          <VerbIllustration type="walk" className="h-44 mb-4" />
          <h2 className="text-xl font-black text-foreground">Учим глаголы как действия</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Смотри картинку, слушай иврит, выбирай правильный инфинитив и собирай слово по буквам.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {VERB_DROP_CATEGORIES.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => startSession(category.id)}
              className="rounded-2xl border border-border bg-card p-4 text-left shadow-sm"
            >
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
          <div className="mx-auto mb-5 h-20 w-20 rounded-[2rem] bg-success/10 flex items-center justify-center">
            <Trophy className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-black text-foreground">Сессия завершена</h1>
          <p className="text-muted-foreground mt-2">Ты потренировал глаголы в инфинитиве.</p>

          <div className="grid grid-cols-2 gap-3 my-7">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-3xl font-black text-success">{score.correct}</p>
              <p className="text-xs text-muted-foreground font-semibold">правильно</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-3xl font-black text-destructive">{score.wrong}</p>
              <p className="text-xs text-muted-foreground font-semibold">ошибок</p>
            </div>
          </div>

          {weakWords.length > 0 && (
            <div className="rounded-2xl bg-muted p-4 text-left mb-5">
              <p className="font-bold text-sm text-foreground mb-2">Повторить позже</p>
              <div className="flex flex-wrap gap-2">
                {weakWords.map((word) => (
                  <span key={word.id} dir="rtl" className="rounded-full bg-background px-3 py-1 font-hebrew text-sm font-bold text-foreground">
                    {word.infinitive_hebrew}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => navigate("/games")} className="flex-1 rounded-xl bg-muted py-3 font-bold text-foreground">
              К играм
            </button>
            <button onClick={restart} className="flex-1 rounded-xl bg-primary py-3 font-bold text-primary-foreground">
              Ещё раз
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentStep) return null;

  const correctText = currentStep.verb.infinitive_hebrew;
  const selectedWord = selectedLetters.map((letter) => letter.value).join("");

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-8">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => setTopic(null)} className="text-muted-foreground">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-muted-foreground">{currentIndex + 1}/{steps.length}</p>
            <p className="text-xs font-bold text-primary">{progressPercent}%</p>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <button onClick={restart} className="text-muted-foreground">
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentStep.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
          <VerbIllustration type={currentStep.verb.visualType} className="h-56 mb-5" />

          {currentStep.mode === "intro" && (
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-wide text-primary mb-2">Новый глагол</p>
              <h2 dir="rtl" className="font-hebrew text-5xl font-black text-foreground mb-2">{currentStep.verb.infinitive_hebrew}</h2>
              <p className="text-sm text-muted-foreground font-semibold">{currentStep.verb.transcription_ru}</p>
              <p className="text-2xl font-black text-foreground mt-2">{currentStep.verb.translation_ru}</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary font-hebrew">{currentStep.verb.binyan}</span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">корень: {currentStep.verb.root}</span>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => playAudio(currentStep.verb)} className="flex-1 rounded-xl border border-border bg-card py-3 font-bold text-foreground flex items-center justify-center gap-2">
                  {playing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Volume2 className="w-5 h-5" />}
                  Слушать
                </button>
                <button onClick={goNext} className="flex-1 rounded-xl bg-primary py-3 font-bold text-primary-foreground">
                  Понятно
                </button>
              </div>
            </div>
          )}

          {currentStep.mode === "picture" && (
            <div>
              <p className="text-center text-sm font-bold text-muted-foreground mb-2">Какой это глагол?</p>
              <h2 className="text-center text-3xl font-black text-foreground mb-5">{currentStep.verb.translation_ru}</h2>
              <div className="grid grid-cols-2 gap-3">
                {currentStep.options.map((option) => {
                  const isSelected = selectedAnswer === option.infinitive_hebrew;
                  const isCorrect = option.infinitive_hebrew === correctText;
                  const state = result && isCorrect ? "border-success bg-success/10" : result && isSelected ? "border-destructive bg-destructive/10" : "border-border bg-card";
                  return (
                    <button key={option.id} dir="rtl" onClick={() => submitAnswer(option.infinitive_hebrew)} disabled={!!result} className={`rounded-2xl border-2 p-4 font-hebrew text-2xl font-black text-foreground ${state}`}>
                      {option.infinitive_hebrew}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep.mode === "audio" && (
            <div>
              <p className="text-center text-sm font-bold text-muted-foreground mb-3">Слушай и выбери глагол</p>
              <button onClick={() => playAudio(currentStep.verb)} className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-primary text-primary-foreground shadow-lg">
                {playing ? <Loader2 className="w-9 h-9 animate-spin" /> : <Volume2 className="w-9 h-9" />}
              </button>
              <div className="grid grid-cols-2 gap-3">
                {currentStep.options.map((option) => {
                  const isSelected = selectedAnswer === option.infinitive_hebrew;
                  const isCorrect = option.infinitive_hebrew === correctText;
                  const state = result && isCorrect ? "border-success bg-success/10" : result && isSelected ? "border-destructive bg-destructive/10" : "border-border bg-card";
                  return (
                    <button key={option.id} dir="rtl" onClick={() => submitAnswer(option.infinitive_hebrew)} disabled={!!result} className={`rounded-2xl border-2 p-4 font-hebrew text-2xl font-black text-foreground ${state}`}>
                      {option.infinitive_hebrew}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep.mode === "letters" && (
            <div>
              <p className="text-center text-sm font-bold text-muted-foreground mb-1">Собери глагол по буквам</p>
              <h2 className="text-center text-2xl font-black text-foreground mb-4">{currentStep.verb.translation_ru}</h2>
              {letterBank.length === 0 && selectedLetters.length === 0 && prepareLetters(currentStep.verb)}
              <div dir="rtl" className="min-h-[4rem] rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-3 flex items-center justify-center gap-2 mb-4">
                {selectedLetters.length === 0 ? (
                  <span className="text-sm text-muted-foreground">нажми буквы снизу</span>
                ) : selectedLetters.map((letter) => (
                  <button key={letter.id} onClick={() => undoLetter(letter)} className="h-11 w-11 rounded-xl bg-background font-hebrew text-2xl font-black text-foreground shadow-sm">
                    {letter.value}
                  </button>
                ))}
              </div>
              <div dir="rtl" className="grid grid-cols-5 gap-2 mb-4">
                {letterBank.map((letter) => (
                  <button key={letter.id} onClick={() => chooseLetter(letter)} disabled={!!result} className="h-12 rounded-xl bg-card border border-border font-hebrew text-2xl font-black text-foreground shadow-sm">
                    {letter.value}
                  </button>
                ))}
              </div>
              <p dir="rtl" className="text-center font-hebrew text-lg text-muted-foreground min-h-7">{selectedWord}</p>
            </div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`mt-5 rounded-2xl p-4 text-center ${result === "correct" ? "bg-success/10" : "bg-destructive/10"}`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                {result === "correct" ? <CheckCircle2 className="w-6 h-6 text-success" /> : <XCircle className="w-6 h-6 text-destructive" />}
                <p className="font-black text-foreground">{result === "correct" ? "נכון!" : "Почти"}</p>
              </div>
              <p dir="rtl" className="font-hebrew text-3xl font-black text-foreground">{correctText}</p>
              <p className="text-sm text-muted-foreground font-semibold">{currentStep.verb.translation_ru}</p>
              <button onClick={goNext} className="mt-4 w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground">
                Дальше
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
