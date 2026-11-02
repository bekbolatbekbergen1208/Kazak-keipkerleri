import { tostikEpisodes } from "@/data/tostik";
import { chapters } from "@/data/adventure";
import { tales } from "@/data/tales";
import { heroes } from "@/data/content";
import type { Player } from "@/types/game";
export const today = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Aqtau" }).format(
    new Date(),
  );
export const freshPlayer = (): Player => ({
  name: "Жас қаһарман",
  avatar: 0,
  characterId: null,
  hair: "Қысқа",
  outfit: "Көк шапан",
  armor: "Жеңіл",
  headwear: "Дулыға",
  accessory: "Тұмар",
  equipment: "Садақ",
  xp: 0,
  coins: 0,
  stats: { strength: 20, wisdom: 20, courage: 20, agility: 20, eloquence: 20 },
  completed: [],
  nationalCompleted: [],
  learning: { completed: [], dailyDates: [] },
  adventure: { completed: [], readTales: [], favorites: [] },
  tostik: { seen: [], episode: 0, frame: 0 },
  missionProgress: {},
  unlocked: ["tostik"],
  achievements: [],
  riddles: 0,
  visits: [],
  daily: { date: today(), riddles: 0, missions: 0, learned: 0, claimed: [] },
});
export const levelFloor = (level: number) => 25 * (level - 1) * (level + 2);
export function levelFor(xp: number) {
  let level = 1;
  while (xp >= levelFloor(level + 1)) level++;
  return level;
}
export function reconcile(p: Player): Player {
  const unlocked = heroes.filter((h) => p.xp >= h.threshold).map((h) => h.id);
  const filmEpisode = Number.isInteger(p.tostik?.episode)
    ? Math.max(0, Math.min(tostikEpisodes.length - 1, p.tostik.episode))
    : 0;
  const filmFrame = Number.isInteger(p.tostik?.frame)
    ? Math.max(
        0,
        Math.min(tostikEpisodes[filmEpisode].frames.length - 1, p.tostik.frame),
      )
    : 0;
  const a = new Set(p.achievements);
  if (p.completed.length) a.add("first");
  if (p.riddles >= 10) a.add("riddle");
  if (unlocked.length >= 5) a.add("friends");
  if (p.visits.length >= 5) a.add("explorer");
  if (p.xp >= 1000) a.add("xp");
  if (p.completed.length >= 3) a.add("three");
  if (p.completed.length >= 6) a.add("six");
  return {
    ...p,
    nationalCompleted: p.nationalCompleted ?? [],
    characterId: heroes.some((h) => h.id === p.characterId)
      ? p.characterId
      : null,
    learning: p.learning ?? { completed: [], dailyDates: [] },
    tostik: {
      seen: tostikEpisodes
        .filter((e) => p.tostik?.seen?.includes(e.id))
        .map((e) => e.id),
      episode: filmEpisode,
      frame: filmFrame,
    },
    adventure: {
      completed: chapters
        .filter((c, i) =>
          chapters
            .slice(0, i + 1)
            .every((previous) => p.adventure?.completed?.includes(previous.id)),
        )
        .map((c) => c.id),
      readTales: tales
        .filter((t) => p.adventure?.readTales?.includes(t.id))
        .map((t) => t.id),
      favorites: tales
        .filter((t) => p.adventure?.favorites?.includes(t.id))
        .map((t) => t.id),
    },
    unlocked,
    achievements: [...a],
    daily:
      p.daily.date === today()
        ? p.daily
        : { date: today(), riddles: 0, missions: 0, learned: 0, claimed: [] },
  };
}
