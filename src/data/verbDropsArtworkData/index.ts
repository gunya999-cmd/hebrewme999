export const DRAWN_VERB_DROP_ARTWORK: Record<string, string> = {
  "ללכת": "/verb-drops/artwork/walk.webp",
  "לבוא": "/verb-drops/artwork/come.webp",
  "לצאת": "/verb-drops/artwork/exit.webp",
  "להיכנס": "/verb-drops/artwork/enter.webp",
  "לחזור": "/verb-drops/artwork/return.webp",
  "לעבור": "/verb-drops/artwork/cross.webp",
  "לעלות": "/verb-drops/artwork/go-up.webp",
  "לרדת": "/verb-drops/artwork/go-down.webp",
  "לרוץ": "/verb-drops/artwork/run.webp",
  "להתקדם": "/verb-drops/artwork/move-forward.webp",
};

export function getDrawnVerbDropArtwork(infinitiveHebrew: string): string | undefined {
  return DRAWN_VERB_DROP_ARTWORK[infinitiveHebrew];
}
