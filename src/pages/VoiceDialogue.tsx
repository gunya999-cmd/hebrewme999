import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Mic, MicOff, Phone, PhoneOff, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import tutorAvatar from "@/assets/tutor-avatar.png";

/* ── Types ── */
type Level = "beginner" | "intermediate" | "advanced";
interface TranscriptLine {
  id: number;
  speaker: "miriam" | "user";
  hebrew: string;
  russian: string;
}

const LEVELS: { id: Level; label: string; emoji: string; desc: string }[] = [
  { id: "beginner", label: "Начинающий", emoji: "🌱", desc: "Простые фразы, базовая лексика" },
  { id: "intermediate", label: "Средний", emoji: "📚", desc: "Разговорные ситуации" },
  { id: "advanced", label: "Продвинутый", emoji: "🎓", desc: "Свободная речь, идиомы" },
];

const LEVEL_INSTRUCTIONS: Record<Level, string> = {
  beginner: `אתה מרים, מורה לעברית מתל אביב. דבר רק בעברית! אסור לדבר ברוסית או באנגלית. השתמש במשפטים פשוטים מאוד של 3-5 מילים. דבר לאט וברור. נושאים: ברכות, מספרים, צבעים, אוכל, משפחה. תמיד שאל שאלות פשוטות כדי להמשיך את השיחה. אם התלמיד לא מבין - חזור על המשפט לאט יותר ותוסיף רמז בעברית פשוטה. היה חם ומעודד.`,
  intermediate: `אתה מרים, מורה לעברית מתל אביב. דבר רק בעברית! אסור לדבר ברוסית או באנגלית. השתמש במשפטים של 5-10 מילים. נושאים: קניות, טיולים, עבודה, תחביבים. שאל שאלות פתוחות כדי שהתלמיד יבנה משפטים בעצמו. תקן טעויות בעדינות. ספר עובדות מעניינות על ישראל.`,
  advanced: `אתה מרים, מורה לעברית מתל אביב. דבר רק בעברית! אסור לדבר ברוסית או באנגלית. דבר בעברית טבעית כמו עם דובר שפת אם. השתמש בסלנג, ביטויים ומטפורות. נושאים: פוליטיקה, תרבות, חדשות, פילוסופיה, הומור. עודד תשובות מפורטות וויכוח. תקן טעויות סגנוניות.`,
};

const CONFIG_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini-voice-config`;
const TRANSLATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-dialogue`;

