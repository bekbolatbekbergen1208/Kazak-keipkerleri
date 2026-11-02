"use client";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Heart,
  Minus,
  Plus,
  Search,
} from "lucide-react";
import { tales, taleTypes } from "@/data/tales";
import type { AdventureProgress } from "@/data/adventure";
export default function FairyLibrary({
  progress,
  onRead,
  onFavorite,
  onAdventure,
}: {
  progress: AdventureProgress;
  onRead: (id: string) => void;
  onFavorite: (id: string) => void;
  onAdventure: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [filter, setFilter] = useState("Барлығы");
  const [search, setSearch] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [font, setFont] = useState(21);
  const tale = tales.find((t) => t.id === selected);
  if (tale) {
    const quiz = page === tale.pages.length;
    const correct = answer === tale.correct;
    return (
      <section className="content-section fairy-library">
        <button className="text-button" onClick={() => setSelected(null)}>
          <ArrowLeft size={18} />
          Кітапханаға оралу
        </button>
        <article className="tale-reader">
          <div className="tale-reader-top">
            <span className="pill">{tale.type}</span>
            <div className="reader-font">
              <button
                aria-label="Мәтінді кішірейту"
                disabled={font === 18}
                onClick={() => setFont((n) => n - 1)}
              >
                <Minus size={18} />
              </button>
              <span>Аа</span>
              <button
                aria-label="Мәтінді үлкейту"
                disabled={font === 26}
                onClick={() => setFont((n) => n + 1)}
              >
                <Plus size={18} />
              </button>
            </div>
            <button
              className="tale-favorite"
              aria-label="Таңдаулыға сақтау"
              aria-pressed={progress.favorites.includes(tale.id)}
              onClick={() => onFavorite(tale.id)}
            >
              <Heart
                size={22}
                fill={
                  progress.favorites.includes(tale.id) ? "currentColor" : "none"
                }
              />
            </button>
          </div>
          <h1>{tale.title}</h1>
          <p className="story-disclaimer">{tale.label}</p>
          <div
            className="reader-page-dots"
            aria-label={`Бет ${page + 1} / ${tale.pages.length + 1}`}
          >
            {Array.from({ length: tale.pages.length + 1 }, (_, i) => (
              <span key={i} className={i <= page ? "active" : ""} />
            ))}
          </div>
          {!quiz ? (
            <>
              <span className="eyebrow">{page + 1}-БЕТ</span>
              <h2>{tale.pages[page].title}</h2>
              <div className="tale-reader-text" style={{ fontSize: font }}>
                <p>{tale.pages[page].text}</p>
              </div>
            </>
          ) : (
            <>
              <span className="eyebrow">БІРГЕ ОЙЛАНАЙЫҚ</span>
              <h2>{tale.question}</h2>
              <div className="learning-answers">
                {tale.answers.map((a, i) => (
                  <button
                    key={a}
                    className={
                      answer === i ? (correct ? "right" : "try-again") : ""
                    }
                    disabled={correct}
                    onClick={() => setAnswer(i)}
                  >
                    <span>{["А", "Ә", "Б"][i]}</span>
                    {a}
                  </button>
                ))}
              </div>
              {answer !== null && (
                <p className="learning-feedback" role="status">
                  {correct
                    ? `Дұрыс! ${tale.lesson}`
                    : "Тағы ойланып көр. Алдыңғы беттерді қайта оқуға болады."}
                </p>
              )}
              <div className="tale-glossary">
                <h3>Сөз сандығы</h3>
                {tale.glossary.map(([word, meaning]) => (
                  <p key={word}>
                    <strong>{word}</strong> — {meaning}
                  </p>
                ))}
              </div>
              {correct && (
                <button
                  className="gold-button"
                  onClick={() => {
                    onRead(tale.id);
                    setSelected(null);
                  }}
                >
                  ОҚЫП БОЛДЫМ{" "}
                  {progress.readTales.includes(tale.id) ? (
                    <Check size={18} />
                  ) : (
                    <span>+15 XP</span>
                  )}
                </button>
              )}
            </>
          )}
          <div className="reader-navigation">
            <button
              className="outline-button"
              disabled={page === 0}
              onClick={() => {
                setPage((n) => n - 1);
                setAnswer(null);
              }}
            >
              <ArrowLeft size={18} />
              АЛДЫҢҒЫ
            </button>
            <span>
              {page + 1} / {tale.pages.length + 1}
            </span>
            {!quiz && (
              <button
                className="gold-button"
                onClick={() => {
                  setPage((n) => n + 1);
                  setAnswer(null);
                }}
              >
                КЕЛЕСІ <ArrowRight size={18} />
              </button>
            )}
          </div>
          {tale.source && (
            <a
              className="tale-source"
              href={tale.source.url}
              target="_blank"
              rel="noreferrer"
            >
              Дереккөз: {tale.source.title} ↗
            </a>
          )}
        </article>
      </section>
    );
  }
  const filtered = tales.filter(
    (t) =>
      (filter === "Барлығы" || t.type === filter) &&
      (!onlyFavorites || progress.favorites.includes(t.id)) &&
      `${t.title} ${t.summary}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase().trim()),
  );
  return (
    <section className="content-section fairy-library">
      <div className="eyebrow">ОҚЫ · ТҮСІН · ОЙЛАН</div>
      <h1 className="page-title">Ертегілер кітапханасы</h1>
      <p className="story-lead">
        Ертегі — қиялға қанат бітіретін әңгіме. Одан достықты, ақылды және жақсы
        әрекетті танимыз.
      </p>
      <a className="full-tale-entry" href="/ertostik/full"><BookOpen size={24}/><span><strong>Ер Төстік — толық мәтін және дыбыстау</strong><small>Ертегіні қысқартусыз оқы немесе қазақша тыңда</small></span><ArrowRight size={20}/></a>
      <div className="tale-types">
        {taleTypes.map((type) => (
          <button
            key={type.title}
            className={filter === type.title ? "active" : ""}
            onClick={() => setFilter(type.title)}
          >
            <span aria-hidden="true">{type.icon}</span>
            <h2>{type.title}</h2>
            <p>{type.text}</p>
          </button>
        ))}
      </div>
      <p className="tale-classification-source">
        Ертегі түрлері туралы:{" "}
        <a
          href="https://itest.kz/kz/ent/qazaq-adebieti/halyq-auyz-adebieti/lecture/ertegiler-angyz-anggimeler"
          target="_blank"
          rel="noreferrer"
        >
          iTest оқу материалы ↗
        </a>
      </p>
      <div className="library-toolbar">
        <label className="tale-search">
          <Search size={19} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ертегіні ізде"
            aria-label="Ертегіні іздеу"
          />
        </label>
        <select
          aria-label="Ертегі түрі"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {["Барлығы", ...taleTypes.map((t) => t.title)].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <button
          className={`outline-button ${onlyFavorites ? "favorite-filter-active" : ""}`}
          aria-pressed={onlyFavorites}
          onClick={() => setOnlyFavorites(!onlyFavorites)}
        >
          <Heart size={18} />
          ТАҢДАУЛЫ
        </button>
      </div>
      <div className="library-read-count">
        <BookOpen size={18} /> Оқылғаны: {progress.readTales.length} /{" "}
        {tales.length}
      </div>
      <div className="tale-book-grid">
        {filtered.map((t) => (
          <article key={t.id} className="tale-book">
            <div className={`tale-book-cover book-${t.id}`}>
              <span aria-hidden="true">{t.icon}</span>
              <small>{t.type}</small>
              <strong>{t.title}</strong>
              <button
                aria-label={`${t.title}: таңдаулыға сақтау`}
                aria-pressed={progress.favorites.includes(t.id)}
                onClick={() => onFavorite(t.id)}
              >
                <Heart
                  size={20}
                  fill={
                    progress.favorites.includes(t.id) ? "currentColor" : "none"
                  }
                />
              </button>
            </div>
            <div className="tale-book-copy">
              <small>{t.label}</small>
              <h2>{t.title}</h2>
              <p>{t.summary}</p>
              <div>
                <span>
                  {progress.readTales.includes(t.id)
                    ? "✓ Оқылған"
                    : "3 шағын бет · 1 сұрақ"}
                </span>
                <button
                  className="gold-button"
                  onClick={() => {
                    setSelected(t.id);
                    setPage(0);
                    setAnswer(null);
                  }}
                >
                  ОҚУ <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="library-empty">
          <BookOpen size={36} />
          <h2>Бұл жерде әзірге ертегі жоқ</h2>
          <p>Іздеуді өзгертіп немесе барлық ертегіні ашып көр.</p>
          <button
            className="outline-button"
            onClick={() => {
              setSearch("");
              setFilter("Барлығы");
              setOnlyFavorites(false);
            }}
          >
            БАРЛЫҒЫН КӨРУ
          </button>
        </div>
      )}
      <div className="library-next">
        <div>
          <h2>Ертегінің ішінде өзің ойнағың келе ме?</h2>
          <p>
            «Ер Төстік» ертегісінің оқиғаларын анимациялық көріністер арқылы
            бастан-аяқ тамашала.
          </p>
        </div>
        <button className="gold-button" onClick={onAdventure}>
          СЮЖЕТКЕ ӨТУ <ArrowRight size={18} />
        </button>
      </div>
      <details className="family-guide">
        <summary>Ата-ана мен мұғалімге</summary>
        <p>
          Бір қысқа мәтінді баламен бірге оқып, негізгі ойды өз сөзімен айтуды
          сұраңыз. Содан кейін бір ойын таңдаңыз. Дұрыс жауапқа асықтырмай,
          «Неге олай ойлайсың?» деп талқылаңыз.
        </p>
        <p>
          Мәтіндер қысқартылған таныстыру және арнайы жазылған жаңа әңгімелер
          ретінде белгіленді. Оқылған ертегі, сюжет тараулары және таңдалған
          кейіпкер осы браузердегі профильде сақталады.
        </p>
      </details>
    </section>
  );
}
