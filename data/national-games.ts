export type NationalKind = "asyk" | "tenge" | "arqan";
export const nationalGames = [
  {
    id: "asyk" as const,
    name: "Асық ату",
    subtitle: "Мергендік сынағы",
    description: "Асықтарды көздеп ат, қалғанын сана. Азайту мен салыстыруды үйрен.",
    symbol: "✧",
    xp: 40,
    coins: 15,
  },
  {
    id: "tenge" as const,
    name: "Теңге ілу",
    subtitle: "Ептілік пен жылдамдық",
    description: "Теңге жинап, жалпы соманы есепте. Көбейту мен уақытты байқауды үйрен.",
    symbol: "♞",
    xp: 40,
    coins: 15,
  },
  {
    id: "arqan" as const,
    name: "Арқан тартыс",
    subtitle: "Күш пен үйлесім",
    description: "Қолдарды кезектестіріп тарт. Реттілік, бірлік және әділ ойынды үйрен.",
    symbol: "↔",
    xp: 40,
    coins: 15,
  },
];
