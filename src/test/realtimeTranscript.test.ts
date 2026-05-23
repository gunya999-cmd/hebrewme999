import { describe, expect, it } from "vitest";
import { mergeTranscriptChunk, normalizeLiveText } from "@/lib/realtimeTranscript";

describe("realtime transcript helpers", () => {
  it("normalizes live transcription whitespace", () => {
    expect(normalizeLiveText("  שלום   לך\nמה נשמע  ")).toBe("שלום לך מה נשמע");
  });

  it("appends delta chunks without losing the sentence tail", () => {
    expect(mergeTranscriptChunk("שלום", "מה נשמע?")).toBe("שלום מה נשמע?");
  });

  it("keeps growing snapshot chunks as the full latest text", () => {
    expect(mergeTranscriptChunk("שלום", "שלום, מה נשמע?")).toBe("שלום, מה נשמע?");
  });

  it("deduplicates repeated final chunks", () => {
    expect(mergeTranscriptChunk("שלום מה נשמע?", "מה נשמע?")).toBe("שלום מה נשמע?");
  });

  it("merges overlapping Hebrew fragments", () => {
    expect(mergeTranscriptChunk("שלום מ", "מה נשמע?")).toBe("שלום מה נשמע?");
  });
});
