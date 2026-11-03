import PlatformIcon from "./PlatformIcon";
import { ArrowRight, BookOpen, Compass } from "lucide-react";
import HeroArtwork from "@/components/heroes/HeroArtwork";
import { tostikEpisodes, tostikSource } from "@/data/tostik";
import { heroes } from "@/data/content";
export default function StoryPortal({
  completed,
  onAdventure,
  onLibrary,
}: {
  completed: number;
  onAdventure: () => void;
  onLibrary: () => void;
}) {
  return (
    <section className="story-home-portal">
      <div className="story-portal-copy">
        <span className="reference-kicker">ХАЛЫҚ ЕРТЕГІСІНІҢ ЖЕЛІСІМЕН</span>
        <h2>Ер Төстік: анимациялық ертегі</h2>
        <p>
          Төстіктің дүниеге келуінен елге оралуына дейінгі оқиғаларды қимылды
          көріністер арқылы тамашала. Ертегіні тоқтатып, кез келген эпизодты
          қайта көре аласың.
        </p>
        <div className="story-portal-actions">
          <button className="reference-primary" onClick={onAdventure}>
            <Compass size={19} />
            {completed ? "СЮЖЕТТІ ЖАЛҒАСТЫРУ" : "СЮЖЕТТІ БАСТАУ"}
            <ArrowRight size={18} />
          </button>
          <button className="outline-button" onClick={onLibrary}>
            <BookOpen size={19} />
            ЕРТЕГІ ОҚУ
          </button>
        </div>
        <a
          className="portal-source-link"
          href={tostikSource.url}
          target="_blank"
          rel="noreferrer"
        >
          Ертегінің толық мәтіні ↗
        </a>
        <span className="story-portal-meta">
          {tostikEpisodes.length} эпизод · {completed} эпизод көрілді
        </span>
      </div>
      <div className="story-portal-art">
        {[0, 1, 2].map((i) => (
          <span key={i}>
            <HeroArtwork src={heroes[i].portrait} alt={heroes[i].name} />
          </span>
        ))}
        <div className="story-open-book" aria-hidden="true">
          {<PlatformIcon name="book" />}
        </div>
      </div>
    </section>
  );
}