/* ── AudioWorklet processor as inline blob ── */
function createWorkletBlobUrl() {
  const code = `
class PcmRecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
    this._bufferSize = 2048;
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
        const pcm16 = new Int16Array(chunk.length);
        for (let i = 0; i < chunk.length; i++) {
          const s = Math.max(-1, Math.min(1, chunk[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        const bytes = new Uint8Array(pcm16.buffer);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        this.port.postMessage({ pcmBase64: btoa(binary) });
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

/* ── Translate helper ── */
async function translateToRussian(text: string): Promise<string> {
  try {
    const resp = await fetch(TRANSLATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ action: "translate", text }),
    });
    if (!resp.ok) return "";
    const data = await resp.json();
    return data.translation || "";
  } catch {
    return "";
  }
}

export default function VoiceDialogue() {
  const navigate = useNavigate();
  const location = useLocation();
  const [level, setLevel] = useState<Level | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [muted, setMuted] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentAiText, setCurrentAiText] = useState("");
  const [currentUserText, setCurrentUserText] = useState("");
  const autoStartedRef = useRef(false);

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const playbackQueueRef = useRef<Float32Array[]>([]);
  const isPlayingRef = useRef(false);
  const nextLineIdRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const aiTextBufferRef = useRef("");
  const userTextBufferRef = useRef("");

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [transcript, currentAiText, currentUserText]);

  /* ── Play queued audio chunks ── */
  const playNextChunk = useCallback(() => {
    if (!audioCtxRef.current || playbackQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      setAiSpeaking(false);
      return;
    }
    isPlayingRef.current = true;
    setAiSpeaking(true);

    const chunk = playbackQueueRef.current.shift()!;
    const buffer = audioCtxRef.current.createBuffer(1, chunk.length, 24000);
    buffer.getChannelData(0).set(chunk);
    const source = audioCtxRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtxRef.current.destination);
    source.onended = () => playNextChunk();
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
    setAiSpeaking(false);
  }, []);

  /* ── Flush AI text buffer to transcript ── */
  const flushAiText = useCallback(async () => {
    const text = aiTextBufferRef.current.trim();
    if (!text) return;
    aiTextBufferRef.current = "";
    setCurrentAiText("");
    const russian = await translateToRussian(text);
    const id = nextLineIdRef.current++;
    setTranscript(prev => [...prev, { id, speaker: "miriam", hebrew: text, russian }]);
  }, []);

  /* ── Flush user text buffer to transcript ── */
  const flushUserText = useCallback(async () => {
    const text = userTextBufferRef.current.trim();
    if (!text) return;
    userTextBufferRef.current = "";
    setCurrentUserText("");
    const russian = await translateToRussian(text);
    const id = nextLineIdRef.current++;
    setTranscript(prev => [...prev, { id, speaker: "user", hebrew: text, russian }]);
  }, []);

  /* ── Connect to Gemini Live ── */
  const startSession = useCallback(async (selectedLevel: Level) => {
    setLevel(selectedLevel);
    setConnecting(true);
    setError(null);

    try {
      // Get API key
      const configResp = await fetch(CONFIG_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({}),
      });
      if (!configResp.ok) throw new Error("Не удалось получить конфигурацию");
      const { apiKey } = await configResp.json();

      // Create audio context
      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;

      // Get mic stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true, noiseSuppression: true } });
      streamRef.current = stream;

      // Setup AudioWorklet
      const workletUrl = createWorkletBlobUrl();
      await audioCtx.audioWorklet.addModule(workletUrl);
      URL.revokeObjectURL(workletUrl);
      const workletNode = new AudioWorkletNode(audioCtx, "pcm-recorder-processor");
      workletNodeRef.current = workletNode;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(workletNode);
      workletNode.connect(audioCtx.destination); // needed for worklet to process

      // Connect WebSocket to Gemini
      const model = "gemini-2.5-flash-preview-native-audio-dialog";
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        // Send setup message
        const setup = {
          setup: {
            model: `models/${model}`,
            generation_config: {
              response_modalities: ["AUDIO", "TEXT"],
              speech_config: {
                voice_config: {
                  prebuilt_voice_config: {
                    voice_name: "Aoede",
                  },
                },
                language_code: "iw-IL",
              },
            },
            system_instruction: {
              parts: [{ text: LEVEL_INSTRUCTIONS[selectedLevel] }],
            },
          },
        };
        ws.send(JSON.stringify(setup));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          // Setup complete
          if (msg.setupComplete) {
            setConnected(true);
            setConnecting(false);

            // Start sending audio from worklet
            workletNode.port.onmessage = (e) => {
              if (wsRef.current?.readyState === WebSocket.OPEN && !muted) {
                const audioMsg = {
                  realtimeInput: {
                    mediaChunks: [{
                      mimeType: "audio/pcm;rate=16000",
                      data: e.data.pcmBase64,
                    }],
                  },
                };
                wsRef.current.send(JSON.stringify(audioMsg));
              }
            };

            // Send initial greeting request
            const greetMsg = {
              clientContent: {
                turns: [{
                  role: "user",
                  parts: [{ text: "שלום! בואי נתחיל שיחה." }],
                }],
                turnComplete: true,
              },
            };
            ws.send(JSON.stringify(greetMsg));
            return;
          }

          // Server content (AI response)
          if (msg.serverContent) {
            const parts = msg.serverContent.modelTurn?.parts || [];
            for (const part of parts) {
              if (part.inlineData?.data) {
                enqueueAudio(part.inlineData.data);
              }
              if (part.text) {
                aiTextBufferRef.current += part.text;
                setCurrentAiText(aiTextBufferRef.current);
              }
            }

            // If turn is complete, flush text
            if (msg.serverContent.turnComplete) {
              flushAiText();
            }

            // If server was interrupted
            if (msg.serverContent.interrupted) {
              interruptPlayback();
              flushAiText();
            }
          }

          // Input transcription (what the user said)
          if (msg.serverContent?.inputTranscription?.text) {
            const text = msg.serverContent.inputTranscription.text;
            userTextBufferRef.current += text;
            setCurrentUserText(userTextBufferRef.current);
          }
          if (msg.serverContent?.inputTranscription?.finished) {
            flushUserText();
          }

          // Output transcription (alternative to text parts)
          if (msg.serverContent?.outputTranscription?.text) {
            aiTextBufferRef.current += msg.serverContent.outputTranscription.text;
            setCurrentAiText(aiTextBufferRef.current);
          }

        } catch (err) {
          console.error("WS message parse error:", err);
        }
      };

      ws.onerror = (e) => {
        console.error("WebSocket error:", e);
        setError("Ошибка подключения к голосовому сервису");
        setConnecting(false);
      };

      ws.onclose = (e) => {
        console.log("WebSocket closed:", e.code, e.reason);
        setConnected(false);
        setConnecting(false);
        if (e.code !== 1000) {
          setError(`Соединение закрыто (${e.code})`);
        }
      };

    } catch (err: any) {
      console.error("startSession error:", err);
      setError(err.message || "Ошибка запуска");
      setConnecting(false);
    }
  }, [enqueueAudio, flushAiText, flushUserText, interruptPlayback, muted]);

  /* ── Disconnect ── */
  const endSession = useCallback(() => {
    wsRef.current?.close(1000);
    wsRef.current = null;
    workletNodeRef.current?.disconnect();
    sourceRef.current?.disconnect();
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    playbackQueueRef.current = [];
    isPlayingRef.current = false;
    setConnected(false);
    setAiSpeaking(false);
  }, []);

  /* ── Toggle mute ── */
  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const newVal = !prev;
      streamRef.current?.getAudioTracks().forEach(t => { t.enabled = !newVal; });
      return newVal;
    });
  }, []);

  /* ── Auto-start when navigated with preselected level ── */
  useEffect(() => {
    const state = location.state as { level?: Level; autoStart?: boolean } | null;
    if (state?.autoStart && state.level && !autoStartedRef.current && !connected && !connecting) {
      autoStartedRef.current = true;
      startSession(state.level);
    }
  }, [location.state, connected, connecting, startSession]);
  useEffect(() => {
    return () => {
      wsRef.current?.close(1000);
      streamRef.current?.getTracks().forEach(t => t.stop());
      audioCtxRef.current?.close();
    };
  }, []);

  /* ── Level selection screen ── */
  if (!level) {
    return (
      <div className="min-h-screen bg-background pb-20 flex flex-col">
        <div className="px-4 pt-6 pb-3 border-b border-border flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">Голосовой диалог</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
            <img src={tutorAvatar} alt="Мирьям" width={120} height={120} className="rounded-full border-4 border-primary/20 shadow-lg" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
              <span className="text-xs">🎙</span>
            </div>
          </motion.div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Мирьям</h2>
            <p className="text-sm text-muted-foreground mt-1">Голосовой диалог на иврите в реальном времени</p>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs">
              Говорите с Мирьям голосом только на иврите. Можно перебивать в любой момент. Перевод на русский появляется в текстовом окне.
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
                  <p className="font-semibold text-foreground">{l.label}</p>
                  <p className="text-xs text-muted-foreground">{l.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Active dialogue screen ── */
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={tutorAvatar} alt="Мирьям" width={44} height={44} className="rounded-full border-2 border-primary/20" />
            {aiSpeaking && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">
              Мирьям — {LEVELS.find(l => l.id === level)?.label}
            </h1>
            <p className="text-xs text-muted-foreground">
              {connecting ? "Подключение..." : connected ? (aiSpeaking ? "🗣 Говорит..." : "🎧 Слушает...") : "Отключено"}
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mt-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Transcript — Russian translation only */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
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
                  <span className="text-xs text-muted-foreground font-medium ml-1">Мирьям</span>
                )}
                <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                  line.speaker === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md"
                }`}>
                  <p>{line.russian || line.hebrew}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Live AI text — show "translating" placeholder */}
        {currentAiText && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="max-w-[85%] flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground font-medium ml-1">Мирьям</span>
              <div className="rounded-2xl rounded-bl-md px-4 py-2.5 text-sm bg-card border border-border text-foreground">
                <p className="text-xs text-muted-foreground italic">переводится...</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Live user text — show "translating" placeholder */}
        {currentUserText && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end">
            <div className="max-w-[85%]">
              <div className="rounded-2xl rounded-br-md px-4 py-2.5 text-sm bg-primary/80 text-primary-foreground">
                <p className="text-xs italic opacity-70">переводится...</p>
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
              <p className="text-sm text-muted-foreground">Подключение к Мирьям...</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="px-4 pb-24 pt-4 border-t border-border bg-background">
        <div className="flex items-center justify-center gap-4">
          {connected ? (
            <>
              <Button
                size="icon"
                variant={muted ? "destructive" : "outline"}
                className="w-14 h-14 rounded-full"
                onClick={toggleMute}
              >
                {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>

              <Button
                size="icon"
                variant="destructive"
                className="w-16 h-16 rounded-full"
                onClick={endSession}
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
              Позвонить Мирьям
            </Button>
          ) : null}
        </div>
        {connected && !muted && (
          <motion.p
            className="text-xs text-center text-muted-foreground mt-3"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎙 Говорите на иврите...
          </motion.p>
        )}
        {connected && muted && (
          <p className="text-xs text-center text-destructive mt-3">Микрофон выключен</p>
        )}
      </div>
    </div>
  );
}
