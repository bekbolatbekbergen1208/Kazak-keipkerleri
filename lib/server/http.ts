import { AccountError, accountForToken } from "./accounts";
export function token(request: Request) {
  return (
    /(?:^|;\s*)qh_session=([a-f0-9]{64})(?:;|$)/.exec(
      request.headers.get("cookie") ?? "",
    )?.[1] ?? ""
  );
}
export function requireUser(request: Request) {
  const user = accountForToken(token(request));
  if (!user) throw new AccountError("Аккаунтыңа кір.", 401);
  return user;
}
export function originCheck(request: Request) {
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  const allowed =
    process.env.APP_ORIGIN ||
    `${url.protocol}//${request.headers.get("host") || url.host}`;
  if (origin && origin !== allowed)
    throw new AccountError("Сұрау көзі жарамсыз.", 403);
  if (
    request.method !== "GET" &&
    request.headers.get("content-type")?.split(";")[0] !== "application/json"
  )
    throw new AccountError("JSON сұрауы қажет.", 415);
}
export function response(body: unknown, status = 200, cookie?: string) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...(cookie ? { "Set-Cookie": cookie } : {}),
    },
  });
}
export function sessionCookie(request: Request, value: string, clear = false) {
  const secure =
    process.env.APP_ORIGIN?.startsWith("https:") ||
    new URL(request.url).protocol === "https:";
  return `qh_session=${value}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${clear ? 0 : 7 * 86400}${secure ? "; Secure" : ""}`;
}
export async function body(request: Request) {
  const text = await request.text();
  if (text.length > 100_000) throw new AccountError("Сұрау тым үлкен.", 413);
  try {
    const data = JSON.parse(text);
    if (!data || typeof data !== "object" || Array.isArray(data)) throw 0;
    return data as Record<string, unknown>;
  } catch {
    throw new AccountError("Сұрау жарамсыз.");
  }
}
export function fail(error: unknown) {
  if (error instanceof AccountError)
    return response({ error: error.message }, error.status);
  console.error(
    "Account operation failed",
    error instanceof Error ? error.name : "unknown",
  );
  return response({ error: "Сервер қатесі. Қайта байқап көр." }, 500);
}
