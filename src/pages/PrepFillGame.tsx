import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X, Volume2, ArrowRight } from "lucide-react";
import { prepositions } from "@/data/prepositions";
import { useLearning } from "@/hooks/useLearning";
import { getSpeechRate } from "@/hooks/useSpeechRate";
import { SpeechRateSelector } from "@/components/SpeechRateSelector";

/* ───── types ───── */
interface SentenceData {
  before: string;
  after: string;
  prepBase: string;
  translation: string;
}

interface Sentence {
  textBefore: string;
  textAfter: string;
  correctPrep: string;
  correctTranscription: string;
  translation: string;
  options: string[];
}

/* ───── Large pool of sentences (80+) ───── */
const ALL_SENTENCES: SentenceData[] = [
  // בְּ (в, на)
  { before: 'אני גר', after: 'תל אביב', prepBase: 'בְּ', translation: 'Я живу в Тель-Авиве' },
  { before: 'הילדים לומדים', after: 'בית הספר', prepBase: 'בְּ', translation: 'Дети учатся в школе' },
  { before: 'היא עובדת', after: 'בנק גדול', prepBase: 'בְּ', translation: 'Она работает в большом банке' },
  { before: 'הוא נולד', after: 'חודש ינואר', prepBase: 'בְּ', translation: 'Он родился в январе' },
  // עַל (на, о)
  { before: 'הספר', after: 'השולחן', prepBase: 'עַל', translation: 'Книга на столе' },
  { before: 'הם מדברים', after: 'הסרט החדש', prepBase: 'עַל', translation: 'Они говорят о новом фильме' },
  { before: 'אני חושב', after: 'העתיד שלי', prepBase: 'עַל', translation: 'Я думаю о своём будущем' },
  { before: 'היא כועסת', after: 'האח שלה', prepBase: 'עַל', translation: 'Она злится на своего брата' },
  // לְ (к, в — направление)
  { before: 'אני הולך', after: 'בית הספר', prepBase: 'לְ', translation: 'Я иду в школу' },
  { before: 'אנחנו נוסעים', after: 'אילת מחר', prepBase: 'לְ', translation: 'Мы едем в Эйлат завтра' },
  { before: 'הוא רץ', after: 'הפארק כל בוקר', prepBase: 'לְ', translation: 'Он бегает в парк каждое утро' },
  { before: 'היא חוזרת', after: 'הבית מאוחר', prepBase: 'לְ', translation: 'Она возвращается домой поздно' },
  // מִ / מִן (от, из)
  { before: 'הוא בא', after: 'ירושלים', prepBase: 'מִ / מִן', translation: 'Он приехал из Иерусалима' },
  { before: 'היא קיבלה מכתב', after: 'החברה שלה', prepBase: 'מִ / מִן', translation: 'Она получила письмо от подруги' },
  { before: 'הרכבת יוצאת', after: 'התחנה המרכזית', prepBase: 'מִ / מִן', translation: 'Поезд отправляется с центральной станции' },
  { before: 'הוא ברח', after: 'הגשם', prepBase: 'מִ / מִן', translation: 'Он убежал от дождя' },
  // עִם (с)
  { before: 'הוא עובד', after: 'אחיו הגדול', prepBase: 'עִם', translation: 'Он работает со старшим братом' },
  { before: 'אני רוצה לדבר', after: 'המנהל', prepBase: 'עִם', translation: 'Я хочу поговорить с директором' },
  { before: 'היא יצאה', after: 'חברים לקולנוע', prepBase: 'עִם', translation: 'Она пошла с друзьями в кино' },
  { before: 'הילד משחק', after: 'הכלב שלו', prepBase: 'עִם', translation: 'Ребёнок играет со своей собакой' },
  // שֶׁל (чей, принадлежность)
  { before: 'הבית', after: 'הסבתא שלי גדול', prepBase: 'שֶׁל', translation: 'Дом моей бабушки большой' },
  { before: 'הטלפון', after: 'אבא נשבר', prepBase: 'שֶׁל', translation: 'Телефон папы сломался' },
  { before: 'החתול', after: 'השכנים ברח', prepBase: 'שֶׁל', translation: 'Кот соседей убежал' },
  // אַחֲרֵי (после)
  { before: 'היא באה', after: 'ארוחת הצהריים', prepBase: 'אַחֲרֵי', translation: 'Она пришла после обеда' },
  { before: 'אני ישן', after: 'יום עבודה קשה', prepBase: 'אַחֲרֵי', translation: 'Я сплю после тяжёлого рабочего дня' },
  { before: 'הם יצאו', after: 'ההצגה', prepBase: 'אַחֲרֵי', translation: 'Они вышли после спектакля' },
  // לִפְנֵי (перед, до)
  { before: 'אני קם', after: 'הזריחה', prepBase: 'לִפְנֵי', translation: 'Я встаю до рассвета' },
  { before: 'תכין הכל', after: 'שהאורחים יגיעו', prepBase: 'לִפְנֵי', translation: 'Приготовь всё до прихода гостей' },
  { before: 'הוא התרגש', after: 'הטיסה', prepBase: 'לִפְנֵי', translation: 'Он волновался перед полётом' },
  // בִּשְׁבִיל (для, ради)
  { before: 'קניתי פרחים', after: 'אמא שלי', prepBase: 'בִּשְׁבִיל', translation: 'Я купил цветы для мамы' },
  { before: 'הוא עובד קשה', after: 'המשפחה', prepBase: 'בִּשְׁבִיל', translation: 'Он работает усердно ради семьи' },
  { before: 'אין לי זמן', after: 'המשחקים', prepBase: 'בִּשְׁבִיל', translation: 'У меня нет времени для игр' },
  // בִּגְלַל (из-за)
  { before: 'הוא איחר', after: 'הפקקים', prepBase: 'בִּגְלַל', translation: 'Он опоздал из-за пробок' },
  { before: 'היא לא באה', after: 'המחלה', prepBase: 'בִּגְלַל', translation: 'Она не пришла из-за болезни' },
  { before: 'הטיול בוטל', after: 'מזג האוויר', prepBase: 'בִּגְלַל', translation: 'Поездка отменилась из-за погоды' },
  // בְּלִי (без)
  { before: 'הוא יצא', after: 'מטריה', prepBase: 'בְּלִי', translation: 'Он вышел без зонта' },
  { before: 'אני לא יכול לחיות', after: 'מוזיקה', prepBase: 'בְּלִי', translation: 'Я не могу жить без музыки' },
  { before: 'היא שותה קפה', after: 'סוכר', prepBase: 'בְּלִי', translation: 'Она пьёт кофе без сахара' },
  // בֵּין (между)
  { before: 'הפארק נמצא', after: 'שני רחובות', prepBase: 'בֵּין', translation: 'Парк находится между двумя улицами' },
  { before: 'הוא בחר', after: 'שתי אפשרויות', prepBase: 'בֵּין', translation: 'Он выбирал между двумя вариантами' },
  { before: 'היא ישבה', after: 'שני חברים', prepBase: 'בֵּין', translation: 'Она сидела между двумя друзьями' },
  // אֵצֶל (у кого)
  { before: 'אני ישן הלילה', after: 'סבא וסבתא', prepBase: 'אֵצֶל', translation: 'Я ночую сегодня у бабушки с дедушкой' },
  { before: 'היא הייתה', after: 'הרופא אתמול', prepBase: 'אֵצֶל', translation: 'Она была у врача вчера' },
  { before: 'הוא למד', after: 'מורה פרטי', prepBase: 'אֵצֶל', translation: 'Он учился у частного учителя' },
  // אֶל (к — направление к человеку)
  { before: 'הוא ניגש', after: 'המורה ושאל', prepBase: 'אֶל', translation: 'Он подошёл к учителю и спросил' },
  { before: 'היא רצה', after: 'אמא שלה', prepBase: 'אֶל', translation: 'Она побежала к своей маме' },
  { before: 'הוא פנה', after: 'השופט', prepBase: 'אֶל', translation: 'Он обратился к судье' },
  // מִתַּחַת לְ (под)
  { before: 'הכלב ישן', after: 'השולחן', prepBase: 'מִתַּחַת לְ', translation: 'Собака спит под столом' },
  { before: 'מצאתי את המפתח', after: 'השטיח', prepBase: 'מִתַּחַת לְ', translation: 'Я нашёл ключ под ковром' },
  { before: 'הילדים מתחבאים', after: 'המיטה', prepBase: 'מִתַּחַת לְ', translation: 'Дети прячутся под кроватью' },
  // מוּל (напротив)
  { before: 'אנחנו גרים', after: 'הפארק', prepBase: 'מוּל', translation: 'Мы живём напротив парка' },
  { before: 'בית הקפה נמצא', after: 'התחנה', prepBase: 'מוּל', translation: 'Кафе находится напротив станции' },
  // דֶּרֶךְ (через)
  { before: 'היא מסתכלת', after: 'החלון', prepBase: 'דֶּרֶךְ', translation: 'Она смотрит через окно' },
  { before: 'אנחנו עוברים', after: 'הגשר', prepBase: 'דֶּרֶךְ', translation: 'Мы проходим через мост' },
  { before: 'הוא הגיע', after: 'המדבר', prepBase: 'דֶּרֶךְ', translation: 'Он добрался через пустыню' },
  // בִּמְשֶׁךְ (в течение)
  { before: 'הוא שר', after: 'כל ההצגה', prepBase: 'בִּמְשֶׁךְ', translation: 'Он пел в течение всего спектакля' },
  { before: 'ירד גשם', after: 'שלושה ימים', prepBase: 'בִּמְשֶׁךְ', translation: 'Шёл дождь в течение трёх дней' },
  { before: 'היא חיכתה', after: 'שעה', prepBase: 'בִּמְשֶׁךְ', translation: 'Она ждала в течение часа' },
  // כְּ (как, в роли)
  { before: 'הוא עובד', after: 'מורה', prepBase: 'כְּ', translation: 'Он работает учителем' },
  { before: 'היא התחפשה', after: 'נסיכה', prepBase: 'כְּ', translation: 'Она нарядилась принцессой' },
  { before: 'הוא שימש', after: 'מתורגמן', prepBase: 'כְּ', translation: 'Он служил переводчиком' },
  // אֶת (маркер прямого дополнения)
  { before: 'אני אוהב', after: 'הילדים שלי', prepBase: 'אֶת', translation: 'Я люблю своих детей' },
  { before: 'היא קראה', after: 'הספר כולו', prepBase: 'אֶת', translation: 'Она прочитала всю книгу' },
  { before: 'הם ביקרו', after: 'המוזיאון', prepBase: 'אֶת', translation: 'Они посетили музей' },
  { before: 'הוא הזמין', after: 'כל החברים', prepBase: 'אֶת', translation: 'Он пригласил всех друзей' },
  // מֵעַל לְ (над, сверху)
  { before: 'הציפור עפה', after: 'הים', prepBase: 'מֵעַל לְ', translation: 'Птица летала над морем' },
  { before: 'תלו שלט', after: 'הדלת', prepBase: 'מֵעַל לְ', translation: 'Повесили вывеску над дверью' },
  // לְיַד (рядом с) — use the existing preposition if available, otherwise map
  { before: 'היא יושבת', after: 'החלון', prepBase: 'לְיַד', translation: 'Она сидит у окна' },
  { before: 'הוא עומד', after: 'הדלת', prepBase: 'לְיַד', translation: 'Он стоит у двери' },
  { before: 'בנו בית חדש', after: 'הנהר', prepBase: 'לְיַד', translation: 'Построили новый дом у реки' },
  // Mixed harder sentences
  { before: 'הוא סיפר', after: 'החוויה שלו בצבא', prepBase: 'עַל', translation: 'Он рассказал о своём опыте в армии' },
  { before: 'המכתב נשלח', after: 'דואר אלקטרוני', prepBase: 'דֶּרֶךְ', translation: 'Письмо отправлено через электронную почту' },
  { before: 'הם חגגו', after: 'ארוחת ערב חגיגית', prepBase: 'בְּ', translation: 'Они праздновали за праздничным ужином' },
  { before: 'אני לומד עברית', after: 'שנתיים כבר', prepBase: 'בִּמְשֶׁךְ', translation: 'Я учу иврит уже в течение двух лет' },
  { before: 'הוא הגיע', after: 'כולם', prepBase: 'לִפְנֵי', translation: 'Он пришёл раньше всех' },
  { before: 'היא עשתה הכל', after: 'עזרה', prepBase: 'בְּלִי', translation: 'Она всё сделала без помощи' },
  { before: 'הוא נשאר', after: 'שהכל נגמר', prepBase: 'אַחֲרֵי', translation: 'Он остался после того, как всё закончилось' },
  { before: 'המתנה הזאת', after: 'הילדים', prepBase: 'בִּשְׁבִיל', translation: 'Этот подарок для детей' },
  { before: 'הוא לא הצליח', after: 'הלחץ', prepBase: 'בִּגְלַל', translation: 'Он не справился из-за давления' },
  { before: 'היא דיברה', after: 'עצמה בראי', prepBase: 'אֶל', translation: 'Она говорила сама с собой в зеркало' },
];

