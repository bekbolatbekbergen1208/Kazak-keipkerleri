"use client";
import { useEffect, useRef, useState } from "react";
import { PullTeam } from "../GameArt";
import { RotateCcw, Trophy } from "lucide-react";

type Side = "left" | "right";
export default function ArqanTartys({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [power, setPower] = useState(50);
  const [running, setRunning] = useState(false);
  const [pulls, setPulls] = useState(0);
  const [last, setLast] = useState<Side | null>(null);
  const [message, setMessage] = useState(
    "Екі қолды кезектестіріп, арқанды өз жағыңа тарт.",
  );
  const previous = useRef<Side | null>(null);
  const lastPull = useRef(0);
  const won = power >= 100;
  const lost = power <= 0;

  function pull(side: Side) {
    if (!running || won || lost) return;
    if (previous.current === side) {
      setMessage("Қолды ауыстыр! Сол және оң қолды кезекпен бас.");
      return;
    }
    if (Date.now() - lastPull.current < 100) return;
    lastPull.current = Date.now();
    previous.current = side;
    setLast(side);
    setPulls((n) => n + 1);
    setPower((n) => Math.min(100, n + 7));
    setMessage("Жарайсың! Кезектестіріп тарта бер.");
  }
  useEffect(() => {
    if (!running || won || lost) return;
    const timer = setInterval(() => setPower((n) => Math.max(0, n - 3)), 650);
    return () => clearInterval(timer);
  }, [running, won, lost]);
  useEffect(() => {
    function key(event: KeyboardEvent) {
      if (!["ArrowLeft", "ArrowRight", "KeyA", "KeyD"].includes(event.code))
        return;
      event.preventDefault();
      if (event.repeat) return;
      pull(
        event.code === "ArrowLeft" || event.code === "KeyA" ? "left" : "right",
      );
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  function start() {
    previous.current = null;
    lastPull.current = 0;
    setPower(50);
    setPulls(0);
    setLast(null);
    setRunning(true);
    setMessage("Сол қол, оң қол! Арқанды кезекпен тарт.");
  }
  return (
    <div className={`national-game play-arqan ${won ? "game-won" : ""}`}>
      <div className="game-type">ҰЛТТЫҚ КҮШ СЫНАҚТАРЫ</div>
      <h2>Арқан тартыс</h2>
      <p>
        Компьютерге қарсы ойна. ← және → пернелерін немесе екі қол батырмасын
        кезекпен бас. Белгіні оң жақтағы өз мәре сызығыңа жеткіз. Бұл — арқан
        тартыстың жеңілдетілген цифрлық нұсқасы.
      </p>
      <div className="arqan-field">
        <div className="arqan-teams">
          <span>Қарсылас</span>
          <strong>Сенің тобың</strong>
        </div>
        <div className="arqan-track">
          <span className="pull-team pull-team-left">
            <PullTeam />
          </span>
          <span className="pull-team pull-team-right">
            <PullTeam reverse />
          </span>
          <span className="arqan-rope" />
          <span className="arqan-center" />
          <span
            className="arqan-marker"
            style={{ left: `${5 + power * 0.9}%` }}
          >
            ⚑
          </span>
        </div>
        <div className="arqan-labels">
          <span>Қарсылас мәресі</span>
          <span>Сенің мәре сызығың</span>
        </div>
        <label className="arqan-progress">
          Күш: {power}%<progress max={100} value={power} />
        </label>
        <small>Тарту саны: {pulls}</small>
      </div>
      <p className="feedback" role="status">
        {won
          ? "ЖЕҢІС! Арқанды өз жағыңа тартып алдың!"
          : lost
            ? "Қарсылас жеңді. Қайта байқап көр!"
            : message}
      </p>
      {won ? (
        <button className="gold-button" onClick={onComplete}>
          СЫЙЛЫҚТЫ АЛУ <Trophy size={16} />
        </button>
      ) : !running || lost ? (
        <button className="gold-button" onClick={start}>
          <RotateCcw size={16} />
          {lost ? "ҚАЙТА БАЙҚАУ" : "ТАРТЫСТЫ БАСТАУ"}
        </button>
      ) : (
        <div className="arqan-controls">
          <button
            className={`outline-button ${last !== "left" ? "next-hand" : ""}`}
            onClick={() => pull("left")}
          >
            ← СОЛ ҚОЛ
          </button>
          <button
            className={`outline-button ${last !== "right" ? "next-hand" : ""}`}
            onClick={() => pull("right")}
          >
            ОҢ ҚОЛ →
          </button>
        </div>
      )}
      {running && !won && !lost && (
        <button className="text-button" onClick={start}>
          Қайта бастау
        </button>
      )}
    </div>
  );
}
