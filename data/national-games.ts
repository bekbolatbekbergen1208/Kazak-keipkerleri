export type NationalKind = "asyk" | "tenge" | "arqan";
export const nationalGames = [
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
  {
    id: "arqan" as const,
    name: "Арқан тартыс",
    subtitle: "Күш пен үйлесім",
    description: "Екі қолды кезектестіріп, арқанды өз мәре сызығыңа тарт.",
    symbol: "↔",
    xp: 40,
    coins: 15,
  },
];
