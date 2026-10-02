"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Coins,
  Compass,
  Crown,
  Flag,
  Gamepad2,
  Layers,
  Lock,
  Map,
  Settings,
  Shield,
  Sparkles,
  Star,
  Swords,
  Trophy,
  User,
  X,
  Zap,
} from "lucide-react";
import HeroCard from "@/components/heroes/HeroCard";
import PlayerPortrait from "@/components/heroes/PlayerPortrait";
import Emblem from "@/components/ui-emblem";
import WorldMap from "@/components/map/WorldMap";
import MiniGame from "./MiniGame";
import NationalGame, { NationalGamesShelf } from "./national/NationalGames";
import { nationalGames, type NationalKind } from "@/data/national-games";
import {
  achievements,
  dailyTemplates,
  heroes,
  missions,
  regions,
  statNames,
} from "@/data/content";
import {
  freshPlayer,
  levelFloor,
  levelFor,
  reconcile,
} from "@/lib/progression";
import { supabase } from "@/lib/supabase";
import { playEffect, type SoundSettings } from "@/lib/sound";
import type { GameKind, Hero, Mission, Player } from "@/types/game";
type Screen =
  | "home"
  | "world"
  | "heroes"
  | "missions"
  | "collection"
  | "leaderboard"
  | "profile"
  | "creator"
  | "intro";
