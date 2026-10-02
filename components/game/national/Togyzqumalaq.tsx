"use client";
import { useEffect, useState } from "react";
import { RotateCcw, Trophy } from "lucide-react";
import { newBoard, move, computerMove, legalMoves } from "@/lib/togyzqumalaq";
export default function Togyzqumalaq({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [board, setBoard] = useState(newBoard);
  const [mode, setMode] = useState<"computer" | "friends">("computer");
  const [rules, setRules] = useState(false);
  const [lesson, setLesson] = useState(false);
  useEffect(() => {
    if (mode !== "computer" || board.turn !== 1 || board.winner !== null)
      return;
    const id = setTimeout(() => setBoard((s) => move(s, computerMove(s))), 650);
    return () => clearTimeout(id);
  }, [board, mode]);
  const play = (i: number) => setBoard((s) => move(s, i));
  const disabled = (i: number) =>
    !legalMoves(board).includes(i) || (mode === "computer" && board.turn === 1);
  return (
    <div className="national-game">
      <div className="game-type">◉ ҰЛТТЫҚ ЗИЯТКЕРЛІК ОЙЫН</div>
      <h2>Тоғызқұмалақ</h2>
      <p>Өз отауыңды таңдап жүріс жаса. 82 құмалақ жинаған ойыншы жеңеді.</p>
      <div className="national-toolbar">
        <select
          aria-label="Ойын режимі"
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as typeof mode);
            setBoard(newBoard());
            setLesson(false);
          }}
        >
          <option value="computer">Компьютермен</option>
          <option value="friends">Екі ойыншы</option>
        </select>
        <button className="text-button" onClick={() => setRules(!rules)}>
          Ереже {rules ? "−" : "+"}
        </button>
        <button
          aria-label="Тоғызқұмалақты қайта бастау"
          onClick={() => {
            setBoard(newBoard());
            setLesson(false);
          }}
        >
          <RotateCcw size={18} />
        </button>
      </div>
      {rules && (
        <div className="national-rules">
          <p>
            Әр жақта 9 отау, әр отауда бастапқыда 9 құмалақ бар. Бір құмалақ
            болса, келесі отауға көшеді. Бірнешеу болса, біреуі орнында қалып,
            қалғандары ретімен таратылады.
          </p>
          <p>
            Соңғы құмалақ қарсыластың отауындағы санды жұп етсе, сол құмалақтар
            қазанға түседі. Үш құмалақ түскен отау тұздық болады: бір ойыншыда
            бір тұздық, 9-отаудан және қарсыластың тұздығымен аттас отаудан
            тұздық алынбайды. Тұздыққа түскен құмалақ иесінің қазанына өтеді.
          </p>
          <p>
            Жүретін құмалақ қалмаса, қалғаны тиісті қазанға жиналады. 81–81 —
            тең ойын.
          </p>
          <a
            href="https://9kumalak.com/index.php/zhyldy-zhospar/509-to-yz-mala-a-idasy-men-erezhesi"
            target="_blank"
            rel="noreferrer"
          >
            Ереженің дереккөзі ↗
          </a>
        </div>
      )}
      <div className="togyz-score">
        <span>
          Сен / 1-ойыншы<strong>{board.kazans[0]}</strong>
        </span>
        <span className="togyz-turn" role="status">
          {board.winner !== null
            ? board.winner === "draw"
              ? "Тең ойын"
              : `${board.winner + 1}-ойыншы жеңді!`
            : board.turn === 0
              ? "Сенің кезегің"
              : mode === "computer"
                ? "Компьютер ойлануда…"
                : "2-ойыншының кезегі"}
          <small>Жүріс: {board.moves}</small>
        </span>
        <span>
          {mode === "computer" ? "Компьютер" : "2-ойыншы"}
          <strong>{board.kazans[1]}</strong>
        </span>
      </div>
      <div className="togyz-board">
        {[1, 0].map((side) => (
          <div key={side} className="pit-row">
            {Array.from({ length: 9 }, (_, j) => (side === 1 ? 17 - j : j)).map(
              (i) => (
                <button
                  key={i}
                  className={`togyz-pit ${board.tuzdyks.includes(i) ? "tuzdyk" : ""}`}
                  disabled={disabled(i)}
                  onClick={() => play(i)}
                  aria-label={`${side + 1}-ойыншы, ${(i % 9) + 1}-отау, ${board.pits[i]} құмалақ`}
                >
                  <small>{(i % 9) + 1}</small>
                  <span className="pit-stones">
                    {Array.from(
                      { length: Math.min(board.pits[i], 9) },
                      (_, j) => (
                        <i key={j} />
                      ),
                    )}
                  </span>
                  <strong>
                    {board.tuzdyks.includes(i) ? "Т" : board.pits[i]}
                  </strong>
                </button>
              ),
            )}
          </div>
        ))}
      </div>
      <p className="muted">
        Алғашқы 6 жүрісті орындап, танысу сыйлығын ал. Толық партияны жалғастыра
        аласың.
      </p>
      {(board.moves >= 6 || board.winner !== null) && !lesson && (
        <button className="outline-button" onClick={() => setLesson(true)}>
          ТАНЫСУ СЫНАҚТАРЫ ОРЫНДАЛДЫ <Trophy size={16} />
        </button>
      )}
      {lesson && (
        <>
          <p className="feedback">
            Тоғызқұмалақпен таныстың! Партияны жалғастыр немесе сыйлықты ал.
          </p>
          <button className="gold-button" onClick={onComplete}>
            СЫЙЛЫҚТЫ АЛУ <Trophy size={16} />
          </button>
        </>
      )}
    </div>
  );
}
