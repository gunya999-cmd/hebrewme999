const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'VoiceDialogue.tsx');
let source = fs.readFileSync(filePath, 'utf8');

function replaceOrFail(label, search, replacement) {
  if (typeof search === 'string') {
    if (!source.includes(search)) {
      throw new Error(`[voice-dialogue patch] Anchor not found: ${label}`);
    }
    source = source.replace(search, replacement);
    return;
  }

  if (!search.test(source)) {
    throw new Error(`[voice-dialogue patch] Pattern not found: ${label}`);
  }
  source = source.replace(search, replacement);
}

if (!source.includes('MessageCircle')) {
  replaceOrFail(
    'lucide import',
    'import { ArrowLeft, Mic, MicOff, Phone, PhoneOff, Settings2 } from "lucide-react";',
    'import { ArrowLeft, MessageCircle, Mic, MicOff, Phone, PhoneOff, Settings2 } from "lucide-react";'
  );
}

const promptBlockStart = source.indexOf('const CORRECTION_RULE =');
const promptBlockEnd = source.indexOf('type AudioWindow =');
if (promptBlockStart === -1 || promptBlockEnd === -1 || promptBlockEnd <= promptBlockStart) {
  throw new Error('[voice-dialogue patch] Prompt block boundaries not found');
}

const promptBlock = `const CORRECTION_RULE = \` חשוב מאוד: כאשר התלמיד טועה (בדקדוק, בהגייה, בבחירת מילה, במין/מספר/זמן הפועל או במילת יחס) — תקני אותו תמיד, אך בעדינות. פתחי את התיקון באחת מהצורות הבאות בעברית בלבד: «נכון לומר…», «עדיף לומר…» או «נכון להגיד…», ומיד אחר כך אמרי את הצורה הנכונה המלאה. אחרי התיקון המשיכי את השיחה בשאלה קצרה. אם המשפט נכון — אל תתקני, רק עודדי והמשיכי. אסור להשתמש ברוסית או באנגלית גם בזמן התיקון.\`;

const HEBREW_VOCABULARY_BANK = \`
אוצר מילים פעיל: בית, משפחה, בית ספר, שיעורים, מורים, חברים, אוכל, קניות, כסף, אוטובוס, רכבת, מונית, רחוב, עיר, שכונה, ים, פארק, טיול, מזג אוויר, זמן, יום, שבוע, חודש, מספרים, צבעים, בגדים, טלפון, מחשב, משחקים, ספורט, בריאות, רופא, בית מרקחת, מסעדה, תפריט, הזמנה, עבודה, חלומות, תחביבים, מוזיקה, סרטים, ספרים, ישראל, ירושלים, תל אביב, חיפה, שוק, חופשה, שדה תעופה, מלון, בעיה, פתרון, דעה, סיבה, תוצאה.
פעלים לשילוב: להיות, ללכת, לבוא, לעשות, לדבר, ללמוד, ללמד, לאכול, לשתות, לקנות, למכור, לשלם, לנסוע, לרדת, לעלות, לראות, לשמוע, לקרוא, לכתוב, להבין, לדעת, לחשוב, לרצות, לאהוב, להרגיש, לעבוד, לשחק, לפתוח, לסגור, לבקש, לקבל, לתת, לקחת, לחפש, למצוא, להתחיל, להמשיך, לסיים, לחזור, לגור, לעזור, לשאול, לענות, להסביר.
בכל תשובה שלבי מילה או ביטוי חדש אחד בלבד, ואז השתמשי בו במשפט טבעי. אל תעמיסי רשימות ארוכות.\`;

const CONVERSATION_CONTINUITY_RULE = \`
חוק המשכיות: לעולם אל תסיימי את השיחה מיוזמתך. כל תשובה חייבת להסתיים בשאלה קצרה אחת בעברית כדי שהתלמיד ימשיך לדבר. אם יש שתיקה, בלבול או תשובה קצרה מדי — המשיכי בעדינות עם שאלה פשוטה יותר. אם המשתמש מבקש להמשיך, המשיכי מאותו נושא ואל תתחילי מחדש.\`;

const LEVEL_INSTRUCTIONS: Record<Level, string> = {
  beginner: \`את מרים, מורה לעברית מתל אביב. דברי רק בעברית! אסור לדבר ברוסית או באנגלית. השתמשי במשפטים פשוטים של 3-6 מילים. דברי לאט וברור. נושאים: ברכות, מספרים, צבעים, אוכל, משפחה, בית ספר, קניות, תחבורה ויום רגיל. תמיד שאלי שאלות פשוטות כדי להמשיך את השיחה. אם התלמיד לא מבין - חזרי על המשפט לאט יותר והוסיפי רמז בעברית פשוטה. היי חמה ומעודדת. \${HEBREW_VOCABULARY_BANK} \${CONVERSATION_CONTINUITY_RULE} \${CORRECTION_RULE}\`,
  intermediate: \`את מרים, מורה לעברית מתל אביב. דברי רק בעברית! אסור לדבר ברוסית או באנגלית. השתמשי במשפטים של 5-12 מילים. נושאים: קניות, טיולים, עבודה, תחביבים, בית ספר, מסעדות, רופא, תחבורה, משפחה, ספורט, טכנולוגיה וחיים בישראל. שאלי שאלות פתוחות כדי שהתלמיד יבנה משפטים בעצמו. תקני טעויות בעדינות. ספרי עובדות מעניינות על ישראל. \${HEBREW_VOCABULARY_BANK} \${CONVERSATION_CONTINUITY_RULE} \${CORRECTION_RULE}\`,
  advanced: \`את מרים, מורה לעברית מתל אביב. דברי רק בעברית! אסור לדבר ברוסית או באנגלית. דברי בעברית טבעית כמו עם דובר שפת אם. השתמשי בסלנג, ביטויים, ניבים ומטפורות, אבל הסבירי אותם בעברית פשוטה. נושאים: תרבות, חדשות קלות, פילוסופיה, הומור, לימודים, קריירה, חברה ישראלית, טיולים, טכנולוגיה ושיחה יומיומית בישראל. עודדי תשובות מפורטות וויכוח. תקני טעויות סגנוניות. \${HEBREW_VOCABULARY_BANK} \${CONVERSATION_CONTINUITY_RULE} \${CORRECTION_RULE}\`,
};

`;
source = `${source.slice(0, promptBlockStart)}${promptBlock}${source.slice(promptBlockEnd)}`;

