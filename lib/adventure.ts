import { chapters } from "@/data/adventure";
import { tales } from "@/data/tales";
import type { Player } from "@/types/game";
export function completeChapter(player: Player, id: string): Player {
  const index = chapters.findIndex((c) => c.id === id);
  const progress = player.adventure ?? {
    completed: [],
    readTales: [],
    favorites: [],
  };
  if (
    index < 0 ||
    progress.completed.includes(id) ||
    (index > 0 && !progress.completed.includes(chapters[index - 1].id))
  )
    return player;
  const completed = [...progress.completed, id];
  const finale = completed.length === chapters.length;
  return {
    ...player,
    xp: player.xp + 80 + (finale ? 100 : 0),
    coins: player.coins + 20,
    adventure: { ...progress, completed },
  };
}
export function finishTale(player: Player, id: string): Player {
  const progress = player.adventure ?? {
    completed: [],
    readTales: [],
    favorites: [],
  };
  if (!tales.some((t) => t.id === id) || progress.readTales.includes(id))
    return player;
  return {
    ...player,
    xp: player.xp + 15,
    adventure: { ...progress, readTales: [...progress.readTales, id] },
  };
}
