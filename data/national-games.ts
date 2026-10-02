export type NationalKind = "togyz" | "asyk" | "tenge";
export const nationalGames = [
  {
    id: "togyz" as const,
    name: "Тоғызқұмалақ",
    subtitle: "Ақыл мен стратегия",
    description: "18 отау, 162 құмалақ. Қазаныңа көбірек құмалақ жина.",
    symbol: "◉",
    xp: 60,
    coins: 20,
  },
  {
    id: "asyk" as const,
    name: "Асық ату",
    subtitle: "Мергендік сынағы",
    description: "Сақаңды дәл бағыттап, шеңбердегі асықтарды шығар.",
    symbol: "✧",
    xp: 40,
    coins: 15,
  },
  {
    id: "tenge" as const,
    name: "Теңге ілу",
    subtitle: "Ептілік пен жылдамдық",
    description: "Ат үстінен еңкейіп, жолдағы бес теңгені іліп ал.",
    symbol: "♞",
    xp: 40,
    coins: 15,
  },
];
