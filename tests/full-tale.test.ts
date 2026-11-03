import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, statSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import tale from "../data/tostik-full.json";
import narration from "../data/tostik-full-audio.json";
test("full folk tale includes the beginning, ending and all audio sections", () => {
  assert.ok(tale.sections[0].paragraphs[0].startsWith("Ерте заманда Ерназар"));
  assert.ok(
    tale.sections.at(-1)!.paragraphs.at(-1)!.endsWith("мақсаттарына жетеді."),
  );
  const words = tale.sections
    .flatMap((s) => s.paragraphs)
    .join(" ")
    .split(/\s+/).length;
  assert.ok(words > 5800);
  assert.equal(narration.clips.length, tale.sections.length);
  assert.equal(narration.voice, "kk-KZ-DauletNeural");
  for (const [i, section] of tale.sections.entries()) {
    const clip = narration.clips[i];
    assert.equal(
      clip.hash,
      createHash("sha256")
        .update(
          `${narration.voice}:${narration.rate}:${section.paragraphs.join("\n\n")}`,
        )
        .digest("hex"),
    );
    assert.ok(existsSync(`public${clip.src}`));
    assert.ok(statSync(`public${clip.src}`).size > 1024);
    assert.ok(clip.duration > 1);
  }
});

test("reader contains the exact complete submitted story", () => {
  const supplied = readFileSync("public/texts/er-tostik.txt", "utf8");
  const body = supplied
    .slice(supplied.indexOf("Ерте заманда"))
    .trim()
    .replace(/\s+/g, " ");
  assert.equal(
    tale.sections
      .flatMap((s) => s.paragraphs)
      .join(" ")
      .replace(/\s+/g, " "),
    body,
  );
});
