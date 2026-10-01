import { test, expect, type Page } from "@playwright/test";
async function solveRiddle(page: Page) {
  for (const answer of await page.locator(".answers button").all()) {
    await answer.click();
    if (await page.getByText("ДҰРЫС! Келесі сынаққа дайынсың.").isVisible())
      break;
  }
  await page.getByRole("button", { name: "СЫНАҚТЫ АЯҚТАУ" }).click();
}
async function solveMemory(page: Page) {
  const matched = new Set<number>();
  for (let i = 0; i < 12; i++) {
    if (matched.has(i)) continue;
    for (let j = i + 1; j < 12; j++) {
      if (matched.has(j)) continue;
      const first = page.getByRole("button", {
        name: `Карта ${i + 1}`,
        exact: true,
      });
      const second = page.getByRole("button", {
        name: `Карта ${j + 1}`,
        exact: true,
      });
      await first.click();
      await second.click();
      if ((await first.textContent()) === (await second.textContent())) {
        matched.add(i);
        matched.add(j);
        await page.waitForTimeout(750);
        break;
      }
      await page.waitForTimeout(750);
    }
  }
  await page.getByRole("button", { name: "СЫНАҚТЫ АЯҚТАУ" }).click();
}
test("first journey, real rewards, daily claim and reload persistence", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Ұлы Дала. Ұлы қаһармандар. Сенің тарихың.",
    }),
  ).toBeVisible();
  await page.screenshot({
    path: "tests/artifacts/desktop.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "ОЙЫНДЫ БАСТАУ", exact: true })
    .click();
  await page.getByRole("button", { name: "Өткізіп жіберу" }).click();
  await page.getByRole("textbox").fill("Дала Батыры");
  await page.getByRole("button", { name: "САЯХАТТЫ БАСТАУ" }).click();
  await expect(
    page.getByRole("heading", { name: "Ұлы Дала картасы" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "МИССИЯНЫ БАСТАУ", exact: true })
    .click();
  await page.getByRole("button", { name: "СЫНАҚТАРДЫ БАСТАУ" }).click();
  await solveRiddle(page);
  await page
    .getByRole("button", { name: "02 Солтүстікке, өзен бойымен" })
    .click();
  await page.getByRole("button", { name: "СЫНАҚТЫ АЯҚТАУ" }).click();
  await solveMemory(page);
  await expect(
    page.getByRole("heading", { name: "Жарайсың, қаһарман!" }),
  ).toBeVisible();
  await expect(page.locator(".reward-amounts")).toContainText("+100");
  await page.getByRole("button", { name: "ПРОФИЛЬ", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Дала Батыры" }),
  ).toBeVisible();
  await expect(page.locator(".profile-card")).toContainText("ДЕҢГЕЙ 2");
  await expect(
    page.locator(".achievement.earned").filter({ hasText: "Алғашқы қадам" }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Ойыншы профилі" }).click();
  await expect(page.locator(".profile-card")).toContainText("Дала Батыры");
  await expect(page.locator(".profile-card")).toContainText("100 XP");
  await page.getByRole("button", { name: "ӘЛЕМ", exact: true }).first().click();
  await page.locator(".daily-quest").nth(1).getByRole("button").click();
  await expect(page.locator(".xp-pill")).toContainText("150");
  expect(errors).toEqual([]);
});
test("mobile navigation, map and collection stay within viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".mobile-nav")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "tests/artifacts/mobile.png", fullPage: true });
  await page
    .locator(".mobile-nav")
    .getByRole("button", { name: "ӘЛЕМ", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Ұлы Дала картасы" }),
  ).toBeVisible();
  await page
    .locator(".mobile-nav")
    .getByRole("button", { name: "КОЛЛЕКЦИЯ", exact: true })
    .click();
  await expect(page.locator(".hero-card")).toHaveCount(6);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("choice and horse mini-games complete with keyboard and touch controls", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".practice-card").nth(3).click();
  await page.locator(".answers button").first().click();
  await expect(
    page.getByText("Мейірім мен бірлік — батырдың күші. Батылдық +2"),
  ).toBeVisible();
  await page.getByRole("button", { name: "СЫНАҚТЫ АЯҚТАУ" }).click();
  await page.locator(".practice-card").nth(4).click();
  await page.getByRole("button", { name: "ЖАРЫСТЫ БАСТАУ" }).click();
  for (let i = 0; i < 5; i++) {
    await page.waitForFunction(() => {
      const el = document.querySelector<HTMLElement>(".obstacle");
      const left = Number.parseFloat(el?.style.left ?? "100");
      return left <= 34 && left >= 26;
    });
    if (i % 2 === 0) await page.keyboard.press("Space");
    else
      await page
        .getByRole("button", { name: "СЕКІРУ ↑" })
        .dispatchEvent("pointerdown");
    await expect(page.locator(".horse-score")).toContainText(`${i + 1} / 5`);
  }
  await page.getByRole("button", { name: "СЫНАҚТЫ АЯҚТАУ" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
