"use client";
import { createContext, useContext } from "react";
import { heroes } from "@/data/content";
import HeroArtwork from "@/components/heroes/HeroArtwork";
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
export const GameCharacterContext = createContext(heroes[0].id);
export function GameCharacter({ opponent = false }: { opponent?: boolean }) {
  const id = useContext(GameCharacterContext);
  const selected = heroes.find((h) => h.id === id) ?? heroes[0];
  const character = opponent
    ? selected.id === heroes[2].id
      ? heroes[0]
      : heroes[2]
    : selected;
  return (
    <span className="game-character">
      <HeroArtwork src={character.portrait} alt={character.name} />
    </span>
  );
}
export function HorseRider() {
  return <GameCharacter />;
}
export function PullTeam({ reverse = false }: { reverse?: boolean }) {
  return <GameCharacter opponent={!reverse} />;
}
export function GameCover({ kind }: { kind: NationalKind }) {
  return (
    <div className={`game-cover cover-${kind}`} aria-hidden="true">
      <span className="cover-sun" />
      <span className="cover-hill cover-hill-back" />
      <span className="cover-hill" />
      {kind === "asyk" ? (
        <div className="cover-asyks">
          <span className="cover-asyk-hero">
            <GameCharacter />
          </span>
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
      ) : null}
      <span className="cover-label">
        {
          {
            asyk: "ДӘЛ КӨЗДЕ!",
            tenge: "ЕПТІ БОЛ!",
            arqan: "БІРГЕ ТАРТ!",
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
