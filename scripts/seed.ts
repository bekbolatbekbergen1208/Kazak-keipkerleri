import { writeFileSync } from "node:fs";
import {
  heroes,
  missions,
  achievements,
  dailyTemplates,
} from "../data/content";
const quote = (v: unknown) =>
  v === null
    ? "null"
    : `'${(typeof v === "object" ? JSON.stringify(v) : String(v)).replaceAll("'", "''")}'`;
const insert = (table: string, columns: string[], rows: unknown[][]) =>
  `insert into public.${table} (${columns.join(",")}) values\n${rows.map((row) => `(${row.map(quote).join(",")})`).join(",\n")}\non conflict do nothing;\n`;
const sql =
  insert(
    "heroes",
    [
      "id",
      "slug",
      "name",
      "category",
      "description",
      "portrait",
      "stats",
      "abilities",
      "unlock_requirement",
    ],
    heroes.map((h) => [
      h.id,
      h.id,
      h.name,
      h.category,
      h.description,
      h.portrait,
      h.stats,
      [h.ability],
      h.threshold,
    ]),
  ) +
  insert(
    "missions",
    [
      "id",
      "hero_id",
      "title",
      "description",
      "stages",
      "reward_xp",
      "reward_coins",
    ],
    missions.map((m) => [
      m.id,
      m.heroId,
      m.title,
      m.description,
      m.stages,
      m.xp,
      m.coins,
    ]),
  ) +
  insert(
    "achievements",
    ["id", "name", "description"],
    achievements.map((a) => [a.id, a.name, a.detail]),
  ) +
  insert(
    "daily_quests",
    ["id", "title", "target", "reward_xp", "reward_coins"],
    dailyTemplates.map((q) => [q.id, q.title, q.target, q.xp, q.coins]),
  );
writeFileSync("supabase/migrations/002_content.sql", sql);
