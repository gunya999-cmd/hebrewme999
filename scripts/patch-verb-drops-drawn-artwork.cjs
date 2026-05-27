const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'components', 'VerbDropArtwork.tsx');
let source = fs.readFileSync(filePath, 'utf8');

function replaceOnce(search, replacement) {
  if (!source.includes(search)) {
    console.warn(`[verb-drops drawn artwork patch] pattern not found: ${search.slice(0, 90)}...`);
    return;
  }
  source = source.replace(search, replacement);
}

replaceOnce(
  'import VerbIllustration from "@/components/VerbIllustration";\n',
  'import VerbIllustration from "@/components/VerbIllustration";\nimport { getDrawnVerbDropArtwork } from "@/data/verbDropsArtworkData";\n'
);

replaceOnce(
  'export default function VerbDropArtwork({ verb, className = "" }: VerbDropArtworkProps) {\n  const scene = getMovementScene(verb.infinitive_hebrew);',
  'export default function VerbDropArtwork({ verb, className = "" }: VerbDropArtworkProps) {\n  const drawnArtwork = getDrawnVerbDropArtwork(verb.infinitive_hebrew);\n\n  if (drawnArtwork) {\n    return (\n      <div className={`relative overflow-hidden rounded-[2rem] bg-white ${className}`}>\n        <img\n          src={drawnArtwork}\n          alt={verb.translation_ru}\n          className="h-full w-full object-cover"\n          loading="eager"\n          decoding="async"\n          draggable={false}\n        />\n      </div>\n    );\n  }\n\n  const scene = getMovementScene(verb.infinitive_hebrew);'
);

fs.writeFileSync(filePath, source);
console.log('[verb-drops drawn artwork patch] applied');
