// Hook: record microphone audio and transcribe Hebrew via Gemini.
//
// We deliberately bypass the browser's built-in SpeechRecognition for Hebrew
// because Chrome desktop ("he-IL") routinely mis-recognises Hebrew as Thai,
// Arabic or romanised text. Instead, we capture raw audio with MediaRecorder
// and send it to the `transcribe-hebrew` edge function (Gemini multimodal).

import { useCallback, useEffect, useRef, useState } from "react";

const TRANSCRIBE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe-hebrew`;

function pickMimeType(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4;codecs=mp4a.40.2", // iOS Safari
    "audio/mp4",
  ];
  for (const c of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(c)) return c;
  }
  return "audio/webm";
}

async function blobToBase64(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)) as number[]);
  }
  return btoa(binary);
}

export function useHebrewRecorder() {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const mimeRef = useRef<string>("audio/webm");
  const resolveRef = useRef<((text: string) => void) | null>(null);
  const expectedRef = useRef<string | undefined>(undefined);

  const cleanup = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  /** Start recording. Returns a promise that resolves with the transcript when stop() is called. */
  const start = useCallback(async (opts?: { expectedText?: string }): Promise<string> => {
    setError(null);
    expectedRef.current = opts?.expectedText;

    if (!navigator.mediaDevices?.getUserMedia) {
      const msg = "Браузер не поддерживает запись звука";
      setError(msg);
      throw new Error(msg);
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });
    streamRef.current = stream;

    const mime = pickMimeType();
    mimeRef.current = mime;
    const recorder = new MediaRecorder(stream, { mimeType: mime });
    recorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };

    return new Promise<string>((resolve, reject) => {
      resolveRef.current = resolve;

      recorder.onerror = (e) => {
        cleanup();
        setRecording(false);
        setTranscribing(false);
        const err = (e as unknown as { error?: { message?: string } })?.error?.message || "Ошибка записи";
        setError(err);
        reject(new Error(err));
      };

      recorder.onstop = async () => {
        setRecording(false);
        setTranscribing(true);
        try {
          const blob = new Blob(chunksRef.current, { type: mime });
          chunksRef.current = [];
          // Skip transcription on suspiciously short clips.
          // mp4/aac has larger headers so threshold is higher.
          const minSize = mime.includes("mp4") ? 4000 : 1500;
          if (blob.size < minSize) {
            resolveRef.current?.("");
            return;
          }
          const base64 = await blobToBase64(blob);
          const resp = await fetch(TRANSCRIBE_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              audio: base64,
              mimeType: mime,
              expectedText: expectedRef.current,
            }),
          });
          if (!resp.ok) {
            const text = await resp.text().catch(() => "");
            throw new Error(text || `HTTP ${resp.status}`);
          }
          const data = await resp.json();
          const transcript: string = (data?.transcript || "").trim();
          resolveRef.current?.(transcript);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Не удалось распознать речь";
          setError(msg);
          reject(err instanceof Error ? err : new Error(msg));
        } finally {
          setTranscribing(false);
          cleanup();
        }
      };

      try {
        recorder.start(250);
        setRecording(true);
      } catch (err) {
        cleanup();
        const msg = err instanceof Error ? err.message : "Не удалось начать запись";
        setError(msg);
        reject(new Error(msg));
      }
    });
  }, [cleanup]);

  const stop = useCallback(() => {
    const r = recorderRef.current;
    if (r && r.state !== "inactive") {
      try { r.stop(); } catch { /* ignore */ }
    } else {
      cleanup();
      setRecording(false);
    }
  }, [cleanup]);

  const cancel = useCallback(() => {
    resolveRef.current = null;
    const r = recorderRef.current;
    if (r && r.state !== "inactive") {
      try { r.stop(); } catch { /* ignore */ }
    }
    chunksRef.current = [];
    cleanup();
    setRecording(false);
    setTranscribing(false);
  }, [cleanup]);

  return { recording, transcribing, error, start, stop, cancel };
}
