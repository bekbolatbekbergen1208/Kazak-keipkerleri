import Image from "next/image";
import { ArrowUpRight, Lock, Sparkles } from "lucide-react";
import type { Hero } from "@/types/game";
export default function HeroCard({
  hero,
  locked = false,
  onClick,
}: {
  hero: Hero;
  index: number;
  locked?: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`hero-card ${locked ? "locked" : ""}`} onClick={onClick}>
      <Image
        src={hero.portrait}
        alt={hero.name}
        width={400}
        height={600}
        sizes="(max-width: 760px) 44vw, (max-width: 1100px) 30vw, 350px"
      />
      <span className="card-top">
        <span>{hero.category}</span>
        {locked ? <Lock size={15} /> : <ArrowUpRight size={17} />}
      </span>
      <div className="card-info">
        <small>
          <Sparkles size={11} />
          {hero.rarity}
        </small>
        <h3>{hero.name}</h3>
        <p>{locked ? `${hero.threshold} XP жинап аш` : hero.ability}</p>
      </div>
    </button>
  );
}
