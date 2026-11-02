import type { CSSProperties } from "react";
import { heroes } from "@/data/content";
import type { TostikFrame } from "@/data/tostik";
import HeroArtwork from "@/components/heroes/HeroArtwork";

function Horse() {
  return (
    <svg viewBox="0 0 220 150" aria-hidden="true">
      <path
        d="m42 88-29 8-7-7 22-11 16-18 20-7 60 5 24-32 26 3 14 27-31-1-18 43-64 8-22-18Z"
        fill="#986246"
        stroke="#573e30"
        strokeWidth="3"
      />
      <path
        d="m55 101-10 35H31l9-43m63 9 20 32h14l-15-44m-59-3 9 49h13l-2-48m63-48 6-25 12 20"
        fill="#986246"
        stroke="#573e30"
        strokeWidth="3"
      />
      <path
        d="m64 59 46 3-5 26-40-1Z"
        fill="#bc302d"
        stroke="#e9c981"
        strokeWidth="4"
      />
      <circle cx="173" cy="45" r="3" fill="#201d1a" />
      <path d="m149 28 10-17 8 19" fill="#543728" />
    </svg>
  );
}
function Bird() {
  return (
    <svg viewBox="0 0 300 170" aria-hidden="true">
      <g fill="#be8842" stroke="#79582f" strokeWidth="2">
        <path
          className="samruk-wing wing-left"
          d="M151 92Q60 75 10 12q3 70 97 108Z"
        />
        <path
          className="samruk-wing wing-right"
          d="M151 92Q240 75 290 12q-3 70-97 108Z"
        />
        <path d="m132 85-22 70 41-25 41 25-22-70Z" />
        <ellipse cx="151" cy="91" rx="29" ry="37" fill="#e4b85b" />
        <path d="m141 61 3-29 22-3 15 16-17 9-2 18Z" fill="#edd19a" />
        <path d="m173 39 22 8-22 7Z" fill="#9a5b2f" />
        <circle cx="160" cy="39" r="3" fill="#382b20" />
      </g>
    </svg>
  );
}
export default function TostikScene({
  frame,
  episodeId,
  playing,
  replay = 0,
  duration = 8,
}: {
  frame: TostikFrame;
  episodeId: string;
  playing: boolean;
  replay?: number;
  duration?: number;
}) {
  const horse = [
    "kenzhekei",
    "sorqudyq",
    "underground",
    "contests",
    "cauldron",
    "captivity",
    "return",
  ].includes(episodeId);
  const bird = ["nest", "samruk", "captivity"].includes(episodeId);
  return (
    <div
      className={`tostik-scene theme-${frame.theme} action-${frame.action} ${playing ? "is-playing" : "is-paused"}`}
      style={{ "--shot-duration": `${duration}s` } as CSSProperties}
      data-episode={episodeId}
      aria-label={`Анимациялық көрініс: ${frame.text}`}
    >
      <svg
        className="tostik-landscape"
        viewBox="0 0 1000 560"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <filter
            id="film-art-cutout"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
            colorInterpolationFilters="sRGB"
          >
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -5 -5 -5 0 14"
              result="keyed"
            />
            <feComposite in="keyed" in2="SourceGraphic" operator="in" />
          </filter>
          <linearGradient id="tostik-sky" x2="0" y2="1">
            <stop stopColor="#a6d9ed" />
            <stop offset="1" stopColor="#fff2cf" />
          </linearGradient>
          <linearGradient id="tostik-cave" x2="0" y2="1">
            <stop stopColor="#30324b" />
            <stop offset="1" stopColor="#73606a" />
          </linearGradient>
        </defs>
        <rect
          className="film-sky"
          width="1000"
          height="560"
          fill="url(#tostik-sky)"
        />
        <circle className="film-sun" cx="800" cy="95" r="45" fill="#f8d277" />
        <g className="film-clouds" fill="#ffffffa8">
          <ellipse cx="175" cy="94" rx="90" ry="20" />
          <ellipse cx="220" cy="75" rx="49" ry="29" />
          <ellipse cx="650" cy="145" rx="75" ry="18" />
        </g>
        <g className="film-peaks">
          <path
            d="M-30 390 160 164 350 390 500 215 730 410 840 240 1050 400V560H-30Z"
            fill="#7facac"
          />
          <path d="m104 230 56-66 56 66-56-23Z" fill="#f2f3e8" />
          <path d="m443 283 57-68 80 68-74-25Z" fill="#eef1e1" />
        </g>
        <path
          className="film-ground"
          d="M0 394Q300 343 520 401T1000 379V560H0Z"
          fill="#bad38f"
        />
        <path
          className="film-path"
          d="M-20 500Q330 438 540 485T1040 469"
          fill="none"
          stroke="#e7ce9e"
          strokeWidth="55"
        />
        {frame.theme === "village" && (
          <g className="film-yurt" transform="translate(640 258)">
            <path
              d="M0 112V58Q100-62 200 58v54Z"
              fill="#f5ead0"
              stroke="#a58b63"
              strokeWidth="5"
            />
            <path d="M0 57h200M25 39l150 0" stroke="#c39b63" strokeWidth="5" />
            <path d="M77 112V65h46v47" fill="#936b4a" />
            <path
              d="M73 0q28-22 53 0"
              stroke="#a58b63"
              fill="none"
              strokeWidth="6"
            />
          </g>
        )}
        {frame.theme === "well" && (
          <g className="film-well" transform="translate(570 347)">
            <path
              d="M0 0h170v85H0Z"
              fill="#a78b69"
              stroke="#715c46"
              strokeWidth="4"
            />
            <ellipse
              cx="85"
              cy="0"
              rx="85"
              ry="28"
              fill="#3b3f45"
              stroke="#bfaa84"
              strokeWidth="12"
            />
            <path
              d="M-10-10v-135m190 135v-135M-20-145h210"
              stroke="#8d6241"
              strokeWidth="12"
            />
          </g>
        )}
        {["cave", "dungeon"].includes(frame.theme) && (
          <g className="film-cavern" fill="#34344d">
            <path d="M0 0h1000v68l-70 39-62-59-72 98-48-90-104 38-87-45-87 72-63-49-91 46-54-78-84 80-87-59L0 108Z" />
            <path d="M0 0h70v560H0Zm1000 0h-70v560h70Z" />
            <circle cx="806" cy="201" r="8" fill="#e3d59a" />
            <circle cx="230" cy="237" r="6" fill="#e3d59a" />
          </g>
        )}
        {frame.theme === "palace" && (
          <g className="film-palace" transform="translate(540 134)">
            <path
              d="M0 260V45h48V0h48v45h40V0h48v45h48V0h48v260Z"
              fill="#c7ac81"
              stroke="#8a775d"
              strokeWidth="5"
            />
            <path
              className="film-palace-door"
              d="M90 260V143q50-76 100 0v117Z"
              fill="#765f4c"
            />
            <path d="M20 90h30v40H20Zm210 0h30v40h-30Z" fill="#f7df9b" />
          </g>
        )}
        {frame.theme === "tree" && (
          <g className="film-tree" transform="translate(620 46)">
            <path
              d="m113 380 10-210-54-78 14-6 52 55 28-117 14 4-14 129 63-63 14 10-84 103 21 173Z"
              fill="#876245"
            />
            <g fill="#75a178">
              <ellipse cx="80" cy="105" rx="80" ry="65" />
              <ellipse cx="177" cy="74" rx="87" ry="68" />
              <ellipse cx="242" cy="140" rx="81" ry="68" />
            </g>
            <path d="M150 164q40 30 85-5l-8 25h-69Z" fill="#97704a" />
            <g fill="#f4d494">
              <ellipse cx="175" cy="162" rx="9" ry="13" />
              <ellipse cx="193" cy="159" rx="9" ry="13" />
              <ellipse cx="211" cy="160" rx="9" ry="13" />
            </g>
          </g>
        )}
        {frame.theme === "spring" && (
          <g className="film-spring">
            <ellipse cx="725" cy="417" rx="180" ry="39" fill="#8cc7ce" />
            <path
              d="m790 349 20 2 10-27 29-2 19 25 19 6-5 22-31 1-13 35h-11l3-39-29-1-9 40h-10l5-40-17-8Z"
              fill="#a77b51"
            />
            <path
              d="m841 325 4-21 9 13 10-16 1 23"
              fill="none"
              stroke="#805d3c"
              strokeWidth="4"
            />
          </g>
        )}
        {frame.theme === "lake" && (
          <g className="film-water">
            <path d="M400 415q320-105 680 20v125H400Z" fill="#79becb" />
            <path
              d="M470 457q170-27 340 0m-280 40q180-25 360 0"
              fill="none"
              stroke="#d5edf0"
              strokeWidth="5"
            />
          </g>
        )}
        {frame.theme === "dungeon" && (
          <g className="film-bars" stroke="#49434a" strokeWidth="13">
            <path d="M230 140v350m65-350v350m65-350v350m65-350v350M210 170h240M210 460h240" />
          </g>
        )}
      </svg>
      {horse && (
        <span className="film-horse">
          <Horse />
        </span>
      )}
      {bird && (
        <span className="film-bird">
          <Bird />
        </span>
      )}
      {frame.theme === "tree" && frame.action === "protect" && (
        <span className="film-serpent" aria-hidden="true">
          🐍
        </span>
      )}
      {frame.theme === "cave" && episodeId === "bapy" && (
        <span className="film-snake" aria-hidden="true">
          🐍
        </span>
      )}
      {episodeId === "cauldron" && (
        <span className="film-cauldron" aria-hidden="true">
          ⚱
        </span>
      )}
      {episodeId === "iron-palace" && (
        <div className="film-fire" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <i key={i} style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      )}
      {episodeId === "shoyinqulaq" && (
        <span className="film-chest" aria-hidden="true">
          🧰
        </span>
      )}
      {["samruk", "captivity"].includes(episodeId) && (
        <span className="film-feather" aria-hidden="true">
          🪶
        </span>
      )}
      <div
        className="film-actor-layer"
        key={`${episodeId}-${frame.action}-${replay}`}
      >
        {frame.actors.map((i, n) => (
          <span
            key={i}
            className={`tostik-actor actor-${i}`}
            style={
              {
                "--actor-slot": n,
                "--actor-count": frame.actors.length,
              } as CSSProperties
            }
          >
            <HeroArtwork src={heroes[i].portrait} alt={heroes[i].name} />
            <span>{heroes[i].name}</span>
          </span>
        ))}
      </div>
      {frame.symbols && (
        <div className="film-symbols">
          {frame.symbols.map((symbol) => (
            <span key={symbol}>{symbol}</span>
          ))}
        </div>
      )}
      {((episodeId === "brothers" && frame.action === "reunion") ||
        (episodeId === "birth" && frame.action === "walk")) && (
        <div
          className={`film-brothers ${episodeId === "birth" ? "brothers-leaving" : ""}`}
          aria-label="Сегіз ағасы"
        >
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.2}s` }}>
              {i + 1}
            </span>
          ))}
        </div>
      )}
      {frame.label && <span className="film-scene-label">{frame.label}</span>}
    </div>
  );
}
