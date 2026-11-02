import assert from "node:assert/strict";
import { test } from "node:test";
import { tostikEpisodes } from "../data/tostik";
import { completeTostikEpisode } from "../lib/tostik";
import { freshPlayer, reconcile } from "../lib/progression";

test("all traditional story arcs run from birth to return, with 36 distinct shots", () => {
  assert.equal(tostikEpisodes.length, 18);
  assert.equal(
    tostikEpisodes.reduce((n, e) => n + e.frames.length, 0),
    36,
  );
  assert.equal(tostikEpisodes[0].id, "birth");
  assert.equal(tostikEpisodes.at(-1)?.id, "return");
  for (const id of [
    "kenzhekei",
    "sorqudyq",
    "underground",
    "bapy",
    "companions",
    "contests",
    "cauldron",
    "iron-palace",
    "nest",
    "samruk",
    "captivity",
    "shoyinqulaq",
  ])
    assert.ok(tostikEpisodes.some((e) => e.id === id));
});
test("seen episode rewards and full-film bonus are granted only once", () => {
  let player = freshPlayer();
  for (const e of tostikEpisodes) {
    player = completeTostikEpisode(player, e.id);
    assert.equal(completeTostikEpisode(player, e.id), player);
  }
  assert.equal(player.xp, 460);
  assert.equal(player.tostik.seen.length, 18);
  assert.equal(completeTostikEpisode(player, "unknown"), player);
});
test("old saves start the actual tale afresh and invalid film bookmarks are normalized", () => {
  const old = { ...freshPlayer(), xp: 580 };
  delete (old as Partial<typeof old>).tostik;
  assert.deepEqual(reconcile(old).tostik, { seen: [], episode: 0, frame: 0 });
  assert.equal(reconcile(old).xp, 580);
  const bad = {
    ...freshPlayer(),
    tostik: { seen: ["birth", "bad", "birth"], episode: 999, frame: 999 },
  };
  assert.deepEqual(reconcile(bad).tostik, {
    seen: ["birth"],
    episode: 17,
    frame: 1,
  });
});
