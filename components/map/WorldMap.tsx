import { Lock, Compass, Flag, Mountain } from "lucide-react";
import { regions } from "@/data/content";
export default function WorldMap({
  xp,
  onSelect,
}: {
  xp: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="world-map">
      <div className="map-vignette" />
      <svg
        className="map-paths"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
      >
        <path
          d="M290 348Q310 140 500 204T710 330Q620 500 440 462M710 330Q920 330 830 144"
          fill="none"
          stroke="#d6bc83"
          strokeWidth="2"
          strokeDasharray="5 9"
          opacity=".6"
        />
      </svg>
      <div className="map-caption">
        <Compass size={22} />
        <span>
          ҰЛЫ ДАЛА
          <br />
          <small>Аңыздар картасы</small>
        </span>
      </div>
      {regions.map((r, i) => (
        <button
          key={r.name}
          className={`map-node ${xp < r.xp ? "node-locked" : "node-open"}`}
          style={{ left: `${r.x}%`, top: `${r.y}%` }}
          onClick={() => onSelect(i)}
          aria-label={`${r.name}, ${xp < r.xp ? `${r.xp} XP қажет` : "ашық"}`}
        >
          <span className="node-orb">
            {xp < r.xp ? (
              <Lock size={19} />
            ) : i === 0 ? (
              <Flag size={20} />
            ) : (
              <Mountain size={20} />
            )}
          </span>
          <span className="node-label">
            {r.name}
            <small>{xp < r.xp ? `${r.xp} XP` : "ЗЕРТТЕУ"}</small>
          </span>
        </button>
      ))}
      <span className="map-coordinate">
        43° N · 68° E <span>✦</span> ҰЛЫ ДАЛА
      </span>
    </div>
  );
}
