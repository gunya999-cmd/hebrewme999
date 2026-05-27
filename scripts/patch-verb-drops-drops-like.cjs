const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'VerbDropsGame.tsx');
let source = fs.readFileSync(filePath, 'utf8');

function replaceOnce(search, replacement) {
  if (source.includes(search)) source = source.replace(search, replacement);
}

function replaceRegex(search, replacement) {
  if (search.test(source)) source = source.replace(search, replacement);
}

// Keep the game original to HebrewMe, but make the experience closer to a fast visual “drops” micro-session:
// timer, large floating cards, rounded answer drops, softer visual feedback and more tap/drag feel.

replaceOnce(
  'import { ArrowLeft, CheckCircle2, Loader2, RotateCcw, Trophy, Volume2, XCircle } from "lucide-react";',
  'import { ArrowLeft, CheckCircle2, Loader2, RotateCcw, Sparkles, Timer, Trophy, Volume2, XCircle } from "lucide-react";'
);

replaceOnce(
  'const SESSION_TASK_COUNT = 12;',
  'const SESSION_TASK_COUNT = 14;\nconst SESSION_SECONDS = 5 * 60;'
);

if (!source.includes('function formatTime(seconds: number): string')) {
  replaceOnce(
    'function stripHebrewMarks(text: string): string {\n  return text.replace(/[\\u0591-\\u05C7]/g, "").replace(/\\s+/g, "").trim();\n}\n',
    'function stripHebrewMarks(text: string): string {\n  return text.replace(/[\\u0591-\\u05C7]/g, "").replace(/\\s+/g, "").trim();\n}\n\nfunction formatTime(seconds: number): string {\n  const safe = Math.max(0, seconds);\n  const minutes = Math.floor(safe / 60);\n  const rest = safe % 60;\n  return `${minutes}:${rest.toString().padStart(2, "0")}`;\n}\n'
  );
}

replaceOnce(
  '  const [currentIndex, setCurrentIndex] = useState(0);\n  const [result, setResult] = useState<ResultState>(null);',
  '  const [currentIndex, setCurrentIndex] = useState(0);\n  const [timeLeft, setTimeLeft] = useState(SESSION_SECONDS);\n  const [result, setResult] = useState<ResultState>(null);'
);

if (!source.includes('setTimeLeft((current) => {')) {
  replaceOnce(
    '  const weakWords = useMemo(() => {\n    const weakIds = new Set(getWeakVerbIds(progress));\n    return VERB_DROPS_SEED.filter((verb) => weakIds.has(verb.id)).slice(0, 4);\n  }, [progress]);\n',
    '  const weakWords = useMemo(() => {\n    const weakIds = new Set(getWeakVerbIds(progress));\n    return VERB_DROPS_SEED.filter((verb) => weakIds.has(verb.id)).slice(0, 4);\n  }, [progress]);\n\n  useEffect(() => {\n    if (!topic || isFinished) return undefined;\n    const timer = window.setInterval(() => {\n      setTimeLeft((current) => {\n        if (current <= 1) {\n          setCurrentIndex(steps.length);\n          return 0;\n        }\n        return current - 1;\n      });\n    }, 1000);\n    return () => window.clearInterval(timer);\n  }, [isFinished, steps.length, topic]);\n'
  );
}

replaceOnce(
  '    setCurrentIndex(0);\n    setResult(null);',
  '    setCurrentIndex(0);\n    setTimeLeft(SESSION_SECONDS);\n    setResult(null);'
);

// Selection screen: make it more immersive and “drop-like”.
replaceOnce(
  '<div className="min-h-screen bg-background pb-24 px-4 pt-8">',
  '<div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.18),_transparent_34%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--muted)/0.45))] pb-24 px-4 pt-8">'
);
replaceOnce(
  '<p className="text-xs text-muted-foreground font-semibold">5 минут • картинки • аудио • буквы</p>',
  '<p className="text-xs text-muted-foreground font-semibold">5 минут • глаголы • картинки • аудио</p>'
);
replaceOnce(
  '<div className="rounded-[2rem] bg-gradient-to-br from-primary/15 via-accent/20 to-success/15 p-5 mb-5 border border-border">',
  '<motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/80 p-5 shadow-2xl shadow-primary/10 backdrop-blur-md mb-5">'
);
replaceOnce(
  '<VerbIllustration type="walk" className="h-44 mb-4" />',
  '<div className="absolute -top-10 -right-8 h-32 w-32 rounded-full bg-primary/15" /><div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-success/15" /><VerbIllustration type="walk" className="h-44 mb-4 relative z-10" />'
);
replaceOnce(
  '<h2 className="text-xl font-black text-foreground">Учим глаголы как действия</h2>',
  '<div className="relative z-10"><div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary"><Timer className="h-3.5 w-3.5" /> 5‑минутная сессия</div><h2 className="text-2xl font-black text-foreground">Запоминай глаголы действием</h2>'
);
replaceOnce(
  '<p className="text-sm text-muted-foreground mt-2">Смотри картинку, слушай иврит, выбирай инфинитив и собирай слово по буквам.</p>\n        </div>',
  '<p className="text-sm text-muted-foreground mt-2">Большая картинка, звук, быстрый выбор и сборка инфинитива по буквам.</p></div>\n        </motion.div>'
);
replaceOnce(
  'className="rounded-2xl border border-border bg-card p-4 text-left shadow-sm"',
  'className="rounded-[1.75rem] border border-white/80 bg-white/85 p-4 text-left shadow-xl shadow-black/5 backdrop-blur-sm"'
);

