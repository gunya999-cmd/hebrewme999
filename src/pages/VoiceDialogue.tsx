import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Keyboard, Loader2, Mic, MicOff, PhoneOff, Send, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MiriamAvatar3D } from "@/components/MiriamAvatar3D";
import { SpeechRateSelector } from "@/components/SpeechRateSelector";
import { getSpeechRate } from "@/hooks/useSpeechRate";
import { getSupabaseAuthHeaders, getSupabaseFunctionUrl, isSupabaseConfigured, SUPABASE_CONFIG_ERROR } from "@/lib/env";
import { normalizeLiveText } from "@/lib/realtimeTranscript";

type Level = "beginner" | "intermediate" | "advanced";
type Role = "user" | "assistant";
type Speaker = "user" | "miriam";

type ChatMessage = {
  role: Role;
  content: string;
};

type TranscriptLine = {
  id: number;
  speaker: Speaker;
  hebrew: string;
  russian: string;
};

type RouteState = {
  level?: Level;
  autoStart?: boolean;
  customInstruction?: string;
  customGreet?: string;
  customTitle?: string;
} | null;

type SpeechRecognitionAlternativeLike = { transcript?: string };
type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0?: SpeechRecognitionAlternativeLike;
};
type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};
type SpeechRecognitionErrorEventLike = { error?: string };
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
};
type SpeechWindow = Window & typeof globalThis & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

const LEVELS: Record<Level, { label: string; emoji: string; desc: string }> = {
  beginner: { label: "Начинающий", emoji: "🌱", desc: "Короткие простые фразы" },
  intermediate: { label: "Средний", emoji: "📚", desc: "Разговорные ситуации" },
  advanced: { label: "Продвинутый", emoji: "🎓", desc: "Свободная речь" },
};

function getRecognitionConstructor() {
  return (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition;
}

async function translateToRussian(text: string): Promise<string> {
  try {
    if (!isSupabaseConfigured || !text.trim()) return "";
    const response = await fetch(getSupabaseFunctionUrl("ai-dialogue"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getSupabaseAuthHeaders(),
      },
      body: JSON.stringify({ action: "translate", text }),
    });
    if (!response.ok) return "";
    const data = await response.json();
    return typeof data.translation === "string" ? data.translation : "";
  } catch {
    return "";
  }
}

function extractStreamDelta(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const data = payload as {
    choices?: Array<{ delta?: { content?: string }; message?: { content?: string } }>;
  };
  return data.choices?.[0]?.delta?.content || data.choices?.[0]?.message?.content || "";
}

async function readAiDialogueStream(response: Response, onDelta: (delta: string) => void): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) {
    const json = await response.json().catch(() => null);
    const text = extractStreamDelta(json);
    if (text) onDelta(text);
    return text;
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || !line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;

      try {
        const parsed = JSON.parse(data);
        const delta = extractStreamDelta(parsed);
        if (delta) {
          fullText += delta;
          onDelta(fullText);
        }
      } catch {
        // Ignore partial/diagnostic stream lines.
      }
    }
  }

  return normalizeLiveText(fullText);
}

