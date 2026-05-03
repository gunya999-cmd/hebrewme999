import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Loader2, Mic, MicOff, Volume2, VolumeX, ArrowLeft, RotateCcw,
  Star, BookOpen, MessageSquare, Zap, Trophy, Target, Flame, ChevronRight,
  Play, CheckCircle2, XCircle, CircleDot, Award, TrendingUp, Clock, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import miriamAvatar from "@/assets/miriam-avatar.png";
import { useHebrewRecorder } from "@/hooks/useHebrewRecorder";
import { getSpeechRate } from "@/hooks/useSpeechRate";
import { SpeechRateSelector } from "@/components/SpeechRateSelector";

/* ── Types ── */
type Msg = { role: "user" | "assistant"; content: string; hebrew?: string };
type Level = "beginner" | "intermediate" | "advanced";
type Screen = "dashboard" | "path" | "pronunciation" | "conversation" | "topics" | "chat" | "results";

interface PronunciationResult {
  overallScore: number;
  feedback: string;
  wordScores: { word: string; score: number; tip?: string }[];
  encouragement: string;
}

interface LessonItem {
  id: string;
  type: "pronunciation" | "conversation" | "vocabulary" | "grammar";
  title: string;
  titleHe: string;
  phrases: { hebrew: string; transcription: string; russian: string }[];
  icon: string;
}

