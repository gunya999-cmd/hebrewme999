const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src', 'pages', 'VerbDropsGame.tsx');
let source = fs.readFileSync(filePath, 'utf8');

function replaceOnce(search, replacement) {
  if (!source.includes(search)) {
    console.warn(`[verb-drops audio patch] pattern not found: ${search.slice(0, 80)}...`);
    return;
  }
  source = source.replace(search, replacement);
}

// Stabilize audio playback:
// - keep app playback volume fixed at 1.0
// - cache in-flight TTS requests to avoid duplicate calls
// - prefetch the next verbs while the player is answering
// - use browser he-IL speech as a quick fallback if TTS generation is slow
// - ignore stale audio events when the user taps several words quickly

replaceOnce(
  '  utterance.lang = "he-IL";\n  utterance.rate = 0.85;\n  window.speechSynthesis.cancel();',
  '  utterance.lang = "he-IL";\n  utterance.rate = 0.9;\n  utterance.pitch = 1;\n  utterance.volume = 1;\n  window.speechSynthesis.cancel();'
);

replaceOnce(
  '  const audioRef = useRef<HTMLAudioElement | null>(null);\n  const audioCacheRef = useRef<Map<string, string>>(new Map());',
  '  const audioRef = useRef<HTMLAudioElement | null>(null);\n  const audioCacheRef = useRef<Map<string, string>>(new Map());\n  const audioRequestCacheRef = useRef<Map<string, Promise<string>>>(new Map());\n  const audioPlayTokenRef = useRef(0);'
);

replaceOnce(
  '  const prepareLetters = useCallback((verb: VerbDropCard) => {',
  '  const fetchAudioUrl = useCallback(async (verb: VerbDropCard): Promise<string> => {\n    const cached = audioCacheRef.current.get(verb.id);\n    if (cached) return cached;\n\n    const inFlight = audioRequestCacheRef.current.get(verb.id);\n    if (inFlight) return inFlight;\n\n    const text = stripHebrewMarks(verb.infinitive_hebrew);\n    const request = supabase.functions.invoke("tts-word", { body: { text } })\n      .then(({ data, error }) => {\n        const dataAny = data as { audio?: string; mime?: string } | null;\n        if (error || !dataAny?.audio) throw error || new Error("No audio returned from tts-word");\n\n        const binary = atob(dataAny.audio);\n        const bytes = new Uint8Array(binary.length);\n        for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);\n\n        const blob = new Blob([bytes], { type: dataAny.mime || "audio/wav" });\n        const url = URL.createObjectURL(blob);\n        audioCacheRef.current.set(verb.id, url);\n        return url;\n      })\n      .finally(() => {\n        audioRequestCacheRef.current.delete(verb.id);\n      });\n\n    audioRequestCacheRef.current.set(verb.id, request);\n    return request;\n  }, []);\n\n  const warmAudioCache = useCallback((verbs: VerbDropCard[]) => {\n    if (!isSupabaseConfigured) return;\n\n    const unique = verbs.filter((verb, index, arr) => arr.findIndex((item) => item.id === verb.id) === index);\n    unique.slice(0, 8).forEach((verb) => {\n      if (!audioCacheRef.current.has(verb.id) && !audioRequestCacheRef.current.has(verb.id)) {\n        void fetchAudioUrl(verb).catch(() => {\n          // Prefetch is best-effort. Manual playback still has browser he-IL fallback.\n        });\n      }\n    });\n  }, [fetchAudioUrl]);\n\n  const prepareLetters = useCallback((verb: VerbDropCard) => {'
);

replaceOnce(
  '  useEffect(() => {\n    if (currentStep?.mode === "letters") prepareLetters(currentStep.verb);\n  }, [currentStep?.id, currentStep?.mode, currentStep?.verb, prepareLetters]);',
  '  useEffect(() => {\n    if (currentStep?.mode === "letters") prepareLetters(currentStep.verb);\n  }, [currentStep?.id, currentStep?.mode, currentStep?.verb, prepareLetters]);\n\n  useEffect(() => {\n    if (!steps.length) return;\n    const upcoming = Array.from({ length: Math.min(6, steps.length) }, (_, offset) => steps[(currentIndex + offset) % steps.length].verb);\n    warmAudioCache(upcoming);\n  }, [currentIndex, steps, warmAudioCache]);'
);

replaceOnce(
  '    setScore({ correct: 0, wrong: 0 });\n  }, [progress]);',
  '    setScore({ correct: 0, wrong: 0 });\n    warmAudioCache(nextSteps.map((step) => step.verb));\n  }, [progress, warmAudioCache]);'
);

const oldPlayAudio = /  const playAudio = useCallback\(async \(verb: VerbDropCard\) => \{[\s\S]*?\n  \}, \[\]\);\n/;
const newPlayAudio = `  const playAudio = useCallback(async (verb: VerbDropCard) => {
    const text = stripHebrewMarks(verb.infinitive_hebrew);
    const token = audioPlayTokenRef.current + 1;
    audioPlayTokenRef.current = token;

    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current = null;
      }

      if (!isSupabaseConfigured) {
        speakWithBrowser(text);
        return;
      }

      setPlaying(true);
      let didFallback = false;
      const fallbackTimer = window.setTimeout(() => {
        if (audioPlayTokenRef.current !== token) return;
        didFallback = true;
        setPlaying(false);
        speakWithBrowser(text);
      }, 750);

      const audioUrl = await fetchAudioUrl(verb);
      window.clearTimeout(fallbackTimer);

      // If browser speech already played because TTS was slow, keep the cached
      // Supabase audio for the next tap but do not double-play this word.
      if (didFallback || audioPlayTokenRef.current !== token) return;

      const audio = new Audio(audioUrl);
      audio.preload = "auto";
      audio.volume = 1;
      audioRef.current = audio;
      audio.onended = () => {
        if (audioPlayTokenRef.current === token) setPlaying(false);
      };
      audio.onerror = () => {
        if (audioPlayTokenRef.current !== token) return;
        setPlaying(false);
        speakWithBrowser(text);
      };

      await audio.play();
    } catch {
      if (audioPlayTokenRef.current === token) {
        setPlaying(false);
        speakWithBrowser(text);
      }
    }
  }, [fetchAudioUrl]);
`;

if (!oldPlayAudio.test(source)) {
  throw new Error('[verb-drops audio patch] playAudio block not found');
}
source = source.replace(oldPlayAudio, newPlayAudio);

fs.writeFileSync(filePath, source);
console.log('[verb-drops audio stability patch] applied');
