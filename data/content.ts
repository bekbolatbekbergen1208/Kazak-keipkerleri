import type { Hero, Mission, Stats } from "@/types/game";
export const statNames: Record<keyof Stats, string> = {
  strength: "Күш",
  wisdom: "Ақыл",
  courage: "Батылдық",
  agility: "Ептілік",
  eloquence: "Шешендік",
};
// Internal IDs stay stable so existing saved progress and mission references remain valid.
export const heroes: Hero[] = [
  {
    id: "tostik",
    portrait: "/presentation/image7.png",
    name: "Ер Төстік",
    category: "Ер Төстік ертегісі",
    description:
      "Ерлігімен және достарына адалдығымен танылған батыр. Жер асты әлеміндегі сапарында сенімді серіктерімен бірге қиындықтарды жеңеді.",
    ability: "Батылдық пен адалдық",
    rarity: "Эпикалық",
    color: "#80c9ba",
    stats: {
      strength: 70,
      wisdom: 75,
      courage: 90,
      agility: 80,
      eloquence: 65,
    },
    threshold: 0,
  },
  {
    id: "alpamys",
    portrait: "/presentation/image5.png",
    name: "Желаяқ",
    category: "Ер Төстік ертегісі",
    description:
      "Желден де жүйрік жүгіретін ерекше кейіпкер. Ер Төстіктің сапарында жылдамдығымен достарына көмектеседі.",
    ability: "Желдей жылдамдық",
    rarity: "Аңызға айналған",
    color: "#c1a56b",
    stats: {
      strength: 95,
      wisdom: 70,
      courage: 95,
      agility: 70,
      eloquence: 65,
    },
    threshold: 100,
  },
  {
    id: "kobylandy",
    portrait: "/presentation/image6.jpeg",
    name: "Таусоғар",
    category: "Ер Төстік ертегісі",
    description:
      "Тауды көтеретін алып күш иесі. Өзінің қайратын достарына көмектесуге жұмсайды.",
    ability: "Тауды көтерер күш",
    rarity: "Аңызға айналған",
    color: "#d69a79",
    stats: {
      strength: 90,
      wisdom: 85,
      courage: 90,
      agility: 80,
      eloquence: 60,
    },
    threshold: 250,
  },
  {
    id: "kendebay",
    portrait: "/presentation/image8.png",
    name: "Сұңқаркөз",
    category: "Ер Төстік ертегісі",
    description:
      "Алыстағыны анық көретін қырағы серік. Байқағыштығы арқылы достарына жол көрсетеді.",
    ability: "Алысты көрер қырағылық",
    rarity: "Эпикалық",
    color: "#8dafba",
    stats: {
      strength: 85,
      wisdom: 75,
      courage: 85,
      agility: 95,
      eloquence: 60,
    },
    threshold: 400,
  },
  {
    id: "tazsha",
    portrait: "/presentation/image9.png",
    name: "Саққұлақ",
    category: "Ер Төстік ертегісі",
    description:
      "Алыстағы дыбысты еститін ерекше кейіпкер. Саққұлақ естігенін достарына жеткізіп, қауіптен сақтандырады.",
    ability: "Алысты есту қабілеті",
    rarity: "Сирек",
    color: "#aa9ecb",
    stats: {
      strength: 45,
      wisdom: 98,
      courage: 80,
      agility: 80,
      eloquence: 95,
    },
    threshold: 550,
  },
  {
    id: "aldar",
    portrait: "/presentation/image10.png",
    name: "Көлтауысар",
    category: "Ер Төстік ертегісі",
    description:
      "Көлдің суын тауыса алатын ерекше күш иесі. Ер Төстікпен бірге сапарға шығып, достарына көмектеседі.",
    ability: "Көлді тауысар қуат",
    rarity: "Жалпы",
    color: "#9daa76",
    stats: {
      strength: 50,
      wisdom: 95,
      courage: 75,
      agility: 85,
      eloquence: 98,
    },
    threshold: 700,
  },
];
export const missions: Mission[] = heroes.flatMap((h, i) =>
  [0, 1].map((n) => ({
    id: `${h.id}-${n}`,
    heroId: h.id,
    title:
      i === 0
        ? n === 0
          ? "Шалқұйрықты тап"
          : "Жер асты құпиясы"
        : [
            ["Желаяқтың жолы", "Бірліктің күші"],
            ["Дұрыс шешім", "Таусоғардың көмегі"],
            ["Қырағы көз", "Әділдік сынағы"],
            ["Даланың дыбысы", "Саққұлақтың сыры"],
            ["Көлдің құпиясы", "Достарға көмек"],
          ][i - 1][n],
    description:
      i === 0
        ? "Шалқұйрықтың ізі үш сынаққа бастайды. Жұмбақты шеш, жолды тап және белгілерді есте сақта."
        : "Қаһарманмен бірге сапарға шық. Әр сынақта ақыл, мейірім және батылдық таныт.",
    stages:
      n === 0
        ? [
            "riddle",
            "path",
            (
              [
                "memory",
                "choice",
                "battle",
                "horse",
                "riddle",
                "choice",
              ] as const
            )[i],
          ]
        : ["choice", "memory", "horse"],
    xp: 100 + n * 50,
    coins: 30 + n * 20,
  })),
);
export const regions = [
  {
    name: "Ертегілер әлемі",
    sub: "Саяхатың осы жерден басталады",
    xp: 0,
    x: 29,
    y: 58,
  },
  {
    name: "Батырлар даласы",
    sub: "Ерлік пен бірлік мекені",
    xp: 100,
    x: 50,
    y: 34,
  },
  { name: "Аңыздар мекені", sub: "Әр таста бір құпия", xp: 250, x: 71, y: 55 },
  {
    name: "Даналар ордасы",
    sub: "Ақылдың жарығын ізде",
    xp: 500,
    x: 44,
    y: 77,
  },
  { name: "Болашақ әлемі", sub: "Жаңа аңыздың бастауы", xp: 700, x: 83, y: 24 },
];
export const achievements = [
  {
    id: "first",
    name: "Алғашқы қадам",
    detail: "Алғашқы миссияны аяқта",
    icon: "foot",
  },
  {
    id: "riddle",
    name: "Жұмбақ шебері",
    detail: "10 жұмбақты дұрыс шеш",
    icon: "brain",
  },
  {
    id: "friends",
    name: "Батырлардың досы",
    detail: "5 қаһарманды аш",
    icon: "users",
  },
  {
    id: "explorer",
    name: "Ұлы Дала зерттеушісі",
    detail: "Барлық 5 аймаққа бар",
    icon: "map",
  },
  {
    id: "xp",
    name: "1000 XP",
    detail: "1000 тәжірибе ұпайын жина",
    icon: "star",
  },
  {
    id: "three",
    name: "Сенімді серік",
    detail: "3 миссияны аяқта",
    icon: "shield",
  },
  {
    id: "six",
    name: "Аңыз жинаушы",
    detail: "6 миссияны аяқта",
    icon: "cards",
  },
  {
    id: "learn",
    name: "Білімге құштар",
    detail: "Кейіпкер туралы біл",
    icon: "book",
  },
];
export const dailyTemplates = [
  { id: "riddles", title: "3 жұмбақ шеш", target: 3, xp: 30, coins: 10 },
  { id: "missions", title: "1 миссия аяқта", target: 1, xp: 50, coins: 15 },
  {
    id: "learned",
    title: "Жаңа кейіпкер туралы біл",
    target: 1,
    xp: 20,
    coins: 5,
  },
  {
    id: "riddles-extra",
    title: "5 жұмбақтың сырын аш",
    target: 5,
    xp: 40,
    coins: 15,
  },
  {
    id: "missions-extra",
    title: "2 миссияны аяқта",
    target: 2,
    xp: 70,
    coins: 20,
  },
];
export const riddles = [
  {
    q: "Қанаты жоқ, ұшады. Аяғы жоқ, қашады.",
    options: ["Жел", "Ат", "Құс", "Балық"],
    answer: 0,
  },
  {
    q: "Қыста ғана болады, ұстасаң қолың тоңады.",
    options: ["Жапырақ", "Қар", "Құм", "Күн"],
    answer: 1,
  },
  {
    q: "Кішкентай ғана бойы бар, айналдырып киген тоны бар.",
    options: ["Тас", "Қоян", "Қой", "Жұлдыз"],
    answer: 2,
  },
  {
    q: "Күндіз жоқ, түнде бар. Аспаннан табылар.",
    options: ["Гүл", "Бұлт", "Өзен", "Жұлдыз"],
    answer: 3,
  },
];