/* ── Edge function URLs ── */
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-dialogue`;
const TRANSLATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-dialogue`;
const PRONUNCIATION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-pronunciation`;

/* ── Learning path data ── */
const UNITS: {
  id: number;
  title: string;
  titleHe: string;
  icon: string;
  lessons: LessonItem[];
}[] = [
  {
    id: 1, title: "Основы", titleHe: "יסודות", icon: "🌱",
    lessons: [
      {
        id: "1-1", type: "pronunciation", title: "Приветствия", titleHe: "ברכות", icon: "👋",
        phrases: [
          { hebrew: "שָׁלוֹם", transcription: "шалом", russian: "Привет / Мир" },
          { hebrew: "בּוֹקֶר טוֹב", transcription: "бокер тов", russian: "Доброе утро" },
          { hebrew: "עֶרֶב טוֹב", transcription: "эрев тов", russian: "Добрый вечер" },
          { hebrew: "לַיְלָה טוֹב", transcription: "лайла тов", russian: "Спокойной ночи" },
          { hebrew: "מַה שְׁלוֹמְךָ", transcription: "ма шломха", russian: "Как дела? (м)" },
          { hebrew: "מַה שְׁלוֹמֵךְ", transcription: "ма шломех", russian: "Как дела? (ж)" },
        ],
      },
      {
        id: "1-2", type: "pronunciation", title: "Знакомство", titleHe: "הכרות", icon: "🤝",
        phrases: [
          { hebrew: "אֲנִי", transcription: "ани", russian: "Я" },
          { hebrew: "שְׁמִי", transcription: "шми", russian: "Меня зовут" },
          { hebrew: "נָעִים מְאוֹד", transcription: "наим меод", russian: "Очень приятно" },
          { hebrew: "מֵאֵיפֹה אַתָּה", transcription: "меэйфо ата", russian: "Откуда ты? (м)" },
          { hebrew: "אֲנִי מֵרוּסְיָה", transcription: "ани мерусья", russian: "Я из России" },
          { hebrew: "אֲנִי גָּר בְּ", transcription: "ани гар бе-", russian: "Я живу в..." },
        ],
      },
      {
        id: "1-3", type: "conversation", title: "Первый диалог", titleHe: "שיחה ראשונה", icon: "💬",
        phrases: [
          { hebrew: "שָׁלוֹם! מַה שִּׁמְךָ?", transcription: "шалом! ма шимха?", russian: "Привет! Как тебя зовут?" },
          { hebrew: "שְׁמִי דָּוִד. וְאַתָּה?", transcription: "шми давид. веата?", russian: "Меня зовут Давид. А ты?" },
        ],
      },
    ],
  },
  {
    id: 2, title: "Числа и время", titleHe: "מספרים וזמן", icon: "🔢",
    lessons: [
      {
        id: "2-1", type: "pronunciation", title: "Числа 1-10", titleHe: "מספרים", icon: "🔢",
        phrases: [
          { hebrew: "אֶחָד", transcription: "эхад", russian: "Один" },
          { hebrew: "שְׁנַיִם", transcription: "шнаим", russian: "Два" },
          { hebrew: "שָׁלוֹשׁ", transcription: "шалош", russian: "Три" },
          { hebrew: "אַרְבַּע", transcription: "арба", russian: "Четыре" },
          { hebrew: "חָמֵשׁ", transcription: "хамеш", russian: "Пять" },
          { hebrew: "שֵׁשׁ", transcription: "шеш", russian: "Шесть" },
          { hebrew: "שֶׁבַע", transcription: "шева", russian: "Семь" },
          { hebrew: "שְׁמוֹנֶה", transcription: "шмонэ", russian: "Восемь" },
          { hebrew: "תֵּשַׁע", transcription: "тэша", russian: "Девять" },
          { hebrew: "עֶשֶׂר", transcription: "эсер", russian: "Десять" },
        ],
      },
      {
        id: "2-2", type: "pronunciation", title: "Дни недели", titleHe: "ימי השבוע", icon: "📅",
        phrases: [
          { hebrew: "יוֹם רִאשׁוֹן", transcription: "йом ришон", russian: "Воскресенье" },
          { hebrew: "יוֹם שֵׁנִי", transcription: "йом шени", russian: "Понедельник" },
          { hebrew: "יוֹם שְׁלִישִׁי", transcription: "йом шлиши", russian: "Вторник" },
          { hebrew: "יוֹם רְבִיעִי", transcription: "йом ревии", russian: "Среда" },
          { hebrew: "יוֹם חֲמִישִׁי", transcription: "йом хамиши", russian: "Четверг" },
          { hebrew: "יוֹם שִׁשִּׁי", transcription: "йом шиши", russian: "Пятница" },
          { hebrew: "שַׁבָּת", transcription: "шабат", russian: "Суббота" },
        ],
      },
      {
        id: "2-3", type: "conversation", title: "Который час?", titleHe: "מה השעה?", icon: "⏰",
        phrases: [
          { hebrew: "מָה הַשָּׁעָה?", transcription: "ма гашаа?", russian: "Который час?" },
          { hebrew: "הַשָּׁעָה שָׁלוֹשׁ", transcription: "гашаа шалош", russian: "Три часа" },
        ],
      },
    ],
  },
  {
    id: 3, title: "Еда и кафе", titleHe: "אוכל ובית קפה", icon: "☕",
    lessons: [
      {
        id: "3-1", type: "pronunciation", title: "Еда", titleHe: "אוכל", icon: "🍎",
        phrases: [
          { hebrew: "לֶחֶם", transcription: "лехем", russian: "Хлеб" },
          { hebrew: "מַיִם", transcription: "маим", russian: "Вода" },
          { hebrew: "קָפֶה", transcription: "кафе", russian: "Кофе" },
          { hebrew: "תֵּה", transcription: "тэ", russian: "Чай" },
          { hebrew: "חָלָב", transcription: "халав", russian: "Молоко" },
          { hebrew: "סֻכָּר", transcription: "сукар", russian: "Сахар" },
        ],
      },
      {
        id: "3-2", type: "pronunciation", title: "В ресторане", titleHe: "במסעדה", icon: "🍽️",
        phrases: [
          { hebrew: "תַּפְרִיט בְּבַקָּשָׁה", transcription: "тафрит бевакаша", russian: "Меню, пожалуйста" },
          { hebrew: "אֲנִי רוֹצֶה", transcription: "ани роце", russian: "Я хочу (м)" },
          { hebrew: "חֶשְׁבּוֹן בְּבַקָּשָׁה", transcription: "хэшбон бевакаша", russian: "Счёт, пожалуйста" },
          { hebrew: "תּוֹדָה רַבָּה", transcription: "тода раба", russian: "Большое спасибо" },
          { hebrew: "זֶה טָעִים מְאוֹד", transcription: "зэ таим меод", russian: "Это очень вкусно" },
          { hebrew: "עוֹד קָפֶה בְּבַקָּשָׁה", transcription: "од кафе бевакаша", russian: "Ещё кофе, пожалуйста" },
        ],
      },
      {
        id: "3-3", type: "conversation", title: "Заказ в кафе", titleHe: "הזמנה בבית קפה", icon: "☕",
        phrases: [
          { hebrew: "בּוֹקֶר טוֹב! מָה תִּרְצֶה?", transcription: "бокер тов! ма тирце?", russian: "Доброе утро! Что желаете?" },
          { hebrew: "קָפֶה וְעוּגָה בְּבַקָּשָׁה", transcription: "кафе веуга бевакаша", russian: "Кофе и пирожное, пожалуйста" },
        ],
      },
    ],
  },
  {
    id: 4, title: "Покупки", titleHe: "קניות", icon: "🛒",
    lessons: [
      {
        id: "4-1", type: "pronunciation", title: "В магазине", titleHe: "בחנות", icon: "🏪",
        phrases: [
          { hebrew: "כַּמָּה זֶה עוֹלֶה?", transcription: "кама зэ олэ?", russian: "Сколько это стоит?" },
          { hebrew: "יָקָר מִדַּי", transcription: "якар мидай", russian: "Слишком дорого" },
          { hebrew: "יֵשׁ הֲנָחָה?", transcription: "йеш анаха?", russian: "Есть скидка?" },
          { hebrew: "אֲנִי רוֹצֶה לִקְנוֹת", transcription: "ани роце ликнот", russian: "Я хочу купить" },
          { hebrew: "אֶפְשָׁר לְנַסּוֹת?", transcription: "эфшар ленасот?", russian: "Можно примерить?" },
          { hebrew: "אֲנִי מְחַפֵּשׂ", transcription: "ани мехапес", russian: "Я ищу..." },
        ],
      },
      {
        id: "4-2", type: "conversation", title: "Торговля на шуке", titleHe: "מיקוח בשוק", icon: "🏪",
        phrases: [
          { hebrew: "כַּמָּה עוֹלֶה קִילוֹ עֲגַבָנִיּוֹת?", transcription: "кама олэ кило агванийот?", russian: "Сколько стоит кило помидоров?" },
          { hebrew: "אֶתֵּן לְךָ מְחִיר טוֹב", transcription: "этэн леха мехир тов", russian: "Дам тебе хорошую цену" },
        ],
      },
    ],
  },
  {
    id: 5, title: "Путешествия", titleHe: "טיולים", icon: "✈️",
    lessons: [
      {
        id: "5-1", type: "pronunciation", title: "Транспорт", titleHe: "תחבורה", icon: "🚌",
        phrases: [
          { hebrew: "אֵיפֹה הַתַּחֲנָה?", transcription: "эйфо гатахана?", russian: "Где станция?" },
          { hebrew: "מָתַי הָאוֹטוֹבּוּס?", transcription: "матай гаотобус?", russian: "Когда автобус?" },
          { hebrew: "כַּרְטִיס אֶחָד בְּבַקָּשָׁה", transcription: "картис эхад бевакаша", russian: "Один билет, пожалуйста" },
          { hebrew: "לְאָן הָרַכֶּבֶת הַזֹּאת נוֹסַעַת?", transcription: "леан гаракевет газот носаат?", russian: "Куда едет этот поезд?" },
          { hebrew: "סְלִיחָה, אֵיךְ מַגִּיעִים לְ?", transcription: "слиха, эйх магиим ле-?", russian: "Простите, как добраться до...?" },
          { hebrew: "יֵשׁ מוֹנִית?", transcription: "йеш монит?", russian: "Есть такси?" },
        ],
      },
      {
        id: "5-2", type: "conversation", title: "В аэропорту", titleHe: "בנמל התעופה", icon: "✈️",
        phrases: [
          { hebrew: "הַדַּרְכּוֹן שֶׁלְּךָ בְּבַקָּשָׁה", transcription: "гадаркон шелха бевакаша", russian: "Ваш паспорт, пожалуйста" },
          { hebrew: "הִנֵּה הַדַּרְכּוֹן שֶׁלִּי", transcription: "инэ гадаркон шели", russian: "Вот мой паспорт" },
        ],
      },
    ],
  },
];

/* ── ELSA-style scenarios for conversation ── */
const SCENARIOS: Record<Level, { icon: string; title: string; titleHe: string; desc: string }[]> = {
  beginner: [
    { icon: "👋", title: "Знакомство", titleHe: "הכרות", desc: "Представься и спроси имя" },
    { icon: "☕", title: "В кафе", titleHe: "בבית קפה", desc: "Закажи напиток и еду" },
    { icon: "👨‍👩‍👧", title: "Семья", titleHe: "משפחה", desc: "Расскажи о своей семье" },
    { icon: "🌤️", title: "Погода", titleHe: "מזג אוויר", desc: "Обсуди погоду" },
    { icon: "🏠", title: "Мой дом", titleHe: "הבית שלי", desc: "Опиши свою комнату" },
    { icon: "🛒", title: "Покупки", titleHe: "קניות", desc: "Назови цены и товары" },
  ],
  intermediate: [
    { icon: "✈️", title: "Путешествие", titleHe: "טיול", desc: "Спланируй поездку" },
    { icon: "💼", title: "Работа", titleHe: "עבודה", desc: "Расскажи о профессии" },
    { icon: "🏥", title: "У врача", titleHe: "אצל הרופא", desc: "Визит к врачу" },
    { icon: "🍽️", title: "Ресторан", titleHe: "מסעדה", desc: "Закажи ужин" },
    { icon: "🚌", title: "Транспорт", titleHe: "תחבורה", desc: "Спроси дорогу" },
    { icon: "🎉", title: "Праздники", titleHe: "חגים", desc: "Праздники Израиля" },
  ],
  advanced: [
    { icon: "🎬", title: "Культура", titleHe: "תרבות", desc: "Кино, музыка" },
    { icon: "📰", title: "Новости", titleHe: "חדשות", desc: "Текущие события" },
    { icon: "💻", title: "Технологии", titleHe: "טכנולוגיה", desc: "Стартапы" },
    { icon: "🍳", title: "Кулинария", titleHe: "בישול", desc: "Рецепты" },
    { icon: "📖", title: "История", titleHe: "היסטוריה", desc: "История Израиля" },
    { icon: "😄", title: "Юмор", titleHe: "הומור", desc: "Анекдоты" },
  ],
};

const LEVELS: { id: Level; label: string; emoji: string; desc: string }[] = [
  { id: "beginner", label: "Начинающий", emoji: "🌱", desc: "Простые фразы" },
  { id: "intermediate", label: "Средний", emoji: "📚", desc: "Диалоги" },
  { id: "advanced", label: "Продвинутый", emoji: "🎓", desc: "Свободная речь" },
];

/* ── Speech helpers ── */
const SpeechRecognitionAPI =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

function speakText(text: string, onEnd?: () => void) {
  window.speechSynthesis.cancel();
  // Extract only Hebrew characters for speech
  const hebrewOnly = text.replace(/[^\u0590-\u05FF\s.,!?]/g, "").trim();
  const toSpeak = hebrewOnly || text.replace(/[\(\)]/g, "");
  const utt = new SpeechSynthesisUtterance(toSpeak);
  utt.lang = "he-IL";
  utt.rate = getSpeechRate();
  if (onEnd) utt.onend = onEnd;
  window.speechSynthesis.speak(utt);
}

async function translateToRussian(text: string): Promise<string> {
  try {
    const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-dialogue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ action: "translate", text }),
    });
    if (!resp.ok) return text;
    const data = await resp.json();
    return data.translation || text;
  } catch {
    return text;
  }
}

/* ── Stream helper ── */
async function streamChat(params: {
  messages: Msg[]; level: Level;
  onDelta: (t: string) => void; onDone: () => void; onError: (e: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages: params.messages, level: params.level }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Ошибка сети" }));
    params.onError(err.error || "Ошибка"); return;
  }
  if (!resp.body) { params.onError("Нет ответа"); return; }
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx); buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { params.onDone(); return; }
      try {
        const p = JSON.parse(json);
        const c = p.choices?.[0]?.delta?.content;
        if (c) params.onDelta(c);
      } catch {}
    }
  }
  params.onDone();
}

/* ── Persistence helpers ── */
function getStoredProgress(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem("elsa_progress") || "{}"); } catch { return {}; }
}
function saveProgress(lessonId: string, score: number) {
  const p = getStoredProgress();
  p[lessonId] = Math.max(p[lessonId] || 0, score);
  localStorage.setItem("elsa_progress", JSON.stringify(p));
}
function getStreak(): number {
  try {
    const d = JSON.parse(localStorage.getItem("elsa_streak") || "{}");
    const today = new Date().toDateString();
    if (d.lastDate === today) return d.count || 1;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (d.lastDate === yesterday) return d.count || 0;
    return 0;
  } catch { return 0; }
}
function bumpStreak() {
  const today = new Date().toDateString();
  const d = JSON.parse(localStorage.getItem("elsa_streak") || "{}");
  if (d.lastDate === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const count = d.lastDate === yesterday ? (d.count || 0) + 1 : 1;
  localStorage.setItem("elsa_streak", JSON.stringify({ lastDate: today, count }));
}

/* ── Score color helper ── */
function scoreColor(s: number) {
  if (s >= 80) return "text-green-500";
  if (s >= 50) return "text-yellow-500";
  return "text-red-500";
}
function scoreBg(s: number) {
  if (s >= 80) return "bg-green-500";
  if (s >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

/* ══════════════════════════ COMPONENT ══════════════════════════ */
export default function AITutor() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [level, setLevel] = useState<Level>("beginner");
  const [currentLesson, setCurrentLesson] = useState<LessonItem | null>(null);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [pronResult, setPronResult] = useState<PronunciationResult | null>(null);
  const [pronLoading, setPronLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [currentTopic, setCurrentTopic] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [lessonScores, setLessonScores] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  // Gemini-based Hebrew STT (replaces unreliable browser SpeechRecognition for he-IL)
  const recorder = useHebrewRecorder();
  const isListening = listening || recorder.recording || recorder.transcribing;
  const progress = getStoredProgress();
  const streak = getStreak();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const prevLoadingRef = useRef(loading);
  useEffect(() => {
    if (prevLoadingRef.current && !loading && autoSpeak) {
      const last = messages[messages.length - 1];
      if (last?.role === "assistant" && !last.content.startsWith("⚠️") && last.hebrew) {
        setSpeakingIdx(messages.length - 1);
        speakText(last.hebrew, () => setSpeakingIdx(null));
      }
    }
    prevLoadingRef.current = loading;
  }, [loading, messages, autoSpeak]);

  /* ── Pronunciation practice ── */
  const startLesson = (lesson: LessonItem) => {
    setCurrentLesson(lesson);
    setPhraseIdx(0);
    setPronResult(null);
    setLessonScores([]);
    if (lesson.type === "conversation") {
      startTopicChat(lesson.title);
    } else {
      setScreen("pronunciation");
    }
  };

  const currentPhrase = currentLesson?.phrases[phraseIdx];

  const listenPhrase = () => {
    if (currentPhrase) speakText(currentPhrase.hebrew);
  };

  const recordPronunciation = useCallback(async () => {
    // Toggle: if already recording, stop and let the recorder resolve with the transcript.
    if (recorder.recording) {
      recorder.stop();
      return;
    }
    if (recorder.transcribing) return;
    try {
      const transcript = await recorder.start({ expectedText: currentPhrase?.hebrew });
      await analyzePronunciation(transcript);
    } catch (err) {
      console.warn("[recordPronunciation] failed:", err);
      alert("Не удалось записать звук. Проверьте доступ к микрофону.");
    }
  }, [recorder, currentPhrase, level]);

  const analyzePronunciation = async (userText: string) => {
    if (!currentPhrase) return;
    setPronLoading(true);
    try {
      const resp = await fetch(PRONUNCIATION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          userText,
          expectedText: currentPhrase.hebrew,
          level,
        }),
      });
      if (!resp.ok) throw new Error("API error");
      const result: PronunciationResult = await resp.json();
      setPronResult(result);
      setLessonScores(prev => [...prev, result.overallScore]);
      bumpStreak();
    } catch {
      setPronResult({
        overallScore: 0,
        feedback: "Не удалось проанализировать. Попробуйте ещё раз.",
        wordScores: [],
        encouragement: "Не сдавайтесь! 💪",
      });
    } finally {
      setPronLoading(false);
    }
  };

  const nextPhrase = () => {
    if (!currentLesson) return;
    if (phraseIdx < currentLesson.phrases.length - 1) {
      setPhraseIdx(phraseIdx + 1);
      setPronResult(null);
    } else {
      // Lesson complete
      const avg = lessonScores.length > 0
        ? Math.round(lessonScores.reduce((a, b) => a + b, 0) / lessonScores.length)
        : 0;
      saveProgress(currentLesson.id, avg);
      setScreen("results");
    }
  };

  const retryPhrase = () => setPronResult(null);

  /* ── Conversation ── */
  const startTopicChat = async (topic: string) => {
    setCurrentTopic(topic);
    setScreen("chat");
    setMessages([]);
    setLoading(true);
    const isFree = topic === "Свободная беседа" || topic.toLowerCase().includes("свободн");
    // Случайные короткие приветствия для разнообразия
    const greetings = [
      "שלום! אני מרים 😊",
      "היי! קוראים לי מרים.",
      "אהלן! אני מרים מתל אביב.",
      "שלום שלום! מרים כאן 🌞",
      "היי לך! אני מרים.",
      "ברוך הבא! אני מרים ☕",
      "שלום יקירי! מרים מדברת.",
      "אהלן וסהלן! אני מרים.",
      "היי! נעים מאוד, אני מרים.",
      "שלום! מה שלומך? אני מרים 🌸",
    ];
    const questionIdeas = [
      "איך קוראים לך?",
      "מה שלומך היום?",
      "מאיפה אתה?",
      "מה עשית היום?",
      "מה אתה אוהב לעשות בזמן הפנוי?",
      "איזה אוכל אתה הכי אוהב?",
      "יש לך תוכניות מעניינות לסוף השבוע?",
      "מה הדבר האחרון שגרם לך לחייך?",
      "איזה מקום בעולם הכי בא לך לבקר בו?",
      "מה למדת היום בעברית?",
    ];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    const question = questionIdeas[Math.floor(Math.random() * questionIdeas.length)];
    const initContent = isFree
      ? `פתחי שיחה חופשית עם התלמיד בעברית בלבד. השתמשי בדיוק בפתיחה הקצרה הזו (1-2 משפטים בלבד, ללא הוספות): "${greeting}". מיד אחר כך שאלי שאלה פתוחה אחת בלבד, למשל: "${question}" (או וריאציה דומה). חוק קריטי: ההודעה חייבת להסתיים בסימן שאלה אחד בלבד (?), ללא רשימות, ללא הצעות נושאים, ללא שאלות נוספות. דברי קצר, חם וטבעי כמו חברה.`
      : `התחל שיחה על הנושא: "${topic}". פתחי בפתיחה קצרה: "${greeting}", הציגי את הנושא במשפט אחד, וסיימי בשאלה פתוחה אחת בלבד לתלמיד. ההודעה חייבת להסתיים בסימן שאלה אחד בלבד.`;
    const initMsg: Msg = { role: "user", content: initContent };
    let hebrewSoFar = "";
    await streamChat({
      messages: [initMsg], level,
      onDelta: (chunk) => { 
        hebrewSoFar += chunk; 
        setMessages(() => [{ role: "assistant", content: "⏳ переводится...", hebrew: hebrewSoFar }]); 
      },
      onDone: async () => { 
        const russian = await translateToRussian(hebrewSoFar);
        setMessages([{ role: "assistant", content: russian, hebrew: hebrewSoFar }]);
        setLoading(false); 
        bumpStreak(); 
      },
      onError: (e) => { setMessages([{ role: "assistant", content: `⚠️ ${e}` }]); setLoading(false); },
    });
  };

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    window.speechSynthesis.cancel();
    setSpeakingIdx(null);
    const userMsg: Msg = { role: "user", content: text.trim() };
    const allMsgs = [...messages, userMsg];
    setMessages(allMsgs);
    setInput("");
    setLoading(true);
    // Build messages for AI using hebrew field (AI expects Hebrew context)
    const aiMsgs = allMsgs.map(m => ({ role: m.role, content: m.hebrew || m.content }));
    let hebrewSoFar = "";
    const upsert = (chunk: string) => {
      hebrewSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: "⏳ переводится...", hebrew: hebrewSoFar } : m);
        return [...prev, { role: "assistant", content: "⏳ переводится...", hebrew: hebrewSoFar }];
      });
    };
    try {
      await streamChat({ 
        messages: aiMsgs, level, 
        onDelta: upsert, 
        onDone: async () => {
          const russian = await translateToRussian(hebrewSoFar);
          setMessages(prev => prev.map((m, i) => i === prev.length - 1 && m.role === "assistant" ? { ...m, content: russian, hebrew: hebrewSoFar } : m));
          setLoading(false);
        }, 
        onError: (e) => { setMessages(p => [...p, { role: "assistant", content: `⚠️ ${e}` }]); setLoading(false); } 
      });
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "⚠️ Ошибка соединения" }]);
      setLoading(false);
    }
  };

  const toggleChatMic = useCallback(async () => {
    if (recorder.recording) {
      recorder.stop();
      return;
    }
    if (recorder.transcribing) return;
    try {
      setInput("🎙 …");
      const transcript = await recorder.start();
      const clean = (transcript || "").trim();
      setInput(clean);
      if (clean) setTimeout(() => send(clean), 200);
    } catch (err) {
      console.warn("[toggleChatMic] failed:", err);
      setInput("");
      alert("Не удалось записать звук. Проверьте доступ к микрофону.");
    }
  }, [recorder, send]);

  const handleSpeak = (text: string, idx: number) => {
    if (speakingIdx === idx) { window.speechSynthesis.cancel(); setSpeakingIdx(null); return; }
    setSpeakingIdx(idx);
    speakText(text, () => setSpeakingIdx(null));
  };

  /* ═══════════ DASHBOARD ═══════════ */
  if (screen === "dashboard") {
    const totalLessons = UNITS.reduce((a, u) => a + u.lessons.length, 0);
    const completedLessons = Object.keys(progress).length;
    const dailyGoal = 3;
    const todayKey = new Date().toDateString();
    const todayCompleted = Object.keys(progress).filter(k => {
      try { return true; } catch { return false; }
    }).length;

    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-background px-5 pt-6 pb-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="h-9 w-9">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-black text-foreground">AI Репетитор</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-orange-500/10 px-3 py-1.5 rounded-full">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold text-orange-500">{streak}</span>
              </div>
            </div>
          </div>

          {/* Avatar & greeting */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              <img src={miriamAvatar} alt="Мирьям" width={64} height={64} className="rounded-2xl border-2 border-primary/20 shadow-lg" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Шалом! 👋</p>
              <p className="text-sm text-muted-foreground">Готов к практике иврита?</p>
            </div>
          </div>

          {/* Progress card */}
          <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="bg-card rounded-2xl border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-foreground">Прогресс обучения</span>
              <span className="text-xs text-muted-foreground">{completedLessons}/{totalLessons} уроков</span>
            </div>
            <Progress value={(completedLessons / totalLessons) * 100} className="h-2.5 mb-3" />
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                <p className="text-xs text-muted-foreground">Очки</p>
                <p className="font-bold text-sm text-foreground">
                  {Object.values(progress).reduce((a, b) => a + b, 0)}
                </p>
              </div>
              <div className="text-center">
                <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Уроки</p>
                <p className="font-bold text-sm text-foreground">{completedLessons}</p>
              </div>
              <div className="text-center">
                <Flame className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                <p className="text-xs text-muted-foreground">Серия</p>
                <p className="font-bold text-sm text-foreground">{streak} дн.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick actions */}
        <div className="px-5 pt-5">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">Быстрый старт</h2>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={() => setScreen("path")}
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 text-left">
              <BookOpen className="w-6 h-6 text-blue-500 mb-2" />
              <p className="font-bold text-sm text-foreground">Путь обучения</p>
              <p className="text-xs text-muted-foreground mt-1">Пошаговые уроки</p>
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={() => setScreen("topics")}
              className="p-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 text-left">
              <MessageSquare className="w-6 h-6 text-green-500 mb-2" />
              <p className="font-bold text-sm text-foreground">Разговор с AI</p>
              <p className="text-xs text-muted-foreground mt-1">Свободная практика</p>
            </motion.button>
          </div>

          {/* Continue learning */}
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">Продолжить обучение</h2>
          <div className="space-y-2">
            {UNITS.map(unit => {
              const done = unit.lessons.filter(l => progress[l.id]).length;
              const total = unit.lessons.length;
              return (
                <motion.button key={unit.id} whileTap={{ scale: 0.98 }}
                  onClick={() => setScreen("path")}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-left">
                  <span className="text-2xl">{unit.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">{unit.title}</p>
                    <p className="text-xs text-muted-foreground">{done}/{total} уроков</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12">
                      <Progress value={(done / total) * 100} className="h-1.5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════ LEARNING PATH ═══════════ */
  if (screen === "path") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="px-4 pt-5 pb-3 border-b border-border flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setScreen("dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Путь обучения</h1>
            <p className="text-xs text-muted-foreground">Пошаговые уроки произношения и диалогов</p>
          </div>
        </div>

        <div className="px-4 pt-4 space-y-6">
          {UNITS.map((unit, ui) => {
            const done = unit.lessons.filter(l => progress[l.id]).length;
            const isLocked = ui > 0 && UNITS[ui - 1].lessons.filter(l => progress[l.id]).length === 0;

            return (
              <motion.div key={unit.id}
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: ui * 0.08 }}
                className={`${isLocked ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${isLocked ? "bg-muted" : "bg-primary/10"}`}>
                    {isLocked ? <Lock className="w-5 h-5 text-muted-foreground" /> : unit.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground">Юнит {unit.id}: {unit.title}</p>
                      <span className="text-xs text-muted-foreground" dir="rtl">{unit.titleHe}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Progress value={(done / unit.lessons.length) * 100} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground">{done}/{unit.lessons.length}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 ml-5 border-l-2 border-border pl-4">
                  {unit.lessons.map((lesson, li) => {
                    const score = progress[lesson.id];
                    const isDone = score !== undefined;
                    return (
                      <motion.button key={lesson.id}
                        whileTap={isLocked ? {} : { scale: 0.97 }}
                        onClick={() => !isLocked && startLesson(lesson)}
                        disabled={isLocked}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          isDone
                            ? "border-green-500/30 bg-green-500/5"
                            : isLocked
                              ? "border-border bg-muted/50 cursor-not-allowed"
                              : "border-border bg-card hover:bg-accent hover:border-primary/20"
                        }`}>
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${
                          isDone ? "bg-green-500/10" : "bg-muted"
                        }`}>
                          {isDone ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : lesson.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground" dir="rtl">{lesson.titleHe}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isDone && (
                            <span className={`text-xs font-bold ${scoreColor(score)}`}>{score}%</span>
                          )}
                          {lesson.type === "pronunciation" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-medium">🎤</span>
                          )}
                          {lesson.type === "conversation" && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-medium">💬</span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ═══════════ PRONUNCIATION PRACTICE ═══════════ */
  if (screen === "pronunciation" && currentLesson && currentPhrase) {
    const total = currentLesson.phrases.length;
    return (
      <div className="min-h-screen bg-background pb-20 flex flex-col">
        {/* Header */}
        <div className="px-4 pt-5 pb-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="icon" onClick={() => setScreen("path")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="text-sm font-semibold text-foreground">{phraseIdx + 1} / {total}</span>
            <div className="w-9" />
          </div>
          <Progress value={((phraseIdx + 1) / total) * 100} className="h-2" />
        </div>

        {/* Phrase card */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div key={phraseIdx}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm">
            {/* Lesson title */}
            <p className="text-xs text-muted-foreground text-center mb-6 uppercase tracking-wide">
              {currentLesson.icon} {currentLesson.title}
            </p>

            {/* Hebrew phrase */}
            <div className="bg-card rounded-3xl border border-border p-8 text-center shadow-lg mb-6">
              <p className="text-4xl font-bold text-foreground mb-3 leading-relaxed" dir="rtl">
                {currentPhrase.hebrew}
              </p>
              <p className="text-lg text-primary font-medium mb-2">{currentPhrase.transcription}</p>
              <p className="text-sm text-muted-foreground">{currentPhrase.russian}</p>

              {/* Listen button */}
              <Button variant="outline" size="sm" onClick={listenPhrase}
                className="mt-5 rounded-full gap-2">
                <Volume2 className="w-4 h-4" /> Прослушать
              </Button>
            </div>

            {/* Result */}
            <AnimatePresence mode="wait">
              {pronLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-center py-6">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Анализирую произношение...</p>
                </motion.div>
              )}

              {pronResult && !pronLoading && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  className="bg-card rounded-2xl border border-border p-5 shadow-sm">
                  {/* Score circle */}
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${
                      pronResult.overallScore >= 80 ? "border-green-500 bg-green-500/10" :
                      pronResult.overallScore >= 50 ? "border-yellow-500 bg-yellow-500/10" :
                      "border-red-500 bg-red-500/10"
                    }`}>
                      <span className={`text-2xl font-black ${scoreColor(pronResult.overallScore)}`}>
                        {pronResult.overallScore}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-foreground text-center mb-2">{pronResult.feedback}</p>
                  <p className="text-xs text-primary text-center mb-4 italic">{pronResult.encouragement}</p>

                  {/* Word scores */}
                  {pronResult.wordScores.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {pronResult.wordScores.map((w, i) => (
                        <div key={i} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-muted/50">
                          <span className="text-sm font-medium text-foreground" dir="rtl">{w.word}</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${scoreBg(w.score)}`} />
                            <span className={`text-xs font-bold ${scoreColor(w.score)}`}>{w.score}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={retryPhrase} className="flex-1 rounded-xl gap-2">
                      <RotateCcw className="w-4 h-4" /> Ещё раз
                    </Button>
                    <Button onClick={nextPhrase} className="flex-1 rounded-xl gap-2">
                      {phraseIdx < total - 1 ? <>Далее <ChevronRight className="w-4 h-4" /></> : <>Завершить <CheckCircle2 className="w-4 h-4" /></>}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Record button */}
            {!pronResult && !pronLoading && (
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  {recorder.transcribing ? "Распознаём речь..." : "Нажмите и произнесите фразу"}
                </p>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={recordPronunciation}
                  disabled={recorder.transcribing}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isListening
                      ? "bg-destructive animate-pulse shadow-destructive/30"
                      : "bg-primary shadow-primary/30 hover:shadow-primary/50"
                  } ${recorder.transcribing ? "opacity-70" : ""}`}>
                  {recorder.transcribing
                    ? <Loader2 className="w-8 h-8 text-white animate-spin" />
                    : isListening
                      ? <MicOff className="w-8 h-8 text-white" />
                      : <Mic className="w-8 h-8 text-primary-foreground" />}
                </motion.button>
                {recorder.recording && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-xs text-destructive animate-pulse">
                    🎙 Слушаю... говорите на иврите. Нажмите ещё раз, чтобы остановить.
                  </motion.p>
                )}
                {recorder.transcribing && (
                  <p className="text-xs text-muted-foreground">⏳ Анализ произношения...</p>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  /* ═══════════ RESULTS ═══════════ */
  if (screen === "results" && currentLesson) {
    const avg = lessonScores.length > 0
      ? Math.round(lessonScores.reduce((a, b) => a + b, 0) / lessonScores.length) : 0;
    const stars = avg >= 90 ? 3 : avg >= 70 ? 2 : avg >= 40 ? 1 : 0;

    return (
      <div className="min-h-screen bg-background pb-20 flex flex-col items-center justify-center px-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm text-center">
          {/* Stars */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map(s => (
              <motion.div key={s}
                initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: s * 0.2 }}>
                <Star className={`w-12 h-12 ${s <= stars ? "text-yellow-400 fill-yellow-400" : "text-muted"}`} />
              </motion.div>
            ))}
          </div>

          <h1 className="text-2xl font-black text-foreground mb-2">
            {avg >= 80 ? "Отлично! 🎉" : avg >= 50 ? "Хорошо! 👍" : "Попробуй ещё! 💪"}
          </h1>
          <p className="text-muted-foreground mb-6">Урок «{currentLesson.title}» завершён</p>

          {/* Score card */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-6">
            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center border-4 mb-4 ${
              avg >= 80 ? "border-green-500 bg-green-500/10" :
              avg >= 50 ? "border-yellow-500 bg-yellow-500/10" :
              "border-red-500 bg-red-500/10"
            }`}>
              <span className={`text-3xl font-black ${scoreColor(avg)}`}>{avg}%</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Фраз</p>
                <p className="font-bold text-foreground">{lessonScores.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Средний балл</p>
                <p className={`font-bold ${scoreColor(avg)}`}>{avg}%</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => startLesson(currentLesson)} className="flex-1 rounded-xl">
              <RotateCcw className="w-4 h-4 mr-2" /> Повторить
            </Button>
            <Button onClick={() => setScreen("path")} className="flex-1 rounded-xl">
              Продолжить <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ═══════════ TOPIC SELECTION ═══════════ */
  if (screen === "topics") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="px-4 pt-5 pb-3 border-b border-border flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setScreen("dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Разговор с AI</h1>
            <p className="text-xs text-muted-foreground">Практикуй разговорный иврит</p>
          </div>
        </div>

        <div className="px-4 pt-4">
          {/* Level picker */}
          <div className="flex gap-2 mb-5">
            {LEVELS.map(l => (
              <button key={l.id} onClick={() => setLevel(l.id)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  level === l.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}>
                {l.emoji} {l.label}
              </button>
            ))}
          </div>

          {/* Free chat — voice mode */}
          <motion.button whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/voice-dialogue", { state: { level, autoStart: true } })}
            className="w-full mb-5 p-4 rounded-2xl bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/30 flex items-center gap-4 text-left hover:from-primary/20 transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground flex items-center gap-2">
                Свободная беседа
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary text-primary-foreground">🎤 ГОЛОС</span>
              </p>
              <p className="text-xs text-muted-foreground">Живое голосовое общение с Мирьям через микрофон</p>
            </div>
          </motion.button>

          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">Ситуации</h2>
          <div className="grid grid-cols-2 gap-3">
            {SCENARIOS[level].map((s, i) => (
              <motion.button key={s.title}
                initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.04 * i }}
                whileTap={{ scale: 0.95 }}
                onClick={() => startTopicChat(s.title)}
                className="p-4 rounded-2xl border border-border bg-card hover:bg-accent transition-all text-left">
                <span className="text-2xl block mb-2">{s.icon}</span>
                <p className="font-semibold text-foreground text-sm">{s.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5" dir="rtl">{s.titleHe}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════ CHAT ═══════════ */
  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col">
      <div className="px-4 pt-4 pb-3 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => { setScreen("topics"); setMessages([]); window.speechSynthesis.cancel(); }}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="relative">
              <img src={miriamAvatar} alt="Мирьям" width={40} height={40} className="rounded-full border-2 border-primary/20" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">Мирьям</h1>
              <p className="text-xs text-muted-foreground truncate max-w-[180px]">{currentTopic}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => { if (autoSpeak) window.speechSynthesis.cancel(); setAutoSpeak(!autoSpeak); }}
              className="h-8 w-8">
              {autoSpeak ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => { setMessages([]); setScreen("topics"); window.speechSynthesis.cancel(); }}
              className="h-8 w-8">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="px-3 pb-2 flex justify-end"><SpeechRateSelector variant="compact" /></div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}>
                {m.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <img src={miriamAvatar} alt="" width={20} height={20} className="rounded-full" />
                    <span className="text-xs text-muted-foreground font-medium">Мирьям</span>
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card border border-border text-foreground rounded-bl-sm shadow-sm"
                }`}>{m.content}</div>
                {m.role === "assistant" && m.hebrew && !m.content.startsWith("⚠️") && (
                  <button onClick={() => handleSpeak(m.hebrew!, i)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors px-1">
                    {speakingIdx === i ? <><VolumeX className="w-3 h-3" /> Стоп</> : <><Volume2 className="w-3 h-3" /> Слушать</>}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <img src={miriamAvatar} alt="" width={20} height={20} className="rounded-full" />
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-20 pt-3 border-t border-border bg-background">
        <div className="flex gap-2 items-end">
          <Button size="icon" variant={isListening ? "default" : "outline"} onClick={toggleChatMic}
            disabled={recorder.transcribing}
            className={`rounded-full shrink-0 h-11 w-11 ${recorder.recording ? "animate-pulse bg-destructive hover:bg-destructive/90 border-destructive" : ""}`}>
            {recorder.transcribing
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : recorder.recording
                ? <MicOff className="w-5 h-5" />
                : <Mic className="w-5 h-5" />}
          </Button>
          <div className="flex-1">
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder={recorder.recording ? "Говорите..." : recorder.transcribing ? "Распознаём..." : "Напишите на иврите или по-русски..."}
              rows={1}
              className="w-full resize-none rounded-full border border-input bg-card px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
          </div>
          <Button size="icon" onClick={() => send(input)} disabled={!input.trim() || loading}
            className="rounded-full shrink-0 h-11 w-11">
            <Send className="w-5 h-5" />
          </Button>
        </div>
        {recorder.recording && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-xs text-destructive mt-2 text-center animate-pulse">
            🎙 Слушаю... говорите на иврите. Нажмите ещё раз, чтобы остановить.
          </motion.p>
        )}
        {recorder.transcribing && (
          <p className="text-xs text-muted-foreground mt-2 text-center">⏳ Распознаём речь через Gemini…</p>
        )}
      </div>
    </div>
  );
}
