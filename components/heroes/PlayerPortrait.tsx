import type { Player } from "@/types/game";
const equipmentSymbols: Record<string, string> = {
  Садақ: "⌒",
  Қалқан: "⬡",
  Домбыра: "♫",
  Кітап: "▤",
  Қылыш: "†",
  Қамшы: "〰",
};
export default function PlayerPortrait({ player }: { player: Player }) {
  const coat =
    player.outfit === "Жасыл шапан"
      ? "#39836b"
      : player.outfit === "Алтын шапан"
        ? "#b39549"
        : "#387a99";
  return (
    <svg
      className="player-portrait"
      viewBox="0 0 400 520"
      role="img"
      aria-label={`${player.name}: ${player.outfit}, ${player.headwear}, ${player.equipment}`}
    >
      <image href={`/art/hero-${player.avatar}.svg`} width="400" height="520" />
      <path
        d="M65 335 108 303l35 217H40Zm270 0-43-32-35 217h103Z"
        fill={coat}
        opacity=".8"
      />
      {player.armor === "Темір" && (
        <path d="M163 322h74l-9 134h-56Z" fill="#96a6a6" opacity=".75" />
      )}
      {player.armor === "Былғары" && (
        <path d="M163 322h74l-9 134h-56Z" fill="#806044" opacity=".85" />
      )}
      {player.hair === "Ұзын" && (
        <g fill="#20292a">
          <path d="M139 154 126 287l27-20 2-94ZM261 154l13 133-27-20-2-94Z" />
        </g>
      )}
      {player.hair === "Өрілген" && (
        <g fill="none" stroke="#222b2b" strokeWidth="12">
          <path d="M143 168q-20 25-5 40t-5 40 2 38M257 168q20 25 5 40t5 40-2 38" />
        </g>
      )}
      {player.headwear === "Тақия" && (
        <g>
          <path d="M130 159q1-48 70-61 69 13 70 61Z" fill={coat} />
          <path d="M130 157h140" stroke="#d5b57b" strokeWidth="10" />
          <path
            d="M168 128q32-27 64 0"
            stroke="#d5b57b"
            fill="none"
            strokeWidth="3"
          />
        </g>
      )}
      {player.headwear === "Бөрік" && (
        <g>
          <path d="M132 152q10-56 68-67 58 11 68 67Z" fill="#8b6c50" />
          <path
            d="M128 153h144"
            stroke="#463c32"
            strokeWidth="25"
            strokeLinecap="round"
          />
        </g>
      )}
      {player.accessory === "Тұмар" && (
        <>
          <path
            d="M170 283q30 38 60 0"
            fill="none"
            stroke="#d5b57b"
            strokeWidth="2"
          />
          <path d="m200 316-13 20h26Z" fill="#d5b57b" />
        </>
      )}
      {player.accessory === "Білезік" && (
        <path d="m58 440 55 9m229-9-55 9" stroke="#d5b57b" strokeWidth="14" />
      )}
      {player.accessory === "Белдік" && (
        <path d="M120 471h160v24H120Z" fill="#d5b57b" />
      )}
      <g transform="translate(313 401)">
        <circle r="35" fill="#142932" stroke="#d5b57b" strokeWidth="2" />
        <text y="13" textAnchor="middle" fontSize="43" fill="#d5b57b">
          {equipmentSymbols[player.equipment]}
        </text>
      </g>
    </svg>
  );
}
