export const tostikSource = {
  title: "Кітапхана қорындағы толық мәтін: Ер Төстік",
  url: "https://www.pushkinlibrary.kz/exhibitions/bayterek_kaz/Er-Tostik.htm",
};
export const tostikAudio = "https://kitap.kz/books/er-tostik";
export type TostikProgress = { seen: string[]; episode: number; frame: number };
export type SceneTheme =
  | "village"
  | "steppe"
  | "well"
  | "cave"
  | "palace"
  | "mountain"
  | "lake"
  | "tree"
  | "sky"
  | "dungeon"
  | "spring";
export type SceneAction =
  | "grow"
  | "walk"
  | "reunion"
  | "prepare"
  | "fall"
  | "welcome"
  | "friends"
  | "clear"
  | "race"
  | "lift"
  | "dive"
  | "escape"
  | "protect"
  | "fly"
  | "rescue"
  | "secret"
  | "home";
export type TostikFrame = {
  text: string;
  theme: SceneTheme;
  action: SceneAction;
  actors: number[];
  symbols?: string[];
  label?: string;
};
export type TostikEpisode = {
  id: string;
  title: string;
  frames: TostikFrame[];
};
// Original concise narration of the traditional public-domain tale, not copied website prose.
// Event order follows the linked regional library edition. Intense events are shown without graphic detail.
export const tostikEpisodes: TostikEpisode[] = [
  {
    id: "birth",
    title: "Төстіктің дүниеге келуі",
    frames: [
      {
        text: "Жұт кезінде Ерназардың сегіз ұлы малмен алыстап кетеді.",
        theme: "village",
        action: "walk",
        actors: [],
        symbols: ["8 ағасы", "Жұт"],
      },
      {
        text: "Кейін Төстік туады. Ол тез өсіп, ата-анасына көмектеседі.",
        theme: "village",
        action: "grow",
        actors: [0],
        label: "Ер Төстік",
      },
    ],
  },
  {
    id: "brothers",
    title: "Сегіз ағасын іздеу",
    frames: [
      {
        text: "Ағалары барын білген Төстік оларды іздеуге аттанады.",
        theme: "steppe",
        action: "walk",
        actors: [0],
        symbols: ["Темір таяқ", "Темір етік"],
      },
      {
        text: "Ұзақ жолдан кейін ағаларын табады. Бауырлар елге бірге қайтады.",
        theme: "village",
        action: "reunion",
        actors: [0],
        symbols: ["8 ағасы", "Қайта табысу"],
      },
    ],
  },
  {
    id: "kenzhekei",
    title: "Кенжекейдің ақылы",
    frames: [
      {
        text: "Төстік Кенжекейге үйленеді. Кенжекей оның сапарына қам жасайды.",
        theme: "village",
        action: "prepare",
        actors: [0],
        symbols: ["Кенжекей", "Ақсырмалы сауыт"],
      },
      {
        text: "Ол Шалқұйрықты таңдайды. Бұл тұлпар Төстіктің сенімді серігі болады.",
        theme: "steppe",
        action: "prepare",
        actors: [0],
        label: "Шалқұйрық",
      },
    ],
  },
  {
    id: "sorqudyq",
    title: "Сорқұдықтағы тұзақ",
    frames: [
      {
        text: "Сорқұдықта жалмауыз Ерназарды ұстап, Төстікті алдына келтірмек болады.",
        theme: "well",
        action: "secret",
        actors: [],
        symbols: ["Ерназар", "Жалмауыз", "Егеу"],
      },
      {
        text: "Кенжекей ескерткен соң, Төстік егеуін алуға Шалқұйрықпен барады.",
        theme: "well",
        action: "walk",
        actors: [0],
        symbols: ["Кенжекейдің ескертуі"],
      },
    ],
  },
  {
    id: "underground",
    title: "Жер астына түсу",
    frames: [
      {
        text: "Төстік жалмауызды алдап, егеуін алады. Қуғын басталады.",
        theme: "well",
        action: "escape",
        actors: [0],
        symbols: ["Егеу"],
      },
      {
        text: "Жер қақ айырылады. Төстік пен Шалқұйрық жер астына түседі.",
        theme: "cave",
        action: "fall",
        actors: [0],
      },
    ],
  },
  {
    id: "bapy",
    title: "Жылан Бапы хан",
    frames: [
      {
        text: "Шалқұйрықтың кеңесін тыңдаған Төстік Бапы хан ордасына батыл кіреді.",
        theme: "cave",
        action: "welcome",
        actors: [0],
        symbols: ["Жылан Бапы хан"],
      },
      {
        text: "Бапы хан оны Темір ханға жұмсайды. Төстік сапарға шығады.",
        theme: "palace",
        action: "walk",
        actors: [0],
        symbols: ["Темір хан еліне"],
      },
    ],
  },
  {
    id: "companions",
    title: "Өнерлі достар",
    frames: [
      {
        text: "Жолда Төстік Ептіге, Желаяққа, Саққұлаққа және Таусоғарға кездеседі.",
        theme: "steppe",
        action: "friends",
        actors: [0, 1, 4, 2],
        symbols: ["Епті"],
      },
      {
        text: "Көлтауысар мен Қырағы да қосылады. Әр достың өз өнері бар.",
        theme: "lake",
        action: "friends",
        actors: [0, 5, 3],
        label: "Қырағы — презентациядағы Сұңқаркөз",
      },
    ],
  },
  {
    id: "hidden-palace",
    title: "Темір ханның елі",
    frames: [
      {
        text: "Саққұлақ хабарды естиді. Қырағы жасырынған елді алыстан көреді.",
        theme: "mountain",
        action: "welcome",
        actors: [4, 3],
        symbols: ["Темір хан"],
      },
      {
        text: "Таусоғар тауларды жылжытады. Көлтауысар көлдерді құрғатып, достарға жол ашады.",
        theme: "mountain",
        action: "clear",
        actors: [2, 5, 0],
      },
    ],
  },
  {
    id: "warning",
    title: "Саққұлақ пен Ептінің көмегі",
    frames: [
      {
        text: "Саққұлақ ханның жасырын қастандығын естіп, достарын қауіпті астан сақтандырады.",
        theme: "palace",
        action: "welcome",
        actors: [4, 0],
        symbols: ["Қауіпті ас"],
      },
      {
        text: "Епті айланы әшкерелеуге көмектеседі. Достар қастандықтан аман қалады.",
        theme: "palace",
        action: "protect",
        actors: [0, 4],
        symbols: ["Епті", "Достар аман"],
      },
    ],
  },
  {
    id: "contests",
    title: "Достардың сайысы",
    frames: [
      {
        text: "Таусоғар күресте басым түседі. Шалқұйрық ат бәйгесінде озады.",
        theme: "steppe",
        action: "race",
        actors: [0, 2],
        label: "Шалқұйрықтың бәйгесі",
      },
      {
        text: "Алданып ұйықтап қалған Желаяқ оянып, жаяу жарыста жеңеді.",
        theme: "steppe",
        action: "race",
        actors: [1],
        label: "Желаяқтың жарысы",
      },
    ],
  },
  {
    id: "cauldron",
    title: "Көлдегі қазан",
    frames: [
      {
        text: "Темір хан көлдегі дәу қазанды алуды сұрайды. Көлтауысар суды азайтады.",
        theme: "lake",
        action: "clear",
        actors: [5, 0],
        symbols: ["Дәу қазан"],
      },
      {
        text: "Шалқұйрық тереңге сүңгіп, қазанды алып шығады. Достар қуанады.",
        theme: "lake",
        action: "dive",
        actors: [0],
        symbols: ["Дәу қазан"],
      },
    ],
  },
  {
    id: "iron-palace",
    title: "Темір сарайдан құтылу",
    frames: [
      {
        text: "Хан достарды темір сарайға қамап, сыртын отқа орайды.",
        theme: "palace",
        action: "escape",
        actors: [0, 2, 5],
        symbols: ["Темір сарай"],
      },
      {
        text: "Таусоғар есікті ашады. Көлтауысар отты өшіреді. Кейін достар қоштасады.",
        theme: "palace",
        action: "clear",
        actors: [2, 5, 0],
      },
    ],
  },
  {
    id: "farewell",
    title: "Жер үстіне апарар жол",
    frames: [
      {
        text: "Сапардан қайтқанда өнерлі достар өз мекендерінде Төстікпен қоштасады.",
        theme: "steppe",
        action: "friends",
        actors: [0, 1, 2],
        symbols: ["Достармен қоштасу"],
      },
      {
        text: "Бапы ханнан аттанған сапар ауыр болады. Төстік, Күңке, Шалқұйрық бұлаққа жетеді.",
        theme: "tree",
        action: "walk",
        actors: [0],
        symbols: ["Күңке", "Шалқұйрық"],
      },
    ],
  },
  {
    id: "nest",
    title: "Бәйтеректегі балапандар",
    frames: [
      {
        text: "Қайтар жолда Төстік бәйтерекке өрмелеген айдаһарды байқайды.",
        theme: "tree",
        action: "protect",
        actors: [0],
        symbols: ["Балапандар"],
      },
      {
        text: "Ол балапандарды қорғайды. Олардың анасы Самұрық Төстікке дос болады.",
        theme: "tree",
        action: "welcome",
        actors: [0],
        label: "Самұрық",
      },
    ],
  },
  {
    id: "samruk",
    title: "Самұрықтың көмегі",
    frames: [
      {
        text: "Самұрық Төстікті қанатына мінгізіп, жер үстіне алып шығады.",
        theme: "sky",
        action: "fly",
        actors: [0],
      },
      {
        text: "Қоштасарда құс көмекке шақыратын бір қауырсынын береді.",
        theme: "sky",
        action: "prepare",
        actors: [0],
        symbols: ["Самұрықтың қауырсыны"],
      },
    ],
  },
  {
    id: "captivity",
    title: "Зынданнан шығу",
    frames: [
      {
        text: "Бекторының жұмсауымен Шойынқұлақ Төстікті тұтқындайды. Шалқұйрық көмекке келеді.",
        theme: "dungeon",
        action: "rescue",
        actors: [0],
        symbols: ["Бекторы", "Шойынқұлақ"],
      },
      {
        text: "Қауырсынды тұтатқанда Самұрық жетіп, Төстікті зынданнан шығарады.",
        theme: "dungeon",
        action: "fly",
        actors: [0],
        symbols: ["Самұрықтың қауырсыны"],
      },
    ],
  },
  {
    id: "shoyinqulaq",
    title: "Шойынқұлақтың құпиясы",
    frames: [
      {
        text: "Күңкенің көмегімен Төстік Шойынқұлақтың жасырын жаны туралы біледі.",
        theme: "spring",
        action: "secret",
        actors: [0],
        symbols: ["Күңке", "Борықты бұлақ"],
      },
      {
        text: "Еліктегі сандықтардың сырын ашып, Күңкемен бірге Шойынқұлақты жеңеді.",
        theme: "spring",
        action: "lift",
        actors: [0],
        symbols: ["Қырық елік", "Тоғыз сандық"],
      },
    ],
  },
  {
    id: "return",
    title: "Елге оралу",
    frames: [
      {
        text: "Төстік Шалқұйрықпен еліне қайтады. Кенжекей оны ұзақ күткен еді.",
        theme: "steppe",
        action: "walk",
        actors: [0],
        symbols: ["Кенжекей күткен ауыл"],
      },
      {
        text: "Екеуі қайта табысады. Ертегі жақсылық, ақыл мен достықтың жеңісімен аяқталады.",
        theme: "village",
        action: "home",
        actors: [0],
        symbols: ["Кенжекей", "Қайта табысу"],
      },
    ],
  },
];
