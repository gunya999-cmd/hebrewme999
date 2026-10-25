import { useLanguage } from "@/lib/i18n";
import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Mic, MicOff, Phone, PhoneOff, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { MiriamAvatar3D } from "@/components/MiriamAvatar3D";
import { MicDiagnostics } from "@/components/MicDiagnostics";
import { getSpeechRate } from "@/hooks/useSpeechRate";
import { getMiriamVoiceModel, miriamWebSocketUrl, translateToLanguage } from "@/lib/miriamApi";
import { SpeechRateSelector } from "@/components/SpeechRateSelector";
import { LESSONS } from "@/lib/miriamCurriculum";
import { saveAttempt } from "@/lib/miriamProgress";

/* ── Types ── */
type Level = "beginner" | "intermediate" | "advanced";
interface TranscriptLine {
  id: number;
  speaker: "miriam" | "user";
  hebrew: string;
  translation: string;
}

const LEVELS: { id: Level; label: string; emoji: string; desc: string }[] = [
  { id: "beginner", label: "Начинающий", emoji: "🌱", desc: "Простые фразы, базовая лексика" },
  { id: "intermediate", label: "Средний", emoji: "📚", desc: "Разговорные ситуации" },
  { id: "advanced", label: "Продвинутый", emoji: "🎓", desc: "Свободная речь, идиомы" },
];

// כלל תיקון שגיאות — חובה לכל הרמות:
// אם התלמיד טועה (דקדוק, הגייה, בחירת מילה, מין/מספר/זמן הפועל, מילת יחס),
// רחל חייבת לתקן בעדינות. תמיד פתחי את התיקון באחת מהפתיחות הבאות בעברית בלבד:
// «נכון לומר…», «עדיף לומר…», או «נכון להגיד…». מיד אחרי הפתיחה — אִמרי את הצורה הנכונה במלואה,
// ואז המשיכי את השיחה בשאלה קצרה. אל תשתמשי באנגלית או ברוסית כשאת מתקנת.
const CORRECTION_RULE = ` חשוב מאוד: כאשר התלמיד טועה (בדקדוק, בהגייה, בבחירת מילה, במין/מספר/זמן הפועל או במילת יחס) — תקני אותו תמיד, אך בעדינות. פתחי את התיקון באחת מהצורות הבאות בעברית בלבד: «נכון לומר…», «עדיף לומר…» או «נכון להגיד…», ומיד אחר כך אמרי את הצורה הנכונה המלאה. אחרי התיקון המשיכי את השיחה בשאלה קצרה. אם המשפט נכון — אל תתקני, רק עודדי והמשיכי. אסור להשתמש ברוסית או באנגלית גם בזמן התיקון.`;

const LEVEL_INSTRUCTIONS: Record<Level, string> = {
  beginner: `את רחל, מורה לעברית מתל אביב. דברי רק בעברית! אסור לדבר ברוסית או באנגלית. השתמשי במשפטים פשוטים מאוד של 3-5 מילים. דברי לאט וברור. נושאים: ברכות, מספרים, צבעים, אוכל, משפחה. תמיד שאלי שאלות פשוטות כדי להמשיך את השיחה. אם התלמיד לא מבין - חזרי על המשפט לאט יותר והוסיפי רמז בעברית פשוטה. היי חמה ומעודדת.${CORRECTION_RULE}`,
  intermediate: `את רחל, מורה לעברית מתל אביב. דברי רק בעברית! אסור לדבר ברוסית או באנגלית. השתמשי במשפטים של 5-10 מילים. נושאים: קניות, טיולים, עבודה, תחביבים. שאלי שאלות פתוחות כדי שהתלמיד יבנה משפטים בעצמו. תקני טעויות בעדינות. ספרי עובדות מעניינות על ישראל.${CORRECTION_RULE}`,
  advanced: `את רחל, מורה לעברית מתל אביב. דברי רק בעברית! אסור לדבר ברוסית או באנגלית. דברי בעברית טבעית כמו עם דובר שפת אם. השתמשי בסלנג, ביטויים ומטפורות. נושאים: תרבות, חדשות, פילוסופיה, הומור ושיחה יומיומית בישראל. עודדי תשובות מפורטות וויכוח. תקני טעויות סגנוניות.${CORRECTION_RULE}`,
};

type AudioWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };

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
type SpeechWindow = AudioWindow & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

function createRealtimeAudioContext(): AudioContext {
  const AudioContextCtor = window.AudioContext || (window as AudioWindow).webkitAudioContext;
  if (!AudioContextCtor) throw new Error("Ваш браузер не поддерживает живой аудио-диалог.");
  // IMPORTANT: do NOT force sampleRate on iOS — Safari/iOS only allows the device's
  // native sampleRate (usually 48000). Forcing 16000 silently breaks playback.
  return new AudioContextCtor();
}

/* ── Linear resample Float32 PCM from one rate to another ── */
function resampleLinear(input: Float32Array, fromRate: number, toRate: number): Float32Array {
  if (fromRate === toRate) return input;
  const ratio = fromRate / toRate;
  const outLen = Math.round(input.length / ratio);
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const srcIdx = i * ratio;
    const i0 = Math.floor(srcIdx);
    const i1 = Math.min(i0 + 1, input.length - 1);
    const t = srcIdx - i0;
    out[i] = input[i0] * (1 - t) + input[i1] * t;
  }
  return out;
}

