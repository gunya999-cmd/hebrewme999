import { describe, expect, it } from "vitest";
import { mergeProgress, type Progress } from "./miriamProgress";

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