const GAME_SIZE = 20;

/* ───── helpers ───── */
// Prepositions usable as answer options (exclude conjunctions/particles with multi-word bases)
const OPTION_PREPS = prepositions.filter(
  p =>
    p.category !== 'conjunction_connect' &&
    p.category !== 'conjunction_oppose' &&
    p.category !== 'conjunction_divide' &&
    p.category !== 'particle' &&
    !p.base.includes('/')
);

function buildSentence(data: SentenceData): Sentence | null {
  const correct = OPTION_PREPS.find(p => p.base === data.prepBase);
  if (!correct) return null;

  const wrong = OPTION_PREPS
    .filter(p => p.base !== data.prepBase)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const options = [correct.base, ...wrong.map(p => p.base)].sort(() => Math.random() - 0.5);

  return {
    textBefore: data.before,
    textAfter: data.after,
    correctPrep: correct.base,
    correctTranscription: correct.baseTranscription,
    translation: data.translation,
    options,
  };
}

function speak(text: string) {
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'he-IL';
    u.rate = getSpeechRate();
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }
}

/* ───── Component ───── */
export default function PrepFillGame() {
  const navigate = useNavigate();
  const { markCorrect, markWrong } = useLearning();
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Pick 20 random sentences each game session
  const order = useMemo(() => {
    const indices = ALL_SENTENCES.map((_, i) => i);
    const shuffled = indices.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, GAME_SIZE);
  }, []);

  const [currentIdx, setCurrentIdx] = useState(0);

  const sentence = useMemo(
    () => (currentIdx < order.length ? buildSentence(ALL_SENTENCES[order[currentIdx]]) : null),
    [currentIdx, order]
  );

  const handleSelect = useCallback(
    (option: string) => {
      if (showResult || !sentence) return;
      setSelected(option);
      setShowResult(true);
      setTotal(t => t + 1);
      if (option === sentence.correctPrep) {
        setScore(s => s + 1);
        markCorrect(`prep-${sentence.correctPrep}`);
      } else {
        markWrong(`prep-${sentence.correctPrep}`);
      }
    },
    [showResult, sentence, markCorrect, markWrong]
  );

  const handleNext = useCallback(() => {
    setSelected(null);
    setShowResult(false);
    setCurrentIdx(i => i + 1);
  }, []);

  const isCorrect = selected === sentence?.correctPrep;
  const isFinished = currentIdx >= order.length || !sentence;

  if (isFinished) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 pb-20">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-foreground mb-2">Игра завершена!</h2>
          <p className="text-lg text-muted-foreground mb-6">
            {score} из {total} правильно ({total > 0 ? Math.round((score / total) * 100) : 0}%)
          </p>
          <div className="flex gap-3">
            <button onClick={() => navigate('/games')} className="px-6 py-3 rounded-xl bg-muted text-foreground font-bold">
              К играм
            </button>
            <button onClick={() => { setCurrentIdx(0); setScore(0); setTotal(0); setSelected(null); setShowResult(false); }} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold">
              Ещё раз
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/games')} className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-black text-foreground">Вставь предлог</h1>
          <p className="text-xs text-muted-foreground">{currentIdx + 1} / {GAME_SIZE}</p>
        </div>
        <div className="bg-primary/10 text-primary font-bold text-sm px-3 py-1.5 rounded-full">
          {score} ✓
        </div>
      </div>

      <div className="flex justify-center mb-4"><SpeechRateSelector variant="compact" /></div>

      <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${(currentIdx / GAME_SIZE) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="bg-card rounded-2xl border border-border p-5 mb-6 shadow-sm"
        >
          <p className="text-sm text-muted-foreground mb-3">{sentence.translation}</p>
          <div className="flex items-center justify-center gap-2 flex-wrap" dir="rtl">
            <span className="font-hebrew text-xl text-foreground">{sentence.textBefore}</span>
            <span
              className={`font-hebrew text-xl font-bold px-3 py-1 rounded-lg min-w-[60px] text-center border-2 border-dashed ${
                showResult
                  ? isCorrect
                    ? 'bg-success/20 border-success text-success'
                    : 'bg-destructive/20 border-destructive text-destructive'
                  : 'bg-primary/10 border-primary/40 text-primary'
              }`}
            >
              {showResult ? sentence.correctPrep : '___'}
            </span>
            <span className="font-hebrew text-xl text-foreground">{sentence.textAfter}</span>
          </div>
          {showResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center justify-center gap-2">
              <button onClick={() => speak(`${sentence.textBefore} ${sentence.correctPrep} ${sentence.textAfter}`)} className="p-2 rounded-lg bg-muted">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              </button>
              <span className="text-xs text-muted-foreground">({sentence.correctTranscription})</span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {sentence.options.map(opt => {
          const isThis = selected === opt;
          const isRight = opt === sentence.correctPrep;
          let bg = 'bg-card border-border';
          if (showResult && isRight) bg = 'bg-success/20 border-success';
          else if (showResult && isThis && !isRight) bg = 'bg-destructive/20 border-destructive';

          return (
            <motion.button
              key={opt}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(opt)}
              disabled={showResult}
              aria-label={`Предлог: ${opt}`}
              className={`p-4 rounded-xl border-2 font-hebrew text-xl font-bold text-foreground flex items-center justify-center min-h-[56px] transition-colors ${bg}`}
              dir="rtl"
            >
              {opt}
              {showResult && isRight && <Check className="w-4 h-4 ml-2 text-success" />}
              {showResult && isThis && !isRight && <X className="w-4 h-4 ml-2 text-destructive" />}
            </motion.button>
          );
        })}
      </div>

      {showResult && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3">
          <p className={`text-sm font-bold ${isCorrect ? 'text-success' : 'text-destructive'}`}>
            {isCorrect ? '✅ Правильно!' : `❌ Правильный ответ: ${sentence.correctPrep}`}
          </p>
          <button onClick={handleNext} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold">
            Далее <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
