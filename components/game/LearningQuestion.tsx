"use client";
import { useState } from "react";
import type { LearningQuestion as Question } from "@/data/game-learning";
export default function LearningQuestion({
  item,
  onCorrect,
  onAnswer,
  disabled = false,
}: {
  item: Question;
  onCorrect?: () => void;
  onAnswer?: (answer: number) => void;
  disabled?: boolean;
}) {
  const [choice, setChoice] = useState<number | null>(null);
  const correct = choice === item.answer;
  return (
    <div className="learning-question">
      <h3>{item.question}</h3>
      <div className="learning-options">
        {item.options.map((option, i) => (
          <button
            key={option}
            type="button"
            disabled={correct || disabled}
            aria-pressed={choice === i}
            className={
              choice === i ? (correct ? "answer-correct" : "answer-retry") : ""
            }
            onClick={() => {
              setChoice(i);
              onAnswer?.(i);
              if (i === item.answer) onCorrect?.();
            }}
          >
            <span>{String.fromCharCode(65 + i)}</span>
            {option}
          </button>
        ))}
      </div>
      {choice !== null && (
        <p
          role="status"
          className={correct ? "learning-correct" : "learning-retry"}
        >
          {correct
            ? `Дұрыс! ${item.explanation}`
            : "Тағы ойланып көр. Қате жауап үшін ұпай кемімейді."}
        </p>
      )}
    </div>
  );
}
