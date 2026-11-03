"use client";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Download,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  ChartColumn,
  Target,
  Clock,
} from "lucide-react";
import { accountRequest } from "@/lib/account-client";
import type { adminReport } from "@/lib/server/accounts";
import { heroes } from "@/data/content";
import Emblem from "@/components/ui-emblem";
type Report = ReturnType<typeof adminReport>;
const date = (value: number) =>
  new Intl.DateTimeFormat("kk-KZ", {
    timeZone: "Asia/Aqtau",
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
export default function AdminPanel() {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState<"login" | "denied" | "allowed">("login");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(0);
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    try {
      const session = await accountRequest("session");
      if (!session.user) {
        setAccess("login");
        setReport(null);
        return;
      }
      if (session.user.role !== "admin") {
        setAccess("denied");
        setReport(null);
        return;
      }
      setAccess("allowed");
      setReport(await accountRequest<Report>("admin"));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Қате шықты.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 30_000);
    return () => clearInterval(timer);
  }, [refresh]);
  async function login(form: FormData) {
    setBusy(true);
    setError("");
    try {
      await accountRequest("login", {
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      window.dispatchEvent(new Event("qazaq-account-change"));
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Кіру мүмкін болмады.");
    } finally {
      setBusy(false);
    }
  }
  async function signOut() {
    setError("");
    try {
      await accountRequest("logout", {});
      setReport(null);
      setAccess("login");
      localStorage.removeItem("qazaq-player");
      localStorage.removeItem("qazaq-required-learning-v1");
      window.dispatchEvent(new Event("qazaq-account-change"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Шығу мүмкін болмады.");
    }
  }
  const filtered =
    report?.users.filter(
      (u) =>
        (role === "all" || u.role === role) &&
        `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase()),
    ) ?? [];
  function csv() {
    if (!report) return;
    const escape = (value: unknown) => {
      let s = String(value ?? "");
      if (/^[=+@\-]/.test(s)) s = "'" + s;
      return '"' + s.replaceAll('"', '""') + '"';
    };
    const rows = [
      [
        "Аты",
        "Email",
        "Рөлі",
        "Тіркелді",
        "Соңғы кіру",
        "XP",
        "Деңгей",
        "Тапсырма әрекеті",
        "Дұрыс жауап",
        "Аяқталған бөлім",
        "Белсенді минут",
      ],
      ...filtered.map((u) => [
        u.name,
        u.email,
        u.role,
        date(u.createdAt),
        date(u.lastSeen),
        u.xp,
        u.level,
        u.attempts,
        u.correct,
        u.requiredCompleted.length,
        Math.round(u.seconds / 60),
      ]),
    ];
    const blob = new Blob(
      ["\ufeff" + rows.map((row) => row.map(escape).join(",")).join("\r\n")],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "qazaq-users.csv";
    link.click();
    URL.revokeObjectURL(url);
  }
  return (
    <main className="admin-page">
      <div className="admin-top">
        <a className="admin-brand" href="/">
          <Emblem />
          <span>
            ҚАЗАҚ ҚАҺАРМАНДАРЫ<small>Әкімші панелі</small>
          </span>
        </a>
        <a className="text-button" href="/">
          <ArrowLeft size={16} /> Сайтқа оралу
        </a>
      </div>
      {error && (
        <p role="alert" className="admin-error">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status">Жүктелуде...</p>
      ) : access !== "allowed" ? (
        <section className="admin-login">
          <ShieldCheck size={38} />
          <h1>
            {access === "denied"
              ? "Бұл бөлім тек әкімшіге арналған"
              : "Әкімші аккаунтына кіру"}
          </h1>
          <p>Пайдаланушылардың жеке деректері әкімші рөлімен ғана ашылады.</p>
          {access === "login" ? (
            <form action={login}>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  required
                />
              </label>
              <label>
                Құпиясөз
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  maxLength={128}
                />
              </label>
              <button className="gold-button" disabled={busy}>
                {busy ? "Күте тұр..." : "КІРУ"}
              </button>
            </form>
          ) : (
            <button className="outline-button" onClick={() => void signOut()}>
              Басқа аккаунтпен кіру
            </button>
          )}
        </section>
      ) : (
        report && (
          <>
            <div className="admin-title">
              <div>
                <span className="eyebrow">
                  ПАЙДАЛАНУШЫЛАР МЕН ОҚУ НӘТИЖЕЛЕРІ
                </span>
                <h1>Статистика</h1>
                <p>
                  Соңғы жаңарту: {date(report.generatedAt)} · Әр 30 секундта
                  жаңарады.
                </p>
              </div>
              <div>
                <button
                  className="outline-button"
                  onClick={() => void refresh()}
                >
                  <RefreshCw size={16} /> Жаңарту
                </button>
                <button
                  className="outline-button"
                  onClick={() => void signOut()}
                >
                  <LogOut size={16} /> Шығу
                </button>
              </div>
            </div>
            <div className="admin-stat-grid">
              {[
                {
                  icon: Users,
                  label: "Тіркелген оқушы",
                  value: report.summary.students,
                },
                {
                  icon: Clock,
                  label: "Бүгін белсенді",
                  value: report.summary.activeToday,
                },
                {
                  icon: ChartColumn,
                  label: "Жауап беру әрекеті",
                  value: report.summary.attempts,
                },
                {
                  icon: Target,
                  label: "Дұрыс жауап үлесі",
                  value: `${report.summary.accuracy}%`,
                },
              ].map((item) => (
                <article key={item.label}>
                  <item.icon size={23} />
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>
            <section className="admin-module-panel">
              <h2>Төрт негізгі бөлім бойынша нәтиже</h2>
              <div className="admin-module-grid">
                {report.modules.map((module) => (
                  <article key={module.id}>
                    <h3>{module.title}</h3>
                    <strong>{module.completed} оқушы аяқтады</strong>
                    <progress
                      max={100}
                      value={
                        module.attempts
                          ? (module.correct / module.attempts) * 100
                          : 0
                      }
                    />
                    <p>
                      {module.correct} дұрыс / {module.attempts} жауап ·{" "}
                      {module.attempts
                        ? Math.round((module.correct / module.attempts) * 100)
                        : 0}
                      %
                    </p>
                  </article>
                ))}
              </div>
              <p className="admin-note">
                4 бөлімді толық аяқтағандар: {report.summary.completed}.
                Жауаптар серверде сұрақ кілтімен тексеріледі. XP мен сюжет
                прогресі ойыннан синхрондалады.
              </p>
            </section>
            <section className="admin-users">
              <div className="admin-users-title">
                <h2>
                  Барлық пайдаланушы <span>({filtered.length})</span>
                </h2>
                <button className="outline-button" onClick={csv}>
                  <Download size={16} /> CSV жүктеу
                </button>
              </div>
              <div className="admin-filters">
                <label>
                  <Search size={18} />
                  <input
                    aria-label="Пайдаланушыны іздеу"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(0);
                    }}
                    placeholder="Аты немесе email"
                  />
                </label>
                <select
                  aria-label="Пайдаланушы рөлі"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="all">Барлығы</option>
                  <option value="student">Оқушылар</option>
                  <option value="admin">Әкімшілер</option>
                </select>
              </div>
              <div className="admin-table-scroll">
                <table>
                  <thead>
                    <tr>
                      {[
                        "Пайдаланушы",
                        "Рөлі",
                        "Прогресс",
                        "Білім нәтижесі",
                        "Сюжет",
                        "Белсенділік",
                      ].map((label) => (
                        <th key={label}>{label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(page * 20, (page + 1) * 20).map((user) => (
                      <tr key={user.id}>
                        <td>
                          <strong>{user.name}</strong>
                          <small>{user.email}</small>
                          <small>Тіркелді: {date(user.createdAt)}</small>
                        </td>
                        <td>
                          <span className={`admin-role role-${user.role}`}>
                            {user.role === "admin" ? "Әкімші" : "Оқушы"}
                          </span>
                        </td>
                        <td>
                          <strong>
                            {user.xp} XP · {user.level}-деңгей
                          </strong>
                          <small>
                            {heroes.find((h) => h.id === user.characterId)
                              ?.name ?? "Кейіпкер таңдалмаған"}
                          </small>
                          <small>
                            {user.nationalGames} ұлттық ойын · {user.missions}{" "}
                            миссия
                          </small>
                        </td>
                        <td>
                          <strong>
                            {user.requiredCompleted.length} / 4 бөлім
                          </strong>
                          <small>
                            {user.correct} / {user.attempts} дұрыс жауап
                          </small>
                        </td>
                        <td>{user.storyEpisodes} / 18 эпизод</td>
                        <td>
                          <small>{date(user.lastSeen)}</small>
                          <small>
                            ≈ {Math.round(user.seconds / 60)} белсенді минут
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!filtered.length && (
                <p className="admin-empty">Пайдаланушы табылмады.</p>
              )}
              <div className="admin-pagination">
                <button
                  className="outline-button"
                  disabled={!page}
                  onClick={() => setPage(page - 1)}
                >
                  Алдыңғы
                </button>
                <span>
                  {Math.min(page * 20 + 1, filtered.length)}–
                  {Math.min((page + 1) * 20, filtered.length)} /{" "}
                  {filtered.length}
                </span>
                <button
                  className="outline-button"
                  disabled={(page + 1) * 20 >= filtered.length}
                  onClick={() => setPage(page + 1)}
                >
                  Келесі
                </button>
              </div>
              <p className="admin-note">
                Белсенді минут — бет ашық әрі көрініп тұрған уақыттың жуық
                есебі. Қонақ режиміндегі жауаптар бұл есепке кірмейді.
              </p>
            </section>
          </>
        )
      )}
    </main>
  );
}
