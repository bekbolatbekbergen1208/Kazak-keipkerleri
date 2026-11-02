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
  return <span className="mounted-hero">
    <svg className="steppe-horse" viewBox="0 0 240 170" aria-hidden="true">
      <ellipse cx="119" cy="153" rx="83" ry="9" fill="#342f3d" opacity=".16"/>
      <path d="M53 70Q26 61 21 91Q14 113 7 106Q25 129 38 101L65 93" fill="#382735"/>
      <path d="M63 108L53 150H68L87 107M139 108L164 150H180L158 96" fill="#794639" stroke="#503135" strokeWidth="5" strokeLinejoin="round"/>
      <path d="M56 77Q75 57 127 72L154 47L166 19L179 36L192 42L211 69Q210 80 196 79L178 70L165 99Q151 121 111 119L70 113Q47 107 56 77Z" fill="#bb7651" stroke="#503135" strokeWidth="4"/>
      <path d="M89 113L81 151H98L112 115M146 107L133 149H149L168 103" fill="#d49162" stroke="#503135" strokeWidth="4"/>
      <path d="M151 49L166 19L172 39L161 72L148 83" fill="#382735"/>
      <path d="M87 74Q113 67 135 77L128 100L89 97Z" fill="#307f80" stroke="#e6c780" strokeWidth="4"/>
      <path d="M93 82L121 89M105 77L108 96" stroke="#ffda8b" strokeWidth="3"/>
      <path d="M177 58L196 69L202 66M177 58L137 82" fill="none" stroke="#ead2a0" strokeWidth="3"/>
      <circle cx="187" cy="53" r="3" fill="#251f30"/>
    </svg>
    <span className="mounted-character"><GameCharacter /></span>
  </span>;
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

export function SteppeScenery() {
  return <svg className="steppe-scenery" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
    <circle cx="804" cy="78" r="40" fill="#ffe9a6"/><circle cx="804" cy="78" r="57" fill="#fff3c2" opacity=".25"/>
    <g fill="#fff" opacity=".65"><path d="M89 65h104q10-17-12-20q-18-28-42-5q-27-8-30 13q-20-1-20 12"/><path d="M510 91h113q8-14-15-18q-16-24-43-4q-29-8-33 13q-22-2-22 9"/></g>
    <path d="M0 245L129 115L219 212L369 79L528 237L678 140L817 235L936 125L1000 210V400H0Z" fill="#87b4bb"/>
    <path d="M300 145L369 79L442 152L396 136L369 112L346 144L327 132Z M78 167L129 115L175 165L137 144L121 151L109 143Z" fill="#e6f1ed"/>
    <path d="M0 248Q173 174 340 254T673 239T1000 244V400H0Z" fill="#77a695"/>
    <path d="M0 292Q190 225 414 285T1000 267V400H0Z" fill="#a0bb83"/>
    <path d="M0 337Q390 307 1000 331V400H0Z" fill="#dfbd87"/>
    <path d="M0 360Q430 333 1000 359" fill="none" stroke="#efd4a5" strokeWidth="9"/>
    <g fill="#5b8b78"><path d="M35 314l-8-23 15 16 7-28 5 35ZM916 315l-7-24 14 15 5-25 6 34ZM624 317l-8-18 10 7 7-20 3 31Z"/></g>
    <g stroke="#f2d696" strokeWidth="3"><path d="M204 350h32M470 376h49M781 343h35M86 386h52M899 382h44"/></g>
  </svg>;
}
