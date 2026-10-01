"use client";
import { useEffect, useRef, useState } from "react";
import { Brain, Check, Compass, RotateCcw } from "lucide-react";
import { riddles } from "@/data/content";
import type { GameKind } from "@/types/game";
const symbols = ["☀", "◈", "♫", "♞", "⌂", "✦"];
export default function MiniGame({
  kind,
  onComplete,
  onRiddle,
  onDecision,
}: {
  kind: GameKind;
  onComplete: () => void;
  onRiddle: () => void;
  onDecision?: (index: number) => void;
}) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [wrong, setWrong] = useState(false);
  const [question] = useState(
    () => riddles[Math.floor(Math.random() * riddles.length)],
  );
  const [cards] = useState(() =>
    [...symbols, ...symbols]
      .map((s, i) => ({ s, id: i }))
      .sort(() => Math.random() - 0.5),
  );
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [decision, setDecision] = useState<number | null>(null);
  function choose(i: number, correct: number) {
    setAnswer(i);
    setWrong(i !== correct);
    if (i === correct && kind === "riddle") onRiddle();
  }
  useEffect(() => {
    if (open.length === 2) {
      const timer = setTimeout(() => {
        if (cards[open[0]].s === cards[open[1]].s)
          setMatched((m) => [...m, cards[open[0]].s]);
        setOpen([]);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [open, cards]);
  if (kind === "horse") return <HorseRun onComplete={onComplete} />;
  const success =
    kind === "memory"
      ? matched.length === 6
      : kind === "choice"
        ? decision !== null
        : answer !== null && !wrong;
  return (
    <div className="mini-game">
      <div className="game-type">
        <Brain size={18} />
        {
          (
            {
              riddle: "ЖҰМБАҚ",
              path: "ДАЛА ЖОЛЫ",
              memory: "БЕЛГІЛЕРДІ ЕСТЕ САҚТА",
              choice: "БАТЫР ТАҢДАУЫ",
              battle: "БІЛІМ САЙЫСЫ",
            } as const
          )[kind]
        }
      </div>
      {kind === "memory" ? (
        <>
          <h2>Жұп белгілерді тап</h2>
          <p>12 картаның ішінен бірдей 6 жұпты аш.</p>
          <div className="memory-grid">
            {cards.map((c, i) => (
              <button
                key={c.id}
                disabled={
                  open.includes(i) || matched.includes(c.s) || open.length === 2
                }
                onClick={() => setOpen((o) => [...o, i])}
                aria-label={`Карта ${i + 1}`}
                className={
                  open.includes(i) || matched.includes(c.s) ? "flipped" : ""
                }
              >
                {open.includes(i) || matched.includes(c.s) ? c.s : "✧"}
              </button>
            ))}
          </div>
          <small>{matched.length} / 6 жұп</small>
        </>
      ) : kind === "choice" ? (
        <>
          <h2>Жолда жолаушыны кездестірдің.</h2>
          <p>Оның аты шаршаған, ал ауыл әлі алыс. Не істейсің?</p>
          <div className="answers">
            {[
              "Суыңды бөлісіп, бірге жолға шығасың",
              "Ауылға барып, көмек шақырасың",
              "Қауіпсіз демалатын жер көрсетесің",
            ].map((a, i) => (
              <button
                key={a}
                disabled={decision !== null}
                onClick={() => {
                  setDecision(i);
                  onDecision?.(i);
                }}
                className={decision === i ? "correct" : ""}
              >
                <span>0{i + 1}</span>
                {a}
              </button>
            ))}
          </div>
          {decision !== null && (
            <p className="feedback">
              {
                [
                  "Мейірім мен бірлік — батырдың күші. Батылдық +2",
                  "Ақылды шешім! Көмек шақыру — жауапкершілік. Ақыл +2",
                  "Қамқорлық таныттың. Ептілік +2",
                ][decision]
              }
            </p>
          )}
        </>
      ) : (
        <>
          <h2>
            {kind === "riddle"
              ? question.q
              : kind === "path"
                ? "Шалқұйрықтың ізі қайда апарады?"
                : "Қауіпті жағдайда алдымен не істеу керек?"}
          </h2>
          {kind === "path" && (
            <p>
              <Compass size={16} /> Із өзеннің бойымен жүреді. Күн оң жағыңнан
              шығып тұр. Солтүстікке бет ал.
            </p>
          )}
          {kind === "battle" && (
            <p>
              Алпамыс × Ер Төстік · Шешім қабылдау
              <br />
              Жеңіске күшпен емес, ақылмен жет!
            </p>
          )}
          <div className="answers">
            {(kind === "riddle"
              ? question.options
              : kind === "path"
                ? [
                    "Батыстағы тауға",
                    "Солтүстікке, өзен бойымен",
                    "Оңтүстіктегі орманға",
                  ]
                : [
                    "Асығыс жүгіріп кету",
                    "Жағдайды бағалап, қауіпсіз жер мен көмек іздеу",
                    "Қауіпті елемеу",
                  ]
            ).map((a, i) => (
              <button
                key={a}
                onClick={() =>
                  choose(i, kind === "riddle" ? question.answer : 1)
                }
                disabled={success}
                className={
                  answer === i ? (wrong ? "incorrect" : "correct") : ""
                }
              >
                <span>0{i + 1}</span>
                {a}
              </button>
            ))}
          </div>
          {answer !== null && (
            <p className={`feedback ${wrong ? "error" : ""}`}>
              {wrong
                ? "ҚАЙТА ОЙЛАН. Сенің қолыңнан келеді!"
                : "ДҰРЫС! Келесі сынаққа дайынсың."}
            </p>
          )}
        </>
      )}
      {success && (
        <button className="gold-button" onClick={onComplete}>
          <Check size={18} />
          СЫНАҚТЫ АЯҚТАУ
        </button>
      )}
    </div>
  );
}
function HorseRun({ onComplete }: { onComplete: () => void }) {
  const [running, setRunning] = useState(false);
  const [jump, setJump] = useState(false);
  const [tick, setTick] = useState(0);
  const [score, setScore] = useState(0);
  const [failed, setFailed] = useState(false);
  const jumping = useRef(false);
  const jumpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doJump = () => {
    if (!running || jumping.current) return;
    jumping.current = true;
    setJump(true);
    jumpTimer.current = setTimeout(() => {
      jumping.current = false;
      setJump(false);
    }, 650);
  };
  useEffect(
    () => () => {
      if (jumpTimer.current) clearTimeout(jumpTimer.current);
    },
    [],
  );
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTick((t) => t + 1), 50);
    return () => clearInterval(id);
  }, [running]);
  useEffect(() => {
    if (!running) return;
    queueMicrotask(() => {
      const phase = tick % 50;
      if (phase === 39) {
        if (jumping.current) setScore((s) => s + 1);
        else {
          setFailed(true);
          setRunning(false);
        }
      }
      if (tick >= 250) setRunning(false);
    });
  }, [tick, running]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        doJump();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });
  return (
    <div className="mini-game">
      <div className="game-type">♞ КЕРҚҰЛА ЖАРЫСЫ</div>
      <h2>Дала желімен жарыс!</h2>
      <p>5 кедергіден секір. Бос орын, ↑ немесе «СЕКІРУ» батырмасын бас.</p>
      <div className="horse-scene">
        <div className={`rider ${jump ? "jump" : ""}`}>♞</div>
        <div className="obstacle" style={{ left: `${100 - (tick % 50) * 2}%` }}>
          ▰
        </div>
        <span className="horse-score">{score} / 5 ✦</span>
      </div>
      {!running && score < 5 && (
        <button
          className="gold-button"
          onClick={() => {
            setTick(0);
            setScore(0);
            setFailed(false);
            setRunning(true);
          }}
        >
          <RotateCcw size={17} />
          {failed ? "ҚАЙТА БАЙҚАУ" : "ЖАРЫСТЫ БАСТАУ"}
        </button>
      )}
      {running && (
        <button className="gold-button" onPointerDown={doJump}>
          СЕКІРУ ↑
        </button>
      )}
      {score >= 5 && (
        <>
          <p className="feedback">Керемет! Барлық кедергіден өттің.</p>
          <button className="gold-button" onClick={onComplete}>
            СЫНАҚТЫ АЯҚТАУ
          </button>
        </>
      )}
    </div>
  );
}
