// Shared playback rate for all audio modules.
// Persists to localStorage and notifies subscribers via storage + custom event.
import { useCallback, useEffect, useState } from "react";

export type SpeechRateKey = "slow" | "normal" | "fast";

export const SPEECH_RATE_VALUES: Record<SpeechRateKey, number> = {
  slow: 0.7,
  normal: 1.0,
  fast: 1.25,
};

export const SPEECH_RATE_LABELS: Record<SpeechRateKey, string> = {
  slow: "Медленно",
  normal: "Обычная",
  fast: "Быстрее",
};

const STORAGE_KEY = "speechRate";
const EVENT_NAME = "speechRateChanged";

function readStored(): SpeechRateKey {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "slow" || v === "normal" || v === "fast") return v;
  } catch { /* ignore */ }
  return "normal";
}

export function getSpeechRate(): number {
  return SPEECH_RATE_VALUES[readStored()];
}

export function useSpeechRate() {
  const [rateKey, setRateKey] = useState<SpeechRateKey>(() => readStored());

  useEffect(() => {
    const handler = () => setRateKey(readStored());
    window.addEventListener("storage", handler);
    window.addEventListener(EVENT_NAME, handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener(EVENT_NAME, handler);
    };
  }, []);

  const setRate = useCallback((key: SpeechRateKey) => {
    try { localStorage.setItem(STORAGE_KEY, key); } catch { /* ignore */ }
    setRateKey(key);
    window.dispatchEvent(new Event(EVENT_NAME));
  }, []);

  return { rateKey, rate: SPEECH_RATE_VALUES[rateKey], setRate };
}
