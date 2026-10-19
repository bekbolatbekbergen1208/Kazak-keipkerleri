import { test, expect } from "@playwright/test";

test("choose any hero on a phone, keep selection after reload and change it", async ({
  page,
  browser,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .getByRole("button", { name: "ӨЗ КЕЙІПКЕРІҢДІ ТАҢДА", exact: true })
    .click();
  await expect(page.locator(".character-picker-grid > button")).toHaveCount(6);
  await page
    .locator(".character-picker-grid > button")
    .filter({ hasText: "Көлтауысар" })
    .click();
  await page.getByRole("button", { name: "ОСЫ КЕЙІПКЕРДІ ТАҢДАУ" }).click();
  await page.reload();
  await page.getByRole("button", { name: "Ойыншы профилі" }).click();
  await expect(page.locator(".selected-character-name")).toHaveText(
    "Көлтауысар",
  );
  await expect(page.locator(".selected-player-portrait")).toHaveAttribute(
    "aria-label",
    /Көлтауысар/,
  );
  await expect(page.locator(".xp-pill")).toContainText("0");
  await page
    .getByRole("button", { name: "КЕЙІПКЕРДІ ТАҢДАУ", exact: true })
    .click();
  await page
    .locator(".character-picker-grid > button")
    .filter({ hasText: "Желаяқ" })
    .click();
  await page.getByRole("button", { name: "ОСЫ КЕЙІПКЕРДІ ТАҢДАУ" }).click();
  await expect(page.locator(".selected-character-name")).toHaveText("Желаяқ");
  const context = await browser.newContext();
  const other = await context.newPage();
  await other.goto("/");
  await other.getByRole("button", { name: "Ойыншы профилі" }).click();
  await expect(other.locator(".selected-character-name")).toHaveCount(0);
  await context.close();
});

test("games use the selected presentation hero and togyz is removed", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "ӨЗ КЕЙІПКЕРІҢДІ ТАҢДА", exact: true })
    .click();
  await page
    .locator(".character-picker-grid > button")
    .filter({ hasText: "Желаяқ" })
    .click();
  await page.getByRole("button", { name: "ОСЫ КЕЙІПКЕРДІ ТАҢДАУ" }).click();
  await page
    .locator("header nav")
    .getByRole("button", { name: "ОЙЫНДАР", exact: true })
    .click();
  await expect(page.locator(".national-card")).toHaveCount(3);
  await expect(
    page.locator(".national-card").filter({ hasText: "Тоғызқұмалақ" }),
  ).toHaveCount(0);
  await page.locator(".national-card").filter({ hasText: "Теңге ілу" }).click();
  await expect(page.locator(".tenge-rider img")).toHaveAttribute(
    "alt",
    "Желаяқ",
  );
  await page.getByRole("button", { name: "Жабу", exact: true }).click();
  await page
    .locator(".national-card")
    .filter({ hasText: "Арқан тартыс" })
    .click();
  await expect(page.locator(".pull-team-right img")).toHaveAttribute(
    "alt",
    "Желаяқ",
  );
  await expect(page.locator(".pull-team-left img")).toHaveAttribute(
    "alt",
    "Таусоғар",
  );
});
