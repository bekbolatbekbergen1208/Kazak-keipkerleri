import assert from "node:assert/strict";
import { test } from "node:test";
import { completeLearning } from "../lib/learning";
import { dailyActivity } from "../data/learning";
import { freshPlayer, reconcile } from "../lib/progression";

test("learning badge and daily bonus can each be earned only once", () => {
  const date = "2026-10-19";
  const kind = dailyActivity(date);
  const result = completeLearning(freshPlayer(), kind, date);
  assert.equal(result.xp, 60);
  assert.equal(result.coins, 10);
  assert.deepEqual(result.learning.completed, [kind]);
  assert.deepEqual(result.learning.dailyDates, [date]);
  assert.deepEqual(completeLearning(result, kind, date), result);
  const next = completeLearning(result, kind, "2026-10-22");
  assert.equal(next.xp, 80);
  assert.equal(next.coins, 10);
  assert.equal(next.learning.completed.length, 1);
});
test("all three activities award three distinct badges", () => {
  const date = "2026-10-19";
  let player = freshPlayer();
  for (const kind of ["story", "heroes", "proverbs"] as const)
    player = completeLearning(player, kind, date);
  assert.equal(player.xp, 140);
  assert.equal(player.coins, 30);
  assert.equal(player.learning.completed.length, 3);
});
test("old saves receive empty learning progress without losing earned XP", () => {
  const old = { ...freshPlayer(), xp: 250 };
  delete (old as Partial<typeof old>).learning;
  const player = reconcile(old);
  assert.equal(player.xp, 250);
  assert.deepEqual(player.learning, { completed: [], dailyDates: [] });
});
