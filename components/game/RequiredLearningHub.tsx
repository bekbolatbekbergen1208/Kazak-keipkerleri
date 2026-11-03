"use client";
import { accountRequest, answerOnServer } from "@/lib/account-client";
import PlatformIcon from "./PlatformIcon";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Star } from "lucide-react";
import { heroes } from "@/data/content";
import {
  requiredActivities,
  requiredQuestions,
  type RequiredKind,
  type RequiredQuestion,
} from "@/data/required-learning";
import HeroArtwork from "@/components/heroes/HeroArtwork";
import LearningQuestion from "./LearningQuestion";
import { AsykShape } from "./GameArt";
function TaskArt({ question }: { question: RequiredQuestion }) {
  if (question.hero !== undefined)
    return (
      <figure className="required-portrait">
        <HeroArtwork
          src={heroes[question.hero].portrait}
          alt={
            question.caption ??
            "Атын табуға арналған ертегі кейіпкерінің суреті"
          }
        />
        {question.caption && <figcaption>{question.caption}</figcaption>}
      </figure>
    );
  if (question.art === "asyk")
    return (
      <figure className="required-national-art required-asyks">
        {Array.from({ length: 5 }, (_, i) => (
          <AsykShape key={i} />
        ))}
        <figcaption>{question.caption}</figcaption>
      </figure>
    );
  if (question.art === "board")
    return (
      <figure className="required-national-art">
        <div
          className="required-counting-board"
          role="img"
          aria-label="Тоғызқұмалақ тақтасы: әр қатарда тоғыз отау бар"
        >
          {[0, 1].map((row) => (
            <div key={row}>
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i}>
                  <i />
                  <i />
                  <i />
                  <small>{i + 1}</small>
                </span>
              ))}
            </div>
          ))}
        </div>
        <figcaption>{question.caption}</figcaption>
        <small>
          Отау санын танытатын сызба. Құмалақ саны жаттығу үшін азайтылған.
        </small>
      </figure>
    );
  if (question.art === "rope")
    return (
      <figure className="required-national-art">
        <div className="required-rope-art" aria-hidden="true">
          <span>← СОЛ</span>
          <i />
          <span>ОҢ →</span>
        </div>
        <figcaption>{question.caption}</figcaption>
      </figure>
    );
  return null;
}
export default function RequiredLearningHub() {
  const [active, setActive] = useState<RequiredKind | null>(null);
  const [step, setStep] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [finished, setFinished] = useState(false);
  const [completed, setCompleted] = useState<RequiredKind[]>([]);
  const [registered, setRegistered] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [serverSaving, setServerSaving] = useState(false);
  const [serverFailed, setServerFailed] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<number | null>(null);
  const attemptId = useRef("");
  function saveAnswer(kind: RequiredKind, index: number, answer: number) {
    setLastAnswer(answer);
    setServerSaving(true);
    setServerFailed(false);
    setServerMessage("Сақталуда...");
    void answerOnServer(kind, index, answer, attemptId.current)
      .then((result) => {
        setCompleted(result.completed);
        setServerMessage("Жауабың серверге сақталды.");
      })
      .catch(() => {
        setServerFailed(true);
        setServerMessage("Жауап серверге сақталмады. Қайта сақтап көр.");
      })
      .finally(() => setServerSaving(false));
  }
  useEffect(() => {
    let active = true;
    const refresh = () =>
      void accountRequest("session")
        .then((session) => {
          if (active) {
            setRegistered(Boolean(session.user));
            if (session.user) setCompleted(session.completed);
            else {
              try {
                setCompleted(
                  JSON.parse(
                    localStorage.getItem("qazaq-required-learning-v1") ?? "[]",
                  ),
                );
              } catch {
                setCompleted([]);
              }
            }
          }
        })
        .catch(() => {});
    refresh();
    window.addEventListener("qazaq-account-change", refresh);
    return () => {
      active = false;
      window.removeEventListener("qazaq-account-change", refresh);
    };
  }, []);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("qazaq-required-learning-v1") ?? "[]",
      );
      if (Array.isArray(saved))
        setCompleted(
          requiredActivities
            .filter((a) => saved.includes(a.id))
            .map((a) => a.id),
        );
    } catch {}
  }, []);
  function open(kind: RequiredKind) {
    setActive(kind);
    setStep(0);
    setCorrect(false);
    setFinished(false);
    setServerFailed(false);
    setServerMessage("");
  }
  function next() {
    if (!active || !correct) return;
    if (step + 1 < requiredQuestions[active].length) {
      setStep(step + 1);
      setCorrect(false);
    } else {
      setFinished(true);
      const updated = completed.includes(active)
        ? completed
        : [...completed, active];
      setCompleted(updated);
      try {
        localStorage.setItem(
          "qazaq-required-learning-v1",
          JSON.stringify(updated),
        );
      } catch {}
    }
  }
  const activity = requiredActivities.find((a) => a.id === active);
  return (
    <section
      className="required-learning-hub"
      aria-label="Төрт негізгі оқу бөлімі"
    >
      <div className="required-heading">
        <div>
          <span className="eyebrow">СУРЕТ · ҚАСИЕТ · ДӘСТҮР · БІЛІМ</span>
          <h2>Ойнап үйренудің төрт жолы</h2>
          <p>
            Әр бөлімде 6 тапсырма. Қате болса, түсіндірмені оқып, қайта байқап
            көр.
          </p>
        </div>
        <span className="pill">
          <Star size={15} />
          {completed.length} / 4 бөлім
        </span>
      </div>
      <div className="required-activity-grid">
        {requiredActivities.map((item, i) => (
          <button
            key={item.id}
            onClick={() => open(item.id)}
            className={`required-activity required-color-${i} ${active === item.id ? "selected" : ""}`}
            aria-pressed={active === item.id}
          >
            <span className="required-card-icon" aria-hidden="true">
              {<PlatformIcon name={item.icon} />}
            </span>
            <small>0{i + 1} · 6 ТАПСЫРМА</small>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <strong>
              {completed.includes(item.id) ? (
                <>
                  <Check size={16} /> Орындалды · Қайталау
                </>
              ) : (
                <>
                  Бастау <ArrowRight size={16} />
                </>
              )}
            </strong>
          </button>
        ))}
      </div>
      {active && activity && (
        <div
          className="required-task"
          aria-label={activity.title}
          role="region"
        >
          <div className="required-task-top">
            <button className="text-button" onClick={() => setActive(null)}>
              <ArrowLeft size={16} /> Бөлімді жабу
            </button>
            <span>
              {finished ? 6 : step + 1} / {requiredQuestions[active].length}
            </span>
          </div>
          <h2>{activity.title}</h2>
          {registered && (
            <p className="server-learning-status" role="status">
              {serverMessage ||
                "Аккаунтқа қосылды · Нәтижелер серверге жиналады"}
            </p>
          )}
          {finished ? (
            <div className="required-finish">
              <Star size={40} />
              <h3>Жарайсың! 6 тапсырманы орындадың.</h3>
              <p>
                {registered
                  ? "Нәтижелер аккаунтыңа және әкімші статистикасына сақталады."
                  : "Бұл бөлімнің аяқталғаны осы браузерде сақталды. Аккаунтқа кірсең, нәтижелер серверге жиналады."}
              </p>
              <button className="gold-button" onClick={() => open(active)}>
                <RotateCcw size={17} /> Қайта орындау
              </button>
              <button
                className="outline-button"
                onClick={() => setActive(null)}
              >
                Басқа бөлімді таңдау
              </button>
            </div>
          ) : (
            <>
              <TaskArt question={requiredQuestions[active][step]} />
              <LearningQuestion
                key={`${active}-${step}`}
                item={requiredQuestions[active][step]}
                disabled={serverSaving}
                onCorrect={() => setCorrect(true)}
                onAnswer={(answer) => {
                  if (registered) {
                    attemptId.current = crypto.randomUUID();
                    saveAnswer(active, step, answer);
                  }
                }}
              />
              {serverFailed && lastAnswer !== null && (
                <button
                  className="outline-button"
                  onClick={() => saveAnswer(active, step, lastAnswer)}
                >
                  Жауапты қайта сақтау
                </button>
              )}
              <button
                className="gold-button required-next"
                disabled={!correct || serverSaving || serverFailed}
                onClick={next}
              >
                {step + 1 === requiredQuestions[active].length
                  ? "БӨЛІМДІ АЯҚТАУ"
                  : "КЕЛЕСІ ТАПСЫРМА"}
                <ArrowRight size={17} />
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
