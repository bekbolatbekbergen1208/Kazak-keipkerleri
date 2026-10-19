"use client";
import { useEffect, useRef, useState } from "react";
import { NationalGamesShelf } from "./national/NationalGames";
import type { NationalKind } from "@/data/national-games";
import { LearningPreview } from "./LearningClub";
import ProductArtwork from "./ProductArtwork";
import HeroArtwork from "@/components/heroes/HeroArtwork";
import { ArrowRight, BookOpen, Gamepad2, X, Expand, Star } from "lucide-react";
import { heroes } from "@/data/content";
import type { Hero } from "@/types/game";

const products = [
  {
    title: "Ойыншықтар",
    image: "image11.jpeg",
    text: "Сүйікті қаһарманың әрдайым жаныңда.",
  },
  {
    title: "Боямақ",
    image: "image14.png",
    text: "Қаһармандарға өз түсіңді бер.",
  },
  {
    title: "Фишкалар",
    image: "image15.png",
    text: "Алты кейіпкерді бір коллекцияға жина.",
  },
  {
    title: "Футболка",
    image: "image16.jpeg",
    text: "Ұлттық кейіпкерлерді күнделікті өмірге қос.",
  },
  {
    title: "Стикерлер",
    image: "image17.png",
    text: "Достарыңмен қаһармандар бейнесін бөліс.",
  },
];

