import assert from "node:assert/strict";
import { test } from "node:test";
import { chapters } from "../data/adventure";
import { completeChapter, finishTale } from "../lib/adventure";
import { freshPlayer, reconcile } from "../lib/progression";

test("chapters unlock sequentially and award their reward only once", () => {
  let player = freshPlayer();
  assert.equal(completeChapter(player, chapters[1].id), player);
  for (const chapter of chapters) {
    player = completeChapter(player, chapter.id);
    assert.equal(completeChapter(player, chapter.id), player);
  }
  assert.equal(player.xp, 580);
  assert.equal(player.coins, 120);
  assert.equal(player.adventure.completed.length, 6);
});
test("reading a known tale awards 15 XP once and preserves all other progress", () => {
  const player = completeChapter(freshPlayer(), chapters[0].id);
  const read = finishTale(player, "er-tostik");
  assert.equal(read.xp, 95);
  assert.deepEqual(read.adventure.completed, ["gate"]);
  assert.equal(finishTale(read, "er-tostik"), read);
  assert.equal(finishTale(read, "unknown"), read);
});
test("legacy saves receive adventure defaults and malformed chapter gaps are removed", () => {
  const old = { ...freshPlayer(), xp: 300 };
  delete (old as Partial<typeof old>).adventure;
  assert.deepEqual(reconcile(old).adventure, {
    completed: [],
    readTales: [],
    favorites: [],
  });
  const bad = {
    ...freshPlayer(),
    adventure: {
      completed: ["gate", "sky", "bad"],
      readTales: ["er-tostik", "bad", "er-tostik"],
      favorites: ["bad", "honest-promise"],
    },
  };
  assert.deepEqual(reconcile(bad).adventure, {
    completed: ["gate"],
    readTales: ["er-tostik"],
    favorites: ["honest-promise"],
  });
});
