import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import fullText from "../data/tostik-full.json";
const tostikEpisodes = fullText.sections.map((section, i) => ({
  id: `section-${String(i + 1).padStart(3, "0")}`,
  frames: [{ text: section.paragraphs.join("\n\n") }],
}));

// Offline Kazakh narration. Regenerate only when source text or voice settings change.
const voice = "Aru";
const rate = 145;
const root = resolve("public/audio/tostik-full");
const manifestPath = resolve("data/tostik-full-audio.json");
const old = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, "utf8"))
  : { clips: [] };
const work = mkdtempSync(join(tmpdir(), "tostik-narration-"));
mkdirSync(root, { recursive: true });
const clips: {
  episode: string;
  frame: number;
  src: string;
  duration: number;
  hash: string;
}[] = [];
try {
  for (const episode of tostikEpisodes)
    for (const [frame, scene] of episode.frames.entries()) {
      const hash = createHash("sha256")
        .update(`${voice}:${rate}:${scene.text}`)
        .digest("hex");
      const name = `${episode.id}-${frame + 1}.m4a`;
      const output = join(root, name);
      const cached = old.clips.find(
        (clip: { hash: string; src: string }) =>
          clip.hash === hash && clip.src.endsWith(name),
      );
      if (cached && existsSync(output) && statSync(output).size > 1024) {
        clips.push(cached);
        continue;
      }
      const text = join(work, "text.txt");
      const aiff = join(work, "voice.aiff");
      writeFileSync(text, scene.text, "utf8");
      execFileSync(
        "say",
        ["-v", voice, "-r", String(rate), "-f", text, "-o", aiff],
        { stdio: "pipe" },
      );
      execFileSync(
        "afconvert",
        ["-f", "m4af", "-d", "aac@44100", "-b", "64000", aiff, output],
        { stdio: "pipe" },
      );
      const info = execFileSync("afinfo", [output], { encoding: "utf8" });
      const duration = Number(/estimated duration:\s*([\d.]+)/.exec(info)?.[1]);
      if (
        !Number.isFinite(duration) ||
        duration < 0.5 ||
        statSync(output).size < 1024
      )
        throw new Error(`Empty narration: ${name}`);
      clips.push({
        episode: episode.id,
        frame,
        src: `/audio/tostik-full/${name}`,
        duration,
        hash,
      });
      process.stdout.write(
        `${clips.length}/${tostikEpisodes.length} ${name} ${duration.toFixed(1)}s\n`,
      );
    }
  writeFileSync(
    manifestPath,
    JSON.stringify(
      { language: "kk-KZ", voice, rate, format: "audio/mp4", clips },
      null,
      2,
    ) + "\n",
  );
  process.stdout.write(`Ready: ${clips.length} Kazakh narration clips\n`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
