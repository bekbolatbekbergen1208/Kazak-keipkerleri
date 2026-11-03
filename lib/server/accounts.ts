import { DatabaseSync } from "node:sqlite";
import { mkdirSync, chmodSync } from "node:fs";
import { resolve, join } from "node:path";
import {
  randomBytes,
  randomUUID,
  scrypt as derive,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { promisify } from "node:util";
import {
  requiredQuestions,
  requiredActivities,
  type RequiredKind,
} from "../../data/required-learning";
const scrypt = promisify(derive);
export class AccountError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export type Account = {
  id: string;
  email: string;
  name: string;
  role: "student" | "admin";
  created_at: number;
  last_seen: number;
  game_state: string | null;
};
let database: DatabaseSync;
export function db() {
  if (database) return database;
  const directory = resolve(
    process.env.SERVER_DATA_DIR || join(process.cwd(), "storage"),
  );
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const file = join(directory, "accounts.sqlite");
  database = new DatabaseSync(file);
  chmodSync(file, 0o600);
  database.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,name TEXT NOT NULL,password_hash TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('student','admin')),created_at INTEGER NOT NULL,last_seen INTEGER NOT NULL,game_state TEXT);
 CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at INTEGER NOT NULL);
 CREATE INDEX IF NOT EXISTS session_users ON sessions(user_id);
 CREATE TABLE IF NOT EXISTS attempts(id INTEGER PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),module TEXT NOT NULL,question INTEGER NOT NULL,answer INTEGER NOT NULL,correct INTEGER NOT NULL,created_at INTEGER NOT NULL,request_key TEXT UNIQUE);
 CREATE INDEX IF NOT EXISTS attempts_users ON attempts(user_id,module,question);
 CREATE TABLE IF NOT EXISTS learning_answers(user_id TEXT NOT NULL REFERENCES users(id),module TEXT NOT NULL,question INTEGER NOT NULL,correct INTEGER NOT NULL,PRIMARY KEY(user_id,module,question));
 CREATE TABLE IF NOT EXISTS rate_limits(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS activity_days(user_id TEXT NOT NULL REFERENCES users(id),day TEXT NOT NULL,seconds INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(user_id,day));`);
  return database;
}
export function limit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const row = db()
    .prepare("SELECT count,expires_at FROM rate_limits WHERE key=?")
    .get(key) as { count: number; expires_at: number } | undefined;
  if (row && row.expires_at > now && row.count >= max)
    throw new AccountError(
      "Әрекет тым көп. Біраздан соң қайта байқап көр.",
      429,
    );
  db()
    .prepare(
      "INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires_at<=? THEN 1 ELSE count+1 END,expires_at=CASE WHEN expires_at<=? THEN excluded.expires_at ELSE expires_at END",
    )
    .run(key, now + windowMs, now, now);
}
export function emailAddress(value: unknown) {
  const email = String(value ?? "")
    .trim()
    .toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new AccountError("Email мекенжайын дұрыс жаз.");
  return email;
}
export async function hashPassword(password: string) {
  if (password.length < 10 || password.length > 128)
    throw new AccountError("Құпиясөз 10–128 таңбадан тұруы керек.");
  const salt = randomBytes(16).toString("hex");
  const key = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${key.toString("hex")}`;
}
async function matches(password: string, hash: string) {
  const [salt, hex] = hash.split(":");
  const key = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hex, "hex");
  return key.length === expected.length && timingSafeEqual(key, expected);
}
export async function createAccount(
  email: unknown,
  name: unknown,
  password: string,
  role: "student" | "admin" = "student",
) {
  const address = emailAddress(email);
  const display = String(name ?? "").trim();
  if (display.length < 2 || display.length > 24)
    throw new AccountError("Атың 2–24 таңбадан тұрсын.");
  const hashed = await hashPassword(password);
  const id = randomUUID();
  try {
    db()
      .prepare(
        "INSERT INTO users(id,email,name,password_hash,role,created_at,last_seen) VALUES(?,?,?,?,?,?,?)",
      )
      .run(id, address, display, hashed, role, Date.now(), Date.now());
  } catch (e) {
    if (String(e).includes("UNIQUE"))
      throw new AccountError("Бұл email тіркелген. Аккаунтыңа кір.", 409);
    throw e;
  }
  return getAccount(id)!;
}
export function getAccount(id: string) {
  return db()
    .prepare(
      "SELECT id,email,name,role,created_at,last_seen,game_state FROM users WHERE id=?",
    )
    .get(id) as Account | undefined;
}
export async function login(email: unknown, password: string) {
  const address = emailAddress(email);
  limit(`login:${address}`, 10, 15 * 60_000);
  const row = db().prepare("SELECT * FROM users WHERE email=?").get(address) as
    (Account & { password_hash: string }) | undefined;
  // Perform the same expensive derivation for unknown accounts.
  const valid = await matches(
    password,
    row?.password_hash ?? `${"0".repeat(32)}:${"0".repeat(128)}`,
  );
  if (!row || !valid)
    throw new AccountError("Email немесе құпиясөз қате.", 401);
  db().prepare("DELETE FROM rate_limits WHERE key=?").run(`login:${address}`);
  return getAccount(row.id)!;
}
const digest = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export function session(userId: string) {
  const token = randomBytes(32).toString("hex");
  db().prepare("DELETE FROM sessions WHERE expires_at<?").run(Date.now());
  db()
    .prepare("INSERT INTO sessions VALUES(?,?,?)")
    .run(digest(token), userId, Date.now() + 7 * 86400_000);
  return token;
}
export function accountForToken(token: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return;
  const row = db()
    .prepare("SELECT user_id FROM sessions WHERE token_hash=? AND expires_at>?")
    .get(digest(token), Date.now()) as { user_id: string } | undefined;
  return row ? getAccount(row.user_id) : undefined;
}
export function logout(token: string) {
  db().prepare("DELETE FROM sessions WHERE token_hash=?").run(digest(token));
}
export function completedModules(userId: string) {
  return requiredActivities
    .filter((a) => {
      const count = db()
        .prepare(
          "SELECT count(*) AS n FROM learning_answers WHERE user_id=? AND module=? AND correct=1",
        )
        .get(userId, a.id) as { n: number };
      return count.n === requiredQuestions[a.id].length;
    })
    .map((a) => a.id);
}
export function recordAnswer(
  userId: string,
  module: unknown,
  question: unknown,
  answer: unknown,
  attemptId: string = randomUUID(),
) {
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(attemptId))
    throw new AccountError("Әрекет белгісі жарамсыз.");
  const requestKey = `${userId}:${attemptId}`;
  const previous = db()
    .prepare("SELECT correct FROM attempts WHERE request_key=?")
    .get(requestKey) as { correct: number } | undefined;
  if (previous)
    return {
      correct: Boolean(previous.correct),
      completed: completedModules(userId),
    };
  if (
    !requiredActivities.some((a) => a.id === module) ||
    !Number.isInteger(question) ||
    !Number.isInteger(answer)
  )
    throw new AccountError("Тапсырма жарамсыз.");
  const kind = module as RequiredKind;
  const q = requiredQuestions[kind][question as number];
  if (!q || !q.options[answer as number])
    throw new AccountError("Жауап жарамсыз.");
  const correct = Number(q.answer === answer);
  limit(`answer:${userId}`, 240, 60_000);
  db().exec("BEGIN IMMEDIATE");
  try {
    db()
      .prepare(
        "INSERT INTO attempts(user_id,module,question,answer,correct,created_at,request_key) VALUES(?,?,?,?,?,?,?)",
      )
      .run(
        userId,
        kind,
        question as number,
        answer as number,
        correct,
        Date.now(),
        requestKey,
      );
    db()
      .prepare(
        "INSERT INTO learning_answers VALUES(?,?,?,?) ON CONFLICT(user_id,module,question) DO UPDATE SET correct=max(correct,excluded.correct)",
      )
      .run(userId, kind, question as number, correct);
    db()
      .prepare("UPDATE users SET last_seen=? WHERE id=?")
      .run(Date.now(), userId);
    db().exec("COMMIT");
  } catch (e) {
    db().exec("ROLLBACK");
    throw e;
  }
  return { correct: Boolean(correct), completed: completedModules(userId) };
}
export function adminReport() {
  const users = db()
    .prepare(
      `SELECT u.id,u.email,u.name,u.role,u.created_at,u.last_seen,u.game_state,(SELECT count(*) FROM attempts WHERE user_id=u.id) attempts,(SELECT coalesce(sum(correct),0) FROM attempts WHERE user_id=u.id) correct,(SELECT coalesce(sum(seconds),0) FROM activity_days WHERE user_id=u.id) seconds FROM users u ORDER BY u.created_at DESC`,
    )
    .all() as unknown as (Account & {
    attempts: number;
    correct: number;
    seconds: number;
  })[];
  const rows = users.map((u) => {
    let state: Record<string, unknown> = {};
    try {
      state = JSON.parse(u.game_state ?? "{}");
    } catch {}
    const list = (v: unknown) => (Array.isArray(v) ? v : []);
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.created_at,
      lastSeen: u.last_seen,
      xp: Number(state.xp) || 0,
      level:
        Math.floor(
          (Math.sqrt(9 + (4 * (Number(state.xp) || 0)) / 25) - 1) / 2,
        ) || 1,
      characterId:
        typeof state.characterId === "string" ? state.characterId : null,
      missions: list(state.completed).length,
      nationalGames: list(state.nationalCompleted).length,
      storyEpisodes: list((state.tostik as { seen?: unknown })?.seen).length,
      requiredCompleted: completedModules(u.id),
      attempts: u.attempts,
      correct: u.correct,
      seconds: u.seconds,
    };
  });
  const students = rows.filter((u) => u.role === "student");
  const attempts = students.reduce((n, u) => n + u.attempts, 0),
    correct = students.reduce((n, u) => n + u.correct, 0);
  const modules = requiredActivities.map((a) => {
    const totals = db()
      .prepare(
        "SELECT count(*) attempts,coalesce(sum(correct),0) correct FROM attempts a JOIN users u ON u.id=a.user_id WHERE a.module=? AND u.role='student'",
      )
      .get(a.id) as { attempts: number; correct: number };
    return {
      id: a.id,
      title: a.title,
      ...totals,
      completed: students.filter((u) => u.requiredCompleted.includes(a.id))
        .length,
    };
  });
  return {
    users: rows,
    summary: {
      students: students.length,
      activeToday: students.filter(
        (u) =>
          new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Aqtau" }).format(
            u.lastSeen,
          ) ===
          new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Aqtau" }).format(
            Date.now(),
          ),
      ).length,
      attempts,
      correct,
      accuracy: attempts ? Math.round((correct / attempts) * 100) : 0,
      completed: students.filter((u) => u.requiredCompleted.length === 4)
        .length,
    },
    modules,
    generatedAt: Date.now(),
  };
}
