/**
 * Gemini Live transcription events can arrive either as small deltas
 * ("שלום" + "מה נשמע") or as growing partial snapshots
 * ("שלום" -> "שלום, מה נשמע"). This helper merges both forms without
 * duplicating text and without dropping the final tail of the sentence.
 */
export function mergeTranscriptChunk(buffer: string, chunk: string): string {
  const current = normalizeLiveText(buffer);
  const next = normalizeLiveText(chunk);

  if (!next) return current;
  if (!current) return next;

  // Some providers resend the full current transcript on every update.
  if (next.startsWith(current)) return next;

  // Sometimes the same final chunk arrives twice.
  if (current.endsWith(next)) return current;

  // Merge by maximal suffix/prefix overlap: "שלום, מ" + "מה נשמע".
  const maxOverlap = Math.min(current.length, next.length);
  for (let size = maxOverlap; size > 0; size -= 1) {
    if (current.slice(-size) === next.slice(0, size)) {
      return `${current}${next.slice(size)}`;
    }
  }

  return `${current} ${next}`;
}

export function normalizeLiveText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}
