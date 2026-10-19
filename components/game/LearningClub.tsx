"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Star, Trophy } from "lucide-react";
import HeroArtwork from "@/components/heroes/HeroArtwork";
import { heroes } from "@/data/content";
import {
  dailyActivity,
  learningActivities,
  learningQuestions,
  readingStory,
  type LearningKind,
  type LearningProgress,
} from "@/data/learning";

export function LearningPreview({
  onOpen,
  count,
}: {
  onOpen: () => void;
  count: number;
}) {
  return (
    <section className="learning-preview reference-section">
      <div className="reference-heading">
        <div>
          <span className="reference-kicker">
            3-СЫНЫПҚА АРНАЛҒАН БІЛІМ САЯХАТЫ
          </span>
          <h2>Ойна. Оқы. Жұлдыз жина!</h2>
          <p>Қысқа тапсырманы таңда. Асықпай ойлан. Өз белгіңді ал!</p>
        </div>
        <button className="reference-primary" onClick={onOpen}>
          БАСТАЙЫҚ <ArrowRight size={18} />
        </button>
      </div>
      <div className="learning-preview-cards">
        {learningActivities.map((activity) => (
          <button key={activity.id} onClick={onOpen}>
            <span className="learning-icon" aria-hidden="true">
              {activity.icon}
            </span>
            <strong>{activity.title}</strong>
            <span>{activity.subtitle}</span>
            <ArrowRight size={18} />
          </button>
        ))}
      </div>
      <p className="learning-preview-note">
        <Star size={17} /> Сенің жетістіктерің: {count} / 3 белгі
      </p>
    </section>
  );
}
export default function LearningClub({
  progress,
  date,
  onComplete,
}: {
  progress: LearningProgress;
  date: string;
  onComplete: (kind: LearningKind) => void;
}) {
  const [kind, setKind] = useState<LearningKind | null>(null);
  const [step, setStep] = useState(0);
  const [reading, setReading] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const today = dailyActivity(date);
  const activity = learningActivities.find((a) => a.id === kind);
  const question = kind ? learningQuestions[kind][step] : null;
  const correct = answer !== null && answer === question?.answer;
  function open(next: LearningKind) {
    setKind(next);
    setStep(0);
    setAnswer(null);
    setFinished(false);
    setReading(next === "story");
  }
  function next() {
    if (!kind || !correct) return;
    if (step + 1 === learningQuestions[kind].length) {
      onComplete(kind);
      setFinished(true);
    } else {
      setStep((n) => n + 1);
      setAnswer(null);
    }
  }
  if (!kind)
    return (
      <section className="content-section learning-club">
        <div className="eyebrow">3-СЫНЫП · АСЫҚПАЙ ҮЙРЕНЕМІЗ</div>
        <h1 className="page-title">Білім саяхаты</h1>
        <p className="learning-intro">
          Сәлем, жас қаһарман! Бүгін қандай жаңалық ашамыз? Бір тапсырманы
          таңда.
        </p>
        <div className="learning-daily">
          <span className="learning-icon" aria-hidden="true">
            ☀️
          </span>
          <div>
            <strong>Бүгінгі тапсырма</strong>
            <p>
              {learningActivities.find((a) => a.id === today)?.title} · Күннің
              қосымша сыйлығы: +20 XP
            </p>
          </div>
          {progress.dailyDates.includes(date) ? (
            <span className="learning-done">
              <Check size={18} /> Орындалды
            </span>
          ) : (
            <button className="gold-button" onClick={() => open(today)}>
              БАСТАУ <ArrowRight size={18} />
            </button>
          )}
        </div>
        <div className="learning-activity-grid">
          {learningActivities.map((a) => (
            <article key={a.id} className="learning-activity">
              <span className="learning-icon" aria-hidden="true">
                {a.icon}
              </span>
              <h2>{a.title}</h2>
              <p>{a.subtitle}</p>
              <span className="learning-small-reward">
                {progress.completed.includes(a.id)
                  ? "Белгі жиналды · Қайта ойнай аласың"
                  : "+40 XP · +10 тиын · Жаңа белгі"}
              </span>
              <button className="gold-button" onClick={() => open(a.id)}>
                {progress.completed.includes(a.id) ? "ҚАЙТА ОЙНАУ" : "ОЙНАУ"}
                <ArrowRight size={18} />
              </button>
            </article>
          ))}
        </div>
        <div className="section-heading learning-badges-heading">
          <div>
            <div className="eyebrow">ӘР ЖЕТІСТІК — БІР ЖҰЛДЫЗ</div>
            <h2>Менің белгілерім</h2>
          </div>
          <span className="pill">{progress.completed.length} / 3</span>
        </div>
        <div className="learning-badges">
          {learningActivities.map((a) => (
            <div
              key={a.id}
              className={`learning-badge ${progress.completed.includes(a.id) ? "earned" : ""}`}
            >
              <div className="learning-badge-art">
                <HeroArtwork
                  src={heroes[a.hero].portrait}
                  alt={heroes[a.hero].name}
                />
              </div>
              <strong>{a.badge}</strong>
              <span>
                {progress.completed.includes(a.id)
                  ? "★ Жарайсың! Белгі сенікі."
                  : "Тапсырманы аяқтап, белгіні ал"}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  return (
    <section className="content-section learning-club">
      <button
        className="text-button learning-back"
        onClick={() => setKind(null)}
      >
        <ArrowLeft size={18} /> Тапсырмаларға оралу
      </button>
      <div className="learning-play-card">
        {finished ? (
          <div className="learning-finish">
            <span className="learning-finish-star" aria-hidden="true">
              🌟
            </span>
            <h1>Жарайсың, жас қаһарман!</h1>
            <p>
              Барлық сұрақты шештің. «{activity?.badge}» белгісі сенің
              жинағыңда!
            </p>
            <div className="learning-finish-art">
              <HeroArtwork
                src={heroes[activity!.hero].portrait}
                alt={heroes[activity!.hero].name}
              />
            </div>
            <button className="gold-button" onClick={() => setKind(null)}>
              БЕЛГІЛЕРІМДІ КӨРУ <Trophy size={18} />
            </button>
          </div>
        ) : reading ? (
          <>
            <span className="eyebrow">БІРГЕ ОҚИЫҚ</span>
            <h1>{readingStory.title}</h1>
            <div className="learning-story">
              {readingStory.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <p className="learning-story-note">{readingStory.note}</p>
            <button className="gold-button" onClick={() => setReading(false)}>
              ОҚЫДЫМ, СҰРАҚТАРҒА ӨТУ <ArrowRight size={18} />
            </button>
          </>
        ) : (
          question && (
            <>
              <div className="learning-question-top">
                <span className="eyebrow">{activity?.title}</span>
                <span>
                  Сұрақ {step + 1} / {learningQuestions[kind].length}
                </span>
              </div>
              <progress
                className="learning-progress"
                value={step}
                max={learningQuestions[kind].length}
                aria-label="Тапсырма барысы"
              />
              <h1 className="learning-question">{question.question}</h1>
              <div className="learning-answers">
                {question.options.map((option, i) => (
                  <button
                    key={option}
                    className={
                      answer === i ? (correct ? "right" : "try-again") : ""
                    }
                    disabled={correct}
                    onClick={() => setAnswer(i)}
                  >
                    <span>{["А", "Ә", "Б"][i]}</span>
                    {option}
                    {answer === i && correct && <Check size={22} />}
                  </button>
                ))}
              </div>
              <div className="learning-feedback" role="status">
                {answer === null
                  ? "Жауапты таңда. Уақыт жеткілікті!"
                  : correct
                    ? `Дұрыс! ${question.explanation}`
                    : "Жақсы талпыныс! Тағы ойланып, басқа жауапты таңда."}
              </div>
              {kind === "story" && (
                <details className="learning-reread">
                  <summary>Әңгімені қайта оқығым келеді</summary>
                  {readingStory.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </details>
              )}
              {correct && (
                <button className="gold-button" onClick={next}>
                  {step + 1 === learningQuestions[kind].length
                    ? "БЕЛГІНІ АЛУ"
                    : "КЕЛЕСІ СҰРАҚ"}
                  <ArrowRight size={18} />
                </button>
              )}
            </>
          )
        )}
      </div>
    </section>
  );
}
