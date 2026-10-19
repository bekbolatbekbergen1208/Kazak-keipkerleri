import { Star } from "lucide-react";
import type { NationalKind } from "@/data/national-games";

export function AsykShape({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 70" aria-hidden="true">
      <path
        d="M19 8C8 10 8 23 15 31 4 44 12 62 25 62c8 0 11-6 16-4 16 5 22-9 16-20-3-6-10-9-9-15C51 7 31 1 25 13Z"
        fill="currentColor"
        stroke="#70432c"
        strokeWidth="2"
      />
      <path
        d="M20 17q-5 8 4 14m-6 13q-2 10 8 11m15-38q7 3 5 10"
        fill="none"
        stroke="#fff8da"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M22 34q12-9 23 2"
        fill="none"
        stroke="#70432c"
        strokeWidth="2"
        opacity=".4"
      />
    </svg>
  );
}
export function HorseRider() {
  return (
    <svg viewBox="0 0 180 150" aria-hidden="true">
      <path
        d="m40 83-24 8-8-6 12-3 18-16m15 38-9 33h-12l7-34m51-5 26 36h13l-22-43m4-24 25-26 24 10 1 20-26-2-15 35-56 3-25-28Z"
        fill="#894830"
        stroke="#5d3024"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="m131 42 8-16 5 18m-11 12-15 20"
        fill="#543123"
        stroke="#543123"
        strokeWidth="4"
      />
      <path
        d="m56 80 41 1 3 24-42 1Z"
        fill="#c33532"
        stroke="#f3ce74"
        strokeWidth="3"
      />
      <path
        d="m77 45-12 34 19 8-3 26 11 3 9-35-16-9 9-22"
        fill="#397786"
        stroke="#285768"
        strokeWidth="3"
      />
      <circle cx="87" cy="30" r="12" fill="#e7b984" />
      <path d="m72 26 4-10 20-3 7 15Z" fill="#c33532" />
      <path
        d="m76 46 23 16 27-9"
        fill="none"
        stroke="#397786"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="m126 53 8 9"
        stroke="#e7b984"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="151" cy="56" r="2" fill="#291c18" />
    </svg>
  );
}
export function PullTeam({ reverse = false }: { reverse?: boolean }) {
  return (
    <svg viewBox="0 0 180 150" aria-hidden="true">
      <g transform={reverse ? "translate(180 0) scale(-1 1)" : undefined}>
        {[0, 45].map((x, i) => (
          <g key={x} transform={`translate(${x} ${i * 5})`}>
            <path
              d="m41 78-18 49 13 3 25-39 16 39 15-2-23-56"
              fill={reverse ? "#c43b34" : "#397f8a"}
              stroke="#493b32"
              strokeWidth="2"
            />
            <path
              d="m42 43-8 38 37 4 2-38"
              fill={reverse ? "#e35d47" : "#5a9da0"}
            />
            <circle cx="57" cy="28" r="12" fill="#e5b88a" />
            <path
              d="m43 25 5-12 20 3 5 11Z"
              fill={reverse ? "#bd302d" : "#2a6777"}
            />
            <path
              d="m49 51 26 15 29-5"
              stroke="#e5b88a"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="m21 129 18 1m38 0h18"
              stroke="#493b32"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
export function GameCover({ kind }: { kind: NationalKind }) {
  return (
    <div className={`game-cover cover-${kind}`} aria-hidden="true">
      <span className="cover-sun" />
      <span className="cover-hill cover-hill-back" />
      <span className="cover-hill" />
      {kind === "asyk" ? (
        <div className="cover-asyks">
          {[0, 1, 2].map((i) => (
            <AsykShape key={i} className={`cover-bone bone-${i}`} />
          ))}
        </div>
      ) : kind === "tenge" ? (
        <div className="cover-horse">
          <HorseRider />
          <span className="cover-coin">₸</span>
        </div>
      ) : kind === "arqan" ? (
        <div className="cover-pull">
          <PullTeam />
          <span className="cover-rope" />
          <PullTeam reverse />
        </div>
      ) : (
        <div className="cover-board">
          {[0, 1].map((row) => (
            <div key={row}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i}>
                  <i />
                  <i />
                  <i />
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
      <span className="cover-label">
        {
          {
            asyk: "ДӘЛ КӨЗДЕ!",
            tenge: "ЕПТІ БОЛ!",
            arqan: "БІРГЕ ТАРТ!",
            togyz: "ОЙЛАН ДА, ЖЕҢ!",
          }[kind]
        }
      </span>
    </div>
  );
}
export function GameProgress({
  value,
  total,
  label,
}: {
  value: number;
  total: number;
  label: string;
}) {
  return (
    <div className="play-progress">
      <span>{label}</span>
      <div>
        {Array.from({ length: total }, (_, i) => (
          <Star
            key={i}
            size={22}
            className={i < value ? "collected" : ""}
            fill={i < value ? "currentColor" : "none"}
          />
        ))}
      </div>
      <strong>
        {value} / {total}
      </strong>
    </div>
  );
}
