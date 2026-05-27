const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'VerbDropsGame.tsx');
let source = fs.readFileSync(filePath, 'utf8');

function replaceAll(search, replacement) {
  source = source.split(search).join(replacement);
}

// Make VerbDrops a true 5-minute timed session.
// The queue of tasks loops until the timer reaches 0:00, so the number of tasks
// depends on how fast the player answers rather than a fixed list length.

replaceAll(
  '  const currentStep = steps[currentIndex];\n  const isFinished = Boolean(topic && steps.length > 0 && currentIndex >= steps.length);\n  const progressPercent = steps.length ? Math.round((currentIndex / steps.length) * 100) : 0;',
  '  const currentStep = steps.length ? steps[currentIndex % steps.length] : undefined;\n  const isFinished = Boolean(topic && steps.length > 0 && timeLeft <= 0);\n  const progressPercent = Math.round(((SESSION_SECONDS - timeLeft) / SESSION_SECONDS) * 100);'
);

replaceAll(
  '        if (current <= 1) {\n          setCurrentIndex(steps.length);\n          return 0;\n        }',
  '        if (current <= 1) return 0;'
);

replaceAll(
  '{currentIndex + 1}/{steps.length}',
  '{currentIndex + 1} карточек'
);

replaceAll(
  'Сессия завершена</h1>\n          <p className="text-muted-foreground mt-2">Глаголы прошли через картинку, звук и буквы.</p>',
  '5 минут завершены</h1>\n          <p className="text-muted-foreground mt-2">Количество заданий зависело от скорости прохождения.</p>'
);

replaceAll(
  '<p className="text-3xl font-black text-success">{score.correct}</p><p className="text-xs text-muted-foreground font-semibold">правильно</p>',
  '<p className="text-3xl font-black text-success">{score.correct}</p><p className="text-xs text-muted-foreground font-semibold">правильно</p>'
);

replaceAll(
  '<div className="grid grid-cols-2 gap-3 my-7">',
  '<div className="grid grid-cols-3 gap-3 my-7">'
);

replaceAll(
  '<div className="rounded-2xl border border-border bg-card p-4"><p className="text-3xl font-black text-destructive">{score.wrong}</p><p className="text-xs text-muted-foreground font-semibold">ошибок</p></div>',
  '<div className="rounded-2xl border border-border bg-card p-4"><p className="text-3xl font-black text-destructive">{score.wrong}</p><p className="text-xs text-muted-foreground font-semibold">ошибок</p></div><div className="rounded-2xl border border-border bg-card p-4"><p className="text-3xl font-black text-primary">{currentIndex}</p><p className="text-xs text-muted-foreground font-semibold">карточек</p></div>'
);

fs.writeFileSync(filePath, source);
console.log('[verb-drops timed session patch] applied');
