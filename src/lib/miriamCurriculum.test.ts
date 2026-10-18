import { describe, expect, it } from "vitest";
import { nextReview } from "./miriamCurriculum";

describe("Miriam spaced repetition", () => {
  const item = { term: "שלום", dueAt: 0, intervalDays: 1, repetitions: 0 };
  const now = Date.UTC(2026, 9, 13);
  it("schedules a new word for tomorrow after a correct answer", () => {
    expect(nextReview(item, true, now)).toEqual({
      ...item, repetitions: 1, intervalDays: 1, dueAt: now + 86400000,
    });
  });
  it("increases intervals on repeated correct answers", () => {
    expect(nextReview({ ...item, repetitions: 1 }, true, now).intervalDays).toBe(3);
    expect(nextReview({ ...item, repetitions: 2, intervalDays: 3 }, true, now).intervalDays).toBe(6);
  });
  it("resets a forgotten word", () => {
    expect(nextReview({ ...item, repetitions: 5, intervalDays: 32 }, false, now)).toEqual({
      ...item, repetitions: 0, intervalDays: 1, dueAt: now + 86400000,
    });
  });
});
