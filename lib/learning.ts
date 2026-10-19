import { dailyActivity, type LearningKind } from "@/data/learning";
import type { Player } from "@/types/game";

export function completeLearning(
  player: Player,
  kind: LearningKind,
  date: string,
): Player {
  const learning = player.learning ?? { completed: [], dailyDates: [] };
  const first = !learning.completed.includes(kind);
  const daily =
    dailyActivity(date) === kind && !learning.dailyDates.includes(date);
  if (!first && !daily) return player;
  return {
    ...player,
    xp: player.xp + (first ? 40 : 0) + (daily ? 20 : 0),
    coins: player.coins + (first ? 10 : 0),
    learning: {
      completed: first ? [...learning.completed, kind] : learning.completed,
      dailyDates: daily
        ? [...learning.dailyDates, date].slice(-90)
        : learning.dailyDates,
    },
  };
}