export default function VoiceDialogue() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as RouteState;

  const [level, setLevel] = useState<Level | null>(routeState?.level ?? null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [listening, setListening] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [draft, setDraft] = useState("");
  const [liveAiText, setLiveAiText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(1);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const autoStartedRef = useRef(false);

  const title = routeState?.customTitle || (level ? `Мирьям — ${LEVELS[level].label}` : "Мирьям — AI Репетитор");

  const introPrompt = useMemo(() => {
    const parts = [
      routeState?.customInstruction ? `Сценарий урока: ${routeState.customInstruction}` : "Начни дружелюбный урок разговорного иврита.",
      routeState?.customGreet ? `Первая реплика: ${routeState.customGreet}` : "Поздоровайся, представься коротко и задай простой вопрос на иврите.",
      "Говори только на иврите. Не используй русский или английский. Реплики должны быть короткими, чтобы ученик успевал отвечать.",
    ];
    return parts.join("\n");
  }, [routeState?.customGreet, routeState?.customInstruction]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [transcript, liveAiText, draft]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      recognitionRef.current?.abort?.();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const updateTranslation = useCallback((id: number, text: string) => {
    void translateToRussian(text).then((russian) => {
      if (!russian) return;
      setTranscript((prev) => prev.map((line) => (line.id === id ? { ...line, russian } : line)));
    });
  }, []);

  const addLine = useCallback((speaker: Speaker, rawText: string) => {
    const text = normalizeLiveText(rawText);
    if (!text) return null;
    const id = nextIdRef.current++;
    setTranscript((prev) => [...prev, { id, speaker, hebrew: text, russian: "" }]);
    updateTranslation(id, text);
    return id;
  }, [updateTranslation]);

  const speakHebrew = useCallback((text: string) => {
    if (!text.trim() || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "he-IL";
    utterance.rate = getSpeechRate();
    utterance.onstart = () => setAiSpeaking(true);
    utterance.onend = () => setAiSpeaking(false);
    utterance.onerror = () => setAiSpeaking(false);

    const voices = window.speechSynthesis.getVoices();
    const hebrewVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("he"));
    if (hebrewVoice) utterance.voice = hebrewVoice;

    window.speechSynthesis.speak(utterance);
  }, []);

  const askMiriam = useCallback(async (nextMessages: ChatMessage[]) => {
    if (!isSupabaseConfigured) {
      setError(SUPABASE_CONFIG_ERROR);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setError(null);
    setThinking(true);
    setLiveAiText("");

    try {
      const response = await fetch(getSupabaseFunctionUrl("ai-dialogue"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getSupabaseAuthHeaders(),
        },
        body: JSON.stringify({ messages: nextMessages, level: level || "beginner" }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || `AI ответил ошибкой ${response.status}`);
      }

      let latestPartial = "";
      const answer = await readAiDialogueStream(response, (partial) => {
        latestPartial = normalizeLiveText(partial);
        setLiveAiText(latestPartial);
      });
      const cleanAnswer = normalizeLiveText(answer || latestPartial);
      setLiveAiText("");

      if (!cleanAnswer) throw new Error("Мирьям не вернула текст. Попробуйте ещё раз.");

      addLine("miriam", cleanAnswer);
      setMessages([...nextMessages, { role: "assistant", content: cleanAnswer }]);
      speakHebrew(cleanAnswer);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError((err as Error).message || "Диалог оборвался. Попробуйте ещё раз.");
      }
    } finally {
      setThinking(false);
      abortRef.current = null;
    }
  }, [addLine, level, speakHebrew]);

  const startSession = useCallback((chosenLevel?: Level | null) => {
    const nextLevel = chosenLevel || level || "beginner";
    setLevel(nextLevel);
    setConnected(true);
    setConnecting(true);
    setTranscript([]);
    setMessages([]);
    setDraft("");
    setError(null);

    const firstMessages: ChatMessage[] = [{ role: "user", content: introPrompt }];
    window.setTimeout(() => {
      setConnecting(false);
      void askMiriam(firstMessages);
    }, 150);
  }, [askMiriam, introPrompt, level]);

  const endSession = useCallback(() => {
    abortRef.current?.abort();
    recognitionRef.current?.abort?.();
    window.speechSynthesis?.cancel();
    setConnected(false);
    setConnecting(false);
    setListening(false);
    setThinking(false);
    setAiSpeaking(false);
    setLiveAiText("");
  }, []);

  const sendUserText = useCallback((rawText?: string) => {
    const text = normalizeLiveText(rawText ?? draft);
    if (!text || thinking) return;

    addLine("user", text);
    setDraft("");
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    void askMiriam(nextMessages);
  }, [addLine, askMiriam, draft, messages, thinking]);

  const toggleListening = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognitionCtor = getRecognitionConstructor();
    if (!SpeechRecognitionCtor) {
      setError("Этот браузер не поддерживает распознавание речи. Напишите ответ в поле текста.");
      return;
    }

    try {
      const recognition = new SpeechRecognitionCtor();
      recognitionRef.current = recognition;
      recognition.lang = "he-IL";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      let finalText = "";

      recognition.onstart = () => {
        setError(null);
        setListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i]?.[0]?.transcript || "";
          if (event.results[i].isFinal) finalText += `${text} `;
          else interim += `${text} `;
        }
        const visible = normalizeLiveText(finalText || interim);
        if (visible) setDraft(visible);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        setListening(false);
        if (event.error === "not-allowed") {
          setError("Разрешите доступ к микрофону в браузере и попробуйте снова.");
        } else {
          setError("Не удалось распознать речь. Можно написать ответ текстом.");
        }
      };

      recognition.onend = () => {
        setListening(false);
        const text = normalizeLiveText(finalText);
        if (text) sendUserText(text);
      };

      recognition.start();
    } catch {
      setListening(false);
      setError("Микрофон не запустился. Попробуйте текстовый ввод.");
    }
  }, [listening, sendUserText]);

  useEffect(() => {
    if (routeState?.autoStart && !autoStartedRef.current) {
      autoStartedRef.current = true;
      startSession(routeState.level || "beginner");
    }
  }, [routeState?.autoStart, routeState?.level, startSession]);

  if (!connected && !connecting) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-background dark:from-orange-950/40 dark:via-background dark:to-background px-5 pt-5 pb-24">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold">AI Репетитор</h1>
        </div>

        <div className="mt-8 flex flex-col items-center text-center">
          <MiriamAvatar3D size={300} speaking={false} showRing />
          <h2 className="mt-5 text-2xl font-extrabold">Позвонить Мирьям</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Стабильный режим диалога: Мирьям печатает полный текст, говорит вслух и не обрывает разговор после нескольких фраз.
          </p>
        </div>

        <div className="mt-7 space-y-3">
          {(Object.keys(LEVELS) as Level[]).map((levelId) => (
            <button
              key={levelId}
              onClick={() => startSession(levelId)}
              className="w-full rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary/40"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{LEVELS[levelId].emoji}</span>
                <div>
                  <p className="font-semibold">{LEVELS[levelId].label}</p>
                  <p className="text-xs text-muted-foreground">{LEVELS[levelId].desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28 flex flex-col">
      <div className="border-b border-border px-4 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MiriamAvatar3D size={76} speaking={aiSpeaking || thinking} showRing={false} />
          <div>
            <h1 className="text-sm font-bold text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground">
              {connecting ? "Подключение..." : thinking ? "Мирьям думает..." : aiSpeaking ? "Мирьям говорит..." : listening ? "Слушаю вас..." : "Готова слушать"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="px-4 py-2 border-b border-border flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">Стабильный AI-диалог</span>
        <SpeechRateSelector variant="compact" />
      </div>

      {error && (
        <div className="mx-4 mt-3 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence initial={false}>
          {transcript.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${line.speaker === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[86%] ${line.speaker === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                {line.speaker === "miriam" && <span className="ml-1 text-xs font-medium text-muted-foreground">Мирьям</span>}
                <div className={`rounded-2xl px-4 py-2.5 text-sm space-y-1 ${line.speaker === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-card border border-border text-foreground"}`}>
                  <p dir="rtl" lang="he" className="font-hebrew text-base leading-snug text-right whitespace-pre-wrap">{line.hebrew}</p>
                  {line.russian && <p className={`text-xs leading-snug ${line.speaker === "user" ? "opacity-80" : "text-muted-foreground"}`}>{line.russian}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {liveAiText && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="max-w-[86%] flex flex-col gap-1">
              <span className="ml-1 text-xs font-medium text-muted-foreground">Мирьям</span>
              <div className="rounded-2xl rounded-bl-md bg-card border border-border px-4 py-2.5 space-y-1">
                <p dir="rtl" lang="he" className="font-hebrew text-base leading-snug text-right whitespace-pre-wrap">{liveAiText}</p>
                <p className="text-xs text-muted-foreground italic">печатает...</p>
              </div>
            </div>
          </motion.div>
        )}

        {connecting && (
          <div className="flex justify-center py-10 text-muted-foreground text-sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Подключение к Мирьям...
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur px-4 pt-3 pb-5">
        <div className="mx-auto max-w-2xl flex items-end gap-2">
          <Button
            type="button"
            variant={listening ? "destructive" : "outline"}
            size="icon"
            className="h-12 w-12 shrink-0 rounded-full"
            onClick={toggleListening}
            disabled={thinking || connecting}
            title="Сказать голосом"
          >
            {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          <div className="flex-1 rounded-2xl border border-border bg-card px-3 py-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Keyboard className="h-3.5 w-3.5" /> Ответ на иврите
            </div>
            <textarea
              dir="rtl"
              lang="he"
              rows={1}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendUserText();
                }
              }}
              placeholder="כתוב כאן או לחץ על המיקרופון..."
              className="w-full resize-none bg-transparent text-right font-hebrew text-base outline-none placeholder:text-muted-foreground"
              disabled={thinking || connecting}
            />
          </div>

          <Button
            type="button"
            size="icon"
            className="h-12 w-12 shrink-0 rounded-full"
            onClick={() => sendUserText()}
            disabled={!draft.trim() || thinking || connecting}
            title="Отправить"
          >
            {thinking ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-12 w-12 shrink-0 rounded-full"
            onClick={() => {
              const lastMiriam = [...transcript].reverse().find((line) => line.speaker === "miriam")?.hebrew;
              if (lastMiriam) speakHebrew(lastMiriam);
            }}
            disabled={thinking || aiSpeaking}
            title="Повторить последнюю реплику"
          >
            <Volume2 className="h-5 w-5" />
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="h-12 w-12 shrink-0 rounded-full"
            onClick={endSession}
            title="Завершить"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
