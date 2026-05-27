import walkArtwork from "./walk";

export const DRAWN_VERB_DROP_ARTWORK: Record<string, string> = {
  "ללכת": walkArtwork,
};

export function getDrawnVerbDropArtwork(infinitiveHebrew: string): string | undefined {
  return DRAWN_VERB_DROP_ARTWORK[infinitiveHebrew];
}
