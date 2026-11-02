import { test, expect } from "@playwright/test";

test("Kazakh audio plays, pauses, changes volume and preserves mute preference", async ({
  page,
}) => {
  await page.goto("/ertostik");
  const audio = page.getByTestId("tostik-narration");
  await expect(audio).toHaveAttribute(
    "src",
    "/audio/tostik-daulet/birth-1.m4a",
  );
  await page
    .getByRole("button", { name: "КӨРУДІ ЖАЛҒАСТЫРУ", exact: true })
    .click();
  await expect
    .poll(() => audio.evaluate((el: HTMLAudioElement) => el.currentTime))
    .toBeGreaterThan(0.05);
  await page.getByRole("button", { name: "ТОҚТАТА ТҰРУ", exact: true }).click();
  expect(await audio.evaluate((el: HTMLAudioElement) => el.paused)).toBe(true);
  const time = await audio.evaluate((el: HTMLAudioElement) => el.currentTime);
  await page.waitForTimeout(300);
  expect(
    await audio.evaluate((el: HTMLAudioElement) => el.currentTime),
  ).toBeCloseTo(time, 1);
  const volume = page.getByRole("slider", {
    name: "Дауыс деңгейі",
    exact: true,
  });
  await volume.focus();
  await volume.press("Home");
  for (let i = 0; i < 7; i++) await volume.press("ArrowRight");
  await expect
    .poll(() => audio.evaluate((el: HTMLAudioElement) => el.volume))
    .toBeCloseTo(0.35);
  await page.getByRole("button", { name: "ДАУЫС ҚОСУЛЫ", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "ДАУЫС ӨШІРУЛІ", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await page.reload();
  await expect(
    page.getByRole("button", { name: "ДАУЫС ӨШІРУЛІ", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("slider", { name: "Дауыс деңгейі", exact: true }),
  ).toHaveValue("0.35");
});
