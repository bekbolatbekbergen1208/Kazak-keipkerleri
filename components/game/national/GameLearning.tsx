"use client";
import { useState } from "react";
import { BookOpen, Check, ArrowRight } from "lucide-react";
import { gameLearning } from "@/data/game-learning";
import type { NationalKind } from "@/data/national-games";
import LearningQuestion from "../LearningQuestion";
export default function GameLearning({ kind }: { kind: NationalKind }) {
  const lesson = gameLearning[kind];
  const [step, setStep] = useState(0);
  const [solved, setSolved] = useState(false);
  return <section id="game-learning" className="game-learning" aria-label="Ойнап үйрен">
    <div className="learning-heading"><BookOpen size={22}/><div><small>ОЙНАП ҮЙРЕН · 3-СЫНЫП</small><h2>{lesson.skill}</h2></div><span>{step + (solved ? 1 : 0)} / {lesson.questions.length}</span></div>
    <p className="learning-fact">{lesson.fact}</p>
    <LearningQuestion key={step} item={lesson.questions[step]} onCorrect={() => setSolved(true)}/>
    {solved && (step < lesson.questions.length - 1 ? <button className="outline-button" onClick={() => {setStep(step + 1);setSolved(false);}}>Келесі тапсырма <ArrowRight size={16}/></button> : <p className="learning-done"><Check size={18}/> Үш тапсырманы да орындадың! Енді үйренгеніңді ойында қолдан.</p>)}
  </section>;
}
