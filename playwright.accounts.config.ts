import { defineConfig } from "@playwright/test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const directory =
  process.env.ACCOUNT_TEST_DIR ??
  mkdtempSync(join(tmpdir(), "qazaq-account-browser-"));
process.env.ACCOUNT_TEST_DIR = directory;
export default defineConfig({
  testDir: "./tests",
  testMatch: "accounts.spec.ts",
  workers: 1,
  timeout: 60000,
  use: { baseURL: "http://127.0.0.1:3101", headless: true },
  webServer: {
    command: "npm run start -- --port 3101",
    url: "http://127.0.0.1:3101",
    reuseExistingServer: false,
    env: { SERVER_DATA_DIR: directory, APP_ORIGIN: "http://127.0.0.1:3101" },
  },
});
