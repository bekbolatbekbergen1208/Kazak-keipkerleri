import { freshPlayer, reconcile } from "../progression";
import type { Player } from "../../types/game";
import { AccountError } from "./accounts";
export function gameState(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new AccountError("Профиль жарамсыз.");
  const source = input as Record<string, unknown>;
  const state = freshPlayer();
  for (const key of Object.keys(state) as (keyof Player)[]) {
    const value = source[key];
    const original = state[key];
    if (typeof original === "string" && typeof value === "string")
      Object.assign(state, { [key]: value.slice(0, 100) });
    else if (
      typeof original === "number" &&
      typeof value === "number" &&
      Number.isFinite(value)
    )
      Object.assign(state, {
        [key]: Math.min(1_000_000, Math.max(0, Math.floor(value))),
      });
    else if (Array.isArray(original) && Array.isArray(value))
      Object.assign(state, {
        [key]: value
          .filter((v) => typeof v === "string" || typeof v === "number")
          .slice(0, 200),
      });
  }
  if (typeof source.characterId === "string")
    state.characterId = source.characterId;
  const obj = (value: unknown): Record<string, unknown> =>
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const list = (value: unknown) =>
    Array.isArray(value)
      ? value.filter((v) => typeof v === "string").slice(0, 100)
      : [];
  const stats = obj(source.stats);
  for (const key of Object.keys(state.stats) as (keyof Player["stats"])[])
    if (typeof stats[key] === "number")
      state.stats[key] = Math.min(100, Math.max(0, Number(stats[key]) || 0));
  const learning = obj(source.learning);
  state.learning = {
    completed: list(learning.completed).filter((v) =>
      ["story", "heroes", "proverbs"].includes(v),
    ) as Player["learning"]["completed"],
    dailyDates: list(learning.dailyDates),
  };
  const adventure = obj(source.adventure);
  state.adventure = {
    completed: list(adventure.completed),
    readTales: list(adventure.readTales),
    favorites: list(adventure.favorites),
  };
  const film = obj(source.tostik);
  state.tostik = {
    seen: list(film.seen),
    episode: Number.isInteger(film.episode) ? Number(film.episode) : 0,
    frame: Number.isInteger(film.frame) ? Number(film.frame) : 0,
  };
  const missions = obj(source.missionProgress);
  state.missionProgress = Object.fromEntries(
    Object.entries(missions)
      .filter(
        ([key, value]) =>
          key.length < 80 &&
          Number.isInteger(value) &&
          Number(value) >= 0 &&
          Number(value) <= 3,
      )
      .slice(0, 100)
      .map(([key, value]) => [key, Number(value)]),
  );
  state.name =
    String(source.name ?? state.name)
      .trim()
      .slice(0, 24) || state.name;
  state.avatar = Math.min(5, state.avatar);
  return reconcile(state);
}
