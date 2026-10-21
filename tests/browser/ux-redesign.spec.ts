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

test("creators page is discoverable on home and lists all four creators", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");
  await page.getByRole("button", { name: "О приложении и создателях" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { name: "Создатели HebrewMe" })).toBeVisible();
  for (const name of ["Георгий Гуревич", "Людмила Гуревич", "Михаил Гуревич", "Никита Гуревич"]) {
    await expect(page.getByRole("heading", { name })).toBeVisible();
  }
  const sizing = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(sizing.content).toBeLessThanOrEqual(sizing.viewport + 1);
  await page.getByRole("button", { name: "На главную" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("language selection persists, translates navigation, and enables Hebrew RTL", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");
  const chooser = page.getByRole("combobox", { name: "Язык приложения" });
  await expect(chooser).toHaveValue("ru");

  await chooser.selectOption("en");
  await expect(page.getByRole("heading", { name: "Learn Hebrew by doing" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("button", { name: "Today" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("combobox", { name: "App language" })).toHaveValue("en");
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "HebrewMe creators" })).toBeVisible();

  await page.getByRole("combobox", { name: "App language" }).selectOption("he");
  await expect(page.locator("html")).toHaveAttribute("lang", "he");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { name: "יוצרי HebrewMe" })).toBeVisible();
  const people = [
    ["גאורגי גורביץ'", "Георгий Гуревич"],
    ["לודמילה גורביץ'", "Людмила Гуревич"],
    ["מיכאל גורביץ'", "Михаил Гуревич"],
    ["ניקיטה גורביץ'", "Никита Гуревич"],
  ];
  for (const [hebrew, russian] of people) {
    const card = page.locator("article").filter({ has: page.getByRole("heading", { name: hebrew }) });
    await expect(card).toHaveCount(1);
    await expect(card.locator("h3")).toHaveText(hebrew);
    await expect(card.locator("h3")).toHaveAttribute("lang", "he");
    await expect(card.locator("p[lang='ru']")).toHaveText(russian);
    await expect(card.locator("p[lang='ru']")).toHaveAttribute("dir", "ltr");
  }
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "לומדים עברית דרך עשייה" })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "שפת האפליקציה" })).toHaveValue("he");
  await page.goto("/games");
  await expect(page.getByRole("heading", { name: "משחקים ותרגול" })).toBeVisible();
  const sizes = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(sizes.content).toBeLessThanOrEqual(sizes.viewport + 1);

  await page.getByRole("combobox", { name: "שפת האפליקציה" }).selectOption("ru");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Язык приложения" })).toHaveValue("ru");
});
