import { test, expect } from "@playwright/test";

test("reader can retry, reread, earn a badge and keep it after reload", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page
    .locator("header nav")
    .getByRole("button", { name: "БІЛІМ", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Білім саяхаты", exact: true }),
  ).toBeVisible();
  await page
    .locator(".learning-activity")
    .filter({ hasText: "Оқы да, ойлан" })
    .getByRole("button")
    .click();
  await expect(
    page.getByRole("heading", { name: "Достардың көмегі" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "ОҚЫДЫМ, СҰРАҚТАРҒА ӨТУ" }).click();
  await page.locator(".learning-answers button").nth(1).click();
  await expect(page.getByRole("status")).toContainText("Тағы ойланып");
  await page.locator("summary").click();
  await expect(page.locator(".learning-reread")).toContainText(
    "Таусоғар тасты көтеріп",
  );
  for (const [i, answer] of [0, 1, 2].entries()) {
    await page.locator(".learning-answers button").nth(answer).click();
    await expect(page.getByRole("status")).toContainText("Дұрыс!");
    await page
      .getByRole("button", {
        name: i === 2 ? "БЕЛГІНІ АЛУ" : "КЕЛЕСІ СҰРАҚ",
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Жарайсың, жас қаһарман!" }),
  ).toBeVisible();
  const xp = await page.locator(".xp-pill").innerText();
  await page.getByRole("button", { name: "БЕЛГІЛЕРІМДІ КӨРУ" }).click();
  await expect(page.locator(".learning-badge.earned")).toHaveCount(1);
  await page.reload();
  await page
    .locator("header nav")
    .getByRole("button", { name: "БІЛІМ", exact: true })
    .click();
  await expect(page.locator(".learning-badge.earned")).toContainText(
    "Зерек оқырман",
  );
  await expect(page.locator(".xp-pill")).toHaveText(xp);
  expect(errors).toEqual([]);
});

test("mobile proverb activity and daily assignment work without a profile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .locator(".mobile-nav")
    .getByRole("button", { name: "БІЛІМ", exact: true })
    .click();
  await expect(page.locator(".learning-daily")).toBeVisible();
  await page
    .locator(".learning-activity")
    .filter({ hasText: "Мақалды жалғастыр" })
    .getByRole("button")
    .click();
  for (const [i, answer] of [1, 0, 2, 1].entries()) {
    await page.locator(".learning-answers button").nth(answer).click();
    await page
      .getByRole("button", {
        name: i === 3 ? "БЕЛГІНІ АЛУ" : "КЕЛЕСІ СҰРАҚ",
        exact: true,
      })
      .click();
  }
  await page.getByRole("button", { name: "БЕЛГІЛЕРІМДІ КӨРУ" }).click();
  await expect(page.locator(".learning-badge.earned")).toContainText(
    "Тапқыр бала",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
