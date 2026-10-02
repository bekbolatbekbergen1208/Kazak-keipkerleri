"use client";
import { useState } from "react";
import { RotateCcw, Trophy } from "lucide-react";
const targets = [
  { x: 29, y: 37 },
  { x: 43, y: 31 },
  { x: 59, y: 38 },
  { x: 37, y: 53 },
  { x: 55, y: 55 },
];
export default function AsykAtu({ onComplete }: { onComplete: () => void }) {
  const [aim, setAim] = useState(50);
  const [force, setForce] = useState(60);
  const [hits, setHits] = useState<number[]>([]);
  const [throws, setThrows] = useState(0);
  const [message, setMessage] = useState("Сақаңды асыққа бағытта.");
  const [shot, setShot] = useState<{ x: number; y: number } | null>(null);
  const [flying, setFlying] = useState(false);
  function shoot() {
    if (flying) return;
    const y = 85 - force * 0.65;
    setShot({ x: aim, y });
    setFlying(true);
    setThrows((n) => n + 1);
    setTimeout(() => {
      const hit = targets.findIndex(
        (t, i) => !hits.includes(i) && Math.hypot(t.x - aim, t.y - y) < 9,
      );
      if (hit >= 0) {
        setHits((h) => [...h, hit]);
        setMessage("ДӘЛ ТИДІ! Асық шеңберден шықты.");
      } else setMessage("Сәл мүлт кетті. Бағыт пен күшті өзгерт.");
      setFlying(false);
    }, 450);
  }
  return (
    <div className="national-game">
      <div className="game-type">✧ МЕРГЕНДІК СЫНАҚ</div>
      <h2>Асық ату</h2>
      <p>
        Бес асықты шеңберден шығар. Бағыт пен лақтыру күшін таңда, содан кейін
        сақаны ат. Бұл — асық атудың жеңілдетілген цифрлық нұсқасы.
      </p>
      <div className="asyk-field">
        <div className="asyk-ring" />
        {targets.map((t, i) => (
          <span
            key={i}
            className={`asyk-bone ${hits.includes(i) ? "hit" : ""}`}
            style={{ left: `${t.x}%`, top: `${t.y}%` }}
          >
            ◈
          </span>
        ))}
        <span
          className="asyk-aim"
          style={{ left: `${aim}%`, top: `${85 - force * 0.65}%` }}
        >
          ＋
        </span>
        <span
          key={throws}
          className={`saka ${flying ? "flying" : ""}`}
          style={{ left: `${shot?.x ?? 50}%`, top: `${shot?.y ?? 85}%` }}
        >
          ◈
        </span>
        <span className="field-score">
          {hits.length} / 5 асық · {throws} лақтыру
        </span>
      </div>
      <div className="aim-controls">
        <label>
          Бағыт: {aim}%
          <input
            aria-label="Сақа бағыты"
            type="range"
            min="15"
            max="85"
            value={aim}
            onChange={(e) => setAim(Number(e.target.value))}
            disabled={flying}
          />
        </label>
        <label>
          Күш: {force}%
          <input
            aria-label="Лақтыру күші"
            type="range"
            min="25"
            max="95"
            value={force}
            onChange={(e) => setForce(Number(e.target.value))}
            disabled={flying}
          />
        </label>
      </div>
      <p className="feedback" role="status">
        {message}
      </p>
      {hits.length < 5 ? (
        <button className="gold-button" onClick={shoot} disabled={flying}>
          САҚАНЫ АТУ
        </button>
      ) : (
        <button className="gold-button" onClick={onComplete}>
          СЫЙЛЫҚТЫ АЛУ <Trophy size={16} />
        </button>
      )}
      <button
        className="text-button"
        onClick={() => {
          setHits([]);
          setThrows(0);
          setShot(null);
          setMessage("Жаңа ойын!");
        }}
        disabled={flying}
      >
        <RotateCcw size={16} />
        Қайта бастау
      </button>
    </div>
  );
}
