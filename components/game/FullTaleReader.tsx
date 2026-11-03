"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Pause,
  Play,
  RotateCcw,
  Volume2,
} from "lucide-react";
import tale from "@/data/tostik-full.json";
import narration from "@/data/tostik-full-audio.json";
const storageKey = "qazaq-full-tostik-reader";
function time(seconds: number) {
  const value = Math.max(0, Math.floor(seconds));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}
export default function FullTaleReader() {
  const [section, setSection] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [font, setFont] = useState(21);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const resume = useRef(0);
  const clip = narration.clips[section];
  const total = narration.clips.reduce((n, c) => n + c.duration, 0);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (
        saved &&
        Number.isInteger(saved.section) &&
        saved.section >= 0 &&
        saved.section < tale.sections.length
      ) {
        setSection(saved.section);
        resume.current =
          saved.voice === narration.voice &&
          typeof saved.elapsed === "number" &&
          Number.isFinite(saved.elapsed)
            ? Math.max(0, saved.elapsed)
            : 0;
        if ([0.8, 1, 1.2].includes(saved.rate)) setRate(saved.rate);
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      localStorage.setItem(
        storageKey,
        JSON.stringify({ section, elapsed, rate, voice: narration.voice }),
      );
  }, [section, elapsed, rate, ready]);
  useEffect(() => {
    const media = audio.current;
    if (!media) return;
    media.playbackRate = rate;
    if (playing) {
      media.play().catch((e) => {
        if (e.name !== "AbortError") {
          setPlaying(false);
          setError("Дыбысты бастау үшін «Дауыстап оқу» батырмасын қайта бас.");
        }
      });
    } else media.pause();
  }, [playing, section, rate, ready]);
  useEffect(() => {
    const media = audio.current;
    return () => {
      media?.pause();
    };
  }, []);
  function go(index: number) {
    resume.current = 0;
    setElapsed(0);
    setError("");
    setSection(index);
    document
      .getElementById(`tale-section-${index}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function toggle() {
    if (playing) {
      audio.current?.pause();
      setPlaying(false);
      return;
    }
    setError("");
    setPlaying(true);
    audio.current?.play().catch((e) => {
      if (e.name !== "AbortError") {
        setPlaying(false);
        setError("Аудионы ойнату мүмкін болмады. Қайта байқап көр.");
      }
    });
  }
  return (
    <main className="full-tale-page">
      <nav className="full-tale-nav">
        <a href="/ertostik">
          <ArrowLeft size={18} /> Анимациялық ертегіге оралу
        </a>
        <a href={tale.source} target="_blank" rel="noreferrer">
          <ExternalLink size={16} /> Дереккөз
        </a>
      </nav>
      <div className="full-tale-heading">
        <span className="eyebrow">ҚАЗАҚ ХАЛЫҚ ЕРТЕГІСІ · ТОЛЫҚ НҰСҚА</span>
        <h1>Ер Төстік</h1>
        <p>{tale.note}</p>
        <p>
          <Volume2 size={17} /> Қазақша Daulet нейрондық дауысы · {time(total)}{" "}
          · {tale.sections.length} оқу бөлігі
        </p>
      </div>
      <section
        className="full-tale-player"
        aria-label="Толық ертегіні дыбыстау"
      >
        <audio
          ref={audio}
          src={ready ? clip.src : undefined}
          preload="metadata"
          onLoadedMetadata={() => {
            if (audio.current) {
              if (resume.current > 0)
                audio.current.currentTime = Math.min(
                  resume.current,
                  clip.duration,
                );
              audio.current.playbackRate = rate;
              setElapsed(audio.current.currentTime);
              resume.current = 0;
            }
          }}
          onTimeUpdate={() => {
            if (audio.current) setElapsed(audio.current.currentTime);
          }}
          onEnded={() => {
            if (section < tale.sections.length - 1) go(section + 1);
            else {
              setPlaying(false);
              setError("Ертегі толық оқылып бітті!");
            }
          }}
          onError={() => {
            if (ready) {
              setPlaying(false);
              setError(
                "Аудио жүктелмеді. Интернетті тексеріп, қайта байқап көр.",
              );
            }
          }}
        />
        <div className="full-audio-buttons">
          <button className="gold-button" onClick={toggle} disabled={!ready}>
            {playing ? <Pause size={19} /> : <Play size={19} />}
            {playing ? "КІДІРТУ" : "ДАУЫСТАП ОҚУ"}
          </button>
          <button
            className="outline-button"
            aria-label="Толық ертегіні басынан оқу"
            onClick={() => {
              if (section === 0 && audio.current) {
                audio.current.currentTime = 0;
                setElapsed(0);
              }
              go(0);
            }}
          >
            <RotateCcw size={18} />
          </button>
          <label>
            Жылдамдық
            <select
              aria-label="Толық ертегіні оқу жылдамдығы"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            >
              <option value={0.8}>Баяу · 0.8×</option>
              <option value={1}>Қалыпты · 1×</option>
              <option value={1.2}>Жылдам · 1.2×</option>
            </select>
          </label>
        </div>
        <label className="full-tale-seek">
          {section + 1}-бөлік · {time(elapsed)} / {time(clip.duration)}
          <input
            type="range"
            aria-label="Оқу бөлігінің уақыты"
            min={0}
            max={clip.duration}
            step={0.1}
            value={Math.min(elapsed, clip.duration)}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (audio.current) audio.current.currentTime = n;
              setElapsed(n);
            }}
          />
        </label>
        <p role="status">
          {error ||
            (playing
              ? "Тыңдап отырып, төмендегі мәтінді бірге оқы. Бөліктер автоматты жалғасады."
              : "Қалаған бөліктен тыңда. Қалған жерің осы құрылғыда сақталады.")}
        </p>
      </section>
      <div className="full-reader-toolbar">
        <label>
          <BookOpen size={18} /> Оқу бөлігі
          <select
            aria-label="Ертегінің оқу бөлігін таңдау"
            value={section}
            onChange={(e) => go(Number(e.target.value))}
          >
            {tale.sections.map((item, i) => (
              <option key={i} value={i}>
                {i + 1}. {item.paragraphs[0].slice(0, 55)}…
              </option>
            ))}
          </select>
        </label>
        <div>
          <button
            aria-label="Толық мәтінді кішірейту"
            disabled={font <= 18}
            onClick={() => setFont(font - 1)}
          >
            А−
          </button>
          <button
            aria-label="Толық мәтінді үлкейту"
            disabled={font >= 28}
            onClick={() => setFont(font + 1)}
          >
            А+
          </button>
        </div>
      </div>
      <article
        className="full-tale-text full-continuous-text"
        style={{ fontSize: font }}
        aria-label="Ертегінің толық мәтіні"
      >
        <div className="full-reading-caption">
          <strong>Ертегінің толық мәтіні</strong>
          <a href="/texts/er-tostik.txt" download="Ер Төстік.txt">
            Мәтінді жүктеу
          </a>
          <span>Қысқартусыз · басынан аяғына дейін</span>
        </div>
        {tale.sections.map((item, index) => (
          <section
            key={index}
            id={`tale-section-${index}`}
            className={section === index ? "active-reading-section" : ""}
            aria-label={`${index + 1}-оқу бөлігі`}
          >
            <div className="full-section-label">
              <span>
                {index + 1} / {tale.sections.length}
              </span>
              <button
                className="text-button"
                onClick={() => {
                  go(index);
                  setPlaying(true);
                }}
              >
                Осы жерден тыңдау <Play size={14} />
              </button>
            </div>
            {item.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </section>
        ))}
      </article>
      <div className="full-reader-pages">
        <button
          className="outline-button"
          disabled={section === 0}
          onClick={() => go(section - 1)}
        >
          <ArrowLeft size={18} /> Алдыңғы бөлік
        </button>
        <span>
          {section + 1} / {tale.sections.length}
        </span>
        <button
          className="outline-button"
          disabled={section === tale.sections.length - 1}
          onClick={() => go(section + 1)}
        >
          Келесі бөлік <ArrowRight size={18} />
        </button>
      </div>
    </main>
  );
}
