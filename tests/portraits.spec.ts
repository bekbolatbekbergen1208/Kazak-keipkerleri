import { test, expect } from "@playwright/test";
test("six cinematic portraits render in the gallery, detail and mobile views", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.waitForTimeout(450);
  await expect(page.locator(".featured-warrior img")).toHaveAttribute(
    "src",
    /hero-0.webp/,
  );
  await page.screenshot({ path: "tests/artifacts/new-landing.png" });
  await page
    .locator("header nav")
    .getByRole("button", { name: "ҚАҺАРМАНДАР", exact: true })
    .click();
  await expect(page.locator(".hero-card")).toHaveCount(6);
  await expect
    .poll(() =>
      page
        .locator(".hero-card img")
        .evaluateAll((images) =>
          images.every(
            (image) =>
              (image as HTMLImageElement).complete &&
              (image as HTMLImageElement).naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  await page.waitForTimeout(400);
  await page.screenshot({
    path: "tests/artifacts/new-heroes-desktop.png",
    fullPage: true,
  });
  await page.locator(".hero-card").nth(3).click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("img", { name: "Керқұла атты Кендебай" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Жабу", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(400);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "tests/artifacts/new-heroes-mobile.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
