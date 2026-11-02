import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { tostikEpisodes } from "../data/tostik";
import narration from "../data/tostik-audio.json";

test("every animated scene has a nonempty Kazakh AAC clip matching its caption", () => {
  assert.equal(narration.language, "kk-KZ");
  assert.equal(narration.voice, "kk-KZ-DauletNeural");
  const frames = tostikEpisodes.flatMap((episode) =>
    episode.frames.map((frame, index) => ({
      episode: episode.id,
      index,
      text: frame.text,
    })),
  );
  assert.equal(narration.clips.length, frames.length);
  for (const [index, frame] of frames.entries()) {
    const clip = narration.clips[index];
    assert.equal(clip.episode, frame.episode);
    assert.equal(clip.frame, frame.index);
    assert.equal(
      clip.hash,
      createHash("sha256")
        .update(`${narration.voice}:${narration.rate}:${frame.text}`)
        .digest("hex"),
    );
    assert.ok(clip.duration > 0.5 && clip.duration < 60);
    const media = readFileSync(resolve("public", clip.src.slice(1)));
    assert.ok(media.length > 1024);
    assert.equal(media.subarray(4, 8).toString(), "ftyp");
  }
});