export default function PresentationHome({
  started,
  ready,
  onStart,
  onHeroes,
  onLearn,
  onNational,
  completed,
  onAcademy,
  badgeCount,
  onPickCharacter,
}: {
  started: boolean;
  ready: boolean;
  onStart: () => void;
  onHeroes: () => void;
  onLearn: (hero: Hero) => void;
  onNational: (kind: NationalKind) => void;
  completed: string[];
  onAcademy: () => void;
  badgeCount: number;
  onPickCharacter: () => void;
}) {
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof products)[number] | null
  >(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selectedProduct) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selectedProduct]);
  return (
    <div className="presentation-home">
      <section className="reference-cover">
        <div className="reference-copy">
          <span className="reference-kicker">
            3-СЫНЫП ОҚУШЫЛАРЫНА АРНАЛҒАН ОЙЫН ӘЛЕМІ
          </span>
          <h1>
            Қазақ
            <br />
            <span>қаһармандары</span>
          </h1>
          <p>
            Ер Төстік пен оның достарына қосыл! Ұлттық ойындарды ойна, ертегі
            оқы, қызықты сұрақтарға жауап бер. Әр жаңалық үшін өз жұлдызыңды
            жина!
          </p>
          <div className="reference-actions">
            <button
              className="reference-primary"
              onClick={onStart}
              disabled={!ready}
            >
              <Gamepad2 size={20} />
              {started ? "ОЙЫНДАРҒА ОРАЛУ" : "ОЙЫНДЫ БАСТАУ"}
              <ArrowRight size={18} />
            </button>
            <button
              className="mobile-learn-button outline-button"
              onClick={onAcademy}
              disabled={!ready}
            >
              <Star size={19} /> БІЛІМ САЯХАТЫ
            </button>
            <a href="#characters">
              <BookOpen size={19} />
              Кейіпкерлерді таны
            </a>
          </div>
          <p className="mobile-guest-note">
            Тіркелмей ойнай бер. Жетістіктерің осы телефонда сақталады.
          </p>
          <button
            className="text-button home-character-pick"
            onClick={onPickCharacter}
            disabled={!ready}
          >
            ӨЗ КЕЙІПКЕРІҢДІ ТАҢДА <ArrowRight size={18} />
          </button>
          <div className="reference-note">
            <strong>6 қаһарман</strong>
            <span>Бір ертегі. Ортақ мақсат. Берік достық.</span>
          </div>
        </div>
        <div
          className="reference-team"
          aria-label="Презентациядағы қазақ қаһармандары"
        >
          <span className="team-caption">ЕР ТӨСТІК ЖӘНЕ ОНЫҢ ДОСТАРЫ</span>
          {heroes.map((hero, i) => (
            <button
              key={hero.id}
              className={`team-person team-person-${i}`}
              onClick={() => onLearn(hero)}
              aria-label={`${hero.name} туралы біл`}
            >
              <span className="team-artwork">
                <HeroArtwork
                  src={hero.portrait}
                  alt={hero.name}
                  priority={i < 3}
                />
              </span>
              <span>{hero.name}</span>
            </button>
          ))}
        </div>
      </section>
      <div className="reference-ribbon">
        <span>БАТЫЛДЫҚ</span>
        <span>ДОСТЫҚ</span>
        <span>ОТАНСҮЙГІШТІК</span>
        <span>ҚҰРМЕТ</span>
        <span>АДАЛДЫҚ</span>
      </div>
      <LearningPreview onOpen={onAcademy} count={badgeCount} />
      <section className="home-national-games" id="games">
        <NationalGamesShelf
          onSelect={onNational}
          completed={completed}
          ready={ready}
        />
      </section>
      <section className="reference-section" id="characters">
        <div className="reference-heading">
          <div>
            <span className="reference-kicker">ЕРТЕГІДЕН БҮГІНГІ КҮНГЕ</span>
            <h2>Алты ерекше қаһарман</h2>
          </div>
          <button onClick={onHeroes}>
            Барлығын таны <ArrowRight size={18} />
          </button>
        </div>
        <div className="reference-characters">
          {heroes.map((hero, i) => (
            <button
              key={hero.id}
              className={`reference-character character-${i}`}
              onClick={() => onLearn(hero)}
            >
              <div className="reference-portrait">
                <span className="character-number">0{i + 1}</span>
                <HeroArtwork src={hero.portrait} alt={hero.name} />
              </div>
              <div className="reference-character-copy">
                <h3>{hero.name}</h3>
                <p>{hero.ability}</p>
                <span>
                  Қаһарманды таны <ArrowRight size={16} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="reference-research" id="research">
        <div>
          <span className="reference-kicker">ҒЫЛЫМИ ЖОБА</span>
          <h2>
            Қазақ ертегілерінің кейіпкерлерін насихаттаудың заманауи жолдары
          </h2>
          <p>
            Жобаның мақсаты — қазақ ертегілеріндегі кейіпкерлерді танытудың
            заманауи жолдарын ұсыну.
          </p>
          <div className="research-author">
            <strong>Болатбай Расул Рзабекұлы</strong>
            <span>«Жайсаң Бала-2» жеке мектеп-гимназиясы · 2-сынып</span>
            <span>Жетекші: Тасыбек Дина Мухтархановна</span>
          </div>
        </div>
        <div className="research-steps">
          <article>
            <span>01</span>
            <div>
              <h3>Кейіпкерлерді салыстыру</h3>
              <p>
                Ер Төстік пен Америка капитанына елін қорғау мақсаты ортақ.
                Таусоғар мен Халктың ұқсастығы — алапат күш.
              </p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>Заманауи образ жасау</h3>
              <p>
                Ұлттық ерекшелікті сақтай отырып, алты кейіпкерді балаларға жаңа
                бейнеде таныстыру.
              </p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>Күнделікті өмірге енгізу</h3>
              <p>
                Ойын, боямақ, ойыншық пен стикер арқылы қазақ ертегілеріне
                қызығушылықты арттыру.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className="reference-section" id="collection">
        <div className="reference-heading">
          <div>
            <span className="reference-kicker">
              ҰЛТТЫҚ МӘДЕНИЕТ — КҮНДЕЛІКТІ ӨМІРДЕ
            </span>
            <h2>Ертегімен бірге өсеміз</h2>
            <p>Ғылыми жобада ұсынылған «Қазақ қаһармандары» топтамасы</p>
          </div>
        </div>
        <div className="reference-products">
          {products.map((product) => (
            <article key={product.title}>
              <button
                className="product-preview"
                onClick={() => setSelectedProduct(product)}
                aria-label={`${product.title} үлгісін үлкейтіп ашу`}
              >
                <ProductArtwork
                  image={product.image}
                  title={`${product.title} үлгісі`}
                />
                <span className="product-expand">
                  <Expand size={15} /> Үлкейту
                </span>
              </button>
              <h3>{product.title}</h3>
              <p>{product.text}</p>
            </article>
          ))}
        </div>
      </section>
      <dialog
        ref={dialog}
        className="product-dialog"
        onCancel={() => setSelectedProduct(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelectedProduct(null);
        }}
      >
        {selectedProduct && (
          <>
            <div className="product-dialog-heading">
              <h2>{selectedProduct.title}</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                aria-label="Үлгіні жабу"
              >
                <X size={24} />
              </button>
            </div>
            <div className="product-dialog-art">
              <ProductArtwork
                image={selectedProduct.image}
                title={`${selectedProduct.title} үлгісі`}
              />
            </div>
          </>
        )}
      </dialog>
      <section className="reference-future">
        <span className="reference-kicker">ЖОБАНЫҢ ҰСЫНЫСЫ</span>
        <h2>Қазақ қаһармандары экранда</h2>
        <p>
          Ұлттық құндылықтарды дәріптейтін анимациялық мультфильм. Кейіпкерлер
          балаларға отансүйгіштік, адамгершілік пен адалдықты өз іс-әрекеттері
          арқылы түсіндіреді.
        </p>
        <button
          className="reference-primary"
          onClick={onStart}
          disabled={!ready}
        >
          Қаһармандармен бірге ойна <ArrowRight size={18} />
        </button>
      </section>
    </div>
  );
}