/* ── AudioWorklet processor as inline blob ── */
function createWorkletBlobUrl() {
  const code = `
class PcmRecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
    this._bufferSize = 2048; // ~42ms @ 48kHz, ~128ms @ 16kHz
  }
  process(inputs) {
    const input = inputs[0];
    if (input.length > 0) {
      const channelData = input[0];
      for (let i = 0; i < channelData.length; i++) {
        this._buffer.push(channelData[i]);
      }
      while (this._buffer.length >= this._bufferSize) {
        const chunk = this._buffer.splice(0, this._bufferSize);
        // Send raw Float32 — main thread will resample to 16kHz and encode.
        this.port.postMessage({ pcm: new Float32Array(chunk) });
      }
    }
    return true;
  }
}
registerProcessor('pcm-recorder-processor', PcmRecorderProcessor);
`;
  const blob = new Blob([code], { type: "application/javascript" });
  return URL.createObjectURL(blob);
}

/* ── Convert Float32 → 16-bit PCM base64 ── */
function float32ToPcm16Base64(float32: Float32Array): string {
  const pcm16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(pcm16.buffer);
  let binary = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK)));
  }
  return btoa(binary);
}

/* ── Base64 to Float32 PCM decoder (24kHz input) ── */
function decodeBase64Pcm(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const pcm16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(pcm16.length);
  for (let i = 0; i < pcm16.length; i++) {
    float32[i] = pcm16[i] / 32768;
  }
  return float32;
}

function getMicrophoneErrorMessage(err: unknown): string {
  const error = err as { name?: string; message?: string };

  switch (error?.name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
      return "Доступ к микрофону запрещён. Разрешите микрофон в браузере и попробуйте снова.";
    case "NotFoundError":
    case "DevicesNotFoundError":
      return "Микрофон не найден. Подключите устройство и попробуйте снова.";
    case "NotReadableError":
    case "TrackStartError":
      return "Микрофон сейчас занят другим приложением.";
    case "OverconstrainedError":
    case "ConstraintNotSatisfiedError":
      return "Не удалось включить микрофон с нужными настройками.";
    default:
      return error?.message || "Не удалось включить микрофон.";
  }
}

