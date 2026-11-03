import { randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { createAccount, db } from "../lib/server/accounts";
async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@qazaq.local";
  const existing = db()
    .prepare("SELECT id FROM users WHERE email=?")
    .get(email.toLowerCase());
  if (existing)
    throw new Error("Бұл аккаунт бар. Бар пайдаланушының рөлі өзгертілмеді.");
  const password =
    process.env.ADMIN_PASSWORD || randomBytes(18).toString("base64url");
  await createAccount(email, "Әкімші", password, "admin");
  const directory = resolve(process.env.SERVER_DATA_DIR || "storage");
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  writeFileSync(
    join(directory, "admin-access.txt"),
    `Әкімші панелі: /admin\nEmail: ${email}\nҚұпиясөз: ${password}\n`,
    { mode: 0o600 },
  );
  console.log(
    "Әкімші жасалды. Кіру деректері: " + join(directory, "admin-access.txt"),
  );
}
void main().catch((e) => {
  console.error(e.message);
  process.exitCode = 1;
});
