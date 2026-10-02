"use client";
import { useEffect, useRef, useState } from "react";
import { RotateCcw, Trophy } from "lucide-react";
export default function TengeIlu({ onComplete }: { onComplete: () => void }) {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0);
  const [score, setScore] = useState(0);
  const [lean, setLean] = useState(false);
  const [message, setMessage] = useState("Теңге жақындағанда еңкейіп іліп ал.");
  const action = useRef(false);
  const leanTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clock = useRef(0);
  function collect() {
    if (!running || action.current) return;
    action.current = true;
    setLean(true);
    const phase = clock.current % 60;
    if (phase >= 38 && phase <= 48) {
      setScore((s) => s + 1);
      setMessage("ІЛІП АЛДЫҢ! Керемет ептілік.");
    } else setMessage("Ертерек не кешірек еңкейдің. Келесі теңгені күт.");
    leanTimer.current = setTimeout(() => {
      setLean(false);
      action.current = false;
    }, 700);
  }
  useEffect(
    () => () => {
      if (leanTimer.current) clearTimeout(leanTimer.current);
    },
    [],
  );
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      clock.current++;
      setTick(clock.current);
      if (clock.current >= 360) {
        setRunning(false);
        setMessage("Сапар аяқталды. 5 теңге жинау үшін қайта байқап көр.");
      }
    }, 50);
    return () => clearInterval(id);
  }, [running]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowDown") {
        e.preventDefault();
        collect();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });
  function restart() {
    if (leanTimer.current) clearTimeout(leanTimer.current);
    clock.current = 0;
    action.current = false;
    setLean(false);
    setTick(0);
    setScore(0);
    setRunning(true);
    setMessage("Теңге алтын аймаққа кіргенде еңкей!");
  }
  const phase = tick % 60;
  return (
    <div className="national-game">
      <div className="game-type">♞ ҰЛТТЫҚ АТ СПОРТЫ</div>
      <h2>Теңге ілу</h2>
      <p>
        Ат үстінен жолдағы теңгені іліп ал. Бос орын, ↓ немесе «ЕҢКЕЮ»
        батырмасын бас. Мақсат: 6 мүмкіндіктен 5 теңге. Бұл — спорттың
        жеңілдетілген цифрлық нұсқасы.
      </p>
      <div className="tenge-field">
        <span className={`tenge-rider ${lean ? "lean" : ""}`}>♞</span>
        <span className="pickup-zone" />
        <span
          className="tenge-token"
          style={{
            left: `${100 - phase * 1.8}%`,
            opacity: lean && phase >= 38 && phase <= 48 ? 0 : 1,
          }}
        >
          ◉
        </span>
        <span className="field-score">
          {score} / 5 теңге · {Math.min(6, Math.floor(tick / 60) + 1)} / 6
          мүмкіндік
        </span>
      </div>
      <p className="feedback" role="status">
        {score >= 5 ? "ЖАРАЙСЫҢ! Бес теңгені іліп алдың." : message}
      </p>
      {score >= 5 ? (
        <button className="gold-button" onClick={onComplete}>
          СЫЙЛЫҚТЫ АЛУ <Trophy size={16} />
        </button>
      ) : running ? (
        <button className="gold-button" onClick={collect} disabled={lean}>
          ЕҢКЕЮ ↓
        </button>
      ) : (
        <button className="gold-button" onClick={restart}>
          <RotateCcw size={16} />
          {tick ? "ҚАЙТА БАЙҚАУ" : "САПАРДЫ БАСТАУ"}
        </button>
      )}
    </div>
  );
}
