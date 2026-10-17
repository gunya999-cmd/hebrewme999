import { describe, expect, it } from "vitest";
import { mergeProgress, readProgress, saveAttempt, reviewTerm, dueTerms, type Progress } from "./miriamProgress";

describe("Miriam progress merge", () => {
  it("keeps distinct lesson attempts from both devices", () => {
    const local: Progress = { attempts: [{ lessonId: "a1-cafe", at: 100, userTurns: 3 }], reviews: [] };
    const remote: Progress = { attempts: [{ lessonId: "a1-greetings", at: 200, userTurns: 4 }], reviews: [] };
    expect(mergeProgress(local, remote).attempts).toHaveLength(2);
  });
  it("does not duplicate identical attempts", () => {
    const attempt = { lessonId: "a1-cafe", at: 100, userTurns: 3 };
    expect(mergeProgress({ attempts: [attempt], reviews: [] }, { attempts: [attempt], reviews: [] }).attempts).toHaveLength(1);
  });
  it("retains the most recently practiced review", () => {
    const old = { term: "שלום", dueAt: 86400100, intervalDays: 1, repetitions: 1 };
    const newer = { ...old, dueAt: 259200200, intervalDays: 3, repetitions: 2 };
    const result = mergeProgress({ attempts: [], reviews: [old] }, { attempts: [], reviews: [newer] });
    expect(result.reviews).toEqual([newer]);
  });
});

describe("local lesson persistence", () => {
  it("stores lesson attempts and vocabulary locally", () => {
    localStorage.clear();
    const progress = saveAttempt("lesson-a", 3, ["שלום"]);
    expect(progress.attempts).toHaveLength(1);
    expect(readProgress().reviews[0].term).toBe("שלום");
  });
  it("updates spaced repetition after review", () => {
    localStorage.clear();
    saveAttempt("lesson-a", 2, ["שלום"]);
    const updated = reviewTerm("שלום", false);
    expect(updated.reviews[0].repetitions).toBe(0);
    expect(dueTerms(updated)).toHaveLength(0);
  });
});
