import { describe, expect, it } from "vitest";
import { ALL_SENTENCES, buildSentence } from "@/pages/PrepFillGame";

describe("preposition fill game answer pool", () => {
  it("has a playable correct answer for every source sentence", () => {
    expect(ALL_SENTENCES.length).toBeGreaterThan(50);
    for (const sentence of ALL_SENTENCES) {
      const question = buildSentence(sentence);
      expect(question, `missing answer: ${sentence.prepBase}`).not.toBeNull();
      expect(question!.options).toHaveLength(4);
      expect(question!.options).toContain(question!.correctPrep);
      expect(new Set(question!.options).size).toBe(4);
    }
  });

  it("accepts the Hebrew preposition מן instead of ending the game early", () => {
    const examples = ALL_SENTENCES.filter(sentence => sentence.prepBase === "מִ / מִן");
    expect(examples.length).toBeGreaterThan(0);
    for (const example of examples) {
      const question = buildSentence(example);
      expect(question?.correctPrep).toBe("מִן");
      expect(question?.options).toContain("מִן");
    }
  });
});
