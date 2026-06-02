import { Verb } from "@/types/verb";
import { getSpeechRate } from "@/hooks/useSpeechRate";

const TOP350_ID_RE = /^top350-(\d{3})$/;

export function getGeneratedVerbAudioUrl(verb: Verb): string | null {
  const match = TOP350_ID_RE.exec(verb.id);
  if (!match) return null;
  return `/audio/verbs/${match[1]}.wav`;
}

function speakWithBrowser(text: string): void {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "he-IL";
  utterance.rate = getSpeechRate();
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

export async function playVerbAudio(verb: Verb): Promise<void> {
  const audioUrl = getGeneratedVerbAudioUrl(verb);
  if (!audioUrl) {
    speakWithBrowser(verb.infinitive_hebrew);
    return;
  }

  try {
    speechSynthesis.cancel();
    const audio = new Audio(audioUrl);
    audio.playbackRate = getSpeechRate();
    await audio.play();
  } catch (error) {
    console.warn("Generated verb audio unavailable; falling back to browser TTS", error);
    speakWithBrowser(verb.infinitive_hebrew);
  }
}

export function speakHebrewWithBrowser(text: string): void {
  speakWithBrowser(text);
}
