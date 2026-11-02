import { test, expect } from "@playwright/test";
test("full Kazakh tale has real narration, controls, continuation and all text", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ertostik/full");
  await expect(
    page.getByRole("heading", { name: "Ер Төстік", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".full-tale-text")).toContainText(
    "Ерте заманда Ерназар",
  );
  await page.getByRole("button", { name: "ДАУЫСТАП ОҚУ", exact: true }).click();
  await page.waitForFunction(() => {
    const a = document.querySelector("audio");
    return a && !a.paused && a.currentTime > 0;
  });
  await page.getByRole("button", { name: "КІДІРТУ", exact: true }).click();
  expect(
    await page.locator("audio").evaluate((a: HTMLAudioElement) => a.paused),
  ).toBe(true);
  await page.getByLabel("Толық ертегіні оқу жылдамдығы").selectOption("1.2");
  await page.getByLabel("Ертегінің оқу бөлігін таңдау").selectOption("2");
  await expect(page.locator(".full-reading-number")).toHaveText("3 / 37");
  await page.waitForFunction(() => {
    const a = document.querySelector("audio");
    return a && a.readyState >= 1 && a.currentSrc.includes("section-003");
  });
  await page.locator("audio").evaluate((a: HTMLAudioElement) => {
    a.currentTime = 12;
    a.dispatchEvent(new Event("timeupdate"));
  });
  await page.waitForFunction(
    () =>
      JSON.parse(localStorage.getItem("qazaq-full-tostik-reader") || "{}")
        .elapsed >= 12,
  );
  await page.reload();
  await expect(page.getByLabel("Ертегінің оқу бөлігін таңдау")).toHaveValue(
    "2",
  );
  await page.waitForFunction(() => {
    const a = document.querySelector("audio");
    return a && a.currentTime >= 11;
  });
  await page.getByRole("button", { name: "ДАУЫСТАП ОҚУ", exact: true }).click();
  await page
    .locator("audio")
    .evaluate((a: HTMLAudioElement) => a.dispatchEvent(new Event("ended")));
  await expect(page.getByLabel("Ертегінің оқу бөлігін таңдау")).toHaveValue(
    "3",
  );
  await page.getByRole("button", { name: "КІДІРТУ", exact: true }).click();
  await page.locator(".full-tale-all summary").click();
  await expect(page.locator(".full-tale-all")).toContainText(
    "мақсаттарына жетеді.",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
