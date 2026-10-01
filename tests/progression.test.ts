import assert from "node:assert/strict";
import { test } from "node:test";
import {
  freshPlayer,
  levelFor,
  levelFloor,
  reconcile,
} from "../lib/progression";
import {
  heroes,
  missions,
  achievements,
  dailyTemplates,
} from "../data/content";
test("progressive XP boundaries include level two at 100 and three at 250", () => {
  assert.equal(levelFor(99), 1);
  assert.equal(levelFor(100), 2);
  assert.equal(levelFor(249), 2);
  assert.equal(levelFor(250), 3);
  for (let i = 1; i < 100; i++) assert.equal(levelFor(levelFloor(i)), i);
});
test("first mission opens second hero and first achievement", () => {
  const p = reconcile({ ...freshPlayer(), xp: 100, completed: ["tostik-0"] });
  assert.deepEqual(p.unlocked, ["tostik", "alpamys"]);
  assert(p.achievements.includes("first"));
  assert.equal(levelFor(p.xp), 2);
});
test("late-game milestones reconcile without duplicate achievements", () => {
  const p = reconcile({
    ...freshPlayer(),
    xp: 1000,
    riddles: 10,
    completed: missions.slice(0, 6).map((m) => m.id),
    visits: [0, 1, 2, 3, 4],
  });
  assert.equal(p.unlocked.length, 6);
  assert.equal(p.achievements.length, 7);
  assert.deepEqual(reconcile(p), p);
});
test("a new day resets daily tasks while preserving permanent progress", () => {
  const p = freshPlayer();
  p.daily.date = "2020-01-01";
  p.daily.riddles = 9;
  p.daily.claimed = ["riddles"];
  p.xp = 100;
  const next = reconcile(p);
  assert.equal(next.daily.riddles, 0);
  assert.deepEqual(next.daily.claimed, []);
  assert.equal(next.xp, 100);
});
test("seed content meets minimums and mission references are valid", () => {
  assert.equal(heroes.length, 6);
  assert(missions.length >= 10);
  assert.equal(achievements.length, 8);
  assert.equal(dailyTemplates.length, 5);
  for (const m of missions) {
    assert(heroes.some((h) => h.id === m.heroId));
    assert.equal(m.stages.length, 3);
  }
  assert.equal(new Set(missions.map((m) => m.id)).size, missions.length);
});