export default function VoiceDialogue() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = location.state as {
    level?: Level;
    autoStart?: boolean;
    customInstruction?: string;
    customGreet?: string;
    customTitle?: string;
    lessonId?: string;
  } | null;
  const [level, setLevel] = useState<Level | null>(routeState?.level ?? null);
  const customInstructionRef = useRef<string | undefined>(routeState?.customInstruction);
  const customGreetRef = useRef<string | undefined>(routeState?.customGreet);
  const customTitle = routeState?.customTitle;
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [muted, setMuted] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const lessonSessionIdRef = useRef(`${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const userTurnsCountRef = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const [currentAiText, setCurrentAiText] = useState("");
  const [currentUserText, setCurrentUserText] = useState("");
  const [diagOpen, setDiagOpen] = useState(false);
  const [micDeviceId, setMicDeviceId] = useState<string | undefined>(undefined);
  const [micLevel, setMicLevel] = useState(0);
  const [speechStatus, setSpeechStatus] = useState<"off" | "listening" | "hearing" | "unsupported" | "error">("off");

  const wsRef = useRef<WebSocket | null>(null);
  const sessionStartingRef = useRef(false);
  const mountedRef = useRef(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mutedRef = useRef(false);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const playbackQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const nextLineIdRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const aiTextBufferRef = useRef("");
  const userTextBufferRef = useRef("");
  const currentPlaybackSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const monitorFrameRef = useRef<number | null>(null);
  const micLevelRef = useRef(0);
  const speechRecognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const speechTextModeRef = useRef(false);
  const recognitionShouldRunRef = useRef(false);
  const recognitionRunningRef = useRef(false);
  const recognitionRestartTimerRef = useRef<number | null>(null);
  const lastRecognizedTextRef = useRef("");
  const lastRecognizedAtRef = useRef(0);
  // True once Gemini's own inputTranscription has produced text in this session.
  // When true, Web Speech Recognition stops writing into the user transcript to
  // avoid duplicate / garbled lines (SR often mis-recognises Hebrew as Thai/Arabic).
  const geminiTranscriptionSeenRef = useRef(false);
  // Tracks whether we are currently accumulating a fresh user turn from Gemini.
  // Reset on turnComplete so the next inputTranscription starts a clean buffer.
  const userTurnActiveRef = useRef(false);
  // ── Silence-watchdog: detects when model went silent after a user turn
  const silenceWatchdogRef = useRef<number | null>(null);
  const lastModelActivityAtRef = useRef(0);
  const awaitingModelReplyRef = useRef(false);
  const nudgeAttemptsRef = useRef(0);
  const lastUserTurnAtRef = useRef(0);
  // Auto-retry on transient WebSocket failures (network drop, server error, protocol)
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<number | null>(null);
  const MAX_RETRIES = 2;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [transcript, currentAiText, currentUserText]);

  // Build friendly Russian error messages for WebSocket close codes.
  const formatCloseError = useCallback((code: number, reason: string, willRetry: boolean, attempt: number) => {
    const retrySuffix = willRetry
      ? ` Повторная попытка ${attempt} из ${MAX_RETRIES}…`
      : " Попробуйте начать разговор заново.";
    switch (code) {
      case 1006:
        return `Соединение разорвано — проверьте интернет.${retrySuffix}`;
      case 1007:
        return `Ошибка протокола (1007): сервер отклонил данные.${retrySuffix}`;
      case 1008:
        return `Запрос отклонён сервером (1008). Проверьте уровень и инструкции.${retrySuffix}`;
      case 1011:
        return `Внутренняя ошибка сервиса (1011).${retrySuffix}`;
      case 1013:
        return `Сервис временно перегружен (1013).${retrySuffix}`;
      case 4008:
      case 4029:
        return `Превышен лимит запросов (${code}). Подождите немного и попробуйте снова.`;
      default:
        return `Соединение закрыто (${code}${reason ? `: ${reason}` : ""}).${retrySuffix}`;
    }
  }, []);

  const stopPlaybackSource = useCallback(() => {
    const currentSource = currentPlaybackSourceRef.current;
    if (!currentSource) return;

    currentPlaybackSourceRef.current = null;
    currentSource.onended = null;
    try {
      currentSource.stop(0);
    } catch {
      // source might already be stopped
    }
    currentSource.disconnect();
  }, []);

  const stopVoiceActivityMonitor = useCallback(() => {
    if (monitorFrameRef.current !== null) {
      cancelAnimationFrame(monitorFrameRef.current);
      monitorFrameRef.current = null;
    }
    micLevelRef.current = 0;
    setMicLevel(0);
  }, []);

  const stopSpeechRecognition = useCallback(() => {
    recognitionShouldRunRef.current = false;
    if (recognitionRestartTimerRef.current !== null) {
      window.clearTimeout(recognitionRestartTimerRef.current);
      recognitionRestartTimerRef.current = null;
    }
    const recognition = speechRecognitionRef.current;
    speechRecognitionRef.current = null;
    speechTextModeRef.current = false;
    recognitionRunningRef.current = false;
    if (recognition) {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch {
        recognition.abort?.();
      }
    }
    setSpeechStatus("off");
  }, []);

  const sendRealtimeInput = useCallback((input: Record<string, unknown>) => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ realtimeInput: input }));
  }, []);

  /* ── Silence watchdog: detect "model went silent" and nudge it ── */
  const SILENCE_TIMEOUT_MS = 10000;
  const MAX_NUDGES = 1;
  const NUDGE_TEXT_HE = "תמשיכי בבקשה. עני לי בעברית פשוטה."; // "Please continue. Reply in simple Hebrew."

  const clearSilenceWatchdog = useCallback(() => {
    if (silenceWatchdogRef.current !== null) {
      window.clearTimeout(silenceWatchdogRef.current);
      silenceWatchdogRef.current = null;
    }
  }, []);

  const sendNudgeRef = useRef<() => void>(() => {});

  const armSilenceWatchdog = useCallback(() => {
    if (silenceWatchdogRef.current !== null) {
      window.clearTimeout(silenceWatchdogRef.current);
    }
    silenceWatchdogRef.current = window.setTimeout(() => {
      silenceWatchdogRef.current = null;
      if (!awaitingModelReplyRef.current) return;
      if (lastModelActivityAtRef.current >= lastUserTurnAtRef.current) return;
      if (wsRef.current?.readyState !== WebSocket.OPEN) return;
      if (nudgeAttemptsRef.current >= MAX_NUDGES) {
        console.warn("[SilenceWatchdog] giving up after", nudgeAttemptsRef.current, "nudges");
        awaitingModelReplyRef.current = false;
        return;
      }
      sendNudgeRef.current();
    }, SILENCE_TIMEOUT_MS);
  }, []);

  const sendUserTextTurn = useCallback((text: string) => {
    const cleanText = text.trim();
    if (!cleanText || wsRef.current?.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({
      clientContent: {
        turns: [{ role: "user", parts: [{ text: cleanText }] }],
        turnComplete: true,
      },
    }));
    lastUserTurnAtRef.current = Date.now();
    awaitingModelReplyRef.current = true;
    nudgeAttemptsRef.current = 0;
    armSilenceWatchdog();
  }, [armSilenceWatchdog]);

  const sendNudge = useCallback(() => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;
    console.warn("[SilenceWatchdog] model is silent → sending nudge", { attempt: nudgeAttemptsRef.current + 1 });
    wsRef.current.send(JSON.stringify({
      clientContent: {
        turns: [{ role: "user", parts: [{ text: NUDGE_TEXT_HE }] }],
        turnComplete: true,
      },
    }));
    nudgeAttemptsRef.current += 1;
    armSilenceWatchdog();
  }, [armSilenceWatchdog]);

  useEffect(() => {
    sendNudgeRef.current = sendNudge;
  }, [sendNudge]);

  const markModelActivity = useCallback(() => {
    lastModelActivityAtRef.current = Date.now();
  }, []);

  const markModelTurnComplete = useCallback(() => {
    awaitingModelReplyRef.current = false;
    nudgeAttemptsRef.current = 0;
    clearSilenceWatchdog();
  }, [clearSilenceWatchdog]);

  const sendAudioStreamEnd = useCallback(() => {
    if (wsRef.current?.readyState !== WebSocket.OPEN) return;
    // Correct shape: realtimeInput.audioStreamEnd is a top-level boolean field
    wsRef.current.send(JSON.stringify({ realtimeInput: { audioStreamEnd: true } }));
  }, []);

  /* ── Play queued audio chunks ── */
  const playNextChunk = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx || playbackQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setAiSpeaking(false);
      return;
    }
    isPlayingRef.current = true;
    setAiSpeaking(true);

    // iOS Safari requires the context to be running. Re-resume defensively.
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => { /* ignore */ });
    }

    const chunk = playbackQueueRef.current.shift()!;
    // Gemini sends 24kHz PCM. Resample to the AudioContext's actual sampleRate
    // so iOS Safari plays it correctly (it does not auto-resample mismatched buffers).
    const targetRate = ctx.sampleRate;
    const resampled = resampleLinear(chunk, 24000, targetRate);
    const buffer = ctx.createBuffer(1, resampled.length, targetRate);
    buffer.getChannelData(0).set(resampled);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    try { source.playbackRate.value = getSpeechRate(); } catch { /* ignore */ }
    source.connect(ctx.destination);
    currentPlaybackSourceRef.current = source;
    source.onended = () => {
      if (currentPlaybackSourceRef.current === source) {
        currentPlaybackSourceRef.current = null;
      }
      playNextChunk();
    };
    source.start();
  }, []);

  const enqueueAudio = useCallback((base64: string) => {
    const pcm = decodeBase64Pcm(base64);
    playbackQueueRef.current.push(pcm);
    if (!isPlayingRef.current) playNextChunk();
  }, [playNextChunk]);

  /* ── Interrupt: stop AI playback ── */
  const interruptPlayback = useCallback(() => {
    playbackQueueRef.current = [];
    isPlayingRef.current = false;
    stopPlaybackSource();
    setAiSpeaking(false);
  }, [stopPlaybackSource]);

  const cleanupMedia = useCallback(() => {
    stopVoiceActivityMonitor();
    stopSpeechRecognition();
    interruptPlayback();
    if (workletNodeRef.current) {
      workletNodeRef.current.port.onmessage = null;
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    const context = audioCtxRef.current;
    audioCtxRef.current = null;
    if (context) void context.close().catch(() => {});
    analyserRef.current = null;
  }, [interruptPlayback, stopSpeechRecognition, stopVoiceActivityMonitor]);

  const startVoiceActivityMonitor = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const samples = new Float32Array(analyser.fftSize);
    stopVoiceActivityMonitor();

    const tick = () => {
      analyser.getFloatTimeDomainData(samples);

      let energy = 0;
      for (let i = 0; i < samples.length; i++) {
        energy += samples[i] * samples[i];
      }

      const rms = Math.sqrt(energy / samples.length);
      const nextLevel = Math.min(100, Math.round(rms * 450));
      if (Math.abs(nextLevel - micLevelRef.current) >= 2) {
        micLevelRef.current = nextLevel;
        setMicLevel(nextLevel);
      }

      // NOTE: client-side barge-in disabled. Mic echo from speakers used to
      // cut Miriam off mid-word. Interruption is now handled exclusively by
      // Gemini's serverContent.interrupted signal.

      monitorFrameRef.current = requestAnimationFrame(tick);
    };

    monitorFrameRef.current = requestAnimationFrame(tick);
  }, [stopVoiceActivityMonitor]);

  // Show the Hebrew text immediately. Translation is enrichment, not a reason
  // to hide a spoken turn or lose it when the translation endpoint times out.
  const appendTranscript = useCallback((speaker: TranscriptLine["speaker"], hebrew: string) => {
    const id = nextLineIdRef.current++;
    setTranscript(prev => [...prev, { id, speaker, hebrew, translation: "" }]);
    void translateToLanguage(hebrew, language).then(translation => {
      if (translation) {
        setTranscript(prev => prev.map(line => line.id === id ? { ...line, translation } : line));
      }
    });
  }, [language]);

  const flushAiText = useCallback(() => {
    const text = aiTextBufferRef.current.trim();
    if (!text) return;
    aiTextBufferRef.current = "";
    setCurrentAiText("");
    appendTranscript("miriam", text);
  }, [appendTranscript]);

  const flushUserText = useCallback(() => {
    const text = userTextBufferRef.current.trim();
    userTextBufferRef.current = "";
    setCurrentUserText("");
    userTurnActiveRef.current = false;
    if (!text) return;
    // Each completed speech turn counts, including intentionally repeated words.
    userTurnsCountRef.current += 1;
    const lesson = LESSONS.find(item => item.id === routeState?.lessonId);
    if (lesson) {
      try {
        saveAttempt(lesson.id, userTurnsCountRef.current, lesson.vocabulary, lessonSessionIdRef.current);
      } catch (error) { console.warn("Lesson attempt persistence failed", error); }
    }
    appendTranscript("user", text);
  }, [appendTranscript, routeState?.lessonId]);

  const startSpeechRecognition = useCallback(() => {
    const SpeechRecognitionCtor =
      (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      speechTextModeRef.current = false;
      setSpeechStatus("unsupported");
      return false;
    }

    stopSpeechRecognition();
    speechTextModeRef.current = true;
    recognitionShouldRunRef.current = true;

    const recognition = new SpeechRecognitionCtor();
    speechRecognitionRef.current = recognition;
    recognition.lang = "he-IL";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      recognitionRunningRef.current = true;
      if (!mutedRef.current) setSpeechStatus("listening");
    };

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      if (mutedRef.current) return;

      let interim = "";
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i]?.[0]?.transcript?.trim() || "";
        if (!text) continue;
        if (event.results[i].isFinal) finalText += `${text} `;
        else interim += `${text} `;
      }

      const visibleText = (finalText || interim).trim();
      if (visibleText) setSpeechStatus("hearing");

      // Barge-in via SR disabled: SR often re-recognises Miriam's own voice
      // through the speakers and was cutting her off mid-sentence.

      // Web SpeechRecognition is unreliable for Hebrew on most browsers
      // (it mis-recognises he-IL as Thai/Arabic/romanised). Since we now
      // ALWAYS stream the user's audio to Gemini, the model's
      // inputTranscription is the authoritative source of the user's words.
      // We therefore never write SR text into the transcript, and never
      // forward SR text to Gemini as a fake user turn — it would corrupt
      // the conversation.
      // SR is kept enabled purely for barge-in detection and to drive the
      // "слушаю / слышу" indicator in the UI.
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
      if (event?.error === "no-speech" || event?.error === "aborted") return;
      console.warn("[SpeechRecognition] error:", event?.error || event);
      speechTextModeRef.current = false;
      recognitionShouldRunRef.current = false;
      setSpeechStatus("error");
    };

    recognition.onend = () => {
      recognitionRunningRef.current = false;
      if (!recognitionShouldRunRef.current) return;
      recognitionRestartTimerRef.current = window.setTimeout(() => {
        recognitionRestartTimerRef.current = null;
        if (!recognitionShouldRunRef.current || mutedRef.current) return;
        try {
          recognition.start();
        } catch {
          // Recognition may already be starting; the next onend will retry.
        }
      }, 250);
    };

    try {
      recognition.start();
      return true;
    } catch (err) {
      console.warn("[SpeechRecognition] start failed:", err);
      speechTextModeRef.current = false;
      setSpeechStatus("error");
      return false;
    }
  }, [stopSpeechRecognition]);

  /* ── Connect to Gemini Live ── */
  const startSession = useCallback(async (selectedLevel: Level) => {
    if (connecting || connected || sessionStartingRef.current || wsRef.current) return;
    sessionStartingRef.current = true;
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }

    setLevel(selectedLevel);
    mutedRef.current = false;
    setMuted(false);
    setConnecting(true);
    setError(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Браузер не поддерживает доступ к микрофону. Откройте приложение в Chrome, Edge или Safari по HTTPS.");
      }

      // Unlock playback in the user's tap gesture (iOS Safari). Check the
      // fail-closed same-origin service before requesting microphone access.
      const audioCtx = createRealtimeAudioContext();
      audioCtxRef.current = audioCtx;
      await audioCtx.resume();
      const model = await getMiriamVoiceModel();
      if (!mountedRef.current) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          ...(micDeviceId ? { deviceId: { exact: micDeviceId } } : {}),
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      if (!mountedRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      streamRef.current = stream;

      const inputSampleRate = Math.round(audioCtx.sampleRate);

      // Setup AudioWorklet
      const workletUrl = createWorkletBlobUrl();
      try {
        await audioCtx.audioWorklet.addModule(workletUrl);
      } finally {
        URL.revokeObjectURL(workletUrl);
      }
      if (!mountedRef.current) return;
      const workletNode = new AudioWorkletNode(audioCtx, "pcm-recorder-processor");
      workletNodeRef.current = workletNode;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.15;
      analyserRef.current = analyser;
      source.connect(analyser);
      source.connect(workletNode);

      const silentGain = audioCtx.createGain();
      silentGain.gain.value = 0;
      workletNode.connect(silentGain);
      silentGain.connect(audioCtx.destination);
      startVoiceActivityMonitor();

      // Connect WebSocket to Gemini Live API (native audio)
      const ws = new WebSocket(miriamWebSocketUrl());
      wsRef.current = ws;

      ws.onopen = () => {
        // Send setup message — native audio supports only AUDIO modality;
        // transcription comes via inputAudioTranscription / outputAudioTranscription.
        const setup = {
          setup: {
            model: `models/${model}`,
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: "Aoede",
                  },
                },
              },
            },
            realtimeInputConfig: {
              automaticActivityDetection: {
                startOfSpeechSensitivity: "START_SENSITIVITY_LOW",
                endOfSpeechSensitivity: "END_SENSITIVITY_LOW",
                prefixPaddingMs: 300,
                silenceDurationMs: 1200,
              },
              activityHandling: "START_OF_ACTIVITY_INTERRUPTS",
            },
            systemInstruction: {
              parts: [{ text: customInstructionRef.current || LEVEL_INSTRUCTIONS[selectedLevel] }],
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },
        };
        ws.send(JSON.stringify(setup));
      };

      ws.onmessage = async (event) => {
        try {
          // Server may send Blob or string
          const raw = typeof event.data === "string"
            ? event.data
            : await (event.data as Blob).text();
          const msg = JSON.parse(raw);

          // Setup complete
          if (msg.setupComplete) {
            sessionStartingRef.current = false;
            setConnected(true);
            setConnecting(false);
            setSpeechStatus("listening");
            setError(null);
            retryCountRef.current = 0;
            geminiTranscriptionSeenRef.current = false;
            userTurnActiveRef.current = false;
            userTextBufferRef.current = "";
            lastRecognizedTextRef.current = "";

            // Start sending audio from worklet → resample to 16kHz (Gemini's preferred input rate).
            const TARGET_INPUT_RATE = 16000;
            workletNode.port.onmessage = (e) => {
              if (mutedRef.current || !e.data?.pcm) return;
              // Keep duplex audio active while Rachel speaks so users can
              // interrupt naturally. Browser echo cancellation limits feedback.
              const float32 = e.data.pcm as Float32Array;
              const resampled = resampleLinear(float32, inputSampleRate, TARGET_INPUT_RATE);
              const base64 = float32ToPcm16Base64(resampled);
              sendRealtimeInput({
                audio: {
                  mimeType: `audio/pcm;rate=${TARGET_INPUT_RATE}`,
                  data: base64,
                },
              });
            };
            startSpeechRecognition();

            // Ask Miriam to start the dialogue
            const greetMsg = {
              clientContent: {
                turns: [{
                  role: "user",
                  parts: [{ text: customGreetRef.current || "התחל את השיחה עכשיו. ברך אותי בקצרה בעברית ושאל שאלה אחת פתוחה." }],
                }],
                turnComplete: true,
              },
            };
            ws.send(JSON.stringify(greetMsg));
            // Watch for "model went silent" right after greeting too
            lastUserTurnAtRef.current = Date.now();
            awaitingModelReplyRef.current = true;
            nudgeAttemptsRef.current = 0;
            armSilenceWatchdog();
            return;
          }

          // Server content
          if (msg.serverContent) {
            // Audio chunks from model
            const parts = msg.serverContent.modelTurn?.parts || [];
            for (const part of parts) {
              if (part.inlineData?.data) {
                markModelActivity();
                enqueueAudio(part.inlineData.data);
              }
            }

            // Output transcription (Hebrew text of Miriam's speech)
            const outText = msg.serverContent.outputTranscription?.text;
            if (outText) {
              markModelActivity();
              aiTextBufferRef.current += outText;
              setCurrentAiText(aiTextBufferRef.current);
            }

            // Input transcription (Hebrew text of user's speech) from Gemini —
            // this is the AUTHORITATIVE source of the user's words. Web Speech is
            // only a fallback / barge-in trigger and must not write to the transcript
            // once Gemini transcription is active.
            const inText = msg.serverContent.inputTranscription?.text;
            if (inText) {
              geminiTranscriptionSeenRef.current = true;
              // New user turn → start a clean buffer (don't append to leftover SR text)
              if (!userTurnActiveRef.current) {
                userTextBufferRef.current = "";
                userTurnActiveRef.current = true;
              }
              userTextBufferRef.current += inText;
              setCurrentUserText(userTextBufferRef.current);
              lastUserTurnAtRef.current = Date.now();
              awaitingModelReplyRef.current = true;
              if (silenceWatchdogRef.current === null) armSilenceWatchdog();
            }

            // Turn complete — flush both buffers and stop watchdog
            if (msg.serverContent.turnComplete || msg.serverContent.generationComplete) {
              markModelActivity();
              markModelTurnComplete();
              flushUserText();
              flushAiText();
            }

            // Server signals interruption (barge-in)
            if (msg.serverContent.interrupted) {
              markModelActivity();
              interruptPlayback();
              flushAiText();
            }
          }

        } catch (err) {
          console.error("WS message parse error:", err);
        }
      };

      ws.onerror = (e) => {
        if (wsRef.current !== ws) return;
        console.error("[Gemini] WebSocket error:", e);
        setError("Ошибка подключения к голосовому сервису");
        setConnecting(false);
      };

      ws.onclose = (e) => {
        // Ignore delayed events from a previously closed/retried connection.
        if (wsRef.current !== ws) return;
        wsRef.current = null;
        sessionStartingRef.current = false;
        console.info("[Gemini] WebSocket closed:", e.code, e.reason || "(no reason)");
        flushUserText();
        flushAiText();
        clearSilenceWatchdog();
        awaitingModelReplyRef.current = false;
        cleanupMedia();
        setConnected(false);
        setConnecting(false);
        if (e.code === 1000) {
          retryCountRef.current = 0;
          return;
        }
        const retriable = [1001, 1006, 1011, 1013].includes(e.code);
        const canRetry = retriable && retryCountRef.current < MAX_RETRIES;
        if (canRetry) {
          retryCountRef.current += 1;
          const attempt = retryCountRef.current;
          setError(formatCloseError(e.code, e.reason, true, attempt));
          if (retryTimerRef.current !== null) window.clearTimeout(retryTimerRef.current);
          retryTimerRef.current = window.setTimeout(() => {
            retryTimerRef.current = null;
            startSession(selectedLevel);
          }, 800 * attempt);
        } else {
          retryCountRef.current = 0;
          setError(formatCloseError(e.code, e.reason, false, 0));
          userTurnsCountRef.current = 0;
          lessonSessionIdRef.current = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        }
      };

    } catch (err) {
      console.error("startSession error:", err);
      const oldSocket = wsRef.current;
      wsRef.current = null;
      oldSocket?.close(1000);
      cleanupMedia();
      sessionStartingRef.current = false;
      setConnected(false);
      if (mountedRef.current) setError(getMicrophoneErrorMessage(err));
      setConnecting(false);
    }
  }, [connected, connecting, micDeviceId, armSilenceWatchdog, cleanupMedia, enqueueAudio, flushAiText, flushUserText, sendRealtimeInput, startSpeechRecognition, startVoiceActivityMonitor, clearSilenceWatchdog, formatCloseError, markModelActivity, markModelTurnComplete]);


  /* ── Disconnect ── */
  const endSession = useCallback(() => {
    flushUserText();
    flushAiText();
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    retryCountRef.current = 0;
    clearSilenceWatchdog();
    awaitingModelReplyRef.current = false;
    nudgeAttemptsRef.current = 0;
    sendAudioStreamEnd();
    const socket = wsRef.current;
    wsRef.current = null;
    socket?.close(1000);
    cleanupMedia();
    sessionStartingRef.current = false;
    mutedRef.current = false;
    setMuted(false);
    setConnected(false);
    setConnecting(false);
    userTurnsCountRef.current = 0;
    lessonSessionIdRef.current = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }, [cleanupMedia, clearSilenceWatchdog, flushAiText, flushUserText, sendAudioStreamEnd]);

  /* ── Toggle mute ── */
  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const newVal = !prev;
      mutedRef.current = newVal;
      streamRef.current?.getAudioTracks().forEach(t => { t.enabled = !newVal; });
        if (speechTextModeRef.current) {
          if (newVal) {
            recognitionShouldRunRef.current = false;
            try { speechRecognitionRef.current?.stop(); } catch (error) { console.debug("Speech recognition stop ignored", error); }
            setSpeechStatus("off");
          } else {
            recognitionShouldRunRef.current = true;
            try {
              if (!recognitionRunningRef.current) speechRecognitionRef.current?.start();
            } catch (error) { console.debug("Speech recognition start ignored", error); }
            setSpeechStatus("listening");
          }
        }
      // NOTE: do NOT send audioStreamEnd here — that permanently closes the input
      // audio stream on the server. We just stop sending PCM frames while muted.
      return newVal;
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      sessionStartingRef.current = false;
      if (retryTimerRef.current !== null) window.clearTimeout(retryTimerRef.current);
      const socket = wsRef.current;
      wsRef.current = null;
      socket?.close(1000);
      cleanupMedia();
    };
  }, [cleanupMedia]);

  // Auto-start when navigating with autoStart=true (e.g. from custom game pages)
  const autoStartTriedRef = useRef(false);
  useEffect(() => {
    if (autoStartTriedRef.current) return;
    if (routeState?.autoStart && level && !connected && !connecting) {
      autoStartTriedRef.current = true;
      startSession(level);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  /* ── Level selection screen ── */
  if (!level) {
    return (
      <div className="min-h-screen bg-background pb-20 flex flex-col">
        <div className="px-4 pt-6 pb-3 border-b border-border flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">{t("Голосовой диалог")}</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
            <MiriamAvatar3D size={280} speaking={false} />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
              <span className="text-xs">🎙</span>
            </div>
          </motion.div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">{t("Ракель")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("Голосовой диалог на иврите в реальном времени")}</p>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs">
              {t("Говорите с Ракель голосом только на иврите. Можно перебивать в любой момент. Перевод на русский появляется в текстовом окне.")}
            </p>
          </div>
          <div className="w-full max-w-sm space-y-3">
            {LEVELS.map((l) => (
              <motion.button
                key={l.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => startSession(l.id)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:bg-accent transition-colors text-left"
              >
                <span className="text-2xl">{l.emoji}</span>
                <div>
                  <p className="font-semibold text-foreground">{t(l.label)}</p>
                  <p className="text-xs text-muted-foreground">{t(l.desc)}</p>
                </div>
              </motion.button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setDiagOpen(true)}
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <Settings2 className="w-3.5 h-3.5" />
            {t("Проверить микрофон")}
          </button>
        </div>
        <MicDiagnostics
          open={diagOpen}
          onOpenChange={setDiagOpen}
          selectedDeviceId={micDeviceId}
          onDeviceChange={setMicDeviceId}
        />
      </div>
    );
  }

  /* ── Active dialogue screen ── */
  return (
    <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 pb-3 pt-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            <MiriamAvatar3D size={56} speaking={aiSpeaking} showRing={false} />
            {aiSpeaking && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary pointer-events-none"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="max-w-[190px] truncate text-sm font-bold text-foreground sm:max-w-none">
              {customTitle || `${t("Ракель")} — ${t(LEVELS.find(l => l.id === level)?.label || "")}`}
            </h1>
            <p className="text-xs text-muted-foreground">
              {connecting ? t("Подключение...") : connected ? (aiSpeaking ? t("🗣 Говорит...") : speechStatus === "hearing" ? t("🎙 Слышу вас...") : t("🎧 Слушает...")) : t("Отключено")}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDiagOpen(true)}
          aria-label={t("Проверить микрофон")}
          title={t("Проверить микрофон")}
        >
          <Settings2 className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex shrink-0 justify-end border-b border-border px-4 py-2"><SpeechRateSelector variant="compact" /></div>

      {/* Compact speaking avatar in the header leaves space for the dialogue. */}
      <MicDiagnostics
        open={diagOpen}
        onOpenChange={setDiagOpen}
        selectedDeviceId={micDeviceId}
        onDeviceChange={setMicDeviceId}
      />

      {/* Error */}
      {error && (
        <div role="alert" className="mx-4 mt-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {t(error)}
        </div>
      )}

      {/* Hebrew transcript with translation in the selected interface language */}
      <div ref={scrollRef} aria-label={t("История диалога")} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <AnimatePresence>
          {transcript.map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${line.speaker === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] ${line.speaker === "user" ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                {line.speaker === "miriam" && (
                  <span className="text-xs text-muted-foreground font-medium ml-1">{t("Ракель")}</span>
                )}
                <div className={`rounded-2xl px-4 py-2.5 text-sm space-y-1 ${
                  line.speaker === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md"
                }`}>
                  {line.hebrew && (
                    <p dir="rtl" lang="he" className="font-hebrew text-base leading-snug text-right">
                      {line.hebrew}
                    </p>
                  )}
                  {line.translation && (
                    <p className={`text-xs leading-snug ${
                      line.speaker === "user" ? "opacity-80" : "text-muted-foreground"
                    }`}>
                      {line.translation}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Live AI text — Hebrew + translating placeholder */}
        {currentAiText && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="max-w-[85%] flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground font-medium ml-1">{t("Ракель")}</span>
              <div className="rounded-2xl rounded-bl-md px-4 py-2.5 text-sm bg-card border border-border text-foreground space-y-1">
                <p dir="rtl" lang="he" className="font-hebrew text-base leading-snug text-right">
                  {currentAiText}
                </p>
                <p className="text-xs text-muted-foreground italic">{t("переводится...")}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Live user text — Hebrew + translating placeholder */}
        {currentUserText && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
            <div className="max-w-[85%]">
              <div className="rounded-2xl rounded-br-md px-4 py-2.5 text-sm bg-primary/80 text-primary-foreground space-y-1">
                <p dir="rtl" lang="he" className="font-hebrew text-base leading-snug text-right">
                  {currentUserText}
                </p>
                <p className="text-xs italic opacity-70">{t("переводится...")}</p>
              </div>
            </div>
          </motion.div>
        )}


        {/* Connecting state */}
        {connecting && (
          <div className="flex justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <motion.div
                className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-sm text-muted-foreground">{t("Подключение к Ракель...")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="shrink-0 border-t border-border bg-background px-4 pb-24 pt-3">
        <div className="flex items-center justify-center gap-4">
          {connected ? (
            <>
              <Button
                size="icon"
                variant={muted ? "destructive" : "outline"}
                className="w-14 h-14 rounded-full"
                onClick={toggleMute}
                aria-label={t(muted ? "Включить микрофон" : "Выключить микрофон")}
                title={t(muted ? "Включить микрофон" : "Выключить микрофон")}
              >
                {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>

              <Button
                size="icon"
                variant="destructive"
                className="w-16 h-16 rounded-full"
                onClick={endSession}
                aria-label={t("Завершить разговор")}
                title={t("Завершить разговор")}
              >
                <PhoneOff className="w-7 h-7" />
              </Button>
            </>
          ) : !connecting ? (
            <Button
              size="lg"
              className="rounded-full px-8 gap-2"
              onClick={() => startSession(level)}
            >
              <Phone className="w-5 h-5" />
              {t("Позвонить Ракель")}
            </Button>
          ) : null}
        </div>
        {connected && !muted && (
          <div className="mt-3 flex flex-col items-center gap-2">
            <motion.p
              className="text-xs text-center text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎙 Говорите на иврите{speechStatus === "unsupported" ? " — включён аудиорежим" : ""}...
            </motion.p>
            <div className="h-1.5 w-36 rounded-full bg-muted overflow-hidden" aria-hidden="true">
              <div
                className="h-full rounded-full bg-primary transition-all duration-100"
                style={{ width: `${Math.min(100, micLevel)}%` }}
              />
            </div>
          </div>
        )}
        {connected && muted && (
          <p className="text-xs text-center text-destructive mt-3">{t("Микрофон выключен")}</p>
        )}
      </div>
    </div>
  );
}
