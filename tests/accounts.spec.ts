import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { requiredQuestions } from "../data/required-learning";
test("register, save learning to server, isolate sessions and inspect live admin statistics", async ({
  page,
  browser,
  baseURL,
}) => {
  const directory = process.env.ACCOUNT_TEST_DIR!;
  execFileSync(
    process.execPath,
    ["--import", "tsx", "scripts/create-admin.ts"],
    { env: { ...process.env, SERVER_DATA_DIR: directory }, stdio: "pipe" },
  );
  const credentials = readFileSync(join(directory, "admin-access.txt"), "utf8");
  const adminPassword = /Құпиясөз: (.+)/.exec(credentials)![1];
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".account-entry").click();
  await page
    .getByRole("button", { name: "Жаңа аккаунт жасау", exact: true })
    .click();
  await page.getByLabel("Атың", { exact: true }).fill("Айару сынақ");
  await page
    .getByLabel("Email", { exact: true })
    .fill("student-browser@example.com");
  await page
    .getByLabel("Құпиясөз", { exact: true })
    .fill("LongStudentPassword123");
  await page.getByRole("button", { name: "ТІРКЕЛУ", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const who = await page.request.get("/api/account/session");
  expect((await who.json()).user.role).toBe("student");
  expect((await page.request.get("/api/account/admin")).status()).toBe(403);
  const hub = page.getByRole("region", { name: "Төрт негізгі оқу бөлімі" });
  await hub
    .locator(".required-activity")
    .filter({ hasText: "Батырды таны" })
    .click();
  const task = hub.getByRole("region", { name: "Батырды таны", exact: true });
  await task.locator(".learning-options button").nth(1).click();
  await expect(task.locator(".server-learning-status")).toContainText(
    "серверге сақталды",
  );
  for (const [i, q] of requiredQuestions.recognize.entries()) {
    await task.locator(".learning-options button").nth(q.answer).click();
    await expect(task.locator(".server-learning-status")).toContainText(
      "серверге сақталды",
    );
    await task
      .getByRole("button", {
        name: i === 5 ? "БӨЛІМДІ АЯҚТАУ" : "КЕЛЕСІ ТАПСЫРМА",
        exact: true,
      })
      .click();
  }
  expect(
    (await (await page.request.get("/api/account/session")).json()).completed,
  ).toEqual(["recognize"]);
  await page.reload();
  await expect(hub.locator(".required-heading .pill")).toContainText(
    "1 / 4 бөлім",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const other = await browser.newContext();
  const anonymous = await other.newPage();
  await anonymous.goto(baseURL + "/admin");
  await expect(
    anonymous.getByRole("heading", { name: "Әкімші аккаунтына кіру" }),
  ).toBeVisible();
  await anonymous
    .getByLabel("Email", { exact: true })
    .fill("admin@qazaq.local");
  await anonymous.getByLabel("Құпиясөз", { exact: true }).fill(adminPassword);
  await anonymous.getByRole("button", { name: "КІРУ", exact: true }).click();
  await expect(
    anonymous.getByRole("heading", { name: "Статистика", exact: true }),
  ).toBeVisible();
  await expect(
    anonymous
      .locator("tbody tr")
      .filter({ hasText: "student-browser@example.com" }),
  ).toContainText("6 / 7 дұрыс жауап");
  await expect(
    anonymous.locator(".admin-module-grid article").first(),
  ).toContainText("1 оқушы аяқтады");
  await anonymous.getByLabel("Пайдаланушыны іздеу").fill("Айару");
  await expect(anonymous.locator("tbody tr")).toHaveCount(1);
  const download = anonymous.waitForEvent("download");
  await anonymous.getByRole("button", { name: "CSV жүктеу" }).click();
  expect((await download).suggestedFilename()).toBe("qazaq-users.csv");
  await anonymous.setViewportSize({ width: 390, height: 844 });
  expect(
    await anonymous.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await anonymous.screenshot({
    path: "tests/artifacts/admin-mobile.png",
    fullPage: true,
  });
  await other.close();
  await page.locator(".account-entry").click();
  await page
    .getByRole("button", { name: "Аккаунттан шығу", exact: true })
    .click();
  await expect(page.locator(".account-entry")).toHaveText("Кіру / Тіркелу");
  expect(
    (await (await page.request.get("/api/account/session")).json()).user,
  ).toBeNull();
  await page.locator(".account-entry").click();
  await page
    .getByLabel("Email", { exact: true })
    .fill("student-browser@example.com");
  await page
    .getByLabel("Құпиясөз", { exact: true })
    .fill("LongStudentPassword123");
  await page.getByRole("button", { name: "КІРУ", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(hub.locator(".required-heading .pill")).toContainText(
    "1 / 4 бөлім",
  );
});
