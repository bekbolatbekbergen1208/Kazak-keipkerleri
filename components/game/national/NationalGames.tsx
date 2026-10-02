"use client";
import { nationalGames, type NationalKind } from "@/data/national-games";
import { ArrowUpRight, Check, Coins, Zap } from "lucide-react";
import Togyzqumalaq from "./Togyzqumalaq";
import AsykAtu from "./AsykAtu";
import TengeIlu from "./TengeIlu";
export function NationalGamesShelf({
  onSelect,
  completed,
}: {
  onSelect: (kind: NationalKind) => void;
  completed: string[];
}) {
  return (
    <section className="national-section">
      <div className="section-heading">
        <div>
          <div className="eyebrow">ДАЛАНЫҢ ОЙЫН ДӘСТҮРІ</div>
          <h2>Ұлттық ойындар</h2>
          <p>Ақылыңды, мергендігіңді және ептілігіңді сына.</p>
        </div>
        <span className="pill">3 ОЙЫН</span>
      </div>
      <div className="national-grid">
        {nationalGames.map((g) => (
          <button
            key={g.id}
            className={`national-card national-${g.id}`}
            onClick={() => onSelect(g.id)}
          >
            <span className="national-symbol">{g.symbol}</span>
            <small>{g.subtitle}</small>
            <h3>{g.name}</h3>
            <p>{g.description}</p>
            <div className="reward-line">
              {completed.includes(g.id) ? (
                <span>
                  <Check size={14} />
                  Сыйлық алынды
                </span>
              ) : (
                <>
                  <span>
                    <Zap size={14} />+{g.xp} XP
                  </span>
                  <span>
                    <Coins size={14} />+{g.coins}
                  </span>
                </>
              )}
              <ArrowUpRight size={17} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
export default function NationalGame({
  kind,
  onComplete,
}: {
  kind: NationalKind;
  onComplete: () => void;
}) {
  return kind === "togyz" ? (
    <Togyzqumalaq onComplete={onComplete} />
  ) : kind === "asyk" ? (
    <AsykAtu onComplete={onComplete} />
  ) : (
    <TengeIlu onComplete={onComplete} />
  );
}
