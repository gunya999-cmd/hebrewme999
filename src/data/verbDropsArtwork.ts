// Generated artwork mapping for VerbDrops movement verbs.
import walkArtwork from "./verbDropsArtworkData/walk";
import comeArtwork from "./verbDropsArtworkData/come";
import goOutArtwork from "./verbDropsArtworkData/goOut";
import goInArtwork from "./verbDropsArtworkData/goIn";
import returnHomeArtwork from "./verbDropsArtworkData/returnHome";
import crossArtwork from "./verbDropsArtworkData/cross";
import goUpArtwork from "./verbDropsArtworkData/goUp";
import goDownArtwork from "./verbDropsArtworkData/goDown";
import runArtwork from "./verbDropsArtworkData/run";
import moveForwardArtwork from "./verbDropsArtworkData/moveForward";

export const VERB_DROP_MOVEMENT_ARTWORK: Record<string, string> = {
  "ללכת": walkArtwork,
  "לבוא": comeArtwork,
  "לצאת": goOutArtwork,
  "להיכנס": goInArtwork,
  "לחזור": returnHomeArtwork,
  "לעבור": crossArtwork,
  "לעלות": goUpArtwork,
  "לרדת": goDownArtwork,
  "לרוץ": runArtwork,
  "להתקדם": moveForwardArtwork,
};

export function getVerbDropArtworkSrc(infinitiveHebrew: string): string | undefined {
  return VERB_DROP_MOVEMENT_ARTWORK[infinitiveHebrew];
}
