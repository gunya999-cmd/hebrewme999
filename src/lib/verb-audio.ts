import { Verb } from "@/types/verb";
import { getSpeechRate } from "@/hooks/useSpeechRate";

const TOP350_ID_RE = /^top350-(\d{3})$/;

export function getGeneratedVerbAudioUrls(verb: Verb): string[] {
  const match = TOP350_ID_RE.exec(verb.id);
  if (!match) return [];
  const number = match[1];
  return [`/audio/verbs/${number}.mp3`, `/audio/verbs/${number}.wav`];
}

export function getGeneratedVerbAudioUrl(verb: Verb): string | null {
  return getGeneratedVerbAudioUrls(verb)[0] ?? null;
}

function speakWithBrowser(text: string): void {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "he-IL";
  utterance.rate = getSpeechRate();
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function playAudioUrl(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.playbackRate = getSpeechRate();
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error(`Audio failed to load: ${url}`));
    audio.play().catch(reject);
  });
}

export async function playVerbAudio(verb: Verb): Promise<void> {
  const audioUrls = getGeneratedVerbAudioUrls(verb);
  if (!audioUrls.length) {
    speakWithBrowser(verb.infinitive_hebrew);
    return;
  }

  speechSynthesis.cancel();

  for (const audioUrl of audioUrls) {
    try {
      await playAudioUrl(audioUrl);
      return;
    } catch (error) {
      console.warn("Generated verb audio unavailable; trying next source", audioUrl, error);
    }
  }

  speakWithBrowser(verb.infinitive_hebrew);
}

export function speakHebrewWithBrowser(text: string): void {
  speakWithBrowser(text);
}
