import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { GET, POST } from "../app/api/account/[action]/route";
import { createAccount, db } from "../lib/server/accounts";
import { requiredQuestions } from "../data/required-learning";
import { originCheck } from "../lib/server/http";
import { freshPlayer } from "../lib/progression";
const directory = mkdtempSync(join(tmpdir(), "qazaq-accounts-test-"));
process.env.SERVER_DATA_DIR = directory;
const origin = "http://localhost:3000";
async function call(
  action: string,
  data?: unknown,
  cookie = "",
  customOrigin = origin,
) {
  const request = new Request(`${origin}/api/account/${action}`, {
    method: data === undefined ? "GET" : "POST",
    headers: {
      ...(data === undefined
        ? {}
        : { "content-type": "application/json", origin: customOrigin }),
      cookie,
    },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  return (data === undefined ? GET : POST)(request, {
    params: Promise.resolve({ action }),
  });
}
test("server registration, isolated progress, secure sessions and admin statistics", async () => {
  try {
    assert.doesNotThrow(() =>
      originCheck(
        new Request("http://0.0.0.0:3000/api/account/login", {
          method: "POST",
          headers: {
            host: "localhost:3000",
            origin,
            "content-type": "application/json",
          },
          body: "{}",
        }),
      ),
    );
    assert.throws(() =>
      originCheck(
        new Request("http://0.0.0.0:3000/api/account/login", {
          method: "POST",
          headers: {
            host: "localhost:3000",
            origin: "https://attacker.test",
            "content-type": "application/json",
          },
          body: "{}",
        }),
      ),
    );
    const anon = await call("admin");
    assert.equal(anon.status, 401);
    const password = "ExampleLongPassword123";
    const register = await call("register", {
      email: "student@example.com",
      name: "Айару",
      password,
      role: "admin",
      state: freshPlayer(),
    });
    assert.equal(register.status, 200);
    const cookie = register.headers.get("set-cookie")!.split(";")[0];
    assert.ok(register.headers.get("set-cookie")!.includes("HttpOnly"));
    assert.equal((await register.json()).user.role, "student");
    const stored = db()
      .prepare("SELECT password_hash FROM users WHERE email=?")
      .get("student@example.com") as { password_hash: string };
    assert.ok(!stored.password_hash.includes(password));
    assert.equal((await call("admin", undefined, cookie)).status, 403);
    assert.equal(
      (
        await call(
          "state",
          { state: freshPlayer() },
          cookie,
          "https://attacker.test",
        )
      ).status,
      403,
    );
    const state = {
      ...freshPlayer(),
      xp: 250,
      name: "Айару",
      characterId: "tostik",
    };
    assert.equal(
      (await call("state", { state, userId: "someone-else" }, cookie)).status,
      200,
    );
    assert.equal(
      (await (await call("session", undefined, cookie)).json()).state.xp,
      250,
    );
    let attempts = 0;
    const wrong = await call(
      "answer",
      {
        module: "recognize",
        question: 0,
        answer: 1,
        correct: true,
        attemptId: randomUUID(),
      },
      cookie,
    );
    assert.equal((await wrong.json()).correct, false);
    attempts++;
    const id = randomUUID();
    for (let i = 0; i < 2; i++)
      assert.equal(
        (
          await call(
            "answer",
            { module: "recognize", question: 0, answer: 0, attemptId: id },
            cookie,
          )
        ).status,
        200,
      );
    attempts++;
    for (let i = 1; i < 6; i++) {
      await call(
        "answer",
        {
          module: "recognize",
          question: i,
          answer: requiredQuestions.recognize[i].answer,
          attemptId: randomUUID(),
        },
        cookie,
      );
      attempts++;
    }
    assert.deepEqual(
      (await (await call("session", undefined, cookie)).json()).completed,
      ["recognize"],
    );
    const second = await call("register", {
      email: "other@example.com",
      name: "Басқа оқушы",
      password,
    });
    const cookie2 = second.headers.get("set-cookie")!.split(";")[0];
    assert.equal(
      (await (await call("session", undefined, cookie2)).json()).state,
      null,
    );
    await createAccount("admin@example.com", "Әкімші", password, "admin");
    const login = await call("login", { email: "admin@example.com", password });
    const adminCookie = login.headers.get("set-cookie")!.split(";")[0];
    const report = await (await call("admin", undefined, adminCookie)).json();
    assert.equal(report.users.length, 3);
    assert.equal(report.summary.students, 2);
    assert.equal(report.summary.attempts, attempts);
    assert.equal(report.summary.correct, 6);
    assert.equal(report.modules[0].completed, 1);
    assert.equal(
      report.users.find(
        (u: { email: string }) => u.email === "student@example.com",
      ).level,
      3,
    );
    assert.ok(!JSON.stringify(report).includes("password_hash"));
    const persisted = execFileSync(
      process.execPath,
      [
        "-e",
        'const {DatabaseSync}=require("node:sqlite");const db=new DatabaseSync(process.argv[1]);process.stdout.write(String(db.prepare("SELECT count(*) n FROM users").get().n))',
        join(directory, "accounts.sqlite"),
      ],
      { encoding: "utf8" },
    );
    assert.equal(persisted, "3");
    assert.equal((await call("logout", {}, cookie)).status, 200);
    assert.equal(
      (await (await call("session", undefined, cookie)).json()).user,
      null,
    );
    assert.equal(
      (await call("login", { email: "student@example.com", password: "wrong" }))
        .status,
      401,
    );
    const logged = await call("login", {
      email: "student@example.com",
      password,
    });
    assert.equal(logged.status, 200);
    assert.equal((await logged.json()).state.xp, 250);
  } finally {
    db().close();
    rmSync(directory, { recursive: true, force: true });
  }
});
