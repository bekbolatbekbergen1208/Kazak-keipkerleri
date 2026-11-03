import { test, expect } from "@playwright/test";

test("animated tale follows 18 episodes, can pause, has a source and saves progress", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/ertostik");
  await expect(
    page.getByRole("heading", {
      name: "Ер Төстік: анимациялық ертегі",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator(".cinema-episode-list > button")).toHaveCount(18);
  await expect(
    page.getByRole("link", { name: "ТОЛЫҚ ЕРТЕГІНІ ОҚУ", exact: true }),
  ).toHaveAttribute("href", "/ertostik/full");
  await expect(
    page.getByRole("link", {
      name: "Кітапханадағы толық мәтін ↗",
      exact: true,
    }),
  ).toHaveAttribute(
    "href",
    "https://www.pushkinlibrary.kz/exhibitions/bayterek_kaz/Er-Tostik.htm",
  );
  await page
    .getByRole("button", { name: "КӨРУДІ ЖАЛҒАСТЫРУ", exact: true })
    .click();
  const first = await page
    .locator(".film-clouds")
    .evaluate((e) => getComputedStyle(e).transform);
  await page.waitForTimeout(300);
  expect(
    await page
      .locator(".film-clouds")
      .evaluate((e) => getComputedStyle(e).transform),
  ).not.toEqual(first);
  await page.getByRole("button", { name: "ТОҚТАТА ТҰРУ", exact: true }).click();
  await expect(page.locator(".film-clouds")).toHaveCSS(
    "animation-play-state",
    "paused",
  );
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  const paused = await page
    .locator(".film-clouds")
    .evaluate((e) => getComputedStyle(e).transform);
  await page.waitForTimeout(300);
  expect(
    await page
      .locator(".film-clouds")
      .evaluate((e) => getComputedStyle(e).transform),
  ).toEqual(paused);
  await page
    .getByRole("button", { name: "КӨРУДІ ЖАЛҒАСТЫРУ", exact: true })
    .click();
  await expect(page.locator(".cinema-caption > span")).toHaveText("2 / 36", {
    timeout: 12000,
  });
  await page.getByRole("button", { name: "ТОҚТАТА ТҰРУ", exact: true }).click();
  for (let i = 0; i < 35; i++)
    await page
      .getByRole("button", { name: "Келесі көрініс", exact: true })
      .click();
  await expect(page.locator(".cinema-finale")).toBeVisible();
  await expect(page.locator(".xp-pill")).toContainText("460");
  await page.reload();
  await expect(page.locator(".cinema-bottom-info")).toContainText("18 / 18");
  await expect(page.locator(".cinema-episode-heading")).toContainText(
    "Елге оралу",
  );
  await page
    .getByRole("button", { name: "Келесі көрініс", exact: true })
    .click();
  await expect(page.locator(".xp-pill")).toContainText("460");
  await expect(page.locator(".cinema-share a")).toHaveAttribute(
    "href",
    /\/ertostik$/,
  );
  expect(errors).toEqual([]);
});
test("mobile library filters, favorites, readable pages, and completion persist", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .locator(".story-quicknav")
    .getByRole("button", { name: "ЕРТЕГІЛЕР", exact: true })
    .click();
  await page.getByRole("textbox", { name: "Ертегіні іздеу" }).fill("Адал");
  await expect(page.locator(".tale-book")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Адал уәде: таңдаулыға сақтау", exact: true })
    .click();
  await page
    .locator(".tale-book")
    .getByRole("button", { name: "ОҚУ", exact: true })
    .click();
  await page.getByRole("button", { name: "Мәтінді үлкейту" }).click();
  await expect(page.locator(".tale-reader-text")).toHaveCSS(
    "font-size",
    "22px",
  );
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "КЕЛЕСІ", exact: true }).click();
  await page.locator(".learning-answers button").first().click();
  await page.getByRole("button", { name: /ОҚЫП БОЛДЫМ/ }).click();
  await expect(page.locator(".xp-pill")).toContainText("15");
  await page.reload();
  await page
    .locator(".story-quicknav")
    .getByRole("button", { name: "ЕРТЕГІЛЕР", exact: true })
    .click();
  await page.getByRole("button", { name: "ТАҢДАУЛЫ", exact: true }).click();
  await expect(page.locator(".tale-book")).toHaveCount(1);
  await expect(page.locator(".tale-book")).toContainText("Оқылған");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