replaceOrFail(
  'silence watchdog settings',
  /const SILENCE_TIMEOUT_MS = \d+;\n\s+const MAX_NUDGES = \d+;\n\s+const NUDGE_TEXT_HE = .*?;[^\n]*/,
  'const SILENCE_TIMEOUT_MS = 8000;\n  const MAX_NUDGES = 3;\n  const NUDGE_TEXT_HE = "תמשיכי בבקשה מאותו מקום. דברי רק בעברית, הוסיפי מילה חדשה אחת ושאלי אותי שאלה קצרה.";'
);

if (!source.includes('const continueDialogue = useCallback')) {
  const continueBlock = `
  const continueDialogue = useCallback(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setError("Диалог отключился. Нажмите «Позвонить Мирьям», чтобы начать снова.");
      return;
    }

    clearSilenceWatchdog();
    interruptPlayback();
    void flushAiText();
    void flushUserText();
    setError(null);
    setCurrentAiText("");

    const prompt = "תמשיכי את השיחה מאותו נושא. דברי רק בעברית. אם התלמיד שתק או לא ענה, שאלי שאלה פשוטה יותר. הוסיפי מילה חדשה אחת ושאלי שאלה קצרה אחת.";
    ws.send(JSON.stringify({
      clientContent: {
        turns: [{ role: "user", parts: [{ text: prompt }] }],
        turnComplete: true,
      },
    }));

    lastUserTurnAtRef.current = Date.now();
    awaitingModelReplyRef.current = true;
    nudgeAttemptsRef.current = 0;
    armSilenceWatchdog();
  }, [armSilenceWatchdog, clearSilenceWatchdog, flushAiText, flushUserText, interruptPlayback]);
`;
  replaceOrFail('insert continueDialogue callback', '\n  const startSpeechRecognition = useCallback(() => {', `${continueBlock}\n  const startSpeechRecognition = useCallback(() => {`);
}

if (!source.includes('onClick={continueDialogue}')) {
  replaceOrFail(
    'insert continue button',
    `              <Button
                size="icon"
                variant={muted ? "destructive" : "outline"}
                className="w-14 h-14 rounded-full"
                onClick={toggleMute}
              >
                {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>

              <Button
                size="icon"
                variant="destructive"`,
    `              <Button
                size="icon"
                variant={muted ? "destructive" : "outline"}
                className="w-14 h-14 rounded-full"
                onClick={toggleMute}
              >
                {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>

              <Button
                type="button"
                variant="secondary"
                className="h-14 rounded-full px-4 gap-2"
                onClick={continueDialogue}
                disabled={connecting}
                title="Если Мирьям замолчала — продолжить диалог"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="hidden sm:inline">Продолжить</span>
              </Button>

              <Button
                size="icon"
                variant="destructive"`
  );
}

fs.writeFileSync(filePath, source);
console.log('[voice-dialogue patch] applied');
