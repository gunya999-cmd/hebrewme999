import { beforeEach, describe, expect, it } from "vitest";
import { mergeProgress, readProgress, saveAttempt } from "@/lib/miriamProgress";
import { lessonPrompt, LESSONS } from "@/lib/miriamCurriculum";

beforeEach(() => localStorage.clear());

describe("Rachel lesson reliability", () => {
  it("upserts the same voice session on every finalized turn", () => {
    saveAttempt("a1-greetings", 1, ["שלום", "קוראים לי"], "session-1");
    saveAttempt("a1-greetings", 2, ["שלום", "קוראים לי"], "session-1");
    const data = readProgress();
    expect(data.attempts).toHaveLength(1);
    expect(data.attempts[0]).toMatchObject({ lessonId: "a1-greetings", userTurns: 2, sessionId: "session-1" });
    expect(data.reviews).toHaveLength(2);
    // Progress is durable even without explicitly ending the voice call.
    expect(JSON.parse(localStorage.getItem("miriam-learning-v1") || "{}").attempts[0].userTurns).toBe(2);
  });

  it("keeps distinct sessions and merges duplicate session snapshots by most turns", () => {
    const older = { lessonId: "a1-greetings", at: 1, userTurns: 1, sessionId: "session-1" };
    const newer = { lessonId: "a1-greetings", at: 2, userTurns: 4, sessionId: "session-1" };
    const separate = { lessonId: "a1-greetings", at: 3, userTurns: 2, sessionId: "session-2" };
    expect(mergeProgress({ attempts: [newer, separate], reviews: [] }, { attempts: [older], reviews: [] }).attempts)
      .toEqual([newer, separate]);
  });

  it("uses the selected interface language for A1 explanations", () => {
    const lesson = LESSONS.find(item => item.id === "a1-greetings")!;
    expect(lessonPrompt(lesson, "en")).toContain("in English");
    expect(lessonPrompt(lesson, "ru")).toContain("in Russian");
    expect(lessonPrompt(lesson, "he")).toContain("in simple Hebrew");
  });
});
