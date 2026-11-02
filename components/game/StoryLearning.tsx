"use client";
import { useState } from "react";
import { BookOpen, ExternalLink } from "lucide-react";
import { tostikEpisodes, tostikSource } from "@/data/tostik";
import { storyQuestions } from "@/data/story-questions";
import LearningQuestion from "./LearningQuestion";
export default function StoryLearning({ episode, onRead }: { episode: number; onRead: () => void }) {
  const [solved, setSolved] = useState<string[]>([]);
  const current = tostikEpisodes[episode];
  return <section className="story-learning" aria-label="Сюжетті түсіну сұрақтары">
    <div className="learning-heading"><BookOpen size={24}/><div><small>КӨР · ОҚЫ · ОЙЛАН</small><h2>Оқиғаны түсіндің бе?</h2></div><span>{solved.length} / {tostikEpisodes.length}</span></div>
    <p>Әр эпизодқа бір сұрақ бар. Қазір: {episode + 1}. {current.title}. Мәтінді оқып, жауабыңды таңда.</p>
    <div className="episode-reading">{current.frames.map((frame, i) => <p key={i}>{frame.text}</p>)}</div>
    <LearningQuestion key={current.id} item={storyQuestions[current.id]} onCorrect={() => setSolved(previous => previous.includes(current.id) ? previous : [...previous, current.id])}/>
    <div className="story-reading-links"><a href="/ertostik/full"><BookOpen size={17}/> Толық ертегіні оқу және тыңдау</a><button className="outline-button" onClick={onRead}><BookOpen size={17}/> Барлық сюжетті оқу</button><a href={tostikSource.url} target="_blank" rel="noreferrer"><ExternalLink size={17}/> Ертегінің түпнұсқа толық мәтіні</a></div>
    <small>Мұндағы мәтін — балаларға бейімделген қысқаша сюжет. Толық ертегі кітапхана сілтемесінде ашылады. Сұрақтар көрсеткіші осы бет ашық тұрғанша сақталады.</small>
  </section>;
}
