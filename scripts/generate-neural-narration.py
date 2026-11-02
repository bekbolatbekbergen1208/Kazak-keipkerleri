"""Generate both Kazakh narration collections with the Daulet neural voice.
Install scripts/requirements-neural.txt in a Python venv, then run this script from the repository root.
Original audio remains intact; manifests switch only after every clip succeeds.
"""
import asyncio
import hashlib
import json
from pathlib import Path
import re
import subprocess
import tempfile
import edge_tts

ROOT = Path(__file__).resolve().parent.parent
VOICE = "kk-KZ-DauletNeural"
RATE = "-8%"

async def main():
    episodes = json.loads(subprocess.check_output([
        "node", "--import", "tsx", "--input-type=module", "-e",
        'import { tostikEpisodes } from "./data/tostik.ts"; process.stdout.write(JSON.stringify(tostikEpisodes));',
    ], cwd=ROOT, text=True))
    full = json.loads((ROOT / "data/tostik-full.json").read_text())
    collections = [
        ("tostik", [(e["id"], i, f["text"]) for e in episodes for i, f in enumerate(e["frames"])]),
        ("tostik-full", [(f"section-{i+1:03}", 0, "\n\n".join(s["paragraphs"])) for i, s in enumerate(full["sections"])]),
    ]
    semaphore = asyncio.Semaphore(3)
    done = 0
    total = sum(len(items) for _, items in collections)
    async def generate(collection, episode, frame, text):
        nonlocal done
        folder = ROOT / "public/audio" / f"{collection}-daulet"
        folder.mkdir(parents=True, exist_ok=True)
        name = f"{episode}-{frame+1}.m4a"
        output = folder / name
        cache = folder / f"{name}.json"
        digest = hashlib.sha256(f"{VOICE}:{RATE}:{text}".encode()).hexdigest()
        async with semaphore:
            if cache.exists() and output.exists() and output.stat().st_size > 1024:
                clip = json.loads(cache.read_text())
                if clip.get("hash") == digest:
                    done += 1
                    print(f"{done}/{total} cached {name}", flush=True)
                    return clip
            for attempt in range(3):
                try:
                    with tempfile.TemporaryDirectory(prefix="qazaq-neural-") as work:
                        mp3 = Path(work) / "voice.mp3"
                        await edge_tts.Communicate(text, VOICE, rate=RATE).save(str(mp3))
                        converted = Path(work) / "voice.m4a"
                        await asyncio.to_thread(subprocess.run, ["afconvert", "-f", "m4af", "-d", "aac@44100", "-b", "96000", str(mp3), str(converted)], check=True, capture_output=True)
                        info = await asyncio.to_thread(subprocess.check_output, ["afinfo", str(converted)], text=True)
                        duration = float(re.search(r"estimated duration:\s*([\d.]+)", info).group(1))
                        if duration < .5 or converted.stat().st_size < 1024:
                            raise RuntimeError("Empty audio")
                        output.write_bytes(converted.read_bytes())
                        clip = {"episode": episode, "frame": frame, "src": f"/audio/{collection}-daulet/{name}", "duration": duration, "hash": digest}
                        cache.write_text(json.dumps(clip, ensure_ascii=False) + "\n")
                        done += 1
                        print(f"{done}/{total} {collection}/{name} {duration:.1f}s", flush=True)
                        return clip
                except Exception:
                    if attempt == 2:
                        raise
                    await asyncio.sleep(2 * (attempt + 1))
    manifests = []
    for collection, items in collections:
        clips = await asyncio.gather(*(generate(collection, *item) for item in items))
        manifests.append((collection, {"language": "kk-KZ", "voice": VOICE, "rate": RATE, "format": "audio/mp4", "clips": clips}))
    for collection, manifest in manifests:
        (ROOT / f"data/{collection}-audio.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(f"Ready: {total} neural Kazakh clips", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
