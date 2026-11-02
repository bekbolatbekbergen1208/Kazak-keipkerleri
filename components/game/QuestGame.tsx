"use client";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  RotateCcw,
} from "lucide-react";
import { GameCharacter } from "./GameArt";
import type { Chapter, QuestGameKind } from "@/data/adventure";
const symbols = [
  { label: "Күн", icon: "☀️" },
  { label: "Ай", icon: "🌙" },
  { label: "Жұлдыз", icon: "⭐" },
  { label: "Гүл", icon: "🌷" },
];
export default function QuestGame({
  kind,
  chapter,
  onComplete,
}: {
  kind: QuestGameKind;
  chapter?: Chapter;
  onComplete: () => void;
}) {
  if (kind === "trail") return <Trail onComplete={onComplete} />;
  if (kind === "sequence")
    return (
      <Sequence
        pattern={chapter?.pattern ?? [0, 2, 1, 3]}
        onComplete={onComplete}
      />
    );
  return (
    <Words
      words={chapter?.words ?? ["Достар", "бірге", "қиындықты", "жеңеді."]}
      shuffle={chapter?.shuffle ?? [2, 0, 3, 1]}
      hint={chapter?.hint ?? "Сөйлем «Достар» сөзінен басталады."}
      onComplete={onComplete}
    />
  );
}
function Finish({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="quest-success">
      <p role="status">Жарайсың! Сынақты орындадың.</p>
      <button className="gold-button" onClick={onComplete}>
        СЫНАҚТЫ АЯҚТАУ <Check size={18} />
      </button>
    </div>
  );
}
function Trail({ onComplete }: { onComplete: () => void }) {
  const [position, setPosition] = useState(0);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState(
    "Қақпаға жет. Көрші торды бас немесе бағыт батырмаларын қолдан.",
  );
  const walls = [2, 7, 8, 10, 14, 16, 21, 22];
  const won = position === 24;
  function go(next: number) {
    if (
      won ||
      next < 0 ||
      next >= 25 ||
      Math.abs(Math.floor(next / 5) - Math.floor(position / 5)) +
        Math.abs((next % 5) - (position % 5)) !==
        1
    )
      return;
    if (walls.includes(next)) {
      setMessage("Мұнда тас жатыр. Басқа жолды байқап көр.");
      return;
    }
    setPosition(next);
    setMoves((n) => n + 1);
    setMessage(next === 24 ? "Қақпаны таптың!" : "Жақсы! Жолды жалғастыр.");
  }
  useEffect(() => {
    function key(e: KeyboardEvent) {
      const delta: Record<string, number> = {
        ArrowUp: -5,
        ArrowDown: 5,
        ArrowLeft: -1,
        ArrowRight: 1,
      };
      if (e.code in delta) {
        e.preventDefault();
        go(position + delta[e.code]);
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  return (
    <div className="quest-game">
      <span className="eyebrow">БАЙҚА ДА, ЖОЛ ТАП</span>
      <h2>Құпия жол</h2>
      <p>
        Тастарды айналып өтіп, алтын қақпаға жет. Қайта жүруге болады, уақыт
        шектеуі жоқ.
      </p>
      <div className="quest-maze" role="group" aria-label="Құпия жол алаңы">
        {Array.from({ length: 25 }, (_, i) => (
          <button
            key={i}
            className={`${walls.includes(i) ? "maze-wall" : ""} ${position === i ? "maze-player" : ""} ${i === 24 ? "maze-goal" : ""}`}
            aria-label={`Тор ${i + 1}${walls.includes(i) ? ", тас" : i === 24 ? ", қақпа" : ""}`}
            onClick={() => go(i)}
          >
            {position === i ? (
              <GameCharacter />
            ) : walls.includes(i) ? (
              <span aria-hidden="true">🪨</span>
            ) : i === 24 ? (
              <span aria-hidden="true">🚪</span>
            ) : (
              <span className="maze-dot" />
            )}
          </button>
        ))}
      </div>
      <div className="quest-direction">
        <button aria-label="Жоғары жүру" onClick={() => go(position - 5)}>
          <ArrowUp />
        </button>
        <button aria-label="Солға жүру" onClick={() => go(position - 1)}>
          <ArrowLeft />
        </button>
        <button aria-label="Төмен жүру" onClick={() => go(position + 5)}>
          <ArrowDown />
        </button>
        <button aria-label="Оңға жүру" onClick={() => go(position + 1)}>
          <ArrowRight />
        </button>
      </div>
      <p className="feedback" role="status">
        {message} · Қадам: {moves}
      </p>
      {won ? (
        <Finish onComplete={onComplete} />
      ) : (
        <button
          className="text-button"
          onClick={() => {
            setPosition(0);
            setMoves(0);
            setMessage("Жаңа жолды байқап көр!");
          }}
        >
          <RotateCcw size={16} />
          Қайта бастау
        </button>
      )}
    </div>
  );
}
function Sequence({
  pattern,
  onComplete,
}: {
  pattern: number[];
  onComplete: () => void;
}) {
  const [preview, setPreview] = useState(true);
  const [chosen, setChosen] = useState<number[]>([]);
  const [message, setMessage] = useState("Белгілерді асықпай қарап ал.");
  const won = chosen.length === pattern.length;
  function choose(index: number) {
    if (won) return;
    if (pattern[chosen.length] !== index) {
      setChosen([]);
      setMessage("Жақсы талпыныс! Ретті қайта қарап алуға болады.");
      return;
    }
    setChosen([...chosen, index]);
    setMessage("Дұрыс белгі! Жалғастыра бер.");
  }
  return (
    <div className="quest-game">
      <span className="eyebrow">ЗЕЙІН МЕН ЕСТЕ САҚТАУ</span>
      <h2>Сиқырлы белгілер</h2>
      <p>
        Ретті солдан оңға қарай қарап ал. Дайын болғанда дәл сол ретпен қайтала.
      </p>
      {preview ? (
        <>
          <div className="quest-symbol-line">
            {pattern.map((i, n) => (
              <div key={n}>
                <small>{n + 1}</small>
                <span aria-label={symbols[i].label}>{symbols[i].icon}</span>
              </div>
            ))}
          </div>
          <button
            className="gold-button"
            onClick={() => {
              setPreview(false);
              setChosen([]);
              setMessage("Енді белгілерді ретімен таңда.");
            }}
          >
            ДАЙЫНМЫН
          </button>
        </>
      ) : (
        <>
          <div className="quest-symbol-line">
            {pattern.map((_, n) => (
              <div key={n}>
                <small>{n + 1}</small>
                <span>
                  {chosen[n] !== undefined ? symbols[chosen[n]].icon : "?"}
                </span>
              </div>
            ))}
          </div>
          <div className="quest-symbol-buttons">
            {symbols.map((symbol, i) => (
              <button
                key={symbol.label}
                disabled={won}
                aria-label={symbol.label}
                onClick={() => choose(i)}
              >
                <span>{symbol.icon}</span>
                {symbol.label}
              </button>
            ))}
          </div>
          <p className="feedback" role="status">
            {message}
          </p>
          {won ? (
            <Finish onComplete={onComplete} />
          ) : (
            <button
              className="text-button"
              onClick={() => {
                setPreview(true);
                setChosen([]);
              }}
            >
              РЕТТІ ҚАЙТА КӨРУ
            </button>
          )}
        </>
      )}
    </div>
  );
}
function Words({
  words,
  shuffle,
  hint,
  onComplete,
}: {
  words: string[];
  shuffle: number[];
  hint: string;
  onComplete: () => void;
}) {
  const [chosen, setChosen] = useState<number[]>([]);
  const [won, setWon] = useState(false);
  const [message, setMessage] = useState(
    "Сөздерді ретімен басып, сөйлем құрастыр.",
  );
  function check() {
    if (chosen.every((v, i) => v === i) && chosen.length === words.length) {
      setWon(true);
      setMessage("Сөйлем дұрыс құрастырылды!");
    } else
      setMessage(`Тағы ойланып көр. ${hint} Сөзді басып, қайта алуға болады.`);
  }
  return (
    <div className="quest-game">
      <span className="eyebrow">СӨЗДІҢ СЫРЫН АШ</span>
      <h2>Сөзден сыр құра</h2>
      <p>{hint}</p>
      <div className="quest-sentence" aria-label="Құрастырылған сөйлем">
        {chosen.length ? (
          chosen.map((i, n) => (
            <button
              key={i}
              disabled={won}
              onClick={() => setChosen(chosen.filter((_, j) => j !== n))}
            >
              {words[i]} <span>×</span>
            </button>
          ))
        ) : (
          <span>Таңдаған сөздерің осында жиналады…</span>
        )}
      </div>
      <div className="quest-word-bank">
        {shuffle.map((i) => (
          <button
            key={i}
            disabled={won || chosen.includes(i)}
            onClick={() => setChosen([...chosen, i])}
          >
            {words[i]}
          </button>
        ))}
      </div>
      <p className="feedback" role="status">
        {message}
      </p>
      {won ? (
        <Finish onComplete={onComplete} />
      ) : (
        <>
          <button
            className="gold-button"
            disabled={chosen.length !== words.length}
            onClick={check}
          >
            ТЕКСЕРУ <Check size={18} />
          </button>
          <button
            className="text-button"
            onClick={() => {
              setChosen([]);
              setMessage("Басынан құрастырып көр.");
            }}
          >
            ТАЗАРТУ
          </button>
        </>
      )}
    </div>
  );
}
