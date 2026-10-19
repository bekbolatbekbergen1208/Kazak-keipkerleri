"use client";
import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { heroes } from "@/data/content";
import HeroArtwork from "./HeroArtwork";

export default function CharacterPicker({
  current,
  onSave,
}: {
  current: string | null;
  onSave: (id: string) => void;
}) {
  const [selected, setSelected] = useState(current ?? heroes[0].id);
  return (
    <div className="character-picker">
      <div className="eyebrow">СЕНІҢ САЯХАТЫҢ — СЕНІҢ ТАҢДАУЫҢ</div>
      <h2>Өз кейіпкеріңді таңда</h2>
      <p>
        Қай қаһарманмен бірге ойнағың келеді? Барлық алты кейіпкерді еркін
        таңдай аласың.
      </p>
      <div className="character-picker-grid">
        {heroes.map((hero) => (
          <button
            key={hero.id}
            aria-pressed={selected === hero.id}
            className={selected === hero.id ? "selected" : ""}
            onClick={() => setSelected(hero.id)}
          >
            <span className="character-picker-art">
              <HeroArtwork src={hero.portrait} alt={hero.name} />
            </span>
            <strong>{hero.name}</strong>
            <small>{hero.ability}</small>
            {selected === hero.id && (
              <span className="character-picked">
                <Check size={16} /> Таңдалды
              </span>
            )}
          </button>
        ))}
      </div>
      <button
        className="gold-button character-save"
        onClick={() => onSave(selected)}
      >
        ОСЫ КЕЙІПКЕРДІ ТАҢДАУ <ArrowRight size={18} />
      </button>
      <p className="muted">Кейіпкерді кейін профильден ауыстыра аласың.</p>
    </div>
  );
}
