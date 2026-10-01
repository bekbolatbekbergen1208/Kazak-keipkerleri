import type { Hero, Mission, Stats } from "@/types/game";
export const statNames: Record<keyof Stats, string> = {
  strength: "Күш",
  wisdom: "Ақыл",
  courage: "Батылдық",
  agility: "Ептілік",
  eloquence: "Шешендік",
};
export const heroes: Hero[] = [
  {
    id: "tostik",
    portrait: "/art/hero-0.webp",
    name: "Ер Төстік",
    category: "Қиял-ғажайып ертегі",
    description:
      "Жер асты әлеміне сапар шеккен ертегі қаһарманы. Оның ерлігі мен достарына адалдығы қиындықтарды жеңуге көмектеседі.",
    ability: "Шалқұйрықтың серпіні",
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
    portrait: "/art/hero-1.webp",
    name: "Алпамыс батыр",
    category: "Батырлық жыр",
    description:
      "«Алпамыс батыр» эпосының қаһарманы. Елін қорғау, адалдық пен төзімділік — оның жырдағы басты қасиеттері.",
    ability: "Берік қалқан",
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
    portrait: "/art/hero-2.webp",
    name: "Қобыланды батыр",
    category: "Батырлық жыр",
    description:
      "«Қобыланды батыр» жырындағы ерлік пен табандылықтың бейнесі. Эпикалық дәстүрдің кейіпкері.",
    ability: "Дала стратегиясы",
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
    portrait: "/art/hero-3.webp",
    name: "Керқұла атты Кендебай",
    category: "Қиял-ғажайып ертегі",
    description:
      "Мейірімділігі мен әділдігі арқылы танылған ертегі кейіпкері. Керқұла атымен бірге мұқтаж жандарға көмектеседі.",
    ability: "Керқұланың жылдамдығы",
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
    portrait: "/art/hero-4.webp",
    name: "Тазша бала",
    category: "Халық ертегісі",
    description:
      "Ақылы мен тапқырлығы арқылы қиын сұрақтарға жауап табатын халық ертегілерінің кейіпкері.",
    ability: "Тапқыр ой",
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
    portrait: "/art/hero-5.webp",
    name: "Алдар көсе",
    category: "Халық аңызы",
    description:
      "Халық әңгімелеріндегі тапқыр кейіпкер. Оның әзілге толы оқиғалары сараңдық пен әділетсіздікті әшкерелейді.",
    ability: "Сөздің күші",
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
            ["Елдің аманаты", "Бірліктің күші"],
            ["Дұрыс шешім", "Тайбурылдың ізі"],
            ["Керқұланың жолы", "Әділдік сынағы"],
            ["Даналық жұмбағы", "Тапқырлық мектебі"],
            ["Сараң байдың сыры", "Ақылды сөз"],
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
