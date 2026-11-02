import { tostikEpisodes } from "@/data/tostik";
import type { Player } from "@/types/game";
export function completeTostikEpisode(player: Player, id: string): Player {
  if (
    !tostikEpisodes.some((e) => e.id === id) ||
    player.tostik.seen.includes(id)
  )
    return player;
  const seen = [...player.tostik.seen, id];
  return {
    ...player,
    xp: player.xp + 20 + (seen.length === tostikEpisodes.length ? 100 : 0),
    tostik: { ...player.tostik, seen },
  };
}
