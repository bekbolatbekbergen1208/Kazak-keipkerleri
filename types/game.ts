export type Stats = {
  strength: number;
  wisdom: number;
  courage: number;
  agility: number;
  eloquence: number;
};
export type GameKind =
  "riddle" | "path" | "memory" | "choice" | "horse" | "battle";
export type Hero = {
  id: string;
  name: string;
  category: string;
  portrait: string;
  description: string;
  ability: string;
  rarity: string;
  color: string;
  stats: Stats;
  threshold: number;
};
export type Mission = {
  id: string;
  heroId: string;
  title: string;
  description: string;
  stages: GameKind[];
  xp: number;
  coins: number;
};
export type Player = {
  name: string;
  avatar: number;
  hair: string;
  outfit: string;
  armor: string;
  headwear: string;
  accessory: string;
  equipment: string;
  xp: number;
  coins: number;
  stats: Stats;
  completed: string[];
  missionProgress: Record<string, number>;
  unlocked: string[];
  achievements: string[];
  riddles: number;
  visits: number[];
  daily: {
    date: string;
    riddles: number;
    missions: number;
    learned: number;
    claimed: string[];
  };
};
