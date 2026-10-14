import { test, expect } from "@playwright/test";

test("Miriam tutor page loads and offers voice entry", async ({ page }) => {
  await page.goto("/ai-tutor");
  await expect(page.getByText("AI Репетитор").first()).toBeVisible();
  await expect(page.getByText("Позвонить Мирьям").first()).toBeVisible();
});

test("voice dialogue displays a safe setup screen without credentials", async ({ page }) => {
  await page.goto("/voice-dialogue");
  await expect(page.locator("body")).toContainText(/Мирьям|микрофон|разговор|Начинающий/i);
  await expect(page.locator("body")).not.toContainText(/undefined|Cannot read properties/i);
});
