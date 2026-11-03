"use client";
import PlatformIcon from "./PlatformIcon";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  tostikAudio,
  tostikEpisodes,
  tostikSource,
  type TostikProgress,
} from "@/data/tostik";
import narration from "@/data/tostik-audio.json";
import StoryLearning from "./StoryLearning";
import TostikScene from "./TostikScene";
const frameCount = tostikEpisodes.reduce((sum, e) => sum + e.frames.length, 0);
export default function StoryAdventure({
  progress,
  onCheckpoint,
  onEpisodeComplete,
  onLibrary,
}: {
  progress: TostikProgress;
  onCheckpoint: (episode: number, frame: number) => void;
  onEpisodeComplete: (id: string) => void;
  onLibrary: () => void;
}) {
  const [episode, setEpisode] = useState(progress.episode);
  const [frame, setFrame] = useState(progress.frame);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(9000);
  const [replay, setReplay] = useState(0);
  const [finished, setFinished] = useState(false);
  const [shareUrl, setShareUrl] = useState("/ertostik");
  const [copyMessage, setCopyMessage] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState(0.8);
  const [voiceError, setVoiceError] = useState(false);
  const [voicePrefsLoaded, setVoicePrefsLoaded] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const delayedNext = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("qazaq-narration") ?? "null",
      );
      if (saved) {
        if (typeof saved.enabled === "boolean") setVoiceEnabled(saved.enabled);
        if (typeof saved.volume === "number" && Number.isFinite(saved.volume))
          setVoiceVolume(Math.max(0, Math.min(1, saved.volume)));
      }
    } catch {}
    setVoicePrefsLoaded(true);
  }, []);
  useEffect(() => {
    if (voicePrefsLoaded)
      localStorage.setItem(
        "qazaq-narration",
        JSON.stringify({ enabled: voiceEnabled, volume: voiceVolume }),
      );
  }, [voiceEnabled, voiceVolume, voicePrefsLoaded]);
  useEffect(() => {
    setShareUrl(new URL("/ertostik", window.location.href).href);
  }, []);
  const current = tostikEpisodes[episode];
  const shot = current.frames[frame];
  const position =
    tostikEpisodes
      .slice(0, episode)
      .reduce((sum, e) => sum + e.frames.length, 0) + frame;
  const clip = narration.clips[position];
  const voiceRate = speed === 12000 ? 0.85 : speed === 6000 ? 1.2 : 1;
  const sceneDuration =
    voiceEnabled && !voiceError
      ? clip.duration / voiceRate + 0.35
      : speed / 1000;
  function go(nextEpisode: number, nextFrame: number, play = playing) {
    setEpisode(nextEpisode);
    setFrame(nextFrame);
    setPlaying(play);
    setFinished(false);
    setReplay((n) => n + 1);
    onCheckpoint(nextEpisode, nextFrame);
  }
  function next() {
    if (frame + 1 < current.frames.length) {
      go(episode, frame + 1);
      return;
    }
    onEpisodeComplete(current.id);
    if (episode + 1 < tostikEpisodes.length) go(episode + 1, 0);
    else {
      setPlaying(false);
      setFinished(true);
      onCheckpoint(episode, frame);
    }
  }
  function previous() {
    if (frame > 0) go(episode, frame - 1);
    else if (episode > 0)
      go(episode - 1, tostikEpisodes[episode - 1].frames.length - 1);
  }
  useEffect(() => {
    if (!playing || (voiceEnabled && !voiceError)) return;
    const timer = setTimeout(next, speed);
    return () => clearTimeout(timer);
  }, [playing, episode, frame, speed, voiceEnabled, voiceError]);
  useEffect(() => {
    const element = audio.current;
    if (!element) return;
    element.pause();
    element.currentTime = 0;
    element.load();
    setVoiceError(false);
  }, [position, replay]);
  useEffect(() => {
    const element = audio.current;
    if (!element) return;
    element.volume = voiceVolume;
    element.playbackRate = voiceRate;
  }, [voiceVolume, voiceRate, position]);
  useEffect(() => {
    const element = audio.current;
    if (!element) return;
    let active = true;
    if (playing && voiceEnabled) {
      element.play().catch((error) => {
        if (active && error?.name !== "AbortError") setVoiceError(true);
      });
    } else element.pause();
    return () => {
      active = false;
    };
  }, [playing, voiceEnabled, position, replay]);
  useEffect(
    () => () => {
      if (delayedNext.current) clearTimeout(delayedNext.current);
    },
    [position, playing, voiceEnabled],
  );
  useEffect(() => {
    const element = audio.current;
    return () => {
      if (element) {
        element.pause();
      }
    };
  }, []);
  function narrationEnded() {
    if (!playing || !voiceEnabled || !audio.current?.ended) return;
    delayedNext.current = setTimeout(next, 350);
  }
  function startAudioFromGesture() {
    const element = audio.current;
    if (!element) return;
    element.play().catch((error) => {
      if (error?.name !== "AbortError") setVoiceError(true);
    });
  }
  function togglePlayback() {
    if (playing) {
      audio.current?.pause();
      setPlaying(false);
      return;
    }
    if (finished) {
      if (audio.current) audio.current.src = narration.clips[0].src;
      go(0, 0, true);
    } else setPlaying(true);
    if (voiceEnabled) startAudioFromGesture();
  }
  function toggleVoice() {
    setVoiceEnabled(!voiceEnabled);
    setVoiceError(false);
    if (!voiceEnabled && playing) startAudioFromGesture();
  }

  function seek(value: number) {
    let remaining = value;
    for (let i = 0; i < tostikEpisodes.length; i++) {
      if (remaining < tostikEpisodes[i].frames.length) {
        go(i, remaining, false);
        return;
      }
      remaining -= tostikEpisodes[i].frames.length;
    }
  }
  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error("clipboard");
      await navigator.clipboard.writeText(shareUrl);
      setCopyMessage("Сілтеме көшірілді. Досыңа жібере аласың.");
    } catch {
      setCopyMessage("Төмендегі сілтемені басып ұстап, көшіріп алуға болады.");
    }
  }
  return (
    <section className="content-section tostik-cinema">
      <div className="eyebrow">
        ҚАЗАҚ ХАЛЫҚ ЕРТЕГІСІ · {tostikEpisodes.length} ЭПИЗОД · {frameCount}{" "}
        КӨРІНІС
      </div>
      <div className="cinema-heading">
        <div>
          <h1 className="page-title">Ер Төстік: анимациялық ертегі</h1>
          <p>
            Төстіктің дүниеге келуінен еліне оралуына дейін. Оқиғаны ретімен көр
            немесе керек эпизодты таңда.
          </p>
        </div>
        <a className="outline-button" href="/ertostik/full">
          <BookOpen size={18} />
          ТОЛЫҚ ЕРТЕГІНІ ОҚУ
          <ExternalLink size={16} />
        </a>
      </div>
      <a className="full-tale-entry" href="/ertostik/full">
        <Volume2 size={24} />
        <span>
          <strong>Толық ертегіні оқы және тыңда</strong>
          <small>
            Қысқартусыз мәтін · қазақша дыбыстау · қалған жерден жалғастыру
          </small>
        </span>
        <ArrowRight size={20} />
      </a>
      <div className="cinema-player">
        <audio
          ref={audio}
          data-testid="tostik-narration"
          src={clip.src}
          preload="metadata"
          onEnded={narrationEnded}
          onError={() => setVoiceError(true)}
        />
        <div className="cinema-episode-heading">
          <span>
            Эпизод {episode + 1} / {tostikEpisodes.length}
          </span>
          <strong>{current.title}</strong>
          <span className="cinema-mode">
            {playing ? "Көрсетіліп жатыр" : "Кідіріс"}
          </span>
        </div>
        <TostikScene
          key={`${episode}-${frame}-${replay}`}
          frame={shot}
          episodeId={current.id}
          playing={playing}
          replay={replay}
          duration={sceneDuration}
        />
        <div className="cinema-caption" aria-live="polite">
          <span>
            {position + 1} / {frameCount}
          </span>
          <p>{shot.text}</p>
        </div>
        <div className="cinema-controls">
          <button
            className="cinema-skip"
            aria-label="Алдыңғы көрініс"
            onClick={previous}
            disabled={position === 0}
          >
            <ArrowLeft size={22} />
          </button>
          <button className="gold-button cinema-play" onClick={togglePlayback}>
            {playing ? <Pause size={20} /> : <Play size={20} />}{" "}
            {playing
              ? "ТОҚТАТА ТҰРУ"
              : finished
                ? "БАСЫНАН КӨРУ"
                : "КӨРУДІ ЖАЛҒАСТЫРУ"}
          </button>
          <button
            className="cinema-skip"
            aria-label="Келесі көрініс"
            onClick={next}
            disabled={finished}
          >
            <ArrowRight size={22} />
          </button>
          <button
            className="cinema-skip"
            aria-label="Көріністі қайталау"
            onClick={() => {
              if (voiceEnabled && audio.current) {
                audio.current.currentTime = 0;
                startAudioFromGesture();
              }
              setReplay((n) => n + 1);
              setPlaying(true);
              setFinished(false);
            }}
          >
            <RotateCcw size={20} />
          </button>
          <label className="cinema-speed">
            Көрсету қарқыны
            <select
              aria-label="Көрсету қарқыны"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            >
              <option value={12000}>Баяу</option>
              <option value={9000}>Қалыпты</option>
              <option value={6000}>Жылдамырақ</option>
            </select>
          </label>
        </div>
        <div className="cinema-narration-controls">
          <button
            className="outline-button"
            aria-pressed={voiceEnabled}
            onClick={toggleVoice}
          >
            {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}{" "}
            {voiceEnabled ? "ДАУЫС ҚОСУЛЫ" : "ДАУЫС ӨШІРУЛІ"}
          </button>
          <label>
            Дауыс деңгейі
            <input
              aria-label="Дауыс деңгейі"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={voiceVolume}
              onChange={(e) => setVoiceVolume(Number(e.target.value))}
            />
            <span>{Math.round(voiceVolume * 100)}%</span>
          </label>
          <span className="cinema-voice-note">
            {voiceError
              ? "Дыбыс ойнатылмады. Дауысты өшіріп-қосып байқап көр."
              : voiceEnabled
                ? "Daulet қазақша нейрондық дауысы · Мәтін аяқталғанда көрініс ауысады"
                : "Мәтінмен көру режимі"}
          </span>
        </div>
        <label className="cinema-seek">
          Көріністі таңдау
          <input
            type="range"
            aria-label="Ертегі көрінісі"
            min={0}
            max={frameCount - 1}
            value={position}
            onChange={(e) => seek(Number(e.target.value))}
          />
        </label>
      </div>
      {finished && (
        <div className="cinema-finale">
          <span aria-hidden="true">{<PlatformIcon name="trophy" />}</span>
          <h2>Ертегі аяқталды!</h2>
          <p>
            Ер Төстік жақындарына қайта оралды. Сен оның батылдық, адалдық және
            достыққа толы жолын көрдің.
          </p>
          <button className="gold-button" onClick={() => go(0, 0, true)}>
            БАСЫНАН КӨРУ <Play size={18} />
          </button>
          <button className="outline-button" onClick={onLibrary}>
            КІТАПХАНАҒА ӨТУ <ArrowRight size={18} />
          </button>
        </div>
      )}
      <div className="cinema-bottom-info">
        <span>
          <Check size={17} />
          Көрілгені: {progress.seen.length} / {tostikEpisodes.length} эпизод
        </span>
        <span>Қалған жерің автоматты сақталады.</span>
      </div>
      <StoryLearning
        episode={episode}
        onRead={() => {
          setPlaying(false);
          const transcript =
            document.querySelector<HTMLDetailsElement>(".cinema-transcript");
          if (transcript) {
            transcript.open = true;
            transcript.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
      />
      <div className="cinema-story-note">
        <strong>Ертегі нұсқасы туралы</strong>
        <p>
          Оқиғалар кітапханадағы «Ер Төстік» нұсқасының ретімен берілді.
          Балаларға арналған қысқаша баяндау: күрделі тұстар жұмсартылған,
          қантөгіс көрсетілмейді. Бұл сөзбе-сөз толық мәтін емес. Епті, Қырағы,
          Кенжекей, Күңке, Шалқұйрық және басқа кейіпкерлердің оқиғадағы орны
          сақталған. Презентациядағы Сұңқаркөз мұнда Қырағы ретінде көрсетіледі.
        </p>
        <a href={tostikSource.url} target="_blank" rel="noreferrer">
          Кітапханадағы толық мәтін ↗
        </a>
        <a href={tostikAudio} target="_blank" rel="noreferrer">
          Kitap.kz сайтындағы аудионұсқа ↗
        </a>
      </div>
      <div className="cinema-episodes-heading">
        <h2>Ертегінің барлық эпизоды</h2>
        <p>
          Оқиғаны көру үшін ойын өту міндетті емес. Кез келген эпизодқа еркін
          ауыса аласың.
        </p>
      </div>
      <div className="cinema-episode-list">
        {tostikEpisodes.map((item, i) => (
          <button
            key={item.id}
            className={episode === i ? "active" : ""}
            aria-current={episode === i ? "step" : undefined}
            onClick={() => {
              if (voiceEnabled && audio.current) {
                const target = narration.clips.find(
                  (clip) => clip.episode === item.id && clip.frame === 0,
                );
                if (target) audio.current.src = target.src;
                startAudioFromGesture();
              }
              go(i, 0, true);
              document
                .querySelector(".cinema-player")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            <strong>{item.title}</strong>
            {progress.seen.includes(item.id) ? (
              <Check size={18} />
            ) : (
              <Play size={16} />
            )}
          </button>
        ))}
      </div>
      <details className="cinema-transcript">
        <summary>Анимациядағы мәтіндерді оқу</summary>
        {tostikEpisodes.map((item, i) => (
          <article key={item.id}>
            <h3>
              {i + 1}. {item.title}
            </h3>
            {item.frames.map((f, j) => (
              <p key={j}>{f.text}</p>
            ))}
          </article>
        ))}
      </details>
      <div className="cinema-share">
        <div>
          <h2>Осы ертегінің сілтемесі</h2>
          <a href={shareUrl}>{shareUrl}</a>
          <p role="status">
            {copyMessage ||
              "Осы беттің сілтемесін досыңа немесе мұғаліміңе жібер."}
          </p>
        </div>
        <button className="outline-button" onClick={copy}>
          <Copy size={18} />
          СІЛТЕМЕНІ КӨШІРУ
        </button>
      </div>
    </section>
  );
}