// Game screen background + timer header.
replaceOnce(
  '<div className="min-h-screen bg-background pb-24 px-4 pt-8">',
  '<div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,_hsl(var(--primary)/0.20),_transparent_34%),radial-gradient(circle_at_90%_22%,_hsl(var(--success)/0.18),_transparent_28%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--muted)/0.55))] pb-24 px-4 pt-8">'
);
replaceOnce(
  '<p className="text-xs font-bold text-primary">{progressPercent}%</p>',
  '<p className="flex items-center gap-1 text-xs font-black text-primary"><Timer className="h-3.5 w-3.5" />{formatTime(timeLeft)}</p>'
);
replaceOnce(
  '<div className="h-2 rounded-full bg-muted overflow-hidden">',
  '<div className="h-2.5 rounded-full bg-white/70 overflow-hidden">'
);
replaceOnce(
  '<VerbIllustration type={currentStep.verb.visualType} className="h-56 mb-5" />',
  '<motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} className="rounded-[2.5rem] border border-white/70 bg-white/80 p-4 shadow-2xl shadow-primary/10 backdrop-blur-md mb-5"><VerbIllustration type={currentStep.verb.visualType} className="h-60" /></motion.div>'
);

// Intro card.
replaceOnce('Новый глагол', 'Новая капля');
replaceOnce('Понятно', 'Ловлю');
replaceOnce(
  '<div className="text-center">',
  '<div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 text-center shadow-xl shadow-black/5 backdrop-blur-md">'
);
replaceOnce(
  '<p className="text-xs font-black uppercase tracking-wide text-primary mb-2">Новая капля</p>',
  '<div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary"><Sparkles className="h-3.5 w-3.5" /> новая капля</div>'
);

// Answer chips: turn square choices into large rounded drop bubbles with subtle shadows.
replaceRegex(
  /className=\{`rounded-2xl border-2 p-4 font-hebrew text-2xl font-black text-foreground \$\{state\}`\}/g,
  'className={`min-h-[72px] rounded-[2rem] border-2 px-4 py-3 font-hebrew text-2xl font-black shadow-xl backdrop-blur-md transition-colors ${state}`}'
);
replaceRegex(
  /let bg = "bg-card border-border";/g,
  'let bg = "border-white/80 bg-white/90";'
);
replaceRegex(
  /"border-border bg-card"/g,
  '"border-white/80 bg-white/90 shadow-black/5"'
);
replaceRegex(
  /"border-success bg-success\/10"/g,
  '"border-success bg-success/15 text-success shadow-success/10"'
);
replaceRegex(
  /"border-destructive bg-destructive\/10"/g,
  '"border-destructive bg-destructive/15 text-destructive shadow-destructive/10"'
);

// Letter builder: make tiles feel like movable drops.
replaceOnce(
  'className="min-h-[4rem] rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-3 flex items-center justify-center gap-2 mb-4"',
  'className="min-h-[76px] rounded-[2rem] border-2 border-dashed border-primary/30 bg-white/70 p-3 flex items-center justify-center gap-2 mb-4 shadow-inner"'
);
replaceOnce(
  'className="h-11 w-11 rounded-xl bg-background font-hebrew text-2xl font-black text-foreground shadow-sm"',
  'className="h-12 min-w-12 rounded-2xl bg-primary font-hebrew text-2xl font-black text-primary-foreground shadow-lg"'
);
replaceOnce(
  'className="h-12 rounded-xl bg-card border border-border font-hebrew text-2xl font-black text-foreground shadow-sm"',
  'className="h-14 rounded-2xl border border-white/80 bg-white/90 font-hebrew text-2xl font-black text-foreground shadow-xl shadow-black/5"'
);
replaceOnce('Дальше', 'Следующая капля');

fs.writeFileSync(filePath, source);
console.log('[verb-drops drops-like patch] applied');
