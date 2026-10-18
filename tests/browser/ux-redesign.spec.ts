import { expect, test } from "@playwright/test";

test("home presents a single clear start and accurate activity labels", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Иврит через действия" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Начать 5 минут/ })).toBeVisible();
  await expect(page.getByText("повторений сделано")).toBeVisible();
  await expect(page.getByText("пора повторить")).toBeVisible();
  await expect(page.getByRole("progressbar", { name: "Доля изученных глаголов" })).toHaveAttribute("aria-valuenow", /^\d+$/);
  await page.getByRole("button", { name: /Говорить с Ракель/ }).click();
  await expect(page).toHaveURL(/\/ai-tutor$/);
  await expect(page.getByRole("heading", { name: "AI Репетитор" })).toBeVisible();
});

test("lesson levels are discoverable and selection filters curriculum without starting a call", async ({ page }) => {
  const voiceRequests: string[] = [];
  page.on("request", request => {
    if (request.url().includes("/api/voice-config")) voiceRequests.push(request.url());
  });
  await page.goto("/ai-tutor");
  await expect(page.getByRole("button", { name: "Позвонить Ракель" })).toBeVisible();
  await expect(page.getByRole("button", { name: "A1" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: /Приветствие и знакомство/ })).toBeVisible();
  await page.getByRole("button", { name: "A2" }).click();
  await expect(page.getByRole("button", { name: "A2" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: /Покупки и размеры/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Приветствие и знакомство/ })).toHaveCount(0);
  expect(voiceRequests).toHaveLength(0);
});

test("bottom navigation identifies current page across nested routes", async ({ page }) => {
  await page.goto("/games/guess-root");
  await expect(page.getByRole("navigation", { name: "Основная навигация" }).getByRole("button", { name: "Игры" })).toHaveAttribute("aria-current", "page");
  await page.goto("/voice-dialogue");
  await expect(page.getByRole("navigation", { name: "Основная навигация" }).getByRole("button", { name: "Ракель" })).toHaveAttribute("aria-current", "page");
});

test("home and tutor fit a narrow phone without horizontal document overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  for (const route of ["/", "/ai-tutor"]) {
    await page.goto(route);
    await expect(page.getByRole("navigation", { name: "Основная навигация" })).toBeVisible();
    const sizing = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(sizing.content, route + " should not overflow horizontally").toBeLessThanOrEqual(sizing.viewport + 1);
  }
});


test("dictionary filters and empty state are usable with touch and keyboard", async ({ page }) => {
  await page.goto("/dictionary");
  const search = page.getByRole("searchbox", { name: "Найти глагол" });
  await expect(search).toBeVisible();
  await search.fill("zxq-no-such-verb-123");
  await expect(page.getByRole("heading", { name: "Ничего не найдено" })).toBeVisible();
  await page.getByRole("button", { name: "Сбросить фильтры" }).click();
  await expect(search).toHaveValue("");
  await expect(page.getByRole("button", { name: "Все" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(/^Найдено \d+ из \d+$/)).toBeVisible();
});

test("games catalog offers a direct route to grammar practice", async ({ page }) => {
  await page.goto("/games");
  await expect(page.getByRole("heading", { name: "Игры и практика" })).toBeVisible();
  await page.getByRole("button", { name: /Узнай модель/ }).click();
  await expect(page).toHaveURL(/\/games\/guess-binyan$/);
});
