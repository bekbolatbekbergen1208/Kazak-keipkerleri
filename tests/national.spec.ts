import { test, expect, type Page } from "@playwright/test";
async function slider(page: Page, name: string, value: number) {
  const input = page.getByRole("slider", { name });
  await input.focus();
  await input.press("Home");
  const min = Number(await input.getAttribute("min"));
  for (let i = min; i < value; i++) await input.press("ArrowRight");
}
async function createPlayer(page: Page) {
  await page.goto("/");
  await page
    .getByRole("button", { name: "ОЙЫНДЫ БАСТАУ", exact: true })
    .click();
  await page.getByRole("button", { name: "ӨЗ ҚАҺАРМАНЫҢДЫ ЖАСАУ" }).click();
  await page.getByRole("button", { name: "Өткізіп жіберу" }).click();
  await page.getByRole("textbox").fill("Ұлттық ойыншы");
  await page.getByRole("button", { name: "САЯХАТТЫ БАСТАУ" }).click();
  await page
    .locator("header nav")
    .getByRole("button", { name: "МИССИЯЛАР", exact: true })
    .click();
}
async function asyk(page: Page) {
  for (const [aim, force] of [
    [29, 74],
    [43, 83],
    [59, 72],
    [37, 49],
    [55, 46],
  ]) {
    await slider(page, "Сақа бағыты", aim);
    await slider(page, "Лақтыру күші", force);
    await page.getByRole("button", { name: "САҚАНЫ АТУ", exact: true }).click();
    await page.waitForTimeout(480);
  }
  await expect(
    page.getByRole("button", { name: "СЫЙЛЫҚТЫ АЛУ" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "СЫЙЛЫҚТЫ АЛУ" }).click();
}
test("asyk aiming, saved rewards and repeat reward protection", async ({
  page,
}) => {
  await createPlayer(page);
  await page.locator(".national-card").filter({ hasText: "Асық ату" }).click();
  await asyk(page);
  await expect(page.locator(".xp-pill")).toContainText("40");
  await page.reload();
  await page
    .locator("header nav")
    .getByRole("button", { name: "МИССИЯЛАР", exact: true })
    .click();
  await expect(
    page.locator(".national-card").filter({ hasText: "Асық ату" }),
  ).toContainText("Сыйлық алынды");
  await page.locator(".national-card").filter({ hasText: "Асық ату" }).click();
  await asyk(page);
  await expect(page.locator(".xp-pill")).toContainText("40");
});
test("tenge timing supports keyboard and touch button", async ({ page }) => {
  await createPlayer(page);
  await page.locator(".national-card").filter({ hasText: "Теңге ілу" }).click();
  await page.getByRole("button", { name: "САПАРДЫ БАСТАУ" }).click();
  for (let i = 0; i < 5; i++) {
    await page.waitForFunction(() => {
      const left = Number.parseFloat(
        document.querySelector<HTMLElement>(".tenge-token")?.style.left ??
          "100",
      );
      return left <= 30 && left >= 20;
    });
    if (i % 2 === 0) await page.keyboard.press("Space");
    else await page.getByRole("button", { name: "ЕҢКЕЮ ↓" }).click();
    await expect(page.locator(".field-score")).toContainText(`${i + 1} / 5`);
    if (i < 4)
      await page.waitForFunction(
        () =>
          Number.parseFloat(
            document.querySelector<HTMLElement>(".tenge-token")?.style.left ??
              "0",
          ) > 80,
      );
  }
  await page.getByRole("button", { name: "СЫЙЛЫҚТЫ АЛУ" }).click();
  await expect(page.locator(".xp-pill")).toContainText("40");
});
test("national games fit mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .locator(".mobile-nav")
    .getByRole("button", { name: "МИССИЯЛАР", exact: true })
    .click();
  await page
    .locator(".national-card")
    .filter({ hasText: "Арқан тартыс" })
    .click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.waitForTimeout(450);
  expect(
    await page
      .locator(".arqan-field")
      .evaluate((el) => el.scrollWidth <= el.clientWidth),
  ).toBe(true);
  await page.screenshot({ path: "tests/artifacts/national-mobile.png" });
});

test("home games start immediately and rope win is saved only once", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".home-national-games .national-card")).toHaveCount(
    3,
  );
  await page
    .getByRole("button", { name: "ОЙЫНДЫ БАСТАУ", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Қазақтың дәстүрлі ойындары" }),
  ).toBeVisible();
  await page
    .locator(".national-card")
    .filter({ hasText: "Арқан тартыс" })
    .click();
  async function win() {
    await page
      .getByRole("button", { name: "ТАРТЫСТЫ БАСТАУ", exact: true })
      .click();
    for (let i = 0; i < 24; i++) {
      if (await page.getByRole("button", { name: "СЫЙЛЫҚТЫ АЛУ" }).isVisible())
        break;
      if (i % 2 === 0) await page.keyboard.press("ArrowLeft");
      else
        await page
          .getByRole("button", { name: "ОҢ ҚОЛ →", exact: true })
          .click();
      await page.waitForTimeout(130);
    }
    await expect(
      page.getByRole("status").filter({ hasText: "ЖЕҢІС!" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "СЫЙЛЫҚТЫ АЛУ" }).click();
  }
  await win();
  await expect(page.locator(".xp-pill")).toContainText("40");
  await page.reload();
  await page
    .locator(".home-national-games .national-card")
    .filter({ hasText: "Арқан тартыс" })
    .click();
  await win();
  await expect(page.locator(".xp-pill")).toContainText("40");
});

test("asyk can be aimed by tapping the target on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .getByRole("button", { name: "ОЙЫНДЫ БАСТАУ", exact: true })
    .click();
  await page.locator(".national-card").filter({ hasText: "Асық ату" }).click();
  for (let i = 1; i <= 5; i++) {
    await page
      .getByRole("button", { name: `${i}-асықты көздеу`, exact: true })
      .click();
    await page.getByRole("button", { name: "САҚАНЫ АТУ", exact: true }).click();
    await expect(page.locator(".field-score")).toContainText(`${i} / 5`);
  }
  await page.getByRole("button", { name: "СЫЙЛЫҚТЫ АЛУ" }).click();
  await expect(page.locator(".xp-pill")).toContainText("40");
});
