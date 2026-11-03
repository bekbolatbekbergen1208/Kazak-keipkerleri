import {
  AccountError,
  adminReport,
  completedModules,
  createAccount,
  db,
  limit,
  login,
  logout,
  session,
} from "@/lib/server/accounts";
import {
  body,
  fail,
  originCheck,
  requireUser,
  response,
  sessionCookie,
  token,
} from "@/lib/server/http";
import { gameState } from "@/lib/server/state";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ action: string }> };
export async function GET(request: Request, context: Context) {
  try {
    const { action } = await context.params;
    if (action === "session") {
      try {
        const user = requireUser(request);
        return response({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          state: user.game_state ? JSON.parse(user.game_state) : null,
          completed: completedModules(user.id),
        });
      } catch (e) {
        if (e instanceof AccountError && e.status === 401)
          return response({ user: null, state: null, completed: [] });
        throw e;
      }
    }
    if (action === "admin") {
      const user = requireUser(request);
      if (user.role !== "admin")
        throw new AccountError("Бұл бөлім тек әкімшіге арналған.", 403);
      return response(adminReport());
    }
    throw new AccountError("Бет табылмады.", 404);
  } catch (e) {
    return fail(e);
  }
}
export async function POST(request: Request, context: Context) {
  try {
    originCheck(request);
    const { action } = await context.params;
    const data = await body(request);
    if (action === "register" || action === "login") {
      const password = typeof data.password === "string" ? data.password : "";
      if (password.length > 128) throw new AccountError("Құпиясөз тым ұзын.");
      let user;
      if (action === "register") {
        const ip =
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          "local";
        limit(`registration:${ip}`, 20, 3600_000);
        const initial = data.state ? gameState(data.state) : null;
        user = await createAccount(data.email, data.name, password);
        if (initial) {
          const state = initial;
          state.name = user.name;
          db()
            .prepare("UPDATE users SET game_state=? WHERE id=?")
            .run(JSON.stringify(state), user.id);
          user = { ...user, game_state: JSON.stringify(state) };
        }
      } else user = await login(data.email, password);
      return response(
        {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          state: user.game_state ? JSON.parse(user.game_state) : null,
          completed: completedModules(user.id),
        },
        200,
        sessionCookie(request, session(user.id)),
      );
    }
    if (action === "logout") {
      logout(token(request));
      return response({ ok: true }, 200, sessionCookie(request, "", true));
    }
    const user = requireUser(request);
    if (action === "state") {
      limit(`state:${user.id}`, 180, 60_000);
      const state = gameState(data.state);
      db()
        .prepare("UPDATE users SET name=?,game_state=?,last_seen=? WHERE id=?")
        .run(state.name, JSON.stringify(state), Date.now(), user.id);
      return response({ ok: true });
    }
    if (action === "answer") {
      const { recordAnswer } = await import("@/lib/server/accounts");
      return response(
        recordAnswer(
          user.id,
          data.module,
          data.question,
          data.answer,
          typeof data.attemptId === "string" ? data.attemptId : undefined,
        ),
      );
    }
    if (action === "heartbeat") {
      const now = Date.now();
      const key = `heartbeat:${user.id}`;
      const previous = db()
        .prepare("SELECT expires_at FROM rate_limits WHERE key=?")
        .get(key) as { expires_at: number } | undefined;
      if (!previous || now - previous.expires_at >= 25_000) {
        const day = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Aqtau",
        }).format(now);
        db()
          .prepare(
            "INSERT INTO activity_days(user_id,day,seconds) VALUES(?,?,?) ON CONFLICT(user_id,day) DO UPDATE SET seconds=seconds+excluded.seconds",
          )
          .run(
            user.id,
            day,
            previous && now - previous.expires_at <= 90_000 ? 30 : 0,
          );
        db()
          .prepare(
            "INSERT INTO rate_limits VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET expires_at=excluded.expires_at",
          )
          .run(key, now);
        db()
          .prepare("UPDATE users SET last_seen=? WHERE id=?")
          .run(now, user.id);
      }
      return response({ ok: true });
    }
    throw new AccountError("Бет табылмады.", 404);
  } catch (e) {
    return fail(e);
  }
}