const navigation = [
  { id: "world", label: "ӘЛЕМ", icon: Compass },
  { id: "heroes", label: "ҚАҺАРМАНДАР", icon: Shield },
  { id: "missions", label: "МИССИЯЛАР", icon: Flag },
  { id: "collection", label: "КОЛЛЕКЦИЯ", icon: Layers },
  { id: "leaderboard", label: "РЕЙТИНГ", icon: Trophy },
] as const;
const intro = [
  "Ұлы Даланың аңыздары ұмытылып барады...",
  "Әр аңыздың ішінде бір күш сақталған.",
  "Сол күшті қайта оятатын жаңа қаһарман керек.",
  "Ол қаһарман — сен.",
];
export default function Game() {
  const [screen, setScreen] = useState<Screen>("home");
  const [player, setPlayer] = useState<Player>(freshPlayer);
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);
  const [hero, setHero] = useState<Hero | null>(null);
  const [mission, setMission] = useState<Mission | null>(null);
  const [stage, setStage] = useState(-1);
  const [reward, setReward] = useState<Mission | null>(null);
  const [region, setRegion] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState<"settings" | "auth" | null>(null);
  const [introStep, setIntroStep] = useState(0);
  const [national, setNational] = useState<NationalKind | null>(null);
  const [practice, setPractice] = useState<GameKind | null>(null);
  const [tab, setTab] = useState("Барлық уақыт");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authMessage, setAuthMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState("Қонақ режимі");
  const [sound, setSound] = useState<SoundSettings>({
    music: false,
    effects: false,
    volume: 0.4,
  });
  const musicAudio = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem("qazaq-player");
        if (raw) {
          setPlayer(reconcile({ ...freshPlayer(), ...JSON.parse(raw) }));
          setStarted(true);
        }
        const settings = localStorage.getItem("qazaq-sound");
        if (settings) setSound(JSON.parse(settings));
      } catch {}
      setLoaded(true);
    });
    if (!supabase) return;
    const client = supabase;
    const load = async (id: string) => {
      const { data, error } = await client
        .from("profiles")
        .select("game_state")
        .eq("id", id)
        .single();
      if (data?.game_state) {
        setPlayer(reconcile(data.game_state as Player));
        setStarted(true);
      }
      setUserId(id);
      setSyncStatus(
        error && error.code !== "PGRST116"
          ? "Сақтауды тексеріңіз"
          : "Бұлтқа қосылды",
      );
    };
    void client.auth.getSession().then(({ data }) => {
      if (data.session) void load(data.session.user.id);
    });
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      if (session) setTimeout(() => void load(session.user.id), 0);
      else {
        setUserId(null);
        setSyncStatus("Қонақ режимі");
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!loaded || !started) return;
    localStorage.setItem("qazaq-player", JSON.stringify(player));
    if (!supabase || !userId) return;
    const client = supabase;
    const id = setTimeout(() => {
      void client
        .from("profiles")
        .upsert({
          id: userId,
          username: player.name,
          avatar: player.avatar,
          level: levelFor(player.xp),
          xp: player.xp,
          coins: player.coins,
          hero_stats: player.stats,
          game_state: player,
        })
        .then(({ error }) =>
          setSyncStatus(error ? "Бұлтқа сақтау сәтсіз" : "Бұлтқа сақталды"),
        );
    }, 600);
    return () => clearTimeout(id);
  }, [player, loaded, started, userId]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    if (screen !== "intro") return;
    const timer = setTimeout(() => {
      if (introStep < 3) setIntroStep((s) => s + 1);
      else setScreen("creator");
    }, 3000);
    return () => clearTimeout(timer);
  }, [screen, introStep]);
  useEffect(() => {
    localStorage.setItem("qazaq-sound", JSON.stringify(sound));
    if (musicAudio.current) {
      musicAudio.current.volume = sound.volume * 0.3;
      if (sound.music)
        void musicAudio.current
          .play()
          .catch(() => setToast("Музыканы ойнату мүмкін болмады"));
      else musicAudio.current.pause();
    }
  }, [sound]);
  function update(fn: (p: Player) => Player) {
    setPlayer((p) => reconcile(fn(p)));
  }
  function navigate(s: Screen) {
    setScreen(s);
    setRegion(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function start() {
    if (started) navigate("world");
    else {
      setIntroStep(0);
      navigate("intro");
    }
  }
  function learn(h: Hero) {
    setHero(h);
    update((p) => ({
      ...p,
      achievements: [...new Set([...p.achievements, "learn"])],
      daily: { ...p.daily, learned: 1 },
    }));
  }
  function begin(m: Mission) {
    if (!player.unlocked.includes(m.heroId)) {
      setToast("Алдымен қаһарманды ашу үшін XP жина.");
      return;
    }
    if (!started) {
      setToast("Алдымен өз қаһарманыңды жаса.");
      start();
      return;
    }
    setHero(null);
    setMission(m);
    setStage(
      player.completed.includes(m.id)
        ? -1
        : (player.missionProgress?.[m.id] ?? -1),
    );
  }
  function finish() {
    if (!mission) return;
    const m = mission;
    const done = player.completed.includes(m.id);
    if (!done) {
      update((p) => ({
        ...p,
        xp: p.xp + m.xp,
        coins: p.coins + m.coins,
        completed: [...p.completed, m.id],
        missionProgress: { ...p.missionProgress, [m.id]: -1 },
        stats: Object.fromEntries(
          Object.entries(p.stats).map(([k, v]) => [k, Math.min(100, v + 2)]),
        ) as Player["stats"],
        daily: { ...p.daily, missions: p.daily.missions + 1 },
      }));
      playEffect(sound);
    }
    setReward({ ...m, xp: done ? 0 : m.xp, coins: done ? 0 : m.coins });
    setMission(null);
  }
  const level = levelFor(player.xp),
    floor = levelFloor(level),
    next = levelFloor(level + 1);
  const percent = ((player.xp - floor) / (next - floor)) * 100;
  async function auth(form: FormData) {
    if (!supabase) {
      setAuthMessage(
        "Қонақ режимі дайын. Онлайн аккаунт үшін Supabase баптауы қажет.",
      );
      return;
    }
    const email = String(form.get("email")),
      password = String(form.get("password"));
    const { error } =
      authMode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setAuthMessage(
      error
        ? error.message
        : authMode === "signup"
          ? "Поштаңдағы растау сілтемесін аш."
          : "Аккаунтқа кірдің.",
    );
    if (!error && authMode === "login") setModal(null);
  }
  return (
    <MotionConfig reducedMotion="user">
      <div className="app-shell">
        <header className="header">
          <button
            className="brand"
            onClick={() => navigate("home")}
            aria-label="Басты бет"
          >
            <span className="emblem">
              <Emblem />
            </span>
            <span>
              QAZAQ<span className="brand-bottom">HEROES</span>
            </span>
          </button>
          <nav>
            {navigation.map((n) => (
              <button
                className={screen === n.id ? "active" : ""}
                key={n.id}
                onClick={() => navigate(n.id)}
              >
                {n.label}
              </button>
            ))}
          </nav>
          <div className="header-right">
            <span className="xp-pill">
              <Zap size={14} />
              {player.xp} <small>XP</small>
            </span>
            <span className="coin-pill">
              <Coins size={16} />
              {player.coins}
            </span>
            <button
              className="avatar-button"
              onClick={() => navigate("profile")}
              aria-label="Ойыншы профилі"
            >
              <Image
                src={`/art/hero-${player.avatar}.svg`}
                alt=""
                width={36}
                height={36}
              />
            </button>
            <button
              className="settings-button"
              aria-label="Баптаулар"
              onClick={() => setModal("settings")}
            >
              <Settings size={19} />
            </button>
          </div>
        </header>
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {screen === "home" && (
                <>
                  <section className="landing">
                    <div className="landscape" />
                    <div className="landing-shade" />
                    <div className="hero-copy">
                      <div className="eyebrow">
                        <span />
                        АҢЫЗДАР ТІРІЛЕТІН ӘЛЕМ
                      </div>
                      <h1>
                        Ұлы Дала.
                        <br />
                        Ұлы қаһармандар.
                        <br />
                        <span>Сенің тарихың.</span>
                      </h1>
                      <p>
                        Өз қаһармандарыңды таны.
                        <br />
                        Олардың тарихын ойна.
                      </p>
                      <div className="cta-row">
                        <button className="gold-button" onClick={start}>
                          <Gamepad2 size={19} />
                          {started ? "САЯХАТТЫ ЖАЛҒАСТЫРУ" : "ОЙЫНДЫ БАСТАУ"}
                          <ArrowRight size={18} />
                        </button>
                        <button
                          className="outline-button"
                          onClick={() => navigate("heroes")}
                        >
                          ҚАҺАРМАНДАР
                          <ArrowUpRight size={17} />
                        </button>
                      </div>
                      <div className="hero-meta">
                        <span>
                          <Shield size={15} />6 аңызға айналған қаһарман
                        </span>
                        <i />
                        <span>
                          <Compass size={15} />
                          Шексіз шытырман оқиға
                        </span>
                      </div>
                    </div>
                    <div className="featured-warrior">
                      <div className="warrior-halo" />
                      <Image
                        src={heroes[0].portrait}
                        alt="Ертегі қаһарманы Ер Төстік"
                        width={400}
                        height={520}
                        priority
                      />
                      <div className="warrior-label">
                        <span className="little-line" />
                        <small>ЕРТЕГІДЕН — СЕНІҢ ӘЛЕМІҢЕ</small>
                        <h3>Ер Төстік</h3>
                        <p>Батылдық. Достық. Шытырман.</p>
                        <button onClick={() => learn(heroes[0])}>
                          Қаһарманды таны <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                    <div className="landing-bottom">
                      <span>ҰЛЫ ДАЛА ҚАҺАРМАНДАРЫНЫҢ ӘЛЕМІНЕ КІР</span>
                      <span>
                        ЗЕРТТЕУ ҮШІН ТӨМЕН ЖЫЛЖЫ <span>↓</span>
                      </span>
                    </div>
                  </section>
                  <section className="feature-strip">
                    <div>
                      <Compass />
                      <span>
                        <strong>Әлемді зертте</strong>
                        <small>5 аймақ. Мыңдаған құпия.</small>
                      </span>
                    </div>
                    <div>
                      <Shield />
                      <span>
                        <strong>Аңыздарды оят</strong>
                        <small>Өз қаһармандарыңды аш.</small>
                      </span>
                    </div>
                    <div>
                      <Swords />
                      <span>
                        <strong>Ақылмен жең</strong>
                        <small>Әр сынақ — жаңа мүмкіндік.</small>
                      </span>
                    </div>
                    <div>
                      <Crown />
                      <span>
                        <strong>Өз тарихыңды жаса</strong>
                        <small>Өс. Жетістікке жет. Қаһарман бол.</small>
                      </span>
                    </div>
                  </section>
                  <section className="content-section">
                    <div className="section-heading">
                      <div>
                        <div className="eyebrow">ДАЛАНЫҢ ДАҢҚТЫ ЕСІМДЕРІ</div>
                        <h2>Аңыздан туған қаһармандар</h2>
                        <p>Әрқайсысының өз күші, өз жолы, өз тарихы бар.</p>
                      </div>
                      <button
                        className="text-button"
                        onClick={() => navigate("heroes")}
                      >
                        Барлық қаһармандар <ArrowRight size={17} />
                      </button>
                    </div>
                    <div className="hero-grid home-heroes">
                      {heroes.slice(0, 4).map((h, i) => (
                        <HeroCard
                          key={h.id}
                          hero={h}
                          index={i}
                          onClick={() => learn(h)}
                        />
                      ))}
                    </div>
                  </section>
                  <section className="content-section map-preview">
                    <div className="section-heading">
                      <div>
                        <div className="eyebrow">БІРІНШІ ҚАДАМ — ЖАҢА АҢЫЗ</div>
                        <h2>Сені Ұлы Дала күтіп тұр</h2>
                      </div>
                      <button
                        className="text-button"
                        onClick={() => navigate("world")}
                      >
                        Картаны ашу <ArrowRight size={17} />
                      </button>
                    </div>
                    <WorldMap
                      xp={player.xp}
                      onSelect={() => (started ? navigate("world") : start())}
                    />
                  </section>
                  <section className="content-section">
                    <div className="section-heading">
                      <div>
                        <div className="eyebrow">ОЙНА. ҮЙРЕН. ӨС.</div>
                        <h2>Әр сынақта бір жаңа күш</h2>
                      </div>
                      <span className="muted">
                        5 шағын ойын · Пернетақта және сенсор
                      </span>
                    </div>
                    <div className="game-grid">
                      {(
                        [
                          "riddle",
                          "path",
                          "memory",
                          "choice",
                          "horse",
                        ] as GameKind[]
                      ).map((kind, i) => (
                        <button
                          key={kind}
                          className="practice-card"
                          onClick={() => setPractice(kind)}
                        >
                          <span>{["◈", "⌁", "✦", "⚑", "♞"][i]}</span>
                          <h3>
                            {
                              [
                                "Жұмбақ",
                                "Дала жолы",
                                "Есте сақтау",
                                "Батыр таңдауы",
                                "Керқұла жарысы",
                              ][i]
                            }
                          </h3>
                          <small>
                            ОЙНАУ <ArrowUpRight size={13} />
                          </small>
                        </button>
                      ))}
                    </div>
                    <NationalGamesShelf
                      onSelect={setNational}
                      completed={player.nationalCompleted ?? []}
                    />
                  </section>
                </>
              )}
              {screen === "intro" && (
                <section className="intro-screen">
                  <span className="intro-emblem">
                    <Emblem />
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.h1
                      key={introStep}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {intro[introStep]}
                    </motion.h1>
                  </AnimatePresence>
                  <div className="intro-dots">
                    {intro.map((_, i) => (
                      <span
                        key={i}
                        className={i === introStep ? "active" : ""}
                      />
                    ))}
                  </div>
                  <button
                    className="text-button"
                    onClick={() => navigate("creator")}
                  >
                    Өткізіп жіберу <ArrowRight size={16} />
                  </button>
                </section>
              )}
              {screen === "creator" && (
                <section className="content-section">
                  <div className="eyebrow">
                    СЕНІҢ АҢЫЗЫҢ ОСЫ ЖЕРДЕН БАСТАЛАДЫ
                  </div>
                  <h1 className="page-title">Өз қаһарманыңды жаса</h1>
                  <div className="creator-layout">
                    <div className="creator-preview">
                      <PlayerPortrait player={player} />
                      <div>
                        <small>ДЕҢГЕЙ {level}</small>
                        <h2>{player.name || "Жас қаһарман"}</h2>
                        <p>
                          {player.headwear} · {player.equipment} ·{" "}
                          {player.accessory}
                        </p>
                        <p>
                          {player.hair} · {player.outfit} · {player.armor} сауыт
                        </p>
                      </div>
                    </div>
                    <div className="panel creator-controls">
                      <label>
                        Қаһарманның аты
                        <input
                          maxLength={24}
                          value={player.name}
                          onChange={(e) =>
                            setPlayer({ ...player, name: e.target.value })
                          }
                        />
                      </label>
                      <label>Бейнеңді таңда</label>
                      <div className="avatar-choices">
                        {heroes.map((h, i) => (
                          <button
                            className={player.avatar === i ? "selected" : ""}
                            key={h.id}
                            onClick={() => setPlayer({ ...player, avatar: i })}
                            aria-label={`Бейне ${i + 1}`}
                          >
                            <Image
                              src={`/art/hero-${i}.svg`}
                              alt=""
                              width={60}
                              height={75}
                            />
                          </button>
                        ))}
                      </div>
                      <div className="customization-grid">
                        {(
                          [
                            {
                              key: "hair",
                              label: "Шаш үлгісі",
                              values: ["Қысқа", "Ұзын", "Өрілген"],
                            },
                            {
                              key: "outfit",
                              label: "Киім",
                              values: [
                                "Көк шапан",
                                "Жасыл шапан",
                                "Алтын шапан",
                              ],
                            },
                            {
                              key: "armor",
                              label: "Сауыт",
                              values: ["Жеңіл", "Былғары", "Темір"],
                            },
                            {
                              key: "headwear",
                              label: "Бас киім",
                              values: ["Дулыға", "Тақия", "Бөрік"],
                            },
                            {
                              key: "accessory",
                              label: "Аксессуар",
                              values: ["Тұмар", "Белдік", "Білезік"],
                            },
                            {
                              key: "equipment",
                              label: "Жабдық",
                              values: [
                                "Садақ",
                                "Қалқан",
                                "Домбыра",
                                "Кітап",
                                "Қылыш",
                                "Қамшы",
                              ],
                            },
                          ] as const
                        ).map((c) => (
                          <label key={c.key}>
                            {c.label}
                            <select
                              value={player[c.key]}
                              onChange={(e) =>
                                setPlayer({
                                  ...player,
                                  [c.key]: e.target.value,
                                })
                              }
                            >
                              {c.values.map((v) => (
                                <option key={v}>{v}</option>
                              ))}
                            </select>
                          </label>
                        ))}
                      </div>
                      <StatsView player={player} />
                      <button
                        className="gold-button full"
                        disabled={!player.name.trim()}
                        onClick={() => {
                          setPlayer({ ...player, name: player.name.trim() });
                          setStarted(true);
                          navigate("world");
                          setToast(
                            "Қош келдің, қаһарман! Алғашқы сапарыңды баста.",
                          );
                        }}
                      >
                        САЯХАТТЫ БАСТАУ <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </section>
              )}
              {screen === "world" && (
                <section className="content-section world-section">
                  <div className="section-heading">
                    <div>
                      <div className="eyebrow">САЯХАТЫҢДЫ ЖАЛҒАСТЫР</div>
                      <h1 className="page-title">Ұлы Дала картасы</h1>
                      <p>Әр жол — бір аңыз. Әр аңыз — бір жаңа күш.</p>
                    </div>
                    <span className="pill">
                      <span className="status-dot" />
                      {regions.filter((r) => r.xp <= player.xp).length} / 5
                      аймақ ашық
                    </span>
                  </div>
                  <WorldMap
                    xp={player.xp}
                    onSelect={(i) => {
                      if (player.xp < regions[i].xp) {
                        setToast(
                          `${regions[i].name}: ${regions[i].xp} XP жинап аш.`,
                        );
                        return;
                      }
                      setRegion(i);
                      update((p) => ({
                        ...p,
                        visits: [...new Set([...p.visits, i])],
                      }));
                    }}
                  />
                  <div className="world-lower">
                    <div className="panel">
                      <div className="eyebrow">
                        {region === null
                          ? "СЕНІҢ КЕЛЕСІ ШЫТЫРМАНЫҢ"
                          : regions[region].name}
                      </div>
                      <h2>
                        {region === null
                          ? "Шалқұйрықты тап"
                          : regions[region].sub}
                      </h2>
                      <p>
                        Ер Төстікпен бірге жұмбақтарды шешіп, аңыздың жаңа бетін
                        аш.
                      </p>
                      <button
                        className="gold-button"
                        onClick={() => begin(missions[(region ?? 0) * 2])}
                      >
                        МИССИЯНЫ БАСТАУ <ArrowRight size={17} />
                      </button>
                    </div>
                    <DailyQuests
                      player={player}
                      claim={(id) => {
                        const q = dailyTemplates.find((q) => q.id === id);
                        if (!q) return;
                        const key = q.id.split("-")[0] as
                          "riddles" | "missions" | "learned";
                        if (
                          player.daily[key] < q.target ||
                          player.daily.claimed.includes(id)
                        )
                          return;
                        update((p) => ({
                          ...p,
                          xp: p.xp + q.xp,
                          coins: p.coins + q.coins,
                          daily: {
                            ...p.daily,
                            claimed: [...p.daily.claimed, id],
                          },
                        }));
                        setToast(
                          `Күндік сыйлық: +${q.xp} XP · +${q.coins} тиын`,
                        );
                      }}
                    />
                  </div>
                </section>
              )}
              {(screen === "heroes" || screen === "collection") && (
                <section className="content-section">
                  <div className="eyebrow">
                    {screen === "heroes"
                      ? "АҢЫЗДАРДЫҢ ҚАҺАРМАНДАРЫ"
                      : "СЕНІҢ АҢЫЗДАР ЖИНАҒЫҢ"}
                  </div>
                  <div className="section-heading">
                    <div>
                      <h1 className="page-title">
                        {screen === "heroes"
                          ? "Қаһармандар"
                          : "Қаһарман коллекциясы"}
                      </h1>
                      <p>
                        {screen === "heroes"
                          ? "Халық ертегілері мен батырлық жырлардан туған әлем."
                          : "Миссияларды аяқта, тәжірибе жина және жаңа карталарды аш."}
                      </p>
                    </div>
                    <span className="pill">
                      {player.unlocked.length} / 6 ашылды
                    </span>
                  </div>
                  <div className="hero-grid">
                    {heroes.map((h, i) => (
                      <HeroCard
                        key={h.id}
                        hero={h}
                        index={i}
                        locked={
                          screen === "collection" &&
                          !player.unlocked.includes(h.id)
                        }
                        onClick={() => learn(h)}
                      />
                    ))}
                  </div>
                </section>
              )}
              {screen === "missions" && (
                <section className="content-section">
                  <div className="eyebrow">БАТЫЛДЫҚ ПЕН АҚЫЛ СЫНАҚТАРЫ</div>
                  <h1 className="page-title">Миссиялар</h1>
                  <p className="muted">
                    Әр оқиғада 3 сынақ. Сыйлық бір рет беріледі.
                  </p>
                  <div className="mission-grid">
                    {missions.map((m) => (
                      <button
                        key={m.id}
                        className="panel mission-card"
                        onClick={() => begin(m)}
                      >
                        <div className="mission-top">
                          <span>
                            {heroes.find((h) => h.id === m.heroId)?.name}
                          </span>
                          {player.completed.includes(m.id) ? (
                            <Check size={18} />
                          ) : !player.unlocked.includes(m.heroId) ? (
                            <Lock size={18} />
                          ) : (
                            <Flag size={18} />
                          )}
                        </div>
                        <h3>{m.title}</h3>
                        <p>{m.description}</p>
                        <div className="reward-line">
                          <span>
                            <Zap size={14} />
                            {m.xp} XP
                          </span>
                          <span>
                            <Coins size={14} />
                            {m.coins}
                          </span>
                          <ArrowRight size={17} />
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}
              {screen === "missions" && (
                <section className="content-section">
                  <NationalGamesShelf
                    onSelect={setNational}
                    completed={player.nationalCompleted ?? []}
                  />
                </section>
              )}
              {screen === "profile" && (
                <section className="content-section">
                  <div className="eyebrow">СЕНІҢ САЯХАТЫҢ</div>
                  <h1 className="page-title">Қаһарман профилі</h1>
                  <div className="profile-layout">
                    <div className="panel profile-card">
                      <PlayerPortrait player={player} />
                      <span className="pill">ДЕҢГЕЙ {level}</span>
                      <h2>{player.name}</h2>
                      <p className="muted">
                        {level < 5 ? "Дала саяхатшысы" : "Аңыз сақтаушысы"} ·{" "}
                        {syncStatus}
                      </p>
                      <div className="xp-label">
                        <span>{player.xp} XP</span>
                        <span>{next} XP</span>
                      </div>
                      <div className="progress">
                        <span style={{ width: `${percent}%` }} />
                      </div>
                      <p>
                        <Coins size={17} />
                        {player.coins} тиын · {player.completed.length} миссия
                      </p>
                      <button
                        className="outline-button"
                        onClick={() => navigate("creator")}
                      >
                        Бейнені өзгерту
                      </button>
                      <button
                        className="text-button"
                        onClick={() => setModal("auth")}
                      >
                        {userId ? "Аккаунт" : "Кіру / Тіркелу"}
                        <ArrowRight size={15} />
                      </button>
                    </div>
                    <div>
                      <div className="panel">
                        <h2>Сенің күшің</h2>
                        <StatsView player={player} />
                      </div>
                      <div className="section-heading compact">
                        <h2>Жетістіктер</h2>
                        <span className="muted">
                          {player.achievements.length} / 8
                        </span>
                      </div>
                      <div className="achievement-grid">
                        {achievements.map((a) => (
                          <div
                            key={a.id}
                            className={`achievement ${player.achievements.includes(a.id) ? "earned" : ""}`}
                          >
                            <span>
                              <Trophy size={22} />
                            </span>
                            <div>
                              <strong>{a.name}</strong>
                              <small>{a.detail}</small>
                            </div>
                            {player.achievements.includes(a.id) && (
                              <Check size={15} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="section-heading">
                    <h2>Қаһармандарың</h2>
                    <button
                      className="text-button"
                      onClick={() => navigate("collection")}
                    >
                      Коллекция <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="hero-grid">
                    {heroes
                      .filter((h) => player.unlocked.includes(h.id))
                      .map((h) => (
                        <HeroCard
                          key={h.id}
                          hero={h}
                          index={heroes.indexOf(h)}
                          onClick={() => learn(h)}
                        />
                      ))}
                  </div>
                </section>
              )}
              {screen === "leaderboard" && (
                <Leaderboard player={player} tab={tab} setTab={setTab} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        <footer>
          <button className="brand" onClick={() => navigate("home")}>
            <span className="emblem">
              <Emblem />
            </span>
            <span>QAZAQ HEROES</span>
          </button>
          <p>Әр аңыздың жалғасы бар. Сол жалғасы — сен.</p>
          <span>© 2026 QAZAQ HEROES · Ойна. Таны. Өс.</span>
        </footer>
        <nav className="mobile-nav">
          {navigation.map((n) => (
            <button
              key={n.id}
              className={screen === n.id ? "active" : ""}
              onClick={() => navigate(n.id)}
            >
              <n.icon size={19} />
              <small>{n.label}</small>
            </button>
          ))}
        </nav>
        <AnimatePresence>
          {hero && (
            <Overlay close={() => setHero(null)}>
              <div className="hero-detail">
                <Image
                  src={hero.portrait}
                  alt={hero.name}
                  width={300}
                  height={390}
                />
                <div>
                  <div className="eyebrow">{hero.category}</div>
                  <h1>{hero.name}</h1>
                  <p>{hero.description}</p>
                  <small className="muted">
                    Ойын көрсеткіштері — көркем ойын моделі.
                  </small>
                  <h3>Қабілеттер</h3>
                  <span className="pill">
                    <Sparkles size={15} />
                    {hero.ability}
                  </span>
                  <StatsView player={{ stats: hero.stats }} />
                  <h3>Миссиялар</h3>
                  {missions
                    .filter((m) => m.heroId === hero.id)
                    .map((m) => (
                      <button
                        key={m.id}
                        className="detail-mission"
                        onClick={() => begin(m)}
                      >
                        <span>
                          {m.title}
                          <small>
                            +{m.xp} XP · +{m.coins} тиын
                          </small>
                        </span>
                        {player.unlocked.includes(hero.id) ? (
                          <ArrowRight size={18} />
                        ) : (
                          <Lock size={18} />
                        )}
                      </button>
                    ))}
                  {!player.unlocked.includes(hero.id) && (
                    <p className="muted">
                      Ашу үшін {hero.threshold} XP жина. Қазір: {player.xp} XP.
                    </p>
                  )}
                </div>
              </div>
            </Overlay>
          )}
          {mission && (
            <Overlay
              close={() => {
                setMission(null);
                setStage(-1);
              }}
            >
              <div className="mission-modal">
                <div className="eyebrow">
                  {heroes.find((h) => h.id === mission.heroId)?.name} · ОҚИҒАЛЫ
                  МИССИЯ
                </div>
                <h1>{mission.title}</h1>
                <div className="stage-track">
                  {mission.stages.map((s, i) => (
                    <span key={i} className={i <= stage ? "active" : ""}>
                      {i < stage ? <Check size={13} /> : i + 1}
                      <small>
                        {
                          {
                            riddle: "Жұмбақ",
                            path: "Жол",
                            memory: "Есте сақтау",
                            choice: "Шешім",
                            horse: "Жарыс",
                            battle: "Сайыс",
                          }[s]
                        }
                      </small>
                    </span>
                  ))}
                </div>
                {stage < 0 ? (
                  <>
                    <p>{mission.description}</p>
                    <div className="mission-rewards">
                      <span>
                        <Zap />
                        {mission.xp} XP
                      </span>
                      <span>
                        <Coins />
                        {mission.coins} тиын
                      </span>
                      <span>
                        <Trophy />
                        Жетістік
                      </span>
                    </div>
                    <button
                      className="gold-button"
                      onClick={() => {
                        setStage(0);
                        update((p) => ({
                          ...p,
                          missionProgress: {
                            ...p.missionProgress,
                            [mission.id]: 0,
                          },
                        }));
                      }}
                    >
                      СЫНАҚТАРДЫ БАСТАУ <ArrowRight size={17} />
                    </button>
                  </>
                ) : (
                  <MiniGame
                    key={`${mission.id}-${stage}`}
                    kind={mission.stages[stage]}
                    onDecision={(i) =>
                      update((p) => {
                        const key = (["courage", "wisdom", "agility"] as const)[
                          i
                        ];
                        return {
                          ...p,
                          stats: {
                            ...p.stats,
                            [key]: Math.min(100, p.stats[key] + 2),
                          },
                        };
                      })
                    }
                    onRiddle={() =>
                      update((p) => ({
                        ...p,
                        riddles: p.riddles + 1,
                        daily: { ...p.daily, riddles: p.daily.riddles + 1 },
                      }))
                    }
                    onComplete={() => {
                      if (stage === mission.stages.length - 1) finish();
                      else {
                        setStage(stage + 1);
                        update((p) => ({
                          ...p,
                          missionProgress: {
                            ...p.missionProgress,
                            [mission.id]: stage + 1,
                          },
                        }));
                      }
                    }}
                  />
                )}
              </div>
            </Overlay>
          )}
          {reward && (
            <Overlay
              close={() => {
                setReward(null);
                navigate("world");
              }}
            >
              <div className="reward-modal">
                <div className="reward-emblem">
                  <Trophy size={54} />
                </div>
                <div className="eyebrow">АҢЫЗДЫҢ ЖАҢА БЕТІ АШЫЛДЫ</div>
                <h1>Жарайсың, қаһарман!</h1>
                <p>«{reward.title}» миссиясы аяқталды.</p>
                <div className="reward-amounts">
                  <span>
                    +{reward.xp}
                    <small>ТӘЖІРИБЕ XP</small>
                  </span>
                  <span>
                    +{reward.coins}
                    <small>АЛТЫН ТИЫН</small>
                  </span>
                </div>
                <span className="pill">
                  <Trophy size={16} />
                  Алғашқы қадам · Жетістік ашылды
                </span>
                <p className="muted">
                  {reward.xp === 0
                    ? "Бұл миссияның сыйлығы бұрын алынған."
                    : "Барлық қасиеттер +2 · Қаһарманның қабілеті ашылды"}
                </p>
                <div className="cta-row">
                  <button
                    className="gold-button"
                    onClick={() => {
                      setReward(null);
                      navigate("world");
                    }}
                  >
                    КАРТАҒА ОРАЛУ <Map size={17} />
                  </button>
                  <button
                    className="outline-button"
                    onClick={() => {
                      setReward(null);
                      navigate("profile");
                    }}
                  >
                    ПРОФИЛЬ <User size={17} />
                  </button>
                </div>
              </div>
            </Overlay>
          )}
          {national && (
            <Overlay close={() => setNational(null)}>
              <NationalGame
                kind={national}
                onComplete={() => {
                  const g = nationalGames.find((g) => g.id === national)!;
                  if (!started) {
                    setToast(
                      "Ойын аяқталды! Өз қаһарманыңды жасап, келесі ойында сыйлық ал.",
                    );
                  } else if (
                    (player.nationalCompleted ?? []).includes(national)
                  ) {
                    setToast(
                      "Жарайсың! Бұл ойынның алғашқы сыйлығы бұрын алынған.",
                    );
                  } else {
                    update((p) => ({
                      ...p,
                      xp: p.xp + g.xp,
                      coins: p.coins + g.coins,
                      nationalCompleted: [
                        ...(p.nationalCompleted ?? []),
                        national,
                      ],
                      stats: {
                        ...p.stats,
                        [national === "togyz" ? "wisdom" : "agility"]: Math.min(
                          100,
                          p.stats[national === "togyz" ? "wisdom" : "agility"] +
                            2,
                        ),
                      },
                    }));
                    playEffect(sound);
                    setToast(`${g.name}: +${g.xp} XP · +${g.coins} тиын`);
                  }
                  setNational(null);
                }}
              />
            </Overlay>
          )}
          {practice && (
            <Overlay close={() => setPractice(null)}>
              <MiniGame
                kind={practice}
                onRiddle={() => {
                  if (started)
                    update((p) => ({
                      ...p,
                      riddles: p.riddles + 1,
                      daily: { ...p.daily, riddles: p.daily.riddles + 1 },
                    }));
                }}
                onComplete={() => {
                  setPractice(null);
                  setToast("Сынақ аяқталды! Миссия ойнап, XP жина.");
                }}
              />
            </Overlay>
          )}
          {modal && (
            <Overlay close={() => setModal(null)}>
              {modal === "settings" ? (
                <div className="settings-panel">
                  <div className="eyebrow">ӨЗ ЫҢҒАЙЫҢА БЕЙІМДЕ</div>
                  <h2>Баптаулар</h2>
                  <label className="toggle">
                    Музыка
                    <input
                      type="checkbox"
                      checked={sound.music}
                      onChange={(e) => {
                        if (!musicAudio.current) {
                          const audio = new Audio("/audio/steppe-ambience.wav");
                          audio.loop = true;
                          musicAudio.current = audio;
                        }
                        setSound({ ...sound, music: e.target.checked });
                      }}
                    />
                  </label>
                  <label className="toggle">
                    Дыбыс әсерлері
                    <input
                      type="checkbox"
                      checked={sound.effects}
                      onChange={(e) =>
                        setSound({ ...sound, effects: e.target.checked })
                      }
                    />
                  </label>
                  <label>
                    Дыбыс деңгейі
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step=".05"
                      value={sound.volume}
                      onChange={(e) =>
                        setSound({ ...sound, volume: Number(e.target.value) })
                      }
                    />
                  </label>
                  <p className="muted">
                    Ойын қазақ тілінде. Аккаунтсыз да ойнай аласың.
                  </p>
                  <button
                    className="outline-button"
                    onClick={() => setModal("auth")}
                  >
                    Аккаунт <User size={16} />
                  </button>
                </div>
              ) : (
                <div className="settings-panel">
                  <div className="eyebrow">САЯХАТЫҢДЫ САҚТА</div>
                  <h2>{authMode === "login" ? "Аккаунтқа кіру" : "Тіркелу"}</h2>
                  {userId ? (
                    <>
                      <p>Прогресс аккаунтыңа сақталады.</p>
                      <button
                        className="outline-button"
                        onClick={() =>
                          void supabase?.auth
                            .signOut()
                            .then(() => setModal(null))
                        }
                      >
                        Аккаунттан шығу
                      </button>
                    </>
                  ) : (
                    <>
                      <form action={auth}>
                        <label>
                          Email
                          <input
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                          />
                        </label>
                        <label>
                          Құпиясөз
                          <input
                            name="password"
                            type="password"
                            minLength={8}
                            required
                            autoComplete={
                              authMode === "login"
                                ? "current-password"
                                : "new-password"
                            }
                          />
                        </label>
                        <button className="gold-button full" type="submit">
                          {authMode === "login" ? "КІРУ" : "ТІРКЕЛУ"}
                        </button>
                      </form>
                      <button
                        className="text-button"
                        onClick={() => {
                          setAuthMode(
                            authMode === "login" ? "signup" : "login",
                          );
                          setAuthMessage("");
                        }}
                      >
                        {authMode === "login"
                          ? "Жаңа аккаунт жасау"
                          : "Аккаунтым бар"}
                      </button>
                      <button
                        className="text-button"
                        onClick={() => {
                          setModal(null);
                          start();
                        }}
                      >
                        Қонақ ретінде ойнау <ArrowRight size={16} />
                      </button>
                      <p role="status" className="muted">
                        {authMessage}
                      </p>
                    </>
                  )}
                </div>
              )}
            </Overlay>
          )}
        </AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            role="status"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Sparkles size={18} />
            {toast}
            <button onClick={() => setToast("")} aria-label="Хабарламаны жабу">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </div>
    </MotionConfig>
  );
}
function Overlay({
  children,
  close,
}: {
  children: React.ReactNode;
  close: () => void;
}) {
  const dialog = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const nodes = dialog.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input, select, [tabindex="0"]',
        );
        if (nodes?.length) {
          const first = nodes[0],
            last = nodes[nodes.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handler);
      previous?.focus();
    };
  }, [close]);
  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={close}
    >
      <motion.div
        ref={dialog}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Ойын терезесі"
        initial={{ y: 25, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          autoFocus
          className="close-button"
          onClick={close}
          aria-label="Жабу"
        >
          <X size={22} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
function StatsView({ player }: { player: Pick<Player, "stats"> }) {
  return (
    <div className="stats">
      {(Object.keys(statNames) as (keyof Player["stats"])[]).map((k) => (
        <div key={k}>
          <span>{statNames[k]}</span>
          <div className="stat-bar">
            <span style={{ width: `${player.stats[k]}%` }} />
          </div>
          <strong>{player.stats[k]}</strong>
        </div>
      ))}
    </div>
  );
}
function DailyQuests({
  player,
  claim,
}: {
  player: Player;
  claim: (id: string) => void;
}) {
  return (
    <div className="panel daily-panel">
      <div className="section-heading compact">
        <h3>Күндік тапсырмалар</h3>
        <span className="pill">БҮГІН</span>
      </div>
      {dailyTemplates.slice(0, 3).map((q) => {
        const value = player.daily[q.id as "riddles" | "missions" | "learned"];
        const done = player.daily.claimed.includes(q.id);
        return (
          <div className="daily-quest" key={q.id}>
            <span className="quest-icon">
              {done ? <Check size={18} /> : <Star size={18} />}
            </span>
            <div>
              <strong>{q.title}</strong>
              <small>
                +{q.xp} XP · {Math.min(value, q.target)}/{q.target}
              </small>
            </div>
            <button
              disabled={done || value < q.target}
              onClick={() => claim(q.id)}
            >
              {done ? "Алынды" : "Алу"}
              <ChevronRight size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
function Leaderboard({
  player,
  tab,
  setTab,
}: {
  player: Player;
  tab: string;
  setTab: (s: string) => void;
}) {
  const [online, setOnline] = useState<
    { username: string; xp: number; avatar: number }[]
  >([]);
  useEffect(() => {
    if (!supabase) return;
    const column =
      tab === "Бүгін" ? "daily_xp" : tab === "Апта" ? "weekly_xp" : "xp";
    void supabase
      .from("leaderboard_public")
      .select(`username,avatar,${column}`)
      .order(column, { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data)
          setOnline(
            data.map((row) => ({
              username: String(row.username),
              avatar: Number(row.avatar),
              xp: Number((row as unknown as Record<string, unknown>)[column]),
            })),
          );
      });
  }, [tab]);
  const multiplier = tab === "Бүгін" ? 0.12 : tab === "Апта" ? 0.45 : 1;
  const demo = [
    { username: "Дала қыраны", xp: 2450, avatar: 1 },
    { username: "Айару", xp: 2180, avatar: 4 },
    { username: "Тұлпар", xp: 1920, avatar: 3 },
    { username: "Ақылбек", xp: 1570, avatar: 0 },
    { username: "Жұлдыз", xp: 1340, avatar: 5 },
  ].map((p) => ({ ...p, xp: Math.round(p.xp * multiplier) }));
  const rows = online.length
    ? online
    : [
        ...demo,
        { username: player.name, xp: player.xp, avatar: player.avatar },
      ].sort((a, b) => b.xp - a.xp);
  return (
    <section className="content-section">
      <div className="eyebrow">ДАЛАНЫҢ ЖАРҚЫН ЖҰЛДЫЗДАРЫ</div>
      <h1 className="page-title">Топ қаһармандар</h1>
      <p className="muted">
        {online.length
          ? "Қоғамдық ойыншы аттары ғана көрсетіледі."
          : "Демо рейтинг · Мысал ойыншылар және сенің жергілікті нәтижең."}
      </p>
      <div className="tabs">
        {["Бүгін", "Апта", "Барлық уақыт"].map((t) => (
          <button
            className={t === tab ? "active" : ""}
            onClick={() => setTab(t)}
            key={t}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="panel leaderboard">
        <div className="leader-row leader-header">
          <span>ОРЫН</span>
          <span>ҚАҺАРМАН</span>
          <span>ДЕҢГЕЙ</span>
          <span>XP</span>
        </div>
        {rows.map((p, i) => (
          <div
            className={`leader-row ${p.username === player.name ? "you" : ""}`}
            key={`${p.username}-${i}`}
          >
            <span>
              {i < 3 ? <Trophy size={22} /> : String(i + 1).padStart(2, "0")}
            </span>
            <span>
              <Image
                src={heroes[p.avatar % 6].portrait}
                alt=""
                width={42}
                height={45}
              />
              {p.username}
              {p.username === player.name && <small>СЕН</small>}
            </span>
            <span>{levelFor(p.xp)}</span>
            <strong>
              {p.xp.toLocaleString()} <small>XP</small>
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}
