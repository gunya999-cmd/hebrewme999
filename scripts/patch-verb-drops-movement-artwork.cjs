const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'VerbDropsGame.tsx');
let source = fs.readFileSync(filePath, 'utf8');

function replaceOnce(search, replacement) {
  if (!source.includes(search)) {
    console.warn(`[verb-drops movement artwork patch] pattern not found: ${search.slice(0, 90)}...`);
    return;
  }
  source = source.replace(search, replacement);
}

replaceOnce(
  'import VerbIllustration from "@/components/VerbIllustration";',
  'import VerbDropArtwork from "@/components/VerbDropArtwork";'
);

// Hero on the category screen: keep a movement-specific generated scene instead of the old abstract illustration.
replaceOnce(
  '<VerbIllustration type="walk" className="h-44 mb-4 relative z-10" />',
  '<VerbDropArtwork verb={{ id: "hero-walk", infinitive_hebrew: "ללכת", transcription_ru: "", translation_ru: "идти", binyan: "פעל", root: "הלך", category: "movement", visualType: "walk", frequencyRank: 0 }} className="h-44 mb-4 relative z-10" />'
);
replaceOnce(
  '<VerbIllustration type="walk" className="h-44 mb-4" />',
  '<VerbDropArtwork verb={{ id: "hero-walk", infinitive_hebrew: "ללכת", transcription_ru: "", translation_ru: "идти", binyan: "פעל", root: "הלך", category: "movement", visualType: "walk", frequencyRank: 0 }} className="h-44 mb-4" />'
);

// Drops-like patch wraps the main verb illustration in this motion card.
replaceOnce(
  '<motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} className="rounded-[2.5rem] border border-white/70 bg-white/80 p-4 shadow-2xl shadow-primary/10 backdrop-blur-md mb-5"><VerbIllustration type={currentStep.verb.visualType} className="h-60" /></motion.div>',
  '<motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} className="rounded-[2.5rem] border border-white/70 bg-white/80 p-4 shadow-2xl shadow-primary/10 backdrop-blur-md mb-5"><VerbDropArtwork verb={currentStep.verb} className="h-60" /></motion.div>'
);

// Fallback if the drops-like patch did not run for some reason.
replaceOnce(
  '<VerbIllustration type={currentStep.verb.visualType} className="h-56 mb-5" />',
  '<VerbDropArtwork verb={currentStep.verb} className="h-56 mb-5" />'
);

fs.writeFileSync(filePath, source);
console.log('[verb-drops movement artwork patch] applied');
